import { defineGeometryMergeSplitFamilyV1 } from "./geometry-merge-split-proposal-v1-types";

export const GEO_MERGE_SPLIT_PROPOSAL_V1_PART_D = Object.freeze([
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP013_POWER_OF_POINT_TOPOLOGIES",
    cpId: "GEO-CP-013",
    learnerDecision: "Power of a point",
    candidateIds: Object.freeze([
      "GEO-TMP-CP013-INTERSECTING-CHORDS-V1",
      "GEO-TMP-CP013-SECANT-SECANT-V1",
      "GEO-TMP-CP013-TANGENT-SECANT-V1",
      "GEO-TMP-GAP-W12-CP013-REVERSE-UNKNOWN-EXTERNAL-SECANT-V1",
    ]),
    mergeRationale: "Merge intersecting-chord, secant-secant, tangent-secant and reverse unknown-external forms into one topology-parameterized product family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP014_CHORD_PYTHAGORAS_SYNTHESIS",
    cpId: "GEO-CP-014",
    learnerDecision: "Chord-bisection plus Pythagoras synthesis",
    candidateIds: Object.freeze([
      "GEO-TMP-CP014-CHORD-PYTHAGORAS-V1",
    ]),
    mergeRationale: "Retain this two-theorem solve graph as its own synthesis family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP014_CYCLIC_ISOSCELES_SYNTHESIS",
    cpId: "GEO-CP-014",
    learnerDecision: "Cyclic plus isosceles synthesis",
    candidateIds: Object.freeze([
      "GEO-TMP-CP014-CYCLIC-ISOSCELES-V1",
    ]),
    mergeRationale: "Retain cyclic-opposite plus isosceles/triangle-sum graph as its own synthesis family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP014_TANGENT_TRIANGLE_SYNTHESIS",
    cpId: "GEO-CP-014",
    learnerDecision: "Radius-tangent plus triangle-angle synthesis",
    candidateIds: Object.freeze([
      "GEO-TMP-CP014-TANGENT-TRIANGLE-V1",
    ]),
    mergeRationale: "Retain radius-perpendicular-tangent followed by triangle angle sum as its own graph.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP014_BPT_ANGLE_BISECTOR_SYNTHESIS",
    cpId: "GEO-CP-014",
    learnerDecision: "BPT plus angle-bisector synthesis",
    candidateIds: Object.freeze([
      "GEO-TMP-CP014-BPT-BISECTOR-V1",
    ]),
    mergeRationale: "Retain BPT scale recovery followed by angle-bisector theorem as its own graph.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP014_COMMON_TANGENT_SIMILARITY_SYNTHESIS",
    cpId: "GEO-CP-014",
    learnerDecision: "Common-tangent plus similarity synthesis",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W2-CP014-COMMON-TANGENT-SIMILARITY-V1",
    ]),
    mergeRationale: "Retain two-circle tangent geometry followed by similarity as its own graph.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP014_TANGENT_CENTRAL_INSCRIBED_SYNTHESIS",
    cpId: "GEO-CP-014",
    learnerDecision: "Tangent to central to inscribed-angle synthesis",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W2-CP014-TANGENT-CENTRAL-INSCRIBED-V1",
    ]),
    mergeRationale: "Retain the tangent/central/inscribed conversion chain as its own graph rather than merging it with a simple tangent triangle.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP014_PARALLEL_CONGRUENCE_SYNTHESIS",
    cpId: "GEO-CP-014",
    learnerDecision: "Parallel-angle to congruence to CPCT synthesis",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W5-CP014-PARALLELOGRAM-EXTENSION-MIDPOINT-V1",
      "GEO-TMP-GAP-W5-CP014-EQUAL-PARALLEL-DIAGONAL-CPCT-V1",
    ]),
    mergeRationale: "Merge the ASA and SAS source-backed variants because both use parallel-angle evidence to prove congruence and extract a corresponding length.",
  }),
]);
