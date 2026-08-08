import type { ClockTaskId } from "./catalog";
import type {
  ClockLocale,
  ClockQuestionExplanation,
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

export interface SolvedClockPrototype {
  taskId: ClockTaskId;
  stem: string;
  scenario: ClockScenario;
  answer: ClockSemanticAnswer;
  distractors: readonly ClockDistractorCandidate[];
  explanation: ClockQuestionExplanation;
  canonicalTrace: readonly string[];
  verifierTrace: readonly string[];
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
