import {
  auditClsCp005QuestionAgainstExpandedRegistry,
  type ClsCp005ExpandedAudit,
} from "./source-gap-expanded-audit";
import {
  CLS_CP005_SOURCE_GAP_PAIR_RULE_IDS,
  CLS_CP005_SOURCE_GAP_QUADRUPLE_RULE_IDS,
  CLS_CP005_SOURCE_GAP_TRIPLE_RULE_IDS,
  independentlyEvaluateClsCp005SourceGapRule,
  type ClsCp005SourceGapRuleId,
  type ClsCp005SourceGapTuple,
} from "./source-gap-registry";

export type ClsCp005Wave2PrototypeId =
  | "CLS-CP005-W2-PROT-001"
  | "CLS-CP005-W2-PROT-002"
  | "CLS-CP005-W2-PROT-003"
  | "CLS-CP005-W2-PROT-004"
  | "CLS-CP005-W2-PROT-005"
  | "CLS-CP005-W2-PROT-006"
  | "CLS-CP005-W2-PROT-007"
  | "CLS-CP005-W2-PROT-008"
  | "CLS-CP005-W2-PROT-009"
  | "CLS-CP005-W2-PROT-010"
  | "CLS-CP005-W2-PROT-011"
  | "CLS-CP005-W2-PROT-012"
  | "CLS-CP005-W2-PROT-013"
  | "CLS-CP005-W2-PROT-014"
  | "CLS-CP005-W2-PROT-015"
  | "CLS-CP005-W2-PROT-016"
  | "CLS-CP005-W2-PROT-017"
  | "CLS-CP005-W2-PROT-018"
  | "CLS-CP005-W2-PROT-019";

export type ClsCp005Wave2Task = "FIND_ODD_NUMBER_TUPLE" | "SELECT_EQUIVALENT_NUMBER_SET";
export type ClsCp005Wave2Difficulty = "EASY" | "MEDIUM" | "HARD";

export type ClsCp005Wave2Prototype = {
  readonly prototypeId: ClsCp005Wave2PrototypeId;
  readonly title: string;
  readonly task: ClsCp005Wave2Task;
  readonly arity: 2 | 3 | 4;
  readonly allowedRuleIds: readonly ClsCp005SourceGapRuleId[];
};

export const CLS_CP005_WAVE2_PROTOTYPES: readonly ClsCp005Wave2Prototype[] = [
  { prototypeId: "CLS-CP005-W2-PROT-001", title: "Odd pair by consecutive product", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_CONSECUTIVE_PRODUCT_DIRECTION"] },
  { prototypeId: "CLS-CP005-W2-PROT-002", title: "Odd square-cube pair", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_SQUARE_CUBE_DIRECTION"] },
  { prototypeId: "CLS-CP005-W2-PROT-003", title: "Odd consecutive-cubes pair", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_CONSECUTIVE_CUBES_DIRECTION"] },
  { prototypeId: "CLS-CP005-W2-PROT-004", title: "Odd reversed-cube pair", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_REVERSED_CUBE_DIRECTION"] },
  { prototypeId: "CLS-CP005-W2-PROT-005", title: "Odd cube-minus-one pair", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_CUBE_MINUS_ONE_DIRECTION"] },
  { prototypeId: "CLS-CP005-W2-PROT-006", title: "Odd three-times-minus-ten pair", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_AFFINE_3X_MINUS_10_DIRECTION"] },
  { prototypeId: "CLS-CP005-W2-PROT-007", title: "Odd seven-times-plus-three pair", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_AFFINE_7X_PLUS_3_DIRECTION"] },
  { prototypeId: "CLS-CP005-W2-PROT-008", title: "Odd six-times-plus-two pair", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_AFFINE_6X_PLUS_2_DIRECTION"] },
  { prototypeId: "CLS-CP005-W2-PROT-009", title: "Odd prime-number pair", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_BOTH_PRIME"] },
  { prototypeId: "CLS-CP005-W2-PROT-010", title: "Odd exact-divisibility pair", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_DIVISIBILITY_DIRECTION"] },
  { prototypeId: "CLS-CP005-W2-PROT-011", title: "Odd pair by prime difference", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_PRIME_ABSOLUTE_DIFFERENCE"] },
  { prototypeId: "CLS-CP005-W2-PROT-012", title: "Odd pair by digit permutation", task: "FIND_ODD_NUMBER_TUPLE", arity: 2, allowedRuleIds: ["PAIR_DIGIT_PERMUTATION"] },
  { prototypeId: "CLS-CP005-W2-PROT-013", title: "Odd rearranged arithmetic triple", task: "FIND_ODD_NUMBER_TUPLE", arity: 3, allowedRuleIds: ["TRIPLE_UNORDERED_ARITHMETIC_SET"] },
  { prototypeId: "CLS-CP005-W2-PROT-014", title: "Odd all-prime triple", task: "FIND_ODD_NUMBER_TUPLE", arity: 3, allowedRuleIds: ["TRIPLE_ALL_PRIME"] },
  { prototypeId: "CLS-CP005-W2-PROT-015", title: "Odd same-digit triple", task: "FIND_ODD_NUMBER_TUPLE", arity: 3, allowedRuleIds: ["TRIPLE_SAME_DIGIT_MULTISET"] },
  { prototypeId: "CLS-CP005-W2-PROT-016", title: "Odd proportional four-number group", task: "FIND_ODD_NUMBER_TUPLE", arity: 4, allowedRuleIds: ["QUADRUPLE_REDUCED_RATIO_VECTOR"] },
  { prototypeId: "CLS-CP005-W2-PROT-017", title: "Select equivalent source-gap pair", task: "SELECT_EQUIVALENT_NUMBER_SET", arity: 2, allowedRuleIds: CLS_CP005_SOURCE_GAP_PAIR_RULE_IDS },
  { prototypeId: "CLS-CP005-W2-PROT-018", title: "Select equivalent source-gap triple", task: "SELECT_EQUIVALENT_NUMBER_SET", arity: 3, allowedRuleIds: CLS_CP005_SOURCE_GAP_TRIPLE_RULE_IDS },
  { prototypeId: "CLS-CP005-W2-PROT-019", title: "Select equivalent source-gap quadruple", task: "SELECT_EQUIVALENT_NUMBER_SET", arity: 4, allowedRuleIds: CLS_CP005_SOURCE_GAP_QUADRUPLE_RULE_IDS },
];

const PROTOTYPE_BY_ID = new Map(CLS_CP005_WAVE2_PROTOTYPES.map((prototype) => [prototype.prototypeId, prototype]));
const MAX_ATTEMPTS = 1800;

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function factorial(value: number): number {
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
}

function permuteByIndex<T>(values: readonly T[], index: number): T[] {
  const pool = [...values];
  const output: T[] = [];
  let remainder = index % factorial(values.length);
  for (let position = 0; position < values.length; position += 1) {
    const block = factorial(values.length - position - 1);
    const selected = Math.floor(remainder / block);
    remainder %= block;
    output.push(pool.splice(selected, 1)[0]!);
  }
  return output;
}

function tupleKey(tuple: ClsCp005SourceGapTuple): string {
  return tuple.join(",");
}

function unorderedTupleKey(tuple: ClsCp005SourceGapTuple): string {
  return [...tuple].sort((left, right) => left - right).join(",");
}

function displayTuple(tuple: ClsCp005SourceGapTuple): string {
  return `(${tuple.join(", ")})`;
}

function reverseDigits(value: number): number {
  return Number(String(Math.abs(value)).split("").reverse().join(""));
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function gcdAll(values: readonly number[]): number {
  return values.reduce((current, value) => gcd(current, value));
}

function isPrime(value: number): boolean {
  if (!Number.isInteger(value) || value < 2) return false;
  if (value % 2 === 0) return value === 2;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function smallestFactor(value: number): number | null {
  if (value < 4) return null;
  if (value % 2 === 0) return 2;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return divisor;
  }
  return null;
}

function digitKey(value: number): string {
  return String(Math.abs(value)).split("").sort().join("");
}

function uniqueTuples(tuples: readonly ClsCp005SourceGapTuple[]): ClsCp005SourceGapTuple[] {
  const seen = new Set<string>();
  return tuples.filter((tuple) => {
    const key = tupleKey(tuple);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function permutationsOfDigits(digits: readonly number[]): number[] {
  const values = new Set<number>();
  for (const first of digits) {
    for (const second of digits) {
      for (const third of digits) {
        if (new Set([first, second, third]).size !== 3) continue;
        values.add(first * 100 + second * 10 + third);
      }
    }
  }
  return [...values];
}

function buildValidTuples(ruleId: ClsCp005SourceGapRuleId): ClsCp005SourceGapTuple[] {
  const tuples: ClsCp005SourceGapTuple[] = [];
  switch (ruleId) {
    case "PAIR_CONSECUTIVE_PRODUCT_DIRECTION":
      for (let base = 2; base <= 32; base += 1) tuples.push([base, base * (base + 1)], [base * (base + 1), base]);
      break;
    case "PAIR_SQUARE_CUBE_DIRECTION":
      for (let base = 2; base <= 16; base += 1) tuples.push([base ** 2, base ** 3], [base ** 3, base ** 2]);
      break;
    case "PAIR_CONSECUTIVE_CUBES_DIRECTION":
      for (let base = 1; base <= 11; base += 1) tuples.push([base ** 3, (base + 1) ** 3], [(base + 1) ** 3, base ** 3]);
      break;
    case "PAIR_REVERSED_CUBE_DIRECTION":
      for (let base = 2; base <= 25; base += 1) {
        const transformed = reverseDigits(base ** 3);
        if (transformed !== base && transformed > 0) tuples.push([base, transformed], [transformed, base]);
      }
      break;
    case "PAIR_CUBE_MINUS_ONE_DIRECTION":
      for (let base = 2; base <= 14; base += 1) tuples.push([base, base ** 3 - 1], [base ** 3 - 1, base]);
      break;
    case "PAIR_AFFINE_3X_MINUS_10_DIRECTION":
      for (let base = 5; base <= 45; base += 1) tuples.push([base, 3 * base - 10], [3 * base - 10, base]);
      break;
    case "PAIR_AFFINE_7X_PLUS_3_DIRECTION":
      for (let base = 2; base <= 24; base += 1) tuples.push([base, 7 * base + 3], [7 * base + 3, base]);
      break;
    case "PAIR_AFFINE_6X_PLUS_2_DIRECTION":
      for (let base = 2; base <= 26; base += 1) tuples.push([base, 6 * base + 2], [6 * base + 2, base]);
      break;
    case "PAIR_BOTH_PRIME": {
      const primes = Array.from({ length: 60 }, (_, index) => index + 2).filter(isPrime);
      for (let left = 0; left < primes.length; left += 1) {
        for (let right = left + 1; right < primes.length; right += 1) {
          tuples.push([primes[left]!, primes[right]!]);
        }
      }
      break;
    }
    case "PAIR_DIVISIBILITY_DIRECTION":
      for (let base = 2; base <= 35; base += 1) {
        for (let multiplier = 2; multiplier <= 8; multiplier += 1) {
          tuples.push([base, base * multiplier], [base * multiplier, base]);
        }
      }
      break;
    case "PAIR_PRIME_ABSOLUTE_DIFFERENCE": {
      const primeGaps = [2, 3, 5, 7, 11, 13, 17, 19];
      for (let base = 2; base <= 90; base += 1) {
        for (const gap of primeGaps) tuples.push([base, base + gap]);
      }
      break;
    }
    case "PAIR_DIGIT_PERMUTATION": {
      const digitSets = [[1, 2, 3], [1, 2, 4], [1, 3, 5], [2, 3, 6], [2, 4, 7], [3, 5, 8], [4, 6, 9]];
      for (const digits of digitSets) {
        const values = permutationsOfDigits(digits);
        for (const first of values) {
          for (const second of values) {
            if (first !== second && reverseDigits(first) !== second) tuples.push([first, second]);
          }
        }
      }
      break;
    }
    case "TRIPLE_UNORDERED_ARITHMETIC_SET":
      for (let base = 2; base <= 45; base += 1) {
        for (let gap = 1; gap <= 12; gap += 1) {
          const low = base;
          const middle = base + gap;
          const high = base + 2 * gap;
          tuples.push([high, low, middle], [middle, high, low], [middle, low, high], [low, high, middle]);
        }
      }
      break;
    case "TRIPLE_ALL_PRIME": {
      const primes = Array.from({ length: 70 }, (_, index) => index + 2).filter(isPrime);
      for (let first = 0; first < primes.length; first += 1) {
        for (let second = first + 1; second < primes.length; second += 1) {
          for (let third = second + 1; third < primes.length; third += 1) {
            tuples.push([primes[first]!, primes[second]!, primes[third]!]);
          }
        }
      }
      break;
    }
    case "TRIPLE_SAME_DIGIT_MULTISET": {
      const digitSets = [[1, 2, 3], [1, 2, 5], [1, 3, 6], [2, 3, 7], [2, 4, 8], [3, 5, 9]];
      for (const digits of digitSets) {
        const values = permutationsOfDigits(digits);
        for (let first = 0; first < values.length; first += 1) {
          for (let second = first + 1; second < values.length; second += 1) {
            for (let third = second + 1; third < values.length; third += 1) {
              tuples.push([values[first]!, values[second]!, values[third]!]);
            }
          }
        }
      }
      break;
    }
    case "QUADRUPLE_REDUCED_RATIO_VECTOR": {
      const vectors = [[4, 3, 2, 5], [1, 2, 3, 4], [2, 5, 3, 4], [3, 1, 4, 2], [5, 2, 1, 3], [2, 3, 5, 1]];
      for (const vector of vectors) {
        for (let scale = 1; scale <= 16; scale += 1) {
          tuples.push(vector.map((value) => value * scale) as [number, number, number, number]);
        }
      }
      break;
    }
  }
  return uniqueTuples(tuples).filter((tuple) => independentlyEvaluateClsCp005SourceGapRule(tuple, ruleId) !== null);
}

const VALID_BY_RULE = new Map<ClsCp005SourceGapRuleId, readonly ClsCp005SourceGapTuple[]>(
  [...CLS_CP005_SOURCE_GAP_PAIR_RULE_IDS, ...CLS_CP005_SOURCE_GAP_TRIPLE_RULE_IDS, ...CLS_CP005_SOURCE_GAP_QUADRUPLE_RULE_IDS]
    .map((ruleId) => [ruleId, buildValidTuples(ruleId)]),
);

function buildGenericPool(arity: 2 | 3 | 4): ClsCp005SourceGapTuple[] {
  const tuples: ClsCp005SourceGapTuple[] = [];
  for (const [ruleId, members] of VALID_BY_RULE) {
    const entryArity = ruleId.startsWith("PAIR_") ? 2 : ruleId.startsWith("TRIPLE_") ? 3 : 4;
    if (entryArity === arity) tuples.push(...members);
  }
  if (arity === 2) {
    for (let first = 2; first <= 95; first += 1) {
      for (let second = 2; second <= 95; second += 1) {
        if (first !== second) tuples.push([first, second]);
      }
    }
  } else if (arity === 3) {
    for (let base = 2; base <= 45; base += 1) {
      tuples.push([base, base + 3, base + 8], [base + 7, base, base + 2], [base, base + 5, base + 11]);
    }
  } else {
    for (let base = 2; base <= 45; base += 1) {
      tuples.push([base, base + 2, base + 5, base + 9], [base + 7, base + 1, base + 4, base + 10]);
    }
  }
  return uniqueTuples(tuples).filter((tuple) => new Set(tuple).size === tuple.length);
}

const GENERIC_POOLS = new Map<2 | 3 | 4, readonly ClsCp005SourceGapTuple[]>([
  [2, buildGenericPool(2)],
  [3, buildGenericPool(3)],
  [4, buildGenericPool(4)],
]);

function catalogForRule(ruleId: ClsCp005SourceGapRuleId): ReadonlyMap<string, readonly ClsCp005SourceGapTuple[]> {
  const catalog = new Map<string, ClsCp005SourceGapTuple[]>();
  for (const tuple of VALID_BY_RULE.get(ruleId) ?? []) {
    const value = independentlyEvaluateClsCp005SourceGapRule(tuple, ruleId);
    if (value === null) continue;
    const members = catalog.get(value) ?? [];
    members.push(tuple);
    catalog.set(value, members);
  }
  return catalog;
}

const CATALOGS = new Map<ClsCp005SourceGapRuleId, ReadonlyMap<string, readonly ClsCp005SourceGapTuple[]>>(
  [...VALID_BY_RULE.keys()].map((ruleId) => [ruleId, catalogForRule(ruleId)]),
);

function selectDistinct(
  members: readonly ClsCp005SourceGapTuple[],
  count: number,
  start: number,
  stride: number,
  forbidden: ReadonlySet<string> = new Set(),
): ClsCp005SourceGapTuple[] {
  const selected: ClsCp005SourceGapTuple[] = [];
  const seen = new Set(forbidden);
  for (let step = 0; step < members.length * 3 && selected.length < count; step += 1) {
    const tuple = members[(start + step * stride) % members.length]!;
    const key = tupleKey(tuple);
    if (seen.has(key)) continue;
    seen.add(key);
    selected.push(tuple);
  }
  return selected;
}

function presentationSafe(tuples: readonly ClsCp005SourceGapTuple[], referenceTuple: ClsCp005SourceGapTuple | null): boolean {
  if (tuples.some((tuple) => new Set(tuple).size !== tuple.length)) return false;
  if (new Set(tuples.map(tupleKey)).size !== tuples.length) return false;
  if (new Set(tuples.map(unorderedTupleKey)).size !== tuples.length) return false;
  if (referenceTuple) {
    if (new Set(referenceTuple).size !== referenceTuple.length) return false;
    if (tuples.map(unorderedTupleKey).includes(unorderedTupleKey(referenceTuple))) return false;
  }
  const maxima = tuples.map((tuple) => Math.max(...tuple));
  const totals = tuples.map((tuple) => tuple.reduce((sum, value) => sum + value, 0));
  if (Math.max(...maxima) / Math.min(...maxima) > 30) return false;
  if (Math.max(...totals) / Math.min(...totals) > 20) return false;
  return true;
}

function usableEntries(ruleId: ClsCp005SourceGapRuleId, minimumMembers: number): readonly [string, readonly ClsCp005SourceGapTuple[]][] {
  return [...(CATALOGS.get(ruleId) ?? new Map()).entries()]
    .filter(([, members]) => members.length >= minimumMembers)
    .sort(([left], [right]) => left.localeCompare(right, "en", { numeric: true }));
}

function constructState(
  prototype: ClsCp005Wave2Prototype,
  ruleId: ClsCp005SourceGapRuleId,
  seed: number,
  optionCount: 4 | 5,
): {
  readonly tuples: readonly ClsCp005SourceGapTuple[];
  readonly referenceTuple: ClsCp005SourceGapTuple | null;
  readonly intendedRuleValue: string;
  readonly correctIndex: number;
  readonly audit: ClsCp005ExpandedAudit;
  readonly sourceAttempt: number;
} {
  const entries = usableEntries(ruleId, prototype.task === "SELECT_EQUIVALENT_NUMBER_SET" ? 2 : optionCount - 1);
  if (entries.length === 0) throw new Error(`${ruleId} has no usable Wave 2 catalog entries`);
  const pool = GENERIC_POOLS.get(prototype.arity)!;
  const baseHash = hashText(`${prototype.prototypeId}:${ruleId}:${seed}:${optionCount}`);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const [value, members] = entries[(baseHash + attempt * 17) % entries.length]!;
    if (prototype.task === "FIND_ODD_NUMBER_TUPLE") {
      const common = selectDistinct(
        members,
        optionCount - 1,
        (baseHash + attempt * 19) % members.length,
        1 + ((baseHash >>> 4) + attempt) % Math.max(1, Math.min(17, members.length - 1)),
      );
      if (common.length !== optionCount - 1) continue;
      const commonKeys = new Set(common.map(tupleKey));
      for (let offset = 0; offset < Math.min(pool.length, 2400); offset += 1) {
        const odd = pool[(baseHash + attempt * 31 + offset * 37) % pool.length]!;
        if (commonKeys.has(tupleKey(odd))) continue;
        if (independentlyEvaluateClsCp005SourceGapRule(odd, ruleId) === value) continue;
        const tuples = permuteByIndex([...common, odd], baseHash + attempt * 11 + offset);
        if (!presentationSafe(tuples, null)) continue;
        const audit = auditClsCp005QuestionAgainstExpandedRegistry({
          task: prototype.task,
          referenceTuple: null,
          tuples,
          intendedRuleId: ruleId,
          intendedRuleValue: value,
        });
        if (audit.result === "EXPANDED_UNIQUE" && audit.answerIndex !== null) {
          return { tuples, referenceTuple: null, intendedRuleValue: value, correctIndex: audit.answerIndex, audit, sourceAttempt: attempt };
        }
      }
    } else {
      const referenceTuple = members[(baseHash + attempt * 23) % members.length]!;
      const match = selectDistinct(
        members,
        1,
        (baseHash + attempt * 29 + 1) % members.length,
        1 + attempt % 13,
        new Set([tupleKey(referenceTuple)]),
      )[0];
      if (!match) continue;
      const selected = new Set([tupleKey(referenceTuple), tupleKey(match)]);
      const distractors: ClsCp005SourceGapTuple[] = [];
      for (let offset = 0; offset < Math.min(pool.length, 3000) && distractors.length < optionCount - 1; offset += 1) {
        const candidate = pool[(baseHash + attempt * 41 + offset * 43) % pool.length]!;
        const key = tupleKey(candidate);
        if (selected.has(key)) continue;
        if (independentlyEvaluateClsCp005SourceGapRule(candidate, ruleId) === value) continue;
        selected.add(key);
        distractors.push(candidate);
      }
      if (distractors.length !== optionCount - 1) continue;
      const tuples = permuteByIndex([match, ...distractors], baseHash + attempt * 13);
      if (!presentationSafe(tuples, referenceTuple)) continue;
      const audit = auditClsCp005QuestionAgainstExpandedRegistry({
        task: prototype.task,
        referenceTuple,
        tuples,
        intendedRuleId: ruleId,
        intendedRuleValue: value,
      });
      if (audit.result === "EXPANDED_UNIQUE" && audit.answerIndex !== null) {
        return { tuples, referenceTuple, intendedRuleValue: value, correctIndex: audit.answerIndex, audit, sourceAttempt: attempt };
      }
    }
  }
  throw new Error(`${prototype.prototypeId}/${ruleId}/${seed} could not construct an expanded-rule-unique Wave 2 state`);
}

function inlineMath(tex: string): string {
  return `\\( ${tex} \\)`;
}

function status(matches: boolean): string {
  return matches ? "— ✅ Matches rule." : "— ❌ Fails rule.";
}

function directionNames(value: string): { source: "first" | "second"; target: "first" | "second" } {
  return value === "FORWARD" ? { source: "first", target: "second" } : { source: "second", target: "first" };
}

function directionalValues(tuple: readonly [number, number], value: string): { source: number; target: number } {
  return value === "FORWARD" ? { source: tuple[0], target: tuple[1] } : { source: tuple[1], target: tuple[0] };
}

function ruleStatement(ruleId: ClsCp005SourceGapRuleId, value: string): string {
  const direction = directionNames(value);
  switch (ruleId) {
    case "PAIR_CONSECUTIVE_PRODUCT_DIRECTION": return `Rule: the ${direction.target} number equals the ${direction.source} number multiplied by its next integer.`;
    case "PAIR_SQUARE_CUBE_DIRECTION": return `Rule: the ${direction.source} entry is a square and the ${direction.target} entry is the cube of the same base.`;
    case "PAIR_CONSECUTIVE_CUBES_DIRECTION": return `Rule: the ${direction.source} and ${direction.target} entries are cubes of consecutive integers.`;
    case "PAIR_REVERSED_CUBE_DIRECTION": return `Rule: cube the ${direction.source} number and reverse its digits to obtain the ${direction.target} number.`;
    case "PAIR_CUBE_MINUS_ONE_DIRECTION": return `Rule: the ${direction.target} number is one less than the cube of the ${direction.source} number.`;
    case "PAIR_AFFINE_3X_MINUS_10_DIRECTION": return `Rule: ${direction.target} = 3 × ${direction.source} − 10.`;
    case "PAIR_AFFINE_7X_PLUS_3_DIRECTION": return `Rule: ${direction.target} = 7 × ${direction.source} + 3.`;
    case "PAIR_AFFINE_6X_PLUS_2_DIRECTION": return `Rule: ${direction.target} = 6 × ${direction.source} + 2.`;
    case "PAIR_BOTH_PRIME": return "Rule: both numbers in the pair are prime.";
    case "PAIR_DIVISIBILITY_DIRECTION": return value === "SECOND_MULTIPLE" ? "Rule: the second number is an exact multiple of the first." : "Rule: the first number is an exact multiple of the second.";
    case "PAIR_PRIME_ABSOLUTE_DIFFERENCE": return "Rule: the absolute difference between the two numbers is prime.";
    case "PAIR_DIGIT_PERMUTATION": return "Rule: both numbers contain the same digits in a non-reversal order.";
    case "TRIPLE_UNORDERED_ARITHMETIC_SET": return "Rule: after arranging the three values from smallest to largest, the two gaps are equal.";
    case "TRIPLE_ALL_PRIME": return "Rule: all three numbers are prime.";
    case "TRIPLE_SAME_DIGIT_MULTISET": return "Rule: all three numbers contain the same digits in different orders.";
    case "QUADRUPLE_REDUCED_RATIO_VECTOR": return `Rule: after dividing by the common factor, the four positions reduce to ${value}.`;
  }
}

function explainTuple(
  tuple: ClsCp005SourceGapTuple,
  ruleId: ClsCp005SourceGapRuleId,
  intendedValue: string,
): string {
  const matches = independentlyEvaluateClsCp005SourceGapRule(tuple, ruleId) === intendedValue;
  const display = displayTuple(tuple);
  if (tuple.length === 2) {
    const pair = tuple as readonly [number, number];
    const [first, second] = pair;
    const { source, target } = directionalValues(pair, intendedValue);
    const names = directionNames(intendedValue);
    switch (ruleId) {
      case "PAIR_CONSECUTIVE_PRODUCT_DIRECTION": {
        const result = source * (source + 1);
        const prose = matches ? `The ${names.source} number times its next integer gives the ${names.target} number.` : `The ${names.source} number gives ${result}, not the ${names.target} number ${target}.`;
        return `${display}: ${prose} ${inlineMath(`${source} \\times (${source} + 1) = ${result}${matches ? "" : ` \\ne ${target}`}`)} ${status(matches)}`;
      }
      case "PAIR_SQUARE_CUBE_DIRECTION": {
        const base = Math.round(Math.sqrt(source));
        const square = base ** 2;
        const cube = base ** 3;
        const prose = matches ? `Both entries come from the same base ${base}: one is its square and the other its cube.` : square === source ? `The square base is ${base}, but its cube is ${cube}, not ${target}.` : `The ${names.source} entry ${source} is not a perfect square, so no common square-cube base is formed.`;
        const tex = square === source ? `${base}^2 = ${source},\\quad ${base}^3 = ${cube}${matches ? "" : ` \\ne ${target}`}` : `\\sqrt{${source}} \\notin \\mathbb{Z}`;
        return `${display}: ${prose} ${inlineMath(tex)} ${status(matches)}`;
      }
      case "PAIR_CONSECUTIVE_CUBES_DIRECTION": {
        const base = Math.round(Math.cbrt(source));
        const sourceCube = base ** 3;
        const nextCube = (base + 1) ** 3;
        const prose = matches ? `The entries are cubes of the consecutive bases ${base} and ${base + 1}.` : sourceCube === source ? `The next cube after ${source} is ${nextCube}, not ${target}.` : `The ${names.source} entry ${source} is not a perfect cube.`;
        const tex = sourceCube === source ? `${base}^3 = ${source},\\quad (${base} + 1)^3 = ${nextCube}${matches ? "" : ` \\ne ${target}`}` : `\\sqrt[3]{${source}} \\notin \\mathbb{Z}`;
        return `${display}: ${prose} ${inlineMath(tex)} ${status(matches)}`;
      }
      case "PAIR_REVERSED_CUBE_DIRECTION": {
        const cube = source ** 3;
        const reversed = reverseDigits(cube);
        const prose = matches ? `Cubing the ${names.source} number and reversing the result gives the ${names.target} number.` : `The reversed cube is ${reversed}, not ${target}.`;
        return `${display}: ${prose} ${inlineMath(`${source}^3 = ${cube},\\quad \\operatorname{reverse}(${cube}) = ${reversed}${matches ? "" : ` \\ne ${target}`}`)} ${status(matches)}`;
      }
      case "PAIR_CUBE_MINUS_ONE_DIRECTION": {
        const result = source ** 3 - 1;
        const prose = matches ? `One less than the cube of the ${names.source} number gives the ${names.target} number.` : `The required result is ${result}, not ${target}.`;
        return `${display}: ${prose} ${inlineMath(`${source}^3 - 1 = ${result}${matches ? "" : ` \\ne ${target}`}`)} ${status(matches)}`;
      }
      case "PAIR_AFFINE_3X_MINUS_10_DIRECTION": {
        const result = 3 * source - 10;
        const prose = matches ? `Three times the ${names.source} number minus 10 gives the ${names.target} number.` : `The calculation gives ${result}, not ${target}.`;
        return `${display}: ${prose} ${inlineMath(`3 \\times ${source} - 10 = ${result}${matches ? "" : ` \\ne ${target}`}`)} ${status(matches)}`;
      }
      case "PAIR_AFFINE_7X_PLUS_3_DIRECTION": {
        const result = 7 * source + 3;
        const prose = matches ? `Seven times the ${names.source} number plus 3 gives the ${names.target} number.` : `The calculation gives ${result}, not ${target}.`;
        return `${display}: ${prose} ${inlineMath(`7 \\times ${source} + 3 = ${result}${matches ? "" : ` \\ne ${target}`}`)} ${status(matches)}`;
      }
      case "PAIR_AFFINE_6X_PLUS_2_DIRECTION": {
        const result = 6 * source + 2;
        const prose = matches ? `Six times the ${names.source} number plus 2 gives the ${names.target} number.` : `The calculation gives ${result}, not ${target}.`;
        return `${display}: ${prose} ${inlineMath(`6 \\times ${source} + 2 = ${result}${matches ? "" : ` \\ne ${target}`}`)} ${status(matches)}`;
      }
      case "PAIR_BOTH_PRIME": {
        const composite = [first, second].find((value) => !isPrime(value));
        const factor = composite === undefined ? null : smallestFactor(composite);
        const prose = matches ? `${first} and ${second} are both prime numbers.` : `${composite} is composite, so the pair is not an all-prime pair.`;
        const tex = matches ? `${first}, ${second} \\in \\mathbb{P}` : factor ? `${composite} = ${factor} \\times ${composite / factor}` : `${composite} \\notin \\mathbb{P}`;
        return `${display}: ${prose} ${inlineMath(tex)} ${status(matches)}`;
      }
      case "PAIR_DIVISIBILITY_DIRECTION": {
        const dividend = intendedValue === "SECOND_MULTIPLE" ? second : first;
        const divisor = intendedValue === "SECOND_MULTIPLE" ? first : second;
        const quotient = dividend / divisor;
        const prose = matches ? `${dividend} is an exact multiple of ${divisor}.` : `${dividend} is not exactly divisible by ${divisor}.`;
        const tex = matches ? `${dividend} \\div ${divisor} = ${quotient}` : `${dividend} \\bmod ${divisor} = ${dividend % divisor} \\ne 0`;
        return `${display}: ${prose} ${inlineMath(tex)} ${status(matches)}`;
      }
      case "PAIR_PRIME_ABSOLUTE_DIFFERENCE": {
        const difference = Math.abs(first - second);
        const factor = smallestFactor(difference);
        const prose = matches ? `The absolute difference ${difference} is prime.` : `The absolute difference ${difference} is not prime.`;
        const tex = matches ? `|${first} - ${second}| = ${difference} \\in \\mathbb{P}` : factor ? `|${first} - ${second}| = ${difference} = ${factor} \\times ${difference / factor}` : `|${first} - ${second}| = ${difference} \\notin \\mathbb{P}`;
        return `${display}: ${prose} ${inlineMath(tex)} ${status(matches)}`;
      }
      case "PAIR_DIGIT_PERMUTATION": {
        const firstDigits = digitKey(first).split("").join(",");
        const secondDigits = digitKey(second).split("").join(",");
        const prose = matches ? `Both numbers use the same digits, but the second is not merely the full reversal of the first.` : `The two numbers do not form the required non-reversal digit rearrangement.`;
        return `${display}: ${prose} ${inlineMath(`\\operatorname{digits}(${first}) = \\{${firstDigits}\\},\\quad \\operatorname{digits}(${second}) = \\{${secondDigits}\\}`)} ${status(matches)}`;
      }
    }
  }

  if (tuple.length === 3) {
    const [first, second, third] = tuple;
    switch (ruleId) {
      case "TRIPLE_UNORDERED_ARITHMETIC_SET": {
        const sorted = [first, second, third].sort((left, right) => left - right);
        const gap1 = sorted[1]! - sorted[0]!;
        const gap2 = sorted[2]! - sorted[1]!;
        const prose = matches ? `After sorting, both consecutive gaps are ${gap1}.` : `After sorting, the gaps are ${gap1} and ${gap2}, so they are unequal.`;
        return `${display}: ${prose} ${inlineMath(`${sorted[1]} - ${sorted[0]} = ${gap1},\\quad ${sorted[2]} - ${sorted[1]} = ${gap2}`)} ${status(matches)}`;
      }
      case "TRIPLE_ALL_PRIME": {
        const composite = [first, second, third].find((value) => !isPrime(value));
        const factor = composite === undefined ? null : smallestFactor(composite);
        const prose = matches ? `${first}, ${second} and ${third} are all prime.` : `${composite} is composite, so the triple is not all-prime.`;
        const tex = matches ? `${first}, ${second}, ${third} \\in \\mathbb{P}` : factor ? `${composite} = ${factor} \\times ${composite / factor}` : `${composite} \\notin \\mathbb{P}`;
        return `${display}: ${prose} ${inlineMath(tex)} ${status(matches)}`;
      }
      case "TRIPLE_SAME_DIGIT_MULTISET": {
        const keys = [first, second, third].map(digitKey);
        const prose = matches ? `All three numbers contain the same digits in different orders.` : `The sorted digit groups are not all identical.`;
        return `${display}: ${prose} ${inlineMath(keys.map((key, index) => `D_${index + 1} = \\{${key.split("").join(",")}\\}`).join(",\\quad "))} ${status(matches)}`;
      }
    }
  }

  if (tuple.length === 4 && ruleId === "QUADRUPLE_REDUCED_RATIO_VECTOR") {
    const divisor = gcdAll(tuple);
    const reduced = tuple.map((value) => value / divisor).join(":");
    const prose = matches ? `Dividing all four values by ${divisor} gives the required ratio ${intendedValue}.` : `The reduced ratio is ${reduced}, not ${intendedValue}.`;
    return `${display}: ${prose} ${inlineMath(`\\operatorname{gcd} = ${divisor},\\quad ${tuple.join(":")} = ${reduced}${matches ? "" : ` \\ne ${intendedValue}`}`)} ${status(matches)}`;
  }

  throw new Error(`${ruleId} cannot explain tuple ${tupleKey(tuple)}`);
}

function shortcut(ruleId: ClsCp005SourceGapRuleId): string {
  switch (ruleId) {
    case "PAIR_CONSECUTIVE_PRODUCT_DIRECTION": return "Multiply the designated source by its next integer and compare with the target.";
    case "PAIR_SQUARE_CUBE_DIRECTION": return "Recover the square root first, then check whether the other entry is the cube of the same base.";
    case "PAIR_CONSECUTIVE_CUBES_DIRECTION": return "Take exact cube roots and check whether the bases differ by one.";
    case "PAIR_REVERSED_CUBE_DIRECTION": return "Cube the source once, reverse that result once and compare directly.";
    case "PAIR_CUBE_MINUS_ONE_DIRECTION": return "Cube the source and subtract one before comparing with the target.";
    case "PAIR_AFFINE_3X_MINUS_10_DIRECTION": return "Apply three-times-minus-ten in the same direction to every pair.";
    case "PAIR_AFFINE_7X_PLUS_3_DIRECTION": return "Apply seven-times-plus-three in the same direction to every pair.";
    case "PAIR_AFFINE_6X_PLUS_2_DIRECTION": return "Apply six-times-plus-two in the same direction to every pair.";
    case "PAIR_BOTH_PRIME": return "Test the smaller divisors first; one composite entry is enough to reject a pair.";
    case "PAIR_DIVISIBILITY_DIRECTION": return "Divide the designated multiple by the other entry and look for a zero remainder.";
    case "PAIR_PRIME_ABSOLUTE_DIFFERENCE": return "Subtract the smaller number from the larger, then test only that difference for primality.";
    case "PAIR_DIGIT_PERMUTATION": return "Sort the digits of both numbers, then exclude a mere full reversal.";
    case "TRIPLE_UNORDERED_ARITHMETIC_SET": return "Sort the three values before comparing the two gaps.";
    case "TRIPLE_ALL_PRIME": return "Check each entry for primality; stop as soon as one composite number appears.";
    case "TRIPLE_SAME_DIGIT_MULTISET": return "Sort the digits inside each number and compare the three resulting digit strings.";
    case "QUADRUPLE_REDUCED_RATIO_VECTOR": return "Divide all four positions by their common factor and compare the reduced vectors.";
  }
}

function trap(ruleId: ClsCp005SourceGapRuleId): string {
  if (ruleId.includes("DIRECTION") || ruleId.startsWith("PAIR_AFFINE")) return "Keep the displayed direction fixed; a true reverse relation is a different signature.";
  if (ruleId.includes("DIGIT")) return "Use the complete digit multiset; do not compare only one matching digit or ignore repeated digits.";
  if (ruleId.includes("PRIME")) return "Prime-looking odd numbers may still be composite; verify divisibility before classifying.";
  return "Apply one complete rule to every option; do not invent a separate formula for the outlier.";
}

function stems(task: ClsCp005Wave2Task, arity: 2 | 3 | 4, reference: ClsCp005SourceGapTuple | null): readonly string[] {
  const noun = arity === 2 ? "pair" : arity === 3 ? "group of three numbers" : "group of four numbers";
  if (task === "FIND_ODD_NUMBER_TUPLE") {
    return [
      `Which ${noun} follows a different rule?`,
      `Find the odd ${noun}.`,
      `Select the ${noun} that does not fit the common relation.`,
      `Which ${noun} is different from the others?`,
      `Choose the ${noun} whose numbers are related differently.`,
    ];
  }
  const display = displayTuple(reference!);
  return [
    `Study ${display}. Which ${noun} follows the same rule?`,
    `Which option has the same internal relation as ${display}?`,
    `Select the ${noun} that matches the rule used in ${display}.`,
    `Find the option related in the same way as ${display}.`,
    `Which ${noun} belongs with ${display} under the same number rule?`,
  ];
}

function difficulty(ruleId: ClsCp005SourceGapRuleId, arity: 2 | 3 | 4, optionCount: 4 | 5, reference: boolean, tuples: readonly ClsCp005SourceGapTuple[]): ClsCp005Wave2Difficulty {
  const maximum = Math.max(...tuples.flatMap((tuple) => [...tuple]));
  const highDemand = [
    "PAIR_SQUARE_CUBE_DIRECTION", "PAIR_CONSECUTIVE_CUBES_DIRECTION", "PAIR_REVERSED_CUBE_DIRECTION",
    "PAIR_CUBE_MINUS_ONE_DIRECTION", "TRIPLE_SAME_DIGIT_MULTISET", "QUADRUPLE_REDUCED_RATIO_VECTOR",
  ].includes(ruleId);
  const score = (arity - 2) + (optionCount === 5 ? 1 : 0) + (reference ? 1 : 0) + (maximum >= 200 ? 1 : 0) + (highDemand ? 2 : 0);
  return score <= 1 ? "EASY" : score <= 3 ? "MEDIUM" : "HARD";
}

export type GeneratedClsCp005Wave2Question = {
  readonly checkpointId: "CLS-CP-005";
  readonly wave: "SOURCE_GAP_WAVE_2";
  readonly prototypeId: ClsCp005Wave2PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly task: ClsCp005Wave2Task;
  readonly arity: 2 | 3 | 4;
  readonly stem: string;
  readonly referenceTuple: ClsCp005SourceGapTuple | null;
  readonly tuples: readonly ClsCp005SourceGapTuple[];
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly intendedRuleId: ClsCp005SourceGapRuleId;
  readonly intendedRuleValue: string;
  readonly evidenceByOption: readonly string[];
  readonly expandedAmbiguityAudit: ClsCp005ExpandedAudit;
  readonly difficulty: ClsCp005Wave2Difficulty;
  readonly explanation: {
    readonly coreConcept: readonly string[];
    readonly stepByStep: readonly string[];
    readonly examSpeedShortcut: readonly string[];
    readonly commonTrapWarning: readonly string[];
  };
  readonly metadata: {
    readonly runtimeVersion: "cls-cp005-source-gap-wave2-v1";
    readonly editorialVersion: "cls-cp005-option-explanations-v3-simple-teacher";
    readonly sourceGapRegistryVersion: "cls-cp005-source-gap-registry-v1";
    readonly locale: "en-IN";
    readonly optionCount: 4 | 5;
    readonly sourceAttempt: number;
    readonly sourceSaturationStatus: "WAVE_2_EXECUTABLE__FINAL_GAP_AUDIT_OPEN";
  };
  readonly reviewOnly: true;
  readonly questionStudioVisible: false;
  readonly lifecycle: {
    readonly permanentQlId: null;
    readonly reviewStatus: "UNREVIEWED_DISCOVERY";
    readonly questionBankStatus: "NOT_STORED";
    readonly testEligibility: "INELIGIBLE";
    readonly publiclyPublishable: false;
    readonly questionStudioDiscoverable: false;
  };
};

export function generateClsCp005Wave2Question(
  prototypeId: ClsCp005Wave2PrototypeId,
  seed = 0,
  requestedOptionCount?: 4 | 5,
): GeneratedClsCp005Wave2Question {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  const prototype = PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS-CP-005 Wave 2 prototype: ${prototypeId}`);
  const optionCount = requestedOptionCount ?? (hashText(`${prototypeId}:options:${seed}`) % 4 === 0 ? 5 : 4);
  const ruleId = prototype.allowedRuleIds[hashText(`${prototypeId}:rule:${seed}`) % prototype.allowedRuleIds.length]!;
  const state = constructState(prototype, ruleId, seed, optionCount);
  const options = state.tuples.map(displayTuple);
  const answer = options[state.correctIndex]!;
  const evidenceByOption = state.tuples.map((tuple) => explainTuple(tuple, ruleId, state.intendedRuleValue));
  const stemOptions = stems(prototype.task, prototype.arity, state.referenceTuple);
  const stem = stemOptions[hashText(`${prototypeId}:stem:${seed}`) % stemOptions.length]!;
  const referenceEvidence = state.referenceTuple
    ? explainTuple(state.referenceTuple, ruleId, state.intendedRuleValue).replace("— ✅ Matches rule.", "— establishes the reference rule.")
    : null;
  const commonOptions = options.filter((_, index) => index !== state.correctIndex);

  return {
    checkpointId: "CLS-CP-005",
    wave: "SOURCE_GAP_WAVE_2",
    prototypeId,
    permanentQlId: null,
    seed,
    task: prototype.task,
    arity: prototype.arity,
    stem,
    referenceTuple: state.referenceTuple,
    tuples: state.tuples,
    options,
    correctIndex: state.correctIndex,
    answer,
    intendedRuleId: ruleId,
    intendedRuleValue: state.intendedRuleValue,
    evidenceByOption,
    expandedAmbiguityAudit: state.audit,
    difficulty: difficulty(ruleId, prototype.arity, optionCount, state.referenceTuple !== null, state.tuples),
    explanation: {
      coreConcept: [ruleStatement(ruleId, state.intendedRuleValue)],
      stepByStep: prototype.task === "SELECT_EQUIVALENT_NUMBER_SET"
        ? [
            `Reference ${referenceEvidence}`,
            `Only ${answer} repeats that exact relation under the same positional roles.`,
            `Therefore, ${answer} is correct.`,
          ]
        : [
            "Apply the same complete rule to every option.",
            `${commonOptions.join(", ")} follow the common relation, while ${answer} fails it.`,
            `Therefore, ${answer} is the odd option.`,
          ],
      examSpeedShortcut: [shortcut(ruleId)],
      commonTrapWarning: [trap(ruleId)],
    },
    metadata: {
      runtimeVersion: "cls-cp005-source-gap-wave2-v1",
      editorialVersion: "cls-cp005-option-explanations-v3-simple-teacher",
      sourceGapRegistryVersion: "cls-cp005-source-gap-registry-v1",
      locale: "en-IN",
      optionCount,
      sourceAttempt: state.sourceAttempt,
      sourceSaturationStatus: "WAVE_2_EXECUTABLE__FINAL_GAP_AUDIT_OPEN",
    },
    reviewOnly: true,
    questionStudioVisible: false,
    lifecycle: {
      permanentQlId: null,
      reviewStatus: "UNREVIEWED_DISCOVERY",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
  };
}

export const CLS_CP005_WAVE2_VALID_COUNTS = Object.fromEntries(
  [...VALID_BY_RULE.entries()].map(([ruleId, tuples]) => [ruleId, tuples.length]),
) as Readonly<Record<ClsCp005SourceGapRuleId, number>>;
