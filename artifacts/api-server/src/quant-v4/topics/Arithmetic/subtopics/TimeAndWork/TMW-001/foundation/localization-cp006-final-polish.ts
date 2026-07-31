import { required } from "./cp001-helpers";
import { rational, subtract, toLatex } from "./rational";
import type { TmwCp006GeneratedQuestion } from "./cp006-types";
import { cp006Days, cp006Number, cp006Resource } from "./localization-cp006-language";
import {
  polishTmwCp006ManualConclusion,
  polishTmwCp006ManualGivens,
  polishTmwCp006ManualOpening,
  polishTmwCp006ManualText,
  polishTmwCp006ManualTrap,
} from "./localization-cp006-manual-polish";
import type { TmwLocalizedLanguage } from "./localization-types";

function inline(latex: string): string {
  return `\\(${latex}\\)`;
}

export function finalizeTmwCp006Text(
  text: string,
  language: TmwLocalizedLanguage,
): string {
  const polished = polishTmwCp006ManualText(text, language);
  if (language === "hi") {
    return polished
      .replace(/प्रति-(बोतल भरने वाली लाइन|प्रिंटिंग मशीन|मशीन|असेंबली इकाई) प्रति-पाली उत्पादन समान रहे/g, "प्रत्येक $1 का प्रति-पाली उत्पादन समान रहे")
      .replace(/प्रत्येक बोतल भरने वाली लाइन([^।?\n]*) बनाता है/g, "प्रत्येक बोतल भरने वाली लाइन$1 बनाती है")
      .replace(/आयाम वाले ईंटों की दीवार/g, "आयाम वाली ईंटों की दीवार")
      .replace(/आयाम वाले सड़क की सतह/g, "आयाम वाली सड़क की सतह")
      .replace(/समान घंटे और दक्षता पर/g, "प्रतिदिन समान घंटे और समान दक्षता पर")
      .replace(/इसके बराबर कुल ([^?।]+) कितना है\?/g, "इसके बराबर कुल $1 कितने हैं?")
      .replace(/((?:[2-9]|\d{2,}) (?:श्रमिक|क्लर्क|पैकिंग कर्मी|पेंटर|निरीक्षक)) है(?!ं)/g, "$1 हैं");
  }

  return polished
    .replace(/ਪ੍ਰਤੀ-(ਬੋਤਲ ਭਰਨ ਵਾਲੀ ਲਾਈਨ|ਪ੍ਰਿੰਟਿੰਗ ਮਸ਼ੀਨ|ਮਸ਼ੀਨ|ਅਸੈਂਬਲੀ ਇਕਾਈ) ਪ੍ਰਤੀ-ਸ਼ਿਫ਼ਟ ਉਤਪਾਦਨ ਇੱਕੋ ਰਹੇ/g, "ਹਰ $1 ਦਾ ਪ੍ਰਤੀ-ਸ਼ਿਫ਼ਟ ਉਤਪਾਦਨ ਇੱਕੋ ਰਹੇ")
    .replace(/ਮਾਪ ਵਾਲੇ ਇੱਟਾਂ ਦੀ ਕੰਧ/g, "ਮਾਪ ਵਾਲੀ ਇੱਟਾਂ ਦੀ ਕੰਧ")
    .replace(/ਮਾਪ ਵਾਲੇ ਸੜਕ ਦੀ ਸਤਹ/g, "ਮਾਪ ਵਾਲੀ ਸੜਕ ਦੀ ਸਤਹ")
    .replace(/ਇੱਕੋ ਘੰਟਿਆਂ ਅਤੇ ਦੱਖਤਾ ਉੱਤੇ/g, "ਹਰ ਦਿਨ ਇੱਕੋ ਘੰਟੇ ਅਤੇ ਇੱਕੋ ਦੱਖਤਾ ਉੱਤੇ")
    .replace(/(\d+ (?:ਮਜ਼ਦੂਰਾਂ|ਕਲਰਕਾਂ|ਪੈਕਿੰਗ ਕਰਮਚਾਰੀਆਂ|ਪੇਂਟਰਾਂ|ਜਾਂਚ ਕਰਮਚਾਰੀਆਂ)) ਨੇ ([^।]+ ਪੂਰਾ ਕਰਨਾ (?:ਸੀ|ਹੈ))/g, "$1 ਨੂੰ $2")
    .replace(/ਇਸ ਦੇ ਬਰਾਬਰ ਕੁੱਲ ([^?।]+) ਕਿੰਨਾ ਹੈ\?/g, "ਇਸ ਦੇ ਬਰਾਬਰ ਕੁੱਲ $1 ਕਿੰਨੇ ਹਨ?")
    .replace(/((?:[2-9]|\d{2,}) (?:ਮਜ਼ਦੂਰ|ਕਲਰਕ|ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ|ਪੇਂਟਰ|ਜਾਂਚ ਕਰਮਚਾਰੀ)) ਹੈ/g, "$1 ਹਨ")
    .replace(/ਫਿਰ ਸਰੋਤ ਅਤੇ ਸਮੇਂ ਦਾ ਸਮਾਯੋਜਨ ਕਰੋ/g, "ਫਿਰ ਸਰੋਤ ਅਤੇ ਸਮਾਂ ਉਸੇ ਅਨੁਸਾਰ ਬਦਲੋ");
}

export function finalizeTmwCp006Opening(
  source: TmwCp006GeneratedQuestion,
  opening: string,
  language: TmwLocalizedLanguage,
): string {
  return finalizeTmwCp006Text(
    polishTmwCp006ManualOpening(source, opening, language),
    language,
  );
}

export function finalizeTmwCp006Givens(
  source: TmwCp006GeneratedQuestion,
  givens: string[],
  language: TmwLocalizedLanguage,
): string[] {
  const p = source.parameters;
  if (source.solveMode === "findRemainingDaysFromActualProgress") {
    const elapsed = required(p.elapsedDays, "elapsedDays");
    const done = required(p.completedFraction, "completedFraction");
    const remaining = subtract(rational(1), done);
    return language === "hi"
      ? [
          `बीता समय: ${cp006Days(elapsed, language)}।`,
          `पूरा काम: ${inline(`W_{done}=${toLatex(done)}`)}; शेष काम: ${inline(`1-W_{done}=${toLatex(remaining)}`)}।`,
        ]
      : [
          `ਬੀਤਿਆ ਸਮਾਂ: ${cp006Days(elapsed, language)}।`,
          `ਪੂਰਾ ਕੰਮ: ${inline(`W_{done}=${toLatex(done)}`)}; ਬਾਕੀ ਕੰਮ: ${inline(`1-W_{done}=${toLatex(remaining)}`)}।`,
        ];
  }
  if (source.solveMode === "findExtraWorkersFromPlannedVsActualProgress") {
    const elapsed = required(p.elapsedDays, "elapsedDays");
    const done = required(p.completedFraction, "completedFraction");
    const daysLeft = subtract(p.stateA.days, elapsed);
    return language === "hi"
      ? [
          `मूल योजना: ${cp006Resource(p, p.stateA.resources, language)}, ${cp006Days(p.stateA.days, language)}।`,
          `वास्तविक प्रगति: ${cp006Days(elapsed, language)} में ${cp006Number(done)} भाग; शेष समय ${cp006Days(daysLeft, language)}।`,
        ].map((line) => finalizeTmwCp006Text(line, language))
      : [
          `ਮੂਲ ਯੋਜਨਾ: ${cp006Resource(p, p.stateA.resources, language)}, ${cp006Days(p.stateA.days, language)}।`,
          `ਅਸਲ ਤਰੱਕੀ: ${cp006Days(elapsed, language)} ਵਿੱਚ ${cp006Number(done)} ਹਿੱਸਾ; ਬਾਕੀ ਸਮਾਂ ${cp006Days(daysLeft, language)}।`,
        ].map((line) => finalizeTmwCp006Text(line, language));
  }
  return polishTmwCp006ManualGivens(source, givens, language)
    .map((line) => finalizeTmwCp006Text(line, language));
}

export function finalizeTmwCp006Trap(
  source: TmwCp006GeneratedQuestion,
  trap: string,
  language: TmwLocalizedLanguage,
): string {
  return finalizeTmwCp006Text(
    polishTmwCp006ManualTrap(source, trap, language),
    language,
  );
}

export function finalizeTmwCp006Conclusion(
  source: TmwCp006GeneratedQuestion,
  answerText: string,
  conclusion: string,
  language: TmwLocalizedLanguage,
): string {
  return finalizeTmwCp006Text(
    polishTmwCp006ManualConclusion(source, answerText, conclusion, language),
    language,
  );
}
