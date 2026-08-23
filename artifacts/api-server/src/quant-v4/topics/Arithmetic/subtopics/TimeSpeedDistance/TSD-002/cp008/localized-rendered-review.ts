import { multiply, rational, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP008_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { TSD_CP008_ENGLISH_REVIEW_CASES } from "./english-review-cases";
import { TSD_CP008_HINDI_LOCALIZATION } from "./hindi-localization";
import { TSD_CP008_PUNJABI_LOCALIZATION } from "./punjabi-localization";
import type { TsdCp008Locale, TsdCp008LocalizationRegistry } from "./localization-types";

export interface TsdCp008RenderedLocalizedQuestion {
  readonly locale: TsdCp008Locale;
  readonly qlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly familyId: string;
  readonly difficulty: "EASY" | "MEDIUM";
  readonly stem: string;
  readonly explanation: string;
  readonly answer: string;
}

const KMH_FAMILIES = new Set([
  "95-A", "95-B", "95-C", "95-D", "95-F",
  "96-A", "96-C",
  "98-A", "98-C", "98-E",
  "99-A", "99-D", "99-F",
  "100-B", "100-E",
  "102-A", "102-B", "102-C", "102-D",
  "103-A", "103-C", "103-F",
]);

function text(value: Rational): string {
  return value.denominator === 1n ? value.numerator.toString() : `${value.numerator}/${value.denominator}`;
}

function speed(value: Rational, familyId: string, locale: TsdCp008Locale): string {
  if (KMH_FAMILIES.has(familyId)) {
    const kmh = multiply(value, rational(18, 5));
    if (kmh.denominator !== 1n) throw new Error(`${familyId}: localized km/h speed is not integral`);
    return locale === "hi-IN" ? `${text(kmh)} किमी/घंटा` : `${text(kmh)} ਕਿਮੀ/ਘੰਟਾ`;
  }
  return locale === "hi-IN" ? `${text(value)} मी/से` : `${text(value)} ਮੀ/ਸਕਿੰਟ`;
}

function ratio(value: Rational): string {
  return `${value.numerator}:${value.denominator}`;
}

function directionPhrase(direction: "OPPOSITE" | "SAME", locale: TsdCp008Locale, observer = false): string {
  if (locale === "hi-IN") {
    if (observer) return direction === "OPPOSITE" ? "विपरीत दिशा में" : "एक ही दिशा में";
    return direction === "OPPOSITE" ? "विपरीत दिशाओं में" : "एक ही दिशा में, जहाँ पहली ट्रेन तेज है";
  }
  if (observer) return direction === "OPPOSITE" ? "ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ" : "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ";
  return direction === "OPPOSITE" ? "ਉਲਟੀ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ" : "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ, ਜਿੱਥੇ ਪਹਿਲੀ ਰੇਲਗੱਡੀ ਤੇਜ਼ ਹੈ";
}

function answerText(value: Rational, unit: string, locale: TsdCp008Locale): string {
  if (locale === "hi-IN") {
    if (unit === "SECOND") return `${text(value)} सेकंड`;
    if (unit === "METRE") return `${text(value)} मीटर`;
    return `${text(value)} मी/से`;
  }
  if (unit === "SECOND") return `${text(value)} ਸਕਿੰਟ`;
  if (unit === "METRE") return `${text(value)} ਮੀਟਰ`;
  return `${text(value)} ਮੀ/ਸਕਿੰਟ`;
}

function targetQuestion(target: string, locale: TsdCp008Locale, authorityKey: string): string {
  if (authorityKey === "trainObserverStateFromCrossingTimes") {
    if (locale === "hi-IN") return target === "TRAIN_SPEED" ? "ट्रेन की गति निकालें।" : "चलते पर्यवेक्षक की गति निकालें।";
    return target === "TRAIN_SPEED" ? "ਰੇਲਗੱਡੀ ਦੀ ਗਤੀ ਕੱਢੋ।" : "ਚੱਲਦੇ ਦਰਸ਼ਕ ਦੀ ਗਤੀ ਕੱਢੋ।";
  }
  if (locale === "hi-IN") return target === "FIXED_OBJECT_LENGTH" ? "स्थिर वस्तु की लंबाई निकालें।" : "पहली ट्रेन की लंबाई निकालें।";
  return target === "FIXED_OBJECT_LENGTH" ? "ਸਥਿਰ ਵਸਤੂ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।" : "ਪਹਿਲੀ ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।";
}

function objectName(familyId: string, locale: TsdCp008Locale): string {
  const familyLetter = familyId.split("-")[1] ?? "A";
  const bridge = ["B", "D", "F"].includes(familyLetter);
  if (locale === "hi-IN") return bridge ? "रेलवे पुल" : "स्टेशन प्लेटफॉर्म";
  return bridge ? "ਰੇਲਵੇ ਪੁਲ" : "ਸਟੇਸ਼ਨ ਪਲੇਟਫਾਰਮ";
}

function bindingsFor(familyId: string, input: (typeof TSD_CP008_ENGLISH_REVIEW_CASES)[number]["input"], locale: TsdCp008Locale): Readonly<Record<string, string>> {
  const bindings: Record<string, string> = {};
  switch (input.authorityKey) {
    case "oppositeDirectionTrainCrossingTime":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), speedA: speed(input.speedA, familyId, locale), speedB: speed(input.speedB, familyId, locale) });
      break;
    case "sameDirectionTrainCrossingTime":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), fasterSpeed: speed(input.fasterSpeed, familyId, locale), slowerSpeed: speed(input.slowerSpeed, familyId, locale) });
      break;
    case "relativeSpeedFromTrainCrossing":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), crossingTime: text(input.crossingTime) });
      break;
    case "trainLengthFromTrainCrossingEvidence":
      Object.assign(bindings, { knownLength: text(input.knownLength), speedA: speed(input.speedA, familyId, locale), speedB: speed(input.speedB, familyId, locale), crossingTime: text(input.crossingTime), directionPhrase: directionPhrase(input.direction, locale) });
      break;
    case "trainSpeedFromTrainCrossingEvidence":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), otherSpeed: speed(input.otherSpeed, familyId, locale), crossingTime: text(input.crossingTime), directionPhrase: directionPhrase(input.direction, locale) });
      break;
    case "movingObserverTrainCrossingTime":
      Object.assign(bindings, { trainLength: text(input.trainLength), trainSpeed: speed(input.trainSpeed, familyId, locale), observerSpeed: speed(input.observerSpeed, familyId, locale), directionPhrase: directionPhrase(input.direction, locale, true) });
      break;
    case "trainObserverStateFromCrossingTimes":
      Object.assign(bindings, { trainLength: text(input.trainLength), sameTime: text(input.sameDirectionTime), oppositeTime: text(input.oppositeDirectionTime), targetQuestion: targetQuestion(input.target, locale, input.authorityKey) });
      break;
    case "sharedFixedObjectTwoTrainEvidence":
      Object.assign(bindings, { ratio: ratio(input.lengthRatioAtoB), speedA: speed(input.speedA, familyId, locale), speedB: speed(input.speedB, familyId, locale), timeA: text(input.crossingTimeA), timeB: text(input.crossingTimeB), objectName: objectName(familyId, locale), targetQuestion: targetQuestion(input.target, locale, input.authorityKey) });
      break;
    case "fullContainmentOverlapDuration":
      Object.assign(bindings, { lengthA: text(input.lengthA), lengthB: text(input.lengthB), speedA: speed(input.speedA, familyId, locale), speedB: speed(input.speedB, familyId, locale), directionPhrase: directionPhrase(input.direction, locale) });
      break;
  }
  return Object.freeze(bindings);
}

function render(template: string, bindings: Readonly<Record<string, string>>): string {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = bindings[key];
    if (value === undefined) throw new Error(`${key}: CP008 localized review binding missing`);
    return value;
  });
}

function renderLocale(registry: TsdCp008LocalizationRegistry): readonly TsdCp008RenderedLocalizedQuestion[] {
  const cases = new Map(TSD_CP008_ENGLISH_REVIEW_CASES.map((entry) => [entry.familyId, entry] as const));
  const frozenEnglish = new Map(TSD_CP008_FROZEN_ENGLISH_REGISTRY.map((entry) => [entry.qlId, entry] as const));
  const rendered: TsdCp008RenderedLocalizedQuestion[] = [];
  for (const ql of registry.qls) {
    const englishQl = frozenEnglish.get(ql.qlId);
    if (!englishQl || englishQl.authorityKey !== ql.authorityKey) throw new Error(`${registry.locale}/${ql.qlId}: frozen-English authority mismatch`);
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

export const TSD_CP008_RENDERED_HINDI_QUESTIONS = renderLocale(TSD_CP008_HINDI_LOCALIZATION);
export const TSD_CP008_RENDERED_PUNJABI_QUESTIONS = renderLocale(TSD_CP008_PUNJABI_LOCALIZATION);
export const TSD_CP008_RENDERED_LOCALIZED_QUESTIONS = Object.freeze([...TSD_CP008_RENDERED_HINDI_QUESTIONS, ...TSD_CP008_RENDERED_PUNJABI_QUESTIONS]);
