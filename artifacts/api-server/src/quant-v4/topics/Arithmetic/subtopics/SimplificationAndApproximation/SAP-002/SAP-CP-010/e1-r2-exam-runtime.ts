import {
  cubeRoot,
  decimalNear,
  e1r2Math,
  numericOptions,
  packageR2,
  squareRoot,
  type SapE1R2Package,
} from "../../SAP-E1-R2-TYPES";

export const SAP_CP010_E1_R2_STRUCTURES = Object.freeze([
  "CP010-R2-APPROX-SQUARE-PRODUCT",
  "CP010-R2-APPROX-ROOT-TIMES-DECIMAL",
  "CP010-R2-APPROX-CUBEROOT-MIXED",
  "CP010-R2-APPROX-POWER-QUOTIENT",
  "CP010-R2-APPROX-ROOT-CUBE-COMBO",
  "CP010-R2-APPROX-ROOT-QUOTIENT",
  "CP010-R2-SUPPLIED-ROOT-PLUS",
  "CP010-R2-SUPPLIED-ROOT-PRODUCT",
  "CP010-R2-SUPPLIED-ROOT-DECIMAL-SCALE",
  "CP010-R2-SUPPLIED-ROOT-MIXED",
  "CP010-R2-SUPPLIED-ROOT-DIFFERENCE",
  "CP010-R2-SUPPLIED-ROOT-QUOTIENT",
] as const);

export type SapCp010E1R2Structure = typeof SAP_CP010_E1_R2_STRUCTURES[number];

const SUPPLIED_ROOTS = Object.freeze([
  { n: 2, hundredths: 141 },
  { n: 3, hundredths: 173 },
  { n: 5, hundredths: 224 },
  { n: 6, hundredths: 245 },
  { n: 7, hundredths: 265 },
  { n: 10, hundredths: 316 },
  { n: 11, hundredths: 332 },
  { n: 15, hundredths: 387 },
] as const);

function fmt(value: number, places = 2): string {
  return value.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function common(seed: number) {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("E1-R2 seed must be 1..100.");
  const p = seed - 1;
  const band = Math.floor(p / 25);
  const a = 8 + (p % 25);
  const m = 2 + ((p * 3 + band) % 5);
  const c = 5 + ((p * 7 + band) % 13);
  const u = 4 + band + (p % 6);
  const correctIndex = p % 4;
  return { p, band, a, m, c, u, correctIndex };
}

function finishInteger(args: {
  structureId: SapCp010E1R2Structure;
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
  const step = Math.max(1, Math.min(5, Math.round(Math.abs(args.answer) * 0.02)));
  return packageR2({
    profile: "BANK",
    checkpointId: "SAP-CP-010",
    structureId: args.structureId,
    seed: args.seed,
    difficulty: args.difficulty ?? "MEDIUM",
    decisionCount: args.decisionCount ?? 4,
    stem: args.stem,
    canonicalAnswer: String(args.answer),
    options: numericOptions(args.answer, correctIndex, step),
    correctIndex,
    explanation: Object.freeze({
      coreConcept: args.concept,
      steps: Object.freeze(args.steps),
      finalAnswer: `Therefore, the approximate value is ${args.answer}.`,
    }),
    oracle: Object.freeze({ kind: args.structureId, data: args.data }),
  });
}

function finishDecimal(args: {
  structureId: SapCp010E1R2Structure;
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
  const answerText = fmt(args.answer, 2);
  return packageR2({
    profile: "BANK",
    checkpointId: "SAP-CP-010",
    structureId: args.structureId,
    seed: args.seed,
    difficulty: args.difficulty ?? "MEDIUM",
    decisionCount: args.decisionCount ?? 3,
    stem: args.stem,
    canonicalAnswer: answerText,
    options: numericOptions(args.answer, correctIndex, 0.1, 2),
    correctIndex,
    explanation: Object.freeze({
      coreConcept: args.concept,
      steps: Object.freeze(args.steps),
      finalAnswer: `Therefore, the approximate value is ${answerText}.`,
    }),
    oracle: Object.freeze({ kind: args.structureId, data: args.data }),
  });
}

function approximateSquareProduct(seed: number): SapE1R2Package {
  const { a, m, c, band } = common(seed);
  const b = 7 + band;
  const answer = a ** 2 + b * m - c;
  const x = decimalNear(a, seed % 2 === 0 ? -4 : 4);
  const y = decimalNear(b, 3);
  const z = decimalNear(m, -2);
  const w = decimalNear(c, 1);
  const expr = `(${x})^{2} + ${y} \\times ${z} - ${w}`;
  return finishInteger({
    structureId: "CP010-R2-APPROX-SQUARE-PRODUCT",
    seed,
    answer,
    stem: `What approximate value should come in place of ? in ${e1r2Math(`${expr} = ?`)}?`,
    concept: "Choose nearby convenient values, then apply BODMAS to the square and product before combining them.",
    steps: [`Use ${x} ≈ ${a}, ${y} ≈ ${b}, ${z} ≈ ${m}, and ${w} ≈ ${c}.`, `${a}² + ${b} × ${m} - ${c} = ${answer}.`],
    data: Object.freeze({ a, b, m, c, answer, x, y, z, w }),
    difficulty: "MEDIUM",
    decisionCount: 5,
  });
}

function approximateRootTimesDecimal(seed: number): SapE1R2Package {
  const { a, m, c } = common(seed);
  const radicand = decimalNear(a ** 2, 12);
  const multiplier = decimalNear(m, 3);
  const offset = decimalNear(c, -4);
  const answer = a * m + c;
  const expr = `${squareRoot(radicand)} \\times ${multiplier} + ${offset}`;
  return finishInteger({
    structureId: "CP010-R2-APPROX-ROOT-TIMES-DECIMAL",
    seed,
    answer,
    stem: `Find the approximate value of ${e1r2Math(expr)}.`,
    concept: "Use the nearby perfect square for the root and convenient whole numbers for the remaining decimals.",
    steps: [`${radicand} is close to ${a ** 2}, so ${e1r2Math(squareRoot(radicand))} ≈ ${a}; also ${multiplier} ≈ ${m} and ${offset} ≈ ${c}.`, `${a} × ${m} + ${c} = ${answer}.`],
    data: Object.freeze({ a, m, c, radicand, multiplier, offset, answer }),
    difficulty: "MEDIUM",
    decisionCount: 4,
  });
}

function approximateCubeRootMixed(seed: number): SapE1R2Package {
  const { u, m, c } = common(seed);
  const radicand = decimalNear(u ** 3, seed % 2 === 0 ? -18 : 18);
  const multiplier = decimalNear(m, -3);
  const offset = decimalNear(c, 2);
  const answer = u * m - c;
  const expr = `${cubeRoot(radicand)} \\times ${multiplier} - ${offset}`;
  return finishInteger({
    structureId: "CP010-R2-APPROX-CUBEROOT-MIXED",
    seed,
    answer,
    stem: `What is the approximate value of ${e1r2Math(expr)}?`,
    concept: "Recognise the nearby perfect cube, then use the convenient decimal values in the remaining arithmetic.",
    steps: [`${radicand} is close to ${u ** 3}, so ${e1r2Math(cubeRoot(radicand))} ≈ ${u}; ${multiplier} ≈ ${m} and ${offset} ≈ ${c}.`, `${u} × ${m} - ${c} = ${answer}.`],
    data: Object.freeze({ u, m, c, radicand, multiplier, offset, answer }),
    difficulty: "HARD",
    decisionCount: 4,
  });
}

function approximatePowerQuotient(seed: number): SapE1R2Package {
  const { p, m, c } = common(seed);
  const x = 5 + (p % 10);
  const base = m * x;
  const baseText = decimalNear(base, -4);
  const divisor = decimalNear(m, 2);
  const offset = decimalNear(c, 3);
  const answer = m * x ** 2 + c;
  const expr = `\\frac{(${baseText})^{2}}{${divisor}} + ${offset}`;
  return finishInteger({
    structureId: "CP010-R2-APPROX-POWER-QUOTIENT",
    seed,
    answer,
    stem: `What approximate value should replace ? in ${e1r2Math(`${expr} = ?`)}?`,
    concept: "Use a nearby integer for the squared base and a compatible divisor before completing the addition.",
    steps: [`Take ${baseText} ≈ ${base}, ${divisor} ≈ ${m}, and ${offset} ≈ ${c}.`, `${base}² ÷ ${m} + ${c} = ${m} × ${x}² + ${c} = ${answer}.`],
    data: Object.freeze({ x, m, c, base, baseText, divisor, offset, answer }),
    difficulty: "HARD",
    decisionCount: 5,
  });
}

function approximateRootCubeCombo(seed: number): SapE1R2Package {
  const { a, u, m, c } = common(seed);
  const squareN = decimalNear(a ** 2, 15);
  const cubeN = decimalNear(u ** 3, -16);
  const multiplier = decimalNear(m, 3);
  const offset = decimalNear(c, -2);
  const answer = a + u * m - c;
  const expr = `${squareRoot(squareN)} + ${cubeRoot(cubeN)} \\times ${multiplier} - ${offset}`;
  return finishInteger({
    structureId: "CP010-R2-APPROX-ROOT-CUBE-COMBO",
    seed,
    answer,
    stem: `Find the approximate value of ${e1r2Math(expr)}.`,
    concept: "Approximate the square root and cube root from nearby perfect powers, then apply BODMAS.",
    steps: [`${e1r2Math(squareRoot(squareN))} ≈ ${a} and ${e1r2Math(cubeRoot(cubeN))} ≈ ${u}; also ${multiplier} ≈ ${m} and ${offset} ≈ ${c}.`, `${a} + ${u} × ${m} - ${c} = ${answer}.`],
    data: Object.freeze({ a, u, m, c, squareN, cubeN, multiplier, offset, answer }),
    difficulty: "HARD",
    decisionCount: 6,
  });
}

function approximateRootQuotient(seed: number): SapE1R2Package {
  const { p, band, m, c } = common(seed);
  const q = 2 + (band % 3);
  const x = 7 + (p % 12);
  const rootBase = q * x;
  const radicand = decimalNear(rootBase ** 2, 14);
  const multiplier = decimalNear(m, -3);
  const divisor = decimalNear(q, 2);
  const offset = decimalNear(c, 1);
  const answer = x * m - c;
  const expr = `\\frac{${squareRoot(radicand)} \\times ${multiplier}}{${divisor}} - ${offset}`;
  return finishInteger({
    structureId: "CP010-R2-APPROX-ROOT-QUOTIENT",
    seed,
    answer,
    stem: `What is the approximate value of ${e1r2Math(expr)}?`,
    concept: "Use a nearby perfect square and compatible whole numbers so the quotient simplifies cleanly.",
    steps: [`${e1r2Math(squareRoot(radicand))} ≈ ${rootBase}, ${multiplier} ≈ ${m}, ${divisor} ≈ ${q}, and ${offset} ≈ ${c}.`, `${rootBase} × ${m} ÷ ${q} - ${c} = ${x} × ${m} - ${c} = ${answer}.`],
    data: Object.freeze({ q, x, m, c, rootBase, radicand, multiplier, divisor, offset, answer }),
    difficulty: "HARD",
    decisionCount: 5,
  });
}

function supplied(seed: number, minFactor = 2) {
  const p = seed - 1;
  const root = SUPPLIED_ROOTS[p % SUPPLIED_ROOTS.length]!;
  const factor = minFactor + Math.floor(p / SUPPLIED_ROOTS.length);
  const c = 2 + ((p * 5) % 9);
  const m = 2 + ((p * 3) % 4);
  const q = 2 + (p % 3);
  const suppliedValue = root.hundredths / 100;
  return { p, root, factor, c, m, q, suppliedValue, correctIndex: p % 4 };
}

function suppliedPlus(seed: number): SapE1R2Package {
  const d = supplied(seed);
  const target = d.root.n * d.factor ** 2;
  const answer = d.factor * d.suppliedValue + d.c;
  const stem = `Given ${e1r2Math(`${squareRoot(d.root.n)} \\approx ${fmt(d.suppliedValue)}`)}, estimate ${e1r2Math(`${squareRoot(target)} + ${d.c}`)}.`;
  return finishDecimal({
    structureId: "CP010-R2-SUPPLIED-ROOT-PLUS",
    seed,
    answer,
    stem,
    concept: "Extract the exact square factor from the new root, then use the value supplied in the question.",
    steps: [`${e1r2Math(`${squareRoot(target)} = ${d.factor}${squareRoot(d.root.n)}`)}.`, `${d.factor} × ${fmt(d.suppliedValue)} + ${d.c} ≈ ${fmt(answer)}.`],
    data: Object.freeze({ n: d.root.n, factor: d.factor, c: d.c, target, suppliedHundredths: d.root.hundredths, answerHundredths: Math.round(answer * 100) }),
    decisionCount: 3,
  });
}

function suppliedProduct(seed: number): SapE1R2Package {
  const d = supplied(seed);
  const target = d.root.n * d.factor ** 2;
  const answer = d.m * d.factor * d.suppliedValue - d.c;
  const stem = `Given ${e1r2Math(`${squareRoot(d.root.n)} \\approx ${fmt(d.suppliedValue)}`)}, find the approximate value of ${e1r2Math(`${d.m}${squareRoot(target)} - ${d.c}`)}.`;
  return finishDecimal({
    structureId: "CP010-R2-SUPPLIED-ROOT-PRODUCT",
    seed,
    answer,
    stem,
    concept: "Scale the supplied root exactly, then apply the outside multiplication and subtraction.",
    steps: [`${e1r2Math(`${squareRoot(target)} = ${d.factor}${squareRoot(d.root.n)}`)}, so it is approximately ${fmt(d.factor * d.suppliedValue)}.`, `${d.m} × ${fmt(d.factor * d.suppliedValue)} - ${d.c} ≈ ${fmt(answer)}.`],
    data: Object.freeze({ n: d.root.n, factor: d.factor, m: d.m, c: d.c, target, answerHundredths: Math.round(answer * 100) }),
    difficulty: "MEDIUM",
    decisionCount: 4,
  });
}

function suppliedDecimalScale(seed: number): SapE1R2Package {
  const d = supplied(seed);
  const target = d.root.n * d.factor ** 2 / 100;
  const scaledRoot = d.factor * d.suppliedValue / 10;
  const answer = scaledRoot + d.c;
  const targetText = fmt(target, 2);
  const stem = `Given ${e1r2Math(`${squareRoot(d.root.n)} \\approx ${fmt(d.suppliedValue)}`)}, estimate ${e1r2Math(`${squareRoot(targetText)} + ${d.c}`)}.`;
  return finishDecimal({
    structureId: "CP010-R2-SUPPLIED-ROOT-DECIMAL-SCALE",
    seed,
    answer,
    stem,
    concept: "Recognise the square scale including the decimal place, then reuse the supplied root value.",
    steps: [`${e1r2Math(`${squareRoot(targetText)} = \\frac{${d.factor}}{10}${squareRoot(d.root.n)}`)} ≈ ${fmt(scaledRoot)}.`, `${fmt(scaledRoot)} + ${d.c} ≈ ${fmt(answer)}.`],
    data: Object.freeze({ n: d.root.n, factor: d.factor, c: d.c, target: targetText, answerHundredths: Math.round(answer * 100) }),
    difficulty: "HARD",
    decisionCount: 4,
  });
}

function suppliedMixed(seed: number): SapE1R2Package {
  const d = supplied(seed);
  const target = d.root.n * d.factor ** 2;
  const answer = d.m * d.factor * d.suppliedValue + d.c;
  const stem = `Given ${e1r2Math(`${squareRoot(d.root.n)} \\approx ${fmt(d.suppliedValue)}`)}, what is the approximate value of ${e1r2Math(`${d.m}${squareRoot(target)} + ${d.c}`)}?`;
  return finishDecimal({
    structureId: "CP010-R2-SUPPLIED-ROOT-MIXED",
    seed,
    answer,
    stem,
    concept: "Use the supplied root after extracting the square factor, then complete the remaining arithmetic.",
    steps: [`${e1r2Math(`${squareRoot(target)} = ${d.factor}${squareRoot(d.root.n)}`)} ≈ ${fmt(d.factor * d.suppliedValue)}.`, `${d.m} × ${fmt(d.factor * d.suppliedValue)} + ${d.c} ≈ ${fmt(answer)}.`],
    data: Object.freeze({ n: d.root.n, factor: d.factor, m: d.m, c: d.c, target, answerHundredths: Math.round(answer * 100) }),
    difficulty: "MEDIUM",
    decisionCount: 4,
  });
}

function suppliedDifference(seed: number): SapE1R2Package {
  const d = supplied(seed, 3);
  const smallerFactor = d.factor - 2;
  const target1 = d.root.n * d.factor ** 2;
  const target2 = d.root.n * smallerFactor ** 2;
  const answer = 2 * d.suppliedValue + d.c;
  const stem = `Given ${e1r2Math(`${squareRoot(d.root.n)} \\approx ${fmt(d.suppliedValue)}`)}, estimate ${e1r2Math(`${squareRoot(target1)} - ${squareRoot(target2)} + ${d.c}`)}.`;
  return finishDecimal({
    structureId: "CP010-R2-SUPPLIED-ROOT-DIFFERENCE",
    seed,
    answer,
    stem,
    concept: "Express both roots as multiples of the supplied root before subtracting them.",
    steps: [`The two roots are ${d.factor}${e1r2Math(squareRoot(d.root.n))} and ${smallerFactor}${e1r2Math(squareRoot(d.root.n))}; their difference is ${e1r2Math(`2${squareRoot(d.root.n)}`)}.`, `2 × ${fmt(d.suppliedValue)} + ${d.c} ≈ ${fmt(answer)}.`],
    data: Object.freeze({ n: d.root.n, factor1: d.factor, factor2: smallerFactor, c: d.c, target1, target2, answerHundredths: Math.round(answer * 100) }),
    difficulty: "HARD",
    decisionCount: 4,
  });
}

function suppliedQuotient(seed: number): SapE1R2Package {
  const d = supplied(seed);
  const target = d.root.n * d.factor ** 2;
  const numerator = d.factor * d.suppliedValue + d.c;
  const answer = numerator / d.q;
  const stem = `Given ${e1r2Math(`${squareRoot(d.root.n)} \\approx ${fmt(d.suppliedValue)}`)}, estimate ${e1r2Math(`\\frac{${squareRoot(target)} + ${d.c}}{${d.q}}`)}.`;
  return finishDecimal({
    structureId: "CP010-R2-SUPPLIED-ROOT-QUOTIENT",
    seed,
    answer,
    stem,
    concept: "Scale the supplied root, combine the numerator, then divide by the stated integer.",
    steps: [`${e1r2Math(squareRoot(target))} ≈ ${fmt(d.factor * d.suppliedValue)}, so the numerator is approximately ${fmt(numerator)}.`, `${fmt(numerator)} ÷ ${d.q} ≈ ${fmt(answer)}.`],
    data: Object.freeze({ n: d.root.n, factor: d.factor, c: d.c, q: d.q, target, answerHundredths: Math.round(answer * 100) }),
    difficulty: "HARD",
    decisionCount: 4,
  });
}

export function generateSapCp010E1R2(structureId: SapCp010E1R2Structure, seed: number): SapE1R2Package {
  switch (structureId) {
    case "CP010-R2-APPROX-SQUARE-PRODUCT": return approximateSquareProduct(seed);
    case "CP010-R2-APPROX-ROOT-TIMES-DECIMAL": return approximateRootTimesDecimal(seed);
    case "CP010-R2-APPROX-CUBEROOT-MIXED": return approximateCubeRootMixed(seed);
    case "CP010-R2-APPROX-POWER-QUOTIENT": return approximatePowerQuotient(seed);
    case "CP010-R2-APPROX-ROOT-CUBE-COMBO": return approximateRootCubeCombo(seed);
    case "CP010-R2-APPROX-ROOT-QUOTIENT": return approximateRootQuotient(seed);
    case "CP010-R2-SUPPLIED-ROOT-PLUS": return suppliedPlus(seed);
    case "CP010-R2-SUPPLIED-ROOT-PRODUCT": return suppliedProduct(seed);
    case "CP010-R2-SUPPLIED-ROOT-DECIMAL-SCALE": return suppliedDecimalScale(seed);
    case "CP010-R2-SUPPLIED-ROOT-MIXED": return suppliedMixed(seed);
    case "CP010-R2-SUPPLIED-ROOT-DIFFERENCE": return suppliedDifference(seed);
    case "CP010-R2-SUPPLIED-ROOT-QUOTIENT": return suppliedQuotient(seed);
  }
}
