"use client";

import { useCallback, useRef, useState } from "react";
import { mdToHtml, htmlToMd } from "@/lib/richtext";

/**
 * WYSIWYG field for the article/product body.
 *
 * The value submitted with the form is still the mini-markdown the public
 * renderer (components/ArticleBody) reads — the contentEditable surface is a
 * view over it. "Sumber" flips to the raw text, which stays the escape hatch
 * if the editor ever mangles something.
 */
/** Toolbar buttons as plain data — the ref is only touched inside handlers. */
const COMMANDS: { label: string; title: string; command: string; value?: string; className?: string }[] = [
  { label: "H2", title: "Judul", command: "formatBlock", value: "h2", className: "font-bold" },
  { label: "H3", title: "Sub-judul", command: "formatBlock", value: "h3", className: "font-semibold" },
  { label: "P", title: "Paragraf", command: "formatBlock", value: "p" },
  { label: "B", title: "Tebal", command: "bold", className: "font-bold" },
  { label: "I", title: "Miring", command: "italic", className: "italic" },
  { label: "\u2022 Daftar", title: "Daftar poin", command: "insertUnorderedList" },
];

export function RichTextEditor({
  name,
  defaultValue = "",
  minHeight = 260,
}: {
  name: string;
  defaultValue?: string;
  minHeight?: number;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [md, setMd] = useState(defaultValue);
  const [showSource, setShowSource] = useState(false);
  // Seed HTML for the editable surface. React diffs __html by string identity and
  // this only changes when returning from the source view, so typing never
  // re-renders the surface out from under the caret.
  const [seedHtml, setSeedHtml] = useState(() => mdToHtml(defaultValue));

  const sync = useCallback(() => {
    if (editorRef.current) setMd(htmlToMd(editorRef.current));
  }, []);

  /** document.execCommand is deprecated but is still the only cross-browser way
   *  to drive contentEditable; the output is normalised by htmlToMd anyway. */
  const exec = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    sync();
  }, [sync]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-line border-b-0 bg-paper px-2 py-1.5">
        {COMMANDS.map((c) => (
          <button
            key={c.label}
            type="button"
            title={c.title}
            onMouseDown={(e) => e.preventDefault() /* keep the selection */}
            onClick={() => exec(c.command, c.value)}
            className={`min-w-[32px] rounded px-2 py-1 text-sm text-ink hover:bg-brand-soft ${c.className ?? ""}`}
          >
            {c.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            // leaving source view: rebuild the surface from whatever was typed there
            if (showSource) setSeedHtml(mdToHtml(md));
            setShowSource((s) => !s);
          }}
          className="ml-auto rounded px-2 py-1 text-xs font-medium text-graphite hover:bg-brand-soft"
        >
          {showSource ? "Editor" : "Sumber"}
        </button>
      </div>

      {showSource ? (
        <textarea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          style={{ minHeight }}
          className="w-full resize-y rounded-b-lg border border-line bg-white px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-navy"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Isi konten"
          onInput={sync}
          onBlur={sync}
          // seeded during render so the content is in the server HTML, not
          // painted in after hydration
          dangerouslySetInnerHTML={{ __html: seedHtml }}
          onPaste={(e) => {
            // paste as plain text — pasted Word/HTML markup would only be thrown
            // away by htmlToMd, and can drag styling into the surface meanwhile
            e.preventDefault();
            const t = e.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, t);
            sync();
          }}
          style={{ minHeight }}
          className="w-full space-y-3 overflow-y-auto rounded-b-lg border border-line bg-white px-4 py-3 outline-none focus:border-navy
            [&_h2]:text-[22px] [&_h2]:font-extrabold [&_h2]:text-ink-soft
            [&_h3]:text-[18px] [&_h3]:font-bold [&_h3]:text-ink-soft
            [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6
            [&_p]:leading-relaxed [&_strong]:font-bold [&_em]:italic"
        />
      )}

      {/* what the server action actually receives */}
      <input type="hidden" name={name} value={md} />
    </div>
  );
}
