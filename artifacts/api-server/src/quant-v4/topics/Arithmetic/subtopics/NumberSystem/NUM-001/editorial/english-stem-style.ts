export type NumPermanentQlId = `NUM-QL-${string}`;

function formatIndianIntegerLiteral(value: string): string {
  if (value.length <= 3) return value;
  const lastThree = value.slice(-3);
  const leading = value.slice(0, -3);
  const groupedLeading = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${groupedLeading},${lastThree}`;
}

/**
 * Formats only standalone five-or-more-digit literals. Numerals containing X/Y
 * remain untouched because commas inside missing-digit templates reduce clarity.
 */
export function formatStandaloneIntegersForEnglishIndia(text: string): string {
  return text.replace(/(?<![\dA-Za-z^])(\d{5,})(?![\dA-Za-z])/g, (match) =>
    formatIndianIntegerLiteral(match));
}

function asNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item))
    .sort((a, b) => a - b);
}

function sameNumbers(left: readonly number[], right: readonly number[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function describeCandidateSubset(
  candidatesInput: readonly number[],
  subsetInput: readonly number[],
): string {
  const candidates = [...candidatesInput].sort((a, b) => a - b);
  const subset = [...subsetInput].sort((a, b) => a - b);
  if (subset.length === 0) return "No listed value satisfies the statement.";
  if (sameNumbers(candidates, subset)) return "The statement is true for every listed value of p.";

  for (let length = 1; length < candidates.length; length += 1) {
    if (sameNumbers(subset, candidates.slice(0, length))) {
      return `p < ${candidates[length]}`;
    }
  }
  for (let start = 1; start < candidates.length; start += 1) {
    if (sameNumbers(subset, candidates.slice(start))) {
      return `p > ${candidates[start - 1]}`;
    }
  }

  if (subset.length === 1) {
    const index = candidates.indexOf(subset[0]!);
    if (index === 0 && candidates[1] !== undefined) return `p < ${candidates[1]}`;
    if (index === candidates.length - 1 && candidates[index - 1] !== undefined) {
      return `p > ${candidates[index - 1]}`;
    }
    if (index > 0 && index < candidates.length - 1) {
      return `${candidates[index - 1]} < p < ${candidates[index + 1]}`;
    }
  }

  return `p is one of {${subset.join(", ")}}`;
}

function rewritePrimeDataSufficiency(
  rawStem: string,
  hiddenState: Readonly<Record<string, unknown>>,
): string {
  const candidates = asNumberArray(hiddenState.candidates);
  const statementI = asNumberArray(hiddenState.statementI);
  const statementII = asNumberArray(hiddenState.statementII);
  if (candidates.length === 0 || statementI.length === 0 || statementII.length === 0) {
    return rawStem;
  }
  return [
    `A prime number p is selected from {${candidates.join(", ")}}. Can p be determined uniquely?`,
    "",
    `Statement I: ${describeCandidateSubset(candidates, statementI)}.`,
    `Statement II: ${describeCandidateSubset(candidates, statementII)}.`,
    "",
    "Select the correct data-sufficiency option.",
  ].join("\n");
}

function rewriteMissingDigitDataSufficiency(rawStem: string): string {
  const match = rawStem.match(
    /^What can be concluded about the missing digit X in ([^.]+)\. Statement I: ([^.]+\.) Statement II: ([^.]+\.) Which option correctly describes whether X can be determined\?$/,
  );
  if (!match) return rawStem;
  return [
    `Can the missing digit X in ${match[1]} be determined uniquely?`,
    "",
    `Statement I: ${match[2]}`,
    `Statement II: ${match[3]}`,
    "",
    "Select the correct data-sufficiency option.",
  ].join("\n");
}

/**
 * Student-facing English hardening for the permanently identified Number System
 * runtime. Mathematical state, options, answers and lifecycle data are untouched.
 */
export function polishNumberSystemEnglishStem(
  qlId: NumPermanentQlId,
  rawStem: string,
  hiddenState: Readonly<Record<string, unknown>> = {},
): string {
  let stem = rawStem.trim().replace(/[ \t]+/g, " ");

  switch (qlId) {
    case "NUM-QL-001":
      stem = stem
        .replace(/^For which option is (.+) exactly divisible\?$/, "Which of the following numbers divides $1 exactly?")
        .replace(/^(.+) is divisible by exactly one of the following options\. Which one\?$/, "Which of the following numbers divides $1 without leaving a remainder?")
        .replace(/^Which divisor leaves no remainder when (.+) is divided\?$/, "Which of the following numbers divides $1 without leaving a remainder?");
      break;
    case "NUM-QL-003":
      stem = stem
        .replace(/^Choose the largest admissible digit X for which (.+)\?$/, "What is the largest digit X for which $1?")
        .replace(/^The number (.+) must be divisible by (.+)\. Find the smallest possible value of X\?$/, "What is the smallest possible digit X if $1 is divisible by $2?");
      break;
    case "NUM-QL-005":
      stem = stem.replace(/^Find the sum of (.+)\?$/, "What is the sum of $1?");
      break;
    case "NUM-QL-007":
      stem = stem
        .replace(/^Form the greatest number divisible by (.+) by choosing a suitable digit for X in (.+)\?$/, "What is the greatest number obtained by replacing X in $2 so that it is divisible by $1?")
        .replace(/^Form the smallest number divisible by (.+) by choosing a suitable digit for X in (.+)\?$/, "What is the smallest number obtained by replacing X in $2 so that it is divisible by $1?");
      break;
    case "NUM-QL-011":
      stem = stem.replace(
        /^For the number (.+), what is true about ordered digit pairs \(X, Y\) that make it (.+)\?$/,
        "Which statement correctly describes the ordered digit pairs (X, Y) that make $1 $2?",
      );
      break;
    case "NUM-QL-012":
      stem = stem
        .replace(/^What is the least (\d+)-digit number that leaves remainder 0 when divided by (.+)\?$/, "What is the smallest $1-digit number exactly divisible by $2?")
        .replace(/^Which is the first (\d+)-digit integer in the sequence of multiples of (.+)\?$/, "What is the smallest $1-digit number exactly divisible by $2?");
      break;
    case "NUM-QL-014":
      stem = stem.replace(
        /^A numeral is formed by repeating (.+) exactly (\d+) times\. Which option leaves remainder 0\?$/,
        "The block $1 is repeated $2 times to form a number. Which of the following numbers divides the result exactly?",
      );
      break;
    case "NUM-QL-016":
      stem = rewriteMissingDigitDataSufficiency(stem);
      break;
    case "NUM-QL-018":
      stem = stem.replace(/^How should (.+) be classified in prime-number terminology\?$/, "Which of the following correctly classifies $1?");
      break;
    case "NUM-QL-019":
      stem = stem.replace(
        /^Which set contains every prime integer from (.+) through (.+), including both endpoints\?$/,
        "Which set contains all prime numbers between $1 and $2, both inclusive?",
      );
      break;
    case "NUM-QL-020":
      stem = stem.replace(
        /^How many prime numbers lie in the inclusive interval \[(.+), (.+)\]\?$/,
        "How many prime numbers lie between $1 and $2, both inclusive?",
      );
      break;
    case "NUM-QL-023":
      stem = stem.replace(/^For the values (.+), which statement is true\?$/, "Which of the following statements about $1 is correct?");
      break;
    case "NUM-QL-027":
      stem = stem.replace(
        /^Counting multiplicity, how many prime factors occur in (.+)\?$/,
        "How many prime factors does $1 have when repeated factors are counted separately?",
      );
      break;
    case "NUM-QL-032":
      stem = stem.replace(/^Among these four pairs built around (.+), which pair is co-prime\?$/, "Which of the following pairs containing $1 is co-prime?");
      break;
    case "NUM-QL-033":
      stem = stem.replace(/^From (\{.+\}), select the complete set of values co-prime to (.+)\.$/, "Which set contains all numbers from $1 that are co-prime to $2?");
      break;
    case "NUM-QL-035":
      stem = stem.replace(/^Which value of x from (\{.+\}) makes HCF\((.+), x\) = 1\?$/, "Which value of x in $1 is co-prime to $2?");
      break;
    case "NUM-QL-036":
      stem = stem.replace(/^Classify the triple \((.+)\) with respect to pairwise and collective co-primality\.$/, "Which statement correctly describes the co-primality of $1?");
      break;
    case "NUM-QL-037":
      stem = stem.replace(/^Considering the pairs involving (.+), which co-prime statement is true\?$/, "Which of the following co-prime statements about $1 is correct?");
      break;
    case "NUM-QL-041":
      stem = stem.replace(/^Which listed prime divides the value of \((.+)\)\?$/, "Which of the following prime numbers divides $1 exactly?");
      break;
    case "NUM-QL-042":
      stem = stem.replace(/^Using (.+) as the reference prime, which prime-structure statement is possible\?$/, "Which of the following statements involving the prime $1 is possible?");
      break;
    case "NUM-QL-044":
      stem = rewritePrimeDataSufficiency(stem, hiddenState);
      break;
    case "NUM-QL-045": {
      const value = Number(hiddenState.value);
      if (Number.isFinite(value)) {
        stem = `Which option gives all smallest changes, positive or negative, that turn ${value} into a prime number?`;
      } else {
        stem = stem.replace(
          /^What is the complete set of minimum signed integer adjustments that make (.+) prime\?$/,
          "Which option gives all smallest changes, positive or negative, that turn $1 into a prime number?",
        );
      }
      break;
    }
    default:
      break;
  }

  return formatStandaloneIntegersForEnglishIndia(stem)
    .replace(/\s+\?/g, "?")
    .replace(/\s+\./g, ".")
    .trim();
}
