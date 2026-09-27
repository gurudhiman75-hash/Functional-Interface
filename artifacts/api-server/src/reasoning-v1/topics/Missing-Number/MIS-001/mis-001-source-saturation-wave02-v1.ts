export type Mis001SourceSupportV1 =
  | "DIRECT_PYQ"
  | "FAMILY_CORROBORATED"
  | "REUSE_ONLY"
  | "SOURCE_THIN_HOLD"
  | "EXCLUDED_INVALID";

export type Mis001OwnershipDecisionV1 =
  | "RETAIN_FOR_MERGE_SPLIT"
  | "REUSE_EXISTING_AUTHORITY"
  | "HOLD_NO_PERMANENT_QL"
  | "EXCLUDE_RUNTIME";

export interface Mis001SourceDecisionV1 {
  readonly candidateId: string;
  readonly support: Mis001SourceSupportV1;
  readonly decision: Mis001OwnershipDecisionV1;
  readonly family: string;
  readonly note: string;
}

export const MIS_001_SOURCE_EVIDENCE_V1 = Object.freeze([
  {
    sourceId: "SSC-CPO-2016-06-06-AM",
    evidence: "Missing-number square uses sum of paired products: (1×2)+(3×4), then same rule on target.",
    supports: ["PAIR_PRODUCT", "BOX_PAIRING", "MULTI_EXAMPLE_CONFIRMATION"],
  },
  {
    sourceId: "SSC-CGL-2017-08-09-S3",
    evidence: "Figure result uses two pair products added together.",
    supports: ["PAIR_PRODUCT", "BOX_PAIRING"],
  },
  {
    sourceId: "SSC-GD-2019-03-03-S3",
    evidence: "Figure uses difference of two products followed by a fixed multiplier.",
    supports: ["COMPOUND_ARITHMETIC", "PAIR_PRODUCT", "MULTI_STAGE"],
  },
  {
    sourceId: "SSC-GD-2019-03-06-S3",
    evidence: "Figure uses product relation across adjacent sectors.",
    supports: ["PRODUCT", "CIRCLE_OR_SECTOR_FIGURE"],
  },
  {
    sourceId: "SSC-GD-2019-03-11-S3",
    evidence: "Figure uses consecutive square values.",
    supports: ["SQUARE", "CONSECUTIVE_NUMBER_PROPERTY"],
  },
  {
    sourceId: "SSC-STENO-2017-09-14-S2",
    evidence: "Triangle uses sum of three vertices followed by multiplication by a constant.",
    supports: ["TRIANGLE", "THREE_INPUT_SUM", "COMPOUND_ARITHMETIC"],
  },
  {
    sourceId: "SSC-CHSL-2015-11-01-AM",
    evidence: "Figure result is sum of squares of two visible values.",
    supports: ["SUM_OF_SQUARES", "POWER_RELATION"],
  },
  {
    sourceId: "SSC-CHSL-2017-01-20-EVE",
    evidence: "Table uses sum of squares; missing position is an input and is recovered inversely.",
    supports: ["SUM_OF_SQUARES", "INVERSE_MISSING_POSITION"],
  },
  {
    sourceId: "SSC-CHSL-2020-10-16-S1",
    evidence: "Figure uses square of a sum.",
    supports: ["SQUARE_OF_SUM", "COMPOUND_ARITHMETIC"],
  },
  {
    sourceId: "SSC-CHSL-2017-01-11-AFT",
    evidence: "Table mixes a cube and a square in one repeated relation.",
    supports: ["MIXED_POWER", "COMPOUND_ARITHMETIC"],
  },
  {
    sourceId: "SSC-CGL-2010-S1",
    evidence: "Bracketed missing value is the sum of digits of the visible numbers.",
    supports: ["DIGIT_SUM", "DIGIT_PROPERTY"],
  },
  {
    sourceId: "SSC-CGL-2020-T1-2021-08-16-S1",
    evidence: "Row rule combines ordinary arithmetic with a product-of-digits term.",
    supports: ["DIGIT_PROPERTY", "DIGIT_PLUS_VISIBLE_ARITHMETIC", "COMPOUND_ARITHMETIC"],
  },
  {
    sourceId: "SSC-CGL-2021-2022-04-13-S1",
    evidence: "Pattern uses (a+b)(a-b), confirming compound pair operations rather than a single primitive formula.",
    supports: ["COMPOUND_ARITHMETIC", "PAIR_SUM_DIFFERENCE"],
  },
  {
    sourceId: "SSC-CGL-2021-2022-04-19-S3",
    evidence: "Pattern uses a two-stage relation built from adjusted visible values and multiplication.",
    supports: ["COMPOUND_ARITHMETIC", "MULTI_STAGE"],
  },
] as const);

const direct = new Set([
  "MIS-CAND-001","MIS-CAND-002","MIS-CAND-003","MIS-CAND-009",
  "MIS-CAND-016","MIS-CAND-019","MIS-CAND-023","MIS-CAND-024",
  "MIS-CAND-039","MIS-CAND-040","MIS-CAND-041","MIS-CAND-042",
  "MIS-CAND-043","MIS-CAND-044","MIS-CAND-048","MIS-CAND-050",
  "MIS-CAND-051","MIS-CAND-052","MIS-CAND-053","MIS-CAND-055",
  "MIS-CAND-056","MIS-CAND-069","MIS-CAND-073",
]);

const reuseMap: Readonly<Record<string, string>> = Object.freeze({
  "MIS-CAND-057": "MIS-CAND-001",
  "MIS-CAND-058": "MIS-CAND-003",
  "MIS-CAND-060": "MIS-CAND-017",
  "MIS-CAND-061": "MIS-CAND-012",
  "MIS-CAND-062": "MIS-CAND-038",
  "MIS-CAND-063": "MIS-CAND-051",
  "MIS-CAND-065": "MIS-CAND-052",
  "MIS-CAND-066": "MIS-CAND-055",
  "MIS-CAND-079": "MIS-CAND-001",
  "MIS-CAND-080": "MIS-CAND-017",
  "MIS-CAND-081": "MIS-CAND-051",
  "MIS-CAND-082": "MIS-CAND-075",
  "MIS-CAND-083": "MIS-CAND-051",
});

const invalidExclude = new Set(["MIS-CAND-078"]);

const sourceThinHold = new Set([
  "MIS-CAND-034", // small factorial: preparation references exist, but no strong direct missing-figure authority recovered
  "MIS-CAND-072", // number + reversed number: reversal is seen in other reasoning families, direct Missing Number support not established
]);

const labels: Readonly<Record<string, string>> = Object.freeze({
  "MIS-CAND-001":"primitive two-input arithmetic",
  "MIS-CAND-002":"primitive two-input arithmetic",
  "MIS-CAND-003":"primitive two-input arithmetic",
  "MIS-CAND-004":"primitive two-input arithmetic",
  "MIS-CAND-005":"two-input arithmetic with constant",
  "MIS-CAND-006":"two-input arithmetic with constant",
  "MIS-CAND-007":"two-input arithmetic with constant",
  "MIS-CAND-008":"two-input arithmetic with constant",
  "MIS-CAND-009":"three-input arithmetic",
  "MIS-CAND-010":"three-input arithmetic",
  "MIS-CAND-011":"three-input compound arithmetic",
  "MIS-CAND-012":"three-input compound arithmetic",
  "MIS-CAND-013":"three-input compound arithmetic",
  "MIS-CAND-014":"three-input compound arithmetic",
  "MIS-CAND-015":"three-input compound arithmetic",
  "MIS-CAND-016":"power relation",
  "MIS-CAND-017":"power plus visible value",
  "MIS-CAND-018":"power plus visible value",
  "MIS-CAND-019":"sum/difference of powers",
  "MIS-CAND-020":"sum/difference of powers",
  "MIS-CAND-021":"mixed product and power",
  "MIS-CAND-022":"mixed product and power",
  "MIS-CAND-023":"power relation",
  "MIS-CAND-024":"power of pair sum/difference",
  "MIS-CAND-025":"power of pair sum/difference",
  "MIS-CAND-026":"consecutive-number product",
  "MIS-CAND-027":"consecutive-number product",
  "MIS-CAND-028":"pair sum/product compound",
  "MIS-CAND-029":"pair sum/product compound",
  "MIS-CAND-030":"pair difference/product compound",
  "MIS-CAND-031":"consecutive-number aggregate",
  "MIS-CAND-032":"consecutive-number aggregate",
  "MIS-CAND-033":"triangular-number property",
  "MIS-CAND-034":"factorial number property",
  "MIS-CAND-035":"triangle compound arithmetic",
  "MIS-CAND-036":"triangle compound arithmetic",
  "MIS-CAND-037":"triangle compound arithmetic",
  "MIS-CAND-038":"triangle compound arithmetic",
  "MIS-CAND-039":"triangle three-input sum",
  "MIS-CAND-040":"triangle compound arithmetic",
  "MIS-CAND-041":"triangle compound arithmetic",
  "MIS-CAND-042":"triangle power relation",
  "MIS-CAND-043":"circle/sector sum",
  "MIS-CAND-044":"circle/sector sum",
  "MIS-CAND-045":"circle/sector compound arithmetic",
  "MIS-CAND-046":"opposite-pair circle relation",
  "MIS-CAND-047":"opposite-pair circle relation",
  "MIS-CAND-048":"opposite-pair circle relation",
  "MIS-CAND-049":"opposite-pair circle relation",
  "MIS-CAND-050":"box/corner sum",
  "MIS-CAND-051":"box paired products",
  "MIS-CAND-052":"box paired products",
  "MIS-CAND-053":"box paired products",
  "MIS-CAND-054":"box compound arithmetic",
  "MIS-CAND-055":"box paired products",
  "MIS-CAND-056":"box paired products",
  "MIS-CAND-057":"inverse presentation",
  "MIS-CAND-058":"inverse presentation",
  "MIS-CAND-059":"inverse compound arithmetic",
  "MIS-CAND-060":"inverse presentation",
  "MIS-CAND-061":"inverse presentation",
  "MIS-CAND-062":"inverse presentation",
  "MIS-CAND-063":"pairing presentation",
  "MIS-CAND-064":"paired-product difference",
  "MIS-CAND-065":"pairing presentation",
  "MIS-CAND-066":"pairing presentation",
  "MIS-CAND-067":"paired-sum product",
  "MIS-CAND-068":"paired sum/difference product",
  "MIS-CAND-069":"digit property",
  "MIS-CAND-070":"digit property",
  "MIS-CAND-071":"digit property",
  "MIS-CAND-072":"digit reversal",
  "MIS-CAND-073":"digit property plus visible arithmetic",
  "MIS-CAND-074":"compound digit property",
  "MIS-CAND-075":"mixed two-stage arithmetic",
  "MIS-CAND-076":"mixed two-stage arithmetic",
  "MIS-CAND-077":"mixed two-stage arithmetic",
  "MIS-CAND-078":"mixed two-stage arithmetic",
  "MIS-CAND-079":"rule-competition presentation",
  "MIS-CAND-080":"rule-competition presentation",
  "MIS-CAND-081":"rule-competition presentation",
  "MIS-CAND-082":"rule-competition presentation",
  "MIS-CAND-083":"rule-competition presentation",
});

export const MIS_001_SOURCE_DECISIONS_V1: readonly Mis001SourceDecisionV1[] =
  Object.freeze(Array.from({ length: 83 }, (_, index) => {
    const candidateId = `MIS-CAND-${String(index + 1).padStart(3, "0")}`;
    const reusedAuthority = reuseMap[candidateId];
    if (reusedAuthority) {
      return Object.freeze({
        candidateId,
        support: "REUSE_ONLY" as const,
        decision: "REUSE_EXISTING_AUTHORITY" as const,
        family: labels[candidateId]!,
        note: `Presentation/inverse/rule-competition variant of ${reusedAuthority}; no independent QL.`,
      });
    }
    if (invalidExclude.has(candidateId)) {
      return Object.freeze({
        candidateId,
        support: "EXCLUDED_INVALID" as const,
        decision: "EXCLUDE_RUNTIME" as const,
        family: labels[candidateId]!,
        note: "Invalid three-input prototype: the implemented formula ignored the third displayed input. Removed from runtime rather than inventing a replacement rule.",
      });
    }
    if (sourceThinHold.has(candidateId)) {
      return Object.freeze({
        candidateId,
        support: "SOURCE_THIN_HOLD" as const,
        decision: "HOLD_NO_PERMANENT_QL" as const,
        family: labels[candidateId]!,
        note: candidateId === "MIS-CAND-034"
          ? "Factorial is mentioned in preparation material, but direct competitive-exam Missing Number figure evidence is not strong enough for permanent authority."
          : "Digit reversal is a known reasoning mechanism, but direct Missing Number source authority for number-plus-reverse is not established.",
      });
    }
    return Object.freeze({
      candidateId,
      support: direct.has(candidateId) ? "DIRECT_PYQ" as const : "FAMILY_CORROBORATED" as const,
      decision: "RETAIN_FOR_MERGE_SPLIT" as const,
      family: labels[candidateId]!,
      note: direct.has(candidateId)
        ? "Direct previous-paper evidence supports this learner-task family; exact formula still participates in merge/split review."
        : "The broader Missing Number family is source-backed, but this exact formula must not automatically become its own permanent QL.",
    });
  }));

export const MIS_001_WAVE02_SOURCE_AUDIT_V1 = Object.freeze({
  version: "MIS_001_SOURCE_SATURATION_WAVE02_2026_09_27_V1" as const,
  status: "SOURCE_AUDIT_COMPLETE__TWO_SOURCE_THIN_HOLDS__MERGE_SPLIT_PENDING" as const,
  sourceDecisionCount: MIS_001_SOURCE_DECISIONS_V1.length,
  directPyqCount: MIS_001_SOURCE_DECISIONS_V1.filter((x) => x.support === "DIRECT_PYQ").length,
  familyCorroboratedCount: MIS_001_SOURCE_DECISIONS_V1.filter((x) => x.support === "FAMILY_CORROBORATED").length,
  reuseOnlyCount: MIS_001_SOURCE_DECISIONS_V1.filter((x) => x.support === "REUSE_ONLY").length,
  sourceThinHoldCount: MIS_001_SOURCE_DECISIONS_V1.filter((x) => x.support === "SOURCE_THIN_HOLD").length,
  excludedInvalidCount: MIS_001_SOURCE_DECISIONS_V1.filter((x) => x.support === "EXCLUDED_INVALID").length,
  activeRuntimePatternCount: 82 as const,
  activeSemanticAuthorityCount: 69 as const,
  permanentQlAllocationAllowed: false as const,
  nextWave: "FORMULA_TO_LEARNER_SKILL_MERGE_SPLIT" as const,
  ownershipBoundary: Object.freeze({
    numberSeriesBelongsHere: false as const,
    formulaChangeAloneCreatesQl: false as const,
    rendererChangeAloneCreatesQl: false as const,
    inverseMissingPositionAloneCreatesQl: false as const,
    evidenceCountAloneCreatesQl: false as const,
  }),
});
