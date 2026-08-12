import { TSD_CP004_AUTHORITIES, TSD_CP004_DISCOVERY_DISPOSITION, TSD_CP004_PROPOSED_QL_RANGE } from "./authority";
import { cp004ExpectedNativeNoun } from "./native";
import { renderCp004EditorialV4NativeQuestion } from "./native-v4";
import { generateCp004EditorialV3EnglishReviewCorpus, generateCp004EditorialV3StressCorpus } from "./runtime-v3";
import type { TsdCp004Question } from "./types";
import { verifyCp004 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const ENGLISH_ACTORS = ["delivery vans", "delivery van", "runners", "runner", "cyclists", "cyclist", "scooters", "scooter", "buses", "bus", "cars", "car"];
function structuralEnglish(stem: string): string {
  let s = stem.toLowerCase();
  for (const actor of ENGLISH_ACTORS) s = s.replace(new RegExp(actor.replace(/ /g, "\\s+") + "(?:\\s+[abc])?", "g"), "actor");
  return s.replace(/\d+(?:\.\d+)?(?:\s+\d+\/\d+)?/gu, "#").replace(/\s+/gu, " ").trim();
}

function structuralNative(stem: string, noun: string): string {
  return stem.replaceAll(noun, "ACTOR").replace(/\b[ABC]\b/gu, "X").replace(/\d+(?:\.\d+)?(?:\s+\d+\/\d+)?/gu, "#").replace(/\s+/gu, " ").trim();
}

function sentences(text: string): number {
  return text.split(/[.!?।?]+/u).map((x) => x.trim()).filter(Boolean).length;
}

function stripAllowedLatin(text: string): string {
  return text.replace(/km\/h/giu, "").replace(/\bkm\b/giu, "").replace(/\b[A-C]\b/gu, "").replace(/<[^>]+>/gu, "");
}

function numeric(text: string): number | null {
  const m = text.match(/^(-?\d+(?:\.\d+)?)(?:\s+(\d+)\/(\d+))?/u);
  if (!m) return null;
  const whole = Number(m[1]);
  return m[2] ? whole + Number(m[2]) / Number(m[3]) : whole;
}

const stress = generateCp004EditorialV3StressCorpus(50);
assert(stress.length === 800, `Expected 800 CP004 V3 stress rows, got ${stress.length}`);
assert(TSD_CP004_DISCOVERY_DISPOSITION.length === 33, "All 33 blueprint candidates must retain an explicit disposition");
assert(TSD_CP004_AUTHORITIES.length === 16, "CP004 V3 proposed authority count must be 16");
assert(TSD_CP004_PROPOSED_QL_RANGE.first === "TSD-QL-048" && TSD_CP004_PROPOSED_QL_RANGE.last === "TSD-QL-063" && !TSD_CP004_PROPOSED_QL_RANGE.permanent, "CP004 candidate QL boundary drifted");

const byAuthority = new Map<string, TsdCp004Question[]>();
const positions = [0, 0, 0, 0];
const fingerprints = new Set<string>();
let verifierChecks = 0;
let boundedDistractorChecks = 0;
let visualChecks = 0;
for (const q of stress) {
  const verifier = verifyCp004(q.state, q.solution);
  assert(verifier.valid, `Independent verifier failed ${q.authorityId}/${q.seed}: ${verifier.errors.join("; ")}`);
  verifierChecks += 1;
  assert(q.stem.endsWith("?"), `Non-question stem: ${q.stem}`);
  assert(q.options.length === 4 && new Set(q.options).size === 4, `Invalid option set ${q.authorityId}/${q.seed}`);
  assert(q.options[q.correctIndex] === q.solution.answerText, `Correct-option parity failed ${q.authorityId}/${q.seed}`);
  assert(q.optionAudit[q.correctIndex]?.isCorrect === true && q.optionAudit.filter((x) => x.isCorrect).length === 1, `Option audit parity failed ${q.authorityId}/${q.seed}`);
  assert(q.explanation.steps.length >= 3, `English explanation too short ${q.authorityId}/${q.seed}`);
  assert(q.permanentQlId === null && !q.questionStudioDiscoverable && q.questionBankStatus === "NOT_STORED" && q.testEligibility === "INELIGIBLE" && !q.publiclyPublishable, "CP004 downstream lifecycle lock opened");
  assert(!/train|platform|bridge|tunnel|lap|closed track|turnaround|returns? after meeting/i.test(q.stem), `Cross-checkpoint ownership leakage: ${q.stem}`);
  positions[q.correctIndex] += 1;
  fingerprints.add(q.solution.mathematicalFingerprint);
  const bucket = byAuthority.get(q.authorityId) ?? [];
  bucket.push(q);
  byAuthority.set(q.authorityId, bucket);

  for (const option of q.options) {
    const value = numeric(option);
    if (value !== null && q.solution.answerKind !== "ORDER" && q.solution.answerKind !== "RATIO") assert(value > 0, `Non-positive learner option ${option}`);
  }
  if (q.authorityId === "MEETING_POINT_DISTANCE_SPLIT") {
    const route = Number(q.state.routeLengthKm.numerator) / Number(q.state.routeLengthKm.denominator);
    for (const option of q.options) {
      const value = numeric(option);
      assert(value !== null && value > 0 && value < route, `Impossible meeting-point option ${option} for ${route} km route`);
      boundedDistractorChecks += 1;
    }
  }
  if (q.visual) {
    visualChecks += 1;
    assert(q.visual.svg.startsWith("<svg") && q.visual.svg.endsWith("</svg>"), "Malformed CP004 visual wrapper");
    assert(!/correctIndex|solution|answer key/i.test(q.visual.svg), "Visual leaks hidden metadata");
    if (q.state.representation === "NUMBER_LINE") assert(/[←→]/u.test(q.visual.svg), `Number line lacks direction arrows ${q.authorityId}`);
    if (q.state.representation === "TIMELINE" && ["FIRST_MEETING_TIME", "HEAD_START_CATCH_UP_TIME", "TIME_TO_SPECIFIED_SEPARATION", "DELAYED_START_CATCH_UP_TIME", "START_DELAY_FROM_CATCH_UP"].includes(q.authorityId)) assert(q.visual.svg.includes("?"), `Timeline should preserve unknown timing for ${q.authorityId}`);
    if (q.authorityId === "MULTI_PURSUER_MEETING_ORDER" && q.state.representation === "NUMBER_LINE") assert(q.visual.svg.includes("A-B") && q.visual.svg.includes("C-B"), "Multi-pursuer visual must use separate gap lanes");
  }
}

for (const authority of TSD_CP004_AUTHORITIES) {
  const rows = byAuthority.get(authority.authorityId) ?? [];
  assert(rows.length === 50, `${authority.authorityId} stress count drifted`);
  assert(new Set(rows.map((q) => q.solution.mathematicalFingerprint)).size >= 20, `${authority.authorityId} mathematical diversity is too low`);
  assert(new Set(rows.map((q) => q.state.actorKind)).size >= 4, `${authority.authorityId} actor/context diversity is too low`);
  assert(new Set(rows.map((q) => q.state.representation)).size === 3, `${authority.authorityId} misses a representation mode`);
}
for (const [i, count] of positions.entries()) {
  const share = count / stress.length;
  assert(share >= 0.18 && share <= 0.32, `Answer position ${i} is imbalanced: ${count}/${stress.length}`);
}

const review = generateCp004EditorialV3EnglishReviewCorpus();
assert(review.length === 48, `Expected 48 English V3 review rows, got ${review.length}`);
let englishStructureChecks = 0;
let distinctReviewMathChecks = 0;
let distinctReviewActorChecks = 0;
for (const authority of TSD_CP004_AUTHORITIES) {
  const rows = review.filter((q) => q.authorityId === authority.authorityId);
  assert(rows.length === 3, `${authority.authorityId} review count must be 3`);
  assert(new Set(rows.map((q) => q.state.variant)).size === 3, `${authority.authorityId} must cover all three variants`);
  assert(new Set(rows.map((q) => structuralEnglish(q.stem))).size === 3, `${authority.authorityId} must have three genuinely distinct English stem structures`);
  englishStructureChecks += 3;
  assert(new Set(rows.map((q) => q.solution.mathematicalFingerprint)).size === 3, `${authority.authorityId} review rows repeat a mathematical state`);
  distinctReviewMathChecks += 3;
  assert(new Set(rows.map((q) => q.state.actorKind)).size >= 2, `${authority.authorityId} review rows repeat one actor context`);
  distinctReviewActorChecks += rows.length;
}

let nativeRows = 0;
let nounParityChecks = 0;
let sentenceParityChecks = 0;
let conditionalChecks = 0;
let whileChecks = 0;
let mathParityChecks = 0;
let optionParityChecks = 0;
let scriptPurityChecks = 0;
let nativeVisualChecks = 0;
let pedagogyChecks = 0;
for (const authority of TSD_CP004_AUTHORITIES) {
  const enRows = review.filter((q) => q.authorityId === authority.authorityId);
  for (const language of ["hi", "pa"] as const) {
    const nativeStructures = new Set<string>();
    const methods = new Set<string>();
    for (const english of enRows) {
      const native = renderCp004EditorialV4NativeQuestion(english, language);
      nativeRows += 1;
      const expectedNoun = cp004ExpectedNativeNoun(english.state, language);
      assert(native.stem.includes(expectedNoun), `${language} noun/object parity failed ${authority.authorityId}`);
      nounParityChecks += 1;
      nativeStructures.add(structuralNative(native.stem, expectedNoun));
      methods.add(native.explanation.method);
      assert(native.state === english.state && native.solution === english.solution && native.solution.mathematicalFingerprint === english.solution.mathematicalFingerprint, `${language} mathematical state/solution parity failed ${authority.authorityId}`);
      mathParityChecks += 1;
      assert(native.correctIndex === english.correctIndex && native.options[native.correctIndex] === native.localizedAnswerText && native.options.length === 4 && new Set(native.options).size === 4, `${language} option parity failed ${authority.authorityId}`);
      optionParityChecks += 1;
      assert(native.explanation.steps.length >= 3 && !('optionAnalysis' in (native.explanation as unknown as Record<string, unknown>)), `${language} learner explanation contract failed ${authority.authorityId}`);
      pedagogyChecks += 1;
      if (sentences(english.stem) > 1) {
        assert(sentences(native.stem) >= sentences(english.stem), `${language} compressed sentence structure ${authority.authorityId}: ${english.stem} -> ${native.stem}`);
        sentenceParityChecks += 1;
      }
      if (/\bif\b/i.test(english.stem)) {
        assert(language === "hi" ? /यदि/u.test(native.stem) : /ਜੇ/u.test(native.stem), `${language} lost if-clause ${authority.authorityId}`);
        conditionalChecks += 1;
      }
      if (/\bwhile\b/i.test(english.stem)) {
        // `चलते समय` is an explicit, gender-neutral Hindi equivalent of English “while travelling”.
        assert(language === "hi" ? /जबकि|चलते हुए|चलते समय/u.test(native.stem) : /ਜਦਕਿ|ਚੱਲਦਿਆਂ/u.test(native.stem), `${language} lost while-relation ${authority.authorityId}`);
        whileChecks += 1;
      }
      const visibleSvg = native.visual?.svg.replace(/<[^>]+>/gu, " ") ?? "";
      const nativeText = `${native.stem} ${native.explanation.method} ${native.explanation.steps.join(" ")} ${native.explanation.shortcut} ${native.explanation.answer} ${native.visual?.alt ?? ""} ${visibleSvg}`;
      const residue = stripAllowedLatin(nativeText);
      assert(!/[A-Za-z]{2,}/u.test(residue), `${language} contains English teaching fallback: ${residue.match(/[A-Za-z]{2,}/u)?.[0]}`);
      scriptPurityChecks += 1;
      if (native.visual) {
        assert(!/\b(gap|start|event|timeline|compare catches|target)\b/iu.test(visibleSvg), `${language} visual retains English learner text`);
        assert(native.visual.alt.length > 20, `${language} visual alt text missing`);
        nativeVisualChecks += 1;
      }
    }
    assert(nativeStructures.size === 3, `${language} ${authority.authorityId} must have three distinct native stem structures`);
    assert(methods.size === 1, `${language} ${authority.authorityId} must have one stable authority-specific method`);
  }
}
assert(nativeRows === 96, `Expected 96 native review rows, got ${nativeRows}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP004_EDITORIAL_V3_FINAL_REVIEW_CANDIDATE",
  blueprintDiscoveryCandidates: 33,
  proposedLearnerAuthorities: 16,
  proposedQlRange: "TSD-QL-048..TSD-QL-063",
  permanentQlCount: 0,
  stressEnglishQuestions: stress.length,
  independentVerifierChecks: verifierChecks,
  uniqueMathematicalFingerprints: fingerprints.size,
  answerPositions: positions,
  boundedDistractorChecks,
  visualChecks,
  englishReviewRows: review.length,
  hindiReviewRows: 48,
  punjabiReviewRows: 48,
  totalReviewRows: 144,
  englishStructureChecks,
  distinctReviewMathChecks,
  distinctReviewActorChecks,
  nounParityChecks,
  sentenceParityChecks,
  conditionalChecks,
  whileChecks,
  mathParityChecks,
  optionParityChecks,
  pedagogyChecks,
  scriptPurityChecks,
  nativeVisualChecks,
  learnerOptionAnalysisFields: 0,
  retainedCountApprovedByProductOwner: false,
  permanentQlAllocationAuthorized: false,
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  reviewStatus: "READY_FOR_PRODUCT_OWNER_CP004_COUNT_AND_CONTENT_REVIEW",
}, null, 2));
