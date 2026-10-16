/**
 * Minimal, safe Markdown → HTML for blog article bodies (headings, paragraphs, lists, bold,
 * italics, links). Text is HTML-escaped first; only the generated tags are HTML. Sufficient for
 * the article subset used in src/blog.ts — not a general Markdown engine.
 */

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(s: string): string {
  let t = escapeHtml(s);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, url) => `<a href="${url}">${text}</a>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return t;
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`);
    para = [];
  };
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (t === "") { flush(); i++; continue; }
    if (t.startsWith("### ")) { flush(); out.push(`<h3>${inline(t.slice(4))}</h3>`); i++; continue; }
    if (t.startsWith("## ")) { flush(); out.push(`<h2>${inline(t.slice(3))}</h2>`); i++; continue; }
    if (/^- /.test(t)) {
      flush();
      const items: string[] = [];
      while (i < lines.length && /^- /.test(lines[i].trim())) { items.push(`<li>${inline(lines[i].trim().slice(2))}</li>`); i++; }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    if (/^\d+\.\s/.test(t)) {
      flush();
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) { items.push(`<li>${inline(lines[i].trim().replace(/^\d+\.\s/, ""))}</li>`); i++; }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }
    para.push(t);
    i++;
  }
  flush();
  return out.join("\n");
}
