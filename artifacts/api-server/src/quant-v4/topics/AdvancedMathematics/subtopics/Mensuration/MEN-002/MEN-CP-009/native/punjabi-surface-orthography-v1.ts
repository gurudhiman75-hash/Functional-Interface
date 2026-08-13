export const MEN_CP_009_PUNJABI_SURFACE_WORD = "ਸਤ੍ਹਾ" as const;

/**
 * Learner-facing Punjabi orthography guard for MEN-CP-009.
 *
 * The natural Punjabi word used here for "surface" is `ਸਤ੍ਹਾ`.
 * Earlier review candidates incorrectly emitted `ਸਤਹ` in several surface-area
 * phrases. Keep this as a final presentation-layer normalizer so legacy
 * translation helpers cannot leak that spelling back into learner content.
 */
export function normalizeMenCp009PunjabiSurfaceOrthography(value: string) {
  return value
    .replace(/ਸਤਹ/g, MEN_CP_009_PUNJABI_SURFACE_WORD)
    .replace(/\s+/g, " ")
    .trim();
}
