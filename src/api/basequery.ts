/**
 * Axios base query for RTK Query.
 * Attaches the bearer token, uploads FormData with fetch on native,
 * and refreshes the access token once when the API answers 401.
 */
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";
import { clearTokens, setTokens } from "@/api/authSlice";

const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ??
  (process.env.EXPO_OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000")
).replace(/\/$/, "");

/** Paths that answer 401 because the credentials were wrong, not because the session expired. */
const PUBLIC_ENDPOINTS = [
  "/api/v1/accounts/login/",
  "/api/v1/accounts/refresh/",
  "/health/",
];

const REFRESH_PATH = "/api/v1/accounts/refresh/";

export type ApiRequest = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: Record<string, string>;
};

type QueryError = {
  status?: number;
  data: unknown;
};

type QueryResult = { data: unknown } | { error: QueryError };

type TokenPair = {
  access?: string;
  refresh?: string;
};

type QueryApi = {
  getState: () => unknown;
  dispatch: (action: unknown) => unknown;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

let refreshInFlight: Promise<string | null> | null = null;

function isFormData(data: unknown): data is FormData {
  return (
    data instanceof FormData ||
    (typeof data === "object" &&
      data !== null &&
      ("_parts" in data || data.constructor?.name === "FormData"))
  );
}

function readAuth(api: QueryApi): { access: string | null; refresh: string | null } {
  const state = api.getState() as {
    auth?: { access: string | null; refresh: string | null };
  };
  return {
    access: state.auth?.access ?? null,
    refresh: state.auth?.refresh ?? null,
  };
}

async function readStored(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function writeStored(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    // Web has no secure store. The token still lives in the Redux session.
  }
}

async function deleteStored(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // The store clear below is what the next request will see.
  }
}

async function clearSession(api: QueryApi): Promise<void> {
  await deleteStored("access");
  await deleteStored("refresh");
  api.dispatch(clearTokens());
}

async function refreshOnce(api: QueryApi): Promise<string | null> {
  const storedRefresh = readAuth(api).refresh || (await readStored("refresh"));
  if (!storedRefresh) {
    await clearSession(api);
    return null;
  }

  try {
    const response = await axiosInstance.post<TokenPair>(REFRESH_PATH, {
      refresh: storedRefresh,
    });
    const access = response.data.access;
    const refresh = response.data.refresh ?? storedRefresh;
    if (!access) {
      await clearSession(api);
      return null;
    }
    await writeStored("access", access);
    await writeStored("refresh", refresh);
    api.dispatch(setTokens({ access, refresh }));
    return access;
  } catch {
    await clearSession(api);
    return null;
  }
}

/** Parallel 401s share one refresh, then each retries with the new access token. */
function refreshAccess(api: QueryApi): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = refreshOnce(api).finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function queryString(params: AxiosRequestConfig["params"]): string {
  if (!params || typeof params !== "object") return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value === undefined || value === null) continue;
    search.append(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

async function readFetchBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function sendWithFetch(
  args: ApiRequest,
  access: string | null,
): Promise<QueryResult> {
  const headers: Record<string, string> = {};
  if (access) headers.Authorization = `Bearer ${access}`;

  const response = await fetch(`${API_URL}${args.url}${queryString(args.params)}`, {
    method: args.method ?? "GET",
    headers,
    body: args.data as FormData,
  });
  const body = await readFetchBody(response);
  if (!response.ok) return { error: { status: response.status, data: body } };
  return { data: body };
}

async function sendWithAxios(
  args: ApiRequest,
  access: string | null,
): Promise<QueryResult> {
  const headers: Record<string, string> = { ...args.headers };
  if (access) headers.Authorization = `Bearer ${access}`;
  if (args.data && typeof args.data === "object" && !isFormData(args.data) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config: AxiosRequestConfig = {
    url: args.url,
    method: args.method,
    data: args.data,
    params: args.params,
    headers,
  };
  const response: AxiosResponse = await axiosInstance(config);
  return { data: response.data };
}

async function send(args: ApiRequest, access: string | null): Promise<QueryResult> {
  const nativeUpload = isFormData(args.data) && process.env.EXPO_OS !== "web";
  if (nativeUpload) return sendWithFetch(args, access);
  try {
    return await sendWithAxios(args, access);
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data ?? axiosError.message,
      },
    };
  }
}

/**
 * RTK Query base query for the Elaiven API.
 * Pass `{ url, method, data, params }` from a `createApi` endpoint.
 */
export const axiosBaseQuery = (): BaseQueryFn<ApiRequest, unknown, QueryError> => {
  return async (args, api) => {
    const queryApi = api as QueryApi;
    const access = readAuth(queryApi).access || (await readStored("access"));
    const authed = PUBLIC_ENDPOINTS.includes(args.url) ? null : access;
    const result = await send(args, authed);

    const expired = "error" in result && result.error.status === 401 && !PUBLIC_ENDPOINTS.includes(args.url);
    if (!expired) return result;

    const renewed = await refreshAccess(queryApi);
    if (!renewed) {
      return { error: { status: 401, data: "Authentication failed" } };
    }
    return send(args, renewed);
  };
};

export default axiosBaseQuery;
