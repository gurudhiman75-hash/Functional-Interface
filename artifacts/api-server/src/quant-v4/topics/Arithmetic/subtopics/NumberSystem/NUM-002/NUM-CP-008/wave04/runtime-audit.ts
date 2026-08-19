import { NUM_CP008_WAVE04_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave04 } from "./runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let audited = 0;
let ownershipChecks = 0;
let learnerChecks = 0;
let lifecycleChecks = 0;
const stems = new Set<string>();
const explanations = new Set<string>();

for (const prototypeId of NUM_CP008_WAVE04_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 60; seed += 1) {
    const q = generateNumCp008Wave04(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;
    const explanation = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps, q.explanation.finalAnswer].join(" ");
    const learner = `${q.stem} ${q.options.map((option) => option.value).join(" ")} ${explanation}`;

    assert(!/NUM-CP008|PROT-0|hiddenState|mathematicalFingerprint|Question Studio|Question Bank/i.test(learner), `${label}: internal/meta leak`);
    assert(!/unit digit|last two digits|last three digits/i.test(learner), `${label}: CP009 terminal-digit ownership leak`);
    assert(!/dividend|quotient|division algorithm/i.test(learner), `${label}: CP007 division-state ownership leak`);
    ownershipChecks += 1;

    assert(q.stem.length >= 35 && q.stem.length <= 700, `${label}: stem length ${q.stem.length}`);
    assert(q.explanation.coreConcept.length >= 30, `${label}: core concept too short`);
    assert(q.explanation.strategy.length >= 25, `${label}: strategy too short`);
    assert(q.explanation.steps.every((step) => step.trim().length >= 15), `${label}: shallow step`);
    assert(!/undefined|null|NaN|Infinity/.test(learner), `${label}: malformed learner text`);
    assert(!/obviously|simply use CRT|by inspection/i.test(explanation), `${label}: opaque explanation`);
    learnerChecks += 1;

    const life = q.lifecycle;
    assert(life.permanentQlId === null && !life.active && !life.questionStudioDiscoverable && !life.questionBankWritable && !life.testEligible && !life.publiclyPublishable, `${label}: lifecycle opened`);
    lifecycleChecks += 1;

    stems.add(q.stem);
    explanations.add(explanation);
    audited += 1;
  }
}

assert(audited === 240, `Expected 240 audit packages, got ${audited}`);
assert(stems.size >= 180, `Insufficient stem diversity ${stems.size}`);
assert(explanations.size >= 160, `Insufficient explanation diversity ${explanations.size}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE04_STRUCTURAL_REVIEW_AUDIT",
  audited,
  ownershipChecks,
  learnerChecks,
  lifecycleChecks,
  exactStems: stems.size,
  exactExplanations: explanations.size,
  learnerBlockers: 0,
}, null, 2));
