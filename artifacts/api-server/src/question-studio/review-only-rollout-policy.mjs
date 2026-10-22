// Review-only prospective rollout policy. NOT imported by production receiver or
// enqueue job. Existing COM-001 canary gate remains untouched and fail-closed.
// An operator-reviewed manifest must explicitly name each allowed package/CP.
const ENGINES = new Set(["quant-v4","reasoning-v1","language-v1","knowledge-v1"]);
const ID = /^[A-Z][A-Z0-9-]{1,80}$/;
export function validateReviewOnlyRollout(snapshot, manifest) {
  if (!Array.isArray(manifest) || !snapshot || typeof snapshot !== "object") return false;
  const request = snapshot.request;
  if (!request || typeof request !== "object" || Array.isArray(request)) return false;
  if (snapshot.queueVersion !== 1 || snapshot.count !== 1 || request.count !== 1 ||
      !ENGINES.has(request.engineId) || request.language !== "en" ||
      typeof request.seed !== "string" || request.seed.length < 8 ||
      !Array.isArray(snapshot.selectedCpIds) || snapshot.selectedCpIds.length !== 1) return false;
  const cp = snapshot.selectedCpIds[0];
  if (typeof cp !== "string" || !ID.test(cp) || typeof request.packageId !== "string" ||
      !ID.test(request.packageId)) return false;
  if (request.canonicalProblemId !== undefined && request.canonicalProblemId !== cp) return false;
  const matched = manifest.filter(x => x && typeof x === "object" &&
    x.enabled === true && x.engineId === request.engineId &&
    x.packageId === request.packageId && Array.isArray(x.cpIds) &&
    x.cpIds.length > 0 && x.cpIds.includes(cp));
  // Ambiguous or duplicated manifest matches must fail closed.
  if (matched.length !== 1 || !matched[0].reviewOnly || matched[0].maxQuestions !== 1) return false;
  // This helper is a secondary policy only: runtime package manifest, OIDC,
  // TTL, identity, zero pending work, cost caps and rollback are separate gates.
  return true;
}
