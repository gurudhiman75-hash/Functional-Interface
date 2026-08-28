import { exactKey, exactRational, formatExactPlain } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import { TRG_002_RUNTIME_PROOF_IDS } from "./runtime-proof";
import {
  generateAllFinalRemediatedTrg002RuntimeProofQuestions,
  generateFinalRemediatedTrg002RuntimeProofQuestion,
} from "./runtime-proof-final-remediation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function objectHeight(question: any, objectId: string) {
  const found = question.canonicalSpatialState.verticalObjects.find((item: any) => item.id === objectId);
  if (!found) throw new Error(`${question.qlId}: missing object ${objectId}`);
  return found.height;
}

const mediumIds = new Set([
  "TRG-002-QL-056",
  "TRG-002-QL-065",
  "TRG-002-QL-068",
  "TRG-002-QL-078",
  "TRG-002-QL-083",
  "TRG-002-QL-088",
  "TRG-002-QL-092",
]);
const hardIds = new Set(["TRG-002-QL-049", "TRG-002-QL-061"]);
const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg002-final-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;

for (const qlId of TRG_002_RUNTIME_PROOF_IDS) {
  const stems = new Set<string>();
  for (const seed of canonicalSeeds) {
    const question = generateFinalRemediatedTrg002RuntimeProofQuestion(qlId, seed);
    assert(question.validation.valid, `${qlId}: final remediation validation failed for ${seed}.`);
    assert(question.verification.spatial.valid, `${qlId}: spatial verification failed for ${seed}.`);
    assert(question.verification.diagram.valid, `${qlId}: diagram verification failed for ${seed}.`);
    assert(question.verification.answer.valid, `${qlId}: answer verification failed for ${seed}.`);
    assert(question.options.length === 4, `${qlId}: must have four options.`);
    assert(new Set(question.options.map((option) => option.display)).size === 4, `${qlId}: option displays must be unique.`);
    assert(question.options[question.correctIndex]?.isCorrect === true, `${qlId}: correctIndex mismatch.`);
    assert(!question.publiclyPublishable && !question.questionStudioDiscoverable && question.testEligibility === "INELIGIBLE" && question.questionBankStatus === "NOT_STORED", `${qlId}: activation lock changed.`);

    if (mediumIds.has(qlId)) assert(question.difficulty === "Medium", `${qlId}: expected Medium after calibration.`);
    if (hardIds.has(qlId)) assert(question.difficulty === "Hard", `${qlId}: expected genuine Hard difficulty.`);

    if (qlId === "TRG-002-QL-015") {
      const observation = question.canonicalSpatialState.observations[0];
      assert(observation, "QL-015: observation missing.");
      const angle = toDegrees(observation.angle);
      assert(angle.numerator === 45n && angle.denominator === 1n, "QL-015: final depression angle must be exactly 45°.");
      assert(!question.stem.includes("√"), "QL-015: final stem must not contain a synthetic surd measurement.");
      assert(question.exactAnswer.kind === "NUMBER" && !formatExactPlain(question.exactAnswer.value).includes("√"), "QL-015: final answer should be a clean integer length.");
      const observerHeight = objectHeight(question, "observer-building");
      const targetHeight = objectHeight(question, "target-object");
      assert(exactKey(targetHeight) === exactKey(question.exactAnswer.value), "QL-015: canonical target height must equal exact answer.");
      assert(formatExactPlain(observerHeight) !== formatExactPlain(targetHeight), "QL-015: depression must represent a non-zero vertical drop.");
      assert(question.explanation.steps.length >= 3, "QL-015: explanation must distinguish drop from final pole height.");
    }

    if (qlId === "TRG-002-QL-025") {
      assert(question.stem.includes("shadow"), "QL-025: shadow context must remain explicit.");
      assert(question.exactAnswer.kind === "NUMBER" && !formatExactPlain(question.exactAnswer.value).includes("/"), "QL-025: avoid rationalized-denominator style answer forms.");
    }

    if (qlId === "TRG-002-QL-030") {
      assert(!question.stem.includes("√"), "QL-030: given height should remain a natural integer measurement.");
    }

    if (qlId === "TRG-002-QL-073") {
      const observer = question.canonicalSpatialState.observers[0];
      assert(observer && exactKey(observer.eyeHeight) === exactKey(exactRational(3, 2)), "QL-073: eye height must remain realistic at 1.5 m.");
    }

    if (qlId === "TRG-002-QL-078") {
      const ids = question.options.map((option) => option.misconceptionId).filter(Boolean);
      assert(ids.includes("USED_FULL_OBSERVER_SEPARATION_AS_HEIGHT"), "QL-078: full-separation misconception must have precise provenance.");
      assert(!ids.includes("USED_FULL_SEPARATION"), "QL-078: old ambiguous misconception id must not survive.");
    }

    if (qlId === "TRG-002-QL-049" || qlId === "TRG-002-QL-061") {
      assert(question.explanation.steps.length >= 3, `${qlId}: genuine Hard role must retain multi-step reasoning.`);
    }

    stems.add(question.stem);
    canonicalCases += 1;
  }
  assert(stems.size >= 2, `${qlId}: final proof must retain at least two stem variants across canonical seeds.`);
}

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg002-final-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllFinalRemediatedTrg002RuntimeProofQuestions(seed);
  assert(questions.length === 20, `${seed}: did not generate all 20 final-remediated proof QLs.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId}: final sweep validation failed for ${seed}.`);
    assert(question.verification.spatial.valid && question.verification.diagram.valid && question.verification.answer.valid, `${question.qlId}: final sweep verification failed for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-002 final-remediation gate target: ${canonicalCases} canonical cases and ${sweepCases} sweep cases.`);
