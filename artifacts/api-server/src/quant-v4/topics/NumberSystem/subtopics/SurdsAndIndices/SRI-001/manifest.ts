export const SRI_001_MANIFEST = {
  packageId: "SRI-001",
  displayName: "Indices, Exponents & Power Structure",
  status: "PERMANENT_MULTILINGUAL_FROZEN_V1",
  canonicalCheckpoints: ["SRI-CP-001", "SRI-CP-002", "SRI-CP-003", "SRI-CP-004", "SRI-CP-005", "SRI-CP-006"],
  permanentQlCount: 29,
  frozenSolveModeCount: 29,
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
