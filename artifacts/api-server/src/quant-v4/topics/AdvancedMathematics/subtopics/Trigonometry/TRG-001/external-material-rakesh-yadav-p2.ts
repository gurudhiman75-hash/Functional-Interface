import type { Trg001ExternalAuditObservation } from "./external-material-audit-p2";

const RY7300 = "RAKESH_YADAV_7300_TRIGONOMETRY" as const;
const sourceName = "Rakesh Yadav Maths 7300 Book PDF.pdf";

/**
 * External breadth probes from the uploaded Rakesh Yadav 7300 SSC Mathematics
 * book. Printed pages 676-713 are Core Trigonometry; printed 714-727 are Height
 * & Distance and must be routed to TRG-002 rather than used to inflate TRG-001
 * coverage.
 *
 * These rows are audit evidence only. They do not authorize production,
 * freezing, activation or frequency weighting.
 */
export const TRG_001_RY7300_EXTERNAL_OBSERVATIONS_P2: readonly Trg001ExternalAuditObservation[] = Object.freeze([
  { sourceId: RY7300, sourceName, sourceLocator: "printed p676 Q1", archetype: "minimum of weighted sin^2 and cos^2 expression", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP006 max/min family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p676 Q2", archetype: "acute-angle range of sin theta + cos theta", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP006 linear range/max-min family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p676 Q4", archetype: "maximum of a sin theta + b cos theta", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP006 linear max/min family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p676 Q6", archetype: "minimum of weighted tan^2 theta + cot^2 theta", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP006 max/min family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p676 Q8", archetype: "acute-angle ordering of cos theta and cos^2 theta", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "acute interval/order family", action: "Challenge-test same-function power ordering in addition to sin/cos ordering." },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p676 Q12", archetype: "linear relation in sin^2/cos^2 -> tan theta", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP005 derived relation family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p676 Q14", archetype: "cos^2 + cos^4 relation -> tan^2 + tan^4", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "CP006 higher-power relation family / QL-126 neighbourhood", action: "Retain explicit probe for power-transfer relation beyond the new QL-126 sibling." },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p676 Q18", archetype: "complementary tangent/cotangent mixed fraction", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP003/CP006 cofunction composite family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p676 Q21-Q23", archetype: "multi-identity simplification using sec/cot/sin/tan", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP004/CP006 identity composite families" },

  { sourceId: RY7300, sourceName, sourceLocator: "printed p679 Q68", archetype: "complementary cosec/sec/tan expression from given cosec value", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP003 cofunction + reciprocal family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p679 Q69", archetype: "tan 4 tan 43 tan 47 tan 86 complementary product", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "cofunction/complementary product family", action: "Require explicit four-factor pairing sample." },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p679 Q70", archetype: "tan 1 tan 2 ... tan 89 long complementary product", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "cofunction/complementary product family", action: "Require long-product construction; pairwise-only proof is not enough." },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p679 Q72/Q75/Q76", archetype: "long sine-square angle-sequence sum using complementary pairing", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "cofunction/sequence pairing family", action: "Challenge-test sequence length, endpoint handling and pair count." },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p679 Q82", archetype: "sin(linear angle)=cos(linear angle) -> solve angle sum", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP003 cofunction equation family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p679 Q85-Q86", archetype: "sec/cosec complementary relation -> solve angle or angle sum", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP003 cofunction angle-solving family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p679 Q88-Q89", archetype: "tan multiple-angle complementary relation -> derived angle value", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "CP003/CP006 angle relation family", action: "Challenge-test chained multiple-angle cofunction solving." },

  { sourceId: RY7300, sourceName, sourceLocator: "printed p681 Q120-Q122", archetype: "componendo-style algebra from tan/cot or sin/cos ratio", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "CP005 algebraic relation family", action: "Require explicit ratio-transform sample; do not rely only on direct identity forms." },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p681 Q123-Q129", archetype: "quadrant/reduction and allied-angle evaluation", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP003 quadrant/reduction family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p681 Q130-Q132", archetype: "find acute angle from identity or cofunction equation", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP003/CP005 angle-solving family" },

  { sourceId: RY7300, sourceName, sourceLocator: "printed p686 Q213-Q219", archetype: "triangle reconstruction plus mixed ratio evaluation", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP001/CP005 right-triangle reconstruction family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p686 Q220", archetype: "kite height/string/ground-angle application", targetPackage: "TRG-002", verdict: "ROUTE_TO_TRG_002", runtimeHome: "Heights & Distances" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p686 Q224", archetype: "sec theta + tan theta given -> sec theta", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP005 conjugate family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p686 Q225", archetype: "sec theta parameterized as x + 1/(4x) -> sec+tan", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "CP005 reciprocal/conjugate algebra family", action: "Challenge-test parameterized conjugate construction." },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p686 Q226", archetype: "sec theta + tan theta = sqrt(3) -> tan 3theta", targetPackage: "TRG-001", verdict: "MISSING_CANDIDATE", action: "Cross-check triple-angle runtime. If absent, combine with existing Disha triple-angle blocker and add one controlled SSC-level remediation family." },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p686 Q227-Q230", archetype: "sec/tan or cosec/cot conjugate relations -> derived expression", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP005 conjugate family" },

  { sourceId: RY7300, sourceName, sourceLocator: "printed p687 Q236-Q240", archetype: "radian-degree conversion including DMS and triangle-angle framing", targetPackage: "TRG-001", verdict: "COVERED_WITH_VARIATION", runtimeHome: "CP003 degree-radian conversion family", action: "Keep DMS precision as explicit challenge probe; route pure triangle-angle geometry away from TRG when trig is not decisive." },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p687 Q241", archetype: "a sin theta + b cos theta = c -> orthogonal linear combination", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP005 linear sin/cos family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p687 Q242", archetype: "cos x + cos^2 x = 1 -> high even-power expression", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "QL-126 P2 higher-power relation family" },
  { sourceId: RY7300, sourceName, sourceLocator: "printed p687 Q243-Q244", archetype: "sin/cos sum-difference relation -> complementary expression", targetPackage: "TRG-001", verdict: "DIRECTLY_COVERED", runtimeHome: "CP004/CP005 sum-difference square family" },

  { sourceId: RY7300, sourceName, sourceLocator: "printed p714-p727 chapter boundary", archetype: "tower/shadow/elevation/depression/observer applications", targetPackage: "TRG-002", verdict: "ROUTE_TO_TRG_002", runtimeHome: "Heights & Distances", action: "Audit separately under TRG-002; do not credit these pages to TRG-001." },
]);

export const TRG_001_RY7300_EXTERNAL_SUMMARY_P2 = Object.freeze(
  TRG_001_RY7300_EXTERNAL_OBSERVATIONS_P2.reduce<Record<string, number>>((acc, row) => {
    acc[row.verdict] = (acc[row.verdict] ?? 0) + 1;
    return acc;
  }, {}),
);

export const TRG_001_RY7300_EXTERNAL_BLOCKERS_P2 = Object.freeze(
  TRG_001_RY7300_EXTERNAL_OBSERVATIONS_P2
    .filter((row) => row.verdict === "MISSING_CANDIDATE" || row.verdict === "COVERED_WITH_VARIATION")
    .map((row) => Object.freeze({
      sourceLocator: row.sourceLocator,
      archetype: row.archetype,
      verdict: row.verdict,
      action: row.action,
    })),
);
