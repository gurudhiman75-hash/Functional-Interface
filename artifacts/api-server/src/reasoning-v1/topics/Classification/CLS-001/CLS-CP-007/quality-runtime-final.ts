import {
  clsCp007FormatItem,
  clsCp007LetterPosition,
  clsCp007SignedGaps,
} from "./cluster-domain";
import {
  generateClsCp007QualityQuestion as generateSafeQualityQuestion,
} from "./quality-runtime-safe";
import type { QualityClsCp007Question } from "./quality-runtime";
import type { ClsCp007ClusterItem, ClsCp007PrototypeId } from "./types";

function maximumRawGap(question: QualityClsCp007Question): number {
  return Math.max(
    ...question.items.flatMap((item) =>
      clsCp007SignedGaps(item).map((gap) => Math.abs(gap)),
    ),
  );
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function matchConclusion(matches: boolean): string {
  return matches
    ? "so it follows the common rule."
    : "so it does not follow the common rule.";
}

function polishedEvidence(
  item: ClsCp007ClusterItem,
  question: QualityClsCp007Question,
): string | null {
  const cluster = clsCp007FormatItem(item);
  const positions = item.letters.map(clsCp007LetterPosition);
  const matches = item !== question.items[question.correctIndex];

  switch (question.intendedRuleId) {
    case "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS": {
      const firstTwoTotal = positions[0]! + positions[1]!;
      return `${cluster}: ${positions[0]} + ${positions[1]} = ${firstTwoTotal}; the third letter ${item.letters[2]} is at position ${positions[2]}, ${matchConclusion(matches)}`;
    }
    case "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS":
      return `${cluster}: letters at positions 1 and 3 total ${positions[0]! + positions[2]!}; letters at positions 2 and 4 total ${positions[1]! + positions[3]!}, ${matchConclusion(matches)}`;
    case "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS":
      return `${cluster}: letters at positions 1 and 2 total ${positions[0]! + positions[1]!}; letters at positions 3 and 4 total ${positions[2]! + positions[3]!}, ${matchConclusion(matches)}`;
    case "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE":
      return `${cluster}: the movement from position 1 to 2 is ${signed(positions[1]! - positions[0]!)}; the movement from position 3 to 4 is ${signed(positions[3]! - positions[2]!)}, ${matchConclusion(matches)}`;
    default:
      return null;
  }
}

function polishQuestion(
  question: QualityClsCp007Question,
): QualityClsCp007Question {
  const evidenceByOption = question.items.map(
    (item, index) => polishedEvidence(item, question) ?? question.evidenceByOption[index]!,
  );
  if (evidenceByOption.every((value, index) => value === question.evidenceByOption[index])) {
    return question;
  }
  return {
    ...question,
    evidenceByOption,
    explanation: {
      ...question.explanation,
      stepByStep: [
        ...evidenceByOption,
        `Therefore, ${question.answer} is the odd one out.`,
      ],
    },
  };
}

export function generateClsCp007QualityQuestion(
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
): QualityClsCp007Question {
  if (prototypeId !== "CLS-CP007-PROT-004") {
    return polishQuestion(generateSafeQualityQuestion(prototypeId, seed, optionCount));
  }

  for (let attempt = 0; attempt < 1_000; attempt += 1) {
    const candidate = generateSafeQualityQuestion(
      prototypeId,
      seed + attempt * 1_009,
      optionCount,
    );
    if (maximumRawGap(candidate) <= 12) {
      return polishQuestion({
        ...candidate,
        seed,
        qualityDiagnostics: {
          ...candidate.qualityDiagnostics,
          commonGroupAttempt:
            candidate.qualityDiagnostics.commonGroupAttempt + attempt,
        },
      });
    }
  }

  throw new Error(
    `Unable to generate a bounded equality-topology CP-007 question for seed ${seed}.`,
  );
}

export type { QualityClsCp007Question } from "./quality-runtime";
