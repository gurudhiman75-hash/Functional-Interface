import type { SerCp007Locale } from "./ser-cp-007-localized-runtime";
import {
  generateSerCp007PermanentLocalizedPackage as generateCandidatePackage,
  regenerateSerCp007PermanentLocalizedPackage as regenerateCandidatePackage,
  SER_CP007_LOCALES,
  SER_CP007_LOCALIZATION_CANDIDATE_VERSION,
  type SerCp007PermanentLocalizedPackage,
} from "./ser-cp-007-localized-runtime";

export {
  SER_CP007_LOCALES,
  SER_CP007_LOCALIZATION_CANDIDATE_VERSION,
};
export type {
  SerCp007Locale,
  SerCp007PermanentLocalizedPackage,
} from "./ser-cp-007-localized-runtime";

export const SER_CP007_LOCALIZATION_FINALIZATION_VERSION =
  "SER_CP007_HI_PA_LOCALIZATION_FINALIZATION_V1" as const;

function language(locale: SerCp007Locale, hi: string, pa: string): string {
  return locale === "hi-IN" ? hi : pa;
}

function localizeEmbeddedClauses(
  source: string,
  locale: SerCp007Locale,
): string {
  let text = source;

  text = text.replace(
    /replace every letter with its alphabet opposite and then move the first (\d+) letters to the end/g,
    (_, count: string) =>
      language(
        locale,
        `हर अक्षर को उसके वर्णमाला-विपरीत अक्षर से बदलें और फिर पहले ${count} अक्षरों को अंत में ले जाएँ`,
        `ਹਰ ਅੱਖਰ ਨੂੰ ਉਸ ਦੇ ਵਰਣਮਾਲਾ-ਵਿਰੋਧੀ ਅੱਖਰ ਨਾਲ ਬਦਲੋ ਅਤੇ ਫਿਰ ਪਹਿਲੇ ${count} ਅੱਖਰਾਂ ਨੂੰ ਅੰਤ ਵਿੱਚ ਲੈ ਜਾਓ`,
      ),
  );
  text = text.replace(
    /replace every letter with its alphabet opposite and then move the first letter to the end/g,
    language(
      locale,
      "हर अक्षर को उसके वर्णमाला-विपरीत अक्षर से बदलें और फिर पहले अक्षर को अंत में ले जाएँ",
      "ਹਰ ਅੱਖਰ ਨੂੰ ਉਸ ਦੇ ਵਰਣਮਾਲਾ-ਵਿਰੋਧੀ ਅੱਖਰ ਨਾਲ ਬਦਲੋ ਅਤੇ ਫਿਰ ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ਅੰਤ ਵਿੱਚ ਲੈ ਜਾਓ",
    ),
  );
  text = text.replace(
    /replace every letter with its alphabet opposite: A–Z, B–Y, C–X and so on/g,
    language(
      locale,
      "हर अक्षर को उसके वर्णमाला-विपरीत अक्षर से बदलें: A–Z, B–Y, C–X आदि",
      "ਹਰ ਅੱਖਰ ਨੂੰ ਉਸ ਦੇ ਵਰਣਮਾਲਾ-ਵਿਰੋਧੀ ਅੱਖਰ ਨਾਲ ਬਦਲੋ: A–Z, B–Y, C–X ਆਦਿ",
    ),
  );
  text = text.replace(
    /swap the 1st and 2nd letters, the 3rd and 4th letters, and so on/g,
    language(
      locale,
      "पहले 1st और 2nd स्थानों के अक्षरों की, फिर 3rd और 4th स्थानों के अक्षरों की अदला-बदली करें और यही क्रम जारी रखें",
      "ਪਹਿਲਾਂ 1st ਅਤੇ 2nd ਸਥਾਨਾਂ ਦੇ ਅੱਖਰਾਂ ਦੀ, ਫਿਰ 3rd ਅਤੇ 4th ਸਥਾਨਾਂ ਦੇ ਅੱਖਰਾਂ ਦੀ ਅਦਲਾ-ਬਦਲੀ ਕਰੋ ਅਤੇ ਇਹੀ ਕ੍ਰਮ ਜਾਰੀ ਰੱਖੋ",
    ),
  );
  text = text.replace(
    /the second group is the reverse of the first/g,
    language(
      locale,
      "दूसरा समूह पहले समूह का उलटा क्रम है",
      "ਦੂਜਾ ਸਮੂਹ ਪਹਿਲੇ ਸਮੂਹ ਦਾ ਉਲਟ ਕ੍ਰਮ ਹੈ",
    ),
  );
  text = text.replace(
    /write the odd-position letters first and the even-position letters afterwards/g,
    language(
      locale,
      "पहले विषम स्थानों के अक्षर और फिर सम स्थानों के अक्षर लिखें",
      "ਪਹਿਲਾਂ ਵਿਸ਼ਮ ਸਥਾਨਾਂ ਦੇ ਅੱਖਰ ਅਤੇ ਫਿਰ ਸਮ ਸਥਾਨਾਂ ਦੇ ਅੱਖਰ ਲਿਖੋ",
    ),
  );
  text = text.replace(
    /the new letter at the centre each time/g,
    language(
      locale,
      "हर बार नया अक्षर मध्य में जोड़ें",
      "ਹਰ ਵਾਰ ਨਵਾਂ ਅੱਖਰ ਮੱਧ ਵਿੱਚ ਜੋੜੋ",
    ),
  );
  text = text.replace(
    /just left of the centre, then just right of the centre, and repeat/g,
    language(
      locale,
      "पहले मध्य के ठीक बाएँ, फिर मध्य के ठीक दाएँ अक्षर जोड़ें और यही क्रम दोहराएँ",
      "ਪਹਿਲਾਂ ਮੱਧ ਦੇ ਠੀਕ ਖੱਬੇ, ਫਿਰ ਮੱਧ ਦੇ ਠੀਕ ਸੱਜੇ ਅੱਖਰ ਜੋੜੋ ਅਤੇ ਇਹੀ ਕ੍ਰਮ ਦੁਹਰਾਓ",
    ),
  );
  text = text.replace(
    /Fill the visible gap groups in order/g,
    language(
      locale,
      "दिखाई दिए रिक्त समूहों को क्रम से भरें",
      "ਦਿਖਾਏ ਖਾਲੀ ਸਮੂਹਾਂ ਨੂੰ ਕ੍ਰਮ ਅਨੁਸਾਰ ਭਰੋ",
    ),
  );
  text = text.replace(
    /wraps to ([A-Z])/g,
    (_, letter: string) =>
      language(
        locale,
        `वर्णमाला चक्र के बाद ${letter}`,
        `ਵਰਣਮਾਲਾ ਚੱਕਰ ਤੋਂ ਬਾਅਦ ${letter}`,
      ),
  );
  text = text.replace(
    /no letters/g,
    language(locale, "कोई अक्षर नहीं", "ਕੋਈ ਅੱਖਰ ਨਹੀਂ"),
  );
  text = text.replace(
    /\sand\s/g,
    language(locale, " और ", " ਅਤੇ "),
  );

  return text;
}

function finalizePackage(
  candidate: SerCp007PermanentLocalizedPackage,
): SerCp007PermanentLocalizedPackage {
  const locale = candidate.locale;
  const explanation = candidate.question.explanation;
  const question = Object.freeze({
    ...candidate.question,
    explanation: Object.freeze({
      ...explanation,
      rule: localizeEmbeddedClauses(explanation.rule, locale),
      steps: Object.freeze(
        explanation.steps.map((step) => localizeEmbeddedClauses(step, locale)),
      ),
      quickMethod: localizeEmbeddedClauses(explanation.quickMethod, locale),
      commonMistake: localizeEmbeddedClauses(explanation.commonMistake, locale),
      conclusion: localizeEmbeddedClauses(explanation.conclusion, locale),
    }),
  });
  const review = Object.freeze({
    ...candidate.review,
    review: localizeEmbeddedClauses(candidate.review.review, locale),
    conciseReview: localizeEmbeddedClauses(
      candidate.review.conciseReview,
      locale,
    ),
    expandedReview: localizeEmbeddedClauses(
      candidate.review.expandedReview,
      locale,
    ),
    workedSteps: Object.freeze(
      candidate.review.workedSteps.map((step) =>
        localizeEmbeddedClauses(step, locale),
      ),
    ),
  });

  return Object.freeze({
    ...candidate,
    question,
    review,
  });
}

export function generateSerCp007PermanentLocalizedPackage(
  temporaryTemplateId: string,
  locale: SerCp007Locale,
  seed: number,
): SerCp007PermanentLocalizedPackage {
  return finalizePackage(
    generateCandidatePackage(temporaryTemplateId, locale, seed),
  );
}

export function regenerateSerCp007PermanentLocalizedPackage(input: {
  readonly temporaryTemplateId: string;
  readonly locale: SerCp007Locale;
  readonly seed: number;
  readonly subtypeId: string;
  readonly learnerRenderer: string;
}): SerCp007PermanentLocalizedPackage {
  return finalizePackage(regenerateCandidatePackage(input));
}

export function supportedSerCp007LocalizationLocales(): readonly SerCp007Locale[] {
  return SER_CP007_LOCALES;
}
