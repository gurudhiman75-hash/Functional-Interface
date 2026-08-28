import type { SriLocalizedLocaleV1 } from "./permanent-localization-base-v1";
import { localizeSriC008C009FinalizedSurfaceV1 as localizeSriC008C009CoreV1 } from "./permanent-localization-c008-c009-core-v1";
import { localizeSriC010C012FinalizedSurfaceV1 } from "./permanent-localization-c010-c012-v1";

/**
 * Early finalized-surface localization authority for CP008-CP012.
 * CP008/CP009 remain byte-identical in the core module; later checkpoints
 * are delegated only when the proven core has no match.
 */
export function localizeSriC008C009FinalizedSurfaceV1(
  text: string,
  locale: SriLocalizedLocaleV1,
): string | undefined {
  return localizeSriC008C009CoreV1(text, locale)
    ?? localizeSriC010C012FinalizedSurfaceV1(text, locale);
}
