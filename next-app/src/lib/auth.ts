import { cookies } from "next/headers";

const COOKIE_NAME = "pv_admin_session";

function secret() {
  return process.env.ADMIN_PASSWORD ?? "petvalley-fallback-secret";
}

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function makeSessionToken(username: string): Promise<string> {
  const sig = await hmac(username);
  return `${username}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [username, sig] = token.split(".");
  if (!username || !sig) return false;
  if (username !== process.env.ADMIN_USERNAME) return false;
  const expected = await hmac(username);
  return sig === expected;
}

export async function getIsAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function setAdminSession() {
  const store = await cookies();
  const token = await makeSessionToken(process.env.ADMIN_USERNAME ?? "admin");
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
