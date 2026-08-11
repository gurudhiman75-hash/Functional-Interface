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
type CoverageRequirement = Readonly<{ label: string; predicate: CandidatePredicate }>;

function findQuestionForFrame(
  qlId: typeof INT_CP004_QL_IDS[number],
  frame: number,
  seenStates: Set<string>,
  predicate: CandidatePredicate = () => true,
): IntCp004Question | undefined {
  for (let attempt = 0; attempt < 3500; attempt += 1) {
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

function qlIndexes(qlId: typeof INT_CP004_QL_IDS[number]): number[] {
  return questions.map((question, index) => ({ question, index })).filter(({ question }) => question.qlId === qlId).map(({ index }) => index);
}
function countRequirement(indexes: readonly number[], requirement: CoverageRequirement): number {
  return indexes.reduce((count, index) => count + (requirement.predicate(questions[index]!) ? 1 : 0), 0);
}
function placeRequirementInQl(
  qlId: typeof INT_CP004_QL_IDS[number],
  requirement: CoverageRequirement,
  allRequirements: readonly CoverageRequirement[],
): boolean {
  const indexes = qlIndexes(qlId);
  if (indexes.some((index) => requirement.predicate(questions[index]!))) return true;

  for (const targetIndex of indexes) {
    const current = questions[targetIndex]!;
    const wouldBreakRequiredCoverage = allRequirements.some((other) =>
      other !== requirement
      && other.predicate(current)
      && countRequirement(indexes, other) === 1,
    );
    if (wouldBreakRequiredCoverage) continue;

    const frame = frameOf(current);
    const seenStates = new Set(indexes.filter((index) => index !== targetIndex).map((index) => stateKey(questions[index]!)));
    const replacement = findQuestionForFrame(qlId, frame, seenStates, requirement.predicate);
    if (!replacement) continue;
    questions[targetIndex] = replacement;
    return true;
  }
  return false;
}
function forceQlCoverage(
  qlId: typeof INT_CP004_QL_IDS[number],
  requirements: readonly CoverageRequirement[],
): void {
  for (const requirement of requirements) {
    if (!placeRequirementInQl(qlId, requirement, requirements)) {
      throw new Error(`${qlId}: could not place ${requirement.label} in any editorial frame.`);
    }
  }
  const indexes = qlIndexes(qlId);
  for (const requirement of requirements) {
    if (!indexes.some((index) => requirement.predicate(questions[index]!))) {
      throw new Error(`${qlId}: lost required coverage for ${requirement.label}.`);
    }
  }
}

const monthlyDirect: CoverageRequirement = {
  label: "direct monthly compounding",
  predicate: (q) => q.mathematicalState.frequency === 12,
};
if (!placeRequirementInQl("INT-QL-067", monthlyDirect, [monthlyDirect])
    && !placeRequirementInQl("INT-QL-068", monthlyDirect, [monthlyDirect])) {
  throw new Error("Review selector could not place a direct monthly-compounding sample in QL-067 or QL-068.");
}

forceQlCoverage("INT-QL-075", [
  { label: "annual-versus-half-yearly comparison", predicate: (q) => pairKey(q.mathematicalState.frequency, q.mathematicalState.comparisonFrequency) === "1-2" },
  { label: "half-yearly-versus-quarterly comparison", predicate: (q) => pairKey(q.mathematicalState.frequency, q.mathematicalState.comparisonFrequency) === "2-4" },
]);
forceQlCoverage("INT-QL-076", [
  { label: "monthly effective-rate example", predicate: (q) => q.mathematicalState.frequency === 12 },
]);
forceQlCoverage("INT-QL-078", [
  { label: "annual frequency-recovery example", predicate: (q) => q.mathematicalState.frequency === 1 },
  { label: "half-yearly frequency-recovery example", predicate: (q) => q.mathematicalState.frequency === 2 },
  { label: "quarterly frequency-recovery example", predicate: (q) => q.mathematicalState.frequency === 4 },
]);
forceQlCoverage("INT-QL-079", [
  { label: "3-month broken-period tail", predicate: (q) => q.mathematicalState.tailMonths === 3 },
  { label: "6-month broken-period tail", predicate: (q) => q.mathematicalState.tailMonths === 6 },
  { label: "9-month broken-period tail", predicate: (q) => q.mathematicalState.tailMonths === 9 },
]);
forceQlCoverage("INT-QL-084", [
  { label: "annual-to-half-yearly mixed-frequency example", predicate: (q) => pairKey(q.mathematicalState.firstFrequency, q.mathematicalState.secondFrequency) === "1-2" },
  { label: "annual-to-quarterly mixed-frequency example", predicate: (q) => pairKey(q.mathematicalState.firstFrequency, q.mathematicalState.secondFrequency) === "1-4" },
]);

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
