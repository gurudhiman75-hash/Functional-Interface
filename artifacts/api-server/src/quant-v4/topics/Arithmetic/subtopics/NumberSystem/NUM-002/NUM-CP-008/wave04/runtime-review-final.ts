import { mod } from "./common.ts";
import { generateNumCp008Wave04Package as generateSource } from "./runtime.ts";
import type { NumCp008Option, NumCp008Wave04Package, NumCp008Wave04PrototypeId } from "./types.ts";

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

function inverseLocal(a: number, modulus: number): number {
  if (modulus === 1) return 0;
  for (let candidate = 1; candidate < modulus; candidate += 1) {
    if (mod(a * candidate, modulus) === 1) return candidate;
  }
  throw new Error(`No inverse for ${a} modulo ${modulus}`);
}

function mergeStep(currentResidue: number, currentPeriod: number, next: Constraint): { text: string; residue: number; period: number } | null {
  const g = gcdLocal(currentPeriod, next.modulus);
  const difference = next.residue - currentResidue;
  if (mod(difference, g) !== 0) return null;

  const reducedPeriod = currentPeriod / g;
  const reducedDifference = difference / g;
  const reducedModulus = next.modulus / g;
  const coefficient = reducedModulus === 1 ? 0 : mod(reducedPeriod, reducedModulus);
  const rhs = reducedModulus === 1 ? 0 : mod(reducedDifference, reducedModulus);
  const inverse = reducedModulus === 1 ? 0 : inverseLocal(coefficient, reducedModulus);
  const k = reducedModulus === 1 ? 0 : mod(inverse * rhs, reducedModulus);

  const period = lcmLocal(currentPeriod, next.modulus);
  const raw = currentResidue + currentPeriod * k;
  const residue = mod(raw, period);
  const reductionText = reducedModulus === 1
    ? `After dividing by $g=${g}$, the second condition adds no new restriction on $k$, so take $k=0$.`
    : `After dividing by $g=${g}$ and reducing, $${coefficient}k \\equiv ${rhs} \\pmod{${reducedModulus}}$. Since $${coefficient}^{-1} \\equiv ${inverse} \\pmod{${reducedModulus}}$, $k \\equiv ${inverse}\\times${rhs} \\equiv ${k} \\pmod{${reducedModulus}}$.`;
  const text = `Write $x=${currentResidue}+${currentPeriod}k$. The next condition gives $${currentPeriod}k \\equiv ${difference} \\pmod{${next.modulus}}$. ${reductionText} Taking the least non-negative $k=${k}$ gives $x=${raw}$, hence $x \\equiv ${residue} \\pmod{${period}}$.`;
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

function setText(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

function replaceWeakTripleSetDistractor(q: NumCp008Wave04Package): readonly NumCp008Option[] {
  if (q.temporaryPrototypeId !== "NUM-CP008-PROT-026") return q.options;
  const state = q.hiddenState as Readonly<Record<string, unknown>>;
  const constraints = state.constraints as readonly Constraint[];
  const lower = Number(state.lower);
  const upper = Number(state.upper);
  const solutions = state.canonicalSolutions as readonly number[];
  const solutionSet = new Set(solutions);

  let bestValue: number | null = null;
  let bestScore = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let value = lower; value <= upper; value += 1) {
    if (solutionSet.has(value)) continue;
    const score = constraints.filter((constraint) => mod(value, constraint.modulus) === mod(constraint.residue, constraint.modulus)).length;
    const distance = Math.min(...solutions.map((solution) => Math.abs(solution - value)));
    if (score > bestScore || (score === bestScore && distance < bestDistance)) {
      bestValue = value;
      bestScore = score;
      bestDistance = distance;
    }
  }
  if (bestValue === null || bestScore < 2) throw new Error("Could not construct a two-of-three in-range near-miss distractor");

  const nearMissSet = [...solutions];
  nearMissSet[nearMissSet.length - 1] = bestValue;
  nearMissSet.sort((a, b) => a - b);
  const replacementValue = setText(nearMissSet);

  return q.options.map((option) => option.misconceptionId === "SHIFTED_ONE_PERIOD_TOO_FAR"
    ? { ...option, value: replacementValue, misconceptionId: "SATISFIES_ONLY_TWO_CONGRUENCES" }
    : option);
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
    options: replaceWeakTripleSetDistractor(q),
    explanation: {
      ...q.explanation,
      steps,
    },
  };
}
