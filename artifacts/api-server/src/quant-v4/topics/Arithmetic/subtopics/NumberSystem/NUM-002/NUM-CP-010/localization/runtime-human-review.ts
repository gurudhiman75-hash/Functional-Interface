import { generateNumCp010Permanent } from "../permanent-runtime.ts";
import type { NumCp010PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp010Localized } from "./runtime.ts";
import type { NumCp010LocalizedLanguage, NumCp010LocalizedPackage } from "./types.ts";

function numericState(value: unknown, key: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Expected numeric state field ${key}`);
  return value;
}

export function generateNumCp010LocalizedHumanReview(
  qlId: NumCp010PermanentQlId,
  seed: number,
  language: NumCp010LocalizedLanguage,
): NumCp010LocalizedPackage {
  const localized = generateNumCp010Localized(qlId, seed, language);
  if (localized.temporaryPrototypeId !== "NUM-CP010-PROT-012") return localized;

  const source = generateNumCp010Permanent(qlId, seed);
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
  return Object.freeze({ ...localized, stem }) as NumCp010LocalizedPackage;
}
