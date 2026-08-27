import {
  fillSingleDigit,
  isDivisible,
  numeralToBigInt,
} from "../../../../../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/foundation/divisibility.ts";
import {
  evaluateFiniteDomainTriple,
  type ThreeStatementSufficiencyEvaluation,
} from "./three-statement-foundation.ts";
import {
  buildThreeStatementAnswerOptions,
  type DsfCp015ThreeStatementSemanticKey,
} from "./three-statement-answer-profile.ts";

export const DSF_CP015_NUM_THREE_STATEMENT_PROTOTYPE_IDS = [
  "DSF-CP015-NUM-MIXED-ALTERNATIVE",
  "DSF-CP015-NUM-ALL-THREE-REQUIRED",
] as const;

export type DsfCp015NumThreeStatementPrototypeId = (typeof DSF_CP015_NUM_THREE_STATEMENT_PROTOTYPE_IDS)[number];

type NumberWorld = Readonly<{ digit: number; numeral: string; value: bigint }>;
type Problem = Readonly<{ template: "42X" }>;
type Statement = Readonly<{ id: string; text: string; test: (world: NumberWorld) => boolean }>;

type PrototypeSpec = Readonly<{
  prototypeId: DsfCp015NumThreeStatementPrototypeId;
  anchorDigit: number;
  statementI: Statement;
  statementII: Statement;
  statementIII: Statement;
  expectedSemanticKey: DsfCp015ThreeStatementSemanticKey;
}>;

function divisibleBy(divisor: bigint): Statement {
  return {
    id: `COMPLETED_DIVISIBLE_BY_${divisor}`,
    text: `The completed number is divisible by ${divisor}.`,
    test: (world) => isDivisible(world.value, divisor),
  };
}

const PRIME_DIGITS = new Set([2, 3, 5, 7]);
const STATEMENTS = Object.freeze({
  divisibleBy3: divisibleBy(3n),
  divisibleBy9: divisibleBy(9n),
  evenDigit: {
    id: "DIGIT_EVEN",
    text: "X is an even digit.",
    test: (world: NumberWorld) => world.digit % 2 === 0,
  },
  primeDigit: {
    id: "DIGIT_PRIME",
    text: "X is a prime digit.",
    test: (world: NumberWorld) => PRIME_DIGITS.has(world.digit),
  },
  digitLessThan5: {
    id: "DIGIT_LT_5",
    text: "X is less than 5.",
    test: (world: NumberWorld) => world.digit < 5,
  },
});

const SPECS: readonly PrototypeSpec[] = Object.freeze([
  Object.freeze({
    prototypeId: "DSF-CP015-NUM-MIXED-ALTERNATIVE",
    anchorDigit: 3,
    statementI: STATEMENTS.divisibleBy9,
    statementII: STATEMENTS.divisibleBy3,
    statementIII: STATEMENTS.primeDigit,
    expectedSemanticKey: "I|II+III",
  }),
  Object.freeze({
    prototypeId: "DSF-CP015-NUM-ALL-THREE-REQUIRED",
    anchorDigit: 0,
    statementI: STATEMENTS.divisibleBy3,
    statementII: STATEMENTS.evenDigit,
    statementIII: STATEMENTS.digitLessThan5,
    expectedSemanticKey: "I+II+III",
  }),
]);

const PROBLEM: Problem = Object.freeze({ template: "42X" });

const adapter = {
  adapterId: "DSF-CP015-NUM-001-THREE-STATEMENT-PROTOTYPE-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "NUM-001",
  enumerateBaseWorlds(problem: Problem): readonly NumberWorld[] {
    const worlds: NumberWorld[] = [];
    for (let digit = 0; digit <= 9; digit += 1) {
      const numeral = fillSingleDigit(problem.template, digit);
      worlds.push(Object.freeze({ digit, numeral, value: numeralToBigInt(numeral) }));
    }
    return Object.freeze(worlds);
  },
  statementHolds(_problem: Problem, world: NumberWorld, statement: Statement): boolean {
    return statement.test(world);
  },
  evaluateTarget(_problem: Problem, world: NumberWorld): number {
    return world.digit;
  },
  normalizeAnswer(answer: number): string {
    return String(answer);
  },
};

export interface DsfCp015NumberSystemPrototypeResult {
  readonly prototypeId: DsfCp015NumThreeStatementPrototypeId;
  readonly candidateQlId: "DSF-QL-CAND-002";
  readonly permanentQlId: null;
  readonly sourceChapterId: "NUM-001";
  readonly sourceCapability: "NUM-001/foundation/divisibility";
  readonly problemTemplate: "42X";
  readonly anchorDigit: number;
  readonly statements: readonly [Pick<Statement, "id" | "text">, Pick<Statement, "id" | "text">, Pick<Statement, "id" | "text">];
  readonly evaluation: ThreeStatementSufficiencyEvaluation<number>;
  readonly options: ReturnType<typeof buildThreeStatementAnswerOptions>;
  readonly lifecycle: Readonly<{
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
  }>;
}

function specFor(prototypeId: DsfCp015NumThreeStatementPrototypeId): PrototypeSpec {
  const spec = SPECS.find((candidate) => candidate.prototypeId === prototypeId);
  if (!spec) throw new Error(`Unknown CP015 Number System prototype: ${prototypeId}`);
  return spec;
}

export function runDsfCp015NumberSystemPrototype(
  prototypeId: DsfCp015NumThreeStatementPrototypeId,
  seed = 0,
): DsfCp015NumberSystemPrototypeResult {
  const spec = specFor(prototypeId);
  const worlds = adapter.enumerateBaseWorlds(PROBLEM);
  const anchor = worlds.find((world) => world.digit === spec.anchorDigit);
  if (!anchor) throw new Error(`Missing anchor digit ${spec.anchorDigit}.`);
  for (const [label, statement] of [["I", spec.statementI], ["II", spec.statementII], ["III", spec.statementIII]] as const) {
    if (!statement.test(anchor)) throw new Error(`Prototype ${prototypeId} has false Statement ${label} at its anchor world.`);
  }

  const evaluation = evaluateFiniteDomainTriple(adapter, PROBLEM, spec.statementI, spec.statementII, spec.statementIII);
  if (evaluation.semanticKey !== spec.expectedSemanticKey) {
    throw new Error(`${prototypeId} classified as ${evaluation.semanticKey}; expected ${spec.expectedSemanticKey}.`);
  }

  return Object.freeze({
    prototypeId,
    candidateQlId: "DSF-QL-CAND-002" as const,
    permanentQlId: null,
    sourceChapterId: "NUM-001" as const,
    sourceCapability: "NUM-001/foundation/divisibility" as const,
    problemTemplate: PROBLEM.template,
    anchorDigit: spec.anchorDigit,
    statements: Object.freeze([
      Object.freeze({ id: spec.statementI.id, text: spec.statementI.text }),
      Object.freeze({ id: spec.statementII.id, text: spec.statementII.text }),
      Object.freeze({ id: spec.statementIII.id, text: spec.statementIII.text }),
    ] as const),
    evaluation,
    options: buildThreeStatementAnswerOptions(spec.expectedSemanticKey, seed),
    lifecycle: Object.freeze({
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
  });
}

export function buildDsfCp015NumberSystemPrototypeCorpus(seed = 0): readonly DsfCp015NumberSystemPrototypeResult[] {
  return DSF_CP015_NUM_THREE_STATEMENT_PROTOTYPE_IDS.map((prototypeId, index) => runDsfCp015NumberSystemPrototype(prototypeId, seed + index));
}
