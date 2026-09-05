import fs from "node:fs";
import path from "node:path";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1_V2,
  COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2,
} from "./com003-localization-v2-wave1-v2";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";

const QLS = ["COM-003-QL-001", "COM-003-QL-002", "COM-003-QL-003", "COM-003-QL-004"];
const EN = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => QLS.includes(q.qlId));
const HI = new Map(COM003_HINDI_LOCALIZATION_V2_WAVE1_V2.map((q) => [q.sourceQuestionId, q]));
const PA = new Map(COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2.map((q) => [q.sourceQuestionId, q]));
const esc = (value: unknown) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const optionList = (values: readonly string[], correct: number) => `<ol type="A">${values.map((value, index) => `<li${index === correct ? ' class="correct"' : ""}>${esc(value)}</li>`).join("")}</ol>`;

function languageCell(title: string, stem: string, options: readonly string[], answer: string, explanation: string, correct: number, lang?: string) {
  return `<section class="lang"${lang ? ` lang="${lang}"` : ""}><h4>${esc(title)}</h4><div class="stem">${esc(stem)}</div>${optionList(options, correct)}<div class="answer"><b>Answer:</b> ${esc(answer)}</div><div class="explanation"><b>Explanation:</b> ${esc(explanation)}</div></section>`;
}

export function buildCom003LocalizationV2Wave1V2ReviewFile() {
  const sections = QLS.map((qlId) => {
    const cards = EN.filter((q) => q.qlId === qlId).map((en, index) => {
      const hi = HI.get(en.questionId)!;
      const pa = PA.get(en.questionId)!;
      return `<article class="question"><div class="meta"><b>${esc(qlId)} · ${index + 1}/12</b><span>${esc(en.examSurfaceFamily)} · ${esc(en.surfaceMode)} · ${esc(en.targetFactId)}</span></div><div class="grid">${languageCell("English V16.2", en.stem, en.options, en.canonicalAnswer, en.explanation, en.correctIndex)}${languageCell("Hindi V2 Candidate 2", hi.stem, hi.options, hi.canonicalAnswer, hi.explanation, hi.correctIndex, "hi")}${languageCell("Punjabi V2 Candidate 2", pa.stem, pa.options, pa.canonicalAnswer, pa.explanation, pa.correctIndex, "pa")}</div></article>`;
    }).join("");
    return `<section class="ql"><h2>${esc(qlId)}</h2>${cards}</section>`;
  }).join("");

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>COM-003 Localization V2 Wave 1 Candidate 2</title><style>:root{font-family:Inter,"Noto Sans Devanagari","Noto Sans Gurmukhi",Arial,sans-serif;color:#172033;background:#f4f6f8}body{margin:0}.wrap{max-width:1500px;margin:auto;padding:22px 14px 60px}.hero,.question{background:#fff;border:1px solid #dfe4ea;border-radius:12px}.hero{padding:18px;margin-bottom:18px}.stats{display:flex;gap:8px;flex-wrap:wrap}.stat{background:#eef3f8;border-radius:8px;padding:8px 11px;font-weight:700}.notice{margin-top:12px;padding:11px;border-radius:8px;background:#fff4d8}.ql>h2{margin:28px 2px 10px}.question{margin:10px 0;overflow:hidden}.meta{padding:10px 12px;background:#f7f8fa;border-bottom:1px solid #e5e8ec;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:12px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.lang{padding:14px;border-right:1px solid #e5e8ec}.lang:last-child{border-right:0}.lang h4{margin:0 0 9px}.stem{font-weight:700;line-height:1.45;min-height:44px}.lang ol{padding-left:26px;margin:10px 0}.lang li{padding:2px 0}.correct{font-weight:800}.answer{margin-top:8px}.explanation{margin-top:6px;line-height:1.45;font-size:13px}.small{font-size:12px;color:#566175}@media(max-width:950px){.grid{grid-template-columns:1fr}.lang{border-right:0;border-bottom:1px solid #e5e8ec}.lang:last-child{border-bottom:0}}</style></head><body><main class="wrap"><section class="hero"><h1>COM-003 — Localization V2 Wave 1 · Candidate 2</h1><p>V16.2 English authority → corrected Hindi/Punjabi review candidate · QL-001..004</p><div class="stats"><span class="stat">48 English</span><span class="stat">48 Hindi</span><span class="stat">48 Punjabi</span><span class="stat">96 localized outputs</span><span class="stat">Candidate 2</span></div><div class="notice"><b>Review-only:</b> Candidate 2 corrects question-direction semantics for COMMAND_TO_EFFECT and SHORTCUT_TO_ACTION. It does not authorize Question Studio runtime, Question Bank writes, tests or publication.</div><p class="small">Authority: ${esc(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2.authorityId)}</p></section>${sections}</main></body></html>`;
}

export function writeCom003LocalizationV2Wave1V2ReviewFile(outputDir = path.resolve("dist/com003-localization-v2-wave1-v2-review")) {
  fs.mkdirSync(outputDir, { recursive: true });
  const file = path.join(outputDir, "COM-003-Localization-V2-Wave1-Candidate2-Review.html");
  fs.writeFileSync(file, buildCom003LocalizationV2Wave1V2ReviewFile(), "utf8");
  return file;
}

if (process.argv[1]?.includes("com003-localization-v2-wave1-v2-review-file")) {
  console.log("[COM003-LOCALIZATION-V2-WAVE1-V2-REVIEW]", writeCom003LocalizationV2Wave1V2ReviewFile());
}
