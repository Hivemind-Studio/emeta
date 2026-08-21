"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";

export async function loginAction(prevState: { error?: string }, formData: FormData) {
  const password = String(formData.get("password") || "");
  const ok = await verifyCredentials(password);
  if (!ok) {
    return { error: "Password salah. Coba lagi." };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}