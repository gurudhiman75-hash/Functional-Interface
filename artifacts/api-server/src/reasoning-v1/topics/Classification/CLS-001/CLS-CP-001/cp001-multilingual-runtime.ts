import type { ClsCp001QlId } from "./cp001-permanent-contracts";
import { polishClsCp001PlainLanguage } from "./cp001-plain-language";
import {
  generateClsCp001EnglishQuestion,
  type GeneratedClsCp001EnglishQuestion,
} from "./cp001-runtime";
import {
  localizeClsCp001Question,
  type GeneratedClsCp001LocalizedQuestion,
} from "./localization/cp001-student-localizer";
import type { ClsCp001Locale } from "./localization/cp001-language-pack";

export type GeneratedClsCp001PermanentQuestion =
  | GeneratedClsCp001EnglishQuestion
  | GeneratedClsCp001LocalizedQuestion;

export function generateClsCp001Question(
  qlId: ClsCp001QlId,
  locale: ClsCp001Locale = "en-IN",
  seed = 0,
): GeneratedClsCp001PermanentQuestion {
  const english = generateClsCp001EnglishQuestion(qlId, seed);
  return locale === "en-IN"
    ? english
    : polishClsCp001PlainLanguage(localizeClsCp001Question(english, locale));
}
