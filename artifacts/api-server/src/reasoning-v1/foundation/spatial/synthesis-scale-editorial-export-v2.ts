import { createHash } from "node:crypto";
import type { SpatialPrimitiveRetrofitQuestionV2 } from "./primitive-retrofit-proof";
import type { SpatialSeriesProofQuestion } from "./series-types";
import { renderSpatialSceneToSvg } from "./svg-renderer";
import type { SpatialSynthesisChapterV1 } from "./synthesis-types-v1";
import type {
  SpatialFclInstanceQuestionV2,
  SpatialProductionScaleBatchResultV2,
  SpatialProductionScaleCandidateV2,
} from "./synthesis-types-v2";

export interface SpatialScaleReviewSampleV2 {
  chapterCode: SpatialSynthesisChapterV1;
  familyId: string;
  seed: string;
  correctOption: string;
  contentDigest: string;
  deliveryDigest: string;
  title: string;
  note: string;
  stimulusSvgs: string[];
  optionSvgs: string[];
}

export interface SpatialScaleEditorialReviewV2 {
  version: "SPA-FND-001-PRODUCTION-SCALE-V2-REVIEW";
  seedPrefix: string;
  totalAccepted: number;
  requestedPerChapter: number;
  fclCanonicalCatalogCapacity: number;
  fclInstanceCatalogCapacity: number;
  chapterSummaries: Record<SpatialSynthesisChapterV1, {
    accepted: number;
    attempts: number;
    duplicateRejects: number;
    generatorRejects: number;
    correctSlotCounts: [number, number, number, number];
    familyCounts: Record<string, number>;
    uniqueContentFingerprints: number;
  }>;
  sampleCount: number;
  samples: SpatialScaleReviewSampleV2[];
  lifecycle: SpatialProductionScaleBatchResultV2["lifecycle"];
}

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function sampleFromCandidate(candidate: SpatialProductionScaleCandidateV2): SpatialScaleReviewSampleV2 {
  if (candidate.chapterCode === "FAN-001") {
    const payload = candidate.payload as SpatialPrimitiveRetrofitQuestionV2;
    return {
      chapterCode: candidate.chapterCode,
      familyId: candidate.familyId,
      seed: candidate.seed,
      correctOption: optionLetter(candidate.correctOptionIndex),
      contentDigest: digest(candidate.contentFingerprint),
      deliveryDigest: digest(candidate.deliveryFingerprint),
      title: `${payload.sourcePrimitiveId} → ${payload.transform} :: ${payload.analogyTargetPrimitiveId ?? "target"} → ?`,
      note: "Apply the same complete visible transformation from A→B to C.",
      stimulusSvgs: [
        renderSpatialSceneToSvg(payload.sourceScene),
        renderSpatialSceneToSvg(payload.pairResultScene!),
        renderSpatialSceneToSvg(payload.targetScene!),
      ],
      optionSvgs: payload.optionScenes.map(renderSpatialSceneToSvg),
    };
  }
  if (candidate.chapterCode === "FCL-001") {
    const payload = candidate.payload as SpatialFclInstanceQuestionV2;
    return {
      chapterCode: candidate.chapterCode,
      familyId: candidate.familyId,
      seed: candidate.seed,
      correctOption: optionLetter(candidate.correctOptionIndex),
      contentDigest: digest(candidate.contentFingerprint),
      deliveryDigest: digest(candidate.deliveryFingerprint),
      title: payload.propertyDescription,
      note: payload.learnerExplanation.check,
      stimulusSvgs: [],
      optionSvgs: payload.optionScenes.map(renderSpatialSceneToSvg),
    };
  }
  const payload = candidate.payload as SpatialSeriesProofQuestion;
  return {
    chapterCode: candidate.chapterCode,
    familyId: candidate.familyId,
    seed: candidate.seed,
    correctOption: optionLetter(candidate.correctOptionIndex),
    contentDigest: digest(candidate.contentFingerprint),
    deliveryDigest: digest(candidate.deliveryFingerprint),
    title: payload.learnerExplanation.rule,
    note: payload.learnerExplanation.application,
    stimulusSvgs: payload.seriesScenes.map(renderSpatialSceneToSvg),
    optionSvgs: payload.options.map((option) => renderSpatialSceneToSvg(option.scene)),
  };
}

export function buildSpatialScaleEditorialReviewV2(batch: SpatialProductionScaleBatchResultV2): SpatialScaleEditorialReviewV2 {
  const chapterCodes: readonly SpatialSynthesisChapterV1[] = ["FAN-001", "FCL-001", "FSR-001"];
  const samples: SpatialScaleReviewSampleV2[] = [];
  for (const chapterCode of chapterCodes) {
    const seenFamilies = new Set<string>();
    for (const candidate of batch.chapters[chapterCode].accepted) {
      if (seenFamilies.has(candidate.familyId)) continue;
      seenFamilies.add(candidate.familyId);
      samples.push(sampleFromCandidate(candidate));
    }
  }
  const chapterSummaries = Object.fromEntries(chapterCodes.map((chapterCode) => {
    const result = batch.chapters[chapterCode];
    return [chapterCode, {
      accepted: result.accepted.length,
      attempts: result.attempts,
      duplicateRejects: result.duplicateRejects,
      generatorRejects: result.generatorRejects,
      correctSlotCounts: [...result.correctSlotCounts] as [number, number, number, number],
      familyCounts: { ...result.familyCounts },
      uniqueContentFingerprints: new Set(result.accepted.map((candidate) => candidate.contentFingerprint)).size,
    }];
  })) as SpatialScaleEditorialReviewV2["chapterSummaries"];
  return {
    version: "SPA-FND-001-PRODUCTION-SCALE-V2-REVIEW",
    seedPrefix: batch.seedPrefix,
    totalAccepted: batch.totalAccepted,
    requestedPerChapter: batch.requestedPerChapter,
    fclCanonicalCatalogCapacity: batch.fclCanonicalCatalogCapacity,
    fclInstanceCatalogCapacity: batch.fclInstanceCatalogCapacity,
    chapterSummaries,
    sampleCount: samples.length,
    samples,
    lifecycle: { ...batch.lifecycle },
  };
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function svgStrip(svgs: readonly string[], prefix: string): string {
  return `<div class="strip">${svgs.map((svg, index) => `<div class="figure"><div class="cap">${escapeHtml(prefix)} ${index + 1}</div>${svg}</div>`).join("")}</div>`;
}

export function buildSpatialScaleEditorialReviewHtmlV2(review: SpatialScaleEditorialReviewV2): string {
  const rows = (Object.entries(review.chapterSummaries) as [SpatialSynthesisChapterV1, SpatialScaleEditorialReviewV2["chapterSummaries"][SpatialSynthesisChapterV1]][])
    .map(([chapter, summary]) => `<tr><td>${chapter}</td><td>${summary.accepted}</td><td>${summary.attempts}</td><td>${summary.duplicateRejects}</td><td>${summary.generatorRejects}</td><td>${summary.correctSlotCounts.join(" / ")}</td><td>${summary.uniqueContentFingerprints}</td></tr>`)
    .join("");
  const cards = review.samples.map((sample, index) => `<article class="card"><h2>${index + 1}. ${escapeHtml(sample.chapterCode)} — ${escapeHtml(sample.familyId)}</h2><div class="meta">Correct: <strong>${sample.correctOption}</strong> · ${sample.contentDigest.slice(0,16)}…</div><p><strong>Rule:</strong> ${escapeHtml(sample.title)}</p>${sample.stimulusSvgs.length ? `<h3>Stimulus</h3>${svgStrip(sample.stimulusSvgs, "Frame")}` : ""}<h3>Options</h3>${svgStrip(sample.optionSvgs, "Option")}<p class="note">${escapeHtml(sample.note)}</p></article>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SPA Production Scale V2 Review</title><style>body{font-family:Arial,sans-serif;margin:0;background:#f4f5f7;color:#171717}main{max-width:1180px;margin:auto;padding:24px}table{border-collapse:collapse;width:100%;background:#fff;margin:18px 0 28px}th,td{border:1px solid #ddd;padding:8px;text-align:left}.card{background:#fff;border:1px solid #d8d8d8;border-radius:10px;padding:16px;margin:0 0 18px}.meta,.note{font-size:13px;color:#555}.strip{display:flex;flex-wrap:wrap;gap:10px}.figure{width:116px;border:1px solid #ddd;border-radius:8px;padding:5px;text-align:center;background:#fff}.figure svg{display:block;width:100%;height:auto}.cap{font-size:11px;color:#666}@media(max-width:520px){main{padding:10px}.figure{width:74px}.card{padding:10px}th,td{font-size:11px;padding:5px}}</style></head><body><main><h1>SPA-FND-001 Production Scale V2</h1><p>Accepted: ${review.totalAccepted} · ${review.requestedPerChapter}/chapter · FCL canonical capacity: ${review.fclCanonicalCatalogCapacity} · instance/global-rotation-normalized capacity: ${review.fclInstanceCatalogCapacity}</p><table><thead><tr><th>Chapter</th><th>Accepted</th><th>Attempts</th><th>Dup</th><th>Generator</th><th>A/B/C/D</th><th>Unique</th></tr></thead><tbody>${rows}</tbody></table>${cards}</main></body></html>`;
}
