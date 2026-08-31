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
import { INT_001_WAVE03_QL_IDS } from "./int-001-wave03-permanent-allocation-v1";
import {
  INT_001_WAVE05_QUESTION_STUDIO_LANGUAGES,
  INT_001_WAVE05_QUESTION_STUDIO_PACKAGE,
  previewInt001Wave05QuestionStudio,
} from "./int-001-wave05-question-studio-registration-v1";

export const INT_001_WAVE05_CHAPTER_SOAK_VERSION = "INT-001-WAVE05-CHAPTER-SOAK-COLLISION-v1" as const;
const SEEDS_PER_QL_LANGUAGE = 4;
const EXPECTED_BASE_QLS = 130;
const EXPECTED_TOTAL_QLS = 133;
const INTENTIONAL_VACANCY = "INT-QL-094";
const FORBIDDEN = /\b(multiplier|combined\s+factor|amount\s+factor|return[-\s]difference\s+factor|growth\s+factor|depreciation\s+factor)\b|गुणक|ਗੁਣਕ/iu;

type Generated = Readonly<{ question: any }>;
type Surface = Readonly<{ cpId: string; qlIds: readonly string[]; languages: readonly string[]; generate: (qlId: string, language: string, seed: string) => Promise<Generated> }>;

function firstPackage(packages: readonly any[]) {
  assert.equal(packages.length, 1);
  return packages[0];
}
function qls(pkg: any) { return Object.freeze([...(pkg.permanentQlIds ?? pkg.qlIds)].map(String)); }
function languages(pkg: any) { return Object.freeze([...pkg.supportedLanguages].map(String)); }
async function fromBatch(generator: (request: any) => Promise<any>, qlId: string, language: string, seed: string): Promise<Generated> {
  const result = await generator({ qlId, questionLanguageId: qlId, language, seed, count: 1 });
  assert.equal(result.questions.length, 1);
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

const baseSurfaces: readonly Surface[] = Object.freeze([
  { cpId: "INT-CP-001", qlIds: qls(cp001), languages: languages(cp001), generate: (q, l, s) => fromBatch(generateIntCp001QuestionStudioBatch, q, l, s) },
  { cpId: "INT-CP-002", qlIds: qls(cp002), languages: languages(cp002), generate: (q, l, s) => fromBatch(generateIntCp002QuestionStudioBatch, q, l, s) },
  { cpId: "INT-CP-003", qlIds: qls(cp003), languages: languages(cp003), generate: (q, l, s) => fromBatch(generateIntCp003QuestionStudioBatch, q, l, s) },
  { cpId: "INT-CP-004", qlIds: qls(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE), languages: languages(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE), generate: async (q, l, s) => ({ question: previewIntCp004QuestionStudioReview({ qlId: q as any, language: l as any, seed: s, count: 1 }).questions[0] }) },
  { cpId: "INT-CP-005", qlIds: qls(cp005), languages: languages(cp005), generate: (q, l, s) => fromBatch(generateIntCp005QuestionStudioBatch, q, l, s) },
  { cpId: "INT-CP-006", qlIds: qls(cp006), languages: languages(cp006), generate: (q, l, s) => fromBatch(generateIntCp006QuestionStudioBatch, q, l, s) },
  { cpId: "INT-CP-007", qlIds: qls(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE), languages: languages(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE), generate: async (q, l, s) => ({ question: previewIntCp007QuestionStudioReview({ qlId: q as any, language: l as any, seed: s, count: 1 }).questions[0] }) },
  { cpId: "INT-CP-008", qlIds: qls(cp008), languages: languages(cp008), generate: (q, l, s) => fromBatch(generateIntCp008QuestionStudioBatch, q, l, s) },
  { cpId: "INT-CP-009", qlIds: qls(cp009), languages: languages(cp009), generate: (q, l, s) => fromBatch(generateIntCp009QuestionStudioBatch, q, l, s) },
  { cpId: "INT-CP-010", qlIds: qls(cp010), languages: languages(cp010), generate: (q, l, s) => fromBatch(generateIntCp010QuestionStudioBatch, q, l, s) },
]);

const wave05: Surface = Object.freeze({
  cpId: "INT-WAVE05",
  qlIds: qls(INT_001_WAVE05_QUESTION_STUDIO_PACKAGE),
  languages: [...INT_001_WAVE05_QUESTION_STUDIO_LANGUAGES],
  generate: async (q, l, s) => ({ question: previewInt001Wave05QuestionStudio({ qlId: q as any, language: l as any, seed: s, count: 1 }).questions[0] }),
});

const baseQlIds = baseSurfaces.flatMap((surface) => surface.qlIds);
assert.equal(baseQlIds.length, EXPECTED_BASE_QLS, "Interest base package count drifted.");
assert.equal(new Set(baseQlIds).size, EXPECTED_BASE_QLS, "Interest base QLs are not unique.");
assert.equal(baseQlIds.includes(INTENTIONAL_VACANCY), false, "Intentional INT-QL-094 vacancy must remain absent.");
const allQlIds = [...baseQlIds, ...wave05.qlIds];
assert.equal(allQlIds.length, EXPECTED_TOTAL_QLS);
assert.equal(new Set(allQlIds).size, EXPECTED_TOTAL_QLS, "Wave05 introduced a duplicate permanent QL identity.");
for (const qlId of INT_001_WAVE03_QL_IDS) assert.ok(allQlIds.includes(qlId));
assert.equal(allQlIds.includes("INT-QL-135"), false, "Next free QL must remain unallocated.");

function explanationLines(question: any) {
  const values: string[] = [];
  const add = (value: unknown) => { if (value !== undefined && value !== null && String(value).trim()) values.push(...String(value).split(/\n+/u).map((line) => line.trim()).filter(Boolean)); };
  if (typeof question.explanation === "string") add(question.explanation);
  else if (question.explanation) {
    add(question.explanation.whatAsked); add(question.explanation.keyIdea);
    for (const line of question.explanation.lines ?? []) add(line);
    for (const line of question.explanation.steps ?? []) add(line);
    add(question.explanation.conclusion); add(question.explanation.finalAnswer); add(question.explanation.shortcut); add(question.explanation.commonTrap);
  }
  for (const line of question.packageExplanation?.lines ?? []) add(line);
  return values;
}
function normalizeStem(stem: string) { return stem.toLowerCase().replace(/\s+/gu, " ").replace(/[.,;:!?।॥]/gu, "").trim(); }

const stemOwners = new Map<string, string>();
let generatedQuestions = 0;
let deterministicChecks = 0;
let optionAnswerChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let crossQlExactStemCollisions = 0;
const collisionSamples: string[] = [];

for (const surface of [...baseSurfaces, wave05]) {
  for (const qlId of surface.qlIds) {
    for (const language of surface.languages) {
      for (let index = 0; index < SEEDS_PER_QL_LANGUAGE; index += 1) {
        const seed = `INT-001-WAVE05-SOAK:${surface.cpId}:${qlId}:${language}:${index}`;
        const first = (await surface.generate(qlId, language, seed)).question;
        const second = (await surface.generate(qlId, language, seed)).question;
        assert.ok(first && second, `${qlId}/${language}: generator returned no question.`);
        assert.equal(first.stem, second.stem, `${qlId}/${language}: nondeterministic stem.`);
        assert.equal(JSON.stringify(first.options), JSON.stringify(second.options), `${qlId}/${language}: nondeterministic options.`);
        assert.equal(first.correctIndex, second.correctIndex, `${qlId}/${language}: nondeterministic answer position.`);
        deterministicChecks += 3;

        assert.equal(first.options.length, 4, `${qlId}/${language}: expected four options.`);
        assert.equal(new Set(first.options).size, 4, `${qlId}/${language}: duplicate option text.`);
        assert.ok(Number.isInteger(first.correctIndex) && first.correctIndex >= 0 && first.correctIndex < 4);
        const displayedAnswer = first.answer ?? first.canonicalAnswer?.display ?? first.options[first.correctIndex];
        if (typeof displayedAnswer === "string") assert.equal(first.options[first.correctIndex], displayedAnswer);
        optionAnswerChecks += 4;

        const lines = explanationLines(first);
        assert.ok(lines.length > 0, `${qlId}/${language}: missing learner explanation.`);
        assert.equal(lines.some((line) => FORBIDDEN.test(line)), false, `${qlId}/${language}: forbidden factor/multiplier narration returned.`);
        assert.ok(lines.some((line) => /\d/u.test(line)), `${qlId}/${language}: explanation lacks numerical working.`);
        explanationChecks += 3;

        assert.notEqual(first.questionBankWritable, true, `${qlId}/${language}: Question Bank write unexpectedly opened.`);
        assert.notEqual(first.testEligible, true, `${qlId}/${language}: test eligibility unexpectedly opened.`);
        assert.notEqual(first.mockTestEligible, true, `${qlId}/${language}: mock eligibility unexpectedly opened.`);
        assert.notEqual(first.publiclyPublishable, true, `${qlId}/${language}: public delivery unexpectedly opened.`);
        lifecycleChecks += 4;

        const normalized = normalizeStem(String(first.stem));
        const key = `${language}|${normalized}`;
        const owner = stemOwners.get(key);
        if (owner && owner !== qlId) {
          crossQlExactStemCollisions += 1;
          if (collisionSamples.length < 10) collisionSamples.push(`${language}: ${owner} <> ${qlId}: ${first.stem}`);
        } else if (!owner) stemOwners.set(key, qlId);
        generatedQuestions += 1;
      }
    }
  }
}

assert.equal(crossQlExactStemCollisions, 0, `Cross-QL exact stem collisions detected: ${collisionSamples.join(" | ")}`);
console.log(JSON.stringify({
  version: INT_001_WAVE05_CHAPTER_SOAK_VERSION,
  basePermanentQls: EXPECTED_BASE_QLS,
  wave05Qls: INT_001_WAVE03_QL_IDS,
  resultingPermanentQls: new Set(allQlIds).size,
  intentionalVacancy: INTENTIONAL_VACANCY,
  nextFreeQl: "INT-QL-135",
  seedsPerQlLanguage: SEEDS_PER_QL_LANGUAGE,
  generatedQuestions,
  deterministicChecks,
  optionAnswerChecks,
  explanationChecks,
  lifecycleChecks,
  crossQlExactStemCollisions,
  collisionSamples,
  policy: {
    exactly133PermanentQls: true,
    directCalculationExplanations: true,
    deterministicGeneration: true,
    downstreamDeliveryClosed: true,
    noCrossQlExactStemCollisions: true,
  },
}, null, 2));
console.log("PASS_INT_001_WAVE05_CHAPTER_SOAK_COLLISION_V1");
