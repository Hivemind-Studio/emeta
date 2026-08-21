import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PostForm } from "../../PostForm";
import { updatePost } from "../../actions";

export const metadata = { title: "Edit Artikel | Everest Electronics" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/blog" className="link-arrow text-sm">← Kembali</Link>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Edit Artikel</h1>
      <p className="mt-1 text-sm text-graphite">Perbarui artikel blog.</p>
      <div className="mt-8 rounded-xl border border-line-soft bg-white p-8">
        <PostForm action={updatePost} post={post} submitLabel="Perbarui" />
      </div>
    </div>
  );
}