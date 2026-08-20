import { compare, divide, rational } from "../foundation/rational";
import { generateCp006EnglishReviewSetV4 } from "./english-review-runtime-v4";
import { independentlyVerifyCp006 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function numericPrefix(text: string): number {
  const match = text.match(/^(\d+)(?:\s+(\d+)\/(\d+))?|^(\d+)\/(\d+)/);
  if (!match) throw new Error(`Cannot parse numeric option prefix: ${text}`);
  if (match[4] && match[5]) return Number(match[4]) / Number(match[5]);
  return Number(match[1] ?? 0) + (match[2] && match[3] ? Number(match[2]) / Number(match[3]) : 0);
}

const rows = generateCp006EnglishReviewSetV4();
assert(rows.length === 78, `CP006 English V4 expected 78 rows, found ${rows.length}`);
assert(new Set(rows.map((row) => row.permanentQlId)).size === 13, "CP006 English V4 must cover 13 QLs");
assert(new Set(rows.map((row) => row.objectFamily)).size === 18, "CP006 English V4 must retain all 18 object families");
assert(new Set(rows.map((row) => row.routeFamily)).size === 6, "CP006 English V4 must retain all six route families");

let independentChecks = 0;
for (const ql of [...new Set(rows.map((row) => row.permanentQlId))]) {
  const subset = rows.filter((row) => row.permanentQlId === ql);
  assert(subset.length === 6, `${ql}: expected six V4 rows`);
  assert(new Set(subset.map((row) => row.stem)).size === 6, `${ql}: V4 stems must remain unique`);
  assert(new Set(subset.map((row) => row.stemStructureId)).size === 6, `${ql}: V4 stem structure IDs must remain unique`);
  assert(new Set(subset.map((row) => row.routeFamily)).size === 6, `${ql}: V4 must retain six route contexts`);
}

for (const row of rows) {
  const learnerText = `${row.stem} ${row.options.join(" ")} ${row.explanation.steps.join(" ")}`;
  assert(row.presentationVersion === "V4_LEARNER_POLISH", `${row.seed}: V4 marker missing`);
  assert(row.stem.toLowerCase().includes(row.objectFamily.toLowerCase()), `${row.seed}: declared object family is not visible in the learner stem`);
  assert(row.stem.toLowerCase().includes(row.routeFamily.toLowerCase()) || row.permanentQlId === "TSD-QL-076", `${row.seed}: declared route family is not visible in the stem`);
  assert(!/\ba 18-minute\b/.test(row.stem), `${row.seed}: article grammar defect remains`);
  assert(!/\bA faster [A-Z]/.test(row.stem), `${row.seed}: awkward faster-subject construction remains`);
  assert(!/\bTwo Joggers\b/.test(row.stem), `${row.seed}: unnecessary common-noun capitalization remains`);
  assert(!/\b1\/2 laps\b/.test(learnerText), `${row.seed}: half-lap grammar defect remains`);
  assert(!/minutes(?:Runner|Athlete|Cadet|Trainee|Jogger|Walker|Competitor|Participant|Recruit|Player|Student|Racer)/.test(row.stem), `${row.seed}: missing separator after time value`);
  assert(!/\b1 minutes\b|\b1 laps\b/.test(learnerText), `${row.seed}: singular-unit grammar defect remains`);
  assert(!/\bvehicle\b/i.test(`${row.stem} ${row.explanation.steps.join(" ")}`), `${row.seed}: vehicle wording leaked into track learner surface`);
  assert(row.options.length === 4 && new Set(row.options).size === 4, `${row.seed}: expected four unique options`);
  assert(row.options[row.correctIndex] === row.answerText, `${row.seed}: correct option identity failed after V4 polish`);
  assert(row.explanation.steps.length === 2, `${row.seed}: explanation must remain two steps`);
  const verified = independentlyVerifyCp006(row.solveMode, row.input, row.solution);
  assert(verified.valid, `${row.seed}: independent verifier rejected V4 source`);
  independentChecks += 1;
  assert(row.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.seed}: English must remain unfrozen`);
  assert(row.lifecycle.questionStudioEnabled === false, `${row.seed}: CP006 must remain outside Studio`);
  assert(row.lifecycle.questionBankStatus === "NOT_STORED", `${row.seed}: CP006 must remain outside Question Bank`);
  assert(row.lifecycle.testEligibility === "INELIGIBLE", `${row.seed}: CP006 must remain test-ineligible`);
  assert(row.lifecycle.publiclyPublishable === false, `${row.seed}: CP006 must remain unpublished`);
}

for (const row of rows.filter((entry) => entry.permanentQlId === "TSD-QL-075")) {
  const L = Number(row.input.trackLength!.numerator) / Number(row.input.trackLength!.denominator);
  for (const option of row.options) {
    const coordinate = numericPrefix(option);
    assert(coordinate >= 0 && coordinate < L, `${row.seed}: location option ${option} lies outside [0, ${L})`);
  }
}

for (const row of rows.filter((entry) => entry.permanentQlId === "TSD-QL-081")) {
  assert(compare(row.input.startPositionB!, divide(row.input.trackLength!, rational(2))) > 0, `${row.seed}: QL081 lost wrap-sensitive source state`);
  assert(!/wrap-around|relative lap|almost one complete/i.test(row.stem), `${row.seed}: QL081 stem reveals the solution method`);
  assert(!/wrap-around arc/i.test(row.explanation.steps.join(" ")), `${row.seed}: QL081 explanation retains needlessly confusing wrap-arc wording`);
}

for (const row of rows.filter((entry) => entry.permanentQlId === "TSD-QL-082")) {
  const firstLapTime = divide(row.input.trackLength!, row.input.speedA!);
  assert(compare(row.input.startDelayB!, firstLapTime) > 0, `${row.seed}: QL082 lost post-lap delayed-start state`);
  assert(!/completed at least one lap|has completed a lap/i.test(row.stem), `${row.seed}: QL082 stem reveals the wrap state`);
}

const difficultyCounts = rows.reduce((acc, row) => {
  acc[row.difficulty] = (acc[row.difficulty] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_ENGLISH_LEARNER_POLISH_V4",
  reviewRows: rows.length,
  permanentQlRange: "TSD-QL-071..TSD-QL-083",
  rowsPerQl: 6,
  visibleObjectFamilies: new Set(rows.map((row) => row.objectFamily)).size,
  routeFamilies: new Set(rows.map((row) => row.routeFamily)).size,
  independentVerifierChecks: independentChecks,
  difficultyCounts,
  explanationStepsPerQuestion: 2,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  nextGate: "EXACT_V4_ARTIFACT_MANUAL_REVIEW_AND_PRODUCT_OWNER_ENGLISH_APPROVAL",
}, null, 2));
