import { generateNumCp008Wave01 } from "./runtime.ts";
import { generateNumCp008Wave01ReviewFinal } from "./runtime-review-final.ts";
import { NUM_CP008_WAVE01_PROTOTYPE_IDS } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let audited = 0;
let mathematicalParityChecks = 0;
let explanationChecks = 0;

for (const prototypeId of NUM_CP008_WAVE01_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 60; seed += 1) {
    const source = generateNumCp008Wave01(prototypeId, seed);
    const review = generateNumCp008Wave01ReviewFinal(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert(review.stem === source.stem, `${label}: stem changed in review overlay`);
    assert(JSON.stringify(review.options) === JSON.stringify(source.options), `${label}: options changed in review overlay`);
    assert(review.correctIndex === source.correctIndex, `${label}: correct index changed`);
    assert(review.canonicalAnswer === source.canonicalAnswer, `${label}: canonical answer changed`);
    assert(review.verifierAnswer === source.verifierAnswer, `${label}: verifier answer changed`);
    assert(JSON.stringify(review.hiddenState) === JSON.stringify(source.hiddenState), `${label}: hidden state changed`);
    assert(review.mathematicalFingerprint === source.mathematicalFingerprint, `${label}: fingerprint changed`);
    assert(JSON.stringify(review.lifecycle) === JSON.stringify(source.lifecycle), `${label}: lifecycle changed`);
    mathematicalParityChecks += 1;

    const steps = review.explanation.steps;
    assert(steps.length >= 2, `${label}: too few worked steps`);
    assert(!steps.some((step) => /Repeated modular squaring gives|\^\(-1\)/.test(step)), `${label}: opaque legacy working leaked`);

    if (prototypeId === "NUM-CP008-PROT-003") {
      const exponent = Number((review.hiddenState as Record<string, unknown>).exponent);
      if (exponent === 0) {
        assert(steps.some((step) => step.includes("exponent is 0")), `${label}: exponent-zero reasoning missing`);
      } else {
        assert(steps.some((step) => step.startsWith("Successive squares:")), `${label}: repeated-squaring ladder missing`);
        assert(steps.some((step) => step.includes(`${exponent} = `)), `${label}: exponent decomposition missing`);
      }
    }
    if (prototypeId === "NUM-CP008-PROT-004") {
      assert(steps.some((step) => step.includes("so the inverse of")), `${label}: inverse witness missing`);
      assert(steps.some((step) => step.startsWith("Hence x ≡")), `${label}: solved residue calculation missing`);
    }
    if (prototypeId === "NUM-CP008-PROT-005") {
      assert(steps.some((step) => step.startsWith("Divide the congruence by")), `${label}: gcd reduction missing`);
      assert(steps.some((step) => step.includes("solution classes modulo")), `${label}: residue classes not shown`);
    }
    if (prototypeId === "NUM-CP008-PROT-007") {
      assert(steps.some((step) => step.startsWith("Let x =")), `${label}: CRT substitution missing`);
      assert(steps.some((step) => step.includes("so k ≡")), `${label}: reduced congruence solution missing`);
      assert(steps.some((step) => step.startsWith("Therefore x =")), `${label}: reconstructed CRT solution missing`);
    }

    explanationChecks += 1;
    audited += 1;
  }
}

const negativeZero = generateNumCp008Wave01ReviewFinal("NUM-CP008-PROT-001", 10);
const negativeZeroState = negativeZero.hiddenState as Record<string, unknown>;
assert(Number(negativeZeroState.raw) < 0, "Review seed 10 must exercise a negative raw residue");
assert(Number(negativeZeroState.residue) === 0, "Review seed 10 must exercise residue zero");

const exponentZero = generateNumCp008Wave01ReviewFinal("NUM-CP008-PROT-003", 17);
assert(Number((exponentZero.hiddenState as Record<string, unknown>).exponent) === 0, "Review seed 17 must exercise exponent zero");

const nonCoprimeCrt = generateNumCp008Wave01ReviewFinal("NUM-CP008-PROT-007", 10);
assert(Number((nonCoprimeCrt.hiddenState as Record<string, unknown>).gcd) > 1, "Review seed 10 must exercise compatible non-coprime CRT");

assert(audited === 480, `Expected 480 review-quality cases, got ${audited}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE01_REVIEW_QUALITY",
  audited,
  mathematicalParityChecks,
  explanationChecks,
  reviewEdgeProof: {
    negativeResidueAndZero: true,
    exponentZero: true,
    compatibleNonCoprimeCrt: true,
  },
  permanentQlCount: 0,
  lifecycleChanges: 0,
}, null, 2));
