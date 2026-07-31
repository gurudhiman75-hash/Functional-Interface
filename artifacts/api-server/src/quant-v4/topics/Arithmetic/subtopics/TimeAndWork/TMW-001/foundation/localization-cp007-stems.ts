import { required } from "./cp001-helpers";
import { reciprocal } from "./rational";
import type { TmwCp007GeneratedQuestion } from "./cp007-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp007Category,
  cp007Copy,
  cp007Count,
  cp007Group,
  cp007IsHourly,
  cp007Number,
  cp007Rate,
  cp007Time,
} from "./localization-cp007-language";

function pair(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function unit(language: TmwLocalizedLanguage, hourly: boolean): string {
  if (hourly) return language === "hi" ? "प्रति घंटा" : "ਪ੍ਰਤੀ ਘੰਟਾ";
  return language === "hi" ? "प्रतिदिन" : "ਪ੍ਰਤੀ ਦਿਨ";
}

function efficiencyList(source: TmwCp007GeneratedQuestion): string {
  return source.parameters.context.categories.map((category) => cp007Number(category.efficiency)).join(":");
}

export function renderTmwCp007LocalizedStem(
  source: TmwCp007GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const c = p.context.categories;
  const job = cp007Copy(p.context.jobPhrase, language);
  const output = cp007Copy(p.context.outputUnit, language);
  const hourly = cp007IsHourly(p);
  const target = p.targetCategoryIndex ?? p.replacementCategoryIndex ?? 0;
  const sourceIndex = p.sourceCategoryIndex ?? 0;

  switch (source.solveMode) {
    case "findTwoCategoryEfficiencyRatio":
      return pair(
        language,
        `${cp007Count(p, 0, p.crewA[0], language)} और ${cp007Count(p, 1, p.crewB[1], language)} समान समय में ${job} का समान भाग पूरा करते हैं। एक ${cp007Category(p, 0, p.crewA[0], language)} और एक ${cp007Category(p, 1, p.crewB[1], language)} की दक्षताओं का अनुपात क्या है?`,
        `${cp007Count(p, 0, p.crewA[0], language)} ਅਤੇ ${cp007Count(p, 1, p.crewB[1], language)} ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ${job} ਦਾ ਇੱਕੋ ਹਿੱਸਾ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਇੱਕ ${cp007Category(p, 0, p.crewA[0], language)} ਅਤੇ ਇੱਕ ${cp007Category(p, 1, p.crewB[1], language)} ਦੀ ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
      );
    case "findThreeCategoryEfficiencyRatio":
      return pair(
        language,
        `उत्पादन अभिलेख बताते हैं कि ${cp007Count(p, 0, c[1].efficiency, language)} की क्षमता ${cp007Count(p, 1, c[0].efficiency, language)} के बराबर है और ${cp007Count(p, 1, c[2].efficiency, language)} की क्षमता ${cp007Count(p, 2, c[1].efficiency, language)} के बराबर है। तीनों श्रेणियों की प्रति-संसाधन दक्षता का अनुपात क्या है?`,
        `ਉਤਪਾਦਨ ਰਿਕਾਰਡ ਦੱਸਦੇ ਹਨ ਕਿ ${cp007Count(p, 0, c[1].efficiency, language)} ਦੀ ਸਮਰੱਥਾ ${cp007Count(p, 1, c[0].efficiency, language)} ਦੇ ਬਰਾਬਰ ਹੈ ਅਤੇ ${cp007Count(p, 1, c[2].efficiency, language)} ਦੀ ਸਮਰੱਥਾ ${cp007Count(p, 2, c[1].efficiency, language)} ਦੇ ਬਰਾਬਰ ਹੈ। ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਪ੍ਰਤੀ-ਸਰੋਤ ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
      );
    case "findMixedCrewCompletionTime":
      return pair(
        language,
        `${cp007Group(p, p.crewA, language)} के मिश्रित समूह को ${cp007Number(p.workA)} ${output} का ${job} पूरा करना है। तीनों श्रेणियों की व्यक्तिगत दरें क्रमशः ${c.map((category) => cp007Number(category.efficiency)).join(", ")} ${output} ${unit(language, hourly)} हैं। समूह को काम पूरा करने में कितना समय लगेगा?`,
        `${cp007Group(p, p.crewA, language)} ਦੇ ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਨੇ ${cp007Number(p.workA)} ${output} ਦਾ ${job} ਪੂਰਾ ਕਰਨਾ ਹੈ। ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ਕ੍ਰਮਵਾਰ ${c.map((category) => cp007Number(category.efficiency)).join(", ")} ${output} ${unit(language, hourly)} ਹੈ। ਸਮੂਹ ਨੂੰ ਕੰਮ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );
    case "findEquivalentCategoryCount":
      return pair(
        language,
        `${cp007Count(p, sourceIndex, p.crewA[sourceIndex], language)} की कुल क्षमता को केवल ${cp007Copy(c[target].plural, language)} से बदलना है। समान कुल क्षमता बनाए रखने के लिए कितने ${cp007Copy(c[target].plural, language)} चाहिए?`,
        `${cp007Count(p, sourceIndex, p.crewA[sourceIndex], language)} ਦੀ ਕੁੱਲ ਸਮਰੱਥਾ ਨੂੰ ਸਿਰਫ਼ ${cp007Copy(c[target].plural, language)} ਨਾਲ ਬਦਲਣਾ ਹੈ। ਇੱਕੋ ਕੁੱਲ ਸਮਰੱਥਾ ਬਣਾਈ ਰੱਖਣ ਲਈ ਕਿੰਨੇ ${cp007Copy(c[target].plural, language)} ਚਾਹੀਦੇ ਹਨ?`,
      );
    case "findUnknownCategoryCountForTargetTime":
      return pair(
        language,
        `${cp007Group(p, p.crewA, language)} पहले से तैनात हैं। ${cp007Number(p.workA)} ${output} का काम ${cp007Time(p, p.daysA, language)} में पूरा करने के लिए प्रत्येक श्रेणी की दर क्रमशः ${c.map((category) => cp007Number(category.efficiency)).join(", ")} ${output} ${unit(language, hourly)} है। कितने अतिरिक्त ${cp007Copy(c[target].plural, language)} चाहिए?`,
        `${cp007Group(p, p.crewA, language)} ਪਹਿਲਾਂ ਹੀ ਲਗੇ ਹੋਏ ਹਨ। ${cp007Number(p.workA)} ${output} ਦਾ ਕੰਮ ${cp007Time(p, p.daysA, language)} ਵਿੱਚ ਪੂਰਾ ਕਰਨ ਲਈ ਹਰ ਸ਼੍ਰੇਣੀ ਦੀ ਦਰ ਕ੍ਰਮਵਾਰ ${c.map((category) => cp007Number(category.efficiency)).join(", ")} ${output} ${unit(language, hourly)} ਹੈ। ਕਿੰਨੇ ਵਾਧੂ ${cp007Copy(c[target].plural, language)} ਚਾਹੀਦੇ ਹਨ?`,
      );
    case "findCrewCompositionFromTwoOutputFacts":
      return pair(
        language,
        `पहले समूह में कुछ ${cp007Copy(c[0].plural, language)} और कुछ ${cp007Copy(c[1].plural, language)} मिलकर ${cp007Number(p.workA)} ${output} को ${cp007Time(p, p.daysA, language)} में पूरा करते हैं। दूसरे परीक्षण में पहली श्रेणी की संख्या दोगुनी और दूसरी श्रेणी की संख्या समान रहती है; तब ${cp007Number(p.workB)} ${output} ${cp007Time(p, p.daysB, language)} में पूरे होते हैं। पहली टीम में दोनों श्रेणियों की संख्या ज्ञात करें।`,
        `ਪਹਿਲੇ ਸਮੂਹ ਵਿੱਚ ਕੁਝ ${cp007Copy(c[0].plural, language)} ਅਤੇ ਕੁਝ ${cp007Copy(c[1].plural, language)} ਮਿਲ ਕੇ ${cp007Number(p.workA)} ${output} ਨੂੰ ${cp007Time(p, p.daysA, language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਦੂਜੇ ਪ੍ਰਯੋਗ ਵਿੱਚ ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਦੁੱਗਣੀ ਅਤੇ ਦੂਜੀ ਦੀ ਗਿਣਤੀ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ; ਤਦ ${cp007Number(p.workB)} ${output} ${cp007Time(p, p.daysB, language)} ਵਿੱਚ ਪੂਰੇ ਹੁੰਦੇ ਹਨ। ਪਹਿਲੀ ਟੀਮ ਵਿੱਚ ਦੋਵਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`,
      );
    case "findCategoryRateFromWeightedCrewFacts": {
      const groups = required(p.pairwiseCrews, "pairwiseCrews");
      const rates = required(p.pairwiseRates, "pairwiseRates");
      return pair(
        language,
        `तीन उत्पादन अभिलेख हैं: ${cp007Group(p, groups[0], language)} की संयुक्त दर ${cp007Rate(p, rates[0], language)}, ${cp007Group(p, groups[1], language)} की दर ${cp007Rate(p, rates[1], language)} और ${cp007Group(p, groups[2], language)} की दर ${cp007Rate(p, rates[2], language)} है। एक ${cp007Copy(c[target].singular, language)} की दर क्या है?`,
        `ਤਿੰਨ ਉਤਪਾਦਨ ਰਿਕਾਰਡ ਹਨ: ${cp007Group(p, groups[0], language)} ਦੀ ਸਾਂਝੀ ਦਰ ${cp007Rate(p, rates[0], language)}, ${cp007Group(p, groups[1], language)} ਦੀ ਦਰ ${cp007Rate(p, rates[1], language)} ਅਤੇ ${cp007Group(p, groups[2], language)} ਦੀ ਦਰ ${cp007Rate(p, rates[2], language)} ਹੈ। ਇੱਕ ${cp007Copy(c[target].singular, language)} ਦੀ ਦਰ ਕੀ ਹੈ?`,
      );
    }
    case "findHeterogeneousGroupRate":
      return pair(
        language,
        `${cp007Group(p, p.crewA, language)} एक साथ काम करते हैं। तीनों श्रेणियों की व्यक्तिगत दरें क्रमशः ${c.map((category) => cp007Number(category.efficiency)).join(", ")} ${output} ${unit(language, hourly)} हैं। समूह की संयुक्त दर क्या है?`,
        `${cp007Group(p, p.crewA, language)} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ਕ੍ਰਮਵਾਰ ${c.map((category) => cp007Number(category.efficiency)).join(", ")} ${output} ${unit(language, hourly)} ਹੈ। ਸਮੂਹ ਦੀ ਸਾਂਝੀ ਦਰ ਕੀ ਹੈ?`,
      );
    case "findCompletionAfterCategoryReplacement":
      return pair(
        language,
        `${cp007Group(p, p.crewA, language)} का मूल समूह ${job} को ${cp007Time(p, p.daysA, language)} में पूरा करता है। समूह को बदलकर ${cp007Group(p, p.crewB, language)} कर दिया जाता है और व्यक्तिगत दक्षताओं का अनुपात ${efficiencyList(source)} है। वही काम अब कितने समय में पूरा होगा?`,
        `${cp007Group(p, p.crewA, language)} ਦਾ ਮੂਲ ਸਮੂਹ ${job} ਨੂੰ ${cp007Time(p, p.daysA, language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਸਮੂਹ ਨੂੰ ਬਦਲ ਕੇ ${cp007Group(p, p.crewB, language)} ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਵਿਅਕਤੀਗਤ ਦੱਖਤਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ${efficiencyList(source)} ਹੈ। ਉਹੀ ਕੰਮ ਹੁਣ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    case "findMixedCrewOutput":
      return pair(
        language,
        `${cp007Group(p, p.crewA, language)} ${cp007Time(p, p.daysA, language)} तक एक साथ काम करते हैं। उनकी व्यक्तिगत दरें क्रमशः ${c.map((category) => cp007Number(category.efficiency)).join(", ")} ${output} ${unit(language, hourly)} हैं। कुल उत्पादन कितना होगा?`,
        `${cp007Group(p, p.crewA, language)} ${cp007Time(p, p.daysA, language)} ਤੱਕ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ਕ੍ਰਮਵਾਰ ${c.map((category) => cp007Number(category.efficiency)).join(", ")} ${output} ${unit(language, hourly)} ਹੈ। ਕੁੱਲ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findEquivalentStandardResourceTime":
      return pair(
        language,
        `${cp007Group(p, p.crewA, language)} ${cp007Time(p, p.daysA, language)} तक काम करते हैं। एक ${cp007Copy(c[target].singular, language)} को मानक मानते हुए इस संयुक्त योगदान को समतुल्य ${cp007Copy(c[target].resourceTimeUnit, language)} में व्यक्त करें।`,
        `${cp007Group(p, p.crewA, language)} ${cp007Time(p, p.daysA, language)} ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ। ਇੱਕ ${cp007Copy(c[target].singular, language)} ਨੂੰ ਮਿਆਰ ਮੰਨਦੇ ਹੋਏ ਇਸ ਸਾਂਝੇ ਯੋਗਦਾਨ ਨੂੰ ਬਰਾਬਰ ${cp007Copy(c[target].resourceTimeUnit, language)} ਵਿੱਚ ਦਰਸਾਓ।`,
      );
    case "findMinimumIntegerCrewComposition":
      return pair(
        language,
        `कम-से-कम एक ${cp007Copy(c[0].singular, language)} और एक ${cp007Copy(c[1].singular, language)} लेकर ठीक ${cp007Rate(p, required(p.targetCrewRate, "targetCrewRate"), language)} की संयुक्त क्षमता चाहिए। दोनों की व्यक्तिगत दक्षताएँ ${cp007Number(c[0].efficiency)} और ${cp007Number(c[1].efficiency)} हैं। सबसे छोटी धनात्मक पूर्णांक संरचना क्या है?`,
        `ਘੱਟੋ-ਘੱਟ ਇੱਕ ${cp007Copy(c[0].singular, language)} ਅਤੇ ਇੱਕ ${cp007Copy(c[1].singular, language)} ਲੈ ਕੇ ਠੀਕ ${cp007Rate(p, required(p.targetCrewRate, "targetCrewRate"), language)} ਦੀ ਸਾਂਝੀ ਸਮਰੱਥਾ ਚਾਹੀਦੀ ਹੈ। ਦੋਵਾਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦੱਖਤਾ ${cp007Number(c[0].efficiency)} ਅਤੇ ${cp007Number(c[1].efficiency)} ਹੈ। ਸਭ ਤੋਂ ਛੋਟੀ ਧਨਾਤਮਕ ਪੂਰਨ-ਅੰਕ ਬਣਤਰ ਕੀ ਹੈ?`,
      );
    case "findUnknownCategorySoloTime":
      return pair(
        language,
        `${cp007Group(p, p.crewA, language)} मिलकर ${job} को ${cp007Time(p, p.daysA, language)} में पूरा करते हैं। एक ${cp007Copy(c[0].singular, language)} अकेले वही काम ${cp007Time(p, reciprocal(c[0].efficiency), language)} में करता है। एक ${cp007Copy(c[target].singular, language)} अकेले कितना समय लेगा?`,
        `${cp007Group(p, p.crewA, language)} ਮਿਲ ਕੇ ${job} ਨੂੰ ${cp007Time(p, p.daysA, language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਇੱਕ ${cp007Copy(c[0].singular, language)} ਇਕੱਲਾ ਉਹੀ ਕੰਮ ${cp007Time(p, reciprocal(c[0].efficiency), language)} ਵਿੱਚ ਕਰਦਾ ਹੈ। ਇੱਕ ${cp007Copy(c[target].singular, language)} ਇਕੱਲਾ ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗਾ?`,
      );
    case "findCategoryContributionFraction":
      return pair(
        language,
        `${cp007Group(p, p.crewA, language)} ${job} पर एक साथ काम करते हैं। तीनों श्रेणियों की व्यक्तिगत दक्षताओं का अनुपात ${efficiencyList(source)} है। ${cp007Copy(c[target].plural, language)} कुल काम का कितना भाग करते हैं?`,
        `${cp007Group(p, p.crewA, language)} ${job} ਉੱਤੇ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ ${efficiencyList(source)} ਹੈ। ${cp007Copy(c[target].plural, language)} ਕੁੱਲ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਕਰਦੇ ਹਨ?`,
      );
    case "compareTwoHeterogeneousCrews":
      return pair(
        language,
        `समूह A में ${cp007Group(p, p.crewA, language)} हैं और समूह B में ${cp007Group(p, p.crewB, language)} हैं। तीनों श्रेणियों की व्यक्तिगत दक्षताओं का अनुपात ${efficiencyList(source)} है। समूह A और समूह B की कार्य-दरों का अनुपात क्या है?`,
        `ਸਮੂਹ A ਵਿੱਚ ${cp007Group(p, p.crewA, language)} ਹਨ ਅਤੇ ਸਮੂਹ B ਵਿੱਚ ${cp007Group(p, p.crewB, language)} ਹਨ। ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦੱਖਤਾ ਦਾ ਅਨੁਪਾਤ ${efficiencyList(source)} ਹੈ। ਸਮੂਹ A ਅਤੇ ਸਮੂਹ B ਦੀ ਕੰਮ-ਦਰ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
      );
    case "findIntegerCrewCompositionUnderConstraints":
      return pair(
        language,
        `एक समूह में कुल ${cp007Number(required(p.totalCrewCount, "totalCrewCount"))} सदस्य हैं, जो केवल ${cp007Copy(c[0].plural, language)} और ${cp007Copy(c[1].plural, language)} हैं। उनकी व्यक्तिगत दरें ${cp007Number(c[0].efficiency)} और ${cp007Number(c[1].efficiency)} ${output} ${unit(language, hourly)} हैं तथा समूह की संयुक्त दर ${cp007Rate(p, required(p.targetCrewRate, "targetCrewRate"), language)} है। प्रत्येक श्रेणी में कितने सदस्य हैं?`,
        `ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਕੁੱਲ ${cp007Number(required(p.totalCrewCount, "totalCrewCount"))} ਮੈਂਬਰ ਹਨ, ਜੋ ਸਿਰਫ਼ ${cp007Copy(c[0].plural, language)} ਅਤੇ ${cp007Copy(c[1].plural, language)} ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ${cp007Number(c[0].efficiency)} ਅਤੇ ${cp007Number(c[1].efficiency)} ${output} ${unit(language, hourly)} ਹੈ ਅਤੇ ਸਮੂਹ ਦੀ ਸਾਂਝੀ ਦਰ ${cp007Rate(p, required(p.targetCrewRate, "targetCrewRate"), language)} ਹੈ। ਹਰ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਕਿੰਨੇ ਮੈਂਬਰ ਹਨ?`,
      );
  }
}
