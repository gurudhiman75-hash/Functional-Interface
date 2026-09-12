import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3,
  generateSpatialFinalHeldGapReviewQuestionV3,
} from "../foundation/spatial/spatial-final-held-gap-review-runtime-v3";
import type { SpatialFinalHeldGapLanguageV1, SpatialFinalHeldGapQlIdV1 } from "../foundation/spatial/spatial-final-held-gap-review-runtime-v1";

type Question = ReturnType<typeof generateSpatialFinalHeldGapReviewQuestionV3>;
type ReviewCard = Readonly<{ label: string; question: Question }>;

function esc(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function numericFacts(question: Question): string {
  if ("optionSvgs" in question) {
    return `rotation=${question.solveFacts.displayRotationDegrees}°, correct=${question.answer}, difficulty=${question.difficultyBand}`;
  }
  return `motif=${String(question.solveFacts.motif)}, answer=${question.answer}, difficulty=${question.difficultyBand}`;
}

function renderCard(card: ReviewCard): string {
  const q = card.question;
  const stimulus = q.stimulusSvgs[0];
  const options = "optionSvgs" in q
    ? `<div class="image-options">${q.optionSvgs.map((svg, index) => `<div class="option"><b>${String.fromCharCode(65 + index)}</b>${svg}</div>`).join("")}</div>`
    : `<div class="number-options">${q.options.map((value, index) => `<span class="number-option"><b>${String.fromCharCode(65 + index)}.</b> ${value}</span>`).join("")}</div>`;
  return `<article class="card">
    <div class="meta"><span>${esc(card.label)}</span><span>${esc(q.qlId)} · ${esc(q.language)} · ${esc(numericFacts(q))}</span></div>
    <h3>${esc(q.stem)}</h3>
    <div class="stimulus">${stimulus}</div>
    ${options}
    <div class="solution"><b>Rule:</b> ${esc(q.explanation.rule)}<br/><b>Working:</b> ${q.explanation.working.map(esc).join(" · ")}<br/><b>${esc(q.explanation.answerLine)}</b></div>
  </article>`;
}

function collectMotifs(qlId: "SPA-QL-048" | "SPA-QL-049", expected: readonly string[]): ReviewCard[] {
  const found = new Map<string, ReviewCard>();
  for (let index = 0; index < 600 && found.size < expected.length; index += 1) {
    const question = generateSpatialFinalHeldGapReviewQuestionV3({ qlId, seed: `spa-v3-pack:${qlId}:${index}`, language: "en" });
    if ("optionSvgs" in question) continue;
    const motif = String(question.solveFacts.motif);
    if (!found.has(motif)) found.set(motif, { label: `${qlId} ${motif}`, question });
  }
  const missing = expected.filter((motif) => !found.has(motif));
  if (missing.length) throw new Error(`${qlId} review pack could not cover motifs: ${missing.join(", ")}`);
  return expected.map((motif) => found.get(motif)!);
}

function collectEmbedded(count: number): ReviewCard[] {
  const found = new Map<string, ReviewCard>();
  for (let index = 0; index < 800 && found.size < count; index += 1) {
    const question = generateSpatialFinalHeldGapReviewQuestionV3({ qlId: "SPA-QL-050", seed: `spa-v3-pack:SPA-QL-050:${index}`, language: "en" });
    if (!("optionSvgs" in question)) continue;
    const key = `${question.solveFacts.displayRotationDegrees}:${question.correctIndex}:${question.difficultyBand}`;
    if (!found.has(key)) found.set(key, { label: `SPA-QL-050 rotation ${question.solveFacts.displayRotationDegrees}°`, question });
  }
  if (found.size < count) throw new Error(`QL050 review pack only found ${found.size}/${count} varied surfaces.`);
  return [...found.values()].slice(0, count);
}

function localeCards(): ReviewCard[] {
  const cards: ReviewCard[] = [];
  const qls = ["SPA-QL-048", "SPA-QL-049", "SPA-QL-050"] as const satisfies readonly SpatialFinalHeldGapQlIdV1[];
  const languages = ["hi", "pa"] as const satisfies readonly SpatialFinalHeldGapLanguageV1[];
  for (const language of languages) {
    for (const qlId of qls) {
      for (let index = 0; index < 2; index += 1) {
        cards.push({
          label: `${qlId} ${language.toUpperCase()} locale ${index + 1}`,
          question: generateSpatialFinalHeldGapReviewQuestionV3({ qlId, seed: `spa-v3-pack:locale:${language}:${qlId}:${index}`, language }),
        });
      }
    }
  }
  return cards;
}

const cards: ReviewCard[] = [
  ...collectMotifs("SPA-QL-048", SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.countingFigurePolicy.straightLineMotifs),
  ...collectMotifs("SPA-QL-049", SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.countingFigurePolicy.curvedPrimitiveMotifs),
  ...collectEmbedded(10),
  ...localeCards(),
];

if (cards.length !== 36) throw new Error(`Expected 36 visual-review surfaces, got ${cards.length}.`);

const html = `<!doctype html><html><head><meta charset="utf-8"/><title>SPA Final Held-Gap V3 Review</title><style>
  *{box-sizing:border-box} body{margin:0;padding:28px;background:#f3f4f6;color:#111827;font-family:Arial,Helvetica,sans-serif}
  h1{margin:0 0 6px;font-size:28px} .lead{margin:0 0 24px;color:#4b5563;max-width:1000px;line-height:1.45}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(390px,1fr));gap:18px}.card{background:white;border:1px solid #d1d5db;border-radius:12px;padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
  .meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;padding-bottom:8px}.card h3{font-size:16px;line-height:1.35;margin:12px 0}
  .stimulus{display:flex;justify-content:center;align-items:center;min-height:190px;border:1px solid #e5e7eb;background:white;border-radius:8px;padding:8px;overflow:hidden}.stimulus svg{max-width:100%;height:auto}
  .number-options{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.number-option{border:1px solid #d1d5db;border-radius:7px;padding:8px 10px}
  .image-options{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.option{border:1px solid #d1d5db;border-radius:7px;padding:7px;background:white}.option b{display:block;margin-bottom:4px}.option svg{width:100%;height:auto;max-height:150px}
  .solution{font-size:12px;line-height:1.5;color:#374151;background:#f9fafb;border-radius:7px;padding:10px;margin-top:10px}
</style></head><body><h1>Spatial Final Held-Gap V3 — Direct Visual Review</h1><p class="lead">36 review-only surfaces. V3 replaces schematic grid/primitive-array candidates with exam-real composite motifs for SPA-QL-048/049; SPA-QL-050 remains rotation-allowed and reflection-disallowed. All learner publication gates remain closed.</p><main class="grid">${cards.map(renderCard).join("")}</main></body></html>`;

const manifest = {
  authorityId: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.authorityId,
  status: "V3_VISUAL_REVIEW_PACK_GENERATED",
  surfaceCount: cards.length,
  labels: cards.map((card) => card.label),
  ql048Motifs: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.countingFigurePolicy.straightLineMotifs,
  ql049Motifs: SPATIAL_FINAL_HELD_GAP_REVIEW_RUNTIME_AUTHORITY_V3.countingFigurePolicy.curvedPrimitiveMotifs,
};

const outDir = resolve(process.cwd(), "dist/reasoning-v1/spatial");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "spa-final-held-gap-review-v3.html"), html);
writeFileSync(resolve(outDir, "spa-final-held-gap-review-v3.json"), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest));