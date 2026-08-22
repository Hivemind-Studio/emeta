import Link from "next/link";
import { logoutAction } from "../actions";
import { requireAuth } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { Suspense } from "react";
import { AdminToast } from "@/components/admin/Feedback";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line-soft bg-white">
        <div className="max-w-[1200px] mx-auto w-full px-6 md:px-10 flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-sans text-lg font-bold text-ink-soft">
              {settings.brandName}
            </Link>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-graphite hover:text-ink">
              Lihat Situs ↗
            </Link>
            <form action={logoutAction}>
              <button className="text-sm font-medium text-graphite hover:text-red-600">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <nav className="border-b border-line-soft bg-white">
        <div className="max-w-[1200px] mx-auto w-full px-6 md:px-10 flex gap-6 overflow-x-auto py-3 text-sm">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/blog", label: "Artikel" },
            { href: "/admin/products", label: "Produk" },
            { href: "/admin/settings", label: "Pengaturan" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap font-medium text-graphite hover:text-brand">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="max-w-[1200px] mx-auto w-full px-6 md:px-10 py-10">{children}</main>
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </div>
  );
}