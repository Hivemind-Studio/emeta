/**
 * Minimal inline markdown renderer — shared by the blog post page and the
 * product detail page. Supports ## / ### headings, - or * lists, **bold**,
 * *italic*, and paragraphs (single newlines inside a block become <br>).
 *
 * Content is rendered as React nodes, never as HTML, so stored copy can't
 * inject markup.
 */
function renderInline(text: string, keyPrefix: string) {
  // split on **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

export function ArticleBody({
  content,
  className = "mt-8 space-y-5",
}: {
  content: string;
  /** wrapper spacing — pages differ (blog mt-8, product detail mt-[42px]) */
  className?: string;
}) {
  const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={className}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        // Heading block
        if (lines.length === 1 && lines[0].startsWith("### ")) {
          return (
            <h3 key={bi} className="pt-2 font-sans text-[24px] font-bold leading-[32px] text-ink-soft">
              {renderInline(lines[0].slice(4), `h3-${bi}`)}
            </h3>
          );
        }
        if (lines.length === 1 && lines[0].startsWith("## ")) {
          return (
            <h2 key={bi} className="pt-2 font-sans text-[30px] font-extrabold leading-[40px] text-ink-soft">
              {renderInline(lines[0].slice(3), `h2-${bi}`)}
            </h2>
          );
        }
        // List block
        if (lines.every((l) => l.startsWith("- ") || l.startsWith("* "))) {
          return (
            <ul key={bi} className="list-disc space-y-2 pl-6 font-inter text-lg leading-relaxed text-ink-soft">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^[-*] /, ""), `li-${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        // Paragraph (single newlines inside a block become line breaks)
        return (
          <p key={bi} className="font-inter text-lg leading-relaxed text-ink-soft">
            {lines.map((l, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {renderInline(l, `p-${bi}-${li}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
