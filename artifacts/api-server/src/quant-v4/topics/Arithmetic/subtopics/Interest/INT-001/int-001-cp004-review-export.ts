import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP004_QL_IDS,
  generateIntCp004Question,
  type IntCp004Question,
} from "./cp004-frequency-runtime";

function serializable(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item));
}
function questionForFrame(qlId: typeof INT_CP004_QL_IDS[number], frame: number): IntCp004Question {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const seed = `int-cp004-review:${qlId}:frame-${frame}:attempt-${attempt}`;
    const question = generateIntCp004Question(qlId, seed);
    if (question.stemFamilyId.endsWith(`FRAME-${frame}`)) return question;
  }
  throw new Error(`${qlId}: could not generate editorial frame ${frame}.`);
}

const questions = INT_CP004_QL_IDS.flatMap((qlId) => [1, 2, 3, 4].map((frame) => questionForFrame(qlId, frame)));
if (questions.length !== 76) throw new Error(`Expected 76 review questions, received ${questions.length}.`);

const answerPositions = [0, 0, 0, 0];
const qlCounts = new Map<string, number>();
const representations = new Set<string>();
for (const question of questions) {
  answerPositions[question.correctIndex] += 1;
  qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
  representations.add(question.representation);
}
if ([...qlCounts.values()].some((count) => count !== 4)) throw new Error("Each QL must contribute four review questions.");

const lines: string[] = [
  "# INT-CP-004 — Questions and Explanations",
  "",
  "Scope: compounding frequency, effective annual rate, explicit broken periods and mixed-frequency intervals.",
  "",
];
questions.forEach((question, index) => {
  lines.push(`## Question ${index + 1} — ${question.qlId}`, "", question.stem, "");
  question.options.forEach((option) => lines.push(`**${option.id}.** ${option.text}`));
  lines.push("", `**Answer:** ${question.correctAnswer}`, "", "### Explanation", "", question.explanation.whatAsked, "");
  question.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
  lines.push("", `**Final answer:** ${question.explanation.finalAnswer}`, "", `**Common mistake:** ${question.explanation.commonMistake}`, "", "---", "");
});

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-review-pack");
mkdirSync(outputDirectory, { recursive: true });
const markdownPath = join(outputDirectory, "INT-CP-004-Questions-and-Explanations-Review.md");
const dataPath = join(outputDirectory, "int-cp004-76-review-data.json");
const summaryPath = join(outputDirectory, "int-cp004-review-summary.json");
writeFileSync(markdownPath, `${lines.join("\n")}\n`);
writeFileSync(dataPath, `${JSON.stringify(serializable(questions), null, 2)}\n`);
const summary = {
  questions: questions.length,
  qlCount: INT_CP004_QL_IDS.length,
  questionsPerQl: 4,
  structuredQuestions: questions.filter((question) => question.representation === "TERMS_TABLE").length,
  proseQuestions: questions.filter((question) => question.representation !== "TERMS_TABLE").length,
  answerPositions,
  representationCoverage: representations.size,
  lifecycle: {
    approvalStatus: "NOT_APPROVED",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    publiclyPublishable: false,
  },
};
writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_REVIEW_EXPORT");
