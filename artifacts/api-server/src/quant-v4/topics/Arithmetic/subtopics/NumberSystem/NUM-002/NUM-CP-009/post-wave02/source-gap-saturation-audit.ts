import { NUM_CP009_WAVE01_PROTOTYPE_IDS } from "../wave01/types.ts";
import { NUM_CP009_WAVE02_PROTOTYPE_IDS } from "../wave02/types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type Disposition = "COVERED" | "MATERIAL_GAP" | "ADAPTER_OR_REPRESENTATION" | "REASSIGN_OR_HOLD";

interface Candidate {
  readonly id: string;
  readonly sourceBasis: string;
  readonly disposition: Disposition;
  readonly coveredBy?: readonly string[];
  readonly proposedGapId?: string;
  readonly notes: string;
}

const implemented = new Set([
  ...NUM_CP009_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP009_WAVE02_PROTOTYPE_IDS,
]);

const candidates: readonly Candidate[] = Object.freeze([
  {
    id: "UNIT_DIGIT_SINGLE_POWER",
    sourceBasis: "V2 ns_unit_digit_cycle + V3 Last Digit CP-001",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-001"],
    notes: "Includes exponent-zero and all base-ending cycle families.",
  },
  {
    id: "UNIT_DIGIT_COMPOSED_EXPRESSION",
    sourceBasis: "V2 ns_expression_last_digit + V3 product-of-powers evidence",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-002", "NUM-CP009-PROT-003"],
    notes: "Short product, sum and difference composition is executable.",
  },
  {
    id: "POWER_TOWER_OR_NESTED_EXPONENT",
    sourceBasis: "V2 ns_power_tower_digit + V3 repeated exponential expression",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-004"],
    notes: "Bounded upper exponent is reduced through the outer terminal cycle.",
  },
  {
    id: "CYCLE_LENGTH",
    sourceBasis: "V2 ns_cycle_length_detection + V3 cycle pattern",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-005"],
    notes: "Direct cycle-length answer semantic is covered.",
  },
  {
    id: "INVERSE_EXPONENT_CLASS",
    sourceBasis: "Design inverse cycle tasks + V3 missing exponent",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-006"],
    notes: "Single target unit digit currently yields one residue class.",
  },
  {
    id: "BOUNDED_EXPONENT_COUNT",
    sourceBasis: "Design inverse count/range tasks",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-007"],
    notes: "Direct bounded count including zero-count states is covered.",
  },
  {
    id: "LAST_TWO_DIGITS",
    sourceBasis: "V2 ns_last_two_digits",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-008", "NUM-CP009-PROT-009"],
    notes: "Single and composed coprime terminal blocks are covered with leading-zero formatting.",
  },
  {
    id: "LAST_THREE_DIGITS",
    sourceBasis: "V2 ns_last_three_digits",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-010", "NUM-CP009-PROT-011"],
    notes: "Single and composed terminal blocks are covered with fixed-width output.",
  },
  {
    id: "BOUNDED_EXPONENT_COMPLETE_SET",
    sourceBasis: "Design recover-bounded-exponent task",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-012"],
    notes: "Empty, singleton and multiple bounded solution sets are covered.",
  },
  {
    id: "TERMINAL_DIGIT_FEASIBILITY",
    sourceBasis: "Design possible/impossible terminal digit",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-013"],
    notes: "Both reachable and unreachable selection directions are covered.",
  },
  {
    id: "STRUCTURED_EXPONENT",
    sourceBasis: "Design factorial/structured exponent",
    disposition: "COVERED",
    coveredBy: ["NUM-CP009-PROT-014"],
    notes: "Triangular and sum-of-squares exponents are simplified before the terminal cycle.",
  },
  {
    id: "NON_COPRIME_TERMINAL_BLOCK_ZERO_CREATION",
    sourceBasis: "CP009 edge-state contract: factors two/five; answers 00/000",
    disposition: "MATERIAL_GAP",
    proposedGapId: "NUM-CP009-PROT-015",
    notes: "Current last-two/last-three pools mostly avoid factors 2 and 5; zero-creating preperiod/stabilisation must be proved explicitly.",
  },
  {
    id: "COMPOSITE_TERMINAL_CONDITION_MULTI_CLASS",
    sourceBasis: "CP009 edge-state contract: several exponent residue classes for composite terminal condition",
    disposition: "MATERIAL_GAP",
    proposedGapId: "NUM-CP009-PROT-016",
    notes: "Current inverse tasks use one target digit. A condition such as terminal digit in a set can produce several exponent classes and materially changes inverse enumeration.",
  },
  {
    id: "LONG_GEOMETRIC_OR_REPEATED_POWER_TERMINAL_SUM",
    sourceBasis: "CP009 discovery family: terminal digit of repeated/geometric expression; V2 ns_expression_last_digit",
    disposition: "MATERIAL_GAP",
    proposedGapId: "NUM-CP009-PROT-017",
    notes: "A long cyclic sum needs period aggregation rather than evaluating only two or three powered terms.",
  },
  {
    id: "STRUCTURED_REPEATED_BLOCK",
    sourceBasis: "CP009 last-two/last-three discovery representation",
    disposition: "ADAPTER_OR_REPRESENTATION",
    coveredBy: ["NUM-CP009-PROT-008", "NUM-CP009-PROT-009", "NUM-CP009-PROT-010", "NUM-CP009-PROT-011"],
    notes: "If only the terminal suffix matters, the repeated-block form is a representation adapter; arbitrary digit construction moves to CP010.",
  },
  {
    id: "CRT_DECOMPOSITION_FOR_TERMINAL_BLOCK",
    sourceBasis: "CP009 design algorithm option",
    disposition: "ADAPTER_OR_REPRESENTATION",
    coveredBy: ["NUM-CP009-PROT-008", "NUM-CP009-PROT-009", "NUM-CP009-PROT-010", "NUM-CP009-PROT-011"],
    notes: "CRT is a solver route, not a separate learner answer contract; general CRT stays CP008.",
  },
  {
    id: "CLAIM_STATEMENT_TABLE_REPRESENTATIONS",
    sourceBasis: "CP009 claim and representation inventory",
    disposition: "ADAPTER_OR_REPRESENTATION",
    coveredBy: ["NUM-CP009-PROT-005", "NUM-CP009-PROT-006", "NUM-CP009-PROT-013"],
    notes: "No independent routine-source contract currently justifies separate QLs; retain as later adapters over frozen semantics.",
  },
  {
    id: "TERMINAL_DIGIT_DATA_SUFFICIENCY",
    sourceBasis: "CP009 representation inventory",
    disposition: "ADAPTER_OR_REPRESENTATION",
    coveredBy: ["NUM-CP009-PROT-006", "NUM-CP009-PROT-007", "NUM-CP009-PROT-012"],
    notes: "No direct routine source in the chapter source audit. DS is held as a representation adapter unless source evidence establishes a distinct evidence contract.",
  },
  {
    id: "LAST_NON_ZERO_DIGIT_FACTORIAL_OR_PRODUCT",
    sourceBasis: "Source audit maps last non-zero digit into CP011 candidates; cross-CP matrix marks CP009/CP011 shared boundary",
    disposition: "REASSIGN_OR_HOLD",
    notes: "Factorial valuation/trailing-zero structure belongs CP011; mixed valuation + terminal cycle requires CP014 ablation. Do not create a routine CP009 QL now.",
  },
]);

for (const candidate of candidates) {
  for (const prototypeId of candidate.coveredBy ?? []) {
    assert(implemented.has(prototypeId as never), `${candidate.id}: unknown covering prototype ${prototypeId}`);
  }
  if (candidate.disposition === "MATERIAL_GAP") {
    assert(/^NUM-CP009-PROT-01[5-7]$/u.test(candidate.proposedGapId ?? ""), `${candidate.id}: missing Wave 03 gap identity`);
  }
}

const materialGaps = candidates.filter((candidate) => candidate.disposition === "MATERIAL_GAP");
const covered = candidates.filter((candidate) => candidate.disposition === "COVERED");
const adapters = candidates.filter((candidate) => candidate.disposition === "ADAPTER_OR_REPRESENTATION");
const holds = candidates.filter((candidate) => candidate.disposition === "REASSIGN_OR_HOLD");

assert(implemented.size === 14, `Expected 14 implemented prototypes after Wave 02, received ${implemented.size}`);
assert(materialGaps.length === 3, `Expected exactly three material post-Wave02 gaps, received ${materialGaps.length}`);
assert(materialGaps.map((candidate) => candidate.proposedGapId).join(",") === [
  "NUM-CP009-PROT-015",
  "NUM-CP009-PROT-016",
  "NUM-CP009-PROT-017",
].join(","), "Wave 03 gap identities changed unexpectedly");

console.log(JSON.stringify({
  status: "PASS_NUM_CP009_POST_WAVE02_SOURCE_GAP_SATURATION_AUDIT",
  implementedPrototypeCount: implemented.size,
  sourceCandidates: candidates.length,
  coveredCandidates: covered.length,
  materialGapCount: materialGaps.length,
  materialGaps: materialGaps.map((candidate) => ({ id: candidate.id, proposedGapId: candidate.proposedGapId })),
  adapterOrRepresentationCount: adapters.length,
  reassignOrHoldCount: holds.length,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-185",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  candidates,
}, null, 2));
