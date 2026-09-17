import type { EcoLocaleV1, EcoLocalizedQuestionV1 } from "./eco-localization-types-v1";
import {
  generateEcoCp005LocalizedReviewV1 as base005,
  generateEcoCp006LocalizedReviewV1 as base006,
} from "./eco-cp005-cp006-localization-v1";

type NativeLocale = Exclude<EcoLocaleV1, "en">;
const edge: Readonly<Record<string, Readonly<Record<NativeLocale, string>>>> = Object.freeze({
  "GDP deflator": { hi: "GDP डिफ्लेटर", pa: "GDP ਡਿਫਲੇਟਰ" },
  "Core CPI": { hi: "मूल CPI", pa: "ਮੂਲ CPI" },
  "Hyperinflation": { hi: "अति-मुद्रास्फीति", pa: "ਅਤਿ-ਮਹਿੰਗਾਈ" },
  "Revaluation": { hi: "पुनर्मूल्यांकन", pa: "ਮੁੜ-ਮੁੱਲਾਂਕਣ" },
  "WPI coverage": { hi: "WPI का दायरा", pa: "WPI ਦਾ ਦਾਇਰਾ" },
  "Seasonal poverty": { hi: "मौसमी गरीबी", pa: "ਮੌਸਮੀ ਗਰੀਬੀ" },
  "Absolute poverty only": { hi: "केवल निरपेक्ष गरीबी", pa: "ਸਿਰਫ਼ ਨਿਰਪੇਖ ਗਰੀਬੀ" },
  "Relative poverty only": { hi: "केवल सापेक्ष गरीबी", pa: "ਸਿਰਫ਼ ਸਾਪੇਖ ਗਰੀਬੀ" },
  "Cyclical poverty": { hi: "चक्रीय गरीबी", pa: "ਚੱਕਰੀ ਗਰੀਬੀ" },
  "Price index": { hi: "मूल्य सूचकांक", pa: "ਕੀਮਤ ਸੂਚਕ" },
});

function polish(question: EcoLocalizedQuestionV1): EcoLocalizedQuestionV1 {
  if (question.locale === "en") return question;
  const locale = question.locale;
  const options = question.options.map((value) => edge[value]?.[locale] ?? value);
  return { ...question, options, canonicalAnswer: options[question.correctIndex] };
}

export function generateEcoCp005LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return base005(locale).map(polish);
}

export function generateEcoCp006LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return base006(locale).map(polish);
}

export function generateEcoCp005Cp006LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [...generateEcoCp005LocalizedReviewV1(locale), ...generateEcoCp006LocalizedReviewV1(locale)];
}

export const ECO_MULTILINGUAL_CP005_CP006_V1 = Object.freeze({
  en: generateEcoCp005Cp006LocalizedReviewV1("en"),
  hi: generateEcoCp005Cp006LocalizedReviewV1("hi"),
  pa: generateEcoCp005Cp006LocalizedReviewV1("pa"),
});
