import assert from "node:assert/strict";
import { SIF_CP_IDS, type SifLocale } from "./types.ts";
import { SIF_001_MANIFEST } from "./chapter-manifest.ts";
import { listSifAuthorities } from "./authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { assertSifLanguageParity, fingerprintSifAuthority, validateSifAuthority } from "./validators.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import { SIF_CP003_PROFILE_BY_AUTHORITY_ID } from "./cp003-quantifier-authorities.ts";
import { solveSifScenario } from "./solver.ts";

const locales: readonly SifLocale[] = ["en-IN", "hi-IN", "pa-IN"];
assert.equal(SIF_001_MANIFEST.cpCount, 17);
assert.deepEqual(SIF_001_MANIFEST.cpIds, SIF_CP_IDS);

for (const cpId of SIF_CP_IDS) {
  const authorities = listSifAuthorities(cpId);
  assert.ok(authorities.length >= 1, `${cpId}: missing authority`);
  for (const authority of authorities) {
    assert.equal(validateSifAuthority(authority).every((gate) => gate.passed), true, `${authority.id}: validation failure`);
    assert.equal(fingerprintSifAuthority(authority).length, 20);
  }
  const trilingual = locales.map((locale) => generateSifQuestion({ cpId, locale, seed: 4000 + SIF_CP_IDS.indexOf(cpId) * 97 }));
  assertSifLanguageParity(trilingual);
  for (const question of trilingual) {
    assert.equal(question.validation.length, 10);
    assert.equal(question.metadata.generationOrder, "LOGIC_FIRST_LANGUAGE_SECOND");
    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.questionBankWritable, false);
  }
  const review = buildSifCpReviewPack({ cpId, locale: "en-IN", seed: 9000 });
  assert.equal(review.questions.length, cpId === "SIF-CP003" ? 24 : 20, `${cpId}: review pack size`);
}

const cp001Authorities = listSifAuthorities("SIF-CP001");
assert.ok(cp001Authorities.length >= 120, "SIF-CP001 requires at least 120 genuine direct-fact scenarios");
assert.equal(new Set(cp001Authorities.map(fingerprintSifAuthority)).size, cp001Authorities.length, "SIF-CP001 semantic authorities must be distinct");
assert.ok(new Set(cp001Authorities.map((entry) => entry.domain)).size >= 7, "SIF-CP001 must cover at least seven context domains");
assert.ok(new Set(cp001Authorities.flatMap((entry) => entry.candidates.flatMap((candidate) => candidate.distractorType ? [candidate.distractorType] : []))).size >= 3, "SIF-CP001 must vary distractor logic");
assert.ok(cp001Authorities.filter((entry) => !/\d/.test(entry.statement["en-IN"])).length >= 36, "SIF-CP001 must retain a substantial non-numeric scenario pool");
const cp001Review = buildSifCpReviewPack({ cpId: "SIF-CP001", locale: "en-IN", seed: 17_001 });
assert.equal(new Set(cp001Review.questions.map((entry) => entry.scenarioId)).size, 20, "SIF-CP001 review pack must expose twenty distinct scenarios");
assert.deepEqual(new Set(cp001Review.questions.map((entry) => entry.answerClass)), new Set(["ONLY_I", "ONLY_II"]), "SIF-CP001 review pack must balance valid-inference position");
assert.deepEqual(new Set(cp001Review.questions.map((entry) => entry.format)), new Set(["TWO_INFERENCES"]), "SIF-CP001 format metadata must match its renderer");
assert.deepEqual(cp001Review.effectiveDistribution, { EASY: 20, MEDIUM: 0, HARD: 0 }, "SIF-CP001 must report actual authority difficulty");
assert.throws(() => generateSifQuestion({ cpId: "SIF-CP001", locale: "en-IN", seed: 1, format: "SINGLE_INFERENCE" }), /not implemented/, "unimplemented renderers must fail explicitly");

const cp002Classes = new Set(Array.from({ length: 5 }, (_, seed) => generateSifQuestion({ cpId: "SIF-CP002", locale: "en-IN", seed }).answerClass));
assert.deepEqual(cp002Classes, new Set(["ONLY_I", "ONLY_II", "BOTH", "NEITHER", "EITHER"]));
const cp002Authorities = listSifAuthorities("SIF-CP002");
assert.equal(cp002Authorities.length, 50, "SIF-CP002 requires fifty balanced authorities");
assert.equal(new Set(cp002Authorities.map(fingerprintSifAuthority)).size, cp002Authorities.length, "SIF-CP002 semantic authorities must be distinct");
for (const answerClass of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER", "EITHER"] as const) assert.equal(cp002Authorities.filter((entry) => generateSifQuestion({ cpId: "SIF-CP002", locale: "en-IN", seed: cp002Authorities.indexOf(entry) }).answerClass === answerClass).length, 10, `SIF-CP002 ${answerClass} authority balance`);
const cp002Review = buildSifCpReviewPack({ cpId: "SIF-CP002", locale: "en-IN", seed: 9_000 });
assert.equal(new Set(cp002Review.questions.map((entry) => entry.scenarioId)).size, 20, "SIF-CP002 review must not repeat scenarios");
for (const answerClass of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER", "EITHER"] as const) assert.equal(cp002Review.questions.filter((entry) => entry.answerClass === answerClass).length, 4, `SIF-CP002 ${answerClass} review balance`);

const cp003Authorities = listSifAuthorities("SIF-CP003");
assert.equal(cp003Authorities.length, 60, "SIF-CP003 requires sixty quantifier authorities");
assert.equal(new Set(cp003Authorities.map(fingerprintSifAuthority)).size, 60, "SIF-CP003 authorities must be semantically distinct");
assert.equal(new Set(cp003Authorities.map((entry) => entry.domain)).size, 8, "SIF-CP003 must cover eight genuine context domains");
assert.equal(Object.keys(SIF_CP003_PROFILE_BY_AUTHORITY_ID).length, 60, "SIF-CP003 profile ledger must cover every authority");
const cp003Kinds = new Set(Object.values(SIF_CP003_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.quantifier));
const cp003Traps = new Set(Object.values(SIF_CP003_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.trap));
assert.equal(cp003Kinds.size, 10, "SIF-CP003 must cover ten quantifier families");
assert.equal(cp003Traps.size, 10, "SIF-CP003 must cover ten controlled trap families");
for (const kind of cp003Kinds) assert.equal(Object.values(SIF_CP003_PROFILE_BY_AUTHORITY_ID).filter((profile) => profile.quantifier === kind).length, 6, `SIF-CP003 ${kind} authority count`);
assert.equal(cp003Authorities.filter((entry) => solveSifScenario(entry) === "BOTH").length, 6, "SIF-CP003 BOTH pool count");
assert.equal(cp003Authorities.filter((entry) => solveSifScenario(entry) === "NEITHER").length, 12, "SIF-CP003 NEITHER pool count");
assert.equal(cp003Authorities.filter((entry) => solveSifScenario(entry) === "ONLY_I").length, 42, "SIF-CP003 single-valid pool count");
const cp003Review = buildSifCpReviewPack({ cpId: "SIF-CP003", locale: "en-IN", seed: 30_000 });
assert.equal(cp003Review.questions.length, 24, "SIF-CP003 review pack size");
assert.equal(new Set(cp003Review.questions.map((entry) => entry.scenarioId)).size, 24, "SIF-CP003 review must not repeat scenarios");
assert.deepEqual(cp003Review.effectiveDistribution, { EASY: 6, MEDIUM: 10, HARD: 8 }, "SIF-CP003 review difficulty balance");
assert.equal(new Set(cp003Review.questions.map((entry) => SIF_CP003_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.quantifier)).size, 10, "SIF-CP003 review must expose all quantifier families");
assert.deepEqual(new Set(cp003Review.questions.map((entry) => entry.answerClass)), new Set(["ONLY_I", "ONLY_II", "BOTH", "NEITHER"]), "SIF-CP003 review must cover all applicable answer states");

console.log("PASS_SIF_001_CHAPTER_REVIEW_CANDIDATE_V1");
