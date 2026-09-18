import { SCI_CP011_REVIEW_V1, type SciCp011ReviewQuestion } from "../matter-properties/sci-cp011-review-v1";
import { SCI_CP012_REVIEW_V1, type SciCp012ReviewQuestion } from "../atomic-structure/sci-cp012-review-v1";
import {
  SCI_CHEMISTRY_LOCALIZATION_V1,
  type ChemistryLocaleV1,
  type ChemistryLocalizedQuestionV1,
} from "./sci-chemistry-localization-types-v1";
import {
  SCI_CHEMISTRY_CP011_HI_V1,
  SCI_CHEMISTRY_CP011_PA_V1,
  type ChemistryNativeSpecV1,
} from "./sci-chemistry-cp011-localization-data-v1";
import {
  SCI_CHEMISTRY_CP012_HI_V1,
  SCI_CHEMISTRY_CP012_PA_V1,
} from "./sci-chemistry-cp012-localization-data-v1";

export type ChemistryWave1CpV1 = "SCI-CP-011" | "SCI-CP-012";
type EnglishQuestion = SciCp011ReviewQuestion | SciCp012ReviewQuestion;

const QL_NAMES = {
  "SCI-CP-011": {
    hi: ["पदार्थ की अवस्थाएँ और मूल भौतिक गुण","कण मॉडल और भौतिक परिवर्तन","शुद्ध पदार्थ, मिश्रण और घोल की मूल बातें","अवस्था परिवर्तन, गुप्त ऊष्मा और दाब","घोल, सांद्रता, संतृप्ति और घुलनशीलता","निलंबन, कोलॉइड और टिंडल प्रभाव","पृथक्करण की विधियाँ","वाष्पीकरण, विसरण, उर्ध्वपातन और स्फटीकरण","समेकित कथन-आधारित तर्क","पदार्थ और पृथक्करण का मिश्रित अनुप्रयोग"],
    pa: ["ਪਦਾਰਥ ਦੀਆਂ ਅਵਸਥਾਵਾਂ ਅਤੇ ਮੂਲ ਭੌਤਿਕ ਗੁਣ","ਕਣ ਮਾਡਲ ਅਤੇ ਭੌਤਿਕ ਬਦਲਾਅ","ਸ਼ੁੱਧ ਪਦਾਰਥ, ਮਿਸ਼ਰਣ ਅਤੇ ਘੋਲ ਦੀਆਂ ਮੂਲ ਗੱਲਾਂ","ਅਵਸਥਾ ਬਦਲਾਅ, ਗੁਪਤ ਊਰਜਾ ਅਤੇ ਦਬਾਅ","ਘੋਲ, ਸੰਕੇਂਦ੍ਰਤਾ, ਸੰਤ੍ਰਿਪਤਾ ਅਤੇ ਘੁਲਨਸ਼ੀਲਤਾ","ਨਿਲੰਬਨ, ਕੋਲਾਇਡ ਅਤੇ ਟਿੰਡਲ ਪ੍ਰਭਾਵ","ਵੱਖ ਕਰਨ ਦੀਆਂ ਵਿਧੀਆਂ","ਵਾਸ਼ਪੀਕਰਨ, ਵਿਸਰਨ, ਉਰਧਵਪਾਤਨ ਅਤੇ ਸਫ਼ਟੀਕਰਨ","ਇਕੱਠਾ ਬਿਆਨ-ਆਧਾਰਿਤ ਤਰਕ","ਪਦਾਰਥ ਅਤੇ ਵੱਖ ਕਰਨ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਲਾਗੂ ਪ੍ਰਸ਼ਨ"],
  },
  "SCI-CP-012": {
    hi: ["उपपरमाण्विक कण और नाभिक","परमाणु संख्या, द्रव्यमान संख्या और समस्थानिक","परमाणु, अणु और आयन","कण गणना, समस्थानिक और समभारिक","इलेक्ट्रॉन विन्यास और संयोजकता","रासायनिक सूत्र, सामान्य आयन और बंध","निश्चित अनुपात तथा परमाणु और आणविक द्रव्यमान","डाल्टन और प्रमुख परमाणु मॉडल","समेकित कथन-आधारित तर्क","परमाणु और अणु का मिश्रित अनुप्रयोग"],
    pa: ["ਉਪ-ਪਰਮਾਣੂ ਕਣ ਅਤੇ ਨਿਊਕਲੀਅਸ","ਪਰਮਾਣੂ ਸੰਖਿਆ, ਭਾਰ ਸੰਖਿਆ ਅਤੇ ਸਮਸਥਾਨਕ","ਪਰਮਾਣੂ, ਅਣੂ ਅਤੇ ਆਇਨ","ਕਣ ਗਿਣਤੀ, ਸਮਸਥਾਨਕ ਅਤੇ ਸਮਭਾਰਿਕ","ਇਲੈਕਟ੍ਰਾਨ ਬਣਤਰ ਅਤੇ ਸੰਯੋਜਕਤਾ","ਰਸਾਇਣਕ ਸੂਤਰ, ਆਮ ਆਇਨ ਅਤੇ ਬੰਧ","ਨਿਸ਼ਚਿਤ ਅਨੁਪਾਤ ਅਤੇ ਪਰਮਾਣੂ ਤੇ ਅਣੂ ਭਾਰ","ਡਾਲਟਨ ਅਤੇ ਮੁੱਖ ਪਰਮਾਣੂ ਮਾਡਲ","ਇਕੱਠਾ ਬਿਆਨ-ਆਧਾਰਿਤ ਤਰਕ","ਪਰਮਾਣੂ ਅਤੇ ਅਣੂ ਦਾ ਮਿਲਿਆ-ਜੁਲਿਆ ਲਾਗੂ ਪ੍ਰਸ਼ਨ"],
  },
} as const;

function englishQuestions(cpId: ChemistryWave1CpV1): readonly EnglishQuestion[] {
  return cpId === "SCI-CP-011" ? SCI_CP011_REVIEW_V1 : SCI_CP012_REVIEW_V1;
}

function nativeSpecs(cpId: ChemistryWave1CpV1, locale: Exclude<ChemistryLocaleV1, "en">): readonly ChemistryNativeSpecV1[] {
  if (cpId === "SCI-CP-011") return locale === "hi" ? SCI_CHEMISTRY_CP011_HI_V1 : SCI_CHEMISTRY_CP011_PA_V1;
  return locale === "hi" ? SCI_CHEMISTRY_CP012_HI_V1 : SCI_CHEMISTRY_CP012_PA_V1;
}

function qlNumber(qlId: string): number {
  return Number(qlId.slice(-3));
}

function insertAnswer(answer: string, distractors: readonly [string,string,string], correctIndex: number): readonly string[] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}

function metadata(englishQuestionId: string) {
  return Object.freeze({
    version: SCI_CHEMISTRY_LOCALIZATION_V1,
    englishQuestionId,
    semanticInvariant: true as const,
    cpInvariant: true as const,
    qlInvariant: true as const,
    difficultyInvariant: true as const,
    sourceInvariant: true as const,
    optionOrderInvariant: true as const,
    correctIndexInvariant: true as const,
    reviewOnly: true as const,
  });
}

function localizeNative(q: EnglishQuestion, locale: Exclude<ChemistryLocaleV1, "en">, spec: ChemistryNativeSpecV1): ChemistryLocalizedQuestionV1 {
  const [stem, answer, distractors, explanation] = spec;
  const options = insertAnswer(answer, distractors, q.correctIndex);
  const names = QL_NAMES[q.cpId as ChemistryWave1CpV1][locale];
  return Object.freeze({
    ...q,
    questionId: `${q.questionId}-${locale.toUpperCase()}`,
    qlName: names[qlNumber(q.qlId) - 1],
    stem,
    options,
    canonicalAnswer: options[q.correctIndex],
    explanation,
    sourceIds: Object.freeze([...q.sourceIds]),
    sourceFactIds: Object.freeze([...q.sourceFactIds]),
    locale,
    localizationV1: metadata(q.questionId),
  });
}

function localizeEnglish(q: EnglishQuestion): ChemistryLocalizedQuestionV1 {
  return Object.freeze({
    ...q,
    options: Object.freeze([...q.options]),
    sourceIds: Object.freeze([...q.sourceIds]),
    sourceFactIds: Object.freeze([...q.sourceFactIds]),
    locale: "en",
    localizationV1: metadata(q.questionId),
  });
}

export function generateChemistryLocalizedCpV1(cpId: ChemistryWave1CpV1, locale: ChemistryLocaleV1): readonly ChemistryLocalizedQuestionV1[] {
  const english = englishQuestions(cpId);
  if (locale === "en") return Object.freeze(english.map(localizeEnglish));
  const specs = nativeSpecs(cpId, locale);
  if (specs.length !== english.length) throw new Error(`${cpId}/${locale}: expected ${english.length} native surfaces, found ${specs.length}`);
  return Object.freeze(english.map((q, index) => localizeNative(q, locale, specs[index])));
}

export const SCI_CHEMISTRY_WAVE1_SUPPORTED_CPS_V1 = Object.freeze(["SCI-CP-011", "SCI-CP-012"] as const);
export const SCI_CHEMISTRY_WAVE1_SUPPORTED_LOCALES_V1 = Object.freeze(["en", "hi", "pa"] as const);
