import { strict as assert } from "node:assert";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { validateSriDiscoveryQuestion } from "../discovery-runtime";
import { SRI_PERMANENT_ALLOCATION_V1 } from "../permanent-allocation-v1";
import {
  SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1,
  buildSriPermanentEnglishReviewCorpusV1,
  generateSriPermanentEnglishReviewQuestionV1,
} from "../permanent-english-review-v1";

const AUDIT_SEEDS_PER_MEMBER = 12;
const EXPORT_SEEDS_PER_MEMBER = 2;
const EXPECTED_QLS = 58;
const EXPECTED_MEMBERS = 92;

const BANNED_LEARNER_TEXT = [
  /SRI-00[12]-QL-/i,
  /SRI-00[12]-SM-/i,
  /SRI-RG-/i,
  /C\d{3}-[A-Z]/,
  /PROVISIONAL_DISCOVERY/i,
  /canonicalSolverKey/i,
  /independentVerifierKey/i,
  /solverVerifierAgree/i,
  /proofEvents/i,
  /\bcanonical (?:result|value|form)\b/i,
  /\breverse-constructed\b/i,
  /\bprime base\b/i,
  /\bsupported denested form\b/i,
  /\b(?:1th|2th|3th)\b/,
  /\b1\\sqrt/,
];

assert.equal(SRI_PERMANENT_ALLOCATION_V1.length, EXPECTED_QLS);
assert.equal(SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.length, EXPECTED_MEMBERS);
assert.equal(new Set(SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.map((member) => member.memberCandidateId)).size, EXPECTED_MEMBERS);
assert.equal(new Set(SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.map((member) => member.qlId)).size, EXPECTED_QLS);
assert.equal(SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.some((member) => member.memberCandidateId === "C008-I"), false);
assert.equal(SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.some((member) => member.memberCandidateId === "C010-F"), true);

const stemsByMember = new Map<string, Set<string>>();
const statesByQl = new Map<string, Set<string>>();
const stemsByQl = new Map<string, Set<string>>();
const positionsByQl = new Map<string, Set<number>>();
const exactStemOwners = new Map<string, string>();
const globalPositions = [0, 0, 0, 0];
let generated = 0;

for (const member of SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1) {
  const memberStems = new Set<string>();
  const qlStates = statesByQl.get(member.qlId) ?? new Set<string>();
  const qlStems = stemsByQl.get(member.qlId) ?? new Set<string>();
  const qlPositions = positionsByQl.get(member.qlId) ?? new Set<number>();

  for (let seedIndex = 0; seedIndex < AUDIT_SEEDS_PER_MEMBER; seedIndex += 1) {
    const question = generateSriPermanentEnglishReviewQuestionV1(member, seedIndex);
    const repeat = generateSriPermanentEnglishReviewQuestionV1(member, seedIndex);
    generated += 1;

    assert.deepEqual(repeat, question, `${member.qlId}/${member.memberCandidateId}/${seedIndex}: non-deterministic`);
    assert.equal(question.candidateId, member.memberCandidateId);
    assert.equal(question.seed, `SRI-PERM-EN-V1:${member.qlId}:${member.memberCandidateId}:${seedIndex}`);
    assert.deepEqual(validateSriDiscoveryQuestion(question), [], `${member.qlId}/${member.memberCandidateId}: discovery validation failed`);
    assert.equal(question.verification.solverVerifierAgree, true);
    assert.equal(question.verification.exactlyOneCorrectOption, true);
    assert.equal(question.verification.domainValid, true);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.canonicalKey)).size, 4);
    assert.equal(question.options.filter((option) => option.canonicalKey === question.answer.canonicalKey).length, 1);
    assert.equal(question.options[question.correctIndex]?.canonicalKey, question.answer.canonicalKey);
    assert.equal(question.options.filter((option) => option.misconceptionId !== null).length, 3);

    const learnerText = [
      question.stem,
      ...question.options.map((option) => option.text),
      question.explanation.given,
      question.explanation.asked,
      question.explanation.method,
      ...question.explanation.working,
      question.explanation.answer,
    ].join("\n");
    for (const pattern of BANNED_LEARNER_TEXT) {
      assert.equal(pattern.test(learnerText), false, `${member.qlId}/${member.memberCandidateId} leaks reviewer/engine text: ${pattern}`);
    }
    assert.equal(learnerText.includes("NaN"), false);
    assert.equal(learnerText.includes("\\frac}"), false);
    assert.notEqual(normalize(question.explanation.given), normalize(question.stem));

    const normalizedStem = normalize(question.stem);
    const previousOwner = exactStemOwners.get(normalizedStem);
    if (previousOwner && previousOwner !== member.qlId) {
      throw new Error(`Permanent cross-QL exact stem collision: ${previousOwner} vs ${member.qlId}: ${question.stem}`);
    }
    exactStemOwners.set(normalizedStem, member.qlId);

    memberStems.add(normalizedStem);
    qlStates.add(JSON.stringify(question.state));
    qlStems.add(normalizedStem);
    qlPositions.add(question.correctIndex);
    globalPositions[question.correctIndex] += 1;
  }

  stemsByMember.set(member.memberCandidateId, memberStems);
  statesByQl.set(member.qlId, qlStates);
  stemsByQl.set(member.qlId, qlStems);
  positionsByQl.set(member.qlId, qlPositions);
  assert.ok(memberStems.size >= 3, `${member.qlId}/${member.memberCandidateId}: thin member stem diversity ${memberStems.size}`);
}

assert.equal(generated, EXPECTED_MEMBERS * AUDIT_SEEDS_PER_MEMBER);
assert.equal(statesByQl.size, EXPECTED_QLS);
assert.equal(stemsByQl.size, EXPECTED_QLS);
assert.equal(positionsByQl.size, EXPECTED_QLS);

for (const allocation of SRI_PERMANENT_ALLOCATION_V1) {
  const stateCount = statesByQl.get(allocation.qlId)?.size ?? 0;
  const stemCount = stemsByQl.get(allocation.qlId)?.size ?? 0;
  const positions = positionsByQl.get(allocation.qlId) ?? new Set<number>();
  assert.ok(stateCount >= 6, `${allocation.qlId}: thin state pool ${stateCount}`);
  assert.ok(stemCount >= 3, `${allocation.qlId}: thin stem pool ${stemCount}`);
  assert.equal(positions.size, 4, `${allocation.qlId}: not all four correct-option positions are exercised`);
}

const minimumGlobalPositionCount = Math.floor(generated * 0.18);
for (let position = 0; position < 4; position += 1) {
  assert.ok(globalPositions[position]! >= minimumGlobalPositionCount, `global option position ${position} is underrepresented: ${globalPositions[position]}`);
}
assert.ok(Math.max(...globalPositions) - Math.min(...globalPositions) <= 90, `global answer-key distribution is too skewed: ${globalPositions.join(",")}`);

const exportCorpus = buildSriPermanentEnglishReviewCorpusV1(EXPORT_SEEDS_PER_MEMBER);
assert.equal(exportCorpus.length, EXPECTED_MEMBERS * EXPORT_SEEDS_PER_MEMBER);
assert.equal(new Set(exportCorpus.map((row) => row.qlId)).size, EXPECTED_QLS);
assert.equal(new Set(exportCorpus.map((row) => row.memberCandidateId)).size, EXPECTED_MEMBERS);

assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, EXPECTED_QLS);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, 0);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen, false);
assertSriReleaseLocks();

console.log(JSON.stringify({
  status: "PASS_SRI_PERMANENT_ENGLISH_REVIEW_V1",
  permanentQls: EXPECTED_QLS,
  prototypeMembers: EXPECTED_MEMBERS,
  auditSeedsPerMember: AUDIT_SEEDS_PER_MEMBER,
  auditQuestionsGenerated: generated,
  exportSeedsPerMember: EXPORT_SEEDS_PER_MEMBER,
  exportQuestions: exportCorpus.length,
  minStatesPerQl: Math.min(...[...statesByQl.values()].map((items) => items.size)),
  minStemsPerQl: Math.min(...[...stemsByQl.values()].map((items) => items.size)),
  minStemsPerMember: Math.min(...[...stemsByMember.values()].map((items) => items.size)),
  globalCorrectIndexCounts: globalPositions,
  frozenSolveModeCount: SRI_CHAPTER_MANIFEST.frozenSolveModeCount,
  englishFrozen: SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen,
}, null, 2));

function normalize(value: string): string {
  return value.trim().replace(/[?.!]+$/g, "").replace(/\s+/g, " ").toLowerCase();
}
