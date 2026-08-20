import { compare, divide, rational } from "../foundation/rational";
import { generateCp006EnglishReviewSetV5 } from "./english-review-runtime-v5";
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

const rows = generateCp006EnglishReviewSetV5();
assert(rows.length === 78, `CP006 English V5 expected 78 rows, found ${rows.length}`);
assert(new Set(rows.map((row) => row.permanentQlId)).size === 13, "CP006 English V5 must cover 13 QLs");
assert(new Set(rows.map((row) => row.objectFamily)).size === 18, "CP006 English V5 must retain 18 object families");
assert(new Set(rows.map((row) => row.routeFamily)).size === 6, "CP006 English V5 must retain six route families");

let independentChecks = 0;
for (const ql of [...new Set(rows.map((row) => row.permanentQlId))]) {
  const subset = rows.filter((row) => row.permanentQlId === ql);
  assert(subset.length === 6, `${ql}: expected six V5 rows`);
  assert(new Set(subset.map((row) => row.stem)).size === 6, `${ql}: V5 stems must remain unique`);
  assert(new Set(subset.map((row) => row.stemStructureId)).size === 6, `${ql}: V5 structure IDs must remain unique`);
  assert(new Set(subset.map((row) => row.routeFamily)).size === 6, `${ql}: V5 route-context coverage changed`);
}

for (const row of rows) {
  const learnerText = `${row.stem} ${row.options.join(" ")} ${row.explanation.steps.join(" ")}`;
  assert(row.presentationVersion === "V5_FINAL_EDITORIAL_CANDIDATE", `${row.seed}: V5 marker missing`);
  assert(row.stem.toLowerCase().includes(row.objectFamily.toLowerCase()), `${row.seed}: object family not visible in learner stem`);
  assert(!/\ba 18-minute\b/.test(row.stem), `${row.seed}: article grammar defect remains`);
  assert(!/\bA faster [A-Z]|who is faster, moving/.test(row.stem), `${row.seed}: awkward faster-subject wording remains`);
  assert(!/\buse the route\b/.test(row.stem), `${row.seed}: mechanical object-family injection remains`);
  assert(!/\b1\/2 laps\b/.test(learnerText), `${row.seed}: half-lap grammar defect remains`);
  assert(!/\b\d+ \d+\/\d+ lap(?=\s|[.,;!?]|$)/.test(learnerText), `${row.seed}: mixed-fraction lap grammar defect remains`);
  assert(!/\b1 minutes\b|\b1 laps\b/.test(learnerText), `${row.seed}: singular-unit grammar defect remains`);
  assert(!/minutes(?:Runner|Athlete|Cadet|Trainee|Jogger|Walker|Competitor|Participant|Recruit|Player|Student|Racer|Club|Track|Academy|Fitness|Sports|Practice)/.test(row.stem), `${row.seed}: missing separator after time value`);
  assert(!/\bvehicle\b/i.test(`${row.stem} ${row.explanation.steps.join(" ")}`), `${row.seed}: vehicle wording leaked into learner surface`);
  assert(row.options.length === 4 && new Set(row.options).size === 4, `${row.seed}: expected four unique options`);
  assert(row.options[row.correctIndex] === row.answerText, `${row.seed}: correct option identity failed`);
  assert(row.explanation.steps.length === 2, `${row.seed}: explanation must remain two steps`);
  const verified = independentlyVerifyCp006(row.solveMode, row.input, row.solution);
  assert(verified.valid, `${row.seed}: independent verifier rejected V5 source`);
  independentChecks += 1;
  assert(row.lifecycle.englishFreezeStatus === "UNFROZEN", `${row.seed}: English must remain unfrozen`);
  assert(row.lifecycle.questionStudioEnabled === false, `${row.seed}: CP006 must remain outside Studio`);
  assert(row.lifecycle.questionBankStatus === "NOT_STORED", `${row.seed}: CP006 must remain outside Bank`);
  assert(row.lifecycle.testEligibility === "INELIGIBLE", `${row.seed}: CP006 must remain test-ineligible`);
  assert(row.lifecycle.publiclyPublishable === false, `${row.seed}: CP006 must remain unpublished`);
}

for (const row of rows.filter((entry) => entry.permanentQlId === "TSD-QL-075")) {
  const L = Number(row.input.trackLength!.numerator) / Number(row.input.trackLength!.denominator);
  for (const option of row.options) {
    const coordinate = numericPrefix(option);
    assert(coordinate >= 0 && coordinate < L, `${row.seed}: QL075 option ${option} lies outside [0, ${L})`);
  }
}

for (const row of rows.filter((entry) => entry.permanentQlId === "TSD-QL-081")) {
  assert(compare(row.input.startPositionB!, divide(row.input.trackLength!, rational(2))) > 0, `${row.seed}: QL081 lost wrap-sensitive state`);
  assert(!/wrap-around|relative lap|almost one complete/i.test(row.stem), `${row.seed}: QL081 stem reveals method`);
}
for (const row of rows.filter((entry) => entry.permanentQlId === "TSD-QL-082")) {
  assert(compare(row.input.startDelayB!, divide(row.input.trackLength!, row.input.speedA!)) > 0, `${row.seed}: QL082 lost post-lap delayed-start state`);
  assert(!/completed at least one lap|has completed a lap/i.test(row.stem), `${row.seed}: QL082 stem reveals method`);
}

const difficultyCounts = rows.reduce((acc, row) => {
  acc[row.difficulty] = (acc[row.difficulty] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);
const stemLengths = rows.map((row) => row.stem.length);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_ENGLISH_FINAL_EDITORIAL_V5",
  reviewRows: rows.length,
  permanentQlRange: "TSD-QL-071..TSD-QL-083",
  rowsPerQl: 6,
  visibleObjectFamilies: new Set(rows.map((row) => row.objectFamily)).size,
  routeFamilies: new Set(rows.map((row) => row.routeFamily)).size,
  independentVerifierChecks: independentChecks,
  difficultyCounts,
  stemLength: { min: Math.min(...stemLengths), max: Math.max(...stemLengths), average: Math.round(stemLengths.reduce((a, b) => a + b, 0) / stemLengths.length) },
  explanationStepsPerQuestion: 2,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  nextGate: "PRODUCT_OWNER_ENGLISH_REVIEW_AND_APPROVAL_BEFORE_FREEZE",
}, null, 2));
