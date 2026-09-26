import type { ClockTaskId } from "./catalog";
import type {
  ClockAnswerKind,
  ClockLocale,
  ClockQuestionExplanation,
  ClockQuestionMedia,
  ClockScenario,
  ClockSemanticAnswer,
  ClockSolveTrace,
} from "./types";
import type { ClockSeededRandom } from "./utils";

export interface ClockDistractorCandidate {
  answer: ClockSemanticAnswer;
  reasonCode: string;
  reason: string;
}

export interface ClockContractEvidence {
  expectedAnswerKind: ClockAnswerKind;
  oracleName: string;
  visibleStemTokens: readonly string[];
}

export interface SolvedClockPrototype {
  taskId: ClockTaskId;
  stem: string;
  media?: ClockQuestionMedia;
  scenario: ClockScenario;
  answer: ClockSemanticAnswer;
  /**
   * Independently recomputed semantic answer. When absent, the item remains a
   * structural discovery candidate and must not claim dual-answer proof.
   */
  verifierAnswer?: ClockSemanticAnswer;
  distractors: readonly ClockDistractorCandidate[];
  explanation: ClockQuestionExplanation;
  canonicalTrace: readonly string[];
  verifierTrace: readonly string[];
  contractEvidence?: ClockContractEvidence;
  solveTraceExtras?: Partial<Omit<ClockSolveTrace,
    "canonicalAnswerKey" | "verifierAnswerKey" | "agreement" |
    "canonicalTrace" | "verifierTrace"
  >>;
}

export interface ClockFamilySolverInput {
  taskId: ClockTaskId;
  locale: ClockLocale;
  seed: string;
  rng: ClockSeededRandom;
}
