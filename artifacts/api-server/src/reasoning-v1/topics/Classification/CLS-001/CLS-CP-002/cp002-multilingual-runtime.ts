import {
  CLS_CP002_QL_ID,
  type ClsCp002QlId,
} from "./cp002-permanent-contract";
import {
  generateClsCp002EnglishQuestion,
  type GeneratedClsCp002EnglishQuestion,
} from "./cp002-permanent-runtime";
import {
  localizeClsCp002Question,
  type GeneratedClsCp002LocalizedQuestion,
} from "./localization/cp002-localizer";
import type { ClsCp002Locale } from "./localization/cp002-language-pack";

export type GeneratedClsCp002PermanentQuestion =
  | GeneratedClsCp002EnglishQuestion
  | GeneratedClsCp002LocalizedQuestion;

export function generateClsCp002Question(
  qlId: ClsCp002QlId = CLS_CP002_QL_ID,
  locale: ClsCp002Locale = "en-IN",
  seed = 0,
): GeneratedClsCp002PermanentQuestion {
  const english = generateClsCp002EnglishQuestion(qlId, seed);
  return locale === "en-IN" ? english : localizeClsCp002Question(english, locale);
}
