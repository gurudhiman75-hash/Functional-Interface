import { evaluateFiniteDomainPair } from "../../../foundation/index.ts";

interface AlgebraWorld {
  readonly x: number;
  readonly y: number;
}

interface AlgebraProblem {
  readonly min: number;
  readonly max: number;
  readonly targetKind: "SUM_X_Y";
}

interface AlgebraStatement {
  readonly id: string;
  readonly text: string;
  readonly test: (world: AlgebraWorld) => boolean;
}

export const DSF_ALG_TARGET_FUNCTION_PROTOTYPE_ID = "DSF-ALG-PROT-TARGET-FUNCTION-BOTH-ONLY" as const;

const problem: AlgebraProblem = {
  min: 1,
  max: 9,
  targetKind: "SUM_X_Y",
};

const statementI: AlgebraStatement = {
  id: "PRODUCT_24",
  text: "xy = 24.",
  test: (world) => world.x * world.y === 24,
};

const statementII: AlgebraStatement = {
  id: "ABS_DIFFERENCE_2",
  text: "|x - y| = 2.",
  test: (world) => Math.abs(world.x - world.y) === 2,
};

const adapter = {
  adapterId: "DSF-ADAPTER-ALGEBRA-DISCOVERY-V1",
  domainFamily: "QUANT" as const,
  sourceChapterId: "ALGEBRA-DISCOVERY",
  enumerateBaseWorlds(input: AlgebraProblem): readonly AlgebraWorld[] {
    const worlds: AlgebraWorld[] = [];
    for (let x = input.min; x <= input.max; x += 1) {
      for (let y = input.min; y <= input.max; y += 1) worlds.push({ x, y });
    }
    return worlds;
  },
  statementHolds(_problem: AlgebraProblem, world: AlgebraWorld, statement: AlgebraStatement): boolean {
    return statement.test(world);
  },
  evaluateTarget(_problem: AlgebraProblem, world: AlgebraWorld): number {
    return world.x + world.y;
  },
  normalizeAnswer(answer: number): string {
    return String(answer);
  },
};

export function runAlgebraTargetFunctionPrototype() {
  const evaluation = evaluateFiniteDomainPair(adapter, problem, statementI, statementII);
  if (evaluation.classification !== "BOTH_TOGETHER_ONLY") {
    throw new Error(`Algebra target-function prototype classified as ${evaluation.classification}.`);
  }
  return {
    prototypeId: DSF_ALG_TARGET_FUNCTION_PROTOTYPE_ID,
    permanentQlId: null,
    productionSourceIntegration: "PENDING_SOURCE_ALGEBRA_RUNTIME_ON_NEW_MAIN" as const,
    problem,
    statementI: { id: statementI.id, text: statementI.text },
    statementII: { id: statementII.id, text: statementII.text },
    evaluation,
  };
}
