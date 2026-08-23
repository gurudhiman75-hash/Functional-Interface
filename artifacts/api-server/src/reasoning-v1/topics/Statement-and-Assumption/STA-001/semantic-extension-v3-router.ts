import { routeStaScenarioBySemantics } from "./router.ts";
import type { StaQlId, StaScenarioAuthority } from "./types.ts";
import type { StaExtensionQlId, StaExtensionScenarioAuthority } from "./semantic-extension-v3-types.ts";

export type StaExtendedQlId = StaQlId | StaExtensionQlId;

const EVIDENCE_VALIDITY_RELATIONS = new Set(["COMPARABILITY", "MEASUREMENT", "REPRESENTATIVENESS"] as const);
const PERSUASIVE_RESPONSE_RELATIONS = new Set(["VALUE", "BEHAVIOUR", "INTENT", "AWARENESS", "RELEVANCE", "CAPABILITY", "EFFICACY"] as const);

function isExtensionScenario(
  scenario: StaScenarioAuthority | StaExtensionScenarioAuthority,
): scenario is StaExtensionScenarioAuthority {
  return "extensionQlId" in scenario;
}

export function routeStaExtendedScenarioBySemantics(
  scenario: StaScenarioAuthority | StaExtensionScenarioAuthority,
): StaExtendedQlId {
  const relations = new Set(scenario.hiddenDependencies.map((dependency) => dependency.relation));

  // Evidence-validity semantics have precedence over surface discourse act.
  // Example: an advertisement comparing loan rates is still solved by
  // comparability/measurement, so it belongs to QL006 rather than QL005.
  if ([...EVIDENCE_VALIDITY_RELATIONS].some((relation) => relations.has(relation))) {
    return "STA-QL-006";
  }

  if (scenario.discourseAct === "ADVERTISEMENT" || scenario.discourseAct === "APPEAL") {
    const hasPersuasiveBridge = [...PERSUASIVE_RESPONSE_RELATIONS].some((relation) => relations.has(relation));
    const hasCommunicativeDependency = scenario.hiddenDependencies.some((dependency) =>
      dependency.denialEffect === "BREAKS_COMMUNICATIVE_PURPOSE" ||
      dependency.denialEffect === "BREAKS_RELEVANCE" ||
      dependency.denialEffect === "BREAKS_FEASIBILITY" ||
      dependency.denialEffect === "BREAKS_RATIONALE"
    );
    if (hasPersuasiveBridge && hasCommunicativeDependency) return "STA-QL-005";
  }

  if (isExtensionScenario(scenario)) {
    throw new Error(`${scenario.scenarioId}: extension scenario does not match QL005/QL006 semantic router`);
  }
  return routeStaScenarioBySemantics(scenario);
}

export function assertStaExtendedScenarioOwnership(
  scenario: StaScenarioAuthority | StaExtensionScenarioAuthority,
): void {
  const routed = routeStaExtendedScenarioBySemantics(scenario);
  const expected = isExtensionScenario(scenario) ? scenario.extensionQlId : scenario.proposedQlId;
  if (routed !== expected) {
    throw new Error(`${scenario.scenarioId}: extended semantic router=${routed}, expected=${expected}`);
  }
}
