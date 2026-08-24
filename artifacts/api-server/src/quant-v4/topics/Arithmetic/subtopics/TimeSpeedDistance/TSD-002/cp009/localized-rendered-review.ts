import { divide, multiply, rational, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP009_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import {
  TSD_CP009_NATIVE_FINAL_HINDI_LOCALIZATION,
  TSD_CP009_NATIVE_FINAL_PUNJABI_LOCALIZATION,
} from "./localization-native-final";
import { TSD_CP009_LOCALIZED_REVIEW_CASES } from "./localized-review-cases";
import type { TsdCp009Locale, TsdCp009LocalizationRegistry } from "./localization-types";

export interface TsdCp009RenderedLocalizedQuestion {
  readonly locale: TsdCp009Locale;
  readonly qlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly familyId: string;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly stem: string;
  readonly explanation: string;
  readonly answer: string;
}

function raw(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function kmh(value: Rational, locale: TsdCp009Locale): string {
  const converted = multiply(value, rational(18, 5));
  return locale === "hi-IN" ? `${raw(converted)} किमी/घंटा` : `${raw(converted)} ਕਿਮੀ/ਘੰਟਾ`;
}

function km(value: Rational, locale: TsdCp009Locale): string {
  const converted = divide(value, rational(1000));
  return locale === "hi-IN" ? `${raw(converted)} किमी` : `${raw(converted)} ਕਿਮੀ`;
}

function timeText(value: Rational, locale: TsdCp009Locale): string {
  if (value.denominator === 1n && value.numerator % 60n === 0n) {
    const totalMinutes = value.numerator / 60n;
    const wholeHours = totalMinutes / 60n;
    const minutes = totalMinutes % 60n;
    if (minutes === 0n) {
      if (locale === "hi-IN") return `${wholeHours} ${wholeHours === 1n ? "घंटा" : "घंटे"}`;
      return `${wholeHours} ${wholeHours === 1n ? "ਘੰਟਾ" : "ਘੰਟੇ"}`;
    }
    if (wholeHours === 0n) {
      if (locale === "hi-IN") return `${minutes} मिनट`;
      return `${minutes} ਮਿੰਟ`;
    }
    if (locale === "hi-IN") return `${wholeHours} ${wholeHours === 1n ? "घंटा" : "घंटे"} ${minutes} मिनट`;
    return `${wholeHours} ${wholeHours === 1n ? "ਘੰਟਾ" : "ਘੰਟੇ"} ${minutes} ਮਿੰਟ`;
  }
  const converted = divide(value, rational(3600));
  if (locale === "hi-IN") return `${raw(converted)} घंटे`;
  return `${raw(converted)} ਘੰਟੇ`;
}

function ratio(value: Rational): string {
  return `${value.numerator}:${value.denominator}`;
}

function directionPhrase(familyId: string, direction: "ASSISTED" | "OPPOSED", locale: TsdCp009Locale): string {
  if (familyId === "104-E") {
    if (locale === "hi-IN") return direction === "ASSISTED" ? "हवा के साथ" : "हवा के विरुद्ध";
    return direction === "ASSISTED" ? "ਹਵਾ ਨਾਲ" : "ਹਵਾ ਦੇ ਵਿਰੁੱਧ";
  }
  if (locale === "hi-IN") return direction === "ASSISTED" ? "अनुप्रवाह" : "ऊर्ध्वप्रवाह";
  return direction === "ASSISTED" ? "ਧਾਰਾ ਨਾਲ" : "ਧਾਰਾ ਦੇ ਵਿਰੁੱਧ";
}

function bindingsFor(familyId: string, input: (typeof TSD_CP009_LOCALIZED_REVIEW_CASES)[number]["input"], locale: TsdCp009Locale): Readonly<Record<string, string>> {
  const bindings: Record<string, string> = {};
  switch (input.authorityKey) {
    case "mediumAdjustedGroundSpeed":
      Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed, locale), mediumSpeed: kmh(input.mediumSpeed, locale), directionPhrase: directionPhrase(familyId, input.direction, locale) });
      break;
    case "mediumComponentsFromAssistedOpposedSpeeds":
      Object.assign(bindings, { assistedSpeed: kmh(input.assistedGroundSpeed, locale), opposedSpeed: kmh(input.opposedGroundSpeed, locale) });
      break;
    case "mediumLegTravelState":
      Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed, locale), mediumSpeed: kmh(input.mediumSpeed, locale), directionPhrase: directionPhrase(familyId, input.direction, locale) });
      if (input.target === "TIME") bindings.distance = km(input.distance, locale);
      else bindings.time = timeText(input.time, locale);
      break;
    case "pairedEqualDistanceMediumState":
      if (input.mode === "COMPONENT_FROM_DISTANCE_AND_TIMES") Object.assign(bindings, { equalDistance: km(input.equalDistance, locale), assistedTime: timeText(input.assistedTime, locale), opposedTime: timeText(input.opposedTime, locale) });
      else if (input.mode === "DISTANCE_FROM_TIME_DIFFERENCE") Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed, locale), mediumSpeed: kmh(input.mediumSpeed, locale), timeDifference: timeText(input.opposedMinusAssistedTime, locale) });
      else if (input.mode === "BODY_SPEED_FROM_TIME_RATIO") Object.assign(bindings, { mediumSpeed: kmh(input.mediumSpeed, locale), timeRatio: ratio(input.opposedToAssistedTimeRatio) });
      else Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed, locale), timeRatio: ratio(input.opposedToAssistedTimeRatio) });
      break;
    case "roundTripMediumState":
      Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed, locale), mediumSpeed: kmh(input.mediumSpeed, locale), distance: km(input.oneWayDistance, locale) });
      break;
    case "mixedUnequalLegMediumState":
      Object.assign(bindings, { mediumSpeed: kmh(input.mediumSpeed, locale), totalTime: timeText(input.totalTime, locale) });
      if (input.target === "ASSISTED_DISTANCE") Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed, locale), opposedDistance: km(input.opposedDistance, locale) });
      else if (input.target === "OPPOSED_DISTANCE") Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed, locale), assistedDistance: km(input.assistedDistance, locale) });
      else Object.assign(bindings, { assistedDistance: km(input.assistedDistance, locale), opposedDistance: km(input.opposedDistance, locale) });
      break;
    case "equalTimeMediumDistanceSpread":
      Object.assign(bindings, { mediumSpeed: kmh(input.mediumSpeed, locale), time: timeText(input.equalTime, locale) });
      break;
    case "mediumShiftedMeetingPoint":
      Object.assign(bindings, { routeDistance: km(input.routeDistance, locale), upstreamBodySpeed: kmh(input.fromUpstreamBodySpeed, locale), downstreamBodySpeed: kmh(input.fromDownstreamBodySpeed, locale), mediumSpeed: kmh(input.mediumSpeed, locale) });
      break;
    case "passiveFloatingObjectState":
      bindings.mediumSpeed = kmh(input.mediumSpeed, locale);
      if (input.target === "TRAVEL_TIME") bindings.distance = km(input.distance, locale);
      break;
    case "floatingObjectRecoveryState":
      Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed, locale), mediumSpeed: kmh(input.mediumSpeed, locale), separationTime: timeText(input.separationTimeBeforeTurn, locale) });
      break;
    case "changingMediumState":
      Object.assign(bindings, { bodySpeed: kmh(input.bodyRelativeSpeed, locale), distance: km(input.distance, locale), directionPhrase: directionPhrase(familyId, input.direction, locale), firstTime: timeText(input.firstTripTime, locale), secondTime: timeText(input.secondTripTime, locale) });
      break;
  }
  return Object.freeze(bindings);
}

function render(template: string, bindings: Readonly<Record<string, string>>): string {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = bindings[key];
    if (value === undefined) throw new Error(`${key}: CP009 localized review binding missing`);
    return value;
  });
}

function answerText(value: Rational, unit: string, locale: TsdCp009Locale): string {
  if (unit === "METRE_PER_SECOND") return kmh(value, locale);
  if (unit === "METRE") return km(value, locale);
  return timeText(value, locale);
}

function renderLocale(registry: TsdCp009LocalizationRegistry): readonly TsdCp009RenderedLocalizedQuestion[] {
  const cases = new Map(TSD_CP009_LOCALIZED_REVIEW_CASES.map((entry) => [entry.familyId, entry] as const));
  const frozenEnglish = new Map(TSD_CP009_FROZEN_ENGLISH_REGISTRY.map((entry) => [entry.qlId, entry] as const));
  const rendered: TsdCp009RenderedLocalizedQuestion[] = [];
  for (const ql of registry.qls) {
    const englishQl = frozenEnglish.get(ql.qlId);
    if (!englishQl || englishQl.authorityKey !== ql.authorityKey) throw new Error(`${registry.locale}/${ql.qlId}: frozen English authority mismatch`);
    for (const family of ql.families) {
      const reviewCase = cases.get(family.familyId);
      if (!reviewCase || reviewCase.qlId !== ql.qlId || reviewCase.input.authorityKey !== ql.authorityKey) throw new Error(`${registry.locale}/${family.familyId}: review case mismatch`);
      const bindings = bindingsFor(family.familyId, reviewCase.input, registry.locale);
      const answer = answerText(reviewCase.solution.value, reviewCase.solution.unit, registry.locale);
      rendered.push(Object.freeze({
        locale: registry.locale,
        qlId: ql.qlId,
        authorityKey: ql.authorityKey,
        familyId: family.familyId,
        difficulty: family.difficulty,
        stem: render(family.stem, bindings),
        explanation: `${render(family.explanationGuide, bindings)} ${registry.locale === "hi-IN" ? "अतः उत्तर" : "ਇਸ ਲਈ ਉੱਤਰ"} ${answer} ${registry.locale === "hi-IN" ? "है।" : "ਹੈ।"}`,
        answer,
      }));
    }
  }
  return Object.freeze(rendered);
}

export const TSD_CP009_RENDERED_HINDI_QUESTIONS = renderLocale(TSD_CP009_NATIVE_FINAL_HINDI_LOCALIZATION);
export const TSD_CP009_RENDERED_PUNJABI_QUESTIONS = renderLocale(TSD_CP009_NATIVE_FINAL_PUNJABI_LOCALIZATION);
export const TSD_CP009_RENDERED_LOCALIZED_QUESTIONS = Object.freeze([...TSD_CP009_RENDERED_HINDI_QUESTIONS, ...TSD_CP009_RENDERED_PUNJABI_QUESTIONS]);
