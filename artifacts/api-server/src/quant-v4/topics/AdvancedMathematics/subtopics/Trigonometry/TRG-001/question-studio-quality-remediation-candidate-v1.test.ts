import assert from "node:assert/strict";

import {
  generateApprovedTrg001QuestionStudioQuestion,
} from "./question-studio-runtime";
import {
  TRG_001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V1,
  generateQualityRemediatedTrg001QuestionStudioBatch,
  generateQualityRemediatedTrg001QuestionStudioQuestion,
} from "./question-studio-quality-remediation-candidate-v1";

const seed = "quant-v4-trg-quality-remediation-v1";

const base = generateApprovedTrg001QuestionStudioQuestion("TRG-001-QL-094", seed, "en");
const candidate = generateQualityRemediatedTrg001QuestionStudioQuestion("TRG-001-QL-094", seed, "en");

assert.equal(candidate.stem, base.stem);
assert.deepEqual(candidate.options, base.options);
assert.equal(candidate.correctIndex, base.correctIndex);
assert.equal(candidate.answer, base.answer);
assert.equal(candidate.canonicalAnswer, base.canonicalAnswer);
assert.equal(candidate.packageExplanation, base.packageExplanation);
assert.ok(String(base.explanation).includes("Shortcut:"), "Baseline should expose the Shortcut block so this regression proves the remediation.");
assert.ok(String(base.explanation).includes("Common trap:"), "Baseline should expose the Common trap block so this regression proves the remediation.");
assert.ok(!String(candidate.explanation).includes("Shortcut:"), "Candidate learner explanation must omit Shortcut boilerplate.");
assert.ok(!String(candidate.explanation).includes("Common trap:"), "Candidate learner explanation must omit Common trap boilerplate.");
assert.ok(String(candidate.explanation).includes("Core rule:"));
assert.ok(String(candidate.explanation).includes("Step"));
assert.ok(candidate.packageExplanation?.shortcut, "Editorial shortcut metadata must remain available outside the learner explanation.");
assert.ok((candidate.packageExplanation?.traps ?? []).length > 0, "Editorial trap metadata must remain available outside the learner explanation.");
assert.equal(candidate.reviewStatus, "QUALITY_REMEDIATION_CANDIDATE_V1");
assert.equal(candidate.activationAuthorized, false);
assert.equal(candidate.questionStudioDiscoverable, false);
assert.equal(candidate.publicReleaseAuthorized, false);

for (const [language, shortcutLabel, trapLabel] of [
  ["hi", "शॉर्टकट", "सामान्य गलती"],
  ["pa", "ਸ਼ਾਰਟਕੱਟ", "ਆਮ ਗਲਤੀ"],
] as const) {
  const localizedBase = generateApprovedTrg001QuestionStudioQuestion("TRG-001-QL-094", `${seed}:${language}`, language);
  const localizedCandidate = generateQualityRemediatedTrg001QuestionStudioQuestion("TRG-001-QL-094", `${seed}:${language}`, language);
  assert.ok(String(localizedBase.explanation).includes(shortcutLabel));
  assert.ok(String(localizedBase.explanation).includes(trapLabel));
  assert.ok(!String(localizedCandidate.explanation).includes(shortcutLabel));
  assert.ok(!String(localizedCandidate.explanation).includes(trapLabel));
  assert.equal(localizedCandidate.stem, localizedBase.stem);
  assert.deepEqual(localizedCandidate.options, localizedBase.options);
  assert.equal(localizedCandidate.correctIndex, localizedBase.correctIndex);
  assert.equal(localizedCandidate.packageExplanation, localizedBase.packageExplanation);
}

const batch: any = generateQualityRemediatedTrg001QuestionStudioBatch({
  cpId: "TRG-CP-004",
  language: "en",
  seed: `${seed}:batch`,
  count: 8,
});
assert.equal(batch.questions.length, 8);
for (const question of batch.questions) {
  assert.ok(!String(question.explanation).includes("Shortcut:"));
  assert.ok(!String(question.explanation).includes("Common trap:"));
  assert.equal(question.activationAuthorized, false);
  assert.equal(question.questionStudioDiscoverable, false);
}
assert.equal(batch.generationContext.reviewStatus, "QUALITY_REMEDIATION_CANDIDATE_V1");
assert.equal(batch.generationContext.activationAuthorized, false);
assert.equal(
  TRG_001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V1.status,
  "AUDIT_CANDIDATE_NOT_ACTIVATED",
);

console.log(JSON.stringify({
  status: "PASS_TRG001_QUESTION_STUDIO_QUALITY_REMEDIATION_CANDIDATE_V1",
  learnerExplanationPolicy: "CORE_RULE_AND_WORKED_STEPS_ONLY",
  editorialMetadataPreserved: true,
  activationAuthorized: false,
}, null, 2));
