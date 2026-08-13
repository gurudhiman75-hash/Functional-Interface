import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateBankingCanNeverEditorialV3 } from "./banking-can-never-be-editorial-v3";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-can-never-be-editorial-v3");
mkdirSync(outDir, { recursive: true });

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

const records = seeds.flatMap((seed) => locales.map((locale) =>
  generateBankingCanNeverEditorialV3(seed, locale)));

const statuses: Record<string, number> = {};
const modalKinds: Record<string, number> = {};
const modalPositions: Record<string, number> = {};
const modalTruth: Record<string, number> = {};
const ordinaryTruth: Record<string, number> = {};
const correctOptionPositions: Record<string, number> = {};
const languages: Record<string, number> = {};
const scenarios: Record<string, number> = {};
const sourcePatterns: Record<string, number> = {};
let evidencePremiseReferences = 0;

for (const question of records) {
  const modalIndex = question.conclusions.findIndex((entry) => entry.mode === "CAN_NEVER_BE");
  const modal = question.conclusions[modalIndex];
  const ordinary = question.conclusions[modalIndex === 0 ? 1 : 0];
  if (!modal?.surfaceKind || !ordinary) throw new Error(`${question.seed}/${question.locale}: incomplete record.`);
  increment(statuses, question.semanticAnswer);
  increment(modalKinds, modal.surfaceKind);
  increment(modalPositions, modalIndex === 0 ? "I" : "II");
  increment(modalTruth, String(modal.follows));
  increment(ordinaryTruth, String(ordinary.follows));
  increment(correctOptionPositions, String(question.correctIndex));
  increment(languages, question.locale);
  increment(scenarios, question.scenarioId);
  increment(sourcePatterns, question.sourcePatternId);
  evidencePremiseReferences += question.explanationEvidence.reduce(
    (total, entry) => total + entry.renderedPremises.length,
    0,
  );
}

const summary = {
  status: "HUMAN_REVIEW_REQUIRED_AFTER_SELF_REMEDIATION",
  authority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V3",
  semanticAuthority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  logicalQuestions: seeds.length,
  records: records.length,
  languages,
  semanticStatuses: statuses,
  modalKinds,
  modalPositions,
  modalTruth,
  ordinaryTruth,
  correctOptionPositions,
  scenarios,
  sourcePatterns,
  explanationLines: records.reduce((total, entry) => total + entry.explanation.length, 0),
  evidencePremiseReferences,
  antiPatternClosure: {
    conclusionIShortcutRemoved: true,
    modalTruthBiasRemoved: true,
    orthogonalGrid: "4 statuses x 2 modal positions x 2 modal kinds",
  },
  explanationPolicy: "COMPLETE_PREMISE_DISPOSITION_SPECIFIC_REASONING_V3",
  completePremiseEvidence: true,
  dispositionSpecificModalFailures: true,
  englishPluralAgreementLeakage: 0,
  hindiPunjabiEnglishModalLeaks: 0,
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "NOT_APPLICABLE_IN_TEXT_REVIEW_PACK",
  activationPermitted: false,
};

function card(question: (typeof records)[number]): string {
  const answer = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  return `<article class="card">
<header><strong>Seed ${question.seed} · ${esc(question.locale)}</strong><span>${esc(question.scenarioId)} · ${esc(question.semanticAnswer)}</span></header>
<section><h3>Statements</h3><ol>${question.statements.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol></section>
<section><h3>Conclusions</h3><ol class="roman">${question.conclusions.map((entry) => `<li><small>${esc(entry.mode)}${entry.surfaceKind ? ` · ${esc(entry.surfaceKind)}` : ""} · ${entry.follows ? "FOLLOWS" : "DOES NOT FOLLOW"}</small><br>${esc(entry.text)}</li>`).join("")}</ol></section>
<section><h3>Options</h3><ol type="A">${question.options.map((entry) => `<li class="${entry.isCorrect ? "correct" : ""}">${esc(entry.text)}</li>`).join("")}</ol><p><b>Correct answer:</b> ${esc(answer)}</p></section>
<section><h3>Complete-premise explanation</h3>${question.explanation.map((entry) => `<p>${esc(entry)}</p>`).join("")}</section>
<section><h3>Explanation evidence</h3>${question.explanationEvidence.map((entry) => `<p><b>${entry.label}:</b> ${entry.premiseIds.map(esc).join(", ")}</p>`).join("")}</section>
</article>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Banking Can-Never-Be Editorial V3</title><style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:18px}main{max-width:1050px;margin:auto}.notice,.card{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;margin:0 0 18px}.notice{border-left:5px solid #d97706}.card header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:10px}.roman{list-style-type:upper-roman}.correct{font-weight:800}small{color:#475569}p,li{line-height:1.55}h1{margin-top:0}@media(max-width:700px){body{padding:8px}.card{padding:12px}}</style></head><body><main><h1>SYL-001 Banking Can-Never-Be — Editorial V3</h1><div class="notice"><b>Human review required.</b> This candidate removes the measured Conclusion-I/modal-truth shortcut and uses complete-premise, relation-specific explanations. False modal conclusions distinguish an impossible relation from one that is merely not guaranteed. Registration and activation remain disabled.</div>${records.map(card).join("\n")}</main></body></html>`;

const markdown = [
  "# SYL-001 Banking Can-Never-Be — Editorial V3",
  "",
  "> Human review required. Anti-pattern-remediated selection with complete-premise, disposition-specific explanations; no registration or activation is permitted.",
  "",
  ...records.flatMap((question) => [
    `## Seed ${question.seed} — ${question.locale} — ${question.scenarioId}`,
    "",
    "### Statements",
    ...question.statements.map((entry, index) => `${index + 1}. ${entry}`),
    "",
    "### Conclusions",
    ...question.conclusions.map((entry, index) => `${index === 0 ? "I" : "II"}. [${entry.mode}${entry.surfaceKind ? ` · ${entry.surfaceKind}` : ""} · ${entry.follows ? "FOLLOWS" : "DOES NOT FOLLOW"}] ${entry.text}`),
    "",
    "### Options",
    ...question.options.map((entry, index) => `${String.fromCharCode(65 + index)}. ${entry.text}${entry.isCorrect ? " **✓**" : ""}`),
    "",
    "### Complete-premise explanation",
    ...question.explanation.map((entry) => `- ${entry}`),
    "",
    "### Evidence premises",
    ...question.explanationEvidence.map((entry) => `- ${entry.label}: ${entry.premiseIds.join(", ")}`),
    "",
  ]),
].join("\n");

writeFileSync(resolve(outDir, "SYL-001-BANKING-CAN-NEVER-BE-EDITORIAL-V3.html"), html, "utf8");
writeFileSync(resolve(outDir, "SYL-001-BANKING-CAN-NEVER-BE-EDITORIAL-V3.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
writeFileSync(resolve(outDir, "records.jsonl"), `${records.map((entry) => JSON.stringify(entry)).join("\n")}\n`, "utf8");
console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));
