import { SYL_QL_REGISTRY } from "./ql-registry";

export const SYL_PROVISIONAL_QL_ARCHETYPES_V3 = Object.freeze(
  SYL_QL_REGISTRY.map((definition) => Object.freeze({
    ...definition,
    lifecycleStatus: "PROVISIONAL_REVIEW_ARCHETYPE" as const,
    permanentAllocationFrozen: false as const,
    discoveryAuthority: "SYL_001_OPEN_EXHAUSTIVE_DISCOVERY_V3" as const,
  })),
);

export const SYL_QL_DISCOVERY_STATE_V3 = Object.freeze({
  authority: "SYL_001_OPEN_EXHAUSTIVE_DISCOVERY_V3" as const,
  status: "OPEN" as const,
  currentArchetypeCount: SYL_PROVISIONAL_QL_ARCHETYPES_V3.length,
  finalQlCount: null,
  finalSolveModeCount: null,
  freezePermitted: false as const,
  requiredCloseoutAudits: [
    "semantic-form coverage",
    "task-form coverage",
    "witness identity coverage",
    "topology coverage",
    "existence-dependence coverage",
    "diagram proof-mode coverage",
    "distractor error-family coverage",
    "duplicate and merge/split audit",
    "native multilingual review",
  ] as const,
});
