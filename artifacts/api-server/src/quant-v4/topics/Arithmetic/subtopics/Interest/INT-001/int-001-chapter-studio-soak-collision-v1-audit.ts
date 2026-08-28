import assert from "node:assert/strict";
import {
  generateIntCp001QuestionStudioBatch,
  listIntCp001QuestionStudioPackages,
} from "./cp001-question-studio-integration-v1";
import {
  generateIntCp002QuestionStudioBatch,
  listIntCp002QuestionStudioPackages,
} from "./cp002-question-studio-integration-v1";
import {
  generateIntCp003QuestionStudioBatch,
  listIntCp003QuestionStudioPackages,
} from "./cp003-question-studio-integration-v1";
import {
  INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewIntCp004QuestionStudioReview,
} from "./cp004-question-studio-review-adapter";
import {
  generateIntCp005QuestionStudioBatch,
  listIntCp005QuestionStudioPackages,
} from "./cp005-question-studio-integration-v1";
import {
  generateIntCp006QuestionStudioBatch,
  listIntCp006QuestionStudioPackages,
} from "./cp006-question-studio-integration-v1";
import {
  INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewIntCp007QuestionStudioReview,
} from "./cp007-question-studio-review-adapter";
import {
  generateIntCp008QuestionStudioBatch,
  listIntCp008QuestionStudioPackages,
} from "./cp008-question-studio-integration-v1";
import {
  generateIntCp009QuestionStudioBatch,
  listIntCp009QuestionStudioPackages,
} from "./cp009-question-studio-integration-v2";
import {
  generateIntCp010QuestionStudioBatch,
  listIntCp010QuestionStudioPackages,
} from "./cp010-question-studio-integration-v1";

const SEEDS_PER_QL_LANGUAGE = 25;
const INTENTIONAL_VACANCY = "INT-QL-094";
const EXPECTED_PERMANENT_QL_COUNT = 130;
const EXPECTED_ACTIVE_QL_LANGUAGE_COMBINATIONS = 309;

type Surface = Readonly<{
  cpId: string;
  qlIds: readonly string[];
  languages: readonly string[];
  generate: (qlId: string, language: string, seed: string) => Promise<Readonly<{ question: any; pkg?: any }>>;
}>;

function firstPackage(list: readonly any[]) {
  assert.equal(list.length, 1, "Interest checkpoint integration must expose one INT-001 package descriptor.");
  return list[0];
}

function qlIdsFromPackage(pkg: any): readonly string[] {
  const qlIds = pkg.permanentQlIds ?? pkg.qlIds;
  assert.ok(Array.isArray(qlIds) && qlIds.length > 0, "Question Studio package is missing permanent QL IDs.");
  return Object.freeze([...qlIds].map(String));
}

function languagesFromPackage(pkg: any): readonly string[] {
  assert.ok(Array.isArray(pkg.supportedLanguages) && pkg.supportedLanguages.length > 0, "Question Studio package is missing supported languages.");
  return Object.freeze([...pkg.supportedLanguages].map(String));
}

async function fromBatch(generator: (request: any) => Promise<any>, qlId: string, language: string, seed: string) {
  const result = await generator({
    qlId,
    questionLanguageId: qlId,
    language,
    seed,
    count: 1,
  });
  assert.equal(result?.questions?.length, 1, `${qlId}/${language}: expected one Question Studio preview.`);
  return Object.freeze({ question: result.questions[0], pkg: result.questionPackages?.[0] });
}

const cp001 = firstPackage(listIntCp001QuestionStudioPackages());
const cp002 = firstPackage(listIntCp002QuestionStudioPackages());
const cp003 = firstPackage(listIntCp003QuestionStudioPackages());
const cp005 = firstPackage(listIntCp005QuestionStudioPackages());
const cp006 = firstPackage(listIntCp006QuestionStudioPackages());
const cp008 = firstPackage(listIntCp008QuestionStudioPackages());
const cp009 = firstPackage(listIntCp009QuestionStudioPackages());
const cp010 = firstPackage(listIntCp010QuestionStudioPackages());

const surfaces: readonly Surface[] = Object.freeze([
  {
    cpId: "INT-CP-001",
    qlIds: qlIdsFromPackage(cp001),
    languages: languagesFromPackage(cp001),
    generate: (qlId, language, seed) => fromBatch(generateIntCp001QuestionStudioBatch, qlId, language, seed),
  },
  {
    cpId: "INT-CP-002",
    qlIds: qlIdsFromPackage(cp002),
    languages: languagesFromPackage(cp002),
    generate: (qlId, language, seed) => fromBatch(generateIntCp002QuestionStudioBatch, qlId, language, seed),
  },
  {
    cpId: "INT-CP-003",
    qlIds: qlIdsFromPackage(cp003),
    languages: languagesFromPackage(cp003),
    generate: (qlId, language, seed) => fromBatch(generateIntCp003QuestionStudioBatch, qlId, language, seed),
  },
  {
    cpId: "INT-CP-004",
    qlIds: qlIdsFromPackage(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE),
    languages: languagesFromPackage(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE),
    generate: async (qlId, language, seed) => {
      const result = previewIntCp004QuestionStudioReview({ qlId: qlId as any, language: language as any, seed, count: 1 });
      assert.equal(result.questions.length, 1, `${qlId}/${language}: expected one CP004 review preview.`);
      return Object.freeze({ question: result.questions[0] });
    },
  },
  {
    cpId: "INT-CP-005",
    qlIds: qlIdsFromPackage(cp005),
    languages: languagesFromPackage(cp005),
    generate: (qlId, language, seed) => fromBatch(generateIntCp005QuestionStudioBatch, qlId, language, seed),
  },
  {
    cpId: "INT-CP-006",
    qlIds: qlIdsFromPackage(cp006),
    languages: languagesFromPackage(cp006),
    generate: (qlId, language, seed) => fromBatch(generateIntCp006QuestionStudioBatch, qlId, language, seed),
  },
  {
    cpId: "INT-CP-007",
    qlIds: qlIdsFromPackage(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE),
    languages: languagesFromPackage(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE),
    generate: async (qlId, language, seed) => {
      const result = previewIntCp007QuestionStudioReview({ qlId: qlId as any, language: language as any, seed, count: 1 });
      assert.equal(result.questions.length, 1, `${qlId}/${language}: expected one CP007 review preview.`);
      return Object.freeze({ question: result.questions[0] });
    },
  },
  {
    cpId: "INT-CP-008",
    qlIds: qlIdsFromPackage(cp008),
    languages: languagesFromPackage(cp008),
    generate: (qlId, language, seed) => fromBatch(generateIntCp008QuestionStudioBatch, qlId, language, seed),
  },
  {
    cpId: "INT-CP-009",
    qlIds: qlIdsFromPackage(cp009),
    languages: languagesFromPackage(cp009),
    generate: (qlId, language, seed) => fromBatch(generateIntCp009QuestionStudioBatch, qlId, language, seed),
  },
  {
    cpId: "INT-CP-010",
    qlIds: qlIdsFromPackage(cp010),
    languages: languagesFromPackage(cp010),
    generate: (qlId, language, seed) => fromBatch(generateIntCp010QuestionStudioBatch, qlId, language, seed),
  },
]);

function normalizeExactStem(text: string) {
  return text.normalize("NFKC").toLocaleLowerCase().replace(/\s+/gu, " ").trim();
}

function normalizeSemanticSkeleton(text: string) {
  return text
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[0-9०-९੦-੯]+(?:[.,][0-9०-९੦-੯]+)*/gu, "#")
    .replace(/[₹$€£]/gu, "¤")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function optionText(option: any) {
  return typeof option === "string" ? option : String(option?.text ?? option?.display ?? option?.value ?? "");
}

function qlEvidence(question: any, pkg: any): readonly string[] {
  return Object.freeze([
    question?.qlId,
    question?.questionLanguageId,
    question?.patternId,
    question?.traceability?.permanentQlId,
    question?.parameters?.qlId,
    pkg?.qlId,
    pkg?.questionLanguageId,
    pkg?.traceability?.permanentQlId,
  ].filter(Boolean).map(String));
}

function collisionSemanticKey(question: any, pkg: any) {
  return String(
    question?.solveMode
    ?? question?.parameters?.solveContract
    ?? pkg?.solveContract
    ?? question?.traceability?.mathematicalFingerprint
    ?? question?.mathematicalFingerprint
    ?? "",
  ).normalize("NFKC").trim();
}

function assertPreview(question: any, pkg: any, cpId: string, qlId: string, language: string) {
  assert.ok(question && typeof question === "object", `${qlId}/${language}: preview is missing.`);
  const evidence = qlEvidence(question, pkg);
  assert.ok(evidence.includes(qlId), `${qlId}/${language}: generated preview lost permanent QL identity (${evidence.join(", ")}).`);
  const stem = String(question.stem ?? question.text ?? "").trim();
  assert.ok(stem.length >= 8, `${qlId}/${language}: learner stem is empty/too short.`);
  const options = (question.options ?? pkg?.options ?? []).map(optionText);
  assert.equal(options.length, 4, `${qlId}/${language}: expected four options.`);
  assert.equal(new Set(options).size, 4, `${qlId}/${language}: duplicate options detected.`);
  assert.ok(options.every((value: string) => value.trim().length > 0), `${qlId}/${language}: blank option detected.`);
  const correctIndex = Number(question.correctIndex ?? question.correct ?? pkg?.correctIndex);
  assert.ok(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < 4, `${qlId}/${language}: invalid correct index.`);
  const answer = String(question.answer ?? pkg?.answer ?? options[correctIndex]);
  assert.equal(answer, options[correctIndex], `${qlId}/${language}: answer no longer binds to correct option.`);
  const explanation = String(question.explanation ?? question.packageExplanation?.lines?.join("\n") ?? "").trim();
  assert.ok(explanation.length > 0, `${qlId}/${language}: explanation is empty.`);
  const studioOpen = question.questionStudioDiscoverable === true
    || question.safety?.questionStudioDiscoverable === true
    || question.questionStudioRegistrationStatus === "REGISTERED_REVIEW_ONLY"
    || question.runtimeMode === "QUESTION_STUDIO_ACTIVE";
  assert.equal(studioOpen, true, `${qlId}/${language}: Question Studio review surface is not open.`);
  assert.notEqual(question.questionBankWritable, true, `${qlId}/${language}: Question Bank write leaked open.`);
  assert.notEqual(question.testEligible, true, `${qlId}/${language}: scored-test eligibility leaked open.`);
  assert.notEqual(question.mockTestEligible, true, `${qlId}/${language}: mock-test eligibility leaked open.`);
  assert.notEqual(question.publiclyPublishable, true, `${qlId}/${language}: public publication leaked open.`);
  if (question.questionBankStatus !== undefined) assert.equal(question.questionBankStatus, "NOT_STORED", `${qlId}/${language}: Question Bank status drifted.`);
  if (question.testEligibility !== undefined) assert.equal(question.testEligibility, "INELIGIBLE", `${qlId}/${language}: test eligibility drifted.`);
  if (pkg) {
    assert.notEqual(pkg.questionBankWritable, true, `${qlId}/${language}: package Question Bank write leaked open.`);
    assert.notEqual(pkg.testEligible, true, `${qlId}/${language}: package scored-test eligibility leaked open.`);
    assert.notEqual(pkg.mockTestEligible, true, `${qlId}/${language}: package mock-test eligibility leaked open.`);
    assert.notEqual(pkg.publiclyPublishable, true, `${qlId}/${language}: package public publication leaked open.`);
  }
  JSON.stringify(question);
  if (pkg) JSON.stringify(pkg);
  return Object.freeze({ stem, semanticKey: collisionSemanticKey(question, pkg) });
}

const allQls = surfaces.flatMap((surface) => surface.qlIds.map((qlId) => ({ cpId: surface.cpId, qlId })));
const uniqueQls = new Set(allQls.map(({ qlId }) => qlId));
assert.equal(surfaces.length, 10, "Expected all ten Interest checkpoints in the unified soak.");
assert.equal(allQls.length, EXPECTED_PERMANENT_QL_COUNT, "Checkpoint QL totals do not equal the certified 130 permanent QLs.");
assert.equal(uniqueQls.size, EXPECTED_PERMANENT_QL_COUNT, "A permanent QL is duplicated across checkpoint integration surfaces.");
assert.equal(uniqueQls.has(INTENTIONAL_VACANCY), false, "INT-QL-094 must remain absent from permanent Question Studio authority.");

const qlLanguageCombinations = surfaces.reduce((sum, surface) => sum + surface.qlIds.length * surface.languages.length, 0);
assert.equal(qlLanguageCombinations, EXPECTED_ACTIVE_QL_LANGUAGE_COMBINATIONS, "Active QL×language surface count drifted.");

let generatedPreviewChecks = 0;
let deterministicReplayChecks = 0;
let jsonSafetyChecks = 0;
let lifecycleChecks = 0;
let answerBindingChecks = 0;
const reachedQls = new Set<string>();
const reachedQlLanguages = new Set<string>();
const exactStemOwners = new Map<string, Set<string>>();
const skeletonOwners = new Map<string, Set<string>>();
const skeletonSemanticOwners = new Map<string, Set<string>>();
const uniqueSkeletonsByLanguage = new Map<string, Set<string>>();

for (const surface of surfaces) {
  for (const qlId of surface.qlIds) {
    for (const language of surface.languages) {
      for (let seedIndex = 0; seedIndex < SEEDS_PER_QL_LANGUAGE; seedIndex += 1) {
        const seed = `INT-001-SOAK-V1:${surface.cpId}:${qlId}:${language}:${seedIndex}`;
        const first = await surface.generate(qlId, language, seed);
        const second = await surface.generate(qlId, language, seed);
        const inspected = assertPreview(first.question, first.pkg, surface.cpId, qlId, language);
        assertPreview(second.question, second.pkg, surface.cpId, qlId, language);
        assert.equal(JSON.stringify(first), JSON.stringify(second), `${qlId}/${language}/${seedIndex}: deterministic replay drifted.`);

        generatedPreviewChecks += 2;
        deterministicReplayChecks += 1;
        jsonSafetyChecks += 2;
        lifecycleChecks += 2;
        answerBindingChecks += 2;
        reachedQls.add(qlId);
        reachedQlLanguages.add(`${qlId}:${language}`);

        const exactStem = normalizeExactStem(inspected.stem);
        const exactKey = `${language}:${exactStem}`;
        const exactOwners = exactStemOwners.get(exactKey) ?? new Set<string>();
        exactOwners.add(qlId);
        exactStemOwners.set(exactKey, exactOwners);

        const skeleton = normalizeSemanticSkeleton(inspected.stem);
        const skeletonKey = `${language}:${skeleton}`;
        const owners = skeletonOwners.get(skeletonKey) ?? new Set<string>();
        owners.add(qlId);
        skeletonOwners.set(skeletonKey, owners);
        const languageSkeletons = uniqueSkeletonsByLanguage.get(language) ?? new Set<string>();
        languageSkeletons.add(skeleton);
        uniqueSkeletonsByLanguage.set(language, languageSkeletons);

        if (inspected.semanticKey) {
          const semanticCollisionKey = `${language}:${skeleton}:${inspected.semanticKey}`;
          const semanticOwners = skeletonSemanticOwners.get(semanticCollisionKey) ?? new Set<string>();
          semanticOwners.add(qlId);
          skeletonSemanticOwners.set(semanticCollisionKey, semanticOwners);
        }
      }
    }
  }
}

assert.equal(reachedQls.size, EXPECTED_PERMANENT_QL_COUNT, "Not every permanent QL was reached by the runtime soak.");
assert.equal(reachedQlLanguages.size, EXPECTED_ACTIVE_QL_LANGUAGE_COMBINATIONS, "Not every declared QL×language surface was reached.");

const exactCrossQlCollisions = [...exactStemOwners.entries()].filter(([, owners]) => owners.size > 1);
assert.deepEqual(exactCrossQlCollisions, [], `Exact learner-stem collisions found across permanent QLs: ${JSON.stringify(exactCrossQlCollisions.slice(0, 10).map(([key, owners]) => [key, [...owners]]))}`);

const semanticCrossQlCollisions = [...skeletonSemanticOwners.entries()].filter(([, owners]) => owners.size > 1);
assert.deepEqual(semanticCrossQlCollisions, [], `Same semantic-key + normalized-stem collisions found across permanent QLs: ${JSON.stringify(semanticCrossQlCollisions.slice(0, 10).map(([key, owners]) => [key, [...owners]]))}`);

const representationOnlySkeletonCollisions = [...skeletonOwners.entries()].filter(([, owners]) => owners.size > 1).length;

const cp005Surface = surfaces.find((surface) => surface.cpId === "INT-CP-005")!;
let ql094Rejected = false;
try {
  await cp005Surface.generate(INTENTIONAL_VACANCY, "en", "INT-001-SOAK-V1:QL094-REJECTION");
} catch {
  ql094Rejected = true;
}
assert.equal(ql094Rejected, true, "INT-QL-094 unexpectedly generated through current CP005 Question Studio authority.");

const metrics = Object.freeze({
  auditVersion: "INT-001-CHAPTER-STUDIO-SOAK-COLLISION-v1",
  checkpoints: surfaces.length,
  permanentQlCount: uniqueQls.size,
  intentionalVacancy: INTENTIONAL_VACANCY,
  activeQlLanguageCombinations: qlLanguageCombinations,
  seedsPerQlLanguage: SEEDS_PER_QL_LANGUAGE,
  primaryQuestions: qlLanguageCombinations * SEEDS_PER_QL_LANGUAGE,
  generatedPreviewsIncludingReplay: generatedPreviewChecks,
  deterministicReplayChecks,
  jsonSafetyChecks,
  lifecycleChecks,
  answerBindingChecks,
  reachedPermanentQls: reachedQls.size,
  reachedQlLanguageCombinations: reachedQlLanguages.size,
  exactCrossQlStemCollisions: exactCrossQlCollisions.length,
  semanticCrossQlCollisions: semanticCrossQlCollisions.length,
  representationOnlySkeletonCollisions,
  uniqueSemanticSkeletons: Object.fromEntries([...uniqueSkeletonsByLanguage.entries()].map(([language, values]) => [language, values.size])),
  ql094Rejected,
  candidateSurfaces: Object.freeze({
    cp002HindiPunjabi: "CERTIFIED_SEPARATELY_NOT_ACTIVATED",
    cp004EnglishV13: "CERTIFIED_SEPARATELY_NOT_ACTIVATED",
  }),
  downstreamDeliveryClosed: true,
});

console.log(JSON.stringify(metrics, null, 2));
console.log("PASS_INT_001_CHAPTER_STUDIO_SOAK_COLLISION_V1_AUDIT");
