import type { GeneratedParameters, ProbabilityTaskRegistryEntry, SolvedProbability } from "./types";
import { rational, rationalText } from "./rational";

const numberValue = (parameters: GeneratedParameters, key: string, fallback = 0): number => {
  const value = parameters[key];
  return typeof value === "number" ? value : fallback;
};

const textValue = (parameters: GeneratedParameters, key: string, fallback = ""): string => {
  const value = parameters[key];
  return typeof value === "string" ? value : fallback;
};

const fraction = (numerator: number | bigint, denominator: number | bigint): string => rationalText(rational(numerator, denominator));
const plural = (count: number, singular: string, pluralForm = `${singular}s`): string => count === 1 ? singular : pluralForm;
const tidy = (value: string): string => value.replace(/\s+/g, " ").replace(/\s+([?.!,])/g, "$1").trim();

function choose(total: number, selected: number): number {
  if (selected < 0 || selected > total) return 0;
  let result = 1;
  for (let index = 1; index <= Math.min(selected, total - selected); index += 1) {
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
  let a = Math.abs(left), b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

function qlNumber(entry: ProbabilityTaskRegistryEntry): number {
  const match = entry.qlId.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function variant(entry: ProbabilityTaskRegistryEntry, count: number): number {
  return qlNumber(entry) % count;
}

function simplifiedRatio(left: number, right: number): string {
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
}

function probabilityLine(favourable: number | bigint | string, total: number | bigint | string, answer: string): string {
  const raw = `${favourable}/${total}`;
  return raw === answer
    ? `Therefore, the required probability is ${answer}.`
    : `Therefore, the required probability is ${raw} = ${answer}.`;
}

interface ObjectContext {
  container: string;
  item: string;
  singular: string;
  selectionVerb: string;
}

function objectContext(entry: ProbabilityTaskRegistryEntry): ObjectContext {
  const contexts: ObjectContext[] = [
    { container: "A bag", item: "balls", singular: "ball", selectionVerb: "drawn" },
    { container: "A jar", item: "marbles", singular: "marble", selectionVerb: "selected" },
    { container: "A box", item: "pens", singular: "pen", selectionVerb: "selected" },
    { container: "A pouch", item: "coloured stones", singular: "stone", selectionVerb: "drawn" },
  ];
  return contexts[variant(entry, contexts.length)]!;
}

interface GroupContext {
  subjectA: string;
  subjectB: string;
  groupNoun: string;
  action: string;
}

function groupContext(entry: ProbabilityTaskRegistryEntry): GroupContext {
  const contexts: GroupContext[] = [
    { subjectA: "Mathematics", subjectB: "English", groupNoun: "students", action: "passed" },
    { subjectA: "Quantitative Aptitude", subjectB: "Reasoning", groupNoun: "candidates", action: "qualified in" },
    { subjectA: "cricket", subjectB: "football", groupNoun: "students", action: "play" },
    { subjectA: "Section A", subjectB: "Section B", groupNoun: "candidates", action: "cleared" },
  ];
  return contexts[variant(entry, contexts.length)]!;
}

function groupAction(context: GroupContext, count: number, subject: string): string {
  if (context.action === "play") return `${count} ${context.groupNoun} play ${subject}`;
  if (context.action === "qualified in") return `${count} ${context.groupNoun} qualified in ${subject}`;
  if (context.action === "cleared") return `${count} ${context.groupNoun} cleared ${subject}`;
  return `${count} ${context.groupNoun} passed ${subject}`;
}

function renderObjectStem(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters, baseStem: string): string {
  const mode = entry.solveMode;
  const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), draw = numberValue(parameters, "draw", 1);
  const context = objectContext(entry);
  const composition = `${context.container} contains ${red} red and ${blue} blue ${context.item}.`;

  if (mode === "findSingleDrawColourProbability") {
    if (variant(entry, 4) === 3) {
      return `The ratio of red to blue ${context.item} in a container is ${simplifiedRatio(red, blue)}. One ${context.singular} is selected at random. What is the probability that it is red?`;
    }
    return `${composition} One ${context.singular} is ${context.selectionVerb} at random. What is the probability that it is red?`;
  }
  if (mode === "findMissingObjectCountFromProbability") {
    return `${context.container} contains ${red + blue} ${context.item}. The probability of selecting a red ${context.singular} is ${fraction(red, red + blue)}. How many red ${context.item} are there?`;
  }
  if (mode === "findSimultaneousSameTypeProbability") {
    return `${composition} ${draw} ${context.item} are selected together without replacement. What is the probability that all selected ${context.item} are of the same colour?`;
  }
  if (mode === "findSimultaneousDifferentTypeProbability") {
    return draw === 2
      ? `${composition} Two ${context.item} are selected together without replacement. What is the probability that one is red and the other is blue?`
      : `${composition} ${draw} ${context.item} are selected together without replacement. What is the probability that both colours are represented?`;
  }
  if (["findExactCompositionProbability", "findSelectionProbabilityUsingCombination"].includes(mode)) {
    const exactRed = numberValue(parameters, "exactRed", 1);
    return `${composition} ${draw} ${context.item} are selected together without replacement. What is the probability that exactly ${exactRed === 1 ? "one" : exactRed} selected ${plural(exactRed, context.singular)} ${exactRed === 1 ? "is" : "are"} red?`;
  }
  if (mode === "findNoObjectOfTypeProbability") {
    return `${composition} ${draw} ${context.item} are selected together without replacement. What is the probability that none of them is red?`;
  }
  if (mode === "findAtLeastOneObjectOfType") {
    return `${composition} ${draw} ${context.item} are selected together without replacement. What is the probability that at least one is red?`;
  }
  if (["findSuccessiveIndependentProbability", "findWithReplacementProbability"].includes(mode)) {
    return `${composition} One ${context.singular} is ${context.selectionVerb} and replaced before a second selection. What is the probability that both selected ${context.item} are red?`;
  }
  if (["findSuccessiveDependentProbability", "findWithoutReplacementProbability"].includes(mode)) {
    return `${composition} Two ${context.item} are selected one after another without replacement. What is the probability that both are red?`;
  }
  if (mode === "findOrderedDrawSequenceProbability") {
    return `${composition} Two ${context.item} are selected one after another without replacement. What is the probability of getting red first and blue second?`;
  }
  if (mode === "findSameTypeInSuccessiveDraws") {
    return `${composition} Two ${context.item} are selected one after another without replacement. What is the probability that both are of the same colour?`;
  }
  if (mode === "findDifferentTypesInSuccessiveDraws") {
    return `${composition} Two ${context.item} are selected one after another without replacement. What is the probability that they are of different colours?`;
  }
  if (mode === "findAtLeastOneAcrossIndependentStages") {
    return `${composition} Two selections are made with replacement. What is the probability of getting at least one red ${context.singular}?`;
  }
  return baseStem;
}

function renderEventGroupStem(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters): string {
  const mode = entry.solveMode;
  const total = numberValue(parameters, "total"), a = numberValue(parameters, "aCount"), b = numberValue(parameters, "bCount"), both = numberValue(parameters, "overlap");
  const context = groupContext(entry);
  const aText = groupAction(context, a, context.subjectA);
  const bText = groupAction(context, b, context.subjectB);
  const bothText = context.action === "play"
    ? `${both} ${both === 1 ? context.groupNoun.slice(0, -1) : context.groupNoun} ${both === 1 ? "plays" : "play"} both games`
    : `${both} ${both === 1 ? context.groupNoun.slice(0, -1) : context.groupNoun} ${both === 1 ? "meets" : "meet"} both conditions`;

  if (mode === "findUnionProbability") {
    return `In a group of ${total} ${context.groupNoun}, ${aText}, ${bText}, and ${bothText}. What is the probability that a randomly selected ${context.groupNoun.slice(0, -1)} meets at least one condition?`;
  }
  if (mode === "findIntersectionProbability") {
    return `In a group of ${total} ${context.groupNoun}, ${bothText}. What is the probability that a randomly selected ${context.groupNoun.slice(0, -1)} meets both conditions?`;
  }
  if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) {
    return `In a group of ${total} ${context.groupNoun}, ${aText}, ${bText}, and ${bothText}. What is the probability that a randomly selected ${context.groupNoun.slice(0, -1)} meets exactly one condition?`;
  }
  if (mode === "findNeitherEventProbability") {
    return `In a group of ${total} ${context.groupNoun}, ${aText}, ${bText}, and ${bothText}. What is the probability that a randomly selected ${context.groupNoun.slice(0, -1)} meets neither condition?`;
  }
  const union = a + b - both;
  return `For a group of ${total} ${context.groupNoun}, P(${context.subjectA}) = ${fraction(a, total)}, P(${context.subjectB}) = ${fraction(b, total)}, and P(${context.subjectA} or ${context.subjectB}) = ${fraction(union, total)}. Find P(${context.subjectA} and ${context.subjectB}).`;
}

export function remodelProbabilityStem(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  _solved: SolvedProbability,
  baseStem: string,
): string {
  const mode = entry.solveMode;

  const objectModes = [
    "findSingleDrawColourProbability", "findMissingObjectCountFromProbability", "findSimultaneousSameTypeProbability",
    "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability", "findSelectionProbabilityUsingCombination",
    "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType", "findSuccessiveIndependentProbability",
    "findWithReplacementProbability", "findSuccessiveDependentProbability", "findWithoutReplacementProbability",
    "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws", "findDifferentTypesInSuccessiveDraws",
    "findAtLeastOneAcrossIndependentStages",
  ];
  if (objectModes.includes(mode)) return tidy(renderObjectStem(entry, parameters, baseStem));

  if (mode === "findProbabilityFromSimpleFrequencyTable") {
    const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), green = numberValue(parameters, "green");
    const target = textValue(parameters, "target", "red");
    const contexts = ["balls in a bag", "pens in a box", "marbles in a jar", "coloured stones in a pouch"];
    const [item, container] = contexts[variant(entry, contexts.length)]!.split(" in a ");
    return tidy(`A ${container} contains ${red} red, ${blue} blue and ${green} green ${item}. One is selected at random. What is the probability that it is ${target}?`);
  }

  if (mode === "findNumberRangePropertyProbability") {
    const lower = numberValue(parameters, "lower", 1), upper = numberValue(parameters, "upper");
    const property = textValue(parameters, "property");
    let condition = property.toLowerCase();
    if (property === "GREATER_THAN") condition = `greater than ${numberValue(parameters, "threshold")}`;
    if (property === "LESS_THAN") condition = `less than ${numberValue(parameters, "threshold")}`;
    if (property === "DIVISIBLE") condition = `divisible by ${numberValue(parameters, "divisor")}`;
    return `Tickets numbered ${lower} to ${upper} are mixed thoroughly, and one ticket is drawn at random. What is the probability that its number is ${condition}?`;
  }

  if (["findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable"].includes(mode)) {
    const total = numberValue(parameters, "mathTotal"), both = numberValue(parameters, "both");
    const context = variant(entry, 2) === 0
      ? { first: "Mathematics", second: "English", people: "students" }
      : { first: "Quantitative Aptitude", second: "Reasoning", people: "candidates" };
    return `Of the ${total} ${context.people} who cleared ${context.first}, ${both} also cleared ${context.second}. One of these ${total} ${context.people} is selected at random. What is the probability that the selected ${context.people.slice(0, -1)} also cleared ${context.second}?`;
  }

  if (mode === "findRandomArrangementPropertyProbability") {
    const people = numberValue(parameters, "people");
    return `${people} candidates stand in a queue in a random order. What is the probability that a specified candidate occupies the first position?`;
  }

  if (mode === "findTogetherOrApartProbability") {
    const people = numberValue(parameters, "people"), apart = textValue(parameters, "relation", "TOGETHER") === "APART";
    return `${people} candidates stand in a queue in a random order. What is the probability that two specified candidates are ${apart ? "not adjacent" : "adjacent"}?`;
  }

  const eventModes = [
    "findUnionProbability", "findIntersectionProbability", "findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability",
    "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability",
  ];
  if (eventModes.includes(mode)) return tidy(renderEventGroupStem(entry, parameters));

  if (mode === "findMutuallyExclusiveUnion" && variant(entry, 2) === 1) {
    return `A candidate can receive either Scholarship A or Scholarship B, but not both. If P(A) = ${fraction(numberValue(parameters, "aNumerator"), numberValue(parameters, "aDenominator", 1))} and P(B) = ${fraction(numberValue(parameters, "bNumerator"), numberValue(parameters, "bDenominator", 1))}, what is the probability that the candidate receives a scholarship?`;
  }

  if (mode === "findIndependentIntersection" && variant(entry, 2) === 1) {
    return `A machine independently passes a mechanical test with probability ${fraction(numberValue(parameters, "aNumerator"), numberValue(parameters, "aDenominator", 1))} and an electrical test with probability ${fraction(numberValue(parameters, "bNumerator"), numberValue(parameters, "bDenominator", 1))}. What is the probability that it passes both tests?`;
  }

  return tidy(baseStem);
}

function simultaneousExplanation(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const mode = entry.solveMode;
  const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), draw = numberValue(parameters, "draw");
  const totalItems = red + blue;
  const totalSelections = choose(totalItems, draw);
  const favourable = solved.evidence.favourableOutcomeCount?.toString() ?? "0";
  const lines = [
    `Because the ${draw} items are selected together, their order does not matter; use combinations.`,
    `The number of possible selections is C(${totalItems},${draw}) = ${totalSelections}.`,
  ];

  if (mode === "findSimultaneousSameTypeProbability") {
    lines.push(`Selections of one colour = C(${red},${draw}) + C(${blue},${draw}) = ${favourable}.`);
  } else if (mode === "findSimultaneousDifferentTypeProbability") {
    if (draw === 2) lines.push(`Select one red and one blue item: C(${red},1) × C(${blue},1) = ${favourable}.`);
    else lines.push(`Subtract the all-red and all-blue selections: ${totalSelections} - C(${red},${draw}) - C(${blue},${draw}) = ${favourable}.`);
  } else if (["findExactCompositionProbability", "findSelectionProbabilityUsingCombination"].includes(mode)) {
    const exactRed = numberValue(parameters, "exactRed", 1);
    lines.push(`Choose ${exactRed} red and ${draw - exactRed} blue: C(${red},${exactRed}) × C(${blue},${draw - exactRed}) = ${favourable}.`);
  } else if (mode === "findNoObjectOfTypeProbability") {
    lines.push(`No red item means all ${draw} selected items are blue: C(${blue},${draw}) = ${favourable}.`);
  } else {
    lines.push(`Use the complement of selecting only blue items: ${totalSelections} - C(${blue},${draw}) = ${favourable}.`);
  }
  lines.push(probabilityLine(favourable, totalSelections, solved.exactDisplay));
  return lines;
}

function successiveExplanation(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters, solved: SolvedProbability): string[] {
  const mode = entry.solveMode;
  const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), total = red + blue;

  if (["findSuccessiveIndependentProbability", "findWithReplacementProbability"].includes(mode)) {
    return [
      `The first item is replaced, so the composition remains ${red} red and ${blue} blue before the second selection.`,
      `Thus, P(red on each selection) = ${red}/${total}.`,
      `P(both red) = ${red}/${total} × ${red}/${total} = ${solved.exactDisplay}.`,
    ];
  }
  if (["findSuccessiveDependentProbability", "findWithoutReplacementProbability"].includes(mode)) {
    return [
      `On the first selection, P(red) = ${red}/${total}.`,
      `After one red item is removed, ${red - 1} red items remain among ${total - 1} items.`,
      `P(both red) = ${red}/${total} × ${red - 1}/${total - 1} = ${solved.exactDisplay}.`,
    ];
  }
  if (mode === "findOrderedDrawSequenceProbability") {
    return [
      `The order is fixed: red must occur first and blue second.`,
      `P(red first) = ${red}/${total}; after that, P(blue second) = ${blue}/${total - 1}.`,
      `Required probability = ${red}/${total} × ${blue}/${total - 1} = ${solved.exactDisplay}.`,
    ];
  }
  if (mode === "findSameTypeInSuccessiveDraws") {
    return [
      `The same colour can occur in two disjoint ways: red-red or blue-blue.`,
      `P(red-red) = ${red}/${total} × ${red - 1}/${total - 1}, and P(blue-blue) = ${blue}/${total} × ${blue - 1}/${total - 1}.`,
      `Adding the two cases gives ${solved.exactDisplay}.`,
    ];
  }
  if (mode === "findDifferentTypesInSuccessiveDraws") {
    return [
      `Different colours can occur as red-blue or blue-red, so both orders must be counted.`,
      `P = ${red}/${total} × ${blue}/${total - 1} + ${blue}/${total} × ${red}/${total - 1}.`,
      `After simplification, the required probability is ${solved.exactDisplay}.`,
    ];
  }
  return [
    `Use the complement: at least one red item fails only when both selections are blue.`,
    `Replacement keeps P(blue) = ${blue}/${total} on both selections.`,
    `P(at least one red) = 1 - (${blue}/${total} × ${blue}/${total}) = ${solved.exactDisplay}.`,
  ];
}

function conditionalExplanation(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters, solved: SolvedProbability, base: string[]): string[] {
  const mode = entry.solveMode;
  if (["findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable"].includes(mode)) {
    const restricted = numberValue(parameters, "mathTotal"), favourable = numberValue(parameters, "both");
    return [
      `The given condition restricts the sample space to the ${restricted} people who satisfy the first condition.`,
      `${favourable} of these ${restricted} people also satisfy the second condition.`,
      probabilityLine(favourable, restricted, solved.exactDisplay),
    ];
  }
  if (mode === "findConditionalCardProbability") {
    return [
      `Knowing that the card is a face card reduces the sample space to the 12 jacks, queens and kings.`,
      `Exactly 4 of these 12 face cards are kings.`,
      probabilityLine(4, 12, solved.exactDisplay),
    ];
  }
  if (mode === "findConditionalUrnProbability") {
    const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), total = red + blue;
    return [
      `The condition tells us that the first selected item was red and was not replaced.`,
      `Therefore, ${red - 1} red items remain among ${total - 1} items for the second selection.`,
      probabilityLine(red - 1, total - 1, solved.exactDisplay),
    ];
  }
  if (mode === "findReverseConditionalCount") {
    const restricted = numberValue(parameters, "restrictedTotal"), favourable = numberValue(parameters, "favourable");
    const probability = fraction(favourable, restricted);
    return [
      `Because the selection is made only from the restricted group, let the required number be x. Then x/${restricted} = ${probability}.`,
      `Hence, x = ${restricted} × ${probability} = ${solved.exactDisplay}.`,
      `Therefore, ${solved.exactDisplay} people satisfy the required condition.`,
    ];
  }
  return base;
}

function committeeAndArrangementExplanation(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters, solved: SolvedProbability, base: string[]): string[] {
  const mode = entry.solveMode;
  if (["findSelectionProbabilityUsingCombination", "findCommitteeCompositionProbability", "findRestrictedSelectionProbability", "findReverseCountFromProbability"].includes(mode) && entry.cpId === "PRB-CP-008") {
    const men = numberValue(parameters, "men"), women = numberValue(parameters, "women"), size = numberValue(parameters, "committeeSize"), requiredWomen = numberValue(parameters, "requiredWomen", 1);
    const totalPeople = men + women, totalCommittees = choose(totalPeople, size);
    if (mode === "findRestrictedSelectionProbability") {
      const allMen = choose(men, size), favourable = totalCommittees - allMen;
      return [
        `There are C(${totalPeople},${size}) = ${totalCommittees} possible committees.`,
        `Use the complement: committees with no woman = C(${men},${size}) = ${allMen}.`,
        `Hence, favourable committees = ${totalCommittees} - ${allMen} = ${favourable}, giving probability ${solved.exactDisplay}.`,
      ];
    }
    const favourable = choose(women, requiredWomen) * choose(men, size - requiredWomen);
    if (mode === "findReverseCountFromProbability") {
      return [
        `Choose ${requiredWomen} ${plural(requiredWomen, "woman", "women")} from ${women} and ${size - requiredWomen} ${plural(size - requiredWomen, "man", "men")} from ${men}.`,
        `Required committees = C(${women},${requiredWomen}) × C(${men},${size - requiredWomen}) = ${favourable}.`,
        `Therefore, the required count is ${solved.exactDisplay}.`,
      ];
    }
    return [
      `The total number of committees is C(${totalPeople},${size}) = ${totalCommittees}.`,
      `For the required composition, choose ${requiredWomen} from ${women} women and ${size - requiredWomen} from ${men} men: C(${women},${requiredWomen}) × C(${men},${size - requiredWomen}) = ${favourable}.`,
      probabilityLine(favourable, totalCommittees, solved.exactDisplay),
    ];
  }

  if (mode === "findRandomArrangementPropertyProbability") {
    const people = numberValue(parameters, "people");
    return [
      `Each of the ${people} candidates can occupy the first position in the queue.`,
      `Only one of these ${people} possibilities places the specified candidate first.`,
      probabilityLine(1, people, solved.exactDisplay),
    ];
  }

  if (mode === "findTogetherOrApartProbability") {
    const people = numberValue(parameters, "people"), apart = textValue(parameters, "relation", "TOGETHER") === "APART";
    const total = factorial(people), adjacent = 2 * factorial(people - 1);
    if (apart) {
      return [
        `There are ${people}! = ${total} unrestricted arrangements.`,
        `If the two specified candidates are treated as one block, adjacent arrangements = 2 × ${people - 1}! = ${adjacent}.`,
        `Non-adjacent arrangements = ${total} - ${adjacent} = ${total - adjacent}, so the probability is ${solved.exactDisplay}.`,
      ];
    }
    return [
      `There are ${people}! = ${total} unrestricted arrangements.`,
      `Treat the two specified candidates as one block; the block can be internally ordered in 2 ways. Thus, adjacent arrangements = 2 × ${people - 1}! = ${adjacent}.`,
      probabilityLine(adjacent, total, solved.exactDisplay),
    ];
  }

  if (mode === "findPositionRestrictionProbability") {
    const men = numberValue(parameters, "men"), women = numberValue(parameters, "women"), total = men + women;
    return [
      `Any of the ${total} people can receive the first post.`,
      `${women} of these ${total} people are women, and the remaining posts do not affect who receives the first post.`,
      probabilityLine(women, total, solved.exactDisplay),
    ];
  }

  if (mode === "findNumberFormationProbability") {
    const minDigit = numberValue(parameters, "minDigit", 1), maxDigit = numberValue(parameters, "maxDigit"), length = numberValue(parameters, "length");
    const digits = maxDigit - minDigit + 1;
    const evenDigits = Array.from({ length: digits }, (_, index) => minDigit + index).filter((digit) => digit % 2 === 0).length;
    const total = Array.from({ length }, (_, index) => digits - index).reduce((product, value) => product * value, 1);
    const remaining = Array.from({ length: length - 1 }, (_, index) => digits - 1 - index).reduce((product, value) => product * value, 1);
    const favourable = evenDigits * remaining;
    return [
      `Without repetition, the total number of ${length}-digit numbers is ${digits}P${length} = ${total}.`,
      `An even number must end in one of the ${evenDigits} available even digits. After fixing the last digit, the remaining places can be filled in ${remaining} ways.`,
      `Thus, favourable numbers = ${evenDigits} × ${remaining} = ${favourable}, and the probability is ${solved.exactDisplay}.`,
    ];
  }
  return base;
}

function eventExplanation(entry: ProbabilityTaskRegistryEntry, parameters: GeneratedParameters, solved: SolvedProbability, base: string[]): string[] {
  const mode = entry.solveMode;
  const total = numberValue(parameters, "total"), a = numberValue(parameters, "aCount"), b = numberValue(parameters, "bCount"), overlap = numberValue(parameters, "overlap");
  const union = a + b - overlap;
  const context = groupContext(entry);

  if (mode === "findUnionProbability") {
    return [
      `Use n(A ∪ B) = n(A) + n(B) - n(A ∩ B), because the ${overlap} people in both groups would otherwise be counted twice.`,
      `Required people = ${a} + ${b} - ${overlap} = ${union}.`,
      probabilityLine(union, total, solved.exactDisplay),
    ];
  }
  if (mode === "findIntersectionProbability") {
    return [
      `The intersection means the people who satisfy both ${context.subjectA} and ${context.subjectB}.`,
      `The question gives this overlap directly as ${overlap} out of ${total}.`,
      probabilityLine(overlap, total, solved.exactDisplay),
    ];
  }
  if (["findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability"].includes(mode)) {
    const exactlyOne = a + b - 2 * overlap;
    return [
      `For exactly one condition, remove the overlap once from each group.`,
      `Required people = ${a} + ${b} - 2 × ${overlap} = ${exactlyOne}.`,
      probabilityLine(exactlyOne, total, solved.exactDisplay),
    ];
  }
  if (mode === "findNeitherEventProbability") {
    const neither = total - union;
    return [
      `First find those satisfying at least one condition: ${a} + ${b} - ${overlap} = ${union}.`,
      `People satisfying neither condition = ${total} - ${union} = ${neither}.`,
      probabilityLine(neither, total, solved.exactDisplay),
    ];
  }
  if (mode === "findMissingIntersectionOrUnionProbability") {
    return [
      `Apply P(A ∪ B) = P(A) + P(B) - P(A ∩ B).`,
      `In counts, the overlap is ${a} + ${b} - ${union} = ${overlap}.`,
      probabilityLine(overlap, total, solved.exactDisplay),
    ];
  }
  return base;
}

function methodLead(entry: ProbabilityTaskRegistryEntry): string {
  const mode = entry.solveMode;
  if (/Coin|Success|Head|None|AllSuccess|AtMost|AtLeastOne/.test(mode)) return "Method — identify the required H/T sequences or use the shorter complementary event.";
  if (/Dice|Die/.test(mode)) return "Method — treat outcomes from different dice as ordered pairs and count the pairs meeting the condition.";
  if (/Card|Deck|Rank|Suit|Colour|Face/.test(mode)) return "Method — count the relevant cards in the standard 52-card deck, taking care of any overlap.";
  if (/Complement/.test(mode)) return "Method — subtract the given event probability from 1.";
  if (/Probability|Selection|Committee|Arrangement|Formation|Together|Position/.test(mode)) return "Method — identify the complete sample space, count the required cases, and form their ratio.";
  return "Method — translate the condition into the correct restricted sample space before calculating the probability.";
}

export function remodelProbabilityExplanation(
  entry: ProbabilityTaskRegistryEntry,
  parameters: GeneratedParameters,
  solved: SolvedProbability,
  baseExplanation: string[],
): string[] {
  const mode = entry.solveMode;
  let explanation = baseExplanation;

  const simultaneousModes = [
    "findSimultaneousSameTypeProbability", "findSimultaneousDifferentTypeProbability", "findExactCompositionProbability",
    "findSelectionProbabilityUsingCombination", "findNoObjectOfTypeProbability", "findAtLeastOneObjectOfType",
  ];
  if (entry.cpId === "PRB-CP-005" && simultaneousModes.includes(mode)) {
    explanation = simultaneousExplanation(entry, parameters, solved);
  }

  const successiveModes = [
    "findSuccessiveIndependentProbability", "findWithReplacementProbability", "findSuccessiveDependentProbability",
    "findWithoutReplacementProbability", "findOrderedDrawSequenceProbability", "findSameTypeInSuccessiveDraws",
    "findDifferentTypesInSuccessiveDraws", "findAtLeastOneAcrossIndependentStages",
  ];
  if (successiveModes.includes(mode)) explanation = successiveExplanation(entry, parameters, solved);

  const conditionalModes = [
    "findConditionalProbabilityByCounting", "findConditionalFromTwoWayTable", "findConditionalCardProbability",
    "findConditionalUrnProbability", "findReverseConditionalCount",
  ];
  if (conditionalModes.includes(mode)) explanation = conditionalExplanation(entry, parameters, solved, explanation);

  explanation = committeeAndArrangementExplanation(entry, parameters, solved, explanation);

  const eventModes = [
    "findUnionProbability", "findIntersectionProbability", "findExactlyOneOfTwoEvents", "findMixedEventExpressionProbability",
    "findNeitherEventProbability", "findMissingIntersectionOrUnionProbability",
  ];
  if (eventModes.includes(mode)) explanation = eventExplanation(entry, parameters, solved, explanation);

  if (mode === "findSingleDrawColourProbability" && variant(entry, 4) === 3) {
    const red = numberValue(parameters, "red"), blue = numberValue(parameters, "blue"), divisor = gcd(red, blue);
    const redParts = red / divisor, blueParts = blue / divisor;
    explanation = [
      `The ratio ${redParts}:${blueParts} represents ${redParts} red parts and ${blueParts} blue parts.`,
      `Hence, the total number of equal parts is ${redParts} + ${blueParts} = ${redParts + blueParts}.`,
      probabilityLine(redParts, redParts + blueParts, solved.exactDisplay),
    ];
  }

  if (mode === "findMutuallyExclusiveUnion") {
    const first = fraction(numberValue(parameters, "aNumerator"), numberValue(parameters, "aDenominator", 1));
    const second = fraction(numberValue(parameters, "bNumerator"), numberValue(parameters, "bDenominator", 1));
    explanation = [
      `The two events are mutually exclusive, so they cannot happen together and there is no overlap to subtract.`,
      `P(A or B) = P(A) + P(B) = ${first} + ${second}.`,
      `Therefore, the required probability is ${solved.exactDisplay}.`,
    ];
  }

  if (mode === "findIndependentIntersection") {
    const first = fraction(numberValue(parameters, "aNumerator"), numberValue(parameters, "aDenominator", 1));
    const second = fraction(numberValue(parameters, "bNumerator"), numberValue(parameters, "bDenominator", 1));
    explanation = [
      `The two results are independent, so the outcome of one does not change the probability of the other.`,
      `P(both) = P(A) × P(B) = ${first} × ${second}.`,
      `Therefore, the required probability is ${solved.exactDisplay}.`,
    ];
  }

  if (entry.difficulty !== "Easy" && explanation.length < 3) {
    explanation = [methodLead(entry), ...explanation];
  }

  return explanation.map(tidy).filter(Boolean);
}
