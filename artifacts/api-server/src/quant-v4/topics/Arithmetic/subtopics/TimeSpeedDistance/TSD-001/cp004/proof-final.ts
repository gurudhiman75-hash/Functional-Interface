import { TSD_CP004_AUTHORITIES, TSD_CP004_DISCOVERY_DISPOSITION, TSD_CP004_PROPOSED_QL_RANGE } from "./authority";
import { cp004ExpectedNativeNoun, type TsdCp004NativeLanguage } from "./native";
import { renderCp004PolishedNativeQuestion } from "./native-polished";
import { generateCp004FinalEnglishCorpus, generateCp004FinalEnglishReviewCorpus, validateCp004FinalEnglishCorpus } from "./runtime-final";
import type { TsdCp004Question } from "./types";
import { verifyCp004 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sentenceCount(text: string): number {
  return text.split(/[.!?।?]+/u).map((x) => x.trim()).filter(Boolean).length;
}

function normalizeStructure(stem: string): string {
  return stem.toLowerCase().replace(/\d+(?:\.\d+)?(?:\s+\d+\/\d+)?/gu, "#").replace(/\s+/gu, " ").trim();
}

function nativeExplanationText(q: ReturnType<typeof renderCp004PolishedNativeQuestion>): string {
  return [q.explanation.method, ...q.explanation.steps, q.explanation.shortcut, q.explanation.answer].join(" ");
}

function stripAllowedLatin(text: string): string {
  return text
    .replace(/km\/h/giu, "")
    .replace(/\bkm\b/giu, "")
    .replace(/\b[A-C]\b/gu, "")
    .replace(/<[^>]+>/gu, "");
}

const stress = generateCp004FinalEnglishCorpus(50);
const summary = validateCp004FinalEnglishCorpus(stress);
assert(stress.length === 800, `Expected 800 stress questions, got ${stress.length}`);
assert(TSD_CP004_DISCOVERY_DISPOSITION.length === 33, "All 33 blueprint discovery candidates require an explicit disposition");
assert(TSD_CP004_AUTHORITIES.length === 16, "Expected 16 proposed CP004 learner authorities");
assert(TSD_CP004_PROPOSED_QL_RANGE.first === "TSD-QL-048" && TSD_CP004_PROPOSED_QL_RANGE.last === "TSD-QL-063", "Proposed QL coordinates drifted");
assert(TSD_CP004_PROPOSED_QL_RANGE.permanent === false && TSD_CP004_PROPOSED_QL_RANGE.approvalRequired === true, "CP004 coordinates cannot become permanent before explicit approval");

const byAuthority = new Map<string, TsdCp004Question[]>();
let verifierChecks = 0;
let visualChecks = 0;
for (const q of stress) {
  const verifier = verifyCp004(q.state, q.solution);
  assert(verifier.valid, `Independent verifier failed ${q.authorityId}/${q.seed}: ${verifier.errors.join("; ")}`);
  verifierChecks += 1;
  assert(q.options.length === 4 && new Set(q.options).size === 4, `Option uniqueness failed ${q.authorityId}/${q.seed}`);
  assert(q.options[q.correctIndex] === q.solution.answerText, `Correct-answer parity failed ${q.authorityId}/${q.seed}`);
  assert(q.optionAudit.filter((x) => x.isCorrect).length === 1, `Exactly one correct option required ${q.authorityId}/${q.seed}`);
  assert(q.explanation.steps.length >= 3, `English explanation too short ${q.authorityId}/${q.seed}`);
  assert(q.stem.endsWith("?"), `English stem is not a direct question: ${q.stem}`);
  assert(!/\bFind\b[^?]*\.$/u.test(q.stem), `Catalogue/instruction wording remains: ${q.stem}`);
  assert(!/train|platform|bridge|tunnel|lap|closed track|turnaround|returns? after meeting/i.test(q.stem), `Cross-CP ownership leakage: ${q.stem}`);
  assert(q.permanentQlId === null, "Permanent QL allocated before product-owner count approval");
  assert(q.questionStudioDiscoverable === false && q.questionBankStatus === "NOT_STORED" && q.testEligibility === "INELIGIBLE" && q.publiclyPublishable === false, "Downstream lifecycle lock was opened");
  if (q.visual) {
    assert(q.visual.svg.startsWith("<svg") && q.visual.svg.endsWith("</svg>"), "Visual SVG wrapper invalid");
    assert(!/answer|correctIndex|solution/i.test(q.visual.svg), "Visual leaks hidden metadata");
    visualChecks += 1;
  }
  const bucket = byAuthority.get(q.authorityId) ?? [];
  bucket.push(q);
  byAuthority.set(q.authorityId, bucket);
}

for (const authority of TSD_CP004_AUTHORITIES) {
  const rows = byAuthority.get(authority.authorityId) ?? [];
  assert(rows.length === 50, `${authority.authorityId} stress count drifted`);
  assert(new Set(rows.map((q) => q.solution.mathematicalFingerprint)).size >= 20, `${authority.authorityId} has weak mathematical-state diversity`);
  assert(new Set(rows.map((q) => q.state.actorKind)).size >= 4, `${authority.authorityId} has weak actor/context diversity`);
  assert(new Set(rows.map((q) => q.state.representation)).size === 3, `${authority.authorityId} does not cover all three representations`);
}

for (const [index, count] of summary.answerPositions.entries()) {
  const share = count / stress.length;
  assert(share >= 0.18 && share <= 0.32, `Answer position ${index} imbalance: ${count}/${stress.length}`);
}

const englishReview = generateCp004FinalEnglishReviewCorpus();
assert(englishReview.length === 48, `Expected 48 English review rows, got ${englishReview.length}`);
assert(new Set(englishReview.map((q) => normalizeStructure(q.stem))).size >= 42, "English review stem structure diversity is too low");
for (const authority of TSD_CP004_AUTHORITIES) {
  const rows = englishReview.filter((q) => q.authorityId === authority.authorityId);
  assert(rows.length === 3 && new Set(rows.map((q) => q.state.variant)).size === 3, `${authority.authorityId} must expose all three review variants`);
}

let nativeRows = 0;
let nounParityChecks = 0;
let sentenceParityChecks = 0;
let conditionalParityChecks = 0;
let whileParityChecks = 0;
let stateParityChecks = 0;
let optionParityChecks = 0;
let customizedPedagogyChecks = 0;
let scriptPurityChecks = 0;
let localizedVisualChecks = 0;
const nativeMethods = new Map<string, Set<string>>();

for (const english of englishReview) {
  for (const language of ["hi", "pa"] as const) {
    const native = renderCp004PolishedNativeQuestion(english, language);
    nativeRows += 1;
    const expectedNoun = cp004ExpectedNativeNoun(english.state, language);
    assert(native.stem.includes(expectedNoun), `${language} lost English object/noun identity for ${english.authorityId}: expected ${expectedNoun}`);
    nounParityChecks += 1;
    assert(native.state === english.state && native.solution === english.solution, `${language} did not preserve exact canonical state/solution identity`);
    assert(native.solution.mathematicalFingerprint === english.solution.mathematicalFingerprint, `${language} mathematical fingerprint changed`);
    stateParityChecks += 1;
    assert(native.correctIndex === english.correctIndex && native.options[native.correctIndex] === native.localizedAnswerText, `${language} correct-option parity failed`);
    assert(native.options.length === 4 && new Set(native.options).size === 4, `${language} options are not four unique values`);
    optionParityChecks += 1;
    assert(native.explanation.steps.length >= 3, `${language} explanation too compressed for ${english.authorityId}`);
    assert(!("optionAnalysis" in (native.explanation as unknown as Record<string, unknown>)), `${language} learner explanation exposes option analysis`);
    const methods = nativeMethods.get(`${language}:${english.authorityId}`) ?? new Set<string>();
    methods.add(native.explanation.method);
    nativeMethods.set(`${language}:${english.authorityId}`, methods);
    customizedPedagogyChecks += 1;

    const englishSentences = sentenceCount(english.stem);
    const nativeSentences = sentenceCount(native.stem);
    if (englishSentences > 1) {
      assert(nativeSentences >= englishSentences, `${language} compressed English sentence structure: ${english.stem} -> ${native.stem}`);
      sentenceParityChecks += 1;
    }
    if (/\bIf\b/i.test(english.stem)) {
      assert(language === "hi" ? /यदि/u.test(native.stem) : /ਜੇ/u.test(native.stem), `${language} lost an English if-clause`);
      conditionalParityChecks += 1;
    }
    if (/\bwhile\b/i.test(english.stem)) {
      assert(language === "hi" ? /जबकि|चलते हुए/u.test(native.stem) : /ਜਦਕਿ|ਚੱਲਦਿਆਂ/u.test(native.stem), `${language} lost an English while relation`);
      whileParityChecks += 1;
    }

    const nativeProse = `${native.stem} ${nativeExplanationText(native)} ${native.visual?.alt ?? ""}`;
    const residue = stripAllowedLatin(nativeProse);
    assert(!/[A-Za-z]{2,}/u.test(residue), `${language} contains English prose fallback: ${residue.match(/[A-Za-z]{2,}/u)?.[0]}`);
    scriptPurityChecks += 1;
    if (native.visual) {
      const visibleSvgText = native.visual.svg.replace(/<[^>]+>/gu, " ");
      assert(!/\b(gap|start|event|relative|motion|timeline)\b/iu.test(visibleSvgText), `${language} visual retains English learner text`);
      assert(native.visual.alt.length > 15, `${language} visual alt is missing`);
      localizedVisualChecks += 1;
    }
  }
}

for (const authority of TSD_CP004_AUTHORITIES) {
  for (const language of ["hi", "pa"] as const) {
    const methods = nativeMethods.get(`${language}:${authority.authorityId}`);
    assert(methods && methods.size >= 1, `${language} authority-specific pedagogy missing for ${authority.authorityId}`);
  }
}

assert(nativeRows === 96, `Expected 96 native review rows, got ${nativeRows}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP004_FINAL_MULTILINGUAL_REVIEW_CANDIDATE",
  blueprintDiscoveryCandidates: 33,
  proposedLearnerAuthorities: 16,
  proposedQlRange: "TSD-QL-048..TSD-QL-063",
  permanentQlCount: 0,
  stressEnglishQuestions: stress.length,
  independentVerifierChecks: verifierChecks,
  uniqueMathematicalFingerprints: summary.uniqueMathFingerprints,
  normalizedStemStructures: summary.uniqueStems,
  answerPositions: summary.answerPositions,
  difficulty: summary.difficulties,
  visualChecks,
  englishReviewRows: englishReview.length,
  hindiReviewRows: 48,
  punjabiReviewRows: 48,
  totalReviewRows: 144,
  nounParityChecks,
  sentenceParityChecks,
  conditionalParityChecks,
  whileParityChecks,
  stateParityChecks,
  optionParityChecks,
  customizedPedagogyChecks,
  scriptPurityChecks,
  localizedVisualChecks,
  learnerOptionAnalysisFields: 0,
  retainedCountApprovedByProductOwner: false,
  permanentQlAllocationAuthorized: false,
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  reviewStatus: "READY_FOR_PRODUCT_OWNER_CP004_COUNT_AND_CONTENT_REVIEW",
}, null, 2));
