import type { EcoLocaleV1, EcoLocalizedQuestionV1 } from "./eco-localization-types-v1";
import {
  generateEcoCp001LocalizedReviewV1 as generateEcoCp001LocalizedReviewBaseV1,
  generateEcoCp002LocalizedReviewV1 as generateEcoCp002LocalizedReviewBaseV1,
} from "./eco-cp001-cp002-localization-v1";
import {
  generateEcoCp003LocalizedReviewV1,
  generateEcoCp004LocalizedReviewV1,
  generateEcoCp003Cp004LocalizedReviewV1,
  ECO_MULTILINGUAL_CP003_CP004_V1,
} from "./eco-cp003-cp004-localization-v1";
import {
  generateEcoCp005LocalizedReviewV1,
  generateEcoCp006LocalizedReviewV1,
  generateEcoCp005Cp006LocalizedReviewV1,
  ECO_MULTILINGUAL_CP005_CP006_V1,
} from "./eco-cp005-cp006-polish-v1";
import {
  generateEcoCp007LocalizedReviewV1,
  generateEcoCp008LocalizedReviewV1,
  generateEcoCp007Cp008LocalizedReviewV1,
  ECO_MULTILINGUAL_CP007_CP008_V1,
} from "./eco-cp007-cp008-localization-v1";
import { generateEcoCp009LocalizedReviewV1 } from "./eco-cp009-localization-v1";
import { generateEcoCp010LocalizedReviewV1 } from "./eco-cp010-localization-v1";
import { generateEcoCp011LocalizedReviewV1 } from "./eco-cp011-localization-v1";
import { generateEcoCp012LocalizedReviewV1 } from "./eco-cp012-localization-v1";
import { generateEcoCp013LocalizedReviewV1 } from "./eco-cp013-localization-v1";
import { generateEcoCp014LocalizedReviewV1 } from "./eco-cp014-localization-v1";
import { generateEcoCp015LocalizedReviewV1 } from "./eco-cp015-localization-v1";
import { generateEcoCp016LocalizedReviewV1 } from "./eco-cp016-localization-v1";
import { generateEcoCp017LocalizedReviewV1 } from "./eco-cp017-localization-v1";
import { generateEcoCp018LocalizedReviewV1 } from "./eco-cp018-localization-v1";

const CP001_FINAL_STEM_OVERRIDES: Readonly<Record<string, Readonly<Record<"hi" | "pa", string>>>> = Object.freeze({
  "ECO-CP001-V2-011": {
    hi: "उत्पादन के औज़ार उत्पादन के किस कारक का उदाहरण हैं?",
    pa: "ਉਤਪਾਦਨ ਦੇ ਔਜ਼ਾਰ ਉਤਪਾਦਨ ਦੇ ਕਿਹੜੇ ਕਾਰਕ ਦੀ ਉਦਾਹਰਨ ਹਨ?",
  },
  "ECO-CP001-V2-012": {
    hi: "वह संस्थापक जो भूमि, श्रम और पूंजी को उत्पादन के लिए जोड़ता है, उत्पादन के किस कारक का उदाहरण है?",
    pa: "ਉਹ ਸੰਸਥਾਪਕ ਜੋ ਜ਼ਮੀਨ, ਕਿਰਤ ਅਤੇ ਪੂੰਜੀ ਨੂੰ ਉਤਪਾਦਨ ਲਈ ਜੋੜਦਾ ਹੈ, ਉਤਪਾਦਨ ਦੇ ਕਿਹੜੇ ਕਾਰਕ ਦੀ ਉਦਾਹਰਨ ਹੈ?",
  },
});

function finalPolish(question: EcoLocalizedQuestionV1): EcoLocalizedQuestionV1 {
  if (question.locale === "en") return question;
  const override = CP001_FINAL_STEM_OVERRIDES[question.localizationV1.englishQuestionId]?.[question.locale];
  return override ? { ...question, stem: override } : question;
}

export function generateEcoCp001LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return generateEcoCp001LocalizedReviewBaseV1(locale).map(finalPolish);
}

export function generateEcoCp002LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return generateEcoCp002LocalizedReviewBaseV1(locale).map(finalPolish);
}

export function generateEcoCp001Cp002LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [...generateEcoCp001LocalizedReviewV1(locale), ...generateEcoCp002LocalizedReviewV1(locale)];
}

export function generateEcoCp001Cp004LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [
    ...generateEcoCp001Cp002LocalizedReviewV1(locale),
    ...generateEcoCp003Cp004LocalizedReviewV1(locale),
  ];
}

export function generateEcoCp001Cp006LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [
    ...generateEcoCp001Cp004LocalizedReviewV1(locale),
    ...generateEcoCp005Cp006LocalizedReviewV1(locale),
  ];
}

export function generateEcoCp001Cp008LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [
    ...generateEcoCp001Cp006LocalizedReviewV1(locale),
    ...generateEcoCp007Cp008LocalizedReviewV1(locale),
  ];
}

export function generateEcoCp009Cp010LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [...generateEcoCp009LocalizedReviewV1(locale), ...generateEcoCp010LocalizedReviewV1(locale)];
}

export function generateEcoCp001Cp010LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [
    ...generateEcoCp001Cp008LocalizedReviewV1(locale),
    ...generateEcoCp009Cp010LocalizedReviewV1(locale),
  ];
}

export function generateEcoCp011Cp012LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [...generateEcoCp011LocalizedReviewV1(locale), ...generateEcoCp012LocalizedReviewV1(locale)];
}

export function generateEcoCp001Cp012LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [
    ...generateEcoCp001Cp010LocalizedReviewV1(locale),
    ...generateEcoCp011Cp012LocalizedReviewV1(locale),
  ];
}

export function generateEcoCp013Cp014LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [...generateEcoCp013LocalizedReviewV1(locale), ...generateEcoCp014LocalizedReviewV1(locale)];
}

export function generateEcoCp001Cp014LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [
    ...generateEcoCp001Cp012LocalizedReviewV1(locale),
    ...generateEcoCp013Cp014LocalizedReviewV1(locale),
  ];
}

export function generateEcoCp015Cp016LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [...generateEcoCp015LocalizedReviewV1(locale), ...generateEcoCp016LocalizedReviewV1(locale)];
}

export function generateEcoCp001Cp016LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [
    ...generateEcoCp001Cp014LocalizedReviewV1(locale),
    ...generateEcoCp015Cp016LocalizedReviewV1(locale),
  ];
}

export function generateEcoCp017Cp018LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [...generateEcoCp017LocalizedReviewV1(locale), ...generateEcoCp018LocalizedReviewV1(locale)];
}

export function generateEcoCp001Cp018LocalizedReviewV1(locale: EcoLocaleV1): EcoLocalizedQuestionV1[] {
  return [
    ...generateEcoCp001Cp016LocalizedReviewV1(locale),
    ...generateEcoCp017Cp018LocalizedReviewV1(locale),
  ];
}

export {
  generateEcoCp003LocalizedReviewV1,
  generateEcoCp004LocalizedReviewV1,
  generateEcoCp003Cp004LocalizedReviewV1,
  ECO_MULTILINGUAL_CP003_CP004_V1,
  generateEcoCp005LocalizedReviewV1,
  generateEcoCp006LocalizedReviewV1,
  generateEcoCp005Cp006LocalizedReviewV1,
  ECO_MULTILINGUAL_CP005_CP006_V1,
  generateEcoCp007LocalizedReviewV1,
  generateEcoCp008LocalizedReviewV1,
  generateEcoCp007Cp008LocalizedReviewV1,
  ECO_MULTILINGUAL_CP007_CP008_V1,
  generateEcoCp009LocalizedReviewV1,
  generateEcoCp010LocalizedReviewV1,
  generateEcoCp011LocalizedReviewV1,
  generateEcoCp012LocalizedReviewV1,
  generateEcoCp013LocalizedReviewV1,
  generateEcoCp014LocalizedReviewV1,
  generateEcoCp015LocalizedReviewV1,
  generateEcoCp016LocalizedReviewV1,
  generateEcoCp017LocalizedReviewV1,
  generateEcoCp018LocalizedReviewV1,
};

export const ECO_MULTILINGUAL_CP001_CP002_V1 = Object.freeze({
  en: generateEcoCp001Cp002LocalizedReviewV1("en"),
  hi: generateEcoCp001Cp002LocalizedReviewV1("hi"),
  pa: generateEcoCp001Cp002LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP001_CP004_V1 = Object.freeze({
  en: generateEcoCp001Cp004LocalizedReviewV1("en"),
  hi: generateEcoCp001Cp004LocalizedReviewV1("hi"),
  pa: generateEcoCp001Cp004LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP001_CP006_V1 = Object.freeze({
  en: generateEcoCp001Cp006LocalizedReviewV1("en"),
  hi: generateEcoCp001Cp006LocalizedReviewV1("hi"),
  pa: generateEcoCp001Cp006LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP001_CP008_V1 = Object.freeze({
  en: generateEcoCp001Cp008LocalizedReviewV1("en"),
  hi: generateEcoCp001Cp008LocalizedReviewV1("hi"),
  pa: generateEcoCp001Cp008LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP009_CP010_V1 = Object.freeze({
  en: generateEcoCp009Cp010LocalizedReviewV1("en"),
  hi: generateEcoCp009Cp010LocalizedReviewV1("hi"),
  pa: generateEcoCp009Cp010LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP001_CP010_V1 = Object.freeze({
  en: generateEcoCp001Cp010LocalizedReviewV1("en"),
  hi: generateEcoCp001Cp010LocalizedReviewV1("hi"),
  pa: generateEcoCp001Cp010LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP011_CP012_V1 = Object.freeze({
  en: generateEcoCp011Cp012LocalizedReviewV1("en"),
  hi: generateEcoCp011Cp012LocalizedReviewV1("hi"),
  pa: generateEcoCp011Cp012LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP001_CP012_V1 = Object.freeze({
  en: generateEcoCp001Cp012LocalizedReviewV1("en"),
  hi: generateEcoCp001Cp012LocalizedReviewV1("hi"),
  pa: generateEcoCp001Cp012LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP013_CP014_V1 = Object.freeze({
  en: generateEcoCp013Cp014LocalizedReviewV1("en"),
  hi: generateEcoCp013Cp014LocalizedReviewV1("hi"),
  pa: generateEcoCp013Cp014LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP001_CP014_V1 = Object.freeze({
  en: generateEcoCp001Cp014LocalizedReviewV1("en"),
  hi: generateEcoCp001Cp014LocalizedReviewV1("hi"),
  pa: generateEcoCp001Cp014LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP015_CP016_V1 = Object.freeze({
  en: generateEcoCp015Cp016LocalizedReviewV1("en"),
  hi: generateEcoCp015Cp016LocalizedReviewV1("hi"),
  pa: generateEcoCp015Cp016LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP001_CP016_V1 = Object.freeze({
  en: generateEcoCp001Cp016LocalizedReviewV1("en"),
  hi: generateEcoCp001Cp016LocalizedReviewV1("hi"),
  pa: generateEcoCp001Cp016LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP017_CP018_V1 = Object.freeze({
  en: generateEcoCp017Cp018LocalizedReviewV1("en"),
  hi: generateEcoCp017Cp018LocalizedReviewV1("hi"),
  pa: generateEcoCp017Cp018LocalizedReviewV1("pa"),
});

export const ECO_MULTILINGUAL_CP001_CP018_V1 = Object.freeze({
  en: generateEcoCp001Cp018LocalizedReviewV1("en"),
  hi: generateEcoCp001Cp018LocalizedReviewV1("hi"),
  pa: generateEcoCp001Cp018LocalizedReviewV1("pa"),
});
