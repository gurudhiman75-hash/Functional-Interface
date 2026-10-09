import { generateCp006NativeReviewV5, TSD_CP006_NATIVE_REVIEW_STATUS_V5 } from "./native-review-editorial-v5";

export const TSD_CP006_NATIVE_REVIEW_STATUS_V6 = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V6" as const;

export const TSD_CP006_PUNJABI_ACTOR_ROOTS_V6: Readonly<Record<string, string>> = Object.freeze({
  Runner: "ਦੌੜਾਕ",
  Athlete: "ਖਿਡਾਰੀ",
  Cadet: "ਕੈਡੇਟ",
  Trainee: "ਸਿਖਿਆਰਥੀ",
  Jogger: "ਹੌਲੀ ਦੌੜਨ ਵਾਲਾ",
  Walker: "ਤੁਰਨ ਵਾਲਾ",
  Competitor: "ਮੁਕਾਬਲੇਬਾਜ਼",
  Participant: "ਭਾਗੀਦਾਰ",
  Recruit: "ਭਰਤੀ ਸਿਖਿਆਰਥੀ",
  Player: "ਖਿਡਾਰੀ",
  Student: "ਵਿਦਿਆਰਥੀ",
  Racer: "ਦੌੜ ਮੁਕਾਬਲੇਬਾਜ਼",
  "Club runner": "ਕਲੱਬ ਦੌੜਾਕ",
  "Track athlete": "ਟਰੈਕ ਖਿਡਾਰੀ",
  "Academy trainee": "ਅਕੈਡਮੀ ਸਿਖਿਆਰਥੀ",
  "Fitness walker": "ਕਸਰਤ ਲਈ ਤੁਰਨ ਵਾਲਾ",
  "Sports cadet": "ਖੇਡ ਕੈਡੇਟ",
  "Practice runner": "ਅਭਿਆਸੀ ਦੌੜਾਕ",
});

const PUNJABI_LEXICON_REPLACEMENTS: readonly (readonly [string, string])[] = Object.freeze([
  ["ਅਕੈਡਮੀ ਪ੍ਰਸ਼ਿਕਸ਼ੂ", "ਅਕੈਡਮੀ ਸਿਖਿਆਰਥੀ"],
  ["ਭਰਤੀ ਪ੍ਰਸ਼ਿਕਸ਼ੂ", "ਭਰਤੀ ਸਿਖਿਆਰਥੀ"],
  ["ਅਭਿਆਸ ਧਾਵਕ", "ਅਭਿਆਸੀ ਦੌੜਾਕ"],
  ["ਕਲੱਬ ਧਾਵਕ", "ਕਲੱਬ ਦੌੜਾਕ"],
  ["ਟਰੈਕ ਐਥਲੀਟ", "ਟਰੈਕ ਖਿਡਾਰੀ"],
  ["ਫਿਟਨੈੱਸ ਵਾਕਰ", "ਕਸਰਤ ਲਈ ਤੁਰਨ ਵਾਲਾ"],
  ["ਜੌਗਰ", "ਹੌਲੀ ਦੌੜਨ ਵਾਲਾ"],
  ["ਵਾਕਰ", "ਤੁਰਨ ਵਾਲਾ"],
  ["ਰੇਸਰ", "ਦੌੜ ਮੁਕਾਬਲੇਬਾਜ਼"],
  ["ਪ੍ਰਸ਼ਿਕਸ਼ੂ", "ਸਿਖਿਆਰਥੀ"],
  ["ਐਥਲੀਟ", "ਖਿਡਾਰੀ"],
  ["ਧਾਵਕ", "ਦੌੜਾਕ"],
]);

function localizePunjabiLexicon(text: string): string {
  let result = text;
  for (const [from, to] of PUNJABI_LEXICON_REPLACEMENTS) result = result.replaceAll(from, to);
  return result;
}

export function generateCp006NativeReviewV6() {
  return Object.freeze(generateCp006NativeReviewV5().map((row) => {
    if (row.presentation.language !== "pa") {
      return Object.freeze({
        ...row,
        presentation: Object.freeze({
          ...row.presentation,
          lifecycle: Object.freeze({
            ...row.presentation.lifecycle,
            nativeReviewStatus: TSD_CP006_NATIVE_REVIEW_STATUS_V6,
          }),
        }),
      });
    }

    return Object.freeze({
      ...row,
      presentation: Object.freeze({
        ...row.presentation,
        stem: localizePunjabiLexicon(row.presentation.stem),
        explanation: Object.freeze({
          steps: Object.freeze(row.presentation.explanation.steps.map(localizePunjabiLexicon)) as readonly [string, string],
        }),
        lifecycle: Object.freeze({
          ...row.presentation.lifecycle,
          nativeReviewStatus: TSD_CP006_NATIVE_REVIEW_STATUS_V6,
        }),
      }),
    });
  }));
}

export const TSD_CP006_NATIVE_V6_SOURCE_STATUS = TSD_CP006_NATIVE_REVIEW_STATUS_V5;
