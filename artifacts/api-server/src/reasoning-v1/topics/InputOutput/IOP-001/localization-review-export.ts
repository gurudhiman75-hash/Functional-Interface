import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import { generateIopLocalizedReviewCaselet, type IopLocalizedCaselet, type IopLocalizedLocale } from "./localization-v1.ts";

const outputDir = process.env.IOP_LOCALIZATION_REVIEW_OUTPUT_DIR ?? "/tmp/iop-localization-review";
const examplesPerMode = Number(process.env.IOP_LOCALIZATION_REVIEW_EXAMPLES_PER_MODE ?? 2);
const locales: readonly IopLocalizedLocale[] = ["hi-IN", "pa-IN"] as const;

function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function row(values: readonly string[]): string {
  return esc(values.join("  "));
}

function localeName(locale: IopLocalizedLocale): string {
  return locale === "hi-IN" ? "हिन्दी" : "ਪੰਜਾਬੀ";
}

function inputWord(locale: IopLocalizedLocale): string {
  return locale === "hi-IN" ? "इनपुट" : "ਇਨਪੁੱਟ";
}

function stepWord(locale: IopLocalizedLocale): string {
  return locale === "hi-IN" ? "चरण" : "ਪੜਾਅ";
}

function newInputWord(locale: IopLocalizedLocale): string {
  return locale === "hi-IN" ? "नया इनपुट" : "ਨਵਾਂ ਇਨਪੁੱਟ";
}

function answerWord(locale: IopLocalizedLocale): string {
  return locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ";
}

function solutionWord(locale: IopLocalizedLocale): string {
  return locale === "hi-IN" ? "हल" : "ਹੱਲ";
}

function renderCaselet(caselet: IopLocalizedCaselet, index: number): string {
  const demonstration = [
    `<div class="trace-row"><b>${inputWord(caselet.locale)}:</b> ${row(caselet.demonstration.input)}</div>`,
    ...caselet.demonstration.steps.map((values, stepIndex) => `<div class="trace-row"><b>${stepWord(caselet.locale)} ${stepIndex + 1}:</b> ${row(values)}</div>`),
  ].join("");
  const questions = caselet.children.map((child) => {
    const options = child.options.map((option, optionIndex) => `<div class="option"><span>${String.fromCharCode(65 + optionIndex)}.</span> ${esc(option.display)}</div>`).join("");
    return `<section class="question">
      <div class="q-title">Q${child.questionOrder}. ${esc(child.text)}</div>
      <div class="options">${options}</div>
      <div class="solution"><b>${answerWord(caselet.locale)}:</b> ${String.fromCharCode(65 + child.answerIndex)} — ${esc(child.answerDisplay)}<br><br><b>${solutionWord(caselet.locale)}:</b><pre>${esc(child.explanation)}</pre></div>
    </section>`;
  }).join("");
  return `<article class="caselet">
    <div class="caselet-head"><span>Example ${index}</span><span>${esc(caselet.difficulty)}</span></div>
    <p class="directions">${esc(caselet.directions)}</p>
    <div class="machine">${demonstration}</div>
    <div class="new-input"><b>${newInputWord(caselet.locale)}:</b> ${row(caselet.target.input)}</div>
    ${questions}
    <details class="tech"><summary>Technical audit details</summary><div>QL: ${esc(caselet.qlId)} · Mode: ${esc(caselet.sourceModeId)} · Seed: ${esc(caselet.seed)}</div></details>
  </article>`;
}

const localized: IopLocalizedCaselet[] = [];
for (const locale of locales) {
  for (const mode of IOP_ENGLISH_SOURCE_MODES) {
    for (let example = 0; example < examplesPerMode; example += 1) {
      const seed = `IOP-EN-REVIEW-${mode.sourceModeId}-${String(example).padStart(2, "0")}`;
      localized.push(generateIopLocalizedReviewCaselet(seed, mode.qlId, mode.sourceModeId, locale));
    }
  }
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "IOP-001-HI-PA-REVIEW.json"), JSON.stringify({
  packageId: "IOP-001",
  status: "LOCALIZATION_REVIEW_CANDIDATE_V1",
  englishFreeze: true,
  examplesPerMode,
  sourceModes: IOP_ENGLISH_SOURCE_MODES.length,
  caselets: localized,
}, null, 2));

const languageSections = locales.map((locale) => {
  const caselets = localized.filter((caselet) => caselet.locale === locale);
  return `<section class="language"><h1>${localeName(locale)} Review</h1><p class="intro">${locale === "hi-IN" ? "प्रश्नों और हल की भाषा सरल, स्वाभाविक और परीक्षा-जैसी रखी गई है। मशीन के मूल शब्द और संख्याएँ जानबूझकर नहीं बदली गई हैं।" : "ਪ੍ਰਸ਼ਨਾਂ ਅਤੇ ਹੱਲ ਦੀ ਭਾਸ਼ਾ ਸਧਾਰਨ, ਕੁਦਰਤੀ ਅਤੇ ਪ੍ਰੀਖਿਆ ਵਰਗੀ ਰੱਖੀ ਗਈ ਹੈ। ਮਸ਼ੀਨ ਦੇ ਮੂਲ ਸ਼ਬਦ ਅਤੇ ਸੰਖਿਆਵਾਂ ਜਾਣ-ਬੁੱਝ ਕੇ ਨਹੀਂ ਬਦਲੀਆਂ ਗਈਆਂ।"}</p>${caselets.map((caselet, index) => renderCaselet(caselet, index + 1)).join("")}</section>`;
}).join("");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IOP-001 Hindi Punjabi Review</title><style>
body{font-family:system-ui,-apple-system,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;max-width:1040px;margin:0 auto;padding:24px;background:#f5f6f8;color:#171717;line-height:1.55}.language>h1{margin-top:42px}.intro{background:white;border-left:4px solid #555;padding:14px 16px}.caselet{background:white;margin:22px 0;padding:22px;border:1px solid #ddd;border-radius:10px}.caselet-head{display:flex;justify-content:space-between;font-weight:700;margin-bottom:12px}.directions{font-size:1.02rem}.machine,.new-input{background:#f8f8f8;padding:14px;margin:14px 0;border-radius:7px}.trace-row{padding:4px 0}.new-input{border:1px solid #bbb}.question{border-top:1px solid #ddd;padding-top:18px;margin-top:20px}.q-title{font-weight:700;font-size:1.04rem}.options{margin:12px 0}.option{padding:5px 8px}.option span{display:inline-block;width:28px;font-weight:700}.solution{background:#fafafa;border-left:3px solid #777;padding:13px 15px;margin-top:12px}.solution pre{white-space:pre-wrap;font:inherit;margin:0}.tech{margin-top:18px;color:#555;font-size:.9rem}.tech summary{cursor:pointer}
</style></head><body><h1>IOP-001 — Hindi / Punjabi Human Review</h1><p>Frozen English authority → localization review candidate. Question Studio / Question Bank / public delivery remain off.</p>${languageSections}</body></html>`;
writeFileSync(join(outputDir, "IOP-001-HI-PA-REVIEW.html"), html);

console.log("PASS_IOP_001_LOCALIZATION_REVIEW_EXPORT");
console.log(`output ${outputDir}`);
console.log(`locales ${locales.length}`);
console.log(`source modes ${IOP_ENGLISH_SOURCE_MODES.length}`);
console.log(`caselets ${localized.length}`);
console.log(`questions ${localized.reduce((sum, caselet) => sum + caselet.children.length, 0)}`);
