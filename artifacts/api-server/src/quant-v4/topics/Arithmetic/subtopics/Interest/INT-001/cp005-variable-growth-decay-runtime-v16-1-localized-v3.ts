import {
  INT_CP005_V16_1_LOCALES,
  generateIntCp005QuestionV16_1Localized as generateBase,
  type IntCp005QuestionV16_1Localized,
  type IntCp005V16_1Locale,
} from "./cp005-variable-growth-decay-runtime-v16-1-localized-v2";
import type { IntCp005QlId } from "./cp005-variable-growth-decay-runtime";

export const INT_CP005_V16_1_LOCALIZED_VERSION = "INT-CP-005-V16.1-HI-PA-HARDENING-v3" as const;
export { INT_CP005_V16_1_LOCALES };
export type { IntCp005QuestionV16_1Localized, IntCp005V16_1Locale };

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function polish(question: IntCp005QuestionV16_1Localized, locale: IntCp005V16_1Locale): IntCp005QuestionV16_1Localized {
  const state = question.mathematicalState;
  let markdown = question.presentation.markdown;

  if (state.qlId === "INT-QL-086") {
    if (locale === "hi-IN") {
      if (state.context === "INVESTMENT" && !markdown.includes("चक्रवृद्धि")) {
        markdown = markdown.replace("का निवेश किया जाता है।", "का निवेश चक्रवृद्धि ब्याज पर किया जाता है।");
      }
      if (state.context === "POPULATION" && !/वृद्धि/u.test(markdown)) {
        markdown = markdown.replace("की वार्षिक दरें", "की वार्षिक वृद्धि दरें").replace("की दरें एक के बाद", "की वृद्धि दरें एक के बाद");
      }
      if (state.context === "ASSET" && !/मूल्य-वृद्धि|वृद्धि/u.test(markdown)) {
        markdown = markdown.replace("की वार्षिक दरें", "की वार्षिक मूल्य-वृद्धि दरें").replace("की दरें एक के बाद", "की मूल्य-वृद्धि दरें एक के बाद");
      }
    } else {
      if (state.context === "INVESTMENT" && !markdown.includes("ਮਿਸ਼ਰਤ")) {
        markdown = markdown.replace("ਦਾ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।", "ਦਾ ਨਿਵੇਸ਼ ਮਿਸ਼ਰਤ ਵਿਆਜ 'ਤੇ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।");
      }
      if (state.context === "POPULATION" && !/ਵਾਧ/u.test(markdown)) {
        markdown = markdown.replace("ਦੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ", "ਦੀਆਂ ਸਾਲਾਨਾ ਵਾਧਾ ਦਰਾਂ").replace("ਦੀਆਂ ਦਰਾਂ ਇੱਕ ਤੋਂ ਬਾਅਦ", "ਦੀਆਂ ਵਾਧਾ ਦਰਾਂ ਇੱਕ ਤੋਂ ਬਾਅਦ");
      }
      if (state.context === "ASSET" && !/ਮੁੱਲ-ਵਾਧ|ਵਾਧ/u.test(markdown)) {
        markdown = markdown.replace("ਦੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ", "ਦੀਆਂ ਸਾਲਾਨਾ ਮੁੱਲ-ਵਾਧਾ ਦਰਾਂ").replace("ਦੀਆਂ ਦਰਾਂ ਇੱਕ ਤੋਂ ਬਾਅਦ", "ਦੀਆਂ ਮੁੱਲ-ਵਾਧਾ ਦਰਾਂ ਇੱਕ ਤੋਂ ਬਾਅਦ");
      }
    }
  }

  if (state.qlId === "INT-QL-088") {
    if (locale === "hi-IN") {
      if (state.context === "INVESTMENT" && !markdown.includes("चक्रवृद्धि")) {
        markdown = markdown.replace("एक निवेश", "चक्रवृद्धि ब्याज पर किया गया निवेश");
      }
      if (state.context === "POPULATION") {
        markdown = markdown
          .replace("वार्षिक दरों", "वार्षिक वृद्धि दरों")
          .replace("की दरें क्रमशः", "की वृद्धि दरें क्रमशः")
          .replace("की दरें लागू", "की वृद्धि दरें लागू")
          .replace("दरें लागू करने के बाद मान", "वृद्धि दरें लागू करने के बाद जनसंख्या")
          .replace("परिवर्तन से पहले का प्रारंभिक जनसंख्या कितना था?", "परिवर्तन से पहले प्रारंभिक जनसंख्या कितनी थी?")
          .replace("प्रारंभिक जनसंख्या कितना था?", "प्रारंभिक जनसंख्या कितनी थी?");
      }
      if (state.context === "ASSET") {
        markdown = markdown
          .replace("वार्षिक दरों", "वार्षिक मूल्य-वृद्धि दरों")
          .replace("की दरें क्रमशः", "की मूल्य-वृद्धि दरें क्रमशः")
          .replace("की दरें लागू", "की मूल्य-वृद्धि दरें लागू");
      }
    } else {
      if (state.context === "INVESTMENT" && !markdown.includes("ਮਿਸ਼ਰਤ")) {
        markdown = markdown.replace("ਇੱਕ ਨਿਵੇਸ਼", "ਮਿਸ਼ਰਤ ਵਿਆਜ 'ਤੇ ਕੀਤਾ ਨਿਵੇਸ਼");
      }
      if (state.context === "POPULATION") {
        markdown = markdown
          .replace("ਸਾਲਾਨਾ ਦਰਾਂ", "ਸਾਲਾਨਾ ਵਾਧਾ ਦਰਾਂ")
          .replace("ਦੀਆਂ ਦਰਾਂ ਕ੍ਰਮਵਾਰ", "ਦੀਆਂ ਵਾਧਾ ਦਰਾਂ ਕ੍ਰਮਵਾਰ")
          .replace("ਦੀਆਂ ਦਰਾਂ ਲਾਗੂ", "ਦੀਆਂ ਵਾਧਾ ਦਰਾਂ ਲਾਗੂ")
          .replace("ਦਰਾਂ ਲਾਗੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਮੁੱਲ", "ਵਾਧਾ ਦਰਾਂ ਲਾਗੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਆਬਾਦੀ")
          .replace("ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ਕਿੰਨਾ ਸੀ?", "ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ਕਿੰਨੀ ਸੀ?")
          .replace("ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ਕਿੰਨਾ ਸੀ?", "ਸ਼ੁਰੂਆਤੀ ਆਬਾਦੀ ਕਿੰਨੀ ਸੀ?");
      }
      if (state.context === "ASSET") {
        markdown = markdown
          .replace("ਸਾਲਾਨਾ ਦਰਾਂ", "ਸਾਲਾਨਾ ਮੁੱਲ-ਵਾਧਾ ਦਰਾਂ")
          .replace("ਦੀਆਂ ਦਰਾਂ ਕ੍ਰਮਵਾਰ", "ਦੀਆਂ ਮੁੱਲ-ਵਾਧਾ ਦਰਾਂ ਕ੍ਰਮਵਾਰ")
          .replace("ਦੀਆਂ ਦਰਾਂ ਲਾਗੂ", "ਦੀਆਂ ਮੁੱਲ-ਵਾਧਾ ਦਰਾਂ ਲਾਗੂ");
      }
    }
  }

  if (state.qlId === "INT-QL-092" && locale === "hi-IN") {
    markdown = markdown.replace(/ होता है।/gu, " होती है।");
  }

  if (state.qlId === "INT-QL-095") {
    if (locale === "hi-IN" && !markdown.includes("चक्रवृद्धि")) {
      markdown = markdown.replace("योजना A और योजना B", "चक्रवृद्धि ब्याज योजना A और योजना B");
    }
    if (locale === "pa-IN" && !markdown.includes("ਮਿਸ਼ਰਤ")) {
      markdown = markdown.replace("ਯੋਜਨਾ A ਅਤੇ ਯੋਜਨਾ B", "ਮਿਸ਼ਰਤ ਵਿਆਜ ਯੋਜਨਾ A ਅਤੇ ਯੋਜਨਾ B");
    }
  }

  if (markdown === question.presentation.markdown) return question;
  return deepFreeze({
    ...question,
    presentation: deepFreeze({ ...question.presentation, markdown, prompt: markdown }),
    mathematicalFingerprint: `${question.mathematicalFingerprint}|V16_1_LOCALIZED_EDITORIAL_V3`,
  });
}

export function generateIntCp005QuestionV16_1Localized(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005V16_1Locale,
): IntCp005QuestionV16_1Localized {
  return polish(generateBase(qlId, seed, locale), locale);
}
