import type {
  ClockQuestionExplanation,
  ClockScenario,
  ClockSemanticAnswer,
} from "./types";
import type { SolvedClockPrototype } from "./solver-types";
import { formatOrdinal } from "./utils";

export function normalizeClockPresentationText(value: string): string {
  return value
    .replace(/\b(\d+)(?:st|nd|rd|th)\b/g, (_match, rawValue: string) => formatOrdinal(Number(rawValue)))
    .replace(/\bAt what all times\b/g, "At what times")
    .replace(/\bat what all times\b/g, "at what times")
    .replace(/\bWhat all times\b/g, "What times")
    .replace(/\bwhat all times\b/g, "what times")
    .replace(/\b1 seconds\b/g, "1 second")
    .replace(/\b1 minutes\b/g, "1 minute")
    .replace(/\b1 hours\b/g, "1 hour")
    .replace(/\b([ap]\.m\.)\.+/gi, "$1");
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
