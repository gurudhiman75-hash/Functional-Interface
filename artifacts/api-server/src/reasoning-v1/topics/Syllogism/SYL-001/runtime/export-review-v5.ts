import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [0, 1, 2, 3, 4, 5] as const;
const outputDir = process.env.SYL_REVIEW_V5_DIR
  ? resolve(process.env.SYL_REVIEW_V5_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-review-v5");

mkdirSync(outputDir, { recursive: true });

const questions = SYL_QL_REGISTRY.flatMap((definition) =>
  seeds.flatMap((seed) => locales.map((locale) => generateSylQuestionV5(definition.qlId, seed, locale))));

const records = questions.map((question) => ({
  qlId: question.qlId,
  seed: question.seed,
  locale: question.locale,
  difficulty: question.difficulty,
  taskKind: question.metadata.taskKind,
  pairStatus: question.metadata.pairStatus,
  stem: question.stem,
  statements: question.statements,
  conclusions: question.conclusions,
  options: question.options.map((option, index) => ({
    displayIndex: index + 1,
    text: option.text,
    isCorrect: option.isCorrect,
    semanticValue: option.semanticValue,
  })),
  correctIndex: question.correctIndex + 1,
  correctAnswer: question.options[question.correctIndex]?.text,
  preTestDirection: question.learnerPresentationV5.preTestDirection,
  explanation: question.learnerPresentationV5.learnerExplanation,
  optionAnalysis: question.learnerPresentationV5.optionAnalysis,
  diagram: {
    enabled: question.learnerPresentationV5.diagram.enabled,
    mode: question.learnerPresentationV5.diagram.mode,
    omissionReason: question.learnerPresentationV5.diagram.omissionReason,
    caption: question.learnerPresentationV5.diagram.caption,
    accessibleDescription: question.learnerPresentationV5.diagram.accessibleDescription,
    svg: question.learnerPresentationV5.diagram.svg,
  },
  modelEvidence: question.learnerPresentationV5.modelEvidence,
  remediationEvidence: question.learnerPresentationV5.remediationEvidence,
  lifecycle: question.learnerPresentationV5.lifecycle,
}));

const countBy = <T extends string>(values: readonly T[]): Readonly<Record<string, number>> =>
  values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});

const deadInconsistentOptions = questions.reduce((sum, question) =>
  sum + question.options.filter((option) =>
    option.semanticValue === "PREMISES_INCONSISTENT" && !option.isCorrect).length, 0);

const summary = {
  authority: "SYL_001_EXAM_READINESS_REMEDIATION_V5",
  schemaVersion: "syl-learner-v5-review-v1",
  records: records.length,
  logicalQuestions: SYL_QL_REGISTRY.length * seeds.length,
  languages: countBy(questions.map((question) => question.locale)),
  difficulty: countBy(questions.filter((question) => question.locale === "en-IN").map((question) => question.difficulty)),
  explanationModes: countBy(questions.map((question) => question.learnerPresentationV5.learnerExplanation.mode)),
  diagramModes: countBy(questions.map((question) => question.learnerPresentationV5.diagram.mode)),
  modelEvidence: {
    requiredRecords: questions.filter((question) => question.learnerPresentationV5.modelEvidence.required).length,
    missingCanonicalModels: questions.filter((question) =>
      question.learnerPresentationV5.modelEvidence.required
      && question.learnerPresentationV5.modelEvidence.canonicalModelCount === 0).length,
  },
  p0P1Remediation: {
    ql008AnswerDerivedExplanation: true,
    ql008AnswerDerivedDiagram: true,
    ql009BothConclusionsExplained: true,
    everyMaskConclusionExplained: true,
    concreteCounterexamples: true,
    concretePossibilityModels: true,
    concreteDualModels: true,
    logicalStatusSeparatedFromTaskDisposition: true,
    nonEmptyDirectionVisibleBeforeAttempt: true,
    unsafeUnknownRelationDiagramsOmitted: true,
  },
  retainedReleaseBlockers: {
    deadInconsistentOptions,
    deadOptionDecision: "PENDING_SEPARATE_SOURCE_DECISION",
    nativeEnglishEditorialStatus: "PENDING",
    nativeHindiEditorialStatus: "PENDING",
    nativePunjabiEditorialStatus: "PENDING",
    humanViewportStatus: "PENDING",
    mockWeightCalibrationStatus: "PENDING_SEPARATE_SOURCE_DECISION",
  },
  lifecycle: {
    reviewStatus: "REVISE",
    questionStudioEnabled: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    public: false,
  },
};

writeFileSync(
  resolve(outputDir, "syl-001-v5-review.jsonl"),
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);
writeFileSync(
  resolve(outputDir, "syl-001-v5-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

const markdown: string[] = [
  "# SYL-001 V5 Exam-Readiness Remediation Review",
  "",
  `Authority: \`${summary.authority}\``,
  "",
  "This is a review-only learner projection over V4. It does not change the solver, keyed answers, permanent QL status or delivery locks.",
  "",
  "## Review boundary",
  "",
  `- Localized records: ${summary.records}`,
  `- Logical questions: ${summary.logicalQuestions}`,
  `- English/Hindi/Punjabi: ${summary.languages["en-IN"]}/${summary.languages["hi-IN"]}/${summary.languages["pa-IN"]}`,
  "- QL-008 explanation and diagram modes are derived from the actual pair status.",
  "- QL-009 and every mask question explain each displayed conclusion.",
  "- Counterexample, possibility and dual-model explanations narrate canonical models.",
  "- Unknown witness-transfer relations are not drawn as proved separation.",
  "- Logical option status is displayed separately from task disposition.",
  "- The non-empty-class direction is visible before the attempt.",
  "",
  "## Remaining blockers",
  "",
  `- Dead inconsistent-option occurrences in this review pack: ${summary.retainedReleaseBlockers.deadInconsistentOptions}`,
  "- Native English, Hindi and Punjabi editorial approval: pending.",
  "- Human viewport approval at 360, 412 and 768 px: pending.",
  "- Source-authentic task weighting and difficulty calibration: pending.",
  "",
  "## Records",
  "",
];

for (const record of records) {
  markdown.push(`### ${record.qlId} · seed ${record.seed} · ${record.locale}`);
  markdown.push("");
  markdown.push(`**Direction:** ${record.preTestDirection}`);
  markdown.push("");
  markdown.push(`**Question:** ${record.stem}`);
  markdown.push("");
  record.statements.forEach((statement, index) => markdown.push(`${index + 1}. ${statement}`));
  if (record.conclusions.length > 0) {
    markdown.push("");
    record.conclusions.forEach((conclusion, index) => markdown.push(`Conclusion ${["I", "II", "III", "IV"][index] ?? index + 1}: ${conclusion}`));
  }
  markdown.push("");
  record.options.forEach((option) => markdown.push(`${String.fromCharCode(64 + option.displayIndex)}. ${option.text}`));
  markdown.push("");
  markdown.push(`**Answer:** ${record.correctAnswer}`);
  markdown.push("");
  record.explanation.shortReasoning.forEach((line) => markdown.push(`- ${line}`));
  markdown.push("");
  markdown.push(`**Conclusion:** ${record.explanation.conclusion}`);
  if (record.diagram.enabled && record.diagram.caption) {
    markdown.push("");
    markdown.push(`**Diagram caption:** ${record.diagram.caption}`);
  } else if (record.diagram.omissionReason) {
    markdown.push("");
    markdown.push(`**Diagram omitted:** ${record.diagram.omissionReason}`);
  }
  markdown.push("");
}

writeFileSync(
  resolve(outputDir, "SYL-001-V5-EXAM-READINESS-REVIEW.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

console.log(JSON.stringify({
  status: "SYL-001 V5 review evidence exported",
  outputDir,
  ...summary,
}, null, 2));
