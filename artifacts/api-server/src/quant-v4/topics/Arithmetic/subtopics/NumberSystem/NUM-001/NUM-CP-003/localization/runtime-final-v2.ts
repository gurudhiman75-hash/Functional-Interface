import type { NumCp003PermanentQlId } from "../permanent/allocation";
import { runNumCp003LocalizedFinalForQl } from "./runtime-final";
import type { NumCp003LocalizedQuestion, NumCp003TranslatedLanguage } from "./types";

function polishVerificationLine(value: string, language: NumCp003TranslatedLanguage): string {
  const divisions = value.match(/\\div/gu)?.length ?? 0;
  if (divisions <= 1) return value;
  if (language === "hi") {
    return value.replace(/पूर्ण हैं/gu, "सभी भाग बिना शेष के हैं");
  }
  return value.replace(/ਪੂਰੇ ਹਨ/gu, "ਸਾਰੇ ਭਾਗ ਬਿਨਾਂ ਬਾਕੀ ਦੇ ਹਨ");
}

export function runNumCp003LocalizedFinalV2ForQl(
  questionLanguageId: NumCp003PermanentQlId,
  seed: string,
  language: NumCp003TranslatedLanguage,
): NumCp003LocalizedQuestion {
  const q = runNumCp003LocalizedFinalForQl(questionLanguageId, seed, language);
  return Object.freeze({
    ...q,
    explanation: Object.freeze({
      ...q.explanation,
      solution: Object.freeze(q.explanation.solution.map((line) => polishVerificationLine(line, language))),
    }),
  });
}
