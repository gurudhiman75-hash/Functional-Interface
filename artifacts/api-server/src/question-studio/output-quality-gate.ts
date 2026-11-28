/**
 * Mechanical exam-grade checks on generated Question Studio items.
 *
 * Every rule here catches a defect a learner would see and that a human
 * reviewer should never have to spot: leaked placeholders, solver traces,
 * wrong-script or doubled words, undelimited LaTeX, options that don't fit the
 * stem, or a correct option formatted differently from its distractors.
 *
 * These are critical-only. Phrasing and naturalness still need native review.
 */

export type QuestionStudioGateLanguage = "en" | "hi" | "pa";

export type QuestionStudioGateCode =
  | "EMPTY_STEM"
  | "PLACEHOLDER"
  | "SOLVER_TRACE_LEAK"
  | "RAW_LATEX_OUTSIDE_MATH"
  | "DUPLICATE_OPTIONS"
  | "CORRECT_OPTION_FORMAT_TELL"
  | "OPTIONS_DONT_MATCH_STEM"
  | "DUPLICATED_RELATION_LIST"
  | "NO_NATIVE_SCRIPT"
  | "DEVANAGARI_IN_PUNJABI"
  | "GURMUKHI_IN_HINDI"
  | "OTHER_INDIC_SCRIPT"
  | "DUPLICATED_TOKEN"
  | "MIXED_SCRIPT_WORD";

export interface QuestionStudioGateInput {
  readonly packageId: string;
  readonly language: QuestionStudioGateLanguage;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex?: number | null;
}

export interface QuestionStudioGateFinding {
  readonly code: QuestionStudioGateCode;
  readonly evidence: string;
}

const MATH_SEGMENT = /\$\$[\s\S]*?\$\$|\$[^$\n]*\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g;
const RENDER_TOKEN = /\[\[EXAMTREE_[A-Z0-9_]+(?::[^\]]*)?\]\]|<svg[\s\S]*?<\/svg>|data:image\/[^\s"')]+/gi;

const stripMath = (value: string) => value.replace(MATH_SEGMENT, "§");
const stripRender = (value: string) => value.replace(RENDER_TOKEN, " ");
const isVisualItem = (value: string) => /<svg|\[\[EXAMTREE|data:image/i.test(value);

const PLACEHOLDER = /\[\[(?!EXAMTREE_)[^\]]*\]\]|\{\{[^}]*\}\}|\bundefined\b|\bNaN\b|\[object Object\]|MISSING_[A-Z_]+|\bTODO\b|\bnull\b(?! hypothesis)/;
const SOLVER_TRACE = /\b(?:LISTENER|SPEAKER|POINTED_PERSON)\s*=|\w\s*->\s*\S|same resolved person/;
const LATEX_OUTSIDE = /\\(?:[a-zA-Z]+|%|\{|\})/;
const RELATION_OPTION = /^\s*[xX]\s*[<>=≥≤]\s*[yY]\s*$/;
const DEVANAGARI_LETTER = /[ऀ-ॣ०-ॿ]/u;
const GURMUKHI = /[਀-੿]/u;
const OTHER_INDIC = /\S*[઀-૿ঀ-৿଀-௿ఀ-౿]\S*/u;
// Same word written twice with no space: "टैबटैब". Exact-reduplication kinship words are exempt.
const DOUBLED_WORD = /(?<=^|\s)([ऀ-੿]{3,})\1(?=[\s,।?]|$)/u;
const DOUBLED_WORD_ALLOWED = /^(?:नाना|मामा|दादा|चाचा|काका|ਨਾਨਾ|ਮਾਮਾ|ਦਾਦਾ|ਚਾਚਾ)$/u;
const MIXED_SCRIPT = /\S*(?:[a-z]{2,}[ऀ-ॣ०-ॿ਀-੣੦-੿]+|[ऀ-ॣ०-ॿ਀-੣੦-੿]+[a-z]{2,})\S*/u;
const DEVANAGARI_GURMUKHI_IN_WORD = /\S*(?:[਀-੿][ऀ-ॣ०-ॿ]|[ऀ-ॣ०-ॿ][਀-੿])\S*/u;
// Items that legitimately teach or name the other script.
const NAMES_OTHER_SCRIPT = /गुरमुखी|पंजाबी|ਦੇਵਨਾਗਰੀ|ਹਿੰਦੀ/u;

export function inspectQuestionStudioOutput(input: QuestionStudioGateInput): QuestionStudioGateFinding[] {
  const findings: QuestionStudioGateFinding[] = [];
  const add = (code: QuestionStudioGateCode, evidence = "") => findings.push({ code, evidence: evidence.slice(0, 80) });

  const raw = input.stem ?? "";
  const text = stripRender(raw);
  const prose = stripMath(text);
  const options = input.options.map((option) => String(option ?? ""));
  const all = [text, ...options].join(" \n ");
  const visual = isVisualItem(raw) || options.some(isVisualItem);

  if (!raw.trim()) add("EMPTY_STEM");
  const placeholder = all.match(PLACEHOLDER);
  if (placeholder) add("PLACEHOLDER", placeholder[0]);
  const trace = text.match(SOLVER_TRACE);
  if (trace) add("SOLVER_TRACE_LEAK", trace[0]);

  const latex = [text, ...options].map((value) => stripMath(stripRender(value)).match(LATEX_OUTSIDE)?.[0]).find(Boolean);
  if (latex) add("RAW_LATEX_OUTSIDE_MATH", latex);

  const normalized = options.map((option) => stripRender(option).trim().toLowerCase());
  if (options.length && new Set(normalized).size !== normalized.length) add("DUPLICATE_OPTIONS");

  if (typeof input.correctIndex === "number" && options.length > 1) {
    const latexShaped = options.map((option) => /\\/.test(stripRender(option)));
    const powerShaped = options.map((option) => /\^/.test(option));
    for (const shaped of [latexShaped, powerShaped]) {
      if (shaped.filter(Boolean).length === 1 && shaped[input.correctIndex]) {
        add("CORRECT_OPTION_FORMAT_TELL", options[input.correctIndex]);
        break;
      }
    }
    const relationCount = options.filter((option) => RELATION_OPTION.test(option)).length;
    if (relationCount && relationCount < options.length && !/\by\b/i.test(prose)) add("OPTIONS_DONT_MATCH_STEM", options.join(" | "));
  }

  const repeatedLine = text.match(/^(.{12,}?[.।]) ?\n(?:[\s\S]*\n)?\1/u);
  if (repeatedLine) add("DUPLICATED_RELATION_LIST", repeatedLine[1]);

  if (input.language === "hi" || input.language === "pa") {
    const localized = prose.replace(/\([^)]*\)/g, " ").replace(/[“"‘'][^”"’']{1,40}[”"’']/g, " ");
    const native = input.language === "hi" ? DEVANAGARI_LETTER : GURMUKHI;
    if (!native.test(text) && !visual) add("NO_NATIVE_SCRIPT");
    if (!NAMES_OTHER_SCRIPT.test(all)) {
      if (input.language === "pa" && DEVANAGARI_LETTER.test(all)) add("DEVANAGARI_IN_PUNJABI", all.match(DEVANAGARI_GURMUKHI_IN_WORD)?.[0] ?? "");
      if (input.language === "hi" && GURMUKHI.test(all)) add("GURMUKHI_IN_HINDI", all.match(DEVANAGARI_GURMUKHI_IN_WORD)?.[0] ?? "");
    }
    const other = all.match(OTHER_INDIC);
    if (other) add("OTHER_INDIC_SCRIPT", other[0]);
    const doubled = localized.match(DOUBLED_WORD);
    if (doubled && !DOUBLED_WORD_ALLOWED.test(doubled[0])) add("DUPLICATED_TOKEN", doubled[0]);
    const mixed = localized.match(MIXED_SCRIPT);
    if (mixed) add("MIXED_SCRIPT_WORD", mixed[0]);
  }
  return findings;
}

/** Extracts stem/options/correct index from the loosely typed batch shapes the engines return. */
export function gateInputFromQuestion(
  packageId: string,
  language: QuestionStudioGateLanguage,
  question: Record<string, unknown>,
): QuestionStudioGateInput {
  const asText = (value: unknown) => (typeof value === "string" ? value : "");
  const options = Array.isArray(question.options)
    ? question.options.map((option) => typeof option === "string" ? option : asText((option as Record<string, unknown>)?.text ?? (option as Record<string, unknown>)?.value))
    : [];
  const correct = typeof question.correctIndex === "number" ? question.correctIndex
    : typeof question.correct === "number" ? question.correct : null;
  return { packageId, language, stem: asText(question.text) || asText(question.stem), options, correctIndex: correct };
}
