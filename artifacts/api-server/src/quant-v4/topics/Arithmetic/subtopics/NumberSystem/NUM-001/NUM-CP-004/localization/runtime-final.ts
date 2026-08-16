import type { NumCp004PermanentQlId } from "../permanent/allocation";
import { runNumCp004LocalizedForQl } from "./runtime";
import type { NumCp004LocalizedQuestion, NumCp004TranslatedLanguage } from "./types";

function polish(value: string, language: NumCp004TranslatedLanguage): string {
  if (language === "hi") {
    return value
      .replaceAll("डेटा-पर्याप्तता", "पर्याप्त जानकारी")
      .replaceAll("माता नोड", "ऊपरी नोड");
  }
  return value
    .replaceAll("ਡਾਟਾ-ਪਰਯਾਪਤਾ", "ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ")
    .replaceAll("ਮਾਪੇ ਨੋਡ", "ਉੱਪਰਲਾ ਨੋਡ")
    .replaceAll("ਪਰਯਾਪਤਾ", "ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ");
}

export function runNumCp004LocalizedFinalForQl(
  questionLanguageId: NumCp004PermanentQlId,
  seed: number,
  language: NumCp004TranslatedLanguage,
): NumCp004LocalizedQuestion {
  const q = runNumCp004LocalizedForQl(questionLanguageId, seed, language);
  return Object.freeze({
    ...q,
    stem: polish(q.stem, language),
    explanation: Object.freeze({
      concept: polish(q.explanation.concept, language),
      solution: Object.freeze(q.explanation.solution.map((line) => polish(line, language))),
      finalAnswer: polish(q.explanation.finalAnswer, language),
    }),
  });
}
