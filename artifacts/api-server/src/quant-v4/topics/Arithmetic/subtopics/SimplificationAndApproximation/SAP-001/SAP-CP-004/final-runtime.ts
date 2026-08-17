import {
  SAP_CP004_CATALOGUE,
  SAP_CP004_PROPOSED_QL_BY_PROTOTYPE,
  SAP_CP004_PROTOTYPE_IDS,
  generateSapCp004Package as generateEditorialPackage,
  type SapCp004Option,
  type SapCp004Package,
  type SapCp004PrototypeId,
} from "./editorial-runtime";
import { applySapCp004ExplanationRemediationV3 } from "./explanation-remediation-v3";

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
} from "./editorial-runtime";

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

function buildOptions(answer: bigint, specs: readonly WrongSpec[], correctIndex: number): readonly SapCp004Option[] {
  const seen = new Set<string>([answer.toString()]);
  const wrong: WrongSpec[] = [];
  for (const spec of specs) {
    const value = spec.value.toString();
    if (seen.has(value)) continue;
    seen.add(value);
    wrong.push(spec);
  }
  let offset = 1n;
  while (wrong.length < 3) {
    const value = answer + offset;
    if (!seen.has(value.toString())) {
      seen.add(value.toString());
      wrong.push({
        value,
        misconceptionId: "NEARBY_SIGN_ARITHMETIC_SLIP",
        analysis: "This nearby result reflects a small signed-arithmetic slip after the parity of the powered base is considered.",
      });
    }
    offset += 1n;
  }

  const options: SapCp004Option[] = [];
  let wrongIndex = 0;
  for (let position = 0; position < 4; position += 1) {
    if (position === correctIndex) {
      options.push({
        value: answer.toString(),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This option applies the even-or-odd exponent rule to the negative base and then follows the displayed arithmetic.",
      });
    } else {
      const spec = wrong[wrongIndex++]!;
      options.push({
        value: spec.value.toString(),
        isCorrect: false,
        misconceptionId: spec.misconceptionId,
        analysis: spec.analysis,
      });
    }
  }
  return Object.freeze(options);
}

function expressionValue(mode: number, poweredValue: bigint, add: number, multiplier?: number): bigint {
  if (mode === 1) return BigInt(add) - poweredValue;
  if (mode === 2) return BigInt(multiplier!) * poweredValue + BigInt(add);
  if (mode === 3) return poweredValue - BigInt(add);
  return poweredValue + BigInt(add);
}

function finalOperationAlternative(mode: number, poweredValue: bigint, add: number, multiplier?: number): bigint {
  if (mode === 1) return poweredValue - BigInt(add);
  if (mode === 2) return BigInt(multiplier!) * poweredValue - BigInt(add);
  if (mode === 3) return poweredValue + BigInt(add);
  return poweredValue - BigInt(add);
}

function parityAware(pkg: SapCp004Package): SapCp004Package {
  if (pkg.prototypeId !== "SAP-CP004-PROT-NEGATIVE-BASE-PARITY") return pkg;

  const base = pkg.oracle.data.base!;
  const exponent = pkg.oracle.data.exponent!;
  const add = pkg.oracle.data.add!;
  const multiplier = pkg.oracle.data.multiplier;
  const mode = pkg.oracle.data.mode ?? 0;
  const exactPowered = power(BigInt(-base), exponent);
  const oppositeParityPowered = -exactPowered;
  const multiplicationShortcut = BigInt(-base * exponent);
  const answer = expressionValue(mode, exactPowered, add, multiplier);
  if (answer.toString() !== pkg.canonicalAnswer) {
    throw new Error(`${pkg.prototypeId}/${pkg.seed}: parity postprocessor disagrees with the canonical answer.`);
  }

  const revisedOptions = buildOptions(answer, [
    {
      value: expressionValue(mode, oppositeParityPowered, add, multiplier),
      misconceptionId: "NEGATIVE_BASE_PARITY_REVERSED",
      analysis: exponent % 2 === 0
        ? "This incorrectly keeps the negative sign even though an even exponent makes the repeated negative factors positive."
        : "This incorrectly removes the negative sign even though an odd exponent leaves one unpaired negative factor.",
    },
    {
      value: expressionValue(mode, multiplicationShortcut, add, multiplier),
      misconceptionId: "EXPONENT_AS_MULTIPLICATION_WITH_SIGN",
      analysis: "This replaces repeated multiplication of the signed base by base × exponent, so both magnitude and parity handling are wrong.",
    },
    {
      value: finalOperationAlternative(mode, exactPowered, add, multiplier),
      misconceptionId: "FINAL_OPERATION_SIGN_ERROR",
      analysis: "The powered negative base is evaluated correctly, but the final addition or subtraction is performed with the opposite sign.",
    },
  ], pkg.correctIndex);

  const errors = [...pkg.validation.errors];
  if (new Set(revisedOptions.map((option) => option.value)).size !== 4) errors.push("Parity-aware distractors are not four distinct values.");
  if (revisedOptions[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Parity-aware distractors changed the answer binding.");
  if (!revisedOptions.some((option) => option.misconceptionId === "NEGATIVE_BASE_PARITY_REVERSED")) errors.push("The explicit parity-reversal distractor is missing.");

  return Object.freeze({
    ...pkg,
    options: revisedOptions,
    generationIdentity: `${pkg.generationIdentity}:PARITY-FINAL`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp004PreExplanationPackage(
  prototypeId: SapCp004PrototypeId,
  seed: number,
  targetCorrectIndex?: number,
): SapCp004Package {
  return parityAware(generateEditorialPackage(prototypeId, seed, targetCorrectIndex));
}

export function generateSapCp004Package(
  prototypeId: SapCp004PrototypeId,
  seed: number,
  targetCorrectIndex?: number,
): SapCp004Package {
  return applySapCp004ExplanationRemediationV3(
    generateSapCp004PreExplanationPackage(prototypeId, seed, targetCorrectIndex),
  );
}

export function generateSapCp004Sweep(seedsPerPrototype: number): readonly SapCp004Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) throw new Error("Sweep size must be a positive integer.");
  const packages: SapCp004Package[] = [];
  for (const prototypeId of SAP_CP004_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) packages.push(generateSapCp004Package(prototypeId, seed));
  }
  return Object.freeze(packages);
}
