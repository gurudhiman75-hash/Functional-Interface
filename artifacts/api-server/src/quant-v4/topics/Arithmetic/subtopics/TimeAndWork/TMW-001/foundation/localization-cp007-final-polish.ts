import type { TmwCp007GeneratedQuestion } from "./cp007-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp007Copy,
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
  if (source.solveMode !== "findMixedCrewCompletionTime") {
    return finalizeTmwCp007Text(stem, language);
  }

  const p = source.parameters;
  const job = cp007Copy(p.context.jobPhrase, language);
  const output = cp007Copy(p.context.outputUnit, language);
  const rates = p.context.categories.map((category) => cp007Number(category.efficiency)).join(", ");
  const unit = rateUnit(language, cp007IsHourly(p));
  if (language === "hi") {
    return `${cp007Group(p, p.crewA, language)} के मिश्रित समूह को ${job} के अंतर्गत कुल ${cp007Number(p.workA)} ${output} का लक्ष्य पूरा करना है। तीनों श्रेणियों की व्यक्तिगत दरें क्रमशः ${rates} ${output} ${unit} हैं। समूह को पूरा काम करने में कितना समय लगेगा?`;
  }
  return `${cp007Group(p, p.crewA, language)} ਦੇ ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਨੂੰ ${job} ਅਧੀਨ ਕੁੱਲ ${cp007Number(p.workA)} ${output} ਦਾ ਟੀਚਾ ਪੂਰਾ ਕਰਨਾ ਹੈ। ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ਕ੍ਰਮਵਾਰ ${rates} ${output} ${unit} ਹੈ। ਸਮੂਹ ਨੂੰ ਪੂਰਾ ਕੰਮ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
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
