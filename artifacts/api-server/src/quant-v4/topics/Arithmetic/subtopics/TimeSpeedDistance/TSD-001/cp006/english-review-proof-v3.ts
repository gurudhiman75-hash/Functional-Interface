import { compare, divide, rational } from "../foundation/rational";
import { generateCp006EnglishReviewSetV3 } from "./english-review-runtime-v3";
import { independentlyVerifyCp006 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function numericPrefix(text: string): number {
  const match = text.match(/^(\d+)(?:\s+(\d+)\/(\d+))?|^(\d+)\/(\d+)/);
  if (!match) throw new Error(`Cannot parse numeric option prefix: ${text}`);
  if (match[4] && match[5]) return Number(match[4]) / Number(match[5]);
  const whole = Number(match[1] ?? 0);
  return whole + (match[2] && match[3] ? Number(match[2]) / Number(match[3]) : 0);
}

function structuralFingerprint(stem: string, objectFamily: string, routeFamily: string): string {
  return stem
    .replaceAll(objectFamily, "<OBJECT>")
    .replaceAll(routeFamily, "<ROUTE>")
    .replace(/\b\d+(?:\s+\d+\/\d+|\/\d+)?\b/g, "<N>")
    .replace(/\s+/g, " ")
    .trim();
}

const rows = generateCp006EnglishReviewSetV3();
assert(rows.length === 78, `CP006 English V3 expected 78 rows, found ${rows.length}`);
assert(new Set(rows.map((row) => row.permanentQlId)).size === 13, "CP006 English V3 must cover all 13 QLs");
assert(new Set(rows.map((row) => row.objectFamily)).size === 18, "CP006 English V3 must use all 18 object families");
assert(new Set(rows.map((row) => row.routeFamily)).size === 6, "CP006 English V3 must use all six route families");

let independentChecks = 0;
for (const ql of [...new Set(rows.map((row) => row.permanentQlId))].sort()) {
  const subset = rows.filter((row) => row.permanentQlId === ql);
  assert(subset.length === 6, `${ql}: expected six V3 rows`);
  assert(new Set(subset.map((row) => row.stemStructureId)).size === 6, `${ql}: expected six declared stem structures`);
  assert(new Set(subset.map((row) => structuralFingerprint(row.stem, row.objectFamily, row.routeFamily))).size === 6, `${ql}: normalized stem structures still repeat`);
  assert(new Set(subset.map((row) => row.objectFamily)).size === 6, `${ql}: expected six object families`);
  assert(new Set(subset.map((row) => row.routeFamily)).size === 6, `${ql}: expected six route families`);
}

for (const row of rows) {
  assert(row.presentationVersion === "V3_EXAM_READINESS", `${row.seed}: V3 marker missing`);
  assert(row.presentationUnitSystem === "METRE_MINUTE", `${row.seed}: V3 unit system changed`);
  assert(row.stem.length >= 100 && row.stem.length <= 340, `${row.seed}: stem length outside learner range (${row.stem.length})`);
  assert(/^[A-Z]/.test(row.stem), `${row.seed}: stem must start with a capital letter`);
  assert(!/minutes(?:Runner|Athlete|Cadet|Trainee|Jogger|Walker|Competitor|Participant|Recruit|Player|Student|Racer)/.test(row.stem), `${row.seed}: missing separator after minute value`);
  assert(!/\b1 minutes\b|\b1 laps\b/.test(`${row.stem} ${row.answerText} ${row.options.join(" ")} ${row.explanation.steps.join(" ")}`), `${row.seed}: singular-unit grammar defect`);
  assert(!/\bvehicle\b/i.test(`${row.stem} ${row.explanation.steps.join(" ")}`), `${row.seed}: vehicle wording leaked into human track surface`);
  assert(!/The faster [A-Z][a-z]+ A/.test(row.stem), `${row.seed}: awkward faster-subject construction remains`);
  assert(!/\bkm\/h\b|\bkm\b|\bhours?\b/.test(`${row.stem} ${row.answerText} ${row.options.join(" ")} ${row.explanation.steps.join(" ")}`), `${row.seed}: legacy km/hour units leaked into V3`);
  assert(row.options.length === 4 && new Set(row.options).size === 4, `${row.seed}: expected four unique V3 options`);
  assert(row.correctIndex >= 0 && row.correctIndex < 4, `${row.seed}: invalid V3 correct index`);
  assert(row.options[row.correctIndex] === row.answerText, `${row.seed}: V3 correct option identity failed`);
  assert(row.explanation.steps.length === 2, `${row.seed}: explanation must remain two steps`);
  assert(row.explanation.steps.every((step) => step.trim().length >= 25), `${row.seed}: explanation step too thin`);
  const verified = independentlyVerifyCp006(row.solveMode, row.input, row.solution);
  assert(verified.valid, `${row.seed}: independent verifier rejected V3 source`);
  independentChecks += 1;
  assert(row.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.seed}: English must remain unfrozen`);
  assert(row.lifecycle.questionStudioEnabled === false, `${row.seed}: CP006 must remain outside Studio`);
  assert(row.lifecycle.questionBankStatus === "NOT_STORED", `${row.seed}: CP006 must remain outside Question Bank`);
  assert(row.lifecycle.testEligibility === "INELIGIBLE", `${row.seed}: CP006 must remain test-ineligible`);
  assert(row.lifecycle.publiclyPublishable === false, `${row.seed}: CP006 must remain unpublished`);
}

const ql075 = rows.filter((row) => row.permanentQlId === "TSD-QL-075");
for (const row of ql075) {
  const L = Number(row.input.trackLength!.numerator) / Number(row.input.trackLength!.denominator);
  for (const option of row.options) {
    const coordinate = numericPrefix(option);
    assert(coordinate >= 0 && coordinate < L, `${row.seed}: QL075 option ${option} lies outside the circular coordinate range [0, ${L})`);
  }
}

const ql081 = rows.filter((row) => row.permanentQlId === "TSD-QL-081");
for (const row of ql081) {
  assert(compare(row.input.startPositionB!, divide(row.input.trackLength!, rational(2))) > 0, `${row.seed}: QL081 lost wrap-sensitive starting position`);
  assert(!/wrap-around|relative lap|almost one complete/i.test(row.stem), `${row.seed}: QL081 stem reveals the solution method`);
}

const ql082 = rows.filter((row) => row.permanentQlId === "TSD-QL-082");
for (const row of ql082) {
  const firstLapTime = divide(row.input.trackLength!, row.input.speedA!);
  assert(compare(row.input.startDelayB!, firstLapTime) > 0, `${row.seed}: QL082 lost post-lap delayed-start state`);
  assert(!/completed at least one lap|has completed a lap/i.test(row.stem), `${row.seed}: QL082 stem reveals the wrap state`);
}

const difficultyCounts = rows.reduce((acc, row) => {
  acc[row.difficulty] = (acc[row.difficulty] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);
const stemLengths = rows.map((row) => row.stem.length);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_ENGLISH_EXAM_READINESS_V3",
  reviewRows: rows.length,
  permanentQlRange: "TSD-QL-071..TSD-QL-083",
  rowsPerQl: 6,
  normalizedStemStructuresPerQl: 6,
  globalObjectFamilies: new Set(rows.map((row) => row.objectFamily)).size,
  routeFamiliesPerQl: 6,
  independentVerifierChecks: independentChecks,
  difficultyCounts,
  stemLength: { min: Math.min(...stemLengths), max: Math.max(...stemLengths), average: Math.round(stemLengths.reduce((a, b) => a + b, 0) / stemLengths.length) },
  ql075BoundedLocationRows: ql075.length,
  ql081WrapSensitiveRows: ql081.length,
  ql082PostLapDelayedStartRows: ql082.length,
  explanationStepsPerQuestion: 2,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  nextGate: "EXACT_V3_ARTIFACT_MANUAL_REVIEW_AND_PRODUCT_OWNER_ENGLISH_APPROVAL",
}, null, 2));
