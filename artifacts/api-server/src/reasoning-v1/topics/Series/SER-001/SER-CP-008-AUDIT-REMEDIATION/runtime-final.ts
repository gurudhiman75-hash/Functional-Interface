import {
  generateSerCp008,
  type GeneratedSerCp008Question,
  type SerCp008Locale,
} from "./runtime";
import { generateSerCp008Mixed } from "./mixed-runtime";
import {
  SER_CP008_MIXED_QL_IDS,
  type SerCp008CoreQlId,
  type SerCp008MixedQlId,
  type SerCp008ProvisionalQlId,
} from "./question-language";

export function generateSerCp008Final(
  qlId: SerCp008ProvisionalQlId,
  seed = 1,
  locale: SerCp008Locale = "en-IN",
): GeneratedSerCp008Question {
  if ((SER_CP008_MIXED_QL_IDS as readonly string[]).includes(qlId)) {
    return generateSerCp008Mixed(qlId as SerCp008MixedQlId, seed, locale);
  }
  return generateSerCp008(qlId as SerCp008CoreQlId, seed, locale);
}
