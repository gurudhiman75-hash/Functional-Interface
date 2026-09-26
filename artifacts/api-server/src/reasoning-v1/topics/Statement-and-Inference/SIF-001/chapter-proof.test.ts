import assert from "node:assert/strict";
import { SIF_CP_IDS, type SifLocale } from "./types.ts";
import { SIF_001_MANIFEST } from "./chapter-manifest.ts";
import { listSifAuthorities } from "./authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { assertSifLanguageParity, fingerprintSifAuthority, validateSifAuthority } from "./validators.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import { SIF_CP003_PROFILE_BY_AUTHORITY_ID } from "./cp003-quantifier-authorities.ts";
import { solveSifScenario } from "./solver.ts";
import { SIF_CP004_PROFILE_BY_AUTHORITY_ID } from "./cp004-comparison-authorities.ts";
import { SIF_CP005_PROFILE_BY_AUTHORITY_ID } from "./cp005-suggestive-reason-authorities.ts";
import { SIF_CP006_PROFILE_BY_AUTHORITY_ID } from "./cp006-purpose-authorities.ts";
import { SIF_CP007_PROFILE_BY_AUTHORITY_ID } from "./cp007-negative-authorities.ts";
import { SIF_CP008_PROFILE_BY_AUTHORITY_ID } from "./cp008-contextual-authorities.ts";
import { SIF_CP009_PROFILE_BY_AUTHORITY_ID } from "./cp009-data-authorities.ts";
import { SIF_CP010_PROFILE_BY_AUTHORITY_ID } from "./cp010-conditional-authorities.ts";
import { SIF_CP011_PROFILE_BY_AUTHORITY_ID } from "./cp011-multiple-factor-authorities.ts";

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
  assert.equal(review.questions.length, cpId === "SIF-CP003" || cpId === "SIF-CP004" || cpId === "SIF-CP005" || cpId === "SIF-CP006" || cpId === "SIF-CP007" || cpId === "SIF-CP008" || cpId === "SIF-CP009" || cpId === "SIF-CP010" ? 24 : 20, `${cpId}: review pack size`);
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

const cp004Authorities = listSifAuthorities("SIF-CP004");
assert.equal(cp004Authorities.length, 48, "SIF-CP004 requires forty-eight distinct comparison authorities");
assert.equal(new Set(cp004Authorities.map(fingerprintSifAuthority)).size, 48, "SIF-CP004 authorities must be semantically distinct");
assert.equal(Object.keys(SIF_CP004_PROFILE_BY_AUTHORITY_ID).length, 48, "SIF-CP004 profile ledger must cover every authority");
assert.equal(new Set(Object.values(SIF_CP004_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.kind)).size, 8, "SIF-CP004 must cover eight comparison families");
for (const kind of new Set(Object.values(SIF_CP004_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.kind))) assert.equal(Object.values(SIF_CP004_PROFILE_BY_AUTHORITY_ID).filter((profile) => profile.kind === kind).length, 6, `SIF-CP004 ${kind} authority count`);
assert.equal(new Set(cp004Authorities.map((entry) => entry.domain)).size, 8, "SIF-CP004 must cover eight context domains");
assert.equal(cp004Authorities.filter((entry) => entry.difficulty === "EASY").length, 19, "SIF-CP004 easy authority count");
assert.equal(cp004Authorities.filter((entry) => entry.difficulty === "MEDIUM").length, 29, "SIF-CP004 medium authority count");
assert.ok(cp004Authorities.every((entry) => !entry.identityGuard.causeEffectQuestion && entry.mechanisms.includes("COMPARISON")), "SIF-CP004 must remain comparison inference, not cause/effect");
const cp004Review = buildSifCpReviewPack({ cpId: "SIF-CP004", locale: "en-IN", seed: 40_000 });
assert.equal(cp004Review.questions.length, 24, "SIF-CP004 review pack size");
assert.equal(new Set(cp004Review.questions.map((entry) => entry.scenarioId)).size, 24, "SIF-CP004 review must not repeat scenarios");
assert.deepEqual(cp004Review.effectiveDistribution, { EASY: 10, MEDIUM: 14, HARD: 0 }, "SIF-CP004 review difficulty balance");
assert.equal(new Set(cp004Review.questions.map((entry) => SIF_CP004_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.kind)).size, 8, "SIF-CP004 review must expose all comparison families");
for (const kind of new Set(Object.values(SIF_CP004_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.kind))) assert.equal(cp004Review.questions.filter((entry) => SIF_CP004_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.kind === kind).length, 3, `SIF-CP004 review must sample three ${kind} scenarios`);
assert.equal(new Set(cp004Review.questions.map((entry) => entry.answerClass)).size, 2, "SIF-CP004 review must balance valid inference position");

const cp005Authorities = listSifAuthorities("SIF-CP005");
assert.equal(cp005Authorities.length, 48, "SIF-CP005 requires forty-eight suggestive-reason authorities");
assert.equal(new Set(cp005Authorities.map(fingerprintSifAuthority)).size, 48, "SIF-CP005 authorities must be semantically distinct");
assert.equal(Object.keys(SIF_CP005_PROFILE_BY_AUTHORITY_ID).length, 48, "SIF-CP005 profile ledger must cover every authority");
assert.equal(new Set(Object.values(SIF_CP005_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.kind)).size, 8, "SIF-CP005 must cover eight evidence patterns");
for (const kind of new Set(Object.values(SIF_CP005_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.kind))) assert.equal(Object.values(SIF_CP005_PROFILE_BY_AUTHORITY_ID).filter((profile) => profile.kind === kind).length, 6, `SIF-CP005 ${kind} authority count`);
assert.equal(new Set(cp005Authorities.map((entry) => entry.domain)).size, 8, "SIF-CP005 must cover eight context domains");
assert.ok(cp005Authorities.every((entry) => entry.difficulty === "MEDIUM" && entry.mechanisms.includes("SUGGESTIVE_REASON") && !entry.identityGuard.causeEffectQuestion), "SIF-CP005 must stay medium-level suggestive inference, separate from Cause & Effect");
const cp005Review = buildSifCpReviewPack({ cpId: "SIF-CP005", locale: "en-IN", seed: 50_000 });
assert.equal(cp005Review.questions.length, 24, "SIF-CP005 review pack size");
assert.equal(new Set(cp005Review.questions.map((entry) => entry.scenarioId)).size, 24, "SIF-CP005 review must not repeat scenarios");
assert.deepEqual(cp005Review.effectiveDistribution, { EASY: 0, MEDIUM: 24, HARD: 0 }, "SIF-CP005 must preserve its medium-only difficulty contract");
for (const kind of new Set(Object.values(SIF_CP005_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.kind))) assert.equal(cp005Review.questions.filter((entry) => SIF_CP005_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.kind === kind).length, 3, `SIF-CP005 review must sample three ${kind} scenarios`);
assert.equal(cp005Review.questions.filter((entry) => entry.answerClass === "ONLY_I").length, 12, "SIF-CP005 review must balance inference I");
assert.equal(cp005Review.questions.filter((entry) => entry.answerClass === "ONLY_II").length, 12, "SIF-CP005 review must balance inference II");

const cp006Authorities = listSifAuthorities("SIF-CP006");
assert.equal(cp006Authorities.length, 48, "SIF-CP006 requires forty-eight purpose authorities");
assert.equal(new Set(cp006Authorities.map(fingerprintSifAuthority)).size, 48, "SIF-CP006 authorities must be semantically distinct");
assert.equal(Object.keys(SIF_CP006_PROFILE_BY_AUTHORITY_ID).length, 48, "SIF-CP006 profile ledger must cover every authority");
assert.equal(new Set(Object.values(SIF_CP006_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.family)).size, 8, "SIF-CP006 must cover eight purpose families");
for (const family of new Set(Object.values(SIF_CP006_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.family))) assert.equal(Object.values(SIF_CP006_PROFILE_BY_AUTHORITY_ID).filter((profile) => profile.family === family).length, 6, `SIF-CP006 ${family} authority count`);
assert.equal(new Set(cp006Authorities.map((entry) => entry.domain)).size, 7, "SIF-CP006 must cover seven context domains");
assert.ok(cp006Authorities.every((entry) => entry.difficulty === "MEDIUM" && entry.mechanisms.includes("PURPOSE") && !entry.identityGuard.causeEffectQuestion && !entry.identityGuard.courseOfActionQuestion), "SIF-CP006 must remain medium-level purpose inference");
assert.ok(cp006Authorities.some((entry) => entry.candidates.some((candidate) => candidate.distractorType === "INTENT_WITHOUT_EVIDENCE")) && cp006Authorities.some((entry) => entry.candidates.some((candidate) => candidate.distractorType === "OVERGENERALISATION")), "SIF-CP006 must vary unsupported-motive and scope traps");
const cp006Review = buildSifCpReviewPack({ cpId: "SIF-CP006", locale: "en-IN", seed: 60_000 });
assert.equal(cp006Review.questions.length, 24, "SIF-CP006 review pack size");
assert.equal(new Set(cp006Review.questions.map((entry) => entry.scenarioId)).size, 24, "SIF-CP006 review must not repeat scenarios");
assert.deepEqual(cp006Review.effectiveDistribution, { EASY: 0, MEDIUM: 24, HARD: 0 }, "SIF-CP006 must preserve its medium-only difficulty contract");
for (const family of new Set(Object.values(SIF_CP006_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.family))) assert.equal(cp006Review.questions.filter((entry) => SIF_CP006_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.family === family).length, 3, `SIF-CP006 review must sample three ${family} scenarios`);
assert.equal(cp006Review.questions.filter((entry) => entry.answerClass === "ONLY_I").length, 12, "SIF-CP006 review must balance inference I");
assert.equal(cp006Review.questions.filter((entry) => entry.answerClass === "ONLY_II").length, 12, "SIF-CP006 review must balance inference II");

const cp007Authorities = listSifAuthorities("SIF-CP007");
assert.equal(cp007Authorities.length, 24, "SIF-CP007 requires twenty-four curated negative/restrictive authorities");
assert.equal(new Set(cp007Authorities.map(fingerprintSifAuthority)).size, 24, "SIF-CP007 authorities must be semantically distinct");
assert.equal(Object.keys(SIF_CP007_PROFILE_BY_AUTHORITY_ID).length, 24, "SIF-CP007 profile ledger must cover every authority");
assert.equal(new Set(Object.values(SIF_CP007_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.family)).size, 8, "SIF-CP007 must cover eight negative/restrictive families");
for (const family of new Set(Object.values(SIF_CP007_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.family))) assert.equal(Object.values(SIF_CP007_PROFILE_BY_AUTHORITY_ID).filter((profile) => profile.family === family).length, 3, `SIF-CP007 ${family} authority count`);
assert.deepEqual(cp007Authorities.reduce((counts, entry) => ({ ...counts, [entry.difficulty]: counts[entry.difficulty] + 1 }), { EASY: 0, MEDIUM: 0, HARD: 0 }), { EASY: 0, MEDIUM: 12, HARD: 12 }, "SIF-CP007 pool must stay medium-to-hard");
assert.ok(cp007Authorities.every((entry) => entry.mechanisms.includes("NEGATIVE_RESTRICTION") && entry.identityGuard.evaluatesSupport), "SIF-CP007 must remain negative/restrictive inference");
assert.ok(cp007Authorities.every((entry) => entry.facts.length >= (entry.difficulty === "HARD" ? 3 : 2) && entry.facts.length <= 5), "SIF-CP007 medium/hard authorities need 2–5 structured facts, with at least three for Hard");
const cp007Review = buildSifCpReviewPack({ cpId: "SIF-CP007", locale: "en-IN", seed: 70_000 });
assert.equal(cp007Review.questions.length, 24, "SIF-CP007 review pack size");
assert.equal(new Set(cp007Review.questions.map((entry) => entry.scenarioId)).size, 24, "SIF-CP007 review must not repeat scenarios");
assert.deepEqual(cp007Review.effectiveDistribution, { EASY: 0, MEDIUM: 12, HARD: 12 }, "SIF-CP007 review must preserve the medium-to-hard scope");
for (const family of new Set(Object.values(SIF_CP007_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.family))) assert.equal(cp007Review.questions.filter((entry) => SIF_CP007_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.family === family).length, 3, `SIF-CP007 review must sample three ${family} scenarios`);
assert.equal(cp007Review.questions.filter((entry) => entry.answerClass === "ONLY_I").length, 12, "SIF-CP007 review must balance inference I");
assert.equal(cp007Review.questions.filter((entry) => entry.answerClass === "ONLY_II").length, 12, "SIF-CP007 review must balance inference II");

const cp008Authorities = listSifAuthorities("SIF-CP008");
assert.equal(cp008Authorities.length, 32, "SIF-CP008 requires thirty-two curated contextual-inference authorities");
assert.equal(Object.keys(SIF_CP008_PROFILE_BY_AUTHORITY_ID).length, 32, "SIF-CP008 profile ledger must cover every authority");
assert.equal(new Set(cp008Authorities.map(fingerprintSifAuthority)).size, 32, "SIF-CP008 authorities must be semantically distinct");
const cp008Families = [...new Set(Object.values(SIF_CP008_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.family))];
assert.equal(cp008Families.length, 8, "SIF-CP008 must cover eight contextual-synthesis families");
for (const family of cp008Families) assert.equal(Object.values(SIF_CP008_PROFILE_BY_AUTHORITY_ID).filter((profile) => profile.family === family).length, 4, `SIF-CP008 ${family} authority count`);
assert.deepEqual(cp008Authorities.reduce((counts, entry) => ({ ...counts, [entry.difficulty]: counts[entry.difficulty] + 1 }), { EASY: 0, MEDIUM: 0, HARD: 0 }), { EASY: 0, MEDIUM: 16, HARD: 16 }, "SIF-CP008 pool must stay medium-to-hard");
for (const [authorityIndex, entry] of cp008Authorities.entries()) {
  const expectedSentences = entry.difficulty === "MEDIUM" ? 3 : 4;
  const triplet = locales.map((locale) => generateSifQuestion({ cpId: "SIF-CP008", locale, seed: 80_000 + authorityIndex }));
  assert.ok(triplet.every((question) => question.scenarioId === entry.id && question.validation.every((gate) => gate.passed)), `SIF-CP008 ${entry.id} must pass all gates in all locales`);
  assertSifLanguageParity(triplet);
  for (const locale of locales) {
    const passage = entry.statement[locale];
    assert.equal(passage.trim().split(/(?<=[.!?।])\s+/).length, expectedSentences, `SIF-CP008 ${entry.id} ${locale} passage length`);
    assert.ok(entry.facts.every((fact) => fact.text[locale].trim().length > 0), `SIF-CP008 ${entry.id} ${locale} facts`);
  }
  assert.ok(entry.mechanisms.includes("CONTEXT_SYNTHESIS") && entry.mechanisms.includes("MULTIPLE_FACTOR"), `SIF-CP008 ${entry.id} must synthesize multiple facts`);
  for (const localized of [entry.statement, ...entry.facts.map((fact) => fact.text), ...entry.candidates.map((candidate) => candidate.text), entry.explanation]) assert.notEqual(localized["hi-IN"], localized["pa-IN"], `SIF-CP008 ${entry.id} must keep Hindi and Punjabi distinct`);
}
const cp008Review = buildSifCpReviewPack({ cpId: "SIF-CP008", locale: "en-IN", seed: 80_000 });
assert.equal(cp008Review.questions.length, 24, "SIF-CP008 review pack size");
assert.equal(new Set(cp008Review.questions.map((entry) => entry.scenarioId)).size, 24, "SIF-CP008 review must not repeat scenarios");
assert.deepEqual(cp008Review.effectiveDistribution, { EASY: 0, MEDIUM: 12, HARD: 12 }, "SIF-CP008 review must balance medium and hard scenarios");
for (const family of cp008Families) assert.equal(cp008Review.questions.filter((entry) => SIF_CP008_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.family === family).length, 3, `SIF-CP008 review must sample three ${family} scenarios`);
assert.equal(cp008Review.questions.filter((entry) => entry.answerClass === "ONLY_I").length, 12, "SIF-CP008 review must balance inference I");
assert.equal(cp008Review.questions.filter((entry) => entry.answerClass === "ONLY_II").length, 12, "SIF-CP008 review must balance inference II");

const cp009Authorities = listSifAuthorities("SIF-CP009");
assert.equal(cp009Authorities.length, 24, "SIF-CP009 requires twenty-four curated numerical-verbal authorities");
assert.equal(Object.keys(SIF_CP009_PROFILE_BY_AUTHORITY_ID).length, 24, "SIF-CP009 profile ledger must cover every authority");
assert.equal(new Set(cp009Authorities.map(fingerprintSifAuthority)).size, 24, "SIF-CP009 authorities must be semantically distinct");
const cp009Families = [...new Set(Object.values(SIF_CP009_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.family))];
assert.equal(cp009Families.length, 8, "SIF-CP009 must cover eight numerical inference families");
for (const family of cp009Families) assert.equal(Object.values(SIF_CP009_PROFILE_BY_AUTHORITY_ID).filter((profile) => profile.family === family).length, 3, `SIF-CP009 ${family} authority count`);
assert.ok(cp009Authorities.every((entry) => entry.difficulty === "MEDIUM" && entry.mechanisms.includes("DATA_COMPARISON") && entry.identityGuard.evaluatesSupport), "SIF-CP009 must remain medium-level verbal data inference");
for (const [authorityIndex, entry] of cp009Authorities.entries()) {
  const triplet = locales.map((locale) => generateSifQuestion({ cpId: "SIF-CP009", locale, seed: 90_000 + authorityIndex }));
  assert.ok(triplet.every((question) => question.scenarioId === entry.id && question.validation.every((gate) => gate.passed)), `SIF-CP009 ${entry.id} must pass all gates in all locales`);
  assertSifLanguageParity(triplet);
  for (const locale of locales) {
    const passage = entry.statement[locale];
    assert.equal(passage.trim().split(/(?<=[.!?।])\s+/).length, 3, `SIF-CP009 ${entry.id} ${locale} must contain three short sentences`);
    assert.ok(entry.facts.every((fact) => fact.text[locale].trim().length > 0), `SIF-CP009 ${entry.id} ${locale} facts`);
  }
  for (const localized of [entry.statement, ...entry.facts.map((fact) => fact.text), ...entry.candidates.map((candidate) => candidate.text), entry.explanation]) assert.notEqual(localized["hi-IN"], localized["pa-IN"], `SIF-CP009 ${entry.id} must keep Hindi and Punjabi distinct`);
}
const cp009Review = buildSifCpReviewPack({ cpId: "SIF-CP009", locale: "en-IN", seed: 90_000 });
assert.equal(cp009Review.questions.length, 24, "SIF-CP009 review pack size");
assert.equal(new Set(cp009Review.questions.map((entry) => entry.scenarioId)).size, 24, "SIF-CP009 review must not repeat scenarios");
assert.deepEqual(cp009Review.effectiveDistribution, { EASY: 0, MEDIUM: 24, HARD: 0 }, "SIF-CP009 must remain medium-only");
for (const family of cp009Families) assert.equal(cp009Review.questions.filter((entry) => SIF_CP009_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.family === family).length, 3, `SIF-CP009 review must sample three ${family} scenarios`);
assert.equal(cp009Review.questions.filter((entry) => entry.answerClass === "ONLY_I").length, 12, "SIF-CP009 review must balance inference I");
assert.equal(cp009Review.questions.filter((entry) => entry.answerClass === "ONLY_II").length, 12, "SIF-CP009 review must balance inference II");

const cp010Authorities = listSifAuthorities("SIF-CP010");
assert.equal(cp010Authorities.length, 24, "SIF-CP010 requires twenty-four curated conditional-inference authorities");
assert.equal(Object.keys(SIF_CP010_PROFILE_BY_AUTHORITY_ID).length, 24, "SIF-CP010 profile ledger must cover every authority");
assert.equal(new Set(cp010Authorities.map(fingerprintSifAuthority)).size, 24, "SIF-CP010 authorities must be semantically distinct");
const cp010Families = [...new Set(Object.values(SIF_CP010_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.family))];
assert.equal(cp010Families.length, 8, "SIF-CP010 must cover eight conditional inference families");
for (const family of cp010Families) assert.equal(Object.values(SIF_CP010_PROFILE_BY_AUTHORITY_ID).filter((profile) => profile.family === family).length, 3, `SIF-CP010 ${family} authority count`);
assert.deepEqual(cp010Authorities.reduce((counts, entry) => ({ ...counts, [entry.difficulty]: counts[entry.difficulty] + 1 }), { EASY: 0, MEDIUM: 0, HARD: 0 }), { EASY: 0, MEDIUM: 12, HARD: 12 }, "SIF-CP010 pool must remain medium-to-hard");
assert.ok(cp010Authorities.every((entry) => entry.mechanisms.includes("CONDITIONAL_DIRECTION") && entry.identityGuard.evaluatesSupport), "SIF-CP010 must remain conditional verbal inference");
for (const [authorityIndex, entry] of cp010Authorities.entries()) {
  const triplet = locales.map((locale) => generateSifQuestion({ cpId: "SIF-CP010", locale, seed: 91_008 + authorityIndex }));
  assert.ok(triplet.every((question) => question.scenarioId === entry.id && question.validation.every((gate) => gate.passed)), `SIF-CP010 ${entry.id} must pass all gates in all locales`);
  assertSifLanguageParity(triplet);
  for (const locale of locales) {
    const passage = entry.statement[locale];
    assert.equal(passage.trim().split(/(?<=[.!?।])\s+/).length, 3, `SIF-CP010 ${entry.id} ${locale} must contain three short sentences`);
    assert.ok(entry.facts.every((fact) => fact.text[locale].trim().length > 0), `SIF-CP010 ${entry.id} ${locale} facts`);
  }
  for (const localized of [entry.statement, ...entry.facts.map((fact) => fact.text), ...entry.candidates.map((candidate) => candidate.text), entry.explanation]) assert.notEqual(localized["hi-IN"], localized["pa-IN"], `SIF-CP010 ${entry.id} must keep Hindi and Punjabi distinct`);
}
const cp010Review = buildSifCpReviewPack({ cpId: "SIF-CP010", locale: "en-IN", seed: 91_008 });
assert.equal(cp010Review.questions.length, 24, "SIF-CP010 review pack size");
assert.equal(new Set(cp010Review.questions.map((entry) => entry.scenarioId)).size, 24, "SIF-CP010 review must not repeat scenarios");
assert.deepEqual(cp010Review.effectiveDistribution, { EASY: 0, MEDIUM: 12, HARD: 12 }, "SIF-CP010 must remain medium-to-hard");
for (const family of cp010Families) assert.equal(cp010Review.questions.filter((entry) => SIF_CP010_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.family === family).length, 3, `SIF-CP010 review must sample three ${family} scenarios`);
assert.equal(cp010Review.questions.filter((entry) => entry.answerClass === "ONLY_I").length, 12, "SIF-CP010 review must balance inference I");
assert.equal(cp010Review.questions.filter((entry) => entry.answerClass === "ONLY_II").length, 12, "SIF-CP010 review must balance inference II");

console.log("PASS_SIF_001_CHAPTER_REVIEW_CANDIDATE_V1");

const cp011Authorities = listSifAuthorities("SIF-CP011");
assert.equal(cp011Authorities.length, 24, "SIF-CP011 requires twenty-four curated multiple-factor inference authorities");
assert.equal(Object.keys(SIF_CP011_PROFILE_BY_AUTHORITY_ID).length, 24, "SIF-CP011 profile ledger must cover every authority");
assert.equal(new Set(cp011Authorities.map(fingerprintSifAuthority)).size, 24, "SIF-CP011 authorities must be semantically distinct");
const cp011Families = [...new Set(Object.values(SIF_CP011_PROFILE_BY_AUTHORITY_ID).map((profile) => profile.family))];
assert.equal(cp011Families.length, 8, "SIF-CP011 must cover eight multiple-factor inference families");
for (const family of cp011Families) assert.equal(Object.values(SIF_CP011_PROFILE_BY_AUTHORITY_ID).filter((profile) => profile.family === family).length, 3, `SIF-CP011 ${family} authority count`);
assert.deepEqual(cp011Authorities.reduce((counts, entry) => ({ ...counts, [entry.difficulty]: counts[entry.difficulty] + 1 }), { EASY: 0, MEDIUM: 0, HARD: 0 }), { EASY: 0, MEDIUM: 12, HARD: 12 }, "SIF-CP011 pool must remain medium-to-hard");
assert.ok(cp011Authorities.every((entry) => entry.mechanisms.includes("MULTIPLE_FACTOR") && entry.identityGuard.evaluatesSupport), "SIF-CP011 must remain multiple-factor verbal inference");
for (const [authorityIndex, entry] of cp011Authorities.entries()) {
  const triplet = locales.map((locale) => generateSifQuestion({ cpId: "SIF-CP011", locale, seed: 91_008 + authorityIndex }));
  assert.ok(triplet.every((question) => question.scenarioId === entry.id && question.validation.every((gate) => gate.passed)), `SIF-CP011 ${entry.id} must pass all gates in all locales`);
  assertSifLanguageParity(triplet);
  for (const locale of locales) {
    const passage = entry.statement[locale];
    assert.equal(passage.trim().split(/(?<=[.!?।])\s+/).length, 3, `SIF-CP011 ${entry.id} ${locale} must contain three short sentences`);
    assert.ok(entry.facts.every((fact) => fact.text[locale].trim().length > 0), `SIF-CP011 ${entry.id} ${locale} facts`);
  }
  for (const localized of [entry.statement, ...entry.facts.map((fact) => fact.text), ...entry.candidates.map((candidate) => candidate.text), entry.explanation]) assert.notEqual(localized["hi-IN"], localized["pa-IN"], `SIF-CP011 ${entry.id} must keep Hindi and Punjabi distinct`);
}
const cp011Review = buildSifCpReviewPack({ cpId: "SIF-CP011", locale: "en-IN", seed: 91_008 });
assert.equal(cp011Review.questions.length, 24, "SIF-CP011 review pack size");
assert.equal(new Set(cp011Review.questions.map((entry) => entry.scenarioId)).size, 24, "SIF-CP011 review must not repeat scenarios");
assert.deepEqual(cp011Review.effectiveDistribution, { EASY: 0, MEDIUM: 12, HARD: 12 }, "SIF-CP011 must remain medium-to-hard");
for (const family of cp011Families) assert.equal(cp011Review.questions.filter((entry) => SIF_CP011_PROFILE_BY_AUTHORITY_ID[entry.scenarioId]?.family === family).length, 3, `SIF-CP011 review must sample three ${family} scenarios`);
assert.equal(cp011Review.questions.filter((entry) => entry.answerClass === "ONLY_I").length, 12, "SIF-CP011 review must balance inference I");
assert.equal(cp011Review.questions.filter((entry) => entry.answerClass === "ONLY_II").length, 12, "SIF-CP011 review must balance inference II");

console.log("PASS_SIF_001_CHAPTER_REVIEW_CANDIDATE_V1");
