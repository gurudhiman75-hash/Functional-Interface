import {
  CLS_CP007_PAIR_RULE_IDS,
  clsCp007ClusterPairNuisanceGroups,
  clsCp007FormatPairItem,
  clsCp007LetterPosition,
  clsCp007PairNuisanceKey,
  clsCp007PairRuleValue,
} from "./cluster-pair-domain";
import type {
  ClsCp007PairAmbiguityAudit,
  ClsCp007PairItem,
  ClsCp007PairRuleId,
  ClsCp007PairRuleSupport,
  GeneratedClsCp007PairQuestion,
} from "./cluster-pair-types";

function assertSeed(seed: number): void {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`CLS-CP-007 cluster-pair seed must be a non-negative safe integer: ${seed}`);
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

function ranked<T>(values: readonly T[], seed: number, salt: number): readonly T[] {
  return values
    .map((value, index) => ({ value, rank: mix(seed + index * 131, salt + index * 17) }))
    .sort((left, right) => left.rank - right.rank || String(left.value).localeCompare(String(right.value)))
    .map(({ value }) => value);
}

function shuffled<T>(values: readonly T[], seed: number, salt: number): readonly T[] {
  return ranked(values, seed, salt);
}

export function auditClsCp007PairItems(
  items: readonly ClsCp007PairItem[],
  intendedRuleId: ClsCp007PairRuleId,
  intendedAnswerIndex: number,
): ClsCp007PairAmbiguityAudit {
  if (items.length !== 4 && items.length !== 5) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "CLS-CP-007 cluster-pair questions require four or five options.",
    };
  }
  if (items.some((item) =>
    item.kind !== "LETTER_CLUSTER_PAIR" || item.left.length !== 3 || item.right.length !== 3
  )) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "Every option must contain two complete three-letter clusters.",
    };
  }
  if (new Set(items.map(clsCp007FormatPairItem)).size !== items.length) {
    return {
      result: "NO_VALID_RULE",
      answerIndex: null,
      intendedRuleSupported: false,
      candidateSupports: [],
      reason: "Displayed cluster-pair options must be unique.",
    };
  }

  const supports: ClsCp007PairRuleSupport[] = [];
  for (const ruleId of CLS_CP007_PAIR_RULE_IDS) {
    const indexesByValue = new Map<string, number[]>();
    items.forEach((item, index) => {
      const value = clsCp007PairRuleValue(item, ruleId);
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
      reason: "No admitted cluster-pair rule isolates one option.",
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
        ? "The intended cluster-pair rule does not support the stored answer."
        : "Different admitted cluster-pair rules identify different answers.",
    };
  }
  return {
    result: "UNIQUE",
    answerIndex: answerIndexes[0]!,
    intendedRuleSupported: true,
    candidateSupports: supports,
    reason: supports.length === 1
      ? "Exactly one admitted cluster-pair rule isolates the answer."
      : "All admitted supporting cluster-pair rules isolate the same answer.",
  };
}

function stem(seed: number): string {
  const forms = [
    "Which of the following letter-cluster pairs is the odd one out?",
    "In most options, the right cluster is formed from the left cluster by the same alphabet relation. Select the different pair.",
    "All but one complete cluster pair follow the same position-wise transformation. Which pair differs?",
    "Identify the letter-cluster pair whose corresponding letters do not follow the common relation.",
    "Choose the complete cluster pair with the different internal alphabet transformation.",
  ];
  return forms[mix(seed, 401) % forms.length]!;
}

function evidence(item: ClsCp007PairItem): string {
  const leftPositions = item.left.map(clsCp007LetterPosition);
  const rightPositions = item.right.map(clsCp007LetterPosition);
  const totals = leftPositions.map((value, index) => value + rightPositions[index]!);
  const matches = totals.every((total) => total === 27);
  const checks = item.left.map(
    (letter, index) =>
      `${letter}(${leftPositions[index]}) + ${item.right[index]}(${rightPositions[index]}) = ${totals[index]}`,
  );
  return `${clsCp007FormatPairItem(item)}: ${checks.join("; ")}, so it ${matches ? "follows" : "does not follow"} the common opposite-letter rule.`;
}

function leftKey(item: ClsCp007PairItem): string {
  return item.left.join("");
}

export function generateClsCp007PairQuestion(
  seed: number,
  optionCount: 4 | 5 = 4,
): GeneratedClsCp007PairQuestion {
  assertSeed(seed);
  if (optionCount !== 4 && optionCount !== 5) {
    throw new Error(`CLS-CP-007 cluster-pair option count must be 4 or 5: ${optionCount}`);
  }
  const commonCount = optionCount - 1;
  const groups = ranked(
    clsCp007ClusterPairNuisanceGroups().filter(
      (group) => group.common.length >= commonCount + 1 && group.nearMisses.length > 0,
    ),
    seed,
    101,
  );

  for (let commonPoolAttempt = 0; commonPoolAttempt < groups.length; commonPoolAttempt += 1) {
    const group = groups[commonPoolAttempt]!;
    const nearMisses = ranked(group.nearMisses, seed + commonPoolAttempt * 1_009, 103);
    for (let outlierAttempt = 0; outlierAttempt < nearMisses.length; outlierAttempt += 1) {
      const nearMiss = nearMisses[outlierAttempt]!;
      const outlierLeft = leftKey(nearMiss.item);
      const commonCandidates = ranked(
        group.common.filter((item) => leftKey(item) !== outlierLeft),
        seed + outlierAttempt * 97,
        107,
      );
      const selected: ClsCp007PairItem[] = [];
      const usedLeft = new Set<string>();
      for (const candidate of commonCandidates) {
        const key = leftKey(candidate);
        if (usedLeft.has(key)) continue;
        selected.push(candidate);
        usedLeft.add(key);
        if (selected.length === commonCount) break;
      }
      if (selected.length !== commonCount) continue;

      const items = shuffled(
        [...selected, nearMiss.item],
        seed + commonPoolAttempt * 10_007 + outlierAttempt * 211,
        109,
      );
      const correctIndex = items.findIndex((item) => item === nearMiss.item);
      const ambiguityAudit = auditClsCp007PairItems(
        items,
        "CLUSTER_PAIR_OPPOSITE_TRANSFORM_STATUS",
        correctIndex,
      );
      if (
        ambiguityAudit.result !== "UNIQUE" ||
        ambiguityAudit.answerIndex !== correctIndex ||
        !ambiguityAudit.intendedRuleSupported
      ) {
        continue;
      }
      if (new Set(items.map(clsCp007PairNuisanceKey)).size !== 1) continue;

      const options = items.map(clsCp007FormatPairItem);
      const evidenceByOption = items.map(evidence);
      const difficulty = optionCount === 5 || ambiguityAudit.candidateSupports.length > 2
        ? "HARD"
        : "MEDIUM";
      return {
        checkpointId: "CLS-CP-007",
        prototypeId: "CLS-CP007-PAIR-PROT-001",
        permanentQlId: null,
        seed,
        task: "FIND_ODD_LETTER_CLUSTER_PAIR",
        clusterLength: 3,
        stem: stem(seed + commonPoolAttempt * 10_007 + outlierAttempt),
        items,
        options,
        correctIndex,
        answer: options[correctIndex]!,
        intendedRuleId: "CLUSTER_PAIR_OPPOSITE_TRANSFORM_STATUS",
        intendedRuleValue: "MATCH",
        evidenceByOption,
        ambiguityAudit,
        difficulty,
        explanation: {
          coreConcept: [
            "In most options, each letter in the left cluster is paired position-wise with its opposite alphabet letter in the right cluster, so every corresponding total is 27.",
          ],
          stepByStep: [
            ...evidenceByOption,
            `Therefore, ${options[correctIndex]} is the odd cluster pair.`,
          ],
          examSpeedShortcut: [
            "Check the three corresponding letter totals from left to right; every opposite-letter total must be 27.",
          ],
          commonTrapWarning: [
            "Do not compare only the total of all six letter positions; the controlled outlier keeps the same overall total but has corresponding totals 28, 26 and 27 in some order.",
          ],
        },
        reviewOnly: true,
        questionStudioVisible: false,
        qualityDiagnostics: {
          nuisanceKey: group.key,
          changedIndexes: nearMiss.changedIndexes,
          correspondingTotals: nearMiss.correspondingTotals,
          commonPoolAttempt,
          outlierAttempt,
        },
        metadata: {
          datasetVersion: "CLS-CP007-CLUSTER-PAIR-DOMAIN-v1",
          runtimeVersion: "cls-cp007-cluster-pair-discovery-v1",
          locale: "en-IN",
          optionCount,
          sourcePrototypeSeed: seed + commonPoolAttempt * 10_007 + outlierAttempt,
          sourceSaturationStatus: "CLUSTER_PAIR_WAVE_1_EXECUTABLE__GAP_AUDIT_OPEN",
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
  }

  throw new Error(`Unable to generate an ambiguity-safe CP-007 cluster-pair question for seed ${seed}.`);
}
