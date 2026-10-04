import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import { STC_V22_TEMPLATES_BY_QL } from "./editorial-v2-2-templates.ts";
import { generateStcV22Question, STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL } from "./editorial-v2-2-generator.ts";
import {
  STC_V22_INDEPENDENT_PROOF_AUTHORITY,
  STC_V22_TEMPLATE_PROOFS,
  assertStcV22TemplateProofContract,
  getStcV22IndependentProof,
  stcV22SemanticSignature,
} from "./editorial-v2-2-independent-proof.ts";
import { STC_001_V22_QUESTION_STUDIO_PACKAGE_ID } from "./question-studio-review-v2-2.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly StcLocale[];

const allTemplates = STC_QL_IDS.flatMap((qlId) => STC_V22_TEMPLATES_BY_QL[qlId]);
assert.equal(allTemplates.length, 48, "STC V2.2 must retain exactly 48 reviewed semantic templates");
assert.equal(Object.keys(STC_V22_TEMPLATE_PROOFS).length, 48, "Independent proof registry must cover every V2.2 template");

for (const template of allTemplates) {
  const proof = assertStcV22TemplateProofContract(template);
  assert.equal(proof.qlId, template.qlId, template.id);
  assert.equal(proof.answerClass, template.answerClass, template.id);
}

const firstTemplate = allTemplates[0]!;
assert.throws(
  () => assertStcV22TemplateProofContract({
    ...firstTemplate,
    answerClass: firstTemplate.answerClass === "ONLY_I" ? "NEITHER" : "ONLY_I",
  }),
  /disagrees with independent proof/i,
  "An authored answer-key drift must fail closed",
);

assert.equal(
  stcV22SemanticSignature(firstTemplate),
  getStcV22IndependentProof(firstTemplate.id).semanticSignature,
);
assert.throws(
  () => assertStcV22TemplateProofContract({
    ...firstTemplate,
    statement: {
      ...firstTemplate.statement,
      "en-IN": `${firstTemplate.statement["en-IN"]} Changed.`,
    },
  }),
  /semantic skeleton drift/i,
  "A semantic-text edit must fail closed even when answerClass is unchanged",
);

const bannedLearnerSurface = [
  /चुका\/चुकी/u,
  /ਚੁੱਕਾ\/ਚੁੱਕੀ/u,
  /survey of \d+ surveyed account holders/iu,
  /survey of \d+ registered users surveyed/iu,
  /afternoon refreshments continues/iu,
  /improved downward/iu,
  /average turnaround time reduced/iu,
  /Notice:[^\n]+\. (?:online|the online|advance online)/u,
  /नवीनतम महीना में/u,
  /आने वाला महीना में/u,
  /अगला समीक्षा चक्र में/u,
  /सबसे हाल का चक्र में/u,
  /ਤਾਜ਼ਾ ਮਹੀਨਾ ਵਿੱਚ/u,
  /ਆਉਣ ਵਾਲਾ ਮਹੀਨਾ ਵਿੱਚ/u,
  /ਅਗਲਾ ਸਮੀਖਿਆ ਚੱਕਰ ਵਿੱਚ/u,
  /उपलब्ध रहेगी: ऑनलाइन आरक्षण पोर्टल/u,
  /ਉਪਲਬਧ ਰਹੇਗੀ: ਆਨਲਾਈਨ ਰਿਜ਼ਰਵੇਸ਼ਨ ਪੋਰਟਲ/u,
  /प्रदान नहीं कर रहा/u,
  /ਪ੍ਰਦਾਨ ਨਹੀਂ ਕਰ ਰਿਹਾ/u,
  /का घटना निश्चित/u,
  /ਦਾ ਘਟਣਾ ਨਿਸ਼ਚਿਤ/u,
  /हो चुका\/चुकी/u,
  /ਹੋ ਚੁੱਕਾ\/ਚੁੱਕੀ/u,
  /करता\/करती/u,
  /ਕਰਦਾ\/ਕਰਦੀ/u,
  /मरम्मत की गई के बाद/u,
  /ਮੁਰੰਮਤ ਕੀਤੀ ਗਈ ਤੋਂ ਬਾਅਦ/u,
  /बैटरी .* चलती है, अधिक नहीं/u,
  /ਬੈਟਰੀ .* ਚੱਲਦੀ ਹੈ, ਵੱਧ ਨਹੀਂ/u,
  /बाधित कर सकती हैं/u,
  /ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦੇ ਹਨ/u,
  /संशोधित जा सकता/u,
  /पुनर्निर्धारित जा सकता/u,
  /तेज संसाधित किया/u,
  /ਤੇਜ਼ ਪ੍ਰਕਿਰਿਆ ਕੀਤਾ/u,
  /बड़्हत|बढ़त देती हैं/u,
  /ਬੜ੍ਹਤ/u,
  /दर पर .* से आगे हो गया/u,
  /ਦਰ ਤੇ .* ਤੋਂ ਅੱਗੇ ਨਿਕਲ ਗਿਆ/u,
] as const;

let auditedSurfaceCount = 0;
for (const qlId of STC_QL_IDS) {
  for (let seed = 0; seed < STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL; seed += 1) {
    const en = generateStcV22Question({ qlId, locale: "en-IN", seed });
    const proof = getStcV22IndependentProof(en.templateId);
    assert.equal(en.metadata.independentProofVerified, true, `${qlId}/${seed}`);
    assert.equal(en.metadata.independentProofAuthority, STC_V22_INDEPENDENT_PROOF_AUTHORITY);
    assert.equal(en.metadata.independentProofMechanism, proof.mechanism);

    for (const locale of LOCALES) {
      const question = locale === "en-IN" ? en : generateStcV22Question({ qlId, locale, seed });
      const learnerText = [question.stem, ...question.conclusions, question.explanation].join("\n");
      for (const banned of bannedLearnerSurface) {
        assert.doesNotMatch(learnerText, banned, `${qlId}/${locale}/${seed}: learner-surface regression ${String(banned)}`);
      }
      assert.equal(question.metadata.independentProofVerified, true);
      assert.equal(question.metadata.questionBankWritable, false);
      assert.equal(question.metadata.testEligible, false);
      assert.equal(question.metadata.mockEligible, false);
      assert.equal(question.metadata.publicEligible, false);
      assert.equal(question.metadata.automaticPublication, false);
      auditedSurfaceCount += 1;
    }
  }
}
assert.equal(auditedSurfaceCount, 6 * 2048 * 3);

// Cross-product invariants whose values could otherwise change the entailment class.
function numericValues(templateId: string, dimensionIndex: number): number[] {
  const template = allTemplates.find((entry) => entry.id === templateId);
  assert.ok(template, templateId);
  return template.dimensions[dimensionIndex]!.map((value) => {
    const match = value["en-IN"].replaceAll(",", "").match(/\d+(?:\.\d+)?/u);
    assert.ok(match, `${templateId}: expected numeric dimension`);
    return Number(match[0]);
  });
}

for (const total of numericValues("STC-V22-QL001-T07", 1)) {
  for (const reserved of numericValues("STC-V22-QL001-T07", 2)) {
    assert.ok(reserved < total / 2, "QL001-T07 reservation must stay below half for every cross-product");
  }
}
for (const lower of numericValues("STC-V22-QL005-T02", 0)) {
  for (const higher of numericValues("STC-V22-QL005-T02", 1)) {
    assert.ok(higher > lower, "QL005-T02 second percentage must stay higher");
  }
}
const ql005T03A = numericValues("STC-V22-QL005-T03", 0);
const ql005T03B = numericValues("STC-V22-QL005-T03", 1);
const ql005T03C = numericValues("STC-V22-QL005-T03", 2);
assert.ok(Math.min(...ql005T03A) > Math.max(...ql005T03B), "QL005-T03 A must always exceed B");
assert.ok(Math.min(...ql005T03B) > Math.max(...ql005T03C), "QL005-T03 B must always exceed C");
for (const major of numericValues("STC-V22-QL005-T07", 0)) {
  for (const minor of numericValues("STC-V22-QL005-T07", 1)) {
    assert.ok(major > minor, "QL005-T07 primary score weight must always exceed secondary weight");
  }
}
for (const templateId of ["STC-V22-QL006-T01", "STC-V22-QL006-T03"] as const) {
  const template = allTemplates.find((entry) => entry.id === templateId)!;
  for (const value of template.dimensions[0]) {
    const numbers = [...value["en-IN"].replaceAll(",", "").matchAll(/\d+(?:\.\d+)?/gu)].map((match) => Number(match[0]));
    if (templateId.endsWith("T01")) {
      assert.equal(numbers.length, 4);
      assert.ok(numbers[2]! > numbers[0]! && numbers[2]! > numbers[1]! && numbers[2]! > numbers[3]!, "QL006-T01 third value must stay highest");
      assert.ok(numbers[3]! < numbers[2]!, "QL006-T01 final value must fall from third");
    }
  }
}
for (let index = 0; index < 4; index += 1) {
  const first = numericValues("STC-V22-QL006-T03", 0)[index]!;
  const second = numericValues("STC-V22-QL006-T03", 1)[index]!;
  const third = numericValues("STC-V22-QL006-T03", 2)[index]!;
  assert.ok(first > second && second > third, "QL006-T03 decline order must remain strict");
}

const packages = reasoningV1QuestionStudioAdapter.listPackages();
const stcPackages = packages.filter((entry) => entry.packageId === STC_001_V22_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(stcPackages.length, 1, "Current reasoning-v1 adapter must expose STC V2.2 exactly once");
assert.equal(stcPackages[0]!.lifecycleStage, "REVIEW_ONLY");
assert.equal(stcPackages[0]!.questionBankWritable, false);
assert.equal(stcPackages[0]!.testEligible, false);
assert.equal(stcPackages[0]!.mockTestEligible, false);
assert.equal(stcPackages[0]!.publiclyPublishable, false);
assert.equal(stcPackages[0]!.automaticStudentPublication, false);
assert.deepEqual(stcPackages[0]!.cpIds, ["STC-CP-001", "STC-CP-002", "STC-CP-003"]);

const standardBatch = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: STC_001_V22_QUESTION_STUDIO_PACKAGE_ID,
  language: "pa",
  difficulty: "Mixed",
  count: 12,
  seed: "stc-post-closure-adapter-audit",
});
assert.equal(standardBatch.questions.length, 12);
assert.ok(standardBatch.questions.every((question) => question.packageId === STC_001_V22_QUESTION_STUDIO_PACKAGE_ID));
assert.ok(standardBatch.questions.every((question) => question.reviewOnly === true));
assert.ok(standardBatch.questions.every((question) => question.questionBankWritable === false));
assert.ok(standardBatch.questions.every((question) =>
  (question.validation as { independentProofVerified?: boolean } | undefined)?.independentProofVerified === true,
));
assert.ok(standardBatch.questions.every((question) => String(question.stem).includes("ਕਥਨ:")));
assert.ok(standardBatch.questions.every((question) => !String(question.stem).includes("Statement:")));

const cpBatch = await reasoningV1QuestionStudioAdapter.generate({
  engineId: "reasoning-v1",
  packageId: STC_001_V22_QUESTION_STUDIO_PACKAGE_ID,
  patternId: "STC-CP-002",
  language: "en",
  difficulty: "Hard",
  count: 8,
  seed: "stc-cp002-hard-audit",
});
assert.equal(cpBatch.questions.length, 8);
assert.ok(cpBatch.questions.every((question) => ["STC-QL-003", "STC-QL-004"].includes(String(question.qlId))));
assert.ok(cpBatch.questions.every((question) => question.difficulty === "Hard"));

console.log(JSON.stringify({
  status: "PASS_STC_001_POST_CLOSURE_AUDIT_20261003",
  permanentQls: STC_QL_IDS.length,
  templates: allTemplates.length,
  auditedTrilingualSurfaces: auditedSurfaceCount,
  independentProofAuthority: STC_V22_INDEPENDENT_PROOF_AUTHORITY,
  standardQuestionStudioAdapter: "REGISTERED_REVIEW_ONLY",
  learnerRelease: "LOCKED",
}, null, 2));
