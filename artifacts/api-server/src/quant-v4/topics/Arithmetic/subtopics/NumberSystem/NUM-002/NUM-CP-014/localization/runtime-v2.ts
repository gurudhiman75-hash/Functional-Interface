import { generateNumCp014Localized, type NumCp014LocalizedLanguage, type NumCp014LocalizedPackage } from "./runtime.ts";
import type { NumCp014PermanentQlId } from "../permanent-allocation.ts";

function clean(text: string, language: NumCp014LocalizedLanguage) {
  const nativeHcf = language === "hi" ? "म.स." : "ਮ.ਸ.";
  return text.replaceAll(" (HCF)", "").replaceAll("HCF", nativeHcf);
}

export function generateNumCp014LocalizedV2(
  qlId: NumCp014PermanentQlId,
  seed: number,
  language: NumCp014LocalizedLanguage,
): NumCp014LocalizedPackage {
  const q = generateNumCp014Localized(qlId, seed, language);
  const fullDerivation = Object.freeze(q.explanation.fullDerivation.map((line) => clean(line, language)));
  const examShortcut = Object.freeze(q.explanation.examShortcut.map((line) => clean(line, language)));
  const representationPayload = q.representationPayload
    ? Object.freeze(q.representationPayload.map((line) => clean(line, language)))
    : undefined;
  return Object.freeze({
    ...q,
    stem: clean(q.stem, language),
    ...(representationPayload ? { representationPayload } : {}),
    explanation: Object.freeze({
      ...q.explanation,
      fullDerivation,
      examShortcut,
      coreConcept: fullDerivation[0]!,
      strategy: examShortcut[0]!,
      steps: Object.freeze(fullDerivation.slice(1)),
    }),
  });
}
