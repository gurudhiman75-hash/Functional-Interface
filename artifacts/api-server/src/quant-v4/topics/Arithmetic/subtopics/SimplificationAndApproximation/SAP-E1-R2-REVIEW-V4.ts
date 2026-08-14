import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SAP_CP004_E1_R2_STRUCTURES, generateSapCp004E1R2 } from "./SAP-001/SAP-CP-004/e1-r2-exam-runtime-release-v4";
import { SAP_CP005_E1_R2_STRUCTURES, generateSapCp005E1R2 } from "./SAP-001/SAP-CP-005/e1-r2-exam-runtime";
import { SAP_CP010_E1_R2_STRUCTURES, generateSapCp010E1R2 } from "./SAP-002/SAP-CP-010/e1-r2-exam-runtime-release-v4";
import type { SapE1R2Package } from "./SAP-E1-R2-TYPES";

interface Family {
  readonly id: string;
  readonly profile: "SSC" | "BANK";
  readonly target: number;
  readonly salt: number;
  readonly generate: (seed: number) => SapE1R2Package;
}

const sscFamilies: Family[] = [
  ...SAP_CP004_E1_R2_STRUCTURES.map((id, index) => ({
    id,
    profile: "SSC" as const,
    target: 11,
    salt: index + 1,
    generate: (seed: number) => generateSapCp004E1R2(id, seed),
  })),
  ...SAP_CP005_E1_R2_STRUCTURES.map((id, index) => ({
    id,
    profile: "SSC" as const,
    target: 3,
    salt: index + 17,
    generate: (seed: number) => generateSapCp005E1R2(id, seed),
  })),
];

const bankUnguided = SAP_CP010_E1_R2_STRUCTURES.slice(0, 6);
const bankSupplied = SAP_CP010_E1_R2_STRUCTURES.slice(6);
const unguidedTargets = [30, 30, 29, 29, 29, 29] as const;
const suppliedTargets = [4, 4, 4, 4, 4, 4] as const;
const bankFamilies: Family[] = [
  ...bankUnguided.map((id, index) => ({
    id,
    profile: "BANK" as const,
    target: unguidedTargets[index]!,
    salt: index + 31,
    generate: (seed: number) => generateSapCp010E1R2(id, seed),
  })),
  ...bankSupplied.map((id, index) => ({
    id,
    profile: "BANK" as const,
    target: suppliedTargets[index]!,
    salt: index + 47,
    generate: (seed: number) => generateSapCp010E1R2(id, seed),
  })),
];

assert.equal(sscFamilies.reduce((sum, f) => sum + f.target, 0), 100);
assert.equal(bankFamilies.reduce((sum, f) => sum + f.target, 0), 200);
assert.equal(sscFamilies.length + bankFamilies.length, 24);

const familyUsage = new Map<string, number>();
const usedSeeds = new Map<string, Set<number>>();
const remaining = new Map<string, number>([...sscFamilies, ...bankFamilies].map(f => [f.id, f.target]));
let sscCursor = 0;
let bankCursor = 0;

function nextFamily(pool: readonly Family[], profile: "SSC" | "BANK"): Family {
  let cursor = profile === "SSC" ? sscCursor : bankCursor;
  for (let attempt = 0; attempt < pool.length; attempt += 1) {
    const index = (cursor + attempt) % pool.length;
    const family = pool[index]!;
    if ((remaining.get(family.id) ?? 0) > 0) {
      if (profile === "SSC") sscCursor = (index + 1) % pool.length;
      else bankCursor = (index + 1) % pool.length;
      remaining.set(family.id, (remaining.get(family.id) ?? 0) - 1);
      return family;
    }
  }
  throw new Error(`No ${profile} review family has remaining quota.`);
}

function stratifiedSeed(family: Family, targetCorrectIndex: number): number {
  const usage = familyUsage.get(family.id) ?? 0;
  familyUsage.set(family.id, usage + 1);
  const occupied = usedSeeds.get(family.id) ?? new Set<number>();
  const preferredSlot = (usage * 7 + family.salt) % 25;
  for (let probe = 0; probe < 25; probe += 1) {
    const bandSlot = (preferredSlot + probe) % 25;
    const seed = targetCorrectIndex + 1 + 4 * bandSlot;
    if (!occupied.has(seed)) {
      occupied.add(seed);
      usedSeeds.set(family.id, occupied);
      return seed;
    }
  }
  throw new Error(`${family.id}: exhausted seed bucket for answer index ${targetCorrectIndex}.`);
}

interface ReviewRecord extends SapE1R2Package {
  readonly questionId: string;
}

const records: ReviewRecord[] = [];
for (let index = 0; index < 300; index += 1) {
  const profile: "SSC" | "BANK" = index % 3 === 2 ? "SSC" : "BANK";
  const family = nextFamily(profile === "SSC" ? sscFamilies : bankFamilies, profile);
  const targetCorrectIndex = index % 4;
  const seed = stratifiedSeed(family, targetCorrectIndex);
  const q = family.generate(seed);
  assert.equal(q.correctIndex, targetCorrectIndex, `${family.id}/${seed}: sampler failed answer-position target.`);
  records.push(Object.freeze({ ...q, questionId: `SAP-E1-R2-${String(index + 1).padStart(3, "0")}` }));
}

assert.equal(records.length, 300, "V4 review must contain 300 records.");
assert.equal(new Set(records.map(r => r.stem)).size, 300, "V4 review must contain 300 unique visible stems.");
assert.equal(new Set(records.map(r => r.canonicalPayloadKey)).size, 300, "V4 review must contain 300 unique payloads.");
assert.equal(new Set(records.map(r => r.generationIdentity)).size, 300, "V4 review must contain 300 unique generation identities.");

const profileCounts = {
  SSC: records.filter(r => r.profile === "SSC").length,
  BANK: records.filter(r => r.profile === "BANK").length,
};
assert.deepEqual(profileCounts, { SSC: 100, BANK: 200 });

const structureCounts = Object.fromEntries(
  [...sscFamilies, ...bankFamilies].map(f => [f.id, records.filter(r => r.structureId === f.id).length]),
);
for (const family of [...sscFamilies, ...bankFamilies]) {
  assert.equal(structureCounts[family.id], family.target, `${family.id}: wrong review weight.`);
}

const cp005Count = records.filter(r => r.checkpointId === "SAP-CP-005").length;
const suppliedCount = records.filter(r => r.structureId.includes("SUPPLIED-ROOT")).length;
const unguidedBankCount = records.filter(r => r.profile === "BANK" && r.structureId.includes("APPROX-")).length;
assert.equal(cp005Count, 12);
assert.equal(suppliedCount, 24);
assert.equal(unguidedBankCount, 176);
assert.equal(records.filter(r => r.checkpointId === "SAP-CP-007").length, 0);

const weightedRootQuotients = records.filter(r => r.structureId === "CP004-R2-WEIGHTED-ROOT-QUOTIENT");
const suppliedRootQuotients = records.filter(r => r.structureId === "CP010-R2-SUPPLIED-ROOT-QUOTIENT");
assert.ok(weightedRootQuotients.length > 0);
assert.ok(suppliedRootQuotients.length > 0);
assert.ok(weightedRootQuotients.every(r => r.difficulty === "MEDIUM"));
assert.ok(suppliedRootQuotients.every(r => r.difficulty === "MEDIUM"));

const positions = [0, 0, 0, 0];
let hard = 0;
let lastStructure = "";
let sameStructureStreak = 0;
for (const r of records) {
  assert.equal(r.validation.ok, true, `${r.questionId}: ${r.validation.errors.join("; ")}`);
  assert.ok(r.decisionCount >= 2);
  assert.notEqual(r.checkpointId, "SAP-CP-007");
  assert.equal(r.options.length, 4);
  assert.equal(new Set(r.options.map(o => o.value)).size, 4);
  assert.equal(r.options[r.correctIndex]?.value, r.canonicalAnswer);
  assert.equal(r.lifecycle.permanentQlId, null);
  assert.equal(r.lifecycle.active, false);
  assert.equal(r.lifecycle.questionStudioDiscoverable, false);
  assert.equal(r.lifecycle.questionBankWritable, false);
  assert.equal(r.lifecycle.testEligible, false);
  assert.equal(r.lifecycle.publiclyPublishable, false);
  assert.doesNotMatch(r.stem, /\bround\b|For estimation, take|Using cancellation|using suitable approximation|nearest whole number/i);
  assert.doesNotMatch(r.stem, /[√∛∜]/);
  assert.doesNotMatch(r.options.map(o => o.value).join(" "), /Alternative\s+\d+/i);
  positions[r.correctIndex]! += 1;
  if (r.difficulty === "HARD") hard += 1;
  sameStructureStreak = r.structureId === lastStructure ? sameStructureStreak + 1 : 1;
  lastStructure = r.structureId;
  assert.ok(sameStructureStreak < 2, `${r.questionId}: same structure repeated back-to-back.`);
}
assert.deepEqual(positions, [75, 75, 75, 75]);

const outDir = path.join(process.cwd(), "artifacts/api-server/dist/quant-v4/sap-e1-r2-review");
fs.mkdirSync(outDir, { recursive: true });
const summary = Object.freeze({
  reviewVersion: "SAP-E1-R2-PRODUCTION-MIX-V4",
  questionCount: 300,
  profiles: profileCounts,
  structures: 24,
  structureCounts,
  answerPositions: positions,
  hardQuestions: hard,
  cp004MainstreamQuestions: 88,
  cp005SpecialistQuestions: cp005Count,
  suppliedRootQuestions: suppliedCount,
  unguidedBankApproximationQuestions: unguidedBankCount,
  cp007NormalMockQuestions: 0,
  sampler: "FULL_RANGE_STRATIFIED_INTERLEAVED_UNIQUE_SEEDS",
  lifecycle: "INACTIVE_HUMAN_REVIEW_CANDIDATE",
  permanentQlAllocation: "NONE",
});

const md: string[] = [
  "# SAP E1-R2 — 300-Question Production-Mix Review V4",
  "",
  "Questions: **300**",
  `Mix: **SSC ${profileCounts.SSC} / Bank ${profileCounts.BANK}**`,
  `Bank mix: **${unguidedBankCount} unguided approximation / ${suppliedCount} supplied-root**`,
  `SSC mix: **88 mainstream exact / ${cp005Count} specialist telescoping**`,
  `Answer balance: **${positions.join(" / ")}**`,
  "",
  "> Human review candidate only. Questions are interleaved in proposed production weighting; all lifecycle surfaces remain off.",
  "",
];
for (const r of records) {
  md.push(`## ${r.questionId} — ${r.profile} — ${r.difficulty}`, "", r.stem, "");
  r.options.forEach((o, i) => md.push(`${String.fromCharCode(65 + i)}. ${o.value}`));
  md.push(
    "",
    `**Correct:** ${String.fromCharCode(65 + r.correctIndex)} — ${r.canonicalAnswer}`,
    "",
    `**Idea:** ${r.explanation.coreConcept}`,
    "",
    "**Working:**",
  );
  r.explanation.steps.forEach((step, i) => md.push(`${i + 1}. ${step}`));
  md.push("", `**Final:** ${r.explanation.finalAnswer}`, "");
}
fs.writeFileSync(path.join(outDir, "SAP-E1-R2-300-REVIEW.md"), md.join("\n"));
fs.writeFileSync(path.join(outDir, "SAP-E1-R2-300-REVIEW.json"), JSON.stringify({ summary, records }, null, 2));
fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));

const esc = (value: string) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");
const cards = records.map(r => `<section><h2>${r.questionId} — ${r.profile}</h2><p class="tag">${esc(r.difficulty)}</p><p class="stem">${esc(r.stem)}</p><ol type="A">${r.options.map(o => `<li>${esc(o.value)}</li>`).join("")}</ol><div class="solution"><p><b>Correct:</b> ${String.fromCharCode(65 + r.correctIndex)} — ${esc(r.canonicalAnswer)}</p><p><b>Idea:</b> ${esc(r.explanation.coreConcept)}</p><ol>${r.explanation.steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol><p><b>Final:</b> ${esc(r.explanation.finalAnswer)}</p></div></section>`).join("\n");
const html = `<!doctype html><html><head><meta charset="utf-8"><title>SAP E1-R2 Production Review V4</title><script>MathJax={tex:{inlineMath:[['\\\\(','\\\\)']]},svg:{fontCache:'global'}};</script><script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script><style>body{font-family:Arial,sans-serif;max-width:1000px;margin:24px auto;padding:0 20px;line-height:1.55;background:#fafafa}header,section{background:#fff;border:1px solid #e2e2e2;border-radius:8px;padding:18px;margin:14px 0}h1{margin-top:0}h2{font-size:1rem}.tag{font-size:.8rem;font-weight:700;text-transform:uppercase;color:#555}.stem{font-size:1.05rem}.solution{border-top:1px dashed #ddd;margin-top:14px;padding-top:10px}li{margin:.25rem 0}</style></head><body><header><h1>SAP E1-R2 — Production-Mix Review V4</h1><p>300 questions · SSC ${profileCounts.SSC} · Bank ${profileCounts.BANK} · ${unguidedBankCount} unguided Bank · ${suppliedCount} supplied-root · A/B/C/D ${positions.join(" / ")}</p></header>${cards}</body></html>`;
fs.writeFileSync(path.join(outDir, "SAP-E1-R2-300-REVIEW.html"), html);
console.log(JSON.stringify(summary));
