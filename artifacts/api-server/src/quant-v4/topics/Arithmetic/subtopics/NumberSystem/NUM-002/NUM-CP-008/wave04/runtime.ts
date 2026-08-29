import {
  base,
  classifyCount,
  createRng,
  crtMany,
  lcm,
  mod,
  setText,
  solutionsInRange,
  sources,
  systemSolutions,
  textOptions,
} from "./common.ts";
import type { NumCp008Wave04Package, NumCp008Wave04PrototypeId } from "./types.ts";

interface Constraint {
  readonly residue: number;
  readonly modulus: number;
}

const MODULUS_TRIPLES = [
  [4, 6, 9],
  [5, 8, 9],
  [6, 8, 15],
  [7, 9, 10],
] as const;

function combinedPeriod(moduli: readonly number[]): number {
  return moduli.reduce((current, value) => lcm(current, value), 1);
}

function constraintText(constraints: readonly Constraint[]): string {
  return constraints.map((item) => `$x \\equiv ${item.residue} \\pmod{${item.modulus}}$`).join(", ");
}

function compatibleConstraints(seed: number): { constraints: Constraint[]; witness: number; period: number } {
  const rng = createRng(seed * 43 + 11);
  const moduli = rng.pick(MODULUS_TRIPLES);
  const period = combinedPeriod(moduli);
  const witness = rng.int(1, Math.max(12, period - 1));
  return {
    witness,
    period,
    constraints: moduli.map((modulus) => ({ residue: mod(witness, modulus), modulus })),
  };
}

function multiplicityStem(seed: number, lower: number, upper: number, constraints: readonly Constraint[]): string {
  const system = constraintText(constraints);
  switch (seed % 3) {
    case 0:
      return `For integers $x$ with $${lower} \\le x \\le ${upper}$, consider ${system}. Which option correctly classifies the number of solutions in this interval?`;
    case 1:
      return `Consider the simultaneous congruences ${system} for $${lower} \\le x \\le ${upper}$. How should the number of integer solutions be classified?`;
    default:
      return `Within $${lower} \\le x \\le ${upper}$, integers $x$ must satisfy ${system}. Which statement about the number of solutions is correct?`;
  }
}

function tripleSetStem(seed: number, lower: number, upper: number, constraints: readonly Constraint[]): string {
  const system = constraintText(constraints);
  switch (seed % 3) {
    case 0:
      return `Find the complete set of integers $x$ with $${lower} \\le x \\le ${upper}$ satisfying ${system}.`;
    case 1:
      return `Which option lists all integers $x$ in $[${lower}, ${upper}]$ that satisfy ${system}?`;
    default:
      return `Determine every integer $x$ with $${lower} \\le x \\le ${upper}$ for which ${system} hold simultaneously.`;
  }
}

function generateMultiplicity(seed: number): NumCp008Wave04Package {
  const rng = createRng(seed * 97 + 25);
  const mode = seed % 3;
  const compatible = compatibleConstraints(seed);
  let constraints: Constraint[] = compatible.constraints;
  let lower: number;
  let upper: number;

  if (mode === 0) {
    const [first, second, third] = compatible.constraints;
    constraints = [
      first!,
      { residue: mod(second!.residue + 1, second!.modulus), modulus: second!.modulus },
      third!,
    ];
    lower = 1;
    upper = compatible.period * 2;
  } else {
    const merged = crtMany(constraints);
    if (!merged) throw new Error("Expected compatible system");
    const leastPositive = merged.residue === 0 ? merged.period : merged.residue;
    if (mode === 1) {
      lower = Math.max(1, leastPositive - rng.int(0, Math.min(leastPositive - 1, 12)));
      upper = lower + merged.period - 1;
    } else {
      lower = 1;
      upper = 2 * merged.period + rng.int(0, Math.max(1, Math.floor(merged.period / 2)));
    }
  }

  const merged = crtMany(constraints);
  const canonicalSolutions = merged ? solutionsInRange(merged.residue, merged.period, lower, upper) : [];
  const verifierSolutions = systemSolutions(constraints, lower, upper);
  const canonicalAnswer = classifyCount(canonicalSolutions.length);
  const verifierAnswer = classifyCount(verifierSolutions.length);
  const labels = ["No solution", "Exactly one solution", "More than one solution", "Cannot be determined"] as const;
  const optionData = textOptions(
    canonicalAnswer,
    labels.filter((value) => value !== canonicalAnswer).map((value) => ({
      value,
      misconceptionId: value === "Cannot be determined" ? "FAILED_TO_ENUMERATE_BOUNDED_SYSTEM" : "WRONG_SOLUTION_MULTIPLICITY",
    })),
    rng,
  );

  const mergedStep = merged
    ? `Combining the congruences gives one residue class modulo ${merged.period}.`
    : "The congruences are incompatible, so there is no common residue class.";
  const projectionStep = canonicalSolutions.length === 0
    ? `There is no value in $[${lower}, ${upper}]$ satisfying all conditions.`
    : `The values in $[${lower}, ${upper}]$ are ${setText(canonicalSolutions)}, so the count is ${canonicalSolutions.length}.`;

  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-025",
    seed,
    difficulty: mode === 2 ? "HARD" : "MEDIUM",
    answerSemantic: "BOUNDED_SYSTEM_SOLUTION_MULTIPLICITY",
    representation: "SIMULTANEOUS_CONGRUENCES_WITH_INTERVAL",
    stem: multiplicityStem(seed, lower, upper, constraints),
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { constraints, lower, upper, canonicalSolutions, verifierSolutions, merged },
    mathematicalFingerprint: JSON.stringify({ constraints, lower, upper, canonicalAnswer }),
    explanation: {
      coreConcept: "First combine the congruences into a common residue class. Then project that class into the given interval.",
      strategy: "Check compatibility, find the common period if it exists, and count only the values inside the stated bounds.",
      steps: [mergedStep, projectionStep],
      finalAnswer: canonicalAnswer,
    },
    sourceAncestry: sources("BOUNDED_SYSTEM_MULTIPLICITY_CLASSIFICATION"),
    prototypeAncestry: ["NUM-CP008-PROT-007", "NUM-CP008-PROT-008", "NUM-CP008-PROT-024", "NUM-CP008-PROT-025"],
  });
}

function generateTripleSet(seed: number): NumCp008Wave04Package {
  const rng = createRng(seed * 101 + 26);
  const compatible = compatibleConstraints(seed + 7000);
  const merged = crtMany(compatible.constraints);
  if (!merged) throw new Error("Expected compatible triple system");

  const lower = rng.int(1, Math.max(2, merged.period));
  const upper = lower + 2 * merged.period + rng.int(0, Math.max(1, Math.floor(merged.period / 2)));
  const canonicalSolutions = solutionsInRange(merged.residue, merged.period, lower, upper);
  const verifierSolutions = systemSolutions(compatible.constraints, lower, upper);
  if (canonicalSolutions.length < 2) throw new Error("Wave04 triple-set state must contain multiple bounded solutions");

  const canonicalAnswer = setText(canonicalSolutions);
  const verifierAnswer = setText(verifierSolutions);
  const wrong = [
    { value: setText(canonicalSolutions.slice(0, -1)), misconceptionId: "OMITTED_LAST_VALID_SOLUTION" },
    { value: setText(canonicalSolutions.slice(1)), misconceptionId: "OMITTED_FIRST_VALID_SOLUTION" },
    { value: setText(canonicalSolutions.map((value) => value + merged.period)), misconceptionId: "SHIFTED_ONE_PERIOD_TOO_FAR" },
  ] as const;
  const optionData = textOptions(canonicalAnswer, wrong, rng);
  const progression = canonicalSolutions.join(", ");

  return base({
    temporaryPrototypeId: "NUM-CP008-PROT-026",
    seed,
    difficulty: merged.period >= 120 ? "HARD" : "MEDIUM",
    answerSemantic: "COMPLETE_BOUNDED_TRIPLE_SYSTEM_SET",
    representation: "THREE_CONGRUENCES_WITH_COMPLETE_SET_OUTPUT",
    stem: tripleSetStem(seed, lower, upper, compatible.constraints),
    options: optionData.options,
    correctIndex: optionData.correctIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: {
      constraints: compatible.constraints,
      lower,
      upper,
      merged,
      canonicalSolutions,
      verifierSolutions,
    },
    mathematicalFingerprint: JSON.stringify({
      constraints: compatible.constraints,
      lower,
      upper,
      merged,
      canonicalSolutions,
    }),
    explanation: {
      coreConcept: "A compatible system of congruences reduces to one residue class with a fixed repeating period.",
      strategy: "Combine the three conditions, then list every member of that residue class that lies inside the interval.",
      steps: [
        `The three congruences combine to $x \\equiv ${merged.residue} \\pmod{${merged.period}}$.`,
        `Inside $[${lower}, ${upper}]$, this progression gives ${progression}.`,
      ],
      finalAnswer: canonicalAnswer,
    },
    sourceAncestry: sources("BOUNDED_TRIPLE_SYSTEM_COMPLETE_SET"),
    prototypeAncestry: ["NUM-CP008-PROT-015", "NUM-CP008-PROT-024", "NUM-CP008-PROT-026"],
  });
}

export function generateNumCp008Wave04Package(prototypeId: NumCp008Wave04PrototypeId, seed: number): NumCp008Wave04Package {
  if (!Number.isInteger(seed) || seed <= 0) throw new Error("Seed must be a positive integer");
  switch (prototypeId) {
    case "NUM-CP008-PROT-025":
      return generateMultiplicity(seed);
    case "NUM-CP008-PROT-026":
      return generateTripleSet(seed);
  }
}
