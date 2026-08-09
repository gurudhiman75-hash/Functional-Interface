import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS,
  MEN_CP011_IMPLEMENTATION_MANIFEST,
  MEN_CP011_RUNTIME_PROTOTYPE_IDS,
  auditMenCp011ImplementationCloseout,
} from "./implementation-closeout";

const audit = auditMenCp011ImplementationCloseout();
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp011-implementation-closeout-v1",
);
mkdirSync(dirname(outputBase), { recursive: true });

function jsonReplacer(_key: string, value: unknown) {
  return typeof value === "bigint" ? value.toString() : value;
}

const reviewRows = MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS.map(
  (question, index) => ({
    reviewId: `MEN-CP011-FINAL-${String(index + 1).padStart(3, "0")}`,
    implementationWaveId: question.implementationWaveId,
    prototypeId: question.prototypeId,
    solveMode: question.solveMode,
    target: question.target,
    difficulty: question.difficulty,
    stem: question.stem,
    options: question.options.map((option: any) => ({
      label: option.label,
      display: option.display,
      isCorrect: option.isCorrect,
    })),
    correctIndex: question.correctIndex,
    answer: question.answer,
    learnerSolution: question.learnerSolution,
    lifecycle: {
      permanentQlId: question.permanentQlId,
      questionStudioDiscoverable: question.questionStudioDiscoverable,
      questionBankStatus: question.questionBankStatus,
      testEligibility: question.testEligibility,
      publiclyPublishable: question.publiclyPublishable,
    },
  }),
);

writeFileSync(
  `${outputBase}.json`,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      audit,
      implementationManifest: MEN_CP011_IMPLEMENTATION_MANIFEST,
      reviewRows,
    },
    jsonReplacer,
    2,
  )}\n`,
  "utf8",
);

const manifestLines = MEN_CP011_IMPLEMENTATION_MANIFEST.map(
  (entry) =>
    `| \`${entry.prototypeId}\` | ${entry.generatedReviewRecordCount} | \`${entry.sourceNormalisationStatus}\` | \`${entry.sourceMatchClassification ?? "NONE"}\` |`,
);

const representativeQuestions = MEN_CP011_RUNTIME_PROTOTYPE_IDS.map(
  (prototypeId) =>
    MEN_CP011_IMPLEMENTATION_CLOSEOUT_RECORDS.find(
      (question) => question.prototypeId === prototypeId,
    )!,
);

const representativeLines = representativeQuestions.flatMap(
  (question, index) => [
    `### ${index + 1}. ${question.prototypeId}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option: any) =>
        `- ${option.label}. ${option.display}${option.isCorrect ? " **(correct)**" : ""}`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    `**Formula:** ${question.learnerSolution.formula}`,
    "",
    ...question.learnerSolution.steps.map((step: string) => `- ${step}`),
    "",
  ],
);

const markdown = [
  "# MEN-CP-011 Implementation Closeout V1",
  "",
  "## Final implementation verdict",
  "",
  "```text",
  `Authority:                              ${audit.authority}`,
  `Completion status:                      ${audit.completionStatus}`,
  `Runtime families implemented:           ${audit.implementedManifestCount}/${audit.runtimePrototypeCount}`,
  `Implementation waves:                   ${audit.implementationWaveCount}`,
  `Final English review records:           ${audit.generatedEnglishReviewRecordCount}`,
  `Valid and independently verified:       ${audit.validAndVerifiedRecordCount}`,
  `Technically clean learner records:      ${audit.technicallyCleanRecordCount}`,
  `Structurally valid option records:      ${audit.structurallyValidOptionRecordCount}`,
  `Engineering implementation blockers:   ${audit.remainingEngineeringImplementationBlockerCount}`,
  `Attached source references:             ${audit.attachedSourceReferenceCount}`,
  `Direct candidates pending human review: ${audit.directSourceCandidateCount}`,
  `Representation-only references:         ${audit.representationOnlySourceCount}`,
  `Missing direct references:              ${audit.missingDirectSourceReferenceCount}`,
  `Permanent QLs:                          0`,
  `Activation ready:                       ${audit.activationReady}`,
  "```",
  "",
  "MEN-CP-011 is complete as an executable English implementation. Activation remains deliberately locked because implementation completion is not the same as source approval, human editorial freeze, permanent identity allocation or multilingual parity.",
  "",
  "## Family manifest",
  "",
  "| Runtime family | Review records | Source status | Source classification |",
  "|---|---:|---|---|",
  ...manifestLines,
  "",
  "## Activation blockers",
  "",
  ...audit.activationBlockers.map((blocker) => `- \`${blocker}\``),
  "",
  "## Lifecycle lock",
  "",
  "```text",
  "Question Studio:     disabled",
  "Question Bank:       NOT_STORED",
  "Mock-test eligible:  false",
  "Public publication:  false",
  "Hindi parity:        pending",
  "Punjabi parity:      pending",
  "```",
  "",
  "## One representative question per family",
  "",
  ...representativeLines,
].join("\n");

writeFileSync(`${outputBase}.md`, markdown, "utf8");

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      completionStatus: audit.completionStatus,
      runtimePrototypeCount: audit.runtimePrototypeCount,
      generatedEnglishReviewRecordCount:
        audit.generatedEnglishReviewRecordCount,
      implementationComplete: audit.implementationComplete,
      activationReady: audit.activationReady,
      outputJson: `${outputBase}.json`,
      outputMarkdown: `${outputBase}.md`,
    },
    null,
    2,
  ),
);
