import { clsCp007SignedGaps } from "./cluster-domain";
import {
  generateClsCp007QualityQuestion as generateSafeQualityQuestion,
} from "./quality-runtime-safe";
import type { QualityClsCp007Question } from "./quality-runtime";
import type { ClsCp007PrototypeId } from "./types";

function maximumRawGap(question: QualityClsCp007Question): number {
  return Math.max(
    ...question.items.flatMap((item) =>
      clsCp007SignedGaps(item).map((gap) => Math.abs(gap)),
    ),
  );
}

export function generateClsCp007QualityQuestion(
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
): QualityClsCp007Question {
  if (prototypeId !== "CLS-CP007-PROT-004") {
    return generateSafeQualityQuestion(prototypeId, seed, optionCount);
  }

  for (let attempt = 0; attempt < 1_000; attempt += 1) {
    const candidate = generateSafeQualityQuestion(
      prototypeId,
      seed + attempt * 1_009,
      optionCount,
    );
    if (maximumRawGap(candidate) <= 12) {
      return {
        ...candidate,
        seed,
        qualityDiagnostics: {
          ...candidate.qualityDiagnostics,
          commonGroupAttempt:
            candidate.qualityDiagnostics.commonGroupAttempt + attempt,
        },
      };
    }
  }

  throw new Error(
    `Unable to generate a bounded equality-topology CP-007 question for seed ${seed}.`,
  );
}

export type { QualityClsCp007Question } from "./quality-runtime";
