import { executeMachine, ruleFingerprint, tokenStateFingerprint } from "./engine.ts";
import type {
  IopIdentifiabilityEvidence,
  IopMachineRule,
  IopMachineTrace,
  IopPhaseRule,
  IopPlacement,
  IopSelectionDirection,
  IopToken,
  IopTokenKind,
} from "./types.ts";

const DIRECTIONS: readonly IopSelectionDirection[] = ["ASC", "DESC"];
const PLACEMENTS: readonly IopPlacement[] = ["LEFT_FIXED", "RIGHT_FIXED"];

function makePhase(index: number, kind: IopTokenKind, direction: IopSelectionDirection, placement: IopPlacement): IopPhaseRule {
  return {
    id: `ALT-P${index}`,
    eligibleKind: kind,
    selectionKey: kind === "WORD" ? "ALPHABETICAL" : "NUMERIC_VALUE",
    direction,
    placement,
  };
}

function candidate(id: string, schedule: IopMachineRule["schedule"], phases: readonly IopPhaseRule[]): IopMachineRule {
  return { id, checkpointId: "IOP-CP-001", schedule, phases };
}

function hasMixedKinds(input: readonly IopToken[]): boolean {
  return input.some((token) => token.kind === "WORD") && input.some((token) => token.kind === "NUMBER");
}

export function buildCompetingRuleGrammar(input: readonly IopToken[]): readonly IopMachineRule[] {
  const rules: IopMachineRule[] = [];
  const kinds = [...new Set(input.map((token) => token.kind))] as IopTokenKind[];

  for (const kind of kinds) {
    for (const direction of DIRECTIONS) {
      for (const placement of PLACEMENTS) {
        rules.push(candidate(`ALT-SINGLE-${kind}-${direction}-${placement}`, "SINGLE_PHASE", [makePhase(1, kind, direction, placement)]));
      }
    }
  }

  const pairKinds: readonly (readonly [IopTokenKind, IopTokenKind])[] = hasMixedKinds(input)
    ? [["NUMBER", "WORD"], ["WORD", "NUMBER"]]
    : [[kinds[0]!, kinds[0]!]];

  for (const [firstKind, secondKind] of pairKinds) {
    for (const firstDirection of DIRECTIONS) {
      for (const secondDirection of DIRECTIONS) {
        for (const firstPlacement of PLACEMENTS) {
          for (const secondPlacement of PLACEMENTS) {
            const first = makePhase(1, firstKind, firstDirection, firstPlacement);
            const second = makePhase(2, secondKind, secondDirection, secondPlacement);
            const samePhase = firstKind === secondKind && firstDirection === secondDirection && firstPlacement === secondPlacement;
            for (const schedule of ["ALTERNATING_PHASES", "SIMULTANEOUS_PHASES"] as const) {
              if (samePhase) continue;
              rules.push(candidate(`ALT-${schedule}-${rules.length}`, schedule, [first, second]));
            }
            if (firstKind !== secondKind) rules.push(candidate(`ALT-BLOCKED-${rules.length}`, "BLOCKED_PHASES", [first, second]));
          }
        }
      }
    }
  }

  const unique = new Map<string, IopMachineRule>();
  for (const rule of rules) unique.set(ruleFingerprint(rule), rule);
  return [...unique.values()];
}

function traceSignature(trace: IopMachineTrace): string {
  return [tokenStateFingerprint(trace.input), ...trace.steps.map((step) => step.stateFingerprint)].join("=>");
}

export function evaluateRuleIdentifiability(intended: IopMachineRule, demonstration: IopMachineTrace): IopIdentifiabilityEvidence {
  const candidates = buildCompetingRuleGrammar(demonstration.input);
  const expected = traceSignature(demonstration);
  const matches = new Set<string>();

  for (const candidateRule of candidates) {
    try {
      const candidateTrace = executeMachine(candidateRule, demonstration.input);
      if (traceSignature(candidateTrace) === expected) matches.add(ruleFingerprint(candidateRule));
    } catch {
      // An invalid alternative cannot explain the demonstration.
    }
  }

  const intendedFingerprint = ruleFingerprint(intended);
  if (traceSignature(executeMachine(intended, demonstration.input)) === expected) matches.add(intendedFingerprint);
  const matchingRuleFingerprints = [...matches].sort();
  return {
    candidateRulesTested: candidates.length,
    matchingRuleFingerprints,
    intendedRuleFingerprint: intendedFingerprint,
    passed: matchingRuleFingerprints.length === 1 && matchingRuleFingerprints[0] === intendedFingerprint,
  };
}
