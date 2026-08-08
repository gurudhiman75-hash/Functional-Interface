import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateNumCp006Wave01Package } from "./runtime.ts";
import { NUM_CP006_WAVE01_PROTOTYPE_IDS } from "./types.ts";

const questions = NUM_CP006_WAVE01_PROTOTYPE_IDS.flatMap((prototypeId) =>
  [1, 2, 3].map((seed) => generateNumCp006Wave01Package(prototypeId, seed)));

const outputDirectory = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outputDirectory, { recursive: true });

writeFileSync(
  join(outputDirectory, "num-001-cp006-wave01-review.json"),
  JSON.stringify(questions, null, 2),
);

const csvRows = [
  ["prototypeId", "seed", "difficulty", "stem", "optionA", "optionB", "optionC", "optionD", "correctAnswer", "explanation"],
  ...questions.map((question) => [
    question.temporaryPrototypeId,
    question.seed,
    question.difficulty,
    question.stem,
    ...question.options.map((option) => option.value),
    question.canonicalAnswer,
    [
      question.explanation.coreConcept,
      question.explanation.givenDataAndStrategy,
      ...question.explanation.stepByStep,
      question.explanation.examSpeedMethod,
      question.explanation.finalAnswer,
    ].join(" "),
  ]),
];
const escapeCsv = (value: unknown): string => `"${String(value).replaceAll('"', '""')}"`;
writeFileSync(
  join(outputDirectory, "num-001-cp006-wave01-review.csv"),
  csvRows.map((row) => row.map(escapeCsv).join(",")).join("\n"),
);

const markdown = [
  "# NUM-CP-006 Wave 01 English Review",
  "",
  `Temporary prototypes: ${NUM_CP006_WAVE01_PROTOTYPE_IDS.length}`,
  `Review questions: ${questions.length}`,
  "Permanent QLs: 0",
  "",
  ...questions.flatMap((question, index) => [
    `## ${index + 1}. ${question.temporaryPrototypeId} / seed ${question.seed}`,
    "",
    `**Difficulty:** ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...question.options.map((option, optionIndex) =>
      `${String.fromCharCode(65 + optionIndex)}. ${option.value}${option.isCorrect ? " ✅" : ""}`),
    "",
    `**Answer:** ${question.canonicalAnswer}`,
    "",
    `**Concept:** ${question.explanation.coreConcept}`,
    "",
    `**Strategy:** ${question.explanation.givenDataAndStrategy}`,
    "",
    ...question.explanation.stepByStep.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
    `**Speed method:** ${question.explanation.examSpeedMethod}`,
    "",
  ]),
].join("\n");
writeFileSync(join(outputDirectory, "num-001-cp006-wave01-review.md"), markdown);

console.log(JSON.stringify({
  status: "PASS_NUM_CP006_WAVE01_REVIEW_EXPORT",
  temporaryPrototypeCount: NUM_CP006_WAVE01_PROTOTYPE_IDS.length,
  reviewQuestionCount: questions.length,
  permanentQlCount: 0,
  formats: ["JSON", "CSV", "MARKDOWN"],
}, null, 2));
