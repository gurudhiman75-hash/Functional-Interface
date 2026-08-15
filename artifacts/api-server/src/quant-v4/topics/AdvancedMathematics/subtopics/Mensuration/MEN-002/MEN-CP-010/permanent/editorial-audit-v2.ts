import { buildMenCp010ExamRealismReviewV2 } from "./review-v2";

export const MEN_CP_010_EDITORIAL_AUDIT_V2_AUTHORITY =
  "MEN-CP010-EDITORIAL-AUDIT-V2" as const;

const LEGACY_GENERIC_TRAPS = new Set([
  "Do not confuse vertical height with slant height.",
  "Do not omit the one-third factor or the mixed frustum term.",
  "Include only the surfaces or dimensions requested by the question.",
]);

const LEGACY_GENERIC_SHORTCUTS = new Set([
  "Sketch or mentally mark the vertical height, slant height and corresponding base dimensions before calculating.",
]);

export function auditMenCp010EditorialPolishV2() {
  const records = buildMenCp010ExamRealismReviewV2();
  const legacyGenericTrapRecords = records
    .filter((q) => q.explanation.traps.some((trap) => LEGACY_GENERIC_TRAPS.has(trap)))
    .map((q) => ({ qlId: q.permanentQlId, sourceId: q.sourceId, traps: q.explanation.traps }));
  const legacyGenericShortcutRecords = records
    .filter((q) => LEGACY_GENERIC_SHORTCUTS.has(q.explanation.shortcut))
    .map((q) => ({ qlId: q.permanentQlId, sourceId: q.sourceId, shortcut: q.explanation.shortcut }));
  const unnaturalCapacityStemRecords = records
    .filter((q) => q.permanentQlId === "MEN-002-QL-143" && /(?:radius|height)\s*=/.test(q.stem))
    .map((q) => ({ sourceId: q.sourceId, stem: q.stem }));
  const rawCrossSectionFractionRecords = records
    .filter((q) => q.permanentQlId === "MEN-002-QL-142" && /^\d+\/\d+\s+(?:cm|m)$/.test(q.answer))
    .map((q) => ({ sourceId: q.sourceId, answer: q.answer }));
  const rawFrustumSurfaceFractionRecords = records
    .filter((q) => q.permanentQlId === "MEN-002-QL-130" && /^\d+\/\d+\s+(?:cm²|m²)$/.test(q.answer))
    .map((q) => ({ sourceId: q.sourceId, answer: q.answer }));
  const correctDisplayMismatchRecords = records
    .filter((q) => q.options[q.correctIndex]?.display !== q.answer)
    .map((q) => ({ qlId: q.permanentQlId, sourceId: q.sourceId, answer: q.answer, correctIndex: q.correctIndex }));

  return {
    authority: MEN_CP_010_EDITORIAL_AUDIT_V2_AUTHORITY,
    reviewRecordCount: records.length,
    noLegacyGenericTrapText: legacyGenericTrapRecords.length === 0,
    noLegacyGenericShortcutText: legacyGenericShortcutRecords.length === 0,
    naturalCapacityStemSyntax: unnaturalCapacityStemRecords.length === 0,
    naturalCrossSectionLengthDisplay: rawCrossSectionFractionRecords.length === 0,
    naturalFrustumSurfaceFractionDisplay: rawFrustumSurfaceFractionRecords.length === 0,
    correctOptionDisplayMatchesAnswer: correctDisplayMismatchRecords.length === 0,
    legacyGenericTrapRecords,
    legacyGenericShortcutRecords,
    unnaturalCapacityStemRecords,
    rawCrossSectionFractionRecords,
    rawFrustumSurfaceFractionRecords,
    correctDisplayMismatchRecords,
  } as const;
}
