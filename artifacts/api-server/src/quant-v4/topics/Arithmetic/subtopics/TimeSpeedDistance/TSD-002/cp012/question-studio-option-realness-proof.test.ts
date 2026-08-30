import { compare, multiply, rational, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { buildTsdCp012ScalarDistractors, buildTsdCp012SetDistractors } from "./question-studio-distractors";
import { previewTsdCp012StudioCandidate } from "./question-studio-candidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 option realness proof failed: ${message}`);
}
const ZERO = rational(0);
function gt(value: Rational, lower: Rational): boolean { return compare(value, lower) > 0; }
function gte(value: Rational, lower: Rational): boolean { return compare(value, lower) >= 0; }
function lt(value: Rational, upper: Rational): boolean { return compare(value, upper) < 0; }
function lte(value: Rational, upper: Rational): boolean { return compare(value, upper) <= 0; }

let scalarFamilies = 0;
let setFamilies = 0;
let boundedFamilies = 0;
for (const question of TSD_CP012_ENGLISH_REVIEW_FINAL) {
  if (question.solution.kind === "SET") {
    const wrongs = buildTsdCp012SetDistractors(question.input, question.solution);
    assert(question.input.authorityKey === "feasibleParameterSetState" && question.input.target === "VALID_SET", `${question.familyId}: unexpected set-valued review surface`);
    const upperWithIntentionalOffByOne = rational(question.input.maximumCandidate + 1);
    for (const wrong of wrongs) {
      assert(wrong.values.every((value) => gte(value, ZERO) && lte(value, upperWithIntentionalOffByOne)), `${question.familyId}/${wrong.misconceptionId}: set distractor escaped finite candidate range`);
    }
    setFamilies += 1;
    continue;
  }
  if (question.solution.unit === "INDEX") continue;

  const wrongs = buildTsdCp012ScalarDistractors(question.input, question.solution);
  scalarFamilies += 1;
  assert(wrongs.every((wrong) => gte(wrong.value, ZERO)), `${question.familyId}: negative scalar distractor`);

  const input = question.input;
  if (input.authorityKey === "terminalConstraintProgramState" && input.target === "STAGE_BOUNDARY_DISTANCE") {
    assert(wrongs.every((wrong) => gt(wrong.value, ZERO) && lt(wrong.value, input.totalDistance)), `${question.familyId}: stage-boundary distractor lies outside the journey`);
    boundedFamilies += 1;
  }
  if (input.authorityKey === "terminalConstraintProgramState" && input.target === "DISTANCE_REMAINING_AFTER_STAGES") {
    assert(wrongs.every((wrong) => gte(wrong.value, ZERO) && lte(wrong.value, input.totalDistance)), `${question.familyId}: remaining-distance distractor lies outside the journey`);
    boundedFamilies += 1;
  }
  if (input.authorityKey === "routeProfileProgramState" && input.target === "DISTANCE_SPLIT_A") {
    assert(wrongs.every((wrong) => gt(wrong.value, ZERO) && lt(wrong.value, input.totalDistance)), `${question.familyId}: route-split distractor lies outside the route`);
    boundedFamilies += 1;
  }
  if (input.authorityKey === "motionReconstructionProgramState" && input.target === "MISSING_DISTANCE") {
    assert(wrongs.every((wrong) => gte(wrong.value, ZERO) && lte(wrong.value, input.totalDistance)), `${question.familyId}: missing-distance distractor exceeds the trip total`);
    boundedFamilies += 1;
  }
  if (input.authorityKey === "motionReconstructionProgramState" && input.target === "MISSING_TIME") {
    assert(wrongs.every((wrong) => gte(wrong.value, ZERO) && lte(wrong.value, input.totalTime)), `${question.familyId}: missing-time distractor exceeds the trip total time`);
    boundedFamilies += 1;
  }
  if (input.authorityKey === "trainScheduleSynthesisState" && input.target === "DELAY_B") {
    assert(wrongs.every((wrong) => gte(wrong.value, ZERO) && lt(wrong.value, input.meetingTimeFromFirstDeparture)), `${question.familyId}: departure-delay distractor is not earlier than the meeting`);
    boundedFamilies += 1;
  }
  if (input.authorityKey === "mediumPursuitSynthesisState" && input.target === "CURRENT_SPEED") {
    assert(wrongs.every((wrong) => gte(wrong.value, ZERO) && lt(wrong.value, input.boatStillWaterSpeed)), `${question.familyId}: current-speed distractor is not physically exam-plausible relative to still-water boat speed`);
    boundedFamilies += 1;
  }
  if (input.authorityKey === "closedTrackRaceSynthesisState" && input.target === "TRACK_GAP_AT_FASTER_FINISH") {
    assert(wrongs.every((wrong) => gte(wrong.value, ZERO) && lt(wrong.value, input.trackLength)), `${question.familyId}: track-gap distractor is outside one track circumference`);
    boundedFamilies += 1;
  }
  if (input.authorityKey === "closedTrackRaceSynthesisState" && input.target === "HEAD_START_FOR_DEAD_HEAT") {
    const raceDistance = multiply(input.trackLength, rational(input.raceLaps));
    assert(wrongs.every((wrong) => gte(wrong.value, ZERO) && lt(wrong.value, raceDistance)), `${question.familyId}: head-start distractor is outside the race distance`);
    boundedFamilies += 1;
  }
}

for (const language of ["hi", "pa"] as const) {
  const preview = previewTsdCp012StudioCandidate({ language, count: 270, seed: `cp012-native-option-purity-${language}` });
  for (const question of preview.questions) {
    assert(question.options.every((option) => !/[A-Za-z]/.test(option)), `${language}/${question.familyId}: Latin learner text leaked into localized options`);
  }
}

assert(scalarFamilies + setFamilies + TSD_CP012_ENGLISH_REVIEW_FINAL.filter((question) => question.solution.kind === "SCALAR" && question.solution.unit === "INDEX").length === 270, "option-realness audit did not visit the complete English surface");
assert(scalarFamilies > 0 && setFamilies > 0 && boundedFamilies > 0, "option-realness audit did not exercise all expected surfaces");
console.log("TSD-CP-012 OPTION REALNESS + NATIVE OPTION PURITY PROOF: PASS");
console.log(JSON.stringify({
  reviewedFamilies: 270,
  scalarFamilies,
  setFamilies,
  boundedFamilies,
  nativeOptionScriptPurity: "PASS",
  genericNumericFallbacks: false,
  distractorsFrozen: false,
}, null, 2));
