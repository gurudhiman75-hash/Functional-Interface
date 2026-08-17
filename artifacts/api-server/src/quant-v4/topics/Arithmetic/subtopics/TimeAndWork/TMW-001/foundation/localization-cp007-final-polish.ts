import type { TmwCp007GeneratedQuestion } from "./cp007-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp007Copy,
  cp007Count,
  cp007Group,
  cp007IsHourly,
  cp007Number,
  cp007Time,
} from "./localization-cp007-language";
import {
  polishTmwCp007ManualConclusion,
  polishTmwCp007ManualGivens,
  polishTmwCp007ManualText,
} from "./localization-cp007-manual-polish";

function rateUnit(language: TmwLocalizedLanguage, hourly: boolean): string {
  if (hourly) return language === "hi" ? "प्रति घंटा" : "ਪ੍ਰਤੀ ਘੰਟਾ";
  return language === "hi" ? "प्रतिदिन" : "ਪ੍ਰਤੀ ਦਿਨ";
}

export function finalizeTmwCp007Text(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  const polished = polishTmwCp007ManualText(text, language);
  if (language === "hi") return polished;
  return polished
    .replace(/ਕਿੰਨੀਆਂ ਵਾਧੂ ([^?।]+ ਲਾਈਨਾਂ) ਚਾਹੀਦੇ ਹਨ/g, "ਕਿੰਨੀਆਂ ਵਾਧੂ $1 ਚਾਹੀਦੀਆਂ ਹਨ")
    .replace(/ਕਿੰਨੀਆਂ ([^?।]+ ਲਾਈਨਾਂ) ਚਾਹੀਦੇ ਹਨ/g, "ਕਿੰਨੀਆਂ $1 ਚਾਹੀਦੀਆਂ ਹਨ");
}

export function finalizeTmwCp007Stem(
  source: TmwCp007GeneratedQuestion,
  stem: string,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const job = cp007Copy(p.context.jobPhrase, language);

  if (source.solveMode === "findMixedCrewCompletionTime") {
    const output = cp007Copy(p.context.outputUnit, language);
    const rates = p.context.categories.map((category) => cp007Number(category.efficiency)).join(", ");
    const unit = rateUnit(language, cp007IsHourly(p));
    const rebuilt = language === "hi"
      ? `मिश्रित समूह में ${cp007Group(p, p.crewA, language)} हैं। उसे ${job} पूरा करना है। कुल लक्ष्य: ${cp007Number(p.workA)} ${output}। तीनों श्रेणियों की व्यक्तिगत दरें क्रमशः ${rates} ${output} ${unit} हैं। समूह को पूरा काम करने में कितना समय लगेगा?`
      : `ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਵਿੱਚ ${cp007Group(p, p.crewA, language)} ਹਨ। ਇਸ ਨੇ ${job} ਪੂਰਾ ਕਰਨਾ ਹੈ। ਕੁੱਲ ਟੀਚਾ: ${cp007Number(p.workA)} ${output}। ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ਕ੍ਰਮਵਾਰ ${rates} ${output} ${unit} ਹੈ। ਸਮੂਹ ਨੂੰ ਪੂਰਾ ਕੰਮ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
    return finalizeTmwCp007Text(rebuilt, language);
  }

  if (source.solveMode === "findEquivalentCategoryCount") {
    const sourceIndex = p.sourceCategoryIndex ?? 0;
    const targetIndex = p.targetCategoryIndex ?? 0;
    const sourceCount = cp007Count(p, sourceIndex, p.crewA[sourceIndex], language);
    const targetPlural = cp007Copy(p.context.categories[targetIndex].plural, language);
    const rebuilt = language === "hi"
      ? `${sourceCount} की कुल क्षमता के बराबर क्षमता केवल ${targetPlural} से प्राप्त करनी है। इसके लिए कितने ${targetPlural} चाहिए?`
      : `${sourceCount} ਦੀ ਕੁੱਲ ਸਮਰੱਥਾ ਦੇ ਬਰਾਬਰ ਸਮਰੱਥਾ ਸਿਰਫ਼ ${targetPlural} ਨਾਲ ਪ੍ਰਾਪਤ ਕਰਨੀ ਹੈ। ਇਸ ਲਈ ਕਿੰਨੇ ${targetPlural} ਚਾਹੀਦੇ ਹਨ?`;
    return finalizeTmwCp007Text(rebuilt, language);
  }

  if (source.solveMode === "findCompletionAfterCategoryReplacement") {
    const efficiencyRatio = p.context.categories.map((category) => cp007Number(category.efficiency)).join(":");
    const rebuilt = language === "hi"
      ? `मूल समूह में ${cp007Group(p, p.crewA, language)} हैं। यह समूह ${job} पूरा करता है। उसकी पूर्णता अवधि ${cp007Time(p, p.daysA, language)} है। अब समूह बदलकर ${cp007Group(p, p.crewB, language)} कर दिया गया है; व्यक्तिगत दक्षताओं का अनुपात ${efficiencyRatio} है। वही काम अब कितने समय में पूरा होगा?`
      : `ਮੂਲ ਸਮੂਹ ਵਿੱਚ ${cp007Group(p, p.crewA, language)} ਹਨ। ਇਹ ਸਮੂਹ ${job} ਪੂਰਾ ਕਰਦਾ ਹੈ। ਕੰਮ ਪੂਰਾ ਕਰਨ ਲਈ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ ${cp007Time(p, p.daysA, language)} ਹੈ। ਹੁਣ ਸਮੂਹ ਬਦਲ ਕੇ ${cp007Group(p, p.crewB, language)} ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ; ਵਿਅਕਤੀਗਤ ਦੱਖਤਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ${efficiencyRatio} ਹੈ। ਉਹੀ ਕੰਮ ਹੁਣ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`;
    return finalizeTmwCp007Text(rebuilt, language);
  }

  return finalizeTmwCp007Text(stem, language);
}

export function finalizeTmwCp007Givens(
  source: TmwCp007GeneratedQuestion,
  givens: string[],
  language: TmwLocalizedLanguage,
): string[] {
  if (source.solveMode !== "findCrewCompositionFromTwoOutputFacts") {
    return polishTmwCp007ManualGivens(source, givens, language)
      .map((line) => finalizeTmwCp007Text(line, language));
  }

  const p = source.parameters;
  const output = cp007Copy(p.context.outputUnit, language);
  if (language === "hi") {
    return [
      `पहला तथ्य: पहली टीम ${cp007Number(p.workA)} ${output} को ${cp007Time(p, p.daysA, language)} में पूरा करती है।`,
      `दूसरा तथ्य: पहली श्रेणी की संख्या दोगुनी; टीम ${cp007Number(p.workB)} ${output} को ${cp007Time(p, p.daysB, language)} में पूरा करती है।`,
    ].map((line) => finalizeTmwCp007Text(line, language));
  }
  return [
    `ਪਹਿਲਾ ਤੱਥ: ਪਹਿਲੀ ਟੀਮ ${cp007Number(p.workA)} ${output} ਨੂੰ ${cp007Time(p, p.daysA, language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦੀ ਹੈ।`,
    `ਦੂਜਾ ਤੱਥ: ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਦੁੱਗਣੀ; ਟੀਮ ${cp007Number(p.workB)} ${output} ਨੂੰ ${cp007Time(p, p.daysB, language)} ਵਿੱਚ ਪੂਰਾ ਕਰਦੀ ਹੈ।`,
  ].map((line) => finalizeTmwCp007Text(line, language));
}

export function finalizeTmwCp007Conclusion(
  source: TmwCp007GeneratedQuestion,
  answerText: string,
  conclusion: string,
  language: TmwLocalizedLanguage,
): string {
  if (source.solution.answerType === "RESOURCE_TIME") {
    return language === "hi"
      ? `अतः संयुक्त योगदान: ${answerText}।`
      : `ਇਸ ਲਈ ਸਾਂਝਾ ਯੋਗਦਾਨ: ${answerText}।`;
  }
  return finalizeTmwCp007Text(
    polishTmwCp007ManualConclusion(source, answerText, conclusion, language),
    language,
  );
}
