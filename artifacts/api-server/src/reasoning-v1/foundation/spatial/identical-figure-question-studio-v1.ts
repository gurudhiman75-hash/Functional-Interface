import {
  generateIdenticalFigureReviewQuestionV1_1,
  type IdenticalFigureLanguageV1,
  type IdenticalFigureQlIdV1,
} from "./identical-figure-review-runtime-v1-1";
import {
  IDENTICAL_FIGURE_FREEZE_AUTHORITY_V1,
  IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1,
  IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1,
} from "./identical-figure-freeze-v1";

const OPTION_LABELS = Object.freeze(["A", "B", "C", "D"] as const);

const QL_META: Readonly<Record<IdenticalFigureQlIdV1, Readonly<{
  proposalId: "IDF-PROP-01" | "IDF-PROP-02" | "IDF-PROP-03";
  name: string;
  mode: "COMPONENT_IDENTITY_GROUPING" | "TOPOLOGICAL_RELATION_GROUPING" | "TRANSFORM_EQUIVALENCE_GROUPING";
}>>> = Object.freeze({
  "SPA-QL-061": Object.freeze({
    proposalId: "IDF-PROP-01" as const,
    name: "Group figures by stable component identity",
    mode: "COMPONENT_IDENTITY_GROUPING" as const,
  }),
  "SPA-QL-062": Object.freeze({
    proposalId: "IDF-PROP-02" as const,
    name: "Group figures by containment overlap or intersection relation",
    mode: "TOPOLOGICAL_RELATION_GROUPING" as const,
  }),
  "SPA-QL-063": Object.freeze({
    proposalId: "IDF-PROP-03" as const,
    name: "Group asymmetric figures under declared rotation or reflection equivalence",
    mode: "TRANSFORM_EQUIVALENCE_GROUPING" as const,
  }),
});

function locale(language: IdenticalFigureLanguageV1) {
  return language === "hi" ? "hi-IN" as const : language === "pa" ? "pa-IN" as const : "en-IN" as const;
}

function difficultyBand(difficulty: "EASY" | "MODERATE" | "HARD") {
  return difficulty === "EASY" ? "Easy" as const : difficulty === "HARD" ? "Hard" as const : "Medium" as const;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderPartitionOptionSvg(groups: readonly (readonly number[])[]): string {
  const rows = groups.map((group, index) => {
    const y = 30 + index * 26;
    return `<text x="18" y="${y}" font-family="Arial" font-size="15" font-weight="600" fill="#111827">${escapeXml(`(${group.join(", ")})`)}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100" width="210" height="140" role="img"><rect width="150" height="100" rx="6" fill="white" stroke="#d1d5db" stroke-width="1"/>${rows}</svg>`;
}

function lifecycle() {
  return Object.freeze({
    ...IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1,
    registrationStatus: "REGISTERED" as const,
    releaseAuthority: IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.authorityId,
  });
}

export function generateIdenticalFigureQuestionStudioV1(input: Readonly<{
  qlId: IdenticalFigureQlIdV1;
  seed: string;
  language: IdenticalFigureLanguageV1;
}>) {
  if (!IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approved) {
    throw new Error("IDF-001 Question Studio generation requires explicit product-owner approval.");
  }
  if (!IDENTICAL_FIGURE_FREEZE_AUTHORITY_V1.learnerContentFrozen) {
    throw new Error("IDF-001 Question Studio generation requires the approved V1.1 runtime to be frozen.");
  }
  if (!IDENTICAL_FIGURE_INTERNAL_ACTIVATION_V1.questionStudioDiscoverable) {
    throw new Error("IDF-001 internal activation has not opened Question Studio discovery.");
  }

  const source = generateIdenticalFigureReviewQuestionV1_1(input);
  const meta = QL_META[source.qlId];
  const canonicalItemId = `${source.qlId}:${source.geometryFingerprint}:${source.solveFacts.correctPartitionKey}`;
  const questionLanguageId = `${canonicalItemId}:${source.language}:${source.contentFingerprint}`;
  const optionSvgs = source.options.map((option) => renderPartitionOptionSvg(option.groups)) as [string, string, string, string];

  return Object.freeze({
    version: "SPA-IDF-001-QUESTION-STUDIO-V1" as const,
    packageId: "SPA-001" as const,
    qlId: source.qlId,
    proposalId: meta.proposalId,
    chapterCode: "IDF-001" as const,
    qlName: meta.name,
    language: source.language,
    locale: locale(source.language),
    difficultyBand: difficultyBand(source.difficulty),
    seed: source.seed,
    generationSeed: source.seed,
    mode: meta.mode,
    stem: source.stem,
    stimulusSvgs: Object.freeze([source.stimulusSvg] as const),
    optionSvgs: Object.freeze(optionSvgs),
    optionLabels: OPTION_LABELS,
    optionTexts: Object.freeze(source.options.map((option) => option.text)),
    correctIndex: source.correctIndex,
    answer: source.answer,
    explanation: Object.freeze({
      observation: source.explanation.observation,
      rule: source.explanation.rule,
      application: source.explanation.application,
      check: source.explanation.check,
      groupTable: source.explanation.groupTable,
    }),
    explanationIllustrationSvg: source.explanation.solutionSvg,
    solveFacts: source.solveFacts,
    canonicalItemId,
    questionLanguageId,
    questionId: `spa-idf-001:${questionLanguageId}`,
    contentFingerprint: source.contentFingerprint,
    geometryFingerprint: source.geometryFingerprint,
    presentationFingerprint: source.presentationFingerprint,
    renderer: Object.freeze({
      kind: "SVG_WITH_IMAGE_OPTIONS" as const,
      recommendedStimulusPixels: 560,
      recommendedOptionPixels: 210,
      reviewStrokeWidth: 1.35 as const,
      reviewBackground: "WHITE" as const,
      groupedSolutionIllustrationIncluded: true as const,
      visibleNumberOverlayRequired: true as const,
    }),
    localization: Object.freeze({
      authority: IDENTICAL_FIGURE_FREEZE_AUTHORITY_V1.authorityId,
      canonicalLanguage: "en" as const,
      targetLanguage: source.language,
      semanticParity: "BANK_GEOMETRY_PARTITIONS_ANSWER_GROUP_RULE_AND_SOLUTION_EXACT" as const,
    }),
    validation: Object.freeze({
      ...source.validation,
      valid: true as const,
      exactSolverBacked: true as const,
      uniqueAnswer: true as const,
      learnerExplanationSafe: true as const,
      productOwnerApproved: true as const,
      learnerContentFrozen: true as const,
      approvedV1_1RuntimePreserved: true as const,
      optionPartitionTextPersistedAsSvg: true as const,
    }),
    review: Object.freeze({
      productOwnerApprovalAuthority: IDENTICAL_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approvalId,
      productOwnerApproved: true as const,
      learnerContentFrozen: true as const,
      downstreamActivationAllowed: true as const,
    }),
    lifecycle: lifecycle(),
    sourceFreezeAuthority: IDENTICAL_FIGURE_FREEZE_AUTHORITY_V1.authorityId,
  });
}

export type IdenticalFigureQuestionStudioV1 = ReturnType<typeof generateIdenticalFigureQuestionStudioV1>;
