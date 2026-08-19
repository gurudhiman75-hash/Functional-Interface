import { mod } from "./common.ts";
import { generateNumCp008Wave04Package as generateSource } from "./runtime.ts";
import type { NumCp008Wave04Package, NumCp008Wave04PrototypeId } from "./types.ts";

interface Constraint {
  readonly residue: number;
  readonly modulus: number;
}

function gcdLocal(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function lcmLocal(a: number, b: number): number {
  return Math.abs((a / gcdLocal(a, b)) * b);
}

function mergeStep(currentResidue: number, currentPeriod: number, next: Constraint): { text: string; residue: number; period: number } | null {
  const g = gcdLocal(currentPeriod, next.modulus);
  if (mod(next.residue - currentResidue, g) !== 0) return null;

  let k = 0;
  while (k < next.modulus && mod(currentResidue + currentPeriod * k, next.modulus) !== mod(next.residue, next.modulus)) k += 1;
  if (k >= next.modulus) throw new Error("Compatible merge did not yield a bounded k witness");

  const period = lcmLocal(currentPeriod, next.modulus);
  const raw = currentResidue + currentPeriod * k;
  const residue = mod(raw, period);
  const difference = next.residue - currentResidue;
  const text = `Write $x=${currentResidue}+${currentPeriod}k$. The next condition gives $${currentPeriod}k \\equiv ${difference} \\pmod{${next.modulus}}$; the least $k$ that works is $${k}$, so $x=${raw}$ and hence $x \\equiv ${residue} \\pmod{${period}}$.`;
  return { text, residue, period };
}

function incompatibilityStep(constraints: readonly Constraint[]): string {
  let currentResidue = mod(constraints[0]!.residue, constraints[0]!.modulus);
  let currentPeriod = constraints[0]!.modulus;

  for (const next of constraints.slice(1)) {
    const g = gcdLocal(currentPeriod, next.modulus);
    if (mod(next.residue - currentResidue, g) !== 0) {
      return `For compatibility, the two residues must agree modulo $\\gcd(${currentPeriod},${next.modulus})=${g}$. Here $${currentResidue} \\equiv ${mod(currentResidue, g)} \\pmod{${g}}$ but $${next.residue} \\equiv ${mod(next.residue, g)} \\pmod{${g}}$, so these conditions cannot hold together.`;
    }
    const merged = mergeStep(currentResidue, currentPeriod, next);
    if (!merged) throw new Error("Unexpected incompatible merge");
    currentResidue = merged.residue;
    currentPeriod = merged.period;
  }
  throw new Error("Expected an incompatible stage");
}

function compatibleMergeSteps(constraints: readonly Constraint[]): readonly string[] {
  let currentResidue = mod(constraints[0]!.residue, constraints[0]!.modulus);
  let currentPeriod = constraints[0]!.modulus;
  const steps: string[] = [];
  for (const next of constraints.slice(1)) {
    const merged = mergeStep(currentResidue, currentPeriod, next);
    if (!merged) throw new Error("Expected compatible system");
    steps.push(merged.text);
    currentResidue = merged.residue;
    currentPeriod = merged.period;
  }
  return steps;
}

function multiplicitySteps(q: NumCp008Wave04Package): readonly string[] {
  const state = q.hiddenState as Readonly<Record<string, unknown>>;
  const constraints = state.constraints as readonly Constraint[];
  const lower = Number(state.lower);
  const upper = Number(state.upper);
  const solutions = state.canonicalSolutions as readonly number[];
  const merged = state.merged as { residue: number; period: number } | null;

  if (!merged) {
    return [
      incompatibilityStep(constraints),
      `Therefore there is no common residue class, so the interval $[${lower},${upper}]$ contains no solution.`,
    ];
  }

  const mergeSteps = compatibleMergeSteps(constraints);
  const set = `{${solutions.join(", ")}}`;
  return [
    ...mergeSteps,
    `The final class is $x \\equiv ${merged.residue} \\pmod{${merged.period}}$. In $[${lower},${upper}]$ it gives ${set}, so there ${solutions.length === 1 ? "is exactly 1 solution" : `are ${solutions.length} solutions`}.`,
  ];
}

function tripleSetSteps(q: NumCp008Wave04Package): readonly string[] {
  const state = q.hiddenState as Readonly<Record<string, unknown>>;
  const constraints = state.constraints as readonly Constraint[];
  const lower = Number(state.lower);
  const upper = Number(state.upper);
  const solutions = state.canonicalSolutions as readonly number[];
  const merged = state.merged as { residue: number; period: number };
  const mergeSteps = compatibleMergeSteps(constraints);
  return [
    ...mergeSteps,
    `So the common class is $x \\equiv ${merged.residue} \\pmod{${merged.period}}$. Its members in $[${lower},${upper}]$ are $\\{${solutions.join(", ")}\\}$, and these are all the required integers.`,
  ];
}

export function generateNumCp008Wave04Reviewed(prototypeId: NumCp008Wave04PrototypeId, seed: number): NumCp008Wave04Package {
  const q = generateSource(prototypeId, seed);
  const steps = prototypeId === "NUM-CP008-PROT-025" ? multiplicitySteps(q) : tripleSetSteps(q);
  return {
    ...q,
    explanation: {
      ...q.explanation,
      steps,
    },
  };
}
