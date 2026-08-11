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
function frameOf(question: IntCp004Question): number {
  const match = question.stemFamilyId.match(/FRAME-(\d)$/u);
  if (!match) throw new Error(`${question.qlId}: review question has no editorial frame suffix.`);
  return Number(match[1]);
}

type CandidatePredicate = (question: IntCp004Question) => boolean;

function findQuestionForFrame(
  qlId: typeof INT_CP004_QL_IDS[number],
  frame: number,
  seenStates: Set<string>,
  predicate: CandidatePredicate = () => true,
): IntCp004Question | undefined {
  for (let attempt = 0; attempt < 3000; attempt += 1) {
    const seed = `int-cp004-review-v4:${qlId}:frame-${frame}:attempt-${attempt}`;
    let question: IntCp004Question;
    try {
      question = generateIntCp004Question(qlId, seed);
    } catch {
      continue;
    }
    if (!question.stemFamilyId.endsWith(`FRAME-${frame}`)) continue;
    if (!predicate(question)) continue;
    const key = stateKey(question);
    if (seenStates.has(key)) continue;
    return question;
  }
  return undefined;
}

function questionForFrame(
  qlId: typeof INT_CP004_QL_IDS[number],
  frame: number,
  seenStates: Set<string>,
): IntCp004Question {
  const question = findQuestionForFrame(qlId, frame, seenStates);
  if (!question) throw new Error(`${qlId}: could not generate editorial frame ${frame} under exam-readiness review constraints.`);
  seenStates.add(stateKey(question));
  return question;
}

const questions: IntCp004Question[] = [];
INT_CP004_QL_IDS.forEach((qlId) => {
  const seenStates = new Set<string>();
  [1, 2, 3, 4].forEach((frame) => questions.push(questionForFrame(qlId, frame, seenStates)));
});
if (questions.length !== 76) throw new Error(`Expected 76 review questions, received ${questions.length}.`);

function forceFrameCoverage(
  qlId: typeof INT_CP004_QL_IDS[number],
  frame: number,
  predicate: CandidatePredicate,
  label: string,
): void {
  const targetIndex = questions.findIndex((question) => question.qlId === qlId && frameOf(question) === frame);
  if (targetIndex < 0) throw new Error(`${qlId}: missing frame ${frame} while forcing ${label}.`);
  if (predicate(questions[targetIndex]!)) return;
  const seenStates = new Set(
    questions
      .filter((question, index) => question.qlId === qlId && index !== targetIndex)
      .map(stateKey),
  );
  const replacement = findQuestionForFrame(qlId, frame, seenStates, predicate);
  if (!replacement) throw new Error(`${qlId}: could not place ${label} in frame ${frame}.`);
  questions[targetIndex] = replacement;
}

// Coverage is imposed only on the review sample. Production generation stays independent of wording frames.
forceFrameCoverage("INT-QL-067", 4, (q) => q.mathematicalState.frequency === 12, "direct monthly compounding");
forceFrameCoverage("INT-QL-075", 1, (q) => pairKey(q.mathematicalState.frequency, q.mathematicalState.comparisonFrequency) === "1-2", "annual-versus-half-yearly comparison");
forceFrameCoverage("INT-QL-075", 2, (q) => pairKey(q.mathematicalState.frequency, q.mathematicalState.comparisonFrequency) === "2-4", "half-yearly-versus-quarterly comparison");
forceFrameCoverage("INT-QL-076", 3, (q) => q.mathematicalState.frequency === 12, "monthly effective-rate example");
forceFrameCoverage("INT-QL-078", 1, (q) => q.mathematicalState.frequency === 1, "annual frequency-recovery example");
forceFrameCoverage("INT-QL-078", 2, (q) => q.mathematicalState.frequency === 2, "half-yearly frequency-recovery example");
forceFrameCoverage("INT-QL-078", 3, (q) => q.mathematicalState.frequency === 4, "quarterly frequency-recovery example");
forceFrameCoverage("INT-QL-079", 1, (q) => q.mathematicalState.tailMonths === 3, "3-month broken-period tail");
forceFrameCoverage("INT-QL-079", 2, (q) => q.mathematicalState.tailMonths === 6, "6-month broken-period tail");
forceFrameCoverage("INT-QL-079", 3, (q) => q.mathematicalState.tailMonths === 9, "9-month broken-period tail");
forceFrameCoverage("INT-QL-084", 1, (q) => pairKey(q.mathematicalState.firstFrequency, q.mathematicalState.secondFrequency) === "1-2", "annual-to-half-yearly mixed-frequency example");
forceFrameCoverage("INT-QL-084", 2, (q) => pairKey(q.mathematicalState.firstFrequency, q.mathematicalState.secondFrequency) === "1-4", "annual-to-quarterly mixed-frequency example");

const answerPositions = [0, 0, 0, 0];
const qlCounts = new Map<string, number>();
const representations = new Set<string>();
const ql075Pairs = new Set<string>();
const ql076Frequencies = new Set<number>();
const ql078Frequencies = new Set<number>();
const brokenTailMonths = new Set<number>();
const mixedPairs = new Set<string>();
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
  if ((question.qlId === "INT-QL-067" || question.qlId === "INT-QL-068" || question.qlId === "INT-QL-073" || question.qlId === "INT-QL-074")
      && question.mathematicalState.frequency === 12) monthlyDirectCoverage = true;
  if (question.qlId === "INT-QL-075") ql075Pairs.add(pairKey(question.mathematicalState.frequency, question.mathematicalState.comparisonFrequency));
  if (question.qlId === "INT-QL-076") ql076Frequencies.add(question.mathematicalState.frequency);
  if (question.qlId === "INT-QL-078") ql078Frequencies.add(question.mathematicalState.frequency);
  if (["INT-QL-079", "INT-QL-080", "INT-QL-081", "INT-QL-082", "INT-QL-083"].includes(question.qlId)) brokenTailMonths.add(question.mathematicalState.tailMonths);
  if (question.qlId === "INT-QL-084" || question.qlId === "INT-QL-085") mixedPairs.add(pairKey(question.mathematicalState.firstFrequency, question.mathematicalState.secondFrequency));
}
if ([...qlCounts.values()].some((count) => count !== 4)) throw new Error("Each QL must contribute four review questions.");
if (answerPositions.some((count) => count < 14 || count > 24)) throw new Error(`Review answer positions are materially unbalanced: ${answerPositions.join("/")}.`);
if (moneyQuestions !== 48) throw new Error(`Expected 48 money-answer review questions, received ${moneyQuestions}.`);
if (decimalMoneyQuestions > 12) throw new Error(`Too many decimal-money review questions: ${decimalMoneyQuestions}/48.`);
if (!monthlyDirectCoverage) throw new Error("Review pack omits a direct monthly-compounding question.");
if (!ql075Pairs.has("1-2")) throw new Error(`Review pack omits the standard annual-versus-half-yearly comparison: ${[...ql075Pairs].join(",")}.`);
if (!ql075Pairs.has("2-4")) throw new Error(`Review pack omits a half-yearly-versus-quarterly comparison: ${[...ql075Pairs].join(",")}.`);
if ([...ql075Pairs].some((pair) => pair.includes("12"))) throw new Error("Review pack contains a calculator-heavy monthly frequency-comparison question.");
if (!ql076Frequencies.has(12)) throw new Error(`Review pack omits monthly effective-rate coverage: ${[...ql076Frequencies].join(",")}.`);
if (!ql078Frequencies.has(1) || !ql078Frequencies.has(2) || !ql078Frequencies.has(4) || ql078Frequencies.has(12)) {
  throw new Error(`Frequency-identification review coverage must include annual/half-yearly/quarterly only: ${[...ql078Frequencies].join(",")}.`);
}
if (!brokenTailMonths.has(3) || !brokenTailMonths.has(6) || !brokenTailMonths.has(9)) {
  throw new Error(`Broken-period review does not cover 3, 6 and 9 month tails: ${[...brokenTailMonths].join(",")}.`);
}
if (!mixedPairs.has("1-2") || !mixedPairs.has("1-4") || [...mixedPairs].some((pair) => pair.includes("12"))) {
  throw new Error(`Mixed-frequency review must cover annual↔half-yearly and annual↔quarterly only: ${[...mixedPairs].join(",")}.`);
}

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
  halfYearlyVsQuarterlyComparison: ql075Pairs.has("2-4"),
  monthlyEffectiveRateCoverage: ql076Frequencies.has(12),
  frequencyIdentificationCoverage: [...ql078Frequencies].sort((a, b) => a - b),
  brokenTailMonthCoverage: [...brokenTailMonths].sort((a, b) => a - b),
  mixedFrequencyPairs: [...mixedPairs].sort(),
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
