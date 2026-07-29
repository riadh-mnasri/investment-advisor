"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, getAppPassword } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = formData.get("password");

  if (password !== getAppPassword()) {
    redirect("/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, getAppPassword(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
