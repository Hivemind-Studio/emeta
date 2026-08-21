export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "") // allow underscores, treat as separators below
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}