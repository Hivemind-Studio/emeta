import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { isAuthenticated } from "@/lib/auth";

export const metadata = { title: "Admin Login | PT Emeta Teknologi Indonesia" };

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">PT Emeta Teknologi Indonesia</h1>
          <p className="mt-2 text-sm text-graphite">Masuk untuk mengelola situs</p>
        </div>
        <div className="rounded-2xl border border-line-soft bg-white p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}