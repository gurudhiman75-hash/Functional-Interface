import { NUM_CP008_WAVE03_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave03 } from "./runtime.ts";
import { generateNumCp008Wave03Reviewed } from "./runtime-review-final.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let packages = 0;
let mathematicalParityChecks = 0;
let answerBindingChecks = 0;
let reviewSurfaceChecks = 0;
let validResidueDistractorChecks = 0;

for (const prototypeId of NUM_CP008_WAVE03_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const source = generateNumCp008Wave03(prototypeId, seed);
    const reviewed = generateNumCp008Wave03Reviewed(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert(reviewed.seed === source.seed && reviewed.seed === seed, `${label}: seed drift`);
    assert(reviewed.temporaryPrototypeId === source.temporaryPrototypeId, `${label}: prototype drift`);
    assert(reviewed.canonicalAnswer === source.canonicalAnswer, `${label}: canonical answer drift`);
    assert(reviewed.verifierAnswer === source.verifierAnswer, `${label}: verifier answer drift`);
    assert(reviewed.correctIndex === source.correctIndex, `${label}: correct-index drift`);
    assert(reviewed.difficulty === source.difficulty, `${label}: difficulty drift`);
    assert(reviewed.mathematicalFingerprint === source.mathematicalFingerprint, `${label}: fingerprint drift`);
    assert(JSON.stringify(reviewed.hiddenState) === JSON.stringify(source.hiddenState), `${label}: hidden-state drift`);
    assert(JSON.stringify(reviewed.lifecycle) === JSON.stringify(source.lifecycle), `${label}: lifecycle drift`);
    assert(reviewed.stem === source.stem, `${label}: stem drift`);
    mathematicalParityChecks += 1;

    assert(reviewed.options.length === 4, `${label}: option count`);
    assert(new Set(reviewed.options.map((option) => option.value)).size === 4, `${label}: duplicate options`);
    assert(reviewed.options.filter((option) => option.isCorrect).length === 1, `${label}: keyed-answer count`);
    assert(reviewed.options[reviewed.correctIndex]?.isCorrect === true, `${label}: reviewed correct-index binding`);
    assert(reviewed.options[reviewed.correctIndex]?.value === reviewed.canonicalAnswer, `${label}: reviewed answer binding`);
    assert(reviewed.explanation.finalAnswer === reviewed.canonicalAnswer, `${label}: explanation answer drift`);
    answerBindingChecks += 1;

    if (prototypeId === "NUM-CP008-PROT-017") {
      const modulus = Number((reviewed.hiddenState as Record<string, unknown>).m2);
      for (const option of reviewed.options) {
        const value = Number(option.value);
        assert(Number.isSafeInteger(value) && value >= 0 && value < modulus, `${label}: residue option ${option.value} outside [0, ${modulus - 1}]`);
        validResidueDistractorChecks += 1;
      }
    }

    const steps = reviewed.explanation.steps.join(" ");
    if (prototypeId === "NUM-CP008-PROT-018") {
      assert(reviewed.explanation.steps.length === 3, `${label}: nested-power review step count`);
      assert(/Useful powers modulo/.test(steps) && /hence y/.test(steps), `${label}: nested-power calculation hidden`);
    }
    if (prototypeId === "NUM-CP008-PROT-020") {
      assert(/write x =/.test(steps) && /least non-negative k/.test(steps) && /Therefore x =/.test(steps), `${label}: CRT merge calculation hidden`);
    }
    if (prototypeId === "NUM-CP008-PROT-022") {
      assert(/possible values are \{/.test(steps) && /Using both statements leaves \{/.test(steps), `${label}: Data Sufficiency candidate evidence hidden`);
    }
    if (prototypeId === "NUM-CP008-PROT-023") {
      assert(/Residues after digits/.test(steps), `${label}: recurrence trail hidden`);
    }
    if (prototypeId === "NUM-CP008-PROT-024") {
      assert(/first two congruences combine/.test(steps) && /Combining that class/.test(steps) && /count =/.test(steps), `${label}: triple-CRT projection work hidden`);
    }
    assert(!/generator|prototype|fingerprint|hidden state|authority package/i.test([reviewed.explanation.coreConcept, reviewed.explanation.strategy, steps].join(" ")), `${label}: implementation vocabulary leak`);
    reviewSurfaceChecks += 1;
    packages += 1;
  }
}

assert(packages === 960, `Expected 960 reviewed packages, got ${packages}`);
assert(validResidueDistractorChecks === 480, `Expected 480 residue option checks, got ${validResidueDistractorChecks}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE03_REVIEW_FINAL",
  packages,
  mathematicalParityChecks,
  answerBindingChecks,
  reviewSurfaceChecks,
  validResidueDistractorChecks,
  learnerBlockers: 0,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-166",
}, null, 2));
