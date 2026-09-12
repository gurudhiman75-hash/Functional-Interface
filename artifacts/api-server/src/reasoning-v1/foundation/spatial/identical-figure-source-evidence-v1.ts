import { IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "./identical-figure-source-saturated-discovery-v1";

export const IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1 = Object.freeze({
  authorityId: "SPA-IDF-001-SOURCE-EVIDENCE-V1" as const,
  discoveryAuthorityId: IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  sourceSurface: Object.freeze({
    book: "Radian Reasoning for Competitions (2022)" as const,
    location: "Figure Matrix Q31-Q33 grouping surface" as const,
    examEvidence: "RRB ALP 2018" as const,
    learnerTask: "USE_EACH_NUMBERED_FIGURE_ONCE_AND_FORM_THREE_GROUPS" as const,
  }),
  observedSemanticFamilies: Object.freeze([
    Object.freeze({
      sourceQuestion: 31,
      groupingBasis: "OUTER_SHAPE_IDENTITY" as const,
      evidenceSummary: "Figures are partitioned by a common outer geometric figure." as const,
    }),
    Object.freeze({
      sourceQuestion: 32,
      groupingBasis: "TOPOLOGICAL_RELATION" as const,
      evidenceSummary: "Figures are partitioned by the way two geometric figures contain or intersect one another." as const,
    }),
    Object.freeze({
      sourceQuestion: 33,
      groupingBasis: "INNER_OR_PARTITION_STRUCTURE" as const,
      evidenceSummary: "Figures are grouped by a stable inner-element/structural relation." as const,
    }),
  ]),
  adjacentRotationEvidence: Object.freeze({
    sourceChapter: "Figure Classification" as const,
    observedRule: "Several source solutions state that all but one figures can be rotated into each other." as const,
    routingDecision: "ROTATION_EQUIVALENCE_IS_AN_EXAM_REAL_PROPERTY_BUT_ODD_ONE_OUT_REMAINS_FCL_001" as const,
  }),
  conclusion: Object.freeze({
    numberedBankGroupingIsDistinctSurface: true as const,
    componentIdentityGroupingSupported: true as const,
    topologyGroupingSupported: true as const,
    transformEquivalenceSupportedByBlueprintAndAdjacentSource: true as const,
    oddOneOutMustRemainFigureClassification: true as const,
    oneQlPerRepresentationVariantRejected: true as const,
  }),
} as const);

if (!IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.conclusion.numberedBankGroupingIsDistinctSurface) {
  throw new Error("IDF-001 source evidence must retain the numbered-bank grouping surface.");
}
if (!IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.conclusion.oddOneOutMustRemainFigureClassification) {
  throw new Error("IDF-001 source evidence must preserve the FCL-001 boundary.");
}
