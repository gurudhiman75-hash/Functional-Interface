export type SriSourceGateStatus = "SOURCE_BACKED_KEEP" | "UNRESOLVED_HOLD";

export interface SriSourceGateResolutionR1 {
  readonly candidateId: string;
  readonly retainedGroupId: string;
  readonly status: SriSourceGateStatus;
  readonly evidence: readonly string[];
  readonly note: string;
}

/** R1 resolution of candidates that entered discovery with SOURCE_GATED provenance. */
export const SRI_SOURCE_GATE_RESOLUTIONS_R1: readonly SriSourceGateResolutionR1[] = [
  {
    candidateId: "C010-F",
    retainedGroupId: "SRI-RG-047",
    status: "SOURCE_BACKED_KEEP",
    evidence: [
      "SSC CHSL 2025 Tier-1, 12 Nov 2025 Shift 2: sqrt(12+sqrt(12+...))",
      "SSC CGL 2025, 17 Sep 2025 Shift 3: sqrt(12+sqrt(12+...))",
      "SSC CGL 2022 Tier-II, 3 Mar 2023: sqrt(20-sqrt(20-...))",
    ],
    note: "Direct SSC previous-paper provenance supports the repeating radical fixed-point contract. Discovery provenance remains SOURCE_GATED, but the R1 release gate is resolved positively.",
  },
  {
    candidateId: "C008-I",
    retainedGroupId: "SRI-RG-039",
    status: "UNRESOLVED_HOLD",
    evidence: [
      "Current surd-rule references consistently teach sqrt(a)+sqrt(b) != sqrt(a+b), but R1 did not locate comparable direct SSC/Bank/Railway previous-paper provenance for the condition-target form uv=0.",
    ],
    note: "Keep executable as discovery evidence, but exclude from any permanent proposal until direct target-exam corroboration is found.",
  },
] as const;

export const SRI_R1_RESOLVED_SOURCE_GATES = SRI_SOURCE_GATE_RESOLUTIONS_R1.filter((item) => item.status === "SOURCE_BACKED_KEEP");
export const SRI_R1_UNRESOLVED_SOURCE_GATES = SRI_SOURCE_GATE_RESOLUTIONS_R1.filter((item) => item.status === "UNRESOLVED_HOLD");
