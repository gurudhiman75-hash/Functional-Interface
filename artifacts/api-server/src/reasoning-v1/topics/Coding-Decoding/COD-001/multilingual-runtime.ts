import { generateCodCp001Question } from "./COD-CP-001/generator";
import { generateCodCp002Question } from "./COD-CP-002/generator";
import { generateCodCp003Question } from "./COD-CP-003/generator";
import { generateCodCp004Question } from "./COD-CP-004/generator";
import { generateCodCp005Question } from "./COD-CP-005/generator";
import { generateCodCp006Question } from "./COD-CP-006/generator";
import { generateCp007Question } from "./COD-CP-007/cp007-runtime";
import { generateCp008Question } from "./COD-CP-008/cp008-runtime";
import { generateCp009Question } from "./COD-CP-009/cp009-runtime";
import { generateCp010Question } from "./COD-CP-010/cp010-runtime";
import { localizeCp008Question } from "./localization/cp008-localizer";
import { localizeCp009Question } from "./localization/cp009-localizer";
import { withCodPedagogicalExplanation } from "./localization/pedagogical-explanation";
import { localizeCodTranslationalQuestion } from "./localization/translational-localizer";
import type { CodTranslatedLocale } from "./localization/translational-language-pack";

export type Cod001Locale = "en-IN" | CodTranslatedLocale;

interface QuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  checkpointId: string;
  locale: string;
  stem: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  [key: string]: unknown;
}

function qlNumber(qlId: string): number {
  const match = /^COD-QL-(\d{3})$/u.exec(qlId);
  if (!match) throw new Error(`Invalid COD-001 QL identity '${qlId}'`);
  const value = Number(match[1]);
  if (value < 1 || value > 199) throw new Error(`COD-001 does not own '${qlId}'`);
  return value;
}

function generateCod001RawEnglishQuestion(qlId: string, seed = 0): QuestionLike {
  const number = qlNumber(qlId);
  if (number <= 24) return generateCodCp001Question(qlId, seed) as QuestionLike;
  if (number <= 52) return generateCodCp002Question(qlId, seed) as QuestionLike;
  if (number <= 80) return generateCodCp003Question(qlId, seed) as QuestionLike;
  if (number <= 112) return generateCodCp004Question(qlId, seed) as QuestionLike;
  if (number <= 136) return generateCodCp005Question(qlId, seed) as QuestionLike;
  if (number <= 168) return generateCodCp006Question(qlId, seed) as QuestionLike;
  if (number <= 172) return generateCp007Question(qlId as never, seed) as QuestionLike;
  if (number <= 174) return generateCp008Question(qlId as never, seed) as QuestionLike;
  if (number <= 198) return generateCp009Question(qlId as never, seed) as QuestionLike;
  return generateCp010Question(qlId as never, seed) as QuestionLike;
}

export function generateCod001EnglishQuestion(qlId: string, seed = 0): QuestionLike {
  return withCodPedagogicalExplanation(generateCod001RawEnglishQuestion(qlId, seed));
}

export function isCod001TranslationalQl(qlId: string): boolean {
  const number = qlNumber(qlId);
  return number <= 172 || number === 199;
}

export function isCod001Cp008Ql(qlId: string): boolean {
  const number = qlNumber(qlId);
  return number === 173 || number === 174;
}

export function isCod001Cp009Ql(qlId: string): boolean {
  const number = qlNumber(qlId);
  return number >= 175 && number <= 198;
}

export function generateCod001Question(
  qlId: string,
  locale: Cod001Locale,
  seed = 0,
): QuestionLike {
  const english = generateCod001EnglishQuestion(qlId, seed);
  if (locale === "en-IN") return english;

  let localized: QuestionLike;
  if (isCod001TranslationalQl(qlId)) localized = localizeCodTranslationalQuestion(english as never, locale) as QuestionLike;
  else if (isCod001Cp008Ql(qlId)) localized = localizeCp008Question(english as never, locale) as QuestionLike;
  else if (isCod001Cp009Ql(qlId)) localized = localizeCp009Question(english as never, locale) as QuestionLike;
  else throw new Error(`No ${locale} runtime for '${qlId}'`);

  return withCodPedagogicalExplanation(localized);
}
