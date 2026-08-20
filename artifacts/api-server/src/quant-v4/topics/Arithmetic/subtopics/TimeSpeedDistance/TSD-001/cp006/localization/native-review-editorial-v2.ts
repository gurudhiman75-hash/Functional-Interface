import type { Rational } from "../../foundation/rational";
import { generateCp006NativeReviewV1, type TsdCp006NativeReviewRowV1 } from "./native-review-candidate-v1";
import { cp006Metres, cp006Minutes, cp006Speed, type TsdCp006NativeLanguage } from "./native-primitives-v1";

export const TSD_CP006_NATIVE_REVIEW_STATUS_V2 = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V2" as const;

function tokenCounts(text: string): Map<string, number> {
  const out = new Map<string, number>();
  for (const token of text.match(/\d+/g) ?? []) out.set(token, (out.get(token) ?? 0) + 1);
  return out;
}

function missingTokens(source: string, localized: string): Map<string, number> {
  const want = tokenCounts(source);
  const have = tokenCounts(localized);
  const missing = new Map<string, number>();
  for (const [token, count] of want) {
    const deficit = count - (have.get(token) ?? 0);
    if (deficit > 0) missing.set(token, deficit);
  }
  return missing;
}

function clauseFitsMissing(clause: string, missing: Map<string, number>): boolean {
  const counts = tokenCounts(clause);
  if (counts.size === 0) return false;
  for (const [token, count] of counts) if ((missing.get(token) ?? 0) < count) return false;
  return true;
}

function consumeClause(clause: string, missing: Map<string, number>): void {
  for (const [token, count] of tokenCounts(clause)) {
    const left = (missing.get(token) ?? 0) - count;
    if (left > 0) missing.set(token, left);
    else missing.delete(token);
  }
}

function valueClause(labelHi: string, labelPa: string, value: string, language: TsdCp006NativeLanguage): string {
  return language === "hi" ? `${labelHi} ${value} है।` : `${labelPa} ${value} ਹੈ।`;
}

function rationalClause(value: Rational | undefined, make: (value: Rational) => string, hi: string, pa: string, language: TsdCp006NativeLanguage): string | null {
  return value ? valueClause(hi, pa, make(value), language) : null;
}

function repairFrozenNumericGivens(row: TsdCp006NativeReviewRowV1): string {
  const { source, presentation } = row;
  const missing = missingTokens(source.stem, presentation.stem);
  if (missing.size === 0) return presentation.stem;
  const input = source.input;
  const language = presentation.language;
  const candidates = [
    rationalClause(input.trackLength, cp006Metres, "ट्रैक की लंबाई", "ਟਰੈਕ ਦੀ ਲੰਬਾਈ", language),
    rationalClause(input.speedA, cp006Speed, "A की गति", "A ਦੀ ਰਫ਼ਤਾਰ", language),
    rationalClause(input.speedB, cp006Speed, "B की गति", "B ਦੀ ਰਫ਼ਤਾਰ", language),
    rationalClause(input.speedC, cp006Speed, "C की गति", "C ਦੀ ਰਫ਼ਤਾਰ", language),
    rationalClause(input.timeWindow, (v) => cp006Minutes(v, language), "दिया गया समय", "ਦਿੱਤਾ ਸਮਾਂ", language),
    rationalClause(input.startDelayB, (v) => cp006Minutes(v, language), "B की शुरुआती देरी", "B ਦੀ ਸ਼ੁਰੂਆਤੀ ਦੇਰੀ", language),
    rationalClause(input.initialArcGap, cp006Metres, "शुरुआती चाप-अंतर", "ਸ਼ੁਰੂਆਤੀ ਚਾਪ-ਅੰਤਰ", language),
    rationalClause(input.startPositionA, cp006Metres, "A की शुरुआती स्थिति", "A ਦੀ ਸ਼ੁਰੂਆਤੀ ਸਥਿਤੀ", language),
    rationalClause(input.startPositionB, cp006Metres, "B की शुरुआती स्थिति", "B ਦੀ ਸ਼ੁਰੂਆਤੀ ਸਥਿਤੀ", language),
    rationalClause(input.observedMeetingTime, (v) => cp006Minutes(v, language), "देखी गई मुलाकात का समय", "ਵੇਖੀ ਗਈ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ", language),
    input.nthEvent ? valueClause("पूछी गई मुलाकात संख्या", "ਪੁੱਛੀ ਗਈ ਮੁਲਾਕਾਤ ਸੰਖਿਆ", String(input.nthEvent), language) : null,
    input.observedMeetingCount !== undefined ? valueClause("देखी गई मुलाकातों की संख्या", "ਵੇਖੀਆਂ ਗਈਆਂ ਮੁਲਾਕਾਤਾਂ ਦੀ ਗਿਣਤੀ", String(input.observedMeetingCount), language) : null,
  ].filter((value): value is string => Boolean(value));

  const prepend: string[] = [];
  for (const clause of candidates) {
    if (!clauseFitsMissing(clause, missing)) continue;
    prepend.push(clause);
    consumeClause(clause, missing);
    if (missing.size === 0) break;
  }
  if (missing.size > 0) {
    throw new Error(`${source.seed}/${language}: cannot repair frozen numeric givens ${JSON.stringify([...missing])}`);
  }
  return `${prepend.join(" ")} ${presentation.stem}`;
}

export function generateCp006NativeReviewV2() {
  return Object.freeze(generateCp006NativeReviewV1().map((row) => Object.freeze({
    source: row.source,
    presentation: Object.freeze({
      ...row.presentation,
      stem: repairFrozenNumericGivens(row),
      lifecycle: Object.freeze({
        ...row.presentation.lifecycle,
        nativeReviewStatus: TSD_CP006_NATIVE_REVIEW_STATUS_V2,
      }),
    }),
  })));
}

export const TSD_CP006_NATIVE_REVIEW_V2_156Q = generateCp006NativeReviewV2();
