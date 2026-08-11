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
function stateKey(question: IntCp004Question): string {
  return JSON.stringify(question.mathematicalState, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}
function pairKey(left: number, right: number): string {
  return [left, right].sort((a, b) => a - b).join("-");
}

const desiredComparisonPairs: Readonly<Record<number, string>> = Object.freeze({
  1: "1-2",
  2: "2-4",
  3: "1-4",
  4: "1-2",
});
const desiredEffectiveFrequencies: Readonly<Record<number, number>> = Object.freeze({ 1: 2, 2: 4, 3: 12, 4: 2 });
const desiredIdentificationFrequencies: Readonly<Record<number, number>> = Object.freeze({ 1: 1, 2: 2, 3: 4, 4: 1 });
const desiredTailMonths: Readonly<Record<number, number>> = Object.freeze({ 1: 3, 2: 6, 3: 9, 4: 6 });

function matchesReviewCoverage(question: IntCp004Question, frame: number): boolean {
  if (question.answerSemantic === "MONEY" && frame <= 3 && question.solution.denominator !== 1n) return false;
  if (question.qlId === "INT-QL-067" && frame === 4) return question.mathematicalState.frequency === 12;
  if (question.qlId === "INT-QL-075") {
    return pairKey(question.mathematicalState.frequency, question.mathematicalState.comparisonFrequency) === desiredComparisonPairs[frame];
  }
  if (question.qlId === "INT-QL-076") return question.mathematicalState.frequency === desiredEffectiveFrequencies[frame];
  if (question.qlId === "INT-QL-078") return question.mathematicalState.frequency === desiredIdentificationFrequencies[frame];
  if (["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(question.qlId)) {
    return question.mathematicalState.tailMonths === desiredTailMonths[frame];
  }
  return true;
}

function questionForFrame(
  qlId: typeof INT_CP004_QL_IDS[number],
  frame: number,
  desiredCorrectIndex: number,
  seenStates: Set<string>,
): IntCp004Question {
  for (let attempt = 0; attempt < 5000; attempt += 1) {
    const seed = `int-cp004-review-v4:${qlId}:frame-${frame}:attempt-${attempt}`;
    const question = generateIntCp004Question(qlId, seed);
    if (!question.stemFamilyId.endsWith(`FRAME-${frame}`)) continue;
    if (question.correctIndex !== desiredCorrectIndex) continue;
    if (!matchesReviewCoverage(question, frame)) continue;
    const key = stateKey(question);
    if (seenStates.has(key)) continue;
    seenStates.add(key);
    return question;
  }
  throw new Error(`${qlId}: could not generate editorial frame ${frame} under exam-readiness review constraints.`);
}

const questions: IntCp004Question[] = [];
INT_CP004_QL_IDS.forEach((qlId, qlIndex) => {
  const seenStates = new Set<string>();
  [1, 2, 3, 4].forEach((frame) => {
    const desiredCorrectIndex = (qlIndex * 4 + frame - 1) % 4;
    questions.push(questionForFrame(qlId, frame, desiredCorrectIndex, seenStates));
  });
});
if (questions.length !== 76) throw new Error(`Expected 76 review questions, received ${questions.length}.`);

const answerPositions = [0, 0, 0, 0];
const qlCounts = new Map<string, number>();
const representations = new Set<string>();
const ql075Pairs = new Set<string>();
const ql076Frequencies = new Set<number>();
const ql078Frequencies = new Set<number>();
const brokenTailMonths = new Set<number>();
let moneyQuestions = 0;
let decimalMoneyQuestions = 0;
let monthlyDirectCoverage = false;
for (const question of questions) {
  answerPositions[question.correctIndex] += 1;
  qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
  representations.add(question.representation);
  if (question.answerSemantic === "MONEY") {
    moneyQuestions += 1;
    if (question.solution.denominator !== 1n) decimalMoneyQuestions += 1;
  }
  if (question.qlId === "INT-QL-067" && question.mathematicalState.frequency === 12) monthlyDirectCoverage = true;
  if (question.qlId === "INT-QL-075") ql075Pairs.add(pairKey(question.mathematicalState.frequency, question.mathematicalState.comparisonFrequency));
  if (question.qlId === "INT-QL-076") ql076Frequencies.add(question.mathematicalState.frequency);
  if (question.qlId === "INT-QL-078") ql078Frequencies.add(question.mathematicalState.frequency);
  if (["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(question.qlId)) brokenTailMonths.add(question.mathematicalState.tailMonths);
}
if ([...qlCounts.values()].some((count) => count !== 4)) throw new Error("Each QL must contribute four review questions.");
if (answerPositions.some((count) => count !== 19)) throw new Error(`Review answer positions are not exactly balanced: ${answerPositions.join("/")}.`);
if (moneyQuestions !== 48) throw new Error(`Expected 48 money-answer review questions, received ${moneyQuestions}.`);
if (decimalMoneyQuestions > 12) throw new Error(`Too many decimal-money review questions: ${decimalMoneyQuestions}/48.`);
if (!monthlyDirectCoverage) throw new Error("Review pack omits a direct monthly-compounding question.");
if (!ql075Pairs.has("1-2")) throw new Error("Review pack omits the standard annual-versus-half-yearly comparison.");
if (ql075Pairs.has("1-12") || ql075Pairs.has("2-12") || ql075Pairs.has("4-12")) throw new Error("Review pack contains a calculator-heavy monthly frequency-comparison question.");
if (!ql076Frequencies.has(12)) throw new Error("Review pack omits monthly effective-rate coverage.");
if (ql078Frequencies.size !== 3 || !ql078Frequencies.has(1) || !ql078Frequencies.has(2) || !ql078Frequencies.has(4) || ql078Frequencies.has(12)) {
  throw new Error(`Frequency-identification review coverage must be annual/half-yearly/quarterly only: ${[...ql078Frequencies].join(",")}.`);
}
if (brokenTailMonths.size !== 3) throw new Error(`Broken-period review does not cover 3, 6 and 9 month tails.`);

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
  moneyQuestions,
  decimalMoneyQuestions,
  decimalMoneyShare: Number((decimalMoneyQuestions / moneyQuestions).toFixed(4)),
  monthlyDirectCoverage,
  annualVsHalfYearlyComparison: ql075Pairs.has("1-2"),
  monthlyEffectiveRateCoverage: ql076Frequencies.has(12),
  frequencyIdentificationCoverage: [...ql078Frequencies].sort((a, b) => a - b),
  brokenTailMonthCoverage: [...brokenTailMonths].sort((a, b) => a - b),
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
