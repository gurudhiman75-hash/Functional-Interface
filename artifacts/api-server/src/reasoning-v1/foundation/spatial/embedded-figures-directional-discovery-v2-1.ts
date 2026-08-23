import { spatialSceneSemanticFingerprint } from "./normalize";
import {
  EMB_001_DIRECTIONAL_PROTOTYPES_V2,
  EMB_001_SOURCE_DIRECTION_AUTHORITY_V2,
  generateEmbeddedDirectionalQuestionV2,
  type EmbeddedDirectionalPrototypeV2,
  type EmbeddedDirectionalQuestionV2,
} from "./embedded-figures-directional-discovery-v2";

export { EMB_001_DIRECTIONAL_PROTOTYPES_V2, EMB_001_SOURCE_DIRECTION_AUTHORITY_V2 };
export type { EmbeddedDirectionalPrototypeV2, EmbeddedDirectionalQuestionV2 };

export const EMB_001_DIRECTIONAL_HARDENING_AUTHORITY_V2_1 = Object.freeze({
  authorityId: "EMB-001-DIRECTIONAL-HARDENING-V2.1" as const,
  supersedesGenerator: "EMB-001-DIRECTIONAL-DISCOVERY-QUESTION-V2" as const,
  remediation: {
    reverseNegativeAnswerSlotDGuaranteed: true,
    fourOptionsPreservedForEveryAnswerSlot: true,
    contentIdentityPreservedAcrossDeliveryReorder: true,
  },
  permanentQlAllocationAllowed: false,
  questionStudioRegistrationAllowed: false,
} as const);

const LETTERS = ["A", "B", "C", "D"] as const;

function reorderNegativeToD(question: EmbeddedDirectionalQuestionV2): EmbeddedDirectionalQuestionV2 {
  if (question.prototypeId !== "EMB-PROT-08-OPTION-NOT-IN-QUESTION") return question;
  if (question.correctOptionIndex !== 0 || question.options.length !== 4) {
    throw new Error("EMB directional V2.1 expected a four-option reverse-negative base with the absent candidate in slot A.");
  }
  const options = [question.options[1]!, question.options[2]!, question.options[3]!, question.options[0]!];
  const counts = [question.solverEvidence.optionEmbeddingCounts[1]!, question.solverEvidence.optionEmbeddingCounts[2]!, question.solverEvidence.optionEmbeddingCounts[3]!, question.solverEvidence.optionEmbeddingCounts[0]!];
  const optionGraphFingerprints = [question.solverEvidence.optionGraphFingerprints[1]!, question.solverEvidence.optionGraphFingerprints[2]!, question.solverEvidence.optionGraphFingerprints[3]!, question.solverEvidence.optionGraphFingerprints[0]!];
  if (counts.slice(0, 3).some((count) => count <= 0) || counts[3] !== 0) {
    throw new Error("EMB directional V2.1 reverse-negative reorder lost the three-present/one-absent invariant.");
  }
  const orderedSceneFingerprints = options.map((option) => spatialSceneSemanticFingerprint(option.scene));
  const correctOptionIndex = 3 as const;
  const answer = LETTERS[correctOptionIndex];
  return {
    ...question,
    options,
    correctOptionIndex,
    answer,
    solverEvidence: {
      ...question.solverEvidence,
      optionEmbeddingCounts: counts,
      optionGraphFingerprints,
      satisfyingOptionIndexes: [correctOptionIndex],
    },
    explanation: {
      observation: "Check the four small answer figures one by one against the larger question figure.",
      rule: "For this negative form, three candidates must be traceable exactly inside the question figure and the correct answer is the single candidate that is not present.",
      application: `Options other than ${answer} can each be traced completely in the question figure, while option ${answer} cannot.`,
      check: `Option ${answer} is the only candidate with zero valid graph embeddings in the question figure.`,
    },
    deliveryFingerprint: JSON.stringify({ contentFingerprint: question.contentFingerprint, ordered: orderedSceneFingerprints, correctOptionIndex }),
  };
}

export function generateEmbeddedDirectionalQuestionV2_1(request: {
  prototypeId: EmbeddedDirectionalPrototypeV2;
  seed: string;
  desiredCorrectOptionIndex?: 0 | 1 | 2 | 3;
}): EmbeddedDirectionalQuestionV2 {
  const seed = request.seed.trim();
  if (!seed) throw new Error("EMB directional V2.1 requires a non-empty deterministic seed.");
  const desired = request.desiredCorrectOptionIndex;
  if (request.prototypeId !== "EMB-PROT-08-OPTION-NOT-IN-QUESTION" || desired !== 3) {
    return generateEmbeddedDirectionalQuestionV2({ ...request, seed });
  }
  const base = generateEmbeddedDirectionalQuestionV2({
    prototypeId: request.prototypeId,
    seed,
    desiredCorrectOptionIndex: 0,
  });
  return reorderNegativeToD(base);
}
