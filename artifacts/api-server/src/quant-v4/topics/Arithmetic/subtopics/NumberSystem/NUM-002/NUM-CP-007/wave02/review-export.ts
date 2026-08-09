import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  generateNumCp007Wave02Package,
  NUM_CP007_WAVE02_PROTOTYPE_IDS,
} from "./runtime.ts";

const outputDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDir, { recursive: true });

const questions = NUM_CP007_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId) =>
  [17, 43, 79].map((seed) => generateNumCp007Wave02Package(prototypeId, seed)),
);

const jsonPath = resolve(outputDir, "num-002-cp007-wave02-review.json");
const csvPath = resolve(outputDir, "num-002-cp007-wave02-review.csv");
const mdPath = resolve(outputDir, "num-002-cp007-wave02-review.md");

writeFileSync(jsonPath, JSON.stringify(questions, null, 2));

const csvEscape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvRows = [
  ["prototypeId", "seed", "difficulty", "answerSemantic", "stem", "options", "answer", "concept", "strategy", "steps"].map(csvEscape).join(","),
  ...questions.map((question) =>
    [
      question.temporaryPrototypeId,
      question.seed,
      question.difficulty,
      question.answerSemantic,
      question.stem,
      question.options.map((option) => option.value).join(" | "),
      question.canonicalAnswer,
      question.explanation.coreConcept,
      question.explanation.strategy,
      question.explanation.steps.join(" | "),
    ].map(csvEscape).join(","),
  ),
];
writeFileSync(csvPath, csvRows.join("\n"));

const md = questions.map((question, index) => [
  `## ${index + 1}. ${question.temporaryPrototypeId} · seed ${question.seed} · ${question.difficulty}`,
  "",
  question.stem,
  "",
  ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option.value}`),
  "",
  `**Answer:** ${question.canonicalAnswer}`,
  "",
  `**Concept:** ${question.explanation.coreConcept}`,
  "",
  `**Strategy:** ${question.explanation.strategy}`,
  "",
  ...question.explanation.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
  "",
].join("\n")).join("\n");
writeFileSync(mdPath, md);

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_WAVE02_REVIEW_EXPORT",
  temporaryPrototypeCount: NUM_CP007_WAVE02_PROTOTYPE_IDS.length,
  questionsPerPrototype: 3,
  exportedQuestions: questions.length,
  permanentQlCount: 0,
  jsonPath,
  csvPath,
  mdPath,
}, null, 2));
