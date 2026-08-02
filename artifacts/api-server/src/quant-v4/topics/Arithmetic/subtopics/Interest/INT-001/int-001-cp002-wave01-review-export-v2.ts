import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertIntCp002Wave01MathJaxIntegrity,
  generateIntCp002Wave01PrototypeV2,
  INT_CP002_WAVE01_RUNTIME_V2,
} from "./cp002-wave01-runtime-v2";
import {
  INT_CP002_WAVE01_PROTOTYPE_IDS,
  type IntCp002Wave01GeneratedPrototype,
} from "./cp002-wave01-types";

const OUTPUT_DIR = join(process.cwd(), "dist/quant-v4/int-cp002-wave01-review-pack-v2");
const SAMPLES_PER_PROTOTYPE = 8;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function learnerText(question: IntCp002Wave01GeneratedPrototype): string {
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

const rows: IntCp002Wave01GeneratedPrototype[] = [];
for (const prototypeId of INT_CP002_WAVE01_PROTOTYPE_IDS) {
  for (let sample = 1; sample <= SAMPLES_PER_PROTOTYPE; sample += 1) {
    const question = generateIntCp002Wave01PrototypeV2({
      prototypeId,
      seed: `int-cp002-wave01-review-v2:${prototypeId}:${sample}`,
    });
    assertIntCp002Wave01MathJaxIntegrity(
      learnerText(question),
      `${prototypeId}/review/${sample}`,
    );
    rows.push(question);
  }
}

const questions: string[] = [
  "# INT-CP-002 Wave 1 V2 — English Review Questions",
  "",
  "> Provisional executable-discovery corpus. No permanent QL IDs or frozen solve contracts.",
  "",
];
const answers: string[] = [
  "# INT-CP-002 Wave 1 V2 — English Answers and Explanations",
  "",
  "> TeX-safe calculation-rich authority. Every solution includes actual numerical substitution, arithmetic, shortcut, verification and all wrong-option analysis.",
  "",
];
const checklist = [
  "review_number,prototype_number,sample_number,difficulty,correct_option,stem_ok,tex_rendering_ok,values_substituted,arithmetic_clear,shortcut_ok,wrong_options_explained,editorial_notes",
];

rows.forEach((question, index) => {
  const reviewNumber = index + 1;
  const prototypeNumber = INT_CP002_WAVE01_PROTOTYPE_IDS.indexOf(question.prototypeId) + 1;
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
  answers.push("### ✅ Verification", "", question.explanation.verification, "");
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
    optionLetter(question.correctIndex),
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
assertIntCp002Wave01MathJaxIntegrity(learnerMarkdown, "Wave 1 V2 review Markdown");
if (/<sub>Trace:|INT-QL-|INT-CP002-PROT-|int-cp002-wave01-review-v2:|requestedSeed|effectiveSeed|generationAttempts|FIND_/u.test(learnerMarkdown)) {
  throw new Error("Internal trace or contract metadata leaked into Wave 1 V2 learner Markdown.");
}

const summary = {
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-002",
  exportId: "INT-CP-002-WAVE01-ENGLISH-REVIEW-PACK-V2",
  runtimeId: INT_CP002_WAVE01_RUNTIME_V2.id,
  questionCount: rows.length,
  provisionalPrototypeCount: INT_CP002_WAVE01_PROTOTYPE_IDS.length,
  samplesPerPrototype: SAMPLES_PER_PROTOTYPE,
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  distinctStems: new Set(rows.map((item) => item.stem)).size,
  answerPositions: [0, 1, 2, 3].map((position) => rows.filter((item) => item.correctIndex === position).length),
  minimumWorkedSteps: Math.min(...rows.map((item) => item.explanation.workedSteps.length)),
  totalWorkedSteps: rows.reduce((total, item) => total + item.explanation.workedSteps.length, 0),
  allOptionsIndependentlyValidated: rows.every((item) => item.validation.ok),
  learnerMarkdownTraceCount: 0,
  controlCharacterCount: (learnerMarkdown.match(/[\u0000-\u0008\u0009\u000B\u000C\u000E-\u001F]/gu) ?? []).length,
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
};

writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave01-v2-64-review-questions.md"), `${questions.join("\n")}\n`);
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave01-v2-64-review-answers.md"), `${answers.join("\n")}\n`);
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave01-v2-64-review-data.json"), stable(rows));
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave01-v2-64-review-checklist.csv"), `${checklist.join("\n")}\n`);
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave01-v2-review-summary.json"), stable(summary));
writeFileSync(join(OUTPUT_DIR, "README.md"), `# INT-CP-002 Wave 1 V2 Review Pack\n\n- TeX-safe V2 explanation authority\n- 64 English questions\n- 8 samples from each of 8 provisional ancestries\n- separate questions and calculation-rich answers\n- machine-readable trace data and editorial checklist\n- no permanent QL allocation\n- no Question Studio registration or delivery activation\n`);

console.log(stable(summary));
console.log("PASS_INT_CP002_WAVE01_REVIEW_EXPORT_V2");
