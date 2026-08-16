import { renderSpatialSceneToSvg } from "./svg-renderer";
import { getSpatialPrimitiveConnectivityV2 } from "./primitive-connectivity-v2";
import { SPATIAL_PRIMITIVE_AUTHORITY_V2 } from "./primitive-library-v2";
import { deriveSpatialPrimitiveQuarterTurnPeriodV2, validateSpatialPrimitiveLibraryV2 } from "./primitive-validator";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function buildSpatialPrimitiveLibraryV2ReviewExport() {
  const validation = validateSpatialPrimitiveLibraryV2();
  return {
    schemaVersion: "1.2",
    familyCode: "SPA-001",
    foundationCode: "SPA-FND-001",
    authorityVersion: "2.0",
    primitiveCount: SPATIAL_PRIMITIVE_AUTHORITY_V2.length,
    validation: {
      status: validation.ok ? "PASS" : "FAIL",
      errorCount: validation.errors.length,
      uniqueSceneFingerprintCount: validation.uniqueSceneFingerprintCount,
      errors: validation.errors,
    },
    categoryCounts: Object.fromEntries(
      ["CLOSED_SHAPE", "OPEN_FIGURE", "LINE_STRUCTURE", "PARTITIONED_FIGURE", "INTERNAL_SYMBOL"].map((category) => [
        category,
        SPATIAL_PRIMITIVE_AUTHORITY_V2.filter((entry) => entry.category === category).length,
      ]),
    ),
    rows: SPATIAL_PRIMITIVE_AUTHORITY_V2.map((entry) => {
      const connectivity = getSpatialPrimitiveConnectivityV2(entry.primitiveId);
      return {
        primitiveId: entry.primitiveId,
        label: entry.label,
        category: entry.category,
        topology: entry.topology,
        polygonSideCount: entry.polygonSideCount,
        enclosedRegionCount: entry.enclosedRegionCount,
        junctionCount: connectivity.junctionCount,
        crossingCount: connectivity.crossingCount,
        terminalCount: connectivity.terminalCount,
        orientationSensitive: entry.orientationSensitive,
        standardAxisReflectionSensitive: entry.reflectionSensitive,
        rotationPeriodQuarterTurns: deriveSpatialPrimitiveQuarterTurnPeriodV2(entry),
        symmetry: entry.symmetry,
        canContainInner: entry.canContainInner,
        supportsFill: entry.supportsFill,
        usageRoles: entry.usageRoles,
        examTags: entry.examTags,
        svg: renderSpatialSceneToSvg(entry.canonicalScene, {
          ariaLabel: `${entry.label} spatial primitive`,
        }),
      };
    }),
  };
}

export function buildSpatialPrimitiveLibraryV2ReviewHtml(
  review: ReturnType<typeof buildSpatialPrimitiveLibraryV2ReviewExport>,
): string {
  const cards = review.rows.map((row) => `
    <article class="card">
      <div class="figure">${row.svg}</div>
      <h2>${escapeHtml(row.label)}</h2>
      <div class="id">${escapeHtml(row.primitiveId)}</div>
      <dl>
        <dt>Category</dt><dd>${escapeHtml(row.category)}</dd>
        <dt>Topology</dt><dd>${escapeHtml(row.topology)}</dd>
        <dt>Sides</dt><dd>${row.polygonSideCount ?? "—"}</dd>
        <dt>Regions</dt><dd>${row.enclosedRegionCount}</dd>
        <dt>Branch junctions</dt><dd>${row.junctionCount}</dd>
        <dt>True crossings</dt><dd>${row.crossingCount}</dd>
        <dt>Free terminals</dt><dd>${row.terminalCount}</dd>
        <dt>Quarter-turn period</dt><dd>${row.rotationPeriodQuarterTurns}</dd>
        <dt>Symmetry</dt><dd>V:${row.symmetry.vertical ? "Y" : "N"} H:${row.symmetry.horizontal ? "Y" : "N"} 180:${row.symmetry.rotational180 ? "Y" : "N"}</dd>
      </dl>
      <div class="tags">${row.examTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    </article>`).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SPA-FND-001 Primitive Library V2 Review</title>
<style>
body{font-family:Arial,sans-serif;margin:24px;color:#111;background:#fff}header{max-width:1100px;margin:0 auto 24px}.summary{padding:12px 16px;border:1px solid #bbb;border-radius:8px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;max-width:1200px;margin:auto}.card{border:1px solid #ccc;border-radius:10px;padding:14px;background:#fff}.figure{height:150px;display:flex;align-items:center;justify-content:center}.figure svg{width:140px;height:140px;color:#111}.card h2{font-size:17px;margin:8px 0 3px}.id{font:12px monospace;color:#555;word-break:break-word}dl{display:grid;grid-template-columns:1fr 1fr;font-size:12px;gap:4px 8px}dt{font-weight:700}dd{margin:0}.tags{display:flex;flex-wrap:wrap;gap:4px}.tags span{font-size:11px;border:1px solid #bbb;border-radius:10px;padding:2px 6px}@media(max-width:480px){body{margin:12px}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.card{padding:8px}.figure{height:105px}.figure svg{width:100px;height:100px}.card h2{font-size:14px}dl{grid-template-columns:1fr;font-size:11px}.tags{display:none}}
</style></head><body>
<header><h1>SPA-FND-001 Spatial Primitive Library V2</h1><div class="summary"><strong>Validation:</strong> ${review.validation.status} &nbsp; <strong>Primitives:</strong> ${review.primitiveCount} &nbsp; <strong>Unique scenes:</strong> ${review.validation.uniqueSceneFingerprintCount}<br>Closed 9 · Open 7 · Line 7 · Partitioned 5 · Internal symbols 5</div></header>
<main class="grid">${cards}</main></body></html>`;
}
