import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { WOR_001_PROTOTYPES } from "./prototype-registry";
import { generateWor001Question } from "./runtime";
import type { GeneratedWorQuestion, WorDifficulty, WorLocale } from "./foundation/types";

const reviewDifficulties: readonly WorDifficulty[] = ["EASY", "EASY", "EASY", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "HARD"];

export function buildWorReviewPack(locale: WorLocale): GeneratedWorQuestion[] {
  return WOR_001_PROTOTYPES.flatMap((prototype, prototypeIndex) =>
    (prototype.hardOnly ? reviewDifficulties.slice(0, 4) : reviewDifficulties).map((difficulty, sampleIndex) =>
      generateWor001Question(prototype.prototypeId, prototypeIndex * 1000 + sampleIndex * 37 + 11, locale, difficulty),
    ),
  );
}

function titleFor(locale: WorLocale): string {
  if (locale === "hi-IN") return "WOR-001 हिंदी परीक्षा-समीक्षा पैक";
  if (locale === "pa-IN") return "WOR-001 ਪੰਜਾਬੀ ਪ੍ਰੀਖਿਆ-ਸਮੀਖਿਆ ਪੈਕ";
  return "WOR-001 English Exam Review Pack";
}

function promptLines(question: GeneratedWorQuestion): string[] {
  if (question.structuredPrompt.partialSequence) return [`**क्रम / ਕ੍ਰਮ / Order:** ${question.structuredPrompt.partialSequence.join(" → ")}`];
  if (question.structuredPrompt.presentedSequence) return [`**क्रम / ਕ੍ਰਮ / Order:** ${question.structuredPrompt.presentedSequence.join(" → ")}`];
  const lines = [`**Words:** ${question.structuredPrompt.words.join(", ")}`];
  if (question.structuredPrompt.insertionWord) lines.push(`**Word to insert:** ${question.structuredPrompt.insertionWord}`);
  return lines;
}

export function renderWorReviewMarkdown(locale: WorLocale, questions = buildWorReviewPack(locale)): string {
  const counts = Object.fromEntries(["EASY", "MEDIUM", "HARD"].map((difficulty) => [difficulty, questions.filter((question) => question.difficulty === difficulty).length]));
  const lines = [
    `# ${titleFor(locale)}`,
    "",
    "Review-only deterministic prototypes. English A–Z words are logic tokens in every locale. Every question has four options and an independently verified answer. Permanent QLs, public release and Question Studio visibility remain disabled pending human editorial approval.",
    "",
    `- Questions: ${questions.length}`,
    `- Prototypes: ${WOR_001_PROTOTYPES.length}`,
    `- Difficulty: EASY ${counts.EASY}, MEDIUM ${counts.MEDIUM}, HARD ${counts.HARD}`,
    "- Option standard: EXAMTREE_FOUR_OPTION",
    "- Lifecycle: REVIEW_ONLY",
    "",
  ];
  questions.forEach((question, index) => {
    lines.push(`## ${index + 1}. ${question.checkpointId} / ${question.prototypeId}`, "", question.stem, "", ...promptLines(question), "");
    question.options.forEach((option, optionIndex) => lines.push(`${optionIndex + 1}. ${option.value}`));
    lines.push(
      "",
      `**Answer:** ${question.correctIndex + 1}. ${question.answer}`,
      "",
      `**Explanation:** ${question.explanation}`,
      "",
      `<details><summary>Internal review metadata</summary>`,
      "",
      `- Difficulty: ${question.difficulty}`,
      `- Family: ${question.metadata.sourceFamilyId}`,
      `- Canonical order: ${question.metadata.canonicalOrder.join(" → ")}`,
      `- Allocation: ${question.metadata.allocationDecision}`,
      `- Distractors: ${question.options.map((option) => option.misconceptionId ?? "CORRECT").join(", ")}`,
      "",
      "</details>",
      "",
    );
  });
  return `${lines.join("\n").trimEnd()}\n`;
}

export async function exportWorReviewPacks(outputDirectory: string): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    const language = locale === "en-IN" ? "english" : locale === "hi-IN" ? "hindi" : "punjabi";
    const questions = buildWorReviewPack(locale);
    await writeFile(path.join(outputDirectory, `wor-001-${language}-review.json`), `${JSON.stringify(questions, null, 2)}\n`, "utf8");
    await writeFile(path.join(outputDirectory, `wor-001-${language}-review.md`), renderWorReviewMarkdown(locale, questions), "utf8");
  }
}
