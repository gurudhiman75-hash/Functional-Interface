export type Trg001ExternalCoverageStatus =
  | "DIRECTLY_COVERED"
  | "COVERED_WITH_VARIATION"
  | "MISSING"
  | "ROUTE_TO_TRG_002"
  | "OUT_OF_SCOPE";

export type Trg001ExternalEvidence = Readonly<{
  sourceId: string;
  sourceLabel: string;
  sourceLocator: string;
  archetype: string;
  status: Trg001ExternalCoverageStatus;
  packageId: "TRG-001" | "TRG-002" | null;
  mappedQlIds: readonly string[];
  note: string;
}>;

export const TRG_001_EXTERNAL_SOURCE_AUDIT_P2 = Object.freeze({
  version: "TRG001_EXTERNAL_SOURCE_AUDIT_P2" as const,
  allowedStatuses: [
    "DIRECTLY_COVERED",
    "COVERED_WITH_VARIATION",
    "MISSING",
    "ROUTE_TO_TRG_002",
    "OUT_OF_SCOPE",
  ] as const,
  promotionAuthorized: false as const,
  auditOnly: true as const,
});

/**
 * First uploaded-book challenge set.
 * Source: Disha SSC Mathematics Guide, chapter “Trigonometry and Its Applications”.
 *
 * This is an audit registry, not a production quota or generation authority.
 */
export const TRG_001_DISHA_SSC_BOOK_AUDIT_P2: readonly Trg001ExternalEvidence[] = Object.freeze([
  {
    sourceId: "DISHA-TRG-Q39",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q39",
    archetype: "Long consecutive-angle sine sum",
    status: "COVERED_WITH_VARIATION",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-024", "TRG-001-QL-136", "TRG-001-QL-137"],
    note: "Angle relations/complementary symmetry are owned, but long-series construction should be explicitly sampled before claiming direct coverage.",
  },
  {
    sourceId: "DISHA-TRG-Q40",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q40",
    archetype: "Sum/difference of cubic trig ratios with cancellation",
    status: "DIRECTLY_COVERED",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-143"],
    note: "P2 cubic-factorization remediation directly covers the core algebraic family.",
  },
  {
    sourceId: "DISHA-TRG-Q41",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q41",
    archetype: "Given sin angle as ratio; combine sec angle with complementary-angle sine",
    status: "DIRECTLY_COVERED",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-094", "TRG-001-QL-099", "TRG-001-QL-100"],
    note: "Ratio reconstruction plus complementary relation is already in the active family set.",
  },
  {
    sourceId: "DISHA-TRG-Q42",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q42",
    archetype: "cosec theta + cot theta given; derive cosec theta",
    status: "DIRECTLY_COVERED",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-112"],
    note: "Conjugate reciprocal family is already implemented and depth-remediated.",
  },
  {
    sourceId: "DISHA-TRG-Q43",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q43",
    archetype: "cos a + sec a given; derive cos^3 a + sec^3 a",
    status: "COVERED_WITH_VARIATION",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-126", "TRG-001-QL-143"],
    note: "Underlying reciprocal/algebraic identity machinery exists; explicit cube-sum-from-x+1/x construction should be sampled as a book challenge.",
  },
  {
    sourceId: "DISHA-TRG-Q44",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q44",
    archetype: "Linear sin/cos relation; derive cot theta",
    status: "DIRECTLY_COVERED",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-126"],
    note: "Linear relation to target-ratio conversion is a known TRG family.",
  },
  {
    sourceId: "DISHA-TRG-Q45",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q45",
    archetype: "Tower shadow changes between 60 and 45 degrees",
    status: "ROUTE_TO_TRG_002",
    packageId: "TRG-002",
    mappedQlIds: [],
    note: "Heights & Distances application; must not count as a TRG-001 miss.",
  },
  {
    sourceId: "DISHA-L1-Q15",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Level-I Q15",
    archetype: "sec theta + tan theta = x; derive sin theta",
    status: "DIRECTLY_COVERED",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-112"],
    note: "Conjugate identity family directly covers this construction.",
  },
  {
    sourceId: "DISHA-L1-Q16",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Level-I Q16",
    archetype: "Composite product involving cot/cosec and tan/sec",
    status: "DIRECTLY_COVERED",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-112", "TRG-001-QL-136"],
    note: "Composite reciprocal/conjugate identity construction is in scope.",
  },
  {
    sourceId: "DISHA-L1-Q17",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Level-I Q17",
    archetype: "High even powers: sin^6/cos^6 with sin^4/cos^4",
    status: "COVERED_WITH_VARIATION",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-126"],
    note: "Higher-power reduction is represented, but this exact symmetric-power family needs explicit runtime challenge sampling.",
  },
  {
    sourceId: "DISHA-Q53",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q53",
    archetype: "Product tan1° tan2° ... tan89° using complementary pairing",
    status: "COVERED_WITH_VARIATION",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-136", "TRG-001-QL-137"],
    note: "Complementary-angle pairing is owned; very-long product construction should be audited separately for generation practicality.",
  },
  {
    sourceId: "DISHA-Q54",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q54",
    archetype: "Minimum of a*tan^2 theta + b*cot^2 theta",
    status: "DIRECTLY_COVERED",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-142"],
    note: "Max/min trig expression family is already part of CP-006.",
  },
  {
    sourceId: "DISHA-Q56",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q56",
    archetype: "cosec theta - cot theta given; derive cosec theta",
    status: "DIRECTLY_COVERED",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-112"],
    note: "Conjugate reciprocal family directly covers this construction.",
  },
  {
    sourceId: "DISHA-Q57",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q57",
    archetype: "Hill/line-of-sight two-angle application",
    status: "ROUTE_TO_TRG_002",
    packageId: "TRG-002",
    mappedQlIds: [],
    note: "Application-heavy height/distance problem belongs to TRG-002.",
  },
  {
    sourceId: "DISHA-Q58",
    sourceLabel: "Disha SSC Mathematics Guide",
    sourceLocator: "Trigonometry and Its Applications, Q58",
    archetype: "sec^2 theta + tan^2 theta given; solve acute angle",
    status: "DIRECTLY_COVERED",
    packageId: "TRG-001",
    mappedQlIds: ["TRG-001-QL-094", "TRG-001-QL-099", "TRG-001-QL-100"],
    note: "Pythagorean sec/tan identity plus acute standard-angle solve is directly represented.",
  },
]);

export function summarizeTrg001ExternalEvidence(
  evidence: readonly Trg001ExternalEvidence[] = TRG_001_DISHA_SSC_BOOK_AUDIT_P2,
) {
  return evidence.reduce<Record<Trg001ExternalCoverageStatus, number>>(
    (summary, item) => {
      summary[item.status] += 1;
      return summary;
    },
    {
      DIRECTLY_COVERED: 0,
      COVERED_WITH_VARIATION: 0,
      MISSING: 0,
      ROUTE_TO_TRG_002: 0,
      OUT_OF_SCOPE: 0,
    },
  );
}
