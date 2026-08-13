import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateBankingCanNeverEditorialV3 } from "./banking-can-never-be-editorial-v3";
import { generateBankingCanNeverEditorialV4 } from "./banking-can-never-be-editorial-v4";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
const outDir = resolve(process.cwd(), "dist/reasoning-v1/syl-001-bank-can-never-be-editorial-v4");
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
  generateBankingCanNeverEditorialV4(seed, locale)));

const semanticStatuses: Record<string, number> = {};
const modalKinds: Record<string, number> = {};
const modalPositions: Record<string, number> = {};
const sourcePatterns: Record<string, number> = {};
const languages: Record<string, number> = {};
const diagramSchemas: Record<string, number> = {};
const geometrySources: Record<string, number> = {};
let v3ExplanationChars = 0;
let v4ExplanationChars = 0;
let evidencePremiseReferences = 0;

for (const question of records) {
  const prior = generateBankingCanNeverEditorialV3(question.seed, question.locale);
  increment(semanticStatuses, question.semanticAnswer);
  increment(languages, question.locale);
  increment(sourcePatterns, question.sourcePatternId);
  increment(diagramSchemas, question.diagram.schemaVersion);
  increment(geometrySources, question.diagram.geometrySource);
  const modalIndex = question.conclusions.findIndex((entry) => entry.mode === "CAN_NEVER_BE");
  const modal = question.conclusions[modalIndex];
  if (!modal?.surfaceKind) throw new Error(`${question.seed}/${question.locale}: missing modal conclusion.`);
  increment(modalKinds, modal.surfaceKind);
  increment(modalPositions, modalIndex === 0 ? "I" : "II");
  v3ExplanationChars += prior.explanation.reduce((total, line) => total + line.length, 0);
  v4ExplanationChars += question.explanation.reduce((total, line) => total + line.length, 0);
  evidencePremiseReferences += question.explanationEvidence.reduce(
    (total, entry) => total + entry.renderedPremises.length,
    0,
  );
}

const summary = {
  status: "HUMAN_REVIEW_REQUIRED_EDITORIAL_V4_WITH_COMBINED_DIAGRAMS",
  authority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4",
  semanticAuthority: "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  priorEditorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V3",
  logicalQuestions: seeds.length,
  records: records.length,
  languages,
  semanticStatuses,
  modalKinds,
  modalPositions,
  sourcePatterns,
  diagramSchemas,
  geometrySources,
  diagramsEnabled: records.filter((entry) => entry.diagram.enabled).length,
  diagramsOmitted: records.filter((entry) => !entry.diagram.enabled).length,
  diagramPolicy: {
    stemDiagram: "NONE",
    solutionDiagram: "ONE_COMBINED_PREMISE_DIAGRAM",
    disclosure: "AFTER_ATTEMPT",
    separateConclusionDiagrams: false,
    counterexampleSupplement: "TEXT_ONLY_WHEN_NEEDED_V4",
  },
  explanationPolicy: "CONCISE_TERM_SPECIFIC_DIAGRAM_ASSISTED_REASONING_V4",
  explanationChars: {
    v3: v3ExplanationChars,
    v4: v4ExplanationChars,
    retainedRatio: Number((v4ExplanationChars / v3ExplanationChars).toFixed(4)),
  },
  completePremiseEvidenceRetainedInternally: true,
  evidencePremiseReferences,
  answerPolicy: "FIXED_BANK_FIVE_OPTION_TEMPLATE_V2",
  eitherOrCorrectInThisArchetype: 0,
  remainingProfileGaps: {
    sourceFrequencyWeighting: "PENDING_SOURCE_PROFILE_FREEZE",
    difficultyCalibration: "PENDING_EVIDENCE_BASED_PROFILE_FREEZE",
    eitherOrCoverage: "REQUIRED_AT_WHOLE_CHAPTER_PROFILE_LEVEL_NOT_FORCED_IN_THIS_ARCHETYPE",
  },
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "PENDING",
  registeredQlCreated: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  activationPermitted: false,
};

function card(question: (typeof records)[number]): string {
  const answer = question.options[question.correctIndex]?.text ?? question.semanticAnswer;
  const svg = question.diagram.svg ?? "";
  return `<article class="card">
<header><strong>Seed ${question.seed} · ${esc(question.locale)}</strong><span>${esc(question.scenarioId)} · ${esc(question.semanticAnswer)}</span></header>
<section><h3>Statements</h3><ol>${question.statements.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol></section>
<section class="diagram"><h3>One combined premise diagram</h3>${svg}<p class="caption">${esc(question.diagram.caption ?? "")}</p></section>
<section><h3>Conclusions</h3><ol class="roman">${question.conclusions.map((entry) => `<li>${esc(entry.text)}</li>`).join("")}</ol></section>
<section><h3>Options</h3><ol type="A">${question.options.map((entry) => `<li class="${entry.isCorrect ? "correct" : ""}">${esc(entry.text)}</li>`).join("")}</ol><p><b>Correct answer:</b> ${esc(answer)}</p></section>
<section><h3>Concise solution</h3>${question.explanation.map((entry) => `<p>${esc(entry)}</p>`).join("")}</section>
<details><summary>Internal audit evidence</summary><p>Geometry: ${esc(question.diagram.geometrySource)}</p>${question.explanationEvidence.map((entry) => `<p><b>${entry.label}:</b> ${entry.premiseIds.map(esc).join(", ")}</p>`).join("")}</details>
</article>`;
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 Banking Can-Never-Be Editorial V4</title><style>body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f1f5f9;color:#0f172a;margin:0;padding:18px}main{max-width:1050px;margin:auto}.notice,.card{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;margin:0 0 18px}.notice{border-left:5px solid #d97706}.card header{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:1px solid #e2e8f0;padding-bottom:10px}.roman{list-style-type:upper-roman}.correct{font-weight:800}.diagram{border:1px solid #e2e8f0;border-radius:12px;padding:12px;overflow:auto}.diagram svg{display:block;max-width:100%;height:auto;margin:auto}.caption{font-size:.92rem;color:#475569;text-align:center}details{border-top:1px solid #e2e8f0;margin-top:12px;padding-top:10px}p,li{line-height:1.5}h1{margin-top:0}@media(max-width:700px){body{padding:8px}.card{padding:12px}}</style></head><body><main><h1>SYL-001 Banking Can-Never-Be — Editorial V4</h1><div class="notice"><b>Human review required.</b> Each question now uses one combined premise-only solution diagram after attempt and two concise, term-specific conclusion explanations. No separate Conclusion-I/Conclusion-II diagrams are generated. Semantics, statements, conclusions, options and answer keys remain inherited from the audited V2/V3 authority; registration and activation remain disabled.</div>${records.map(card).join("\n")}</main></body></html>`;

const markdown = [
  "# SYL-001 Banking Can-Never-Be — Editorial V4",
  "",
  "> Human review required. One combined premise diagram per question, concise term-specific reasoning, no split conclusion diagrams, no registration or activation.",
  "",
  ...records.flatMap((question) => [
    `## Seed ${question.seed} — ${question.locale} — ${question.scenarioId}`,
    "",
    "### Statements",
    ...question.statements.map((entry, index) => `${index + 1}. ${entry}`),
    "",
    `### Diagram`,
    `- One combined premise diagram: ${question.diagram.enabled ? "enabled" : "omitted"}`,
    `- Geometry source: ${question.diagram.geometrySource}`,
    `- Disclosure: after attempt`,
    "",
    "### Conclusions",
    ...question.conclusions.map((entry, index) => `${index === 0 ? "I" : "II"}. ${entry.text}`),
    "",
    "### Options",
    ...question.options.map((entry, index) => `${String.fromCharCode(65 + index)}. ${entry.text}${entry.isCorrect ? " **✓**" : ""}`),
    "",
    "### Concise solution",
    ...question.explanation.map((entry) => `- ${entry}`),
    "",
  ]),
].join("\n");

writeFileSync(resolve(outDir, "SYL-001-BANKING-CAN-NEVER-BE-EDITORIAL-V4.html"), html, "utf8");
writeFileSync(resolve(outDir, "SYL-001-BANKING-CAN-NEVER-BE-EDITORIAL-V4.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
writeFileSync(resolve(outDir, "records.jsonl"), `${records.map((entry) => JSON.stringify(entry)).join("\n")}\n`, "utf8");
console.log(JSON.stringify({ ...summary, outputDir: outDir }, null, 2));
