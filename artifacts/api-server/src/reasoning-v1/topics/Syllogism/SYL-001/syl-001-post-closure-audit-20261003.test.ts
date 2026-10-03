import assert from "node:assert/strict";

import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter";
import {
  SYL_001_STANDARD_QUESTION_STUDIO_PACKAGE,
  generateSyl001QuestionStudioBatch,
} from "./question-studio-integration";
import { SYL_001_CHAPTER_AUTHORITY } from "./manifest";
import { generateSylQuestionV5 } from "./runtime/generator-v5";
import { SYL_QL_REGISTRY } from "./runtime/ql-registry";
import type { SylLocale } from "./foundation/types";

assert.equal(SYL_QL_REGISTRY.length, 18);
assert.equal(SYL_001_CHAPTER_AUTHORITY.permanentQlCount, 18);
assert.equal(SYL_001_CHAPTER_AUTHORITY.acceptedGeneratorVersion, "generator-v5");
assert.equal(SYL_001_CHAPTER_AUTHORITY.questionBankWritable, false);
assert.equal(SYL_001_CHAPTER_AUTHORITY.testEligible, false);
assert.equal(SYL_001_CHAPTER_AUTHORITY.publiclyPublishable, false);
assert.equal(SYL_001_CHAPTER_AUTHORITY.exactHistoricalSourceWeightFreezeApproved, false);
assert.equal(SYL_001_CHAPTER_AUTHORITY.difficultyCalibrationFrozen, false);

const registered = reasoningV1QuestionStudioAdapter
  .listPackages()
  .find((pkg) => pkg.packageId === "SYL-001");
assert.ok(registered, "SYL-001 must be registered in the current reasoning-v1 adapter.");
assert.equal(registered?.lifecycleStage, "REVIEW_ONLY");
assert.equal(registered?.questionBankWritable, false);
assert.equal(registered?.testEligible, false);
assert.equal(registered?.mockTestEligible, false);
assert.equal(registered?.publiclyPublishable, false);
assert.deepEqual(registered?.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(registered?.supportedDifficulties, ["Easy", "Medium", "Hard"]);

const canonical = await reasoningV1QuestionStudioAdapter.generate({
  packageId: "SYL-001",
  language: "en",
  count: 4,
  seed: "syl-post-closeout-canonical",
});
assert.deepEqual(
  canonical.questions.map((question) => question.qlId),
  ["SYL-QL-001", "SYL-QL-003", "SYL-QL-004", "SYL-QL-008"],
  "Default SYL review must surface the four canonical legacy mock archetypes first.",
);

for (const language of ["en", "hi", "pa"] as const) {
  for (const ql of SYL_QL_REGISTRY) {
    const batch = await generateSyl001QuestionStudioBatch({
      packageId: "SYL-001",
      patternId: ql.qlId,
      language,
      count: 1,
      seed: "syl-post-closeout:" + ql.qlId + ":" + language,
    });
    assert.equal(batch.questions.length, 1);
    const question = batch.questions[0]!;
    assert.equal(question.packageId, "SYL-001");
    assert.equal(question.qlId, ql.qlId);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.ok(String(question.stem).length > 20);
    assert.ok(
      Array.isArray(question.options)
        && question.options.length >= 3
        && question.options.length <= 5,
      "SYL review options must preserve the audited 3-5 option semantic space.",
    );
    assert.ok(Number(question.correctIndex) >= 0);
    assert.ok(String(question.explanation).length > 20);
  }
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let enabled = 0;
let omitted = 0;
let sharedGeometry = 0;
let supplementalGeometry = 0;

for (const ql of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 24; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(ql.qlId, seed, locale);
      const diagram = question.learnerPresentationV5.diagram;
      if (!diagram.enabled) {
        omitted += 1;
        assert.equal(diagram.mode, "OMITTED_NOT_USEFUL");
        assert.equal(diagram.svg, null);
        continue;
      }
      enabled += 1;
      const svg = diagram.svg ?? "";
      assert.match(svg, /data-learner-safe-venn="true"/u);
      assert.match(svg, /viewBox="0 0 340 210"/u);
      assert.doesNotMatch(svg, /node-link|arrow map|relation-map/iu);
      const catalog = svg.match(/data-geometry-catalog="([^"]+)"/u)?.[1];
      assert.ok(catalog === "ven-001-logical-v1" || catalog === "syl-001-supplement-v1");
      if (catalog === "ven-001-logical-v1") sharedGeometry += 1;
      else supplementalGeometry += 1;
    }
  }
}

assert.ok(enabled > 0);
assert.ok(omitted > 0);
assert.ok(sharedGeometry > 0, "Syllogism did not reuse any VEN-001 Logical Venn geometry.");
assert.equal(sharedGeometry + supplementalGeometry, enabled);

console.log(JSON.stringify({
  status: "PASS_SYL_001_POST_CLOSURE_AUDIT_20261003",
  compatibilityQlCount: SYL_QL_REGISTRY.length,
  canonicalLegacyMockArchetypes: ["SYL-QL-001", "SYL-QL-003", "SYL-QL-004", "SYL-QL-008"],
  currentQuestionStudioAdapter: "reasoning-v1",
  diagramAudit: {
    enabled,
    omitted,
    sharedLogicalVennGeometry: sharedGeometry,
    syllogismSupplementGeometry: supplementalGeometry,
  },
  retainedGates: {
    exactHistoricalSourceWeightFreeze: false,
    productionDifficultyCalibration: false,
    questionBank: false,
    tests: false,
    publicDelivery: false,
  },
}, null, 2));
