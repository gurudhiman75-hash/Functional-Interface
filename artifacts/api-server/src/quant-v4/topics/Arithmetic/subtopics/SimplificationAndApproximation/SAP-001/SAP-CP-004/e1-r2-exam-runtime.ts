import {
  cubeRoot,
  e1r2Math,
  numericOptions,
  packageR2,
  squareRoot,
  type SapE1R2Package,
} from "../../SAP-E1-R2-TYPES";

export const SAP_CP004_E1_R2_STRUCTURES = Object.freeze([
  "CP004-R2-ROOT-SUM-PRODUCT",
  "CP004-R2-ROOT-DIFFERENCE-BRACKET",
  "CP004-R2-SQUARE-CUBE-COMBO",
  "CP004-R2-ROOT-FRACTION-CHAIN",
  "CP004-R2-NESTED-PLUS-SCALAR",
  "CP004-R2-NESTED-SCALED",
  "CP004-R2-WEIGHTED-ROOT-QUOTIENT",
  "CP004-R2-ROOT-POWER-BODMAS",
] as const);

export type SapCp004E1R2Structure = typeof SAP_CP004_E1_R2_STRUCTURES[number];

function common(seed: number) {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("E1-R2 seed must be 1..100.");
  const p = seed - 1;
  const band = Math.floor(p / 25);
  const a = 8 + (p % 25);
  const b = 5 + band;
  const m = 2 + ((p * 3 + band) % 4);
  const c = 3 + ((p * 5 + band) % 7);
  const correctIndex = p % 4;
  return { p, band, a, b, m, c, correctIndex };
}

function finish(args: {
  structureId: SapCp004E1R2Structure;
  seed: number;
  answer: number;
  stem: string;
  steps: readonly string[];
  concept: string;
  data: Readonly<Record<string, number | string>>;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  decisionCount?: number;
}): SapE1R2Package {
  const correctIndex = (args.seed - 1) % 4;
  const options = numericOptions(args.answer, correctIndex, Math.max(1, Math.round(Math.abs(args.answer) * 0.04)));
  const answer = String(args.answer);
  return packageR2({
    profile: "SSC",
    checkpointId: "SAP-CP-004",
    structureId: args.structureId,
    seed: args.seed,
    difficulty: args.difficulty ?? "MEDIUM",
    decisionCount: args.decisionCount ?? 3,
    stem: args.stem,
    canonicalAnswer: answer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: args.concept,
      steps: Object.freeze(args.steps),
      finalAnswer: `Therefore, the value is ${answer}.`,
    }),
    oracle: Object.freeze({ kind: args.structureId, data: args.data }),
  });
}

function rootSumProduct(seed: number): SapE1R2Package {
  const { a, b, m, c } = common(seed);
  const answer = a + m * b - c;
  const expr = `${squareRoot(a * a)} + ${m}${squareRoot(b * b)} - ${c}`;
  return finish({
    structureId: "CP004-R2-ROOT-SUM-PRODUCT",
    seed,
    answer,
    stem: `Simplify ${e1r2Math(expr)}.`,
    concept: "Evaluate the exact roots first, then follow the multiplication and subtraction.",
    steps: [`${e1r2Math(squareRoot(a * a))} = ${a} and ${e1r2Math(squareRoot(b * b))} = ${b}.`, `${a} + ${m} × ${b} - ${c} = ${answer}.`],
    data: Object.freeze({ a, b, m, c, answer }),
  });
}

function rootDifferenceBracket(seed: number): SapE1R2Package {
  const { a, b, m, c } = common(seed);
  const answer = (a - b) * m + c;
  const expr = `${m}(${squareRoot(a * a)} - ${squareRoot(b * b)}) + ${c}`;
  return finish({
    structureId: "CP004-R2-ROOT-DIFFERENCE-BRACKET",
    seed,
    answer,
    stem: `Find the value of ${e1r2Math(expr)}.`,
    concept: "Simplify the roots inside the bracket before applying the outside multiplication.",
    steps: [`Inside the bracket, ${e1r2Math(`${squareRoot(a * a)} - ${squareRoot(b * b)} = ${a} - ${b} = ${a - b}`)}.`, `${m} × ${a - b} + ${c} = ${answer}.`],
    data: Object.freeze({ a, b, m, c, answer }),
  });
}

function squareCubeCombo(seed: number): SapE1R2Package {
  const { p, band, a, m, c } = common(seed);
  const u = 4 + band + (p % 5);
  const answer = u + m * a - c;
  const expr = `${cubeRoot(u ** 3)} + ${m}${squareRoot(a * a)} - ${c}`;
  return finish({
    structureId: "CP004-R2-SQUARE-CUBE-COMBO",
    seed,
    answer,
    stem: `Simplify ${e1r2Math(expr)}.`,
    concept: "Use the exact cube root and square root, then complete the ordinary arithmetic.",
    steps: [`${e1r2Math(cubeRoot(u ** 3))} = ${u} and ${e1r2Math(squareRoot(a * a))} = ${a}.`, `${u} + ${m} × ${a} - ${c} = ${answer}.`],
    data: Object.freeze({ u, a, m, c, answer }),
    difficulty: "MEDIUM",
  });
}

function rootFractionChain(seed: number): SapE1R2Package {
  const { p, band, c } = common(seed);
  const q = 2 + (band % 3);
  const x = 4 + (p % 9);
  const y = 3 + ((p * 2 + band) % 8);
  const answer = x + y + c;
  const expr = `\\frac{${squareRoot((q * x) ** 2)} + ${squareRoot((q * y) ** 2)}}{${q}} + ${c}`;
  return finish({
    structureId: "CP004-R2-ROOT-FRACTION-CHAIN",
    seed,
    answer,
    stem: `Find the value of ${e1r2Math(expr)}.`,
    concept: "Evaluate both roots, simplify the fraction, then add the remaining term.",
    steps: [`The numerator becomes ${q * x} + ${q * y} = ${q * (x + y)}.`, `${q * (x + y)} ÷ ${q} + ${c} = ${x + y} + ${c} = ${answer}.`],
    data: Object.freeze({ q, x, y, c, answer }),
    difficulty: "MEDIUM",
  });
}

function nestedData(seed: number) {
  const { p, band, c, m } = common(seed);
  const inner = 2 + (p % 4);
  const middle = 6 + band + (p % 3);
  const outer = 15 + (p % 25);
  const innerSquare = inner ** 2;
  const middleBase = middle ** 2 - inner;
  const outerBase = outer ** 2 - middle;
  const nested = squareRoot(`${outerBase} + ${squareRoot(`${middleBase} + ${squareRoot(innerSquare)}`)}`);
  return { inner, middle, outer, innerSquare, middleBase, outerBase, nested, c, m };
}

function nestedPlusScalar(seed: number): SapE1R2Package {
  const d = nestedData(seed);
  const answer = d.outer + d.c;
  return finish({
    structureId: "CP004-R2-NESTED-PLUS-SCALAR",
    seed,
    answer,
    stem: `Simplify ${e1r2Math(`${d.nested} + ${d.c}`)}.`,
    concept: "Work from the innermost root outward, then complete the final addition.",
    steps: [`The nested root simplifies successively to ${d.inner}, then ${d.middle}, then ${d.outer}.`, `${d.outer} + ${d.c} = ${answer}.`],
    data: Object.freeze({ inner: d.inner, middle: d.middle, outer: d.outer, c: d.c, answer }),
    difficulty: "HARD",
    decisionCount: 4,
  });
}

function nestedScaled(seed: number): SapE1R2Package {
  const d = nestedData(seed);
  const answer = d.m * d.outer - d.c;
  return finish({
    structureId: "CP004-R2-NESTED-SCALED",
    seed,
    answer,
    stem: `Find the value of ${e1r2Math(`${d.m}${d.nested} - ${d.c}`)}.`,
    concept: "Reduce the nested root from inside to outside before applying the outside multiplication and subtraction.",
    steps: [`The three root layers reduce to ${d.inner}, ${d.middle} and finally ${d.outer}.`, `${d.m} × ${d.outer} - ${d.c} = ${answer}.`],
    data: Object.freeze({ inner: d.inner, middle: d.middle, outer: d.outer, m: d.m, c: d.c, answer }),
    difficulty: "HARD",
    decisionCount: 5,
  });
}

function weightedRootQuotient(seed: number): SapE1R2Package {
  const { p, band, m, c } = common(seed);
  const q = 2 + (band % 3);
  const x = 5 + (p % 10);
  const y = 4 + ((p * 3 + band) % 9);
  const answer = m * x + y - c;
  const expr = `\\frac{${m}${squareRoot((q * x) ** 2)} + ${squareRoot((q * y) ** 2)}}{${q}} - ${c}`;
  return finish({
    structureId: "CP004-R2-WEIGHTED-ROOT-QUOTIENT",
    seed,
    answer,
    stem: `Simplify ${e1r2Math(expr)}.`,
    concept: "Evaluate the exact roots, take out the common divisor from the numerator, then finish the subtraction.",
    steps: [`The numerator is ${m} × ${q * x} + ${q * y} = ${q * (m * x + y)}.`, `${q * (m * x + y)} ÷ ${q} - ${c} = ${m * x + y} - ${c} = ${answer}.`],
    data: Object.freeze({ q, x, y, m, c, answer }),
    difficulty: "HARD",
    decisionCount: 4,
  });
}

function rootPowerBodmas(seed: number): SapE1R2Package {
  const { p, band, a, m, c } = common(seed);
  const u = 4 + band + (p % 5);
  const answer = a + u + m ** 2 - c;
  const expr = `${squareRoot(a * a)} + ${cubeRoot(u ** 3)} + ${m}^{2} - ${c}`;
  return finish({
    structureId: "CP004-R2-ROOT-POWER-BODMAS",
    seed,
    answer,
    stem: `Find the value of ${e1r2Math(expr)}.`,
    concept: "Evaluate the root and power terms first, then combine the resulting integers.",
    steps: [`${e1r2Math(squareRoot(a * a))} = ${a}, ${e1r2Math(cubeRoot(u ** 3))} = ${u}, and ${m}² = ${m ** 2}.`, `${a} + ${u} + ${m ** 2} - ${c} = ${answer}.`],
    data: Object.freeze({ a, u, m, c, answer }),
    difficulty: "MEDIUM",
    decisionCount: 4,
  });
}

export function generateSapCp004E1R2(structureId: SapCp004E1R2Structure, seed: number): SapE1R2Package {
  switch (structureId) {
    case "CP004-R2-ROOT-SUM-PRODUCT": return rootSumProduct(seed);
    case "CP004-R2-ROOT-DIFFERENCE-BRACKET": return rootDifferenceBracket(seed);
    case "CP004-R2-SQUARE-CUBE-COMBO": return squareCubeCombo(seed);
    case "CP004-R2-ROOT-FRACTION-CHAIN": return rootFractionChain(seed);
    case "CP004-R2-NESTED-PLUS-SCALAR": return nestedPlusScalar(seed);
    case "CP004-R2-NESTED-SCALED": return nestedScaled(seed);
    case "CP004-R2-WEIGHTED-ROOT-QUOTIENT": return weightedRootQuotient(seed);
    case "CP004-R2-ROOT-POWER-BODMAS": return rootPowerBodmas(seed);
  }
}
