import {
  add,
  divide,
  isZero,
  multiply,
  rational,
  subtract,
  type Rational,
} from "./exact";
import type { ConstraintGraph } from "./constraint-graph";
import type { TheoremId } from "./theorem-registry";

export interface SyntheticSolveResult {
  readonly values: ReadonlyMap<string, Rational>;
  readonly rank: number;
  readonly variableCount: number;
  readonly theoremTrace: readonly TheoremId[];
}

export function solveConstraintGraph(graph: ConstraintGraph): SyntheticSolveResult {
  const variables = [...graph.variables].sort();
  const index = new Map(variables.map((variable, position) => [variable, position]));
  const rows = graph.equations.map((equation) => {
    const row: Rational[] = Array.from({ length: variables.length + 1 }, (): Rational => rational(0));
    for (const term of equation.terms) {
      const column = index.get(term.variable);
      if (column === undefined) throw new Error(`Unknown variable ${term.variable}`);
      row[column] = add(row[column], term.coefficient);
    }
    row[variables.length] = equation.constant;
    return row;
  });

  let pivotRow = 0;
  const pivotColumnForRow: number[] = [];
  for (let column = 0; column < variables.length && pivotRow < rows.length; column += 1) {
    let selected = pivotRow;
    while (selected < rows.length && isZero(rows[selected][column])) selected += 1;
    if (selected === rows.length) continue;
    [rows[pivotRow], rows[selected]] = [rows[selected], rows[pivotRow]];

    const pivot = rows[pivotRow][column];
    rows[pivotRow] = rows[pivotRow].map((value) => divide(value, pivot));

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      if (rowIndex === pivotRow) continue;
      const factor = rows[rowIndex][column];
      if (isZero(factor)) continue;
      rows[rowIndex] = rows[rowIndex].map((value, cellIndex) =>
        subtract(value, multiply(factor, rows[pivotRow][cellIndex])));
    }
    pivotColumnForRow[pivotRow] = column;
    pivotRow += 1;
  }

  for (const row of rows) {
    const allZero = row.slice(0, variables.length).every(isZero);
    if (allZero && !isZero(row[variables.length])) {
      throw new Error("Geometry constraint graph is inconsistent");
    }
  }

  const values = new Map<string, Rational>();
  for (let rowIndex = 0; rowIndex < pivotRow; rowIndex += 1) {
    const pivotColumn = pivotColumnForRow[rowIndex];
    const nonPivotUnknown = rows[rowIndex]
      .slice(0, variables.length)
      .some((coefficient, column) => column !== pivotColumn && !isZero(coefficient));
    if (!nonPivotUnknown) values.set(variables[pivotColumn], rows[rowIndex][variables.length]);
  }

  return Object.freeze({
    values,
    rank: pivotRow,
    variableCount: variables.length,
    theoremTrace: Object.freeze([...new Set(graph.equations.map((equation) => equation.reason))]),
  });
}

export interface TriangleRef {
  readonly id: string;
  readonly vertexIds: readonly [string, string, string];
}

export interface VertexCorrespondence {
  readonly pairs: readonly (readonly [string, string])[];
}

export interface SegmentProductRef {
  readonly firstSegmentId: string;
  readonly secondSegmentId: string;
}

export type GeoProofEvent =
  | Readonly<{ kind: "ANGLE_EQUALITY"; leftAngleId: string; rightAngleId: string; reason: TheoremId }>
  | Readonly<{ kind: "ANGLE_SUM"; angleIds: readonly string[]; total: Rational; reason: TheoremId }>
  | Readonly<{ kind: "SEGMENT_RATIO"; left: string; right: string; ratio: Rational; reason: TheoremId }>
  | Readonly<{ kind: "SEGMENT_PRODUCT"; left: SegmentProductRef; right: SegmentProductRef; reason: TheoremId }>
  | Readonly<{ kind: "CONGRUENCE"; triangle1: TriangleRef; triangle2: TriangleRef; criterion: TheoremId }>
  | Readonly<{
      kind: "SIMILARITY";
      triangle1: TriangleRef;
      triangle2: TriangleRef;
      criterion: TheoremId;
      correspondence: VertexCorrespondence;
    }>;
