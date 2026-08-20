import { NUM_CP009_WAVE01_PROTOTYPE_IDS } from "../wave01/types.ts";
import { NUM_CP009_WAVE02_PROTOTYPE_IDS } from "../wave02/types.ts";
import { NUM_CP009_WAVE03_PROTOTYPE_IDS } from "../wave03/types.ts";
import { generateNumCp009Wave03 } from "../wave03/runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type ProposedAuthority = Readonly<{
  id: string;
  title: string;
  answerSemantic: string;
  solveContract: string;
  prototypeContributions: readonly string[];
  protectedFrom: readonly string[];
}>;

const allPrototypeIds = [
  ...NUM_CP009_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP009_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP009_WAVE03_PROTOTYPE_IDS,
] as const;

const authorities: readonly ProposedAuthority[] = Object.freeze([
  {
    id: "NUM-CP009-AUTH-PROP-001",
    title: "Unit digit of a single power",
    answerSemantic: "UNIT_DIGIT",
    solveContract: "Reduce the base to its unit-digit cycle and locate one exponent position.",
    prototypeContributions: ["NUM-CP009-PROT-001"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-002", "NUM-CP009-AUTH-PROP-011"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-002",
    title: "Unit digit of a short composed power expression",
    answerSemantic: "UNIT_DIGIT",
    solveContract: "Resolve several explicit powered terms to terminal residues, then combine by the displayed operation.",
    prototypeContributions: ["NUM-CP009-PROT-002", "NUM-CP009-PROT-003"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-001", "NUM-CP009-AUTH-PROP-012"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-003",
    title: "Unit digit of a bounded power tower",
    answerSemantic: "UNIT_DIGIT",
    solveContract: "Reduce the upper exponent through the cycle required by the outer base before reading the terminal digit.",
    prototypeContributions: ["NUM-CP009-PROT-004"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-001", "NUM-CP009-AUTH-PROP-011"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-004",
    title: "Unit-digit cycle length",
    answerSemantic: "CYCLE_LENGTH",
    solveContract: "Identify the shortest repeating terminal pattern rather than evaluate one requested power.",
    prototypeContributions: ["NUM-CP009-PROT-005"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-005"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-005",
    title: "Exponent class set from terminal conditions",
    answerSemantic: "EXPONENT_CLASS_SET",
    solveContract: "Invert a terminal condition to one or several complete exponent congruence classes.",
    prototypeContributions: ["NUM-CP009-PROT-006", "NUM-CP009-PROT-016"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-004", "NUM-CP009-AUTH-PROP-006", "NUM-CP009-AUTH-PROP-009"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-006",
    title: "Bounded exponent count from a terminal condition",
    answerSemantic: "COUNT",
    solveContract: "Recover the accepted exponent class and count its representatives inside an inclusive interval.",
    prototypeContributions: ["NUM-CP009-PROT-007"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-005", "NUM-CP009-AUTH-PROP-009"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-007",
    title: "Last two digits of a power expression",
    answerSemantic: "LAST_TWO_DIGITS",
    solveContract: "Work modulo 100 for single/composed and coprime/non-coprime states, preserving a fixed two-digit block.",
    prototypeContributions: ["NUM-CP009-PROT-008", "NUM-CP009-PROT-009", "NUM-CP009-PROT-015:LAST_TWO"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-008"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-008",
    title: "Last three digits of a power expression",
    answerSemantic: "LAST_THREE_DIGITS",
    solveContract: "Work modulo 1000 for single/composed and coprime/non-coprime states, preserving a fixed three-digit block.",
    prototypeContributions: ["NUM-CP009-PROT-010", "NUM-CP009-PROT-011", "NUM-CP009-PROT-015:LAST_THREE"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-007"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-009",
    title: "Complete bounded exponent set from a terminal condition",
    answerSemantic: "EXPONENT_SET",
    solveContract: "Project a terminal-cycle condition into a bounded interval and return every valid exponent, including empty/singleton/multiple sets.",
    prototypeContributions: ["NUM-CP009-PROT-012"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-005", "NUM-CP009-AUTH-PROP-006"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-010",
    title: "Terminal-digit feasibility",
    answerSemantic: "POSSIBLE_OR_IMPOSSIBLE_TERMINAL_DIGIT",
    solveContract: "Classify whether an offered terminal digit belongs to the reachable power cycle.",
    prototypeContributions: ["NUM-CP009-PROT-013"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-005"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-011",
    title: "Unit digit with a structured exponent",
    answerSemantic: "UNIT_DIGIT",
    solveContract: "First derive a structured exponent such as a triangular or square-sum total, then apply terminal cyclicity.",
    prototypeContributions: ["NUM-CP009-PROT-014"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-001", "NUM-CP009-AUTH-PROP-003"],
  },
  {
    id: "NUM-CP009-AUTH-PROP-012",
    title: "Unit digit of a long repeated-power sum",
    answerSemantic: "UNIT_DIGIT",
    solveContract: "Aggregate complete terminal-cycle blocks and leftovers across a long consecutive power sum.",
    prototypeContributions: ["NUM-CP009-PROT-017"],
    protectedFrom: ["NUM-CP009-AUTH-PROP-002"],
  },
]);

const expectedPrototypeIds = new Set(allPrototypeIds);
assert(expectedPrototypeIds.size === 17, `Expected 17 discovery prototypes, received ${expectedPrototypeIds.size}`);
assert(authorities.length === 12, `Expected 12 proposed authorities, received ${authorities.length}`);
assert(new Set(authorities.map((authority) => authority.id)).size === authorities.length, "Duplicate proposed authority IDs");
assert(authorities.every((authority) => !/NUM-QL-/u.test(authority.id)), "Permanent QL identity leaked into proposal IDs");

const normalContributions = new Map<string, string[]>();
for (const authority of authorities) {
  assert(authority.prototypeContributions.length > 0, `${authority.id}: no source prototype contribution`);
  for (const contribution of authority.prototypeContributions) {
    const prototypeId = contribution.split(":").slice(0, 3).join(":");
    assert(expectedPrototypeIds.has(prototypeId as never), `${authority.id}: unknown contribution ${contribution}`);
    const list = normalContributions.get(prototypeId) ?? [];
    list.push(contribution);
    normalContributions.set(prototypeId, list);
  }
}

for (const prototypeId of allPrototypeIds) {
  const contributions = normalContributions.get(prototypeId) ?? [];
  if (prototypeId === "NUM-CP009-PROT-015") {
    assert(contributions.length === 2, "P015 must split across last-two and last-three authorities");
    assert(contributions.includes("NUM-CP009-PROT-015:LAST_TWO"), "P015 last-two slice missing");
    assert(contributions.includes("NUM-CP009-PROT-015:LAST_THREE"), "P015 last-three slice missing");
  } else {
    assert(contributions.length === 1, `${prototypeId}: expected exactly one authority contribution, received ${contributions.length}`);
  }
}

const mergeGroups = authorities.filter((authority) => authority.prototypeContributions.length > 1);
assert(mergeGroups.length === 4, `Expected four merge/split groups, received ${mergeGroups.length}`);
assert(authorities.filter((authority) => authority.prototypeContributions.length === 1).length === 8,
  "Expected eight singleton authorities");

let p015LastTwo = 0;
let p015LastThree = 0;
for (let seed = 0; seed < 120; seed += 1) {
  const packageValue = generateNumCp009Wave03("NUM-CP009-PROT-015", seed);
  if (packageValue.answerSemantic === "LAST_TWO_DIGITS") p015LastTwo += 1;
  if (packageValue.answerSemantic === "LAST_THREE_DIGITS") p015LastThree += 1;
}
assert(p015LastTwo > 0 && p015LastThree > 0, "P015 executable runtime does not support both split slices");

const sourceDisposition = Object.freeze({
  routineSourceFamiliesRecovered: 6,
  postWave02MaterialGapsClosed: 3,
  remainingRoutineSourceGaps: 0,
  adapterOrRepresentationHolds: 4,
  ownershipReassignOrAdvancedHolds: 1,
  lastNonZeroDigitDisposition: "CP011_OR_CP014_ABLATION_HOLD",
  crtDisposition: "SOLVER_ROUTE_NOT_SEPARATE_AUTHORITY",
  structuredRepeatedBlockDisposition: "ADAPTER_OR_CP010_IF_DIGIT_CONSTRUCTION_ESSENTIAL",
  dataSufficiencyDisposition: "REPRESENTATION_HOLD_PENDING_DIRECT_SOURCE",
});
assert(sourceDisposition.remainingRoutineSourceGaps === 0, "Routine source gap remains after Wave 03");

const protectedNonMerges = Object.freeze([
  "PROP-001 single-power unit digit vs PROP-011 structured-exponent unit digit: exponent preprocessing changes the solver contract",
  "PROP-002 short composed expression vs PROP-012 long repeated-power sum: block aggregation is materially different from resolving a few explicit terms",
  "PROP-003 power tower vs PROP-011 structured exponent: nested exponent-cycle reduction differs from deriving a closed-form exponent total",
  "PROP-004 cycle length vs PROP-005 exponent class set: learner answer semantics differ",
  "PROP-005 exponent class set vs PROP-006 bounded count vs PROP-009 bounded set: class/count/set outputs require different projections",
  "PROP-007 last two digits vs PROP-008 last three digits: fixed-width answer semantics and modulus differ",
  "PROP-010 feasibility vs PROP-005 exponent class set: existence classification differs from recovering the full class set",
]);

console.log(JSON.stringify({
  status: "PASS_NUM_CP009_FINAL_SOURCE_SATURATION_MERGE_SPLIT_PROPOSAL",
  discoveryPrototypeCount: allPrototypeIds.length,
  proposedAuthorityCount: authorities.length,
  prototypeReduction: allPrototypeIds.length - authorities.length,
  mergeOrSplitAuthorityCount: mergeGroups.length,
  singletonAuthorityCount: authorities.length - mergeGroups.length,
  p015SplitReach: { lastTwo: p015LastTwo, lastThree: p015LastThree },
  routineSourceGaps: sourceDisposition.remainingRoutineSourceGaps,
  sourceDisposition,
  protectedNonMerges,
  authorities,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-185",
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
