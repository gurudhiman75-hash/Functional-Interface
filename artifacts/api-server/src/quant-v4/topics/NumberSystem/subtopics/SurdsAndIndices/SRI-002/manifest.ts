export const SRI_002_MANIFEST = {
  packageId: "SRI-002",
  displayName: "Surds, Radicals & Rationalisation",
  status: "PERMANENT_MULTILINGUAL_FROZEN_V1",
  canonicalCheckpoints: ["SRI-CP-007", "SRI-CP-008", "SRI-CP-009", "SRI-CP-010", "SRI-CP-011", "SRI-CP-012"],
  permanentQlCount: 29,
  frozenSolveModeCount: 29,
  activeExecutableDiscoveryCheckpoints: ["SRI-CP-007", "SRI-CP-008", "SRI-CP-009", "SRI-CP-010", "SRI-CP-011", "SRI-CP-012"],
  provisionalCandidateCount: 45,
  discoveryWaves: {
    phase3SurdFoundations: 23,
    phase4SurdAdvanced: 20,
    sourceSaturationR1: 2,
  },
  legacyEvidence: {
    packageId: "NS-SURD-001",
    legacyQlCount: 47,
    disposition: "MIGRATION_EVIDENCE_NOT_PRODUCTION_AUTHORITY",
  },
  downstreamEligibility: {
    questionStudio: false,
    questionBank: false,
    tests: false,
    public: false,
  },
} as const;
