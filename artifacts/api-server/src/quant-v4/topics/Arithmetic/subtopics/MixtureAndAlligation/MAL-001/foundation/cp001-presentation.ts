import {
  addRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
  toLatex,
} from "./rational";
import { buildAlligationCross } from "./state-model";
import type {
  BlendComponent,
  MalAlligationDiagram,
  MalCp001Explanation,
  MalCp001PrototypeParameters,
  MalCp001SolveResult,
  MalCp001PrototypeRegistryEntry,
  Rational,
} from "./types";

function quantityText(value: Rational, unit: string): string {
  return `${formatRational(value)} ${unit}`;
}

function valueText(value: Rational, unit: string): string {
  return unit.startsWith("₹/")
    ? `₹${formatRational(value)} per ${unit.slice(2)}`
    : `${formatRational(value)} ${unit}`;
}

function componentEvidence(component: BlendComponent, unit: string, valueUnit: string): string {
  return `${quantityText(component.quantity, unit)} of ${component.label} at ${valueText(component.value, valueUnit)}`;
}

export function formatMalCp001Answer(
  result: MalCp001SolveResult,
  parameters: MalCp001PrototypeParameters,
): string {
  const { quantityUnit, valueUnit } = parameters.context;
  switch (result.kind) {
    case "MEAN_VALUE":
    case "SOURCE_VALUE":
      return valueText(result.value, valueUnit);
    case "COMPONENT_QUANTITY":
      return quantityText(result.quantity, quantityUnit);
    case "COMPONENT_RATIO":
      return `${formatRational(result.firstPart)}:${formatRational(result.secondPart)}`;
    case "COMPONENT_QUANTITY_PAIR":
      return `${quantityText(result.firstQuantity, quantityUnit)} and ${quantityText(result.secondQuantity, quantityUnit)}`;
  }
}

function stemVariant(parameters: MalCp001PrototypeParameters, count: number): number {
  let hash = 2166136261;
  for (const character of `${parameters.prototypeId}:${parameters.seed}:stem`) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % count;
}

export function renderMalCp001Stem(
  entry: MalCp001PrototypeRegistryEntry,
  parameters: MalCp001PrototypeParameters,
): string {
  const { context, request } = parameters;
  const unit = context.quantityUnit;
  const valueUnit = context.valueUnit;
  const choose = (variants: readonly string[]) => variants[stemVariant(parameters, variants.length)];

  switch (entry.prototypeId) {
    case "MAL-CP001-PROT-RATIO-FROM-TARGET": {
      if (request.mode !== "TWO_COMPONENT_RATIO_FROM_TARGET") throw new Error("Prototype/request mismatch.");
      const low = valueText(request.lowerValue, valueUnit);
      const high = valueText(request.higherValue, valueUnit);
      const target = valueText(request.targetValue, valueUnit);
      return choose([
        `${context.actor} has ${context.lowerLabel} at ${low} and ${context.higherLabel} at ${high}. In what ratio should the two be mixed to obtain ${context.material} worth ${target}?`,
        `To prepare ${context.material} worth ${target}, in what ratio should ${context.actor.toLowerCase()} combine ${context.lowerLabel} costing ${low} with ${context.higherLabel} costing ${high}?`,
        `${context.lowerLabel} is valued at ${low}, while ${context.higherLabel} is valued at ${high}. What mixing ratio will give ${context.actor.toLowerCase()} a blend worth ${target}?`,
        `${context.actor} wants a blend worth ${target} from ${context.lowerLabel} at ${low} and ${context.higherLabel} at ${high}. Find the required ratio of the two grades?`,
      ]);
    }
    case "MAL-CP001-PROT-MEAN-FROM-QUANTITIES": {
      if (request.mode !== "MEAN_FROM_COMPONENTS") throw new Error("Prototype/request mismatch.");
      const evidence = request.components.map((item) => componentEvidence(item, unit, valueUnit));
      return choose([
        `${context.actor} mixes ${evidence.join(" with ")}. What is the average value of the resulting ${context.material}?`,
        `A blend is prepared from ${evidence.join(" and ")}. What value per unit does the final ${context.material} have?`,
        `${context.actor} combines ${evidence.join(" together with ")}. Find the weighted average value of the blend?`,
        `What is the average value of ${context.material} made by mixing ${evidence.join(" and ")}?`,
      ]);
    }
    case "MAL-CP001-PROT-MEAN-FROM-RATIO": {
      if (request.mode !== "MEAN_FROM_COMPONENTS" || request.components.length !== 2) throw new Error("Prototype/request mismatch.");
      const ratio = `${formatRational(request.components[0].quantity)}:${formatRational(request.components[1].quantity)}`;
      const low = valueText(request.components[0].value, valueUnit);
      const high = valueText(request.components[1].value, valueUnit);
      return choose([
        `${context.actor} mixes ${context.lowerLabel} at ${low} with ${context.higherLabel} at ${high} in the ratio ${ratio}. What is the average value of the blend?`,
        `In a ${ratio} blend of ${context.lowerLabel} worth ${low} and ${context.higherLabel} worth ${high}, what is the resulting value per unit?`,
        `${context.lowerLabel} and ${context.higherLabel}, valued at ${low} and ${high}, are combined in the ratio ${ratio}. Find the blend's average value?`,
        `${context.actor} uses ${ratio} as the quantity ratio for two grades priced at ${low} and ${high}. What will the mixed ${context.material} be worth per unit?`,
      ]);
    }
    case "MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE": {
      if (request.mode !== "UNKNOWN_COMPONENT_VALUE") throw new Error("Prototype/request mismatch.");
      const known = componentEvidence(request.knownComponents[0], unit, valueUnit);
      const unknownQuantity = quantityText(request.unknownQuantity, unit);
      const target = valueText(request.targetValue, valueUnit);
      return choose([
        `${context.actor} mixes ${known} with ${unknownQuantity} of ${request.unknownComponentLabel}. The mixture is worth ${target}. What is the value of ${request.unknownComponentLabel}?`,
        `After combining ${known} and ${unknownQuantity} of ${request.unknownComponentLabel}, the blend is valued at ${target}. Find the value of the unknown grade?`,
        `${context.actor} obtains ${context.material} worth ${target} by mixing ${known} with ${unknownQuantity} of an unknown-valued ${request.unknownComponentLabel}. What is its value per unit?`,
        `${known} is blended with ${unknownQuantity} of ${request.unknownComponentLabel}. If the final average is ${target}, how much is ${request.unknownComponentLabel} worth per unit?`,
      ]);
    }
    case "MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY": {
      if (request.mode !== "UNKNOWN_COMPONENT_QUANTITY") throw new Error("Prototype/request mismatch.");
      const known = componentEvidence(request.knownComponents[0], unit, valueUnit);
      const unknownValue = valueText(request.unknownValue, valueUnit);
      const target = valueText(request.targetValue, valueUnit);
      return choose([
        `${context.actor} mixes ${known} with some ${request.unknownComponentLabel} valued at ${unknownValue}. If the blend is worth ${target}, how much ${request.unknownComponentLabel} was used?`,
        `How much ${request.unknownComponentLabel} at ${unknownValue} must be combined with ${known} to produce a blend worth ${target}?`,
        `A quantity of ${request.unknownComponentLabel}, valued at ${unknownValue}, is mixed with ${known}. The final value is ${target}. Find the unknown quantity?`,
        `${context.actor} makes ${context.material} worth ${target} from ${known} and ${request.unknownComponentLabel} at ${unknownValue}. What quantity of the latter was included?`,
      ]);
    }
    case "MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET": {
      if (request.mode !== "ADD_SOURCE_TO_REACH_TARGET") throw new Error("Prototype/request mismatch.");
      const initial = componentEvidence(request.initialComponents[0], unit, valueUnit);
      const added = valueText(request.addedValue, valueUnit);
      const target = valueText(request.targetValue, valueUnit);
      return choose([
        `${context.actor} has ${initial}. How much ${request.addedComponentLabel} at ${added} must be added so that the blend is worth ${target}?`,
        `What quantity of ${request.addedComponentLabel} valued at ${added} should be added to ${initial} to obtain a final value of ${target}?`,
        `${context.actor} wants to change ${initial} into a blend worth ${target} by adding ${request.addedComponentLabel} at ${added}. How much should be added?`,
        `Starting with ${initial}, how many ${unit} of ${request.addedComponentLabel} at ${added} are required for a target value of ${target}?`,
      ]);
    }
    case "MAL-CP001-PROT-THREE-COMPONENT-MEAN": {
      if (request.mode !== "MEAN_FROM_COMPONENTS") throw new Error("Prototype/request mismatch.");
      const evidence = request.components.map((item) => componentEvidence(item, unit, valueUnit));
      return choose([
        `${context.actor} prepares a three-grade blend using ${evidence.join(", ")}. What is the average value of the blend?`,
        `Three grades are combined: ${evidence.join("; ")}. Find the weighted value per unit of the resulting ${context.material}?`,
        `What is the final average value when ${context.actor.toLowerCase()} mixes ${evidence.join(", and ")}?`,
        `${evidence.join(", ")} are used in one blend. What value per unit does the complete mixture have?`,
      ]);
    }
    case "MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY": {
      if (request.mode !== "UNKNOWN_COMPONENT_QUANTITY" || request.knownComponents.length !== 2) throw new Error("Prototype/request mismatch.");
      const known = request.knownComponents.map((item) => componentEvidence(item, unit, valueUnit));
      const unknownValue = valueText(request.unknownValue, valueUnit);
      const target = valueText(request.targetValue, valueUnit);
      return choose([
        `${context.actor} combines ${known.join(" and ")} with some ${request.unknownComponentLabel} valued at ${unknownValue}. The final blend is worth ${target}. How much ${request.unknownComponentLabel} was added?`,
        `A three-grade blend worth ${target} contains ${known.join(" and ")}, plus ${request.unknownComponentLabel} at ${unknownValue}. Find the third grade's quantity?`,
        `How much ${request.unknownComponentLabel} valued at ${unknownValue} must accompany ${known.join(" and ")} so that the average becomes ${target}?`,
        `${known.join(" together with ")} are mixed with an unknown quantity of ${request.unknownComponentLabel} at ${unknownValue}. If the blend is worth ${target}, what is that quantity?`,
      ]);
    }
    case "MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL": {
      if (request.mode !== "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET") throw new Error("Prototype/request mismatch.");
      const total = quantityText(request.totalQuantity, unit);
      const low = valueText(request.lowerValue, valueUnit);
      const high = valueText(request.higherValue, valueUnit);
      const target = valueText(request.targetValue, valueUnit);
      return choose([
        `${context.actor} makes ${total} of ${context.material} by mixing ${request.lowerComponentLabel} at ${low} with ${request.higherComponentLabel} at ${high}. The blend is worth ${target}. Find the quantity of each grade?`,
        `A ${total} blend worth ${target} is prepared from ${request.lowerComponentLabel} at ${low} and ${request.higherComponentLabel} at ${high}. How much of each grade is present?`,
        `${context.actor} combines two grades priced at ${low} and ${high} to obtain ${total} worth ${target}. Determine the two component quantities?`,
        `The total quantity is ${total}, and its average value is ${target}. If the source grades cost ${low} and ${high}, what quantity of each was mixed?`,
      ]);
    }
  }
}

function contributionStep(component: BlendComponent): string {
  return `For ${component.label}, the weighted contribution is \\(${toLatex(component.quantity)}\\times${toLatex(component.value)}=${toLatex(multiplyRational(component.quantity, component.value))}\\).`;
}

export function renderMalCp001Explanation(
  entry: MalCp001PrototypeRegistryEntry,
  parameters: MalCp001PrototypeParameters,
  solution: MalCp001SolveResult,
): MalCp001Explanation {
  const { request, context } = parameters;
  const answer = formatMalCp001Answer(solution, parameters);

  if (request.mode === "MEAN_FROM_COMPONENTS" && solution.kind === "MEAN_VALUE") {
    const steps = request.components.map(contributionStep);
    steps.push(`The total weighted value is \\(${toLatex(solution.state.weightedTotal)}\\) and the total quantity is \\(${toLatex(solution.state.totalQuantity)}\\).`);
    steps.push(`Therefore \\(M=\\frac{${toLatex(solution.state.weightedTotal)}}{${toLatex(solution.state.totalQuantity)}}=${toLatex(solution.value)}\\).`);
    return {
      opening: "A blend's average value is weighted by the quantities used; the source values must not be averaged without their weights.",
      formula: "\\(M=\\frac{\\sum q_i v_i}{\\sum q_i}\\)",
      steps,
      verification: `Multiplying the final mean by the total quantity gives \\(${toLatex(multiplyRational(solution.value, solution.state.totalQuantity))}\\), exactly the sum of all component contributions.`,
      conclusion: `The resulting ${context.material} is worth ${answer}.`,
      commonTrap: "Common trap: taking the simple average of source values even when the quantities are unequal.",
    };
  }

  if (request.mode === "TWO_COMPONENT_RATIO_FROM_TARGET" && solution.kind === "COMPONENT_RATIO") {
    const lowDifference = subtractRational(request.higherValue, request.targetValue);
    const highDifference = subtractRational(request.targetValue, request.lowerValue);
    const reconstructedWeighted = addRational(
      multiplyRational(solution.firstPart, request.lowerValue),
      multiplyRational(solution.secondPart, request.higherValue),
    );
    const reconstructedQuantity = addRational(solution.firstPart, solution.secondPart);
    return {
      opening: "Use opposite differences in the alligation cross, then attach each difference to the source on the other side.",
      formula: "\\(q_L:q_H=(H-M):(M-L)\\)",
      steps: [
        `Difference opposite the lower-value source: \\(H-M=${toLatex(request.higherValue)}-${toLatex(request.targetValue)}=${toLatex(lowDifference)}\\).`,
        `Difference opposite the higher-value source: \\(M-L=${toLatex(request.targetValue)}-${toLatex(request.lowerValue)}=${toLatex(highDifference)}\\).`,
        `After reduction, \\(q_L:q_H=${toLatex(solution.firstPart)}:${toLatex(solution.secondPart)}\\).`,
      ],
      verification: `Direct checking gives \\(\\frac{${toLatex(reconstructedWeighted)}}{${toLatex(reconstructedQuantity)}}=${toLatex(request.targetValue)}\\), so the ratio reproduces the target value.`,
      conclusion: `The required ratio of ${context.lowerLabel} to ${context.higherLabel} is ${answer}.`,
      commonTrap: "Common trap: reversing the two ratio parts after calculating the cross-differences correctly.",
    };
  }

  if (request.mode === "UNKNOWN_COMPONENT_VALUE" && solution.kind === "SOURCE_VALUE") {
    const known = request.knownComponents[0];
    const totalQuantity = addRational(known.quantity, request.unknownQuantity);
    const targetTotal = multiplyRational(totalQuantity, request.targetValue);
    const knownTotal = multiplyRational(known.quantity, known.value);
    return {
      opening: "The target mean fixes the final weighted total. Subtract the known component's contribution to isolate the unknown source value.",
      formula: "\\(q_kv_k+q_xv_x=(q_k+q_x)M\\)",
      steps: [
        `Required final weighted total: \\(${toLatex(totalQuantity)}\\times${toLatex(request.targetValue)}=${toLatex(targetTotal)}\\).`,
        `Known contribution: \\(${toLatex(known.quantity)}\\times${toLatex(known.value)}=${toLatex(knownTotal)}\\).`,
        `Thus \\(v_x=\\frac{${toLatex(targetTotal)}-${toLatex(knownTotal)}}{${toLatex(request.unknownQuantity)}}=${toLatex(solution.value)}\\).`,
      ],
      verification: `Using the recovered value in the weighted equation gives the stated target \\(${toLatex(request.targetValue)}\\).`,
      conclusion: `${request.unknownComponentLabel} is worth ${answer}.`,
      commonTrap: "Common trap: subtracting source values directly instead of balancing weighted totals.",
    };
  }

  if ((request.mode === "UNKNOWN_COMPONENT_QUANTITY" || request.mode === "ADD_SOURCE_TO_REACH_TARGET") && solution.kind === "COMPONENT_QUANTITY") {
    const knownComponents = request.mode === "UNKNOWN_COMPONENT_QUANTITY" ? request.knownComponents : request.initialComponents;
    const unknownValue = request.mode === "UNKNOWN_COMPONENT_QUANTITY" ? request.unknownValue : request.addedValue;
    const target = request.targetValue;
    const knownQuantity = knownComponents.reduce((sum, item) => addRational(sum, item.quantity), rational(0));
    const knownWeighted = knownComponents.reduce((sum, item) => addRational(sum, multiplyRational(item.quantity, item.value)), rational(0));
    const left = subtractRational(multiplyRational(target, knownQuantity), knownWeighted);
    const coefficient = subtractRational(unknownValue, target);
    const unknownLabel = request.mode === "UNKNOWN_COMPONENT_QUANTITY" ? request.unknownComponentLabel : request.addedComponentLabel;
    return {
      opening: "Keep the known weighted contribution intact and solve the target-balance equation for the missing quantity.",
      formula: "\\(W_k+xv_x=(Q_k+x)M\\)",
      steps: [
        `Known quantity \\(Q_k=${toLatex(knownQuantity)}\\) and known weighted total \\(W_k=${toLatex(knownWeighted)}\\).`,
        `Rearranging gives \\(x(v_x-M)=Q_kM-W_k=${toLatex(left)}\\).`,
        `Here \\(v_x-M=${toLatex(unknownValue)}-${toLatex(target)}=${toLatex(coefficient)}\\).`,
        `Therefore \\(x=\\frac{${toLatex(left)}}{${toLatex(coefficient)}}=${toLatex(solution.quantity)}\\).`,
      ],
      verification: `After adding ${formatRational(solution.quantity)} ${context.quantityUnit}, the direct weighted mean is \\(${toLatex(target)}\\).`,
      conclusion: `The required quantity of ${unknownLabel} is ${answer}.`,
      commonTrap: "Common trap: using the known quantity as the answer without checking the weighted balance.",
    };
  }

  if (request.mode === "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET" && solution.kind === "COMPONENT_QUANTITY_PAIR") {
    const cross = buildAlligationCross(request.lowerValue, request.higherValue, request.targetValue);
    const parts = addRational(cross.lowerQuantityPart, cross.higherQuantityPart);
    return {
      opening: "First obtain the source ratio from alligation, then divide the stated total quantity in that ratio.",
      formula: "\\(q_L:q_H=(H-M):(M-L),\\quad q_L+q_H=Q\\)",
      steps: [
        `The alligation ratio is \\(${toLatex(cross.lowerQuantityPart)}:${toLatex(cross.higherQuantityPart)}\\).`,
        `Total ratio parts \\(${toLatex(parts)}\\).`,
        `${request.lowerComponentLabel}: \\(${toLatex(request.totalQuantity)}\\times\\frac{${toLatex(cross.lowerQuantityPart)}}{${toLatex(parts)}}=${toLatex(solution.firstQuantity)}\\).`,
        `${request.higherComponentLabel}: \\(${toLatex(request.totalQuantity)}\\times\\frac{${toLatex(cross.higherQuantityPart)}}{${toLatex(parts)}}=${toLatex(solution.secondQuantity)}\\).`,
      ],
      verification: `The two quantities add to \\(${toLatex(request.totalQuantity)}\\), and their weighted mean is \\(${toLatex(request.targetValue)}\\).`,
      conclusion: `The quantities are ${answer}, respectively.`,
      commonTrap: "Common trap: finding the ratio correctly but not converting ratio parts into the stated total quantity.",
    };
  }

  throw new Error(`No presentation strategy for ${entry.prototypeId} and ${request.mode}.`);
}

export function renderMalCp001Diagram(
  entry: MalCp001PrototypeRegistryEntry,
  parameters: MalCp001PrototypeParameters,
): MalAlligationDiagram | undefined {
  if (entry.diagramStrategy !== "ALLIGATION_CROSS") return undefined;
  const request = parameters.request;
  let lowerValue: Rational;
  let higherValue: Rational;
  let targetValue: Rational;
  let lowerLabel: string;
  let higherLabel: string;

  if (request.mode === "TWO_COMPONENT_RATIO_FROM_TARGET") {
    ({ lowerValue, higherValue, targetValue } = request);
    lowerLabel = parameters.context.lowerLabel;
    higherLabel = parameters.context.higherLabel;
  } else if (request.mode === "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET") {
    ({ lowerValue, higherValue, targetValue, lowerComponentLabel: lowerLabel, higherComponentLabel: higherLabel } = request);
  } else {
    return undefined;
  }

  const cross = buildAlligationCross(lowerValue, higherValue, targetValue);
  return {
    type: "ALLIGATION_CROSS",
    lowerLabel,
    lowerValue: formatRational(lowerValue),
    targetValue: formatRational(targetValue),
    higherLabel,
    higherValue: formatRational(higherValue),
    lowerDifference: formatRational(subtractRational(higherValue, targetValue)),
    higherDifference: formatRational(subtractRational(targetValue, lowerValue)),
    ratioText: `${formatRational(cross.lowerQuantityPart)}:${formatRational(cross.higherQuantityPart)}`,
  };
}
