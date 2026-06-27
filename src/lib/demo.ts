export const DEMO_PASSWORD = "demo1234";

export function isDemoUser(email: string): boolean {
  return email.endsWith("@demo.com") || email === "demo@moodcast.app";
}
