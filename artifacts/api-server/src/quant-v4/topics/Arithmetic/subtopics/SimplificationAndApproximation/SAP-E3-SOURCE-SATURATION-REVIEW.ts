import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  SAP_CP004_E3_DECIMAL_ROOT_QUOTIENT,
  SAP_CP004_E3_HETEROGENEOUS_ROOT_CHAIN,
  generateSapCp004E3,
} from "./SAP-001/SAP-CP-004/e3-source-expansion";
import { generateSapCp012E3 } from "./SAP-002/SAP-CP-012/e3-source-expansion";
import { generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release-e3";

interface Reviewable {
  readonly checkpointId: string;
  readonly difficulty: string;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly options: readonly { readonly value: string; readonly isCorrect: boolean; readonly misconceptionId: string | null; readonly analysis: string }[];
  readonly correctIndex: number;
  readonly explanation: { readonly coreConcept: string; readonly steps: readonly string[]; readonly finalAnswer: string };
  readonly oracle: { readonly kind: string; readonly data: Readonly<Record<string, number | string>> };
  readonly canonicalPayloadKey: string;
  readonly generationIdentity: string;
  readonly lifecycle: {
    readonly permanentQlId: null;
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
  readonly validation: { readonly ok: boolean; readonly errors: readonly string[] };
}
interface ReviewRecord {
  readonly questionId: string;
  readonly sourceProfile: "SSC_RAILWAY" | "BANK";
  readonly checkpointId: string;
  readonly familyId: string;
  readonly seed: number;
  readonly difficulty: string;
  readonly stem: string;
  readonly options: Reviewable["options"];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly explanation: Reviewable["explanation"];
  readonly oracle: Reviewable["oracle"];
  readonly canonicalPayloadKey: string;
  readonly generationIdentity: string;
}

const records: ReviewRecord[] = [];
const stems = new Set<string>();
const payloads = new Set<string>();
const identities = new Set<string>();
const positions = [0,0,0,0];
let qn = 1;

function add(q: Reviewable, sourceProfile: ReviewRecord["sourceProfile"], familyId: string, seed: number): void {
  assert.equal(q.validation.ok, true, `${familyId}/${seed}: ${q.validation.errors.join("; ")}`);
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options.map(o => o.value)).size, 4);
  assert.equal(q.options.filter(o => o.isCorrect).length, 1);
  assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
  assert.equal(q.lifecycle.permanentQlId, null);
  assert.equal(q.lifecycle.active, false);
  assert.equal(q.lifecycle.questionStudioDiscoverable, false);
  assert.equal(q.lifecycle.questionBankWritable, false);
  assert.equal(q.lifecycle.testEligible, false);
  assert.equal(q.lifecycle.publiclyPublishable, false);
  assert.doesNotMatch(q.stem, /[√∛∜]/);
  assert.ok(!stems.has(q.stem), `${familyId}/${seed}: duplicate review stem`);
  assert.ok(!payloads.has(q.canonicalPayloadKey), `${familyId}/${seed}: duplicate payload`);
  assert.ok(!identities.has(q.generationIdentity), `${familyId}/${seed}: duplicate identity`);
  stems.add(q.stem); payloads.add(q.canonicalPayloadKey); identities.add(q.generationIdentity);
  positions[q.correctIndex]! += 1;
  records.push(Object.freeze({
    questionId: `SAP-E3-${String(qn++).padStart(3,"0")}`,
    sourceProfile,
    checkpointId: q.checkpointId,
    familyId,
    seed,
    difficulty: q.difficulty,
    stem: q.stem,
    options: q.options,
    correctIndex: q.correctIndex,
    canonicalAnswer: q.canonicalAnswer,
    explanation: q.explanation,
    oracle: q.oracle,
    canonicalPayloadKey: q.canonicalPayloadKey,
    generationIdentity: q.generationIdentity,
  }));
}

for (let seed = 1; seed <= 60; seed += 1) add(generateSapCp004E3(SAP_CP004_E3_HETEROGENEOUS_ROOT_CHAIN, seed), "SSC_RAILWAY", SAP_CP004_E3_HETEROGENEOUS_ROOT_CHAIN, seed);
for (let seed = 1; seed <= 60; seed += 1) add(generateSapCp004E3(SAP_CP004_E3_DECIMAL_ROOT_QUOTIENT, seed), "SSC_RAILWAY", SAP_CP004_E3_DECIMAL_ROOT_QUOTIENT, seed);
for (let seed = 1; seed <= 60; seed += 1) add(generateSapCp012E3(seed), "BANK", "CP012-E3-EXPLICIT-POWER-REVERSE-SYNTHESIS", seed);
for (let seed = 1; seed <= 60; seed += 1) add(generateSapCp012E2("CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE", seed), "BANK", "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE-E3-POLISH", seed);

assert.equal(records.length, 240);
assert.equal(stems.size, 240);
assert.equal(payloads.size, 240);
assert.equal(identities.size, 240);
assert.deepEqual(positions, [60,60,60,60]);

const familyCounts = Object.fromEntries([...new Set(records.map(r => r.familyId))].map(id => [id, records.filter(r => r.familyId === id).length]));
assert.equal(familyCounts[SAP_CP004_E3_HETEROGENEOUS_ROOT_CHAIN], 60);
assert.equal(familyCounts[SAP_CP004_E3_DECIMAL_ROOT_QUOTIENT], 60);
assert.equal(familyCounts["CP012-E3-EXPLICIT-POWER-REVERSE-SYNTHESIS"], 60);
assert.equal(familyCounts["CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE-E3-POLISH"], 60);

const cp012E3 = records.filter(r => r.familyId === "CP012-E3-EXPLICIT-POWER-REVERSE-SYNTHESIS");
assert.equal(cp012E3.filter(r => r.oracle.data.mode === "POWER_CHAIN").length, 30);
assert.equal(cp012E3.filter(r => r.oracle.data.mode === "POWER_ROOT_CHAIN").length, 30);
const uniqueInteger = records.filter(r => r.familyId === "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE-E3-POLISH");
assert.ok(uniqueInteger.every(r => r.explanation.finalAnswer === `Therefore, ? = ${r.canonicalAnswer}.`));
assert.ok(uniqueInteger.every(r => !r.explanation.finalAnswer.includes("≈")));

const profileCounts = {
  SSC_RAILWAY: records.filter(r => r.sourceProfile === "SSC_RAILWAY").length,
  BANK: records.filter(r => r.sourceProfile === "BANK").length,
};
const difficultyCounts = Object.fromEntries([...new Set(records.map(r => r.difficulty))].map(d => [d, records.filter(r => r.difficulty === d).length]));
const summary = Object.freeze({
  reviewVersion: "SAP-E3-SOURCE-SATURATION-V1",
  questionCount: records.length,
  sourceProfiles: profileCounts,
  checkpoints: { cp004: records.filter(r => r.checkpointId === "SAP-CP-004").length, cp012: records.filter(r => r.checkpointId === "SAP-CP-012").length },
  familyCounts,
  answerPositions: positions,
  difficulty: difficultyCounts,
  sourceWaveDisposition: "NO_NEW_PERMANENT_QL; EXPAND_EXISTING_CP004_CP012_IDENTITIES",
  lifecycle: "INACTIVE_SOURCE_SATURATION_REVIEW_CANDIDATE",
  finalFreezeReady: false,
});

const out = path.join(process.cwd(), "artifacts/api-server/dist/quant-v4/sap-e3-review");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "SAP-E3-SOURCE-SATURATION-REVIEW.json"), JSON.stringify({ summary, records }, null, 2));
fs.writeFileSync(path.join(out, "summary.json"), JSON.stringify(summary, null, 2));

const md: string[] = [
  "# SAP E3 — Final Source-Saturation Review Candidate",
  "",
  `Questions: **${records.length}**`,
  `Source profile: **SSC/Railway ${profileCounts.SSC_RAILWAY} / Banking ${profileCounts.BANK}**`,
  `Checkpoint mix: **CP004 ${summary.checkpoints.cp004} / CP012 ${summary.checkpoints.cp012}**`,
  `A/B/C/D: **${positions.join(" / ")}**`,
  "",
  "> Source-saturation review only. No permanent QL allocation, activation, Question Studio discovery, bank write, test eligibility or publication is authorized.",
  "",
];
for (const r of records) {
  md.push(`## ${r.questionId} — ${r.sourceProfile} — ${r.familyId} — ${r.difficulty}`, "", r.stem, "");
  r.options.forEach((o,i) => md.push(`${String.fromCharCode(65+i)}. ${o.value}`));
  md.push("", `**Correct:** ${String.fromCharCode(65+r.correctIndex)} — ${r.canonicalAnswer}`, "", `**Idea:** ${r.explanation.coreConcept}`, "", "**Working:**");
  r.explanation.steps.forEach((s,i) => md.push(`${i+1}. ${s}`));
  md.push("", `**Final:** ${r.explanation.finalAnswer}`, "");
}
fs.writeFileSync(path.join(out, "SAP-E3-SOURCE-SATURATION-REVIEW.md"), md.join("\n"));

const esc = (s: string) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const cards = records.map(r => `<section><h2>${r.questionId} — ${r.sourceProfile}</h2><p class="tag">${esc(r.familyId)} · ${r.difficulty}</p><p class="stem">${esc(r.stem)}</p><ol type="A">${r.options.map(o => `<li>${esc(o.value)}</li>`).join("")}</ol><div class="solution"><p><b>Correct:</b> ${String.fromCharCode(65+r.correctIndex)} — ${esc(r.canonicalAnswer)}</p><p><b>Idea:</b> ${esc(r.explanation.coreConcept)}</p><ol>${r.explanation.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol><p><b>Final:</b> ${esc(r.explanation.finalAnswer)}</p></div></section>`).join("\n");
fs.writeFileSync(path.join(out, "SAP-E3-SOURCE-SATURATION-REVIEW.html"), `<!doctype html><html><head><meta charset="utf-8"><title>SAP E3 Source Saturation Review</title><script>MathJax={tex:{inlineMath:[['\\\\(','\\\\)']]},svg:{fontCache:'global'}};</script><script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script><style>body{font-family:Arial,sans-serif;max-width:1000px;margin:24px auto;padding:0 20px;line-height:1.55;background:#fafafa}header,section{background:#fff;border:1px solid #e2e2e2;border-radius:8px;padding:18px;margin:14px 0}h2{font-size:1rem}.tag{font-size:.8rem;font-weight:700;color:#555}.stem{font-size:1.05rem}.solution{border-top:1px dashed #ddd;margin-top:14px;padding-top:10px}li{margin:.25rem 0}</style></head><body><header><h1>SAP E3 — Source-Saturation Review</h1><p>${records.length} questions · SSC/Railway ${profileCounts.SSC_RAILWAY} · Banking ${profileCounts.BANK} · A/B/C/D ${positions.join(" / ")}</p></header>${cards}</body></html>`);
console.log(JSON.stringify(summary));
