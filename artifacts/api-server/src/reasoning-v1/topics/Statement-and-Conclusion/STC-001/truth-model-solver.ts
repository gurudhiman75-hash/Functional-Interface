import type { StcExpr } from "./types.ts";

type TruthModel = Readonly<Record<string, boolean>>;

function evaluate(expr: StcExpr, model: TruthModel): boolean {
  switch (expr.kind) {
    case "atom":
      return model[expr.id] ?? false;
    case "not":
      return !evaluate(expr.value, model);
    case "and":
      return expr.values.every((value) => evaluate(value, model));
    case "or":
      return expr.values.some((value) => evaluate(value, model));
    case "implies":
      return !evaluate(expr.if, model) || evaluate(expr.then, model);
  }
}

function collectAtoms(expr: StcExpr, into: Set<string>): void {
  switch (expr.kind) {
    case "atom":
      into.add(expr.id);
      return;
    case "not":
      collectAtoms(expr.value, into);
      return;
    case "and":
    case "or":
      for (const value of expr.values) collectAtoms(value, into);
      return;
    case "implies":
      collectAtoms(expr.if, into);
      collectAtoms(expr.then, into);
      return;
  }
}

export function stcEntails(premises: readonly StcExpr[], conclusion: StcExpr): boolean {
  const atoms = new Set<string>();
  for (const premise of premises) collectAtoms(premise, atoms);
  collectAtoms(conclusion, atoms);
  const ids = [...atoms].sort();
  if (ids.length > 14) throw new Error(`STC truth-model domain too large: ${ids.length}`);

  let satisfyingModelCount = 0;
  const modelCount = 1 << ids.length;
  for (let mask = 0; mask < modelCount; mask += 1) {
    const model: Record<string, boolean> = {};
    for (let index = 0; index < ids.length; index += 1) {
      model[ids[index]!] = Boolean(mask & (1 << index));
    }
    if (!premises.every((premise) => evaluate(premise, model))) continue;
    satisfyingModelCount += 1;
    if (!evaluate(conclusion, model)) return false;
  }

  if (satisfyingModelCount === 0) {
    throw new Error("STC authority contains inconsistent premises");
  }
  return true;
}

export const atom = (id: string): StcExpr => ({ kind: "atom", id });
export const not = (value: StcExpr): StcExpr => ({ kind: "not", value });
export const and = (...values: readonly StcExpr[]): StcExpr => ({ kind: "and", values });
export const or = (...values: readonly StcExpr[]): StcExpr => ({ kind: "or", values });
export const implies = (ifExpr: StcExpr, thenExpr: StcExpr): StcExpr => ({ kind: "implies", if: ifExpr, then: thenExpr });
