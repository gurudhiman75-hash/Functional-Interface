import {
  exactCaseletContentFingerprint,
  normalizedClueSetFingerprint,
  querySurfaceFingerprint,
  seatCountOf,
  structuralVariantFingerprint,
  type AuditCaselet,
} from "./corpus.ts";

const OWNED_SEA001_QUERY_CONTRACTS = new Set([
  "SEA-QC-001",
  "SEA-QC-002",
  "SEA-QC-003",
  "SEA-QC-004",
  "SEA-QC-005",
  "SEA-QC-006",
  "SEA-QC-007",
  "SEA-QC-008",
  "SEA-QC-009",
  "SEA-QC-010",
  "SEA-QC-014",
  "SEA-QC-015",
  "SEA-QC-016",
  "SEA-QC-017",
  "SEA-QC-019",
  "SEA-QC-020",
  "SEA-QC-021",
  "SEA-QC-022",
]);

export interface Sea001ResidualAudit {
  readonly caseletCount: number;
  readonly childQuestionCount: number;
  readonly checkpointDistribution: Readonly<Record<string, number>>;
  readonly blueprintDistribution: Readonly<Record<string, number>>;
  readonly queryContractDistribution: Readonly<Record<string, number>>;
  readonly querySurfaceCount: number;
  readonly seatCountDistribution: Readonly<Record<string, number>>;
  readonly answerPositionDistribution: Readonly<Record<string, number>>;
  readonly answerPositionByChildIndexDistribution: Readonly<Record<string, number>>;
  readonly materialVariantCount: number;
  readonly materialVariantCountByBlueprint: Readonly<Record<string, number>>;
  readonly rejectedExactDuplicateCandidates: number;
  readonly rejectedNormalizedClueSetCandidates: number;
  readonly queryFactDuplicateCount: number;
  readonly checkpointSkillCoverageFailureCount: number;
  readonly crossQuestionLeakageCount: number;
  readonly solverOracleMismatchCount: number;
  readonly unexpectedMultiSolutionCount: number;
  readonly duplicateClueMeaningCount: number;
  readonly unusedBlueprintCount: number;
  readonly unusedOwnedQueryContractCount: number;
  readonly exactDuplicateCaseletCount: number;
  readonly normalizedDuplicateClueSetCount: number;
  readonly invalidOptionCount: number;
  readonly semanticDuplicateOptionCount: number;
  readonly weakDistractorCount: number;
  readonly incorrectAnswerCount: number;
  readonly missingFacingReasonCount: number;
  readonly missingArrangementDisplayCount: number;
  readonly genericExplanationCount: number;
  readonly rawSolverJargonCount: number;
  readonly unresolvedPlaceholderCount: number;
  readonly grammarIssueCount: number;
  readonly semanticLanguageMismatchCount: number;
  readonly unsupportedLanguageExposureCount: number;
  readonly lifecycleExposureCount: number;
  readonly blockerCount: number;
}

function increment(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function record(map: Map<string, number>): Readonly<Record<string, number>> {
  return Object.fromEntries([...map.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

function isDirectionalFacingQuestion(caselet: AuditCaselet, queryContractId: string): boolean {
  if (caselet.checkpointId === "SEA-CP-002") return queryContractId === "SEA-QC-003" || queryContractId === "SEA-QC-005";
  if (caselet.checkpointId === "SEA-CP-004") return queryContractId === "SEA-QC-003";
  if (caselet.checkpointId === "SEA-CP-005") return queryContractId === "SEA-QC-003" || queryContractId === "SEA-QC-005" || queryContractId === "SEA-QC-022";
  return false;
}

function hasFacingReason(caselet: AuditCaselet, explanation: string): boolean {
  if (caselet.checkpointId === "SEA-CP-002") return /faces (north|south)/i.test(explanation);
  if (caselet.checkpointId === "SEA-CP-004") return /outward/i.test(explanation) && /(clockwise|anticlockwise)/i.test(explanation);
  if (caselet.checkpointId === "SEA-CP-005") return /faces (the centre|outward)/i.test(explanation) && /(clockwise|anticlockwise)/i.test(explanation);
  return true;
}

export function auditSea001Corpus(
  caselets: readonly AuditCaselet[],
  rejectedExactDuplicateCandidates = 0,
  rejectedNormalizedClueSetCandidates = 0,
): Sea001ResidualAudit {
  const checkpointDistribution = new Map<string, number>();
  const blueprintDistribution = new Map<string, number>();
  const queryContractDistribution = new Map<string, number>();
  const seatCountDistribution = new Map<string, number>();
  const answerPositionDistribution = new Map<string, number>();
  const answerPositionByChildIndexDistribution = new Map<string, number>();
  const variantsByBlueprint = new Map<string, Set<string>>();
  const querySurfaces = new Set<string>();
  const exactContent = new Set<string>();
  const clueSets = new Set<string>();
  const seenContracts = new Set<string>();

  let childQuestionCount = 0;
  let queryFactDuplicateCount = 0;
  let checkpointSkillCoverageFailureCount = 0;
  let crossQuestionLeakageCount = 0;
  let solverOracleMismatchCount = 0;
  let unexpectedMultiSolutionCount = 0;
  let duplicateClueMeaningCount = 0;
  let exactDuplicateCaseletCount = 0;
  let normalizedDuplicateClueSetCount = 0;
  let invalidOptionCount = 0;
  let semanticDuplicateOptionCount = 0;
  let weakDistractorCount = 0;
  let incorrectAnswerCount = 0;
  let missingFacingReasonCount = 0;
  let missingArrangementDisplayCount = 0;
  let genericExplanationCount = 0;
  let rawSolverJargonCount = 0;
  let unresolvedPlaceholderCount = 0;
  let grammarIssueCount = 0;
  let semanticLanguageMismatchCount = 0;
  let unsupportedLanguageExposureCount = 0;
  let lifecycleExposureCount = 0;

  for (const caselet of caselets) {
    increment(checkpointDistribution, caselet.checkpointId);
    increment(blueprintDistribution, caselet.blueprintAuthorityId);
    increment(seatCountDistribution, `${caselet.checkpointId}:${seatCountOf(caselet)}`);

    const variant = structuralVariantFingerprint(caselet);
    const variantSet = variantsByBlueprint.get(caselet.blueprintAuthorityId) ?? new Set<string>();
    variantSet.add(variant);
    variantsByBlueprint.set(caselet.blueprintAuthorityId, variantSet);

    const exact = exactCaseletContentFingerprint(caselet);
    if (exactContent.has(exact)) exactDuplicateCaseletCount += 1;
    exactContent.add(exact);
    const clueSet = normalizedClueSetFingerprint(caselet);
    if (clueSets.has(clueSet)) normalizedDuplicateClueSetCount += 1;
    clueSets.add(clueSet);

    if (!caselet.solverOracleAgreement.passed
      || JSON.stringify(caselet.solverOracleAgreement.productionKeys)
        !== JSON.stringify(caselet.solverOracleAgreement.oracleKeys)) {
      solverOracleMismatchCount += 1;
    }
    if (caselet.solverOracleAgreement.productionKeys.length !== 1) unexpectedMultiSolutionCount += 1;
    if (caselet.checkpointSkillCoverage.length === 0) checkpointSkillCoverageFailureCount += 1;
    if (!caselet.crossQuestionLeakagePassed) crossQuestionLeakageCount += 1;
    if (new Set(caselet.queryFactFingerprints).size !== caselet.queryFactFingerprints.length) queryFactDuplicateCount += 1;
    if (new Set(caselet.clueTexts).size !== caselet.clueTexts.length) duplicateClueMeaningCount += 1;

    const arrangementDisplay = caselet.diagramText ?? caselet.diagram?.text ?? "";
    if (arrangementDisplay.trim().length === 0) missingArrangementDisplayCount += 1;
    const studentText = [caselet.setupText, ...caselet.clueTexts, caselet.sharedExplanation, arrangementDisplay].join("\n");
    if (/\b(?:solver|oracle|canonical key|model class|search branch|seat zero)\b/i.test(studentText)) rawSolverJargonCount += 1;
    if (/\b(?:undefined|null|NaN|TODO|TBD|PLACEHOLDER)\b/.test(studentText)) unresolvedPlaceholderCount += 1;
    if (/\b1\s+(?:persons|seats)\b/i.test(studentText)) grammarIssueCount += 1;
    if (caselet.locale !== "en-IN") {
      semanticLanguageMismatchCount += 1;
      unsupportedLanguageExposureCount += 1;
    }
    if (caselet.lifecycle.permanentQlCount !== 0
      || caselet.lifecycle.questionStudioRegistered
      || caselet.lifecycle.questionBankWritable
      || caselet.lifecycle.testEligible
      || caselet.lifecycle.publiclyPublishable) {
      lifecycleExposureCount += 1;
    }

    for (const child of caselet.children) {
      childQuestionCount += 1;
      seenContracts.add(child.queryContractId);
      increment(queryContractDistribution, child.queryContractId);
      querySurfaces.add(querySurfaceFingerprint(caselet, child));
      increment(answerPositionDistribution, String(child.answerIndex));
      increment(answerPositionByChildIndexDistribution, `${child.questionOrder}:${child.answerIndex}`);

      if (child.options.length !== 4 || child.answerIndex < 0 || child.answerIndex > 3) invalidOptionCount += 1;
      if (new Set(child.options.map((option) => option.semanticFingerprint)).size !== child.options.length) semanticDuplicateOptionCount += 1;
      const correctOptions = child.options.filter((option) => option.isCorrect);
      if (correctOptions.length !== 1 || !child.options[child.answerIndex]?.isCorrect) incorrectAnswerCount += 1;
      for (const option of child.options) {
        if (option.isCorrect) continue;
        if (!option.misconceptionId
          || Object.keys(option.recomputation).length === 0
          || option.explanation.trim().length < 12) {
          weakDistractorCount += 1;
        }
      }
      if (isDirectionalFacingQuestion(caselet, child.queryContractId)
        && !hasFacingReason(caselet, child.explanation)) {
        missingFacingReasonCount += 1;
      }
      if (child.explanation.trim().length < 35) genericExplanationCount += 1;
      const childText = `${child.text}\n${child.explanation}`;
      if (/\b(?:undefined|null|NaN|TODO|TBD|PLACEHOLDER)\b/.test(childText)) unresolvedPlaceholderCount += 1;
      if (/\b1\s+(?:persons|seats)\b/i.test(childText)) grammarIssueCount += 1;
      if (/\b(?:solver|oracle|canonical key|model class|search branch|seat zero)\b/i.test(childText)) rawSolverJargonCount += 1;
    }
  }

  const materialVariantCountByBlueprint = new Map<string, number>();
  let materialVariantCount = 0;
  for (const [blueprint, variants] of variantsByBlueprint) {
    materialVariantCountByBlueprint.set(blueprint, variants.size);
    materialVariantCount += variants.size;
  }

  const unusedBlueprintCount = 20 - blueprintDistribution.size;
  const unusedOwnedQueryContractCount = [...OWNED_SEA001_QUERY_CONTRACTS]
    .filter((queryContractId) => !seenContracts.has(queryContractId)).length;

  const blockers = [
    queryFactDuplicateCount,
    checkpointSkillCoverageFailureCount,
    crossQuestionLeakageCount,
    solverOracleMismatchCount,
    unexpectedMultiSolutionCount,
    duplicateClueMeaningCount,
    unusedBlueprintCount,
    exactDuplicateCaseletCount,
    normalizedDuplicateClueSetCount,
    invalidOptionCount,
    semanticDuplicateOptionCount,
    weakDistractorCount,
    incorrectAnswerCount,
    missingFacingReasonCount,
    missingArrangementDisplayCount,
    genericExplanationCount,
    rawSolverJargonCount,
    unresolvedPlaceholderCount,
    grammarIssueCount,
    semanticLanguageMismatchCount,
    unsupportedLanguageExposureCount,
    lifecycleExposureCount,
  ];

  return {
    caseletCount: caselets.length,
    childQuestionCount,
    checkpointDistribution: record(checkpointDistribution),
    blueprintDistribution: record(blueprintDistribution),
    queryContractDistribution: record(queryContractDistribution),
    querySurfaceCount: querySurfaces.size,
    seatCountDistribution: record(seatCountDistribution),
    answerPositionDistribution: record(answerPositionDistribution),
    answerPositionByChildIndexDistribution: record(answerPositionByChildIndexDistribution),
    materialVariantCount,
    materialVariantCountByBlueprint: record(materialVariantCountByBlueprint),
    rejectedExactDuplicateCandidates,
    rejectedNormalizedClueSetCandidates,
    queryFactDuplicateCount,
    checkpointSkillCoverageFailureCount,
    crossQuestionLeakageCount,
    solverOracleMismatchCount,
    unexpectedMultiSolutionCount,
    duplicateClueMeaningCount,
    unusedBlueprintCount,
    unusedOwnedQueryContractCount,
    exactDuplicateCaseletCount,
    normalizedDuplicateClueSetCount,
    invalidOptionCount,
    semanticDuplicateOptionCount,
    weakDistractorCount,
    incorrectAnswerCount,
    missingFacingReasonCount,
    missingArrangementDisplayCount,
    genericExplanationCount,
    rawSolverJargonCount,
    unresolvedPlaceholderCount,
    grammarIssueCount,
    semanticLanguageMismatchCount,
    unsupportedLanguageExposureCount,
    lifecycleExposureCount,
    blockerCount: blockers.reduce((sum, value) => sum + value, 0),
  };
}

export function assertSea001ProductionCandidateTargets(audit: Sea001ResidualAudit): void {
  if (audit.caseletCount < 1500) throw new Error(`SEA-001 saturation needs at least 1500 caselets, observed ${audit.caseletCount}`);
  if (audit.childQuestionCount < 6000) throw new Error(`SEA-001 saturation needs at least 6000 child questions, observed ${audit.childQuestionCount}`);
  if (audit.querySurfaceCount < 24) throw new Error(`SEA-001 needs at least 24 query-template surfaces, observed ${audit.querySurfaceCount}`);
  if (audit.materialVariantCount < 60) throw new Error(`SEA-001 needs at least 60 material variants, observed ${audit.materialVariantCount}`);
  for (const [blueprint, count] of Object.entries(audit.materialVariantCountByBlueprint)) {
    if (count < 3) throw new Error(`${blueprint} exposed only ${count} material variants; at least 3 are required to reach honest family saturation`);
  }
  for (const checkpointId of ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const) {
    if ((audit.checkpointDistribution[checkpointId] ?? 0) < 300) {
      throw new Error(`${checkpointId} saturation has fewer than 300 accepted caselets`);
    }
  }
  if (audit.unusedOwnedQueryContractCount !== 0) {
    throw new Error(`SEA-001 has ${audit.unusedOwnedQueryContractCount} declared query contracts unreachable in saturation`);
  }
  if (audit.blockerCount !== 0) throw new Error(`SEA-001 residual correctness/editorial blockers: ${audit.blockerCount}`);
}
