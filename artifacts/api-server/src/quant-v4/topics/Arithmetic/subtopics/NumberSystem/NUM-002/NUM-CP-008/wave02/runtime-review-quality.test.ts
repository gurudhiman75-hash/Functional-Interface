import { generateNumCp008Wave02 } from "./runtime.ts";
import { generateNumCp008Wave02ReviewFinal } from "./runtime-review-final.ts";
import { NUM_CP008_WAVE02_PROTOTYPE_IDS } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let audited = 0;
let parityChecks = 0;
let explanationChecks = 0;

for (const prototypeId of NUM_CP008_WAVE02_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 60; seed += 1) {
    const source = generateNumCp008Wave02(prototypeId, seed);
    const review = generateNumCp008Wave02ReviewFinal(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert(review.stem === source.stem, `${label}: stem changed`);
    assert(JSON.stringify(review.options) === JSON.stringify(source.options), `${label}: options changed`);
    assert(review.correctIndex === source.correctIndex, `${label}: correct index changed`);
    assert(review.canonicalAnswer === source.canonicalAnswer, `${label}: canonical answer changed`);
    assert(review.verifierAnswer === source.verifierAnswer, `${label}: verifier answer changed`);
    assert(JSON.stringify(review.hiddenState) === JSON.stringify(source.hiddenState), `${label}: hidden state changed`);
    assert(review.mathematicalFingerprint === source.mathematicalFingerprint, `${label}: fingerprint changed`);
    assert(JSON.stringify(review.lifecycle) === JSON.stringify(source.lifecycle), `${label}: lifecycle changed`);
    parityChecks += 1;

    const steps = review.explanation.steps;
    assert(steps.length >= 2, `${label}: too few worked steps`);
    assert(steps.join(" ").length >= 45, `${label}: worked explanation too shallow`);

    if (prototypeId === "NUM-CP008-PROT-011") {
      assert(steps.some((step) => step.startsWith("Let x =")), `${label}: CRT substitution missing`);
      assert(steps.some((step) => step.includes("After dividing by gcd")), `${label}: gcd reduction missing`);
      assert(steps.some((step) => step.includes("complete set is")), `${label}: bounded complete set missing`);
    }
    if (prototypeId === "NUM-CP008-PROT-012") {
      assert(steps.some((step) => step.includes("so") && step.includes("is the inverse")), `${label}: inverse witness missing`);
      assert(steps.some((step) => step.startsWith("Multiply ax")), `${label}: coefficient isolation missing`);
    }
    if (prototypeId === "NUM-CP008-PROT-014") {
      assert(steps.some((step) => step.startsWith("Power residues")), `${label}: power-residue sequence missing`);
      assert(steps.some((step) => step.startsWith("Running sums")), `${label}: running modular sums missing`);
    }
    if (prototypeId === "NUM-CP008-PROT-015") {
      assert(steps.some((step) => step.startsWith("First combine")), `${label}: first CRT merge missing`);
      assert(steps.some((step) => step.startsWith("Now combine")), `${label}: second CRT merge missing`);
      assert(steps.some((step) => step.startsWith("Hence x")), `${label}: final CRT reconstruction missing`);
    }

    explanationChecks += 1;
    audited += 1;
  }
}

assert(audited === 480, `Expected 480 review-quality cases, got ${audited}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE02_REVIEW_QUALITY",
  audited,
  parityChecks,
  explanationChecks,
  mathematicalChanges: 0,
  lifecycleChanges: 0,
}, null, 2));
