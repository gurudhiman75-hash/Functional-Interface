import { NUM_CP008_WAVE03_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave03 } from "./runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let audited = 0;
let lifecycleChecks = 0;
let ownershipChecks = 0;
let learnerSurfaceChecks = 0;
const exactStems = new Set<string>();
const exactExplanations = new Set<string>();

for (const prototypeId of NUM_CP008_WAVE03_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 60; seed += 1) {
    const q = generateNumCp008Wave03(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;
    const explanationText = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps, q.explanation.finalAnswer].join(" ");
    const learnerText = `${q.stem} ${q.options.map((option) => option.value).join(" ")} ${explanationText}`;

    assert(!/NUM-CP008|PROT-0|temporaryPrototypeId|hiddenState|mathematicalFingerprint/i.test(learnerText), `${label}: internal identity leak`);
    assert(!/Question Studio|Question Bank|publiclyPublishable|testEligible/i.test(learnerText), `${label}: lifecycle/meta leak`);
    assert(!/unit digit|last two digits|last three digits/i.test(learnerText), `${label}: CP009 terminal-digit ownership leak`);
    assert(!/dividend|quotient|division algorithm/i.test(learnerText), `${label}: CP007 division-lemma ownership leak`);
    ownershipChecks += 1;

    assert(q.stem.length >= 35 && q.stem.length <= 700, `${label}: implausible stem length ${q.stem.length}`);
    assert(q.explanation.coreConcept.length >= 25, `${label}: core concept too short`);
    assert(q.explanation.strategy.length >= 25, `${label}: strategy too short`);
    assert(q.explanation.steps.every((step) => step.trim().length >= 12), `${label}: shallow working step`);
    assert(!/undefined|null|NaN|Infinity/.test(learnerText), `${label}: malformed generated text`);
    learnerSurfaceChecks += 1;

    const life = q.lifecycle;
    assert(life.permanentQlId === null, `${label}: lifecycle permanent QL`);
    assert(life.questionBankStatus === "NOT_STORED", `${label}: question bank status`);
    assert(life.testEligibility === "INELIGIBLE", `${label}: test eligibility status`);
    assert(!life.active && !life.questionStudioDiscoverable && !life.questionBankWritable && !life.testEligible && !life.publiclyPublishable, `${label}: delivery lifecycle opened`);
    lifecycleChecks += 1;

    exactStems.add(q.stem);
    exactExplanations.add(explanationText);
    audited += 1;
  }
}

assert(audited === 480, `Expected 480 audit packages, got ${audited}`);
assert(exactStems.size >= 430, `Insufficient stem diversity: ${exactStems.size}`);
assert(exactExplanations.size >= 380, `Insufficient explanation diversity: ${exactExplanations.size}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE03_STRUCTURAL_AUDIT",
  audited,
  ownershipChecks,
  learnerSurfaceChecks,
  lifecycleChecks,
  exactStems: exactStems.size,
  exactExplanations: exactExplanations.size,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-166",
}, null, 2));
