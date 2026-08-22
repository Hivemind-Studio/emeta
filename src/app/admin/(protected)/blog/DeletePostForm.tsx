"use client";

import { deletePost } from "./actions";

/** Delete button for the blog list — asks for confirmation before applying. */
export function DeletePostForm({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePost}
      className="inline"
      onSubmit={(e) => {
        if (!window.confirm(`Hapus post "${title}" secara permanen?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="text-red-600 hover:underline">Hapus</button>
    </form>
  );
}
