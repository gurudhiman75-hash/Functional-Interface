import { generateCp006NativeReviewV6, TSD_CP006_NATIVE_REVIEW_STATUS_V6 } from "./native-review-editorial-v6";

export const TSD_CP006_NATIVE_REVIEW_STATUS_V7 = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V7" as const;

export const TSD_CP006_PUNJABI_ACTOR_ROOTS_V7: Readonly<Record<string, string>> = Object.freeze({
  Runner: "ਦੌੜਾਕ",
  Athlete: "ਖਿਡਾਰੀ",
  Cadet: "ਕੈਡੇਟ",
  Trainee: "ਸਿਖਿਆਰਥੀ",
  Jogger: "ਕਸਰਤੀ ਦੌੜਾਕ",
  Walker: "ਪੈਦਲ ਯਾਤਰੀ",
  Competitor: "ਮੁਕਾਬਲੇਬਾਜ਼",
  Participant: "ਭਾਗੀਦਾਰ",
  Recruit: "ਭਰਤੀ ਸਿਖਿਆਰਥੀ",
  Player: "ਖਿਡਾਰੀ",
  Student: "ਵਿਦਿਆਰਥੀ",
  Racer: "ਦੌੜ ਮੁਕਾਬਲੇਬਾਜ਼",
  "Club runner": "ਕਲੱਬ ਦੌੜਾਕ",
  "Track athlete": "ਟਰੈਕ ਖਿਡਾਰੀ",
  "Academy trainee": "ਅਕੈਡਮੀ ਸਿਖਿਆਰਥੀ",
  "Fitness walker": "ਕਸਰਤੀ ਪੈਦਲ ਯਾਤਰੀ",
  "Sports cadet": "ਖੇਡ ਕੈਡੇਟ",
  "Practice runner": "ਅਭਿਆਸੀ ਦੌੜਾਕ",
});

function polishPunjabiActorGrammar(text: string): string {
  return text
    .replaceAll("ਕਸਰਤ ਲਈ ਤੁਰਨ ਵਾਲਾ", "ਕਸਰਤੀ ਪੈਦਲ ਯਾਤਰੀ")
    .replaceAll("ਹੌਲੀ ਦੌੜਨ ਵਾਲਾ", "ਕਸਰਤੀ ਦੌੜਾਕ")
    .replaceAll("ਤੁਰਨ ਵਾਲਾ", "ਪੈਦਲ ਯਾਤਰੀ");
}

export function generateCp006NativeReviewV7() {
  return Object.freeze(generateCp006NativeReviewV6().map((row) => {
    const isPunjabi = row.presentation.language === "pa";
    return Object.freeze({
      ...row,
      presentation: Object.freeze({
        ...row.presentation,
        stem: isPunjabi ? polishPunjabiActorGrammar(row.presentation.stem) : row.presentation.stem,
        explanation: isPunjabi ? Object.freeze({
          steps: Object.freeze(row.presentation.explanation.steps.map(polishPunjabiActorGrammar)) as readonly [string, string],
        }) : row.presentation.explanation,
        lifecycle: Object.freeze({
          ...row.presentation.lifecycle,
          nativeReviewStatus: TSD_CP006_NATIVE_REVIEW_STATUS_V7,
        }),
      }),
    });
  }));
}

export const TSD_CP006_NATIVE_V7_SOURCE_STATUS = TSD_CP006_NATIVE_REVIEW_STATUS_V6;
