import type { CalendarPrototypeId, CalendarQuestionPackage, Locale } from "./types.ts";
import { ordinalDaysInMonth } from "./foundation.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import { primaryYearsForReview } from "./exam-readiness-remediation.ts";

const POOL_SIZE = 256;
const REVIEW_COUNT = 5;

function canonicalKey(pkg: CalendarQuestionPackage): string {
  return JSON.stringify(pkg.canonicalAnswer);
}

function trueCoverageKeys(pkg: CalendarQuestionPackage): string[] {
  return Object.entries(pkg.coverageFlags)
    .filter(([, value]) => value)
    .map(([key]) => key);
}

function preferredYearCandidate(pkg: CalendarQuestionPackage): boolean {
  const years = primaryYearsForReview(pkg);
  return years.length === 0 || years.every((year) => year >= 1900 && year <= 2099);
}

function selectionScore(candidate: CalendarQuestionPackage, selected: readonly CalendarQuestionPackage[]): number {
  const selectedAnswerPositions = new Set(selected.map((pkg) => pkg.answerIndex));
  const selectedDifficulties = new Set(selected.map((pkg) => pkg.difficulty));
  const selectedTemplates = new Set(selected.map((pkg) => pkg.stemTemplateId));
  const selectedAnswers = new Set(selected.map(canonicalKey));
  const selectedCoverage = new Set(selected.flatMap(trueCoverageKeys));
  const candidateCoverage = trueCoverageKeys(candidate);

  let score = 0;
  if (!selectedAnswerPositions.has(candidate.answerIndex)) score += 50;
  if (!selectedDifficulties.has(candidate.difficulty)) score += 24;
  if (!selectedTemplates.has(candidate.stemTemplateId)) score += 12;
  if (!selectedAnswers.has(canonicalKey(candidate))) score += 8;
  score += candidateCoverage.filter((key) => !selectedCoverage.has(key)).length * 9;
  if (preferredYearCandidate(candidate) && selected.filter(preferredYearCandidate).length < 4) score += 14;
  score += Math.min(candidate.seed, 20) / 100;
  return score;
}

function renderedQuestionKey(pkg: CalendarQuestionPackage): string {
  return JSON.stringify([pkg.stem, pkg.options.map((option) => option.display)]);
}

function isUnique(candidate: CalendarQuestionPackage, selected: readonly CalendarQuestionPackage[]): boolean {
  const candidateRenderedKey = renderedQuestionKey(candidate);
  return !selected.some((pkg) =>
    pkg.mathematicalFingerprint === candidate.mathematicalFingerprint
    || renderedQuestionKey(pkg) === candidateRenderedKey,
  );
}

function addBestMatch(
  candidates: readonly CalendarQuestionPackage[],
  selected: CalendarQuestionPackage[],
  predicate: (pkg: CalendarQuestionPackage) => boolean,
  label: string,
): void {
  const eligible = candidates
    .filter(predicate)
    .filter((candidate) => isUnique(candidate, selected))
    .sort((a, b) => selectionScore(b, selected) - selectionScore(a, selected) || a.seed - b.seed);
  const best = eligible[0];
  if (!best) throw new Error(`Unable to satisfy curated review requirement: ${label}.`);
  selected.push(best);
}

function mandatoryPredicates(id: CalendarPrototypeId): Array<{ label: string; predicate: (pkg: CalendarQuestionPackage) => boolean }> {
  switch (id) {
    case "CAL-PQL-012":
      return [
        { label: `${id} inclusive count`, predicate: (pkg) => pkg.facts.countSemantics === "INCLUSIVE_BOTH" },
        { label: `${id} exclusive count`, predicate: (pkg) => pkg.facts.countSemantics === "EXCLUSIVE_BOTH" },
      ];
    case "CAL-PQL-013":
      return [
        { label: `${id} contains leap day`, predicate: (pkg) => pkg.canonicalAnswer === "YES_CONTAINS_LEAP_DAY" },
        { label: `${id} excludes leap day`, predicate: (pkg) => pkg.canonicalAnswer === "NO_LEAP_DAY_IN_SPAN" },
      ];
    case "CAL-PQL-017":
      return [
        { label: `${id} forward adjacent-year movement`, predicate: (pkg) => !pkg.coverageFlags.usesBackwardMovement },
        { label: `${id} backward adjacent-year movement`, predicate: (pkg) => pkg.coverageFlags.usesBackwardMovement },
      ];
    case "CAL-PQL-021":
      return ["ORDINARY_YEAR", "LEAP_YEAR", "ORDINARY_CENTURY_YEAR", "LEAP_CENTURY_YEAR"].map((classification) => ({
        label: `${id} ${classification}`,
        predicate: (pkg) => pkg.canonicalAnswer === classification,
      }));
    case "CAL-PQL-026":
      return [100, 200, 300, 400, 700].map((years) => ({
        label: `${id} ${years}-year block`,
        predicate: (pkg) => pkg.facts.year === years,
      }));
    case "CAL-PQL-027":
      return [
        { label: `${id} ordinary century boundary`, predicate: (pkg) => pkg.coverageFlags.usesCenturyYear && !pkg.coverageFlags.usesDivisibleBy400Year },
        { label: `${id} divisible-by-400 boundary`, predicate: (pkg) => pkg.coverageFlags.usesDivisibleBy400Year },
      ];
    case "CAL-PQL-035":
    case "CAL-PQL-036":
    case "CAL-PQL-042":
    case "CAL-PQL-043":
      return [
        { label: `${id} ordinary year`, predicate: (pkg) => typeof pkg.facts.year === "number" && pkg.facts.year % 4 !== 0 },
        { label: `${id} leap year`, predicate: (pkg) => typeof pkg.facts.year === "number" && pkg.facts.year % 4 === 0 && (pkg.facts.year % 100 !== 0 || pkg.facts.year % 400 === 0) },
      ];
    case "CAL-PQL-037":
    case "CAL-PQL-038":
    case "CAL-PQL-040":
    case "CAL-PQL-041":
      return [28, 29, 30, 31].map((length) => ({
        label: `${id} ${length}-day month`,
        predicate: (pkg) => typeof pkg.facts.year === "number"
          && typeof pkg.facts.month === "number"
          && ordinalDaysInMonth(pkg.facts.year, pkg.facts.month) === length,
      }));
    default:
      return [];
  }
}

export function selectExamReadyReviewQuestions(
  id: CalendarPrototypeId,
  locale: Locale = "en-IN",
  count = REVIEW_COUNT,
): CalendarQuestionPackage[] {
  if (count !== REVIEW_COUNT) throw new Error(`CAL-001 curated review is fixed at ${REVIEW_COUNT} questions per provisional QL.`);
  const candidates = Array.from({ length: POOL_SIZE }, (_, seed) => generateCalendarQuestion(id, seed, locale));
  const selected: CalendarQuestionPackage[] = [];

  for (const requirement of mandatoryPredicates(id)) {
    addBestMatch(candidates, selected, requirement.predicate, requirement.label);
  }

  while (selected.length < count) {
    addBestMatch(candidates, selected, () => true, `${id} general variation ${selected.length + 1}`);
  }

  const answerPositionCount = new Set(selected.map((pkg) => pkg.answerIndex)).size;
  if (answerPositionCount < 3) throw new Error(`${id}: curated review covers only ${answerPositionCount} answer positions.`);
  return selected.sort((a, b) => a.seed - b.seed);
}

export const CALENDAR_CURATED_REVIEW_POLICY = {
  candidatesPerPrototype: POOL_SIZE,
  selectedPerPrototype: REVIEW_COUNT,
  selectionGoals: [
    "authority-specific mandatory edge coverage",
    "unique rendered questions and mathematical fingerprints",
    "at least three correct-answer positions",
    "difficulty and template variation",
    "approximately four of five ordinary examples in the 1900–2099 exam-natural year range",
  ],
} as const;
