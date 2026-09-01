/**
 * Conversions between the mini-markdown stored in the database and the HTML
 * shown inside the admin's contentEditable editor.
 *
 * The storage format is deliberately unchanged: `## ` / `### ` headings,
 * `- ` lists, `**bold**`, `*italic*`, blank line between blocks — exactly what
 * `components/ArticleBody` renders on the public site. The editor is a view
 * over that text, never a second source of truth, so existing posts keep
 * working and nothing stores raw HTML.
 */

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => HTML_ESCAPES[c]);
}

/** `**bold**` / `*italic*` → tags. Mirrors ArticleBody's renderInline split. */
function inlineToHtml(text: string): string {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`;
      if (part.startsWith("*") && part.endsWith("*")) return `<em>${escapeHtml(part.slice(1, -1))}</em>`;
      return escapeHtml(part);
    })
    .join("");
}

/** Stored markdown → editor HTML. Block rules match ArticleBody exactly. */
export function mdToHtml(md: string): string {
  const blocks = md.replace(/\r\n?/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const html = blocks
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 1 && lines[0].startsWith("### ")) return `<h3>${inlineToHtml(lines[0].slice(4))}</h3>`;
      if (lines.length === 1 && lines[0].startsWith("## ")) return `<h2>${inlineToHtml(lines[0].slice(3))}</h2>`;
      if (lines.every((l) => l.startsWith("- ") || l.startsWith("* "))) {
        return `<ul>${lines.map((l) => `<li>${inlineToHtml(l.replace(/^[-*] /, ""))}</li>`).join("")}</ul>`;
      }
      return `<p>${lines.map(inlineToHtml).join("<br>")}</p>`;
    })
    .join("");
  // contentEditable needs at least one block to place the caret in
  return html || "<p><br></p>";
}

/**
 * Structural subset of DOM Node used by the serializer — real nodes satisfy it,
 * and it keeps this file testable without a DOM implementation.
 */
export interface MdNode {
  nodeType: number;
  nodeName: string;
  textContent: string | null;
  childNodes: ArrayLike<MdNode>;
}

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

function children(node: MdNode): MdNode[] {
  return Array.from({ length: node.childNodes.length }, (_, i) => node.childNodes[i]);
}

/** Inline content of one block → markdown. `<br>` becomes a newline. */
function inlineToMd(node: MdNode): string {
  if (node.nodeType === TEXT_NODE) return node.textContent ?? "";
  if (node.nodeType !== ELEMENT_NODE) return "";

  const tag = node.nodeName.toUpperCase();
  if (tag === "BR") return "\n";

  const inner = children(node).map(inlineToMd).join("");
  // Empty formatting wrappers would otherwise serialise to a bare ** or *
  if (!inner.trim()) return inner;
  if (tag === "STRONG" || tag === "B") return `**${inner}**`;
  if (tag === "EM" || tag === "I") return `*${inner}*`;
  return inner;
}

/** One block element → its markdown line(s), or "" when empty. */
function blockToMd(node: MdNode): string {
  if (node.nodeType === TEXT_NODE) {
    const t = (node.textContent ?? "").trim();
    return t;
  }
  if (node.nodeType !== ELEMENT_NODE) return "";

  const tag = node.nodeName.toUpperCase();

  if (tag === "UL" || tag === "OL") {
    return children(node)
      .filter((li) => li.nodeType === ELEMENT_NODE && li.nodeName.toUpperCase() === "LI")
      .map((li) => inlineToMd(li).replace(/\n+/g, " ").trim())
      .filter(Boolean)
      .map((line) => `- ${line}`)
      .join("\n");
  }

  const inner = inlineToMd(node)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
  if (!inner) return "";

  // h1 collapses to h2: the public renderer only knows ## and ###, and the page
  // already supplies its own <h1>
  if (tag === "H1" || tag === "H2") return `## ${inner}`;
  if (tag === "H3" || tag === "H4" || tag === "H5" || tag === "H6") return `### ${inner}`;
  return inner;
}

/** Editor HTML (as a DOM root) → markdown for storage. */
export function htmlToMd(root: MdNode): string {
  return children(root)
    .map(blockToMd)
    .map((b) => b.trim())
    .filter(Boolean)
    .join("\n\n");
}
