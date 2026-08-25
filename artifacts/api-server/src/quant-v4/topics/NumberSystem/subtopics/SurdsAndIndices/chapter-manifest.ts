export const SRI_CHAPTER_MANIFEST = {
  chapterId: "SRI",
  displayName: "Surds & Indices",
  designAuthority: "SRI-END-TO-END-DESIGN-R1",
  implementationPhase: "PHASE_7_PERMANENT_ALLOCATION_V1_ENGLISH_FREEZE_PENDING",
  packages: ["SRI-001", "SRI-002"],
  canonicalCheckpoints: [
    "SRI-CP-001", "SRI-CP-002", "SRI-CP-003", "SRI-CP-004", "SRI-CP-005", "SRI-CP-006",
    "SRI-CP-007", "SRI-CP-008", "SRI-CP-009", "SRI-CP-010", "SRI-CP-011", "SRI-CP-012",
  ],
  executableDiscoveryCheckpoints: [
    "SRI-CP-001", "SRI-CP-002", "SRI-CP-003", "SRI-CP-004", "SRI-CP-005", "SRI-CP-006",
    "SRI-CP-007", "SRI-CP-008", "SRI-CP-009", "SRI-CP-010", "SRI-CP-011", "SRI-CP-012",
  ],
  permanentQlCount: 58,
  frozenSolveModeCount: 0,
  locales: ["en-IN", "hi-IN", "pa-IN"],
  lifecycle: {
    discoveryOpen: true,
    englishFrozen: false,
    multilingualFrozen: false,
    questionStudioDiscoverable: false,
    questionStudioGenerationEnabled: false,
    questionBankWritesEnabled: false,
    testEligibilityEnabled: false,
    publicPublicationEnabled: false,
  },
} as const;

export function assertSriReleaseLocks(): void {
  const lifecycle = SRI_CHAPTER_MANIFEST.lifecycle;
  if (
    lifecycle.questionStudioDiscoverable ||
    lifecycle.questionStudioGenerationEnabled ||
    lifecycle.questionBankWritesEnabled ||
    lifecycle.testEligibilityEnabled ||
    lifecycle.publicPublicationEnabled
  ) {
    throw new Error("SRI Phase 7 must remain review-only with downstream release locks closed");
  }
}
