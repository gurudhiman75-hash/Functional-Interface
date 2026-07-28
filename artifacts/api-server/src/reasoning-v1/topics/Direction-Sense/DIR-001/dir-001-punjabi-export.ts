import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DIR_001_QLS } from "./chapter-registry";
import { generateDirectionQuestionPunjabi } from "./localization/pa-IN";

const outputDirectory = resolve("dist/reasoning-v1/dir-001-punjabi-review");
mkdirSync(outputDirectory, { recursive: true });
const questions = DIR_001_QLS.flatMap((ql) => [0, 17].map((seed) => generateDirectionQuestionPunjabi(ql.qlId, seed)));
const escapeHtml = (value: unknown): string => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const diagramHtml = (diagram: Readonly<Record<string, unknown>> | undefined): string => diagram?.svg
  ? `<section class="diagram"><h4>${escapeHtml(diagram.title ?? "ਚਿੱਤਰ")}</h4>${String(diagram.svg)}</section>`
  : "";
const cards = questions.map((question, index) => {
  const options = question.options.map((option, optionIndex) => `<li class="${optionIndex === question.correctIndex ? "correct" : ""}"><span>${String.fromCharCode(65 + optionIndex)}.</span> ${escapeHtml(option.label)}</li>`).join("");
  return `<article class="card"><header><strong>${index + 1}. ${escapeHtml(question.qlId)}</strong><span>${escapeHtml(question.checkpointId)} · seed ${question.seed} · ${escapeHtml(question.difficulty)}</span></header><p class="stem">${escapeHtml(question.stem)}</p>${diagramHtml(question.questionDiagram)}<ol>${options}</ol><section class="answer"><b>ਸਹੀ ਉੱਤਰ:</b> ${escapeHtml(question.options[question.correctIndex].label)}</section><section class="explanation"><h4>ਵਿਆਖਿਆ</h4><p>${escapeHtml(question.explanation.given)}</p><ul>${question.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul><p>${escapeHtml(question.explanation.resultLine)}</p><p><b>${escapeHtml(question.explanation.conclusion)}</b></p>${diagramHtml(question.explanation.diagram)}</section></article>`;
}).join("\n");
const html = `<!doctype html><html lang="pa"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DIR-001 Punjabi Review</title><style>body{font-family:system-ui,sans-serif;background:#f5f7fb;color:#172033;margin:0}.wrap{max-width:1100px;margin:auto;padding:28px}.summary,.card{background:white;border:1px solid #dce3ee;border-radius:16px;padding:20px;margin-bottom:20px}.card header{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid #e5eaf1;padding-bottom:12px}.stem{font-size:1.08rem;line-height:1.75}.card ol{padding-left:28px}.card li{padding:6px}.correct{background:#e8f7ed;border-radius:8px;font-weight:700}.answer{border-left:4px solid #2e8b57;padding:10px 14px;background:#f2fbf5}.explanation{margin-top:16px;background:#f8fafc;padding:14px;border-radius:12px;line-height:1.7}.diagram{overflow:auto;background:#fff;border:1px solid #dce3ee;border-radius:12px;padding:10px;margin:14px 0}.diagram svg{max-width:100%;height:auto}@media(max-width:700px){.card header{display:block}.card header span{display:block;margin-top:6px}}</style></head><body><main class="wrap"><section class="summary"><h1>DIR-001 ਪੰਜਾਬੀ ਸਮੀਖਿਆ</h1><p>44 ਪ੍ਰਸ਼ਨ-ਤਰਕ · ਹਰ ਇੱਕ ਦੇ 2 ਨਮੂਨੇ · ਕੁੱਲ ${questions.length} ਪ੍ਰਸ਼ਨ</p><p>ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਅੰਗਰੇਜ਼ੀ ਗਣਿਤੀ ਬਣਤਰ ਅਤੇ ਉੱਤਰ-ਕ੍ਰਮ ਨੂੰ ਬਦਲੇ ਬਿਨਾਂ ਸੁਭਾਵਿਕ ਪੰਜਾਬੀ ਪੇਸ਼ਕਾਰੀ।</p></section>${cards}</main></body></html>`;
writeFileSync(resolve(outputDirectory, "DIR-001-PUNJABI-REVIEW.html"), html, "utf8");
writeFileSync(resolve(outputDirectory, "DIR-001-PUNJABI-REVIEW.jsonl"), `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`, "utf8");
console.log("DIR-001 Punjabi review export generated", { questions: questions.length, outputDirectory });
