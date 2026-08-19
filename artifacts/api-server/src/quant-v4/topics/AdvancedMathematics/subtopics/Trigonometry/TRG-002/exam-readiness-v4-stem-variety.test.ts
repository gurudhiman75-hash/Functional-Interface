import assert from "node:assert/strict";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";
import { TRG_002_V4_STEM_VARIETY_IDS } from "./exam-readiness-v4-stem-variety";

assert.equal(TRG_002_V4_STEM_VARIETY_IDS.length, 24);

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/√\s*#/g, "√#")
    .replace(/\s+/g, " ")
    .trim();
}

let targetCases = 0;
for (const qlId of TRG_002_V4_STEM_VARIETY_IDS) {
  for (let seedIndex = 1; seedIndex <= 12; seedIndex += 1) {
    const seed = `trg002-v4-variety-${seedIndex}`;
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const q: any = generateTrg002V4CandidateQuestion(qlId, seed, locale);
      assert.equal(q.v4ExamReadiness.stemVarietyApplied, true, `${qlId}:${locale}: variety overlay must be applied.`);
      assert.equal(q.validation.valid, true, `${qlId}:${locale}: canonical validation must remain green.`);
      assert.equal(q.verification.spatial.valid, true, `${qlId}:${locale}: spatial validation must remain green.`);
      assert.equal(q.verification.diagram.valid, true, `${qlId}:${locale}: diagram validation must remain green.`);
      assert.equal(q.verification.diagramPolicy.valid, true, `${qlId}:${locale}: diagram policy must remain green.`);
      assert.equal(q.activationAuthorized, false);
      assert.equal(q.freezeStatus, "NOT_FROZEN");
      targetCases += 1;
    }
  }
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const seen = new Map<string, string>();
  for (let n = 1; n <= 96; n += 1) {
    const qlId = `TRG-002-QL-${String(n).padStart(3, "0")}`;
    const q: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-variety-chapter-proof", locale);
    const normalized = normalizeStem(q.stem);
    const prior = seen.get(normalized);
    assert(!prior, `${locale}: normalized learner stem remains duplicated between ${prior} and ${qlId}.`);
    seen.set(normalized, qlId);
  }
  assert.equal(seen.size, 96);
}

assert.equal(targetCases, 24 * 12 * 2);
console.log(`TRG002_V4_STEM_VARIETY_PASS targets=24 targetCases=${targetCases} chapterQls=96 locales=2 duplicateNormalizedStems=0`);
