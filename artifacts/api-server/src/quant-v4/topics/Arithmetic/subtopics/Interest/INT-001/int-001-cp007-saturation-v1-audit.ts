import { eq, rat } from "./cp003-exam-model";
import {
  INT_CP007_COLLISION_DISPOSITIONS,
  INT_CP007_PROTOTYPE_IDS_V2,
  INT_CP007_RETAINED_PROTOTYPE_IDS,
  INT_CP007_RUNTIME_VERSION_V2,
  INT_CP007_V2_DECISION,
  answerSemanticForIntCp007PrototypeV2,
  constructIntCp007PrototypeStateV2,
  solveIntCp007PrototypeV2,
  verifyIntCp007PrototypeAnswerV2,
  type IntCp007PrototypeStateV2,
} from "./cp007-scheme-equivalence-runtime-v2";
import { verifyIntCp007PrototypeAnswer, type IntCp007PrototypeState } from "./cp007-scheme-equivalence-runtime-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function displayable(value: { numerator: bigint; denominator: bigint }): boolean {
  return (value.numerator * 100n) % value.denominator === 0n;
}

const SOURCE_DIRECTIONS = Object.freeze([
  "CHOOSE_HIGHER_FINAL_AMOUNT",
  "FIND_SCHEME_RETURN_DIFFERENCE",
  "RECOVER_RATE_FROM_EQUAL_MATURITY",
  "BORROW_SIMPLE_LEND_COMPOUND_GAIN",
  "NOMINAL_VS_EFFECTIVE_STANDALONE",
  "EQUIVALENT_SIMPLE_RATE",
  "EQUIVALENT_COMPOUND_RATE",
  "SPLIT_TOTAL_FOR_EQUAL_FUTURE_VALUES",
  "INHERITANCE_EQUAL_FUTURE_VALUES",
  "EQUAL_PRESENT_PRINCIPAL_RATIO",
  "MISSING_PRESENT_PRINCIPAL_EQUAL_FUTURE_VALUE",
  "FIRST_WHOLE_YEAR_BREAK_EVEN_OR_OVERTAKE",
] as const);

const SOURCE_DISPOSITIONS = Object.freeze({
  CHOOSE_HIGHER_FINAL_AMOUNT: "RETAIN_PROT_001",
  FIND_SCHEME_RETURN_DIFFERENCE: "RETAIN_PROT_002",
  RECOVER_RATE_FROM_EQUAL_MATURITY: "RETAIN_PROT_003",
  BORROW_SIMPLE_LEND_COMPOUND_GAIN: "MERGE_PROT_002_CONTEXT",
  NOMINAL_VS_EFFECTIVE_STANDALONE: "REASSIGN_CP004",
  EQUIVALENT_SIMPLE_RATE: "MERGE_PROT_003_SPECIALIZATION",
  EQUIVALENT_COMPOUND_RATE: "MERGE_PROT_003_SPECIALIZATION",
  SPLIT_TOTAL_FOR_EQUAL_FUTURE_VALUES: "RETAIN_PROT_007",
  INHERITANCE_EQUAL_FUTURE_VALUES: "MERGE_PROT_007_CONTEXT",
  EQUAL_PRESENT_PRINCIPAL_RATIO: "RETAIN_PROT_008",
  MISSING_PRESENT_PRINCIPAL_EQUAL_FUTURE_VALUE: "RETAIN_PROT_010",
  FIRST_WHOLE_YEAR_BREAK_EVEN_OR_OVERTAKE: "RETAIN_PROT_009",
} as const);

assert(INT_CP007_RUNTIME_VERSION_V2 === "INT-CP-007-DISCOVERY-v2", "CP007 V2 runtime drift");
assert(INT_CP007_PROTOTYPE_IDS_V2.length === 10, "CP007 saturation expects ten discovered prototypes");
assert(INT_CP007_RETAINED_PROTOTYPE_IDS.length === 7, "CP007 saturation expects seven retained contracts");
assert(INT_CP007_V2_DECISION.mergedPrototypeCount === 3, "CP007 merged prototype count drift");
assert(INT_CP007_V2_DECISION.discoveredGapClosed === "MISSING_PRESENT_PRINCIPAL_FOR_EQUAL_FUTURE_VALUE", "CP007 missing-principal gap closure drift");
assert(INT_CP007_V2_DECISION.standaloneEffectiveAnnualRateOwner === "INT-CP-004", "standalone EAR must remain CP004");
assert(!INT_CP007_V2_DECISION.intermediateCashFlowsAllowed, "CP007 must remain free of intermediate cash flows");
assert(!INT_CP007_V2_DECISION.permanentQlAllocationAuthorized, "saturation audit must precede permanent allocation");

let generatedStates = 0;
let deterministicChecks = 0;
let verifierChecks = 0;
let retainedChecks = 0;
let mergedChecks = 0;
let sourceDispositionChecks = 0;
const retainedSemantics = new Map<string, string>();
const retainedStateFamilies = new Map<string, Set<string>>();

for (const prototypeId of INT_CP007_PROTOTYPE_IDS_V2) {
  const signatures = new Set<string>();
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-saturation-${prototypeId}-${index}`;
    const state = constructIntCp007PrototypeStateV2(prototypeId, seed);
    const replay = constructIntCp007PrototypeStateV2(prototypeId, seed);
    assert(stable(state) === stable(replay), `${prototypeId}/${seed}: deterministic state drift`);
    deterministicChecks += 1;

    const answer = solveIntCp007PrototypeV2(state);
    assert(verifyIntCp007PrototypeAnswerV2(state, answer), `${prototypeId}/${seed}: V2 verifier rejected solver answer`);
    verifierChecks += 1;
    signatures.add(stable(state));
    generatedStates += 1;

    if (prototypeId === "INT-CP007-PROT-002" || prototypeId === "INT-CP007-PROT-004" || prototypeId === "INT-CP007-PROT-007" || prototypeId === "INT-CP007-PROT-010") {
      assert(displayable(answer), `${prototypeId}/${seed}: money answer not displayable to paise`);
    }

    if (prototypeId === "INT-CP007-PROT-004") {
      assert(answer.numerator > 0n, `${prototypeId}/${seed}: borrow/lend gain must be positive in curated states`);
      mergedChecks += 1;
    }

    if (prototypeId === "INT-CP007-PROT-005") {
      const special = state as Extract<IntCp007PrototypeStateV2, { prototypeId: "INT-CP007-PROT-005" }>;
      const genericState: IntCp007PrototypeState = {
        prototypeId: "INT-CP007-PROT-003",
        knownScheme: { method: "COMPOUND", annualRatePercent: special.compoundRatePercent, years: special.years },
        missingMethod: "SIMPLE",
        missingYears: special.years,
      };
      assert(verifyIntCp007PrototypeAnswer(genericState, answer), `${prototypeId}/${seed}: equivalent-simple specialization is not contained by generic rate inverse`);
      mergedChecks += 1;
    }

    if (prototypeId === "INT-CP007-PROT-006") {
      const special = state as Extract<IntCp007PrototypeStateV2, { prototypeId: "INT-CP007-PROT-006" }>;
      const genericState: IntCp007PrototypeState = {
        prototypeId: "INT-CP007-PROT-003",
        knownScheme: { method: "SIMPLE", annualRatePercent: special.simpleRatePercent, years: special.years },
        missingMethod: "COMPOUND",
        missingYears: special.years,
      };
      assert(verifyIntCp007PrototypeAnswer(genericState, answer), `${prototypeId}/${seed}: equivalent-compound specialization is not contained by generic rate inverse`);
      mergedChecks += 1;
    }
  }

  assert(signatures.size >= 3, `${prototypeId}: insufficient curated state-family coverage`);
  if ((INT_CP007_RETAINED_PROTOTYPE_IDS as readonly string[]).includes(prototypeId)) {
    retainedChecks += 1;
    retainedSemantics.set(prototypeId, answerSemanticForIntCp007PrototypeV2(prototypeId));
    retainedStateFamilies.set(prototypeId, signatures);
  }
}

assert(INT_CP007_COLLISION_DISPOSITIONS["INT-CP007-PROT-004"] === "MERGE_INTO_PROT_002_BORROW_LEND_CONTEXT", "borrow/lend collision disposition drift");
assert(INT_CP007_COLLISION_DISPOSITIONS["INT-CP007-PROT-005"] === "MERGE_INTO_PROT_003_EQUIVALENT_SIMPLE_SPECIALIZATION", "equivalent-simple collision disposition drift");
assert(INT_CP007_COLLISION_DISPOSITIONS["INT-CP007-PROT-006"] === "MERGE_INTO_PROT_003_EQUIVALENT_COMPOUND_SPECIALIZATION", "equivalent-compound collision disposition drift");

assert(retainedSemantics.get("INT-CP007-PROT-001") === "SCHEME_INDEX", "scheme-choice semantic drift");
assert(retainedSemantics.get("INT-CP007-PROT-002") === "MONEY_DIFFERENCE", "return-difference semantic drift");
assert(retainedSemantics.get("INT-CP007-PROT-003") === "ANNUAL_RATE_PERCENT", "rate-inverse semantic drift");
assert(retainedSemantics.get("INT-CP007-PROT-007") === "COMPONENT_PRINCIPAL", "split semantic drift");
assert(retainedSemantics.get("INT-CP007-PROT-008") === "PRINCIPAL_RATIO", "ratio semantic drift");
assert(retainedSemantics.get("INT-CP007-PROT-009") === "TIME_YEARS", "overtake semantic drift");
assert(retainedSemantics.get("INT-CP007-PROT-010") === "MISSING_PRINCIPAL", "missing-principal semantic drift");

for (const direction of SOURCE_DIRECTIONS) {
  assert(direction in SOURCE_DISPOSITIONS, `source direction ${direction} is unclassified`);
  sourceDispositionChecks += 1;
}
assert(Object.keys(SOURCE_DISPOSITIONS).length === SOURCE_DIRECTIONS.length, "source disposition ledger has unexpected entries");
assert(SOURCE_DISPOSITIONS.NOMINAL_VS_EFFECTIVE_STANDALONE === "REASSIGN_CP004", "standalone effective-rate source must be reassigned to CP004");
assert(SOURCE_DISPOSITIONS.INHERITANCE_EQUAL_FUTURE_VALUES === "MERGE_PROT_007_CONTEXT", "inheritance source must remain a context variant");

const retainedIds = [...INT_CP007_RETAINED_PROTOTYPE_IDS];
assert(new Set(retainedIds).size === retainedIds.length, "retained prototype IDs must be unique");
assert(!retainedIds.includes("INT-CP007-PROT-004" as never), "merged borrow/lend prototype leaked into retained set");
assert(!retainedIds.includes("INT-CP007-PROT-005" as never), "merged equivalent-simple prototype leaked into retained set");
assert(!retainedIds.includes("INT-CP007-PROT-006" as never), "merged equivalent-compound prototype leaked into retained set");

console.log(JSON.stringify({
  runtimeVersion: INT_CP007_RUNTIME_VERSION_V2,
  discoveredPrototypeCount: INT_CP007_PROTOTYPE_IDS_V2.length,
  retainedContractCount: INT_CP007_RETAINED_PROTOTYPE_IDS.length,
  mergedContractCount: 3,
  generatedStates,
  deterministicChecks,
  verifierChecks,
  mergedChecks,
  retainedChecks,
  sourceDirectionsClassified: sourceDispositionChecks,
  retainedSemantics: Object.fromEntries(retainedSemantics),
  retainedUniqueStateFamilies: Object.fromEntries([...retainedStateFamilies.entries()].map(([id, states]) => [id, states.size])),
  meaningfulUnclassifiedSourceDirections: 0,
  permanentQlAllocationRecommendation: "ALLOCATE_7_RETAINED_CONTRACTS_AFTER_EXACT_HEAD_CI",
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_SATURATION_V1_AUDIT");
