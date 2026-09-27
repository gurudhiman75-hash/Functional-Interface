import {
  buildCodPedagogicalPresentation,
  type CodPedagogicalPresentation,
  type CodPedagogyLocale,
} from "../localization/pedagogical-explanation";

interface QuestionLike {
  locale: string;
  ruleId?: string;
  explanation: unknown;
  [key: string]: unknown;
}

const SOURCE_GAP_RULES = new Set([
  "ALPHABETICAL_ASCENDING_SORT",
  "INDEXED_SHIFT_THEN_REVERSE",
  "REVERSE_THEN_UNIFORM_SHIFT",
  "MIXED_CLASS_CODE",
]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(strings);
  return [];
}

function headings(locale: CodPedagogyLocale) {
  if (locale === "hi-IN") {
    return {
      core: "📌 मुख्य नियम",
      steps: "📝 चरण-दर-चरण समाधान",

    } as const;
  }
  if (locale === "pa-IN") {
    return {
      core: "📌 ਮੁੱਖ ਨਿਯਮ",
      steps: "📝 ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ",

    } as const;
  }
  return {
    core: "📌 Core Rule",
    steps: "📝 Step-by-Step Solution",

  } as const;
}

function presentation(question: QuestionLike): CodPedagogicalPresentation {
  const explanation = asRecord(question.explanation);
  const existing = explanation.pedagogicalPresentation;
  if (existing && typeof existing === "object") return existing as CodPedagogicalPresentation;
  return buildCodPedagogicalPresentation(question as never);
}

function renderVisual(block: string): string[] {
  if (block.trimStart().startsWith("|")) return [block];
  return ["```text", block, "```"];
}

function formatSourceGapExplanation(question: QuestionLike): string[] {
  const locale = question.locale as CodPedagogyLocale;
  const title = headings(locale);
  const explanation = asRecord(question.explanation);
  const rule = String(explanation.ruleStatement ?? "").trim();
  const demonstrations = strings(explanation.sourceDemonstration);
  const applications = strings(explanation.targetApplication);
  const conclusion = String(explanation.conclusion ?? "").trim();
  const steps = [...demonstrations, ...applications, ...(conclusion ? [conclusion] : [])];

  return [
    `### ${title.core}`,
    "",
    rule,
    "",
    `### ${title.steps}`,
    "",
    ...steps.flatMap((step, index) => [`${index + 1}. ${step}`, ""]),
  ];
}

export function formatCodExplanationMarkdown(question: QuestionLike): string[] {
  if (SOURCE_GAP_RULES.has(question.ruleId ?? "")) return formatSourceGapExplanation(question);

  const locale = question.locale as CodPedagogyLocale;
  const title = headings(locale);
  const pedagogy = presentation(question);
  const output: string[] = [
    `### ${title.core}`,
    "",
    pedagogy.coreRule,
    "",
    `### ${title.steps}`,
    "",
    ...pedagogy.stepByStep.flatMap((step, index) => [`${index + 1}. ${step}`, ""]),
  ];

  for (const block of pedagogy.visualAlignment) {
    output.push(...renderVisual(block), "");
  }

  // Reviewer/learner output intentionally stops after the worked solution.
  // Shortcut and trap diagnostics remain available in the internal pedagogy
  // object for QA, but are not forced into the learner-facing explanation.
  return output;
}
