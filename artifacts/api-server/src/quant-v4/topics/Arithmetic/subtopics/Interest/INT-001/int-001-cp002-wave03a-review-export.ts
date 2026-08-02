import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { assertIntCp002Wave01MathJaxIntegrity } from "./cp002-wave01-runtime-v2";
import { generateIntCp002Wave03aQuestion } from "./cp002-wave03a-runtime";
import {
  INT_CP002_WAVE03A_PROTOTYPE_IDS,
  type IntCp002Wave03aQuestion,
} from "./cp002-wave03a-types";

const OUTPUT_DIR = join(process.cwd(), "dist/quant-v4/int-cp002-wave03a-review-pack");
const SAMPLES_PER_PROTOTYPE = 5;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function learnerText(question: IntCp002Wave03aQuestion): string {
  return [
    question.stem,
    ...question.options,
    question.explanation.mainRule,
    ...question.explanation.workedSteps,
    question.explanation.examShortcut,
    question.explanation.verification,
    question.explanation.conclusion,
    ...question.explanation.trapAnalysis.map((item) => item.explanation),
  ].join("\n");
}

rmSync(OUTPUT_DIR, { recursive: true, force: true });
mkdirSync(OUTPUT_DIR, { recursive: true });

const rows: IntCp002Wave03aQuestion[] = [];
for (const prototypeId of INT_CP002_WAVE03A_PROTOTYPE_IDS) {
  for (let sample = 1; sample <= SAMPLES_PER_PROTOTYPE; sample += 1) {
    const question = generateIntCp002Wave03aQuestion({
      prototypeId,
      seed: `int-cp002-wave03a-review:${prototypeId}:${sample}`,
    });
    assertIntCp002Wave01MathJaxIntegrity(
      learnerText(question),
      `${prototypeId}/review/${sample}`,
    );
    rows.push(question);
  }
}

const questions: string[] = [
  "# INT-CP-002 Wave 3A — English Edge Review Questions",
  "",
  "> Provisional executable-discovery corpus. Permanent QL allocation remains prohibited.",
  "",
];
const answers: string[] = [
  "# INT-CP-002 Wave 3A — English Edge Answers and Explanations",
  "",
  "> Each solution shows the complete multi-contribution or multi-event state, exact substitution, intermediate arithmetic, verification and all wrong-option analysis.",
  "",
];
const checklist = [
  "review_number,prototype_number,sample_number,difficulty,answer_semantic,correct_option,stem_ok,tex_ok,edge_state_clear,values_substituted,arithmetic_complete,verification_ok,wrong_options_explained,ownership_notes,editorial_notes",
];

rows.forEach((question, index) => {
  const reviewNumber = index + 1;
  const prototypeNumber = INT_CP002_WAVE03A_PROTOTYPE_IDS.indexOf(question.prototypeId) + 1;
  const sampleNumber = (index % SAMPLES_PER_PROTOTYPE) + 1;

  questions.push(`## Question ${reviewNumber}`, "", question.stem, "");
  question.options.forEach((option, optionIndex) => {
    questions.push(`${optionLetter(optionIndex)}. ${option}`);
  });
  questions.push("");

  answers.push(`## Question ${reviewNumber}`, "");
  answers.push(`**Correct option:** ${optionLetter(question.correctIndex)} — ${question.options[question.correctIndex]}`, "");
  answers.push("### 📌 Main Rule", "", question.explanation.mainRule, "");
  answers.push("### 📝 Step-by-Step Solution", "");
  question.explanation.workedSteps.forEach((step, stepIndex) => {
    answers.push(`${stepIndex + 1}. ${step}`);
  });
  answers.push("", "### ⚡ Exam Speed Shortcut", "", question.explanation.examShortcut, "");
  answers.push("### ✅ Numerical Verification", "", question.explanation.verification, "");
  answers.push(`**Conclusion:** ${question.explanation.conclusion}`, "");
  answers.push("### ⚠️ Common Traps and Wrong Options", "");
  question.explanation.trapAnalysis.forEach((trap) => {
    answers.push(`- **Option ${optionLetter(trap.optionNumber - 1)}:** ${trap.explanation}`);
  });
  answers.push("");

  checklist.push([
    reviewNumber,
    prototypeNumber,
    sampleNumber,
    question.difficulty,
    question.answerSemantic,
    optionLetter(question.correctIndex),
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ].join(","));
});

const learnerMarkdown = `${questions.join("\n")}\n${answers.join("\n")}`;
assertIntCp002Wave01MathJaxIntegrity(learnerMarkdown, "Wave 3A review Markdown");
if (/<sub>Trace:|INT-QL-|INT-CP002-W03A-|int-cp002-wave03a-review:|requestedSeed|effectiveSeed|generationAttempts|FIND_/u.test(learnerMarkdown)) {
  throw new Error("Internal trace or contract metadata leaked into Wave 3A learner Markdown.");
}
if (/[\u0000-\u0008\u0009\u000B\u000C\u000E-\u001F]/u.test(learnerMarkdown)) {
  throw new Error("Control character leaked into Wave 3A learner Markdown.");
}

const summary = {
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-002",
  exportId: "INT-CP-002-WAVE03A-EDGE-REVIEW-PACK",
  questionCount: rows.length,
  provisionalPrototypeCount: INT_CP002_WAVE03A_PROTOTYPE_IDS.length,
  samplesPerPrototype: SAMPLES_PER_PROTOTYPE,
  executableGapRecordsClosed: 8,
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  distinctStems: new Set(rows.map((item) => item.stem)).size,
  answerPositions: [0, 1, 2, 3].map((position) => rows.filter((item) => item.correctIndex === position).length),
  answerSemantics: [...new Set(rows.map((item) => item.answerSemantic))],
  minimumWorkedSteps: Math.min(...rows.map((item) => item.explanation.workedSteps.length)),
  totalWorkedSteps: rows.reduce((total, item) => total + item.explanation.workedSteps.length, 0),
  allQuestionsValidated: rows.every((item) => item.validation.ok),
  learnerMarkdownTraceCount: 0,
  controlCharacterCount: 0,
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
};

writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave03a-70-review-questions.md"), `${questions.join("\n")}\n`);
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave03a-70-review-answers.md"), `${answers.join("\n")}\n`);
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave03a-70-review-data.json"), stable(rows));
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave03a-70-review-checklist.csv"), `${checklist.join("\n")}\n`);
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave03a-review-summary.json"), stable(summary));
writeFileSync(join(OUTPUT_DIR, "README.md"), `# INT-CP-002 Wave 3A Review Pack\n\n- 70 English edge questions\n- 5 samples from each of 14 provisional edge modes\n- 8 executable gap records covered\n- separate question and calculation-rich answer files\n- JSON trace data and editorial checklist\n- permanent QL allocation remains prohibited\n- no Question Studio registration or delivery activation\n`);

console.log(stable(summary));
console.log("PASS_INT_CP002_WAVE03A_REVIEW_EXPORT");
