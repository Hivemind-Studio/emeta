import { prisma } from "@/lib/db";
import { Updater } from "./form";
import { ProductCreateForm } from "./create-form";

export const metadata = { title: "Produk | PT Emeta Teknologi Indonesia" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-ink-soft">Produk</h1>
          <p className="mt-1 text-sm text-graphite">Kelola produk &amp; solusi ({products.length})</p>
        </div>
      </div>

      {/* Create form */}
      <div className="mt-6 rounded-xl border border-line-soft bg-white p-6">
        <h2 className="font-sans text-lg font-bold text-ink-soft">Tambah Produk</h2>
        <ProductCreateForm />
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {products.length === 0 && <p className="p-6 text-center text-graphite">Belum ada produk.</p>}
        {products.map((p) => (
          <Updater key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
