import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP002_FINAL_QL_IDS } from "./cp002-final-registry";
import { generateIntCp002FinalQuestion } from "./cp002-final-runtime";

function stable(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item));
}

function csv(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replace(/"/gu, '""')}"`;
}

const rows = INT_CP002_FINAL_QL_IDS.flatMap((qlId) =>
  Array.from({ length: 4 }, (_unused, sampleIndex) => {
    const seed = `int-cp002-final-review:${qlId}:${sampleIndex}`;
    return generateIntCp002FinalQuestion(qlId, seed);
  }),
);

const questions: string[] = [
  "# INT-CP-002 Final English Review — Questions",
  "",
  "Review scope: 31 proposed permanent contracts, four deterministic samples per contract.",
  "",
];
const answers: string[] = [
  "# INT-CP-002 Final English Review — Answers and Explanations",
  "",
];

for (const [index, question] of rows.entries()) {
  const number = index + 1;
  questions.push(`## Question ${number}`, "", question.stem, "");
  question.options.forEach((option, optionIndex) => {
    questions.push(`${optionIndex + 1}. ${option}`);
  });
  questions.push("");

  answers.push(`## Answer ${number}`, "", `**Correct option:** ${question.correctIndex + 1}. ${question.options[question.correctIndex]}`, "");
  answers.push(`**Main rule:** ${question.explanation.mainRule}`, "");
  answers.push("**Worked steps:**", "");
  question.explanation.workedSteps.forEach((step, stepIndex) => {
    answers.push(`${stepIndex + 1}. ${step}`);
  });
  answers.push("", `**Exam shortcut:** ${question.explanation.examShortcut}`, "");
  answers.push(`**Verification:** ${question.explanation.verification}`, "");
  answers.push(`**Conclusion:** ${question.explanation.conclusion}`, "");
  answers.push("**Wrong-option analysis:**", "");
  question.explanation.trapAnalysis.forEach((trap) => {
    answers.push(`- Option ${trap.optionNumber}: ${trap.explanation}`);
  });
  answers.push("");
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp002-final-review-pack");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(join(outputDirectory, "int-cp002-final-124-review-questions.md"), `${questions.join("\n")}\n`);
writeFileSync(join(outputDirectory, "int-cp002-final-124-review-answers.md"), `${answers.join("\n")}\n`);
writeFileSync(join(outputDirectory, "int-cp002-final-124-review-data.json"), `${JSON.stringify(stable(rows), null, 2)}\n`);

const checklistHeader = [
  "number", "qlId", "solveContract", "sourceKind", "sourcePrototypeId", "difficulty", "answerSemantic",
  "stem", "options", "correctOption", "stemFinding", "optionFinding", "explanationFinding", "disposition",
].join(",");
const checklistRows = rows.map((question, index) => [
  String(index + 1),
  csv(question.qlId),
  csv(question.solveContract),
  csv(question.internalProvenance.sourceKind),
  csv(question.internalProvenance.sourcePrototypeId),
  csv(question.difficulty),
  csv(question.answerSemantic),
  csv(question.stem),
  csv(question.options),
  csv(question.options[question.correctIndex]),
  csv(""),
  csv(""),
  csv(""),
  csv("PENDING_REVIEW"),
].join(","));
writeFileSync(
  join(outputDirectory, "int-cp002-final-124-review-checklist.csv"),
  `${[checklistHeader, ...checklistRows].join("\n")}\n`,
);

const summary = {
  questions: rows.length,
  qls: INT_CP002_FINAL_QL_IDS.length,
  samplesPerQl: 4,
  distinctStems: new Set(rows.map((question) => question.stem)).size,
  answerPositions: [0, 1, 2, 3].map((position) => rows.filter((question) => question.correctIndex === position).length),
  sourceKinds: Object.fromEntries(
    ["WAVE01", "WAVE02", "CLOSURE"].map((kind) => [
      kind,
      rows.filter((question) => question.internalProvenance.sourceKind === kind).length,
    ]),
  ),
  lifecycle: {
    reviewStatus: "FINAL_ENGLISH_REVIEW_CANDIDATE",
    enabled: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
writeFileSync(join(outputDirectory, "int-cp002-final-review-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP002_FINAL_REVIEW_EXPORT");
