import Link from "next/link";
import { PostForm } from "../PostForm";
import { createPost } from "../actions";

export const metadata = { title: "Artikel Baru | Everest Electronics" };

export default function NewPostPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/blog" className="link-arrow text-sm">← Kembali</Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Artikel Baru</h1>
      <p className="mt-1 text-sm text-graphite">Buat artikel blog baru.</p>
      <div className="mt-8 rounded-xl border border-line-soft bg-white p-8">
        <PostForm action={createPost} submitLabel="Simpan Artikel" />
      </div>
    </div>
  );
}