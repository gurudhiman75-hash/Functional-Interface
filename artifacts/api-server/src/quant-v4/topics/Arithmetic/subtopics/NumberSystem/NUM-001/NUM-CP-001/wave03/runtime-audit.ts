import assert from "node:assert/strict";
import { generateNumCp001Wave03, NUM_CP001_WAVE03_PROTOTYPE_IDS } from "./runtime";

const SEEDS = 60;
const stems = new Map<string, string>();
const explanations = new Set<string>();
let generated = 0;
let crossPrototypeStemCollisions = 0;
let internalIdLeaks = 0;
let lifecycleViolations = 0;
let optionViolations = 0;
let verifierViolations = 0;

for (const prototypeId of NUM_CP001_WAVE03_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= SEEDS; seed += 1) {
    const pkg = generateNumCp001Wave03(prototypeId, seed);
    generated += 1;

    const normalizedStem = pkg.stem
      .toLowerCase()
      .replace(/-?\d+(?:\/\d+)?/g, "#")
      .replace(/√#/g, "√#")
      .replace(/\s+/g, " ")
      .trim();
    const owner = stems.get(normalizedStem);
    if (owner && owner !== prototypeId) crossPrototypeStemCollisions += 1;
    else stems.set(normalizedStem, prototypeId);

    const explanationText = [
      ...pkg.explanation.coreConcept,
      ...pkg.explanation.givenDataAndStrategy,
      ...pkg.explanation.stepByStep,
      ...pkg.explanation.examSpeedMethod,
      ...pkg.explanation.commonTraps,
      pkg.explanation.finalAnswer,
    ].join(" ");
    explanations.add(explanationText);

    const learnerText = `${pkg.stem}\n${pkg.options.map((x) => x.value).join("\n")}\n${explanationText}`;
    if (/NUM-CP001|PROT-\d+|[A-Z]{2,}_[A-Z0-9_]+/.test(learnerText)) internalIdLeaks += 1;

    if (
      pkg.lifecycle.active ||
      pkg.lifecycle.questionStudioDiscoverable ||
      pkg.lifecycle.questionBankWritable ||
      pkg.lifecycle.testEligible ||
      pkg.lifecycle.publiclyPublishable ||
      pkg.permanentQlId !== null
    ) lifecycleViolations += 1;

    if (
      pkg.options.length !== 4 ||
      new Set(pkg.options.map((x) => x.value)).size !== 4 ||
      pkg.options.filter((x) => x.isCorrect).length !== 1 ||
      !pkg.options[pkg.correctIndex]?.isCorrect
    ) optionViolations += 1;

    if (pkg.canonicalAnswer !== pkg.verifierAnswer) verifierViolations += 1;
  }
}

assert.equal(generated, 480);
assert.equal(crossPrototypeStemCollisions, 0);
assert.equal(internalIdLeaks, 0);
assert.equal(lifecycleViolations, 0);
assert.equal(optionViolations, 0);
assert.equal(verifierViolations, 0);
assert.ok(explanations.size >= 100, `explanation diversity too low: ${explanations.size}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE03_STRUCTURAL_AUDIT",
  generated,
  uniqueNormalizedStems: stems.size,
  distinctExplanations: explanations.size,
  crossPrototypeStemCollisions,
  internalIdLeaks,
  lifecycleViolations,
  optionViolations,
  verifierViolations,
}, null, 2));
