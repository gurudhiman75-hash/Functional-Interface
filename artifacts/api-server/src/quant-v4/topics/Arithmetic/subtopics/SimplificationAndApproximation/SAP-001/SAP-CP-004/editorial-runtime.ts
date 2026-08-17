import {
  SAP_CP004_CATALOGUE,
  SAP_CP004_PROPOSED_QL_BY_PROTOTYPE,
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004Package as generateV3Package,
  type SapCp004Option,
  type SapCp004Package,
  type SapCp004PrototypeId,
} from "./runtime-v3";
import { generateSapCp004Package as generateV2Package } from "./runtime-v2";

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
} from "./runtime-v3";

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

function factorial(n: number): bigint {
  let result = 1n;
  for (let value = 2; value <= n; value += 1) result *= BigInt(value);
  return result;
}

function options(answer: bigint, specs: readonly WrongSpec[], correctIndex: number): readonly SapCp004Option[] {
  const seen = new Set<string>([answer.toString()]);
  const wrong: WrongSpec[] = [];
  for (const spec of specs) {
    if (seen.has(spec.value.toString())) continue;
    seen.add(spec.value.toString());
    wrong.push(spec);
  }
  let offset = 1n;
  while (wrong.length < 3) {
    const value = answer + offset;
    if (!seen.has(value.toString())) {
      seen.add(value.toString());
      wrong.push({
        value,
        misconceptionId: "NEARBY_FINAL_ARITHMETIC_SLIP",
        analysis: "This nearby result comes from a small arithmetic slip after the main factorial, signed-power or grouped-division step.",
      });
    }
    offset += 1n;
  }
  const result: SapCp004Option[] = [];
  let wrongIndex = 0;
  for (let position = 0; position < 4; position += 1) {
    if (position === correctIndex) {
      result.push({
        value: answer.toString(),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This option follows the exact bounded expansion and the displayed operation order.",
      });
    } else {
      const spec = wrong[wrongIndex++]!;
      result.push({ value: spec.value.toString(), isCorrect: false, misconceptionId: spec.misconceptionId, analysis: spec.analysis });
    }
  }
  return Object.freeze(result);
}

function safeGroupedPowerDivision(
  seed: number,
  targetCorrectIndex?: number,
): SapCp004Package {
  const prototypeId = "SAP-CP004-PROT-POWER-MIXED-EXPRESSION" as const;
  const basePackage = generateV2Package(prototypeId, seed, targetCorrectIndex);
  const base = basePackage.oracle.data.base!;
  const exponent = basePackage.oracle.data.exponent!;
  const powered = power(BigInt(base), exponent);
  const divisor = 2 + (seed % 4);
  const remainder = Number(powered % BigInt(divisor));
  const adjustment = ((divisor - remainder) % divisor) + divisor * (1 + (seed % 3));
  const answer = (powered + BigInt(adjustment)) / BigInt(divisor);
  const wrong = options(answer, [
    {
      value: powered + (BigInt(adjustment) / BigInt(divisor)),
      misconceptionId: "DIVISION_APPLIED_ONLY_TO_ADJUSTMENT",
      analysis: "This divides only the added number rather than the complete grouped numerator inside the brackets.",
    },
    {
      value: powered + BigInt(adjustment),
      misconceptionId: "FINAL_DIVISION_IGNORED",
      analysis: "This evaluates the grouped sum but stops before carrying out the displayed division by the outside divisor.",
    },
    {
      value: BigInt(base * exponent + adjustment) / BigInt(divisor),
      misconceptionId: "EXPONENT_AS_MULTIPLICATION",
      analysis: "This uses base × exponent inside the grouped numerator instead of evaluating the power by repeated multiplication.",
    },
  ], basePackage.correctIndex);
  const stem = `Evaluate (${base}^${exponent} + ${adjustment}) ÷ ${divisor}.`;
  const oracle = Object.freeze({
    kind: basePackage.oracle.kind,
    data: Object.freeze({ base, exponent, adjustment, divisor, mode: 3 }),
  });
  const explanation = Object.freeze({
    coreConcept: "Evaluate the power inside the brackets, complete the grouped sum, and divide the whole grouped value last.",
    steps: Object.freeze([
      `${base}^${exponent} = ${powered}.`,
      `${powered} + ${adjustment} = ${powered + BigInt(adjustment)}.`,
      `${powered + BigInt(adjustment)} ÷ ${divisor} = ${answer}.`,
    ]),
    finalAnswer: `Therefore, the exact value is ${answer}.`,
  });
  const errors: string[] = [];
  if (new Set(wrong.map((option) => option.value)).size !== 4) errors.push("The grouped-division options are not distinct.");
  if (wrong[basePackage.correctIndex]?.value !== answer.toString()) errors.push("The grouped-division correct option is not answer-bound.");
  if (wrong.filter((option) => !option.isCorrect).some((option) => !option.misconceptionId || option.analysis.length < 30)) errors.push("A grouped-division distractor lacks analysis.");
  const canonicalPayloadKey = JSON.stringify({
    prototypeId,
    stem,
    answer: answer.toString(),
    difficulty: "MEDIUM",
    oracle,
  });
  return Object.freeze({
    ...basePackage,
    difficulty: "MEDIUM",
    frameId: "SAP-CP004-POWER-MIXED-STRUCT-4",
    stem,
    canonicalAnswer: answer.toString(),
    options: wrong,
    explanation,
    oracle,
    canonicalPayloadKey,
    generationIdentity: `${basePackage.generationIdentity}:V3-SAFE-DIVISION`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function replaceOptions(pkg: SapCp004Package, answer: bigint, wrong: readonly WrongSpec[]): SapCp004Package {
  const replaced = options(answer, wrong, pkg.correctIndex);
  const errors = [...pkg.validation.errors];
  if (new Set(replaced.map((option) => option.value)).size !== 4) errors.push("Editorial distractor replacement produced duplicate values.");
  if (replaced[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Editorial distractor replacement changed the answer binding.");
  return Object.freeze({
    ...pkg,
    options: replaced,
    generationIdentity: `${pkg.generationIdentity}:EDITORIAL`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function editorialise(pkg: SapCp004Package): SapCp004Package {
  if (pkg.prototypeId === "SAP-CP004-PROT-FACTORIAL-RATIO") {
    const n = pkg.oracle.data.n!;
    const k = pkg.oracle.data.k!;
    const answer = factorial(n) / factorial(n - k);
    const lastIncludedFactor = BigInt(n - k + 1);
    return replaceOptions(pkg, answer, [
      {
        value: answer / lastIncludedFactor,
        misconceptionId: "FACTORIAL_RATIO_OMITS_LAST_FACTOR",
        analysis: "This cancels one factor too many and therefore omits the final descending factor required by the quotient.",
      },
      {
        value: answer * BigInt(n - k),
        misconceptionId: "FACTORIAL_RATIO_INCLUDES_EXTRA_FACTOR",
        analysis: "This expands one factor too far and includes a descending factor already contained in the denominator factorial.",
      },
      {
        value: factorial(k),
        misconceptionId: "FACTORIAL_OF_INPUT_DIFFERENCE",
        analysis: "This takes the factorial of the difference between the inputs instead of cancelling the common factorial product.",
      },
    ]);
  }

  if (pkg.prototypeId === "SAP-CP004-PROT-NEGATIVE-BASE-PARITY" && pkg.oracle.data.mode === undefined) {
    const base = pkg.oracle.data.base!;
    const exponent = pkg.oracle.data.exponent!;
    const add = pkg.oracle.data.add!;
    const signedPower = power(BigInt(-base), exponent);
    const absolutePower = power(BigInt(base), exponent);
    const answer = signedPower + BigInt(add);
    return replaceOptions(pkg, answer, [
      {
        value: absolutePower + BigInt(add),
        misconceptionId: "NEGATIVE_BASE_PARITY_IGNORED",
        analysis: "This forces the powered negative base to be positive without checking whether the exponent is odd or even.",
      },
      {
        value: absolutePower - BigInt(add),
        misconceptionId: "PARITY_AND_FINAL_SIGN_MIXED",
        analysis: "This changes the powered sign and also treats the final addition as subtraction, combining two common sign errors.",
      },
      {
        value: signedPower - BigInt(add),
        misconceptionId: "FINAL_ADDITION_AS_SUBTRACTION",
        analysis: "The negative-base power is evaluated correctly, but the final addition is incorrectly changed to subtraction.",
      },
    ]);
  }

  return pkg;
}

export function generateSapCp004Package(
  prototypeId: SapCp004PrototypeId,
  seed: number,
  targetCorrectIndex?: number,
): SapCp004Package {
  const mode = (seed - 1) % 4;
  const generated = prototypeId === "SAP-CP004-PROT-POWER-MIXED-EXPRESSION" && mode === 3
    ? safeGroupedPowerDivision(seed, targetCorrectIndex)
    : generateV3Package(prototypeId, seed, targetCorrectIndex);
  return editorialise(generated);
}

export function generateSapCp004Sweep(seedsPerPrototype: number): readonly SapCp004Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) throw new Error("Sweep size must be a positive integer.");
  const packages: SapCp004Package[] = [];
  for (const prototypeId of SAP_CP004_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) packages.push(generateSapCp004Package(prototypeId, seed));
  }
  return Object.freeze(packages);
}
