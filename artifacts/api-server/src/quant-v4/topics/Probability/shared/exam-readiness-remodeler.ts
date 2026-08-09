import type {
  GeneratedParameters,
  ProbabilityDifficulty,
  ProbabilityTaskRegistryEntry,
  SolvedProbability,
} from "./types";

export interface ProbabilityMockPolicy {
  eligible: boolean;
  familyId: string;
  maxPerMock: 1;
  sourceDifficulty: ProbabilityDifficulty;
  effectiveDifficulty: ProbabilityDifficulty;
  examTargets: string[];
  reason?: string;
}

const LEARNING_ONLY_QLS = new Set(["PRB-QL-004", "PRB-QL-010"]);
const ROUTINE_HARD_QLS = new Set([
  "PRB-QL-705",
  "PRB-QL-706",
  "PRB-QL-707",
  "PRB-QL-708",
  "PRB-QL-807",
  "PRB-QL-808",
  "PRB-QL-815",
  "PRB-QL-816",
  "PRB-QL-823",
]);

function numberValue(parameters: GeneratedParameters, key: string, fallback = 0): number {
  const value = parameters[key];
  return typeof value === "number" ? value : fallback;
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

function choose(total: number, selected: number): number {
  if (selected < 0 || selected > total) return 0;
  const compact = Math.min(selected, total - selected);
  let result = 1;
  for (let index = 1; index <= compact; index += 1) {
    result = (result * (total - index + 1)) / index;
  }
  return Math.round(result);
}

function descending(start: number, count: number): number[] {
  return Array.from({ length: count }, (_, index) => start - index);
}

function product(values: number[]): number {
  return values.reduce((result, value) => result * value, 1);
}

function qlNumber(entry: ProbabilityTaskRegistryEntry): number {
  const match = entry.qlId.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function objectContext(entry: ProbabilityTaskRegistryEntry): { plural: string; singular: string } {
  const contexts = [
    { plural: "balls", singular: "ball" },
    { plural: "marbles", singular: "marble" },
    { plural: "pens", singular: "pen" },
    { plural: "coloured stones", singular: "stone" },
  ];
  return contexts[qlNumber(entry) % contexts.length]!;
}

function combinationExpansion(total: number, selected: number): string {
  const result = choose(total, selected);
  const compact = Math.min(selected, total - selected);
  if (compact === 0) return `C(${total},${selected}) = 1`;
  if (compact === 1) return `C(${total},${selected}) = ${total}`;
  const numerator = descending(total, compact);
  const denominator = descending(compact, compact);
  return `C(${total},${selected}) = ${total}!/(${selected}! × ${total - selected}!) = (${numerator.join(" × ")})/(${denominator.join(" × ")}) = ${result}`;
}

function simplificationLine(numerator: number, denominator: number, answer: string): string | null {
  const divisor = gcd(numerator, denominator);
  if (divisor <= 1) return null;
  return `Simplification — Divide the numerator and denominator by ${divisor}: (${numerator} ÷ ${divisor})/(${denominator} ÷ ${divisor}) = ${answer}.`;
}

function successiveSameTypeExplanation(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  solved: SolvedProbability,
): string[] {
  const red = numberValue(parameters, "red");
  const blue = numberValue(parameters, "blue");
  const total = red + blue;
  const denominator = total * (total - 1);
  const redRed = red * (red - 1);
  const blueBlue = blue * (blue - 1);
  const favourable = redRed + blueBlue;
  const context = objectContext(entry);
  const lines = [
    `Method — The ${context.plural} can have the same colour in two mutually exclusive orders: red-red or blue-blue. Calculate both probabilities and add them.`,
    `Step 1 — P(red-red) = ${red}/${total} × ${red - 1}/${total - 1} = ${redRed}/${denominator}.`,
    `Step 2 — P(blue-blue) = ${blue}/${total} × ${blue - 1}/${total - 1} = ${blueBlue}/${denominator}.`,
    `Step 3 — P(same colour) = ${redRed}/${denominator} + ${blueBlue}/${denominator} = ${favourable}/${denominator}.`,
  ];
  const simplification = simplificationLine(favourable, denominator, solved.exactDisplay);
  if (simplification) lines.push(simplification);
  lines.push("Key point — Red-red and blue-blue cannot occur together, so their probabilities are added.");
  lines.push(`Answer — The required probability is ${solved.exactDisplay}.`);
  return lines;
}

function successiveDifferentTypeExplanation(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  solved: SolvedProbability,
): string[] {
  const red = numberValue(parameters, "red");
  const blue = numberValue(parameters, "blue");
  const total = red + blue;
  const denominator = total * (total - 1);
  const oneOrder = red * blue;
  const favourable = oneOrder * 2;
  const context = objectContext(entry);
  const lines = [
    `Method — Different colours can occur in two mutually exclusive orders for the ${context.plural}: red-blue or blue-red. Calculate both and add them.`,
    `Step 1 — P(red-blue) = ${red}/${total} × ${blue}/${total - 1} = ${oneOrder}/${denominator}.`,
    `Step 2 — P(blue-red) = ${blue}/${total} × ${red}/${total - 1} = ${oneOrder}/${denominator}.`,
    `Step 3 — P(different colours) = ${oneOrder}/${denominator} + ${oneOrder}/${denominator} = ${favourable}/${denominator}.`,
  ];
  const simplification = simplificationLine(favourable, denominator, solved.exactDisplay);
  if (simplification) lines.push(simplification);
  lines.push("Key point — Both possible colour orders must be included because the draws are successive.");
  lines.push(`Answer — The required probability is ${solved.exactDisplay}.`);
  return lines;
}

function positionSymmetryExplanation(parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const men = numberValue(parameters, "men");
  const women = numberValue(parameters, "women");
  const total = men + women;
  return [
    "Method — Use symmetry at the first post. Every person is equally likely to receive that post, so compare the number of women with the total number of people.",
    `Step 1 — There are ${total} people altogether: ${men} men + ${women} women = ${total}.`,
    `Step 2 — ${women} of the ${total} people are women, so P(first post goes to a woman) = ${women}/${total}.`,
    `Step 3 — ${women}/${total} = ${solved.exactDisplay}.`,
    "Key point — Assignments to the remaining posts do not change the probability for the first post.",
    `Answer — The required probability is ${solved.exactDisplay}.`,
  ];
}

function numberFormationExplanation(parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const minDigit = numberValue(parameters, "minDigit", 1);
  const maxDigit = numberValue(parameters, "maxDigit");
  const length = numberValue(parameters, "length");
  const digitCount = maxDigit - minDigit + 1;
  const totalFactors = descending(digitCount, length);
  const total = product(totalFactors);
  const evenChoices = Array.from({ length: digitCount }, (_, index) => minDigit + index)
    .filter((digit) => digit % 2 === 0).length;
  const remainingFactors = descending(digitCount - 1, length - 1);
  const remainingWays = product(remainingFactors);
  const favourable = evenChoices * remainingWays;
  const lines = [
    "Method — Position matters, so use permutations. For an even number, first fix an even unit digit and then arrange the remaining digits.",
    `Step 1 — Total ${length}-digit numbers = ${digitCount}P${length} = ${digitCount}!/${digitCount - length}! = ${totalFactors.join(" × ")} = ${total}.`,
    `Step 2 — The unit digit has ${evenChoices} even choices. After fixing it, the remaining ${length - 1} positions can be filled in ${digitCount - 1}P${length - 1} = ${digitCount - 1}!/${digitCount - length}! = ${remainingFactors.join(" × ")} = ${remainingWays} ways.`,
    `Step 3 — Favourable even numbers = ${evenChoices} × ${remainingWays} = ${favourable}.`,
    `Step 4 — Probability = favourable cases ÷ total cases = ${favourable}/${total}.`,
  ];
  const simplification = simplificationLine(favourable, total, solved.exactDisplay);
  if (simplification) lines.push(simplification);
  lines.push("Key point — Once the unit digit is fixed, it cannot be reused in the other positions.");
  lines.push(`Answer — The required probability is ${solved.exactDisplay}.`);
  return lines;
}

function reverseCommitteeCountExplanation(parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const men = numberValue(parameters, "men");
  const women = numberValue(parameters, "women");
  const committeeSize = numberValue(parameters, "committeeSize");
  const requiredWomen = numberValue(parameters, "requiredWomen", 1);
  const requiredMen = committeeSize - requiredWomen;
  const womenWays = choose(women, requiredWomen);
  const menWays = choose(men, requiredMen);
  return [
    "Method — A committee is an unordered selection. Choose the required women and men separately with combinations, then multiply the independent choices.",
    `Step 1 — Ways to choose ${requiredWomen} ${requiredWomen === 1 ? "woman" : "women"}: ${combinationExpansion(women, requiredWomen)}.`,
    `Step 2 — Ways to choose ${requiredMen} ${requiredMen === 1 ? "man" : "men"}: ${combinationExpansion(men, requiredMen)}.`,
    `Step 3 — Required committees = ${womenWays} × ${menWays} = ${solved.exactDisplay}.`,
    "Key point — No division by the total number of committees is needed because the question asks for a count, not a probability.",
    `Answer — The required number of committees is ${solved.exactDisplay}.`,
  ];
}

export function remodelExamReadinessStem(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  existingStem: string,
): string {
  if (entry.qlId === "PRB-QL-708") {
    const men = numberValue(parameters, "men");
    const women = numberValue(parameters, "women");
    const committeeSize = numberValue(parameters, "committeeSize");
    const requiredWomen = numberValue(parameters, "requiredWomen", 1);
    return `A ${committeeSize}-member committee is formed from ${men} men and ${women} women. How many committees contain exactly ${requiredWomen} ${requiredWomen === 1 ? "woman" : "women"}?`;
  }

  if (entry.qlId === "PRB-QL-802") {
    const total = numberValue(parameters, "total");
    const overlap = numberValue(parameters, "overlap");
    return `In a group of ${total} students, ${overlap} students play both cricket and football. What is the probability that a randomly selected student plays both games?`;
  }

  return existingStem;
}

export function remodelExamReadinessExplanation(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  solved: SolvedProbability,
  existingExplanation: string[],
): string[] {
  if (entry.solveMode === "findSameTypeInSuccessiveDraws") {
    return successiveSameTypeExplanation(entry, parameters, solved);
  }
  if (entry.solveMode === "findDifferentTypesInSuccessiveDraws") {
    return successiveDifferentTypeExplanation(entry, parameters, solved);
  }
  if (entry.qlId === "PRB-QL-705") {
    return positionSymmetryExplanation(parameters, solved);
  }
  if (entry.solveMode === "findNumberFormationProbability") {
    return numberFormationExplanation(parameters, solved);
  }
  if (entry.qlId === "PRB-QL-708") {
    return reverseCommitteeCountExplanation(parameters, solved);
  }
  return existingExplanation;
}

export function buildProbabilityMockPolicy(entry: ProbabilityTaskRegistryEntry): ProbabilityMockPolicy {
  const eligible = !LEARNING_ONLY_QLS.has(entry.qlId);
  const effectiveDifficulty: ProbabilityDifficulty = ROUTINE_HARD_QLS.has(entry.qlId)
    ? "Medium"
    : entry.difficulty;
  return {
    eligible,
    familyId: `${entry.cpId}:${entry.solveMode}`,
    maxPerMock: 1,
    sourceDifficulty: entry.difficulty,
    effectiveDifficulty,
    examTargets: entry.packageId === "PRB-001"
      ? ["SSC_CGL_CHSL", "BANKING_PRELIMS", "PUNJAB_RECRUITMENT"]
      : ["BANKING_PRELIMS", "BANKING_MAINS", "PUNJAB_RECRUITMENT"],
    reason: eligible
      ? "Select at most one question from this stem family in a mock."
      : "Learning-only certainty diagnostic; exclude from scored mocks.",
  };
}
