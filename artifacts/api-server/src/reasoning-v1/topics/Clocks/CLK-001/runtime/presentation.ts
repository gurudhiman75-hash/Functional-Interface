import type { ClockTaskId } from "./catalog";
import type {
  ClockQuestionExplanation,
  ClockScenario,
  ClockSemanticAnswer,
} from "./types";
import type { SolvedClockPrototype } from "./solver-types";
import { formatOrdinal } from "./utils";

const FRACTIONAL_MINUTE_EVENT_TASKS = new Set<ClockTaskId>([
  "ONE_TIME_FOR_ANGLE_IN_HOUR",
  "ALL_TIMES_FOR_ANGLE_IN_HOUR",
  "FIRST_TIME_AFTER_ANCHOR_FOR_ANGLE",
  "NEXT_PREVIOUS_ANGLE_EVENT",
  "EXACT_FRACTIONAL_MINUTE_EVENT",
  "COINCIDENCE_IN_HOUR",
  "OPPOSITION_IN_HOUR",
  "RIGHT_ANGLE_TIMES_IN_HOUR",
  "STRAIGHT_LINE_EVENT",
  "NEAREST_SPECIAL_EVENT",
  "EVENT_ORDER_IN_HOUR",
  "CLASSIFY_EVENT_FROM_TIME",
  "NTH_OCCURRENCE",
]);

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function sourceStyleFractionalMinuteTime(value: string): string {
  return value.replace(
    /\b(1[0-2]|[1-9]):(\d{2}):(\d{2})\s+(\d+)\/(\d+)(?:\s+([ap]\.m\.))?/gi,
    (_match, rawHour: string, rawMinute: string, rawSecond: string, rawNumerator: string, rawDenominator: string, meridiem?: string) => {
      const hour = Number(rawHour);
      const minute = Number(rawMinute);
      const second = Number(rawSecond);
      const numerator = Number(rawNumerator);
      const denominator = Number(rawDenominator);
      const totalMinuteNumerator = minute * 60 * denominator + second * denominator + numerator;
      const totalMinuteDenominator = 60 * denominator;
      const divisor = gcd(totalMinuteNumerator, totalMinuteDenominator);
      const reducedNumerator = totalMinuteNumerator / divisor;
      const reducedDenominator = totalMinuteDenominator / divisor;
      const wholeMinutes = Math.floor(reducedNumerator / reducedDenominator);
      const remainder = reducedNumerator % reducedDenominator;
      const minuteText = remainder === 0
        ? `${wholeMinutes}`
        : wholeMinutes === 0
          ? `${remainder}/${reducedDenominator}`
          : `${wholeMinutes} ${remainder}/${reducedDenominator}`;
      const suffix = meridiem ? ` ${meridiem}` : "";
      return `${minuteText} minutes past ${hour}${suffix}`;
    },
  );
}

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

function normalizeTaskText(taskId: ClockTaskId, value: string): string {
  const normalized = normalizeClockPresentationText(value);
  return FRACTIONAL_MINUTE_EVENT_TASKS.has(taskId)
    ? sourceStyleFractionalMinuteTime(normalized)
    : normalized;
}

function normalizeAnswer(taskId: ClockTaskId, answer: ClockSemanticAnswer): ClockSemanticAnswer {
  return {
    ...answer,
    display: normalizeTaskText(taskId, answer.display),
  };
}

function normalizeScenario(taskId: ClockTaskId, scenario: ClockScenario): ClockScenario {
  return Object.fromEntries(
    Object.entries(scenario).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, normalizeTaskText(taskId, value)];
      }
      if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
        return [key, value.map((item) => normalizeTaskText(taskId, item))];
      }
      return [key, value];
    }),
  ) as ClockScenario;
}

function normalizeExplanation(
  taskId: ClockTaskId,
  explanation: ClockQuestionExplanation,
): ClockQuestionExplanation {
  return {
    given: normalizeTaskText(taskId, explanation.given),
    rule: normalizeTaskText(taskId, explanation.rule),
    working: explanation.working.map((value) => normalizeTaskText(taskId, value)),
    validityCheck: normalizeTaskText(taskId, explanation.validityCheck),
    closestTrap: normalizeTaskText(taskId, explanation.closestTrap),
    answer: normalizeTaskText(taskId, explanation.answer),
  };
}

export function normalizeSolvedClockPresentation(
  solved: SolvedClockPrototype,
): SolvedClockPrototype {
  const taskId = solved.taskId;
  return {
    ...solved,
    stem: normalizeTaskText(taskId, solved.stem),
    scenario: normalizeScenario(taskId, solved.scenario),
    answer: normalizeAnswer(taskId, solved.answer),
    verifierAnswer: solved.verifierAnswer
      ? normalizeAnswer(taskId, solved.verifierAnswer)
      : undefined,
    distractors: solved.distractors.map((distractor) => ({
      ...distractor,
      answer: normalizeAnswer(taskId, distractor.answer),
      reason: normalizeTaskText(taskId, distractor.reason),
    })),
    explanation: normalizeExplanation(taskId, solved.explanation),
    contractEvidence: solved.contractEvidence
      ? {
          ...solved.contractEvidence,
          visibleStemTokens: solved.contractEvidence.visibleStemTokens.map((value) =>
            normalizeTaskText(taskId, value)
          ),
        }
      : undefined,
  };
}
