import { semanticNegationOf } from "./negation.ts";
import type {
  StaAnswerSet,
  StaCandidateAuthority,
  StaOracleResult,
  StaScenarioAuthority,
} from "./types.ts";

function getProposition(scenario: StaScenarioAuthority, propositionId: string) {
  const proposition = scenario.propositions.find((item) => item.propositionId === propositionId);
  if (!proposition) throw new Error(`${scenario.scenarioId}: missing proposition ${propositionId}`);
  return proposition;
}

export function evaluateAssumptionOracle(
  scenario: StaScenarioAuthority,
  candidate: StaCandidateAuthority,
): StaOracleResult {
  const proposition = getProposition(scenario, candidate.propositionId);
  let denialSemanticKey: string;
  try {
    denialSemanticKey = semanticNegationOf(proposition).denialSemanticKey;
  } catch {
    return {
      candidateId: candidate.candidateId,
      propositionId: candidate.propositionId,
      classification: "NOT_IMPLICIT",
      evidenceCode: "MISSING_SEMANTIC_NEGATION",
    };
  }

  if (scenario.explicitPropositionIds.includes(candidate.propositionId)) {
    return {
      candidateId: candidate.candidateId,
      propositionId: candidate.propositionId,
      classification: "NOT_IMPLICIT",
      evidenceCode: "EXPLICIT_RESTATEMENT",
      denialSemanticKey,
    };
  }

  const dependencies = scenario.hiddenDependencies.filter((item) => item.propositionId === candidate.propositionId);
  if (dependencies.length === 0) {
    return {
      candidateId: candidate.candidateId,
      propositionId: candidate.propositionId,
      classification: "NOT_IMPLICIT",
      evidenceCode: "NO_REQUIRED_DEPENDENCY",
      denialSemanticKey,
    };
  }

  const requiredDependency = dependencies.find((item) =>
    item.requiredFor.some((objectiveId) => scenario.objectiveIds.includes(objectiveId)),
  );

  if (!requiredDependency) {
    return {
      candidateId: candidate.candidateId,
      propositionId: candidate.propositionId,
      classification: "NOT_IMPLICIT",
      evidenceCode: "DEPENDENCY_NOT_REQUIRED_FOR_OBJECTIVE",
      denialSemanticKey,
    };
  }

  return {
    candidateId: candidate.candidateId,
    propositionId: candidate.propositionId,
    classification: "IMPLICIT",
    evidenceCode: "REQUIRED_HIDDEN_DEPENDENCY",
    dependencyId: requiredDependency.dependencyId,
    dependencyRelation: requiredDependency.relation,
    denialEffect: requiredDependency.denialEffect,
    denialSemanticKey,
  };
}

export function evaluateScenarioOracle(scenario: StaScenarioAuthority): readonly StaOracleResult[] {
  return scenario.candidates.map((candidate) => evaluateAssumptionOracle(scenario, candidate));
}

export function assertScenarioOracleParity(scenario: StaScenarioAuthority): void {
  for (const candidate of scenario.candidates) {
    const oracle = evaluateAssumptionOracle(scenario, candidate);
    if (oracle.classification !== candidate.expectedClassification) {
      throw new Error(
        `${scenario.scenarioId}/${candidate.candidateId}: editorial=${candidate.expectedClassification} oracle=${oracle.classification} (${oracle.evidenceCode})`,
      );
    }
  }
}

export function answerSetForSelectedCandidates(
  scenario: StaScenarioAuthority,
  selectedCandidates: readonly StaCandidateAuthority[],
): StaAnswerSet {
  const answer: number[] = [];
  selectedCandidates.forEach((candidate, index) => {
    if (evaluateAssumptionOracle(scenario, candidate).classification === "IMPLICIT") answer.push(index);
  });
  return answer;
}
