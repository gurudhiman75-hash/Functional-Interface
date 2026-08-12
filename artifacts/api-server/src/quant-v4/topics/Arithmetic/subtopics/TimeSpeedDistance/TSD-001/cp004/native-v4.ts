import { renderCp004EditorialV2NativeQuestion } from "./native-v2";
import type { TsdCp004NativeLanguage } from "./native";
import type { TsdCp004FinalNativeQuestion } from "./native-polished";
import type { TsdCp004Question } from "./types";
import { buildCp004FaithfulVisualV3 } from "./visual-v3";

export function renderCp004EditorialV4NativeQuestion(english: TsdCp004Question, language: TsdCp004NativeLanguage): TsdCp004FinalNativeQuestion {
  const base = renderCp004EditorialV2NativeQuestion(english, language);
  return Object.freeze({ ...base, visual: buildCp004FaithfulVisualV3(english.state, language) });
}
