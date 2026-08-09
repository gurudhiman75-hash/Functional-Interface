import type { GeneratedParameters, ProbabilityExperiment, ProbabilityTaskRegistryEntry, ReplacementPolicy, OrderPolicy } from "./types";

function numberValue(parameters: GeneratedParameters, key: string): number { const value = parameters[key]; if (typeof value !== "number") throw new Error(`Expected numeric parameter ${key}`); return value; }
function resolveReplacement(entry: ProbabilityTaskRegistryEntry): Exclude<ReplacementPolicy, "QL_CONTROLLED"> {
  if (entry.replacementPolicy !== "QL_CONTROLLED") return entry.replacementPolicy;
  if (["findWithReplacementProbability", "findSuccessiveIndependentProbability", "findAtLeastOneAcrossIndependentStages"].includes(entry.solveMode)) return "WITH_REPLACEMENT";
  if (["findWithoutReplacementProbability", "findSuccessiveDependentProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws", "findDifferentTypesInSuccessiveDraws"].includes(entry.solveMode)) return "WITHOUT_REPLACEMENT";
  return "NOT_APPLICABLE";
}
function resolveOrder(entry: ProbabilityTaskRegistryEntry): Exclude<OrderPolicy, "QL_CONTROLLED"> {
  if (entry.orderPolicy !== "QL_CONTROLLED") return entry.orderPolicy;
  if (["findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType", "findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability", "findRestrictedSelectionProbability"].includes(entry.solveMode)) return "UNORDERED";
  return "ORDERED";
}

export function buildProbabilityExperiment(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters): ProbabilityExperiment {
  const kind = entry.experimentKinds[0]!;
  const replacementPolicy = resolveReplacement(entry), orderPolicy = resolveOrder(entry);
  const metadata: ProbabilityExperiment["metadata"] = { cpId: entry.cpId, qlId: entry.qlId, solveMode: entry.solveMode };
  if (kind === "COIN_TOSS") {
    const tosses = numberValue(parameters, "tosses" in parameters ? "tosses" : "trials");
    return { kind, equallyLikely: true, replacementPolicy: "NOT_APPLICABLE", orderPolicy: "ORDERED", sampleSpaceLabel: `${tosses} ordered fair-coin tosses`, metadata: { ...metadata, tosses }, stages: Array.from({ length: tosses }, (_, index) => ({ stageId: `toss-${index + 1}`, kind, label: `Toss ${index + 1}`, outcomeField: `toss${index + 1}`, metadata: { outcomes: ["H", "T"] } })) };
  }
  if (kind === "DIE_ROLL") {
    const rolls = entry.solveMode.startsWith("findTwoDice") ? 2 : entry.solveMode === "findIndependentIntersection" ? 2 : 1;
    const sides = typeof parameters.dieSides === "number" ? parameters.dieSides : 6;
    return { kind, equallyLikely: true, replacementPolicy: "NOT_APPLICABLE", orderPolicy: "ORDERED", sampleSpaceLabel: `${rolls} ordered roll${rolls === 1 ? "" : "s"} of a fair ${sides}-sided die`, metadata: { ...metadata, rolls, sides }, stages: Array.from({ length: rolls }, (_, index) => ({ stageId: `roll-${index + 1}`, kind, label: `Roll ${index + 1}`, outcomeField: `die${index + 1}`, metadata: { sides } })) };
  }
  if (kind === "SPINNER") {
    const sectors = numberValue(parameters, "sectors");
    return { kind, equallyLikely: true, replacementPolicy: "NOT_APPLICABLE", orderPolicy: "UNORDERED", sampleSpaceLabel: `${sectors} equal spinner sectors`, metadata: { ...metadata, sectors, favourableSectors: numberValue(parameters, "favourableSectors") }, stages: [{ stageId: "spin-1", kind, label: "One spin", outcomeField: "sector", metadata: { sectors } }] };
  }
  if (kind === "NUMBER_SELECTION") {
    const lower = typeof parameters.lower === "number" ? parameters.lower : 1, upper = typeof parameters.upper === "number" ? parameters.upper : numberValue(parameters, "n");
    return { kind, equallyLikely: true, replacementPolicy: "NOT_APPLICABLE", orderPolicy: "UNORDERED", sampleSpaceLabel: `integers from ${lower} to ${upper}, inclusive`, metadata: { ...metadata, lower, upper }, stages: [{ stageId: "number-selection", kind, label: "Select one integer", outcomeField: "number", metadata: { lower, upper } }] };
  }
  if (kind === "CARD_DRAW") {
    const draws = entry.cpId === "PRB-CP-006" ? 2 : 1;
    return { kind, equallyLikely: true, replacementPolicy, orderPolicy: draws > 1 ? "ORDERED" : "UNORDERED", sampleSpaceLabel: draws === 1 ? "52 cards in a standard deck" : "ordered card draws from a standard deck", metadata: { ...metadata, deckSize: 52, draws }, stages: Array.from({ length: draws }, (_, index) => ({ stageId: `card-draw-${index + 1}`, kind, label: `Card draw ${index + 1}`, outcomeField: `card${index + 1}`, metadata: { standardDeck: true } })) };
  }
  if (kind === "URN_DRAW") {
    const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), draws = typeof parameters.draw === "number" ? parameters.draw : typeof parameters.draws === "number" ? parameters.draws : entry.solveMode === "findConditionalUrnProbability" ? 2 : 1;
    const sequential = entry.cpId === "PRB-CP-006" || entry.cpId === "PRB-CP-007";
    return { kind, equallyLikely: true, replacementPolicy, orderPolicy: sequential ? "ORDERED" : orderPolicy, sampleSpaceLabel: `${red + blue} distinct balls (${red} red, ${blue} blue)`, metadata: { ...metadata, red, blue, draws }, stages: Array.from({ length: draws }, (_, index) => ({ stageId: `urn-draw-${index + 1}`, kind, label: `Ball draw ${index + 1}`, outcomeField: `ball${index + 1}`, metadata: { red, blue } })) };
  }
  if (kind === "RANDOM_SELECTION") {
    const population = typeof parameters.total === "number" ? parameters.total : (typeof parameters.men === "number" && typeof parameters.women === "number" ? parameters.men + parameters.women : 0);
    const selection = typeof parameters.committeeSize === "number" ? parameters.committeeSize : typeof parameters.draw === "number" ? parameters.draw : 1;
    return { kind, equallyLikely: true, replacementPolicy: "WITHOUT_REPLACEMENT", orderPolicy: "UNORDERED", sampleSpaceLabel: `unordered selections of ${selection} from ${population}`, metadata: { ...metadata, population, selection, ...(typeof parameters.women === "number" ? { women: parameters.women } : {}), ...(typeof parameters.men === "number" ? { men: parameters.men } : {}) }, stages: [{ stageId: "selection", kind, label: "Random selection", outcomeField: "selection", metadata: { population, selection } }] };
  }
  if (kind === "RANDOM_ARRANGEMENT") {
    const people = typeof parameters.people === "number" ? parameters.people : typeof parameters.men === "number" && typeof parameters.women === "number" ? parameters.men + parameters.women : typeof parameters.symbolCount === "number" ? parameters.symbolCount : 0;
    return { kind, equallyLikely: true, replacementPolicy: "WITHOUT_REPLACEMENT", orderPolicy: "ORDERED", sampleSpaceLabel: `ordered arrangements or assignments of ${people} distinct items`, metadata: { ...metadata, people, ...(typeof parameters.men === "number" ? { men: parameters.men } : {}), ...(typeof parameters.women === "number" ? { women: parameters.women } : {}), ...(typeof parameters.positions === "number" ? { positions: parameters.positions } : {}), ...(typeof parameters.length === "number" ? { length: parameters.length } : {}), ...(typeof parameters.maxDigit === "number" ? { maxDigit: parameters.maxDigit } : {}) }, stages: [{ stageId: "arrangement", kind, label: "Random arrangement", outcomeField: "arrangement", metadata: { people } }] };
  }
  return { kind: "COMPOUND_EXPERIMENT", equallyLikely: true, replacementPolicy, orderPolicy, sampleSpaceLabel: "the relevant finite experiment described in the question", metadata, stages: [{ stageId: "compound", kind: "COMPOUND_EXPERIMENT", label: "Compound experiment", outcomeField: "outcome", metadata }] };
}
