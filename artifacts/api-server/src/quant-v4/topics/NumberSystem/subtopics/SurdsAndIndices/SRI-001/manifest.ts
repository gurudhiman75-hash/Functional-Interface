export const SRI_001_MANIFEST = {
  packageId: "SRI-001",
  displayName: "Indices, Exponents & Power Structure",
  status: "DISCOVERY_OPEN_PHASE_2_POWER_RELATIONS_AUDITED",
  canonicalCheckpoints: ["SRI-CP-001", "SRI-CP-002", "SRI-CP-003", "SRI-CP-004", "SRI-CP-005", "SRI-CP-006"],
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  activeExecutableDiscoveryCheckpoints: ["SRI-CP-001", "SRI-CP-002", "SRI-CP-003", "SRI-CP-004", "SRI-CP-005", "SRI-CP-006"],
  provisionalCandidateCount: 48,
  discoveryWaves: {
    phase1PowerFoundations: 25,
    phase2PowerRelations: 23,
  },
  legacyEvidence: {
    packageId: "NS-EXP-001",
    currentRuntimeQlCount: 100,
    disposition: "MIGRATION_EVIDENCE_NOT_PRODUCTION_AUTHORITY",
  },
  downstreamEligibility: {
    questionStudio: false,
    questionBank: false,
    tests: false,
    public: false,
  },
} as const;
