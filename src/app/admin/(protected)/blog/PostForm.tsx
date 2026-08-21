"use client";

import type { BlogPost } from "@/generated/prisma/client";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function PostForm({
  action,
  post,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  post?: BlogPost | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-6">
        <Field label="Judul" htmlFor="title">
          <input
            id="title"
            name="title"
            required
            defaultValue={post?.title}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-navy"
          />
        </Field>

        <ImageUploader name="imageUrl" label="Gambar Artikel" defaultValue={post?.imageUrl} />

        <Field label="Ringkasan (excerpt)" htmlFor="excerpt">
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            defaultValue={post?.excerpt}
            className="w-full resize-y rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-navy"
          />
        </Field>

        <Field label="Isi Artikel" htmlFor="content">
          <textarea
            id="content"
            name="content"
            rows={12}
            defaultValue={post?.content}
            className="w-full resize-y rounded-lg border border-line bg-white px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-navy"
          />
        </Field>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-ink">
        <input type="checkbox" name="published" defaultChecked={post ? post.published : true} className="h-4 w-4 rounded border-line" />
        Terbitkan
      </label>
      <label className="flex items-center gap-3 text-sm font-medium text-ink">
        <input type="checkbox" name="featured" defaultChecked={post ? post.featured : false} className="h-4 w-4 rounded border-line" />
        Featured (tampil di hero blog)
      </label>

      <button type="submit" className="btn-navy px-6 py-3 text-sm">
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}