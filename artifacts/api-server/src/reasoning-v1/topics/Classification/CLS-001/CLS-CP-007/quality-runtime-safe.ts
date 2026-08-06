import {
  clsCp007FormatItem,
  clsCp007IsVowel,
  clsCp007LetterFromPosition,
} from "./cluster-domain";
import {
  generateClsCp007QualityQuestion as generateBaseQualityQuestion,
  type QualityClsCp007Question,
} from "./quality-runtime";
import { auditClsCp007Items } from "./runtime";
import type {
  ClsCp007ClusterItem,
  ClsCp007PrototypeId,
} from "./types";

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

function itemFromPositions(positions: readonly number[]): ClsCp007ClusterItem {
  return {
    kind: "LETTER_CLUSTER",
    letters: positions.map(clsCp007LetterFromPosition),
  };
}

function allUnique(positions: readonly number[]): boolean {
  return new Set(positions).size === positions.length;
}

function vowelCount(item: ClsCp007ClusterItem): number {
  return item.letters.filter(clsCp007IsVowel).length;
}

function buildCommonPool(): readonly ClsCp007ClusterItem[] {
  const unique = new Map<string, ClsCp007ClusterItem>();
  for (let first = 1; first <= 26; first += 1) {
    for (let third = 1; third <= 26; third += 1) {
      const positions = [first, 27 - first, third, 27 - third];
      if (!allUnique(positions)) continue;
      const item = itemFromPositions(positions);
      unique.set(clsCp007FormatItem(item), item);
    }
  }
  return [...unique.values()];
}

function buildNearMissPool(): readonly ClsCp007ClusterItem[] {
  const unique = new Map<string, ClsCp007ClusterItem>();
  for (const firstTotal of [26, 28] as const) {
    const secondTotal = 54 - firstTotal;
    for (let first = 1; first <= 26; first += 1) {
      const second = firstTotal - first;
      if (second < 1 || second > 26) continue;
      for (let third = 1; third <= 26; third += 1) {
        const fourth = secondTotal - third;
        const positions = [first, second, third, fourth];
        if (fourth < 1 || fourth > 26 || !allUnique(positions)) continue;
        const item = itemFromPositions(positions);
        unique.set(clsCp007FormatItem(item), item);
      }
    }
  }
  return [...unique.values()];
}

const COMMON_POOL = buildCommonPool();
const NEAR_MISS_POOL = buildNearMissPool();

function stem(seed: number): string {
  const forms = [
    "Which of the following letter-clusters is the odd one out?",
    "All but one cluster contains two adjacent opposite-letter pairs. Select the different cluster.",
    "Identify the cluster that does not contain two adjacent alphabet-opposite pairs.",
    "Most clusters form opposite-letter pairs in positions 1–2 and 3–4. Which cluster differs?",
    "Choose the letter-cluster whose two adjacent pairs do not follow the common opposite-letter rule.",
  ];
  return forms[mix(seed, 701) % forms.length]!;
}

function generateAdjacentOppositeQualityQuestion(
  seed: number,
  optionCount: 4 | 5,
): QualityClsCp007Question {
  const commonCount = optionCount - 1;
  const commonByVowels = new Map<number, ClsCp007ClusterItem[]>();
  const outlierByVowels = new Map<number, ClsCp007ClusterItem[]>();
  for (const item of COMMON_POOL) {
    const key = vowelCount(item);
    const group = commonByVowels.get(key) ?? [];
    group.push(item);
    commonByVowels.set(key, group);
  }
  for (const item of NEAR_MISS_POOL) {
    const key = vowelCount(item);
    const group = outlierByVowels.get(key) ?? [];
    group.push(item);
    outlierByVowels.set(key, group);
  }
  const vowelKeys = ranked(
    [...commonByVowels.keys()].filter(
      (key) => (commonByVowels.get(key)?.length ?? 0) >= commonCount &&
        (outlierByVowels.get(key)?.length ?? 0) > 0,
    ),
    seed,
    709,
  );

  for (const vowelKey of vowelKeys) {
    const commonCandidates = ranked(commonByVowels.get(vowelKey)!, seed, 719);
    const commonItems = commonCandidates.slice(0, commonCount);
    const outlierCandidates = ranked(outlierByVowels.get(vowelKey)!, seed, 727);
    for (let outlierAttempt = 0; outlierAttempt < outlierCandidates.length; outlierAttempt += 1) {
      const outlier = outlierCandidates[outlierAttempt]!;
      const items = ranked(
        [...commonItems, outlier],
        seed + outlierAttempt * 97,
        733,
      );
      const correctIndex = items.findIndex((item) => item === outlier);
      const ambiguityAudit = auditClsCp007Items(
        items,
        "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS",
        correctIndex,
      );
      if (
        ambiguityAudit.result !== "UNIQUE" ||
        ambiguityAudit.answerIndex !== correctIndex ||
        !ambiguityAudit.intendedRuleSupported
      ) {
        continue;
      }
      const options = items.map(clsCp007FormatItem);
      const evidence = items.map((item) => {
        const positions = item.letters.map((letter) => letter.charCodeAt(0) - 64);
        const firstTotal = positions[0]! + positions[1]!;
        const secondTotal = positions[2]! + positions[3]!;
        const matches = firstTotal === 27 && secondTotal === 27;
        return `${clsCp007FormatItem(item)}: positions 1+2 total ${firstTotal} and positions 3+4 total ${secondTotal}, so it ${matches ? "follows" : "does not follow"} the common rule.`;
      });
      return {
        checkpointId: "CLS-CP-007",
        prototypeId: "CLS-CP007-PROT-011",
        permanentQlId: null,
        seed,
        task: "FIND_ODD_LETTER_CLUSTER",
        clusterLength: 4,
        stem: stem(seed + outlierAttempt),
        items,
        options,
        correctIndex,
        answer: options[correctIndex]!,
        intendedRuleId: "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS",
        intendedRuleValue: "MATCH",
        evidenceByOption: evidence,
        ambiguityAudit,
        difficulty: "HARD",
        difficultyFeatures: {
          optionCount,
          clusterLength: 4,
          arithmeticDemand: 3,
          structuralLayers: 3,
          directionSensitive: false,
          competingSupportCount: ambiguityAudit.candidateSupports.length,
          maximumPosition: Math.max(
            ...items.flatMap((item) => item.letters.map((letter) => letter.charCodeAt(0) - 64)),
          ),
          score: 7,
        },
        explanation: {
          coreConcept: [
            "In most clusters, positions 1–2 and 3–4 form two adjacent opposite-letter pairs, so both totals are 27.",
          ],
          stepByStep: [...evidence, `Therefore, ${options[correctIndex]} is the odd one out.`],
          examSpeedShortcut: [
            "Check positions 1–2 and 3–4 as two blocks; each opposite pair must total 27.",
          ],
          commonTrapWarning: [
            "Do not use only the total of all four letters; the near-miss cluster also totals 54, but its pair totals are 26 and 28.",
          ],
        },
        reviewOnly: true,
        questionStudioVisible: false,
        metadata: {
          datasetVersion: "CLS-CP007-LETTER-CLUSTER-DOMAIN-v1",
          runtimeVersion: "cls-cp007-discovery-v1",
          locale: "en-IN",
          optionCount,
          sourcePrototypeSeed: seed + outlierAttempt,
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
        qualityDiagnostics: {
          commonNuisanceKey: `vowels=${vowelKey};repeat=1-2-3-4`,
          commonRawValueCount: 1,
          outlierDistance: 1,
          commonGroupAttempt: 0,
          outlierAttempt,
        },
      };
    }
  }
  throw new Error(`Unable to generate governed adjacent-opposite CP-007 question for seed ${seed}.`);
}

export function generateClsCp007QualityQuestion(
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
): QualityClsCp007Question {
  if (prototypeId === "CLS-CP007-PROT-011") {
    return generateAdjacentOppositeQualityQuestion(seed, optionCount);
  }
  return generateBaseQualityQuestion(prototypeId, seed, optionCount);
}
