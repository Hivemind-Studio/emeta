import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = { title: "Dashboard | PT Emeta Teknologi Indonesia" };

export default async function AdminDashboard() {
  const [products, posts] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count(),
  ]);

  const stats = [
    { label: "Produk", value: products, href: "/admin/products" },
    { label: "Artikel", value: posts, href: "/admin/blog" },
  ];

  return (
    <div>
      <h1 className="font-sans text-2xl font-bold text-ink-soft">Dashboard</h1>
      <p className="mt-1 text-sm text-graphite">Kelola konten situs PT Emeta Teknologi Indonesia.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-xl border border-line-soft bg-white p-6 transition-all hover:border-brand hover:shadow-md">
            <p className="text-sm font-medium text-graphite">{s.label}</p>
            <p className="mt-2 font-sans text-4xl font-bold text-ink-soft">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-line-soft bg-white p-6">
        <h2 className="font-sans text-lg font-bold text-ink-soft">Mulai dari mana?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/admin/products" className="rounded-lg border border-line-soft p-4 transition-colors hover:border-brand">
            <p className="font-semibold text-ink-soft">📦 Kelola Produk</p>
            <p className="mt-1 text-sm text-graphite">WrenAI, BarkingDog, AI Amaze, Phison</p>
          </Link>
          <Link href="/admin/blog" className="rounded-lg border border-line-soft p-4 transition-colors hover:border-brand">
            <p className="font-semibold text-ink-soft">✍️ Kelola Artikel</p>
            <p className="mt-1 text-sm text-graphite">Tambah &amp; edit artikel blog</p>
          </Link>
        </div>
      </div>
    </div>
  );
}