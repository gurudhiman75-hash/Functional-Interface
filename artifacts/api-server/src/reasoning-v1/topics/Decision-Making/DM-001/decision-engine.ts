import type {
  DmCandidateProfile,
  DmConditionCheck,
  DmDecisionResult,
  DmField,
  DmRuleCondition,
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
  if (baseChecks.some((check) => check.status === "UNKNOWN")) {
    return Object.freeze({ outcome: "INFORMATION_REQUIRED", checks: Object.freeze(baseChecks), unresolvedRuleIds: Object.freeze(unresolvedRuleIds) });
  }
  if (baseChecks.every((check) => check.status === "PASS")) {
    return Object.freeze({ outcome: "SELECT", checks: Object.freeze(baseChecks), unresolvedRuleIds: Object.freeze([]) });
  }
  if (unresolvedRuleIds.length > 0) {
    return Object.freeze({ outcome: "INFORMATION_REQUIRED", checks: Object.freeze(baseChecks), unresolvedRuleIds: Object.freeze(unresolvedRuleIds) });
  }
  return Object.freeze({ outcome: "REJECT", checks: Object.freeze(baseChecks), unresolvedRuleIds: Object.freeze([]) });
}
