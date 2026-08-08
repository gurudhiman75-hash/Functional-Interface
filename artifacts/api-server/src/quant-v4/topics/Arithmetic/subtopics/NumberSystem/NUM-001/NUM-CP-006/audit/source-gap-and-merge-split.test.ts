import { NUM_CP006_PERMANENT_ALLOCATION } from "../permanent/allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const REQUIRED_COVERAGE = [
  "Direct HCF of two numbers",
  "Direct LCM of two numbers",
  "Direct HCF of three numbers",
  "Direct LCM of three numbers",
  "Euclidean division ladder",
  "One number divides another",
  "Co-prime HCF/LCM relation",
  "Missing number from HCF and LCM",
  "Select a pair from HCF and LCM",
  "Count pairs from HCF and LCM",
  "Greatest equal grouping or measure",
  "Least positive common alignment",
  "Least bounded common multiple",
  "Greatest bounded common multiple",
  "Greatest divisor leaving the same remainder",
  "Greatest divisor with specified remainders",
  "Least number leaving a common remainder",
  "Least addition for common divisibility",
  "Least subtraction for common divisibility",
  "Least number with a common deficiency",
  "Count common multiples in an interval",
  "HCF of fractions or decimals",
  "LCM of fractions or decimals",
  "HCF/LCM claim verification",
  "Compare HCF/LCM values",
  "HCF/LCM statement combination",
  "HCF/LCM data sufficiency",
  "HCF/LCM mini-caselet",
] as const;

const titles = new Set(NUM_CP006_PERMANENT_ALLOCATION.map((entry) => entry.title));
for (const title of REQUIRED_COVERAGE) assert(titles.has(title), `Missing coverage: ${title}`);

const prototypes = new Set(NUM_CP006_PERMANENT_ALLOCATION.flatMap((entry) => entry.prototypeIds));
for (let number = 1; number <= 29; number += 1) {
  const prototype = `NUM-CP006-PROT-${String(number).padStart(3, "0")}`;
  assert(prototypes.has(prototype as never), `Unallocated prototype ${prototype}`);
}

assert(NUM_CP006_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "MERGE_AS_PARAMETERS").length === 1, "merge disposition count");
assert(NUM_CP006_PERMANENT_ALLOCATION.at(-1)?.title === "HCF/LCM mini-caselet", "caselet merge target");

const ownershipText = NUM_CP006_PERMANENT_ALLOCATION.map((entry) => entry.governingInvariant).join(" ");
assert(/HCF/.test(ownershipText) && /LCM/.test(ownershipText), "governing invariant coverage");

console.log(JSON.stringify({
  status: "PASS_NUM_CP006_SOURCE_GAP_AND_MERGE_SPLIT",
  permanentQlCount: NUM_CP006_PERMANENT_ALLOCATION.length,
  allocatedPrototypeCount: prototypes.size,
  retainedAuthorities: NUM_CP006_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "RETAIN").length,
  parameterMergedAuthorities: NUM_CP006_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "MERGE_AS_PARAMETERS").length,
  ownershipBoundary: {
    primeFactorisationOutput: "NUM-CP-004",
    divisorFunctions: "NUM-CP-005",
    hcfLcmArithmetic: "NUM-CP-006",
    geometry: "Mensuration",
    timeDomainModels: "Time and Work / Time-Speed-Distance",
    setOverlapCounting: "Not promoted into CP-006",
  },
}, null, 2));
