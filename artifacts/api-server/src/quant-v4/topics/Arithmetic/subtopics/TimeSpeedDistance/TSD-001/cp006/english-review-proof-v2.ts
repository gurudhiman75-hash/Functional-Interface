import { absRational, compare, divide, rational, subtract, toMixedString } from "../foundation/rational";
import { generateCp006EnglishReviewSetV2 } from "./english-review-runtime-v2";
import { independentlyVerifyCp006 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const rows = generateCp006EnglishReviewSetV2();
assert(rows.length === 78, `CP006 English V2 expected 78 rows, found ${rows.length}`);
assert(new Set(rows.map((row) => row.permanentQlId)).size === 13, "CP006 English V2 must cover 13 QLs");

for (const ql of [...new Set(rows.map((row) => row.permanentQlId))]) {
  const subset = rows.filter((row) => row.permanentQlId === ql);
  assert(subset.length === 6, `${ql}: expected six V2 rows`);
  assert(new Set(subset.map((row) => row.stem)).size === 6, `${ql}: V2 stems must remain unique`);
}

let independentChecks = 0;
for (const row of rows) {
  assert(row.presentationVersion === "V2_EXAM_NATURALIZED", `${row.seed}: V2 presentation marker missing`);
  assert(row.presentationUnitSystem === "METRE_MINUTE", `${row.seed}: metre/minute presentation required`);
  assert(/^[A-Z]/.test(row.stem), `${row.seed}: stem must begin with a capital letter`);
  assert(!/\bkm\/h\b|\bkm\b|\bhours?\b/.test(row.stem), `${row.seed}: legacy km/hour learner units leaked into V2 stem`);
  assert(!/inspection vehicle|service cart|patrol vehicle|test car|delivery van|maintenance vehicle/i.test(row.stem), `${row.seed}: V1 vehicle labels leaked into V2 stem`);
  assert(row.options.length === 4 && new Set(row.options).size === 4, `${row.seed}: V2 needs four unique options`);
  assert(row.correctIndex >= 0 && row.correctIndex < 4, `${row.seed}: V2 correct index invalid`);
  assert(row.options[row.correctIndex] === row.answerText, `${row.seed}: V2 correct option identity failed`);
  assert(row.options.every((option) => !/\bkm\/h\b|\bkm\b|\bhours?\b/.test(option)), `${row.seed}: legacy units leaked into V2 options`);
  assert(row.explanation.steps.length === 2, `${row.seed}: V2 explanation must stay at two steps`);
  assert(row.explanation.steps.every((step) => step.trim().length >= 25), `${row.seed}: V2 explanation step too thin`);
  assert(row.explanation.steps.every((step) => !/\bkm\/h\b|\bkm\b|\bhours?\b/.test(step)), `${row.seed}: legacy units leaked into V2 explanation`);
  const verified = independentlyVerifyCp006(row.solveMode, row.input, row.solution);
  assert(verified.valid, `${row.seed}: exact source no longer independently verifies`);
  independentChecks += 1;
  assert(row.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.seed}: V2 must remain unfrozen`);
  assert(row.lifecycle.questionStudioEnabled === false, `${row.seed}: CP006 V2 must remain outside Studio`);
  assert(row.lifecycle.questionBankStatus === "NOT_STORED", `${row.seed}: CP006 V2 must remain outside Bank`);
  assert(row.lifecycle.testEligibility === "INELIGIBLE", `${row.seed}: CP006 V2 must remain test-ineligible`);
  assert(row.lifecycle.publiclyPublishable === false, `${row.seed}: CP006 V2 must remain unpublished`);
}

const ql081 = rows.filter((row) => row.permanentQlId === "TSD-QL-081");
for (const row of ql081) {
  const L = row.input.trackLength!;
  const gap = row.input.startPositionB!;
  assert(compare(gap, divide(L, rational(2))) > 0, `${row.seed}: QL081 must remain wrap-sensitive`);
  assert(!/almost one complete relative lap|close to completing a full lap/i.test(row.stem), `${row.seed}: QL081 stem must not reveal the method`);
  const shortArc = divide(subtract(L, gap), absRational(subtract(row.input.speedA!, row.input.speedB!)));
  const shortArcText = `${toMixedString(shortArc)} minutes`;
  assert(row.options.includes(shortArcText), `${row.seed}: QL081 must include the short-arc mistake as a distractor`);
}

const ql082 = rows.filter((row) => row.permanentQlId === "TSD-QL-082");
for (const row of ql082) {
  const lapTime = divide(row.input.trackLength!, row.input.speedA!);
  assert(compare(row.input.startDelayB!, lapTime) > 0, `${row.seed}: QL082 early runner must have completed a lap before B starts`);
  assert(!/at least one lap/i.test(row.stem), `${row.seed}: QL082 stem must not tell the learner that a lap was completed`);
  const afterSecondStart = subtract(row.solution.value!, row.input.startDelayB!);
  assert(row.options.includes(`${toMixedString(afterSecondStart)} minutes`), `${row.seed}: QL082 must include 'time after later start' as a distractor`);
}

for (const row of rows.filter((entry) => entry.permanentQlId === "TSD-QL-076")) {
  const wrongDifference = absRational(subtract(row.input.speedA!, row.input.speedB!));
  const wrongLength = `${toMixedString({ numerator: wrongDifference.numerator * row.input.observedMeetingTime!.numerator, denominator: wrongDifference.denominator * row.input.observedMeetingTime!.denominator })} m`;
  assert(row.options.includes(wrongLength), `${row.seed}: QL076 must include difference-speed circumference error`);
}

for (const row of rows.filter((entry) => entry.permanentQlId === "TSD-QL-080")) {
  const correct = row.answerText;
  assert(row.options.some((option) => option !== correct && option.includes("AB =") && option.includes("AC =") && option.includes("BC =")), `${row.seed}: QL080 needs pair-order distractors`);
}

const lowerStarts = rows.filter((row) => !/^[A-Z]/.test(row.stem)).length;
const difficultyCounts = rows.reduce((acc, row) => {
  acc[row.difficulty] = (acc[row.difficulty] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_ENGLISH_REVIEW_CANDIDATE_V2",
  reviewRows: rows.length,
  permanentQlRange: "TSD-QL-071..TSD-QL-083",
  rowsPerQl: 6,
  independentVerifierChecks: independentChecks,
  lowerCaseStemStarts: lowerStarts,
  presentationUnitSystem: "METRE_MINUTE",
  ql081WrapSensitiveRows: ql081.length,
  ql082PostLapDelayedStartRows: ql082.length,
  difficultyCounts,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  nextGate: "MANUAL_LEARNER_ARTIFACT_AUDIT_BEFORE_ENGLISH_APPROVAL",
}, null, 2));
