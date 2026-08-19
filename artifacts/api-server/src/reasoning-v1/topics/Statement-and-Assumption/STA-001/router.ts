import type { StaProposedQlId, StaScenarioAuthority } from "./types.ts";

export function routeStaScenarioBySemantics(scenario: StaScenarioAuthority): StaProposedQlId {
  const relations = new Set(scenario.hiddenDependencies.map((dependency) => dependency.relation));
  const denialEffects = new Set(scenario.hiddenDependencies.map((dependency) => dependency.denialEffect));

  if (
    scenario.discourseAct === "NOTICE" ||
    scenario.discourseAct === "ADVERTISEMENT" ||
    scenario.discourseAct === "APPEAL"
  ) {
    if (denialEffects.has("BREAKS_COMMUNICATIVE_PURPOSE")) return "STA-QL-003";
  }

  if ((scenario.discourseAct === "PREDICTION" || scenario.discourseAct === "ASSERTION") && relations.has("EFFICACY")) {
    return "STA-QL-004";
  }

  if (
    (scenario.discourseAct === "RECOMMENDATION" || scenario.discourseAct === "PROPOSAL" || scenario.discourseAct === "DECISION") &&
    relations.has("EFFICACY") &&
    (
      relations.has("EXISTENCE") ||
      relations.has("RELEVANCE") ||
      scenario.explicitPropositionIds.length > 0
    )
  ) {
    // QL-002 owns both hidden-need and explicitly-stated-problem forms. In the
    // latter, the stated problem may legitimately appear as an
    // EXPLICIT_RESTATEMENT distractor while efficacy remains the hidden bridge.
    return "STA-QL-002";
  }

  return "STA-QL-001";
}

export function assertStaScenarioOwnership(scenario: StaScenarioAuthority): void {
  const routed = routeStaScenarioBySemantics(scenario);
  if (routed !== scenario.proposedQlId) {
    throw new Error(`${scenario.scenarioId}: semantic router=${routed}, proposed=${scenario.proposedQlId}`);
  }
}
