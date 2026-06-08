import type { Cp001Parameters, Cp002Parameters, ValidDigitSetParameters } from "./types";
import {
  getNsDiv001ForbiddenQuestionLanguage,
  getNsDiv001ActiveCp001StemFamilies,
  renderNsDiv001QuestionLanguage,
  renderNsDiv001ValidDigitSetQuestionLanguage,
  selectNsDiv001ValidDigitSetStemFamily,
  type NsDiv001StemFamilyId,
} from "./realism-library";

export const APPROVED_CP001_STEM_FAMILIES = [
  "SF-001",
  "SF-002",
  "SF-003",
  "SF-004",
  "SF-005",
  "SF-006",
  "SF-007",
] as const;

export const FORBIDDEN_STEM_LANGUAGE = getNsDiv001ForbiddenQuestionLanguage();

export const FORBIDDEN_EXPLANATION_LANGUAGE = [
  "reasoning graph",
  "graph node",
  "node",
  "contract",
  "pipeline",
  "candidate evaluation",
  "source trace",
  "ownership metadata",
  "verification produced",
  "internal identifier",
  "execution stage",
  "graph relationship",
  "validation category",
  "solver invocation",
  "parameter resolution",
  "output contract",
  "implementation detail",
  "system metadata",
] as const;

export function containsForbiddenLanguage(text: string, forbiddenPhrases: readonly string[]) {
  const normalized = text.toLowerCase();
  return forbiddenPhrases.filter((phrase) => normalized.includes(phrase.toLowerCase()));
}

export function renderApprovedCp001Stem(parameters: Cp001Parameters) {
  return renderApprovedNsDiv001Stem(parameters);
}

export function renderApprovedCp002Stem(parameters: Cp002Parameters) {
  return renderApprovedNsDiv001Stem(parameters);
}

export function renderApprovedCp003Stem(parameters: ValidDigitSetParameters) {
  const family = selectNsDiv001ValidDigitSetStemFamily({
    canonicalProblemId: parameters.canonicalProblemId,
    questionId: parameters.questionId,
    numberExpression: parameters.numberExpression,
    divisor: parameters.divisor,
  });
  return renderNsDiv001ValidDigitSetQuestionLanguage({
    canonicalProblemId: parameters.canonicalProblemId,
    familyId: family.id,
    numberExpression: parameters.numberExpression,
    divisor: parameters.divisor,
  });
}

export const renderApprovedCp004Stem = renderApprovedCp003Stem;
export const renderApprovedCp005Stem = renderApprovedCp003Stem;
export const renderApprovedCp006Stem = renderApprovedCp003Stem;
export const renderApprovedCp007Stem = renderApprovedCp003Stem;

function renderApprovedNsDiv001Stem(parameters: Cp001Parameters | Cp002Parameters) {
  const activeFamilies = getNsDiv001ActiveCp001StemFamilies();
  const knownDigitSum = parameters.knownDigits.reduce((sum, digit) => sum + digit, 0);
  const familyIndex = knownDigitSum % activeFamilies.length;
  const family = activeFamilies[familyIndex] as NsDiv001StemFamilyId;
  const entryIndex = knownDigitSum + parameters.divisor + parameters.missingPosition;
  return renderNsDiv001QuestionLanguage({
    familyId: family,
    entryIndex,
    number: parameters.numberExpression,
    divisor: parameters.divisor,
  });
}
