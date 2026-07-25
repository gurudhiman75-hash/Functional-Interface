import type {
  Pnc002AnyParameters,
  Pnc002IndependentVerification,
  Pnc002ReasoningEvidence,
  Pnc002SolverResult,
} from "./types";

export function buildPnc002Cp009ReasoningEvidence(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
  verification: Pnc002IndependentVerification,
): Pnc002ReasoningEvidence {
  const e = solver.evidence;
  const conceptId: Record<string, string> = {
    countWithCompulsoryMembers: "PNC-SELECTION-COMPULSORY",
    countWithExcludedMembers: "PNC-SELECTION-EXCLUDED",
    countWithCompulsoryAndExcludedMembers: "PNC-SELECTION-COMPULSORY-EXCLUDED",
    countExactlyFromTwoCategories: "PNC-SELECTION-EXACT-TWO-CATEGORY",
    countAtLeastFromTwoCategories: "PNC-SELECTION-AT-LEAST-TWO-CATEGORY",
    countAtMostFromTwoCategories: "PNC-SELECTION-AT-MOST-TWO-CATEGORY",
    countAtLeastOneFromCategory: "PNC-SELECTION-CATEGORY-COMPLEMENT",
    countAtLeastOneFromEachOfTwoCategories: "PNC-SELECTION-EACH-TWO-CATEGORIES",
    countExactThreeCategoryDistribution: "PNC-SELECTION-EXACT-THREE-CATEGORY",
    countAtLeastOneFromEachOfThreeCategories: "PNC-SELECTION-EACH-THREE-CATEGORIES",
    countExactlyTSpecifiedMembers: "PNC-SELECTION-EXACT-SPECIFIED",
    countAtLeastOneSpecifiedMember: "PNC-SELECTION-SPECIFIED-COMPLEMENT",
    countNotAllSpecifiedMembersTogether: "PNC-SELECTION-NOT-ALL-SPECIFIED",
    countAllOrNoneSpecifiedMembers: "PNC-SELECTION-ALL-OR-NONE",
    countImplicationBetweenSpecifiedMembers: "PNC-SELECTION-MEMBER-IMPLICATION",
    countAtMostTSpecifiedMembers: "PNC-SELECTION-AT-MOST-SPECIFIED",
    countNamedCompulsoryWithCategoryQuota: "PNC-SELECTION-COMPULSORY-QUOTA",
    countNamedExcludedWithCategoryQuota: "PNC-SELECTION-EXCLUDED-QUOTA",
    recoverConditionalSelectionParameter: "PNC-SELECTION-CONDITIONAL-INVERSE",
  };

  return {
    conceptId: conceptId[parameters.solveMode] ?? "PNC-SELECTION-CONDITIONAL",
    givens: {
      totalObjects: e.totalObjects,
      committeeSize: e.committeeSize ?? "",
      restriction: parameters.constraintProfile,
      scenario: parameters.scenarioFamily,
    },
    equations: [`\\(${solver.mathJax}\\)`],
    intermediateValues: {
      compulsoryCount: e.compulsoryCount ?? "",
      excludedCount: e.excludedCount ?? "",
      remainingEligibleCount: e.remainingEligibleCount ?? "",
      remainingSelectionCount: e.remainingSelectionCount ?? "",
      categorySizes: e.categorySizes?.join(", ") ?? "",
      requiredCategoryCounts: e.requiredCategoryCounts?.join(", ") ?? "",
      requiredFromA: e.requiredFromA ?? "",
      requiredFromB: e.requiredFromB ?? "",
      minimumFromA: e.minimumFromA ?? "",
      maximumFromA: e.maximumFromA ?? "",
      acceptedSelectionCounts: e.acceptedSelectionCounts?.join(", ") ?? "",
      selectionCaseCounts: e.selectionCaseCounts?.join(" + ") ?? "",
      specifiedCount: e.specifiedCount ?? "",
      requiredSpecified: e.requiredSpecified ?? "",
      maximumSpecified: e.maximumSpecified ?? "",
      forbiddenCount: e.forbiddenCount ?? "",
      target: e.target ?? "",
      recoveredParameter: e.recoveredParameter ?? "",
    },
    decisiveCalculation: `\\(${solver.mathJax}\\)`,
    verification: `${verification.method}; verified answer ${verification.answer}.`,
  };
}
