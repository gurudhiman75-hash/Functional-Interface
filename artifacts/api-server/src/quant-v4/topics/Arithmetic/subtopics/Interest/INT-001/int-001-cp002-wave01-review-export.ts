import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateIntCp002Wave01Prototype } from "./cp002-wave01-runtime";
import {
  INT_CP002_WAVE01_PROTOTYPE_IDS,
  type IntCp002Wave01GeneratedPrototype,
} from "./cp002-wave01-types";

const OUTPUT_DIR = join(process.cwd(), "dist/quant-v4/int-cp002-wave01-review-pack");
const SAMPLES_PER_PROTOTYPE = 8;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

rmSync(OUTPUT_DIR, { recursive: true, force: true });
mkdirSync(OUTPUT_DIR, { recursive: true });

const rows: IntCp002Wave01GeneratedPrototype[] = [];
for (const prototypeId of INT_CP002_WAVE01_PROTOTYPE_IDS) {
  for (let sample = 1; sample <= SAMPLES_PER_PROTOTYPE; sample += 1) {
    rows.push(generateIntCp002Wave01Prototype({
      prototypeId,
      seed: `int-cp002-wave01-review:${prototypeId}:${sample}`,
    }));
  }
}

const questions: string[] = [
  "# INT-CP-002 Wave 1 — English Review Questions",
  "",
  "> Provisional executable-discovery corpus. No permanent QL IDs or frozen solve contracts.",
  "",
];
const answers: string[] = [
  "# INT-CP-002 Wave 1 — English Answers and Explanations",
  "",
  "> Every solution shows the governing rule, actual numerical substitution, intermediate calculation, shortcut, verification and all wrong-option analysis.",
  "",
];
const checklist = [
  "review_number,prototype_number,sample_number,difficulty,correct_option,stem_ok,values_substituted,arithmetic_clear,shortcut_ok,wrong_options_explained,editorial_notes",
];

rows.forEach((question, index) => {
  const reviewNumber = index + 1;
  const prototypeNumber = INT_CP002_WAVE01_PROTOTYPE_IDS.indexOf(question.prototypeId) + 1;
  const sampleNumber = (index % SAMPLES_PER_PROTOTYPE) + 1;
  questions.push(`## Question ${reviewNumber}`);
  questions.push("");
  questions.push(question.stem);
  questions.push("");
  question.options.forEach((option, optionIndex) => {
    questions.push(`${optionLetter(optionIndex)}. ${option}`);
  });
  questions.push("");

  answers.push(`## Question ${reviewNumber}`);
  answers.push("");
  answers.push(`**Correct option:** ${optionLetter(question.correctIndex)} — ${question.options[question.correctIndex]}`);
  answers.push("");
  answers.push("### 📌 Main Rule");
  answers.push("");
  answers.push(question.explanation.mainRule);
  answers.push("");
  answers.push("### 📝 Step-by-Step Solution");
  answers.push("");
  question.explanation.workedSteps.forEach((step, stepIndex) => {
    answers.push(`${stepIndex + 1}. ${step}`);
  });
  answers.push("");
  answers.push("### ⚡ Exam Speed Shortcut");
  answers.push("");
  answers.push(question.explanation.examShortcut);
  answers.push("");
  answers.push("### ✅ Verification");
  answers.push("");
  answers.push(question.explanation.verification);
  answers.push("");
  answers.push(`**Conclusion:** ${question.explanation.conclusion}`);
  answers.push("");
  answers.push("### ⚠️ Common Traps and Wrong Options");
  answers.push("");
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
  ].join(","));
});

const learnerMarkdown = `${questions.join("\n")}\n${answers.join("\n")}`;
if (/<sub>Trace:|INT-QL-|INT-CP002-PROT-|int-cp002-wave01-review:|requestedSeed|effectiveSeed|generationAttempts|FIND_/u.test(learnerMarkdown)) {
  throw new Error("Internal trace or contract metadata leaked into Wave 1 learner Markdown.");
}

const summary = {
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-002",
  exportId: "INT-CP-002-WAVE01-ENGLISH-REVIEW-PACK",
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
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
};

writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave01-64-review-questions.md"), `${questions.join("\n")}\n`);
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave01-64-review-answers.md"), `${answers.join("\n")}\n`);
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave01-64-review-data.json"), stable(rows));
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave01-64-review-checklist.csv"), `${checklist.join("\n")}\n`);
writeFileSync(join(OUTPUT_DIR, "int-001-cp002-wave01-review-summary.json"), stable(summary));
writeFileSync(join(OUTPUT_DIR, "README.md"), `# INT-CP-002 Wave 1 Review Pack\n\n- 64 English questions\n- 8 samples from each of 8 provisional ancestries\n- separate questions and calculation-rich answers\n- machine-readable trace data and editorial checklist\n- no permanent QL allocation\n- no Question Studio registration or delivery activation\n`);

console.log(stable(summary));
console.log("PASS_INT_CP002_WAVE01_REVIEW_EXPORT");
