import { evaluateFiniteDomainPair } from "../../../foundation/index.ts";
import type { SufficiencyClass, TwoStatementSufficiencyEvaluation } from "../../../foundation/index.ts";
import {
  fillSingleDigit,
  isDivisible,
  numeralToBigInt,
} from "../../../../../../../quant-v4/topics/Arithmetic/subtopics/NumberSystem/NUM-001/foundation/divisibility.ts";

export const DSF_NUM_PROTOTYPE_IDS = [
  "DSF-NUM-PROT-I-ONLY",
  "DSF-NUM-PROT-II-ONLY",
  "DSF-NUM-PROT-EACH-ALONE",
  "DSF-NUM-PROT-BOTH-ONLY",
  "DSF-NUM-PROT-NEITHER",
  "DSF-NUM-PROT-TARGET-PROJECTION",
] as const;

export type DsfNumPrototypeId = (typeof DSF_NUM_PROTOTYPE_IDS)[number];
export type DsfNumTargetKind = "MISSING_DIGIT" | "DIGIT_PARITY";

type DigitParity = "EVEN" | "ODD";
type NumberSystemAnswer = number | DigitParity;

interface NumberSystemWorld {
  readonly digit: number;
  readonly numeral: string;
  readonly value: bigint;
}

interface NumberSystemProblem {
  readonly template: string;
  readonly targetKind: DsfNumTargetKind;
}

interface NumberSystemStatement {
  readonly id: string;
  readonly text: string;
  readonly test: (world: NumberSystemWorld) => boolean;
}

interface NumberSystemPrototypeSpec {
  readonly prototypeId: DsfNumPrototypeId;
  readonly problem: NumberSystemProblem;
  readonly statementI: NumberSystemStatement;
  readonly statementII: NumberSystemStatement;
  readonly expectedClass: SufficiencyClass;
}

export interface NumberSystemDsPrototypeResult {
  readonly prototypeId: DsfNumPrototypeId;
  readonly permanentQlId: null;
  readonly sourceChapter: "Number System";
  readonly sourceCapability: "NUM-001/foundation/divisibility";
  readonly problem: NumberSystemProblem;
  readonly statementI: Pick<NumberSystemStatement, "id" | "text">;
  readonly statementII: Pick<NumberSystemStatement, "id" | "text">;
  readonly evaluation: TwoStatementSufficiencyEvaluation<NumberSystemAnswer>;
}

const PRIME_DIGITS = new Set([2, 3, 5, 7]);

function completedNumberDivisibleBy(divisor: bigint): NumberSystemStatement {
  return {
    id: `COMPLETED_DIVISIBLE_BY_${divisor}`,
    text: `The completed number is divisible by ${divisor}.`,
    test: (world) => isDivisible(world.value, divisor),
  };
}

const STATEMENTS = {
  divisibleBy3: completedNumberDivisibleBy(3n),
  divisibleBy8: completedNumberDivisibleBy(8n),
  divisibleBy9: completedNumberDivisibleBy(9n),
  divisibleBy47: completedNumberDivisibleBy(47n),
  evenDigit: {
    id: "DIGIT_EVEN",
    text: "X is an even digit.",
    test: (world: NumberSystemWorld) => world.digit % 2 === 0,
  },
  primeDigit: {
    id: "DIGIT_PRIME",
    text: "X is a prime digit.",
    test: (world: NumberSystemWorld) => PRIME_DIGITS.has(world.digit),
  },
  digitLessThan5: {
    id: "DIGIT_LT_5",
    text: "X is less than 5.",
    test: (world: NumberSystemWorld) => world.digit < 5,
  },
} as const;

const PROBLEM_DIGIT: NumberSystemProblem = {
  template: "42X",
  targetKind: "MISSING_DIGIT",
};

const PROBLEM_PARITY: NumberSystemProblem = {
  template: "42X",
  targetKind: "DIGIT_PARITY",
};

const SPECS: readonly NumberSystemPrototypeSpec[] = [
  {
    prototypeId: "DSF-NUM-PROT-I-ONLY",
    problem: PROBLEM_DIGIT,
    statementI: STATEMENTS.divisibleBy9,
    statementII: STATEMENTS.primeDigit,
    expectedClass: "STATEMENT_I_ONLY",
  },
  {
    prototypeId: "DSF-NUM-PROT-II-ONLY",
    problem: PROBLEM_DIGIT,
    statementI: STATEMENTS.evenDigit,
    statementII: STATEMENTS.divisibleBy8,
    expectedClass: "STATEMENT_II_ONLY",
  },
  {
    prototypeId: "DSF-NUM-PROT-EACH-ALONE",
    problem: PROBLEM_DIGIT,
    statementI: STATEMENTS.divisibleBy9,
    statementII: STATEMENTS.divisibleBy47,
    expectedClass: "EACH_STATEMENT_ALONE",
  },
  {
    prototypeId: "DSF-NUM-PROT-BOTH-ONLY",
    problem: PROBLEM_DIGIT,
    statementI: STATEMENTS.divisibleBy3,
    statementII: STATEMENTS.primeDigit,
    expectedClass: "BOTH_TOGETHER_ONLY",
  },
  {
    prototypeId: "DSF-NUM-PROT-NEITHER",
    problem: PROBLEM_DIGIT,
    statementI: STATEMENTS.evenDigit,
    statementII: STATEMENTS.divisibleBy3,
    expectedClass: "INSUFFICIENT_EVEN_TOGETHER",
  },
  {
    prototypeId: "DSF-NUM-PROT-TARGET-PROJECTION",
    problem: PROBLEM_PARITY,
    statementI: STATEMENTS.evenDigit,
    statementII: STATEMENTS.digitLessThan5,
    expectedClass: "STATEMENT_I_ONLY",
  },
];

const numberSystemAdapter = {
  adapterId: "DSF-ADAPTER-NUMBER-SYSTEM-PROTOTYPE-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "NUM-001",
  enumerateBaseWorlds(problem: NumberSystemProblem): readonly NumberSystemWorld[] {
    const worlds: NumberSystemWorld[] = [];
    for (let digit = 0; digit <= 9; digit += 1) {
      const numeral = fillSingleDigit(problem.template, digit);
      if (numeral.startsWith("0")) continue;
      worlds.push({ digit, numeral, value: numeralToBigInt(numeral) });
    }
    return worlds;
  },
  statementHolds(
    _problem: NumberSystemProblem,
    world: NumberSystemWorld,
    statement: NumberSystemStatement,
  ): boolean {
    return statement.test(world);
  },
  evaluateTarget(problem: NumberSystemProblem, world: NumberSystemWorld): NumberSystemAnswer {
    if (problem.targetKind === "MISSING_DIGIT") return world.digit;
    return world.digit % 2 === 0 ? "EVEN" : "ODD";
  },
  normalizeAnswer(answer: NumberSystemAnswer): string {
    return String(answer);
  },
};

function specFor(prototypeId: DsfNumPrototypeId): NumberSystemPrototypeSpec {
  const spec = SPECS.find((candidate) => candidate.prototypeId === prototypeId);
  if (!spec) throw new Error(`Unknown DSF Number System prototype: ${prototypeId}`);
  return spec;
}

export function runNumberSystemDsPrototype(prototypeId: DsfNumPrototypeId): NumberSystemDsPrototypeResult {
  const spec = specFor(prototypeId);
  const evaluation = evaluateFiniteDomainPair(
    numberSystemAdapter,
    spec.problem,
    spec.statementI,
    spec.statementII,
  );

  if (evaluation.classification !== spec.expectedClass) {
    throw new Error(
      `${prototypeId} classified as ${evaluation.classification}; expected ${spec.expectedClass}.`,
    );
  }

  return {
    prototypeId,
    permanentQlId: null,
    sourceChapter: "Number System",
    sourceCapability: "NUM-001/foundation/divisibility",
    problem: spec.problem,
    statementI: { id: spec.statementI.id, text: spec.statementI.text },
    statementII: { id: spec.statementII.id, text: spec.statementII.text },
    evaluation,
  };
}

export function buildNumberSystemDsDiscoveryCorpus(): readonly NumberSystemDsPrototypeResult[] {
  return DSF_NUM_PROTOTYPE_IDS.map(runNumberSystemDsPrototype);
}
