import {
  CLS_CP007_PROTOTYPE_BY_ID,
  clsCp007FormatItem,
  clsCp007GapEqualityPattern,
  clsCp007LetterPosition,
  clsCp007NormalizedGapRatio,
  clsCp007RepeatPattern,
  clsCp007RuleGroups,
  clsCp007RuleIdsForLength,
  clsCp007RuleValue,
  clsCp007SignedGaps,
} from "./cluster-domain";
import type {
  ClsCp007AmbiguityAudit,
  ClsCp007ClusterItem,
  ClsCp007Difficulty,
  ClsCp007DifficultyFeatures,
  ClsCp007Explanation,
  ClsCp007Length,
  ClsCp007PrototypeId,
  ClsCp007RuleId,
  ClsCp007RuleSupport,
  GeneratedClsCp007Question,
} from "./types";

function assertSeed(seed: number): void {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`CLS-CP-007 seed must be a non-negative safe integer: ${seed}`);
  }
}

function mix(seed: number, salt: number): number {
  let value = (seed + Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d) >>> 0;
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function choose<T>(values: readonly T[], seed: number, salt: number): T {
  if (values.length === 0) throw new Error("Cannot choose from an empty CLS-CP-007 collection.");
  return values[mix(seed, salt) % values.length]!;
}

function sampleDistinct<T>(
  values: readonly T[],
  count: number,
  seed: number,
  salt: number,
): readonly T[] {
  if (count > values.length) throw new Error(`Cannot sample ${count} values from ${values.length}.`);
  return values
    .map((value, index) => ({ value, rank: mix(seed + index * 131, salt + index * 17) }))
    .sort((left, right) => left.rank - right.rank || String(left.value).localeCompare(String(right.value)))
    .slice(0, count)
    .map(({ value }) => value);
}

function shuffled<T>(values: readonly T[], seed: number, salt: number): readonly T[] {
  return values
    .map((value, index) => ({ value, rank: mix(seed + index * 211, salt + index * 29) }))
    .sort((left, right) => left.rank - right.rank)
    .map(({ value }) => value);
}

export function auditClsCp007Items(
  items: readonly ClsCp007ClusterItem[],
  intendedRuleId: ClsCp007RuleId,
  intendedAnswerIndex: number,
): ClsCp007AmbiguityAudit {
  if (items.length !== 4 && items.length !== 5) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "CLS-CP-007 requires four or five options.",
    };
  }
  const length = items[0]?.letters.length as ClsCp007Length | undefined;
  if (!length || (length !== 3 && length !== 4 && length !== 5)) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "CLS-CP-007 requires clusters of length three, four or five.",
    };
  }
  if (items.some((item) => item.kind !== "LETTER_CLUSTER" || item.letters.length !== length)) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "All options must be complete clusters of one common length.",
    };
  }
  if (new Set(items.map(clsCp007FormatItem)).size !== items.length) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "Displayed clusters must be unique.",
    };
  }

  const supports: ClsCp007RuleSupport[] = [];
  for (const ruleId of clsCp007RuleIdsForLength(length)) {
    const values = items.map((item) => clsCp007RuleValue(item, ruleId));
    const indexesByValue = new Map<string, number[]>();
    values.forEach((value, index) => {
      const indexes = indexesByValue.get(value) ?? [];
      indexes.push(index);
      indexesByValue.set(value, indexes);
    });
    if (indexesByValue.size !== 2) continue;
    const entries = [...indexesByValue.entries()];
    const common = entries.find(([, indexes]) => indexes.length === items.length - 1);
    const singleton = entries.find(([, indexes]) => indexes.length === 1);
    if (!common || !singleton) continue;
    supports.push({
      ruleId,
      commonValue: common[0],
      outlierValue: singleton[0],
      matchingOptionIndexes: common[1],
      answerIndex: singleton[1][0]!,
    });
  }

  const intendedRuleSupported = supports.some(
    (support) => support.ruleId === intendedRuleId && support.answerIndex === intendedAnswerIndex,
  );
  if (supports.length === 0) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported,
      candidateSupports: supports,
      reason: "No admitted cluster rule isolates one option.",
    };
  }
  const answerIndexes = [...new Set(supports.map((support) => support.answerIndex))];
  if (!intendedRuleSupported || answerIndexes.length !== 1) {
    return {
      result: "AMBIGUOUS",
      answerIndex: answerIndexes.length === 1 ? answerIndexes[0]! : null,
      intendedRuleSupported,
      candidateSupports: supports,
      reason: !intendedRuleSupported
        ? "The intended cluster rule does not independently support the stored answer."
        : "Different admitted cluster rules identify different outliers.",
    };
  }
  return {
    result: "UNIQUE",
    answerIndex: answerIndexes[0]!,
    intendedRuleSupported: true,
    candidateSupports: supports,
    reason: supports.length === 1
      ? "Exactly one admitted cluster rule isolates the answer."
      : "All admitted supporting cluster rules isolate the same answer.",
  };
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function vectorText(value: string, withSign = true): string {
  return value
    .split(",")
    .map((entry) => withSign ? signed(Number(entry)) : String(Number(entry)))
    .join(", ");
}

function displayPattern(value: string): string {
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return value
    .split("-")
    .map((entry) => labels[Number(entry) - 1] ?? entry)
    .join("–");
}

function stemFor(seed: number): string {
  const stems = [
    "Which of the following letter-clusters is the odd one out?",
    "All but one of these letter-clusters share the same internal alphabet pattern. Select the different cluster.",
    "Identify the complete letter-cluster that does not follow the common internal relation.",
    "Most of these letter-clusters obey one alphabet structure. Which cluster differs?",
    "Choose the letter-cluster whose internal position pattern is different from the others.",
  ];
  return choose(stems, seed, 401);
}

function commonValueAllowed(
  ruleId: ClsCp007RuleId,
  value: string,
  length: ClsCp007Length,
): boolean {
  const numbers = value.split(",").map(Number);
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return numbers.every((entry) => entry !== 0);
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO":
      return numbers.some((entry) => entry !== 0) && numbers.every((entry) => Math.abs(entry) <= 8);
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return new Set(value.split("-")).size < length - 1;
    case "CLUSTER_VOWEL_COUNT": {
      const count = Number(value);
      return count >= 0 && count < length;
    }
    case "CLUSTER_REPEAT_PATTERN":
      return new Set(value.split("-")).size < length;
    case "CLUSTER_POSITION_SUM": {
      const total = Number(value);
      return total >= length * 4 && total <= length * 22;
    }
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS":
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return value === "MATCH";
    case "CLUSTER_HALF_SUM_DIFFERENCE": {
      const difference = Number(value);
      return difference >= 1 && difference <= 24;
    }
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return numbers.length === 2 && numbers.every((entry) => entry !== 0 && Math.abs(entry) <= 6);
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP": {
      const gap = Number(value);
      return gap >= 1 && gap <= 12;
    }
  }
}

function evidenceFor(item: ClsCp007ClusterItem, ruleId: ClsCp007RuleId): string {
  const cluster = clsCp007FormatItem(item);
  const positions = item.letters.map(clsCp007LetterPosition);
  const positionList = positions.join(", ");
  const gaps = clsCp007SignedGaps(item);
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
      return `${cluster}: positions ${positionList}; signed gaps ${gaps.map(signed).join(", ")}.`;
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return `${cluster}: positions ${positionList}; absolute gaps ${gaps.map((gap) => Math.abs(gap)).join(", ")}.`;
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO": {
      const ratio = clsCp007NormalizedGapRatio(gaps);
      return `${cluster}: signed gaps ${gaps.map(signed).join(", ")}; reduced ratio ${ratio.map(signed).join(":")}.`;
    }
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return `${cluster}: signed gaps ${gaps.map(signed).join(", ")}; equality form ${displayPattern(clsCp007GapEqualityPattern(item))}.`;
    case "CLUSTER_VOWEL_COUNT": {
      const count = Number(clsCp007RuleValue(item, ruleId));
      return `${cluster} contains ${count} ${count === 1 ? "vowel" : "vowels"}.`;
    }
    case "CLUSTER_REPEAT_PATTERN":
      return `${cluster} has letter-equality form ${displayPattern(clsCp007RepeatPattern(item))}.`;
    case "CLUSTER_POSITION_SUM":
      return `${cluster}: ${positions.join(" + ")} = ${positions.reduce((total, position) => total + position, 0)}.`;
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS":
      return `${cluster}: ${positions[0]} + ${positions[1]} = ${positions[0]! + positions[1]!}${positions[0]! + positions[1]! === positions[2] ? ` = ${positions[2]}` : `, not ${positions[2]}`}.`;
    case "CLUSTER_HALF_SUM_DIFFERENCE": {
      const left = positions[0]! + positions[1]!;
      const right = positions[2]! + positions[3]!;
      return `${cluster}: |(${positions[0]} + ${positions[1]}) - (${positions[2]} + ${positions[3]})| = |${left} - ${right}| = ${Math.abs(left - right)}.`;
    }
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
      return `${cluster}: positions 1 and 3 total ${positions[0]! + positions[2]!}; positions 2 and 4 total ${positions[1]! + positions[3]!}.`;
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return `${cluster}: positions 1 and 2 total ${positions[0]! + positions[1]!}; positions 3 and 4 total ${positions[2]! + positions[3]!}.`;
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return `${cluster}: first pair gap ${signed(positions[1]! - positions[0]!)}, second pair gap ${signed(positions[3]! - positions[2]!)}.`;
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      return `${cluster}: central letters are at ${positions[1]} and ${positions[2]}, so their gap is ${Math.abs(positions[2]! - positions[1]!)}.`;
  }
}

function coreConceptFor(ruleId: ClsCp007RuleId, commonValue: string): string {
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
      return `Most clusters have the same ordered signed-gap vector: ${vectorText(commonValue)}.`;
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return `Most clusters have the same ordered absolute-gap vector: ${vectorText(commonValue, false)}.`;
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO":
      return `Most clusters have adjacent movements in the same reduced signed ratio: ${commonValue.split(",").map(signed).join(":")}.`;
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return `Most clusters share the same equality arrangement among their adjacent gaps: ${displayPattern(commonValue)}.`;
    case "CLUSTER_VOWEL_COUNT": {
      const count = Number(commonValue);
      return `Most clusters contain exactly ${count} ${count === 1 ? "vowel" : "vowels"}.`;
    }
    case "CLUSTER_REPEAT_PATTERN":
      return `Most clusters repeat letters in the same positional form: ${displayPattern(commonValue)}.`;
    case "CLUSTER_POSITION_SUM":
      return `Most clusters have alphabet positions adding to ${commonValue}.`;
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS":
      return commonValue === "MATCH"
        ? "In most three-letter clusters, the first two alphabet positions add exactly to the third."
        : "In most three-letter clusters, the first two positions do not add to the third; one cluster does.";
    case "CLUSTER_HALF_SUM_DIFFERENCE":
      return `In most four-letter clusters, the absolute difference between the first-pair total and second-pair total is ${commonValue}.`;
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
      return commonValue === "MATCH"
        ? "In most clusters, letters at positions 1–3 and 2–4 are opposite alphabet pairs, so each pair totals 27."
        : "Most clusters do not have opposite pairings at indexes 1–3 and 2–4; one does.";
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return commonValue === "MATCH"
        ? "In most clusters, the first adjacent pair and the second adjacent pair are both opposite-letter pairs totaling 27."
        : "Most clusters do not contain two adjacent opposite-letter pairs; one does.";
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return `Most clusters have the same signed movement inside their first and second adjacent pairs: ${vectorText(commonValue)}.`;
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      return `In most clusters, the two central letters are ${commonValue} alphabet positions apart.`;
  }
}

function shortcutFor(ruleId: ClsCp007RuleId): string {
  switch (ruleId) {
    case "CLUSTER_VOWEL_COUNT":
      return "Mark A, E, I, O and U in every cluster, then compare the counts.";
    case "CLUSTER_REPEAT_PATTERN":
      return "Label the first new letter A, the next new letter B, and reuse a label whenever a letter repeats.";
    case "CLUSTER_POSITION_SUM":
      return "Write the alphabet positions under each cluster and add them from left to right.";
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS":
      return "Add the first two positions and compare the result directly with the third position.";
    case "CLUSTER_HALF_SUM_DIFFERENCE":
      return "Add positions 1–2 and 3–4 separately before taking one absolute difference.";
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
      return "Check the 1st with the 3rd and the 2nd with the 4th; opposite positions total 27.";
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return "Check positions 1–2 and 3–4 as two blocks; each opposite pair must total 27.";
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return "Subtract within positions 1–2 and 3–4 only; ignore the gap between the two blocks.";
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      return "Compare only positions 2 and 3, using the absolute difference.";
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return "Write every adjacent position difference and remove the signs before comparing the vectors.";
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO":
      return "Write the signed gaps, divide them by their common factor, and compare the reduced patterns.";
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return "Compare which gaps are equal to one another before comparing their numerical sizes.";
    default:
      return "Write the alphabet positions and compare the adjacent movements in their displayed order.";
  }
}

function trapFor(ruleId: ClsCp007RuleId): string {
  switch (ruleId) {
    case "CLUSTER_SIGNED_GAP_VECTOR":
      return "Do not drop the signs; forward and backward movements are different.";
    case "CLUSTER_ABSOLUTE_GAP_VECTOR":
      return "Do not reject a cluster only because one movement is reversed; this rule compares magnitudes.";
    case "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO":
      return "Do not compare raw gap sizes before reducing by the common factor.";
    case "CLUSTER_GAP_EQUALITY_PATTERN":
      return "Do not require identical numbers when the tested structure is only which gaps repeat.";
    case "CLUSTER_REPEAT_PATTERN":
      return "Do not compare the actual letters; compare which positions contain equal letters.";
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return "Do not pair visually convenient letters; use the declared cluster indexes and confirm totals of 27.";
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return "Do not include the middle cross-block gap; only the two stated pair movements matter.";
    case "CLUSTER_CENTRAL_ABSOLUTE_GAP":
      return "Do not compare the end letters; the active relation is only between the middle two positions.";
    default:
      return "Do not stop at surface resemblance; verify the active calculation for every complete cluster.";
  }
}

function difficultyFor(
  items: readonly ClsCp007ClusterItem[],
  ruleId: ClsCp007RuleId,
  optionCount: 4 | 5,
  supportCount: number,
): { difficulty: ClsCp007Difficulty; features: ClsCp007DifficultyFeatures } {
  const clusterLength = items[0]!.letters.length as ClsCp007Length;
  const arithmeticDemand: 1 | 2 | 3 =
    ruleId === "CLUSTER_VOWEL_COUNT" || ruleId === "CLUSTER_REPEAT_PATTERN"
      ? 1
      : ruleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO" ||
          ruleId === "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS" ||
          ruleId === "CLUSTER_HALF_SUM_DIFFERENCE" ||
          ruleId === "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS" ||
          ruleId === "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS"
        ? 3
        : 2;
  const structuralLayers: 1 | 2 | 3 =
    ruleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO" ||
    ruleId === "CLUSTER_HALF_SUM_DIFFERENCE" ||
    ruleId === "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS" ||
    ruleId === "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS"
      ? 3
      : ruleId === "CLUSTER_SIGNED_GAP_VECTOR" ||
          ruleId === "CLUSTER_ABSOLUTE_GAP_VECTOR" ||
          ruleId === "CLUSTER_GAP_EQUALITY_PATTERN" ||
          ruleId === "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS" ||
          ruleId === "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE"
        ? 2
        : 1;
  const directionSensitive =
    ruleId === "CLUSTER_SIGNED_GAP_VECTOR" ||
    ruleId === "CLUSTER_NORMALIZED_SIGNED_GAP_RATIO" ||
    ruleId === "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE";
  const maximumPosition = Math.max(
    ...items.flatMap((item) => item.letters.map(clsCp007LetterPosition)),
  );
  const score =
    arithmeticDemand +
    (clusterLength - 3) +
    (structuralLayers - 1) +
    (directionSensitive ? 1 : 0) +
    (optionCount === 5 ? 1 : 0) +
    (supportCount > 1 ? 1 : 0);
  const difficulty: ClsCp007Difficulty =
    score <= 3 ? "EASY" : score <= 6 ? "MEDIUM" : "HARD";
  return {
    difficulty,
    features: {
      optionCount,
      clusterLength,
      arithmeticDemand,
      structuralLayers,
      directionSensitive,
      competingSupportCount: supportCount,
      maximumPosition,
      score,
    },
  };
}

function explanationFor(
  items: readonly ClsCp007ClusterItem[],
  ruleId: ClsCp007RuleId,
  commonValue: string,
  correctIndex: number,
): { evidence: readonly string[]; explanation: ClsCp007Explanation } {
  const evidence = items.map((item) => evidenceFor(item, ruleId));
  const answer = clsCp007FormatItem(items[correctIndex]!);
  return {
    evidence,
    explanation: {
      coreConcept: [coreConceptFor(ruleId, commonValue)],
      stepByStep: [...evidence, `Therefore, ${answer} is the odd one out.`],
      examSpeedShortcut: [shortcutFor(ruleId)],
      commonTrapWarning: [trapFor(ruleId)],
    },
  };
}

export function generateClsCp007Question(
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp007Question {
  assertSeed(seed);
  if (optionCount !== 4 && optionCount !== 5) {
    throw new Error(`CLS-CP-007 option count must be 4 or 5: ${optionCount}`);
  }
  const prototype = CLS_CP007_PROTOTYPE_BY_ID.get(prototypeId);
  if (!prototype) throw new Error(`Unknown CLS-CP-007 prototype: ${prototypeId}`);
  const intendedRuleId = choose(prototype.allowedRuleIds, seed, 101);
  const clusterLength = choose(prototype.allowedLengths, seed, 103);
  const commonCount = optionCount - 1;

  for (let attempt = 0; attempt < 2_000; attempt += 1) {
    const attemptSeed = seed + attempt * 10_007;
    const groups = [...clsCp007RuleGroups(clusterLength, intendedRuleId).entries()]
      .filter(([value, items]) =>
        items.length >= commonCount && commonValueAllowed(intendedRuleId, value, clusterLength),
      )
      .sort(([left], [right]) => left.localeCompare(right));
    if (groups.length === 0) {
      throw new Error(`No governed group exists for ${prototypeId}/${clusterLength}/${intendedRuleId}.`);
    }
    const [commonValue, commonDomain] = choose(groups, attemptSeed, 107);
    const commonItems = sampleDistinct(commonDomain, commonCount, attemptSeed, 109);
    const outlierGroups = [...clsCp007RuleGroups(clusterLength, intendedRuleId).entries()]
      .filter(([value, items]) => value !== commonValue && items.length > 0)
      .sort(([left], [right]) => left.localeCompare(right));
    const [, outlierDomain] = choose(outlierGroups, attemptSeed, 113);
    const outlierItem = choose(outlierDomain, attemptSeed, 127);
    const items = shuffled([...commonItems, outlierItem], attemptSeed, 131);
    const correctIndex = items.findIndex((item) => item === outlierItem);
    const ambiguityAudit = auditClsCp007Items(items, intendedRuleId, correctIndex);
    if (
      ambiguityAudit.result !== "UNIQUE" ||
      ambiguityAudit.answerIndex !== correctIndex ||
      !ambiguityAudit.intendedRuleSupported
    ) {
      continue;
    }

    const options = items.map(clsCp007FormatItem);
    const { evidence, explanation } = explanationFor(
      items,
      intendedRuleId,
      commonValue,
      correctIndex,
    );
    const { difficulty, features } = difficultyFor(
      items,
      intendedRuleId,
      optionCount,
      ambiguityAudit.candidateSupports.length,
    );
    return {
      checkpointId: "CLS-CP-007",
      prototypeId,
      permanentQlId: null,
      seed,
      task: "FIND_ODD_LETTER_CLUSTER",
      clusterLength,
      stem: stemFor(attemptSeed),
      items,
      options,
      correctIndex,
      answer: options[correctIndex]!,
      intendedRuleId,
      intendedRuleValue: commonValue,
      evidenceByOption: evidence,
      ambiguityAudit,
      difficulty,
      difficultyFeatures: features,
      explanation,
      reviewOnly: true,
      questionStudioVisible: false,
      metadata: {
        datasetVersion: "CLS-CP007-LETTER-CLUSTER-DOMAIN-v1",
        runtimeVersion: "cls-cp007-discovery-v1",
        locale: "en-IN",
        optionCount,
        sourcePrototypeSeed: attemptSeed,
        sourceSaturationStatus: "INITIAL_SOURCE_PASS_COMPLETE__GAP_AUDIT_OPEN",
      },
      lifecycle: {
        permanentQlId: null,
        reviewStatus: "UNREVIEWED_DISCOVERY",
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
        questionStudioDiscoverable: false,
      },
    };
  }
  throw new Error(`Unable to generate an ambiguity-safe CLS-CP-007 question for ${prototypeId}/${seed}.`);
}
