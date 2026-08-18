import { ANGLE_180, angle, rational, type ExactAngle, type Rational } from "./exact";
import { ConstraintGraph } from "./constraint-graph";
import { solveConstraintGraph } from "./synthetic-solver";
import type { TheoremId } from "./theorem-registry";

export interface AngleRef {
  readonly id: string;
  readonly firstPointId: string;
  readonly vertexPointId: string;
  readonly secondPointId: string;
}

export interface AngleSolveResult {
  readonly targetId: string;
  readonly value: ExactAngle;
  readonly theoremTrace: readonly TheoremId[];
}

export function createAngleRef(
  id: string,
  firstPointId: string,
  vertexPointId: string,
  secondPointId: string,
): AngleRef {
  if (firstPointId === vertexPointId || vertexPointId === secondPointId) {
    throw new Error("An angle requires rays through points distinct from its vertex");
  }
  return Object.freeze({ id, firstPointId, vertexPointId, secondPointId });
}

export class AngleConstraintEngine {
  readonly #graph = new ConstraintGraph();
  readonly #theorems: TheoremId[] = [];

  addKnown(angleId: string, value: ExactAngle, reason: TheoremId = "GIVEN_ANGLE"): this {
    this.#graph.addEquation([{ variable: angleId, coefficient: rational(1) }], value, reason);
    this.#theorems.push(reason);
    return this;
  }

  addEqual(leftAngleId: string, rightAngleId: string, reason: TheoremId): this {
    this.#graph.addEquation([
      { variable: leftAngleId, coefficient: rational(1) },
      { variable: rightAngleId, coefficient: rational(-1) },
    ], rational(0), reason);
    this.#theorems.push(reason);
    return this;
  }

  addSupplementary(
    leftAngleId: string,
    rightAngleId: string,
    reason: TheoremId,
    total: ExactAngle = ANGLE_180,
  ): this {
    this.#graph.addEquation([
      { variable: leftAngleId, coefficient: rational(1) },
      { variable: rightAngleId, coefficient: rational(1) },
    ], total, reason);
    this.#theorems.push(reason);
    return this;
  }

  addFixedSum(angleIds: readonly string[], total: ExactAngle, reason: TheoremId): this {
    if (angleIds.length === 0) throw new Error("Fixed angle sum requires at least one angle");
    this.#graph.addEquation(
      angleIds.map((variable) => ({ variable, coefficient: rational(1) })),
      total,
      reason,
    );
    this.#theorems.push(reason);
    return this;
  }

  solve(targetId: string): AngleSolveResult {
    const solution = solveConstraintGraph(this.#graph);
    const value = solution.values.get(targetId);
    if (!value) throw new Error(`Angle ${targetId} is not uniquely solved`);
    return Object.freeze({
      targetId,
      value: angle(value.numerator, value.denominator),
      theoremTrace: Object.freeze([...new Set(this.#theorems)]),
    });
  }

  get graph(): ConstraintGraph {
    return this.#graph;
  }
}

export function asAngle(value: Rational): ExactAngle {
  return angle(value.numerator, value.denominator);
}
