import {
  buildCodPedagogicalPresentation,
  type CodPedagogicalPresentation,
  type CodPedagogyLocale,
} from "../localization/pedagogical-explanation";

interface QuestionLike {
  locale: string;
  explanation: unknown;
  [key: string]: unknown;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function headings(locale: CodPedagogyLocale) {
  if (locale === "hi-IN") {
    return {
      core: "📌 मुख्य नियम",
      steps: "📝 चरण-दर-चरण समाधान",
      shortcut: "⚡ परीक्षा में तेज़ तरीका",
      trap: "⚠️ सामान्य गलती का विश्लेषण",
    } as const;
  }
  if (locale === "pa-IN") {
    return {
      core: "📌 ਮੁੱਖ ਨਿਯਮ",
      steps: "📝 ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ",
      shortcut: "⚡ ਪੇਪਰ ਵਿੱਚ ਤੇਜ਼ ਤਰੀਕਾ",
      trap: "⚠️ ਆਮ ਗਲਤੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ",
    } as const;
  }
  return {
    core: "📌 Core Rule",
    steps: "📝 Step-by-Step Solution",
    shortcut: "⚡ Exam Speed Shortcut",
    trap: "⚠️ Common Trap Analysis",
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

export function formatCodExplanationMarkdown(question: QuestionLike): string[] {
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

  output.push(
    `### ${title.shortcut}`,
    "",
    pedagogy.examShortcut,
    "",
    `### ${title.trap}`,
    "",
    pedagogy.commonTrap,
  );
  return output;
}
