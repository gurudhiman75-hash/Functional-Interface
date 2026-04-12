import { useMemo } from "react";
import DOMPurify from "dompurify";
import { MathJax } from "better-react-mathjax";
import { cn } from "@/lib/utils";

const STANDALONE_IMAGE_URL = /^\s*(https?:\/\/\S+\.(?:png|jpe?g|gif|webp|svg)(?:\?\S*)?)\s*$/i;

export function safeImgUrl(src: string): string | null {
  try {
    const u = new URL(src.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.href;
  } catch {
    return null;
  }
}

type Piece = { kind: "text"; value: string } | { kind: "img"; src: string; alt: string } | { kind: "html"; value: string };

function splitTextAndStandaloneUrls(text: string): Piece[] {
  const lines = text.split("\n");
  const out: Piece[] = [];
  const buf: string[] = [];

  const flushText = () => {
    if (buf.length) {
      const v = buf.join("\n");
      if (v.trim()) out.push({ kind: "text", value: v });
      buf.length = 0;
    }
  };

  for (const line of lines) {
    const m = line.match(STANDALONE_IMAGE_URL);
    if (m) {
      flushText();
      const src = safeImgUrl(m[1]);
      if (src) out.push({ kind: "img", src, alt: "" });
    } else {
      buf.push(line);
    }
  }
  flushText();
  return out;
}

function splitMarkdownImages(raw: string): Piece[] {
  const re = /!\[([^\]]*)\]\((https?:[^)\s]+)\)/g;
  const matches = [...raw.matchAll(re)];
  if (matches.length === 0) {
    return splitTextAndStandaloneUrls(raw);
  }

  const pieces: Piece[] = [];
  let last = 0;
  for (const m of matches) {
    const idx = m.index ?? 0;
    if (idx > last) {
      pieces.push(...splitTextAndStandaloneUrls(raw.slice(last, idx)));
    }
    const src = safeImgUrl(m[2] ?? "");
    if (src) pieces.push({ kind: "img", src, alt: (m[1] ?? "").trim() });
    last = idx + (m[0]?.length ?? 0);
  }
  if (last < raw.length) {
    pieces.push(...splitTextAndStandaloneUrls(raw.slice(last)));
  }
  return pieces;
}

function tryHtmlFragment(raw: string): Piece[] | null {
  const t = raw.trim();
  if (!/^<[a-z]/i.test(t)) return null;
  if (!/<\/?[a-z][\s\S]*>/i.test(t)) return null;

  const clean = DOMPurify.sanitize(t, {
    ALLOWED_TAGS: ["img", "p", "br", "span", "strong", "em", "sub", "sup", "div", "b", "i"],
    ALLOWED_ATTR: ["src", "alt", "class", "width", "height", "loading"],
  });
  if (!clean.trim()) return null;
  return [{ kind: "html", value: clean }];
}

/**
 * Renders question or option text with:
 * - TeX via `$...$`, `$$...$$`, `\(...\)`, `\[...\]` (MathJax)
 * - Markdown images `![alt](https://...)`
 * - A line that is only a direct image URL (https://...png|jpg|...)
 * - Optional HTML fragment starting with `<` (sanitized; img and basic formatting only)
 */
export function QuestionRichText({
  content,
  className,
  inline = false,
}: {
  content: string;
  className?: string;
  /** Slightly tighter spacing when used inside option rows */
  inline?: boolean;
}) {
  const pieces = useMemo(() => {
    const html = tryHtmlFragment(content);
    if (html) return html;
    return splitMarkdownImages(content);
  }, [content]);

  return (
    <div className={cn(inline ? "space-y-2" : "space-y-3", className)}>
      {pieces.map((p, i) => {
        if (p.kind === "img") {
          return (
            <img
              key={i}
              src={p.src}
              alt={p.alt || "Question figure"}
              className="max-h-72 max-w-full rounded-lg border border-border bg-muted/30 object-contain shadow-sm"
              loading="lazy"
              decoding="async"
            />
          );
        }
        if (p.kind === "html") {
          return (
            <MathJax key={i} dynamic hideUntilTypeset="first">
              <div
                className="prose prose-sm max-w-none text-foreground dark:prose-invert [&_img]:my-3 [&_img]:max-h-72 [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_p]:my-2"
                dangerouslySetInnerHTML={{ __html: p.value }}
              />
            </MathJax>
          );
        }
        return (
          <MathJax key={i} dynamic hideUntilTypeset="first">
            <div
              className={cn(
                "whitespace-pre-wrap break-words text-foreground leading-relaxed",
                inline && "text-sm sm:text-base",
              )}
            >
              {p.value}
            </div>
          </MathJax>
        );
      })}
    </div>
  );
}
