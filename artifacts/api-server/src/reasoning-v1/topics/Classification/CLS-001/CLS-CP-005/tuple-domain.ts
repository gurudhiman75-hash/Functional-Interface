import {
  CLS_CP005_PAIR_RULE_IDS,
  CLS_CP005_TRIPLE_RULE_IDS,
  isClsCp005PairRule,
  isClsCp005TripleRule,
} from "./relation-registry";
import type {
  ClsCp005Arity,
  ClsCp005Pair,
  ClsCp005RuleId,
  ClsCp005Triple,
  ClsCp005Tuple,
} from "./types";

export const CLS_CP005_DATASET_VERSION = "CLS-CP005-TUPLE-DOMAIN-v1" as const;

export function clsCp005Gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

export function clsCp005Lcm(left: number, right: number): number {
  return Math.abs(left * right) / clsCp005Gcd(left, right);
}

export function clsCp005ReverseDigits(value: number): number {
  return Number(String(Math.abs(value)).split("").reverse().join(""));
}

function reducedRatio(numerator: number, denominator: number): string {
  const divisor = clsCp005Gcd(numerator, denominator);
  return `${numerator / divisor}:${denominator / divisor}`;
}

export function displayClsCp005Tuple(tuple: ClsCp005Tuple): string {
  return `(${tuple.join(", ")})`;
}

export function clsCp005TupleKey(tuple: ClsCp005Tuple): string {
  return tuple.join(",");
}

export function canonicalClsCp005RuleValue(
  tuple: ClsCp005Tuple,
  ruleId: ClsCp005RuleId,
): string | null {
  if (tuple.length === 2) {
    if (!isClsCp005PairRule(ruleId)) return null;
    const [a, b] = tuple;
    switch (ruleId) {
      case "PAIR_SIGNED_DIFFERENCE": return String(b - a);
      case "PAIR_REDUCED_RATIO": return reducedRatio(b, a);
      case "PAIR_SUM": return String(a + b);
      case "PAIR_PRODUCT": return String(a * b);
      case "PAIR_GCD": return String(clsCp005Gcd(a, b));
      case "PAIR_LCM": return String(clsCp005Lcm(a, b));
      case "PAIR_CONSECUTIVE_DIRECTION":
        if (b === a + 1) return "FORWARD";
        if (a === b + 1) return "REVERSE";
        return null;
      case "PAIR_SQUARE_DIRECTION":
        if (b === a * a) return "FORWARD";
        if (a === b * b) return "REVERSE";
        return null;
      case "PAIR_CUBE_DIRECTION":
        if (b === a * a * a) return "FORWARD";
        if (a === b * b * b) return "REVERSE";
        return null;
      case "PAIR_DIGIT_REVERSE_DIRECTION":
        return clsCp005ReverseDigits(a) === b && a !== b ? "REVERSED" : null;
    }
  }

  if (tuple.length === 3) {
    if (!isClsCp005TripleRule(ruleId)) return null;
    const [a, b, c] = tuple;
    switch (ruleId) {
      case "TRIPLE_SUM_OF_TWO_EQUALS_THIRD":
        if (a + b === c) return "AB_TO_C";
        if (a + c === b) return "AC_TO_B";
        if (b + c === a) return "BC_TO_A";
        return null;
      case "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD":
        if (a * b === c) return "AB_TO_C";
        if (a * c === b) return "AC_TO_B";
        if (b * c === a) return "BC_TO_A";
        return null;
      case "TRIPLE_ARITHMETIC_PROGRESSION":
        return b - a === c - b ? "ARITHMETIC" : null;
      case "TRIPLE_GEOMETRIC_PROGRESSION":
        return b * b === a * c ? "GEOMETRIC" : null;
      case "TRIPLE_PYTHAGOREAN_DIRECTION":
        if (a * a + b * b === c * c) return "AB_TO_C";
        if (a * a + c * c === b * b) return "AC_TO_B";
        if (b * b + c * c === a * a) return "BC_TO_A";
        return null;
      case "TRIPLE_CONSECUTIVE_DIRECTION":
        if (b === a + 1 && c === b + 1) return "FORWARD";
        if (b === a - 1 && c === b - 1) return "REVERSE";
        return null;
      case "TRIPLE_SUM": return String(a + b + c);
      case "TRIPLE_PRODUCT": return String(a * b * c);
    }
  }

  return null;
}

function uniqueTuples<T extends ClsCp005Tuple>(tuples: readonly T[]): T[] {
  const seen = new Set<string>();
  return tuples.filter((tuple) => {
    const key = clsCp005TupleKey(tuple);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildPairPool(): ClsCp005Pair[] {
  const pairs: ClsCp005Pair[] = [];
  for (let a = 2; a <= 80; a += 1) {
    for (let b = 2; b <= 80; b += 1) {
      if (a !== b) pairs.push([a, b]);
    }
  }
  for (let base = 2; base <= 25; base += 1) {
    pairs.push([base, base * base], [base * base, base]);
  }
  for (let base = 2; base <= 10; base += 1) {
    pairs.push([base, base * base * base], [base * base * base, base]);
  }
  for (let value = 12; value <= 98; value += 1) {
    if (value % 10 === 0) continue;
    const reversed = clsCp005ReverseDigits(value);
    if (reversed !== value && reversed >= 10) pairs.push([value, reversed]);
  }
  return uniqueTuples(pairs);
}

function buildTriplePool(): ClsCp005Triple[] {
  const triples: ClsCp005Triple[] = [];
  for (let a = 2; a <= 32; a += 1) {
    for (let b = 2; b <= 32; b += 1) {
      for (let c = 2; c <= 32; c += 1) {
        if (a !== b || b !== c) triples.push([a, b, c]);
      }
    }
  }
  for (let a = 2; a <= 18; a += 1) {
    for (let b = 2; b <= 18; b += 1) {
      triples.push([a, b, a + b], [a, b, a * b]);
    }
  }
  const pythagorean: readonly ClsCp005Triple[] = [
    [3, 4, 5], [5, 12, 13], [6, 8, 10], [7, 24, 25], [8, 15, 17],
    [9, 12, 15], [9, 40, 41], [10, 24, 26], [12, 16, 20], [12, 35, 37],
    [15, 20, 25], [15, 36, 39], [16, 30, 34], [18, 24, 30], [20, 21, 29],
  ];
  for (const [a, b, c] of pythagorean) {
    triples.push([a, b, c], [b, a, c], [c, a, b]);
  }
  return uniqueTuples(triples);
}

export const CLS_CP005_PAIR_POOL: readonly ClsCp005Pair[] = buildPairPool();
export const CLS_CP005_TRIPLE_POOL: readonly ClsCp005Triple[] = buildTriplePool();

export type ClsCp005RuleCatalog = ReadonlyMap<string, readonly ClsCp005Tuple[]>;

function buildCatalog(
  pool: readonly ClsCp005Tuple[],
  ruleIds: readonly ClsCp005RuleId[],
): ReadonlyMap<ClsCp005RuleId, ClsCp005RuleCatalog> {
  const byRule = new Map<ClsCp005RuleId, Map<string, ClsCp005Tuple[]>>();
  for (const ruleId of ruleIds) byRule.set(ruleId, new Map());
  for (const tuple of pool) {
    for (const ruleId of ruleIds) {
      const value = canonicalClsCp005RuleValue(tuple, ruleId);
      if (value === null) continue;
      const valueMap = byRule.get(ruleId)!;
      const members = valueMap.get(value) ?? [];
      members.push(tuple);
      valueMap.set(value, members);
    }
  }
  return byRule;
}

export const CLS_CP005_PAIR_CATALOG = buildCatalog(CLS_CP005_PAIR_POOL, CLS_CP005_PAIR_RULE_IDS);
export const CLS_CP005_TRIPLE_CATALOG = buildCatalog(CLS_CP005_TRIPLE_POOL, CLS_CP005_TRIPLE_RULE_IDS);

export function clsCp005CatalogForRule(ruleId: ClsCp005RuleId): ClsCp005RuleCatalog {
  return (isClsCp005PairRule(ruleId) ? CLS_CP005_PAIR_CATALOG : CLS_CP005_TRIPLE_CATALOG).get(ruleId)!;
}

export function clsCp005PoolForArity(arity: ClsCp005Arity): readonly ClsCp005Tuple[] {
  return arity === 2 ? CLS_CP005_PAIR_POOL : CLS_CP005_TRIPLE_POOL;
}