import type {
  ClockQuestionExplanation,
  ClockScenario,
  ClockSemanticAnswer,
} from "./types";
import type { SolvedClockPrototype } from "./solver-types";

export function normalizeClockPresentationText(value: string): string {
  return value
    .replace(/\b1th\b/g, "1st")
    .replace(/\b2th\b/g, "2nd")
    .replace(/\b3th\b/g, "3rd")
    .replace(/:(\d) (?=\d+\/\d+)/g, ":0$1 ")
    .replace(/\b1 seconds\b/g, "1 second")
    .replace(/\b1 minutes\b/g, "1 minute")
    .replace(/\b1 hours\b/g, "1 hour");
}

function normalizeAnswer(answer: ClockSemanticAnswer): ClockSemanticAnswer {
  return {
    ...answer,
    display: normalizeClockPresentationText(answer.display),
  };
}

function normalizeScenario(scenario: ClockScenario): ClockScenario {
  return Object.fromEntries(
    Object.entries(scenario).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, normalizeClockPresentationText(value)];
      }
      if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
        return [key, value.map((item) => normalizeClockPresentationText(item))];
      }
      return [key, value];
    }),
  ) as ClockScenario;
}

function normalizeExplanation(
  explanation: ClockQuestionExplanation,
): ClockQuestionExplanation {
  return {
    given: normalizeClockPresentationText(explanation.given),
    rule: normalizeClockPresentationText(explanation.rule),
    working: explanation.working.map(normalizeClockPresentationText),
    validityCheck: normalizeClockPresentationText(explanation.validityCheck),
    closestTrap: normalizeClockPresentationText(explanation.closestTrap),
    answer: normalizeClockPresentationText(explanation.answer),
  };
}

export function normalizeSolvedClockPresentation(
  solved: SolvedClockPrototype,
): SolvedClockPrototype {
  return {
    ...solved,
    stem: normalizeClockPresentationText(solved.stem),
    scenario: normalizeScenario(solved.scenario),
    answer: normalizeAnswer(solved.answer),
    verifierAnswer: solved.verifierAnswer
      ? normalizeAnswer(solved.verifierAnswer)
      : undefined,
    distractors: solved.distractors.map((distractor) => ({
      ...distractor,
      answer: normalizeAnswer(distractor.answer),
      reason: normalizeClockPresentationText(distractor.reason),
    })),
    explanation: normalizeExplanation(solved.explanation),
    contractEvidence: solved.contractEvidence
      ? {
          ...solved.contractEvidence,
          visibleStemTokens: solved.contractEvidence.visibleStemTokens.map(
            normalizeClockPresentationText,
          ),
        }
      : undefined,
  };
}
