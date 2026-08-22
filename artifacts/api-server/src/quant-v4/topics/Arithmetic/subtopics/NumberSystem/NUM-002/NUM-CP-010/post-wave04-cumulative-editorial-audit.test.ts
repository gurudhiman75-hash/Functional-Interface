import assert from "node:assert/strict";

import { generateNumCp010Wave01 } from "./wave01/runtime.ts";
import { NUM_CP010_WAVE01_PROTOTYPE_IDS } from "./wave01/types.ts";
import { generateNumCp010Wave02 } from "./wave02/runtime.ts";
import { NUM_CP010_WAVE02_PROTOTYPE_IDS } from "./wave02/types.ts";
import { generateNumCp010Wave03 } from "./wave03/runtime.ts";
import { NUM_CP010_WAVE03_PROTOTYPE_IDS } from "./wave03/types.ts";
import { generateNumCp010Wave04 } from "./wave04/runtime.ts";
import { NUM_CP010_WAVE04_PROTOTYPE_IDS } from "./wave04/types.ts";

type AuditPackage = Readonly<{
  temporaryPrototypeId: string;
  stem: string;
  options: readonly Readonly<{ value: string; isCorrect: boolean }>[];
  correctIndex: number;
  canonicalAnswer: string;
  verifierAnswer: string;
  explanation: Readonly<{
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
    finalAnswer: string;
  }>;
  lifecycle: Readonly<{
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}>;

const entries: Array<Readonly<{ prototypeId: string; generate: (seed: number) => AuditPackage }>> = [
  ...NUM_CP010_WAVE01_PROTOTYPE_IDS.map((prototypeId) => ({ prototypeId, generate: (seed: number) => generateNumCp010Wave01(prototypeId, seed) })),
  ...NUM_CP010_WAVE02_PROTOTYPE_IDS.map((prototypeId) => ({ prototypeId, generate: (seed: number) => generateNumCp010Wave02(prototypeId, seed) })),
  ...NUM_CP010_WAVE03_PROTOTYPE_IDS.map((prototypeId) => ({ prototypeId, generate: (seed: number) => generateNumCp010Wave03(prototypeId, seed) })),
  ...NUM_CP010_WAVE04_PROTOTYPE_IDS.map((prototypeId) => ({ prototypeId, generate: (seed: number) => generateNumCp010Wave04(prototypeId, seed) })),
];

function words(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

let packages = 0;
let explanationChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let minExplanationWords = Number.POSITIVE_INFINITY;
let maxExplanationWords = 0;
let maxStemWords = 0;
const reachedPrototypes = new Set<string>();

for (const entry of entries) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const q = entry.generate(seed);
    const label = `${entry.prototypeId}/${seed}`;

    assert.equal(q.temporaryPrototypeId, entry.prototypeId, `${label}: prototype identity drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation final-answer drift`);

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate option values`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected exactly one correct option`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct-index binding drift`);
    optionChecks += 1;

    const explanationText = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    const explanationWords = words(explanationText);
    const stemWords = words(q.stem);
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation needs 2..4 worked steps`);
    assert.ok(explanationWords >= 24, `${label}: explanation is too thin (${explanationWords} words)`);
    assert.ok(explanationWords <= 135, `${label}: explanation is too long (${explanationWords} words)`);
    assert.ok(stemWords <= 65, `${label}: stem is too long (${stemWords} words)`);
    assert.doesNotMatch(
      `${q.stem} ${explanationText}`,
      /prototype|generator|hidden state|fingerprint|source ancestry|authority package|answer semantic|lifecycle gate/iu,
      `${label}: implementation/governance vocabulary leaked to learner surface`,
    );
    minExplanationWords = Math.min(minExplanationWords, explanationWords);
    maxExplanationWords = Math.max(maxExplanationWords, explanationWords);
    maxStemWords = Math.max(maxStemWords, stemWords);
    explanationChecks += 1;

    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    assert.ok(!("permanentQlId" in q), `${label}: permanent QL allocated before approval`);
    lifecycleChecks += 1;

    reachedPrototypes.add(entry.prototypeId);
    packages += 1;
  }
}

assert.equal(entries.length, 26, "Expected 26 temporary CP010 prototypes");
assert.equal(reachedPrototypes.size, 26, "Expected all 26 CP010 prototypes to be reached");
assert.equal(packages, 26 * 120, "Expected 3,120 cumulative CP010 packages");
assert.equal(explanationChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(lifecycleChecks, packages);

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_CUMULATIVE_EDITORIAL_AUDIT",
  prototypes: reachedPrototypes.size,
  packages,
  explanationChecks,
  optionChecks,
  lifecycleChecks,
  minExplanationWords,
  maxExplanationWords,
  maxStemWords,
  permanentQlAllocations: 0,
}, null, 2));
