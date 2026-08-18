import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import { generateIopLocalizedReviewCaseletV1, type IopLocalizedCaselet, type IopLocalizedLocale } from "./localization-v1-final.ts";

const outputDir = process.env.IOP_LOCALIZATION_REVIEW_OUTPUT_DIR ?? "/tmp/iop-localization-review";
const examplesPerMode = Number(process.env.IOP_LOCALIZATION_REVIEW_EXAMPLES_PER_MODE ?? 2);
const locales: readonly IopLocalizedLocale[] = ["hi-IN", "pa-IN"] as const;

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function renderRow(values: readonly string[]): string { return esc(values.join("  ")); }
function localeName(locale: IopLocalizedLocale): string { return locale === "hi-IN" ? "हिन्दी" : "ਪੰਜਾਬੀ"; }
function inputLabel(locale: IopLocalizedLocale): string { return locale === "hi-IN" ? "इनपुट" : "ਇਨਪੁੱਟ"; }
function stepLabel(locale: IopLocalizedLocale): string { return locale === "hi-IN" ? "चरण" : "ਪੜਾਅ"; }
function newInputLabel(locale: IopLocalizedLocale): string { return locale === "hi-IN" ? "नया इनपुट" : "ਨਵਾਂ ਇਨਪੁੱਟ"; }
function answerLabel(locale: IopLocalizedLocale): string { return locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ"; }
function solutionLabel(locale: IopLocalizedLocale): string { return locale === "hi-IN" ? "हल" : "ਹੱਲ"; }

function renderCaselet(caselet: IopLocalizedCaselet, index: number): string {
  const worked = [
    `<div class="trace"><b>${inputLabel(caselet.locale)}:</b> ${renderRow(caselet.demonstration.input)}</div>`,
    ...caselet.demonstration.steps.map((values, i) => `<div class="trace"><b>${stepLabel(caselet.locale)} ${i + 1}:</b> ${renderRow(values)}</div>`),
  ].join("");
  const questions = caselet.children.map((child) => {
    const options = child.options.map((option, i) => `<div class="option"><b>${String.fromCharCode(65 + i)}.</b> ${esc(option.display)}</div>`).join("");
    return `<section class="question"><div class="q"><b>Q${child.questionOrder}.</b> ${esc(child.text)}</div><div class="options">${options}</div><div class="solution"><b>${answerLabel(caselet.locale)}:</b> ${String.fromCharCode(65 + child.answerIndex)} — ${esc(child.answerDisplay)}<br><br><b>${solutionLabel(caselet.locale)}:</b><pre>${esc(child.explanation)}</pre></div></section>`;
  }).join("");
  return `<article class="caselet"><div class="head"><b>Example ${index}</b><span>${esc(caselet.difficulty)}</span></div><p>${esc(caselet.directions)}</p><div class="machine">${worked}</div><div class="new"><b>${newInputLabel(caselet.locale)}:</b> ${renderRow(caselet.target.input)}</div>${questions}<details><summary>Technical audit details</summary><p>QL ${esc(caselet.qlId)} · ${esc(caselet.sourceModeId)} · ${esc(caselet.seed)}</p></details></article>`;
}

const caselets: IopLocalizedCaselet[] = [];
for (const locale of locales) {
  for (const mode of IOP_ENGLISH_SOURCE_MODES) {
    for (let example = 0; example < examplesPerMode; example += 1) {
      const seed = `IOP-EN-REVIEW-${mode.sourceModeId}-${String(example).padStart(2, "0")}`;
      caselets.push(generateIopLocalizedReviewCaseletV1(seed, mode.qlId, mode.sourceModeId, locale));
    }
  }
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "IOP-001-HI-PA-REVIEW.json"), JSON.stringify({
  packageId: "IOP-001",
  status: "LOCALIZATION_REVIEW_CANDIDATE_V1",
  englishFreeze: true,
  examplesPerMode,
  sourceModeCount: IOP_ENGLISH_SOURCE_MODES.length,
  locales,
  caselets,
}, null, 2));

const languageSections = locales.map((locale) => {
  const filtered = caselets.filter((caselet) => caselet.locale === locale);
  const note = locale === "hi-IN"
    ? "प्रश्न और हल सरल, स्वाभाविक और परीक्षा-जैसी भाषा में लिखे गए हैं। मशीन के मूल शब्द और संख्याएँ नहीं बदली गई हैं।"
    : "ਪ੍ਰਸ਼ਨ ਅਤੇ ਹੱਲ ਸਧਾਰਨ, ਕੁਦਰਤੀ ਅਤੇ ਪ੍ਰੀਖਿਆ ਵਰਗੀ ਭਾਸ਼ਾ ਵਿੱਚ ਲਿਖੇ ਗਏ ਹਨ। ਮਸ਼ੀਨ ਦੇ ਮੂਲ ਸ਼ਬਦ ਅਤੇ ਸੰਖਿਆਵਾਂ ਨਹੀਂ ਬਦਲੀਆਂ ਗਈਆਂ।";
  return `<section><h1>${localeName(locale)} Review</h1><div class="note">${esc(note)}</div>${filtered.map((caselet, i) => renderCaselet(caselet, i + 1)).join("")}</section>`;
}).join("");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IOP-001 Hindi Punjabi Review</title><style>body{font-family:system-ui,-apple-system,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;max-width:1050px;margin:auto;padding:24px;background:#f5f6f8;color:#181818;line-height:1.55}.note,.caselet{background:#fff;border:1px solid #ddd;border-radius:10px}.note{padding:14px 16px;margin:12px 0 24px}.caselet{padding:22px;margin:22px 0}.head{display:flex;justify-content:space-between}.machine,.new{background:#f8f8f8;padding:14px;border-radius:7px;margin:14px 0}.new{border:1px solid #bbb}.trace{padding:4px 0}.question{border-top:1px solid #ddd;margin-top:20px;padding-top:18px}.q{font-size:1.03rem}.options{margin:12px 0}.option{padding:5px 8px}.option b{display:inline-block;width:28px}.solution{background:#fafafa;border-left:3px solid #777;padding:13px 15px}.solution pre{white-space:pre-wrap;font:inherit;margin:0}details{margin-top:18px;color:#555;font-size:.9rem}</style></head><body><h1>IOP-001 — Hindi / Punjabi Human Review</h1><p>Frozen English authority → localization review candidate. Product delivery remains off.</p>${languageSections}</body></html>`;
writeFileSync(join(outputDir, "IOP-001-HI-PA-REVIEW.html"), html);

console.log("PASS_IOP_001_LOCALIZATION_REVIEW_EXPORT_FINAL");
console.log(`output ${outputDir}`);
console.log(`caselets ${caselets.length}`);
console.log(`questions ${caselets.reduce((sum, caselet) => sum + caselet.children.length, 0)}`);
