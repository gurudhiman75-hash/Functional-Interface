import assert from "node:assert/strict";
import { generateStaLegacyBankQuestion } from "./exam-format-legacy-bank.ts";
import type { StaExamLocale } from "./exam-format-extension.ts";

const CASES_PER_LOCALE = Number(process.env.STA_LEGACY_BANK_CASES_PER_LOCALE ?? 1024);
const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly StaExamLocale[];

const answerKinds = new Set<string>();
const sourceProfiles = new Set<string>();
const qls = new Set<string>();
const difficulties = new Set<string>();
const answerCounts: Record<string, number[]> = {};
let generatedQuestions = 0;
let deterministicReplayChecks = 0;
let eitherOptionChecks = 0;

for (const locale of LOCALES) {
  const positions = [0, 0, 0, 0, 0];
  const localeAnswerKinds = new Set<string>();
  for (let index = 0; index < CASES_PER_LOCALE; index += 1) {
    const seed = `sta-legacy-bank-2x5:${locale}:${index}`;
    const question = generateStaLegacyBankQuestion(seed, locale);
    const replay = generateStaLegacyBankQuestion(seed, locale);
    assert.deepEqual(replay, question, `${locale}/${seed}: legacy deterministic replay drift`);
    deterministicReplayChecks += 1;

    assert.equal(question.presentationProfile, "BANK_LEGACY_2X5");
    assert.equal(question.candidateCount, 2);
    assert.equal(question.optionCount, 5);
    assert.equal(question.sourceProfile, "BANKING");
    assert.equal(question.options.length, 5);
    assert.equal(question.options[2].kind, "EITHER_I_OR_II");
    assert.equal(question.options[2].isCorrect, false);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.ok(question.options[question.answerIndex].isCorrect);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);

    const key = question.answerSet.join(",") || "NEITHER";
    assert.ok(["0", "1", "0,1", "NEITHER"].includes(key), `${locale}/${seed}: unexpected two-assumption answer set ${key}`);
    localeAnswerKinds.add(key);
    answerKinds.add(key);
    positions[question.answerIndex] += 1;
    sourceProfiles.add(question.sourceProfile);
    qls.add(question.qlId);
    difficulties.add(question.difficulty);
    eitherOptionChecks += 1;
    generatedQuestions += 1;
  }

  // The real legacy coding must not be merely cosmetic: the generated banking corpus
  // should exercise at least three of the four resolvable answer categories per locale.
  assert.ok(localeAnswerKinds.size >= 3, `${locale}: legacy 2x5 corpus exercises too few answer categories (${[...localeAnswerKinds].join(" | ")})`);
  // Position 3 is the unresolved EITHER code and intentionally cannot be correct until
  // an explicit exclusive-alternative semantic authority exists.
  assert.equal(positions[2], 0, `${locale}: EITHER code became correct without exclusive-alternative authority`);
  assert.ok(positions[0]! > 0 || positions[1]! > 0, `${locale}: neither single-assumption answer code was exercised`);
  assert.ok(positions[3]! > 0 || positions[4]! > 0, `${locale}: neither/both legacy codes were never exercised`);
  answerCounts[locale] = positions;
}

assert.deepEqual([...sourceProfiles], ["BANKING"]);
assert.deepEqual([...difficulties].sort(), ["Easy", "Hard", "Medium"], "Legacy banking format missed a difficulty band");
assert.ok(qls.size >= 3, `Legacy banking profile has thin QL coverage: ${[...qls].join(", ")}`);
assert.ok(answerKinds.size >= 3, "Legacy banking format lacks answer-category breadth");
assert.equal(eitherOptionChecks, generatedQuestions);

console.log("PASS_STA_001_LEGACY_BANK_2X5_PRESENTATION_V1");
console.log(JSON.stringify({
  casesPerLocale: CASES_PER_LOCALE,
  generatedQuestions,
  deterministicReplayChecks,
  eitherOptionChecks,
  reachedAnswerKinds: [...answerKinds].sort(),
  reachedQls: [...qls].sort(),
  reachedDifficulties: [...difficulties].sort(),
  answerCounts,
  eitherCorrectSupported: false,
  eitherCorrectStatus: "DEFERRED_UNTIL_EXCLUSIVE_ALTERNATIVE_SEMANTIC_AUTHORITY_EXISTS",
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
}, null, 2));