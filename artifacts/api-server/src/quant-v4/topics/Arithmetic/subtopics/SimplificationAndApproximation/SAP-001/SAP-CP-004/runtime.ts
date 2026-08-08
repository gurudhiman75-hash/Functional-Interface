export const SAP_CP004_PROTOTYPE_IDS = [
  "SAP-CP004-PROT-POWER-MIXED-EXPRESSION",
  "SAP-CP004-PROT-ZERO-ONE-EXPONENT",
  "SAP-CP004-PROT-NEGATIVE-BASE-PARITY",
  "SAP-CP004-PROT-FRACTION-POWER",
  "SAP-CP004-PROT-PERFECT-SQUARE-ROOT",
  "SAP-CP004-PROT-PERFECT-CUBE-ROOT",
  "SAP-CP004-PROT-BOUNDED-NTH-ROOT",
  "SAP-CP004-PROT-EXACT-ROOT-OF-FRACTION",
  "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC",
  "SAP-CP004-PROT-POWER-ROOT-CANCELLATION",
  "SAP-CP004-PROT-NESTED-PERFECT-ROOT",
  "SAP-CP004-PROT-SMALL-FACTORIAL",
  "SAP-CP004-PROT-FACTORIAL-RATIO",
  "SAP-CP004-PROT-FACTORIAL-MIXED-EXPRESSION",
  "SAP-CP004-PROT-MISSING-EXPONENT",
  "SAP-CP004-PROT-MISSING-PERFECT-RADICAND",
  "SAP-CP004-PROT-COMPARE-POWER-ROOT-EXPRESSIONS",
  "SAP-CP004-PROT-FIRST-INCORRECT-POWER-ROOT-STEP",
  "SAP-CP004-PROT-FIRST-INCORRECT-FACTORIAL-STEP",
] as const;

export type SapCp004PrototypeId = (typeof SAP_CP004_PROTOTYPE_IDS)[number];
export type SapCp004Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SapCp004TaskDirection = "FORWARD" | "INVERSE" | "COMPARISON" | "DIAGNOSIS";

export interface SapCp004Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface SapCp004Oracle {
  readonly kind:
    | "POWER_EXPRESSION"
    | "ZERO_ONE_EXPONENT"
    | "NEGATIVE_BASE"
    | "FRACTION_POWER"
    | "SQUARE_ROOT"
    | "CUBE_ROOT"
    | "NTH_ROOT"
    | "FRACTION_ROOT"
    | "ROOT_ARITHMETIC"
    | "POWER_ROOT_CANCELLATION"
    | "NESTED_ROOT"
    | "FACTORIAL"
    | "FACTORIAL_RATIO"
    | "FACTORIAL_MIXED"
    | "MISSING_EXPONENT"
    | "MISSING_RADICAND"
    | "COMPARISON"
    | "DIAGNOSIS_POWER_ROOT"
    | "DIAGNOSIS_FACTORIAL";
  readonly data: Readonly<Record<string, number>>;
}

export interface SapCp004Package {
  readonly packageId: "SAP-001";
  readonly checkpointId: "SAP-CP-004";
  readonly prototypeId: SapCp004PrototypeId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: SapCp004Difficulty;
  readonly taskDirection: SapCp004TaskDirection;
  readonly answerSemantic: "EXACT_INTEGER" | "EXACT_RATIONAL" | "MISSING_EXPONENT" | "MISSING_RADICAND" | "COMPARISON_CLASS" | "STEP_LABEL";
  readonly frameId: string;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly options: readonly SapCp004Option[];
  readonly correctIndex: number;
  readonly explanation: {
    readonly coreConcept: string;
    readonly steps: readonly string[];
    readonly finalAnswer: string;
  };
  readonly oracle: SapCp004Oracle;
  readonly canonicalPayloadKey: string;
  readonly generationIdentity: string;
  readonly proposedPermanentQlId: string;
  readonly lifecycle: {
    readonly permanentQlId: null;
    readonly contentStatus: "ENGLISH_REVIEW_CANDIDATE";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
  readonly validation: {
    readonly ok: boolean;
    readonly errors: readonly string[];
  };
}

export const SAP_CP004_PROPOSED_QL_BY_PROTOTYPE: Readonly<Record<SapCp004PrototypeId, string>> = Object.freeze(
  Object.fromEntries(SAP_CP004_PROTOTYPE_IDS.map((id, index) => [id, `SAP-QL-${String(53 + index).padStart(3, "0")}`])) as Record<SapCp004PrototypeId, string>,
);

const TITLES: Readonly<Record<SapCp004PrototypeId, string>> = Object.freeze({
  "SAP-CP004-PROT-POWER-MIXED-EXPRESSION": "Small numeric powers in mixed arithmetic",
  "SAP-CP004-PROT-ZERO-ONE-EXPONENT": "Zero and one exponent evaluation",
  "SAP-CP004-PROT-NEGATIVE-BASE-PARITY": "Negative numeric base and exponent parity",
  "SAP-CP004-PROT-FRACTION-POWER": "Powers of exact fractions",
  "SAP-CP004-PROT-PERFECT-SQUARE-ROOT": "Perfect square roots",
  "SAP-CP004-PROT-PERFECT-CUBE-ROOT": "Perfect cube roots",
  "SAP-CP004-PROT-BOUNDED-NTH-ROOT": "Bounded exact nth roots",
  "SAP-CP004-PROT-EXACT-ROOT-OF-FRACTION": "Exact roots of fractions",
  "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC": "Exact root followed by mixed arithmetic",
  "SAP-CP004-PROT-POWER-ROOT-CANCELLATION": "Exact power-root cancellation",
  "SAP-CP004-PROT-NESTED-PERFECT-ROOT": "Bounded nested perfect roots",
  "SAP-CP004-PROT-SMALL-FACTORIAL": "Small factorial evaluation",
  "SAP-CP004-PROT-FACTORIAL-RATIO": "Bounded factorial ratios",
  "SAP-CP004-PROT-FACTORIAL-MIXED-EXPRESSION": "Factorials in mixed expressions",
  "SAP-CP004-PROT-MISSING-EXPONENT": "Missing exponent from bounded candidates",
  "SAP-CP004-PROT-MISSING-PERFECT-RADICAND": "Missing perfect radicand",
  "SAP-CP004-PROT-COMPARE-POWER-ROOT-EXPRESSIONS": "Comparison of exact power and root expressions",
  "SAP-CP004-PROT-FIRST-INCORRECT-POWER-ROOT-STEP": "First incorrect power or root step",
  "SAP-CP004-PROT-FIRST-INCORRECT-FACTORIAL-STEP": "First incorrect factorial step",
});

export const SAP_CP004_CATALOGUE = Object.freeze(SAP_CP004_PROTOTYPE_IDS.map((prototypeId) => Object.freeze({
  prototypeId,
  title: TITLES[prototypeId],
  proposedPermanentQlId: SAP_CP004_PROPOSED_QL_BY_PROTOTYPE[prototypeId],
})));

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}

function formatRat(numerator: bigint, denominator: bigint): string {
  if (denominator === 0n) throw new Error("Zero denominator.");
  let n = numerator;
  let d = denominator;
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  n /= divisor;
  d /= divisor;
  return d === 1n ? n.toString() : `${n}/${d}`;
}

export function sapCp004Pow(base: bigint, exponent: number): bigint {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error("Exponent must be a non-negative integer.");
  let result = 1n;
  for (let index = 0; index < exponent; index += 1) result *= base;
  return result;
}

export function sapCp004Factorial(n: number): bigint {
  if (!Number.isInteger(n) || n < 0 || n > 12) throw new Error("Factorial input is outside the bounded runtime.");
  let result = 1n;
  for (let value = 2; value <= n; value += 1) result *= BigInt(value);
  return result;
}

function hash(text: string): number {
  let value = 2166136261 >>> 0;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619) >>> 0;
  }
  value ^= value >>> 16;
  value = Math.imul(value, 2246822507) >>> 0;
  value ^= value >>> 13;
  return value >>> 0;
}

function bounded(seed: number, salt: number, minimum: number, maximum: number): number {
  const span = maximum - minimum + 1;
  return minimum + (hash(`${seed}:${salt}`) % span);
}

function choose<T>(items: readonly T[], seed: number, salt: number): T {
  return items[hash(`${seed}:${salt}`) % items.length]!;
}

function standardStem(expression: string, seed: number, suffix = ""): { frameId: string; stem: string } {
  const frames = [
    `Evaluate ${expression}${suffix}`,
    `Find the exact value of ${expression}${suffix}`,
    `Simplify ${expression}${suffix}`,
    `What is the value of ${expression}${suffix}`,
  ] as const;
  const frame = seed % frames.length;
  return { frameId: `SAP-CP004-FRAME-${frame + 1}`, stem: frames[frame]! };
}

interface WrongSpec {
  readonly value: string;
  readonly misconceptionId: string;
  readonly analysis: string;
}

function numericWrongSpecs(answer: bigint, candidates: readonly { value: bigint; id: string; analysis: string }[]): WrongSpec[] {
  const values = new Set<string>([answer.toString()]);
  const result: WrongSpec[] = [];
  for (const candidate of candidates) {
    const value = candidate.value.toString();
    if (values.has(value)) continue;
    values.add(value);
    result.push({ value, misconceptionId: candidate.id, analysis: candidate.analysis });
  }
  let offset = 1n;
  while (result.length < 3) {
    const value = (answer + offset).toString();
    if (!values.has(value)) {
      values.add(value);
      result.push({
        value,
        misconceptionId: "NEARBY_ARITHMETIC_SLIP",
        analysis: "This is a nearby value produced by a small arithmetic slip after the special form is evaluated.",
      });
    }
    offset += 1n;
  }
  return result.slice(0, 3);
}

function rationalWrongSpecs(answer: string, candidates: readonly { value: string; id: string; analysis: string }[]): WrongSpec[] {
  const values = new Set<string>([answer]);
  const result: WrongSpec[] = [];
  for (const candidate of candidates) {
    if (values.has(candidate.value)) continue;
    values.add(candidate.value);
    result.push({ value: candidate.value, misconceptionId: candidate.id, analysis: candidate.analysis });
  }
  let numerator = 2n;
  while (result.length < 3) {
    const value = `${numerator}/3`;
    if (!values.has(value)) {
      values.add(value);
      result.push({
        value,
        misconceptionId: "NEARBY_FRACTION_SLIP",
        analysis: "This reduced fraction is a plausible nearby result from applying the power or root to only part of the fraction.",
      });
    }
    numerator += 1n;
  }
  return result.slice(0, 3);
}

function makeOptions(correctValue: string, wrong: readonly WrongSpec[], seed: number, prototypeId: SapCp004PrototypeId, targetCorrectIndex?: number): readonly SapCp004Option[] {
  const index = targetCorrectIndex ?? (hash(`${prototypeId}:${seed}:answer`) % 4);
  if (index < 0 || index > 3) throw new Error("Correct option index must be 0..3.");
  const rotated = [...wrong];
  const rotation = hash(`${prototypeId}:${seed}:wrong-order`) % 3;
  for (let count = 0; count < rotation; count += 1) rotated.push(rotated.shift()!);
  const options: SapCp004Option[] = [];
  let wrongIndex = 0;
  for (let position = 0; position < 4; position += 1) {
    if (position === index) {
      options.push({
        value: correctValue,
        isCorrect: true,
        misconceptionId: null,
        analysis: "This option follows the exact bounded power, root or factorial evaluation required by the expression.",
      });
    } else {
      const item = rotated[wrongIndex++]!;
      options.push({ value: item.value, isCorrect: false, misconceptionId: item.misconceptionId, analysis: item.analysis });
    }
  }
  return Object.freeze(options);
}

interface BuildResult {
  readonly difficulty: SapCp004Difficulty;
  readonly taskDirection: SapCp004TaskDirection;
  readonly answerSemantic: SapCp004Package["answerSemantic"];
  readonly frameId: string;
  readonly stem: string;
  readonly answer: string;
  readonly wrong: readonly WrongSpec[];
  readonly explanation: SapCp004Package["explanation"];
  readonly oracle: SapCp004Oracle;
}

function build(prototypeId: SapCp004PrototypeId, seed: number): BuildResult {
  switch (prototypeId) {
    case "SAP-CP004-PROT-POWER-MIXED-EXPRESSION": {
      const base = bounded(seed, 1, 2, 9);
      const exponent = bounded(seed, 2, 2, 4);
      const add = bounded(seed, 3, 2, 25);
      const power = sapCp004Pow(BigInt(base), exponent);
      const answer = power + BigInt(add);
      const shown = standardStem(`${base}^${exponent} + ${add}.`, seed);
      return {
        difficulty: exponent === 4 ? "MEDIUM" : "EASY", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER",
        ...shown, answer: answer.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: BigInt(base * exponent + add), id: "EXPONENT_AS_MULTIPLICATION", analysis: "This treats the exponent as multiplication, using base × exponent instead of repeated multiplication." },
          { value: power - BigInt(add), id: "ADDITION_READ_AS_SUBTRACTION", analysis: "The power is evaluated correctly, but the final addition is incorrectly changed to subtraction." },
          { value: sapCp004Pow(BigInt(base + add), exponent), id: "EXPONENT_APPLIED_TO_WHOLE_SUM", analysis: "This incorrectly applies the exponent to the whole visible sum rather than to the base alone." },
        ]),
        explanation: {
          coreConcept: "An exponent tells how many times the base is multiplied by itself; evaluate that power before the final addition.",
          steps: [`${base}^${exponent} = ${power}.`, `${power} + ${add} = ${answer}.`],
          finalAnswer: `Therefore, the exact value is ${answer}.`,
        },
        oracle: { kind: "POWER_EXPRESSION", data: { base, exponent, add } },
      };
    }
    case "SAP-CP004-PROT-ZERO-ONE-EXPONENT": {
      const base = bounded(seed, 10, 2, 15);
      const other = bounded(seed, 11, 2, 30);
      const answer = BigInt(1 + other);
      const shown = standardStem(`${base}^0 + ${other}^1.`, seed);
      return {
        difficulty: "EASY", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", ...shown, answer: answer.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: BigInt(other), id: "ZERO_POWER_AS_ZERO", analysis: "This assumes a non-zero number raised to the power zero is zero instead of one." },
          { value: BigInt(base + other), id: "EXPONENTS_IGNORED", analysis: "This ignores both exponents and simply adds the two displayed bases." },
          { value: BigInt(base), id: "ONE_POWER_TERM_DROPPED", analysis: "This keeps the wrong term and drops the number raised to the first power." },
        ]),
        explanation: {
          coreConcept: "For a non-zero base, a^0 = 1, while a^1 = a.",
          steps: [`${base}^0 = 1.`, `${other}^1 = ${other}.`, `1 + ${other} = ${answer}.`],
          finalAnswer: `Therefore, the exact value is ${answer}.`,
        },
        oracle: { kind: "ZERO_ONE_EXPONENT", data: { base, other } },
      };
    }
    case "SAP-CP004-PROT-NEGATIVE-BASE-PARITY": {
      const base = bounded(seed, 20, 2, 8);
      const exponent = bounded(seed, 21, 2, 5);
      const add = bounded(seed, 22, 1, 14);
      const signedPower = sapCp004Pow(BigInt(-base), exponent);
      const absolutePower = sapCp004Pow(BigInt(base), exponent);
      const answer = signedPower + BigInt(add);
      const shown = standardStem(`(-${base})^${exponent} + ${add}.`, seed);
      return {
        difficulty: "MEDIUM", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", ...shown, answer: answer.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: absolutePower + BigInt(add), id: "NEGATIVE_BASE_ALWAYS_POSITIVE", analysis: "This ignores that an odd exponent keeps the negative sign of a negative base." },
          { value: -absolutePower - BigInt(add), id: "FINAL_SIGN_PROPAGATION_ERROR", analysis: "This carries the negative sign through the final addition and changes the operation." },
          { value: BigInt(-base * exponent + add), id: "EXPONENT_AS_MULTIPLICATION", analysis: "This replaces repeated multiplication by base × exponent and therefore loses the parity rule." },
        ]),
        explanation: {
          coreConcept: "A negative base raised to an even exponent is positive; raised to an odd exponent it remains negative.",
          steps: [`(-${base})^${exponent} = ${signedPower} because the exponent is ${exponent % 2 === 0 ? "even" : "odd"}.`, `${signedPower} + ${add} = ${answer}.`],
          finalAnswer: `Therefore, the exact value is ${answer}.`,
        },
        oracle: { kind: "NEGATIVE_BASE", data: { base, exponent, add } },
      };
    }
    case "SAP-CP004-PROT-FRACTION-POWER": {
      const numerator = bounded(seed, 30, 2, 8);
      const denominator = numerator + bounded(seed, 31, 1, 7);
      const exponent = bounded(seed, 32, 2, 3);
      const nPower = sapCp004Pow(BigInt(numerator), exponent);
      const dPower = sapCp004Pow(BigInt(denominator), exponent);
      const answer = formatRat(nPower, dPower);
      const shown = standardStem(`(${numerator}/${denominator})^${exponent}. Give the answer as a reduced fraction.`, seed);
      return {
        difficulty: exponent === 3 ? "MEDIUM" : "EASY", taskDirection: "FORWARD", answerSemantic: "EXACT_RATIONAL", ...shown, answer,
        wrong: rationalWrongSpecs(answer, [
          { value: formatRat(BigInt(numerator * exponent), BigInt(denominator * exponent)), id: "EXPONENT_MULTIPLIES_TERMS", analysis: "This multiplies the numerator and denominator by the exponent instead of raising each to that power." },
          { value: formatRat(nPower, BigInt(denominator)), id: "DENOMINATOR_NOT_POWERED", analysis: "This applies the exponent to the numerator but leaves the denominator unchanged." },
          { value: formatRat(BigInt(numerator), dPower), id: "NUMERATOR_NOT_POWERED", analysis: "This applies the exponent only to the denominator and not to the complete fraction." },
        ]),
        explanation: {
          coreConcept: "A power of a fraction applies to both numerator and denominator before the result is reduced.",
          steps: [`(${numerator}/${denominator})^${exponent} = ${numerator}^${exponent}/${denominator}^${exponent}.`, `${numerator}^${exponent} = ${nPower} and ${denominator}^${exponent} = ${dPower}.`, `${nPower}/${dPower} = ${answer} in lowest terms.`],
          finalAnswer: `Therefore, the reduced fraction is ${answer}.`,
        },
        oracle: { kind: "FRACTION_POWER", data: { numerator, denominator, exponent } },
      };
    }
    case "SAP-CP004-PROT-PERFECT-SQUARE-ROOT": {
      const root = bounded(seed, 40, 2, 35);
      const radicand = root * root;
      const shown = standardStem(`√${radicand}.`, seed);
      const answer = BigInt(root);
      return {
        difficulty: root > 20 ? "MEDIUM" : "EASY", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", ...shown, answer: root.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: BigInt(radicand), id: "ROOT_SYMBOL_IGNORED", analysis: "This repeats the radicand and ignores that the square root asks for the number whose square is shown." },
          { value: BigInt(root + 1), id: "ADJACENT_ROOT", analysis: "This chooses the next integer, but its square does not equal the displayed radicand." },
          { value: BigInt(root - 1), id: "ADJACENT_ROOT", analysis: "This chooses the previous integer, but its square is smaller than the displayed radicand." },
        ]),
        explanation: {
          coreConcept: "The principal square root of a perfect square is the non-negative number that squares to the radicand.",
          steps: [`${root} × ${root} = ${radicand}.`, `Therefore, √${radicand} = ${root}.`],
          finalAnswer: `The exact square root is ${root}.`,
        },
        oracle: { kind: "SQUARE_ROOT", data: { root, radicand } },
      };
    }
    case "SAP-CP004-PROT-PERFECT-CUBE-ROOT": {
      const root = bounded(seed, 50, 2, 18);
      const radicand = root * root * root;
      const shown = standardStem(`∛${radicand}.`, seed);
      const answer = BigInt(root);
      return {
        difficulty: root > 10 ? "MEDIUM" : "EASY", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", ...shown, answer: root.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: BigInt(root * root), id: "CUBE_ROOT_AS_SQUARE", analysis: "This stops after multiplying the root twice and confuses a cube with a square." },
          { value: BigInt(root + 1), id: "ADJACENT_CUBE_ROOT", analysis: "The next integer has a larger cube and therefore is not the exact cube root." },
          { value: BigInt(root - 1), id: "ADJACENT_CUBE_ROOT", analysis: "The previous integer has a smaller cube and therefore is not the exact cube root." },
        ]),
        explanation: {
          coreConcept: "The cube root is the number that produces the radicand when multiplied by itself three times.",
          steps: [`${root} × ${root} × ${root} = ${radicand}.`, `Therefore, ∛${radicand} = ${root}.`],
          finalAnswer: `The exact cube root is ${root}.`,
        },
        oracle: { kind: "CUBE_ROOT", data: { root, radicand } },
      };
    }
    case "SAP-CP004-PROT-BOUNDED-NTH-ROOT": {
      const index = choose([4, 5] as const, seed, 60);
      const root = bounded(seed, 61, 2, index === 4 ? 8 : 5);
      const radicand = Number(sapCp004Pow(BigInt(root), index));
      const name = index === 4 ? "fourth" : "fifth";
      const frames = [
        `Find the exact ${name} root of ${radicand}.`,
        `Which number raised to the power ${index} equals ${radicand}?`,
        `Evaluate the exact ${name} root of ${radicand}.`,
        `The ${name} root of ${radicand} is what number?`,
      ] as const;
      const frame = seed % 4;
      const answer = BigInt(root);
      return {
        difficulty: "MEDIUM", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", frameId: `SAP-CP004-NTH-ROOT-${frame + 1}`, stem: frames[frame]!, answer: root.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: BigInt(index), id: "INDEX_AS_ANSWER", analysis: "This reports the root index instead of finding the base whose repeated product gives the radicand." },
          { value: BigInt(root + 1), id: "ADJACENT_NTH_ROOT", analysis: "The next integer raised to the stated power is greater than the radicand." },
          { value: BigInt(root - 1), id: "ADJACENT_NTH_ROOT", analysis: "The previous integer raised to the stated power is smaller than the radicand." },
        ]),
        explanation: {
          coreConcept: `An exact ${name} root reverses raising a number to the power ${index}.`,
          steps: [`${root}^${index} = ${radicand}.`, `Therefore, the exact ${name} root of ${radicand} is ${root}.`],
          finalAnswer: `The exact root is ${root}.`,
        },
        oracle: { kind: "NTH_ROOT", data: { root, index, radicand } },
      };
    }
    case "SAP-CP004-PROT-EXACT-ROOT-OF-FRACTION": {
      const index = choose([2, 3] as const, seed, 70);
      const numeratorRoot = bounded(seed, 71, 2, 8);
      const denominatorRoot = numeratorRoot + bounded(seed, 72, 1, 7);
      const numerator = sapCp004Pow(BigInt(numeratorRoot), index);
      const denominator = sapCp004Pow(BigInt(denominatorRoot), index);
      const answer = formatRat(BigInt(numeratorRoot), BigInt(denominatorRoot));
      const radical = index === 2 ? `√(${numerator}/${denominator})` : `∛(${numerator}/${denominator})`;
      const shown = standardStem(`${radical}. Give the answer as a reduced fraction.`, seed);
      return {
        difficulty: "MEDIUM", taskDirection: "FORWARD", answerSemantic: "EXACT_RATIONAL", ...shown, answer,
        wrong: rationalWrongSpecs(answer, [
          { value: formatRat(numerator, denominator), id: "ROOT_SYMBOL_IGNORED", analysis: "This leaves the perfect-power fraction unchanged instead of taking the root of numerator and denominator." },
          { value: formatRat(BigInt(denominatorRoot), BigInt(numeratorRoot)), id: "FRACTION_INVERTED", analysis: "This takes the correct component roots but reverses numerator and denominator." },
          { value: formatRat(BigInt(numeratorRoot + 1), BigInt(denominatorRoot)), id: "NUMERATOR_ROOT_OFF_BY_ONE", analysis: "The numerator root is one too large, so raising it back does not reproduce the numerator." },
        ]),
        explanation: {
          coreConcept: "For a positive perfect-power fraction, take the exact root of the numerator and denominator separately, then reduce.",
          steps: [`${numeratorRoot}^${index} = ${numerator} and ${denominatorRoot}^${index} = ${denominator}.`, `${radical} = ${numeratorRoot}/${denominatorRoot}.`, `${numeratorRoot}/${denominatorRoot} = ${answer} in lowest terms.`],
          finalAnswer: `Therefore, the reduced fraction is ${answer}.`,
        },
        oracle: { kind: "FRACTION_ROOT", data: { numeratorRoot, denominatorRoot, index } },
      };
    }
    case "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC": {
      const index = choose([2, 3] as const, seed, 80);
      const root = bounded(seed, 81, 2, 15);
      const multiplier = bounded(seed, 82, 2, 9);
      const add = bounded(seed, 83, 1, 20);
      const radicand = Number(sapCp004Pow(BigInt(root), index));
      const symbol = index === 2 ? `√${radicand}` : `∛${radicand}`;
      const answer = BigInt(root * multiplier + add);
      const shown = standardStem(`${multiplier} × ${symbol} + ${add}.`, seed);
      return {
        difficulty: "MEDIUM", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", ...shown, answer: answer.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: BigInt(radicand * multiplier + add), id: "ROOT_NOT_EVALUATED", analysis: "This multiplies by the radicand itself rather than by its exact root." },
          { value: BigInt(root + multiplier + add), id: "MULTIPLICATION_AS_ADDITION", analysis: "The exact root is found, but the multiplication by the coefficient is changed to addition." },
          { value: BigInt(root * multiplier - add), id: "FINAL_OPERATION_SIGN_ERROR", analysis: "The root and product are correct, but the final addition is incorrectly changed to subtraction." },
        ]),
        explanation: {
          coreConcept: "Evaluate the exact root first, then follow the ordinary multiplication-before-addition order.",
          steps: [`${symbol} = ${root}.`, `${multiplier} × ${root} = ${root * multiplier}.`, `${root * multiplier} + ${add} = ${answer}.`],
          finalAnswer: `Therefore, the exact value is ${answer}.`,
        },
        oracle: { kind: "ROOT_ARITHMETIC", data: { root, index, multiplier, add } },
      };
    }
    case "SAP-CP004-PROT-POWER-ROOT-CANCELLATION": {
      const base = bounded(seed, 90, 2, 25);
      const add = bounded(seed, 91, 1, 15);
      const square = base * base;
      const answer = BigInt(base + add);
      const frames = [
        `Evaluate √(${base}^2) + ${add}.`,
        `Find the exact value of √${square} + ${add}.`,
        `Simplify √(${square}) + ${add}.`,
        `What is √(${base} × ${base}) + ${add}?`,
      ] as const;
      const frame = seed % 4;
      return {
        difficulty: "MEDIUM", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", frameId: `SAP-CP004-POWER-ROOT-${frame + 1}`, stem: frames[frame]!, answer: answer.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: BigInt(square + add), id: "ROOT_IGNORED", analysis: "This evaluates the square but does not apply the square root before adding the final term." },
          { value: BigInt(base - add), id: "FINAL_ADDITION_REVERSED", analysis: "The power-root cancellation is correct, but the final addition is changed to subtraction." },
          { value: BigInt(2 * base + add), id: "ROOT_AS_DOUBLING", analysis: "This treats the square root of a square as twice the base instead of the base itself." },
        ]),
        explanation: {
          coreConcept: "For a positive numeric base, taking the square root of its square returns that base exactly.",
          steps: [`${base}^2 = ${square}.`, `√${square} = ${base}.`, `${base} + ${add} = ${answer}.`],
          finalAnswer: `Therefore, the exact value is ${answer}.`,
        },
        oracle: { kind: "POWER_ROOT_CANCELLATION", data: { base, add } },
      };
    }
    case "SAP-CP004-PROT-NESTED-PERFECT-ROOT": {
      const innerIndex = choose([2, 3] as const, seed, 100);
      const outerIndex = 2;
      const root = bounded(seed, 101, 2, innerIndex === 3 ? 5 : 10);
      const radicand = Number(sapCp004Pow(BigInt(root), innerIndex * outerIndex));
      const innerSymbol = innerIndex === 2 ? `√${radicand}` : `∛${radicand}`;
      const expression = `√(${innerSymbol})`;
      const shown = standardStem(`${expression}.`, seed);
      const answer = BigInt(root);
      const innerValue = Number(sapCp004Pow(BigInt(root), outerIndex));
      return {
        difficulty: "HARD", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", ...shown, answer: root.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: BigInt(innerValue), id: "OUTER_ROOT_SKIPPED", analysis: "This evaluates only the inner exact root and stops before applying the outer square root." },
          { value: BigInt(root + 1), id: "ADJACENT_NESTED_ROOT", analysis: "This nearby integer does not reproduce the nested perfect-power structure when the roots are reversed." },
          { value: BigInt(innerIndex * outerIndex), id: "ROOT_INDICES_MULTIPLIED_AS_ANSWER", analysis: "Multiplying root indices identifies the combined power but does not itself give the root value." },
        ]),
        explanation: {
          coreConcept: "Evaluate nested roots from the inside outward, verifying each layer as an exact perfect power.",
          steps: [`The inner ${innerIndex === 2 ? "square" : "cube"} root of ${radicand} is ${innerValue}.`, `√${innerValue} = ${root}.`],
          finalAnswer: `Therefore, the nested exact root is ${root}.`,
        },
        oracle: { kind: "NESTED_ROOT", data: { root, innerIndex, outerIndex, radicand } },
      };
    }
    case "SAP-CP004-PROT-SMALL-FACTORIAL": {
      const n = bounded(seed, 110, 3, 8);
      const factorial = sapCp004Factorial(n);
      const frames = [
        `Evaluate ${n}!.`,
        `Find the exact value of ${n} factorial.`,
        `Expand and calculate ${n}!.`,
        `What is the product represented by ${n}!?`,
      ] as const;
      const frame = seed % 4;
      return {
        difficulty: n >= 7 ? "MEDIUM" : "EASY", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", frameId: `SAP-CP004-FACTORIAL-${frame + 1}`, stem: frames[frame]!, answer: factorial.toString(),
        wrong: numericWrongSpecs(factorial, [
          { value: BigInt(n * (n - 1)), id: "FACTORIAL_ONLY_TWO_FACTORS", analysis: "This multiplies only the first two descending factors and stops before reaching 1." },
          { value: sapCp004Factorial(n - 1), id: "FACTORIAL_STOPS_ONE_EARLY", analysis: "This evaluates (n − 1)! and omits the leading factor n from the factorial product." },
          { value: factorial + BigInt(n), id: "FACTORIAL_PLUS_INPUT", analysis: "This correctly recalls the factorial value but then adds the input without any operation requiring it." },
        ]),
        explanation: {
          coreConcept: "A factorial is the product of all positive integers from the given number down to 1.",
          steps: [`${n}! = ${Array.from({ length: n }, (_, index) => n - index).join(" × ")}.`, `The product is ${factorial}.`],
          finalAnswer: `Therefore, ${n}! = ${factorial}.`,
        },
        oracle: { kind: "FACTORIAL", data: { n } },
      };
    }
    case "SAP-CP004-PROT-FACTORIAL-RATIO": {
      const n = bounded(seed, 120, 5, 9);
      const k = bounded(seed, 121, 2, Math.min(4, n - 2));
      const denominatorN = n - k;
      const value = sapCp004Factorial(n) / sapCp004Factorial(denominatorN);
      const shown = standardStem(`${n}!/${denominatorN}!.`, seed);
      return {
        difficulty: k >= 3 ? "MEDIUM" : "EASY", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", ...shown, answer: value.toString(),
        wrong: numericWrongSpecs(value, [
          { value: BigInt(n * denominatorN), id: "FACTORIAL_SYMBOLS_IGNORED", analysis: "This multiplies the displayed numbers and ignores that both terms are factorials." },
          { value: sapCp004Factorial(k), id: "FACTORIAL_DIFFERENCE_TAKEN", analysis: "This uses the difference of the factorial inputs as a new factorial, which is not a valid quotient rule." },
          { value: sapCp004Factorial(n) / sapCp004Factorial(k), id: "WRONG_DENOMINATOR_FACTORIAL", analysis: "This divides by k! instead of by the factorial actually shown in the denominator." },
        ]),
        explanation: {
          coreConcept: "In a bounded factorial ratio, expand only until the denominator factorial appears, then cancel that complete common product.",
          steps: [`${n}! = ${Array.from({ length: k }, (_, index) => n - index).join(" × ")} × ${denominatorN}!.`, `After cancelling ${denominatorN}!, the value is ${Array.from({ length: k }, (_, index) => n - index).join(" × ")} = ${value}.`],
          finalAnswer: `Therefore, the exact factorial ratio is ${value}.`,
        },
        oracle: { kind: "FACTORIAL_RATIO", data: { n, k } },
      };
    }
    case "SAP-CP004-PROT-FACTORIAL-MIXED-EXPRESSION": {
      const n = bounded(seed, 130, 4, 8);
      const base = bounded(seed, 131, 2, 9);
      const answer = BigInt(n) + sapCp004Pow(BigInt(base), 2);
      const shown = standardStem(`${n}!/${n - 1}! + ${base}^2.`, seed);
      return {
        difficulty: "MEDIUM", taskDirection: "FORWARD", answerSemantic: "EXACT_INTEGER", ...shown, answer: answer.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: sapCp004Factorial(n) + sapCp004Pow(BigInt(base), 2), id: "FACTORIAL_RATIO_NOT_CANCELLED", analysis: "This uses n! directly and ignores the division by (n − 1)! in the first term." },
          { value: BigInt(n + 2 * base), id: "EXPONENT_AS_MULTIPLICATION", analysis: "The factorial ratio is simplified correctly, but the square is replaced by multiplication by 2." },
          { value: BigInt(n) * sapCp004Pow(BigInt(base), 2), id: "ADDITION_AS_MULTIPLICATION", analysis: "Both special forms are evaluated, but the final addition is incorrectly changed to multiplication." },
        ]),
        explanation: {
          coreConcept: "Evaluate each bounded special form exactly, then combine the resulting ordinary numbers using the displayed operation.",
          steps: [`${n}!/${n - 1}! = ${n}.`, `${base}^2 = ${base * base}.`, `${n} + ${base * base} = ${answer}.`],
          finalAnswer: `Therefore, the exact value is ${answer}.`,
        },
        oracle: { kind: "FACTORIAL_MIXED", data: { n, base } },
      };
    }
    case "SAP-CP004-PROT-MISSING-EXPONENT": {
      const base = bounded(seed, 140, 2, 7);
      const exponent = bounded(seed, 141, 0, 5);
      const target = sapCp004Pow(BigInt(base), exponent);
      const frames = [
        `Find the missing exponent: ${base}^□ = ${target}.`,
        `Which exponent makes ${base}^x = ${target} true?`,
        `Complete the exact equality ${base}^□ = ${target}.`,
        `For what non-negative integer x does ${base}^x equal ${target}?`,
      ] as const;
      const frame = seed % 4;
      const answer = BigInt(exponent);
      return {
        difficulty: exponent <= 2 ? "EASY" : "MEDIUM", taskDirection: "INVERSE", answerSemantic: "MISSING_EXPONENT", frameId: `SAP-CP004-MISSING-EXP-${frame + 1}`, stem: frames[frame]!, answer: exponent.toString(),
        wrong: numericWrongSpecs(answer, [
          { value: BigInt(exponent + 1), id: "EXPONENT_ONE_TOO_LARGE", analysis: "Raising the base to this exponent multiplies by the base once too many and exceeds the target." },
          { value: BigInt(Math.max(0, exponent - 1)), id: "EXPONENT_ONE_TOO_SMALL", analysis: "This exponent stops one multiplication early and does not reach the target value." },
          { value: BigInt(base * exponent), id: "EXPONENT_AS_PRODUCT", analysis: "This confuses the exponent with base × exponent rather than counting repeated factors of the base." },
        ]),
        explanation: {
          coreConcept: "Recover a bounded exponent by expressing the target as repeated multiplication of the stated base.",
          steps: [`${target} = ${exponent === 0 ? "1" : Array.from({ length: exponent }, () => String(base)).join(" × ")}.`, `That product contains ${exponent} factor${exponent === 1 ? "" : "s"} of ${base}.`, `Check: ${base}^${exponent} = ${target}.`],
          finalAnswer: `Therefore, the missing exponent is ${exponent}.`,
        },
        oracle: { kind: "MISSING_EXPONENT", data: { base, exponent, target: Number(target) } },
      };
    }
    case "SAP-CP004-PROT-MISSING-PERFECT-RADICAND": {
      const index = choose([2, 3, 4] as const, seed, 150);
      const root = bounded(seed, 151, 2, index === 4 ? 8 : 15);
      const radicand = sapCp004Pow(BigInt(root), index);
      const name = index === 2 ? "square" : index === 3 ? "cube" : "fourth";
      const frames = [
        `Find the missing radicand: the exact ${name} root of □ is ${root}.`,
        `Which number has ${root} as its exact ${name} root?`,
        `Complete the equality: ${name} root of □ = ${root}.`,
        `If x has exact ${name} root ${root}, find x.`,
      ] as const;
      const frame = seed % 4;
      return {
        difficulty: index === 2 ? "EASY" : "MEDIUM", taskDirection: "INVERSE", answerSemantic: "MISSING_RADICAND", frameId: `SAP-CP004-MISSING-RAD-${frame + 1}`, stem: frames[frame]!, answer: radicand.toString(),
        wrong: numericWrongSpecs(radicand, [
          { value: BigInt(root * index), id: "ROOT_MULTIPLIED_BY_INDEX", analysis: "This multiplies the root by the index instead of raising the root to that power." },
          { value: sapCp004Pow(BigInt(root), Math.max(1, index - 1)), id: "ONE_POWER_TOO_FEW", analysis: "This uses one fewer repeated factor, so taking the stated root will not return the given number." },
          { value: sapCp004Pow(BigInt(root + 1), index), id: "ADJACENT_PERFECT_POWER", analysis: "This is the perfect power of the next integer, not the perfect power of the stated root." },
        ]),
        explanation: {
          coreConcept: `Reverse an exact ${name} root by raising the stated root to the power ${index}.`,
          steps: [`The missing radicand is ${root}^${index}.`, `${root}^${index} = ${radicand}.`, `Check: the exact ${name} root of ${radicand} is ${root}.`],
          finalAnswer: `Therefore, the missing radicand is ${radicand}.`,
        },
        oracle: { kind: "MISSING_RADICAND", data: { root, index } },
      };
    }
    case "SAP-CP004-PROT-COMPARE-POWER-ROOT-EXPRESSIONS": {
      const aBase = bounded(seed, 160, 2, 9);
      const aExponent = bounded(seed, 161, 2, 3);
      const aValue = Number(sapCp004Pow(BigInt(aBase), aExponent));
      const relationCase = bounded(seed, 162, 0, 2);
      const bRoot = relationCase === 0 ? aValue : relationCase === 1 ? Math.max(2, aValue - bounded(seed, 163, 1, 5)) : aValue + bounded(seed, 164, 1, 5);
      const bIndex = choose([2, 3] as const, seed, 165);
      const bRadicand = Number(sapCp004Pow(BigInt(bRoot), bIndex));
      const bExpr = bIndex === 2 ? `√${bRadicand}` : `∛${bRadicand}`;
      const answer = aValue === bRoot ? "A = B" : aValue > bRoot ? "A > B" : "A < B";
      const frames = [
        `Compare A = ${aBase}^${aExponent} and B = ${bExpr}.`,
        `Which relation is correct if A = ${aBase}^${aExponent} and B = ${bExpr}?`,
        `Evaluate both exactly and compare: A = ${aBase}^${aExponent}, B = ${bExpr}.`,
        `Choose the correct comparison between ${aBase}^${aExponent} and ${bExpr}.`,
      ] as const;
      const frame = seed % 4;
      const labels = ["A > B", "A < B", "A = B", "Cannot be determined"];
      const wrong = labels.filter((label) => label !== answer).map((value) => ({
        value,
        misconceptionId: value === "Cannot be determined" ? "EXACT_VALUES_NOT_EVALUATED" : "COMPARISON_DIRECTION_ERROR",
        analysis: value === "Cannot be determined"
          ? "Both expressions have exact bounded values, so their relation can be determined directly."
          : "This relation does not match the two exact values obtained from the power and the perfect root.",
      }));
      return {
        difficulty: "HARD", taskDirection: "COMPARISON", answerSemantic: "COMPARISON_CLASS", frameId: `SAP-CP004-COMPARE-${frame + 1}`, stem: frames[frame]!, answer,
        wrong,
        explanation: {
          coreConcept: "Evaluate both bounded special forms exactly before comparing; do not compare only their visible bases or radicands.",
          steps: [`A = ${aBase}^${aExponent} = ${aValue}.`, `B = ${bExpr} = ${bRoot}.`, `${aValue} ${aValue === bRoot ? "=" : aValue > bRoot ? ">" : "<"} ${bRoot}.`],
          finalAnswer: `Therefore, ${answer}.`,
        },
        oracle: { kind: "COMPARISON", data: { aBase, aExponent, bRoot, bIndex } },
      };
    }
    case "SAP-CP004-PROT-FIRST-INCORRECT-POWER-ROOT-STEP": {
      const base = bounded(seed, 170, 2, 7);
      const exponent = bounded(seed, 171, 2, 4);
      const root = bounded(seed, 172, 2, 12);
      const power = Number(sapCp004Pow(BigInt(base), exponent));
      const radicand = root * root;
      const errorStep = bounded(seed, 173, 0, 3);
      const step1Value = errorStep === 1 ? power + base : power;
      const step2Value = errorStep === 2 ? root + 1 : root;
      const correctTotal = power + root;
      const step3Value = errorStep === 3 ? correctTotal + 1 : step1Value + step2Value;
      const answer = errorStep === 0 ? "No error" : `Step ${errorStep}`;
      const stem = `A student evaluates ${base}^${exponent} + √${radicand}:\nStep 1: ${base}^${exponent} = ${step1Value}\nStep 2: √${radicand} = ${step2Value}\nStep 3: The value is ${step3Value}\nWhich is the first incorrect step?`;
      const labels = ["Step 1", "Step 2", "Step 3", "No error"];
      const wrong = labels.filter((label) => label !== answer).map((value) => ({
        value,
        misconceptionId: "FIRST_ERROR_POSITION_MISREAD",
        analysis: errorStep === 0
          ? "Every displayed equality preserves the original value, so selecting an error step is incorrect."
          : value === "No error"
            ? `The displayed value first changes at Step ${errorStep}, so the solution is not error-free.`
            : `This is not the earliest invalid step; the first value-changing error occurs at Step ${errorStep}.`,
      }));
      return {
        difficulty: "HARD", taskDirection: "DIAGNOSIS", answerSemantic: "STEP_LABEL", frameId: `SAP-CP004-DIAG-POWER-${errorStep}`, stem, answer,
        wrong,
        explanation: {
          coreConcept: "The first incorrect step is the earliest displayed equality that changes the exact value of the expression.",
          steps: [`The correct power value is ${base}^${exponent} = ${power}.`, `The correct root value is √${radicand} = ${root}.`, `The correct total is ${power} + ${root} = ${correctTotal}.`, errorStep === 0 ? "All three displayed steps match these exact values." : `Step ${errorStep} is the first displayed step that differs from the exact route.`],
          finalAnswer: `Therefore, the answer is ${answer}.`,
        },
        oracle: { kind: "DIAGNOSIS_POWER_ROOT", data: { errorStep } },
      };
    }
    case "SAP-CP004-PROT-FIRST-INCORRECT-FACTORIAL-STEP": {
      const n = bounded(seed, 180, 5, 8);
      const m = bounded(seed, 181, 3, 5);
      const factorialM = Number(sapCp004Factorial(m));
      const correctTotal = n + factorialM;
      const errorStep = bounded(seed, 182, 0, 3);
      const step1Value = errorStep === 1 ? n - 1 : n;
      const step2Value = errorStep === 2 ? factorialM + m : factorialM;
      const step3Value = errorStep === 3 ? correctTotal + 1 : step1Value + step2Value;
      const answer = errorStep === 0 ? "No error" : `Step ${errorStep}`;
      const stem = `A student evaluates ${n}!/${n - 1}! + ${m}!: \nStep 1: ${n}!/${n - 1}! = ${step1Value}\nStep 2: ${m}! = ${step2Value}\nStep 3: The value is ${step3Value}\nWhich is the first incorrect step?`;
      const labels = ["Step 1", "Step 2", "Step 3", "No error"];
      const wrong = labels.filter((label) => label !== answer).map((value) => ({
        value,
        misconceptionId: "FIRST_FACTORIAL_ERROR_POSITION_MISREAD",
        analysis: errorStep === 0
          ? "The factorial ratio, the factorial value and the final sum are all exact, so no step is incorrect."
          : value === "No error"
            ? `The first incorrect equality appears at Step ${errorStep}, so the work is not fully valid.`
            : `This is not the earliest invalid step; Step ${errorStep} is where the displayed value first changes.`,
      }));
      return {
        difficulty: "HARD", taskDirection: "DIAGNOSIS", answerSemantic: "STEP_LABEL", frameId: `SAP-CP004-DIAG-FACT-${errorStep}`, stem, answer,
        wrong,
        explanation: {
          coreConcept: "Check the factorial ratio, the separate factorial and the final arithmetic in order; stop at the first changed value.",
          steps: [`${n}!/${n - 1}! = ${n}.`, `${m}! = ${factorialM}.`, `The correct final value is ${n} + ${factorialM} = ${correctTotal}.`, errorStep === 0 ? "Every displayed step agrees with these values." : `Step ${errorStep} is the first displayed equality that does not agree.`],
          finalAnswer: `Therefore, the answer is ${answer}.`,
        },
        oracle: { kind: "DIAGNOSIS_FACTORIAL", data: { errorStep } },
      };
    }
  }
}

function validatePackage(pkg: Omit<SapCp004Package, "validation">): SapCp004Package["validation"] {
  const errors: string[] = [];
  if (pkg.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(pkg.options.map((option) => option.value)).size !== 4) errors.push("Option values must be unique.");
  if (pkg.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Correct option is not bound to the canonical answer.");
  if (!pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer)) errors.push("Final explanation is not bound to the answer.");
  if (pkg.explanation.steps.length < 2) errors.push("At least two worked explanation steps are required.");
  if (pkg.options.filter((option) => !option.isCorrect).some((option) => !option.misconceptionId || option.analysis.length < 30)) errors.push("Every distractor needs a misconception route and analysis.");
  if (/\b(?:undefined|NaN|Infinity)\b/.test(`${pkg.stem}\n${pkg.canonicalAnswer}`)) errors.push("Malformed numeric text detected.");
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function generateSapCp004Package(prototypeId: SapCp004PrototypeId, seed: number, targetCorrectIndex?: number): SapCp004Package {
  if (!SAP_CP004_PROTOTYPE_IDS.includes(prototypeId)) throw new Error(`Unknown SAP-CP-004 prototype: ${prototypeId}`);
  if (!Number.isInteger(seed) || seed <= 0) throw new Error("Seed must be a positive integer.");
  const built = build(prototypeId, seed);
  const options = makeOptions(built.answer, built.wrong, seed, prototypeId, targetCorrectIndex);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const canonicalPayloadKey = JSON.stringify({ prototypeId, stem: built.stem, answer: built.answer, oracle: built.oracle });
  const core: Omit<SapCp004Package, "validation"> = {
    packageId: "SAP-001",
    checkpointId: "SAP-CP-004",
    prototypeId,
    seed,
    locale: "en-IN",
    difficulty: built.difficulty,
    taskDirection: built.taskDirection,
    answerSemantic: built.answerSemantic,
    frameId: built.frameId,
    stem: built.stem,
    canonicalAnswer: built.answer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: built.explanation.coreConcept,
      steps: Object.freeze([...built.explanation.steps]),
      finalAnswer: built.explanation.finalAnswer,
    }),
    oracle: Object.freeze({ kind: built.oracle.kind, data: Object.freeze({ ...built.oracle.data }) }),
    canonicalPayloadKey,
    generationIdentity: `SAP-CP-004:${prototypeId}:${seed}:${hash(canonicalPayloadKey).toString(16)}`,
    proposedPermanentQlId: SAP_CP004_PROPOSED_QL_BY_PROTOTYPE[prototypeId],
    lifecycle: Object.freeze({
      permanentQlId: null,
      contentStatus: "ENGLISH_REVIEW_CANDIDATE",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    }),
  };
  return Object.freeze({ ...core, validation: validatePackage(core) });
}

export function generateSapCp004Sweep(seedsPerPrototype: number): readonly SapCp004Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) throw new Error("Sweep size must be a positive integer.");
  const packages: SapCp004Package[] = [];
  for (const prototypeId of SAP_CP004_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) packages.push(generateSapCp004Package(prototypeId, seed));
  }
  return Object.freeze(packages);
}
