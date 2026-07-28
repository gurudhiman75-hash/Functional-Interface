import { generateMalCp001Prototype } from "./pipeline";
import { generateMalCp001GapParameters } from "./cp001-gap-generator";
import {
  solveMalCp001Gap,
  verifyMalCp001GapIndependently,
} from "./cp001-gap-solver";
import {
  getMalCp001GapRegistryEntry,
  isMalCp001GapPrototypeId,
} from "./cp001-gap-registry";
import {
  addRational,
  divideRational,
  formatRational,
  isPositiveRational,
  isWholeRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
  toLatex,
} from "./rational";
import { buildBlendState } from "./state-model";
import type {
  MalCp001Explanation,
  MalReasoningGraph,
  Rational,
  VerificationResult,
} from "./types";
import type {
  MalCp001GapGeneratedPrototype,
  MalCp001GapMisconceptionId,
  MalCp001GapOptionAudit,
  MalCp001GapParameters,
  MalCp001GapPrototypeId,
  MalCp001GapResult,
} from "./cp001-gap-types";
import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? item.toString() : item
  );
}

function hashIndex(text: string, modulus: number): number {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % modulus;
}

function resultRationals(result: MalCp001GapResult): Rational[] {
  switch (result.kind) {
    case "SOURCE_VALUE":
    case "MEAN_VALUE":
      return [result.value];
    case "COMPONENT_QUANTITY":
      return [result.quantity];
    case "COMPONENT_QUANTITY_PAIR":
      return [result.firstQuantity, result.secondQuantity];
  }
}

function resultKey(result: MalCp001GapResult): string {
  switch (result.kind) {
    case "SOURCE_VALUE":
    case "MEAN_VALUE":
      return `${result.kind}:${rationalKey(result.value)}`;
    case "COMPONENT_QUANTITY":
      return `${result.kind}:${rationalKey(result.quantity)}`;
    case "COMPONENT_QUANTITY_PAIR":
      return `${result.kind}:${rationalKey(result.firstQuantity)}:${rationalKey(result.secondQuantity)}`;
  }
}

function quantityText(value: Rational, parameters: MalCp001GapParameters): string {
  return `${formatRational(value)} ${parameters.context.quantityUnit}`;
}

function valueText(value: Rational, parameters: MalCp001GapParameters): string {
  const denominator = parameters.context.quantityUnit === "kg" ? "kg" : "litre";
  return `₹${formatRational(value)} per ${denominator}`;
}

function resultText(
  result: MalCp001GapResult,
  parameters: MalCp001GapParameters,
): string {
  switch (result.kind) {
    case "SOURCE_VALUE":
    case "MEAN_VALUE":
      return valueText(result.value, parameters);
    case "COMPONENT_QUANTITY":
      return quantityText(result.quantity, parameters);
    case "COMPONENT_QUANTITY_PAIR":
      return `${quantityText(result.firstQuantity, parameters)} and ${quantityText(result.secondQuantity, parameters)}`;
  }
}

function positiveWhole(result: MalCp001GapResult): boolean {
  return resultRationals(result).every(
    (value) => isPositiveRational(value) && isWholeRational(value),
  );
}

function totalForQuantityRequest(parameters: MalCp001GapParameters): Rational | null {
  switch (parameters.request.mode) {
    case "COMPONENT_SHARE_FROM_TARGET":
    case "THREE_WAY_TARGET_WITH_RELATION":
      return parameters.request.totalQuantity;
    default:
      return null;
  }
}

function buildGapOptions(
  parameters: MalCp001GapParameters,
  solution: MalCp001GapResult,
): { options: string[]; optionAudit: MalCp001GapOptionAudit[]; correctIndex: number } {
  const candidates: MalCp001GapOptionAudit[] = [];
  const seen = new Set<string>();

  const add = (
    result: MalCp001GapResult,
    misconceptionId: MalCp001GapMisconceptionId,
  ): void => {
    if (!positiveWhole(result)) return;
    const key = resultKey(result);
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({
      text: resultText(result, parameters),
      result,
      misconceptionId,
    });
  };

  add(solution, "CORRECT");

  switch (parameters.request.mode) {
    case "SOURCE_VALUE_FROM_RATIO": {
      add(
        { kind: "SOURCE_VALUE", value: parameters.request.targetValue },
        "TARGET_REPORTED",
      );
      add(
        { kind: "SOURCE_VALUE", value: parameters.request.knownValue },
        "KNOWN_SOURCE_REPORTED",
      );
      const totalParts = addRational(
        parameters.request.lowerRatioPart,
        parameters.request.higherRatioPart,
      );
      add(
        {
          kind: "SOURCE_VALUE",
          value: addRational(parameters.request.knownValue, totalParts),
        },
        "RATIO_PART_USED_AS_QUANTITY",
      );
      break;
    }
    case "COMPONENT_SHARE_FROM_TARGET": {
      const other = subtractRational(
        parameters.request.totalQuantity,
        solution.kind === "COMPONENT_QUANTITY" ? solution.quantity : rational(0),
      );
      add({ kind: "COMPONENT_QUANTITY", quantity: other }, "OTHER_COMPONENT_REPORTED");
      add(
        { kind: "COMPONENT_QUANTITY", quantity: parameters.request.totalQuantity },
        "TARGET_REPORTED",
      );
      add(
        {
          kind: "COMPONENT_QUANTITY",
          quantity: divideRational(parameters.request.totalQuantity, rational(2)),
        },
        "EQUAL_SPLIT_ASSUMED",
      );
      break;
    }
    case "DIFFERENCE_BASED_QUANTITIES": {
      if (solution.kind === "COMPONENT_QUANTITY_PAIR") {
        add(
          {
            kind: "COMPONENT_QUANTITY_PAIR",
            firstQuantity: solution.secondQuantity,
            secondQuantity: solution.firstQuantity,
          },
          "QUANTITIES_SWAPPED",
        );
        add(
          {
            kind: "COMPONENT_QUANTITY_PAIR",
            firstQuantity: parameters.request.quantityDifference,
            secondQuantity: addRational(
              parameters.request.quantityDifference,
              rational(1),
            ),
          },
          "DIFFERENCE_USED_AS_SCALE",
        );
        const average = divideRational(
          addRational(solution.firstQuantity, solution.secondQuantity),
          rational(2),
        );
        add(
          {
            kind: "COMPONENT_QUANTITY_PAIR",
            firstQuantity: average,
            secondQuantity: average,
          },
          "EQUAL_SPLIT_ASSUMED",
        );
      }
      break;
    }
    case "TWO_STAGE_BLEND_MEAN": {
      const stageOneMean = buildBlendState(
        parameters.request.stageOneComponents,
      ).meanValue;
      add({ kind: "MEAN_VALUE", value: stageOneMean }, "STAGE_ONE_MEAN_REPORTED");
      add(
        {
          kind: "MEAN_VALUE",
          value: divideRational(
            addRational(stageOneMean, parameters.request.finalComponent.value),
            rational(2),
          ),
        },
        "SIMPLE_STAGE_AVERAGE",
      );
      add(
        { kind: "MEAN_VALUE", value: parameters.request.finalComponent.value },
        "ONE_COMPONENT_OMITTED",
      );
      break;
    }
    case "TWO_STAGE_UNKNOWN_QUANTITY": {
      add(
        {
          kind: "COMPONENT_QUANTITY",
          quantity: parameters.request.stageOneQuantityUsed,
        },
        "KNOWN_STAGE_QUANTITY_REPORTED",
      );
      add(
        {
          kind: "COMPONENT_QUANTITY",
          quantity: addRational(
            parameters.request.stageOneQuantityUsed,
            rational(1),
          ),
        },
        "PLAUSIBLE_SCALE_ERROR",
      );
      add(
        {
          kind: "COMPONENT_QUANTITY",
          quantity: subtractRational(
            parameters.request.stageOneQuantityUsed,
            rational(1),
          ),
        },
        "TOTAL_MINUS_ANSWER",
      );
      break;
    }
    case "THREE_WAY_TARGET_WITH_RELATION": {
      const total = parameters.request.totalQuantity;
      add(
        {
          kind: "COMPONENT_QUANTITY",
          quantity: divideRational(
            total,
            addRational(
              rational(2),
              parameters.request.middleToLowerMultiplier,
            ),
          ),
        },
        "RELATION_COMPONENT_REPORTED",
      );
      if (solution.kind === "COMPONENT_QUANTITY") {
        add(
          {
            kind: "COMPONENT_QUANTITY",
            quantity: subtractRational(total, solution.quantity),
          },
          "TOTAL_MINUS_ANSWER",
        );
      }
      add(
        {
          kind: "COMPONENT_QUANTITY",
          quantity: divideRational(total, rational(3)),
        },
        "EQUAL_SPLIT_ASSUMED",
      );
      break;
    }
  }

  for (let offset = 1; candidates.length < 4 && offset < 40; offset += 1) {
    switch (solution.kind) {
      case "SOURCE_VALUE":
        add(
          { kind: "SOURCE_VALUE", value: addRational(solution.value, rational(offset)) },
          "PLAUSIBLE_SCALE_ERROR",
        );
        break;
      case "MEAN_VALUE":
        add(
          { kind: "MEAN_VALUE", value: addRational(solution.value, rational(offset)) },
          "PLAUSIBLE_SCALE_ERROR",
        );
        break;
      case "COMPONENT_QUANTITY": {
        const total = totalForQuantityRequest(parameters);
        const increased = addRational(solution.quantity, rational(offset));
        if (!total || increased.numerator * total.denominator < total.numerator * increased.denominator) {
          add(
            { kind: "COMPONENT_QUANTITY", quantity: increased },
            "PLAUSIBLE_SCALE_ERROR",
          );
        }
        break;
      }
      case "COMPONENT_QUANTITY_PAIR":
        add(
          {
            kind: "COMPONENT_QUANTITY_PAIR",
            firstQuantity: addRational(solution.firstQuantity, rational(offset)),
            secondQuantity: addRational(solution.secondQuantity, rational(offset)),
          },
          "PLAUSIBLE_SCALE_ERROR",
        );
        break;
    }
  }

  if (candidates.length < 4) {
    throw new Error(
      `Could not build four unique integral options for ${parameters.prototypeId}/${parameters.seed}.`,
    );
  }

  const selected = candidates.slice(0, 4);
  const correct = selected.find((candidate) => candidate.misconceptionId === "CORRECT");
  if (!correct) throw new Error("Gap option package lost the correct candidate.");
  const distractors = selected.filter((candidate) => candidate !== correct);
  const correctIndex = hashIndex(
    `${parameters.prototypeId}:${parameters.seed}:correct-index`,
    4,
  );
  const arranged: MalCp001GapOptionAudit[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    arranged.push(index === correctIndex ? correct : distractors[distractorIndex++]);
  }

  return {
    options: arranged.map((option) => option.text),
    optionAudit: arranged,
    correctIndex,
  };
}

function stemVariant(parameters: MalCp001GapParameters): number {
  return hashIndex(`${parameters.prototypeId}:${parameters.seed}:stem`, 4);
}

function renderGapStem(parameters: MalCp001GapParameters): string {
  const { context, request } = parameters;
  const variant = stemVariant(parameters);

  switch (request.mode) {
    case "SOURCE_VALUE_FROM_RATIO": {
      const knownLabel = request.knownSide === "LOWER"
        ? request.lowerComponentLabel
        : request.higherComponentLabel;
      const unknownLabel = request.knownSide === "LOWER"
        ? request.higherComponentLabel
        : request.lowerComponentLabel;
      const ratio = `${formatRational(request.lowerRatioPart)}:${formatRational(request.higherRatioPart)}`;
      const stems = [
        `${context.actor} blends ${request.lowerComponentLabel} and ${request.higherComponentLabel} in the ratio ${ratio}. The ${knownLabel} costs ${valueText(request.knownValue, parameters)}, and the blend costs ${valueText(request.targetValue, parameters)}. What is the cost of the ${unknownLabel}?`,
        `The quantities of ${request.lowerComponentLabel} and ${request.higherComponentLabel} are in the ratio ${ratio}. If the ${knownLabel} is priced at ${valueText(request.knownValue, parameters)} and the mixture at ${valueText(request.targetValue, parameters)}, what price must the ${unknownLabel} have?`,
        `${context.actor} obtains a mixture worth ${valueText(request.targetValue, parameters)} by using ${request.lowerComponentLabel} and ${request.higherComponentLabel} in the ratio ${ratio}. Given that the ${knownLabel} costs ${valueText(request.knownValue, parameters)}, what is the unit price of the ${unknownLabel}?`,
        `A ${context.material} blend contains ${request.lowerComponentLabel} and ${request.higherComponentLabel} in the ratio ${ratio}. Its average price is ${valueText(request.targetValue, parameters)}, while the ${knownLabel} costs ${valueText(request.knownValue, parameters)}. What does the ${unknownLabel} cost?`,
      ];
      return stems[variant];
    }
    case "COMPONENT_SHARE_FROM_TARGET": {
      const requestedLabel = request.requestedSide === "LOWER"
        ? request.lowerComponentLabel
        : request.higherComponentLabel;
      const stems = [
        `${context.actor} makes ${quantityText(request.totalQuantity, parameters)} of a blend using ${request.lowerComponentLabel} at ${valueText(request.lowerValue, parameters)} and ${request.higherComponentLabel} at ${valueText(request.higherValue, parameters)}. The blend is worth ${valueText(request.targetValue, parameters)}. How much ${requestedLabel} is used?`,
        `A ${quantityText(request.totalQuantity, parameters)} mixture is formed from ${request.lowerComponentLabel} costing ${valueText(request.lowerValue, parameters)} and ${request.higherComponentLabel} costing ${valueText(request.higherValue, parameters)}. If its mean price is ${valueText(request.targetValue, parameters)}, what quantity of ${requestedLabel} does it contain?`,
        `The total quantity of a ${context.material} blend is ${quantityText(request.totalQuantity, parameters)}. Its two components cost ${valueText(request.lowerValue, parameters)} and ${valueText(request.higherValue, parameters)}, and the final average is ${valueText(request.targetValue, parameters)}. What is the share of ${requestedLabel}?`,
        `${context.actor} combines ${request.lowerComponentLabel} and ${request.higherComponentLabel} to obtain ${quantityText(request.totalQuantity, parameters)} at an average price of ${valueText(request.targetValue, parameters)}. Their prices are ${valueText(request.lowerValue, parameters)} and ${valueText(request.higherValue, parameters)} respectively. How much ${requestedLabel} is present?`,
      ];
      return stems[variant];
    }
    case "DIFFERENCE_BASED_QUANTITIES": {
      const stems = [
        `${context.actor} mixes ${request.lowerComponentLabel} at ${valueText(request.lowerValue, parameters)} with ${request.higherComponentLabel} at ${valueText(request.higherValue, parameters)} to obtain a blend worth ${valueText(request.targetValue, parameters)}. The two quantities differ by ${quantityText(request.quantityDifference, parameters)}. What are the two quantities?`,
        `A mixture of ${request.lowerComponentLabel} and ${request.higherComponentLabel} has an average price of ${valueText(request.targetValue, parameters)}. Their prices are ${valueText(request.lowerValue, parameters)} and ${valueText(request.higherValue, parameters)}, and the quantities differ by ${quantityText(request.quantityDifference, parameters)}. What quantity of each is used?`,
        `${context.actor} uses two grades priced at ${valueText(request.lowerValue, parameters)} and ${valueText(request.higherValue, parameters)}. The resulting blend costs ${valueText(request.targetValue, parameters)}, and one quantity exceeds the other by ${quantityText(request.quantityDifference, parameters)}. Determine both quantities.`,
        `The mean price of a two-component ${context.material} blend is ${valueText(request.targetValue, parameters)}. The component prices are ${valueText(request.lowerValue, parameters)} and ${valueText(request.higherValue, parameters)}, while their quantities differ by ${quantityText(request.quantityDifference, parameters)}. What are those quantities?`,
      ];
      return stems[variant];
    }
    case "TWO_STAGE_BLEND_MEAN": {
      const [first, second] = request.stageOneComponents;
      const final = request.finalComponent;
      const stems = [
        `${context.actor} first mixes ${quantityText(first.quantity, parameters)} of ${first.label} at ${valueText(first.value, parameters)} with ${quantityText(second.quantity, parameters)} of ${second.label} at ${valueText(second.value, parameters)}. From this blend, ${quantityText(request.stageOneQuantityUsed, parameters)} is mixed with ${quantityText(final.quantity, parameters)} of ${final.label} at ${valueText(final.value, parameters)}. What is the final average price?`,
        `A first-stage blend contains ${quantityText(first.quantity, parameters)} of ${first.label} costing ${valueText(first.value, parameters)} and ${quantityText(second.quantity, parameters)} of ${second.label} costing ${valueText(second.value, parameters)}. If ${quantityText(request.stageOneQuantityUsed, parameters)} of it is then combined with ${quantityText(final.quantity, parameters)} of ${final.label} costing ${valueText(final.value, parameters)}, what is the mean price of the final mixture?`,
        `${context.actor} prepares a blend from ${first.label} and ${second.label}: ${quantityText(first.quantity, parameters)} at ${valueText(first.value, parameters)} and ${quantityText(second.quantity, parameters)} at ${valueText(second.value, parameters)}. A portion of ${quantityText(request.stageOneQuantityUsed, parameters)} is later mixed with ${quantityText(final.quantity, parameters)} of ${final.label} at ${valueText(final.value, parameters)}. What is the resulting average price?`,
        `First, ${quantityText(first.quantity, parameters)} of ${first.label} at ${valueText(first.value, parameters)} is blended with ${quantityText(second.quantity, parameters)} of ${second.label} at ${valueText(second.value, parameters)}. Next, ${quantityText(request.stageOneQuantityUsed, parameters)} of that uniform blend is combined with ${quantityText(final.quantity, parameters)} of ${final.label} at ${valueText(final.value, parameters)}. What does the final blend cost per unit?`,
      ];
      return stems[variant];
    }
    case "TWO_STAGE_UNKNOWN_QUANTITY": {
      const [first, second] = request.stageOneComponents;
      const stems = [
        `${context.actor} first blends ${quantityText(first.quantity, parameters)} of ${first.label} at ${valueText(first.value, parameters)} with ${quantityText(second.quantity, parameters)} of ${second.label} at ${valueText(second.value, parameters)}. Then ${quantityText(request.stageOneQuantityUsed, parameters)} of this blend is mixed with ${request.finalComponentLabel} at ${valueText(request.finalComponentValue, parameters)} so that the final price becomes ${valueText(request.targetValue, parameters)}. How much ${request.finalComponentLabel} is added?`,
        `A uniform first-stage mixture is made from ${quantityText(first.quantity, parameters)} of ${first.label} costing ${valueText(first.value, parameters)} and ${quantityText(second.quantity, parameters)} of ${second.label} costing ${valueText(second.value, parameters)}. What quantity of ${request.finalComponentLabel} at ${valueText(request.finalComponentValue, parameters)} must be added to ${quantityText(request.stageOneQuantityUsed, parameters)} of this mixture to obtain ${valueText(request.targetValue, parameters)}?`,
        `${context.actor} prepares a blend using ${first.label} and ${second.label}: ${quantityText(first.quantity, parameters)} at ${valueText(first.value, parameters)} and ${quantityText(second.quantity, parameters)} at ${valueText(second.value, parameters)}. A ${quantityText(request.stageOneQuantityUsed, parameters)} portion is used in a second blend. How much ${request.finalComponentLabel} priced at ${valueText(request.finalComponentValue, parameters)} is required to reach ${valueText(request.targetValue, parameters)}?`,
        `From a first blend of ${quantityText(first.quantity, parameters)} of ${first.label} at ${valueText(first.value, parameters)} and ${quantityText(second.quantity, parameters)} of ${second.label} at ${valueText(second.value, parameters)}, ${quantityText(request.stageOneQuantityUsed, parameters)} is taken. What quantity of ${request.finalComponentLabel} at ${valueText(request.finalComponentValue, parameters)} will make the second-stage average ${valueText(request.targetValue, parameters)}?`,
      ];
      return stems[variant];
    }
    case "THREE_WAY_TARGET_WITH_RELATION": {
      const multiplier = formatRational(request.middleToLowerMultiplier);
      const stems = [
        `${context.actor} makes ${quantityText(request.totalQuantity, parameters)} of a three-grade blend using ${request.lowerComponentLabel}, ${request.middleComponentLabel}, and ${request.higherComponentLabel} priced at ${valueText(request.lowerValue, parameters)}, ${valueText(request.middleValue, parameters)}, and ${valueText(request.higherValue, parameters)} respectively. The quantity of ${request.middleComponentLabel} is ${multiplier} times that of ${request.lowerComponentLabel}, and the blend costs ${valueText(request.targetValue, parameters)}. How much ${request.higherComponentLabel} is used?`,
        `A ${quantityText(request.totalQuantity, parameters)} mixture contains three components costing ${valueText(request.lowerValue, parameters)}, ${valueText(request.middleValue, parameters)}, and ${valueText(request.higherValue, parameters)}. The middle-priced component has ${multiplier} times the quantity of the lower-priced component. If the mean price is ${valueText(request.targetValue, parameters)}, what is the quantity of the highest-priced component?`,
        `${context.actor} combines ${request.lowerComponentLabel}, ${request.middleComponentLabel}, and ${request.higherComponentLabel} to obtain ${quantityText(request.totalQuantity, parameters)} at ${valueText(request.targetValue, parameters)}. Their prices are ${valueText(request.lowerValue, parameters)}, ${valueText(request.middleValue, parameters)}, and ${valueText(request.higherValue, parameters)}, and the middle quantity is ${multiplier} times the lower quantity. What quantity of ${request.higherComponentLabel} is present?`,
        `The total quantity of a three-component ${context.material} blend is ${quantityText(request.totalQuantity, parameters)}. Its component prices are ${valueText(request.lowerValue, parameters)}, ${valueText(request.middleValue, parameters)}, and ${valueText(request.higherValue, parameters)}. The middle component is used in ${multiplier} times the quantity of the lower component. If the final average is ${valueText(request.targetValue, parameters)}, how much of the higher component is used?`,
      ];
      return stems[variant];
    }
  }
}

function renderGapExplanation(
  parameters: MalCp001GapParameters,
  solution: MalCp001GapResult,
): MalCp001Explanation {
  const request = parameters.request;
  const answer = resultText(solution, parameters);

  switch (request.mode) {
    case "SOURCE_VALUE_FROM_RATIO": {
      const totalParts = addRational(request.lowerRatioPart, request.higherRatioPart);
      return {
        opening: "Treat the stated ratio parts as exact component quantities and balance their total value against the target mean.",
        formula: "Target mean × total ratio parts = sum of the two weighted source values.",
        steps: [
          `The total ratio weight is \(${toLatex(request.lowerRatioPart)}+${toLatex(request.higherRatioPart)}=${toLatex(totalParts)}\).`,
          `The target weighted value is \(${toLatex(request.targetValue)}\times${toLatex(totalParts)}\).`,
          `After subtracting the known source contribution and dividing by the unknown source's ratio part, the missing value is \(${solution.kind === "SOURCE_VALUE" ? toLatex(solution.value) : "?"}\).`,
        ],
        verification: `Substituting the recovered source into the two weighted contributions gives the target mean \(${toLatex(request.targetValue)}\).`,
        conclusion: `Therefore, the unknown source costs ${answer}.`,
        commonTrap: "Common Trap: Reversing the ratio parts changes which contribution must be divided out.",
      };
    }
    case "COMPONENT_SHARE_FROM_TARGET": {
      const lowerPart = subtractRational(request.higherValue, request.targetValue);
      const higherPart = subtractRational(request.targetValue, request.lowerValue);
      return {
        opening: "The component shares are proportional to the opposite distances from the target price.",
        formula: "Lower-value quantity : higher-value quantity = (higher − target) : (target − lower).",
        steps: [
          `The alligation parts are \(${toLatex(lowerPart)}:${toLatex(higherPart)}\).`,
          `These parts divide the total \(${toLatex(request.totalQuantity)}\) in the same ratio.`,
          `The requested share is ${answer}.`,
        ],
        verification: `Using the requested share and the remaining quantity in the weighted equation reproduces \(${toLatex(request.targetValue)}\).`,
        conclusion: `Hence, the required component quantity is ${answer}.`,
        commonTrap: "Common Trap: The lower-priced component receives the opposite difference, not its same-side difference.",
      };
    }
    case "DIFFERENCE_BASED_QUANTITIES": {
      const lowerPart = subtractRational(request.higherValue, request.targetValue);
      const higherPart = subtractRational(request.targetValue, request.lowerValue);
      const partDifference = subtractRational(lowerPart, higherPart);
      return {
        opening: "First obtain the alligation ratio, then use the stated quantity difference to determine its scale.",
        formula: "Scale = actual quantity difference ÷ absolute difference between the ratio parts.",
        steps: [
          `Alligation gives the quantity ratio \(${toLatex(lowerPart)}:${toLatex(higherPart)}\).`,
          `The absolute difference between these parts is \(|${toLatex(partDifference)}|\), corresponding to ${quantityText(request.quantityDifference, parameters)}.`,
          `Scaling both ratio parts gives ${answer}.`,
        ],
        verification: `The recovered quantities differ by \(${toLatex(request.quantityDifference)}\) and their weighted mean is \(${toLatex(request.targetValue)}\).`,
        conclusion: `Therefore, the two component quantities are ${answer}.`,
        commonTrap: "Common Trap: The stated difference is a scale condition; it is not itself either component quantity.",
      };
    }
    case "TWO_STAGE_BLEND_MEAN": {
      const firstState = buildBlendState(request.stageOneComponents);
      return {
        opening: "Because the first blend is uniform, every portion taken from it has the same first-stage mean value.",
        formula: "First-stage mean = weighted total ÷ first-stage quantity; final mean = final weighted total ÷ final quantity.",
        steps: [
          `The first-stage mean is \(${toLatex(firstState.weightedTotal)}\div${toLatex(firstState.totalQuantity)}=${toLatex(firstState.meanValue)}\).`,
          `The transferred portion therefore contributes \(${toLatex(request.stageOneQuantityUsed)}\times${toLatex(firstState.meanValue)}\).`,
          `Combining that contribution with the final component gives the final mean ${answer}.`,
        ],
        verification: `The two final-stage weighted contributions divided by their total quantity equal \(${solution.kind === "MEAN_VALUE" ? toLatex(solution.value) : "?"}\).`,
        conclusion: `Thus, the final blend costs ${answer}.`,
        commonTrap: "Common Trap: Do not average the two stage means without weighting them by the quantities used in the second stage.",
      };
    }
    case "TWO_STAGE_UNKNOWN_QUANTITY": {
      const firstState = buildBlendState(request.stageOneComponents);
      return {
        opening: "Replace the transferred first-stage portion by an equivalent component having the first blend's mean value.",
        formula: "Transferred quantity × (target − first-stage mean) = added quantity × (added value − target).",
        steps: [
          `The first-stage mean is \(${toLatex(firstState.weightedTotal)}\div${toLatex(firstState.totalQuantity)}=${toLatex(firstState.meanValue)}\).`,
          `For the second stage, balance the deviations from the target \(${toLatex(request.targetValue)}\).`,
          `Solving that balance gives the added quantity ${answer}.`,
        ],
        verification: `Using ${answer} with the transferred portion makes the final weighted mean exactly \(${toLatex(request.targetValue)}\).`,
        conclusion: `Therefore, ${answer} of the final component is required.`,
        commonTrap: "Common Trap: The full first-stage quantity is not used; only the stated transferred portion enters the second-stage equation.",
      };
    }
    case "THREE_WAY_TARGET_WITH_RELATION": {
      return {
        opening: "Use the quantity relation to reduce the three unknown quantities to one variable before applying the total and weighted-value equations.",
        formula: "If middle quantity = k × lower quantity, then higher quantity = total − (1+k) × lower quantity.",
        steps: [
          `Let the lower quantity be \(x\); then the middle quantity is \(${toLatex(request.middleToLowerMultiplier)}x\).`,
          `The higher quantity is \(${toLatex(request.totalQuantity)}-(1+${toLatex(request.middleToLowerMultiplier)})x\).`,
          `Substituting these quantities into the weighted target equation gives the higher-component quantity ${answer}.`,
        ],
        verification: `The three recovered quantities total \(${toLatex(request.totalQuantity)}\), satisfy the stated multiplier, and reproduce the mean \(${toLatex(request.targetValue)}\).`,
        conclusion: `Hence, the higher-priced component quantity is ${answer}.`,
        commonTrap: "Common Trap: The multiplier relates the middle and lower quantities; it does not directly give the higher quantity.",
      };
    }
  }
}

function buildGapReasoningGraph(
  parameters: MalCp001GapParameters,
  solution: MalCp001GapResult,
  explanation: MalCp001Explanation,
): MalReasoningGraph {
  return {
    nodes: [
      {
        id: "given",
        kind: "GIVEN",
        text: `Use the exact data for ${parameters.context.scenarioId}.`,
        dependsOn: [],
      },
      {
        id: "relation",
        kind: "RELATION",
        text: explanation.formula,
        dependsOn: ["given"],
      },
      {
        id: "derivation",
        kind: "DERIVATION",
        text: explanation.steps.join(" "),
        dependsOn: ["relation"],
      },
      {
        id: "verification",
        kind: "VERIFICATION",
        text: explanation.verification,
        dependsOn: ["derivation"],
      },
      {
        id: "conclusion",
        kind: "CONCLUSION",
        text: `${explanation.conclusion} [${resultKey(solution)}]`,
        dependsOn: ["verification"],
      },
    ],
  };
}

function validateGapPrototype(
  question: MalCp001GapGeneratedPrototype,
): VerificationResult {
  const errors: string[] = [];
  if (!question.stem.endsWith("?")) errors.push("Stem must end with a question mark.");
  if (/^[a-z]/u.test(question.stem)) errors.push("Stem begins with a lower-case letter.");
  if (question.options.length !== 4 || new Set(question.options).size !== 4) {
    errors.push("Options must contain four visibly unique entries.");
  }
  if (question.correctIndex < 0 || question.correctIndex > 3) {
    errors.push("Correct option index is outside 0..3.");
  }
  if (question.optionAudit.filter((item) => item.misconceptionId === "CORRECT").length !== 1) {
    errors.push("Option audit must contain exactly one CORRECT label.");
  }
  if (resultKey(question.optionAudit[question.correctIndex]?.result) !== resultKey(question.solution)) {
    errors.push("Correct option does not match the canonical solution.");
  }
  if (!positiveWhole(question.solution)) errors.push("Displayed solution must be positive and integral.");
  if (question.optionAudit.some((item) => !positiveWhole(item.result))) {
    errors.push("Displayed options must be positive and integral.");
  }
  if (!question.explanation.verification.includes("\\(")) {
    errors.push("Verification must contain exact mathematical notation.");
  }
  if (!question.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION")) {
    errors.push("Reasoning graph lacks a verification node.");
  }
  if (question.permanentQlId !== null) errors.push("Permanent QL allocation is prohibited.");
  if (question.publiclyPublishable || question.questionStudioDiscoverable) {
    errors.push("Gap prototype escaped the discovery safety boundary.");
  }
  return { ok: errors.length === 0, errors };
}

export function generateMalCp001GapPrototype(
  prototypeId: MalCp001GapPrototypeId,
  seed: string,
): MalCp001GapGeneratedPrototype {
  const entry = getMalCp001GapRegistryEntry(prototypeId);
  let parameters: MalCp001GapParameters | null = null;
  let solution: MalCp001GapResult | null = null;

  for (let attempt = 0; attempt < 160; attempt += 1) {
    const candidateSeed = attempt === 0 ? seed : `${seed}#${attempt}`;
    const candidateParameters = generateMalCp001GapParameters(
      prototypeId,
      candidateSeed,
    );
    const candidateSolution = solveMalCp001Gap(candidateParameters.request);
    if (!positiveWhole(candidateSolution)) continue;
    parameters = { ...candidateParameters, seed };
    solution = candidateSolution;
    break;
  }

  if (!parameters || !solution) {
    throw new Error(
      `Could not construct an integral learner-facing gap prototype for ${prototypeId}/${seed}.`,
    );
  }

  const independent = verifyMalCp001GapIndependently(parameters.request, solution);
  if (!independent.ok) {
    throw new Error(
      `Independent gap verification failed for ${prototypeId}/${seed}: ${independent.errors.join(" | ")}`,
    );
  }

  const options = buildGapOptions(parameters, solution);
  const explanation = renderGapExplanation(parameters, solution);
  const question: MalCp001GapGeneratedPrototype = {
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-001",
    prototypeId,
    permanentQlId: null,
    language: "en",
    seed,
    difficulty: parameters.difficulty,
    answerSemantic: entry.answerSemantic,
    stem: renderGapStem(parameters),
    parameters,
    solution,
    options: options.options,
    optionAudit: options.optionAudit,
    correctIndex: options.correctIndex,
    explanation,
    reasoningGraph: buildGapReasoningGraph(parameters, solution, explanation),
    mathematicalFingerprint: `${parameters.generationFingerprint}:answer=${resultKey(solution)}`,
    validation: { ok: true, errors: [] },
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
  question.validation = validateGapPrototype(question);
  if (!question.validation.ok) {
    throw new Error(
      `MAL-CP-001 gap prototype validation failed for ${prototypeId}/${seed}: ${question.validation.errors.join(" | ")}`,
    );
  }
  return question;
}

export function generateMalCp001DiscoveryPrototype(
  prototypeId: MalCp001DiscoveryPrototypeId,
  seed: string,
) {
  return isMalCp001GapPrototypeId(prototypeId)
    ? generateMalCp001GapPrototype(prototypeId, seed)
    : generateMalCp001Prototype(prototypeId, seed);
}

export function stableMalCp001DiscoveryPrototype(value: unknown): string {
  return stable(value);
}
