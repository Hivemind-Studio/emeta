"use client";

import type { BlogPost } from "@/generated/prisma/client";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";

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

        {post && (
          <Field label="Slug URL (ubah hanya jika perlu — URL lama otomatis dialihkan)" htmlFor="slug">
            <input
              id="slug"
              name="slug"
              defaultValue={post?.slug}
              placeholder={post?.slug}
              className="w-full rounded-lg border border-line bg-white px-4 py-3 font-mono text-sm outline-none focus:border-navy"
            />
          </Field>
        )}

        <Field label="Tags (koma-pisah, pilar konten: Product Update / AI &amp; Analytics / Customer Story / Company News / Market Insight)" htmlFor="tags">
          <input
            id="tags"
            name="tags"
            defaultValue={post?.tags ?? ""}
            placeholder="Product Update, AI & Analytics"
            className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-navy"
          />
        </Field>

        <ImageUploader name="imageUrl" label="Gambar Artikel (upload atau tempel URL)" defaultValue={post?.imageUrl} />

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

      <ConfirmSubmit
        label={submitLabel}
        confirmLabel={submitLabel}
        pendingLabel="Menyimpan…"
        checkText={post ? "Saya yakin memperbarui artikel ini" : "Saya yakin membuat artikel ini"}
        confirmDialog={post ? "Simpan perubahan artikel?" : "Buat artikel ini?"}
      />
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
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
