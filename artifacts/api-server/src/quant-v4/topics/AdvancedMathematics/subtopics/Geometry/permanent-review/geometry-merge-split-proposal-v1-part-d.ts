import { defineGeometryMergeSplitFamilyV1 } from "./geometry-merge-split-proposal-v1-types";

export const GEO_MERGE_SPLIT_PROPOSAL_V1_PART_D = Object.freeze([
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP013_INTERSECTING_CHORD_PRODUCT", cpId: "GEO-CP-013", learnerDecision: "Use the intersecting-chord product relation", candidateIds: Object.freeze(["GEO-TMP-CP013-INTERSECTING-CHORDS-V1"]), mergeRationale: "Internal chord intersection has a different segment topology from external secants and tangent-secant power." }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP013_SECANT_SECANT_MISSING_WHOLE",
    cpId: "GEO-CP-013",
    learnerDecision: "Find a missing whole secant when the external part is known",
    candidateIds: Object.freeze(["GEO-TMP-CP013-SECANT-SECANT-V1"]),
    mergeRationale: "Keep distinct: with the external part known, external × whole equality leaves a linear unknown whole-secant equation.",
  }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP013_SECANT_SECANT_REVERSE_EXTERNAL_QUADRATIC",
    cpId: "GEO-CP-013",
    learnerDecision: "Find an unknown external secant when its internal chord part is known",
    candidateIds: Object.freeze(["GEO-TMP-GAP-W12-CP013-REVERSE-UNKNOWN-EXTERNAL-SECANT-V1"]),
    mergeRationale: "Keep distinct: the whole secant is x plus the known internal chord, so the power relation becomes x(x+c)=P and requires solving a quadratic with a positive-length root check. That governing equation and misconception structure differ from direct whole-secant recovery.",
  }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP013_TANGENT_SECANT_POWER", cpId: "GEO-CP-013", learnerDecision: "Use tangent-secant power of a point", candidateIds: Object.freeze(["GEO-TMP-CP013-TANGENT-SECANT-V1"]), mergeRationale: "The squared tangent term changes the governing equation and misconception structure, so it remains separate from both secant-secant families." }),

  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP014_CHORD_PYTHAGORAS_SYNTHESIS", cpId: "GEO-CP-014", learnerDecision: "Combine chord bisection with Pythagoras", candidateIds: Object.freeze(["GEO-TMP-CP014-CHORD-PYTHAGORAS-V1"]), mergeRationale: "This two-theorem metric graph is distinct and both theorem families are essential." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP014_CYCLIC_ISOSCELES_SYNTHESIS", cpId: "GEO-CP-014", learnerDecision: "Combine cyclic-angle and isosceles-triangle relations", candidateIds: Object.freeze(["GEO-TMP-CP014-CYCLIC-ISOSCELES-V1"]), mergeRationale: "Cyclic supplementation followed by isosceles angle recovery is its own solve graph." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP014_TANGENT_TRIANGLE_SYNTHESIS", cpId: "GEO-CP-014", learnerDecision: "Combine radius-tangent perpendicularity with triangle angle sum", candidateIds: Object.freeze(["GEO-TMP-CP014-TANGENT-TRIANGLE-V1"]), mergeRationale: "This graph uses the tangent theorem to create the essential right angle before triangle-angle recovery." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP014_BPT_ANGLE_BISECTOR_SYNTHESIS", cpId: "GEO-CP-014", learnerDecision: "Combine BPT with the angle-bisector theorem", candidateIds: Object.freeze(["GEO-TMP-CP014-BPT-BISECTOR-V1"]), mergeRationale: "A similarity/proportionality stage feeds a second angle-bisector stage, so this remains a distinct synthesis authority." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP014_COMMON_TANGENT_SIMILARITY_SYNTHESIS", cpId: "GEO-CP-014", learnerDecision: "Combine common-tangent geometry with similarity", candidateIds: Object.freeze(["GEO-TMP-GAP-W2-CP014-COMMON-TANGENT-SIMILARITY-V1"]), mergeRationale: "Two-circle tangent structure followed by similarity is a source-backed mixed solve graph." }),
  defineGeometryMergeSplitFamilyV1({ proposalKey: "CP014_TANGENT_CENTRAL_INSCRIBED_SYNTHESIS", cpId: "GEO-CP-014", learnerDecision: "Chain tangent angle to central angle to inscribed angle", candidateIds: Object.freeze(["GEO-TMP-GAP-W2-CP014-TANGENT-CENTRAL-INSCRIBED-V1"]), mergeRationale: "The tangent-central-inscribed conversion chain is materially different from the simple tangent-triangle synthesis." }),
  defineGeometryMergeSplitFamilyV1({
    proposalKey: "CP014_PARALLEL_CONGRUENCE_CPCT_SYNTHESIS",
    cpId: "GEO-CP-014",
    learnerDecision: "Use parallel-angle evidence to prove congruence and extract a CPCT length",
    candidateIds: Object.freeze(["GEO-TMP-GAP-W5-CP014-PARALLELOGRAM-EXTENSION-MIDPOINT-V1", "GEO-TMP-GAP-W5-CP014-EQUAL-PARALLEL-DIAGONAL-CPCT-V1"]),
    mergeRationale: "ASA and SAS are parameterized proof criteria inside the same audited higher-order graph: parallel-angle transfer, congruence proof, then CPCT length extraction.",
  }),
]);
