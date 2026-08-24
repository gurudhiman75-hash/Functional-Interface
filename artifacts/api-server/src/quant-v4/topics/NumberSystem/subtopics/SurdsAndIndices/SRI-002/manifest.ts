export const SRI_002_MANIFEST = {
  packageId: "SRI-002",
  displayName: "Surds, Radicals & Rationalisation",
  status: "DISCOVERY_OPEN_PHASE_3_SURD_FOUNDATIONS",
  canonicalCheckpoints: ["SRI-CP-007", "SRI-CP-008", "SRI-CP-009", "SRI-CP-010", "SRI-CP-011", "SRI-CP-012"],
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  activeExecutableDiscoveryCheckpoints: ["SRI-CP-007", "SRI-CP-008", "SRI-CP-009"],
  provisionalCandidateCount: 23,
  discoveryWaves: {
    phase3SurdFoundations: 23,
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
