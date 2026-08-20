import assert from "node:assert/strict";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";
import {
  TRG_002_V4_STRICT_SEMANTIC_PARITY_IDS,
  TRG_002_V4_STRICT_SEMANTIC_PARITY_STEMS,
} from "./exam-readiness-v4-semantic-parity";

assert.equal(TRG_002_V4_STRICT_SEMANTIC_PARITY_IDS.length, 30, "Expected 30 audited V4 semantic-parity remediations.");

for (const qlId of TRG_002_V4_STRICT_SEMANTIC_PARITY_IDS) {
  const contract = TRG_002_V4_STRICT_SEMANTIC_PARITY_STEMS[qlId];
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const q: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-semantic-parity", locale);
    assert.equal(q.stem, locale === "hi-IN" ? contract.hi : contract.pa, `${qlId}:${locale}: final learner stem must equal the strict semantic-authority translation.`);
    assert.equal(q.v4ExamReadiness.semanticParityRemediated, true, `${qlId}:${locale}: semantic-parity remediation metadata missing.`);
    assert.equal(q.activationAuthorized, false);
    assert.equal(q.freezeStatus, "NOT_FROZEN");
  }
}

for (const qlId of [
  "TRG-002-QL-003", "TRG-002-QL-004", "TRG-002-QL-026", "TRG-002-QL-051",
  "TRG-002-QL-054", "TRG-002-QL-062", "TRG-002-QL-077",
]) {
  const hi: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-semantic-exact", "hi-IN");
  const pa: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-semantic-exact", "pa-IN");
  assert(hi.stem.includes("सटीक"), `${qlId}: Hindi dropped the English exact-value requirement.`);
  assert(pa.stem.includes("ਸਟੀਕ"), `${qlId}: Punjabi dropped the English exact-value requirement.`);
}

const entityChecks = [
  ["TRG-002-QL-032", /पेड़/u, /ਦਰੱਖਤ/u, /खंभ/u, /ਖੰਭ/u],
  ["TRG-002-QL-043", /खंभ/u, /ਖੰਭ/u, /पेड़/u, /ਦਰੱਖਤ/u],
  ["TRG-002-QL-077", /मीनार/u, /ਮੀਨਾਰ/u, /इमारत/u, /ਇਮਾਰਤ/u],
  ["TRG-002-QL-092", /मीनार/u, /ਮੀਨਾਰ/u, /मंच/u, /ਮੰਚ/u],
  ["TRG-002-QL-094", /मीनार/u, /ਮੀਨਾਰ/u, /मंच/u, /ਮੰਚ/u],
] as const;
for (const [qlId, hiRequired, paRequired, hiForbidden, paForbidden] of entityChecks) {
  const hi: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-semantic-entity", "hi-IN");
  const pa: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-semantic-entity", "pa-IN");
  assert(hiRequired.test(hi.stem), `${qlId}: Hindi entity identity drifted.`);
  assert(paRequired.test(pa.stem), `${qlId}: Punjabi entity identity drifted.`);
  assert(!hiForbidden.test(hi.stem), `${qlId}: Hindi retained the wrong localized entity.`);
  assert(!paForbidden.test(pa.stem), `${qlId}: Punjabi retained the wrong localized entity.`);
}

for (const qlId of ["TRG-002-QL-049", "TRG-002-QL-052", "TRG-002-QL-055", "TRG-002-QL-071", "TRG-002-QL-072"]) {
  const hi: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-semantic-collinear", "hi-IN");
  const pa: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-semantic-collinear", "pa-IN");
  assert(hi.stem.includes("एक ही सीधी रेखा"), `${qlId}: Hindi lost the English collinearity constraint.`);
  assert(pa.stem.includes("ਇੱਕੋ ਸਿੱਧੀ ਰੇਖਾ"), `${qlId}: Punjabi lost the English collinearity constraint.`);
}
{
  const hi: any = generateTrg002V4CandidateQuestion("TRG-002-QL-070", "trg002-v4-semantic-ray", "hi-IN");
  const pa: any = generateTrg002V4CandidateQuestion("TRG-002-QL-070", "trg002-v4-semantic-ray", "pa-IN");
  assert(hi.stem.includes("एक ही किरण"), "QL070 Hindi must preserve same-ray geometry.");
  assert(pa.stem.includes("ਇੱਕੋ ਕਿਰਣ"), "QL070 Punjabi must preserve same-ray geometry.");
}
for (const qlId of ["TRG-002-QL-088", "TRG-002-QL-091"]) {
  const hi: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-semantic-level", "hi-IN");
  const pa: any = generateTrg002V4CandidateQuestion(qlId, "trg002-v4-semantic-level", "pa-IN");
  assert(hi.stem.includes("एक ही समतल जमीन"), `${qlId}: Hindi lost same-level-ground geometry.`);
  assert(pa.stem.includes("ਇੱਕੋ ਸਮਤਲ ਜ਼ਮੀਨ"), `${qlId}: Punjabi lost same-level-ground geometry.`);
}
{
  const hi: any = generateTrg002V4CandidateQuestion("TRG-002-QL-082", "trg002-v4-semantic-opposite", "hi-IN");
  const pa: any = generateTrg002V4CandidateQuestion("TRG-002-QL-082", "trg002-v4-semantic-opposite", "pa-IN");
  assert(hi.stem.includes("विपरीत ओर"), "QL082 Hindi must preserve opposite-side geometry without adding a baseline-survey scenario.");
  assert(pa.stem.includes("ਉਲਟ ਪਾਸਿਆਂ"), "QL082 Punjabi must preserve opposite-side geometry without adding a baseline-survey scenario.");
  assert(!/आधार-रेखा सर्वेक्षण/u.test(hi.stem), "QL082 Hindi must not invent a baseline-survey scenario absent from English.");
  assert(!/ਅਧਾਰ-ਰੇਖਾ ਸਰਵੇਖਣ/u.test(pa.stem), "QL082 Punjabi must not invent a baseline-survey scenario absent from English.");
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const q: any = generateTrg002V4CandidateQuestion("TRG-002-QL-061", "trg002-v4-semantic-061", locale);
  assert(!q.stem.includes("10 m"), `QL061:${locale}: derived 10 m must not be introduced into the stem as a given.`);
  const solution = q.explanation.steps.map((step: any) => step.body).join(" ");
  assert(solution.includes("x"), `QL061:${locale}: explanation must derive the original distance algebraically.`);
  assert(solution.includes("x+20"), `QL061:${locale}: explanation must model the increased distance.`);
  assert(solution.includes("x=10"), `QL061:${locale}: 10 m must appear only as the solved value.`);
}

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const q: any = generateTrg002V4CandidateQuestion("TRG-002-QL-076", "trg002-v4-semantic-076", locale);
  const learner = [q.stem, q.explanation.keyRule, ...q.explanation.steps.map((step: any) => step.body), q.explanation.shortcut, ...q.explanation.traps].join(" ");
  assert(q.stem.includes("16.5 m"), `QL076:${locale}: building height must remain 16.5 m.`);
  assert(!learner.includes("31.5"), `QL076:${locale}: corrupted 31.5 m value must be absent from all learner text.`);
  assert(learner.includes("16.5−1.5=15"), `QL076:${locale}: eye-height correction must use 16.5−1.5=15.`);
}

console.log(`TRG002_V4_SEMANTIC_PARITY_PASS remediated=${TRG_002_V4_STRICT_SEMANTIC_PARITY_IDS.length} locales=2 exactness=7 entityChecks=5 loadBearingGeometry=9 factualCorruptions=2`);
