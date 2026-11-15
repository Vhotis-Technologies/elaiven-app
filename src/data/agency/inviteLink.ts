/**
 * Where a household opens Elaiven.
 * A live invite response replaces this host with the URL it returns.
 */
const JOIN_BASE = "https://elaiven.app/join";

export function inviteUrl(token: string): string {
  return `${JOIN_BASE}/${token}`;
}
