import { gcdBigInt, hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di006V2Difficulty,
  Di006V2ExamProfile,
  Di006V2Explanation,
  Di006V2Option,
  Di006V2Question,
  Di006V2QuestionSet,
  Di006V2Relation,
  Di006V2Stimulus,
  Di006V2TaskKind,
  Di006V2ValidationCheck,
} from "./caselet-v2-types";

export const DI006_V2_TASK_KINDS: readonly Di006V2TaskKind[] = [
  "DIRECT_STATED_VALUE",
  "SINGLE_RELATION_VALUE",
  "DIFFERENCE_BETWEEN_VALUES",
  "COMBINED_TWO_VALUES",
  "RATIO_OF_TWO_VALUES",
  "SHARE_OF_TOTAL",
  "AVERAGE_OF_TWO_VALUES",
  "CHAINED_RELATION_VALUE",
  "REMAINDER_FROM_TOTAL",
  "COMBINED_DERIVED_SHARE",
  "REMAINDER_TO_DERIVED_RATIO",
  "RELATIVE_PERCENT_EXCESS",
] as const;

export const DI006_V2_DIFFICULTY: Readonly<Record<Di006V2TaskKind, Di006V2Difficulty>> = {
  DIRECT_STATED_VALUE: "Easy",
  SINGLE_RELATION_VALUE: "Easy",
  DIFFERENCE_BETWEEN_VALUES: "Medium",
  COMBINED_TWO_VALUES: "Medium",
  RATIO_OF_TWO_VALUES: "Medium",
  SHARE_OF_TOTAL: "Medium",
  AVERAGE_OF_TWO_VALUES: "Medium",
  CHAINED_RELATION_VALUE: "Hard",
  REMAINDER_FROM_TOTAL: "Hard",
  COMBINED_DERIVED_SHARE: "Hard",
  REMAINDER_TO_DERIVED_RATIO: "Hard",
  RELATIVE_PERCENT_EXCESS: "Hard",
};

const EASY_KINDS = DI006_V2_TASK_KINDS.filter((kind) => DI006_V2_DIFFICULTY[kind] === "Easy");
const MEDIUM_KINDS = DI006_V2_TASK_KINDS.filter((kind) => DI006_V2_DIFFICULTY[kind] === "Medium");
const HARD_KINDS = DI006_V2_TASK_KINDS.filter((kind) => DI006_V2_DIFFICULTY[kind] === "Hard");

const OPTION_COUNT: Readonly<Record<Di006V2ExamProfile, 4 | 5>> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

const VALUE_FAMILIES = [
  [6, 5, 4, 3, 7],
  [5, 4, 3, 6, 7],
  [9, 6, 3, 4, 8],
  [10, 8, 5, 6, 11],
  [12, 10, 9, 5, 14],
] as const;

const UNIT_POOL = [20, 25, 40, 50, 60, 80] as const;

const CONTEXTS = [
  {
    id: "SERVICE_BRANCHES",
    title: "Service requests handled by five branches",
    categories: ["North Branch", "South Branch", "East Branch", "West Branch", "Central Branch"],
    totalLabel: "Total service requests",
    unit: "requests",
  },
  {
    id: "DEPARTMENT_EMPLOYEES",
    title: "Employees working in five departments",
    categories: ["Sales", "Accounts", "Operations", "Support", "Administration"],
    totalLabel: "Total employees",
    unit: "employees",
  },
  {
    id: "COURSE_ENROLMENT",
    title: "Students enrolled in five courses",
    categories: ["Course A", "Course B", "Course C", "Course D", "Course E"],
    totalLabel: "Total students",
    unit: "students",
  },
  {
    id: "PRODUCT_OUTPUT",
    title: "Production distributed among five products",
    categories: ["Product P", "Product Q", "Product R", "Product S", "Product T"],
    totalLabel: "Total production",
    unit: "units",
  },
  {
    id: "ORDER_CATEGORIES",
    title: "Orders received in five categories",
    categories: ["Category A", "Category B", "Category C", "Category D", "Category E"],
    totalLabel: "Total orders",
    unit: "orders",
  },
  {
    id: "BOOK_CATEGORIES",
    title: "Books issued in five categories",
    categories: ["Fiction", "Science", "History", "Commerce", "General"],
    totalLabel: "Total books issued",
    unit: "books",
  },
] as const;

const TOPOLOGIES = [
  { id: "T1", directIndex: 1, edges: [[1, 0], [0, 2], [1, 3]] as const },
  { id: "T2", directIndex: 0, edges: [[0, 1], [0, 2], [2, 3]] as const },
  { id: "T3", directIndex: 2, edges: [[2, 0], [0, 1], [1, 3]] as const },
  { id: "T4", directIndex: 3, edges: [[3, 1], [1, 0], [0, 2]] as const },
] as const;

const BLOCKED_LANGUAGE = ["associated", "shortcut", "common trap", "trap"] as const;

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;

type Draft = Readonly<{
  kind: Di006V2TaskKind;
  difficulty: Di006V2Difficulty;
  stemSurfaceId: string;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di006V2Explanation;
  evidence: Readonly<Record<string, number>>;
  numericStep?: number;
}>;

function formatQuotient(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("DI-006 V2 received an invalid rational value.");
  }
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return String(whole);
  if (fraction % 10 === 0) return String(whole) + "." + String(fraction / 10);
  return String(whole) + "." + String(fraction).padStart(2, "0");
}

function formatPercent(numerator: number, denominator: number): string {
  return formatQuotient(numerator * 100, denominator) + "%";
}

function surface(seed: string, variants: readonly string[]) {
  const index = hashSeed(seed) % variants.length;
  return { id: "S" + String(index + 1), text: variants[index]! };
}

function pair(seed: string, indexes: readonly number[]): [number, number] {
  return shuffle(seededRandom(seed), [...indexes]).slice(0, 2) as [number, number];
}

function reducedFraction(numerator: number, denominator: number) {
  const divisor = Number(gcdBigInt(BigInt(numerator), BigInt(denominator)));
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}

function totalSentence(contextId: string, total: number) {
  switch (contextId) {
    case "SERVICE_BRANCHES": return "The five branches handled a total of " + total + " service requests.";
    case "DEPARTMENT_EMPLOYEES": return "A company has " + total + " employees across the five departments.";
    case "COURSE_ENROLMENT": return "A total of " + total + " students are enrolled across the five courses.";
    case "PRODUCT_OUTPUT": return "The combined production of the five products is " + total + " units.";
    case "ORDER_CATEGORIES": return "A total of " + total + " orders were received across the five categories.";
    case "BOOK_CATEGORIES": return "A library issued a total of " + total + " books across the five categories.";
    default: throw new Error("DI-006 V2 unknown context: " + contextId);
  }
}

function directSentence(contextId: string, name: string, value: number) {
  switch (contextId) {
    case "SERVICE_BRANCHES": return name + " handled " + value + " service requests.";
    case "DEPARTMENT_EMPLOYEES": return name + " has " + value + " employees.";
    case "COURSE_ENROLMENT": return value + " students are enrolled in " + name + ".";
    case "PRODUCT_OUTPUT": return "Production of " + name + " is " + value + " units.";
    case "ORDER_CATEGORIES": return name + " received " + value + " orders.";
    case "BOOK_CATEGORIES": return "The number of books issued in " + name + " is " + value + ".";
    default: throw new Error("DI-006 V2 unknown context: " + contextId);
  }
}

function remainderSentence(contextId: string, name: string) {
  switch (contextId) {
    case "SERVICE_BRANCHES": return "The remaining service requests were handled by " + name + ".";
    case "DEPARTMENT_EMPLOYEES": return "The remaining employees work in " + name + ".";
    case "COURSE_ENROLMENT": return "The remaining students are enrolled in " + name + ".";
    case "PRODUCT_OUTPUT": return name + " makes up the remaining production.";
    case "ORDER_CATEGORIES": return "The remaining orders were received in " + name + ".";
    case "BOOK_CATEGORIES": return "The remaining books issued were from " + name + ".";
    default: throw new Error("DI-006 V2 unknown context: " + contextId);
  }
}

function relationText(contextId: string, targetName: string, sourceName: string, target: number, source: number, unit: string) {
  const differencePercent = ((target - source) * 100) / source;
  const comparison = differencePercent > 0 ? "more" : "fewer";
  const magnitude = Math.abs(differencePercent);

  const percentageSentence = () => {
    switch (contextId) {
      case "SERVICE_BRANCHES": return targetName + " handled " + magnitude + "% " + comparison + " service requests than " + sourceName + ".";
      case "DEPARTMENT_EMPLOYEES": return targetName + " has " + magnitude + "% " + comparison + " employees than " + sourceName + ".";
      case "COURSE_ENROLMENT": return "Enrollment in " + targetName + " is " + magnitude + "% " + (differencePercent > 0 ? "higher" : "lower") + " than in " + sourceName + ".";
      case "PRODUCT_OUTPUT": return "Production of " + targetName + " is " + magnitude + "% " + (differencePercent > 0 ? "higher" : "lower") + " than that of " + sourceName + ".";
      case "ORDER_CATEGORIES": return targetName + " received " + magnitude + "% " + comparison + " orders than " + sourceName + ".";
      case "BOOK_CATEGORIES": return "The number of books issued in " + targetName + " is " + magnitude + "% " + (differencePercent > 0 ? "higher" : "lower") + " than in " + sourceName + ".";
      default: throw new Error("DI-006 V2 unknown context: " + contextId);
    }
  };

  const fractionSentence = (numerator: number, denominator: number) => {
    const fraction = numerator + "/" + denominator;
    switch (contextId) {
      case "SERVICE_BRANCHES": return targetName + " handled " + fraction + " as many service requests as " + sourceName + ".";
      case "DEPARTMENT_EMPLOYEES": return "The number of employees in " + targetName + " is " + fraction + " of that in " + sourceName + ".";
      case "COURSE_ENROLMENT": return "The number of students in " + targetName + " is " + fraction + " of that in " + sourceName + ".";
      case "PRODUCT_OUTPUT": return "Production of " + targetName + " is " + fraction + " of that of " + sourceName + ".";
      case "ORDER_CATEGORIES": return "Orders received in " + targetName + " are " + fraction + " of those in " + sourceName + ".";
      case "BOOK_CATEGORIES": return "The number of books issued in " + targetName + " is " + fraction + " of that in " + sourceName + ".";
      default: throw new Error("DI-006 V2 unknown context: " + contextId);
    }
  };

  if (Number.isInteger(differencePercent) && differencePercent !== 0 && magnitude <= 100) {
    return {
      learnerText: percentageSentence(),
      explanationStep: targetName + " = " + sourceName + " × " + (100 + differencePercent) + "/100 = " + target + " " + unit + ".",
    };
  }

  const fraction = reducedFraction(target, source);
  return {
    learnerText: fractionSentence(fraction.numerator, fraction.denominator),
    explanationStep: targetName + " = " + fraction.numerator + "/" + fraction.denominator + " of " + sourceName + " = " + target + " " + unit + ".",
  };
}

export function resolveDi006V2Counts(stimulus: Di006V2Stimulus): number[] {
  const counts = Array<number>(stimulus.categories.length).fill(Number.NaN);
  counts[stimulus.directIndex] = stimulus.directValue;
  for (const relation of stimulus.relations) {
    const source = counts[relation.sourceIndex];
    if (!Number.isFinite(source)) throw new Error("DI-006 V2 relation dependency is unresolved.");
    const numerator = source * relation.numerator;
    if (numerator % relation.denominator !== 0) throw new Error("DI-006 V2 relation did not resolve to an integer.");
    counts[relation.targetIndex] = numerator / relation.denominator;
  }
  const subtotal = counts.reduce((sum, value, index) => index === stimulus.remainderIndex ? sum : sum + value, 0);
  counts[stimulus.remainderIndex] = stimulus.totalValue - subtotal;
  if (counts.some((value) => !Number.isSafeInteger(value) || value <= 0)) throw new Error("DI-006 V2 resolved an invalid count.");
  return counts;
}

function buildStimulus(seed: string): Di006V2Stimulus {
  const context = pick(seededRandom(seed + ":context"), CONTEXTS);
  const family = pick(seededRandom(seed + ":family"), VALUE_FAMILIES);
  const unitScale = pick(seededRandom(seed + ":unit"), UNIT_POOL);
  const topology = pick(seededRandom(seed + ":topology"), TOPOLOGIES);
  const categories = shuffle(seededRandom(seed + ":labels"), context.categories);
  const values = family.map((value) => value * unitScale);
  const totalValue = values.reduce((sum, value) => sum + value, 0);
  const directValue = values[topology.directIndex]!;
  const depths = new Map<number, number>([[topology.directIndex, 0]]);
  const relations: Di006V2Relation[] = [];

  for (const [sourceIndex, targetIndex] of topology.edges) {
    const source = values[sourceIndex]!;
    const target = values[targetIndex]!;
    const fraction = reducedFraction(target, source);
    const wording = relationText(context.id, categories[targetIndex]!, categories[sourceIndex]!, target, source, context.unit);
    const depth = (depths.get(sourceIndex) ?? 0) + 1;
    depths.set(targetIndex, depth);
    relations.push({
      targetIndex,
      sourceIndex,
      numerator: fraction.numerator,
      denominator: fraction.denominator,
      depth,
      learnerText: wording.learnerText,
      explanationStep: wording.explanationStep,
    });
  }

  const relationSentences = shuffle(seededRandom(seed + ":fact-order"), relations.map((relation) => relation.learnerText)).join(" ");
  return {
    kind: "CASELET",
    contextId: context.id,
    topologyId: topology.id,
    title: context.title,
    instruction: "Read the caselet carefully and answer the five questions that follow.",
    learnerText:
      totalSentence(context.id, totalValue) + " " +
      directSentence(context.id, categories[topology.directIndex]!, directValue) + " " +
      relationSentences + " " + remainderSentence(context.id, categories[4]!),
    categories,
    totalValue,
    totalLabel: context.totalLabel,
    unit: context.unit,
    directIndex: topology.directIndex,
    directValue,
    relations,
    remainderIndex: 4,
  };
}

function normalize(value: string) {
  return value.trim().replace(/\s+/gu, " ").toLowerCase();
}

function fallbackCandidates(answer: string, numericStep: number, counts: readonly number[]): Candidate[] {
  const ratio = answer.match(/^(\d+)\s*:\s*(\d+)$/u);
  if (ratio) {
    const left = Number(ratio[1]);
    const right = Number(ratio[2]);
    const candidates: Candidate[] = [
      { text: String(right) + ":" + String(left), misconceptionId: "FALLBACK_REVERSE_RATIO", derivation: "Reverses the requested ratio order." },
      { text: ratioDisplay(left, left + right), misconceptionId: "FALLBACK_PART_TO_PAIR", derivation: "Compares the first term with the combined pair." },
      { text: ratioDisplay(left + right, right), misconceptionId: "FALLBACK_PAIR_TO_SECOND", derivation: "Compares the combined pair with the second term." },
    ];
    for (let offset = 1; offset <= 8; offset += 1) {
      candidates.push({
        text: ratioDisplay(left + offset, right),
        misconceptionId: "FALLBACK_RATIO_LEFT_" + offset,
        derivation: "Uses a nearby first ratio term after a small reconstruction error.",
      });
      candidates.push({
        text: ratioDisplay(left, right + offset),
        misconceptionId: "FALLBACK_RATIO_RIGHT_" + offset,
        derivation: "Uses a nearby second ratio term after a small reconstruction error.",
      });
    }
    return candidates;
  }

  const percent = answer.match(/^(\d+(?:\.\d+)?)%$/u);
  if (percent) {
    const value = Number(percent[1]);
    const candidates: Candidate[] = [];
    const deltas = [-25, -20, -15, -10, -5, 5, 10, 15, 20, 25, 30];
    for (const [index, delta] of deltas.entries()) {
      const candidate = Math.max(1, value + delta);
      candidates.push({
        text: String(candidate) + "%",
        misconceptionId: "FALLBACK_PERCENT_" + index,
        derivation: "Uses a nearby percentage after a reading or arithmetic error.",
      });
    }
    return candidates;
  }

  if (/^\d+(?:\.\d+)?$/u.test(answer)) {
    const value = Number(answer);
    const step = Math.max(1, numericStep);
    const candidates: Candidate[] = counts.map((count, index) => ({
      text: String(count),
      misconceptionId: "OTHER_CATEGORY_VALUE_" + index,
      derivation: "Uses the value of another category from the same caselet.",
    }));
    for (let offset = 1; offset <= 10; offset += 1) {
      candidates.push({
        text: String(value + offset * step),
        misconceptionId: "FALLBACK_VALUE_HIGH_" + offset,
        derivation: "Uses a nearby value above the required result after a small calculation error.",
      });
      const lower = value - offset * step;
      if (lower > 0) {
        candidates.push({
          text: String(lower),
          misconceptionId: "FALLBACK_VALUE_LOW_" + offset,
          derivation: "Uses a nearby value below the required result after a small calculation error.",
        });
      }
    }
    return candidates;
  }
  return [];
}

function buildOptions(input: {
  seed: string;
  optionCount: 4 | 5;
  answer: string;
  candidates: readonly Candidate[];
  numericStep: number;
  counts: readonly number[];
}) {
  const seen = new Set<string>();
  const retained: Di006V2Option[] = [];
  const add = (candidate: Candidate) => {
    const key = normalize(candidate.text);
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };
  add({ text: input.answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared caselet." });
  input.candidates.forEach(add);
  fallbackCandidates(input.answer, input.numericStep, input.counts).forEach(add);
  if (retained.length < input.optionCount) throw new Error(`DI-006 V2 ${input.seed} could build only ${retained.length} unique options for ${input.answer}.`);
  const shuffled = shuffle(seededRandom(input.seed + ":options"), retained.slice(0, input.optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-006 V2 lost the correct option.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function relationForTarget(stimulus: Di006V2Stimulus, targetIndex: number) {
  return stimulus.relations.find((relation) => relation.targetIndex === targetIndex);
}

function derivationSteps(stimulus: Di006V2Stimulus, categoryIndex: number): string[] {
  if (categoryIndex === stimulus.directIndex) {
    return [stimulus.categories[categoryIndex] + " = " + stimulus.directValue + " " + stimulus.unit + " (given)."];
  }
  if (categoryIndex === stimulus.remainderIndex) {
    return [];
  }
  const relation = relationForTarget(stimulus, categoryIndex);
  if (!relation) throw new Error("DI-006 V2 missing relation for derived category.");
  return [...derivationSteps(stimulus, relation.sourceIndex), relation.explanationStep];
}

function uniqueSteps(...groups: readonly string[][]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const group of groups) {
    for (const step of group) {
      if (seen.has(step)) continue;
      seen.add(step);
      result.push(step);
    }
  }
  return result;
}

function valueQuestionSurface(seed: string, stimulus: Di006V2Stimulus, name: string, relationHint = false) {
  let variants: readonly string[];
  switch (stimulus.contextId) {
    case "SERVICE_BRANCHES":
      variants = [
        "How many service requests did " + name + " handle?",
        "What is the number of service requests handled by " + name + "?",
        (relationHint ? "Using the given relations, how many service requests did " : "According to the caselet, how many service requests did ") + name + " handle?",
      ];
      break;
    case "DEPARTMENT_EMPLOYEES":
      variants = [
        "How many employees are in " + name + "?",
        "What is the number of employees in " + name + "?",
        (relationHint ? "Using the given relations, find the number of employees in " : "According to the caselet, find the number of employees in ") + name + ".",
      ];
      break;
    case "COURSE_ENROLMENT":
      variants = [
        "How many students are enrolled in " + name + "?",
        "What is the number of students enrolled in " + name + "?",
        (relationHint ? "Using the given relations, find the enrolment in " : "According to the caselet, find the enrolment in ") + name + ".",
      ];
      break;
    case "PRODUCT_OUTPUT":
      variants = [
        "What is the production of " + name + ", in units?",
        "How many units of " + name + " are produced?",
        (relationHint ? "Using the given relations, find the production of " : "According to the caselet, find the production of ") + name + ".",
      ];
      break;
    case "ORDER_CATEGORIES":
      variants = [
        "How many orders were received in " + name + "?",
        "What is the number of orders in " + name + "?",
        (relationHint ? "Using the given relations, find the number of orders in " : "According to the caselet, find the number of orders in ") + name + ".",
      ];
      break;
    case "BOOK_CATEGORIES":
      variants = [
        "How many books were issued in " + name + "?",
        "What is the number of books issued in " + name + "?",
        (relationHint ? "Using the given relations, find the number of books issued in " : "According to the caselet, find the number of books issued in ") + name + ".",
      ];
      break;
    default:
      throw new Error("DI-006 V2 unknown context: " + stimulus.contextId);
  }
  return surface(seed, variants);
}

function buildDrafts(seed: string, stimulus: Di006V2Stimulus): Readonly<Record<Di006V2TaskKind, Draft>> {
  const counts = resolveDi006V2Counts(stimulus);
  const names = stimulus.categories;
  const directIndex = stimulus.directIndex;
  const direct = counts[directIndex]!;
  const depthOneRelations = stimulus.relations.filter((relation) => relation.depth === 1);
  const chainRelations = stimulus.relations.filter((relation) => relation.depth >= 2);
  const singleRelation = pick(seededRandom(seed + ":single"), depthOneRelations);
  const singleIndex = singleRelation.targetIndex;
  const shallowIndexes = [directIndex, ...depthOneRelations.map((relation) => relation.targetIndex)];
  const mediumIndexes = [...new Set(shallowIndexes)];
  const [firstIndex, secondIndex] = pair(seed + ":medium-pair", mediumIndexes);
  const first = counts[firstIndex]!;
  const second = counts[secondIndex]!;
  const chainRelation = pick(seededRandom(seed + ":chain"), chainRelations);
  const chainIndex = chainRelation.targetIndex;
  const chainValue = counts[chainIndex]!;
  const derivedIndexes = stimulus.relations.map((relation) => relation.targetIndex);
  const otherDerivedIndex = pick(seededRandom(seed + ":other-derived"), derivedIndexes.filter((index) => index !== chainIndex));
  const otherDerivedValue = counts[otherDerivedIndex]!;
  const remainderIndex = stimulus.remainderIndex;
  const remainder = counts[remainderIndex]!;
  const numericStep = counts.slice(1).reduce((gcd, value) => Number(gcdBigInt(BigInt(gcd), BigInt(value))), counts[0]!);

  const directSurface = valueQuestionSurface(seed + ":DIRECT_STATED_VALUE", stimulus, names[directIndex]!, false);

  const singleSurface = valueQuestionSurface(seed + ":SINGLE_RELATION_VALUE", stimulus, names[singleIndex]!, true);

  const difference = Math.abs(first - second);
  const wrongPairDifferenceCandidates: Candidate[] = [];
  for (let leftIndex = 0; leftIndex < counts.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < counts.length; rightIndex += 1) {
      if ((leftIndex === firstIndex && rightIndex === secondIndex) || (leftIndex === secondIndex && rightIndex === firstIndex)) continue;
      wrongPairDifferenceCandidates.push({
        text: String(Math.abs(counts[leftIndex]! - counts[rightIndex]!)),
        misconceptionId: "USE_WRONG_PAIR_DIFFERENCE_" + leftIndex + "_" + rightIndex,
        derivation: "Subtracts " + names[leftIndex] + " and " + names[rightIndex] + " instead of the two categories asked.",
      });
    }
  }
  const differenceSurface = surface(seed + ":DIFFERENCE_BETWEEN_VALUES", [
    "What is the difference between the values for " + names[firstIndex] + " and " + names[secondIndex] + "?",
    "By how many " + stimulus.unit + " do " + names[firstIndex] + " and " + names[secondIndex] + " differ?",
    "Find the absolute difference between " + names[firstIndex] + " and " + names[secondIndex] + ".",
  ]);

  const combined = first + second;
  const combinedSurface = surface(seed + ":COMBINED_TWO_VALUES", [
    "What is the combined value of " + names[firstIndex] + " and " + names[secondIndex] + "?",
    "Find the total for " + names[firstIndex] + " and " + names[secondIndex] + " together.",
    "Together, how many " + stimulus.unit + " do " + names[firstIndex] + " and " + names[secondIndex] + " represent?",
  ]);

  const ratio = ratioDisplay(first, second);
  const ratioSurface = surface(seed + ":RATIO_OF_TWO_VALUES", [
    "What is the ratio of " + names[firstIndex] + " to " + names[secondIndex] + "?",
    "The values for " + names[firstIndex] + " and " + names[secondIndex] + " are in what ratio?",
    "Find the ratio of the number for " + names[firstIndex] + " to that for " + names[secondIndex] + ".",
  ]);

  const shareIndex = singleIndex;
  const share = formatPercent(counts[shareIndex]!, stimulus.totalValue);
  const shareSurface = surface(seed + ":SHARE_OF_TOTAL", [
    "What percentage of the total is represented by " + names[shareIndex] + "?",
    "What percent of all " + stimulus.unit + " belongs to " + names[shareIndex] + "?",
    "Find the percentage share of " + names[shareIndex] + " in the overall total.",
  ]);

  const average = formatQuotient(first + second, 2);
  const averageSurface = surface(seed + ":AVERAGE_OF_TWO_VALUES", [
    "What is the average number of " + stimulus.unit + " for " + names[firstIndex] + " and " + names[secondIndex] + "?",
    "Find the average of the values for " + names[firstIndex] + " and " + names[secondIndex] + ".",
    "The mean of the values for " + names[firstIndex] + " and " + names[secondIndex] + " is:",
  ]);

  const chainSurface = valueQuestionSurface(seed + ":CHAINED_RELATION_VALUE", stimulus, names[chainIndex]!, true);

  const remainderSurface = valueQuestionSurface(seed + ":REMAINDER_FROM_TOTAL", stimulus, names[remainderIndex]!, true);

  const hardCombined = chainValue + otherDerivedValue;
  const hardCombinedShare = formatPercent(hardCombined, stimulus.totalValue);
  const combinedDerivedSurface = surface(seed + ":COMBINED_DERIVED_SHARE", [
    "Together, " + names[chainIndex] + " and " + names[otherDerivedIndex] + " account for what percentage of the total?",
    "What percent of all " + stimulus.unit + " is represented by " + names[chainIndex] + " and " + names[otherDerivedIndex] + " together?",
    "Find the combined percentage share of " + names[chainIndex] + " and " + names[otherDerivedIndex] + ".",
  ]);

  const remainderRatio = ratioDisplay(remainder, chainValue);
  const remainderRatioSurface = surface(seed + ":REMAINDER_TO_DERIVED_RATIO", [
    "What is the ratio of " + names[remainderIndex] + " to " + names[chainIndex] + "?",
    "Find the ratio of the remaining category " + names[remainderIndex] + " to " + names[chainIndex] + ".",
    "The values for " + names[remainderIndex] + " and " + names[chainIndex] + " are in what ratio?",
  ]);

  const largerIndex = chainValue > otherDerivedValue ? chainIndex : otherDerivedIndex;
  const smallerIndex = largerIndex === chainIndex ? otherDerivedIndex : chainIndex;
  const larger = counts[largerIndex]!;
  const smaller = counts[smallerIndex]!;
  const excess = larger - smaller;
  const excessAnswer = formatPercent(excess, smaller);
  const excessSurface = surface(seed + ":RELATIVE_PERCENT_EXCESS", [
    names[largerIndex] + " is what percent more than " + names[smallerIndex] + "?",
    "By what percentage is the value for " + names[largerIndex] + " greater than that for " + names[smallerIndex] + "?",
    "The value for " + names[largerIndex] + " exceeds " + names[smallerIndex] + " by what percentage of " + names[smallerIndex] + "?",
  ]);

  const allKnownSteps = stimulus.relations.flatMap((relation) => derivationSteps(stimulus, relation.targetIndex));
  const knownSubtotal = counts.reduce((sum, value, index) => index === remainderIndex ? sum : sum + value, 0);

  return {
    DIRECT_STATED_VALUE: {
      kind: "DIRECT_STATED_VALUE",
      difficulty: "Easy",
      stemSurfaceId: directSurface.id,
      stem: directSurface.text,
      answer: String(direct),
      candidates: counts.filter((_, index) => index !== directIndex).map((value, index) => ({
        text: String(value),
        misconceptionId: "READ_OTHER_CATEGORY_" + index,
        derivation: "Uses another category value instead of the directly stated category.",
      })),
      explanation: {
        keyIdea: "This value is stated directly in the caselet.",
        steps: [names[directIndex] + " is given as " + direct + " " + stimulus.unit + "."],
      },
      evidence: { categoryIndex: directIndex },
      numericStep,
    },
    SINGLE_RELATION_VALUE: {
      kind: "SINGLE_RELATION_VALUE",
      difficulty: "Easy",
      stemSurfaceId: singleSurface.id,
      stem: singleSurface.text,
      answer: String(counts[singleIndex]),
      candidates: [
        { text: String(direct), misconceptionId: "COPY_DIRECT_VALUE", derivation: "Copies the directly stated value without applying the relation." },
        { text: String(stimulus.totalValue - counts[singleIndex]!), misconceptionId: "USE_COMPLEMENT", derivation: "Uses the complement of the requested category." },
        ...counts.filter((_, index) => index !== singleIndex && index !== directIndex).map((value, index) => ({
          text: String(value), misconceptionId: "USE_OTHER_DERIVED_" + index, derivation: "Uses another derived category value.",
        })),
      ],
      explanation: {
        keyIdea: "Start with the directly stated category and apply the one relation that leads to the requested category.",
        steps: derivationSteps(stimulus, singleIndex),
      },
      evidence: { categoryIndex: singleIndex },
      numericStep,
    },
    DIFFERENCE_BETWEEN_VALUES: {
      kind: "DIFFERENCE_BETWEEN_VALUES",
      difficulty: "Medium",
      stemSurfaceId: differenceSurface.id,
      stem: differenceSurface.text,
      answer: String(difference),
      candidates: [
        { text: String(first + second), misconceptionId: "ADD_INSTEAD_OF_SUBTRACT", derivation: "Adds the two values instead of finding their difference." },
        { text: String(Math.max(first, second)), misconceptionId: "USE_LARGER_ONLY", derivation: "Reports the larger category without subtracting." },
        { text: String(Math.min(first, second)), misconceptionId: "USE_SMALLER_ONLY", derivation: "Reports the smaller category without subtracting." },
        { text: formatQuotient(first + second, 2), misconceptionId: "USE_AVERAGE_INSTEAD_OF_DIFFERENCE", derivation: "Finds the average of the two values instead of their difference." },
        ...wrongPairDifferenceCandidates,
      ],
      explanation: {
        keyIdea: "Find the two requested values, then subtract the smaller from the larger.",
        steps: [...uniqueSteps(derivationSteps(stimulus, firstIndex), derivationSteps(stimulus, secondIndex)), "Difference = |" + first + " - " + second + "| = " + difference + "."],
      },
      evidence: { firstIndex, secondIndex },
      numericStep,
    },
    COMBINED_TWO_VALUES: {
      kind: "COMBINED_TWO_VALUES",
      difficulty: "Medium",
      stemSurfaceId: combinedSurface.id,
      stem: combinedSurface.text,
      answer: String(combined),
      candidates: [
        { text: String(Math.abs(first - second)), misconceptionId: "SUBTRACT_INSTEAD_OF_ADD", derivation: "Finds the difference instead of the combined value." },
        { text: String(first), misconceptionId: "USE_FIRST_ONLY", derivation: "Uses only the first named category." },
        { text: String(second), misconceptionId: "USE_SECOND_ONLY", derivation: "Uses only the second named category." },
        { text: String(stimulus.totalValue - combined), misconceptionId: "USE_COMPLEMENT", derivation: "Reports the total of all other categories." },
      ],
      explanation: {
        keyIdea: "Find the two requested values and add them.",
        steps: [...uniqueSteps(derivationSteps(stimulus, firstIndex), derivationSteps(stimulus, secondIndex)), "Combined value = " + first + " + " + second + " = " + combined + "."],
      },
      evidence: { firstIndex, secondIndex },
      numericStep,
    },
    RATIO_OF_TWO_VALUES: {
      kind: "RATIO_OF_TWO_VALUES",
      difficulty: "Medium",
      stemSurfaceId: ratioSurface.id,
      stem: ratioSurface.text,
      answer: ratio,
      candidates: [
        { text: ratioDisplay(second, first), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the order of the named categories." },
        { text: ratioDisplay(first, first + second), misconceptionId: "FIRST_TO_PAIR_TOTAL", derivation: "Compares the first category with the pair total." },
        { text: ratioDisplay(first + second, second), misconceptionId: "PAIR_TOTAL_TO_SECOND", derivation: "Uses the pair total as the first ratio term." },
        { text: ratioDisplay(Math.max(first, second), Math.abs(first - second) || 1), misconceptionId: "LARGER_TO_DIFFERENCE", derivation: "Compares the larger value with the difference." },
      ],
      explanation: {
        keyIdea: "Find the two values and form the ratio in the order asked.",
        steps: [...uniqueSteps(derivationSteps(stimulus, firstIndex), derivationSteps(stimulus, secondIndex)), names[firstIndex] + ":" + names[secondIndex] + " = " + first + ":" + second + " = " + ratio + "."],
      },
      evidence: { firstIndex, secondIndex },
      numericStep: 1,
    },
    SHARE_OF_TOTAL: {
      kind: "SHARE_OF_TOTAL",
      difficulty: "Medium",
      stemSurfaceId: shareSurface.id,
      stem: shareSurface.text,
      answer: share,
      candidates: [
        ...counts
          .map((value, index) => ({ value, index }))
          .filter(({ index }) => index !== shareIndex)
          .map(({ value, index }) => ({
            text: formatPercent(value, stimulus.totalValue),
            misconceptionId: "USE_OTHER_CATEGORY_SHARE_" + index,
            derivation: "Uses the percentage share of another category from the same caselet.",
          })),
        { text: formatPercent(stimulus.totalValue - counts[shareIndex]!, stimulus.totalValue), misconceptionId: "USE_COMPLEMENT_SHARE", derivation: "Finds the share of all other categories instead of the requested category." },
      ],
      explanation: {
        keyIdea: "Find the requested category value, then divide it by the stated overall total and multiply by 100.",
        steps: [...derivationSteps(stimulus, shareIndex), "Percentage share = " + counts[shareIndex] + "/" + stimulus.totalValue + " × 100 = " + share + "."],
      },
      evidence: { categoryIndex: shareIndex },
      numericStep: 5,
    },
    AVERAGE_OF_TWO_VALUES: {
      kind: "AVERAGE_OF_TWO_VALUES",
      difficulty: "Medium",
      stemSurfaceId: averageSurface.id,
      stem: averageSurface.text,
      answer: average,
      candidates: [
        { text: String(first + second), misconceptionId: "USE_SUM_NOT_AVERAGE", derivation: "Adds the two values but does not divide by two." },
        { text: String(first), misconceptionId: "USE_FIRST_ONLY", derivation: "Uses only the first category." },
        { text: String(second), misconceptionId: "USE_SECOND_ONLY", derivation: "Uses only the second category." },
        { text: formatQuotient(Math.abs(first - second), 2), misconceptionId: "AVERAGE_THE_DIFFERENCE", derivation: "Halves the difference instead of averaging the two values." },
      ],
      explanation: {
        keyIdea: "Find both values, add them, and divide the sum by two.",
        steps: [...uniqueSteps(derivationSteps(stimulus, firstIndex), derivationSteps(stimulus, secondIndex)), "Average = (" + first + " + " + second + ")/2 = " + average + "."],
      },
      evidence: { firstIndex, secondIndex },
      numericStep,
    },
    CHAINED_RELATION_VALUE: {
      kind: "CHAINED_RELATION_VALUE",
      difficulty: "Hard",
      stemSurfaceId: chainSurface.id,
      stem: chainSurface.text,
      answer: String(chainValue),
      candidates: [
        { text: String(direct), misconceptionId: "STOP_AT_DIRECT_VALUE", derivation: "Uses the directly stated value without following the dependency chain." },
        { text: String(counts[chainRelation.sourceIndex]!), misconceptionId: "STOP_AT_INTERMEDIATE_VALUE", derivation: "Stops at the immediate source category instead of completing the final relation." },
        { text: String(remainder), misconceptionId: "USE_REMAINDER_CATEGORY", derivation: "Uses the remainder category instead of the chained category." },
        { text: String(stimulus.totalValue - chainValue), misconceptionId: "USE_COMPLEMENT", derivation: "Reports all values outside the requested category." },
      ],
      explanation: {
        keyIdea: "This category is not linked directly to the given value. Follow the dependency chain in order.",
        steps: derivationSteps(stimulus, chainIndex),
      },
      evidence: { categoryIndex: chainIndex },
      numericStep,
    },
    REMAINDER_FROM_TOTAL: {
      kind: "REMAINDER_FROM_TOTAL",
      difficulty: "Hard",
      stemSurfaceId: remainderSurface.id,
      stem: remainderSurface.text,
      answer: String(remainder),
      candidates: [
        { text: String(knownSubtotal), misconceptionId: "REPORT_KNOWN_SUBTOTAL", derivation: "Adds the known categories but does not subtract from the total." },
        { text: String(direct), misconceptionId: "COPY_DIRECT_VALUE", derivation: "Copies the directly stated category." },
        { text: String(chainValue), misconceptionId: "USE_CHAINED_VALUE", derivation: "Uses a chained category instead of the remainder." },
        { text: String(stimulus.totalValue - direct), misconceptionId: "REMOVE_DIRECT_ONLY", derivation: "Subtracts only the directly stated category from the total." },
      ],
      explanation: {
        keyIdea: "Reconstruct the four non-remainder categories, add them, and subtract that subtotal from the stated total.",
        steps: [...uniqueSteps(allKnownSteps), "Known four-category subtotal = " + knownSubtotal + ".", names[remainderIndex] + " = " + stimulus.totalValue + " - " + knownSubtotal + " = " + remainder + " " + stimulus.unit + "."],
      },
      evidence: { categoryIndex: remainderIndex },
      numericStep,
    },
    COMBINED_DERIVED_SHARE: {
      kind: "COMBINED_DERIVED_SHARE",
      difficulty: "Hard",
      stemSurfaceId: combinedDerivedSurface.id,
      stem: combinedDerivedSurface.text,
      answer: hardCombinedShare,
      candidates: [
        { text: formatPercent(chainValue, stimulus.totalValue), misconceptionId: "USE_CHAIN_ONLY", derivation: "Uses only the chained category." },
        { text: formatPercent(otherDerivedValue, stimulus.totalValue), misconceptionId: "USE_OTHER_ONLY", derivation: "Uses only the second derived category." },
        { text: formatPercent(Math.abs(chainValue - otherDerivedValue), stimulus.totalValue), misconceptionId: "USE_DIFFERENCE_SHARE", derivation: "Uses the difference instead of the combined value." },
        { text: formatPercent(hardCombined, knownSubtotal), misconceptionId: "USE_PARTIAL_TOTAL_AS_BASE", derivation: "Uses the non-remainder subtotal instead of the overall total." },
      ],
      explanation: {
        keyIdea: "Reconstruct both derived categories, add them, then compare their combined value with the full total.",
        steps: [...uniqueSteps(derivationSteps(stimulus, chainIndex), derivationSteps(stimulus, otherDerivedIndex)), "Combined value = " + chainValue + " + " + otherDerivedValue + " = " + hardCombined + ".", "Percentage share = " + hardCombined + "/" + stimulus.totalValue + " × 100 = " + hardCombinedShare + "."],
      },
      evidence: { firstIndex: chainIndex, secondIndex: otherDerivedIndex },
      numericStep: 5,
    },
    REMAINDER_TO_DERIVED_RATIO: {
      kind: "REMAINDER_TO_DERIVED_RATIO",
      difficulty: "Hard",
      stemSurfaceId: remainderRatioSurface.id,
      stem: remainderRatioSurface.text,
      answer: remainderRatio,
      candidates: [
        { text: ratioDisplay(chainValue, remainder), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the requested ratio order." },
        { text: ratioDisplay(remainder, direct), misconceptionId: "USE_DIRECT_AS_SECOND_TERM", derivation: "Uses the directly stated category instead of the requested derived category." },
        { text: ratioDisplay(chainValue, direct), misconceptionId: "DROP_REMAINDER", derivation: "Forms a ratio between two non-remainder categories." },
        { text: ratioDisplay(stimulus.totalValue, chainValue), misconceptionId: "USE_TOTAL_AS_FIRST_TERM", derivation: "Uses the whole total instead of the remainder category." },
      ],
      explanation: {
        keyIdea: "Find the chained category and the remainder category first, then form the ratio in the required order.",
        steps: [...uniqueSteps(derivationSteps(stimulus, chainIndex), allKnownSteps), "Known four-category subtotal = " + knownSubtotal + ", so " + names[remainderIndex] + " = " + remainder + ".", names[remainderIndex] + ":" + names[chainIndex] + " = " + remainder + ":" + chainValue + " = " + remainderRatio + "."],
      },
      evidence: { firstIndex: remainderIndex, secondIndex: chainIndex },
      numericStep: 1,
    },
    RELATIVE_PERCENT_EXCESS: {
      kind: "RELATIVE_PERCENT_EXCESS",
      difficulty: "Hard",
      stemSurfaceId: excessSurface.id,
      stem: excessSurface.text,
      answer: excessAnswer,
      candidates: [
        { text: String(excess) + "%", misconceptionId: "USE_ABSOLUTE_GAP_AS_PERCENT", derivation: "Reports the numeric gap as though it were already a percentage." },
        { text: formatPercent(excess, larger), misconceptionId: "USE_LARGER_AS_BASE", derivation: "Uses the larger category as the comparison base." },
        { text: formatPercent(larger, smaller), misconceptionId: "REPORT_FULL_LARGER_PERCENT", derivation: "Reports the larger value as a percent of the smaller instead of only the excess." },
        { text: formatPercent(smaller, larger), misconceptionId: "REVERSE_COMPARISON", derivation: "Reverses the relative comparison." },
      ],
      explanation: {
        keyIdea: "Reconstruct both categories, find their difference, and divide that difference by the smaller category.",
        steps: [...uniqueSteps(derivationSteps(stimulus, largerIndex), derivationSteps(stimulus, smallerIndex)), "Difference = " + larger + " - " + smaller + " = " + excess + ".", "Percentage more = " + excess + "/" + smaller + " × 100 = " + excessAnswer + "."],
      },
      evidence: { largerIndex, smallerIndex },
      numericStep: 5,
    },
  };
}

function validateSet(set: Omit<Di006V2QuestionSet, "validation">) {
  const checks: Di006V2ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  const counts = resolveDi006V2Counts(set.stimulus);
  const learnerText = [
    set.stimulus.learnerText,
    ...set.questions.flatMap((question) => [question.stem, question.explanation.keyIdea, ...question.explanation.steps]),
  ].join(" ").toLowerCase();

  add("CASELET_KIND", set.stimulus.kind === "CASELET", "DI-006 V2 must expose prose caselet semantics.");
  add("FIVE_CATEGORIES", set.stimulus.categories.length === 5, "DI-006 V2 requires five categories.");
  add("RELATION_COUNT", set.stimulus.relations.length === 3, "DI-006 V2 requires exactly three relational facts.");
  add("PROSE_STIMULUS", set.stimulus.learnerText.length > 180 && !/[|]/u.test(set.stimulus.learnerText), "DI-006 V2 stimulus must remain prose.");
  add("NO_TABLE_LANGUAGE", !/\btable\b|\brow\b|\bcolumn\b/iu.test(set.stimulus.learnerText), "DI-006 V2 must not leak table wording.");
  add("TOTAL_PARITY", counts.reduce((sum, value) => sum + value, 0) === set.stimulus.totalValue, "Resolved values must equal the stated total.");
  add("POSITIVE_INTEGERS", counts.every((value) => Number.isSafeInteger(value) && value > 0), "All caselet values must be positive integers.");
  add("FIVE_LINKED_QUESTIONS", set.questions.length === 5, "DI-006 V2 requires five linked questions.");
  add("DIFFICULTY_MIX", set.questions.filter((q) => q.difficulty === "Easy").length === 1 && set.questions.filter((q) => q.difficulty === "Medium").length === 2 && set.questions.filter((q) => q.difficulty === "Hard").length === 2, "Each set must contain 1 Easy + 2 Medium + 2 Hard.");
  add("DISTINCT_TASKS", new Set(set.questions.map((question) => question.kind)).size === 5, "Each linked question must use a distinct task family.");
  add("OPTION_COUNT", set.questions.every((question) => question.options.length === set.optionCount), "Every question must use the exam-profile option count.");
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === question.options.length), "Displayed options must be unique.");
  add("ONE_CORRECT", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer), "Every question must have exactly one bound correct option.");
  add("EXPLANATION_QUALITY", set.questions.every((question) => question.explanation.steps.length >= 1 && question.explanation.keyIdea.length >= 35), "Every question needs a clear worked explanation.");
  add("BLOCKED_LANGUAGE", BLOCKED_LANGUAGE.every((blocked) => !learnerText.includes(blocked)), "Learner-facing wording must not contain blocked boilerplate.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && !set.traceability.questionBankWritable && !set.traceability.testEligible && !set.traceability.mockTestEligible && !set.traceability.publiclyPublishable && !set.traceability.productionReleaseAuthorized, "DI-006 V2 must remain review-only.");
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi006V2Set(input: { seed: string; examProfile: Di006V2ExamProfile }): Di006V2QuestionSet {
  const optionCount = OPTION_COUNT[input.examProfile];
  const stimulus = buildStimulus(input.seed);
  const counts = resolveDi006V2Counts(stimulus);
  const drafts = buildDrafts(input.seed, stimulus);
  const selected = [
    pick(seededRandom(input.seed + ":easy"), EASY_KINDS),
    ...shuffle(seededRandom(input.seed + ":medium"), MEDIUM_KINDS).slice(0, 2),
    ...shuffle(seededRandom(input.seed + ":hard"), HARD_KINDS).slice(0, 2),
  ];
  const selectedKinds = shuffle(seededRandom(input.seed + ":order"), selected);
  const setId = "DI-006-V2-" + hashSeed(input.seed + ":" + input.examProfile).toString(36);

  const questions = selectedKinds.map((kind, index): Di006V2Question => {
    const draft = drafts[kind]!;
    const optionPackage = buildOptions({
      seed: input.seed + ":" + input.examProfile + ":" + kind,
      optionCount,
      answer: draft.answer,
      candidates: draft.candidates,
      numericStep: draft.numericStep ?? 1,
      counts,
    });
    return {
      questionId: setId + "-Q" + String(index + 1),
      setId,
      kind,
      difficulty: draft.difficulty,
      stemSurfaceId: draft.stemSurfaceId,
      stem: draft.stem,
      options: optionPackage.options,
      optionMetadata: optionPackage.optionMetadata,
      correctIndex: optionPackage.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });

  const withoutValidation = {
    packageId: "DI-006" as const,
    reviewVersion: "V2" as const,
    setId,
    seed: input.seed,
    language: "en" as const,
    examProfile: input.examProfile,
    optionCount,
    setDifficulty: "CASELET_MIXED_V2" as const,
    stimulus,
    questions,
    traceability: {
      packageId: "DI-006" as const,
      representation: "CASELET" as const,
      parentFoundation: "DI-001" as const,
      setContractVersion: "DI-006-SET-CONTRACT-V2" as const,
      questionLogicVersion: "DI-006-QUESTION-LOGIC-V2" as const,
      arithmeticAuthority: "EXACT_INTEGER_RATIONAL" as const,
      reviewStatus: "UNREVIEWED" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
    },
  };

  const validation = validateSet(withoutValidation);
  if (!validation.valid) {
    const failed = validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ");
    throw new Error("DI-006 V2 validation failed: " + failed);
  }
  return { ...withoutValidation, validation };
}
