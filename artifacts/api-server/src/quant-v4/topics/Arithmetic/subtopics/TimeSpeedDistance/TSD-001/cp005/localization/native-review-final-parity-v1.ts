import { TSD_CP005_NATIVE_FINAL_REVIEW_V1, type TsdCp005NativeReviewRowV1 } from "./native-review-final-v1";
import { cp005Km, cp005NativeActor, cp005Speed, type TsdCp005NativeLanguage } from "./native-primitives-v1";

function ensureFrozenGivenParity(row: TsdCp005NativeReviewRowV1): TsdCp005NativeReviewRowV1 {
  const language: TsdCp005NativeLanguage = row.presentation.language;
  let stem = row.presentation.stem;
  const additions: string[] = [];
  const input = row.source.input;

  if (input.speedA && input.speedB) {
    const speedA = cp005Speed(input.speedA);
    const speedB = cp005Speed(input.speedB);
    const englishHasA = row.source.stem.includes(speedA);
    const englishHasB = row.source.stem.includes(speedB);
    const nativeHasA = stem.includes(speedA);
    const nativeHasB = stem.includes(speedB);
    if ((englishHasA && !nativeHasA) || (englishHasB && !nativeHasB)) {
      const actorA = cp005NativeActor(row.source.objectFamily, "A", language);
      const actorB = cp005NativeActor(row.source.objectFamily, "B", language);
      additions.push(language === "hi"
        ? `${actorA} की गति ${speedA} और ${actorB} की गति ${speedB} है।`
        : `${actorA} ਦੀ ਰਫ਼ਤਾਰ ${speedA} ਅਤੇ ${actorB} ਦੀ ਰਫ਼ਤਾਰ ${speedB} ਹੈ।`);
    }
  }

  if (input.routeDistance) {
    const route = cp005Km(input.routeDistance);
    if (row.source.stem.includes(route) && !stem.includes(route)) {
      additions.push(language === "hi" ? `P–Q की दूरी ${route} है।` : `P–Q ਦੀ ਦੂਰੀ ${route} ਹੈ।`);
    }
  }

  // Preserve explicit numeric meeting labels when the frozen English stem uses
  // "meeting 1" / "meeting 2" rather than lexical first/second wording.
  if (/\bmeeting 1\b/i.test(row.source.stem) && /\bmeeting 2\b/i.test(row.source.stem)) {
    const labelsPresent = /(?:मुलाकात|ਮੁਲਾਕਾਤ)\s*1/u.test(stem) && /(?:मुलाकात|ਮੁਲਾਕਾਤ)\s*2/u.test(stem);
    if (!labelsPresent) {
      additions.push(language === "hi"
        ? "दिया गया समय-अंतर मुलाकात 1 और मुलाकात 2 के बीच है।"
        : "ਦਿੱਤਾ ਸਮਾਂ-ਅੰਤਰ ਮੁਲਾਕਾਤ 1 ਅਤੇ ਮੁਲਾਕਾਤ 2 ਵਿਚਕਾਰ ਹੈ।");
    }
  }

  if (!additions.length) return row;
  stem = `${additions.join(" ")} ${stem}`;
  return Object.freeze({
    ...row,
    presentation: Object.freeze({ ...row.presentation, stem }),
  });
}

export function generateCp005NativeFinalParityReviewV1(): readonly TsdCp005NativeReviewRowV1[] {
  return Object.freeze(TSD_CP005_NATIVE_FINAL_REVIEW_V1.map(ensureFrozenGivenParity));
}

export const TSD_CP005_NATIVE_FINAL_PARITY_REVIEW_V1 = generateCp005NativeFinalParityReviewV1();
