/**
 * Product tag pills — shared by the home Offerings cards and the
 * product detail page (Figma 41:2475 tags row: r20, h23, #8bbffc bg,
 * PJS 700 12px, #fafafa text).
 */
export function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex h-[23px] items-center justify-center rounded-full bg-brand-light px-3 text-[12px] font-bold leading-none text-paper">
      {children}
    </span>
  );
}

export function ProductTags({ tags, className = "" }: { tags: string; className?: string }) {
  const list = tags.split(",").map((t) => t.trim()).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {list.map((t, i) => (
        <Tag key={`${t}-${i}`}>{t}</Tag>
      ))}
    </div>
  );
}
