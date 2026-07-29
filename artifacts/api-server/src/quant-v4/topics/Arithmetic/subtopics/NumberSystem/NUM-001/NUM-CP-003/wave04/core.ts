import type { DeterministicRandom } from "../../foundation/prng";
import type {
  DivisibilityRuleId,
  NumReasoningNode,
  Wave04MisconceptionId,
  Wave04OptionAudit,
} from "./types";

export const RULES: ReadonlyArray<{
  ruleId: DivisibilityRuleId;
  divisor: bigint;
  ruleText: string;
  misconceptionId: Wave04MisconceptionId;
}> = [
  { ruleId: "LAST_DIGIT_EVEN", divisor: 2n, ruleText: "Its last digit is even.", misconceptionId: "CONFUSED_LAST_DIGIT_RULE" },
  { ruleId: "LAST_DIGIT_ZERO_OR_FIVE", divisor: 5n, ruleText: "Its last digit is 0 or 5.", misconceptionId: "CONFUSED_LAST_DIGIT_RULE" },
  { ruleId: "DIGIT_SUM_MULTIPLE_OF_THREE", divisor: 3n, ruleText: "The sum of its digits is divisible by 3.", misconceptionId: "CONFUSED_DIGIT_SUM_RULE" },
  { ruleId: "DIGIT_SUM_MULTIPLE_OF_NINE", divisor: 9n, ruleText: "The sum of its digits is divisible by 9.", misconceptionId: "CONFUSED_DIGIT_SUM_RULE" },
  { ruleId: "LAST_TWO_DIGITS_MULTIPLE_OF_FOUR", divisor: 4n, ruleText: "The number formed by its last two digits is divisible by 4.", misconceptionId: "CONFUSED_LAST_TWO_DIGITS_RULE" },
  { ruleId: "LAST_TWO_DIGITS_MULTIPLE_OF_TWENTY_FIVE", divisor: 25n, ruleText: "The number formed by its last two digits is divisible by 25.", misconceptionId: "CONFUSED_LAST_TWO_DIGITS_RULE" },
  { ruleId: "LAST_THREE_DIGITS_MULTIPLE_OF_EIGHT", divisor: 8n, ruleText: "The number formed by its last three digits is divisible by 8.", misconceptionId: "CONFUSED_LAST_THREE_DIGITS_RULE" },
  { ruleId: "ALTERNATING_SUM_MULTIPLE_OF_ELEVEN", divisor: 11n, ruleText: "The difference between the sums of alternate digits is a multiple of 11.", misconceptionId: "CONFUSED_ALTERNATING_SUM_RULE" },
];

export function audit(text: string, misconceptionId: Wave04MisconceptionId, diagnostic: string): Wave04OptionAudit {
  return { text, misconceptionId, diagnostic };
}

export function shuffle(random: DeterministicRandom, candidates: readonly Wave04OptionAudit[]): { rows: Wave04OptionAudit[]; correctIndex: number } {
  const unique = new Map<string, Wave04OptionAudit>();
  for (const candidate of candidates) if (!unique.has(candidate.text)) unique.set(candidate.text, candidate);
  if (unique.size !== 4) throw new Error(`Expected four unique options, received ${unique.size}`);
  const rows = random.shuffle([...unique.values()]);
  const correctIndex = rows.findIndex((row) => row.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("Correct option is missing");
  return { rows, correctIndex };
}

export function pairText(pair: readonly [number, number]): string {
  return `(${pair[0]}, ${pair[1]})`;
}

export function pairSetText(pairs: ReadonlyArray<readonly [number, number]>): string {
  return `{${pairs.map(pairText).join(", ")}}`;
}

export function nodes(given: string, rule: string, derivation: string, verification: string, conclusion: string): NumReasoningNode[] {
  return [
    { id: "given", kind: "GIVEN", text: given, dependsOn: [] },
    { id: "rule", kind: "RULE", text: rule, dependsOn: ["given"] },
    { id: "derive", kind: "DERIVATION", text: derivation, dependsOn: ["rule"] },
    { id: "verify", kind: "VERIFICATION", text: verification, dependsOn: ["derive"] },
    { id: "conclusion", kind: "CONCLUSION", text: conclusion, dependsOn: ["verify"] },
  ];
}

export function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

export function lcm(a: bigint, b: bigint): bigint {
  return a / gcd(a, b) * b;
}

export function lcm3(a: bigint, b: bigint, c: bigint): bigint {
  return lcm(lcm(a, b), c);
}

export function countMultiples(lower: bigint, upper: bigint, divisor: bigint): bigint {
  return upper / divisor - (lower - 1n) / divisor;
}
