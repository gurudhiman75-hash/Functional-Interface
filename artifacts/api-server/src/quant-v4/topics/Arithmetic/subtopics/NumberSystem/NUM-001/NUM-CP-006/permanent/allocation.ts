export const NUM_CP006_PERMANENT_QL_IDS = [
  "NUM-QL-070", "NUM-QL-071", "NUM-QL-072", "NUM-QL-073",
  "NUM-QL-074", "NUM-QL-075", "NUM-QL-076", "NUM-QL-077",
  "NUM-QL-078", "NUM-QL-079", "NUM-QL-080", "NUM-QL-081",
  "NUM-QL-082", "NUM-QL-083", "NUM-QL-084", "NUM-QL-085",
  "NUM-QL-086", "NUM-QL-087", "NUM-QL-088", "NUM-QL-089",
  "NUM-QL-090", "NUM-QL-091", "NUM-QL-092", "NUM-QL-093",
  "NUM-QL-094", "NUM-QL-095", "NUM-QL-096", "NUM-QL-097",
] as const;

export type NumCp006PermanentQlId = (typeof NUM_CP006_PERMANENT_QL_IDS)[number];
export type NumCp006PrototypeId = `NUM-CP006-PROT-${string}`;
export type NumCp006AuthorityId = `NUM-CP006-AUTH-${string}`;
export type NumCp006QlTemplateId = `NUM-CP006-QLC-${string}`;
export type NumCp006SolveModeId = `NUM-CP006-SM-${string}`;

export interface NumCp006PermanentAllocationEntry {
  readonly qlId: NumCp006PermanentQlId;
  readonly packageId: "NUM-001";
  readonly cpId: "NUM-CP-006";
  readonly qlTemplateId: NumCp006QlTemplateId;
  readonly solveModeId: NumCp006SolveModeId;
  readonly authorityId: NumCp006AuthorityId;
  readonly title: string;
  readonly prototypeIds: readonly NumCp006PrototypeId[];
  readonly governingInvariant: string;
  readonly mergeDisposition: "RETAIN" | "MERGE_AS_PARAMETERS";
  readonly sourceEvidence: readonly string[];
  readonly difficultyPolicy: "STATE_DERIVED";
  readonly language: "en";
  readonly allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION";
  readonly permanentIdentityFrozen: true;
  readonly active: false;
  readonly maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN";
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED";
  readonly publiclyPublishable: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
}

const DEFINITIONS = [
  ["DIRECT-HCF-TWO", "Direct HCF of two numbers", ["NUM-CP006-PROT-001"], "Use the minimum common prime exponents or Euclidean gcd.", "RETAIN"],
  ["DIRECT-LCM-TWO", "Direct LCM of two numbers", ["NUM-CP006-PROT-002"], "Use the maximum required prime exponents or product divided by gcd.", "RETAIN"],
  ["DIRECT-HCF-THREE", "Direct HCF of three numbers", ["NUM-CP006-PROT-003"], "A factor belongs to the HCF only when it divides all three numbers.", "RETAIN"],
  ["DIRECT-LCM-THREE", "Direct LCM of three numbers", ["NUM-CP006-PROT-004"], "The LCM contains every prime power required by any of the three numbers.", "RETAIN"],
  ["EUCLIDEAN-LADDER", "Euclidean division ladder", ["NUM-CP006-PROT-009"], "The final non-zero remainder in the Euclidean algorithm is the HCF.", "RETAIN"],
  ["DIVISIBILITY-EDGE", "One number divides another", ["NUM-CP006-PROT-010"], "When a divides b, HCF(a,b)=a and LCM(a,b)=b.", "RETAIN"],
  ["COPRIME-EDGE", "Co-prime HCF/LCM relation", ["NUM-CP006-PROT-011"], "For co-prime positive integers, HCF=1 and LCM equals their product.", "RETAIN"],
  ["MISSING-NUMBER", "Missing number from HCF and LCM", ["NUM-CP006-PROT-005"], "For exactly two positive integers, product = HCF × LCM.", "RETAIN"],
  ["VALID-PAIR", "Select a pair from HCF and LCM", ["NUM-CP006-PROT-006"], "Write the numbers as hx and hy with gcd(x,y)=1 and xy=LCM/HCF.", "RETAIN"],
  ["PAIR-COUNT", "Count pairs from HCF and LCM", ["NUM-CP006-PROT-012"], "Unordered pairs correspond to co-prime factor pairs of LCM/HCF.", "RETAIN"],
  ["GREATEST-EQUAL-GROUPING", "Greatest equal grouping or measure", ["NUM-CP006-PROT-007"], "The greatest exact common group size is the HCF.", "RETAIN"],
  ["LEAST-COMMON-ALIGNMENT", "Least positive common alignment", ["NUM-CP006-PROT-008"], "The first positive simultaneous repeat is the LCM.", "RETAIN"],
  ["LEAST-BOUNDED-COMMON-MULTIPLE", "Least bounded common multiple", ["NUM-CP006-PROT-013"], "Take the first multiple of the LCM at or above the lower bound.", "RETAIN"],
  ["GREATEST-BOUNDED-COMMON-MULTIPLE", "Greatest bounded common multiple", ["NUM-CP006-PROT-014"], "Take the last multiple of the LCM at or below the upper bound.", "RETAIN"],
  ["SAME-REMAINDER-GREATEST-DIVISOR", "Greatest divisor leaving the same remainder", ["NUM-CP006-PROT-015"], "A common divisor of equal-remainder numbers divides every pairwise difference.", "RETAIN"],
  ["SPECIFIED-REMAINDERS-GREATEST-DIVISOR", "Greatest divisor with specified remainders", ["NUM-CP006-PROT-016"], "Subtract each stated remainder and take the HCF of the adjusted values.", "RETAIN"],
  ["COMMON-REMAINDER-LEAST-NUMBER", "Least number leaving a common remainder", ["NUM-CP006-PROT-017"], "Subtract the common remainder; the remaining part must be a common multiple.", "RETAIN"],
  ["LEAST-ADDITION", "Least addition for common divisibility", ["NUM-CP006-PROT-018"], "Move the number forward to the next multiple of the LCM.", "RETAIN"],
  ["LEAST-SUBTRACTION", "Least subtraction for common divisibility", ["NUM-CP006-PROT-019"], "The least subtraction is the current remainder modulo the LCM.", "RETAIN"],
  ["COMMON-DEFICIENCY", "Least number with a common deficiency", ["NUM-CP006-PROT-020"], "If N+c is divisible by all divisors, N is a common multiple minus c.", "RETAIN"],
  ["BOUNDED-COMMON-MULTIPLE-COUNT", "Count common multiples in an interval", ["NUM-CP006-PROT-021"], "Count multiples of the LCM in the closed interval.", "RETAIN"],
  ["RATIONAL-HCF", "HCF of fractions or decimals", ["NUM-CP006-PROT-022"], "After common-unit normalisation, use HCF of numerators over LCM of denominators.", "RETAIN"],
  ["RATIONAL-LCM", "LCM of fractions or decimals", ["NUM-CP006-PROT-023"], "After common-unit normalisation, use LCM of numerators over HCF of denominators.", "RETAIN"],
  ["IDENTITY-CLAIM", "HCF/LCM claim verification", ["NUM-CP006-PROT-024"], "The product identity is valid for exactly two positive integers, not arbitrary larger sets.", "RETAIN"],
  ["COMPARISON", "Compare HCF/LCM values", ["NUM-CP006-PROT-025"], "Compute the requested invariant for both sets before comparing.", "RETAIN"],
  ["STATEMENT-COMBINATION", "HCF/LCM statement combination", ["NUM-CP006-PROT-026"], "Evaluate each statement independently against exact gcd/lcm rules.", "RETAIN"],
  ["DATA-SUFFICIENCY", "HCF/LCM data sufficiency", ["NUM-CP006-PROT-027"], "A statement is sufficient only when it fixes the requested value uniquely.", "RETAIN"],
  ["MINI-CASELET", "HCF/LCM mini-caselet", ["NUM-CP006-PROT-028", "NUM-CP006-PROT-029"], "Translate the caselet first, then apply HCF for exact grouping or LCM for repeat alignment.", "MERGE_AS_PARAMETERS"],
] as const;

if (DEFINITIONS.length !== NUM_CP006_PERMANENT_QL_IDS.length) {
  throw new Error("NUM-CP-006 definition/allocation count mismatch");
}

export const NUM_CP006_PERMANENT_ALLOCATION = DEFINITIONS.map((definition, index) => {
  const [code, title, prototypeIds, governingInvariant, mergeDisposition] = definition;
  return {
    qlId: NUM_CP006_PERMANENT_QL_IDS[index]!,
    packageId: "NUM-001" as const,
    cpId: "NUM-CP-006" as const,
    qlTemplateId: `NUM-CP006-QLC-${code}` as NumCp006QlTemplateId,
    solveModeId: `NUM-CP006-SM-${String(index + 1).padStart(3, "0")}` as NumCp006SolveModeId,
    authorityId: `NUM-CP006-AUTH-${String(index + 1).padStart(3, "0")}` as NumCp006AuthorityId,
    title,
    prototypeIds: prototypeIds as readonly NumCp006PrototypeId[],
    governingInvariant,
    mergeDisposition,
    sourceEvidence: [
      "NUM-CP-006-WAVE-01-FOUNDATION",
      "NUM-CP-006-SOURCE-GAP-AND-MERGE-SPLIT-AUDIT",
      ...prototypeIds,
      "NUM-CP-006-ENGLISH-AND-MULTILINGUAL-FREEZE",
    ],
    difficultyPolicy: "STATE_DERIVED" as const,
    language: "en" as const,
    allocationStatus: "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION" as const,
    permanentIdentityFrozen: true as const,
    active: false as const,
    maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN" as const,
    reviewStatus: "PRODUCT_OWNER_COMPLETION_AUTHORISED" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
  } satisfies NumCp006PermanentAllocationEntry;
});

const BY_QL = new Map(NUM_CP006_PERMANENT_ALLOCATION.map((entry) => [entry.qlId, entry]));

export function getNumCp006PermanentAllocation(qlId: NumCp006PermanentQlId): NumCp006PermanentAllocationEntry {
  const entry = BY_QL.get(qlId);
  if (!entry) throw new Error(`Unknown NUM-CP-006 permanent QL ID: ${qlId}`);
  return entry;
}
