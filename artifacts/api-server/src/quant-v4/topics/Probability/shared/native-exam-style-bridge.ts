import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import type { ProbabilityQuestion } from "./types";
import { renderNativeFinalStem } from "./native-final-stem-renderer";
import { renderNativeClassicalContextStem } from "./native-classical-context-renderer";

function numericTokens(value: string): Set<string> {
  return new Set(value.match(/\d+(?:\.\d+)?/gu) ?? []);
}

function allowedImplicitNumbers(source: string): Set<string> {
  const allowed = new Set<string>();
  const words: Readonly<Record<string, string>> = {
    one: "1", two: "2", three: "3", four: "4", five: "5",
    six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
  };
  for (const [word, digit] of Object.entries(words)) {
    if (new RegExp(`\\b${word}\\b`, "iu").test(source)) allowed.add(digit);
  }
  // A standard deck is a defined 52-card object even when English omits the number.
  if (/standard (?:deck|pack)|standard playing-card/iu.test(source)) allowed.add("52");
  return allowed;
}

function assertNoKnownGrammarDrift(stem: string, language: ProbabilityNativeLanguage, qlId: string): void {
  const forbidden = language === "hi"
    ? [
        /\d+ अभ्यर्थी के एक समूह/u,
        /\d+ विद्यार्थी के एक समूह/u,
        /चुने गए गेंदें में/u,
        /उसके नीला होने/u,
        /उसके [^.?!]* टिकट होने/u,
        /के कोई भी शर्त पूरी न करने/u,
        /के ठीक एक शर्त पूरी करने/u,
      ]
    : [
        /\d+ ਉਮੀਦਵਾਰ ਦੇ ਇੱਕ ਸਮੂਹ/u,
        /\d+ ਵਿਦਿਆਰਥੀ ਦੇ ਇੱਕ ਸਮੂਹ/u,
        /ਚੁਣੇ ਗੇਂਦਾਂ ਵਿੱਚ/u,
        /ਉਸ ਦੇ ਨੀਲਾ ਹੋਣ/u,
        /ਉਸ ਦੇ [^.?!]* ਟਿਕਟ ਹੋਣ/u,
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
  const polishedStem = renderNativeFinalStem(source, language);
  const stem = renderNativeClassicalContextStem(source, language, polishedStem);
  const sourceNumbers = numericTokens(source.stem);
  const nativeNumbers = numericTokens(stem);
  const implicitNumbers = allowedImplicitNumbers(source.stem);

  for (const token of sourceNumbers) {
    if (!nativeNumbers.has(token)) {
      throw new Error(`${source.questionLanguageId}/${language}: native stem lost English numeric token ${token}.`);
    }
  }

  for (const token of nativeNumbers) {
    if (!sourceNumbers.has(token) && !implicitNumbers.has(token)) {
      throw new Error(`${source.questionLanguageId}/${language}: native stem introduced numeric token ${token} absent from English authority.`);
    }
  }

  assertNoKnownGrammarDrift(stem, language, source.questionLanguageId);
  return stem;
}
