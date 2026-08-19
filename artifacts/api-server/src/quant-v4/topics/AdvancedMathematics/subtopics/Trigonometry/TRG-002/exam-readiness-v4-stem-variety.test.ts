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

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const q54: any = generateTrg002V4CandidateQuestion("TRG-002-QL-054", "trg002-v4-no-repeat-054", locale);
  const q82: any = generateTrg002V4CandidateQuestion("TRG-002-QL-082", "trg002-v4-no-repeat-082", locale);
  const first54 = q54.stem.split(locale === "hi-IN" ? "।" : "।")[0];
  const first82 = q82.stem.split(locale === "hi-IN" ? "।" : "।")[0];
  if (locale === "hi-IN") {
    assert(first54.includes("दो कोणीय माप"), "QL054 Hindi context should add survey flavor without repeating station geometry.");
    assert(!first54.includes("अवलोकन स्टेशन"), "QL054 Hindi context must not restate the two-station geometry.");
    assert(first82.includes("आधार-रेखा सर्वेक्षण"), "QL082 Hindi context should retain baseline-survey flavor.");
    assert(!first82.includes("विपरीत ओर"), "QL082 Hindi context must not restate opposite-side geometry.");
  } else {
    assert(first54.includes("ਦੋ ਕੋਣੀ ਮਾਪ"), "QL054 Punjabi context should add survey flavor without repeating station geometry.");
    assert(!first54.includes("ਨਿਰੀਖਣ ਸਟੇਸ਼ਨ"), "QL054 Punjabi context must not restate the two-station geometry.");
    assert(first82.includes("ਅਧਾਰ-ਰੇਖਾ ਸਰਵੇਖਣ"), "QL082 Punjabi context should retain baseline-survey flavor.");
    assert(!first82.includes("ਉਲਟ ਪਾਸ"), "QL082 Punjabi context must not restate opposite-side geometry.");
  }
}

assert.equal(targetCases, 24 * 12 * 2);
console.log(`TRG002_V4_STEM_VARIETY_PASS targets=24 targetCases=${targetCases} chapterQls=96 locales=2 duplicateNormalizedStems=0 repeatedSetupBlockers=0`);
