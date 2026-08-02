import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestion } from "./generator";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [0, 17] as const;
const questions = SYL_QL_REGISTRY.flatMap((definition) =>
  locales.flatMap((locale) => seeds.map((seed) => generateSylQuestion(definition.qlId, seed, locale))),
);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderQuestion(question: (typeof questions)[number]): string {
  const options = question.options.map((entry, index) =>
    `<li class="${entry.isCorrect ? "correct" : ""}"><strong>${index + 1}.</strong> ${escapeHtml(entry.text)}${entry.isCorrect ? " ✓" : ""}</li>`,
  ).join("");
  const normalized = question.explanation.normalizedPremises.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  const analysis = question.explanation.conclusionAnalysis.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  const evidence = question.explanation.modelEvidence.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  return `<article>
<header><h2>${question.qlId} · ${question.checkpointId} · ${question.locale} · seed ${question.seed}</h2>
<p><code>${question.sourcePatternId}</code> · <code>${question.scenarioId}</code> · ${question.difficulty} · ${question.metadata.answerTemplateId}</p></header>
<pre>${escapeHtml(question.stem)}</pre>
<ol class="options">${options}</ol>
<section><h3>Rule</h3><p>${escapeHtml(question.explanation.rule)}</p></section>
<section><h3>Normalised statements</h3><ul>${normalized}</ul></section>
<section><h3>Conclusion analysis</h3><ul>${analysis}</ul></section>
<section><h3>Model evidence</h3><ul>${evidence}</ul></section>
<section><h3>Final answer</h3><p><strong>${escapeHtml(question.explanation.finalAnswer)}</strong></p></section>
<section><h3>Quick method</h3><p>${escapeHtml(question.explanation.quickMethod)}</p></section>
<section><h3>Common mistake</h3><p>${escapeHtml(question.explanation.commonMistake)}</p></section>
<section><h3>Diagram · ${question.explanation.diagramRole}</h3>${question.explanation.diagramSvg}</section>
<details><summary>Structured review metadata</summary><pre>${escapeHtml(JSON.stringify({ structuredPrompt: question.structuredPrompt, reviewLogic: question.reviewLogic, metadata: question.metadata }, null, 2))}</pre></details>
</article>`;
}

const outputDir = process.env.SYL_REVIEW_DIR
  ? resolve(process.env.SYL_REVIEW_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-review");
mkdirSync(outputDir, { recursive: true });

const jsonl = questions.map((question) => JSON.stringify(question)).join("\n") + "\n";
writeFileSync(resolve(outputDir, "syl-001-multilingual-review.jsonl"), jsonl, "utf8");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 multilingual review</title><style>
body{font-family:system-ui,sans-serif;max-width:1120px;margin:0 auto;padding:24px;background:#f5f6f8;color:#1b1f24}article{background:white;border:1px solid #d8dee4;border-radius:12px;padding:20px;margin:0 0 24px;box-shadow:0 2px 8px rgba(0,0,0,.05)}pre{white-space:pre-wrap;background:#f6f8fa;padding:14px;border-radius:8px;line-height:1.5}.options{padding-left:28px}.options li{padding:5px}.options .correct{font-weight:700}svg{max-width:100%;height:auto;border:1px solid #d8dee4;border-radius:8px}code{background:#eff2f5;padding:2px 5px;border-radius:4px}h2{margin-top:0}details{margin-top:18px}
</style></head><body><h1>SYL-001 multilingual review</h1><p>${questions.length} review questions: two seeds for every one of ${SYL_QL_REGISTRY.length} QLs in English, Hindi and Punjabi.</p>${questions.map(renderQuestion).join("\n")}</body></html>`;
writeFileSync(resolve(outputDir, "syl-001-multilingual-review.html"), html, "utf8");

const summary = {
  authority: "SYL_001_MULTILINGUAL_REVIEW_RUNTIME_V1",
  status: "IMPLEMENTED_MULTILINGUAL_REVIEW_RUNTIME",
  qlCount: SYL_QL_REGISTRY.length,
  checkpointCount: 7,
  localeCount: locales.length,
  seedsPerQlLocale: seeds.length,
  questionCount: questions.length,
  qlIds: SYL_QL_REGISTRY.map((entry) => entry.qlId),
  deliveryLocks: {
    questionStudioVisible: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
};
writeFileSync(resolve(outputDir, "summary.json"), JSON.stringify(summary, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ ...summary, outputDir }, null, 2));
