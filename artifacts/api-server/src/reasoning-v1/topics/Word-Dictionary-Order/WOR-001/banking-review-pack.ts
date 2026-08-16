import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { WOR_CP005_PROTOTYPES } from "./WOR-CP-005/registry";
import type { GeneratedWorQuestion, WorDifficulty, WorLocale } from "./foundation/types";
import { generateWor001Question } from "./runtime";

function samplesFor(prototypeId: string, difficulties: readonly WorDifficulty[], locale: WorLocale): GeneratedWorQuestion[] {
  return difficulties.flatMap((difficulty, difficultyIndex) => [0, 1, 2].map((sampleIndex) =>
    generateWor001Question(prototypeId, 30000 + difficultyIndex * 1000 + sampleIndex * 113 + Number(prototypeId.slice(-3)), locale, difficulty),
  ));
}

export function buildWorBankingReviewPack(locale: WorLocale): GeneratedWorQuestion[] {
  return WOR_CP005_PROTOTYPES.flatMap((prototype) => samplesFor(prototype.prototypeId, prototype.supportedDifficulties ?? ["MEDIUM", "HARD"], locale));
}

function titleFor(locale: WorLocale): string {
  if (locale === "hi-IN") return "WOR-CP-005 बैंकिंग समग्र समीक्षा पैक";
  if (locale === "pa-IN") return "WOR-CP-005 ਬੈਂਕਿੰਗ ਕਾਂਪੋਜ਼ਿਟ ਸਮੀਖਿਆ ਪੈਕ";
  return "WOR-CP-005 Banking Composite Review Pack";
}

function labels(locale: WorLocale) {
  if (locale === "hi-IN") return { groups: "अक्षर-समूह", transformed: "परिवर्तित समूह", answer: "उत्तर", explanation: "व्याख्या" };
  if (locale === "pa-IN") return { groups: "ਅੱਖਰ-ਸਮੂਹ", transformed: "ਬਦਲੇ ਸਮੂਹ", answer: "ਉੱਤਰ", explanation: "ਵਿਆਖਿਆ" };
  return { groups: "Letter groups", transformed: "Transformed groups", answer: "Answer", explanation: "Explanation" };
}

export function renderWorBankingReviewMarkdown(locale: WorLocale, questions = buildWorBankingReviewPack(locale)): string {
  const l = labels(locale);
  const lines = [
    `# ${titleFor(locale)}`,
    "",
    `- Questions: ${questions.length}`,
    `- Prototypes: ${WOR_CP005_PROTOTYPES.length}`,
    "- Object mode: LETTER_CLUSTER",
    "- Option profile: BANKING_FIVE_OPTION",
    "- Lifecycle: REVIEW_ONLY",
    "",
  ];
  questions.forEach((question, index) => {
    lines.push(`## ${index + 1}. ${question.prototypeId} / ${question.difficulty}`, "", question.stem, "", `**${l.groups}:** ${question.structuredPrompt.words.join(", ")}`);
    if (question.structuredPrompt.transformedWords) lines.push(`**${l.transformed}:** ${question.structuredPrompt.transformedWords.join(", ")}`);
    lines.push("");
    question.options.forEach((option, optionIndex) => lines.push(`${optionIndex + 1}. ${option.value}`));
    lines.push("", `**${l.answer}:** ${question.correctIndex + 1}. ${question.answer}`, "", `**${l.explanation}:** ${question.explanation}`, "", "<details><summary>Internal review metadata</summary>", "");
    lines.push(`- Task: ${question.taskKind}`);
    lines.push(`- Source evidence: ${question.metadata.sourceEvidenceStatus}`);
    lines.push(`- Allocation: ${question.metadata.allocationDecision}`);
    lines.push(`- Transformation: ${question.metadata.bankingTrace?.transformation ?? "NONE"}`);
    lines.push(`- Ordered tokens: ${question.metadata.bankingTrace?.orderedTokens.join(" → ") ?? ""}`);
    lines.push(`- Difficulty score: ${question.metadata.difficultyFeatures.score}`);
    lines.push(`- Options: ${question.metadata.optionCount}`);
    lines.push("", "</details>", "");
  });
  return `${lines.join("\n").trimEnd()}\n`;
}

export async function exportWorBankingReviewPacks(outputDirectory: string): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    const language = locale === "en-IN" ? "english" : locale === "hi-IN" ? "hindi" : "punjabi";
    const questions = buildWorBankingReviewPack(locale);
    await writeFile(path.join(outputDirectory, `wor-cp005-${language}-review.json`), `${JSON.stringify(questions, null, 2)}\n`, "utf8");
    await writeFile(path.join(outputDirectory, `wor-cp005-${language}-review.md`), renderWorBankingReviewMarkdown(locale, questions), "utf8");
  }
}
