import {
  Fragment,
  type ReactNode,
  useMemo,
} from "react";
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
type MathToken =
  | { kind: "text"; value: string }
  | { kind: "inline-math"; value: string }
  | { kind: "display-math"; value: string };

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;

function containsGurmukhi(value: string) {
  return GURMUKHI_RE.test(value);
}

function unwrapGurmukhiTextMath(value: string) {
  return value
    .normalize("NFC")
    .replace(
      /\$\\text\{([^}]*)\}\$/g,
      (_match, inner: string) =>
        containsGurmukhi(inner)
          ? inner
          : _match,
    );
}

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

function tokenizeMath(raw: string): MathToken[] {
  const tokens: MathToken[] = [];
  const pattern =
    /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  const normalizedRaw =
    unwrapGurmukhiTextMath(raw);
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(normalizedRaw)) !== null) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      tokens.push({
        kind: "text",
        value: normalizedRaw.slice(lastIndex, matchIndex),
      });
    }

    if (
      match[1] !== undefined ||
      match[3] !== undefined
    ) {
      tokens.push({
        kind: "display-math",
        value: (
          match[1] ?? match[3] ?? ""
        ).trim(),
      });
    } else if (
      match[2] !== undefined ||
      match[4] !== undefined
    ) {
      tokens.push({
        kind: "inline-math",
        value: (
          match[2] ?? match[4] ?? ""
        ).trim(),
      });
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < normalizedRaw.length) {
    tokens.push({
      kind: "text",
      value: normalizedRaw.slice(lastIndex),
    });
  }

  return tokens;
}

const LOGIC_ICON_MAP: Record<string, string> = {
  Father: "♂",
  Mother: "♀",
  Brother: "♂",
  Sister: "♀",
  Husband: "♂",
  Wife: "♀",
};

function renderTextWithLogicIcons(
  value: string,
  keyPrefix: string,
) {
  const pattern =
    /\b(Father|Mother|Brother|Sister|Husband|Wife)\b/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    const label = match[0]!;

    if (index > lastIndex) {
      parts.push(
        value.slice(lastIndex, index),
      );
    }

    parts.push(
      <span
        key={`${keyPrefix}-${index}`}
        className="mx-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full border border-slate-300 bg-slate-50 px-1 text-[10px] font-semibold text-slate-700 align-middle"
        title={label}
        aria-label={label}
      >
        {LOGIC_ICON_MAP[label]}
      </span>,
    );
    parts.push(label);
    lastIndex = index + label.length;
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts.length ? parts : value;
}

/**
 * Tokenize math on the full string first so display blocks may span lines:
 *   \[
 *   N=10\times 3+5
 *   \]
 * Splitting on "\n" before tokenizing breaks those blocks (Quant V2 explanations).
 */
function renderMathContent(
  content: string,
  blockIndex: number,
  lang?: string,
) {
  const tokens = tokenizeMath(content);
  if (tokens.length === 0) {
    return [
      <div
        key={`${blockIndex}-line-0`}
        className="min-h-[1.25rem]"
      />,
    ];
  }

  const rows: ReactNode[] = [];
  let lineParts: ReactNode[] = [];
  let lineIndex = 0;
  let lineText = "";

  const lineUsesPunjabi = () =>
    lang === "pa" || containsGurmukhi(lineText);

  const flushLine = () => {
    const key = `${blockIndex}-line-${lineIndex}`;
    if (lineParts.length === 0) {
      rows.push(
        <div key={key} className="min-h-[1.25rem]" />,
      );
    } else {
      rows.push(
        <div
          key={key}
          className={cn(
            "whitespace-pre-wrap",
            lineUsesPunjabi() && "punjabi-content",
          )}
          lang={lineUsesPunjabi() ? "pa" : undefined}
        >
          {lineParts}
        </div>,
      );
    }
    lineParts = [];
    lineText = "";
    lineIndex += 1;
  };

  const appendText = (text: string, keyPrefix: string) => {
    const segments = text.split("\n");
    for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
      if (segmentIndex > 0) {
        flushLine();
      }
      const segment = segments[segmentIndex] ?? "";
      if (!segment) {
        continue;
      }
      lineText += segment;
      lineParts.push(
        <Fragment key={`${keyPrefix}-${segmentIndex}`}>
          {renderTextWithLogicIcons(segment, keyPrefix)}
        </Fragment>,
      );
    }
  };

  let tokenIndex = 0;
  for (const token of tokens) {
    if (token.kind === "text") {
      appendText(token.value, `text-${blockIndex}-${tokenIndex}`);
      tokenIndex += 1;
      continue;
    }

    if (token.kind === "display-math") {
      flushLine();
      rows.push(
        <MathJax
          key={`${blockIndex}-display-${tokenIndex}`}
          className="my-2 block overflow-x-auto"
          dynamic
        >
          {`\\[${token.value}\\]`}
        </MathJax>,
      );
      tokenIndex += 1;
      continue;
    }

    lineText += token.value;
    lineParts.push(
      <MathJax
        key={`${blockIndex}-inline-${tokenIndex}`}
        inline
        dynamic
      >
        {`\\(${token.value}\\)`}
      </MathJax>,
    );
    tokenIndex += 1;
  }

  flushLine();
  return rows;
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
  lang,
}: {
  content: string | number | null | undefined;
  className?: string;
  /** Slightly tighter spacing when used inside option rows */
  inline?: boolean;
  /** Language of the content — used to apply correct font/whitespace for Gurmukhi */
  lang?: string;
}) {
  const normalizedContent =
    typeof content === "string"
      ? unwrapGurmukhiTextMath(content)
      : content === null ||
          content === undefined
        ? ""
        : String(content);

  const pieces = useMemo(() => {
    const html =
      tryHtmlFragment(normalizedContent);
    if (html) return html;
    return splitMarkdownImages(
      normalizedContent,
    );
  }, [normalizedContent]);

  return (
    <div
      className={cn(
        inline ? "space-y-2" : "space-y-3",
        lang === "pa" && "punjabi-content",
        className,
      )}
      lang={lang === "pa" ? "pa" : undefined}
    >
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
          if (
            lang === "pa" ||
            containsGurmukhi(p.value)
          ) {
            return (
              <MathJax key={i} dynamic hideUntilTypeset="first">
                <div
                  className="math-only prose prose-sm max-w-none punjabi-content text-foreground dark:prose-invert [&_img]:my-3 [&_img]:max-h-72 [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_p]:my-2"
                  lang="pa"
                  dangerouslySetInnerHTML={{ __html: p.value }}
                />
              </MathJax>
            );
          }

          return (
            <MathJax key={i} dynamic hideUntilTypeset="first">
              <div
                className="math-only prose prose-sm max-w-none text-foreground dark:prose-invert [&_img]:my-3 [&_img]:max-h-72 [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_p]:my-2"
                dangerouslySetInnerHTML={{ __html: p.value }}
              />
            </MathJax>
          );
        }
        return (
          <div
            key={i}
            className={cn(
              "break-words text-foreground leading-relaxed",
              lang === "pa" ||
                containsGurmukhi(p.value)
                ? "whitespace-normal punjabi-text"
                : "whitespace-pre-wrap",
              inline && "text-sm sm:text-base",
            )}
          >
            {renderMathContent(p.value, i, lang)}
          </div>
        );
      })}
    </div>
  );
}
