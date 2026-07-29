import { generateMalCp001GapParameters } from "./cp001-gap-generator";
import {
  solveMalCp001Gap,
  verifyMalCp001GapIndependently,
} from "./cp001-gap-solver";
import { getMalCp001GapRegistryEntry } from "./cp001-gap-registry";
import {
  addRational,
  divideRational,
  formatRational,
  isPositiveRational,
  isWholeRational,
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

function hashIndex(text: string, modulus: number): number {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % modulus;
}

function math(text: string): string {
  return `\\(${text}\\)`;
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

function positiveWhole(result: MalCp001GapResult): boolean {
  return resultRationals(result).every(
    (value) => isPositiveRational(value) && isWholeRational(value),
  );
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

function addCandidate(
  target: MalCp001GapOptionAudit[],
  seen: Set<string>,
  parameters: MalCp001GapParameters,
  result: MalCp001GapResult,
  misconceptionId: MalCp001GapMisconceptionId,
): void {
  if (!positiveWhole(result)) return;
  const key = resultKey(result);
  if (seen.has(key)) return;
  seen.add(key);
  target.push({
    text: resultText(result, parameters),
    result,
    misconceptionId,
  });
}

function buildOptions(
  parameters: MalCp001GapParameters,
  solution: MalCp001GapResult,
): { options: string[]; optionAudit: MalCp001GapOptionAudit[]; correctIndex: number } {
  const candidates: MalCp001GapOptionAudit[] = [];
  const seen = new Set<string>();
  const add = (
    result: MalCp001GapResult,
    misconceptionId: MalCp001GapMisconceptionId,
  ) => addCandidate(candidates, seen, parameters, result, misconceptionId);

  add(solution, "CORRECT");

  switch (parameters.request.mode) {
    case "SOURCE_VALUE_FROM_RATIO":
      add(
        { kind: "SOURCE_VALUE", value: parameters.request.targetValue },
        "TARGET_REPORTED",
      );
      add(
        { kind: "SOURCE_VALUE", value: parameters.request.knownValue },
        "KNOWN_SOURCE_REPORTED",
      );
      add(
        {
          kind: "SOURCE_VALUE",
          value: addRational(
            parameters.request.knownValue,
            addRational(
              parameters.request.lowerRatioPart,
              parameters.request.higherRatioPart,
            ),
          ),
        },
        "RATIO_PART_USED_AS_QUANTITY",
      );
      break;

    case "COMPONENT_SHARE_FROM_TARGET":
      if (solution.kind === "COMPONENT_QUANTITY") {
        add(
          {
            kind: "COMPONENT_QUANTITY",
            quantity: subtractRational(
              parameters.request.totalQuantity,
              solution.quantity,
            ),
          },
          "OTHER_COMPONENT_REPORTED",
        );
      }
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

    case "DIFFERENCE_BASED_QUANTITIES":
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
        const equalShare = divideRational(
          addRational(solution.firstQuantity, solution.secondQuantity),
          rational(2),
        );
        add(
          {
            kind: "COMPONENT_QUANTITY_PAIR",
            firstQuantity: equalShare,
            secondQuantity: equalShare,
          },
          "EQUAL_SPLIT_ASSUMED",
        );
      }
      break;

    case "TWO_STAGE_BLEND_MEAN": {
      const firstMean = buildBlendState(
        parameters.request.stageOneComponents,
      ).meanValue;
      add({ kind: "MEAN_VALUE", value: firstMean }, "STAGE_ONE_MEAN_REPORTED");
      add(
        {
          kind: "MEAN_VALUE",
          value: divideRational(
            addRational(firstMean, parameters.request.finalComponent.value),
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

    case "TWO_STAGE_UNKNOWN_QUANTITY":
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
          quantity: addRational(parameters.request.stageOneQuantityUsed, rational(1)),
        },
        "PLAUSIBLE_SCALE_ERROR",
      );
      add(
        {
          kind: "COMPONENT_QUANTITY",
          quantity: subtractRational(parameters.request.stageOneQuantityUsed, rational(1)),
        },
        "TOTAL_MINUS_ANSWER",
      );
      break;

    case "THREE_WAY_TARGET_WITH_RELATION":
      if (solution.kind === "COMPONENT_QUANTITY") {
        add(
          {
            kind: "COMPONENT_QUANTITY",
            quantity: subtractRational(
              parameters.request.totalQuantity,
              solution.quantity,
            ),
          },
          "TOTAL_MINUS_ANSWER",
        );
      }
      add(
        {
          kind: "COMPONENT_QUANTITY",
          quantity: divideRational(parameters.request.totalQuantity, rational(3)),
        },
        "EQUAL_SPLIT_ASSUMED",
      );
      add(
        {
          kind: "COMPONENT_QUANTITY",
          quantity: divideRational(
            parameters.request.totalQuantity,
            addRational(
              rational(2),
              parameters.request.middleToLowerMultiplier,
            ),
          ),
        },
        "RELATION_COMPONENT_REPORTED",
      );
      break;
  }

  for (let offset = 1; candidates.length < 4 && offset <= 60; offset += 1) {
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
      case "COMPONENT_QUANTITY":
        add(
          {
            kind: "COMPONENT_QUANTITY",
            quantity: addRational(solution.quantity, rational(offset)),
          },
          "PLAUSIBLE_SCALE_ERROR",
        );
        break;
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
    throw new Error(`Could not build four options for ${parameters.prototypeId}/${parameters.seed}.`);
  }

  const correct = candidates.find((item) => item.misconceptionId === "CORRECT");
  if (!correct) throw new Error("Correct option candidate is missing.");
  const distractors = candidates.filter((item) => item !== correct).slice(0, 3);
  const correctIndex = hashIndex(
    `${parameters.prototypeId}:${parameters.seed}:correct`,
    4,
  );
  const optionAudit: MalCp001GapOptionAudit[] = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    optionAudit.push(
      index === correctIndex ? correct : distractors[distractorIndex++],
    );
  }
  return {
    options: optionAudit.map((item) => item.text),
    optionAudit,
    correctIndex,
  };
}

function renderStem(parameters: MalCp001GapParameters): string {
  const { context, request } = parameters;
  const variant = hashIndex(`${parameters.prototypeId}:${parameters.seed}:stem`, 4);

  switch (request.mode) {
    case "SOURCE_VALUE_FROM_RATIO": {
      const knownLabel = request.knownSide === "LOWER"
        ? request.lowerComponentLabel
        : request.higherComponentLabel;
      const unknownLabel = request.knownSide === "LOWER"
        ? request.higherComponentLabel
        : request.lowerComponentLabel;
      const ratio = `${formatRational(request.lowerRatioPart)}:${formatRational(request.higherRatioPart)}`;
      return [
        `${context.actor} blends ${request.lowerComponentLabel} and ${request.higherComponentLabel} in the ratio ${ratio}. The ${knownLabel} costs ${valueText(request.knownValue, parameters)}, and the blend costs ${valueText(request.targetValue, parameters)}. What is the cost of the ${unknownLabel}?`,
        `The quantities of ${request.lowerComponentLabel} and ${request.higherComponentLabel} are in the ratio ${ratio}. If the ${knownLabel} is priced at ${valueText(request.knownValue, parameters)} and the mixture at ${valueText(request.targetValue, parameters)}, what price must the ${unknownLabel} have?`,
        `${context.actor} obtains a mixture worth ${valueText(request.targetValue, parameters)} by using ${request.lowerComponentLabel} and ${request.higherComponentLabel} in the ratio ${ratio}. Given the ${knownLabel} price of ${valueText(request.knownValue, parameters)}, what is the unit price of the ${unknownLabel}?`,
        `A ${context.material} blend contains ${request.lowerComponentLabel} and ${request.higherComponentLabel} in the ratio ${ratio}. Its average price is ${valueText(request.targetValue, parameters)}, while the ${knownLabel} costs ${valueText(request.knownValue, parameters)}. What does the ${unknownLabel} cost?`,
      ][variant];
    }

    case "COMPONENT_SHARE_FROM_TARGET": {
      const requestedLabel = request.requestedSide === "LOWER"
        ? request.lowerComponentLabel
        : request.higherComponentLabel;
      return [
        `${context.actor} makes ${quantityText(request.totalQuantity, parameters)} of a blend using ${request.lowerComponentLabel} at ${valueText(request.lowerValue, parameters)} and ${request.higherComponentLabel} at ${valueText(request.higherValue, parameters)}. The blend is worth ${valueText(request.targetValue, parameters)}. How much ${requestedLabel} is used?`,
        `A ${quantityText(request.totalQuantity, parameters)} mixture is formed from ${request.lowerComponentLabel} costing ${valueText(request.lowerValue, parameters)} and ${request.higherComponentLabel} costing ${valueText(request.higherValue, parameters)}. If its mean price is ${valueText(request.targetValue, parameters)}, what quantity of ${requestedLabel} does it contain?`,
        `The total quantity of a ${context.material} blend is ${quantityText(request.totalQuantity, parameters)}. Its components cost ${valueText(request.lowerValue, parameters)} and ${valueText(request.higherValue, parameters)}, and the final average is ${valueText(request.targetValue, parameters)}. What is the share of ${requestedLabel}?`,
        `${context.actor} combines ${request.lowerComponentLabel} and ${request.higherComponentLabel} to obtain ${quantityText(request.totalQuantity, parameters)} at ${valueText(request.targetValue, parameters)}. Their prices are ${valueText(request.lowerValue, parameters)} and ${valueText(request.higherValue, parameters)}. How much ${requestedLabel} is present?`,
      ][variant];
    }

    case "DIFFERENCE_BASED_QUANTITIES":
      return [
        `${context.actor} mixes ${request.lowerComponentLabel} at ${valueText(request.lowerValue, parameters)} with ${request.higherComponentLabel} at ${valueText(request.higherValue, parameters)} to obtain a blend worth ${valueText(request.targetValue, parameters)}. The quantities differ by ${quantityText(request.quantityDifference, parameters)}. What are the two quantities?`,
        `A mixture of ${request.lowerComponentLabel} and ${request.higherComponentLabel} has an average price of ${valueText(request.targetValue, parameters)}. Their prices are ${valueText(request.lowerValue, parameters)} and ${valueText(request.higherValue, parameters)}, and their quantities differ by ${quantityText(request.quantityDifference, parameters)}. What quantity of each is used?`,
        `${context.actor} uses two grades priced at ${valueText(request.lowerValue, parameters)} and ${valueText(request.higherValue, parameters)}. The resulting blend costs ${valueText(request.targetValue, parameters)}, and one quantity exceeds the other by ${quantityText(request.quantityDifference, parameters)}. What are both quantities?`,
        `The mean price of a two-component ${context.material} blend is ${valueText(request.targetValue, parameters)}. The component prices are ${valueText(request.lowerValue, parameters)} and ${valueText(request.higherValue, parameters)}, while their quantities differ by ${quantityText(request.quantityDifference, parameters)}. What are those quantities?`,
      ][variant];

    case "TWO_STAGE_BLEND_MEAN": {
      const [first, second] = request.stageOneComponents;
      const final = request.finalComponent;
      return [
        `${context.actor} first mixes ${quantityText(first.quantity, parameters)} of ${first.label} at ${valueText(first.value, parameters)} with ${quantityText(second.quantity, parameters)} of ${second.label} at ${valueText(second.value, parameters)}. From this blend, ${quantityText(request.stageOneQuantityUsed, parameters)} is mixed with ${quantityText(final.quantity, parameters)} of ${final.label} at ${valueText(final.value, parameters)}. What is the final average price?`,
        `A first-stage blend contains ${quantityText(first.quantity, parameters)} of ${first.label} costing ${valueText(first.value, parameters)} and ${quantityText(second.quantity, parameters)} of ${second.label} costing ${valueText(second.value, parameters)}. If ${quantityText(request.stageOneQuantityUsed, parameters)} of it is combined with ${quantityText(final.quantity, parameters)} of ${final.label} costing ${valueText(final.value, parameters)}, what is the final mean price?`,
        `${context.actor} prepares a blend from ${first.label} and ${second.label}: ${quantityText(first.quantity, parameters)} at ${valueText(first.value, parameters)} and ${quantityText(second.quantity, parameters)} at ${valueText(second.value, parameters)}. A ${quantityText(request.stageOneQuantityUsed, parameters)} portion is later mixed with ${quantityText(final.quantity, parameters)} of ${final.label} at ${valueText(final.value, parameters)}. What is the resulting average price?`,
        `First, ${quantityText(first.quantity, parameters)} of ${first.label} at ${valueText(first.value, parameters)} is blended with ${quantityText(second.quantity, parameters)} of ${second.label} at ${valueText(second.value, parameters)}. Next, ${quantityText(request.stageOneQuantityUsed, parameters)} of that uniform blend is combined with ${quantityText(final.quantity, parameters)} of ${final.label} at ${valueText(final.value, parameters)}. What does the final blend cost per unit?`,
      ][variant];
    }

    case "TWO_STAGE_UNKNOWN_QUANTITY": {
      const [first, second] = request.stageOneComponents;
      return [
        `${context.actor} first blends ${quantityText(first.quantity, parameters)} of ${first.label} at ${valueText(first.value, parameters)} with ${quantityText(second.quantity, parameters)} of ${second.label} at ${valueText(second.value, parameters)}. Then ${quantityText(request.stageOneQuantityUsed, parameters)} of this blend is mixed with ${request.finalComponentLabel} at ${valueText(request.finalComponentValue, parameters)} so that the final price becomes ${valueText(request.targetValue, parameters)}. How much ${request.finalComponentLabel} is added?`,
        `A uniform first-stage mixture is made from ${quantityText(first.quantity, parameters)} of ${first.label} costing ${valueText(first.value, parameters)} and ${quantityText(second.quantity, parameters)} of ${second.label} costing ${valueText(second.value, parameters)}. What quantity of ${request.finalComponentLabel} at ${valueText(request.finalComponentValue, parameters)} must be added to ${quantityText(request.stageOneQuantityUsed, parameters)} of this mixture to obtain ${valueText(request.targetValue, parameters)}?`,
        `${context.actor} prepares a blend using ${first.label} and ${second.label}: ${quantityText(first.quantity, parameters)} at ${valueText(first.value, parameters)} and ${quantityText(second.quantity, parameters)} at ${valueText(second.value, parameters)}. A ${quantityText(request.stageOneQuantityUsed, parameters)} portion is used in a second blend. How much ${request.finalComponentLabel} priced at ${valueText(request.finalComponentValue, parameters)} is required to reach ${valueText(request.targetValue, parameters)}?`,
        `From a first blend of ${quantityText(first.quantity, parameters)} of ${first.label} at ${valueText(first.value, parameters)} and ${quantityText(second.quantity, parameters)} of ${second.label} at ${valueText(second.value, parameters)}, ${quantityText(request.stageOneQuantityUsed, parameters)} is taken. What quantity of ${request.finalComponentLabel} at ${valueText(request.finalComponentValue, parameters)} will make the second-stage average ${valueText(request.targetValue, parameters)}?`,
      ][variant];
    }

    case "THREE_WAY_TARGET_WITH_RELATION": {
      const multiplier = formatRational(request.middleToLowerMultiplier);
      return [
        `${context.actor} makes ${quantityText(request.totalQuantity, parameters)} of a three-grade blend using ${request.lowerComponentLabel}, ${request.middleComponentLabel}, and ${request.higherComponentLabel} priced at ${valueText(request.lowerValue, parameters)}, ${valueText(request.middleValue, parameters)}, and ${valueText(request.higherValue, parameters)} respectively. The quantity of ${request.middleComponentLabel} is ${multiplier} times that of ${request.lowerComponentLabel}, and the blend costs ${valueText(request.targetValue, parameters)}. How much ${request.higherComponentLabel} is used?`,
        `A ${quantityText(request.totalQuantity, parameters)} mixture contains three components costing ${valueText(request.lowerValue, parameters)}, ${valueText(request.middleValue, parameters)}, and ${valueText(request.higherValue, parameters)}. The middle-priced component has ${multiplier} times the quantity of the lower-priced component. If the mean price is ${valueText(request.targetValue, parameters)}, what is the quantity of the highest-priced component?`,
        `${context.actor} combines ${request.lowerComponentLabel}, ${request.middleComponentLabel}, and ${request.higherComponentLabel} to obtain ${quantityText(request.totalQuantity, parameters)} at ${valueText(request.targetValue, parameters)}. Their prices are ${valueText(request.lowerValue, parameters)}, ${valueText(request.middleValue, parameters)}, and ${valueText(request.higherValue, parameters)}, and the middle quantity is ${multiplier} times the lower quantity. What quantity of ${request.higherComponentLabel} is present?`,
        `The total quantity of a three-component ${context.material} blend is ${quantityText(request.totalQuantity, parameters)}. Its component prices are ${valueText(request.lowerValue, parameters)}, ${valueText(request.middleValue, parameters)}, and ${valueText(request.higherValue, parameters)}. The middle component is used in ${multiplier} times the quantity of the lower component. If the final average is ${valueText(request.targetValue, parameters)}, how much of the higher component is used?`,
      ][variant];
    }
  }
}

function renderExplanation(
  parameters: MalCp001GapParameters,
  solution: MalCp001GapResult,
): MalCp001Explanation {
  const request = parameters.request;
  const answer = resultText(solution, parameters);

  switch (request.mode) {
    case "SOURCE_VALUE_FROM_RATIO": {
      const totalParts = addRational(request.lowerRatioPart, request.higherRatioPart);
      return {
        opening: "Treat the ratio parts as exact component weights and balance their total value against the target mean.",
        formula: "Target mean × total ratio parts = sum of weighted source values.",
        steps: [
          `The total ratio weight is ${math(`${toLatex(request.lowerRatioPart)}+${toLatex(request.higherRatioPart)}=${toLatex(totalParts)}`)}.`,
          `The target weighted value is ${math(`${toLatex(request.targetValue)}\\times${toLatex(totalParts)}`)}.`,
          `Subtract the known contribution and divide by the unknown source's ratio part to obtain ${answer}.`,
        ],
        verification: `Putting the recovered source back into the weighted equation reproduces the target ${math(toLatex(request.targetValue))}.`,
        conclusion: `Therefore, the unknown source costs ${answer}.`,
        commonTrap: "Common Trap: Reversing the ratio parts changes which weighted contribution is removed.",
      };
    }

    case "COMPONENT_SHARE_FROM_TARGET": {
      const lowerPart = subtractRational(request.higherValue, request.targetValue);
      const higherPart = subtractRational(request.targetValue, request.lowerValue);
      return {
        opening: "Use opposite distances from the target to obtain the component-share ratio.",
        formula: "Lower quantity : higher quantity = (higher − target) : (target − lower).",
        steps: [
          `The alligation parts are ${math(`${toLatex(lowerPart)}:${toLatex(higherPart)}`)}.`,
          `These parts divide the total ${math(toLatex(request.totalQuantity))} in the same ratio.`,
          `The requested share is ${answer}.`,
        ],
        verification: `The requested share and the remaining quantity reproduce the weighted mean ${math(toLatex(request.targetValue))}.`,
        conclusion: `Hence, the required component quantity is ${answer}.`,
        commonTrap: "Common Trap: Each component receives the opposite difference, not the same-side difference.",
      };
    }

    case "DIFFERENCE_BASED_QUANTITIES": {
      const lowerPart = subtractRational(request.higherValue, request.targetValue);
      const higherPart = subtractRational(request.targetValue, request.lowerValue);
      return {
        opening: "First obtain the alligation ratio, then use the stated quantity difference to fix its scale.",
        formula: "Scale = actual quantity difference ÷ difference between ratio parts.",
        steps: [
          `Alligation gives the ratio ${math(`${toLatex(lowerPart)}:${toLatex(higherPart)}`)}.`,
          `The stated difference ${math(toLatex(request.quantityDifference))} determines the common scale.`,
          `Scaling both parts gives ${answer}.`,
        ],
        verification: `The recovered quantities differ by ${math(toLatex(request.quantityDifference))} and have weighted mean ${math(toLatex(request.targetValue))}.`,
        conclusion: `Therefore, the two quantities are ${answer}.`,
        commonTrap: "Common Trap: The stated difference is a scale condition, not either component quantity.",
      };
    }

    case "TWO_STAGE_BLEND_MEAN": {
      const firstState = buildBlendState(request.stageOneComponents);
      return {
        opening: "A uniform first-stage blend can be treated as one component having its own mean value.",
        formula: "Derive the first-stage mean, then apply a second weighted mean.",
        steps: [
          `The first-stage mean is ${math(`${toLatex(firstState.weightedTotal)}\\div${toLatex(firstState.totalQuantity)}=${toLatex(firstState.meanValue)}`)}.`,
          `The transferred portion contributes ${math(`${toLatex(request.stageOneQuantityUsed)}\\times${toLatex(firstState.meanValue)}`)}.`,
          `Combining it with the final component gives ${answer}.`,
        ],
        verification: `The final weighted total divided by the final quantity equals ${math(solution.kind === "MEAN_VALUE" ? toLatex(solution.value) : "?")}.`,
        conclusion: `Thus, the final blend costs ${answer}.`,
        commonTrap: "Common Trap: Do not average the two stage values without weighting the second-stage quantities.",
      };
    }

    case "TWO_STAGE_UNKNOWN_QUANTITY": {
      const firstState = buildBlendState(request.stageOneComponents);
      return {
        opening: "Replace the transferred first-stage portion by an equivalent component at the first-stage mean.",
        formula: "Transferred quantity × target deviation = added quantity × opposite target deviation.",
        steps: [
          `The first-stage mean is ${math(`${toLatex(firstState.weightedTotal)}\\div${toLatex(firstState.totalQuantity)}=${toLatex(firstState.meanValue)}`)}.`,
          `Balance both second-stage contributions around the target ${math(toLatex(request.targetValue))}.`,
          `The required added quantity is ${answer}.`,
        ],
        verification: `Using ${answer} makes the final weighted mean exactly ${math(toLatex(request.targetValue))}.`,
        conclusion: `Therefore, ${answer} of the final component is required.`,
        commonTrap: "Common Trap: Only the transferred portion, not the entire first blend, enters the second-stage equation.",
      };
    }

    case "THREE_WAY_TARGET_WITH_RELATION":
      return {
        opening: "Use the quantity relation to reduce the three unknown quantities before applying total and weighted-value balance.",
        formula: "If middle quantity = k × lower quantity, higher quantity = total − (1+k) × lower quantity.",
        steps: [
          `Let the lower quantity be ${math("x")}; the middle quantity is ${math(`${toLatex(request.middleToLowerMultiplier)}x`)}.`,
          `The higher quantity is ${math(`${toLatex(request.totalQuantity)}-(1+${toLatex(request.middleToLowerMultiplier)})x`)}.`,
          `The weighted target equation then gives ${answer}.`,
        ],
        verification: `The three quantities total ${math(toLatex(request.totalQuantity))}, satisfy the multiplier, and reproduce mean ${math(toLatex(request.targetValue))}.`,
        conclusion: `Hence, the higher-priced component quantity is ${answer}.`,
        commonTrap: "Common Trap: The multiplier relates the middle and lower quantities; it does not directly give the higher quantity.",
      };
  }
}

function buildReasoningGraph(
  parameters: MalCp001GapParameters,
  solution: MalCp001GapResult,
  explanation: MalCp001Explanation,
): MalReasoningGraph {
  return {
    nodes: [
      {
        id: "given",
        kind: "GIVEN",
        text: `Use the exact ${parameters.context.material} blend data.`,
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

function validateQuestion(
  question: MalCp001GapGeneratedPrototype,
): VerificationResult {
  const errors: string[] = [];
  if (!question.stem.endsWith("?")) errors.push("Stem must end with a question mark.");
  if (/^[a-z]/u.test(question.stem)) errors.push("Stem begins with a lower-case letter.");
  if (question.options.length !== 4 || new Set(question.options).size !== 4) {
    errors.push("Options must contain four unique entries.");
  }
  if (question.optionAudit.filter((item) => item.misconceptionId === "CORRECT").length !== 1) {
    errors.push("Option audit must contain exactly one CORRECT label.");
  }
  const selected = question.optionAudit[question.correctIndex];
  if (!selected || resultKey(selected.result) !== resultKey(question.solution)) {
    errors.push("Correct option does not match the canonical solution.");
  }
  if (!positiveWhole(question.solution)) errors.push("Solution must be positive and integral.");
  if (question.optionAudit.some((item) => !positiveWhole(item.result))) {
    errors.push("Options must be positive and integral.");
  }
  if (!question.explanation.verification.includes("\\(")) {
    errors.push("Verification must contain exact mathematical notation.");
  }
  if (!question.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION")) {
    errors.push("Reasoning graph lacks verification.");
  }
  if (question.permanentQlId !== null) errors.push("Permanent QL allocation is prohibited.");
  if (question.publiclyPublishable || question.questionStudioDiscoverable) {
    errors.push("Discovery safety boundary was breached.");
  }
  return { ok: errors.length === 0, errors };
}

export function generateMalCp001GapRuntimePrototype(
  prototypeId: MalCp001GapPrototypeId,
  seed: string,
): MalCp001GapGeneratedPrototype {
  const entry = getMalCp001GapRegistryEntry(prototypeId);
  let parameters: MalCp001GapParameters | null = null;
  let solution: MalCp001GapResult | null = null;

  for (let attempt = 0; attempt < 240; attempt += 1) {
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
    throw new Error(`Could not construct an integral gap prototype for ${prototypeId}/${seed}.`);
  }

  const independent = verifyMalCp001GapIndependently(parameters.request, solution);
  if (!independent.ok) {
    throw new Error(
      `Independent verification failed for ${prototypeId}/${seed}: ${independent.errors.join(" | ")}`,
    );
  }

  const optionPackage = buildOptions(parameters, solution);
  const explanation = renderExplanation(parameters, solution);
  const question: MalCp001GapGeneratedPrototype = {
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-001",
    prototypeId,
    permanentQlId: null,
    language: "en",
    seed,
    difficulty: parameters.difficulty,
    answerSemantic: entry.answerSemantic,
    stem: renderStem(parameters),
    parameters,
    solution,
    options: optionPackage.options,
    optionAudit: optionPackage.optionAudit,
    correctIndex: optionPackage.correctIndex,
    explanation,
    reasoningGraph: buildReasoningGraph(parameters, solution, explanation),
    mathematicalFingerprint: `${parameters.generationFingerprint}:answer=${resultKey(solution)}`,
    validation: { ok: true, errors: [] },
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
  question.validation = validateQuestion(question);
  if (!question.validation.ok) {
    throw new Error(
      `Gap runtime validation failed for ${prototypeId}/${seed}: ${question.validation.errors.join(" | ")}`,
    );
  }
  return question;
}
