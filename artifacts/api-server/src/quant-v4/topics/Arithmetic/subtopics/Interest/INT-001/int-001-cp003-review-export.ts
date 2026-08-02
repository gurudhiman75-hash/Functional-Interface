import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP003_QL_IDS,
  generateIntCp003Question,
  type IntCp003GeneratedQuestion,
  type IntCp003QlId,
} from "./cp003-annual-compound-runtime";

function stable(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item));
}

function csv(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/gu, '""')}"`;
}

const globallySelectedStems = new Set<string>();

function selectRows(qlId: IntCp003QlId): IntCp003GeneratedQuestion[] {
  const byPosition = new Map<number, IntCp003GeneratedQuestion>();
  for (let candidateIndex = 0; candidateIndex < 512 && byPosition.size < 4; candidateIndex += 1) {
    const seed = `int-cp003-review:${qlId}:${candidateIndex}`;
    const question = generateIntCp003Question(qlId, seed);
    if (byPosition.has(question.correctIndex) || globallySelectedStems.has(question.stem)) continue;
    byPosition.set(question.correctIndex, question);
    globallySelectedStems.add(question.stem);
  }
  if (byPosition.size !== 4) throw new Error(`${qlId}: could not select four distinct balanced review rows.`);
  return [0, 1, 2, 3].map((position) => byPosition.get(position)!);
}

const rows = INT_CP003_QL_IDS.flatMap(selectRows);
const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp003-annual-compound-review-pack");
mkdirSync(outputDirectory, { recursive: true });

const questionLines: string[] = ["# INT-CP-003 Annual Compound Interest — English Review Questions", ""];
const answerLines: string[] = ["# INT-CP-003 Annual Compound Interest — Review Answers", ""];
rows.forEach((question, index) => {
  questionLines.push(`## Question ${index + 1}`, "", question.stem, "");
  question.options.forEach((option, optionIndex) => questionLines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
  questionLines.push("");
  answerLines.push(`## Answer ${index + 1}`, "", `Correct option: ${String.fromCharCode(65 + question.correctIndex)} — ${question.options[question.correctIndex]}`, "", question.explanation.mainRule, "");
  question.explanation.workedSteps.forEach((step, stepIndex) => answerLines.push(`${stepIndex + 1}. ${step}`));
  answerLines.push("", `Exam shortcut: ${question.explanation.examShortcut}`, "", `Verification: ${question.explanation.verification}`, "", question.explanation.conclusion, "", "Wrong-option analysis:");
  question.explanation.trapAnalysis.forEach((trap) => answerLines.push(`- Option ${trap.optionNumber}: ${trap.explanation}`));
  answerLines.push("");
});

writeFileSync(join(outputDirectory, "int-cp003-56-review-questions.md"), `${questionLines.join("\n")}\n`);
writeFileSync(join(outputDirectory, "int-cp003-56-review-answers.md"), `${answerLines.join("\n")}\n`);
writeFileSync(join(outputDirectory, "int-cp003-56-review-data.json"), `${JSON.stringify(stable(rows), null, 2)}\n`);

const checklistHeader = ["review_number", "ql_id", "solve_contract", "difficulty", "representation", "answer_position", "stem", "status"].map(csv).join(",");
const checklistRows = rows.map((question, index) => [
  index + 1,
  question.qlId,
  question.solveContract,
  question.difficulty,
  question.representation,
  question.correctIndex + 1,
  question.stem,
  "AWAITING_PRODUCT_OWNER_REVIEW",
].map(csv).join(","));
writeFileSync(join(outputDirectory, "int-cp003-56-review-checklist.csv"), `${[checklistHeader, ...checklistRows].join("\n")}\n`);

const distinctStems = new Set(rows.map((question) => question.stem)).size;
const answerPositions = [0, 1, 2, 3].map((position) => rows.filter((question) => question.correctIndex === position).length);
if (distinctStems !== rows.length) throw new Error(`Review pack has ${distinctStems}/${rows.length} distinct stems.`);
if (answerPositions.some((count) => count !== INT_CP003_QL_IDS.length)) throw new Error(`Review positions are unbalanced: ${answerPositions.join("/")}.`);
const summary = {
  questions: rows.length,
  qls: INT_CP003_QL_IDS.length,
  samplesPerQl: 4,
  distinctStems,
  answerPositions,
  reviewStatus: "AWAITING_PRODUCT_OWNER_REVIEW",
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
writeFileSync(join(outputDirectory, "int-cp003-review-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_REVIEW_EXPORT");
