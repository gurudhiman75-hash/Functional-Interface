import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateClsCp005Wave2QualityQuestion } from "./wave2-quality-runtime";
import {
  CLS_CP005_WAVE2_PROTOTYPES,
  CLS_CP005_WAVE2_VALID_COUNTS,
} from "./wave2-runtime";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp005-wave2-review");
const questions = CLS_CP005_WAVE2_PROTOTYPES.flatMap((prototype, prototypeIndex) =>
  Array.from({ length: 4 }, (_, sampleIndex) => {
    const seed = 40_000 + prototypeIndex * 211 + sampleIndex * 37;
    return generateClsCp005Wave2QualityQuestion(
      prototype.prototypeId,
      seed,
      sampleIndex === 3 ? 5 : 4,
    );
  }),
);

const prototypeById = new Map(CLS_CP005_WAVE2_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]));
const markdown = [
  "# CLS-CP-005 Source-Gap Wave 2 English Review — Answer-Aware V2",
  "",
  `Questions: ${questions.length}`,
  `Temporary Wave 2 prototypes: ${CLS_CP005_WAVE2_PROTOTYPES.length}`,
  `Source-backed candidate rules: ${Object.keys(CLS_CP005_WAVE2_VALID_COUNTS).length}`,
  "Arities: pair, triple and four-number group",
  "Permanent QLs: 0",
  "Locale: en-IN",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  "Every state is independently re-solved against the combined Wave 1 and Wave 2 rule universe. Each option explanation uses the approved Simple Option Explanations V3 sequence: plain-language reason, supporting calculation, and a clear match/failure status.",
  "",
  "Answer-aware presentation rules: the answer's maximum value and total must each remain within a four-times ratio of the common-option median; excessive overall scale spans are rejected and regenerated.",
  "",
  "## Governed valid-tuple inventory",
  "",
  "```json",
  JSON.stringify(CLS_CP005_WAVE2_VALID_COUNTS, null, 2),
  "```",
  "",
  ...questions.flatMap((question, index) => {
    const prototype = prototypeById.get(question.prototypeId)!;
    return [
      `## ${index + 1}. ${question.prototypeId} · ${question.difficulty}`,
      "",
      `**Prototype:** ${prototype.title}`,
      "",
      `**Task:** ${question.task}`,
      "",
      `**Rule family:** ${question.intendedRuleId}`,
      "",
      `**Question:** ${question.stem}`,
      "",
      ...(question.referenceTuple ? [`**Reference set:** (${question.referenceTuple.join(", ")})`, ""] : []),
      "**Options:**",
      "",
      ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
      "",
      `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
      "",
      "### Core Rule",
      "",
      question.explanation.coreConcept.join(" "),
      "",
      "### Check the Options — Simple Teacher Explanations V3",
      "",
      ...question.evidenceByOption.map((evidence, evidenceIndex) => `${String.fromCharCode(65 + evidenceIndex)}. ${evidence}`),
      "",
      "### Step-by-Step Conclusion",
      "",
      ...question.explanation.stepByStep.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
      "",
      "### Exam Speed Shortcut",
      "",
      question.explanation.examSpeedShortcut.join(" "),
      "",
      "### Common Trap",
      "",
      question.explanation.commonTrapWarning.join(" "),
      "",
      "<details>",
      "<summary>Reviewer metadata</summary>",
      "",
      `- Seed: ${question.seed}`,
      `- Source prototype seed: ${question.metadata.sourcePrototypeSeed}`,
      `- Runtime: ${question.metadata.runtimeVersion}`,
      `- Editorial: ${question.metadata.editorialVersion}`,
      `- Quality: ${question.metadata.qualityVersion}`,
      `- Source-gap registry: ${question.metadata.sourceGapRegistryVersion}`,
      `- Intended value: ${question.intendedRuleValue}`,
      `- Arity: ${question.arity}`,
      `- Option count: ${question.options.length}`,
      `- Internal state-search attempt: ${question.metadata.sourceAttempt}`,
      `- Expanded ambiguity result: ${question.expandedAmbiguityAudit.result}`,
      `- Expanded supports: ${question.expandedAmbiguityAudit.supports.length}`,
      `- Overall maximum-value ratio: ${question.presentationQualityAudit.maximumValueRatio.toFixed(2)}`,
      `- Overall tuple-total ratio: ${question.presentationQualityAudit.tupleTotalRatio.toFixed(2)}`,
      `- Answer-to-common maximum ratio: ${question.presentationQualityAudit.answerMaximumRatio.toFixed(2)}`,
      `- Answer-to-common total ratio: ${question.presentationQualityAudit.answerTotalRatio.toFixed(2)}`,
      `- Lifecycle: ${question.lifecycle.reviewStatus}`,
      "",
      "</details>",
      "",
      "---",
      "",
    ];
  }),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "cls-cp005-source-gap-wave2-review.json"), `${JSON.stringify(questions, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDir, "cls-cp005-source-gap-wave2-review.md"), `${markdown}\n`, "utf8");

console.log("CLS-CP-005 answer-aware source-gap Wave 2 review written.", {
  outputDir,
  questions: questions.length,
  prototypes: CLS_CP005_WAVE2_PROTOTYPES.length,
  rules: [...new Set(questions.map((question) => question.intendedRuleId))].sort(),
  tasks: [...new Set(questions.map((question) => question.task))].sort(),
  arities: [...new Set(questions.map((question) => question.arity))].sort(),
  difficulties: [...new Set(questions.map((question) => question.difficulty))].sort(),
  optionCounts: [...new Set(questions.map((question) => question.options.length))].sort(),
  maximumInternalSourceAttempt: Math.max(...questions.map((question) => question.metadata.sourceAttempt)),
  maximumQualityAttempt: Math.max(...questions.map((question) => Math.floor((question.metadata.sourcePrototypeSeed - question.seed) / 10_007))),
  maximumAnswerMaximumRatio: Math.max(...questions.map((question) => question.presentationQualityAudit.answerMaximumRatio)),
  maximumAnswerTotalRatio: Math.max(...questions.map((question) => question.presentationQualityAudit.answerTotalRatio)),
});
