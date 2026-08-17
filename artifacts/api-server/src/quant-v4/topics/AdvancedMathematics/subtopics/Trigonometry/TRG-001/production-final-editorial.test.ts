import { exactKey } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import { TRG_001_AUTHORITY_ALIGNED_IDS, authorityFamilyForTrg001Ql } from "./production-authority-runtime";
import {
  TRG_001_FINAL_EDITORIAL_MEDIUM_RECALIBRATED_IDS,
  generateAllFinalEditorialTrg001Questions,
  generateFinalEditorialTrg001Question,
} from "./production-final-editorial-runtime";
import { TRG_001_ORIENTATION_DIVERSITY_IDS } from "./production-diversity-remediated-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function answerKey(answer: any) {
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

function compactText(value: unknown) {
  return String(value ?? "").replace(/\s+/g, "").toLowerCase();
}

function assertExplanationPolish(q: any, context: string) {
  const answerText = String(q.answer ?? "").trim();
  const explanationText = compactText([
    q.explanation?.keyRule ?? "",
    ...(q.explanation?.steps ?? []).map((step: any) => step.body ?? ""),
  ].join(" "));
  const repeatedEcho = `=${answerText}=${answerText}`;

  assert(
    !(q.explanation?.steps ?? []).some(
      (step: any) => typeof step.body === "string" && step.body.includes(repeatedEcho),
    ),
    `${q.qlId} contains a redundant exact-answer echo for ${context}.`,
  );
  if ((q.difficulty === "Medium" || q.difficulty === "Hard") && answerText) {
    assert(
      explanationText.includes(compactText(answerText)),
      `${q.qlId} does not explicitly state its final answer in the explanation for ${context}.`,
    );
  }
}

assert(TRG_001_AUTHORITY_ALIGNED_IDS.length === 144, "Final editorial surface must retain 144 permanent IDs.");
assert(JSON.stringify(TRG_001_FINAL_EDITORIAL_MEDIUM_RECALIBRATED_IDS) === JSON.stringify([
  "TRG-001-QL-094","TRG-001-QL-099","TRG-001-QL-100",
]), "Final difficulty recalibration set changed unexpectedly.");

const canonicalSeeds = Array.from({ length: 12 }, (_, i) => `trg-final-editorial-${String(i + 1).padStart(2, "0")}`);
const orientationByQl = new Map<string, Set<string>>();
let canonicalCases = 0;

for (const qlId of TRG_001_AUTHORITY_ALIGNED_IDS) {
  const orientations = new Set<string>();
  for (const seed of canonicalSeeds) {
    const q = generateFinalEditorialTrg001Question(qlId, seed);
    assert(q.qlId === qlId, `${qlId} lost permanent ID.`);
    assert(q.authorityAlignment?.family === authorityFamilyForTrg001Ql(qlId), `${qlId} lost authority family.`);
    assert(q.validation?.valid === true && q.verification?.valid === true, `${qlId} failed final validation/verification for ${seed}.`);
    assert(q.options.length === 4 && q.options.filter((o: any) => o.isCorrect).length === 1, `${qlId} option cardinality failed.`);
    assert(new Set(q.options.map((o: any) => answerKey(o.value))).size === 4, `${qlId} has equivalent options.`);
    assert(q.options[q.correctIndex]?.isCorrect === true, `${qlId} correctIndex failed.`);
    const floor = q.difficulty === "Hard" ? 3 : q.difficulty === "Medium" ? 2 : 1;
    assert(q.explanation.steps.length >= floor, `${qlId} explanation is below its final ${q.difficulty} floor.`);
    assertExplanationPolish(q, seed);
    assert(q.reviewStatus === "AI_REVIEWED", `${qlId} final reviewStatus is not AI_REVIEWED.`);
    assert(q.aiEditorialStatus === "PASS", `${qlId} final AI editorial status is not PASS.`);
    assert(q.humanReviewStatus === "PENDING", `${qlId} must remain human-review pending.`);
    assert(q.finalEditorialReview?.status === "PASS" && q.finalEditorialReview?.humanReviewSubstituted === false, `${qlId} final editorial provenance is invalid.`);
    assert(q.questionBankStatus === "NOT_STORED" && q.testEligibility === "INELIGIBLE" && !q.publiclyPublishable && !q.questionStudioDiscoverable, `${qlId} activation lock failed.`);
    if (q.canonicalState?.orientation) orientations.add(String(q.canonicalState.orientation));
    canonicalCases += 1;
  }
  orientationByQl.set(qlId, orientations);
}

for (const qlId of TRG_001_ORIENTATION_DIVERSITY_IDS) {
  const orientations = orientationByQl.get(qlId) ?? new Set<string>();
  assert(orientations.has("TAN_LT_ONE") && orientations.has("TAN_GT_ONE"), `${qlId} lost one orientation on the final editorial surface.`);
}

for (const qlId of TRG_001_FINAL_EDITORIAL_MEDIUM_RECALIBRATED_IDS) {
  for (const seed of canonicalSeeds) {
    const q = generateFinalEditorialTrg001Question(qlId, seed);
    assert(q.difficulty === "Medium", `${qlId} difficulty inflation regressed.`);
  }
}

for (const seed of canonicalSeeds) {
  const q9 = generateFinalEditorialTrg001Question("TRG-001-QL-009", seed);
  assert(!/\bfaces\b/i.test(q9.stem), "QL-009 synthetic 'faces the leg' wording regressed.");
}

const sweepSeeds = Array.from({ length: 50 }, (_, i) => `trg-final-editorial-sweep-${String(i + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllFinalEditorialTrg001Questions(seed);
  assert(questions.length === 144, `${seed} did not generate all 144 final-editorial QLs.`);
  for (const q of questions) {
    assert(q.validation?.valid === true && q.verification?.valid === true, `${q.qlId} failed final sweep for ${seed}.`);
    assert(q.aiEditorialStatus === "PASS" && q.reviewStatus === "AI_REVIEWED" && q.humanReviewStatus === "PENDING", `${q.qlId} review metadata regressed for ${seed}.`);
    assert(q.options.length === 4 && new Set(q.options.map((o: any) => answerKey(o.value))).size === 4, `${q.qlId} option integrity failed for ${seed}.`);
    assert(q.options[q.correctIndex]?.isCorrect === true, `${q.qlId} correctIndex failed for ${seed}.`);
    assertExplanationPolish(q, seed);
    assert(q.questionBankStatus === "NOT_STORED" && q.testEligibility === "INELIGIBLE" && !q.publiclyPublishable && !q.questionStudioDiscoverable, `${q.qlId} activation lock failed for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-001 final editorial gate target: 144 AI-reviewed QLs, ${canonicalCases} canonical cases and ${sweepCases} sweep cases; human review remains pending.`);
