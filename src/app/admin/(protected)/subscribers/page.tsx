import Link from "next/link";
import { getSubscribersPage } from "@/lib/data";

export const metadata = { title: "Subscribers | PT Emeta Teknologi Indonesia" };

const PAGE_SIZE = 25;

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, total, totalPages, page: current } = await getSubscribersPage(page, PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Subscribers</h1>
          <p className="mt-1 text-sm text-graphite">Email dari form "Get in Touch" hero ({total} total)</p>
        </div>
        {total > 0 && (
          <a href="/api/subscribers/export" className="btn-navy px-5 py-2.5 text-sm">
            ⬇ Export CSV
          </a>
        )}
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-line-soft bg-white">
        {items.length === 0 ? (
          <p className="p-10 text-center text-graphite">Belum ada subscriber.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line-soft bg-paper text-xs font-semibold uppercase tracking-wider text-graphite">
              <tr>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3 text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-b border-line-soft last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{s.email}</td>
                  <td className="px-5 py-3 text-graphite">{s.source}</td>
                  <td className="px-5 py-3 text-right text-graphite">
                    {new Date(s.createdAt).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {current > 1 && (
            <Link href={`/admin/subscribers?page=${current - 1}`} className="btn-navy px-4 py-2 text-sm">
              ← Prev
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/admin/subscribers?page=${n}`}
              aria-current={n === current ? "page" : undefined}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                n === current
                  ? "bg-[#1a60d9] text-white"
                  : "border border-line-soft text-graphite hover:border-brand"
              }`}
            >
              {n}
            </Link>
          ))}
          {current < totalPages && (
            <Link href={`/admin/subscribers?page=${current + 1}`} className="btn-navy px-4 py-2 text-sm">
              Selanjutnya →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}