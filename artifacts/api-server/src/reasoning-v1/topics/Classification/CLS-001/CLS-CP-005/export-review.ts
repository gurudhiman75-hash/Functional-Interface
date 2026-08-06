import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateClsCp005QualityQuestion } from "./quality-runtime";
import { CLS_CP005_PROTOTYPES } from "./relation-registry";
import { displayClsCp005Tuple } from "./tuple-domain";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp005-review");
const questions = CLS_CP005_PROTOTYPES.flatMap((prototype, prototypeIndex) =>
  Array.from({ length: 3 }, (_, sampleIndex) => {
    const seed = 20_000 + prototypeIndex * 101 + sampleIndex * 29;
    return generateClsCp005QualityQuestion(
      prototype.prototypeId,
      seed,
      sampleIndex === 2 ? 5 : 4,
    );
  }),
);

const prototypeById = new Map(CLS_CP005_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]));
const markdown = [
  "# CLS-CP-005 English Discovery Review — Simple Option Explanations V3",
  "",
  `Questions: ${questions.length}`,
  `Temporary prototypes: ${CLS_CP005_PROTOTYPES.length}`,
  "Permanent QLs: 0",
  "Locale: en-IN",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  "Option explanation format: each option gives a short plain-language reason first, then the supporting MathJax calculation, followed by a clear match/fail result.",
  "",
  "Presentation-quality rules: no reversed/permuted duplicate options, no repeated number within a tuple, no permutation-only match to the reference set, and no answer made obvious by a much smaller or larger numerical scale.",
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
      `**Question:** ${question.stem}`,
      "",
      ...(question.referenceTuple
        ? [`**Reference set:** ${displayClsCp005Tuple(question.referenceTuple)}`, ""]
        : []),
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
      "### Check the Options",
      "",
      ...question.evidenceByOption.map((evidence, evidenceIndex) => `${String.fromCharCode(65 + evidenceIndex)}. ${evidence}`),
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
      `- Editorial version: ${question.metadata.editorialVersion}`,
      `- Option explanation version: ${question.metadata.optionExplanationVersion}`,
      `- Math format: ${question.metadata.mathFormat}`,
      `- Quality version: ${question.metadata.qualityVersion}`,
      `- Intended rule: ${question.intendedRuleId}`,
      `- Intended value: ${question.intendedRuleValue}`,
      `- Arity: ${question.arity}`,
      `- Option count: ${question.options.length}`,
      `- Competing supports: ${question.ambiguityAudit.candidateSupports.length}`,
      `- Ambiguity result: ${question.ambiguityAudit.result}`,
      `- Presentation result: ${question.presentationQualityAudit.result}`,
      `- Overall maximum-value ratio: ${question.presentationQualityAudit.maximumValueRatio.toFixed(2)}`,
      `- Overall tuple-total ratio: ${question.presentationQualityAudit.tupleTotalRatio.toFixed(2)}`,
      `- Answer-to-common maximum ratio: ${question.presentationQualityAudit.answerMaximumRatio.toFixed(2)}`,
      `- Answer-to-common total ratio: ${question.presentationQualityAudit.answerTotalRatio.toFixed(2)}`,
      `- Difficulty features: \`${JSON.stringify(question.difficultyFeatures)}\``,
      "",
      "</details>",
      "",
      "---",
      "",
    ];
  }),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "cls-cp005-english-discovery-review.json"), `${JSON.stringify(questions, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDir, "cls-cp005-english-discovery-review.md"), `${markdown}\n`, "utf8");

console.log("CLS-CP-005 simple-explanation English discovery review written.", {
  outputDir,
  questions: questions.length,
  prototypes: CLS_CP005_PROTOTYPES.length,
  tasks: [...new Set(questions.map((question) => question.task))].sort(),
  rules: [...new Set(questions.map((question) => question.intendedRuleId))].sort(),
  optionCounts: [...new Set(questions.map((question) => question.options.length))].sort(),
  difficulties: [...new Set(questions.map((question) => question.difficulty))].sort(),
  editorialVersion: questions[0]?.metadata.editorialVersion,
  optionExplanationVersion: questions[0]?.metadata.optionExplanationVersion,
  mathFormat: questions[0]?.metadata.mathFormat,
  maximumSourceAttempts: Math.max(...questions.map((question) => Math.floor((question.metadata.sourcePrototypeSeed - question.seed) / 10_007))),
  maximumAnswerMaximumRatio: Math.max(...questions.map((question) => question.presentationQualityAudit.answerMaximumRatio)),
  maximumAnswerTotalRatio: Math.max(...questions.map((question) => question.presentationQualityAudit.answerTotalRatio)),
});
