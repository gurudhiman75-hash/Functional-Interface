import { hash32 } from "./exact";
import {
  generateSapCp003Package as generateV4Package,
  SAP_CP003_RUNTIME_STATE,
} from "./editorial-runtime-v4";
import { applySapCp003StructuralVariantsV2 } from "./structural-variants-v2";
import { applySapCp003StructuralVariantsV3 } from "./structural-variants-v3";
import { applySapCp003StructuralVariantsV4 } from "./structural-variants-v4";
import { applySapCp003StructuralVariantsV5 } from "./structural-variants-v5";
import {
  SAP_CP003_PROTOTYPE_IDS,
  type SapCp003Option,
  type SapCp003Package,
  type SapCp003PrototypeId,
} from "./types";

function nextXorShift32(state: number): number {
  let value = state >>> 0 || 0x85ebca6b;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return value >>> 0;
}

function stripLeadingZerosFromVisibleInteger(value: string): string {
  return value.replace(/^0+(?=\d)/, "");
}

function normaliseVisibleDecimalPlacement(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT") return pkg;

  const normaliseLine = (line: string): string => line.replace(
    /(?:Ignoring decimal points, |Ignore the decimal points: )(\d+) × (\d+) = (\d+)/,
    (match, left: string, right: string, product: string) => match
      .replace(left, stripLeadingZerosFromVisibleInteger(left))
      .replace(right, stripLeadingZerosFromVisibleInteger(right))
      .replace(product, stripLeadingZerosFromVisibleInteger(product)),
  );

  const stem = normaliseLine(pkg.stem);
  const steps = Object.freeze(pkg.explanation.steps.map(normaliseLine));
  return stem === pkg.stem && steps.every((step, index) => step === pkg.explanation.steps[index])
    ? pkg
    : Object.freeze({
      ...pkg,
      stem,
      explanation: Object.freeze({
        ...pkg.explanation,
        steps,
      }),
    });
}

function finalOptionShuffle(pkg: SapCp003Package): SapCp003Package {
  const order = [0, 1, 2, 3];
  let state = hash32([
    "SAP_CP003_FINAL_OPTION_ORDER_V2",
    pkg.prototypeId,
    pkg.canonicalPayloadKey,
    pkg.generationIdentity,
  ].join("|"));

  for (let index = order.length - 1; index > 0; index -= 1) {
    state = nextXorShift32(state);
    const swapIndex = state % (index + 1);
    [order[index], order[swapIndex]] = [order[swapIndex]!, order[index]!];
  }

  const options: readonly SapCp003Option[] = Object.freeze(order.map((sourceIndex, displayIndex) => Object.freeze({
    ...pkg.options[sourceIndex]!,
    displayIndex: displayIndex + 1,
  })));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const optionUniquenessPassed = new Set(options.map((option) => option.value)).size === 4;
  const singleCorrectOptionPassed = options.filter((option) => option.isCorrect).length === 1;
  const answerBindingPassed = correctIndex >= 0 && options[correctIndex]?.value === pkg.canonicalAnswer;
  const errors = pkg.validation.errors.filter((error) => !/option|answer is not bound/i.test(error));
  if (!optionUniquenessPassed) errors.push("The four visible options are not unique.");
  if (!singleCorrectOptionPassed) errors.push("Exactly one option must be marked correct.");
  if (!answerBindingPassed) errors.push("The answer is not bound to the correct visible option.");

  return Object.freeze({
    ...pkg,
    options,
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
  const v2 = applySapCp003StructuralVariantsV2(generateV4Package(prototypeId, seed));
  const v3 = applySapCp003StructuralVariantsV3(v2);
  const v4 = applySapCp003StructuralVariantsV4(v3);
  const v5 = applySapCp003StructuralVariantsV5(v4);
  const presentationSafe = normaliseVisibleDecimalPlacement(v5);
  return finalOptionShuffle(presentationSafe);
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

export { SAP_CP003_RUNTIME_STATE };
