import { defineGeometryMergeSplitFamilyV1 } from "./geometry-merge-split-proposal-v1-types";

export const GEO_MERGE_SPLIT_PROPOSAL_V1_PART_A = Object.freeze([
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP001_VERTICAL_ANGLE",
    cpId: "GEO-CP-001",
    learnerDecision: "Vertical-angle equality",
    candidateIds: Object.freeze([
      "GEO-TMP-CP001-VERTICAL-ANGLE-V1",
    ]),
    mergeRationale: "Keep distinct from adjacent supplementary relations because the learner must identify the opposite-angle topology.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP001_LINEAR_PAIR",
    cpId: "GEO-CP-001",
    learnerDecision: "Linear-pair supplement",
    candidateIds: Object.freeze([
      "GEO-TMP-CP001-LINEAR-PAIR-V1",
    ]),
    mergeRationale: "Keep distinct from vertical-angle equality because adjacency and straight-line evidence drive a different learner decision.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP001_AROUND_POINT",
    cpId: "GEO-CP-001",
    learnerDecision: "Angles around a point",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W9-CP001-AROUND-POINT-EQUAL-ANGLES-V1",
    ]),
    mergeRationale: "One full-turn angle-sum decision family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP001_COMPLEMENT_SUPPLEMENT",
    cpId: "GEO-CP-001",
    learnerDecision: "Complement/supplement relation",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W13-CP001-COMPLEMENT-SUPPLEMENT-RELATION-V1",
    ]),
    mergeRationale: "One relation family for recovering an angle from complementary and supplementary constraints.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP002_PARALLEL_LINE_ANGLE_RELATIONS",
    cpId: "GEO-CP-002",
    learnerDecision: "Parallel-line angle transfer",
    candidateIds: Object.freeze([
      "GEO-TMP-CP002-CORRESPONDING-V1",
      "GEO-TMP-CP002-COINTERIOR-V1",
      "GEO-TMP-GAP-W9-CP002-ALTERNATE-INTERIOR-V1",
    ]),
    mergeRationale: "Merge corresponding, alternate-interior and co-interior variants into one parameterized learner decision over relation type.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP003_TRIANGLE_ANGLE_SUM",
    cpId: "GEO-CP-003",
    learnerDecision: "Triangle interior-angle sum",
    candidateIds: Object.freeze([
      "GEO-TMP-CP003-THIRD-ANGLE-V1",
    ]),
    mergeRationale: "Direct third-angle recovery remains a distinct primitive decision.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP003_EXTERIOR_ANGLE",
    cpId: "GEO-CP-003",
    learnerDecision: "Triangle exterior-angle relation",
    candidateIds: Object.freeze([
      "GEO-TMP-CP003-EXTERIOR-ANGLE-V1",
    ]),
    mergeRationale: "Exterior angle from remote interior angles remains a distinct theorem application.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP003_ISOSCELES_RELATIONS",
    cpId: "GEO-CP-003",
    learnerDecision: "Isosceles side-angle relation",
    candidateIds: Object.freeze([
      "GEO-TMP-CP003-ISOSCELES-BASE-V1",
    ]),
    mergeRationale: "Bidirectional isosceles authority is one learner relation family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP003_TRIANGLE_INEQUALITY",
    cpId: "GEO-CP-003",
    learnerDecision: "Triangle-inequality validity and range",
    candidateIds: Object.freeze([
      "GEO-TMP-CP003-TRIANGLE-INEQUALITY-RANGE-V1",
      "GEO-TMP-GAP-W9-CP003-TRIANGLE-INEQUALITY-INTEGER-COUNT-V1",
      "GEO-TMP-GAP-W9-CP003-TRIANGLE-INEQUALITY-CLAIM-V1",
    ]),
    mergeRationale: "Merge interval, integer-count and claim-recognition variants because they apply the same strict inequality boundary.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP003_SIDE_ANGLE_ORDER",
    cpId: "GEO-CP-003",
    learnerDecision: "Triangle side-angle ordering",
    candidateIds: Object.freeze([
      "GEO-TMP-GAP-W13-CP003-SIDE-ANGLE-ORDERING-V1",
    ]),
    mergeRationale: "Opposite side/angle order is a distinct comparison decision.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP004_CONGRUENCE_CRITERION_SUFFICIENCY",
    cpId: "GEO-CP-004",
    learnerDecision: "Congruence criterion and evidence sufficiency",
    candidateIds: Object.freeze([
      "GEO-TMP-CP004-RHS-CRITERION-V1",
      "GEO-TMP-GAP-W10-CP004-SAS-CRITERION-V1",
      "GEO-TMP-GAP-W10-CP004-INVALID-CONGRUENCE-CRITERION-V1",
      "GEO-TMP-GAP-W10-CP004-CONGRUENCE-EVIDENCE-SUFFICIENCY-V1",
    ]),
    mergeRationale: "Merge positive criterion selection, invalid criterion rejection and evidence sufficiency into one congruence-evidence decision family.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP004_CPCT_CORRESPONDENCE",
    cpId: "GEO-CP-004",
    learnerDecision: "CPCT correspondence and consequence",
    candidateIds: Object.freeze([
      "GEO-TMP-CP004-CPCT-CORRESPONDENCE-V1",
    ]),
    mergeRationale: "Correspondence recovery after congruence is a distinct post-proof learner decision.",
  }),
]);
