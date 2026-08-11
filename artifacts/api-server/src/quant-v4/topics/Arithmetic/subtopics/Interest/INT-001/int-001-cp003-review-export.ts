import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP003_QL_IDS,
  generateIntCp003Question,
  type IntCp003GeneratedQuestion,
  type IntCp003QlId,
} from "./int-001-cp003-final-runtime";
import { buildIntCp003EditorialReview } from "./cp003-editorial-review";
import type { IntCp003EditorialReviewQuestion } from "./cp003-editorial-base";

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
    const editorial = buildIntCp003EditorialReview(question);
    if (byPosition.has(question.correctIndex) || globallySelectedStems.has(editorial.stem)) continue;
    byPosition.set(question.correctIndex, question);
    globallySelectedStems.add(editorial.stem);
  }
  if (byPosition.size !== 4) throw new Error(`${qlId}: could not select four distinct balanced review rows.`);
  return [0, 1, 2, 3].map((position) => byPosition.get(position)!);
}

function assertEditorialAlignment(question: IntCp003EditorialReviewQuestion): void {
  if (question.options.length !== 4 || question.explanation.optionAnalysis.length !== 4) {
    throw new Error(`${question.qlId}: editorial options and analyses must both contain four rows.`);
  }
  question.options.forEach((option, index) => {
    if (!question.explanation.optionAnalysis[index]!.includes(option)) {
      throw new Error(`${question.qlId}: option ${index + 1} is not aligned with its analysis.`);
    }
  });
  question.explanation.optionAnalysis.forEach((analysis, index) => {
    if (index !== question.correctIndex && !/\[[A-Z0-9_]+_TRAP\]/u.test(analysis)) {
      throw new Error(`${question.qlId}: option ${index + 1} has no diagnostic trap code.`);
    }
  });
  const mathematicalText = [
    question.stem,
    ...question.options,
    question.explanation.coreConcept,
    ...question.explanation.stepByStepSolution,
    question.explanation.examSpeedShortcut,
    ...question.explanation.optionAnalysis,
  ].join("\n");
  if (!mathematicalText.includes("$")) throw new Error(`${question.qlId}: MathJax delimiters are missing.`);
  if (question.explanation.stepByStepSolution.length < 3) throw new Error(`${question.qlId}: worked derivation is too short.`);
  if (/^Rule$|^Worked solution$|^Wrong-option analysis$/mu.test(mathematicalText)) {
    throw new Error(`${question.qlId}: legacy explanation headers leaked.`);
  }
}

const sourceRows = INT_CP003_QL_IDS.flatMap(selectRows);
const rows = sourceRows.map(buildIntCp003EditorialReview);
rows.forEach(assertEditorialAlignment);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp003-annual-compound-review-pack");
mkdirSync(outputDirectory, { recursive: true });

const questionLines: string[] = ["# INT-CP-003 Annual Compound Interest — Remediated English Review Questions", ""];
const answerLines: string[] = ["# INT-CP-003 Annual Compound Interest — Remediated Review Answers", ""];
const combinedLines: string[] = [
  "# INT-CP-003 Annual Compound Interest — Remediated Questions and Answers",
  "",
  "> Editorial status: REMEDIATED_REVIEW_CANDIDATE. Staging and publication remain locked.",
  "",
];

rows.forEach((question, index) => {
  const title = `## Question ${index + 1} (\`${question.qlId}\`)`;
  const optionLines = question.options.map((option, optionIndex) =>
    `${String.fromCharCode(65 + optionIndex)}. ${option}${optionIndex === question.correctIndex ? "  **✓**" : ""}`,
  );
  questionLines.push(title, "", question.stem, "", ...optionLines.map((line) => line.replace("  **✓**", "")), "");

  const explanationLines = [
    `**Correct Answer:** ${question.correctAnswer}`,
    "",
    "📌 **Core Concept**",
    "",
    question.explanation.coreConcept,
    "",
    "📝 **Step-by-Step Solution**",
    "",
    ...question.explanation.stepByStepSolution.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
    "⚡ **Exam Speed Shortcut**",
    "",
    question.explanation.examSpeedShortcut,
    "",
    "⚠️ **Common Student Traps & Option Analysis**",
    "",
    ...question.explanation.optionAnalysis.map((analysis) => `- ${analysis}`),
    "",
  ];
  answerLines.push(`## Answer ${index + 1} (\`${question.qlId}\`)`, "", ...explanationLines);
  combinedLines.push(title, "", question.stem, "", ...optionLines, "", ...explanationLines, "---", "");
});

writeFileSync(join(outputDirectory, "int-cp003-56-review-questions.md"), `${questionLines.join("\n")}\n`);
writeFileSync(join(outputDirectory, "int-cp003-56-review-answers.md"), `${answerLines.join("\n")}\n`);
writeFileSync(join(outputDirectory, "int-cp003-56-review-combined.md"), `${combinedLines.join("\n")}\n`);
writeFileSync(join(outputDirectory, "int-cp003-56-review-data.json"), `${JSON.stringify(stable(rows), null, 2)}\n`);

const checklistHeader = [
  "review_number", "ql_id", "solve_contract", "difficulty", "representation",
  "answer_position", "stem", "editorial_status",
].map(csv).join(",");
const checklistRows = rows.map((question, index) => [
  index + 1,
  question.qlId,
  question.solveContract,
  question.difficulty,
  question.representation,
  question.correctIndex + 1,
  question.stem,
  question.editorialStatus,
].map(csv).join(","));
writeFileSync(join(outputDirectory, "int-cp003-56-review-checklist.csv"), `${[checklistHeader, ...checklistRows].join("\n")}\n`);

const distinctStems = new Set(rows.map((question) => question.stem)).size;
const answerPositions = [0, 1, 2, 3].map((position) => rows.filter((question) => question.correctIndex === position).length);
const wrongOptionAnalyses = rows.reduce((count, question) => count + question.options.length - 1, 0);
const trapTaggedWrongOptions = rows.reduce((count, question) => count + question.explanation.optionAnalysis.filter(
  (analysis, index) => index !== question.correctIndex && /\[[A-Z0-9_]+_TRAP\]/u.test(analysis),
).length, 0);
const optionAnalysisAlignmentChecks = rows.reduce((count, question) => count + question.options.filter(
  (option, index) => question.explanation.optionAnalysis[index]!.includes(option),
).length, 0);

if (distinctStems !== rows.length) throw new Error(`Review pack has ${distinctStems}/${rows.length} distinct stems.`);
if (answerPositions.some((count) => count !== INT_CP003_QL_IDS.length)) throw new Error(`Review positions are unbalanced: ${answerPositions.join("/")}.`);
if (trapTaggedWrongOptions !== wrongOptionAnalyses) throw new Error("Not every wrong option has a diagnostic trap tag.");
if (optionAnalysisAlignmentChecks !== rows.length * 4) throw new Error("Option-analysis alignment is incomplete.");

const summary = {
  questions: rows.length,
  qls: INT_CP003_QL_IDS.length,
  samplesPerQl: 4,
  distinctStems,
  answerPositions,
  editorialStatus: "REMEDIATED_REVIEW_CANDIDATE",
  schema: [
    "CORE_CONCEPT",
    "STEP_BY_STEP_SOLUTION",
    "EXAM_SPEED_SHORTCUT",
    "COMMON_STUDENT_TRAPS_AND_OPTION_ANALYSIS",
  ],
  mathJaxReadyQuestions: rows.filter((question) => question.stem.includes("$")).length,
  optionAnalysisAlignmentChecks,
  wrongOptionAnalyses,
  trapTaggedWrongOptions,
  combinedReviewFile: "int-cp003-56-review-combined.md",
  lifecycle: {
    stagingStatus: "NOT_STAGED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
writeFileSync(join(outputDirectory, "int-cp003-review-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_REMEDIATED_REVIEW_EXPORT");
