import {
  generateSerCp008,
  type GeneratedSerCp008Question,
  type SerCp008Locale,
} from "./runtime";
import type { SerCp008ProvisionalQlId } from "./question-language";

export function generateSerCp008Final(
  qlId: SerCp008ProvisionalQlId,
  seed = 1,
  locale: SerCp008Locale = "en-IN",
): GeneratedSerCp008Question {
  return generateSerCp008(qlId, seed, locale);
}
