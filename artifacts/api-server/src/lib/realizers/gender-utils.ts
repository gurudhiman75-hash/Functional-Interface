import {
  getPersonGender,
  type EntityGender,
} from "./entity-registry";

export type RealizerGender = EntityGender;

export function getEntityGender(
  entity: unknown,
): RealizerGender {
  return getPersonGender(entity) ?? "M";
}

/**
 * @deprecated Use getEntityGender(entity) with canonical entity metadata.
 * This wrapper remains only for older realizer call sites.
 */
export function inferGender(
  entity: unknown,
): RealizerGender {
  return getEntityGender(entity);
}

export function hindiSitVerb(entity: unknown) {
  return getEntityGender(entity) === "F"
    ? "बैठी है"
    : "बैठा है";
}

export function punjabiSitVerb(entity: unknown) {
  return getEntityGender(entity) === "F"
    ? "ਬੈਠੀ ਹੈ"
    : "ਬੈਠਾ ਹੈ";
}
