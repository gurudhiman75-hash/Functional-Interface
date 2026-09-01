import assert from "node:assert/strict";
import { generateIntCp001QuestionStudioBatch, listIntCp001QuestionStudioPackages } from "./cp001-question-studio-integration-v1";
import { generateIntCp002QuestionStudioBatch, listIntCp002QuestionStudioPackages } from "./cp002-question-studio-integration-v1";
import { generateIntCp003QuestionStudioBatch, listIntCp003QuestionStudioPackages } from "./cp003-question-studio-integration-v1";
import { INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE, previewIntCp004QuestionStudioReview } from "./cp004-question-studio-review-adapter";
import { generateIntCp005QuestionStudioBatch, listIntCp005QuestionStudioPackages } from "./cp005-question-studio-integration-v1";
import { generateIntCp006QuestionStudioBatch, listIntCp006QuestionStudioPackages } from "./cp006-question-studio-integration-v1";
import { INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE, previewIntCp007QuestionStudioReview } from "./cp007-question-studio-review-adapter";
import { generateIntCp008QuestionStudioBatch, listIntCp008QuestionStudioPackages } from "./cp008-question-studio-integration-v1";
import { generateIntCp009QuestionStudioBatch, listIntCp009QuestionStudioPackages } from "./cp009-question-studio-integration-v2";
import { generateIntCp010QuestionStudioBatch, listIntCp010QuestionStudioPackages } from "./cp010-question-studio-integration-v1";
import { generateInt001Wave06QuestionStudioBatch, listInt001Wave06QuestionStudioPackages } from "./int-001-wave06-question-studio-integration-v1";

const SEEDS_PER_QL_LANGUAGE = 6;
const EXPECTED_PERMANENT_QLS = 133;
const EXPECTED_BASE_QLS = 130;
const NEW_QLS = Object.freeze(["INT-QL-132", "INT-QL-133", "INT-QL-134"] as const);

type Generated = Readonly<{ question: any }>;
type Surface = Readonly<{
  id: string;
  qlIds: readonly string[];
  languages: readonly string[];
  generate: (qlId: string, language: string, seed: string) => Promise<Generated>;
}>;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, nested) => typeof nested === "bigint" ? `${nested}n` : nested);
}
function firstPackage(list: readonly any[]) {
  assert.equal(list.length, 1, "Interest integration must expose exactly one package descriptor per checkpoint surface.");
  return list[0];
}
function qls(pkg: any): readonly string[] {
  const ids = pkg.permanentQlIds ?? pkg.qlIds;
  assert.ok(Array.isArray(ids) && ids.length > 0, "Question Studio package is missing QL ownership.");
  return Object.freeze(ids.map(String));
}
function languages(pkg: any): readonly string[] {
  assert.ok(Array.isArray(pkg.supportedLanguages) && pkg.supportedLanguages.length > 0, "Question Studio package is missing supported languages.");
  return Object.freeze(pkg.supportedLanguages.map(String));
}
async function fromBatch(generator: (request: any) => Promise<any>, qlId: string, language: string, seed: string): Promise<Generated> {
  const result = await generator({ qlId, questionLanguageId: qlId, language, seed, count: 1 });
  assert.equal(result?.questions?.length, 1, `${qlId}/${language}: expected exactly one generated preview.`);
  return Object.freeze({ question: result.questions[0] });
}

const cp001 = firstPackage(listIntCp001QuestionStudioPackages());
const cp002 = firstPackage(listIntCp002QuestionStudioPackages());
const cp003 = firstPackage(listIntCp003QuestionStudioPackages());
const cp005 = firstPackage(listIntCp005QuestionStudioPackages());
const cp006 = firstPackage(listIntCp006QuestionStudioPackages());
const cp008 = firstPackage(listIntCp008QuestionStudioPackages());
const cp009 = firstPackage(listIntCp009QuestionStudioPackages());
const cp010 = firstPackage(listIntCp010QuestionStudioPackages());
const wave06 = firstPackage(listInt001Wave06QuestionStudioPackages());

const surfaces: readonly Surface[] = Object.freeze([
  { id: "INT-CP-001", qlIds: qls(cp001), languages: languages(cp001), generate: (q,l,s) => fromBatch(generateIntCp001QuestionStudioBatch, q,l,s) },
  { id: "INT-CP-002", qlIds: qls(cp002), languages: languages(cp002), generate: (q,l,s) => fromBatch(generateIntCp002QuestionStudioBatch, q,l,s) },
  { id: "INT-CP-003", qlIds: qls(cp003), languages: languages(cp003), generate: (q,l,s) => fromBatch(generateIntCp003QuestionStudioBatch, q,l,s) },
  { id: "INT-CP-004", qlIds: qls(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE), languages: languages(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE), generate: async (q,l,s) => {
      const result = previewIntCp004QuestionStudioReview({ qlId: q as any, language: l as any, seed: s, count: 1 });
      assert.equal(result.questions.length, 1); return Object.freeze({ question: result.questions[0] });
    } },
  { id: "INT-CP-005", qlIds: qls(cp005), languages: languages(cp005), generate: (q,l,s) => fromBatch(generateIntCp005QuestionStudioBatch, q,l,s) },
  { id: "INT-CP-006", qlIds: qls(cp006), languages: languages(cp006), generate: (q,l,s) => fromBatch(generateIntCp006QuestionStudioBatch, q,l,s) },
  { id: "INT-CP-007", qlIds: qls(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE), languages: languages(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE), generate: async (q,l,s) => {
      const result = previewIntCp007QuestionStudioReview({ qlId: q as any, language: l as any, seed: s, count: 1 });
      assert.equal(result.questions.length, 1); return Object.freeze({ question: result.questions[0] });
    } },
  { id: "INT-CP-008", qlIds: qls(cp008), languages: languages(cp008), generate: (q,l,s) => fromBatch(generateIntCp008QuestionStudioBatch, q,l,s) },
  { id: "INT-CP-009", qlIds: qls(cp009), languages: languages(cp009), generate: (q,l,s) => fromBatch(generateIntCp009QuestionStudioBatch, q,l,s) },
  { id: "INT-CP-010", qlIds: qls(cp010), languages: languages(cp010), generate: (q,l,s) => fromBatch(generateIntCp010QuestionStudioBatch, q,l,s) },
  { id: "INT-WAVE06", qlIds: qls(wave06), languages: languages(wave06), generate: (q,l,s) => fromBatch(generateInt001Wave06QuestionStudioBatch, q,l,s) },
]);

const baseIds = surfaces.filter((surface) => surface.id !== "INT-WAVE06").flatMap((surface) => surface.qlIds);
const allIds = surfaces.flatMap((surface) => surface.qlIds);
assert.equal(baseIds.length, EXPECTED_BASE_QLS, `Expected ${EXPECTED_BASE_QLS} base Interest QLs.`);
assert.equal(new Set(baseIds).size, EXPECTED_BASE_QLS, "Base Interest QL ownership contains duplicates.");
assert.deepEqual([...new Set(wave06.permanentQlIds)].sort(), [...NEW_QLS].sort(), "Wave06 must own exactly QL132-134.");
assert.equal(allIds.length, EXPECTED_PERMANENT_QLS, `Expected ${EXPECTED_PERMANENT_QLS} total permanent Interest QLs.`);
assert.equal(new Set(allIds).size, EXPECTED_PERMANENT_QLS, "A permanent Interest QL is owned by more than one Question Studio surface.");

const qlSurface = new Map<string, string>();
for (const surface of surfaces) for (const qlId of surface.qlIds) qlSurface.set(qlId, surface.id);

let generated = 0;
let deterministicChecks = 0;
let answerOwnershipChecks = 0;
let lifecycleChecks = 0;
let exactCrossQlStemCollisions = 0;
let questionIdCollisions = 0;
const collisionExamples: any[] = [];
const stems = new Map<string, { qlId: string; seed: string; surface: string }>();
const questionIds = new Map<string, { qlId: string; seed: string }>();
const distinctStems = new Map<string, Set<string>>();
const answerPositions = new Map<string, Set<number>>();
const generatedByLanguage = new Map<string, number>();

function correctIndexOf(question: any): number {
  const value = question.correctIndex ?? question.correct;
  const index = Number(value);
  assert.ok(Number.isInteger(index), `${question.qlId}: correct index missing.`);
  return index;
}
function stemOf(question: any): string {
  const stem = String(question.stem ?? question.text ?? "").replace(/\s+/gu, " ").trim();
  assert.ok(stem.length >= 10, `${question.qlId}: generated stem is empty/thin.`);
  return stem;
}

for (const surface of surfaces) {
  for (const qlId of surface.qlIds) {
    for (const language of surface.languages) {
      const surfaceKey = `${qlId}|${language}`;
      const localStems = new Set<string>();
      const positions = new Set<number>();
      distinctStems.set(surfaceKey, localStems);
      answerPositions.set(surfaceKey, positions);
      for (let index = 0; index < SEEDS_PER_QL_LANGUAGE; index += 1) {
        const seed = `INT-001-133QL-SOAK:${surface.id}:${qlId}:${language}:${index}`;
        const first = (await surface.generate(qlId, language, seed)).question;
        const second = (await surface.generate(qlId, language, seed)).question;
        assert.equal(stable(first), stable(second), `${qlId}/${language}/${index}: nondeterministic Question Studio output.`);
        deterministicChecks += 1;
        generated += 1;
        generatedByLanguage.set(language, (generatedByLanguage.get(language) ?? 0) + 1);

        assert.equal(String(first.qlId ?? first.questionLanguageId), qlId, `${qlId}/${language}: QL ownership drift.`);
        const opts = first.options as readonly unknown[];
        assert.ok(Array.isArray(opts) && opts.length === 4, `${qlId}/${language}: expected four options.`);
        const correctIndex = correctIndexOf(first);
        assert.ok(correctIndex >= 0 && correctIndex < opts.length, `${qlId}/${language}: invalid correct index.`);
        const answer = String(first.answer ?? first.canonicalAnswer?.display ?? first.canonicalAnswer?.value ?? "");
        assert.ok(answer.length > 0, `${qlId}/${language}: answer missing.`);
        assert.equal(String(opts[correctIndex]), answer, `${qlId}/${language}: correct option does not own answer.`);
        answerOwnershipChecks += 5;
        positions.add(correctIndex);

        for (const field of ["questionBankWritable", "testEligible", "mockTestEligible", "publiclyPublishable", "automaticStudentPublication"] as const) {
          if (field in first) assert.notEqual(first[field], true, `${qlId}/${language}: ${field} unexpectedly opened.`);
          lifecycleChecks += 1;
        }

        const stem = stemOf(first);
        localStems.add(stem);
        const stemKey = `${language}|${stem}`;
        const existing = stems.get(stemKey);
        if (existing && existing.qlId !== qlId) {
          exactCrossQlStemCollisions += 1;
          if (collisionExamples.length < 20) collisionExamples.push({ language, stem, first: existing, second: { qlId, seed, surface: surface.id } });
        } else if (!existing) stems.set(stemKey, { qlId, seed, surface: surface.id });

        const questionId = String(first.questionId ?? "").trim();
        if (questionId) {
          const prior = questionIds.get(questionId);
          if (prior && (prior.qlId !== qlId || prior.seed !== seed)) questionIdCollisions += 1;
          else if (!prior) questionIds.set(questionId, { qlId, seed });
        }
      }
    }
  }
}

assert.equal(exactCrossQlStemCollisions, 0, `Found ${exactCrossQlStemCollisions} exact cross-QL stem collisions.`);
assert.equal(questionIdCollisions, 0, `Found ${questionIdCollisions} Question Studio question-id collisions.`);
assert.ok(generated > 1800, "133-QL soak did not exercise enough Question Studio states.");
assert.equal(deterministicChecks, generated);
assert.equal(answerOwnershipChecks, generated * 5);
assert.equal(lifecycleChecks, generated * 5);

const thinSurfaces = [...distinctStems.entries()].filter(([, values]) => values.size < 2).map(([key, values]) => ({ key, distinctStems: values.size }));
const positionCoverage = Object.fromEntries([...answerPositions.entries()].map(([key, values]) => [key, [...values].sort()]));

console.log(JSON.stringify({
  version: "INT-001-133QL-QUESTION-STUDIO-SOAK-v1",
  permanentQlCount: new Set(allIds).size,
  baseQlCount: new Set(baseIds).size,
  newQlIds: NEW_QLS,
  surfaceCount: surfaces.length,
  qlLanguageSurfaceCount: distinctStems.size,
  seedsPerQlLanguage: SEEDS_PER_QL_LANGUAGE,
  generated,
  deterministicChecks,
  answerOwnershipChecks,
  lifecycleChecks,
  generatedByLanguage: Object.fromEntries([...generatedByLanguage].sort()),
  exactCrossQlStemCollisions,
  questionIdCollisions,
  collisionExamples,
  thinSurfaceCount: thinSurfaces.length,
  thinSurfaces,
  distinctStemMin: Math.min(...[...distinctStems.values()].map((values) => values.size)),
  distinctStemMax: Math.max(...[...distinctStems.values()].map((values) => values.size)),
  answerPositionCoverage: positionCoverage,
  ownershipByQl: Object.fromEntries([...qlSurface].sort()),
  policy: {
    exactCrossQlStemCollisions: "ZERO_REQUIRED_WITHIN_LANGUAGE",
    questionIdCollisions: "ZERO_REQUIRED",
    deterministicGeneration: "REQUIRED",
    answerOwnership: "REQUIRED",
    downstreamStudentDelivery: "MUST_REMAIN_CLOSED",
  },
}, null, 2));
console.log("PASS_INT_001_133QL_QUESTION_STUDIO_SOAK_V1_AUDIT");
