import type { DeterministicRandom } from "../../foundation/prng";
import type {
  NumDifficulty,
  NumReasoningNode,
  Wave03AnswerSemantic,
  Wave03Explanation,
  Wave03HiddenState,
  Wave03MisconceptionId,
  Wave03OptionAudit,
} from "./types";

export interface Raw {
  hiddenState: Wave03HiddenState;
  difficulty: NumDifficulty;
  answerSemantic: Wave03AnswerSemantic;
  stem: string;
  answer: string;
  options: Wave03OptionAudit[];
  explanation: Wave03Explanation;
  nodes: NumReasoningNode[];
  fingerprint: string;
}

export const DIVISORS = [3n, 4n, 5n, 6n, 7n, 8n, 9n, 11n, 12n, 13n, 15n, 16n, 18n, 24n, 25n, 27n, 36n, 45n] as const;
export const PAIR_DIVISORS: ReadonlyArray<readonly [bigint, bigint]> = [
  [8n, 9n], [8n, 11n], [9n, 11n], [11n, 12n], [11n, 18n], [12n, 25n], [16n, 9n], [25n, 11n], [8n, 13n],
];

export function audit(text: string, misconceptionId: Wave03MisconceptionId, diagnostic: string): Wave03OptionAudit {
  return { text, misconceptionId, diagnostic };
}

export function shuffle(random: DeterministicRandom, candidates: readonly Wave03OptionAudit[]): { rows: Wave03OptionAudit[]; correctIndex: number } {
  const unique = new Map<string, Wave03OptionAudit>();
  for (const candidate of candidates) if (!unique.has(candidate.text)) unique.set(candidate.text, candidate);
  if (unique.size !== 4) throw new Error(`Expected four unique options, got ${unique.size}`);
  const rows = random.shuffle([...unique.values()]);
  const correctIndex = rows.findIndex((row) => row.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("Correct option missing");
  return { rows, correctIndex };
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

export function pairText(pair: readonly [number, number]): string {
  return `(${pair[0]}, ${pair[1]})`;
}

export function countMultiples(lower: bigint, upper: bigint, divisor: bigint): bigint {
  return upper / divisor - (lower - 1n) / divisor;
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
