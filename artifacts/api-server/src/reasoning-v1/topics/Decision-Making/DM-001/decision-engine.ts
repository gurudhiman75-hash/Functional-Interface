import type {
  DmCandidateProfile,
  DmConditionCheck,
  DmDecisionResult,
  DmField,
  DmRuleCondition,
  DmRankCriterion,
  DmRankingSpec,
  DmScenario,
} from "./types.ts";

function isoParts(value: string): readonly [number, number, number] | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return [year, month, day];
}

export function calculateDmAgeOnDate(birthDate: string, asOfDate: string): number {
  const birth = isoParts(birthDate);
  const cutoff = isoParts(asOfDate);
  if (!birth || !cutoff || birth[0] > cutoff[0]) throw new Error("DM-001 requires valid dates with birthDate no later than the age cut-off.");
  let age = cutoff[0] - birth[0];
  if (cutoff[1] < birth[1] || (cutoff[1] === birth[1] && cutoff[2] < birth[2])) age -= 1;
  return age;
}

function fieldValue(field: DmField, candidate: DmCandidateProfile, scenario: DmScenario): number | string | undefined {
  if (field === "ageAtDate") {
    if (!candidate.birthDate || !scenario.referenceDate) return undefined;
    try { return calculateDmAgeOnDate(candidate.birthDate, scenario.referenceDate); }
    catch { return undefined; }
  }
  const value = candidate[field as keyof DmCandidateProfile];
  return typeof value === "number" || typeof value === "string" ? value : undefined;
}

function compare(actual: number | string, condition: DmRuleCondition): boolean {
  const expected = condition.value;
  if (condition.operator === "IN") return Array.isArray(expected) && expected.includes(actual);
  if (condition.operator === "EQ") return actual === expected;
  if (typeof actual !== "number" || typeof expected !== "number") return false;
  if (condition.operator === "LTE") return actual <= expected;
  if (condition.operator === "GTE") return actual >= expected;
  return false;
}

export function checkDmCondition(
  condition: DmRuleCondition,
  candidate: DmCandidateProfile,
  scenario: DmScenario,
): DmConditionCheck {
  const actual = fieldValue(condition.field, candidate, scenario);
  if (actual === undefined) return Object.freeze({ condition, status: "UNKNOWN", actual });
  return Object.freeze({ condition, status: compare(actual, condition) ? "PASS" : "FAIL", actual });
}

export function evaluateDmDecision(
  candidate: DmCandidateProfile,
  scenario: DmScenario,
): DmDecisionResult {
  const unresolvedRuleIds: string[] = [];
  const orderedRules = [...scenario.decisionRules].sort((left, right) => left.priority - right.priority);
  for (const rule of orderedRules) {
    const checks = rule.conditions.map((item) => checkDmCondition(item, candidate, scenario));
    if (checks.length > 0 && checks.every((check) => check.status === "PASS")) {
      return Object.freeze({
        outcome: rule.outcome,
        matchedRuleId: rule.ruleId,
        checks: Object.freeze(scenario.baseConditions.map((item) => checkDmCondition(item, candidate, scenario))),
        unresolvedRuleIds: Object.freeze([]),
      });
    }
    if (checks.some((check) => check.status === "UNKNOWN") && checks.every((check) => check.status !== "FAIL")) {
      unresolvedRuleIds.push(rule.ruleId);
    }
  }

  const baseChecks = scenario.baseConditions.map((item) => checkDmCondition(item, candidate, scenario));
  if (baseChecks.every((check) => check.status === "PASS")) {
    return Object.freeze({ outcome: "SELECT", checks: Object.freeze(baseChecks), unresolvedRuleIds: Object.freeze([]) });
  }
  // A failed mandatory condition is already decisive unless an unresolved exception could still rescue the case.
  // This distinction is essential for DM-018: missing data is not automatically material.
  if (baseChecks.some((check) => check.status === "FAIL") && unresolvedRuleIds.length === 0) {
    return Object.freeze({ outcome: "REJECT", checks: Object.freeze(baseChecks), unresolvedRuleIds: Object.freeze([]) });
  }
  if (baseChecks.some((check) => check.status === "UNKNOWN")) {
    return Object.freeze({ outcome: "INFORMATION_REQUIRED", checks: Object.freeze(baseChecks), unresolvedRuleIds: Object.freeze(unresolvedRuleIds) });
  }
  if (unresolvedRuleIds.length > 0) {
    return Object.freeze({ outcome: "INFORMATION_REQUIRED", checks: Object.freeze(baseChecks), unresolvedRuleIds: Object.freeze(unresolvedRuleIds) });
  }
  return Object.freeze({ outcome: "REJECT", checks: Object.freeze(baseChecks), unresolvedRuleIds: Object.freeze([]) });
}

export type DmRankedCandidate = Readonly<{
  candidate: DmCandidateProfile;
  outcome: DmDecisionResult["outcome"];
  rank?: number;
}>;

export type DmRankingResult = Readonly<{
  selected: readonly DmCandidateProfile[];
  waitlisted: readonly DmCandidateProfile[];
  notEligible: readonly DmRankedCandidate[];
  eligibleRanking: readonly DmRankedCandidate[];
}>;

function compareRankValue(left: number | string, right: number | string, criterion: DmRankCriterion): number {
  const comparison = typeof left === "number" && typeof right === "number"
    ? left - right
    : String(left).localeCompare(String(right), "en", { sensitivity: "variant", numeric: true });
  return criterion.direction === "HIGHER_FIRST" ? -comparison : comparison;
}

/** Ranks only applicants who pass the ordinary eligibility rules, applying each stated priority in order. */
export function rankDmCandidates(
  candidates: readonly DmCandidateProfile[],
  scenario: DmScenario,
  ranking: DmRankingSpec = scenario.ranking!,
): DmRankingResult {
  if (!ranking) throw new Error("A ranking scenario must provide an explicit priority order.");
  if (!Number.isInteger(ranking.seatCount) || ranking.seatCount < 1) throw new Error("Seat count must be a positive integer.");
  if (ranking.priorityOrder.length === 0) throw new Error("A ranking scenario must provide at least one explicit priority criterion.");
  if (new Set(candidates.map((candidate) => candidate.name)).size !== candidates.length) throw new Error("Applicant names must be unique within a ranking pool.");
  const fields = ranking.priorityOrder.map((criterion) => criterion.field);
  if (new Set(fields).size !== fields.length) throw new Error("Ranking criteria must be unique and ordered explicitly.");
  const evaluated = candidates.map((candidate) => ({ candidate, outcome: evaluateDmDecision(candidate, scenario).outcome }));
  const eligible = evaluated.filter((item) => item.outcome === "SELECT");
  const notEligible = evaluated.filter((item) => item.outcome !== "SELECT").map((item) => Object.freeze(item));
  const ranked = [...eligible].sort((left, right) => {
    for (const criterion of ranking.priorityOrder) {
      const a = left.candidate[criterion.field];
      const b = right.candidate[criterion.field];
      if (a === undefined || b === undefined) throw new Error("Missing ranking value for " + criterion.field + ".");
      const order = compareRankValue(a, b, criterion);
      if (order !== 0) return order;
    }
    throw new Error("Applicants are tied after all stated priority criteria; add an explicit tie-breaker.");
  }).map((item, index) => Object.freeze({ ...item, rank: index + 1 }));
  return Object.freeze({
    selected: Object.freeze(ranked.slice(0, ranking.seatCount).map((item) => item.candidate)),
    waitlisted: Object.freeze(ranked.slice(ranking.seatCount).map((item) => item.candidate)),
    notEligible: Object.freeze(notEligible),
    eligibleRanking: Object.freeze(ranked),
  });
}