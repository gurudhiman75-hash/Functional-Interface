import type { AtomicEvent, ElementaryOutcome, EventExpression, ProbabilityExperiment } from "./types";
import { enumerateOutcomeSpace } from "./outcome-space";
function numericProperty(value: number, property: string, args: AtomicEvent["args"]): boolean {
  if (property === "EVEN") return value % 2 === 0;
  if (property === "PRIME") { if (value < 2) return false; for (let divisor = 2; divisor * divisor <= value; divisor += 1) if (value % divisor === 0) return false; return true; }
  if (property === "COMPOSITE") { if (value < 4) return false; for (let divisor = 2; divisor * divisor <= value; divisor += 1) if (value % divisor === 0) return true; return false; }
  if (property === "DIVISIBLE") return value % Number(args.divisor) === 0;
  if (property === "GREATER_THAN") return value > Number(args.threshold);
  if (property === "LESS_THAN") return value < Number(args.threshold);
  return false;
}
function atomicMatches(event: AtomicEvent, outcome: ElementaryOutcome): boolean {
  const fields = outcome.fields, args = event.args;
  if (event.predicate === "ALWAYS") return true; if (event.predicate === "NEVER") return false;
  if (event.predicate === "FIELD_EQUALS") return fields[String(args.field ?? "category")] === args.value;
  if (event.predicate === "FIELD_IN_SET") return (args.values as Array<string | number> | undefined)?.includes(fields[String(args.field)] as string | number) ?? false;
  if (event.predicate === "NUMBER_PROPERTY") return numericProperty(Number(fields[String(args.field ?? "number")]), String(args.property), args);
  if (event.predicate === "COIN_PATTERN") return fields.sequence === args.pattern;
  if (event.predicate === "COIN_HEAD_COUNT") { const allowed = args.allowedCounts as number[] | undefined; return allowed ? allowed.includes(Number(fields.headCount)) : Number(fields.headCount) === Number(args.count); }
  if (event.predicate === "DICE_SUM") return Number(fields.sum) === Number(args.target);
  if (event.predicate === "DICE_PRODUCT") return Number(fields.product) === Number(args.target);
  if (event.predicate === "DICE_PARITY") { const a = Number(fields.die1), b = Number(fields.die2), same = a % 2 === b % 2; return args.parityMode === "SAME_PARITY" ? same : !same; }
  if (event.predicate === "CARD_PROPERTY") { const property = String(args.property); if (property === "RANK") return fields.rank === args.rank; if (property === "SUIT") return fields.suit === args.suit; if (property === "COLOUR") return fields.colour === args.colour; if (property === "FACE") return fields.face === true; return fields.rank === args.rank && fields.suit === args.suit; }
  if (event.predicate === "URN_COLOUR_COUNT") return Number(fields.redCount ?? (fields.ball1 === "red" ? 1 : 0)) === Number(args.count);
  if (event.predicate === "SELECTION_COMPOSITION") { if (args.composition === "SAME_COLOUR") return Number(fields.redCount) === 0 || Number(fields.blueCount) === 0; if (args.composition === "DIFFERENT_COLOURS") return Number(fields.redCount) > 0 && Number(fields.blueCount) > 0; if (args.composition === "AT_LEAST_WOMEN") return Number(fields.womenCount) >= Number(args.requiredWomen); return Number(fields.womenCount) === Number(args.requiredWomen); }
  if (event.predicate === "ARRANGEMENT_PROPERTY") { if (args.property === "FIXED_FIRST") return Number(fields.first) === 0; if (args.property === "TOGETHER") return fields.specifiedAdjacent === true; if (args.property === "APART") return fields.specifiedAdjacent === false; if (args.property === "ELIGIBLE_FIRST") return fields.firstGroup === "woman"; if (args.property === "EVEN_LAST_DIGIT") return Number(fields.last) % 2 === 0; }
  return false;
}
export function eventMatches(event: EventExpression, outcome: ElementaryOutcome): boolean {
  if (event.type === "ATOMIC") return atomicMatches(event, outcome);
  if (event.type === "UNION") return event.events.some((child) => eventMatches(child, outcome));
  if (event.type === "INTERSECTION") return event.events.every((child) => eventMatches(child, outcome));
  if (event.type === "COMPLEMENT") return !eventMatches(event.event, outcome);
  if (event.type === "EXACTLY_K") return Number(outcome.fields.headCount ?? outcome.fields.redCount ?? 0) === event.count;
  if (event.type === "AT_LEAST_K") return Number(outcome.fields.headCount ?? outcome.fields.redCount ?? 0) >= event.count;
  if (event.type === "AT_MOST_K") return Number(outcome.fields.headCount ?? outcome.fields.redCount ?? 0) <= event.count;
  if (event.type === "CONDITIONAL") return eventMatches(event.given, outcome) && eventMatches(event.event, outcome);
  return false;
}
export function enumerateEvent(experiment: ProbabilityExperiment, event: EventExpression): { total: bigint; favourable: bigint; conditionalUniverse?: bigint; } | undefined {
  const outcomes = enumerateOutcomeSpace(experiment); if (!outcomes) return undefined;
  if (event.type === "CONDITIONAL") { const universe = outcomes.filter((outcome) => eventMatches(event.given, outcome)); if (!universe.length) throw new Error("Conditional denominator is zero"); return { total: BigInt(universe.length), conditionalUniverse: BigInt(universe.length), favourable: BigInt(universe.filter((outcome) => eventMatches(event.event, outcome)).length) }; }
  return { total: BigInt(outcomes.length), favourable: BigInt(outcomes.filter((outcome) => eventMatches(event, outcome)).length) };
}
