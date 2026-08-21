import { prisma } from "@/lib/db";
import { createProduct } from "./actions";
import { Updater, DeleteButton } from "./form";

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
        <form action={createProduct} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field name="title" label="Judul" placeholder="WrenAI" />
          <Field name="tags" label="Tags (koma-pisah)" placeholder="Data, AI, For Business" />
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-ink-soft">Deskripsi</label>
            <textarea name="description" rows={3} placeholder="Deskripsi produk..."
              className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-brand" />
          </div>
          <Field name="iconUrl" label="Icon URL (key CDN, opsional)" placeholder="" />
          <Field name="sortOrder" label="Urutan (0,1,2...)" placeholder="0" />
          <div className="sm:col-span-2">
            <button className="btn-brand px-6 py-3 text-sm">Simpan Produk</button>
          </div>
        </form>
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

function Field({ name, label, placeholder, defaultValue }: { name: string; label: string; placeholder?: string; defaultValue?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-ink-soft">{label}</label>
      <input id={name} name={name} placeholder={placeholder} defaultValue={defaultValue}
        className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-brand" />
    </div>
  );
}
