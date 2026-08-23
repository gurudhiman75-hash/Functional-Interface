import { generateNumCp010Permanent } from "../permanent-runtime.ts";
import type { NumCp010PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp010Localized } from "./runtime.ts";
import type { NumCp010LocalizedLanguage, NumCp010LocalizedPackage } from "./types.ts";

function numericState(value: unknown, key: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Expected numeric state field ${key}`);
  return value;
}

function polish(value: string, language: NumCp010LocalizedLanguage): string {
  if (language === "hi") {
    return value
      .replace(/सैकड़ा स्थान से (\d+) बार/gu, "सैकड़ा स्थान पर $1 बार")
      .replace(/हर पूरे 100-संख्या खंड में/gu, "100 संख्याओं के हर पूरे खंड में");
  }
  return value
    .replace(/ਸੈਂਕੜੇ ਦੇ ਸਥਾਨ ਤੋਂ (\d+) ਵਾਰ/gu, "ਸੈਂਕੜੇ ਦੇ ਸਥਾਨ ਤੇ $1 ਵਾਰ")
    .replace(/ਹਰ ਪੂਰੇ 100-ਸੰਖਿਆ ਖੰਡ ਵਿੱਚ/gu, "100 ਸੰਖਿਆਵਾਂ ਦੇ ਹਰ ਪੂਰੇ ਖੰਡ ਵਿੱਚ");
}

function polishPackage(localized: NumCp010LocalizedPackage, language: NumCp010LocalizedLanguage) {
  return Object.freeze({
    ...localized,
    stem: polish(localized.stem, language),
    explanation: Object.freeze({
      coreConcept: polish(localized.explanation.coreConcept, language),
      strategy: polish(localized.explanation.strategy, language),
      steps: Object.freeze(localized.explanation.steps.map((step) => polish(step, language))),
      finalAnswer: polish(localized.explanation.finalAnswer, language),
    }),
  }) as NumCp010LocalizedPackage;
}

export function generateNumCp010LocalizedHumanReview(
  qlId: NumCp010PermanentQlId,
  seed: number,
  language: NumCp010LocalizedLanguage,
): NumCp010LocalizedPackage {
  let localized = generateNumCp010Localized(qlId, seed, language);
  const source = generateNumCp010Permanent(qlId, seed);

  if (localized.temporaryPrototypeId === "NUM-CP010-PROT-012") {
    const state = source.hiddenState as Readonly<Record<string, unknown>>;
    const hundreds = numericState(state.hundreds, "hundreds");
    const x = numericState(state.x, "x");
    const units = numericState(state.units, "units");
    const subtrahend = numericState(state.subtrahend, "subtrahend");
    const result = numericState(state.result, "result");
    const stem = language === "hi"
      ? `नीचे दिए घटाव में x एक अंक है। x ज्ञात कीजिए।\n\n  ${hundreds}x${units}\n- ${subtrahend}\n-----\n  ${String(result).padStart(3, "0")}`
      : `ਹੇਠਾਂ ਦਿੱਤੀ ਘਟਾਉ ਵਿੱਚ x ਇੱਕ ਅੰਕ ਹੈ। x ਕੱਢੋ।\n\n  ${hundreds}x${units}\n- ${subtrahend}\n-----\n  ${String(result).padStart(3, "0")}`;
    if (String(x).length !== 1) throw new Error("P012 x must remain a single digit");
    localized = Object.freeze({ ...localized, stem }) as NumCp010LocalizedPackage;
  }

  if (localized.temporaryPrototypeId === "NUM-CP010-PROT-018") {
    const state = source.hiddenState as Readonly<Record<string, unknown>>;
    const conditionText = String(state.conditionText ?? "");
    const sumMatch = conditionText.match(/digits is (\d+)/u);
    const diffMatch = conditionText.match(/tens digit is (\d+) greater/u);
    const sum = Number(sumMatch?.[1] ?? state.sum);
    const diff = diffMatch ? Number(diffMatch[1]) : null;
    const stem = language === "hi"
      ? diff === null
        ? `कुल कितनी दो-अंकीय संख्याओं के अंकों का योग ${sum} है?`
        : `कुल कितनी दो-अंकीय संख्याओं में अंकों का योग ${sum} है और दहाई का अंक इकाई के अंक से ${diff} अधिक है?`
      : diff === null
        ? `ਕੁੱਲ ਕਿੰਨੀਆਂ ਦੋ-ਅੰਕੀ ਸੰਖਿਆਵਾਂ ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ?`
        : `ਕੁੱਲ ਕਿੰਨੀਆਂ ਦੋ-ਅੰਕੀ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ਅੰਕਾਂ ਦਾ ਜੋੜ ${sum} ਹੈ ਅਤੇ ਦਹਾਈ ਦਾ ਅੰਕ ਇਕਾਈ ਦੇ ਅੰਕ ਤੋਂ ${diff} ਵੱਧ ਹੈ?`;
    localized = Object.freeze({ ...localized, stem }) as NumCp010LocalizedPackage;
  }

  return polishPackage(localized, language);
}
