import { buildRnkCp001LocalizedReviewBankV4 } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-001/cp001-localization-review-v4";
import { buildRnkCp002LocalizedReviewBankV2 } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-002/cp002-localization-review-v2";
import { buildRnkCp003LocalizedReviewBankV4 } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-003/cp003-localization-review-v4";
import { localizeRnkCp004PermanentQuestionV6 } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-004/cp004-localization-review-v6";
import { buildRnkCp004PermanentRuntime } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-004/cp004-permanent-runtime-v1";
import { localizeRnkCp005PermanentQuestionV3 } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-005/cp005-localization-review-v3";
import { buildRnkCp005PermanentRuntime } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-005/cp005-permanent-runtime-v1";
import { localizeRnkCp006PermanentQuestionV1 } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-006/cp006-localization-review-v1";
import { buildRnkCp006PermanentRuntime } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-006/cp006-permanent-runtime-v1";
import { localizeRnkCp007PermanentQuestion } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-007/cp007-localization-review-v1";
import { buildRnkCp007PermanentRuntime } from "../topics/Ranking-and-Order/RNK-001/RNK-CP-007/cp007-permanent-runtime-v1";

type AnyQuestion = Record<string, any>;
type Locale = "hi-IN" | "pa-IN";

function text(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join("\n");
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const preferred = [
      obj.keyRule,
      obj.coreConcept,
      obj.ruleStatement,
      obj.stepByStepSolution,
      obj.steps,
      obj.working,
      obj.solutionPhases,
      obj.optionAnalysis,
      obj.conclusion,
      obj.examSpeedShortcut,
    ].map(text).filter(Boolean);
    if (preferred.length) return preferred.join("\n");
  }
  return String(value);
}

function options(question: AnyQuestion): string[] {
  if (!Array.isArray(question.options)) return [];
  return question.options.map((option: any, index: number) => {
    const visible = typeof option === "string" || typeof option === "number"
      ? String(option)
      : String(option.label ?? option.text ?? option.value ?? option.answer ?? option.answerKey ?? "");
    return `${["A","B","C","D","E"][index] ?? String(index + 1)}. ${visible}`;
  });
}

function answer(question: AnyQuestion): string {
  if (question.answer != null) return text(question.answer);
  const index = Number(question.correctIndex ?? question.answerIndex);
  if (Number.isInteger(index) && Array.isArray(question.options)) {
    const option = question.options[index];
    if (option != null) {
      return typeof option === "object"
        ? String(option.label ?? option.text ?? option.value ?? option.answer ?? option.answerKey ?? "")
        : String(option);
    }
  }
  return "(answer stored in structured state)";
}

function qlId(question: AnyQuestion): string {
  return String(
    question.permanentQlId
    ?? question.qlId
    ?? question.permanentProfile?.permanentQlId
    ?? "(unknown QL)",
  );
}

function representative<T>(bank: readonly T[]): readonly T[] {
  if (bank.length <= 2) return bank;
  const firstIndex = Math.min(1, bank.length - 1);
  const secondIndex = Math.max(firstIndex + 1, Math.floor(bank.length * 0.62));
  return [bank[firstIndex]!, bank[Math.min(secondIndex, bank.length - 1)]!];
}

function localizeRepresentative<T>(
  canonical: readonly T[],
  locale: Locale,
  localize: (question: T, locale: Locale) => AnyQuestion,
): readonly AnyQuestion[] {
  return representative(canonical).map((question) => localize(question, locale));
}

function bank(cp: number, locale: Locale): readonly AnyQuestion[] {
  if (cp === 1) return buildRnkCp001LocalizedReviewBankV4(locale, 4) as readonly AnyQuestion[];
  if (cp === 2) return buildRnkCp002LocalizedReviewBankV2(locale, 4) as readonly AnyQuestion[];
  if (cp === 3) return buildRnkCp003LocalizedReviewBankV4(locale, 4) as readonly AnyQuestion[];
  if (cp === 4) {
    return localizeRepresentative(
      buildRnkCp004PermanentRuntime(),
      locale,
      localizeRnkCp004PermanentQuestionV6 as any,
    );
  }
  if (cp === 5) {
    return localizeRepresentative(
      buildRnkCp005PermanentRuntime(),
      locale,
      localizeRnkCp005PermanentQuestionV3 as any,
    );
  }
  if (cp === 6) {
    return localizeRepresentative(
      buildRnkCp006PermanentRuntime(),
      locale,
      localizeRnkCp006PermanentQuestionV1 as any,
    );
  }
  return localizeRepresentative(
    buildRnkCp007PermanentRuntime(),
    locale,
    localizeRnkCp007PermanentQuestion as any,
  );
}

const lines: string[] = [
  "# RNK-001 — Hindi/Punjabi Human Language Review Pack",
  "",
  "Date: 2026-10-02",
  "",
  "Purpose: explicit human wording approval before multilingual freeze and Question Studio activation.",
  "",
  "This pack does not grant approval. It samples the current technical-review authorities only.",
  "",
];

let sampleCount = 0;
for (let cp = 1; cp <= 7; cp += 1) {
  lines.push(`## RNK-CP-${String(cp).padStart(3, "0")}`, "");
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    lines.push(locale === "hi-IN" ? "### Hindi" : "### Punjabi", "");
    const source = bank(cp, locale);
    const samples = cp <= 3 ? representative(source) : source;
    for (let index = 0; index < samples.length; index += 1) {
      const question = samples[index]!;
      sampleCount += 1;
      lines.push(
        `#### Sample ${index + 1} — ${qlId(question)}`,
        "",
        "**Stem**",
        "",
        text(question.stem),
        "",
        "**Options**",
        "",
        ...options(question),
        "",
        `**Answer:** ${answer(question)}`,
        "",
        "**Explanation**",
        "",
        text(question.explanation),
        "",
        `**Technical authority:** ${text(question.localizationProof?.authority ?? question.reviewMetadata?.localization?.version ?? question.localizationMetadata?.version)}`,
        "",
        "**Human verdict:** ☐ Approve  ☐ Revise",
        "",
        "**Reviewer note:**",
        "",
      );
    }
  }
}

lines.push(
  "## Approval boundary",
  "",
  "- Technical semantic parity is already executable-proved.",
  "- Human approval is required for Hindi/Punjabi naturalness and exam-standard wording.",
  "- No multilingual freeze or RNK Question Studio activation is granted by generating this pack.",
  "",
  `Total representative samples: **${sampleCount}**`,
  "",
);

console.log(lines.join("\n"));
