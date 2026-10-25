import type { GenerationPackage } from './api';

const ENGINES = new Set(['quant-v4', 'reasoning-v1', 'language-v1', 'knowledge-v1']);
const ID = /^[A-Z][A-Z0-9-]{1,80}$/;
const PACKAGE_ID = /^[A-Za-z][A-Za-z0-9:_-]{1,127}$/;
export const PRODUCTION_CHAPTER_BATCH_LIMIT = 20;

// Discovery only; the server and dispatcher independently enforce release scope.
export function isProductionChapterPackage(pkg: GenerationPackage) {
  return ENGINES.has(pkg.engineId ?? '') && PACKAGE_ID.test(pkg.packageId) && pkg.enabled
    && pkg.reviewSurfaceRequired === true && pkg.manualApprovalRequired === true
    && pkg.productionReleaseAuthorized === false && pkg.automaticStudentPublication === false
    && pkg.publiclyPublishable === false && pkg.cpIds.length > 0
    && new Set(pkg.cpIds).size === pkg.cpIds.length && pkg.cpIds.every(cp => ID.test(cp));
}

export function productionChapterCpIds(pkg: GenerationPackage) {
  // Dynamic candidates are not part of the immutable canonical chapter grant.
  return [...pkg.cpIds];
}
