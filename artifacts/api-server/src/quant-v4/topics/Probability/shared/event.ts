import type { AtomicEvent, EventExpression, GeneratedParameters, ProbabilityTaskRegistryEntry } from "./types";
function atomic(entry: ProbabilityTaskRegistryEntry, label: string, predicate: AtomicEvent["predicate"], args: AtomicEvent["args"] = {}): AtomicEvent {
  return { type: "ATOMIC", eventId: `${entry.qlId}-EVENT`, label, predicate, args };
}
export function buildProbabilityEvent(entry: ProbabilityTaskRegistryEntry, p: GeneratedParameters): EventExpression {
  const mode = entry.solveMode;
  if (["findDirectProbability", "findFavourableOutcomeCount", "findTotalOutcomeCount", "findMissingEventCountFromProbability", "findProbabilityFromSimpleFrequencyTable"].includes(mode)) {
    return atomic(entry, String(p.context ?? p.target ?? "the stated event"), mode === "findProbabilityFromSimpleFrequencyTable" ? "FIELD_EQUALS" : "ABSTRACT_COUNT", { field: "category", value: String(p.target ?? "event"), favourable: Number(p.favourable ?? 0) });
  }
  if (mode === "identifyImpossibleCertainOrPossibleEvent") return atomic(entry, String(p.eventLabel), p.state === "CERTAIN" ? "ALWAYS" : p.state === "IMPOSSIBLE" ? "NEVER" : "NUMBER_PROPERTY", { property: "EVEN" });
  if (mode === "findComplementProbability") return { type: "COMPLEMENT", eventId: `${entry.qlId}-COMPLEMENT`, label: `not (${String(p.eventLabel)})`, universeLabel: "all possible outcomes", event: atomic(entry, String(p.eventLabel), "ABSTRACT_COUNT") };
  const head = atomic(entry, "a head occurs", "FIELD_EQUALS", { value: "H" });
  if (mode === "findAtLeastOneUsingComplement") return { type: "AT_LEAST_K", eventId: `${entry.qlId}-AT-LEAST`, label: "at least one head", count: 1, atomicEvent: head };
  if (mode === "findNoneProbability") return { type: "COMPLEMENT", eventId: `${entry.qlId}-NONE`, label: "no heads", universeLabel: "all coin sequences", event: { type: "AT_LEAST_K", eventId: `${entry.qlId}-ONE-OR-MORE`, label: "at least one head", count: 1, atomicEvent: head } };
  if (mode === "findExactlyOneSuccess") return { type: "EXACTLY_K", eventId: `${entry.qlId}-EXACTLY-ONE`, label: "exactly one head", count: 1, atomicEvent: head };
  if (mode === "findExactlyKSuccessSmallCase") return { type: "EXACTLY_K", eventId: `${entry.qlId}-EXACTLY-K`, label: `exactly ${Number(p.k)} heads`, count: Number(p.k), atomicEvent: head };
  if (mode === "findAtMostKSuccessSmallCase") return { type: "AT_MOST_K", eventId: `${entry.qlId}-AT-MOST-K`, label: `at most ${Number(p.k)} heads`, count: Number(p.k), atomicEvent: head };
  if (mode === "findAllSuccessOrNotAll") return atomic(entry, "all tosses show the same face", "COIN_HEAD_COUNT", { allowedCounts: [0, Number(p.trials)] });

  if (mode === "findCoinPatternProbability") return atomic(entry, `the pattern ${String(p.pattern)}`, "COIN_PATTERN", { pattern: String(p.pattern) });
  if (mode === "findCoinHeadCountProbability") return atomic(entry, `exactly ${Number(p.heads)} heads`, "COIN_HEAD_COUNT", { count: Number(p.heads) });
  if (mode === "findSingleDieEventProbability") return atomic(entry, `the die result satisfies ${String(p.property).toLowerCase()}`, "NUMBER_PROPERTY", { field: "die1", property: String(p.property), threshold: Number(p.threshold) });
  if (mode === "findTwoDiceSumProbability") return atomic(entry, `the sum is ${Number(p.targetSum)}`, "DICE_SUM", { target: Number(p.targetSum) });
  if (mode === "findTwoDiceProductOrParityProbability") return atomic(entry, p.eventType === "PRODUCT" ? `the product is ${Number(p.targetProduct)}` : p.eventType === "SAME_PARITY" ? "both dice have the same parity" : "the dice have different parity", p.eventType === "PRODUCT" ? "DICE_PRODUCT" : "DICE_PARITY", { target: Number(p.targetProduct), parityMode: String(p.eventType) });
  if (mode === "findSpinnerEventProbability" || mode === "findReverseDiceOrSpinnerEventCount") return atomic(entry, "the pointer lands on a marked sector", "FIELD_IN_SET", { field: "sector", values: Array.from({ length: Number(p.favourableSectors) }, (_, i) => i + 1) });
  if (mode === "findNumberRangePropertyProbability") return atomic(entry, `the selected integer satisfies ${String(p.property).toLowerCase()}`, "NUMBER_PROPERTY", { field: "number", property: String(p.property), divisor: Number(p.divisor) });

  if (["findRankProbability", "findSuitProbability", "findColourProbability", "findFaceCardProbability", "findCardPropertyIntersection", "findMissingDeckCountOrEventCount"].includes(mode)) {
    const property = mode === "findRankProbability" || mode === "findMissingDeckCountOrEventCount" ? "RANK" : mode === "findSuitProbability" ? "SUIT" : mode === "findColourProbability" ? "COLOUR" : mode === "findFaceCardProbability" ? "FACE" : "RANK_AND_SUIT";
    return atomic(entry, "the required card property", "CARD_PROPERTY", { property, rank: String(p.rank), suit: String(p.suit), colour: String(p.colour) });
  }
  if (mode === "findUnionCardEventProbability") {
    return { type: "UNION", eventId: `${entry.qlId}-UNION`, label: `${String(p.rank)} or ${String(p.suit)}`, events: [atomic(entry, String(p.rank), "CARD_PROPERTY", { property: "RANK", rank: String(p.rank) }), atomic(entry, String(p.suit), "CARD_PROPERTY", { property: "SUIT", suit: String(p.suit) })] };
  }
  if (mode === "findComplementCardProbability") return { type: "COMPLEMENT", eventId: `${entry.qlId}-CARD-COMPLEMENT`, label: `not ${String(p.suit)}`, universeLabel: "standard 52-card deck", event: atomic(entry, String(p.suit), "CARD_PROPERTY", { property: "SUIT", suit: String(p.suit) }) };

  if (["findSingleDrawColourProbability", "findMissingObjectCountFromProbability"].includes(mode)) return atomic(entry, "a red ball is selected", "URN_COLOUR_COUNT", { colour: "red", count: 1 });
  if (mode === "findSimultaneousSameTypeProbability") return atomic(entry, "all selected balls have the same colour", "SELECTION_COMPOSITION", { composition: "SAME_COLOUR", draw: Number(p.draw) });
  if (mode === "findSimultaneousDifferentTypeProbability") return atomic(entry, "the selected balls have different colours", "SELECTION_COMPOSITION", { composition: "DIFFERENT_COLOURS", draw: Number(p.draw) });
  if (mode === "findExactCompositionProbability" || (mode === "findSelectionProbabilityUsingCombination" && entry.cpId === "PRB-CP-005")) return atomic(entry, `exactly ${Number(p.exactRed)} red balls are selected`, "URN_COLOUR_COUNT", { colour: "red", count: Number(p.exactRed), draw: Number(p.draw) });
  if (mode === "findNoObjectOfTypeProbability") return atomic(entry, "no red ball is selected", "URN_COLOUR_COUNT", { colour: "red", count: 0, draw: Number(p.draw) });
  if (mode === "findAtLeastOneObjectOfType") return { type: "AT_LEAST_K", eventId: `${entry.qlId}-AT-LEAST-RED`, label: "at least one red ball", count: 1, atomicEvent: atomic(entry, "a red ball", "URN_COLOUR_COUNT", { colour: "red" }) };

  const redFirst = atomic(entry, "first draw is red", "FIELD_EQUALS", { field: "ball1", value: "red" });
  const redSecond = atomic(entry, "second draw is red", "FIELD_EQUALS", { field: "ball2", value: "red" });
  const blueFirst = atomic(entry, "first draw is blue", "FIELD_EQUALS", { field: "ball1", value: "blue" });
  const blueSecond = atomic(entry, "second draw is blue", "FIELD_EQUALS", { field: "ball2", value: "blue" });
  if (["findSuccessiveIndependentProbability", "findSuccessiveDependentProbability", "findWithReplacementProbability", "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability"].includes(mode)) return { type: "INTERSECTION", eventId: `${entry.qlId}-SUCCESSIVE`, label: mode === "findOrderedDrawSequenceProbability" ? "red followed by blue" : "red on both draws", events: [redFirst, mode === "findOrderedDrawSequenceProbability" ? blueSecond : redSecond] };
  if (mode === "findSameTypeInSuccessiveDraws") return { type: "UNION", eventId: `${entry.qlId}-SAME`, label: "both red or both blue", events: [
    { type: "INTERSECTION", eventId: `${entry.qlId}-RR`, label: "both red", events: [redFirst, redSecond] },
    { type: "INTERSECTION", eventId: `${entry.qlId}-BB`, label: "both blue", events: [blueFirst, blueSecond] },
  ] };
  if (mode === "findDifferentTypesInSuccessiveDraws") return { type: "UNION", eventId: `${entry.qlId}-DIFFERENT`, label: "red-blue or blue-red", events: [
    { type: "INTERSECTION", eventId: `${entry.qlId}-RB`, label: "red then blue", events: [redFirst, blueSecond] },
    { type: "INTERSECTION", eventId: `${entry.qlId}-BR`, label: "blue then red", events: [blueFirst, redSecond] },
  ] };
  if (mode === "findAtLeastOneAcrossIndependentStages") return { type: "COMPLEMENT", eventId: `${entry.qlId}-AT-LEAST-ONE`, label: "at least one red", universeLabel: "two independent draws", event: { type: "INTERSECTION", eventId: `${entry.qlId}-BB`, label: "both blue", events: [blueFirst, blueSecond] } };

  if (["findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable"].includes(mode)) return { type: "CONDITIONAL", eventId: `${entry.qlId}-CONDITIONAL`, label: `${String(p.targetLabel)} given ${String(p.conditionLabel)}`, event: atomic(entry, String(p.targetLabel), "ABSTRACT_COUNT"), given: atomic(entry, String(p.conditionLabel), "ABSTRACT_COUNT") };
  if (mode === "findConditionalCardProbability") return { type: "CONDITIONAL", eventId: `${entry.qlId}-CARD-CONDITIONAL`, label: "king given face card", event: atomic(entry, "king", "CARD_PROPERTY", { property: "RANK", rank: "king" }), given: atomic(entry, "face card", "CARD_PROPERTY", { property: "FACE" }) };
  if (mode === "findConditionalNumberProbability") return { type: "CONDITIONAL", eventId: `${entry.qlId}-NUMBER-CONDITIONAL`, label: "divisible by 4 given even", event: atomic(entry, "divisible by 4", "NUMBER_PROPERTY", { property: "DIVISIBLE", divisor: Number(p.targetDivisor) }), given: atomic(entry, "even", "NUMBER_PROPERTY", { property: "DIVISIBLE", divisor: Number(p.conditionDivisor) }) };
  if (mode === "findConditionalUrnProbability") return { type: "CONDITIONAL", eventId: `${entry.qlId}-URN-CONDITIONAL`, label: "next ball red given first ball red", event: redSecond, given: redFirst };
  if (mode === "findReverseConditionalCount") return { type: "CONDITIONAL", eventId: `${entry.qlId}-REVERSE-CONDITIONAL`, label: `${String(p.targetLabel)} within ${String(p.conditionLabel)}`, event: atomic(entry, String(p.targetLabel), "ABSTRACT_COUNT"), given: atomic(entry, String(p.conditionLabel), "ABSTRACT_COUNT") };

  if (["findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findReverseCountFromProbability"].includes(mode)) return atomic(entry, mode === "findCommitteeCompositionProbability" ? `exactly ${Number(p.requiredWomen)} women` : mode === "findRestrictedSelectionProbability" ? "at least one woman" : "the required committee composition", "SELECTION_COMPOSITION", { composition: mode === "findRestrictedSelectionProbability" ? "AT_LEAST_WOMEN" : "EXACT_WOMEN", requiredWomen: Number(p.requiredWomen ?? 1), committeeSize: Number(p.committeeSize) });
  if (mode === "findRandomArrangementPropertyProbability") return atomic(entry, "a specified person occupies the first position", "ARRANGEMENT_PROPERTY", { property: "FIXED_FIRST" });
  if (mode === "findTogetherOrApartProbability") return atomic(entry, p.relation === "APART" ? "two specified people are not adjacent" : "two specified people are adjacent", "ARRANGEMENT_PROPERTY", { property: String(p.relation) });
  if (mode === "findPositionRestrictionProbability") return atomic(entry, "the first office is assigned to a woman", "ARRANGEMENT_PROPERTY", { property: "ELIGIBLE_FIRST" });
  if (mode === "findNumberFormationProbability") return atomic(entry, "the formed number ends in an even digit", "ARRANGEMENT_PROPERTY", { property: "EVEN_LAST_DIGIT" });

  const eventA = atomic(entry, "event A", "ABSTRACT_COUNT"), eventB = atomic(entry, "event B", "ABSTRACT_COUNT");
  if (mode === "findUnionProbability" || mode === "findMutuallyExclusiveUnion" || mode === "findMissingIntersectionOrUnionProbability") return { type: "UNION", eventId: `${entry.qlId}-UNION`, label: "A or B", events: [eventA, eventB] };
  if (mode === "findIntersectionProbability" || mode === "findIndependentIntersection") return { type: "INTERSECTION", eventId: `${entry.qlId}-INTERSECTION`, label: "A and B", events: [eventA, eventB] };
  if (mode === "findExactlyOneOfTwoEvents" || mode === "findMixedEventExpressionProbability") return atomic(entry, "exactly one of A and B", "ABSTRACT_COUNT");
  if (mode === "findNeitherEventProbability") return { type: "COMPLEMENT", eventId: `${entry.qlId}-NEITHER`, label: "neither A nor B", universeLabel: "all outcomes", event: { type: "UNION", eventId: `${entry.qlId}-UNION-INNER`, label: "A or B", events: [eventA, eventB] } };
  throw new Error(`No event strategy for ${entry.qlId} / ${mode}`);
}
