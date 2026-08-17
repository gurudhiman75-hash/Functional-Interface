import {
  e1r2Math,
  numericOptions,
  packageR2,
  type SapE1R2Package,
} from "../../SAP-E1-R2-TYPES";

export const SAP_CP005_E1_R2_STRUCTURES = Object.freeze([
  "CP005-R2-TELESCOPE-SCALED-SUM",
  "CP005-R2-TELESCOPE-SUM-OFFSET",
  "CP005-R2-TELESCOPE-TWO-BLOCKS",
  "CP005-R2-TELESCOPE-BRACKET-QUOTIENT",
] as const);

export type SapCp005E1R2Structure = typeof SAP_CP005_E1_R2_STRUCTURES[number];

function terms(start: number, count: number): string {
  return Array.from({ length: count }, (_, index) => {
    const k = start + index;
    return `\\frac{1}{${k}(${k + 1})}`;
  }).join(" + ");
}

function common(seed: number) {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("E1-R2 seed must be 1..100.");
  const p = seed - 1;
  const band = Math.floor(p / 25);
  const start = 2 + (p % 25);
  const count = 4 + band;
  const end = start + count;
  const multiplier = start * end;
  const c = 2 + ((p * 3 + band) % 9);
  const correctIndex = p % 4;
  return { p, band, start, count, end, multiplier, c, correctIndex };
}

function finish(args: {
  structureId: SapCp005E1R2Structure;
  seed: number;
  answer: number;
  stem: string;
  steps: readonly string[];
  concept: string;
  data: Readonly<Record<string, number | string>>;
  difficulty?: "MEDIUM" | "HARD";
  decisionCount?: number;
}): SapE1R2Package {
  const correctIndex = (args.seed - 1) % 4;
  return packageR2({
    profile: "SSC",
    checkpointId: "SAP-CP-005",
    structureId: args.structureId,
    seed: args.seed,
    difficulty: args.difficulty ?? "HARD",
    decisionCount: args.decisionCount ?? 3,
    stem: args.stem,
    canonicalAnswer: String(args.answer),
    options: numericOptions(args.answer, correctIndex, 1),
    correctIndex,
    explanation: Object.freeze({
      coreConcept: args.concept,
      steps: Object.freeze(args.steps),
      finalAnswer: `Therefore, the value is ${args.answer}.`,
    }),
    oracle: Object.freeze({ kind: args.structureId, data: args.data }),
  });
}

function scaledSum(seed: number): SapE1R2Package {
  const d = common(seed);
  const answer = d.count;
  const expr = `${d.multiplier}\\left(${terms(d.start, d.count)}\\right)`;
  return finish({
    structureId: "CP005-R2-TELESCOPE-SCALED-SUM",
    seed,
    answer,
    stem: `Find the value of ${e1r2Math(expr)}.`,
    concept: "Split each adjacent reciprocal product into a difference; the middle fractions cancel.",
    steps: [`The bracket becomes ${e1r2Math(`\\frac{1}{${d.start}}-\\frac{1}{${d.end}} = \\frac{${d.count}}{${d.multiplier}}`)}.`, `${d.multiplier} × ${d.count}/${d.multiplier} = ${answer}.`],
    data: Object.freeze({ start: d.start, count: d.count, end: d.end, multiplier: d.multiplier, answer }),
  });
}

function sumOffset(seed: number): SapE1R2Package {
  const d = common(seed);
  const answer = d.count + d.c;
  const expr = `${d.multiplier}\\left(${terms(d.start, d.count)}\\right) + ${d.c}`;
  return finish({
    structureId: "CP005-R2-TELESCOPE-SUM-OFFSET",
    seed,
    answer,
    stem: `Simplify ${e1r2Math(expr)}.`,
    concept: "Collapse the telescoping bracket to its two endpoints, then complete the outside arithmetic.",
    steps: [`The bracket is ${d.count}/${d.multiplier}, so the scaled bracket equals ${d.count}.`, `${d.count} + ${d.c} = ${answer}.`],
    data: Object.freeze({ start: d.start, count: d.count, end: d.end, multiplier: d.multiplier, c: d.c, answer }),
  });
}

function twoBlocks(seed: number): SapE1R2Package {
  const d = common(seed);
  const start2 = d.start + d.count + 2;
  const count2 = 3 + (d.band % 2);
  const end2 = start2 + count2;
  const multiplier2 = start2 * end2;
  const answer = d.count - count2 + d.c;
  const expr = `${d.multiplier}\\left(${terms(d.start, d.count)}\\right) - ${multiplier2}\\left(${terms(start2, count2)}\\right) + ${d.c}`;
  return finish({
    structureId: "CP005-R2-TELESCOPE-TWO-BLOCKS",
    seed,
    answer,
    stem: `Find the value of ${e1r2Math(expr)}.`,
    concept: "Telescope each finite block independently, then combine the two resulting integers.",
    steps: [`The first scaled block equals ${d.count}; the second scaled block equals ${count2}.`, `${d.count} - ${count2} + ${d.c} = ${answer}.`],
    data: Object.freeze({ start1: d.start, count1: d.count, start2, count2, c: d.c, answer }),
    difficulty: "HARD",
    decisionCount: 4,
  });
}

function bracketQuotient(seed: number): SapE1R2Package {
  const d = common(seed);
  const evenCount = 4 + 2 * (d.band % 3);
  const end = d.start + evenCount;
  const multiplier = d.start * end;
  const q = 2;
  const answer = evenCount / q + d.c;
  const expr = `\\frac{${multiplier}\\left(${terms(d.start, evenCount)}\\right)}{${q}} + ${d.c}`;
  return finish({
    structureId: "CP005-R2-TELESCOPE-BRACKET-QUOTIENT",
    seed,
    answer,
    stem: `Simplify ${e1r2Math(expr)}.`,
    concept: "Reduce the finite telescoping sum first, then apply the outside division and addition.",
    steps: [`The scaled bracket equals ${evenCount}.`, `${evenCount} ÷ ${q} + ${d.c} = ${answer}.`],
    data: Object.freeze({ start: d.start, count: evenCount, end, multiplier, q, c: d.c, answer }),
    difficulty: "HARD",
    decisionCount: 3,
  });
}

export function generateSapCp005E1R2(structureId: SapCp005E1R2Structure, seed: number): SapE1R2Package {
  switch (structureId) {
    case "CP005-R2-TELESCOPE-SCALED-SUM": return scaledSum(seed);
    case "CP005-R2-TELESCOPE-SUM-OFFSET": return sumOffset(seed);
    case "CP005-R2-TELESCOPE-TWO-BLOCKS": return twoBlocks(seed);
    case "CP005-R2-TELESCOPE-BRACKET-QUOTIENT": return bracketQuotient(seed);
  }
}
