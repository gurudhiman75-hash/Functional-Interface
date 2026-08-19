import { STA_EXECUTABLE_SCENARIOS, STA_SCENARIOS_BY_QL } from "./prototype-authorities.ts";
import { assertStaScenarioOwnership } from "./router.ts";
import type { StaCheckpointId, StaProposedQlId } from "./types.ts";

export type StaPermanentQlId = StaProposedQlId;

export interface StaPermanentQlAuthority {
  readonly qlId: StaPermanentQlId;
  readonly checkpointId: StaCheckpointId;
  readonly semanticAuthority: string;
  readonly oracleOperation: string;
  readonly sourceState: "STRONG";
  readonly executableScenarioIds: readonly string[];
  readonly candidateCountIsMetadata: true;
  readonly optionCodingIsMetadata: true;
  readonly negativeWordingIsMetadata: true;
  readonly status: "PERMANENT_QL_SEMANTIC_AUTHORITY_FROZEN";
}

export const STA_PERMANENT_QL_AUTHORITIES: readonly StaPermanentQlAuthority[] = [
  {
    qlId: "STA-QL-001",
    checkpointId: "STA-CP-001",
    semanticAuthority: "Core prerequisite, existence, availability, capability and feasibility dependency required for a supplied instruction or controlled act.",
    oracleOperation: "Locate an unstated required precondition and prove that semantic denial breaks feasibility or the intended act.",
    sourceState: "STRONG",
    executableScenarioIds: STA_SCENARIOS_BY_QL["STA-QL-001"].map((scenario) => scenario.scenarioId),
    candidateCountIsMetadata: true,
    optionCodingIsMetadata: true,
    negativeWordingIsMetadata: true,
    status: "PERMANENT_QL_SEMANTIC_AUTHORITY_FROZEN",
  },
  {
    qlId: "STA-QL-002",
    checkpointId: "STA-CP-002",
    semanticAuthority: "Recommendation, proposal, policy or decision whose rationale depends on a relevant need/problem plus feasibility or efficacy dependencies.",
    oracleOperation: "Audit the hidden need/relevance and efficacy/feasibility dependencies that make the prescriptive act rational and workable.",
    sourceState: "STRONG",
    executableScenarioIds: STA_SCENARIOS_BY_QL["STA-QL-002"].map((scenario) => scenario.scenarioId),
    candidateCountIsMetadata: true,
    optionCodingIsMetadata: true,
    negativeWordingIsMetadata: true,
    status: "PERMANENT_QL_SEMANTIC_AUTHORITY_FROZEN",
  },
  {
    qlId: "STA-QL-003",
    checkpointId: "STA-CP-002",
    semanticAuthority: "Source-supported notice, rule and institutional communication whose purpose depends on audience relevance, ability to respond or service/action capability.",
    oracleOperation: "Identify unstated audience-purpose dependencies and prove that denial breaks communicative purpose rather than merely making the message less persuasive.",
    sourceState: "STRONG",
    executableScenarioIds: STA_SCENARIOS_BY_QL["STA-QL-003"].map((scenario) => scenario.scenarioId),
    candidateCountIsMetadata: true,
    optionCodingIsMetadata: true,
    negativeWordingIsMetadata: true,
    status: "PERMANENT_QL_SEMANTIC_AUTHORITY_FROZEN",
  },
  {
    qlId: "STA-QL-004",
    checkpointId: "STA-CP-002",
    semanticAuthority: "Claim or prediction that requires an unstated causal or efficacy bridge between supplied information and the stated outcome.",
    oracleOperation: "Separate explicit premises/outcome language from the hidden bridge, then prove that denying the bridge destroys the prediction or claim rationale.",
    sourceState: "STRONG",
    executableScenarioIds: STA_SCENARIOS_BY_QL["STA-QL-004"].map((scenario) => scenario.scenarioId),
    candidateCountIsMetadata: true,
    optionCodingIsMetadata: true,
    negativeWordingIsMetadata: true,
    status: "PERMANENT_QL_SEMANTIC_AUTHORITY_FROZEN",
  },
] as const;

export const STA_DEFERRED_DISCOVERY_RESERVES = [
  "ADVERTISING_OR_APPEAL_BREADTH_AS_A_SEPARATE_QL",
  "COMPARISON_MEASUREMENT_REPRESENTATIVENESS_AS_A_SEPARATE_QL",
  "NEGATIVE_QUERY_AS_A_SEPARATE_QL",
] as const;

export function assertStaPermanentAuthorityIntegrity(): void {
  if (STA_PERMANENT_QL_AUTHORITIES.length !== 4) throw new Error("STA permanent QL authority count must remain four");
  const ids = new Set(STA_PERMANENT_QL_AUTHORITIES.map((authority) => authority.qlId));
  if (ids.size !== STA_PERMANENT_QL_AUTHORITIES.length) throw new Error("Duplicate STA permanent QL ID");

  const claimedScenarios = new Set<string>();
  for (const authority of STA_PERMANENT_QL_AUTHORITIES) {
    if (authority.executableScenarioIds.length < 3) throw new Error(`${authority.qlId}: insufficient executable source authorities`);
    for (const scenarioId of authority.executableScenarioIds) {
      if (claimedScenarios.has(scenarioId)) throw new Error(`${scenarioId}: claimed by more than one permanent QL`);
      claimedScenarios.add(scenarioId);
      const scenario = STA_EXECUTABLE_SCENARIOS.find((item) => item.scenarioId === scenarioId);
      if (!scenario) throw new Error(`${authority.qlId}: missing executable scenario ${scenarioId}`);
      assertStaScenarioOwnership(scenario);
      if (scenario.proposedQlId !== authority.qlId) throw new Error(`${scenarioId}: scenario/permanent QL mismatch`);
    }
  }

  if (claimedScenarios.size !== STA_EXECUTABLE_SCENARIOS.length) {
    throw new Error(`Permanent QL authorities cover ${claimedScenarios.size}/${STA_EXECUTABLE_SCENARIOS.length} reviewed scenarios`);
  }
}
