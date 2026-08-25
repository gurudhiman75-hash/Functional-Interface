import { strict as assert } from "node:assert";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import { validateSriDiscoveryQuestion } from "../discovery-runtime";
import {
  SRI_ENGLISH_REVIEW_HOLD_GROUPS_R1,
  SRI_ENGLISH_REVIEW_MEMBERS_R1,
  SRI_ENGLISH_REVIEW_READY_GROUPS_R1,
  buildSriEnglishReviewCorpusR1,
  generateSriEnglishReviewQuestionR1,
} from "../english-review-r1";

const AUDIT_SEEDS_PER_MEMBER = 12;
const EXPORT_SEEDS_PER_MEMBER = 3;
const EXPECTED_READY_GROUPS = 58;
const EXPECTED_REVIEW_MEMBERS = 92;
const EXPECTED_EXPORT_ROWS = EXPECTED_REVIEW_MEMBERS * EXPORT_SEEDS_PER_MEMBER;

const FIXED_SEMANTIC_MEMBERS = new Set(["C001-E", "C002-I", "C002-K", "C012-C"]);
const GENERIC_GIVEN_FALLBACKS = new Set([
  "The question gives an expression built from integer powers.",
  "The question gives a power whose zero, negative, or fractional exponent must be interpreted over the real numbers.",
  "The given powers use related bases that can be rewritten using one common base.",
  "One or more exact power values are provided for a related transformation or parameter.",
  "An exponential equation or exact power relation is given.",
  "Power expressions or index-law statements are given for exact comparison.",
  "A radical expression is given for simplification or classification.",
  "A surd expression is given for exact arithmetic or classification.",
  "The given expression contains a radical denominator that can be rationalised.",
  "A nested or repeating radical relation is given.",
  "Surd expressions, bounds, or a radical equation are given for exact analysis.",
  "The given expression combines radical and fractional-index notation.",
]);
const BANNED_LEARNER_METADATA = [
  /SRI-RG-/i,
  /C\d{3}-[A-Z]/,
  /PROVISIONAL_DISCOVERY/i,
  /canonicalSolverKey/i,
  /independentVerifierKey/i,
  /solverVerifierAgree/i,
  /proofEvents/i,
  /SRI-EN-R1:/i,
  /\b[A-Z][A-Z0-9_]{2,}:/,
  /\b(?:rational mode|first true|second true|solution mode)\b/i,
];
const BANNED_EDITORIAL_TEXT = [
  /\bcanonical result\b/i,
  /\bcanonical values?\b/i,
  /\bcanonical surd form\b/i,
  /\bcanonical form\b/i,
  /\breverse-constructed\b/i,
  /\bprime base\b/i,
  /\bdenominator-th root\b/i,
  /\bsupported denested form\b/i,
  /\bperfect 2nd power\b/i,
  /\b(?:1th|2th|3th)\b/,
  /\b1\\sqrt/,
];
const BANNED_GIVEN_PROSE = [
  /^The supplied relation is (?:If|Given|Using|For|From|Let|After)\b/i,
  /^The supplied condition is (?:If|Given|Using|For|From|Let|After|rationalising)\b/i,
  /^The supplied information is (?:The|Write|For|After|Consider|Quantity)\b/i,
  /\band find A[+-]B\b/i,
  /\bby using a common base\b/i,
  /\bbetween (?:two )?consecutive integers without decimals\b/i,
  /\binto simplest(?: surd)? form\b/i,
];

assert.equal(SRI_ENGLISH_REVIEW_READY_GROUPS_R1.length, EXPECTED_READY_GROUPS, "English R1 must expose exactly 58 source-supported retained groups");
assert.equal(SRI_ENGLISH_REVIEW_HOLD_GROUPS_R1.length, 1, "English R1 must keep exactly one unresolved hold outside the review-ready set");
assert.equal(SRI_ENGLISH_REVIEW_HOLD_GROUPS_R1[0]?.retainedGroupId, "SRI-RG-039");
assert.deepEqual(SRI_ENGLISH_REVIEW_HOLD_GROUPS_R1[0]?.memberCandidateIds, ["C008-I"]);
assert.equal(SRI_ENGLISH_REVIEW_MEMBERS_R1.length, EXPECTED_REVIEW_MEMBERS, "English R1 must review all 92 source-supported prototype members");
assert.equal(new Set(SRI_ENGLISH_REVIEW_MEMBERS_R1.map((member) => member.memberCandidateId)).size, EXPECTED_REVIEW_MEMBERS);
assert.equal(SRI_ENGLISH_REVIEW_MEMBERS_R1.some((member) => member.memberCandidateId === "C008-I"), false, "held C008-I must not enter freeze-ready review");
assert.equal(SRI_ENGLISH_REVIEW_MEMBERS_R1.some((member) => member.memberCandidateId === "C010-F"), true, "source-resolved C010-F must enter English review");
assert.equal(new Set(SRI_ENGLISH_REVIEW_READY_GROUPS_R1.map((group) => group.ownerCheckpointId)).size, 12, "all 12 owner checkpoints must remain represented");
assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, 58);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, 0);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen, false);
assertSriReleaseLocks();

const memberStemSets = new Map<string, Set<string>>();
const memberAnswerSets = new Map<string, Set<string>>();
const memberPositionSets = new Map<string, Set<number>>();
const exactStemOwners = new Map<string, string>();
const genericGivenFallbackFailures: string[] = [];
let generated = 0;

for (const member of SRI_ENGLISH_REVIEW_MEMBERS_R1) {
  const stems = new Set<string>();
  const answers = new Set<string>();
  const positions = new Set<number>();

  for (let seedIndex = 0; seedIndex < AUDIT_SEEDS_PER_MEMBER; seedIndex += 1) {
    const question = generateSriEnglishReviewQuestionR1(member, seedIndex);
    const repeat = generateSriEnglishReviewQuestionR1(member, seedIndex);
    generated += 1;

    assert.deepEqual(repeat, question, `${member.memberCandidateId} English review generation is not deterministic`);
    assert.equal(question.candidateId, member.memberCandidateId);
    assert.equal(question.seed, `SRI-EN-R1:${member.retainedGroupId}:${member.memberCandidateId}:${seedIndex}`);
    assert.deepEqual(validateSriDiscoveryQuestion(question), [], `${member.memberCandidateId} failed discovery validation during English review`);
    assert.equal(question.verification.solverVerifierAgree, true);
    assert.equal(question.verification.exactlyOneCorrectOption, true);
    assert.equal(question.verification.domainValid, true);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map((option) => option.canonicalKey)).size, 4);
    assert.equal(question.options.filter((option) => option.canonicalKey === question.answer.canonicalKey).length, 1);
    assert.equal(question.options[question.correctIndex]?.canonicalKey, question.answer.canonicalKey);
    assert.equal(question.options.filter((option) => option.misconceptionId !== null).length, 3);
    if (GENERIC_GIVEN_FALLBACKS.has(question.explanation.given)) {
      genericGivenFallbackFailures.push(`${member.memberCandidateId} seed=${seedIndex}: ${question.stem}`);
    }
    for (const pattern of BANNED_GIVEN_PROSE) {
      assert.equal(pattern.test(question.explanation.given), false, `${member.memberCandidateId} has mechanical Given prose: ${question.explanation.given}`);
    }

    const learnerText = [
      question.stem,
      ...question.options.map((option) => option.text),
      question.explanation.given,
      question.explanation.asked,
      question.explanation.method,
      ...question.explanation.working,
      question.explanation.answer,
    ].join("\n");
    for (const pattern of BANNED_LEARNER_METADATA) {
      assert.equal(pattern.test(learnerText), false, `${member.memberCandidateId} leaks internal review/runtime metadata: ${pattern}`);
    }
    for (const pattern of BANNED_EDITORIAL_TEXT) {
      assert.equal(pattern.test(learnerText), false, `${member.memberCandidateId} contains discovery/editorial residue: ${pattern}`);
    }
    // "Undefined" is a legitimate learner-facing mathematical answer for zero-base domain cases.
    assert.equal(learnerText.includes("NaN"), false, `${member.memberCandidateId} contains NaN learner text`);
    assert.equal(learnerText.includes("\\frac}"), false, `${member.memberCandidateId} contains malformed fraction TeX`);
    assert.ok(question.stem.trim().length > 8);
    assert.ok(question.explanation.given.trim().length > 0);
    assert.ok(question.explanation.asked.trim().length > 0);
    assert.ok(question.explanation.method.trim().length > 0);
    assert.ok(question.explanation.working.length > 0);
    assert.equal(question.explanation.answer, question.answer.text);
    assert.notEqual(normalize(question.explanation.given), normalize(question.stem), `${member.memberCandidateId} repeats the full stem as the given section`);

    if (["C002-F", "C002-G", "C012-B"].includes(member.memberCandidateId)) {
      const numerator = Number(question.state.numerator);
      const denominator = Number(question.state.denominator);
      assert.ok(Number.isInteger(numerator) && Number.isInteger(denominator) && denominator > 1);
      assert.equal(gcd(numerator, denominator), 1, `${member.memberCandidateId} must expose a reduced fractional exponent`);
      assert.ok(Math.abs(numerator) < denominator, `${member.memberCandidateId} must remain a genuinely fractional-index task`);
    }

    const normalizedStem = normalize(question.stem);
    const previousOwner = exactStemOwners.get(normalizedStem);
    if (previousOwner && previousOwner !== member.memberCandidateId) {
      throw new Error(`English R1 exact cross-member stem collision: ${previousOwner} vs ${member.memberCandidateId}: ${question.stem}`);
    }
    exactStemOwners.set(normalizedStem, member.memberCandidateId);

    stems.add(normalizedStem);
    answers.add(question.answer.canonicalKey);
    positions.add(question.correctIndex);
  }

  memberStemSets.set(member.memberCandidateId, stems);
  memberAnswerSets.set(member.memberCandidateId, answers);
  memberPositionSets.set(member.memberCandidateId, positions);
  assert.ok(stems.size >= 3, `${member.memberCandidateId} has thin English stem diversity: ${stems.size}`);
  assert.ok(positions.size >= 3, `${member.memberCandidateId} has concentrated correct-option positions: ${[...positions].join(",")}`);
  if (FIXED_SEMANTIC_MEMBERS.has(member.memberCandidateId)) {
    assert.equal(answers.size, 1, `${member.memberCandidateId} is expected to preserve one answer semantic`);
  } else {
    assert.ok(answers.size >= 2, `${member.memberCandidateId} has thin answer diversity: ${answers.size}`);
  }
}

assert.deepEqual(genericGivenFallbackFailures, [], `English R1 still has generic Given fallbacks:\n${genericGivenFallbackFailures.join("\n")}`);

const exportCorpus = buildSriEnglishReviewCorpusR1(EXPORT_SEEDS_PER_MEMBER);
assert.equal(exportCorpus.length, EXPECTED_EXPORT_ROWS);
const exportCounts = new Map<string, number>();
for (const row of exportCorpus) {
  exportCounts.set(row.memberCandidateId, (exportCounts.get(row.memberCandidateId) ?? 0) + 1);
  assert.equal(row.question.candidateId, row.memberCandidateId);
  assert.equal(row.retainedGroupId === "SRI-RG-039", false);
}
assert.equal(exportCounts.size, EXPECTED_REVIEW_MEMBERS);
for (const member of SRI_ENGLISH_REVIEW_MEMBERS_R1) {
  assert.equal(exportCounts.get(member.memberCandidateId), EXPORT_SEEDS_PER_MEMBER, `${member.memberCandidateId} export row count mismatch`);
}

console.log(JSON.stringify({
  status: "PASS",
  readyGroups: EXPECTED_READY_GROUPS,
  heldGroups: SRI_ENGLISH_REVIEW_HOLD_GROUPS_R1.map((group) => group.retainedGroupId),
  reviewMembers: EXPECTED_REVIEW_MEMBERS,
  auditSeedsPerMember: AUDIT_SEEDS_PER_MEMBER,
  auditQuestionsGenerated: generated,
  exportSeedsPerMember: EXPORT_SEEDS_PER_MEMBER,
  exportRows: exportCorpus.length,
  genericGivenFallbacks: genericGivenFallbackFailures.length,
  minUniqueStems: Math.min(...[...memberStemSets.values()].map((set) => set.size)),
  minCorrectPositions: Math.min(...[...memberPositionSets.values()].map((set) => set.size)),
  permanentQlCount: SRI_CHAPTER_MANIFEST.permanentQlCount,
  frozenSolveModeCount: SRI_CHAPTER_MANIFEST.frozenSolveModeCount,
}, null, 2));

function normalize(value: string): string {
  return value.trim().replace(/[?.!]+$/g, "").replace(/\s+/g, " ").toLowerCase();
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}
