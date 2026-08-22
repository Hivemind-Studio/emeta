import Link from "next/link";
import { prisma } from "@/lib/db";
import { deletePost } from "./actions";
import { DeletePostForm } from "./DeletePostForm";

export const metadata = { title: "Artikel | PT Emeta Teknologi Indonesia" };

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Artikel</h1>
          <p className="mt-1 text-sm text-graphite">Kelola artikel blog ({posts.length})</p>
        </div>
        <Link href="/admin/blog/new" className="btn-navy px-5 py-2.5 text-sm">
          + Artikel Baru
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-line-soft bg-white">
        {posts.length === 0 ? (
          <p className="p-10 text-center text-graphite">Belum ada artikel.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line-soft bg-paper text-xs font-semibold uppercase tracking-wider text-graphite">
              <tr>
                <th className="px-5 py-3">Judul</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-line-soft last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{p.title}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                        (p.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500")
                      }
                    >
                      {p.published ? "Terbit" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-graphite">
                    {new Date(p.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-3">
                      <Link href={`/admin/blog/${p.id}/edit`} className="text-navy hover:underline">
                        Edit
                      </Link>
                      <DeletePostForm id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}