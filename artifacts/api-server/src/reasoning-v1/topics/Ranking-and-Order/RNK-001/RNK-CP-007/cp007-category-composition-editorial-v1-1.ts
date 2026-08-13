import {
  generateRnkCp007CategoryCompositionQuestion as generateBaseQuestion,
  RNK_CP007_CATEGORY_COMPOSITION_MODES,
  RNK_CP007_CATEGORY_COMPOSITION_VERSION,
  solveRnkCp007CategoryComposition,
  type RnkCp007CategoryCompositionMode,
  type RnkCp007CategoryCompositionQuestion,
  type RnkCp007CategoryCompositionState,
  type RnkCp007CategoryEvidence,
  type RnkCp007CategoryId,
  type RnkCp007Side,
} from "./cp007-category-composition-discovery-v1";

export {
  RNK_CP007_CATEGORY_COMPOSITION_MODES,
  RNK_CP007_CATEGORY_COMPOSITION_VERSION,
  solveRnkCp007CategoryComposition,
};
export type {
  RnkCp007CategoryCompositionMode,
  RnkCp007CategoryCompositionQuestion,
  RnkCp007CategoryCompositionState,
  RnkCp007CategoryEvidence,
  RnkCp007CategoryId,
  RnkCp007Side,
};

export const RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_VERSION =
  "RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_V1_2_MISCONCEPTION_OPTIONS" as const;

export type RnkCp007CategoryDistractorKind =
  | "RANK_OFF_BY_ONE"
  | "USE_EVIDENCE_COUNT_AS_REQUESTED_AHEAD"
  | "IGNORE_CATEGORY_SPLIT"
  | "REPORT_OPPOSITE_CATEGORY_AHEAD"
  | "REPORT_TOTAL_AHEAD"
  | "MISAPPLY_TARGET_ADJUSTMENT"
  | "LOCAL_OFF_BY_ONE";

export type RnkCp007CategoryCompositionEditorialQuestion =
  Omit<RnkCp007CategoryCompositionQuestion, "reviewMetadata"> & {
    readonly reviewMetadata: RnkCp007CategoryCompositionQuestion["reviewMetadata"] & {
      readonly editorialProfile: {
        readonly version: typeof RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_VERSION;
        readonly numericEchoRejected: true;
        readonly awkwardPartitionRejected: true;
        readonly structuralDistractorCount: number;
        readonly distractorKinds: readonly RnkCp007CategoryDistractorKind[];
      };
    };
  };

function mix32(value: number): number {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function categoryTotal(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return category === "A" ? state.categoryATotal : state.categoryBTotal;
}

function targetAdjustment(state: RnkCp007CategoryCompositionState, category: RnkCp007CategoryId): number {
  return state.targetCategory === category ? 1 : 0;
}

function evidenceAhead(
  state: RnkCp007CategoryCompositionState,
  evidence: RnkCp007CategoryEvidence,
): number {
  if (evidence.side === "AHEAD") return evidence.count;
  return categoryTotal(state, evidence.category)
    - evidence.count
    - targetAdjustment(state, evidence.category);
}

function visibleMaximum(question: RnkCp007CategoryCompositionQuestion): number {
  if (question.reviewMetadata.requestedSide === "AHEAD") {
    return question.state.targetRankFromTop - 1;
  }
  return categoryTotal(question.state, question.reviewMetadata.requestedCategory)
    - targetAdjustment(question.state, question.reviewMetadata.requestedCategory);
}

interface DistractorCandidate {
  readonly value: number;
  readonly kind: RnkCp007CategoryDistractorKind;
  readonly structural: boolean;
}

function misconceptionCandidates(
  question: RnkCp007CategoryCompositionQuestion,
): readonly DistractorCandidate[] {
  const state = question.state;
  const requestedCategory = question.reviewMetadata.requestedCategory;
  const requestedSide = question.reviewMetadata.requestedSide;
  const requestedTotal = categoryTotal(state, requestedCategory);
  const requestedAdjustment = targetAdjustment(state, requestedCategory);
  const totalAhead = state.targetRankFromTop - 1;
  const oppositeAhead = evidenceAhead(state, question.evidence);
  const requestedAhead = totalAhead - oppositeAhead;
  const evidenceAdjustment = targetAdjustment(state, question.evidence.category);

  const candidates: DistractorCandidate[] = [];
  if (requestedSide === "AFTER") {
    candidates.push(
      {
        value: requestedTotal - (requestedAhead + 1) - requestedAdjustment,
        kind: "RANK_OFF_BY_ONE",
        structural: true,
      },
      {
        value: requestedTotal - question.evidence.count - requestedAdjustment,
        kind: "USE_EVIDENCE_COUNT_AS_REQUESTED_AHEAD",
        structural: true,
      },
      {
        value: requestedTotal - totalAhead - requestedAdjustment,
        kind: "IGNORE_CATEGORY_SPLIT",
        structural: true,
      },
    );
  } else {
    candidates.push(
      {
        value: requestedAhead + 1,
        kind: "RANK_OFF_BY_ONE",
        structural: true,
      },
      {
        value: oppositeAhead,
        kind: "REPORT_OPPOSITE_CATEGORY_AHEAD",
        structural: true,
      },
      {
        value: totalAhead,
        kind: "REPORT_TOTAL_AHEAD",
        structural: true,
      },
    );

    if (question.evidence.side === "AFTER") {
      const wrongOppositeAhead = categoryTotal(state, question.evidence.category)
        - question.evidence.count
        - (evidenceAdjustment === 1 ? 0 : 1);
      candidates.push({
        value: totalAhead - wrongOppositeAhead,
        kind: "MISAPPLY_TARGET_ADJUSTMENT",
        structural: true,
      });
    }
  }

  candidates.push(
    { value: question.answer - 1, kind: "LOCAL_OFF_BY_ONE", structural: false },
    { value: question.answer + 1, kind: "LOCAL_OFF_BY_ONE", structural: false },
  );

  return candidates;
}

function selectDistractors(
  question: RnkCp007CategoryCompositionQuestion,
): { values: readonly number[]; kinds: readonly RnkCp007CategoryDistractorKind[]; structuralCount: number } | undefined {
  const maximum = visibleMaximum(question);
  const seen = new Set<number>();
  const valid = misconceptionCandidates(question).filter((candidate) => {
    if (!Number.isInteger(candidate.value)) return false;
    if (candidate.value < 0 || candidate.value > maximum) return false;
    if (candidate.value === question.answer || seen.has(candidate.value)) return false;
    seen.add(candidate.value);
    return true;
  });

  const structural = valid.filter((candidate) => candidate.structural);
  if (structural.length < 2) return undefined;

  const selected: DistractorCandidate[] = [];
  for (const candidate of structural) {
    if (selected.length >= 3) break;
    selected.push(candidate);
  }
  if (selected.length < 3) {
    for (const candidate of valid.filter((entry) => !entry.structural)) {
      if (selected.length >= 3) break;
      selected.push(candidate);
    }
  }
  if (selected.length !== 3) return undefined;

  return {
    values: selected.map((candidate) => candidate.value),
    kinds: selected.map((candidate) => candidate.kind),
    structuralCount: selected.filter((candidate) => candidate.structural).length,
  };
}

function placeOptions(
  answer: number,
  distractors: readonly number[],
  answerIndex: 0 | 1 | 2 | 3,
): readonly number[] {
  const output: number[] = [];
  let cursor = 0;
  for (let index = 0; index < 4; index += 1) {
    output.push(index === answerIndex ? answer : distractors[cursor++]!);
  }
  if (new Set(output).size !== 4) throw new Error("Duplicate editorial category options");
  return output;
}

/**
 * Editorial selector over mathematically valid V1.1 states.
 *
 * It rejects learner-visible numeric answer/clue echoes, the one awkward
 * partition surface identified in manual review, and states that cannot
 * support at least two misconception-owned structural distractors.
 */
export function generateRnkCp007CategoryCompositionQuestion(
  mode: RnkCp007CategoryCompositionMode,
  logicalSeed: number,
  requestedAnswerIndex: 0 | 1 | 2 | 3 = (logicalSeed % 4) as 0 | 1 | 2 | 3,
): RnkCp007CategoryCompositionEditorialQuestion {
  for (let attempt = 0; attempt < 192; attempt += 1) {
    const physicalSeed = mix32(
      logicalSeed ^ Math.imul(attempt + 1, 0x9e3779b1) ^ 0x45444954,
    );
    const question = generateBaseQuestion(mode, physicalSeed, requestedAnswerIndex);
    if (question.answer === question.evidence.count) continue;
    if (question.reviewMetadata.partitionId === "desk-a-b") continue;

    const distractors = selectDistractors(question);
    if (!distractors || distractors.structuralCount < 2) continue;
    const options = placeOptions(question.answer, distractors.values, requestedAnswerIndex);

    return {
      ...question,
      seed: logicalSeed,
      options,
      mathematicalFingerprint:
        `${question.mathematicalFingerprint}:EDITORIAL_V12:${distractors.kinds.join("+")}:LOGICAL_SEED:${logicalSeed}`,
      reviewMetadata: {
        ...question.reviewMetadata,
        editorialProfile: {
          version: RNK_CP007_CATEGORY_COMPOSITION_EDITORIAL_VERSION,
          numericEchoRejected: true,
          awkwardPartitionRejected: true,
          structuralDistractorCount: distractors.structuralCount,
          distractorKinds: distractors.kinds,
        },
      },
    };
  }

  throw new Error(
    `Unable to select editorial V1.2 CP007 category-composition question for ${mode}/${logicalSeed}`,
  );
}
