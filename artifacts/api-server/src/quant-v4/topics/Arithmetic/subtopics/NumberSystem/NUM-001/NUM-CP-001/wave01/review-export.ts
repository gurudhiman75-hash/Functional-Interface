import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateNumCp001Wave01Package,
  NUM_CP001_WAVE01_PROTOTYPE_IDS,
} from "./runtime-authority";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const reviewSeeds = [1, 2, 3, 4] as const;
const rows = NUM_CP001_WAVE01_PROTOTYPE_IDS.flatMap((prototypeId) =>
  reviewSeeds.map((seed) => generateNumCp001Wave01Package(prototypeId, seed)),
);

const jsonPath = resolve(outputDirectory, "num-001-cp001-wave01-review.json");
const markdownPath = resolve(outputDirectory, "num-001-cp001-wave01-review.md");

writeFileSync(jsonPath, `${JSON.stringify({
  status: "NUM_CP001_WAVE01_REVIEW_CANDIDATES",
  permanentQlCount: 0,
  temporaryPrototypeCount: NUM_CP001_WAVE01_PROTOTYPE_IDS.length,
  reviewQuestionCount: rows.length,
  rows,
}, null, 2)}\n`, "utf8");

const markdown = [
  "# NUM-CP-001 Wave 01 — English Review Pack",
  "",
  "**Lifecycle:** executable discovery only; no permanent QLs or production routes.",
  "",
  ...rows.flatMap((pkg, index) => [
    `## ${index + 1}. ${pkg.temporaryPrototypeId} — seed ${pkg.seed} — ${pkg.difficulty}`,
    "",
    `**Answer semantic:** \`${pkg.answerSemantic}\``,
    "",
    pkg.stem,
    "",
    ...pkg.options.map((option, optionIndex) =>
      `${String.fromCharCode(65 + optionIndex)}. ${option.value}${option.isCorrect ? " **✓**" : ""}`,
    ),
    "",
    `**Correct answer:** ${pkg.canonicalAnswer}`,
    "",
    "### Core Concept",
    "",
    ...pkg.explanation.coreConcept.map((line) => `- ${line}`),
    "",
    "### Given Data and Strategy",
    "",
    ...pkg.explanation.givenDataAndStrategy.map((line) => `- ${line}`),
    "",
    "### Complete Step-by-Step Solution",
    "",
    ...pkg.explanation.stepByStep.map((line, stepIndex) => `${stepIndex + 1}. ${line}`),
    "",
    "### Exam Speed Method",
    "",
    ...pkg.explanation.examSpeedMethod.map((line) => `- ${line}`),
    "",
    "### Common Traps",
    "",
    ...pkg.explanation.commonTraps.map((line) => `- ${line}`),
    "",
    `**Final answer:** ${pkg.explanation.finalAnswer}`,
    "",
    "<details><summary>Reviewer-only exact state</summary>",
    "",
    "```json",
    JSON.stringify({
      hiddenState: pkg.hiddenState,
      canonicalAnswer: pkg.canonicalAnswer,
      verifierAnswer: pkg.verifierAnswer,
      sourceAncestry: pkg.sourceAncestry,
      prototypeAncestry: pkg.prototypeAncestry,
      mathematicalFingerprint: pkg.mathematicalFingerprint,
      lifecycle: pkg.lifecycle,
    }, null, 2),
    "```",
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

writeFileSync(markdownPath, `${markdown}\n`, "utf8");

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE01_REVIEW_EXPORT",
  jsonPath,
  markdownPath,
  reviewQuestionCount: rows.length,
  temporaryPrototypeCount: NUM_CP001_WAVE01_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
}, null, 2));