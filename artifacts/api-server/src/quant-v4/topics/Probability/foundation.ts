import prb001Registry from "./PRB-001/task-registry.library.json";
import prb002Registry from "./PRB-002/task-registry.library.json";

export const PRB_001_PACKAGE_ID = "PRB-001" as const;
export const PRB_002_PACKAGE_ID = "PRB-002" as const;
export const PRB_001_CP_IDS = ["PRB-CP-001", "PRB-CP-002", "PRB-CP-003", "PRB-CP-004", "PRB-CP-005"] as const;
export const PRB_002_CP_IDS = ["PRB-CP-006", "PRB-CP-007", "PRB-CP-008", "PRB-CP-009"] as const;
export type Prb001CanonicalProblemId = (typeof PRB_001_CP_IDS)[number];
export type Prb002CanonicalProblemId = (typeof PRB_002_CP_IDS)[number];
export type PackageId = typeof PRB_001_PACKAGE_ID | typeof PRB_002_PACKAGE_ID;
export type CpId = Prb001CanonicalProblemId | Prb002CanonicalProblemId;
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Input = { difficulty?: Difficulty; difficultyBand?: Difficulty; language?: "en" | "hi" | "pa"; questionLanguageId?: string; seed?: string };
export type Rat = { n: bigint; d: bigint };
export type Answer = { kind: "probability"; value: Rat } | { kind: "count"; value: bigint };
export type Case = {
  stem: string; answer: Answer; equation: string; operation: string;
  total?: bigint; favourable?: bigint; formulaCount?: bigint; enumerationCount?: bigint;
  givens: Record<string, string | number | boolean>; explanation: string[]; verification: string;
};
export type Registry = {
  packageId: PackageId; cpId: CpId; start: number; count: number;
  solveModes: string[]; taskKinds: string[]; difficultyAllocation: { easyUntil: number; mediumUntil: number };
};
export type Entry = Registry & { qlId: string; solveMode: string; taskKind: string; difficulty: Difficulty };

const registries = [...(prb001Registry.groups as Registry[]), ...(prb002Registry.groups as Registry[])];
export const entries: Entry[] = registries.flatMap((group) => Array.from({ length: group.count }, (_, index) => {
  const fraction = (index + 0.5) / group.count;
  const difficulty: Difficulty = fraction < group.difficultyAllocation.easyUntil ? "Easy" : fraction < group.difficultyAllocation.mediumUntil ? "Medium" : "Hard";
  return {
    ...group,
    qlId: `PRB-QL-${String(group.start + index).padStart(3, "0")}`,
    solveMode: group.solveModes[index % group.solveModes.length]!,
    taskKind: group.taskKinds[index % group.taskKinds.length]!,
    difficulty,
  };
}));
if (entries.length !== 216 || new Set(entries.map((entry) => entry.qlId)).size !== 216) throw new Error("Probability registry must expose 216 unique QLs");

function gcd(a: bigint, b: bigint): bigint { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a || 1n; }
export function rat(n: bigint | number, d: bigint | number = 1n): Rat { let x = BigInt(n), y = BigInt(d); if (!y) throw new Error("zero denominator"); if (y < 0n) { x = -x; y = -y; } const g = gcd(x, y); return { n: x / g, d: y / g }; }
export function add(a: Rat, b: Rat) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
export function sub(a: Rat, b: Rat) { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
export function mul(a: Rat, b: Rat) { return rat(a.n * b.n, a.d * b.d); }
export function comp(a: Rat) { return sub(rat(1), a); }
export function text(a: Rat) { return a.d === 1n ? String(a.n) : `${a.n}/${a.d}`; }
export function math(a: Rat) { return a.d === 1n ? String(a.n) : `\\frac{${a.n}}{${a.d}}`; }
export function choose(n: number, r: number): bigint { if (r < 0 || r > n) return 0n; r = Math.min(r, n - r); let x = 1n, y = 1n; for (let i = 1; i <= r; i++) { x *= BigInt(n - r + i); y *= BigInt(i); } return x / y; }
export function perm(n: number, r: number): bigint { let out = 1n; for (let i = 0; i < r; i++) out *= BigInt(n - i); return out; }
export function fact(n: number): bigint { return perm(n, n); }
export function hash(seed: string) { let h = 2166136261; for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function rng(seed: string) { let s = hash(seed) || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
export function int(random: () => number, min: number, max: number) { return min + Math.floor(random() * (max - min + 1)); }
export function pick<T>(random: () => number, values: readonly T[]) { return values[Math.floor(random() * values.length)]!; }
export function shuffle<T>(random: () => number, values: readonly T[]) { const out = [...values]; for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }
export function prob(stem: string, value: Rat, equation: string, operation: string, total: bigint | undefined, favourable: bigint | undefined, explanation: string[], givens: Case["givens"], verification: string, formulaCount?: bigint, enumerationCount?: bigint): Case {
  return { stem, answer: { kind: "probability", value }, equation, operation, total, favourable, explanation, givens, verification, formulaCount, enumerationCount };
}
export function count(stem: string, value: bigint, equation: string, operation: string, total: bigint | undefined, explanation: string[], givens: Case["givens"], verification: string): Case {
  return { stem, answer: { kind: "count", value }, equation, operation, total, favourable: value, explanation, givens, verification };
}
export function directExplanation(total: bigint, favourable: bigint, value: Rat, noun = "outcomes") {
  return [`The ${noun} are equally likely, so probability is favourable outcomes divided by total outcomes.`, `There are ${favourable} favourable outcomes out of ${total}.`, `Therefore P = ${favourable}/${total}.`, `Reducing the exact fraction gives ${text(value)}.`];
}
