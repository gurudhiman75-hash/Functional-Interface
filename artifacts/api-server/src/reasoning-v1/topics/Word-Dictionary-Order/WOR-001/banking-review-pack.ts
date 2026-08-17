import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { WOR_CP005_PROTOTYPES } from "./WOR-CP-005/registry";
import { toWorStudentFacingQuestion } from "./editorial";
import type { GeneratedWorQuestion, WorDifficulty, WorLocale } from "./foundation/types";
import { generateWor001Question } from "./runtime";

function samplesFor(prototypeId: string, difficulties: readonly WorDifficulty[], locale: WorLocale): GeneratedWorQuestion[] {
  return difficulties.flatMap((difficulty, difficultyIndex) => [0, 1, 2].map((sampleIndex) =>
    toWorStudentFacingQuestion(generateWor001Question(prototypeId, 30000 + difficultyIndex * 1000 + sampleIndex * 113 + Number(prototypeId.slice(-3)), locale, difficulty)),
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
  if (locale === "hi-IN") return {
    questions: "प्रश्न",
    prototypes: "प्रोटोटाइप",
    objectMode: "वस्तु प्रकार",
    optionProfile: "विकल्प मानक",
    lifecycle: "जीवनचक्र",
    groups: "अक्षर-समूह",
    transformed: "परिवर्तित समूह (केवल आंतरिक समीक्षा)",
    answer: "उत्तर",
    explanation: "व्याख्या",
    task: "कार्य",
    sourceEvidence: "स्रोत प्रमाण",
    allocation: "आवंटन",
    transformation: "परिवर्तन",
    orderedTokens: "क्रमबद्ध समूह",
    difficultyScore: "कठिनाई स्कोर",
    options: "विकल्पों की संख्या",
  };
  if (locale === "pa-IN") return {
    questions: "ਪ੍ਰਸ਼ਨ",
    prototypes: "ਪ੍ਰੋਟੋਟਾਈਪ",
    objectMode: "ਵਸਤੂ ਕਿਸਮ",
    optionProfile: "ਵਿਕਲਪ ਮਿਆਰ",
    lifecycle: "ਜੀਵਨਚੱਕਰ",
    groups: "ਅੱਖਰ-ਸਮੂਹ",
    transformed: "ਬਦਲੇ ਸਮੂਹ (ਕੇਵਲ ਅੰਦਰੂਨੀ ਸਮੀਖਿਆ)",
    answer: "ਉੱਤਰ",
    explanation: "ਵਿਆਖਿਆ",
    task: "ਕਾਰਜ",
    sourceEvidence: "ਸਰੋਤ ਸਬੂਤ",
    allocation: "ਅਲਾਟਮੈਂਟ",
    transformation: "ਤਬਦੀਲੀ",
    orderedTokens: "ਕ੍ਰਮਬੱਧ ਸਮੂਹ",
    difficultyScore: "ਮੁਸ਼ਕਲ ਸਕੋਰ",
    options: "ਵਿਕਲਪਾਂ ਦੀ ਗਿਣਤੀ",
  };
  return {
    questions: "Questions",
    prototypes: "Prototypes",
    objectMode: "Object mode",
    optionProfile: "Option profile",
    lifecycle: "Lifecycle",
    groups: "Letter groups",
    transformed: "Transformed groups (internal review only)",
    answer: "Answer",
    explanation: "Explanation",
    task: "Task",
    sourceEvidence: "Source evidence",
    allocation: "Allocation",
    transformation: "Transformation",
    orderedTokens: "Ordered tokens",
    difficultyScore: "Difficulty score",
    options: "Options",
  };
}

export function renderWorBankingReviewMarkdown(locale: WorLocale, questions = buildWorBankingReviewPack(locale)): string {
  const l = labels(locale);
  const lines = [
    `# ${titleFor(locale)}`,
    "",
    `- ${l.questions}: ${questions.length}`,
    `- ${l.prototypes}: ${WOR_CP005_PROTOTYPES.length}`,
    `- ${l.objectMode}: LETTER_CLUSTER`,
    `- ${l.optionProfile}: BANKING_FIVE_OPTION`,
    `- ${l.lifecycle}: REVIEW_ONLY`,
    "",
  ];
  questions.forEach((question, index) => {
    lines.push(`## ${index + 1}. ${question.prototypeId} / ${question.difficulty}`, "", question.stem, "", `**${l.groups}:** ${question.structuredPrompt.words.join(", ")}`, "");
    question.options.forEach((option, optionIndex) => lines.push(`${optionIndex + 1}. ${option.value}`));
    lines.push("", `**${l.answer}:** ${question.correctIndex + 1}. ${question.answer}`, "", `**${l.explanation}:** ${question.explanation}`, "", "<details><summary>Internal review metadata</summary>", "");
    const trace = question.metadata.bankingTrace;
    lines.push(`- ${l.task}: ${question.taskKind}`);
    lines.push(`- ${l.sourceEvidence}: ${question.metadata.sourceEvidenceStatus}`);
    lines.push(`- ${l.allocation}: ${question.metadata.allocationDecision}`);
    lines.push(`- ${l.transformation}: ${trace?.transformation ?? "NONE"}`);
    if (trace && trace.transformation !== "NONE") lines.push(`- ${l.transformed}: ${trace.transformedTokens.join(", ")}`);
    lines.push(`- ${l.orderedTokens}: ${trace?.orderedTokens.join(" → ") ?? ""}`);
    lines.push(`- ${l.difficultyScore}: ${question.metadata.difficultyFeatures.score}`);
    lines.push(`- ${l.options}: ${question.metadata.optionCount}`);
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
