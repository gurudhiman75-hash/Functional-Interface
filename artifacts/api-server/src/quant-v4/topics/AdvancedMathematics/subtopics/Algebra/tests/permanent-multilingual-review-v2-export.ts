import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ALG_MULTILINGUAL_REVIEW_V2_ID,
  ALG_PERMANENT_ALLOCATION,
  generateAlgPermanentEnglishV3Frozen,
  generateAlgPermanentMultilingualReviewV2,
  getAlgPermanentPrototypeIds,
} from "../permanent";

function esc(value: unknown): string {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function jsonText(value: unknown): string {
  return JSON.stringify(value, (_key, nested) => typeof nested === "bigint" ? nested.toString() : nested, 2);
}
function answerText(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (["string", "number", "boolean"].includes(typeof value)) return String(value);
  if (typeof value === "object" && "text" in value! && typeof (value as { text?: unknown }).text === "string") return (value as { text: string }).text;
  return jsonText(value);
}
function steps(text: string): string {
  return text.split(/\n+/).map((line) => line.trim()).filter(Boolean).map((line) => `<div class="step">${esc(line)}</div>`).join("");
}

const rows = ALG_PERMANENT_ALLOCATION.flatMap((allocation, allocationIndex) => {
  const variants = getAlgPermanentPrototypeIds(allocation.qlId);
  return variants.map((_id, variantIndex) => {
    const seed = 101 + allocationIndex * 17 + variantIndex * 7;
    const en = generateAlgPermanentEnglishV3Frozen(allocation.qlId, seed, variantIndex);
    const hi = generateAlgPermanentMultilingualReviewV2(allocation.qlId, seed, "hi-IN", variantIndex);
    const pa = generateAlgPermanentMultilingualReviewV2(allocation.qlId, seed, "pa-IN", variantIndex);
    return { en, hi, pa };
  });
});
if (rows.length !== 109) throw new Error(`Expected 109 multilingual V2 rows, got ${rows.length}`);

const cards = rows.map(({ en, hi, pa }, index) => `<article class="q">
<header><strong>Q${index + 1} · ${esc(en.qlId)} · ${esc(en.prototypeId)}</strong><span>${esc(en.packageId)} / ${esc(en.cpId)} · seed ${en.seed}</span></header>
<div class="answer"><b>Answer:</b> ${esc(answerText(en.canonicalAnswer))}</div>
<section lang="en"><h3>English · Frozen authority</h3><p class="stem">${esc(en.question)}</p><div class="steps">${steps(en.explanation)}</div></section>
<section lang="hi"><h3>हिन्दी · V2 editorial candidate</h3><p class="stem">${esc(hi.question)}</p><div class="steps">${steps(hi.explanation)}</div></section>
<section lang="pa"><h3>ਪੰਜਾਬੀ · V2 editorial candidate</h3><p class="stem">${esc(pa.question)}</p><div class="steps">${steps(pa.explanation)}</div></section>
</article>`).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Algebra Hindi Punjabi V2 Review</title><style>
body{font-family:system-ui,-apple-system,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;background:#f5f5f5;color:#171717;margin:0}.wrap{max-width:1120px;margin:auto;padding:20px 12px 56px}.top,.q{background:#fff;border:1px solid #ddd;border-radius:12px;padding:16px;margin:14px 0}.q header{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;border-bottom:1px solid #eee;padding-bottom:9px}.q section{border-top:1px solid #eee;margin-top:12px;padding-top:8px}.stem{font-size:17px;line-height:1.65;white-space:pre-wrap}.steps{display:grid;gap:6px}.step{padding:7px 9px;background:#fafafa;border-left:3px solid #ddd;line-height:1.58;white-space:pre-wrap}.answer{margin-top:9px}.lock{font-weight:650}.pill{display:inline-block;border:1px solid #ccc;border-radius:999px;padding:4px 8px;margin:2px;font-size:12px}</style></head><body><main class="wrap"><section class="top"><h1>Algebra · Hindi + Punjabi Editorial V2</h1><p>Every card is anchored to the frozen English V3 item. V2 adds family-aware learner prose and is audited to reject residual English prose while preserving mathematical notation.</p><p class="lock">Multilingual content is NOT frozen. Question Studio, Question Bank, mocks/tests and publication remain locked.</p><span class="pill">${ALG_MULTILINGUAL_REVIEW_V2_ID}</span><span class="pill">43 QLs</span><span class="pill">109 variants</span><span class="pill">2 locales</span></section>${cards}</main></body></html>`;

const dir = resolve(process.cwd(), "dist/quant-v4/algebra");
mkdirSync(dir, { recursive: true });
const htmlPath = resolve(dir, "algebra-permanent-multilingual-review-v2-109q.html");
const jsonPath = resolve(dir, "algebra-permanent-multilingual-review-v2-109q.json");
writeFileSync(htmlPath, html, "utf8");
writeFileSync(jsonPath, jsonText({
  status: "ALGEBRA_MULTILINGUAL_REVIEW_CANDIDATE_V2",
  localizationReviewId: ALG_MULTILINGUAL_REVIEW_V2_ID,
  permanentQlCount: ALG_PERMANENT_ALLOCATION.length,
  mappedVariantCount: rows.length,
  locales: ["hi-IN", "pa-IN"],
  lifecycle: { englishV3Frozen: true, multilingualFrozen: false, active: false, questionStudioDiscoverable: false, questionBankWritable: false, testEligible: false, publiclyPublishable: false },
  questions: rows.map(({ en, hi, pa }, index) => ({ ordinal: index + 1, qlId: en.qlId, packageId: en.packageId, cpId: en.cpId, prototypeId: en.prototypeId, prototypeSolveMode: en.prototypeSolveMode, variantIndex: en.variantIndex, seed: en.seed, canonicalAnswer: en.canonicalAnswer, en: { question: en.question, explanation: en.explanation }, hi: { question: hi.question, explanation: hi.explanation }, pa: { question: pa.question, explanation: pa.explanation } })),
}), "utf8");
console.log(JSON.stringify({ status: "PASS_ALGEBRA_MULTILINGUAL_REVIEW_V2_EXPORT", htmlPath, jsonPath, rows: rows.length }, null, 2));
