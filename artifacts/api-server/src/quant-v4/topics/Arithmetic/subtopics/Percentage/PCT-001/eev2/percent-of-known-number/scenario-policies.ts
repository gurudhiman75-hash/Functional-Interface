import {
  hasForbiddenEventRoot,
  hasPreferredScenarioRoot,
  normalizeContextLabel,
} from "./context-labels";

export type ScenarioPolicyDecision = "ACCEPT" | "REJECT";

export interface ScenarioPolicyInput {
  contextLabel?: string;
  semanticUnit: string;
  knownRate: number;
  targetRate: number;
}

export interface ScenarioPolicyResult {
  decision: ScenarioPolicyDecision;
  normalizedLabel: string;
  preserveCompoundLabel: boolean;
  code?: string;
  reason?: string;
}

function isVotesContext(label: string, semanticUnit: string): boolean {
  return semanticUnit === "votes" || /\bvotes?\b/.test(label);
}

function isBoundedAttendanceContext(label: string): boolean {
  return /\b(students|workers|employees|families|books|trees)\b.*\b(present|surveyed|employed|sold|surviving|affected)\b/.test(
    label,
  );
}

export function evaluateScenarioPolicy(
  input: ScenarioPolicyInput,
): ScenarioPolicyResult {
  const normalizedLabel = normalizeContextLabel(
    input.contextLabel ?? input.semanticUnit,
  );
  const preserveCompoundLabel = normalizedLabel.includes(" ");

  if (hasForbiddenEventRoot(normalizedLabel)) {
    return {
      decision: "REJECT",
      normalizedLabel,
      preserveCompoundLabel,
      code: "IMPLAUSIBLE_EVENT_PERCENTAGE",
      reason:
        "Event-occurrence contexts are not approved for percentOfKnownNumber.",
    };
  }

  if (
    isVotesContext(normalizedLabel, input.semanticUnit) &&
    Math.min(input.knownRate, input.targetRate) < 20
  ) {
    return {
      decision: "REJECT",
      normalizedLabel,
      preserveCompoundLabel,
      code: "IMPLAUSIBLE_VOTER_TURNOUT",
      reason: "Election turnout below 20% is outside the approved realism range.",
    };
  }

  if (
    isBoundedAttendanceContext(normalizedLabel) &&
    (Math.min(input.knownRate, input.targetRate) < 10 ||
      Math.max(input.knownRate, input.targetRate) > 95)
  ) {
    return {
      decision: "REJECT",
      normalizedLabel,
      preserveCompoundLabel,
      code: "IMPLAUSIBLE_BOUNDED_GROUP_RATE",
      reason:
        "The percentage is implausible for the bounded group scenario.",
    };
  }

  if (
    input.semanticUnit !== "abstract-number" &&
    input.semanticUnit !== "rupees" &&
    !hasPreferredScenarioRoot(normalizedLabel) &&
    preserveCompoundLabel
  ) {
    return {
      decision: "REJECT",
      normalizedLabel,
      preserveCompoundLabel,
      code: "UNAPPROVED_COMPOUND_SCENARIO",
      reason: "The compound scenario is not in the approved exam-realism set.",
    };
  }

  return {
    decision: "ACCEPT",
    normalizedLabel,
    preserveCompoundLabel,
  };
}
