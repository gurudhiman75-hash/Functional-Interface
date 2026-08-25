import { divide, multiply, rational, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP009_FINAL_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-final";
import type { TsdCp009Difficulty } from "./english-authoring-registry";
import { TSD_CP009_ENGLISH_REVIEW_CASES } from "./english-review-cases";

export interface TsdCp009RenderedEnglishQuestion {
  readonly qlId: `TSD-QL-${string}`;
  readonly familyId: string;
  readonly authorityKey: string;
  readonly difficulty: TsdCp009Difficulty;
  readonly stem: string;
  readonly answer: string;
  readonly explanation: string;
}

function raw(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function kmh(value: Rational): string {
  const converted = multiply(value, rational(18, 5));
  return `${raw(converted)} km/h`;
}

function km(value: Rational): string {
  return `${raw(divide(value, rational(1000)))} km`;
}

function hours(value: Rational): string {
  const converted = divide(value, rational(3600));
  return `${raw(converted)} ${converted.numerator === converted.denominator ? "hour" : "hours"}`;
}

function ratio(value: Rational): string {
  return `${value.numerator}:${value.denominator}`;
}

function directionPhrase(familyId: string, direction: "ASSISTED" | "OPPOSED"): string {
  if (familyId === "104-E") return direction === "ASSISTED" ? "with the wind" : "against the wind";
  return direction === "ASSISTED" ? "downstream" : "upstream";
}

function bindingsFor(familyId: string, input: (typeof TSD_CP009_ENGLISH_REVIEW_CASES)[number]["input"]): Readonly<Record<string, string>> {
  const bindings: Record<string, string> = {};
  switch (input.authorityKey) {
    case "mediumAdjustedGroundSpeed":
      Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed), mediumSpeed: kmh(input.mediumSpeed), directionPhrase: directionPhrase(familyId, input.direction) });
      break;
    case "mediumComponentsFromAssistedOpposedSpeeds":
      Object.assign(bindings, { assistedSpeed: kmh(input.assistedGroundSpeed), opposedSpeed: kmh(input.opposedGroundSpeed) });
      break;
    case "mediumLegTravelState":
      Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed), mediumSpeed: kmh(input.mediumSpeed), directionPhrase: directionPhrase(familyId, input.direction) });
      if (input.target === "TIME") bindings.distance = km(input.distance);
      else bindings.time = hours(input.time);
      break;
    case "pairedEqualDistanceMediumState":
      if (input.mode === "COMPONENT_FROM_DISTANCE_AND_TIMES") Object.assign(bindings, { equalDistance: km(input.equalDistance), assistedTime: hours(input.assistedTime), opposedTime: hours(input.opposedTime) });
      else if (input.mode === "DISTANCE_FROM_TIME_DIFFERENCE") Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed), mediumSpeed: kmh(input.mediumSpeed), timeDifference: hours(input.opposedMinusAssistedTime) });
      else if (input.mode === "BODY_SPEED_FROM_TIME_RATIO") Object.assign(bindings, { mediumSpeed: kmh(input.mediumSpeed), timeRatio: ratio(input.opposedToAssistedTimeRatio) });
      else Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed), timeRatio: ratio(input.opposedToAssistedTimeRatio) });
      break;
    case "roundTripMediumState":
      Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed), mediumSpeed: kmh(input.mediumSpeed), distance: km(input.oneWayDistance) });
      break;
    case "mixedUnequalLegMediumState":
      Object.assign(bindings, { mediumSpeed: kmh(input.mediumSpeed), totalTime: hours(input.totalTime) });
      if (input.target === "ASSISTED_DISTANCE") Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed), opposedDistance: km(input.opposedDistance) });
      else if (input.target === "OPPOSED_DISTANCE") Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed), assistedDistance: km(input.assistedDistance) });
      else Object.assign(bindings, { assistedDistance: km(input.assistedDistance), opposedDistance: km(input.opposedDistance) });
      break;
    case "equalTimeMediumDistanceSpread":
      Object.assign(bindings, { mediumSpeed: kmh(input.mediumSpeed), time: hours(input.equalTime) });
      break;
    case "mediumShiftedMeetingPoint":
      Object.assign(bindings, { routeDistance: km(input.routeDistance), upstreamBodySpeed: kmh(input.fromUpstreamBodySpeed), downstreamBodySpeed: kmh(input.fromDownstreamBodySpeed), mediumSpeed: kmh(input.mediumSpeed) });
      break;
    case "passiveFloatingObjectState":
      bindings.mediumSpeed = kmh(input.mediumSpeed);
      if (input.target === "TRAVEL_TIME") bindings.distance = km(input.distance);
      break;
    case "floatingObjectRecoveryState":
      Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed), mediumSpeed: kmh(input.mediumSpeed), separationTime: hours(input.separationTimeBeforeTurn) });
      break;
    case "changingMediumState":
      Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed), distance: km(input.distance), directionPhrase: directionPhrase(familyId, input.direction), firstTime: hours(input.firstTripTime), secondTime: hours(input.secondTripTime) });
      break;
  }
  return Object.freeze(bindings);
}

function render(template: string, bindings: Readonly<Record<string, string>>): string {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = bindings[key];
    if (value === undefined) throw new Error(`${key}: CP009 English review binding missing`);
    return value;
  });
}

function answer(value: Rational, unit: string): string {
  if (unit === "METRE_PER_SECOND") return kmh(value);
  if (unit === "METRE") return km(value);
  return hours(value);
}

const cases = new Map(TSD_CP009_ENGLISH_REVIEW_CASES.map((entry) => [entry.familyId, entry] as const));
const rendered: TsdCp009RenderedEnglishQuestion[] = [];

for (const ql of TSD_CP009_FINAL_ENGLISH_AUTHORING_REGISTRY) {
  for (const family of ql.stemFamilies) {
    const reviewCase = cases.get(family.familyId);
    if (!reviewCase) throw new Error(`${family.familyId}: natural review case missing`);
    if (reviewCase.qlId !== ql.qlId || reviewCase.input.authorityKey !== ql.authorityKey) throw new Error(`${family.familyId}: review case authority/QL mismatch`);
    const bindings = bindingsFor(family.familyId, reviewCase.input);
    const answerText = answer(reviewCase.solution.value, reviewCase.solution.unit);
    rendered.push(Object.freeze({
      qlId: ql.qlId,
      familyId: family.familyId,
      authorityKey: ql.authorityKey,
      difficulty: family.difficulty,
      stem: render(family.stem, bindings),
      answer: answerText,
      explanation: `${render(family.explanationGuide, bindings)} Answer: ${answerText}`,
    }));
  }
}

if (rendered.length !== 66) throw new Error(`Expected 66 CP009 rendered English questions, got ${rendered.length}`);
export const TSD_CP009_RENDERED_ENGLISH_QUESTIONS: readonly TsdCp009RenderedEnglishQuestion[] = Object.freeze(rendered);
