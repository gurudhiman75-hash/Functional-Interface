import { fillSingleDigit } from "../../foundation/divisibility";
import type { DeterministicRandom } from "../../foundation/prng";
import type {
  NumReasoningNode,
  Wave05MisconceptionId,
  Wave05OptionAudit,
} from "./types";

export function audit(
  text: string,
  misconceptionId: Wave05MisconceptionId,
  diagnostic: string,
): Wave05OptionAudit {
  return { text, misconceptionId, diagnostic };
}

export function shuffle(
  random: DeterministicRandom,
  candidates: readonly Wave05OptionAudit[],
): { rows: Wave05OptionAudit[]; correctIndex: number } {
  const unique = new Map<string, Wave05OptionAudit>();
  for (const candidate of candidates) if (!unique.has(candidate.text)) unique.set(candidate.text, candidate);
  if (unique.size !== 4) throw new Error(`Expected four unique options, received ${unique.size}`);
  const rows = random.shuffle([...unique.values()]);
  const correctIndex = rows.findIndex((row) => row.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("Correct option is missing");
  return { rows, correctIndex };
}

export function nodes(
  given: string,
  rule: string,
  derivation: string,
  verification: string,
  conclusion: string,
): NumReasoningNode[] {
  return [
    { id: "given", kind: "GIVEN", text: given, dependsOn: [] },
    { id: "rule", kind: "RULE", text: rule, dependsOn: ["given"] },
    { id: "derive", kind: "DERIVATION", text: derivation, dependsOn: ["rule"] },
    { id: "verify", kind: "VERIFICATION", text: verification, dependsOn: ["derive"] },
    { id: "conclusion", kind: "CONCLUSION", text: conclusion, dependsOn: ["verify"] },
  ];
}

export function setText(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

export function pairText(pair: readonly [number, number]): string {
  return `(${pair[0]}, ${pair[1]})`;
}

export function pairSetText(pairs: ReadonlyArray<readonly [number, number]>): string {
  return `{${pairs.map(pairText).join(", ")}}`;
}

export function completedNumber(template: string, digit: number): bigint {
  const numeral = fillSingleDigit(template, digit);
  if (numeral.startsWith("0")) throw new Error("Completed number cannot start with zero");
  return BigInt(numeral);
}

export function difficultyFor(divisor: bigint, templateLength: number, candidateCount: number): "Easy" | "Medium" | "Hard" {
  const primitive = [3n, 4n, 5n, 8n, 9n, 11n, 25n].includes(divisor);
  if (primitive && templateLength <= 4 && candidateCount <= 3) return "Easy";
  if (!primitive && templateLength >= 6) return "Hard";
  if (candidateCount >= 4 && templateLength >= 5) return "Hard";
  return "Medium";
}

export function relationText(delta: number): string {
  if (delta > 0) return `B = A + ${delta}`;
  return `B = A - ${Math.abs(delta)}`;
}
