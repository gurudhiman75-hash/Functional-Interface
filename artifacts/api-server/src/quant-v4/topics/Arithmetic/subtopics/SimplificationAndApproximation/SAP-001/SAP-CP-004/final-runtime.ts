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
      wrong.push({ value, misconceptionId: "NEARBY_SIGN_ARITHMETIC_SLIP", analysis: "This nearby result reflects a small arithmetic slip after the main special-form step." });
    }
    offset += 1n;
  }
  const options: SapCp004Option[] = [];
  let wrongIndex = 0;
  for (let position = 0; position < 4; position += 1) {
    if (position === correctIndex) options.push({ value: answer.toString(), isCorrect: true, misconceptionId: null, analysis: "Correct." });
    else {
      const spec = wrong[wrongIndex++]!;
      options.push({ value: spec.value.toString(), isCorrect: false, misconceptionId: spec.misconceptionId, analysis: spec.analysis });
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
  if (answer.toString() !== pkg.canonicalAnswer) throw new Error(`${pkg.prototypeId}/${pkg.seed}: parity postprocessor disagrees with the canonical answer.`);
  const revisedOptions = buildOptions(answer, [
    { value: expressionValue(mode, oppositeParityPowered, add, multiplier), misconceptionId: "NEGATIVE_BASE_PARITY_REVERSED", analysis: exponent % 2 === 0 ? "This incorrectly keeps the negative sign even though an even exponent gives a positive power." : "This incorrectly removes the negative sign even though an odd exponent gives a negative power." },
    { value: expressionValue(mode, multiplicationShortcut, add, multiplier), misconceptionId: "EXPONENT_AS_MULTIPLICATION_WITH_SIGN", analysis: "This replaces repeated multiplication of the signed base by base × exponent." },
    { value: finalOperationAlternative(mode, exactPowered, add, multiplier), misconceptionId: "FINAL_OPERATION_SIGN_ERROR", analysis: "The powered value is correct, but the final addition or subtraction uses the wrong sign." },
  ], pkg.correctIndex);
  const errors = [...pkg.validation.errors];
  if (new Set(revisedOptions.map((option) => option.value)).size !== 4) errors.push("Parity-aware distractors are not four distinct values.");
  if (revisedOptions[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Parity-aware distractors changed the answer binding.");
  return Object.freeze({ ...pkg, options: revisedOptions, generationIdentity: `${pkg.generationIdentity}:PARITY-FINAL`, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

function materialRootState(pkg: SapCp004Package): SapCp004Package {
  if (pkg.prototypeId !== "SAP-CP004-PROT-PERFECT-SQUARE-ROOT" && pkg.prototypeId !== "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC") return pkg;
  const mixed = pkg.prototypeId === "SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC";
  const root = (mixed ? 8 : 10) + pkg.seed;
  const radicand = root * root;
  const add = mixed ? 2 + (pkg.seed % 9) : 0;
  const answer = BigInt(root + add);
  const options = buildOptions(answer, [
    { value: answer - 1n, misconceptionId: "ROOT_OR_FINAL_ONE_LOW", analysis: "The root or final arithmetic is taken one unit too low." },
    { value: answer + 1n, misconceptionId: "ROOT_OR_FINAL_ONE_HIGH", analysis: "The root or final arithmetic is taken one unit too high." },
    { value: answer + 2n, misconceptionId: "ROOT_OR_FINAL_TWO_HIGH", analysis: "The root or final arithmetic is taken two units too high." },
  ], pkg.correctIndex);
  const stem = mixed ? `Evaluate √${radicand} + ${add}.` : `Find the exact value of √${radicand}.`;
  const explanation = Object.freeze({
    coreConcept: mixed ? "Take the exact square root first, then complete the ordinary addition." : "Recognise the displayed number as a perfect square and take its exact principal square root.",
    steps: Object.freeze(mixed ? [`√${radicand} = ${root}.`, `${root} + ${add} = ${root + add}.`] : [`${root} × ${root} = ${radicand}.`, `Therefore √${radicand} = ${root}.`]),
    finalAnswer: `Therefore, the exact value is ${root + add}.`,
  });
  const oracle = Object.freeze({ kind: mixed ? "ROOT_ARITHMETIC" as const : "SQUARE_ROOT" as const, data: Object.freeze({ root, radicand, add, e1MaterialState: pkg.seed }) });
  return Object.freeze({
    ...pkg,
    difficulty: root >= 80 ? "MEDIUM" : "EASY",
    frameId: mixed ? "SAP-CP004-E1-MATERIAL-ROOT-ARITH" : "SAP-CP004-E1-MATERIAL-SQRT",
    stem,
    canonicalAnswer: answer.toString(),
    options,
    explanation,
    oracle,
    canonicalPayloadKey: JSON.stringify({ prototypeId: pkg.prototypeId, seed: pkg.seed, root, radicand, add, answer: answer.toString(), e1: "MATERIAL-ROOT-STATE" }),
    generationIdentity: `${pkg.prototypeId}:E1:MATERIAL-ROOT:${pkg.seed}:${root}:${add}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
  });
}

export function generateSapCp004PreExplanationPackage(prototypeId: SapCp004PrototypeId, seed: number, targetCorrectIndex?: number): SapCp004Package {
  return parityAware(generateEditorialPackage(prototypeId, seed, targetCorrectIndex));
}

export function generateSapCp004Package(prototypeId: SapCp004PrototypeId, seed: number, targetCorrectIndex?: number): SapCp004Package {
  const explained = applySapCp004ExplanationRemediationV3(generateSapCp004PreExplanationPackage(prototypeId, seed, targetCorrectIndex));
  return materialRootState(explained);
}

export function generateSapCp004Sweep(seedsPerPrototype: number): readonly SapCp004Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) throw new Error("Sweep size must be a positive integer.");
  const packages: SapCp004Package[] = [];
  for (const prototypeId of SAP_CP004_PROTOTYPE_IDS) for (let seed = 1; seed <= seedsPerPrototype; seed += 1) packages.push(generateSapCp004Package(prototypeId, seed));
  return Object.freeze(packages);
}
