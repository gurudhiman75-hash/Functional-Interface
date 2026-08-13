import { generateMalCp006Wave02LearnerAuthorityV2, MAL_CP006_WAVE02_LEARNER_AUTHORITY_V2_ID } from "./foundation/cp006-wave02-learner-authority-v2";
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
    const seed = `mal-cp006-wave02-v2:${label}:${i}`;
    const q = generateMalCp006Wave02LearnerAuthorityV2(id, seed);
    const again = generateMalCp006Wave02LearnerAuthorityV2(id, seed);
    generated++; s.states.add(q.stateKey); s.shapes.add(q.stemShape);
    if (JSON.stringify(q) === JSON.stringify(again)) deterministic++; else failures.push(`${seed}: nondeterministic`);
    const text = [q.stem, ...q.explanation, q.commonMistake].join(" ");
    if (q.validation.ok && q.stem.endsWith("?") && q.explanation.length === 4 && !text.includes("→") && !text.includes("litres returned from B contains")) surface++; else failures.push(`${seed}: surface ${q.validation.errors.join("|")}`);
    if (q.options.length === 4 && new Set(q.options).size === 4 && q.options[q.correctIndex] === q.answer) options++; else failures.push(`${seed}: options`);
    if (id.includes("INVERSE")) {
      const volume = Number(q.stateKey.split(":")[0]);
      if (q.options.some((o) => Number(o.split(" ")[0]) >= volume)) failures.push(`${seed}: impossible distractor`);
    }
    if (q.permanentQlId === null && q.permanentSolveModeId === null && !q.active && !q.publiclyPublishable && !q.questionStudioDiscoverable && !q.questionBankWritable && !q.testEligible) lifecycle++; else failures.push(`${seed}: lifecycle`);
    positions[q.correctIndex]++;
  }
  if (s.states.size !== 16) failures.push(`${id}: states ${s.states.size}`);
  if (s.shapes.size !== 4) failures.push(`${id}: shapes ${s.shapes.size}`);
}
if (positions.some((n) => n < 70)) failures.push(`positions ${positions.join("/")}`);

const report = {
  status: failures.length ? "FAIL_MAL_CP006_WAVE02_LEARNER_AUTHORITY_V2" : "PASS_MAL_CP006_WAVE02_LEARNER_AUTHORITY_V2",
  authorityId: MAL_CP006_WAVE02_LEARNER_AUTHORITY_V2_ID,
  runtimeId: MAL_CP006_WAVE02_RUNTIME_ID,
  generated, deterministic, surface, options, lifecycle,
  answerPositions: positions,
  prototypes: Object.fromEntries(Object.entries(stats).map(([id, s]) => [id, { states: s.states.size, stemShapes: s.shapes.size }])),
  manualFixes: ["inverse plural grammar", "physically impossible inverse distractors", "explicit inverse algebra"],
  mergeSplit: { inverse: "RETAIN_FOR_PRODUCT_REVIEW_AS_DISTINCT_INVERSE_PROJECTION", chain: "RETAIN_FOR_PRODUCT_REVIEW_AS_DISTINCT_CHAIN_PROJECTION" },
  alligation: "NOT_A_CP006_CORE_SOLVE_MODE",
  permanentQls: 0,
  permanentSolveModes: 0,
  failures,
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
