import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateNumCp005Wave02ProvenPackage } from "./runtime-proven";
import { NUM_CP005_WAVE02_PROTOTYPE_IDS } from "./types";

const samplesPerPrototype = 3;
const records = NUM_CP005_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId, prototypeIndex) =>
  Array.from({ length: samplesPerPrototype }, (_unused, sampleIndex) =>
    generateNumCp005Wave02ProvenPackage(prototypeId, 1 + sampleIndex + prototypeIndex * 7)),
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "num-001-cp005-wave02-review.json");
const markdownPath = resolve(outputDirectory, "num-001-cp005-wave02-review.md");

writeFileSync(jsonPath, `${JSON.stringify({
  status: "NUM_CP005_WAVE02_REVIEW_READY",
  checkpointId: "NUM-CP-005",
  temporaryPrototypeCount: NUM_CP005_WAVE02_PROTOTYPE_IDS.length,
  samplesPerPrototype,
  reviewQuestionCount: records.length,
  permanentQlCount: 0,
  records,
}, null, 2)}\n`, "utf8");

const markdown = [
  "# NUM-CP-005 Wave 02 — Aggregate and Inverse Review",
  "",
  "**Status:** executable discovery only; permanent QLs remain zero.",
  "",
  `**Temporary prototypes:** ${NUM_CP005_WAVE02_PROTOTYPE_IDS.length}`,
  "",
  `**Review questions:** ${records.length}`,
  "",
  "---",
  "",
  ...records.flatMap((record, index) => [
    `## ${index + 1}. ${record.temporaryPrototypeId}`,
    "",
    `**Difficulty:** ${record.difficulty}`,
    "",
    `**Answer semantic:** ${record.answerSemantic}`,
    "",
    record.stem,
    "",
    ...record.options.map((option, optionIndex) =>
      `${String.fromCharCode(65 + optionIndex)}. ${option.value}`),
    "",
    `**Correct answer:** ${String.fromCharCode(65 + record.correctIndex)}. ${record.canonicalAnswer}`,
    "",
    "### Main rule",
    "",
    record.explanation.coreConcept,
    "",
    "### Steps",
    "",
    ...record.explanation.stepByStep.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
    `**Exam-speed method:** ${record.explanation.examSpeedMethod}`,
    "",
    "### Wrong-option analysis",
    "",
    ...record.options.filter((option) => !option.isCorrect)
      .map((option) => `- **${option.value}** — ${option.analysis} (\`${option.misconceptionId}\`)`),
    "",
    `**Final answer:** ${record.explanation.finalAnswer}`,
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_WAVE02_REVIEW_EXPORT",
  temporaryPrototypeCount: NUM_CP005_WAVE02_PROTOTYPE_IDS.length,
  reviewQuestionCount: records.length,
  permanentQlCount: 0,
  jsonPath,
  markdownPath,
}, null, 2));
