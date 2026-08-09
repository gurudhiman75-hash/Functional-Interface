import type { GeneratedParameters, ProbabilityTaskRegistryEntry, SolvedProbability } from "./types";

function numberValue(parameters: GeneratedParameters, key: string, fallback = 0): number {
  const value = parameters[key];
  return typeof value === "number" ? value : fallback;
}

function choose(total: number, selected: number): number {
  if (selected < 0 || selected > total) return 0;
  let result = 1;
  const count = Math.min(selected, total - selected);
  for (let index = 1; index <= count; index += 1) {
    result = (result * (total - index + 1)) / index;
  }
  return Math.round(result);
}

function factorial(value: number): number {
  let result = 1;
  for (let current = 2; current <= value; current += 1) result *= current;
  return result;
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

function productText(values: number[]): string {
  return values.join(" × ");
}

function descendingProduct(start: number, count: number): number[] {
  return Array.from({ length: count }, (_, index) => start - index);
}

function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return count === 1 ? singular : pluralForm;
}

function qlNumber(entry: ProbabilityTaskRegistryEntry): number {
  const match = entry.qlId.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

interface ObjectContext {
  item: string;
  singular: string;
}

function objectContext(entry: ProbabilityTaskRegistryEntry): ObjectContext {
  const contexts: ObjectContext[] = [
    { item: "balls", singular: "ball" },
    { item: "marbles", singular: "marble" },
    { item: "pens", singular: "pen" },
    { item: "coloured stones", singular: "stone" },
  ];
  return contexts[qlNumber(entry) % contexts.length]!;
}

function combinationExpansion(total: number, selected: number): string {
  const result = choose(total, selected);
  if (selected === 0 || selected === total) return `C(${total},${selected}) = 1.`;
  if (selected === 1 || selected === total - 1) return `C(${total},${selected}) = ${total}.`;

  const compactSelected = Math.min(selected, total - selected);
  const numerator = descendingProduct(total, compactSelected);
  const denominator = descendingProduct(compactSelected, compactSelected);
  return `C(${total},${selected}) = ${total}!/(${selected}! × ${total - selected}!) = (${productText(numerator)})/(${productText(denominator)}) = ${result}.`;
}

function permutationExpansion(total: number, selected: number): string {
  const factors = descendingProduct(total, selected);
  const result = factors.reduce((product, value) => product * value, 1);
  return `${total}P${selected} = ${total}!/${total - selected}! = ${productText(factors)} = ${result}.`;
}

function probabilityClosing(lines: string[], favourable: number, total: number, answer: string, stepNumber: number): void {
  lines.push(`Step ${stepNumber} — Probability = favourable cases ÷ total cases = ${favourable}/${total}.`);
  const divisor = gcd(favourable, total);
  if (divisor > 1) {
    lines.push(`Simplification — Divide the numerator and denominator by ${divisor}: (${favourable} ÷ ${divisor})/(${total} ÷ ${divisor}) = ${answer}.`);
  }
}

function simultaneousSelectionExplanation(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  solved: SolvedProbability,
): string[] {
  const mode = entry.solveMode;
  const red = numberValue(parameters, "red");
  const blue = numberValue(parameters, "blue");
  const draw = numberValue(parameters, "draw", 2);
  const context = objectContext(entry);
  const totalItems = red + blue;
  const totalSelections = choose(totalItems, draw);
  const favourable = Number(solved.evidence.favourableOutcomeCount ?? 0n);
  const lines: string[] = [
    `Method — Since the ${context.item} are selected together, order does not matter. Use C(n,r) = n!/[r!(n-r)!], then use probability = favourable selections ÷ total selections.`,
    `Step 1 — Total possible selections of ${context.item} = C(${totalItems},${draw}).`,
    `Step 2 — ${combinationExpansion(totalItems, draw)}`,
  ];

  let nextStep = 3;
  if (mode === "findSimultaneousSameTypeProbability") {
    const redWays = choose(red, draw);
    const blueWays = choose(blue, draw);
    lines.push(`Step ${nextStep} — Red-only ${context.item}: ${combinationExpansion(red, draw)}`);
    nextStep += 1;
    lines.push(`Step ${nextStep} — Blue-only ${context.item}: ${combinationExpansion(blue, draw)}`);
    nextStep += 1;
    lines.push(`Step ${nextStep} — Favourable selections of ${context.item} = ${redWays} + ${blueWays} = ${favourable}.`);
    nextStep += 1;
  } else if (mode === "findSimultaneousDifferentTypeProbability" && draw === 2) {
    const redWays = choose(red, 1);
    const blueWays = choose(blue, 1);
    lines.push(`Step ${nextStep} — Choose 1 red ${context.singular} and 1 blue ${context.singular}: C(${red},1) × C(${blue},1) = ${redWays} × ${blueWays} = ${favourable}.`);
    nextStep += 1;
  } else if (mode === "findSimultaneousDifferentTypeProbability") {
    const allRed = choose(red, draw);
    const allBlue = choose(blue, draw);
    lines.push(`Step ${nextStep} — All-red selections of ${context.item}: ${combinationExpansion(red, draw)}`);
    nextStep += 1;
    lines.push(`Step ${nextStep} — All-blue selections of ${context.item}: ${combinationExpansion(blue, draw)}`);
    nextStep += 1;
    lines.push(`Step ${nextStep} — Favourable selections of ${context.item} = ${totalSelections} - ${allRed} - ${allBlue} = ${favourable}.`);
    nextStep += 1;
  } else if (["findExactCompositionProbability", "findSelectionProbabilityUsingCombination"].includes(mode)) {
    const exactRed = numberValue(parameters, "exactRed", 1);
    const exactBlue = draw - exactRed;
    const redWays = choose(red, exactRed);
    const blueWays = choose(blue, exactBlue);
    lines.push(`Step ${nextStep} — Ways to choose the red ${context.item}: ${combinationExpansion(red, exactRed)}`);
    nextStep += 1;
    lines.push(`Step ${nextStep} — Ways to choose the blue ${context.item}: ${combinationExpansion(blue, exactBlue)}`);
    nextStep += 1;
    lines.push(`Step ${nextStep} — Favourable selections of ${context.item} = ${redWays} × ${blueWays} = ${favourable}.`);
    nextStep += 1;
  } else if (mode === "findNoObjectOfTypeProbability") {
    lines.push(`Step ${nextStep} — No red ${context.singular} means all selected ${context.item} are blue: ${combinationExpansion(blue, draw)}`);
    nextStep += 1;
  } else if (mode === "findAtLeastOneObjectOfType") {
    const allBlue = choose(blue, draw);
    lines.push(`Step ${nextStep} — Use the complement. Selections of ${context.item} with no red ${context.singular}: ${combinationExpansion(blue, draw)}`);
    nextStep += 1;
    lines.push(`Step ${nextStep} — Favourable selections of ${context.item} = ${totalSelections} - ${allBlue} = ${favourable}.`);
    nextStep += 1;
  }

  probabilityClosing(lines, favourable, totalSelections, solved.exactDisplay, nextStep);
  lines.push(`Key point — C(n,r) is used because selecting the same ${context.item} in a different order does not create a new selection.`);
  lines.push(`Answer — The required probability is ${solved.exactDisplay}.`);
  return lines;
}

function committeeExplanation(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  solved: SolvedProbability,
): string[] {
  const mode = entry.solveMode;
  const men = numberValue(parameters, "men");
  const women = numberValue(parameters, "women");
  const committeeSize = numberValue(parameters, "committeeSize");
  const requiredWomen = numberValue(parameters, "requiredWomen", 1);
  const requiredMen = committeeSize - requiredWomen;
  const totalPeople = men + women;
  const totalCommittees = choose(totalPeople, committeeSize);
  const womenLabel = plural(requiredWomen, "woman", "women");
  const menLabel = plural(requiredMen, "man", "men");
  const lines: string[] = [
    "Method — A committee is an unordered selection. Use C(n,r) = n!/[r!(n-r)!]. For a probability, divide the number of required committees by the total number of committees.",
  ];

  if (mode === "findReverseCountFromProbability") {
    const womenWays = choose(women, requiredWomen);
    const menWays = choose(men, requiredMen);
    lines.push(`Step 1 — Choose ${requiredWomen} ${womenLabel} from ${women}: ${combinationExpansion(women, requiredWomen)}`);
    lines.push(`Step 2 — Choose ${requiredMen} ${menLabel} from ${men}: ${combinationExpansion(men, requiredMen)}`);
    lines.push(`Step 3 — Required committees = ${womenWays} × ${menWays} = ${solved.exactDisplay}.`);
    lines.push("Key point — The order in which committee members are named is irrelevant, so each committee must be counted only once.");
    lines.push(`Answer — The required number is ${solved.exactDisplay}.`);
    return lines;
  }

  lines.push(`Step 1 — Total committees = C(${totalPeople},${committeeSize}).`);
  lines.push(`Step 2 — ${combinationExpansion(totalPeople, committeeSize)}`);

  if (mode === "findRestrictedSelectionProbability") {
    const excluded = choose(men, committeeSize);
    const favourable = totalCommittees - excluded;
    lines.push(`Step 3 — Use the complement. Committees containing no woman are all-men committees: ${combinationExpansion(men, committeeSize)}`);
    lines.push(`Step 4 — Committees with at least one woman = ${totalCommittees} - ${excluded} = ${favourable}.`);
    probabilityClosing(lines, favourable, totalCommittees, solved.exactDisplay, 5);
  } else {
    const womenWays = choose(women, requiredWomen);
    const menWays = choose(men, requiredMen);
    const favourable = womenWays * menWays;
    lines.push(`Step 3 — Choose ${requiredWomen} ${womenLabel} from ${women}: ${combinationExpansion(women, requiredWomen)}`);
    lines.push(`Step 4 — Choose ${requiredMen} ${menLabel} from ${men}: ${combinationExpansion(men, requiredMen)}`);
    lines.push(`Step 5 — Required committees = ${womenWays} × ${menWays} = ${favourable}.`);
    probabilityClosing(lines, favourable, totalCommittees, solved.exactDisplay, 6);
  }

  lines.push("Key point — Combinations count each committee once because changing the order of the same members does not create a different committee.");
  lines.push(`Answer — The required probability is ${solved.exactDisplay}.`);
  return lines;
}

function arrangementExplanation(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  solved: SolvedProbability,
): string[] | null {
  const mode = entry.solveMode;
  if (mode === "findTogetherOrApartProbability") {
    const people = numberValue(parameters, "people");
    const relation = typeof parameters.relation === "string" ? parameters.relation : "TOGETHER";
    const total = factorial(people);
    const adjacent = 2 * factorial(people - 1);
    const favourable = relation === "APART" ? total - adjacent : adjacent;
    const lines = [
      "Method — For n distinct people, total linear arrangements = n!. To count two specified people together, treat them as one block and multiply by 2 for their internal order.",
      `Step 1 — Total arrangements = ${people}! = ${productText(descendingProduct(people, people))} = ${total}.`,
      `Step 2 — Adjacent arrangements = 2 × ${people - 1}! = 2 × ${productText(descendingProduct(people - 1, people - 1))} = ${adjacent}.`,
    ];
    if (relation === "APART") lines.push(`Step 3 — Non-adjacent arrangements = ${total} - ${adjacent} = ${favourable}.`);
    probabilityClosing(lines, favourable, total, solved.exactDisplay, relation === "APART" ? 4 : 3);
    lines.push("Key point — The two specified people can appear inside the block in either order.");
    lines.push(`Answer — The required probability is ${solved.exactDisplay}.`);
    return lines;
  }

  if (mode === "findNumberFormationProbability") {
    const minDigit = numberValue(parameters, "minDigit", 1);
    const maxDigit = numberValue(parameters, "maxDigit");
    const length = numberValue(parameters, "length");
    const availableDigits = maxDigit - minDigit + 1;
    const evenDigits = Array.from({ length: availableDigits }, (_, index) => minDigit + index).filter((digit) => digit % 2 === 0).length;
    const total = descendingProduct(availableDigits, length).reduce((product, value) => product * value, 1);
    const remainingWays = descendingProduct(availableDigits - 1, length - 1).reduce((product, value) => product * value, 1);
    const favourable = evenDigits * remainingWays;
    const lines = [
      "Method — Without repetition, use nPr = n!/(n-r)! for ordered digit arrangements. An even number must have an even final digit.",
      `Step 1 — Total numbers: ${permutationExpansion(availableDigits, length)}`,
      `Step 2 — The final digit has ${evenDigits} even choices. After fixing it, the other ${length - 1} places can be filled in ${remainingWays} ways.`,
      `Step 3 — Favourable even numbers = ${evenDigits} × ${remainingWays} = ${favourable}.`,
    ];
    probabilityClosing(lines, favourable, total, solved.exactDisplay, 4);
    lines.push("Key point — Position matters in a number, so permutations—not combinations—are required.");
    lines.push(`Answer — The required probability is ${solved.exactDisplay}.`);
    return lines;
  }

  return null;
}

const simultaneousModes = new Set([
  "findSimultaneousSameTypeProbability",
  "findSimultaneousDifferentTypeProbability",
  "findExactCompositionProbability",
  "findSelectionProbabilityUsingCombination",
  "findNoObjectOfTypeProbability",
  "findAtLeastOneObjectOfType",
]);

const committeeModes = new Set([
  "findSelectionProbabilityUsingCombination",
  "findCommitteeCompositionProbability",
  "findRestrictedSelectionProbability",
  "findReverseCountFromProbability",
]);

export function remodelTeachingCalculation(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  solved: SolvedProbability,
  existingExplanation: string[],
): string[] {
  if (entry.cpId === "PRB-CP-005" && simultaneousModes.has(entry.solveMode)) {
    return simultaneousSelectionExplanation(entry, parameters, solved);
  }

  if (entry.cpId === "PRB-CP-008" && committeeModes.has(entry.solveMode)) {
    return committeeExplanation(entry, parameters, solved);
  }

  if (entry.cpId === "PRB-CP-008") {
    return arrangementExplanation(entry, parameters, solved) ?? existingExplanation;
  }

  return existingExplanation;
}
