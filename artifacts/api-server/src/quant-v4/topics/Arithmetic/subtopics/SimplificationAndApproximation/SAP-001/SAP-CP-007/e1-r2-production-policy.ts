export const SAP_CP007_E1_R2_PRODUCTION_POLICY = Object.freeze({
  checkpointId: "SAP-CP-007" as const,
  capabilityRetained: true as const,
  normalMockEligible: false as const,
  questionStudioDiscoverable: false as const,
  reason: "Arithmetic significant-figure rounding remains source-backed E1 coverage, but manual exam-readiness review found it too textbook-like for the normal SSC/Banking Simplification & Approximation pool. Retain only as foundation/diagnostic content unless later source saturation proves a stronger Quant production role.",
});
