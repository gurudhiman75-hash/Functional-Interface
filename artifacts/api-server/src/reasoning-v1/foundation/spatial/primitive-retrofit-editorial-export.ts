import { renderSpatialSceneToSvg } from "./svg-renderer";
import {
  buildSpatialPrimitiveFanRetrofitProofV2,
  buildSpatialPrimitiveMirrorWaterRetrofitProofV2,
  type SpatialPrimitiveRetrofitQuestionV2,
} from "./primitive-retrofit-proof";
import {
  buildSpatialPrimitiveClassificationProofV2,
  type SpatialPrimitiveClassificationQuestionV2,
} from "./primitive-classification-v2";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function sceneFigure(scene: Parameters<typeof renderSpatialSceneToSvg>[0], label: string): string {
  return `<div class="figure"><div class="figure-label">${escapeHtml(label)}</div>${renderSpatialSceneToSvg(scene, { ariaLabel: label })}</div>`;
}

function retrofitCard(question: SpatialPrimitiveRetrofitQuestionV2): string {
  const source = sceneFigure(question.sourceScene, question.chapterCode === "FAN-001" ? "A" : "Question figure");
  const pair = question.pairResultScene ? sceneFigure(question.pairResultScene, "B") : "";
  const target = question.targetScene ? sceneFigure(question.targetScene, "C") : "";
  const options = question.optionScenes.map((scene, index) =>
    `<div class="option ${index === question.correctOptionIndex ? "correct" : ""}">${sceneFigure(scene, String.fromCharCode(65 + index))}<div class="small">${escapeHtml(question.optionLabels[index] ?? "")}</div></div>`,
  ).join("");
  return `<article class="question"><h2>${escapeHtml(question.prototypeId)}</h2><div class="rule">${escapeHtml(question.transform)} · primitive ${escapeHtml(question.sourcePrimitiveId)}</div><div class="stimuli">${source}${pair}${target}</div><div class="options">${options}</div></article>`;
}

function classificationCard(question: SpatialPrimitiveClassificationQuestionV2): string {
  const options = question.optionScenes.map((scene, index) =>
    `<div class="option ${index === question.correctOptionIndex ? "correct" : ""}">${sceneFigure(scene, String.fromCharCode(65 + index))}<div class="small">${escapeHtml(question.primitiveIds[index] ?? "")}</div></div>`,
  ).join("");
  return `<article class="question"><h2>${escapeHtml(question.prototypeId)}</h2><div class="rule">${escapeHtml(question.propertyDescription)}</div><div class="options">${options}</div><div class="explanation"><strong>Application:</strong> ${escapeHtml(question.learnerExplanation.application)}<br><strong>Ambiguity audit:</strong> no competing 3-to-1 descriptor; reinforcing: ${escapeHtml(question.reinforcingDescriptorIds.join(", ") || "none")}</div></article>`;
}

export function buildSpatialPrimitiveRetrofitFclV2ReviewExport() {
  const mirrorWater = buildSpatialPrimitiveMirrorWaterRetrofitProofV2();
  const fan = buildSpatialPrimitiveFanRetrofitProofV2();
  const fcl = buildSpatialPrimitiveClassificationProofV2();
  return {
    schemaVersion: "1.0",
    familyCode: "SPA-001",
    foundationCode: "SPA-FND-001",
    mirrorEnhancementCount: mirrorWater.filter((question) => question.chapterCode === "MIR-001").length,
    waterEnhancementCount: mirrorWater.filter((question) => question.chapterCode === "WAT-001").length,
    fanEnhancementCount: fan.length,
    legacyFclPrototypeCount: 8,
    primitiveFclPrototypeCount: fcl.length,
    totalFclPrototypeFamilies: 8 + fcl.length,
    mirrorWater,
    fan,
    fcl,
  };
}

export function buildSpatialPrimitiveRetrofitFclV2ReviewHtml(
  review: ReturnType<typeof buildSpatialPrimitiveRetrofitFclV2ReviewExport>,
): string {
  const mirror = review.mirrorWater.filter((question) => question.chapterCode === "MIR-001").map(retrofitCard).join("");
  const water = review.mirrorWater.filter((question) => question.chapterCode === "WAT-001").map(retrofitCard).join("");
  const fan = review.fan.map(retrofitCard).join("");
  const fcl = review.fcl.map(classificationCard).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SPA Primitive Retrofit + FCL V2 Review</title><style>
body{font-family:Arial,sans-serif;margin:20px;color:#111;background:#fff}h1{margin-bottom:6px}h2{font-size:17px;margin:0 0 5px}.summary{border:1px solid #aaa;border-radius:8px;padding:12px;margin:12px 0 24px;max-width:1100px}.section{max-width:1200px;margin:0 auto 34px}.question{border:1px solid #bbb;border-radius:10px;padding:12px;margin:12px 0;break-inside:avoid}.rule{font-size:13px;margin-bottom:8px}.stimuli,.options{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start}.figure{width:118px;text-align:center}.figure svg{width:108px;height:108px;color:#111}.figure-label{font-weight:700;font-size:12px}.option{border:1px solid #ddd;border-radius:7px;padding:4px}.option.correct{border:2px solid #111}.small{font:10px monospace;text-align:center;max-width:120px;overflow-wrap:anywhere}.explanation{font-size:12px;margin-top:8px;line-height:1.45}@media(max-width:480px){body{margin:8px}.question{padding:8px}.figure{width:88px}.figure svg{width:80px;height:80px}.options,.stimuli{gap:5px}.small{font-size:9px}}
</style></head><body><h1>SPA-FND-001 Primitive Retrofit + FCL V2</h1><div class="summary">Mirror V2 examples: <strong>${review.mirrorEnhancementCount}</strong> · Water V2 examples: <strong>${review.waterEnhancementCount}</strong> · FAN V2 examples: <strong>${review.fanEnhancementCount}</strong> · FCL legacy families: <strong>${review.legacyFclPrototypeCount}</strong> · FCL primitive-native families: <strong>${review.primitiveFclPrototypeCount}</strong> · FCL total prototype families: <strong>${review.totalFclPrototypeFamilies}</strong></div><section class="section"><h1>MIR-001 enhancement</h1>${mirror}</section><section class="section"><h1>WAT-001 enhancement</h1>${water}</section><section class="section"><h1>FAN-001 enhancement</h1>${fan}</section><section class="section"><h1>FCL-001 V2 expansion</h1>${fcl}</section></body></html>`;
}
