import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import type { ProbabilityQuestion } from "./types";
import { renderNativeFinalStem } from "./native-final-stem-renderer";

function numericTokens(value: string): Set<string> {
  return new Set(value.match(/\d+(?:\.\d+)?/gu) ?? []);
}

function assertNoKnownGrammarDrift(stem: string, language: ProbabilityNativeLanguage, qlId: string): void {
  const forbidden = language === "hi"
    ? [
        /\d+ अभ्यर्थी के एक समूह/u,
        /\d+ विद्यार्थी के एक समूह/u,
        /चुने गए गेंदें में/u,
        /उसके नीला होने/u,
        /उसके इनाम वाला टिकट होने/u,
        /के कोई भी शर्त पूरी न करने/u,
        /के ठीक एक शर्त पूरी करने/u,
      ]
    : [
        /\d+ ਉਮੀਦਵਾਰ ਦੇ ਇੱਕ ਸਮੂਹ/u,
        /\d+ ਵਿਦਿਆਰਥੀ ਦੇ ਇੱਕ ਸਮੂਹ/u,
        /ਚੁਣੇ ਗੇਂਦਾਂ ਵਿੱਚ/u,
        /ਉਸ ਦੇ ਨੀਲਾ ਹੋਣ/u,
        /ਉਸ ਦੇ ਇਨਾਮ ਵਾਲਾ ਟਿਕਟ ਹੋਣ/u,
        /ਦੇ ਕੋਈ ਵੀ ਸ਼ਰਤ ਪੂਰੀ ਨਾ ਕਰਨ/u,
        /ਦੇ ਠੀਕ ਇੱਕ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ/u,
      ];

  const hit = forbidden.find((pattern) => pattern.test(stem));
  if (hit) throw new Error(`${qlId}/${language}: known non-exam native grammar pattern survived: ${hit}.`);
}

export function renderNativeStudentFacingStem(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
): string {
  const stem = renderNativeFinalStem(source, language);
  const sourceNumbers = numericTokens(source.stem);
  const nativeNumbers = numericTokens(stem);

  for (const token of sourceNumbers) {
    if (!nativeNumbers.has(token)) {
      throw new Error(`${source.questionLanguageId}/${language}: native stem lost English numeric token ${token}.`);
    }
  }

  for (const token of nativeNumbers) {
    // Native exam wording may use the digit 1 where English writes "one".
    if (token !== "1" && !sourceNumbers.has(token)) {
      throw new Error(`${source.questionLanguageId}/${language}: native stem introduced numeric token ${token} absent from English authority.`);
    }
  }

  assertNoKnownGrammarDrift(stem, language, source.questionLanguageId);
  return stem;
}
