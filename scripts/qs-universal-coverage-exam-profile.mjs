// Authoritative exam selection for the offline compute-only catalog smoke.
// Packages can be registered while still being restricted to a specific
// exam family. Never widen a package's native release authority for the audit.
export function examForQuestionStudioComputeAudit(packageId) {
  if (["IOP-001", "DI-014"].includes(packageId)) return "IBPS PO Mains";
  if (["DI-007", "DI-008", "SAP", "WFM-001"].includes(packageId)) return "IBPS PO Prelims";
  return "SSC CGL Tier 1";
}
