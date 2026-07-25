import { ANA_CP001_QLS } from "../ANA-CP-001/question-language.en";
import { ANA_CP002_QLS } from "../ANA-CP-002/question-language.en";
import { ANA_LOCALIZED_FACTS, localizedFactsFor } from "./index";
import { localizedQuestionText } from "./question-text";
import type { AnalogyLocale, LocalizedAnalogyFact } from "./types";

type SupportedLocale = Exclude<AnalogyLocale, "en-IN">;
type OptionValue = string | readonly [string, string];

export interface GeneratedLocalizedAnalogy {
  locale: SupportedLocale;
  qlId: string;
  ruleId: string;
  presentationMode: "MISSING_FOURTH_TERM" | "EQUIVALENT_PAIR_SELECTION";
  stem: string;
  sourceA: string;
  sourceB: string;
  targetA: string;
  targetB: string;
  options: readonly { value: OptionValue; errorLabel: string | null }[];
  correctIndex: number;
  explanation: {
    ruleStatement: string;
    sourceDemonstration: string;
    targetApplication: string;
    conclusion: string;
    closestTrapRejection: string;
  };
}

const RULE_TEXT: Record<SupportedLocale, Record<string, string>> = {
  "hi-IN": {
    SEM_COUNTRY_CAPITAL: "दूसरा पद पहले देश की राजधानी है।", SEM_STATE_CAPITAL: "दूसरा पद पहले राज्य की राजधानी है।", SEM_COUNTRY_CURRENCY: "दूसरा पद पहले देश की मुद्रा है।",
    SEM_ANIMAL_YOUNG: "दूसरा पद पहले पशु के बच्चे का नाम है।", SEM_MALE_FEMALE: "दूसरा पद पहले नर पशु का मादा रूप है।", SEM_ANIMAL_SOUND: "दूसरा पद पहले पशु की विशिष्ट ध्वनि है।",
    SEM_ANIMAL_MOVEMENT: "दूसरा पद पहले पशु की विशिष्ट गति है।", SEM_WORKER_WORKPLACE: "दूसरा पद पहले व्यक्ति का सामान्य कार्यस्थल है।", SEM_WORKER_TOOL: "दूसरा पद पहले कर्मी का प्रमुख औज़ार है।",
    SEM_WORKER_PRODUCT: "दूसरा पद पहले उत्पादक की बनाई वस्तु है।", SEM_INSTRUMENT_MEASUREMENT: "दूसरा पद वह मात्रा है जिसे पहला उपकरण मापता है।", SEM_QUANTITY_UNIT: "दूसरा पद पहली भौतिक मात्रा की एसआई इकाई है।",
    SEM_OBJECT_FUNCTION: "दूसरा पद पहली वस्तु का मुख्य कार्य है।", SEM_PART_WHOLE: "पहला पद दूसरे का भाग है।", SEM_MEMBER_CLASS: "पहला पद दूसरे वर्ग का सदस्य है।",
    SEM_INDIVIDUAL_GROUP: "दूसरा पद वह समूह है जिसमें पहला व्यक्ति शामिल होता है।", SEM_PRODUCT_MATERIAL: "दूसरा पद पहले उत्पाद की मुख्य सामग्री है।", SEM_PLACE_PURPOSE: "दूसरा पद पहले स्थान का मुख्य उद्देश्य है।",
    LEX_SYNONYM: "दोनों शब्द समानार्थी हैं।", LEX_ANTONYM: "दोनों शब्द विलोम हैं।", LEX_INTENSITY_UP: "दूसरा शब्द पहले से अधिक तीव्र है।", LEX_INTENSITY_DOWN: "दूसरा शब्द पहले से कम तीव्र है।",
    LEX_CAUSE_EFFECT: "पहला कारण और दूसरा उसका प्रभाव है।", LEX_EFFECT_CAUSE: "पहला प्रभाव और दूसरा उसका कारण है।", LEX_CONDITION_SYMPTOM: "दूसरा पद पहली स्थिति का सामान्य लक्षण है।",
    LEX_ACTION_RESULT: "दूसरा पद पहली क्रिया का सामान्य परिणाम है।", LEX_OBJECT_CHARACTERISTIC: "दूसरा पद पहली वस्तु की प्रमुख विशेषता है।", LEX_WORD_DEFINITION: "दूसरा पद पहले शब्द की परिभाषा है।",
    LEX_DEFICIENCY_MISSING_QUALITY: "पहला पद दूसरे गुण के अभाव को दर्शाता है।", LEX_STUDY_SUBJECT: "पहला विषय दूसरे का अध्ययन करता है।",
  },
  "pa-IN": {
    SEM_COUNTRY_CAPITAL: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਦੇਸ਼ ਦੀ ਰਾਜਧਾਨੀ ਹੈ।", SEM_STATE_CAPITAL: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਰਾਜ ਦੀ ਰਾਜਧਾਨੀ ਹੈ।", SEM_COUNTRY_CURRENCY: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਦੇਸ਼ ਦੀ ਮੁਦਰਾ ਹੈ।",
    SEM_ANIMAL_YOUNG: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਜਾਨਵਰ ਦੇ ਬੱਚੇ ਦਾ ਨਾਮ ਹੈ।", SEM_MALE_FEMALE: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਨਰ ਜਾਨਵਰ ਦਾ ਮਾਦਾ ਰੂਪ ਹੈ।", SEM_ANIMAL_SOUND: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਜਾਨਵਰ ਦੀ ਵਿਸ਼ੇਸ਼ ਆਵਾਜ਼ ਹੈ।",
    SEM_ANIMAL_MOVEMENT: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਜਾਨਵਰ ਦੀ ਵਿਸ਼ੇਸ਼ ਚਾਲ ਹੈ।", SEM_WORKER_WORKPLACE: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਵਿਅਕਤੀ ਦਾ ਆਮ ਕਾਰਜਸਥਾਨ ਹੈ।", SEM_WORKER_TOOL: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਕਾਰੀਗਰ ਦਾ ਮੁੱਖ ਸੰਦ ਹੈ।",
    SEM_WORKER_PRODUCT: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਉਤਪਾਦਕ ਵੱਲੋਂ ਬਣਾਈ ਵਸਤੂ ਹੈ।", SEM_INSTRUMENT_MEASUREMENT: "ਦੂਜਾ ਪਦ ਉਹ ਮਾਤਰਾ ਹੈ ਜਿਸਨੂੰ ਪਹਿਲਾ ਯੰਤਰ ਮਾਪਦਾ ਹੈ।", SEM_QUANTITY_UNIT: "ਦੂਜਾ ਪਦ ਪਹਿਲੀ ਭੌਤਿਕ ਮਾਤਰਾ ਦੀ ਐਸਆਈ ਇਕਾਈ ਹੈ।",
    SEM_OBJECT_FUNCTION: "ਦੂਜਾ ਪਦ ਪਹਿਲੀ ਵਸਤੂ ਦਾ ਮੁੱਖ ਕੰਮ ਹੈ।", SEM_PART_WHOLE: "ਪਹਿਲਾ ਪਦ ਦੂਜੇ ਦਾ ਹਿੱਸਾ ਹੈ।", SEM_MEMBER_CLASS: "ਪਹਿਲਾ ਪਦ ਦੂਜੇ ਵਰਗ ਦਾ ਮੈਂਬਰ ਹੈ।",
    SEM_INDIVIDUAL_GROUP: "ਦੂਜਾ ਪਦ ਉਹ ਸਮੂਹ ਹੈ ਜਿਸ ਵਿੱਚ ਪਹਿਲਾ ਵਿਅਕਤੀ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ।", SEM_PRODUCT_MATERIAL: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਉਤਪਾਦ ਦੀ ਮੁੱਖ ਸਮੱਗਰੀ ਹੈ।", SEM_PLACE_PURPOSE: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਸਥਾਨ ਦਾ ਮੁੱਖ ਉਦੇਸ਼ ਹੈ।",
    LEX_SYNONYM: "ਦੋਵੇਂ ਸ਼ਬਦ ਸਮਾਨਾਰਥਕ ਹਨ।", LEX_ANTONYM: "ਦੋਵੇਂ ਸ਼ਬਦ ਵਿਰੋਧੀ ਹਨ।", LEX_INTENSITY_UP: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਨਾਲੋਂ ਵੱਧ ਤੀਬਰ ਹੈ।", LEX_INTENSITY_DOWN: "ਦੂਜਾ ਸ਼ਬਦ ਪਹਿਲੇ ਨਾਲੋਂ ਘੱਟ ਤੀਬਰ ਹੈ।",
    LEX_CAUSE_EFFECT: "ਪਹਿਲਾ ਕਾਰਨ ਅਤੇ ਦੂਜਾ ਉਸਦਾ ਪ੍ਰਭਾਵ ਹੈ।", LEX_EFFECT_CAUSE: "ਪਹਿਲਾ ਪ੍ਰਭਾਵ ਅਤੇ ਦੂਜਾ ਉਸਦਾ ਕਾਰਨ ਹੈ।", LEX_CONDITION_SYMPTOM: "ਦੂਜਾ ਪਦ ਪਹਿਲੀ ਹਾਲਤ ਦਾ ਆਮ ਲੱਛਣ ਹੈ।",
    LEX_ACTION_RESULT: "ਦੂਜਾ ਪਦ ਪਹਿਲੀ ਕਿਰਿਆ ਦਾ ਆਮ ਨਤੀਜਾ ਹੈ।", LEX_OBJECT_CHARACTERISTIC: "ਦੂਜਾ ਪਦ ਪਹਿਲੀ ਵਸਤੂ ਦੀ ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾ ਹੈ।", LEX_WORD_DEFINITION: "ਦੂਜਾ ਪਦ ਪਹਿਲੇ ਸ਼ਬਦ ਦੀ ਪਰਿਭਾਸ਼ਾ ਹੈ।",
    LEX_DEFICIENCY_MISSING_QUALITY: "ਪਹਿਲਾ ਪਦ ਦੂਜੇ ਗੁਣ ਦੀ ਘਾਟ ਦਰਸਾਉਂਦਾ ਹੈ।", LEX_STUDY_SUBJECT: "ਪਹਿਲਾ ਵਿਸ਼ਾ ਦੂਜੇ ਦਾ ਅਧਿਐਨ ਕਰਦਾ ਹੈ।",
  },
};

function randomSource(seed: number): () => number {
  let state = (seed ^ 0x517cc1b7) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  const random = randomSource(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function canonical(value: OptionValue, locale: SupportedLocale): string {
  return Array.isArray(value)
    ? value.map((part) => part.trim().toLocaleLowerCase(locale)).join("::")
    : value.trim().toLocaleLowerCase(locale);
}

function qlById(qlId: string) {
  const ql = [...ANA_CP001_QLS, ...ANA_CP002_QLS].find((entry) => entry.qlId === qlId);
  if (!ql) throw new Error(`Unknown ANA localized QL: ${qlId}`);
  return ql;
}

function selectFacts(facts: readonly LocalizedAnalogyFact[], seed: number): [LocalizedAnalogyFact, LocalizedAnalogyFact] {
  if (facts.length < 4) throw new Error("Localized relation requires at least four curated facts.");
  const selected = shuffle(facts, seed * 31 + 7);
  return [selected[0], selected[1]];
}

export function generateLocalizedAnalogy(qlId: string, locale: SupportedLocale, seed = 0): GeneratedLocalizedAnalogy {
  const ql = qlById(qlId);
  const facts = localizedFactsFor(locale, ql.ruleId);
  const [source, target] = selectFacts(facts, seed);
  const text = localizedQuestionText(locale);
  let options: { value: OptionValue; errorLabel: string | null }[];

  if (ql.presentationMode === "MISSING_FOURTH_TERM") {
    const distractors = shuffle(facts.filter((fact) => fact.id !== target.id && canonical(fact.right, locale) !== canonical(target.right, locale)), seed * 37 + 11).slice(0, 3);
    if (distractors.length !== 3) throw new Error(`${ql.ruleId} lacks three localized distractors.`);
    options = shuffle([{ value: target.right, errorLabel: null }, ...distractors.map((fact) => ({ value: fact.right, errorLabel: "SAME_CATEGORY_WRONG_TARGET" }))], seed * 41 + 13);
  } else {
    const validPairs = new Set(facts.map((fact) => canonical([fact.left, fact.right], locale)));
    const distractors: { value: readonly [string, string]; errorLabel: string }[] = [];
    const used = new Set<string>();
    for (const left of shuffle(facts.filter((fact) => fact.id !== target.id), seed * 43 + 17)) {
      for (const right of shuffle(facts.filter((fact) => fact.id !== target.id), seed * 47 + 19)) {
        const value = [left.left, right.right] as const;
        const key = canonical(value, locale);
        if (validPairs.has(key) || used.has(key)) continue;
        used.add(key);
        distractors.push({ value, errorLabel: "MISMATCHED_LOCALIZED_PAIR" });
        if (distractors.length === 3) break;
      }
      if (distractors.length === 3) break;
    }
    if (distractors.length !== 3) throw new Error(`${ql.ruleId} lacks three localized pair distractors.`);
    options = shuffle([{ value: [target.left, target.right] as const, errorLabel: null }, ...distractors], seed * 53 + 23);
  }

  if (new Set(options.map((option) => canonical(option.value, locale))).size !== 4) throw new Error("Duplicate localized options.");
  const correctIndex = options.findIndex((option) => option.errorLabel === null);
  if (correctIndex < 0 || options.filter((option) => option.errorLabel === null).length !== 1) throw new Error("Localized question must have exactly one answer.");

  const replace = (template: string) => template
    .replace("{sourceA}", source.left).replace("{sourceB}", source.right).replace("{targetA}", target.left);
  const stem = ql.presentationMode === "MISSING_FOURTH_TERM" ? replace(text.missingTermStem) : replace(text.equivalentPairStem);
  const conclusion = ql.presentationMode === "MISSING_FOURTH_TERM"
    ? `${text.correctAnswerLead}: ${target.right}।`
    : `${text.correctAnswerLead}: ${target.left} : ${target.right}।`;

  return {
    locale, qlId, ruleId: ql.ruleId, presentationMode: ql.presentationMode, stem,
    sourceA: source.left, sourceB: source.right, targetA: target.left, targetB: target.right,
    options, correctIndex,
    explanation: {
      ruleStatement: RULE_TEXT[locale][ql.ruleId],
      sourceDemonstration: source.predicate,
      targetApplication: target.predicate,
      conclusion,
      closestTrapRejection: locale === "hi-IN"
        ? "अन्य विकल्प सही प्रकार के हैं, पर लक्ष्य पद के साथ ठीक वही संबंध नहीं बनाते।"
        : "ਹੋਰ ਵਿਕਲਪ ਸਹੀ ਕਿਸਮ ਦੇ ਹਨ, ਪਰ ਦਿੱਤੇ ਹੋਏ ਪਦ ਨਾਲ ਬਿਲਕੁਲ ਉਹੀ ਸੰਬੰਧ ਨਹੀਂ ਬਣਾਉਂਦੇ।",
    },
  };
}

export const ANA_LOCALIZED_RUNTIME_FACT_COUNT = ANA_LOCALIZED_FACTS.length;
