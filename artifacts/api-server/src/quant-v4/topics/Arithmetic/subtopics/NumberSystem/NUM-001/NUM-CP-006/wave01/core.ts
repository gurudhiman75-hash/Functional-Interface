import type { NumCp006Difficulty, NumCp006Explanation, NumCp006Option, NumCp006Wave01Package } from "./types.ts";
export interface Rng { next(): number; int(min: number, max: number): number; pick<T>(values: readonly T[]): T; }
export function createRng(seed: number): Rng {
  let state = seed >>> 0; const next = () => { state += 0x6d2b79f5; let t = state; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  return { next, int: (min, max) => min + Math.floor(next() * (max - min + 1)), pick: <T>(v: readonly T[]) => v[Math.floor(next() * v.length)]! };
}
const abs = (n: bigint) => n < 0n ? -n : n;
export function gcd(a: bigint, b: bigint): bigint { let x = abs(a), y = abs(b); while (y) [x, y] = [y, x % y]; return x; }
export function lcm(a: bigint, b: bigint): bigint { return a === 0n || b === 0n ? 0n : abs(a / gcd(a, b) * b); }
export const gcdMany = (v: readonly bigint[]) => v.reduce((a, b) => gcd(a, b));
export const lcmMany = (v: readonly bigint[]) => v.reduce((a, b) => lcm(a, b), 1n);
function factors(n: bigint): Map<bigint, number> { let x = abs(n), d = 2n; const m = new Map<bigint, number>(); while (d * d <= x) { while (x % d === 0n) { m.set(d, (m.get(d) ?? 0) + 1); x /= d; } d += d === 2n ? 1n : 2n; } if (x > 1n) m.set(x, 1); return m; }
export const factorText = (n: bigint) => [...factors(n)].map(([p, e]) => e === 1 ? `${p}` : `${p}^{${e}}`).join(" \\times ") || `${n}`;
export const smallestPrime = (n: bigint) => factors(n).keys().next().value as bigint | undefined ?? 1n;
function primeLoad(v: readonly bigint[]) { return v.reduce((s, n) => s + factors(n).size, 0); }
export function difficulty(values: readonly bigint[], flags: { inverse?: boolean; pair?: boolean; application?: boolean } = {}): NumCp006Difficulty {
  const max = Math.max(...values.map(Number)); let score = max > 120 ? 1 : 0; if (max > 900) score++; if (values.length >= 3) score++; if (primeLoad(values) >= 7) score++; if (flags.inverse) score++; if (flags.pair) score++; if (flags.application && values.length >= 3) score++;
  return score <= 1 ? "EASY" : score <= 3 ? "MEDIUM" : "HARD";
}
export function shuffle<T>(v: readonly T[], rng: Rng): T[] { const a = [...v]; for (let i = a.length - 1; i > 0; i--) { const j = rng.int(0, i); [a[i], a[j]] = [a[j]!, a[i]!]; } return a; }
export interface WrongNumber { value: bigint; id: string; analysis: string; }
export function numericOptions(answer: bigint, candidates: readonly WrongNumber[], rng: Rng, suffix = "") {
  const seen = new Set([`${answer}`]); const wrong: WrongNumber[] = [];
  for (const c of candidates) { if (c.value <= 0n || seen.has(`${c.value}`)) continue; seen.add(`${c.value}`); wrong.push(c); if (wrong.length === 3) break; }
  for (let k = 1n; wrong.length < 3; k++) if (!seen.has(`${answer + k}`)) wrong.push({ value: answer + k, id: "UNVERIFIED_NEARBY", analysis: "This nearby value does not satisfy all required conditions." });
  const options = shuffle<NumCp006Option>([
    { value: `${answer}${suffix}`, isCorrect: true, misconceptionId: "CORRECT", analysis: "This satisfies the complete condition." },
    ...wrong.map(c => ({ value: `${c.value}${suffix}`, isCorrect: false, misconceptionId: c.id, analysis: c.analysis })),
  ], rng);
  return { options, correctIndex: options.findIndex(o => o.isCorrect), canonicalAnswer: `${answer}${suffix}` };
}
export const explanation = (coreConcept: string, strategy: string, steps: readonly string[], speed: string, answer: string, traps: readonly string[]): NumCp006Explanation => ({ coreConcept, givenDataAndStrategy: strategy, stepByStep: steps, examSpeedMethod: speed, commonTraps: traps, finalAnswer: `Final answer: ${answer}` });
export function base(input: Omit<NumCp006Wave01Package, "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle">): NumCp006Wave01Package {
  return { packageId: "NUM-001", checkpointId: "NUM-CP-006", permanentQlId: null, locale: "en-IN", ...input, lifecycle: { permanentQlId: null, maturity: "EXECUTABLE_DISCOVERY_PROOF", reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE", questionBankStatus: "NOT_STORED", testEligibility: "INELIGIBLE", active: false, questionStudioDiscoverable: false, questionBankWritable: false, testEligible: false, publiclyPublishable: false } };
}
const PAIRS = [[2n,3n],[3n,5n],[4n,5n],[5n,7n],[7n,8n],[8n,9n],[9n,10n],[11n,12n],[13n,15n],[16n,21n],[17n,24n],[25n,28n]] as const;
const TRIPLES = [[2n,3n,5n],[3n,4n,5n],[4n,6n,9n],[5n,8n,9n],[8n,9n,15n],[4n,9n,25n],[6n,8n,25n],[10n,12n,21n],[8n,15n,21n],[9n,14n,20n],[12n,25n,28n],[16n,21n,25n]] as const;
export function makePair(rng: Rng): readonly [bigint,bigint,bigint] { const t = rng.pick([0,1,2]); const g = BigInt(t === 0 ? rng.int(2,8) : t === 1 ? rng.int(9,24) : rng.int(25,60)); const p = rng.pick(t === 0 ? PAIRS.slice(0,5) : t === 1 ? PAIRS.slice(4,9) : PAIRS.slice(8)); return [g*p[0], g*p[1], g]; }
export function makeTriple(rng: Rng): readonly [bigint,bigint,bigint,bigint] { const t = rng.pick([0,1,2]); const g = BigInt(t === 0 ? rng.int(1,4) : t === 1 ? rng.int(5,12) : rng.int(13,30)); const p = rng.pick(t === 0 ? TRIPLES.slice(0,4) : t === 1 ? TRIPLES.slice(3,8) : TRIPLES.slice(7)); return [g*p[0], g*p[1], g*p[2], g]; }
export const sources = (family: string) => [family, "NUMBER-SYSTEM-DESIGN-CP006"] as const;
