import assert from "node:assert/strict";
import {
  SPATIAL_QUESTION_STUDIO_PACKAGE_V9,
  SPATIAL_QUESTION_STUDIO_QLS_V9,
} from "../foundation/spatial/spatial-question-studio-integration-v9";
import { generateSpatialProductionStudioQuestionV9 } from "../foundation/spatial/spatial-question-studio-production-v9";
import { CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "../foundation/spatial/cubes-dice-test-builder-activation-v1";
import { generateCubesDiceQuestionStudioTestBuilderV1 } from "../foundation/spatial/cubes-dice-question-studio-test-builder-runtime-v1";
import { SPATIAL_FAMILY_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/spatial-family-freeze-v1";

const languages = ["en", "hi", "pa"] as const;
const seeds = ["CURRENT-HEAD-A", "CURRENT-HEAD-B", "CURRENT-HEAD-C"] as const;
const cndQlIds = [...CND_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1.permanentQlIds];
const bannedLearnerText =
  /(solver-attested|runtime proof|content fingerprint|geometry fingerprint|renderer authority|internal activation authority|permanent ql|question studio|source-backed|candidate id|checkpoint id)/iu;

function visuals(question: any): string[] {
  const stimulus = Array.isArray(question.stimulusSvgs)
    ? question.stimulusSvgs
    : typeof question.stimulusSvg === "string"
      ? [question.stimulusSvg]
      : [];
  const options = Array.isArray(question.optionSvgs) ? question.optionSvgs : [];
  return [...stimulus, ...options];
}

function explanationText(question: any): string {
  const value = question.explanation ?? question.solution ?? "";
  return typeof value === "string" ? value : JSON.stringify(value);
}

function fingerprint(question: any): string {
  return String(
    question.contentFingerprint
      ?? question.geometryFingerprint
      ?? question.questionId
      ?? JSON.stringify([question.stem, question.correctIndex, question.options, question.optionLabels]),
  );
}

function assertSvg(svg: string, owner: string): void {
  assert.match(svg, /<svg\b/i, owner + ": SVG root missing");
  assert.ok(svg.length > 40, owner + ": SVG unexpectedly thin");
  assert.doesNotMatch(svg, /<script\b|javascript:|\sonload\s*=|\sonerror\s*=/i, owner + ": unsafe SVG");
}

function assertLocalizedScript(text: string, language: "en" | "hi" | "pa", owner: string): void {
  if (language === "hi") assert.match(text, /[\u0900-\u097F]/, owner + ": Hindi learner text lacks Devanagari");
  if (language === "pa") assert.match(text, /[\u0A00-\u0A7F]/, owner + ": Punjabi learner text lacks Gurmukhi");
}

function assertQuestion(question: any, qlId: string, language: "en" | "hi" | "pa", owner: string): void {
  assert.equal(question.qlId, qlId, owner + ": QL ownership drift");
  assert.equal(question.language, language, owner + ": language drift");
  assert.equal(typeof question.stem, "string", owner + ": missing stem");
  assert.ok(question.stem.trim().length >= 8, owner + ": stem too short");
  assert.doesNotMatch(question.stem, bannedLearnerText, owner + ": learner stem leaks internal language");

  const explanation = explanationText(question);
  assert.ok(explanation.length >= 20, owner + ": explanation too thin");
  assert.doesNotMatch(explanation, bannedLearnerText, owner + ": learner explanation leaks internal language");
  assertLocalizedScript(question.stem + "\n" + explanation, language, owner);

  assert.ok(Number.isInteger(question.correctIndex), owner + ": correctIndex not integer");
  assert.ok(question.correctIndex >= 0 && question.correctIndex <= 3, owner + ": correctIndex out of range");

  const optionSurface = Array.isArray(question.options) ? question.options : question.optionLabels;
  assert.ok(Array.isArray(optionSurface), owner + ": option surface missing");
  assert.equal(optionSurface.length, 4, owner + ": expected four options");
  const serializedOptions = optionSurface.map((option: unknown) => typeof option === "string" ? option : JSON.stringify(option));
  assert.equal(new Set(serializedOptions).size, 4, owner + ": duplicate options");

  const svgSurfaces = visuals(question);
  assert.ok(svgSurfaces.length >= 1, owner + ": no visual surface");
  svgSurfaces.forEach((svg, index) => assertSvg(svg, owner + ":svg:" + index));
  if (Array.isArray(question.optionSvgs)) {
    assert.equal(question.optionSvgs.length, 4, owner + ": expected four visual options");
    assert.equal(new Set(question.optionSvgs).size, 4, owner + ": duplicate visual options");
  }

  const lifecycle = question.lifecycle ?? {};
  if ("automaticStudentPublication" in lifecycle) assert.equal(lifecycle.automaticStudentPublication, false, owner + ": automatic publication opened");
  if ("manualApprovalRequired" in lifecycle) assert.equal(lifecycle.manualApprovalRequired, true, owner + ": manual approval requirement drift");
}

assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.permanentQlCount, 63);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.familyFrozen, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.mockTestEligible, false);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.publicReleaseAuthorized, false);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.studentDeliveryAuthorized, false);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.lifecycle.automaticStudentPublication, false);

const allQlIds = [...SPATIAL_QUESTION_STUDIO_PACKAGE_V9.qlIds, ...cndQlIds];
assert.equal(allQlIds.length, 63);
assert.equal(new Set(allQlIds).size, 63);

const perQlLanguageFingerprints = new Map<string, Set<string>>();
const chapterCounts = new Map<string, number>();
let generated = 0;
let svgCount = 0;

for (const ql of SPATIAL_QUESTION_STUDIO_QLS_V9) {
  for (const language of languages) {
    for (const seed of seeds) {
      const generationSeed = `spatial-current-head:${ql.permanentQlId}:${language}:${seed}`;
      const question = generateSpatialProductionStudioQuestionV9({
        qlId: ql.permanentQlId,
        language,
        seed: generationSeed,
      }) as any;
      const owner = `${ql.permanentQlId}:${language}:${seed}`;
      assertQuestion(question, ql.permanentQlId, language, owner);
      assert.equal(question.integrationAuthority, SPATIAL_QUESTION_STUDIO_PACKAGE_V9.integrationAuthority, owner + ": integration authority drift");

      const replay = generateSpatialProductionStudioQuestionV9({
        qlId: ql.permanentQlId,
        language,
        seed: generationSeed,
      }) as any;
      assert.equal(fingerprint(replay), fingerprint(question), owner + ": deterministic replay drift");
      assert.equal(replay.correctIndex, question.correctIndex, owner + ": deterministic answer drift");

      const key = `${ql.permanentQlId}:${language}`;
      const set = perQlLanguageFingerprints.get(key) ?? new Set<string>();
      set.add(fingerprint(question));
      perQlLanguageFingerprints.set(key, set);
      chapterCounts.set(ql.chapterCode, (chapterCounts.get(ql.chapterCode) ?? 0) + 1);
      svgCount += visuals(question).length;
      generated += 1;
    }
  }
}

for (const qlId of cndQlIds) {
  for (const language of languages) {
    for (const seed of seeds) {
      const generationSeed = `spatial-current-head:${qlId}:${language}:${seed}`;
      const question = generateCubesDiceQuestionStudioTestBuilderV1({
        qlId,
        language,
        seed: generationSeed,
      }) as any;
      const owner = `${qlId}:${language}:${seed}`;
      assertQuestion(question, qlId, language, owner);
      assert.equal(question.lifecycle.testBuilderEligible, true, owner + ": CND test-builder eligibility drift");
      assert.equal(question.lifecycle.mockTestEligible, false, owner + ": CND mock release opened");
      assert.equal(question.lifecycle.publicReleaseAuthorized, false, owner + ": CND public release opened");
      assert.equal(question.lifecycle.studentDeliveryAuthorized, false, owner + ": CND student delivery opened");

      const replay = generateCubesDiceQuestionStudioTestBuilderV1({ qlId, language, seed: generationSeed }) as any;
      assert.equal(fingerprint(replay), fingerprint(question), owner + ": deterministic CND replay drift");
      assert.equal(replay.correctIndex, question.correctIndex, owner + ": deterministic CND answer drift");

      const key = `${qlId}:${language}`;
      const set = perQlLanguageFingerprints.get(key) ?? new Set<string>();
      set.add(fingerprint(question));
      perQlLanguageFingerprints.set(key, set);
      svgCount += visuals(question).length;
      generated += 1;
    }
  }
}

for (const [key, values] of perQlLanguageFingerprints) {
  assert.ok(values.size >= 2, key + ": diversity too thin across three seeds (" + values.size + ")");
}
for (const chapterCode of SPATIAL_QUESTION_STUDIO_PACKAGE_V9.chapters) {
  assert.ok((chapterCounts.get(chapterCode) ?? 0) > 0, chapterCode + ": no current-head generated coverage");
}

assert.equal(generated, 63 * languages.length * seeds.length);
assert.ok(svgCount >= generated);

console.log(JSON.stringify({
  status: "PASS_SPATIAL_FAMILY_CURRENT_HEAD_DEEP_AUDIT_20261002",
  qlCount: 63,
  mainQlCount: 58,
  cndQlCount: 5,
  languages,
  seedsPerQlPerLanguage: seeds.length,
  generatedQuestions: generated,
  svgChecks: svgCount,
  chapters: Object.fromEntries([...chapterCounts.entries()].sort()),
}, null, 2));
