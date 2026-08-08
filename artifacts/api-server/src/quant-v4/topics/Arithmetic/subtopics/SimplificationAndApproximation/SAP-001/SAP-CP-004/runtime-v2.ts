import {
  SAP_CP004_CATALOGUE,
  SAP_CP004_PROPOSED_QL_BY_PROTOTYPE,
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004Package as generateV1Package,
  type SapCp004Package,
  type SapCp004PrototypeId,
} from "./runtime";

export {
  SAP_CP004_CATALOGUE,
  SAP_CP004_PROPOSED_QL_BY_PROTOTYPE,
  SAP_CP004_PROTOTYPE_IDS,
};
export type {
  SapCp004Difficulty,
  SapCp004Option,
  SapCp004Oracle,
  SapCp004Package,
  SapCp004PrototypeId,
  SapCp004TaskDirection,
} from "./runtime";

function power(base: bigint, exponent: number): bigint {
  let result = 1n;
  for (let index = 0; index < exponent; index += 1) result *= base;
  return result;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function normalizedNumeric(value: string): string | null {
  const match = value.match(/^(-?\d+)(?:\/(-?\d+))?$/);
  if (!match) return null;
  let numerator = BigInt(match[1]!);
  let denominator = match[2] ? BigInt(match[2]) : 1n;
  if (denominator === 0n) return null;
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

function frameIndex(seed: number): number {
  return (seed - 1) % 4;
}

function remediate(pkg: SapCp004Package): SapCp004Package {
  let stem = pkg.stem;
  let difficulty = pkg.difficulty;
  let explanation = pkg.explanation;
  let oracle = pkg.oracle;
  let frameId = pkg.frameId;

  if (pkg.prototypeId === "SAP-CP004-PROT-BOUNDED-NTH-ROOT") {
    const index = oracle.data.index!;
    const radicand = oracle.data.radicand!;
    const name = index === 4 ? "fourth" : "fifth";
    const frames = [
      `Find the principal ${name} root of ${radicand}.`,
      `Which positive number raised to the power ${index} equals ${radicand}?`,
      `Evaluate the exact non-negative ${name} root of ${radicand}.`,
      `What is the principal ${name} root of ${radicand}?`,
    ] as const;
    const selected = frameIndex(pkg.seed);
    stem = frames[selected]!;
    frameId = `SAP-CP004-NTH-ROOT-V2-${selected + 1}`;
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-POWER-ROOT-CANCELLATION") {
    const base = oracle.data.base!;
    const add = oracle.data.add!;
    const index = pkg.seed % 2 === 0 ? 2 : 3;
    const exponentForm = index === 2 ? `√(${base}^2)` : `∛(${base}^3)`;
    const productForm = index === 2 ? `√(${base} × ${base})` : `∛(${base} × ${base} × ${base})`;
    const frames = [
      `Evaluate ${exponentForm} + ${add}.`,
      `Simplify ${productForm} + ${add}.`,
      `Find the exact value of ${exponentForm} + ${add}.`,
      `What is ${productForm} + ${add}?`,
    ] as const;
    const selected = frameIndex(pkg.seed);
    stem = frames[selected]!;
    frameId = `SAP-CP004-POWER-ROOT-V2-${index}-${selected + 1}`;
    const radicand = power(BigInt(base), index);
    const symbol = index === 2 ? "square root" : "cube root";
    explanation = Object.freeze({
      coreConcept: `For a positive numeric base, the exact ${symbol} reverses raising that base to the power ${index}.`,
      steps: Object.freeze([
        `${base}^${index} = ${radicand}.`,
        `The exact ${symbol} of ${radicand} is ${base}.`,
        `${base} + ${add} = ${base + add}.`,
      ]),
      finalAnswer: `Therefore, the exact value is ${base + add}.`,
    });
    oracle = Object.freeze({ kind: oracle.kind, data: Object.freeze({ ...oracle.data, index }) });
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-MISSING-EXPONENT") {
    const base = oracle.data.base!;
    const target = oracle.data.target!;
    const frames = [
      `Find the non-negative integer exponent x: ${base}^x = ${target}.`,
      `Which non-negative integer exponent makes ${base}^x = ${target} true?`,
      `Complete the exact equality ${base}^x = ${target}, where x is a non-negative integer.`,
      `For what non-negative integer x does ${base}^x equal ${target}?`,
    ] as const;
    const selected = frameIndex(pkg.seed);
    stem = frames[selected]!;
    frameId = `SAP-CP004-MISSING-EXP-V2-${selected + 1}`;
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-COMPARE-POWER-ROOT-EXPRESSIONS") {
    const aValue = Number(power(BigInt(oracle.data.aBase!), oracle.data.aExponent!));
    const bValue = oracle.data.bRoot!;
    difficulty = Math.max(aValue, bValue) <= 20 ? "EASY" : "MEDIUM";
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-NESTED-PERFECT-ROOT") {
    difficulty = oracle.data.innerIndex === 3 && oracle.data.radicand! > 1_000 ? "HARD" : "MEDIUM";
  }

  if (
    pkg.prototypeId === "SAP-CP004-PROT-FIRST-INCORRECT-POWER-ROOT-STEP"
    || pkg.prototypeId === "SAP-CP004-PROT-FIRST-INCORRECT-FACTORIAL-STEP"
  ) {
    const errorStep = oracle.data.errorStep!;
    difficulty = errorStep === 0 || errorStep === 3 ? "HARD" : "MEDIUM";
  }

  const validationErrors = [...pkg.validation.errors];
  if (["EXACT_INTEGER", "EXACT_RATIONAL", "MISSING_EXPONENT", "MISSING_RADICAND"].includes(pkg.answerSemantic)) {
    const normalized = pkg.options.map((option) => normalizedNumeric(option.value));
    if (normalized.some((value) => value === null)) validationErrors.push("A numeric-answer option is not an exact integer or rational literal.");
    if (new Set(normalized).size !== normalized.length) validationErrors.push("Two displayed options are numerically equivalent.");
  }

  const canonicalPayloadKey = JSON.stringify({
    prototypeId: pkg.prototypeId,
    stem,
    answer: pkg.canonicalAnswer,
    difficulty,
    oracle,
  });

  return Object.freeze({
    ...pkg,
    difficulty,
    frameId,
    stem,
    explanation,
    oracle,
    canonicalPayloadKey,
    generationIdentity: `${pkg.generationIdentity}:V2`,
    validation: Object.freeze({ ok: validationErrors.length === 0, errors: Object.freeze(validationErrors) }),
  });
}

export function generateSapCp004Package(
  prototypeId: SapCp004PrototypeId,
  seed: number,
  targetCorrectIndex?: number,
): SapCp004Package {
  return remediate(generateV1Package(prototypeId, seed, targetCorrectIndex));
}

export function generateSapCp004Sweep(seedsPerPrototype: number): readonly SapCp004Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) throw new Error("Sweep size must be a positive integer.");
  const packages: SapCp004Package[] = [];
  for (const prototypeId of SAP_CP004_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) packages.push(generateSapCp004Package(prototypeId, seed));
  }
  return Object.freeze(packages);
}
