import { formatStandaloneIntegersForEnglishIndia } from "./english-stem-style";

const SPECIFIC_WARNINGS: Readonly<Record<string, string>> = {
  SIGN_DIRECTION_IGNORED:
    "This checks only one direction. Compare equally distant lower and upper candidates before deciding.",
  ONLY_LOWER_PRIME_CHECKED:
    "This checks only the lower side and misses an equally close prime above the number.",
  ONLY_UPPER_PRIME_CHECKED:
    "This checks only the upper side and misses an equally close prime below the number.",
  NONMINIMUM_ADJUSTMENT_USED:
    "This uses a larger change even though a closer prime is available.",
  COMMON_FACTOR_NOT_REMOVED:
    "A common prime factor is still present, so the numbers are not co-prime.",
  CANDIDATE_SHARES_FIXED_PRIME_FACTOR:
    "The candidate shares a prime factor with the fixed number, so their HCF is greater than 1.",
  LISTED_PRIME_DOES_NOT_DIVIDE_EXPRESSION:
    "Substitution or factorisation shows that this listed prime does not divide the expression exactly.",
  ODD_CONFUSED_WITH_COPRIME:
    "Being odd does not guarantee co-primality; the two numbers may still share an odd prime factor.",
  COLLECTIVE_CONFUSED_WITH_PAIRWISE:
    "Collective HCF 1 does not mean that every pair is co-prime. Check each pair separately.",
  ONE_TREATED_AS_PRIME:
    "The number 1 is neither prime nor composite.",
  PRIME_SQUARE_TREATED_AS_PRIME:
    "A square of a prime has more than two factors and is therefore composite.",
  COMPOSITE_FACTOR_NOT_SPLIT:
    "The factorisation is incomplete because a composite factor must be split into primes.",
  MULTIPLICITY_COUNTED:
    "This counts repeated occurrences when the question asks for distinct prime factors.",
  DISTINCT_COUNT_USED:
    "This counts only distinct primes when repeated prime factors must also be counted.",
  EXPONENT_CONFUSED_WITH_PRIME_FACTOR:
    "The exponent gives the number of repetitions; it is not itself the missing prime.",
  PRIME_BASE_RETURNED_AS_EXPONENT:
    "The prime base is visible; the unknown is its exponent.",
  ONE_VALID_VALUE_OMITTED:
    "One valid value has been left out, so the set is incomplete.",
  ONE_NONCOPRIME_VALUE_ADDED:
    "The set includes a value that shares a factor with the reference number.",
  ONE_VALID_VALUE_MISSED:
    "A valid co-prime value has been missed.",
  ONE_NONCOPRIME_VALUE_COUNTED:
    "A value sharing a common factor has been included in the count.",
  DIRECTION_REVERSED:
    "The requested direction has been reversed; check whether the question asks for the next, previous, least or greatest value.",
  ONE_VALID_PRIME_SKIPPED:
    "A valid prime candidate has been skipped.",
  ONE_PRIME_MISSED:
    "One prime in the required interval or structure has been omitted.",
  ONE_COMPOSITE_COUNTED:
    "A composite number has been counted as prime.",
  EVERY_INTEGER_COUNTED:
    "This counts every integer instead of testing which values are prime.",
  COMPOSITE_NOT_TESTED:
    "The number was accepted without checking for a non-trivial divisor.",
  REPEATED_FACTOR_OMITTED:
    "A repeated prime factor has been omitted from the multiplicity count.",
  EXPONENT_OVERCOUNTED:
    "An exponent has been counted more times than the factorisation permits.",
  ORIGINAL_INTEGER_RETURNED:
    "The question asks for a derived prime-factor property, not the original integer.",
};

function humaniseMisconceptionId(id: string): string {
  return id
    .toLowerCase()
    .split("_")
    .join(" ")
    .replace(/^./, (character) => character.toUpperCase());
}

interface ParsedTrap {
  readonly option: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

function parseTrap(rawTrap: unknown): ParsedTrap | null {
  const text = normaliseNumberSystemReviewMath(rawTrap).trim();
  const match = text.match(/^(.*?):\s*([A-Z][A-Z0-9_]+)\.?$/);
  if (!match) return null;
  const misconceptionId = match[2]!;
  return {
    option: match[1]!.trim(),
    misconceptionId,
    explanation: SPECIFIC_WARNINGS[misconceptionId]
      ?? `This choice reflects the misconception “${humaniseMisconceptionId(misconceptionId).toLowerCase()}”. Recheck the governing condition before selecting it.`,
  };
}

export function normaliseNumberSystemReviewMath(text: unknown): string {
  const normalised = String(text ?? "")
    .replace(/\\\((.+?)\\\)/g, "$$$1$")
    .replace(/n−1/g, "$n - 1$")
    .replace(/n\+1/g, "$n + 1$")
    .replace(/\u2212/g, "-");
  return formatStandaloneIntegersForEnglishIndia(normalised);
}

/**
 * Converts an internal misconception-labelled option into plain learner-facing
 * text while retaining the stable diagnostic ID for traceability.
 */
export function formatNumCp004StudentWarningText(rawTrap: unknown): string {
  const parsed = parseTrap(rawTrap);
  if (!parsed) return normaliseNumberSystemReviewMath(rawTrap).trim();
  return `${parsed.option}: ${parsed.explanation} [${parsed.misconceptionId}]`;
}

/**
 * Markdown version of the same learner-facing warning.
 */
export function renderNumCp004StudentWarning(rawTrap: unknown): string {
  const parsed = parseTrap(rawTrap);
  if (!parsed) return `- ${normaliseNumberSystemReviewMath(rawTrap).trim()}`;
  return `- **${parsed.option}:** ${parsed.explanation} (\`${parsed.misconceptionId}\`)`;
}
