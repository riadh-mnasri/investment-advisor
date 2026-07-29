export const SESSION_COOKIE = "ria_session";

export function getAppPassword(): string {
  return process.env.APP_PASSWORD ?? "Invest2026!";
}
