import { hash32 } from "./exact";
import {
  generateSapCp003Package as generateV6Package,
  SAP_CP003_EDITORIAL_V3_STATE,
  SAP_CP003_RUNTIME_STATE,
} from "./editorial-runtime-v6";
import {
  SAP_CP003_PROTOTYPE_IDS,
  type SapCp003Option,
  type SapCp003Package,
  type SapCp003PrototypeId,
} from "./types";

function nextXorShift32(state: number): number {
  let value = state >>> 0 || 0x9e3779b9;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return value >>> 0;
}

function shuffledFour(seedMaterial: string): number[] {
  const values = [0, 1, 2, 3];
  let state = hash32(seedMaterial);
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = nextXorShift32(state);
    const swapIndex = state % (index + 1);
    [values[index], values[swapIndex]] = [values[swapIndex]!, values[index]!];
  }
  return values;
}

function targetCorrectIndex(pkg: SapCp003Package): number {
  const zeroBasedSeed = pkg.seed - 1;
  const block = Math.floor(zeroBasedSeed / 4);
  const offset = zeroBasedSeed % 4;
  return shuffledFour([
    "SAP_CP003_EDITORIAL_V3_CORRECT_POSITION_BLOCK",
    pkg.prototypeId,
    String(block),
  ].join("|"))[offset]!;
}

function balanceAnswerPosition(pkg: SapCp003Package): SapCp003Package {
  const options = [...pkg.options];
  const currentCorrectIndex = options.findIndex((option) => option.isCorrect);
  const target = targetCorrectIndex(pkg);
  if (currentCorrectIndex !== target) {
    [options[currentCorrectIndex], options[target]] = [options[target]!, options[currentCorrectIndex]!];
  }
  const displayed: readonly SapCp003Option[] = Object.freeze(options.map((option, index) => Object.freeze({
    ...option,
    displayIndex: index + 1,
  })));
  const correctIndex = displayed.findIndex((option) => option.isCorrect);
  const optionUniquenessPassed = new Set(displayed.map((option) => option.value)).size === 4;
  const singleCorrectOptionPassed = displayed.filter((option) => option.isCorrect).length === 1;
  const answerBindingPassed = displayed[correctIndex]?.value === pkg.canonicalAnswer;
  const errors = pkg.validation.errors.filter((error) => !/option|answer is not bound/i.test(error));
  if (!optionUniquenessPassed) errors.push("The four visible options are not unique.");
  if (!singleCorrectOptionPassed) errors.push("Exactly one option must be marked correct.");
  if (!answerBindingPassed) errors.push("The answer is not bound to the correct visible option.");
  return Object.freeze({
    ...pkg,
    options: displayed,
    correctIndex,
    validation: Object.freeze({
      ...pkg.validation,
      ok: errors.length === 0,
      errors: Object.freeze(errors),
      optionUniquenessPassed,
      singleCorrectOptionPassed,
      answerBindingPassed,
    }),
  });
}

export function generateSapCp003Package(
  prototypeId: SapCp003PrototypeId,
  seed: number,
): SapCp003Package {
  return balanceAnswerPosition(generateV6Package(prototypeId, seed));
}

export function generateSapCp003Sweep(
  seedsPerPrototype: number,
): readonly SapCp003Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("SAP-CP-003 sweep size must be a positive integer.");
  }
  const packages: SapCp003Package[] = [];
  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp003Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}

export { SAP_CP003_EDITORIAL_V3_STATE, SAP_CP003_RUNTIME_STATE };
