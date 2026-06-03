import type { Cp001Parameters } from "./types";
import {
  getNsDiv001ActiveCp001StemFamilies,
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

export const FORBIDDEN_STEM_LANGUAGE = [
  "For the number",
  "Determine the digit",
  "What value is obtained",
  "By tracking",
  "Candidate value",
  "Constraint satisfaction",
  "Valid assignment",
  "Evaluate the digit",
  "Resolve the unknown digit",
  "The required digit",
  "The desired digit",
  "Obtain the value",
  "Compute the digit",
  "Calculate the digit",
] as const;

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
  const activeFamilies = getNsDiv001ActiveCp001StemFamilies();
  const knownDigitSum = parameters.knownDigits.reduce((sum, digit) => sum + digit, 0);
  const familyIndex = knownDigitSum % activeFamilies.length;
  const family = activeFamilies[familyIndex] as NsDiv001StemFamilyId;
  const expression = parameters.numberExpression;
  const divisor = parameters.divisor;
  let stem: string;

  switch (family) {
    case "SF-001":
      stem = `The digit x in ${expression} is such that the number is divisible by ${divisor}. Find x.`;
      break;
    case "SF-002":
      stem = `Which digit should replace x so that ${expression} is divisible by ${divisor}?`;
      break;
    case "SF-003":
      stem = `If ${expression} is divisible by ${divisor}, the value of x is:`;
      break;
    case "SF-004":
      stem = `${expression} becomes divisible by ${divisor} when x is:`;
      break;
    case "SF-006":
      stem = `A digit x is inserted in ${expression} to make the number divisible by ${divisor}. Find x.`;
      break;
    case "SF-007":
      stem = `${expression} is divisible by ${divisor}. The missing digit is:`;
      break;
    default:
      throw new Error(`Unsupported active CP-001 stem family: ${family}`);
  }

  return { familyId: family, stem };
}
