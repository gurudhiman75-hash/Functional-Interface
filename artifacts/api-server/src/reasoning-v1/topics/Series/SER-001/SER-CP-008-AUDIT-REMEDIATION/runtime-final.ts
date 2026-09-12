import {
  generateSerCp008,
  type GeneratedSerCp008Question,
  type SerCp008Locale,
} from "./runtime";
import {
  generateSerCp008Mixed,
  type GeneratedSerCp008MixedQuestion,
} from "./mixed-runtime";
import {
  SER_CP008_MIXED_QL_IDS,
  type SerCp008AllProvisionalQlId,
  type SerCp008CoreQlId,
  type SerCp008MixedQlId,
} from "./question-language";

export type GeneratedSerCp008FinalQuestion =
  | GeneratedSerCp008Question
  | GeneratedSerCp008MixedQuestion;

export function generateSerCp008Final(
  qlId: SerCp008AllProvisionalQlId,
  seed = 1,
  locale: SerCp008Locale = "en-IN",
): GeneratedSerCp008FinalQuestion {
  if ((SER_CP008_MIXED_QL_IDS as readonly string[]).includes(qlId)) {
    return generateSerCp008Mixed(qlId as SerCp008MixedQlId, seed, locale);
  }
  return generateSerCp008(qlId as SerCp008CoreQlId, seed, locale);
}
