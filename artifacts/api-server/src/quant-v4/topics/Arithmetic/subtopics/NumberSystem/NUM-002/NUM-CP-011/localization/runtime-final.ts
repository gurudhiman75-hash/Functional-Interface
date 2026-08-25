import type { NumCp011PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp011Localized } from "./runtime.ts";
import type { NumCp011LocalizedLanguage, NumCp011LocalizedPackage } from "./types.ts";

function localizedTextAnswer(value: string, language: NumCp011LocalizedLanguage): string {
  if (value !== "No positive integer n") return value;
  return language === "hi" ? "कोई धनात्मक पूर्णांक n नहीं" : "ਕੋਈ ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ n ਨਹੀਂ";
}

/**
 * Final multilingual surface. Numeric/set answers pass through unchanged; the P008
 * no-solution textual answer is localized consistently across canonical answer,
 * verifier answer, explanation final answer and the already-localized correct option.
 */
export function generateNumCp011LocalizedFinal(
  qlId: NumCp011PermanentQlId,
  seed: number,
  language: NumCp011LocalizedLanguage,
): NumCp011LocalizedPackage {
  const source = generateNumCp011Localized(qlId, seed, language);
  const canonicalAnswer = localizedTextAnswer(source.canonicalAnswer, language);
  const verifierAnswer = localizedTextAnswer(source.verifierAnswer, language);
  const finalAnswer = localizedTextAnswer(source.explanation.finalAnswer, language);

  const result = Object.freeze({
    ...source,
    canonicalAnswer,
    verifierAnswer,
    explanation: Object.freeze({
      ...source.explanation,
      finalAnswer,
    }),
  }) as NumCp011LocalizedPackage;

  if (result.canonicalAnswer !== result.verifierAnswer) {
    throw new Error(`${qlId}: localized canonical/verifier binding drift`);
  }
  if (result.options[result.correctIndex]?.value !== result.canonicalAnswer) {
    throw new Error(`${qlId}: localized correct option/canonical binding drift`);
  }
  return result;
}
