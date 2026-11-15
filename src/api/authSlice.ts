import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  access: string | null;
  refresh: string | null;
};

const initialState: AuthState = {
  access: null,
  refresh: null,
};

/** The signed-in session. Tokens also live in SecureStore so a reload can restore them. */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<{ access: string; refresh: string }>) {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
    },
    clearTokens(state) {
      state.access = null;
      state.refresh = null;
    },
  },
});

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
