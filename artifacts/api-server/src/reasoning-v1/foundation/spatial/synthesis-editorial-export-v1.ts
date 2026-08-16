import { createHash } from "node:crypto";
import type { SpatialPrimitiveClassificationQuestionV2 } from "./primitive-classification-v2";
import type { SpatialPrimitiveRetrofitQuestionV2 } from "./primitive-retrofit-proof";
import { renderSpatialSceneToSvg } from "./svg-renderer";
import type { SpatialSeriesProofQuestion } from "./series-types";
import type {
  SpatialProductionSynthesisBatchResultV1,
  SpatialSynthesisCandidateV1,
  SpatialSynthesisChapterV1,
} from "./synthesis-types-v1";

export interface SpatialSynthesisReviewSampleV1 {
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

export interface SpatialSynthesisEditorialReviewV1 {
  version: "SPA-FND-001-PRODUCTION-SYNTHESIS-V1-REVIEW";
  seedPrefix: string;
  totalAccepted: number;
  chapterSummaries: Record<
    SpatialSynthesisChapterV1,
    {
      accepted: number;
      attempts: number;
      rejected: number;
      rejectionCounts: Record<string, number>;
      correctSlotCounts: [number, number, number, number];
      familyCounts: Record<string, number>;
      uniqueContentFingerprints: number;
    }
  >;
  sampleCount: number;
  samples: SpatialSynthesisReviewSampleV1[];
  lifecycle: SpatialProductionSynthesisBatchResultV1["lifecycle"];
}

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function sampleFromCandidate(candidate: SpatialSynthesisCandidateV1): SpatialSynthesisReviewSampleV1 {
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
      optionSvgs: payload.optionScenes.map((scene) => renderSpatialSceneToSvg(scene)),
    };
  }

  if (candidate.chapterCode === "FCL-001") {
    const payload = candidate.payload as SpatialPrimitiveClassificationQuestionV2;
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
      optionSvgs: payload.optionScenes.map((scene) => renderSpatialSceneToSvg(scene)),
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
    stimulusSvgs: payload.seriesScenes.map((scene) => renderSpatialSceneToSvg(scene)),
    optionSvgs: payload.options.map((option) => renderSpatialSceneToSvg(option.scene)),
  };
}

export function buildSpatialSynthesisEditorialReviewV1(
  batch: SpatialProductionSynthesisBatchResultV1,
): SpatialSynthesisEditorialReviewV1 {
  const chapterCodes: readonly SpatialSynthesisChapterV1[] = ["FAN-001", "FCL-001", "FSR-001"];
  const samples: SpatialSynthesisReviewSampleV1[] = [];
  for (const chapterCode of chapterCodes) {
    const seenFamilies = new Set<string>();
    for (const candidate of batch.chapters[chapterCode].accepted) {
      if (seenFamilies.has(candidate.familyId)) continue;
      seenFamilies.add(candidate.familyId);
      samples.push(sampleFromCandidate(candidate));
    }
  }

  const chapterSummaries = Object.fromEntries(
    chapterCodes.map((chapterCode) => {
      const result = batch.chapters[chapterCode];
      return [
        chapterCode,
        {
          accepted: result.accepted.length,
          attempts: result.attempts.length,
          rejected: result.attempts.filter((attempt) => attempt.status === "REJECTED").length,
          rejectionCounts: { ...result.rejectionCounts },
          correctSlotCounts: [...result.correctSlotCounts] as [number, number, number, number],
          familyCounts: { ...result.familyCounts },
          uniqueContentFingerprints: new Set(result.accepted.map((candidate) => candidate.contentFingerprint)).size,
        },
      ];
    }),
  ) as SpatialSynthesisEditorialReviewV1["chapterSummaries"];

  return {
    version: "SPA-FND-001-PRODUCTION-SYNTHESIS-V1-REVIEW",
    seedPrefix: batch.seedPrefix,
    totalAccepted: batch.totalAccepted,
    chapterSummaries,
    sampleCount: samples.length,
    samples,
    lifecycle: { ...batch.lifecycle },
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function svgStrip(svgs: readonly string[], prefix: string): string {
  return `<div class="strip">${svgs
    .map((svg, index) => `<div class="figure"><div class="cap">${escapeHtml(prefix)} ${index + 1}</div>${svg}</div>`)
    .join("")}</div>`;
}

export function buildSpatialSynthesisEditorialReviewHtmlV1(
  review: SpatialSynthesisEditorialReviewV1,
): string {
  const summaryRows = (Object.entries(review.chapterSummaries) as [SpatialSynthesisChapterV1, SpatialSynthesisEditorialReviewV1["chapterSummaries"][SpatialSynthesisChapterV1]][])
    .map(([chapter, summary]) => `<tr><td>${chapter}</td><td>${summary.accepted}</td><td>${summary.attempts}</td><td>${summary.rejected}</td><td>${summary.correctSlotCounts.join(" / ")}</td><td>${summary.uniqueContentFingerprints}</td></tr>`)
    .join("");
  const cards = review.samples
    .map((sample, index) => `
      <article class="card">
        <h2>${index + 1}. ${escapeHtml(sample.chapterCode)} — ${escapeHtml(sample.familyId)}</h2>
        <div class="meta">Correct: <strong>${sample.correctOption}</strong> · Seed: ${escapeHtml(sample.seed)}<br>Content: ${sample.contentDigest.slice(0, 16)}… · Delivery: ${sample.deliveryDigest.slice(0, 16)}…</div>
        <p><strong>Rule:</strong> ${escapeHtml(sample.title)}</p>
        ${sample.stimulusSvgs.length ? `<h3>Observed / analogy figures</h3>${svgStrip(sample.stimulusSvgs, "Frame")}` : ""}
        <h3>Options</h3>${svgStrip(sample.optionSvgs, "Option")}
        <p class="note">${escapeHtml(sample.note)}</p>
      </article>`)
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SPA Production Synthesis V1 Review</title>
<style>
body{font-family:Arial,sans-serif;margin:0;background:#f4f5f7;color:#171717}main{max-width:1180px;margin:auto;padding:24px}h1{margin:0 0 8px}table{border-collapse:collapse;width:100%;background:white;margin:18px 0 28px}th,td{border:1px solid #ddd;padding:9px;text-align:left}.card{background:white;border:1px solid #d8d8d8;border-radius:10px;padding:16px;margin:0 0 18px}.meta,.note{font-size:13px;color:#555}.strip{display:flex;flex-wrap:wrap;gap:10px}.figure{width:116px;border:1px solid #ddd;border-radius:8px;padding:5px;text-align:center;background:#fff}.figure svg{display:block;width:100%;height:auto}.cap{font-size:11px;color:#666;margin-bottom:3px}@media(max-width:520px){main{padding:10px}.figure{width:74px}.card{padding:10px}th,td{font-size:11px;padding:5px}}
</style></head><body><main>
<h1>SPA-FND-001 Production Synthesis V1</h1>
<p>Seed prefix: <code>${escapeHtml(review.seedPrefix)}</code> · Accepted candidates: ${review.totalAccepted} · Representative families shown: ${review.sampleCount}</p>
<table><thead><tr><th>Chapter</th><th>Accepted</th><th>Attempts</th><th>Rejected</th><th>A / B / C / D</th><th>Unique content</th></tr></thead><tbody>${summaryRows}</tbody></table>
${cards}
</main></body></html>`;
}
