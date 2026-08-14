import { generateMalCp006Wave02FinalAuthorityV3, MAL_CP006_WAVE02_FINAL_AUTHORITY_V3_ID } from "./foundation/cp006-wave02-final-authority-v3";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";

const failures: string[] = [];
const positions = [0, 0, 0, 0];
let generated = 0;
let passed = 0;
let witness = false;

const diversity: Record<string, { states: Set<string>; shapes: Set<number>; skeletons: Set<string> }> = {};

function stemSkeleton(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/gu, "#")
    .replace(/\s+/gu, " ")
    .trim();
}

for (const id of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  diversity[id] = { states: new Set(), shapes: new Set(), skeletons: new Set() };
  for (let i = 0; i < 320; i += 1) {
    const seed = `wave02-final-v3:${id}:${i}`;
    const q = generateMalCp006Wave02FinalAuthorityV3(id, seed);
    const q2 = generateMalCp006Wave02FinalAuthorityV3(id, seed);
    generated += 1;
    diversity[id].states.add(q.stateKey);
    diversity[id].shapes.add(q.stemShape);
    diversity[id].skeletons.add(stemSkeleton(q.stem));
    positions[q.correctIndex] += 1;

    const text = [q.stem, ...q.options, ...q.explanation, q.commonMistake].join(" ");
    const ok =
      q.validation.ok &&
      JSON.stringify(q) === JSON.stringify(q2) &&
      q.stem.endsWith("?") &&
      q.explanation.length === 4 &&
      q.options.length === 4 &&
      new Set(q.options).size === 4 &&
      q.options[q.correctIndex] === q.answer &&
      !text.includes("x²") &&
      !text.includes("→") &&
      !/litres of pure milk (?:are|is) kept/iu.test(text) &&
      !text.includes("component load") &&
      !text.includes("state key") &&
      q.permanentQlId === null &&
      q.permanentSolveModeId === null &&
      !q.active &&
      !q.publiclyPublishable &&
      !q.questionStudioDiscoverable &&
      !q.questionBankWritable &&
      !q.testEligible;

    if (ok) passed += 1;
    else failures.push(`${id}:${i}:${q.validation.errors.join("|")}`);

    if (
      q.stateKey === "220:4:3:20" &&
      q.answer === "64 litres" &&
      q.stem.includes("11:4")
    ) witness = true;
  }

  const d = diversity[id];
  if (d.states.size !== 16) failures.push(`${id}: expected 16 states, found ${d.states.size}`);
  if (d.shapes.size !== 8) failures.push(`${id}: expected 8 stem shapes, found ${d.shapes.size}`);
  if (d.skeletons.size !== 8) failures.push(`${id}: expected 8 distinct normalized stem skeletons, found ${d.skeletons.size}`);
}

if (positions.some((n) => n < 110)) failures.push(`answer positions too thin: ${positions.join("/")}`);
if (!witness) failures.push("direct chain witness missing");

const report = {
  status: failures.length
    ? "FAIL_MAL_CP006_WAVE02_FINAL_V3"
    : "PASS_MAL_CP006_WAVE02_FINAL_V3",
  authorityId: MAL_CP006_WAVE02_FINAL_AUTHORITY_V3_ID,
  generated,
  passed,
  answerPositions: positions,
  directChainWitness: witness,
  prototypes: Object.fromEntries(
    Object.entries(diversity).map(([id, d]) => [
      id,
      {
        states: d.states.size,
        stemShapes: d.shapes.size,
        normalizedStemSkeletons: d.skeletons.size,
      },
    ]),
  ),
  editorialFixes: [
    "removed incorrect litres-of-pure-milk are-kept rewrite",
    "expanded each Wave02 family from 4 thin paraphrases to 8 structurally distinct stems",
    "added normalized-stem-skeleton diversity regression",
  ],
  alligation: "NOT_A_CP006_CORE_SOLVE_MODE",
  permanentQls: 0,
  permanentSolveModes: 0,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
