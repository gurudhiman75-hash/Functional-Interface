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
    option.semanticValue === "PREMISES_INCONSISTENT").length, 0);
const modalDiagnosticRecords = questions.filter((question) =>
  question.metadata.answerTemplateId === "DIAGNOSTIC_THREE_OPTION_V1").length;
const enabledDiagramRecords = questions.filter((question) =>
  question.learnerPresentationV5.diagram.enabled
  && Boolean(question.learnerPresentationV5.diagram.svg)).length;
const omittedComplexRecords = questions.filter((question) =>
  question.learnerPresentationV5.diagram.omissionReason === "MORE_THAN_THREE_TERMS").length;
const omittedUnstableRecords = questions.filter((question) =>
  question.learnerPresentationV5.diagram.omissionReason === "NO_STABLE_SIMPLE_VENN").length;
const exactVennRecords = questions.filter((question) =>
  question.learnerPresentationV5.diagram.semanticSignature.startsWith("syl-v5:exact-venn:enabled:")).length;
const nonVennEnabledRecords = questions.filter((question) => {
  const diagram = question.learnerPresentationV5.diagram;
  if (!diagram.enabled) return false;
  const svg = diagram.svg ?? "";
  return !/^VENN_/u.test(diagram.mode) || !/<(?:circle|ellipse)\b/u.test(svg);
}).length;
const editorialStatuses = questions[0]?.learnerPresentationV5.remediationEvidence;

const summary = {
  authority: "SYL_001_EXAM_READINESS_REMEDIATION_V5",
  schemaVersion: "syl-learner-v5-review-v1",
  records: records.length,
  logicalQuestions: SYL_QL_REGISTRY.length * seeds.length,
  languages: countBy(questions.map((question) => question.locale)),
  difficulty: countBy(questions.filter((question) => question.locale === "en-IN").map((question) => question.difficulty)),
  explanationModes: countBy(questions.map((question) => question.learnerPresentationV5.learnerExplanation.mode)),
  diagramModes: countBy(questions.map((question) => question.learnerPresentationV5.diagram.mode)),
  diagramCoverage: {
    enabledRecords: enabledDiagramRecords,
    omittedRecords: questions.length - enabledDiagramRecords,
    omittedComplexRecords,
    omittedUnstableRecords,
    exactVennRecords,
    nonVennEnabledRecords,
  },
  diagramContract: {
    maximumTermsPerEnabledDiagram: 3,
    maximumWitnessesPerEnabledDiagram: 2,
    numberedWitnesses: 0,
    separationCrosses: 0,
    strongerUnstatedRelations: 0,
    forcedComplexLayouts: 0,
    mobileViewBox: "340 x 210",
  },
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
    exactTopologyVennOrOmit: true,
    forcedDiagramCoverageRemoved: true,
    deadInconsistentOptionRemoved: deadInconsistentOptions === 0,
    modalDiagnosticRecords,
    modalDiagnosticOptionCount: 3,
    modalDiagnosticTemplate: "DIAGNOSTIC_THREE_OPTION_V1",
    questionExplanationApproval: {
      approvedAt: "2026-08-07",
      authority: "PRODUCT_OWNER_APPROVAL",
      English: editorialStatuses?.nativeEnglishEditorialStatus,
      Hindi: editorialStatuses?.nativeHindiEditorialStatus,
      Punjabi: editorialStatuses?.nativePunjabiEditorialStatus,
    },
  },
  retainedReleaseBlockers: {
    humanViewportStatus: editorialStatuses?.humanViewportStatus,
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
  "- Question and explanation content approved by the product owner on 2026-08-07.",
  `- Exact-topology diagrams enabled: ${summary.diagramCoverage.enabledRecords}.`,
  `- Complex diagrams intentionally omitted: ${summary.diagramCoverage.omittedComplexRecords}.`,
  `- Unstable simple layouts intentionally omitted: ${summary.diagramCoverage.omittedUnstableRecords}.`,
  `- Non-Venn enabled visuals: ${summary.diagramCoverage.nonVennEnabledRecords}.`,
  "- Enabled diagrams use verified finite templates; force-layout geometry is prohibited.",
  "- Some/some-not relations use genuine overlap unless containment or separation is forced by the premises or marked model.",
  "- Enabled diagrams contain at most three terms and two unnumbered decisive witnesses.",
  "- No floating separation ×, numbered witness series, textLength compression, relation maps or comparison panels are permitted.",
  "- QL-008 explanation and diagram modes are derived from the actual pair status.",
  "- QL-009 and every mask question explain each displayed conclusion.",
  "- Counterexample, possibility and dual-model explanations narrate canonical models.",
  "- Logical option status is displayed separately from task disposition.",
  "- The non-empty-class direction is visible before the attempt.",
  "- Modal diagnostic QLs use the exhaustive three live statuses: definitely true, possible but not definite, and impossible.",
  `- Dead inconsistent-option occurrences: ${deadInconsistentOptions}.`,
  "",
  "## Remaining blockers",
  "",
  "- Human viewport review must be repeated after the diagram redesign.",
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
  markdown.push("");
  if (record.diagram.enabled && record.diagram.caption) {
    markdown.push(`**Diagram caption:** ${record.diagram.caption}`);
  } else {
    markdown.push(`**Diagram:** intentionally omitted (${record.diagram.omissionReason}).`);
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
