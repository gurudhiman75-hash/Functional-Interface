import assert from "node:assert/strict";

import {
  ARG_CP003_SEMANTIC_SURFACE_CAPACITY_PER_QL,
  ARG_CP003_TEMPLATE_COUNT_PER_QL,
  ARG_CP003_VARIANTS_PER_TEMPLATE,
} from "./cp003-generator.ts";
import { ARG_CP003_TEMPLATES_BY_QL } from "./cp003-templates.ts";
import {
  ARG_CP004_LOCALIZED_TEMPLATE_COUNT_PER_LOCALE,
  ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE,
} from "./cp004-localized-templates.ts";
import {
  ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE,
  generateArg001QuestionStudioBatch,
} from "./cp005-question-studio-integration.ts";
import {
  ARG_CP006_FROZEN_BLOBS,
  ARG_CP006_FROZEN_CONTRACT,
} from "./cp006-freeze-manifest.ts";
import { ARG_QL_IDS, type ArgAnswerClass } from "./types.ts";

const ANSWERS: readonly ArgAnswerClass[] = ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"];

async function main() {
  const frozen = ARG_CP006_FROZEN_CONTRACT;

  assert.equal(frozen.chapterId, "ARG-001");
  assert.equal(frozen.subjectCode, "REAS-ARG");
  assert.equal(frozen.checkpointId, "ARG-CP-006");
  assert.equal(frozen.authority, "ARG_CP006_IMMUTABLE_FREEZE_V1");
  assert.equal(frozen.status, "FROZEN_CERTIFIED");
  assert.deepEqual(frozen.permanentQlIds, ARG_QL_IDS);
  assert.deepEqual(frozen.answerClasses, ANSWERS);
  assert.deepEqual(frozen.locales, ["en-IN", "hi-IN", "pa-IN"]);
  assert.deepEqual(frozen.questionStudioLanguages, ["en", "hi", "pa"]);
  assert.deepEqual(frozen.difficulties, ["Easy", "Medium", "Hard"]);
  assert.equal(frozen.sourceTemplateCount, 48);
  assert.equal(frozen.sourceTemplatesPerQl, 8);
  assert.deepEqual(frozen.difficultyDistribution, { Easy: 13, Medium: 15, Hard: 20 });
  assert.equal(frozen.semanticVariantsPerTemplate, 256);
  assert.equal(frozen.semanticSurfacesPerQl, 2048);
  assert.equal(frozen.englishSemanticSurfaceCount, 12_288);
  assert.equal(frozen.trilingualSemanticSurfaceCount, 36_864);
  assert.equal(frozen.localizedTemplateCountPerLocale, 48);
  assert.equal(frozen.localizedOverlayCount, 96);
  assert.equal(frozen.maximumIdenticalAnswerRun, 2);
  assert.equal(frozen.argumentOrderReversalPerTemplate, 128);

  assert.equal(ARG_CP003_TEMPLATE_COUNT_PER_QL, frozen.sourceTemplatesPerQl);
  assert.equal(ARG_CP003_VARIANTS_PER_TEMPLATE, frozen.semanticVariantsPerTemplate);
  assert.equal(ARG_CP003_SEMANTIC_SURFACE_CAPACITY_PER_QL, frozen.semanticSurfacesPerQl);
  assert.equal(ARG_CP004_LOCALIZED_TEMPLATE_COUNT_PER_LOCALE, frozen.localizedTemplateCountPerLocale);

  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  let sourceTemplates = 0;

  for (const qlId of ARG_QL_IDS) {
    const templates = ARG_CP003_TEMPLATES_BY_QL[qlId];
    assert.equal(templates.length, 8, `${qlId}: frozen template count drift`);
    sourceTemplates += templates.length;

    const archetypes = new Set<string>();
    const answerCounts = new Map<ArgAnswerClass, number>(ANSWERS.map((answer) => [answer, 0]));
    const difficultySet = new Set<string>();

    for (let index = 0; index < templates.length; index += 1) {
      const template = templates[index]!;
      assert.equal(template.id, `ARG-CP003-${qlId.slice(4)}-T${String(index + 1).padStart(2, "0")}`, `${qlId}: frozen template-id ordering drift`);
      assert.equal(template.qlId, qlId, `${template.id}: QL ownership drift`);
      assert.ok(!archetypes.has(template.archetype), `${template.id}: duplicate frozen archetype`);
      archetypes.add(template.archetype);
      answerCounts.set(template.answerClass, (answerCounts.get(template.answerClass) ?? 0) + 1);

      if (template.difficulty === "EASY") difficultyCounts.Easy += 1;
      else if (template.difficulty === "MEDIUM") difficultyCounts.Medium += 1;
      else difficultyCounts.Hard += 1;
      difficultySet.add(template.difficulty);
    }

    assert.equal(archetypes.size, 8, `${qlId}: frozen archetype count drift`);
    assert.deepEqual([...difficultySet].sort(), ["EASY", "HARD", "MEDIUM"], `${qlId}: frozen difficulty coverage drift`);
    for (const answer of ANSWERS) {
      assert.equal(answerCounts.get(answer), 2, `${qlId}: ${answer} must remain represented by exactly two source authorities`);
    }

    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const localized = ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE[locale][qlId];
      assert.equal(localized.length, 8, `${locale}/${qlId}: frozen localization overlay count drift`);
      assert.deepEqual(
        localized.map((entry) => entry.id),
        templates.map((entry) => entry.id),
        `${locale}/${qlId}: localized template identity/order drift`,
      );
    }
  }

  assert.equal(sourceTemplates, frozen.sourceTemplateCount);
  assert.deepEqual(difficultyCounts, frozen.difficultyDistribution);

  const pkg = ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE;
  assert.equal(pkg.packageId, "ARG-001");
  assert.equal(pkg.integrationCheckpointId, "ARG-CP-005");
  assert.equal(pkg.runtimeMode, frozen.questionStudioRuntimeMode);
  assert.equal(pkg.reviewStatus, frozen.questionStudioReviewStatus);
  assert.deepEqual(pkg.permanentQlIds, frozen.permanentQlIds);
  assert.deepEqual(pkg.supportedLanguages, frozen.questionStudioLanguages);
  assert.deepEqual(pkg.supportedDifficulties, frozen.difficulties);
  assert.equal(pkg.manualApprovalRequired, frozen.manualApprovalRequired);
  assert.equal(pkg.persistenceAllowed, frozen.persistenceAllowed);
  assert.equal(pkg.questionBankWritable, frozen.questionBankWritable);
  assert.equal(pkg.testEligible, frozen.testEligible);
  assert.equal(pkg.mockTestEligible, frozen.mockTestEligible);
  assert.equal(pkg.publiclyPublishable, frozen.publiclyPublishable);
  assert.equal(pkg.automaticStudentPublication, frozen.automaticStudentPublication);
  assert.equal(pkg.learnerRelease, frozen.learnerRelease);

  const smoke = await generateArg001QuestionStudioBatch({
    qlId: "ARG-QL-006",
    difficulty: "Hard",
    language: "pa",
    seed: "arg-cp006-freeze-smoke",
    count: 3,
  });
  assert.equal(smoke.questions.length, 3);
  assert.equal(smoke.generationContext.packageId, "ARG-001");
  assert.equal(smoke.generationContext.questionBankWritable, false);
  assert.equal(smoke.generationContext.testEligible, false);
  assert.equal(smoke.generationContext.mockTestEligible, false);
  assert.equal(smoke.generationContext.publiclyPublishable, false);
  assert.equal(smoke.generationContext.automaticStudentPublication, false);
  assert.equal(smoke.generationContext.learnerRelease, "LOCKED");

  assert.equal(ARG_CP006_FROZEN_BLOBS.length, 29, "CP006 frozen byte-authority inventory changed unexpectedly");
  const uniquePaths = new Set(ARG_CP006_FROZEN_BLOBS.map(([path]) => path));
  const uniqueHashes = new Set(ARG_CP006_FROZEN_BLOBS.map(([, hash]) => hash));
  assert.equal(uniquePaths.size, ARG_CP006_FROZEN_BLOBS.length, "CP006 frozen blob inventory contains duplicate paths");
  assert.equal(uniqueHashes.size, ARG_CP006_FROZEN_BLOBS.length, "CP006 frozen blob inventory contains duplicate hashes");
  for (const [path, hash] of ARG_CP006_FROZEN_BLOBS) {
    assert.ok(path.startsWith("artifacts/api-server/src/"), `Unexpected frozen path outside API source: ${path}`);
    assert.match(hash, /^[0-9a-f]{40}$/, `${path}: invalid Git blob SHA`);
  }

  console.log(JSON.stringify({
    chapter: frozen.chapterId,
    checkpoint: frozen.checkpointId,
    authority: frozen.authority,
    status: frozen.status,
    qls: frozen.permanentQlIds.length,
    sourceTemplates: frozen.sourceTemplateCount,
    difficultyDistribution: frozen.difficultyDistribution,
    englishSemanticSurfaces: frozen.englishSemanticSurfaceCount,
    trilingualSemanticSurfaces: frozen.trilingualSemanticSurfaceCount,
    frozenBlobAuthorities: ARG_CP006_FROZEN_BLOBS.length,
    questionStudio: "REVIEW_ONLY",
    learnerRelease: frozen.learnerRelease,
  }, null, 2));
}

await main();
