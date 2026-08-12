import { TSD_CP004_AUTHORITIES, TSD_CP004_DISCOVERY_DISPOSITION, TSD_CP004_PROPOSED_QL_RANGE } from "./authority";
import { cp004ExpectedNativeNoun, cp004SentenceCount, generateCp004MultilingualReviewCorpus, renderCp004NativeQuestion, type TsdCp004NativeQuestion } from "./native";
import { generateCp004EnglishCorpus, generateCp004EnglishReviewCorpus, validateCp004EnglishCorpus } from "./runtime";
import type { TsdCp004Question } from "./types";
import { verifyCp004 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizedStem(stem: string): string {
  return stem.toLowerCase().replace(/\d+(?:\.\d+)?(?:\s+\d+\/\d+)?/gu, "#").replace(/\s+/gu, " ").trim();
}

const corpus = generateCp004EnglishCorpus(50);
const corpusSummary = validateCp004EnglishCorpus(corpus);
assert(corpus.length === 800, `Expected 800 CP004 stress questions, got ${corpus.length}`);
assert(corpusSummary.authorities === 16, `Expected all 16 authorities, got ${corpusSummary.authorities}`);
assert(TSD_CP004_DISCOVERY_DISPOSITION.length === 33, "All 33 blueprint discovery candidates must have an explicit disposition");
assert(TSD_CP004_AUTHORITIES.length === 16, "CP004 consolidation must retain exactly 16 proposed learner authorities");
assert(TSD_CP004_PROPOSED_QL_RANGE.first === "TSD-QL-048" && TSD_CP004_PROPOSED_QL_RANGE.last === "TSD-QL-063", "Candidate QL coordinate range drifted");
assert(TSD_CP004_PROPOSED_QL_RANGE.permanent === false && TSD_CP004_PROPOSED_QL_RANGE.approvalRequired === true, "QLs must remain provisional until explicit count approval");

const byAuthority = new Map<string, TsdCp004Question[]>();
for (const question of corpus) {
  const bucket = byAuthority.get(question.authorityId) ?? [];
  bucket.push(question);
  byAuthority.set(question.authorityId, bucket);
  const verification = verifyCp004(question.state, question.solution);
  assert(verification.valid, `Independent verifier failed ${question.authorityId}/${question.seed}: ${verification.errors.join("; ")}`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `Option uniqueness failed ${question.authorityId}/${question.seed}`);
  assert(question.options[question.correctIndex] === question.solution.answerText, `Correct option parity failed ${question.authorityId}/${question.seed}`);
  assert(question.optionAudit.filter((x) => x.isCorrect).length === 1, `Exactly one correct option audit required ${question.authorityId}/${question.seed}`);
  assert(question.permanentQlId === null, "Permanent QL allocation occurred before product-owner count approval");
  assert(question.questionStudioDiscoverable === false, "Question Studio must remain disabled");
  assert(question.questionBankStatus === "NOT_STORED", "Question Bank must remain NOT_STORED");
  assert(question.testEligibility === "INELIGIBLE", "Test eligibility must remain INELIGIBLE");
  assert(question.publiclyPublishable === false, "Public publication must remain disabled");
  assert(!/train|platform|bridge|tunnel|lap|track|turnaround|returns? after meeting/i.test(question.stem), `Cross-CP ownership leakage in stem: ${question.stem}`);
  if (question.visual) {
    assert(question.visual.svg.startsWith("<svg") && question.visual.svg.endsWith("</svg>"), "Visual must be valid SVG wrapper");
    assert(!/answer|correctIndex|solution/i.test(question.visual.svg), "Visual leaks hidden answer metadata");
  }
}

for (const authority of TSD_CP004_AUTHORITIES) {
  const rows = byAuthority.get(authority.authorityId) ?? [];
  assert(rows.length === 50, `${authority.authorityId} must have 50 stress rows`);
  const math = new Set(rows.map((q) => q.solution.mathematicalFingerprint));
  assert(math.size >= 20, `${authority.authorityId} has weak mathematical-state diversity: ${math.size}`);
  const contexts = new Set(rows.map((q) => q.state.actorKind));
  assert(contexts.size >= 4, `${authority.authorityId} has weak context diversity: ${contexts.size}`);
  const reps = new Set(rows.map((q) => q.state.representation));
  assert(reps.size === 3, `${authority.authorityId} must exercise prose, number-line and timeline representations`);
}

const total = corpus.length;
for (const [index, count] of corpusSummary.answerPositions.entries()) {
  const share = count / total;
  assert(share >= 0.18 && share <= 0.32, `Answer position ${index} is imbalanced: ${count}/${total}`);
}

const reviewEnglish = generateCp004EnglishReviewCorpus();
assert(reviewEnglish.length === 48, `Expected 48 English review rows, got ${reviewEnglish.length}`);
const reviewNormalized = new Set(reviewEnglish.map((q) => normalizedStem(q.stem)));
assert(reviewNormalized.size >= 42, `English review stem structure diversity is too low: ${reviewNormalized.size}/48`);
for (const authority of TSD_CP004_AUTHORITIES) {
  const rows = reviewEnglish.filter((q) => q.authorityId === authority.authorityId);
  assert(rows.length === 3, `${authority.authorityId} must have exactly three review rows`);
  assert(new Set(rows.map((q) => q.state.variant)).size === 3, `${authority.authorityId} review rows must cover all three stem variants`);
}

let nativeRows = 0;
let nounParityChecks = 0;
let sentenceParityChecks = 0;
let conditionalParityChecks = 0;
let whileParityChecks = 0;
let stateParityChecks = 0;
let optionParityChecks = 0;
let explanationContractChecks = 0;

for (const english of reviewEnglish) {
  for (const language of ["hi", "pa"] as const) {
    const native = renderCp004NativeQuestion(english, language);
    nativeRows += 1;
    const expectedNoun = cp004ExpectedNativeNoun(english.state, language);
    assert(native.stem.includes(expectedNoun), `${language} noun/object parity failed for ${english.authorityId}: expected ${expectedNoun}`);
    nounParityChecks += 1;
    assert(native.state === english.state, `${language} must reuse the exact canonical state object`);
    assert(native.solution === english.solution, `${language} must reuse the exact mathematical solution certificate`);
    stateParityChecks += 1;
    assert(native.correctIndex === english.correctIndex, `${language} correct-index parity failed`);
    assert(native.options.length === 4 && new Set(native.options).size === 4, `${language} option uniqueness failed`);
    assert(native.options[native.correctIndex] === native.localizedAnswerText, `${language} localized correct-answer parity failed`);
    optionParityChecks += 1;
    assert(native.explanation.steps.length >= 3, `${language} explanation is too compressed`);
    assert(!("optionAnalysis" in (native.explanation as unknown as Record<string, unknown>)), `${language} learner explanation must not expose option analysis`);
    explanationContractChecks += 1;
    const enSentences = cp004SentenceCount(english.stem);
    const nativeSentences = cp004SentenceCount(native.stem);
    if (enSentences > 1) {
      assert(nativeSentences >= enSentences, `${language} compressed a multi-sentence English stem: ${english.stem} -> ${native.stem}`);
      sentenceParityChecks += 1;
    }
    if (/\bIf\b/i.test(english.stem)) {
      assert(language === "hi" ? /यदि/u.test(native.stem) : /ਜੇ/u.test(native.stem), `${language} lost an English if-clause`);
      conditionalParityChecks += 1;
    }
    if (/\bwhile\b/i.test(english.stem)) {
      assert(language === "hi" ? /चलते हुए|जबकि/u.test(native.stem) : /ਚੱਲਦਿਆਂ|ਜਦਕਿ/u.test(native.stem), `${language} lost an English while relationship`);
      whileParityChecks += 1;
    }
    assert(language === "hi" ? !/[A-Za-z]{4,}\s+(?:minutes|runner|cyclist|speed)/i.test(native.stem) : !/[A-Za-z]{4,}\s+(?:minutes|runner|cyclist|speed)/i.test(native.stem), `${language} contains an English prose fallback`);
  }
}

const multilingualReview = generateCp004MultilingualReviewCorpus();
assert(multilingualReview.length === 144, `Expected 144 total review rows, got ${multilingualReview.length}`);
assert(multilingualReview.filter((q) => q.language === "en").length === 48, "English review count drifted");
assert(multilingualReview.filter((q) => q.language === "hi").length === 48, "Hindi review count drifted");
assert(multilingualReview.filter((q) => q.language === "pa").length === 48, "Punjabi review count drifted");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP004_STRAIGHT_LINE_RELATIVE_MOTION_REVIEW_CANDIDATE",
  blueprintDiscoveryCandidates: 33,
  proposedLearnerAuthorities: TSD_CP004_AUTHORITIES.length,
  proposedQlRange: `${TSD_CP004_PROPOSED_QL_RANGE.first}..${TSD_CP004_PROPOSED_QL_RANGE.last}`,
  permanentQlCount: 0,
  stressEnglishQuestions: corpus.length,
  independentVerifierChecks: corpus.length,
  uniqueMathematicalFingerprints: corpusSummary.uniqueMathFingerprints,
  normalizedStemStructures: corpusSummary.uniqueStems,
  answerPositions: corpusSummary.answerPositions,
  difficulty: corpusSummary.difficulties,
  englishReviewRows: reviewEnglish.length,
  hindiReviewRows: 48,
  punjabiReviewRows: 48,
  totalReviewRows: multilingualReview.length,
  nounParityChecks,
  sentenceParityChecks,
  conditionalParityChecks,
  whileParityChecks,
  stateParityChecks,
  optionParityChecks,
  explanationContractChecks,
  optionAnalysisLearnerFields: 0,
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  reviewStatus: "READY_FOR_PRODUCT_OWNER_CP004_COUNT_AND_CONTENT_REVIEW",
}, null, 2));
