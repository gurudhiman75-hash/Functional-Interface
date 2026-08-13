import { generateMalCp006Wave02FinalLearnerAuthority, MAL_CP006_WAVE02_FINAL_LEARNER_AUTHORITY_ID } from "./foundation/cp006-wave02-final-learner-authority";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS, MAL_CP006_WAVE02_RUNTIME_ID } from "./foundation/cp006-source-fixtures-wave02";

const failures: string[] = [];
const positions = [0, 0, 0, 0];
const stats: Record<string, { states: Set<string>; shapes: Set<number> }> = {};
let generated = 0, deterministic = 0, surface = 0, options = 0, lifecycle = 0;

for (const id of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  const s = { states: new Set<string>(), shapes: new Set<number>() };
  stats[id] = s;
  const label = id.includes("INVERSE") ? "inverse" : "chain";
  for (let i = 0; i < 200; i += 1) {
    const seed = `mal-cp006-wave02-final:${label}:${i}`;
    const q = generateMalCp006Wave02FinalLearnerAuthority(id, seed);
    const again = generateMalCp006Wave02FinalLearnerAuthority(id, seed);
    generated++; s.states.add(q.stateKey); s.shapes.add(q.stemShape);
    if (JSON.stringify(q) === JSON.stringify(again)) deterministic++; else failures.push(`${seed}: deterministic`);
    const text = [q.stem, ...q.explanation, q.commonMistake].join(" ");
    if (q.validation.ok && q.stem.endsWith("?") && q.explanation.length === 4 && !text.includes("→") && !text.includes("x²")) surface++; else failures.push(`${seed}: surface ${q.validation.errors.join("|")}`);
    if (q.options.length === 4 && new Set(q.options).size === 4 && q.options[q.correctIndex] === q.answer) options++; else failures.push(`${seed}: options`);
    if (q.permanentQlId === null && q.permanentSolveModeId === null && !q.active && !q.publiclyPublishable && !q.questionStudioDiscoverable && !q.questionBankWritable && !q.testEligible) lifecycle++; else failures.push(`${seed}: lifecycle`);
    positions[q.correctIndex]++;
  }
  if (s.states.size !== 16) failures.push(`${id}: states ${s.states.size}`);
  if (s.shapes.size !== 4) failures.push(`${id}: shapes ${s.shapes.size}`);
}
if (positions.some((n) => n < 70)) failures.push(`positions ${positions.join("/")}`);

const report = {
  status: failures.length ? "FAIL_MAL_CP006_WAVE02_FINAL_LEARNER_AUTHORITY" : "PASS_MAL_CP006_WAVE02_FINAL_LEARNER_AUTHORITY",
  authorityId: MAL_CP006_WAVE02_FINAL_LEARNER_AUTHORITY_ID,
  runtimeId: MAL_CP006_WAVE02_RUNTIME_ID,
  generated, deterministic, surface, options, lifecycle,
  answerPositions: positions,
  prototypes: Object.fromEntries(Object.entries(stats).map(([id, s]) => [id, { states: s.states.size, stemShapes: s.shapes.size }])),
  learnerPolicy: ["calculation-first numeric verification", "physically plausible inverse options", "current-source composition explicit", "no core alligation mode"],
  mergeSplit: { inverse: "RETAIN_FOR_PRODUCT_REVIEW_AS_DISTINCT_INVERSE_PROJECTION", chain: "RETAIN_FOR_PRODUCT_REVIEW_AS_DISTINCT_CHAIN_PROJECTION" },
  permanentQls: 0,
  permanentSolveModes: 0,
  failures,
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
