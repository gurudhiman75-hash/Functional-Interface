import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V5,
} from "../foundation/spatial/spatial-question-studio-integration-v5";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V4,
} from "../foundation/spatial/spatial-question-studio-integration-v4";
import {
  generateSpatialProductionStudioBatchV5,
  generateSpatialProductionStudioQuestionV5,
} from "../foundation/spatial/spatial-question-studio-production-v5";
import {
  generateSpatialProductionStudioQuestionV4,
} from "../foundation/spatial/spatial-question-studio-production-v4";

const CND_QLS = ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045"] as const;
const LANGUAGES = ["en", "hi", "pa"] as const;

assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.permanentQlCount, 45);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds.length, 45);
assert.deepEqual(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.qlIds.slice(-3), CND_QLS);
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.chapters.includes("CND-001"));
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.cubesDicePermanentQlCount, 3);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.manualApprovalRequired, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V5.automaticStudentPublication, false);
assert.strictEqual(SPATIAL_QUESTION_STUDIO_PACKAGE_V4, SPATIAL_QUESTION_STUDIO_PACKAGE_V5);

let cndSurfaceChecks = 0;
let scalarTextChecks = 0;
let numericChecks = 0;
const fingerprints = new Set<string>();

for (const qlId of CND_QLS) {
  for (let index = 0; index < 18; index += 1) {
    const seed = `CND-STANDARD-INTEGRATION:${qlId}:${index}`;
    const english = generateSpatialProductionStudioQuestionV5({ qlId, seed, language: "en" });
    for (const language of LANGUAGES) {
      const current = generateSpatialProductionStudioQuestionV5({ qlId, seed, language });
      const compatibility = generateSpatialProductionStudioQuestionV4({ qlId, seed, language });
      assert.deepEqual(compatibility, current, `${qlId}/${language}: v4 compatibility surface diverged from v5.`);
      assert.equal(current.qlId, qlId);
      assert.equal(current.chapterCode, "CND-001");
      assert.equal(current.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority);
      assert.equal(current.lifecycle.questionStudioDiscoverable, true);
      assert.equal(current.lifecycle.registrationStatus, "REGISTERED");
      assert.equal(current.lifecycle.persistenceAllowed, true);
      assert.equal(current.lifecycle.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(current.lifecycle.testEligible, true);
      assert.equal(current.lifecycle.manualApprovalRequired, true);
      assert.equal(current.lifecycle.automaticStudentPublication, false);
      assert.equal(current.stimulusSvgs.length, 1);
      assert.match(current.stimulusSvgs[0], /^<svg\b/i);
      assert.equal(current.options.length, 4);
      assert.equal(new Set(current.options.map(String)).size, 4);
      assert.deepEqual(current.optionLabels, current.options);
      assert.equal(current.options[current.correctIndex], current.canonicalAnswer);
      assert.equal(current.answer, current.canonicalAnswer);
      assert.ok(current.explanation.whatIsGiven.length > 0);
      assert.ok(current.explanation.howToReason.length > 0);
      assert.ok(current.explanation.conclusion.length > 0);
      assert.equal(current.explanation.observation, current.explanation.whatIsGiven);
      assert.equal(current.explanation.rule, current.explanation.howToReason);
      assert.equal(current.explanation.application, current.explanation.howToReason);
      assert.equal(current.explanation.check, current.explanation.conclusion);
      assert.equal(current.contentFingerprint, english.contentFingerprint);
      assert.equal(current.canonicalItemId, english.canonicalItemId);

      if (qlId === "SPA-QL-045") {
        assert.equal(current.renderer.kind, "SVG_WITH_NUMERIC_OPTIONS");
        assert.ok(current.options.every((option) => typeof option === "number" && Number.isFinite(option)));
        numericChecks += 1;
      } else {
        assert.equal(current.renderer.kind, "SVG_WITH_SCALAR_OPTIONS");
        assert.ok(current.options.every((option) => typeof option === "string" && option.trim().length > 0));
        scalarTextChecks += 1;
      }
      cndSurfaceChecks += 1;
    }
    fingerprints.add(english.contentFingerprint);
  }
}

assert.equal(cndSurfaceChecks, 162);
assert.equal(scalarTextChecks, 108);
assert.equal(numericChecks, 54);
assert.equal(fingerprints.size, 54);

const fct = generateSpatialProductionStudioQuestionV4({
  qlId: "SPA-QL-042",
  seed: "CND-STANDARD-LEGACY-FCT",
  language: "pa",
});
assert.equal(fct.qlId, "SPA-QL-042");
assert.equal(fct.chapterCode, "FCT-001");
assert.equal(fct.renderer.kind, "SVG_WITH_NUMERIC_OPTIONS");
assert.equal(fct.lifecycle.manualApprovalRequired, true);
assert.equal(fct.lifecycle.automaticStudentPublication, false);

const legacy = generateSpatialProductionStudioQuestionV4({
  qlId: "SPA-QL-041",
  seed: "CND-STANDARD-LEGACY-EMB",
  language: "hi",
});
assert.equal(legacy.qlId, "SPA-QL-041");
assert.equal(legacy.chapterCode, "EMB-001");
assert.ok("optionSvgs" in legacy && Array.isArray(legacy.optionSvgs));
assert.equal(legacy.lifecycle.manualApprovalRequired, true);
assert.equal(legacy.lifecycle.automaticStudentPublication, false);

for (const language of LANGUAGES) {
  const batch = generateSpatialProductionStudioBatchV5({
    seed: `CND-STANDARD-BATCH:${language}`,
    chapterCode: "CND-001",
    language,
    count: 30,
  });
  assert.equal(batch.questions.length, 30);
  assert.equal(new Set(batch.questions.map((question) => question.contentFingerprint)).size, 30);
  assert.ok(batch.questions.every((question) => question.chapterCode === "CND-001"));
  assert.ok(batch.questions.every((question) => CND_QLS.includes(question.qlId as (typeof CND_QLS)[number])));
  assert.equal(batch.generationContext.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority);
  assert.equal(batch.generationContext.manualApprovalRequired, true);
  assert.equal(batch.generationContext.automaticStudentPublication, false);
}

const result = {
  status: "PASS_CND_001_STANDARD_QUESTION_STUDIO_INTEGRATION_V1",
  integrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.integrationAuthority,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V5.permanentQlCount,
  activatedPermanentQlIds: CND_QLS,
  languages: LANGUAGES,
  cndSurfaceChecks,
  scalarTextChecks,
  numericChecks,
  canonicalUniqueFingerprints: fingerprints.size,
  compatibility: {
    stableV4PackageSurfaceDelegatesToV5: true,
    stableV4ProductionSurfaceDelegatesToV5: true,
    fctQl042Preserved: true,
    preFctQl041Preserved: true,
  },
  governance: {
    manualApprovalRequired: true,
    futureGeneratedItemsAutomaticallyApproved: false,
    automaticStudentPublication: false,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-cnd-001-standard-question-studio-integration-v1-evidence.json",
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(result, null, 2));
