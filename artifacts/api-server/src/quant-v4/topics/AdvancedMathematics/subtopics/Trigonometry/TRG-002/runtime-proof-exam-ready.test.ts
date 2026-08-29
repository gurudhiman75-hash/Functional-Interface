import { exactKey, exactRational, formatExactPlain } from "../foundation/exact";
import {
  TRG_002_RUNTIME_PROOF_IDS,
} from "./runtime-proof";
import {
  generateAllExamReadyTrg002RuntimeProofQuestions,
  generateExamReadyTrg002RuntimeProofQuestion,
} from "./runtime-proof-exam-ready";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
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
const canonicalSeeds = Array.from({ length: 12 }, (_, index) => `trg002-exam-ready-${String(index + 1).padStart(2, "0")}`);
let canonicalCases = 0;

for (const qlId of TRG_002_RUNTIME_PROOF_IDS) {
  const stems = new Set<string>();
  for (const seed of canonicalSeeds) {
    const question = generateExamReadyTrg002RuntimeProofQuestion(qlId, seed);
    assert(question.validation.valid, `${qlId} exam-ready validation failed for ${seed}.`);
    assert(question.verification.spatial.valid, `${qlId} canonical spatial verification failed for ${seed}.`);
    assert(question.verification.diagram.valid, `${qlId} legacy diagram validation failed for ${seed}.`);
    assert(question.verification.answer.valid, `${qlId} independent answer reconstruction failed for ${seed}.`);
    assert(question.options.length === 4 && new Set(question.options.map((option) => option.display)).size === 4, `${qlId} options are not four distinct displays.`);
    assert(question.options[question.correctIndex]?.isCorrect === true, `${qlId} correctIndex is invalid.`);
    assert(!question.publiclyPublishable && !question.questionStudioDiscoverable && question.testEligibility === "INELIGIBLE", `${qlId} activation lock changed.`);

    if (mediumIds.has(qlId)) assert(question.difficulty === "Medium", `${qlId} should be calibrated to Medium.`);
    if (hardIds.has(qlId)) assert(question.difficulty === "Hard", `${qlId} should retain genuine Hard difficulty.`);

    if (qlId === "TRG-002-QL-015") {
      assert(question.exactAnswer.kind === "NUMBER", "QL-015 must retain a numeric length answer.");
      const answer = formatExactPlain(question.exactAnswer.value);
      assert(!answer.includes("√") && !answer.includes("/"), `QL-015 should now produce a clean integer pole height, got ${answer}.`);
      assert(question.explanation.steps.length >= 3, "QL-015 explanation must explicitly distinguish drop from final height.");
    }

    if (qlId === "TRG-002-QL-025") {
      assert(question.exactAnswer.kind === "NUMBER", "QL-025 must retain a numeric length answer.");
      assert(!formatExactPlain(question.exactAnswer.value).includes("/"), "QL-025 should not regress to a √3/3-style height answer.");
    }

    if (qlId === "TRG-002-QL-030") {
      assert(!question.stem.includes("√"), "QL-030 should give a natural integer object height rather than a synthetic surd height.");
      assert(question.exactAnswer.kind === "NUMBER" && formatExactPlain(question.exactAnswer.value).includes("√"), "QL-030 may place the exact surd naturally in the answer.");
    }

    if (qlId === "TRG-002-QL-056") {
      assert(question.canonicalSpatialState.requested.kind === "HORIZONTAL_DISTANCE", "QL-056 canonical target must be horizontal distance.");
      if (question.canonicalSpatialState.requested.kind === "HORIZONTAL_DISTANCE") {
        assert(question.canonicalSpatialState.requested.fromPointId === "object-base" && question.canonicalSpatialState.requested.toPointId === "near-ground", "QL-056 must request the near distance from tower to final point.");
      }
    }

    if (qlId === "TRG-002-QL-061") {
      assert(!/^From\s+\d/.test(question.stem), "QL-061 must not disclose the original distance in the stem.");
      assert(question.explanation.steps.length >= 3, "QL-061 must retain the two-observation Hard explanation.");
    }

    if (qlId === "TRG-002-QL-065") {
      assert(question.canonicalSpatialState.requested.kind === "HORIZONTAL_DISTANCE", "QL-065 canonical target must be horizontal distance.");
      if (question.canonicalSpatialState.requested.kind === "HORIZONTAL_DISTANCE") {
        assert(question.canonicalSpatialState.requested.fromPointId === "object-base" && question.canonicalSpatialState.requested.toPointId === "far-ground", "QL-065 must request the original far distance from tower to starting point.");
      }
    }

    if (qlId === "TRG-002-QL-068") {
      assert(question.canonicalSpatialState.requested.kind === "HORIZONTAL_DISTANCE", "QL-068 canonical target must be point separation.");
      if (question.canonicalSpatialState.requested.kind === "HORIZONTAL_DISTANCE") {
        assert(question.canonicalSpatialState.requested.fromPointId === "near-ground" && question.canonicalSpatialState.requested.toPointId === "far-ground", "QL-068 must request the near-to-far point separation.");
      }
    }

    if (qlId === "TRG-002-QL-073") {
      const observer = question.canonicalSpatialState.observers[0];
      assert(observer, "QL-073 observer is missing.");
      assert(exactKey(observer.eyeHeight) === exactKey(exactRational(3, 2)), "QL-073 eye height must be the realistic 1.5 m value.");
      assert(question.stem.includes("1.5 m"), "QL-073 stem must state the same 1.5 m eye height as canonical state.");
    }

    if (qlId === "TRG-002-QL-078") {
      const misconceptionIds = question.options.map((option) => option.misconceptionId).filter(Boolean);
      assert(!misconceptionIds.includes("USED_FULL_SEPARATION"), "QL-078 old ambiguous full-separation distractor tag must not survive.");
      assert(!misconceptionIds.includes("USED_THREE_QUARTERS"), "QL-078 old vague three-quarters distractor tag must not survive.");
    }

    stems.add(question.stem);
    canonicalCases += 1;
  }
  assert(stems.size >= 2, `${qlId} must retain at least two meaningful stem variants across canonical seeds.`);
}

const sweepSeeds = Array.from({ length: 50 }, (_, index) => `trg002-exam-ready-sweep-${String(index + 1).padStart(2, "0")}`);
let sweepCases = 0;
for (const seed of sweepSeeds) {
  const questions = generateAllExamReadyTrg002RuntimeProofQuestions(seed);
  assert(questions.length === 20, `${seed} did not generate all 20 exam-ready proof QLs.`);
  for (const question of questions) {
    assert(question.validation.valid, `${question.qlId} failed exam-ready sweep validation for ${seed}.`);
    assert(question.verification.spatial.valid && question.verification.diagram.valid && question.verification.answer.valid, `${question.qlId} failed an exam-ready verification gate for ${seed}.`);
    sweepCases += 1;
  }
}

console.log(`TRG-002 exam-ready proof gate target: ${canonicalCases} canonical cases and ${sweepCases} sweep cases.`);
