import {
  auditClsCp005EquivalentSet,
  auditClsCp005OddTuples,
} from "./audit";
import {
  CLS_CP005_PROTOTYPE_BY_ID,
  isClsCp005PairRule,
} from "./relation-registry";
import {
  canonicalClsCp005RuleValue,
  clsCp005CatalogForRule,
  clsCp005Gcd,
  clsCp005Lcm,
  clsCp005PoolForArity,
  clsCp005ReverseDigits,
  clsCp005TupleKey,
  displayClsCp005Tuple,
} from "./tuple-domain";
import type {
  ClsCp005AmbiguityAudit,
  ClsCp005Difficulty,
  ClsCp005DifficultyFeatures,
  ClsCp005PrototypeDefinition,
  ClsCp005PrototypeId,
  ClsCp005RuleId,
  ClsCp005Task,
  ClsCp005Tuple,
  GeneratedClsCp005Question,
} from "./types";

const LIFECYCLE = {
  permanentQlId: null,
  reviewStatus: "UNREVIEWED_DISCOVERY" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
  questionStudioDiscoverable: false as const,
};

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function factorial(value: number): number {
  let result = 1;
  for (let factor = 2; factor <= value; factor += 1) result *= factor;
  return result;
}

function permutationByIndex<T>(values: readonly T[], index: number): T[] {
  const pool = [...values];
  const result: T[] = [];
  let remainingIndex = index % factorial(values.length);
  for (let position = 0; position < values.length; position += 1) {
    const blockSize = factorial(values.length - position - 1);
    const poolIndex = Math.floor(remainingIndex / blockSize);
    remainingIndex %= blockSize;
    result.push(pool.splice(poolIndex, 1)[0]!);
  }
  return result;
}

function naturalList(values: readonly string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

function directionText(value: string, forward: string, reverse: string): string {
  return value === "FORWARD" ? forward : reverse;
}

function triplePositionText(value: string, operation: "add" | "multiply" | "square"): string {
  const descriptions = operation === "add"
    ? { AB_TO_C: "the first two numbers add to the third", AC_TO_B: "the first and third numbers add to the middle number", BC_TO_A: "the last two numbers add to the first" }
    : operation === "multiply"
      ? { AB_TO_C: "the first two numbers multiply to the third", AC_TO_B: "the first and third numbers multiply to the middle number", BC_TO_A: "the last two numbers multiply to the first" }
      : { AB_TO_C: "the squares of the first two numbers add to the square of the third", AC_TO_B: "the squares of the first and third numbers add to the square of the middle number", BC_TO_A: "the squares of the last two numbers add to the square of the first" };
  return descriptions[value as keyof typeof descriptions] ?? "the same position-based relation holds";
}

function ruleStatement(ruleId: ClsCp005RuleId, value: string): string {
  switch (ruleId) {
    case "PAIR_SIGNED_DIFFERENCE": return `In each common pair, second number − first number = ${value}.`;
    case "PAIR_REDUCED_RATIO": return `In each common pair, second number : first number = ${value} in lowest terms.`;
    case "PAIR_SUM": return `The two numbers in each common pair add to ${value}.`;
    case "PAIR_PRODUCT": return `The two numbers in each common pair multiply to ${value}.`;
    case "PAIR_GCD": return `The greatest common divisor of each common pair is ${value}.`;
    case "PAIR_LCM": return `The least common multiple of each common pair is ${value}.`;
    case "PAIR_CONSECUTIVE_DIRECTION": return directionText(value, "In each common pair, the second number is one more than the first.", "In each common pair, the second number is one less than the first.");
    case "PAIR_SQUARE_DIRECTION": return directionText(value, "In each common pair, the second number is the square of the first.", "In each common pair, the first number is the square of the second.");
    case "PAIR_CUBE_DIRECTION": return directionText(value, "In each common pair, the second number is the cube of the first.", "In each common pair, the first number is the cube of the second.");
    case "PAIR_DIGIT_REVERSE_DIRECTION": return "In each common pair, the second number is formed by reversing the digits of the first.";
    case "TRIPLE_SUM_OF_TWO_EQUALS_THIRD": return `In each common triple, ${triplePositionText(value, "add")}.`;
    case "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD": return `In each common triple, ${triplePositionText(value, "multiply")}.`;
    case "TRIPLE_ARITHMETIC_PROGRESSION": return "Each common triple has the same difference between consecutive numbers.";
    case "TRIPLE_GEOMETRIC_PROGRESSION": return "Each common triple has the same multiplication ratio between consecutive numbers.";
    case "TRIPLE_PYTHAGOREAN_DIRECTION": return `In each common triple, ${triplePositionText(value, "square")}.`;
    case "TRIPLE_CONSECUTIVE_DIRECTION": return directionText(value, "Each common triple contains three consecutive increasing numbers.", "Each common triple contains three consecutive decreasing numbers.");
    case "TRIPLE_SUM": return `The three numbers in each common triple add to ${value}.`;
    case "TRIPLE_PRODUCT": return `The three numbers in each common triple multiply to ${value}.`;
  }
}

function exactEvidence(tuple: ClsCp005Tuple, ruleId: ClsCp005RuleId): string {
  const display = displayClsCp005Tuple(tuple);
  if (tuple.length === 2) {
    const [a, b] = tuple;
    switch (ruleId) {
      case "PAIR_SIGNED_DIFFERENCE": return `${display}: ${b} − ${a} = ${b - a}`;
      case "PAIR_REDUCED_RATIO": {
        const divisor = clsCp005Gcd(a, b);
        return `${display}: ${b}:${a} = ${b / divisor}:${a / divisor}`;
      }
      case "PAIR_SUM": return `${display}: ${a} + ${b} = ${a + b}`;
      case "PAIR_PRODUCT": return `${display}: ${a} × ${b} = ${a * b}`;
      case "PAIR_GCD": return `${display}: GCD(${a}, ${b}) = ${clsCp005Gcd(a, b)}`;
      case "PAIR_LCM": return `${display}: LCM(${a}, ${b}) = ${clsCp005Lcm(a, b)}`;
      case "PAIR_CONSECUTIVE_DIRECTION": return `${display}: the ordered difference is ${b - a}`;
      case "PAIR_SQUARE_DIRECTION": return b === a * a ? `${display}: ${a}² = ${b}` : a === b * b ? `${display}: ${b}² = ${a}` : `${display}: neither number is the square of the other`;
      case "PAIR_CUBE_DIRECTION": return b === a * a * a ? `${display}: ${a}³ = ${b}` : a === b * b * b ? `${display}: ${b}³ = ${a}` : `${display}: neither number is the cube of the other`;
      case "PAIR_DIGIT_REVERSE_DIRECTION": return `${display}: reversing ${a} gives ${clsCp005ReverseDigits(a)}`;
      default: return `${display}: this pair does not use the required pair rule`;
    }
  }
  const [a, b, c] = tuple;
  switch (ruleId) {
    case "TRIPLE_SUM_OF_TWO_EQUALS_THIRD": return `${display}: sums are ${a + b}, ${a + c} and ${b + c}`;
    case "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD": return `${display}: pair products are ${a * b}, ${a * c} and ${b * c}`;
    case "TRIPLE_ARITHMETIC_PROGRESSION": return `${display}: gaps are ${b - a} and ${c - b}`;
    case "TRIPLE_GEOMETRIC_PROGRESSION": return `${display}: compare ${b}² = ${b * b} with ${a} × ${c} = ${a * c}`;
    case "TRIPLE_PYTHAGOREAN_DIRECTION": return `${display}: squares are ${a * a}, ${b * b} and ${c * c}`;
    case "TRIPLE_CONSECUTIVE_DIRECTION": return `${display}: ordered gaps are ${b - a} and ${c - b}`;
    case "TRIPLE_SUM": return `${display}: ${a} + ${b} + ${c} = ${a + b + c}`;
    case "TRIPLE_PRODUCT": return `${display}: ${a} × ${b} × ${c} = ${a * b * c}`;
    default: return `${display}: this triple does not use the required triple rule`;
  }
}

function shortcut(ruleId: ClsCp005RuleId): string {
  switch (ruleId) {
    case "PAIR_SIGNED_DIFFERENCE": return "Subtract the first number from the second in every pair and compare the results.";
    case "PAIR_REDUCED_RATIO": return "Reduce second:first for every pair before comparing the ratios.";
    case "PAIR_SUM": return "Add the two numbers in each pair and write the total beside it.";
    case "PAIR_PRODUCT": return "Multiply the two numbers in each pair and compare the products.";
    case "PAIR_GCD": return "Find the greatest common divisor of each pair using small common factors first.";
    case "PAIR_LCM": return "Write the least common multiple of each pair and look for the different value.";
    case "PAIR_CONSECUTIVE_DIRECTION": return "Check the ordered difference only; +1 and −1 are different directions.";
    case "PAIR_SQUARE_DIRECTION": return "Compare the larger number with the square of the smaller one, but keep the order of the pair.";
    case "PAIR_CUBE_DIRECTION": return "Compare the larger number with the cube of the smaller one, but keep the order of the pair.";
    case "PAIR_DIGIT_REVERSE_DIRECTION": return "Reverse the digits of the first number in each pair and compare with the second.";
    case "TRIPLE_SUM_OF_TWO_EQUALS_THIRD": return "Try the three possible two-number sums and check which position receives the result.";
    case "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD": return "Try the three possible two-number products and keep the result position fixed.";
    case "TRIPLE_ARITHMETIC_PROGRESSION": return "Subtract neighbouring numbers in each triple; equal gaps mark an arithmetic progression.";
    case "TRIPLE_GEOMETRIC_PROGRESSION": return "Square the middle number and compare it with first × third.";
    case "TRIPLE_PYTHAGOREAN_DIRECTION": return "Square the numbers and test whether two squares add to the third square.";
    case "TRIPLE_CONSECUTIVE_DIRECTION": return "Check the two ordered gaps; both must be +1 or both must be −1.";
    case "TRIPLE_SUM": return "Add all three numbers in each option and compare the totals.";
    case "TRIPLE_PRODUCT": return "Multiply all three numbers in each option and compare the products.";
  }
}

function commonTrap(ruleId: ClsCp005RuleId): string {
  if (["PAIR_SIGNED_DIFFERENCE", "PAIR_REDUCED_RATIO", "PAIR_CONSECUTIVE_DIRECTION", "PAIR_SQUARE_DIRECTION", "PAIR_CUBE_DIRECTION"].includes(ruleId)) {
    return "Keep the numbers in their displayed order; reversing a pair can change the rule.";
  }
  if (["TRIPLE_SUM_OF_TWO_EQUALS_THIRD", "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD", "TRIPLE_PYTHAGOREAN_DIRECTION"].includes(ruleId)) {
    return "Do not stop after finding any true equation; the same positions must play the same roles in every option.";
  }
  return "Use one standard relation for every complete option; do not invent a different formula for each tuple.";
}

function stems(task: ClsCp005Task, arity: 2 | 3, referenceTuple: ClsCp005Tuple | null): readonly string[] {
  if (task === "FIND_ODD_NUMBER_PAIR") {
    return [
      "Which number pair follows a different rule?",
      "Find the odd number pair.",
      "Select the pair that is different from the rest.",
      "Which pair does not follow the common number relation?",
      "Choose the pair whose two numbers are related differently.",
    ];
  }
  if (task === "FIND_ODD_NUMBER_TRIPLE") {
    return [
      "Which number triple follows a different rule?",
      "Find the odd group of three numbers.",
      "Select the triple that is different from the rest.",
      "Which group of three does not follow the common relation?",
      "Choose the number triple with a different internal rule.",
    ];
  }
  const display = displayClsCp005Tuple(referenceTuple!);
  const noun = arity === 2 ? "pair" : "triple";
  return [
    `Study ${display}. Which ${noun} follows the same rule?`,
    `Which option is related in the same way as ${display}?`,
    `Select the ${noun} that matches the rule used in ${display}.`,
    `Find the option with the same internal relation as ${display}.`,
    `Which ${noun} belongs with ${display} under the same number rule?`,
  ];
}

function selectDistinctMembers(
  members: readonly ClsCp005Tuple[],
  count: number,
  start: number,
  stride: number,
  forbiddenKeys: ReadonlySet<string> = new Set(),
): ClsCp005Tuple[] {
  const selected: ClsCp005Tuple[] = [];
  const seen = new Set(forbiddenKeys);
  for (let step = 0; step < members.length * 2 && selected.length < count; step += 1) {
    const tuple = members[(start + step * stride) % members.length]!;
    const key = clsCp005TupleKey(tuple);
    if (seen.has(key)) continue;
    seen.add(key);
    selected.push(tuple);
  }
  return selected;
}

function usableCatalogEntries(ruleId: ClsCp005RuleId, minimumMembers: number): readonly [string, readonly ClsCp005Tuple[]][] {
  return [...clsCp005CatalogForRule(ruleId).entries()]
    .filter(([value, members]) => members.length >= minimumMembers && value !== "0")
    .filter(([value]) => ruleId !== "PAIR_LCM" || Number(value) <= 360)
    .filter(([value]) => ruleId !== "PAIR_GCD" || Number(value) <= 20)
    .sort(([left], [right]) => left.localeCompare(right, "en", { numeric: true }));
}

function constructOddState(
  prototype: ClsCp005PrototypeDefinition,
  ruleId: ClsCp005RuleId,
  seed: number,
  optionCount: 4 | 5,
): { tuples: readonly ClsCp005Tuple[]; referenceTuple: null; intendedRuleValue: string; audit: ClsCp005AmbiguityAudit } {
  const entries = usableCatalogEntries(ruleId, optionCount - 1);
  if (entries.length === 0) throw new Error(`No usable CLS-CP-005 catalog entries for ${ruleId}/${optionCount}`);
  const pool = clsCp005PoolForArity(prototype.arity);
  const baseHash = hashText(`${prototype.prototypeId}:${ruleId}:${seed}:${optionCount}`);
  for (let attempt = 0; attempt < 900; attempt += 1) {
    const [value, members] = entries[(baseHash + attempt * 17) % entries.length]!;
    const stride = 1 + ((baseHash >>> 3) + attempt) % Math.max(1, Math.min(11, members.length - 1));
    const common = selectDistinctMembers(members, optionCount - 1, (baseHash + attempt * 13) % members.length, stride);
    if (common.length !== optionCount - 1) continue;
    const commonKeys = new Set(common.map(clsCp005TupleKey));
    let odd: ClsCp005Tuple | null = null;
    for (let offset = 0; offset < Math.min(pool.length, 700); offset += 1) {
      const candidate = pool[(baseHash + attempt * 29 + offset * 31) % pool.length]!;
      if (commonKeys.has(clsCp005TupleKey(candidate))) continue;
      if (canonicalClsCp005RuleValue(candidate, ruleId) === value) continue;
      odd = candidate;
      break;
    }
    if (!odd) continue;
    const unpermuted = [...common, odd];
    const tuples = permutationByIndex(unpermuted, baseHash + attempt * 7);
    const audit = auditClsCp005OddTuples(tuples, ruleId, value);
    if (audit.result === "UNIQUE" && audit.answerIndex !== null && audit.intendedRuleSupported) {
      return { tuples, referenceTuple: null, intendedRuleValue: value, audit };
    }
  }
  throw new Error(`${prototype.prototypeId}/${seed}/${optionCount} could not construct an unambiguous odd-tuple state`);
}

function constructEquivalentState(
  prototype: ClsCp005PrototypeDefinition,
  ruleId: ClsCp005RuleId,
  seed: number,
  optionCount: 4 | 5,
): { tuples: readonly ClsCp005Tuple[]; referenceTuple: ClsCp005Tuple; intendedRuleValue: string; audit: ClsCp005AmbiguityAudit } {
  const entries = usableCatalogEntries(ruleId, 2);
  if (entries.length === 0) throw new Error(`No equivalent-set catalog entries for ${ruleId}`);
  const pool = clsCp005PoolForArity(prototype.arity);
  const baseHash = hashText(`${prototype.prototypeId}:${ruleId}:${seed}:${optionCount}:equivalent`);
  for (let attempt = 0; attempt < 1200; attempt += 1) {
    const [value, members] = entries[(baseHash + attempt * 19) % entries.length]!;
    const referenceTuple = members[(baseHash + attempt * 11) % members.length]!;
    const referenceKey = clsCp005TupleKey(referenceTuple);
    const matches = selectDistinctMembers(members, 1, (baseHash + attempt * 23 + 1) % members.length, 1 + attempt % 7, new Set([referenceKey]));
    if (matches.length !== 1) continue;
    const match = matches[0]!;
    const selectedKeys = new Set([referenceKey, clsCp005TupleKey(match)]);
    const distractors: ClsCp005Tuple[] = [];
    for (let offset = 0; offset < Math.min(pool.length, 1500) && distractors.length < optionCount - 1; offset += 1) {
      const candidate = pool[(baseHash + attempt * 37 + offset * 43) % pool.length]!;
      const key = clsCp005TupleKey(candidate);
      if (selectedKeys.has(key)) continue;
      if (canonicalClsCp005RuleValue(candidate, ruleId) === value) continue;
      selectedKeys.add(key);
      distractors.push(candidate);
    }
    if (distractors.length !== optionCount - 1) continue;
    const tuples = permutationByIndex([match, ...distractors], baseHash + attempt * 5);
    const audit = auditClsCp005EquivalentSet(referenceTuple, tuples, ruleId, value);
    if (audit.result === "UNIQUE" && audit.answerIndex !== null && audit.intendedRuleSupported) {
      return { tuples, referenceTuple, intendedRuleValue: value, audit };
    }
  }
  throw new Error(`${prototype.prototypeId}/${seed}/${optionCount} could not construct an unambiguous equivalent-set state`);
}

function arithmeticDemand(ruleId: ClsCp005RuleId): 1 | 2 | 3 {
  if (["PAIR_SIGNED_DIFFERENCE", "PAIR_SUM", "PAIR_CONSECUTIVE_DIRECTION", "PAIR_DIGIT_REVERSE_DIRECTION", "TRIPLE_CONSECUTIVE_DIRECTION", "TRIPLE_SUM"].includes(ruleId)) return 1;
  if (["PAIR_REDUCED_RATIO", "PAIR_PRODUCT", "TRIPLE_SUM_OF_TWO_EQUALS_THIRD", "TRIPLE_ARITHMETIC_PROGRESSION", "TRIPLE_GEOMETRIC_PROGRESSION"].includes(ruleId)) return 2;
  return 3;
}

function isDirectionSensitive(ruleId: ClsCp005RuleId): boolean {
  return [
    "PAIR_SIGNED_DIFFERENCE", "PAIR_REDUCED_RATIO", "PAIR_CONSECUTIVE_DIRECTION",
    "PAIR_SQUARE_DIRECTION", "PAIR_CUBE_DIRECTION", "PAIR_DIGIT_REVERSE_DIRECTION",
    "TRIPLE_SUM_OF_TWO_EQUALS_THIRD", "TRIPLE_PRODUCT_OF_TWO_EQUALS_THIRD",
    "TRIPLE_PYTHAGOREAN_DIRECTION", "TRIPLE_CONSECUTIVE_DIRECTION",
  ].includes(ruleId);
}

function difficultyFeatures(
  tuples: readonly ClsCp005Tuple[],
  ruleId: ClsCp005RuleId,
  task: ClsCp005Task,
  optionCount: 4 | 5,
  supportCount: number,
): ClsCp005DifficultyFeatures {
  const maximumValue = Math.max(...tuples.flatMap((tuple) => [...tuple]));
  const demand = arithmeticDemand(ruleId);
  const directionSensitive = isDirectionSensitive(ruleId);
  const score =
    (optionCount === 5 ? 1 : 0)
    + (tuples[0]!.length === 3 ? 1 : 0)
    + (maximumValue >= 100 ? 1 : 0)
    + (demand - 1)
    + (directionSensitive ? 1 : 0)
    + (task === "SELECT_EQUIVALENT_NUMBER_SET" ? 1 : 0)
    + Math.min(1, Math.max(0, supportCount - 1));
  return {
    optionCount,
    arity: tuples[0]!.length as 2 | 3,
    maximumValue,
    arithmeticDemand: demand,
    directionSensitive,
    competingSupportCount: supportCount,
    referenceTupleRequired: task === "SELECT_EQUIVALENT_NUMBER_SET",
    score,
  };
}

function difficultyFromScore(score: number): ClsCp005Difficulty {
  if (score <= 2) return "EASY";
  if (score <= 4) return "MEDIUM";
  return "HARD";
}

function buildExplanation(
  task: ClsCp005Task,
  tuples: readonly ClsCp005Tuple[],
  referenceTuple: ClsCp005Tuple | null,
  correctIndex: number,
  ruleId: ClsCp005RuleId,
  value: string,
): GeneratedClsCp005Question["explanation"] {
  const displays = tuples.map(displayClsCp005Tuple);
  const answer = displays[correctIndex]!;
  if (task === "SELECT_EQUIVALENT_NUMBER_SET") {
    return {
      coreConcept: [ruleStatement(ruleId, value)],
      stepByStep: [
        `${exactEvidence(referenceTuple!, ruleId)} gives the reference rule.`,
        `${exactEvidence(tuples[correctIndex]!, ruleId)} gives the same rule value.`,
        `The other options give different values, so ${answer} is correct.`,
      ],
      examSpeedShortcut: [shortcut(ruleId)],
      commonTrapWarning: [commonTrap(ruleId)],
    };
  }
  const common = displays.filter((_, index) => index !== correctIndex);
  return {
    coreConcept: [ruleStatement(ruleId, value)],
    stepByStep: [
      `${naturalList(common)} follow the same internal rule.`,
      `${exactEvidence(tuples[correctIndex]!, ruleId)} gives a different result.`,
      `Therefore, ${answer} is the odd option.`,
    ],
    examSpeedShortcut: [shortcut(ruleId)],
    commonTrapWarning: [commonTrap(ruleId)],
  };
}

export function generateClsCp005DiscoveryQuestion(
  prototypeId: ClsCp005PrototypeId,
  seed = 0,
  requestedOptionCount?: 4 | 5,
): GeneratedClsCp005Question {
  if (!Number.isSafeInteger(seed) || seed < 0) throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  const prototype = CLS_CP005_PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS-CP-005 prototype: ${prototypeId}`);
  const optionCount = requestedOptionCount ?? (hashText(`${prototypeId}:options:${seed}`) % 4 === 0 ? 5 : 4);
  if (optionCount !== 4 && optionCount !== 5) throw new Error(`CLS-CP-005 supports four or five options, received ${optionCount}`);
  const ruleId = prototype.allowedRuleIds[hashText(`${prototypeId}:rule:${seed}`) % prototype.allowedRuleIds.length]!;
  if (isClsCp005PairRule(ruleId) !== (prototype.arity === 2)) throw new Error(`${prototypeId} selected a rule with the wrong arity`);
  const state = prototype.task === "SELECT_EQUIVALENT_NUMBER_SET"
    ? constructEquivalentState(prototype, ruleId, seed, optionCount)
    : constructOddState(prototype, ruleId, seed, optionCount);
  const correctIndex = state.audit.answerIndex;
  if (correctIndex === null) throw new Error(`${prototypeId}/${seed} produced no answer after audit`);
  const options = state.tuples.map(displayClsCp005Tuple);
  const features = difficultyFeatures(state.tuples, ruleId, prototype.task, optionCount, state.audit.candidateSupports.length);
  const stemOptions = stems(prototype.task, prototype.arity, state.referenceTuple);
  const stem = stemOptions[hashText(`${prototypeId}:stem:${seed}`) % stemOptions.length]!;
  const evidenceByOption = state.tuples.map((tuple) => {
    const actualValue = canonicalClsCp005RuleValue(tuple, ruleId);
    return `${exactEvidence(tuple, ruleId)}; it ${actualValue === state.intendedRuleValue ? "matches" : "does not match"} the intended rule.`;
  });
  return {
    checkpointId: "CLS-CP-005",
    prototypeId,
    permanentQlId: null,
    seed,
    task: prototype.task,
    arity: prototype.arity,
    stem,
    referenceTuple: state.referenceTuple,
    tuples: state.tuples,
    options,
    correctIndex,
    answer: options[correctIndex]!,
    intendedRuleId: ruleId,
    intendedRuleValue: state.intendedRuleValue,
    evidenceByOption,
    ambiguityAudit: state.audit,
    difficulty: difficultyFromScore(features.score),
    difficultyFeatures: features,
    explanation: buildExplanation(prototype.task, state.tuples, state.referenceTuple, correctIndex, ruleId, state.intendedRuleValue),
    reviewOnly: true,
    questionStudioVisible: false,
    metadata: {
      datasetVersion: "CLS-CP005-TUPLE-DOMAIN-v1",
      runtimeVersion: "cls-cp005-discovery-v1",
      locale: "en-IN",
      optionCount,
      sourceSaturationStatus: "INITIAL_SOURCE_PASS_COMPLETE__GAP_AUDIT_OPEN",
    },
    lifecycle: LIFECYCLE,
  };
}