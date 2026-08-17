import {
  SAP_CP004_CATALOGUE,
  SAP_CP004_PROPOSED_QL_BY_PROTOTYPE,
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004Package as generateV2Package,
  type SapCp004Option,
  type SapCp004Package,
  type SapCp004PrototypeId,
} from "./runtime-v2";

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
} from "./runtime-v2";

interface WrongSpec {
  readonly value: bigint;
  readonly misconceptionId: string;
  readonly analysis: string;
}

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

function optionSet(answer: bigint, wrongSpecs: readonly WrongSpec[], correctIndex: number): readonly SapCp004Option[] {
  const seen = new Set<string>([answer.toString()]);
  const wrong: WrongSpec[] = [];
  for (const candidate of wrongSpecs) {
    const value = candidate.value.toString();
    if (seen.has(value)) continue;
    seen.add(value);
    wrong.push(candidate);
  }
  let offset = 1n;
  while (wrong.length < 3) {
    const value = (answer + offset).toString();
    if (!seen.has(value)) {
      seen.add(value);
      wrong.push({
        value: answer + offset,
        misconceptionId: "NEARBY_FINAL_ARITHMETIC_SLIP",
        analysis: "This nearby result follows the main special-form step but contains a small error in the final ordinary arithmetic.",
      });
    }
    offset += 1n;
  }
  const ordered = [...wrong.slice(0, 3)];
  const options: SapCp004Option[] = [];
  let wrongIndex = 0;
  for (let position = 0; position < 4; position += 1) {
    if (position === correctIndex) {
      options.push({
        value: answer.toString(),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This option follows the exact power, root or factorial evaluation and the displayed operation order.",
      });
    } else {
      const item = ordered[wrongIndex++]!;
      options.push({
        value: item.value.toString(),
        isCorrect: false,
        misconceptionId: item.misconceptionId,
        analysis: item.analysis,
      });
    }
  }
  return Object.freeze(options);
}

function rebuild(
  pkg: SapCp004Package,
  values: {
    difficulty?: SapCp004Package["difficulty"];
    frameId: string;
    stem: string;
    answer: bigint;
    wrong: readonly WrongSpec[];
    coreConcept: string;
    steps: readonly string[];
    oracleData: Readonly<Record<string, number>>;
  },
): SapCp004Package {
  const options = optionSet(values.answer, values.wrong, pkg.correctIndex);
  const explanation = Object.freeze({
    coreConcept: values.coreConcept,
    steps: Object.freeze([...values.steps]),
    finalAnswer: `Therefore, the exact value is ${values.answer}.`,
  });
  const oracle = Object.freeze({ kind: pkg.oracle.kind, data: Object.freeze({ ...values.oracleData }) });
  const errors: string[] = [];
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("The rebuilt options are not four distinct values.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("The rebuilt package does not have exactly one correct option.");
  if (options[pkg.correctIndex]?.value !== values.answer.toString()) errors.push("The rebuilt correct option is not answer-bound.");
  if (options.filter((option) => !option.isCorrect).some((option) => !option.misconceptionId || option.analysis.length < 30)) errors.push("A rebuilt distractor lacks a misconception analysis.");
  const normalized = options.map((option) => normalizedNumeric(option.value));
  if (normalized.some((value) => value === null) || new Set(normalized).size !== normalized.length) errors.push("The rebuilt numeric options are not exactly distinct.");
  const canonicalPayloadKey = JSON.stringify({
    prototypeId: pkg.prototypeId,
    stem: values.stem,
    answer: values.answer.toString(),
    difficulty: values.difficulty ?? pkg.difficulty,
    oracle,
  });
  return Object.freeze({
    ...pkg,
    difficulty: values.difficulty ?? pkg.difficulty,
    frameId: values.frameId,
    stem: values.stem,
    canonicalAnswer: values.answer.toString(),
    options,
    explanation,
    oracle,
    canonicalPayloadKey,
    generationIdentity: `${pkg.generationIdentity}:V3`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function diversify(pkg: SapCp004Package): SapCp004Package {
  const mode = (pkg.seed - 1) % 4;

  if (pkg.prototypeId === "SAP-CP004-PROT-POWER-MIXED-EXPRESSION") {
    const base = pkg.oracle.data.base!;
    const exponent = pkg.oracle.data.exponent!;
    const add = pkg.oracle.data.add!;
    const p = power(BigInt(base), exponent);
    const multiplier = 2 + (pkg.seed % 3);
    if (mode === 0) return pkg;
    if (mode === 1) {
      const answer = p - BigInt(add);
      return rebuild(pkg, {
        frameId: "SAP-CP004-POWER-MIXED-STRUCT-2",
        stem: `Evaluate ${base}^${exponent} - ${add}.`,
        answer,
        wrong: [
          { value: BigInt(base * exponent - add), misconceptionId: "EXPONENT_AS_MULTIPLICATION", analysis: "This replaces repeated multiplication by base × exponent before carrying out the subtraction." },
          { value: p + BigInt(add), misconceptionId: "SUBTRACTION_READ_AS_ADDITION", analysis: "The power is evaluated correctly, but the final subtraction is incorrectly changed to addition." },
          { value: power(BigInt(Math.abs(base - add)), exponent), misconceptionId: "EXPONENT_APPLIED_TO_DIFFERENCE", analysis: "This incorrectly places the subtraction inside the powered base instead of applying it after the power." },
        ],
        coreConcept: "Evaluate the numeric power first, then subtract the ordinary number shown outside the power.",
        steps: [`${base}^${exponent} = ${p}.`, `${p} - ${add} = ${answer}.`],
        oracleData: { base, exponent, add, mode },
      });
    }
    if (mode === 2) {
      const answer = BigInt(multiplier) * p + BigInt(add);
      return rebuild(pkg, {
        difficulty: "MEDIUM",
        frameId: "SAP-CP004-POWER-MIXED-STRUCT-3",
        stem: `Find the exact value of ${multiplier} × ${base}^${exponent} + ${add}.`,
        answer,
        wrong: [
          { value: power(BigInt(multiplier * base), exponent) + BigInt(add), misconceptionId: "EXPONENT_APPLIED_TO_COEFFICIENT", analysis: "This places the coefficient inside the powered base instead of multiplying after the power is evaluated." },
          { value: BigInt(multiplier * base * exponent + add), misconceptionId: "EXPONENT_AS_MULTIPLICATION", analysis: "This treats the exponent as an ordinary multiplier and therefore never forms the required repeated product." },
          { value: BigInt(multiplier) * p - BigInt(add), misconceptionId: "FINAL_SIGN_ERROR", analysis: "The coefficient and power are handled correctly, but the final addition is changed to subtraction." },
        ],
        coreConcept: "Powers are evaluated before the outside coefficient, and multiplication is completed before the final addition.",
        steps: [`${base}^${exponent} = ${p}.`, `${multiplier} × ${p} = ${BigInt(multiplier) * p}.`, `${BigInt(multiplier) * p} + ${add} = ${answer}.`],
        oracleData: { base, exponent, add, multiplier, mode },
      });
    }
    const divisor = 2 + (pkg.seed % 4);
    const remainder = Number(p % BigInt(divisor));
    const adjustment = ((divisor - remainder) % divisor) + divisor * (1 + (pkg.seed % 3));
    const answer = (p + BigInt(adjustment)) / BigInt(divisor);
    return rebuild(pkg, {
      difficulty: "MEDIUM",
      frameId: "SAP-CP004-POWER-MIXED-STRUCT-4",
      stem: `Evaluate (${base}^${exponent} + ${adjustment}) ÷ ${divisor}.`,
      answer,
      wrong: [
        { value: p + BigInt(adjustment / divisor), misconceptionId: "DIVISION_APPLIED_ONLY_TO_ADJUSTMENT", analysis: "This divides only the added number rather than the complete grouped numerator inside the brackets." },
        { value: p + BigInt(adjustment), misconceptionId: "FINAL_DIVISION_IGNORED", analysis: "This evaluates the grouped sum but stops before carrying out the displayed division." },
        { value: BigInt(base * exponent + adjustment) / BigInt(divisor), misconceptionId: "EXPONENT_AS_MULTIPLICATION", analysis: "This uses base × exponent inside the grouped numerator instead of evaluating the power exactly." },
      ],
      coreConcept: "Evaluate the power inside the brackets, complete the grouped sum, and divide the whole grouped value last.",
      steps: [`${base}^${exponent} = ${p}.`, `${p} + ${adjustment} = ${p + BigInt(adjustment)}.`, `${p + BigInt(adjustment)} ÷ ${divisor} = ${answer}.`],
      oracleData: { base, exponent, adjustment, divisor, mode },
    });
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-ZERO-ONE-EXPONENT") {
    const base = pkg.oracle.data.base!;
    const other = pkg.oracle.data.other!;
    const multiplier = 2 + (pkg.seed % 5);
    if (mode === 0) return pkg;
    if (mode === 1) {
      const answer = BigInt(other - 1);
      return rebuild(pkg, {
        frameId: "SAP-CP004-ZERO-ONE-STRUCT-2",
        stem: `Evaluate ${other}^1 - ${base}^0.`,
        answer,
        wrong: [
          { value: BigInt(other), misconceptionId: "ZERO_POWER_AS_ZERO", analysis: "This incorrectly treats the non-zero base raised to power zero as zero instead of one." },
          { value: BigInt(other - base), misconceptionId: "EXPONENTS_IGNORED", analysis: "This ignores the exponents and subtracts the visible bases directly." },
          { value: BigInt(other + 1), misconceptionId: "SUBTRACTION_READ_AS_ADDITION", analysis: "Both exponent values are known, but the final subtraction is incorrectly changed to addition." },
        ],
        coreConcept: "A non-zero number to power zero equals one, while a number to power one remains unchanged.",
        steps: [`${other}^1 = ${other}.`, `${base}^0 = 1.`, `${other} - 1 = ${answer}.`],
        oracleData: { base, other, mode },
      });
    }
    if (mode === 2) {
      const answer = BigInt(multiplier + other);
      return rebuild(pkg, {
        frameId: "SAP-CP004-ZERO-ONE-STRUCT-3",
        stem: `Find the exact value of ${multiplier} × ${base}^0 + ${other}^1.`,
        answer,
        wrong: [
          { value: BigInt(other), misconceptionId: "ZERO_POWER_TERM_DROPPED", analysis: "This treats the zero-power term as zero and therefore drops the entire coefficient term." },
          { value: BigInt(multiplier * base + other), misconceptionId: "ZERO_EXPONENT_IGNORED", analysis: "This uses the visible base instead of replacing the non-zero zero-power expression by one." },
          { value: BigInt(multiplier * (1 + other)), misconceptionId: "COEFFICIENT_APPLIED_TO_WHOLE_SUM", analysis: "This incorrectly distributes the coefficient over both exponent terms instead of the first term only." },
        ],
        coreConcept: "Resolve the zero and first powers first, then apply the coefficient only to the term it multiplies.",
        steps: [`${base}^0 = 1 and ${other}^1 = ${other}.`, `${multiplier} × 1 = ${multiplier}.`, `${multiplier} + ${other} = ${answer}.`],
        oracleData: { base, other, multiplier, mode },
      });
    }
    const answer = BigInt(2 * multiplier);
    return rebuild(pkg, {
      frameId: "SAP-CP004-ZERO-ONE-STRUCT-4",
      stem: `Evaluate (${base}^0 + ${other}^0) × ${multiplier}.`,
      answer,
      wrong: [
        { value: 0n, misconceptionId: "BOTH_ZERO_POWERS_AS_ZERO", analysis: "This incorrectly treats both non-zero bases raised to power zero as zero." },
        { value: BigInt((base + other) * multiplier), misconceptionId: "EXPONENTS_IGNORED", analysis: "This ignores the zero exponents and multiplies the sum of the visible bases by the coefficient." },
        { value: BigInt(2 + multiplier), misconceptionId: "FINAL_MULTIPLICATION_AS_ADDITION", analysis: "The two zero-power terms are evaluated correctly, but the outside multiplication is changed to addition." },
      ],
      coreConcept: "Each non-zero zero-power term equals one; add inside the brackets before multiplying by the outside factor.",
      steps: [`${base}^0 = 1 and ${other}^0 = 1.`, `1 + 1 = 2.`, `2 × ${multiplier} = ${answer}.`],
      oracleData: { base, other, multiplier, mode },
    });
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-NEGATIVE-BASE-PARITY") {
    const base = pkg.oracle.data.base!;
    const exponent = pkg.oracle.data.exponent!;
    const add = pkg.oracle.data.add!;
    const signedPower = power(BigInt(-base), exponent);
    const absolutePower = power(BigInt(base), exponent);
    const multiplier = 2 + (pkg.seed % 3);
    if (mode === 0) return pkg;
    if (mode === 1) {
      const answer = BigInt(add) - signedPower;
      return rebuild(pkg, {
        frameId: "SAP-CP004-NEGATIVE-BASE-STRUCT-2",
        stem: `Evaluate ${add} - (-${base})^${exponent}.`,
        answer,
        wrong: [
          { value: BigInt(add) - absolutePower, misconceptionId: "NEGATIVE_BASE_PARITY_IGNORED", analysis: "This forces the powered negative base to be positive without checking whether the exponent is odd or even." },
          { value: signedPower - BigInt(add), misconceptionId: "SUBTRACTION_ORDER_REVERSED", analysis: "The power is evaluated correctly, but the order of subtraction is reversed." },
          { value: BigInt(add + base * exponent), misconceptionId: "EXPONENT_AS_MULTIPLICATION", analysis: "This replaces the repeated product by base × exponent and then combines it with the first term." },
        ],
        coreConcept: "Determine the sign of the negative-base power from exponent parity before performing the outside subtraction in order.",
        steps: [`(-${base})^${exponent} = ${signedPower}.`, `${add} - (${signedPower}) = ${answer}.`],
        oracleData: { base, exponent, add, mode },
      });
    }
    if (mode === 2) {
      const answer = BigInt(multiplier) * signedPower + BigInt(add);
      return rebuild(pkg, {
        difficulty: "MEDIUM",
        frameId: "SAP-CP004-NEGATIVE-BASE-STRUCT-3",
        stem: `Find the exact value of ${multiplier} × (-${base})^${exponent} + ${add}.`,
        answer,
        wrong: [
          { value: BigInt(multiplier) * absolutePower + BigInt(add), misconceptionId: "NEGATIVE_BASE_PARITY_IGNORED", analysis: "This makes the powered negative base positive without applying the even-or-odd exponent rule." },
          { value: BigInt(multiplier * -base * exponent + add), misconceptionId: "EXPONENT_AS_MULTIPLICATION", analysis: "This treats the exponent as an ordinary multiplier instead of forming the repeated signed product." },
          { value: BigInt(multiplier) * signedPower - BigInt(add), misconceptionId: "FINAL_SIGN_ERROR", analysis: "The signed power and coefficient are handled correctly, but the final addition is changed to subtraction." },
        ],
        coreConcept: "Apply the parity rule to the negative-base power first, then multiply by the coefficient and add the final term.",
        steps: [`(-${base})^${exponent} = ${signedPower}.`, `${multiplier} × ${signedPower} = ${BigInt(multiplier) * signedPower}.`, `${BigInt(multiplier) * signedPower} + ${add} = ${answer}.`],
        oracleData: { base, exponent, add, multiplier, mode },
      });
    }
    const answer = signedPower - BigInt(add);
    return rebuild(pkg, {
      frameId: "SAP-CP004-NEGATIVE-BASE-STRUCT-4",
      stem: `Evaluate (-${base})^${exponent} - ${add}.`,
      answer,
      wrong: [
        { value: absolutePower - BigInt(add), misconceptionId: "NEGATIVE_BASE_PARITY_IGNORED", analysis: "This assumes the powered negative base is positive without checking the parity of the exponent." },
        { value: signedPower + BigInt(add), misconceptionId: "SUBTRACTION_READ_AS_ADDITION", analysis: "The signed power is evaluated correctly, but the final subtraction is changed to addition." },
        { value: BigInt(-base * exponent - add), misconceptionId: "EXPONENT_AS_MULTIPLICATION", analysis: "This replaces repeated multiplication of the negative base by base × exponent." },
      ],
      coreConcept: "Evaluate the signed power using exponent parity, then subtract the outside number from that exact result.",
      steps: [`(-${base})^${exponent} = ${signedPower}.`, `${signedPower} - ${add} = ${answer}.`],
      oracleData: { base, exponent, add, mode },
    });
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC") {
    const root = pkg.oracle.data.root!;
    const index = pkg.oracle.data.index!;
    const multiplier = pkg.oracle.data.multiplier!;
    const add = pkg.oracle.data.add!;
    const radicand = power(BigInt(root), index);
    const symbol = index === 2 ? `√${radicand}` : `∛${radicand}`;
    if (mode === 0) return pkg;
    if (mode === 1) {
      const answer = BigInt(root * multiplier - add);
      return rebuild(pkg, {
        frameId: "SAP-CP004-ROOT-MIXED-STRUCT-2",
        stem: `Evaluate ${symbol} × ${multiplier} - ${add}.`,
        answer,
        wrong: [
          { value: radicand * BigInt(multiplier) - BigInt(add), misconceptionId: "RADICAND_USED_INSTEAD_OF_ROOT", analysis: "This multiplies by the radicand itself instead of first replacing it by its exact root." },
          { value: BigInt(root + multiplier - add), misconceptionId: "MULTIPLICATION_AS_ADDITION", analysis: "The exact root is found, but multiplication by the coefficient is incorrectly changed to addition." },
          { value: BigInt(root * multiplier + add), misconceptionId: "SUBTRACTION_READ_AS_ADDITION", analysis: "The root and product are correct, but the final subtraction is changed to addition." },
        ],
        coreConcept: "Replace the perfect root by its exact value, multiply by the coefficient, and subtract the final number last.",
        steps: [`${symbol} = ${root}.`, `${root} × ${multiplier} = ${root * multiplier}.`, `${root * multiplier} - ${add} = ${answer}.`],
        oracleData: { root, index, multiplier, add, mode },
      });
    }
    if (mode === 2) {
      const answer = BigInt((root + add) * multiplier);
      return rebuild(pkg, {
        difficulty: "MEDIUM",
        frameId: "SAP-CP004-ROOT-MIXED-STRUCT-3",
        stem: `Find the exact value of (${symbol} + ${add}) × ${multiplier}.`,
        answer,
        wrong: [
          { value: BigInt(root + add * multiplier), misconceptionId: "BRACKET_SCOPE_IGNORED", analysis: "This multiplies only the added number and fails to apply the outside coefficient to the complete bracket." },
          { value: (radicand + BigInt(add)) * BigInt(multiplier), misconceptionId: "RADICAND_USED_INSTEAD_OF_ROOT", analysis: "This keeps the radicand instead of evaluating its exact root before working inside the bracket." },
          { value: BigInt(root + add + multiplier), misconceptionId: "OUTSIDE_MULTIPLICATION_AS_ADDITION", analysis: "The bracket is simplified, but the outside multiplication is incorrectly changed to addition." },
        ],
        coreConcept: "Evaluate the exact root inside the bracket, complete the bracketed addition, and multiply the whole bracket last.",
        steps: [`${symbol} = ${root}.`, `${root} + ${add} = ${root + add}.`, `${root + add} × ${multiplier} = ${answer}.`],
        oracleData: { root, index, multiplier, add, mode },
      });
    }
    const square = multiplier * multiplier;
    const answer = BigInt(root + square);
    return rebuild(pkg, {
      difficulty: "MEDIUM",
      frameId: "SAP-CP004-ROOT-MIXED-STRUCT-4",
      stem: `Evaluate ${symbol} + ${multiplier}^2.`,
      answer,
      wrong: [
        { value: radicand + BigInt(square), misconceptionId: "RADICAND_USED_INSTEAD_OF_ROOT", analysis: "This adds the square to the radicand instead of first evaluating the exact root." },
        { value: BigInt(root + 2 * multiplier), misconceptionId: "EXPONENT_AS_MULTIPLICATION", analysis: "This replaces the square by multiplication by two instead of multiplying the base by itself." },
        { value: BigInt(root * square), misconceptionId: "ADDITION_AS_MULTIPLICATION", analysis: "Both special forms are evaluated, but the final addition is incorrectly changed to multiplication." },
      ],
      coreConcept: "Evaluate the exact root and the square independently before adding their ordinary numeric values.",
      steps: [`${symbol} = ${root}.`, `${multiplier}^2 = ${square}.`, `${root} + ${square} = ${answer}.`],
      oracleData: { root, index, multiplier, mode },
    });
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-FACTORIAL-MIXED-EXPRESSION") {
    const n = pkg.oracle.data.n!;
    const base = pkg.oracle.data.base!;
    const multiplier = 2 + (pkg.seed % 4);
    const add = 1 + (pkg.seed % 12);
    if (mode === 0) return pkg;
    if (mode === 1) {
      const answer = BigInt(n * multiplier - add);
      return rebuild(pkg, {
        difficulty: "MEDIUM",
        frameId: "SAP-CP004-FACTORIAL-MIXED-STRUCT-2",
        stem: `Evaluate (${n}!/${n - 1}!) × ${multiplier} - ${add}.`,
        answer,
        wrong: [
          { value: BigInt(n + multiplier - add), misconceptionId: "MULTIPLICATION_AS_ADDITION", analysis: "The factorial ratio is simplified correctly, but multiplication by the coefficient is changed to addition." },
          { value: BigInt(n * multiplier + add), misconceptionId: "SUBTRACTION_READ_AS_ADDITION", analysis: "The factorial ratio and coefficient are correct, but the final subtraction is changed to addition." },
          { value: factorialBounded(n) * BigInt(multiplier) - BigInt(add), misconceptionId: "FACTORIAL_RATIO_NOT_CANCELLED", analysis: "This uses n! directly and ignores the complete division by (n − 1)! in the grouped factor." },
        ],
        coreConcept: "Cancel the factorial ratio to n, multiply by the outside coefficient, and then perform the final subtraction.",
        steps: [`${n}!/${n - 1}! = ${n}.`, `${n} × ${multiplier} = ${n * multiplier}.`, `${n * multiplier} - ${add} = ${answer}.`],
        oracleData: { n, base, multiplier, add, mode },
      });
    }
    if (mode === 2) {
      const ratio = n * (n - 1);
      const square = base * base;
      const answer = BigInt(ratio - square);
      return rebuild(pkg, {
        difficulty: n >= 7 ? "HARD" : "MEDIUM",
        frameId: "SAP-CP004-FACTORIAL-MIXED-STRUCT-3",
        stem: `Find the exact value of ${n}!/${n - 2}! - ${base}^2.`,
        answer,
        wrong: [
          { value: BigInt(n - square), misconceptionId: "FACTORIAL_RATIO_CANCELLED_TOO_FAR", analysis: "This reduces the two-step factorial ratio to n and omits the required factor (n − 1)." },
          { value: BigInt(ratio + square), misconceptionId: "SUBTRACTION_READ_AS_ADDITION", analysis: "Both special forms are evaluated correctly, but the final subtraction is changed to addition." },
          { value: BigInt(ratio - 2 * base), misconceptionId: "EXPONENT_AS_MULTIPLICATION", analysis: "The factorial ratio is correct, but the square is replaced by base × 2 rather than base × base." },
        ],
        coreConcept: "Expand the factorial quotient only until (n − 2)! cancels, evaluate the square separately, and then subtract.",
        steps: [`${n}!/${n - 2}! = ${n} × ${n - 1} = ${ratio}.`, `${base}^2 = ${square}.`, `${ratio} - ${square} = ${answer}.`],
        oracleData: { n, base, mode },
      });
    }
    const radicand = base * base;
    const answer = BigInt(n + base);
    return rebuild(pkg, {
      difficulty: "MEDIUM",
      frameId: "SAP-CP004-FACTORIAL-MIXED-STRUCT-4",
      stem: `Evaluate ${n}!/${n - 1}! + √${radicand}.`,
      answer,
      wrong: [
        { value: factorialBounded(n) + BigInt(base), misconceptionId: "FACTORIAL_RATIO_NOT_CANCELLED", analysis: "This uses the full factorial n! instead of simplifying the quotient by (n − 1)! first." },
        { value: BigInt(n + radicand), misconceptionId: "RADICAND_USED_INSTEAD_OF_ROOT", analysis: "The factorial ratio is simplified, but the radicand is added without taking its exact square root." },
        { value: BigInt(n * base), misconceptionId: "ADDITION_AS_MULTIPLICATION", analysis: "Both special forms are evaluated correctly, but the final addition is incorrectly changed to multiplication." },
      ],
      coreConcept: "Simplify the factorial ratio and the perfect square root independently, then add the two exact values.",
      steps: [`${n}!/${n - 1}! = ${n}.`, `√${radicand} = ${base}.`, `${n} + ${base} = ${answer}.`],
      oracleData: { n, base, mode },
    });
  }

  return pkg;
}

function factorialBounded(n: number): bigint {
  let result = 1n;
  for (let value = 2; value <= n; value += 1) result *= BigInt(value);
  return result;
}

export function generateSapCp004Package(
  prototypeId: SapCp004PrototypeId,
  seed: number,
  targetCorrectIndex?: number,
): SapCp004Package {
  return diversify(generateV2Package(prototypeId, seed, targetCorrectIndex));
}

export function generateSapCp004Sweep(seedsPerPrototype: number): readonly SapCp004Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) throw new Error("Sweep size must be a positive integer.");
  const packages: SapCp004Package[] = [];
  for (const prototypeId of SAP_CP004_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) packages.push(generateSapCp004Package(prototypeId, seed));
  }
  return Object.freeze(packages);
}
