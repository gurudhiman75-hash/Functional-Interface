import {
  Fragment,
  type ReactNode,
  useMemo,
} from "react";
import DOMPurify from "dompurify";
import { MathJax } from "better-react-mathjax";
import {
  AlligationDiagram,
  isAlligationDiagramData,
  type AlligationDiagramData,
} from "@/components/math/AlligationDiagram";
import {
  isRatioAdjustmentDiagramData,
  RatioAdjustmentDiagram,
  type RatioAdjustmentDiagramData,
} from "@/components/math/RatioAdjustmentDiagram";
import {
  isTrg002SolutionDiagramData,
  Trg002SolutionDiagram,
  type Trg002SolutionDiagramData,
} from "@/components/math/Trg002SolutionDiagram";
import { cn } from "@/lib/utils";

const STANDALONE_IMAGE_URL =
  /^\s*(https?:\/\/\S+\.(?:png|jpe?g|gif|webp|svg)(?:\?\S*)?)\s*$/i;
const STRUCTURED_DIAGRAM_DIRECTIVE_RE =
  /\[\[(EXAMTREE_ALLIGATION_SVG_V1|EXAMTREE_RATIO_ADJUSTMENT_SVG_V1|EXAMTREE_TRIG_HEIGHTS_SVG_V1):([A-Za-z0-9_-]+)\]\]/g;
const MAX_STRUCTURED_DIRECTIVE_LENGTH = 32_768;

export function safeImgUrl(src: string): string | null {
  try {
    const url = new URL(src.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

type Piece =
  | { kind: "text"; value: string }
  | { kind: "img"; src: string; alt: string }
  | { kind: "html"; value: string }
  | { kind: "alligation"; value: AlligationDiagramData }
  | { kind: "ratio-adjustment"; value: RatioAdjustmentDiagramData }
  | { kind: "trg002-solution"; value: Trg002SolutionDiagramData };

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
        containsGurmukhi(inner) ? inner : _match,
    );
}

function decodeBase64Url(encoded: string): string | null {
  if (!encoded || encoded.length > MAX_STRUCTURED_DIRECTIVE_LENGTH) {
    return null;
  }
  try {
    const base64 = encoded
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    if (typeof globalThis.atob !== "function") return null;
    const binary = globalThis.atob(base64);
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function parseStructuredDiagram(
  directive: string,
  encoded: string,
): Piece | null {
  const decoded = decodeBase64Url(encoded);
  if (!decoded) return null;
  try {
    const value: unknown = JSON.parse(decoded);
    if (
      directive === "EXAMTREE_ALLIGATION_SVG_V1" &&
      isAlligationDiagramData(value)
    ) {
      return { kind: "alligation", value };
    }
    if (
      directive === "EXAMTREE_RATIO_ADJUSTMENT_SVG_V1" &&
      isRatioAdjustmentDiagramData(value)
    ) {
      return { kind: "ratio-adjustment", value };
    }
    if (
      directive === "EXAMTREE_TRIG_HEIGHTS_SVG_V1" &&
      isTrg002SolutionDiagramData(value)
    ) {
      return { kind: "trg002-solution", value };
    }
    return null;
  } catch {
    return null;
  }
}

function splitTextAndStandaloneUrls(text: string): Piece[] {
  const lines = text.split("\n");
  const output: Piece[] = [];
  const buffer: string[] = [];

  const flushText = () => {
    if (buffer.length === 0) return;
    const value = buffer.join("\n");
    if (value.trim()) output.push({ kind: "text", value });
    buffer.length = 0;
  };

  for (const line of lines) {
    const match = line.match(STANDALONE_IMAGE_URL);
    if (!match) {
      buffer.push(line);
      continue;
    }
    flushText();
    const src = safeImgUrl(match[1]);
    if (src) output.push({ kind: "img", src, alt: "" });
  }
  flushText();
  return output;
}

function splitMarkdownImages(raw: string): Piece[] {
  const pattern = /!\[([^\]]*)\]\((https?:[^)\s]+)\)/g;
  const matches = [...raw.matchAll(pattern)];
  if (matches.length === 0) return splitTextAndStandaloneUrls(raw);

  const pieces: Piece[] = [];
  let last = 0;
  for (const match of matches) {
    const index = match.index ?? 0;
    if (index > last) {
      pieces.push(...splitTextAndStandaloneUrls(raw.slice(last, index)));
    }
    const src = safeImgUrl(match[2] ?? "");
    if (src) {
      pieces.push({
        kind: "img",
        src,
        alt: (match[1] ?? "").trim(),
      });
    }
    last = index + (match[0]?.length ?? 0);
  }
  if (last < raw.length) {
    pieces.push(...splitTextAndStandaloneUrls(raw.slice(last)));
  }
  return pieces;
}

function tryHtmlFragment(raw: string): Piece[] | null {
  const trimmed = raw.trim();
  if (!/^<[a-z]/i.test(trimmed)) return null;
  if (!/<\/?[a-z][\s\S]*>/i.test(trimmed)) return null;

  const clean = DOMPurify.sanitize(trimmed, {
    ALLOWED_TAGS: [
      "img",
      "p",
      "br",
      "span",
      "strong",
      "em",
      "sub",
      "sup",
      "div",
      "b",
      "i",
    ],
    ALLOWED_ATTR: [
      "src",
      "alt",
      "class",
      "width",
      "height",
      "loading",
    ],
  });
  return clean.trim() ? [{ kind: "html", value: clean }] : null;
}

function splitStandardPieces(raw: string): Piece[] {
  return tryHtmlFragment(raw) ?? splitMarkdownImages(raw);
}

function splitStructuredDiagramDirectives(raw: string): Piece[] {
  const matches = [...raw.matchAll(STRUCTURED_DIAGRAM_DIRECTIVE_RE)];
  if (matches.length === 0) return splitStandardPieces(raw);

  const pieces: Piece[] = [];
  let last = 0;
  for (const match of matches) {
    const index = match.index ?? 0;
    if (index > last) {
      pieces.push(...splitStandardPieces(raw.slice(last, index)));
    }
    const parsed = parseStructuredDiagram(
      match[1] ?? "",
      match[2] ?? "",
    );
    if (parsed) {
      pieces.push(parsed);
    } else {
      pieces.push(...splitStandardPieces(match[0] ?? ""));
    }
    last = index + (match[0]?.length ?? 0);
  }
  if (last < raw.length) {
    pieces.push(...splitStandardPieces(raw.slice(last)));
  }
  return pieces;
}

function tokenizeMath(raw: string): MathToken[] {
  const tokens: MathToken[] = [];
  const pattern =
    /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  const normalizedRaw = unwrapGurmukhiTextMath(raw);
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
    if (match[1] !== undefined || match[3] !== undefined) {
      tokens.push({
        kind: "display-math",
        value: (match[1] ?? match[3] ?? "").trim(),
      });
    } else {
      tokens.push({
        kind: "inline-math",
        value: (match[2] ?? match[4] ?? "").trim(),
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

function renderTextWithLogicIcons(value: string, keyPrefix: string) {
  const pattern = /\b(Father|Mother|Brother|Sister|Husband|Wife)\b/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    const label = match[0]!;
    if (index > lastIndex) parts.push(value.slice(lastIndex, index));
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
  if (lastIndex < value.length) parts.push(value.slice(lastIndex));
  return parts.length ? parts : value;
}

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
    rows.push(
      lineParts.length === 0 ? (
        <div key={key} className="min-h-[1.25rem]" />
      ) : (
        <div
          key={key}
          className={cn(
            "whitespace-pre-wrap",
            lineUsesPunjabi() && "punjabi-content",
          )}
          lang={lineUsesPunjabi() ? "pa" : undefined}
        >
          {lineParts}
        </div>
      ),
    );
    lineParts = [];
    lineText = "";
    lineIndex += 1;
  };

  const appendText = (text: string, keyPrefix: string) => {
    const segments = text.split("\n");
    segments.forEach((segment, segmentIndex) => {
      if (segmentIndex > 0) flushLine();
      if (!segment) return;
      lineText += segment;
      lineParts.push(
        <Fragment key={`${keyPrefix}-${segmentIndex}`}>
          {renderTextWithLogicIcons(segment, keyPrefix)}
        </Fragment>,
      );
    });
  };

  tokens.forEach((token, tokenIndex) => {
    if (token.kind === "text") {
      appendText(token.value, `text-${blockIndex}-${tokenIndex}`);
      return;
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
      return;
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
  });

  flushLine();
  return rows;
}

/**
 * Renders question, option or explanation text with MathJax, safe images,
 * sanitized basic HTML, logic icons, and versioned ExamTree inline-SVG
 * directives for alligation, ratio adjustment, and TRG-002 solution figures.
 */
export function QuestionRichText({
  content,
  className,
  inline = false,
  lang,
}: {
  content: string | number | null | undefined;
  className?: string;
  inline?: boolean;
  lang?: string;
}) {
  const normalizedContent =
    typeof content === "string"
      ? unwrapGurmukhiTextMath(content)
      : content === null || content === undefined
        ? ""
        : String(content);

  const pieces = useMemo(
    () => splitStructuredDiagramDirectives(normalizedContent),
    [normalizedContent],
  );

  return (
    <div
      className={cn(
        inline ? "space-y-2" : "space-y-3",
        lang === "pa" && "punjabi-content",
        className,
      )}
      lang={lang === "pa" ? "pa" : undefined}
    >
      {pieces.map((piece, index) => {
        if (piece.kind === "alligation") {
          return (
            <AlligationDiagram
              key={index}
              diagram={piece.value}
              className="my-2"
            />
          );
        }
        if (piece.kind === "ratio-adjustment") {
          return (
            <RatioAdjustmentDiagram
              key={index}
              diagram={piece.value}
              className="my-2"
            />
          );
        }
        if (piece.kind === "trg002-solution") {
          return (
            <Trg002SolutionDiagram
              key={index}
              data={piece.value}
              className="my-2"
            />
          );
        }
        if (piece.kind === "img") {
          return (
            <img
              key={index}
              src={piece.src}
              alt={piece.alt || "Question figure"}
              className="max-h-72 max-w-full rounded-lg border border-border bg-muted/30 object-contain shadow-sm"
              loading="lazy"
              decoding="async"
            />
          );
        }
        if (piece.kind === "html") {
          const punjabi = lang === "pa" || containsGurmukhi(piece.value);
          return (
            <MathJax key={index} dynamic hideUntilTypeset="first">
              <div
                className={cn(
                  "math-only prose prose-sm max-w-none text-foreground dark:prose-invert [&_img]:my-3 [&_img]:max-h-72 [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_p]:my-2",
                  punjabi && "punjabi-content",
                )}
                lang={punjabi ? "pa" : undefined}
                dangerouslySetInnerHTML={{ __html: piece.value }}
              />
            </MathJax>
          );
        }
        return (
          <div
            key={index}
            className={cn(
              "break-words text-foreground leading-relaxed",
              lang === "pa" || containsGurmukhi(piece.value)
                ? "whitespace-normal punjabi-text"
                : "whitespace-pre-wrap",
              inline && "text-sm sm:text-base",
            )}
          >
            {renderMathContent(piece.value, index, lang)}
          </div>
        );
      })}
    </div>
  );
}
