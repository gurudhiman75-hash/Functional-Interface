/**
 * Presentation-only normalization applied to every Question Studio batch.
 *
 * Only rewrites that cannot change meaning belong here. Content defects are
 * fixed at their source chapter.
 *
 * - `\%` outside math delimiters becomes `%`. Solver answers are often
 *   rendered from LaTeX (`35\%`) while distractors are plain (`34%`), which
 *   made the correct option visibly different from the others.
 * - A value that is only `$$\text{…}$$` becomes its plain text, so a
 *   correct option is not the one option typeset as math.
 * - LaTeX commands outside math delimiters (`\frac{6}{6+\sqrt{3}}`) are
 *   wrapped in `$…$`. The client only typesets delimited math, so these
 *   otherwise reach the learner as raw source.
 */

const MATH_SEGMENT = /\$\$[\s\S]*?\$\$|\$[^$\n]*\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g;

const LATEX_COMMAND = /\\(?:frac|dfrac|sqrt|times|div|cdot|pi|theta|alpha|beta|left|right|le|ge|ne|pm)(?![A-Za-z])/;
const PLAIN_MATH_TOKEN = /^[0-9.+\-−=×÷*/^()<>]+$/;
const TRAILING_PUNCTUATION = /[.,;:?।]+$/u;

function isMathToken(token: string): boolean {
  const core = token.replace(TRAILING_PUNCTUATION, "");
  return core.length > 0 && (LATEX_COMMAND.test(core) || PLAIN_MATH_TOKEN.test(core));
}

/** Wraps each run of space-separated math tokens that contains a LaTeX command in `$…$`. */
function wrapBareLatex(text: string): string {
  if (!LATEX_COMMAND.test(text)) return text;
  const parts = text.split(/(\s+)/); // even indexes are words, odd are separators
  const out: string[] = [];
  let i = 0;
  while (i < parts.length) {
    if (i % 2 === 1 || !isMathToken(parts[i])) { out.push(parts[i]); i += 1; continue; }
    let end = i;
    // Extend across single-line separators while the next word is math and the current one has no trailing punctuation.
    while (
      !TRAILING_PUNCTUATION.test(parts[end]) &&
      end + 2 < parts.length && !parts[end + 1].includes("\n") && isMathToken(parts[end + 2])
    ) end += 2;
    const run = parts.slice(i, end + 1).join("");
    if (!LATEX_COMMAND.test(run)) { out.push(run); i = end + 1; continue; }
    const trailing = run.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    out.push(`$${trailing ? run.slice(0, -trailing.length) : run}$${trailing}`);
    i = end + 1;
  }
  return out.join("");
}

function outsideMath(value: string, transform: (text: string) => string): string {
  let out = "";
  let last = 0;
  for (const match of value.matchAll(MATH_SEGMENT)) {
    out += transform(value.slice(last, match.index));
    out += match[0];
    last = (match.index ?? 0) + match[0].length;
  }
  return out + transform(value.slice(last));
}

// `$$\text{Group D}$$` carries no math; render it as the plain words it holds.
const TEXT_ONLY_MATH = /^\s*\$\$?\s*\\(?:text|mathrm)\{([^{}$\\]*)\}\s*\$?\$\s*$/;

export function normalizeQuestionStudioText(value: string): string {
  const textOnly = value.match(TEXT_ONLY_MATH);
  if (textOnly) return textOnly[1]!.trim();
  let next = value;
  if (LATEX_COMMAND.test(next)) next = outsideMath(next, wrapBareLatex);
  if (!next.includes("\\%")) return next;
  value = next;
  let out = "";
  let last = 0;
  for (const match of value.matchAll(MATH_SEGMENT)) {
    out += value.slice(last, match.index).replace(/\\%/g, "%");
    out += match[0];
    last = (match.index ?? 0) + match[0].length;
  }
  return out + value.slice(last).replace(/\\%/g, "%");
}

function normalizeOption(option: unknown): unknown {
  if (typeof option === "string") return normalizeQuestionStudioText(option);
  if (option && typeof option === "object" && typeof (option as { text?: unknown }).text === "string") {
    return { ...(option as object), text: normalizeQuestionStudioText((option as { text: string }).text) };
  }
  return option;
}

export function normalizeQuestionStudioQuestion<T>(question: T): T {
  if (!question || typeof question !== "object") return question;
  const q = question as Record<string, unknown>;
  const next: Record<string, unknown> = { ...q };
  for (const key of ["text", "stem", "questionText", "answer"] as const) {
    if (typeof q[key] === "string") next[key] = normalizeQuestionStudioText(q[key] as string);
  }
  if (Array.isArray(q.options)) next.options = q.options.map(normalizeOption);
  return next as T;
}

/** Normalizes `questions` and `questionPackages` arrays on a batch result, leaving everything else untouched. */
export function normalizeQuestionStudioBatch<T>(result: T): T {
  if (!result || typeof result !== "object") return result;
  const r = result as Record<string, unknown>;
  const next: Record<string, unknown> = { ...r };
  if (Array.isArray(r.questions)) next.questions = r.questions.map(normalizeQuestionStudioQuestion);
  if (Array.isArray(r.questionPackages)) {
    next.questionPackages = r.questionPackages === r.questions ? next.questions : r.questionPackages.map(normalizeQuestionStudioQuestion);
  }
  return next as T;
}
