import {
  addRational,
  divideRational,
  equalsRational,
  isPositiveRational,
  isWholeRational,
  multiplyRational,
  rational,
  rationalKey,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import { formatMalCp001Answer } from "./cp001-presentation";
import type {
  BlendComponent,
  MalCp001MisconceptionId,
  MalCp001OptionAudit,
  MalCp001PrototypeParameters,
  MalCp001SolveResult,
  Rational,
} from "./types";

interface Candidate {
  result: MalCp001SolveResult;
  misconceptionId: MalCp001MisconceptionId;
}

function seedHash(seed: string): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function malCp001ResultKey(result: MalCp001SolveResult): string {
  switch (result.kind) {
    case "MEAN_VALUE":
      return `MEAN:${rationalKey(result.value)}`;
    case "SOURCE_VALUE":
      return `VALUE:${rationalKey(result.value)}`;
    case "COMPONENT_QUANTITY":
      return `QUANTITY:${rationalKey(result.quantity)}`;
    case "COMPONENT_RATIO":
      return `RATIO:${rationalKey(result.firstPart)}:${rationalKey(result.secondPart)}`;
    case "COMPONENT_QUANTITY_PAIR":
      return `PAIR:${rationalKey(result.firstQuantity)}:${rationalKey(result.secondQuantity)}`;
  }
}

export function sameMalCp001Result(
  left: MalCp001SolveResult,
  right: MalCp001SolveResult,
): boolean {
  if (left.kind !== right.kind) return false;
  switch (left.kind) {
    case "MEAN_VALUE":
      return right.kind === left.kind && equalsRational(left.value, right.value);
    case "SOURCE_VALUE":
      return right.kind === left.kind && equalsRational(left.value, right.value);
    case "COMPONENT_QUANTITY":
      return right.kind === left.kind && equalsRational(left.quantity, right.quantity);
    case "COMPONENT_RATIO":
      return right.kind === left.kind && equalsRational(left.firstPart, right.firstPart) && equalsRational(left.secondPart, right.secondPart);
    case "COMPONENT_QUANTITY_PAIR":
      return right.kind === left.kind && equalsRational(left.firstQuantity, right.firstQuantity) && equalsRational(left.secondQuantity, right.secondQuantity);
  }
}

function scalarResultLike(source: MalCp001SolveResult, value: Rational): MalCp001SolveResult | null {
  if (!isPositiveRational(value) || !isWholeRational(value)) return null;
  switch (source.kind) {
    case "MEAN_VALUE":
      return { ...source, value };
    case "SOURCE_VALUE":
      return { ...source, value };
    case "COMPONENT_QUANTITY":
      return { ...source, quantity: value };
    case "COMPONENT_RATIO":
    case "COMPONENT_QUANTITY_PAIR":
      return null;
  }
}

function simpleAverage(components: readonly BlendComponent[]): Rational {
  const total = components.reduce((sum, item) => addRational(sum, item.value), rational(0));
  return divideRational(total, rational(components.length));
}

function weightedWithReversedQuantities(components: readonly BlendComponent[]): Rational | null {
  if (components.length !== 2) return null;
  const totalQuantity = addRational(components[0].quantity, components[1].quantity);
  const weighted = addRational(
    multiplyRational(components[1].quantity, components[0].value),
    multiplyRational(components[0].quantity, components[1].value),
  );
  return divideRational(weighted, totalQuantity);
}

function candidatePool(
  parameters: MalCp001PrototypeParameters,
  correct: MalCp001SolveResult,
): Candidate[] {
  const request = parameters.request;
  const candidates: Candidate[] = [];
  const pushScalar = (value: Rational, misconceptionId: MalCp001MisconceptionId) => {
    const result = scalarResultLike(correct, value);
    if (result) candidates.push({ result, misconceptionId });
  };

  if (correct.kind === "COMPONENT_RATIO" && request.mode === "TWO_COMPONENT_RATIO_FROM_TARGET") {
    candidates.push({
      result: { ...correct, firstPart: correct.secondPart, secondPart: correct.firstPart },
      misconceptionId: "RATIO_REVERSED",
    });
    candidates.push({
      result: { ...correct, firstPart: rational(1), secondPart: rational(1) },
      misconceptionId: "SIMPLE_AVERAGE_USED",
    });
    const [first, second] = reduceRationalRatio(
      subtractRational(request.higherValue, request.lowerValue),
      subtractRational(request.targetValue, request.lowerValue),
    );
    candidates.push({
      result: { ...correct, firstPart: first, secondPart: second },
      misconceptionId: "SAME_SIDE_DIFFERENCES",
    });
    candidates.push({
      result: { ...correct, firstPart: rational(2), secondPart: rational(1) },
      misconceptionId: "SOURCE_GAP_USED_AS_RATIO",
    });
    return candidates;
  }

  if (correct.kind === "MEAN_VALUE" && request.mode === "MEAN_FROM_COMPONENTS") {
    pushScalar(simpleAverage(request.components), "SIMPLE_AVERAGE_USED");
    const reversed = weightedWithReversedQuantities(request.components);
    if (reversed) pushScalar(reversed, "QUANTITIES_SWAPPED");
    pushScalar(request.components[0].value, "KNOWN_SOURCE_REPORTED");
    if (request.components.length >= 3) {
      pushScalar(simpleAverage(request.components.slice(0, 2)), "ONE_COMPONENT_OMITTED");
    }
  }

  if (correct.kind === "SOURCE_VALUE" && request.mode === "UNKNOWN_COMPONENT_VALUE") {
    pushScalar(request.targetValue, "TARGET_REPORTED");
    pushScalar(request.knownComponents[0].value, "KNOWN_SOURCE_REPORTED");
    pushScalar(
      addRational(request.targetValue, subtractRational(request.targetValue, request.knownComponents[0].value)),
      "DIFFERENCE_INSTEAD_OF_UNKNOWN",
    );
  }

  if (correct.kind === "COMPONENT_QUANTITY") {
    if (request.mode === "UNKNOWN_COMPONENT_QUANTITY") {
      pushScalar(request.knownComponents[0].quantity, "KNOWN_QUANTITY_REPORTED");
      const knownTotal = request.knownComponents.reduce((sum, item) => addRational(sum, item.quantity), rational(0));
      pushScalar(knownTotal, "TOTAL_QUANTITY_REPORTED");
      pushScalar(subtractRational(knownTotal, correct.quantity), "DIFFERENCE_INSTEAD_OF_UNKNOWN");
    } else if (request.mode === "ADD_SOURCE_TO_REACH_TARGET") {
      const initialTotal = request.initialComponents.reduce((sum, item) => addRational(sum, item.quantity), rational(0));
      pushScalar(initialTotal, "KNOWN_QUANTITY_REPORTED");
      pushScalar(addRational(initialTotal, correct.quantity), "TOTAL_QUANTITY_REPORTED");
      pushScalar(subtractRational(initialTotal, correct.quantity), "DIFFERENCE_INSTEAD_OF_UNKNOWN");
    }
  }

  if (correct.kind === "COMPONENT_QUANTITY_PAIR" && request.mode === "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET") {
    const pushPair = (
      firstQuantity: Rational,
      secondQuantity: Rational,
      misconceptionId: MalCp001MisconceptionId,
    ) => {
      if (
        isPositiveRational(firstQuantity) &&
        isPositiveRational(secondQuantity) &&
        isWholeRational(firstQuantity) &&
        isWholeRational(secondQuantity)
      ) {
        candidates.push({
          result: { ...correct, firstQuantity, secondQuantity },
          misconceptionId,
        });
      }
    };
    pushPair(correct.secondQuantity, correct.firstQuantity, "RATIO_REVERSED");
    pushPair(
      addRational(correct.firstQuantity, rational(1)),
      subtractRational(correct.secondQuantity, rational(1)),
      "PLAUSIBLE_SCALE_ERROR",
    );
    pushPair(
      subtractRational(correct.firstQuantity, rational(1)),
      addRational(correct.secondQuantity, rational(1)),
      "PLAUSIBLE_SCALE_ERROR",
    );
    const half = divideRational(request.totalQuantity, rational(2));
    pushPair(half, half, "EQUAL_SPLIT_ASSUMED");
    for (const [numerator, denominator] of [[1, 3], [1, 4], [2, 5], [1, 5], [3, 5], [1, 6], [5, 6]] as const) {
      const firstQuantity = multiplyRational(request.totalQuantity, rational(numerator, denominator));
      const secondQuantity = subtractRational(request.totalQuantity, firstQuantity);
      pushPair(firstQuantity, secondQuantity, "PLAUSIBLE_SCALE_ERROR");
    }
  }

  if (correct.kind !== "COMPONENT_RATIO" && correct.kind !== "COMPONENT_QUANTITY_PAIR") {
    const scalar = correct.kind === "COMPONENT_QUANTITY" ? correct.quantity : correct.value;
    pushScalar(multiplyRational(scalar, rational(2)), "PLAUSIBLE_SCALE_ERROR");
    pushScalar(divideRational(scalar, rational(2)), "PLAUSIBLE_SCALE_ERROR");
    pushScalar(multiplyRational(scalar, rational(3, 2)), "PLAUSIBLE_SCALE_ERROR");
    pushScalar(addRational(scalar, rational(1)), "PLAUSIBLE_SCALE_ERROR");
    pushScalar(addRational(scalar, rational(2)), "PLAUSIBLE_SCALE_ERROR");
    pushScalar(addRational(scalar, rational(3)), "PLAUSIBLE_SCALE_ERROR");
    pushScalar(subtractRational(scalar, rational(1)), "PLAUSIBLE_SCALE_ERROR");
    pushScalar(multiplyRational(scalar, rational(3)), "PLAUSIBLE_SCALE_ERROR");
  }

  return candidates;
}

export function buildMalCp001Options(
  parameters: MalCp001PrototypeParameters,
  correct: MalCp001SolveResult,
): { options: string[]; optionAudit: MalCp001OptionAudit[]; correctIndex: number } {
  const correctKey = malCp001ResultKey(correct);
  const seen = new Set<string>([correctKey]);
  const distractors: Candidate[] = [];

  for (const candidate of candidatePool(parameters, correct)) {
    const key = malCp001ResultKey(candidate.result);
    if (seen.has(key)) continue;
    seen.add(key);
    distractors.push(candidate);
    if (distractors.length === 3) break;
  }

  if (distractors.length !== 3) {
    throw new Error(`Could not construct three unique distractors for ${parameters.prototypeId}.`);
  }

  const correctIndex = seedHash(`${parameters.prototypeId}:${parameters.seed}:options`) % 4;
  const ordered: MalCp001OptionAudit[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      ordered.push({
        text: formatMalCp001Answer(correct, parameters),
        result: correct,
        misconceptionId: "CORRECT",
      });
    } else {
      const distractor = distractors[distractorIndex++];
      ordered.push({
        text: formatMalCp001Answer(distractor.result, parameters),
        result: distractor.result,
        misconceptionId: distractor.misconceptionId,
      });
    }
  }

  return {
    options: ordered.map((item) => item.text),
    optionAudit: ordered,
    correctIndex,
  };
}
