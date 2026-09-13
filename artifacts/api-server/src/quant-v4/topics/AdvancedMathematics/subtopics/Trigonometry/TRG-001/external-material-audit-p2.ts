export type Trg001ExternalAuditVerdict =
  | "DIRECTLY_COVERED"
  | "COVERED_WITH_VARIATION"
  | "MISSING_CANDIDATE"
  | "ROUTE_TO_TRG_002"
  | "OUT_OF_SCOPE";

export type Trg001ExternalAuditObservation = Readonly<{
  sourceId: string;
  sourceName: string;
  sourceLocator: string;
  examTag?: string;
  archetype: string;
  targetPackage: "TRG-001" | "TRG-002" | "NONE";
  verdict: Trg001ExternalAuditVerdict;
  runtimeHome?: string;
  action?: string;
}>;

export const TRG_001_EXTERNAL_MATERIAL_AUDIT_P2 = Object.freeze({
  version: "TRG001_EXTERNAL_MATERIAL_AUDIT_P2" as const,
  authority: "AUDIT_EVIDENCE_ONLY" as const,
  mayChangeProductionFrequency: false as const,
  mayAuthorizeFreeze: false as const,
  mayAuthorizeActivation: false as const,
  sourcePolicy: Object.freeze({
    booksAndGuides: "BREADTH_CHALLENGE_EVIDENCE" as const,
    wholeExamSections: "FREQUENCY_EVIDENCE" as const,
    targetExamMissingFormsRequireRuntimeProof: true as const,
    harderNonTargetFormsDoNotExpandScopeAutomatically: true as const,
  }),
});

const DISHA = "DISHA_SSC_MATHEMATICS_GUIDE_TRIGONOMETRY" as const;
const sourceName = "Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf";

export const TRG_001_EXTERNAL_MATERIAL_OBSERVATIONS_P2: readonly Trg001ExternalAuditObservation[] = Object.freeze([
  { sourceId: DISHA, sourceName, sourceLocator: "p409 Q5", archetype: "complementary tangent product", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "cofunction/complementary-angle family", action: "Challenge-test long product construction." },
  { sourceId: DISHA, sourceName, sourceLocator: "p409 Q7", archetype: "tan theta given -> sec theta", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "sec/tan identity family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p409 Q16", archetype: "sec^2 theta - tan^2 theta scaled identity", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "fundamental identity family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p410 Q17", archetype: "(sec+tan)(1-sin) composite simplification", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "reciprocal/conjugate composite family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p410 Q21", archetype: "cofunction equation -> solve angle", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "cofunction + acute-angle solve family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p410 Q23 / p412 Q53", examTag: "SSC Sub-Inspector 2013", archetype: "tan 1° tan 2° ... tan 89° complementary pairing", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "complementary-angle family", action: "Require explicit runtime sample with long product rather than pairwise-only form." },
  { sourceId: DISHA, sourceName, sourceLocator: "p410 Q29", archetype: "3cos theta - 4cos^3 theta triple-angle reduction", targetPackage: "TRG-001", verdict: "MISSING_CANDIDATE", action: "Search active runtime for triple-angle construction; if absent, add controlled SSC-level sibling before refreeze." },
  { sourceId: DISHA, sourceName, sourceLocator: "p410 Q33", archetype: "sum of cos^2 over arithmetic angle sequence", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "cofunction/pairing family", action: "Challenge-test sequence-pairing depth and answer derivation." },
  { sourceId: DISHA, sourceName, sourceLocator: "p411 Q36-Q47", archetype: "tower/tree/kite/aircraft/two-observation line-of-sight applications", targetPackage: "TRG-002", verdict: "ROUTE_TO_TRG_002", runtimeHome: "Heights & Distances" },
  { sourceId: DISHA, sourceName, sourceLocator: "p411 Q48", examTag: "SSC Sub-Inspector 2012", archetype: "right triangle tan B + tan C", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "right-triangle ratio composite family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p411 Q50", examTag: "SSC Sub-Inspector 2012", archetype: "complementary tangent product with 60° center", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "cofunction/complementary-angle family", action: "Challenge-test multi-factor pairing." },
  { sourceId: DISHA, sourceName, sourceLocator: "p411 Q51", examTag: "SSC Sub-Inspector 2012", archetype: "(sec-cos)(cosec-sin)(tan+cot)", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "reciprocal identity composite family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p412 Q54", examTag: "SSC Sub-Inspector 2013", archetype: "minimum weighted tan^2 + cot^2", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP006 max/min family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p412 Q55", examTag: "SSC Sub-Inspector 2013", archetype: "sin-cos given -> sin+cos via square identity", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "sum/difference square family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p412 Q56", examTag: "SSC Sub-Inspector 2013", archetype: "cosec-cot given -> cosec", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "conjugate family / QL-112" },
  { sourceId: DISHA, sourceName, sourceLocator: "p412 Q58", examTag: "SSC Sub-Inspector 2014", archetype: "sec^2 + tan^2 relation -> acute standard angle", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "sec/tan identity + acute-angle solve" },
  { sourceId: DISHA, sourceName, sourceLocator: "p412 Q59", examTag: "SSC Sub-Inspector 2014", archetype: "mixed sin^2/cos^2/tan^2/sec^2 simplification", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "fundamental identity composite family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p412 Q63", examTag: "SSC 10+2 2012", archetype: "rational linear sin/cos expression -> cot theta", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "linear sin/cos relation family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p413 Q68", examTag: "SSC 10+2 2013", archetype: "cos^2-sin^2 relation -> cot theta", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "double-angle / relation-solving family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p413 Q70", examTag: "SSC 10+2 2013", archetype: "tan^2-sin^2 given -> product relation", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "derived identity relation family", action: "Challenge-test inverse relation form." },
  { sourceId: DISHA, sourceName, sourceLocator: "p413 Q71", examTag: "SSC 10+2 2014", archetype: "complementary-angle mixed fraction", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "cofunction composite family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p414 Q9", archetype: "sin theta + sin^2 theta = 1 -> cos^2 theta + cos^4 theta", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "QL-126 higher-power relation family" },
  { sourceId: DISHA, sourceName, sourceLocator: "p414 Q17", archetype: "symmetric sin^6/cos^6 and sin^4/cos^4 reduction", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "higher-power reduction family", action: "Require explicit symmetric high-even-power sample." },
  { sourceId: DISHA, sourceName, sourceLocator: "p414 Q18-Q22", archetype: "broken tree / aircraft / kite / tower application", targetPackage: "TRG-002", verdict: "ROUTE_TO_TRG_002", runtimeHome: "Heights & Distances" },
  { sourceId: DISHA, sourceName, sourceLocator: "p415 Q24", examTag: "SSC CGL 2012", archetype: "sec theta + tan theta = constant -> sin theta", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "conjugate family / QL-112" },
  { sourceId: DISHA, sourceName, sourceLocator: "p415 Q25", examTag: "SSC CGL 2012", archetype: "degree-minute-second to radians", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "degree-radian conversion family", action: "Check DMS precision variant explicitly." },
  { sourceId: DISHA, sourceName, sourceLocator: "p415 Q26 / Q35", examTag: "SSC CGL 2012-2013", archetype: "triangle geometry angle expressed in radians", targetPackage: "NONE", verdict: "OUT_OF_SCOPE", runtimeHome: "Geometry/angle-measure boundary", action: "Do not expand TRG-001 for pure triangle-angle geometry." },
  { sourceId: DISHA, sourceName, sourceLocator: "p415 Q29", examTag: "SSC CGL 2012", archetype: "sin 2a = cos 3a -> cot 6a - cot 2a", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "cofunction + multiple-angle evaluation", action: "Challenge-test multiple-angle chain." },
  { sourceId: DISHA, sourceName, sourceLocator: "p415 Q34", examTag: "SSC CGL 2013", archetype: "long cotangent complementary product divided by cos pairing", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "cofunction/complementary product family", action: "Challenge-test expression length and cancellation depth." },
  { sourceId: DISHA, sourceName, sourceLocator: "p415 Q37", examTag: "SSC CGL 2013", archetype: "tan a + cot a = 2 -> seventh powers", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "relation + power evaluation", action: "Check whether power-7 expression is supported or should remain outlier variation." },
  { sourceId: DISHA, sourceName, sourceLocator: "p415 Q39", examTag: "SSC CGL 2014", archetype: "long consecutive-angle sine sum", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "cofunction/series pairing family", action: "Require explicit runtime construction before freeze." },
  { sourceId: DISHA, sourceName, sourceLocator: "p416 Q40", examTag: "SSC CGL 2014", archetype: "cubic trig sum/difference factorisation", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "QL-143 P2" },
  { sourceId: DISHA, sourceName, sourceLocator: "p416 Q43", examTag: "SSC CGL 2014", archetype: "cos a + sec a = constant -> cos^3 a + sec^3 a", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "reciprocal algebra family", action: "Require runtime sample of x + 1/x -> cubic symmetric expression." },
  { sourceId: DISHA, sourceName, sourceLocator: "p416 Q45", examTag: "SSC CGL 2014", archetype: "changing shadow with sun altitude", targetPackage: "TRG-002", verdict: "ROUTE_TO_TRG_002", runtimeHome: "Heights & Distances" },
]);

export const TRG_001_EXTERNAL_MATERIAL_P2_SUMMARY = Object.freeze(
  TRG_001_EXTERNAL_MATERIAL_OBSERVATIONS_P2.reduce<Record<Trg001ExternalAuditVerdict, number>>(
    (acc, row) => {
      acc[row.verdict] += 1;
      return acc;
    },
    {
      DIRECTLY_COVERED: 0,
      COVERED_WITH_VARIATION: 0,
      MISSING_CANDIDATE: 0,
      ROUTE_TO_TRG_002: 0,
      OUT_OF_SCOPE: 0,
    },
  ),
);

export const TRG_001_EXTERNAL_MATERIAL_P2_BLOCKERS = Object.freeze(
  TRG_001_EXTERNAL_MATERIAL_OBSERVATIONS_P2
    .filter((row) => row.verdict === "MISSING_CANDIDATE" || row.verdict === "COVERED_WITH_VARIATION")
    .map((row) => Object.freeze({ sourceLocator: row.sourceLocator, archetype: row.archetype, verdict: row.verdict, action: row.action })),
);
