import type { CalendarPrototypeId, CalendarQuestionPackage } from "./types.ts";
import { semanticKey } from "./foundation.ts";
import { CALENDAR_PROTOTYPES } from "./registry.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import { primaryYearsForReview } from "./exam-readiness-remediation.ts";

const REVIEW_COUNT_PER_PROTOTYPE = 5;
const REVIEW_POOL_SIZE = 256;

function answerPositionCoverage(pkg: CalendarQuestionPackage): string {
  return String(pkg.answerIndex);
}

function monthLengthCoverage(pkg: CalendarQuestionPackage): string | null {
  const year = Number(pkg.facts.year ?? pkg.facts.targetDate?.year);
  const month = Number(pkg.facts.month ?? pkg.facts.targetDate?.month);
  if (!Number.isInteger(year) || !Number.isInteger(month)) return null;
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return String(length);
}

function mandatoryCategory(id: CalendarPrototypeId, pkg: CalendarQuestionPackage): string | null {
  if (id === "CAL-PQL-012") return String(pkg.facts.countSemantics);
  if (id === "CAL-PQL-013") return String(pkg.canonicalAnswer);
  if (id === "CAL-PQL-017") return pkg.coverageFlags.usesBackwardMovement ? "BACKWARD" : "FORWARD";
  if (id === "CAL-PQL-021") return String(pkg.canonicalAnswer);
  if (id === "CAL-PQL-026") return String(pkg.facts.year);
  if (id === "CAL-PQL-027") return pkg.coverageFlags.usesDivisibleBy400Year ? "DIVISIBLE_BY_400" : "ORDINARY_CENTURY";
  if (["CAL-PQL-035", "CAL-PQL-036", "CAL-PQL-042", "CAL-PQL-043"].includes(id)) {
    return Number(pkg.facts.year) % 4 === 0 && (Number(pkg.facts.year) % 100 !== 0 || Number(pkg.facts.year) % 400 === 0) ? "LEAP" : "ORDINARY";
  }
  if (["CAL-PQL-037", "CAL-PQL-038", "CAL-PQL-040", "CAL-PQL-041"].includes(id)) return monthLengthCoverage(pkg);
  return null;
}

function requiredCategories(id: CalendarPrototypeId): readonly string[] {
  if (id === "CAL-PQL-012") return ["INCLUSIVE_BOTH", "EXCLUSIVE_BOTH"];
  if (id === "CAL-PQL-013") return ["YES_CONTAINS_LEAP_DAY", "NO_LEAP_DAY_IN_SPAN"];
  if (id === "CAL-PQL-017") return ["FORWARD", "BACKWARD"];
  if (id === "CAL-PQL-021") return ["ORDINARY_YEAR", "LEAP_YEAR", "ORDINARY_CENTURY_YEAR", "LEAP_CENTURY_YEAR"];
  if (id === "CAL-PQL-026") return ["100", "200", "300", "400", "700"];
  if (id === "CAL-PQL-027") return ["DIVISIBLE_BY_400", "ORDINARY_CENTURY"];
  if (["CAL-PQL-035", "CAL-PQL-036", "CAL-PQL-042", "CAL-PQL-043"].includes(id)) return ["ORDINARY", "LEAP"];
  if (["CAL-PQL-037", "CAL-PQL-038", "CAL-PQL-040", "CAL-PQL-041"].includes(id)) return ["28", "29", "30", "31"];
  return [];
}

function preferredYearBonus(pkg: CalendarQuestionPackage): number {
  const years = primaryYearsForReview(pkg);
  if (!years.length) return 0;
  return years.every((year) => year >= 1900 && year <= 2099) ? 8 : 0;
}

function candidateScore(candidate: CalendarQuestionPackage, selected: CalendarQuestionPackage[]): number {
  const answerPositions = new Set(selected.map(answerPositionCoverage));
  const difficulties = new Set(selected.map((pkg) => pkg.difficulty));
  const templates = new Set(selected.map((pkg) => pkg.stemTemplateId));
  const answers = new Set(selected.map((pkg) => semanticKey(pkg.canonicalAnswer)));
  const coverage = new Set(selected.flatMap((pkg) => Object.entries(pkg.coverageFlags).filter(([, value]) => value).map(([key]) => key)));
  const mandatory = new Set(selected.map((pkg) => mandatoryCategory(pkg.prototypeAuthority, pkg)).filter((value): value is string => Boolean(value)));
  const candidateMandatory = mandatoryCategory(candidate.prototypeAuthority, candidate);

  let score = preferredYearBonus(candidate);
  if (!answerPositions.has(answerPositionCoverage(candidate))) score += 30;
  if (!difficulties.has(candidate.difficulty)) score += 20;
  if (!templates.has(candidate.stemTemplateId)) score += 12;
  if (!answers.has(semanticKey(candidate.canonicalAnswer))) score += 8;
  if (candidateMandatory && !mandatory.has(candidateMandatory)) score += 80;
  for (const [key, value] of Object.entries(candidate.coverageFlags)) if (value && !coverage.has(key)) score += 6;
  score += Math.min(candidate.seed, 40) / 100;
  return score;
}

export function selectCuratedReviewQuestions(id: CalendarPrototypeId): CalendarQuestionPackage[] {
  const pool = Array.from({ length: REVIEW_POOL_SIZE }, (_, seed) => generateCalendarQuestion(id, seed, "en-IN"));
  const selected: CalendarQuestionPackage[] = [];
  const usedStems = new Set<string>();
  const usedFingerprints = new Set<string>();

  for (const category of requiredCategories(id)) {
    const match = pool.find((pkg) => mandatoryCategory(id, pkg) === category && !usedStems.has(pkg.stem) && !usedFingerprints.has(pkg.mathematicalFingerprint));
    if (!match) throw new Error(`${id}: no review candidate covers mandatory category ${category}.`);
    selected.push(match);
    usedStems.add(match.stem);
    usedFingerprints.add(match.mathematicalFingerprint);
  }

  while (selected.length < REVIEW_COUNT_PER_PROTOTYPE) {
    const candidates = pool.filter((pkg) => !usedStems.has(pkg.stem) && !usedFingerprints.has(pkg.mathematicalFingerprint));
    if (!candidates.length) throw new Error(`${id}: unable to select ${REVIEW_COUNT_PER_PROTOTYPE} unique review candidates.`);
    candidates.sort((a, b) => candidateScore(b, selected) - candidateScore(a, selected) || a.seed - b.seed);
    const next = candidates[0]!;
    selected.push(next);
    usedStems.add(next.stem);
    usedFingerprints.add(next.mathematicalFingerprint);
  }

  const answerPositions = new Set(selected.map((pkg) => pkg.answerIndex));
  if (answerPositions.size < 3) throw new Error(`${id}: curated review selection does not cover at least three answer positions.`);
  return selected.sort((a, b) => a.difficulty.localeCompare(b.difficulty) || a.seed - b.seed);
}

export function buildCuratedCalendarReviewSet(): CalendarQuestionPackage[] {
  return CALENDAR_PROTOTYPES.flatMap((definition) => selectCuratedReviewQuestions(definition.id));
}
