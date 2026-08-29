import { NUM_CP008_WAVE02_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave02 } from "./runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const INTERNAL = /(?:NUM-CP008|PROT-0|temporaryPrototypeId|mathematicalFingerprint|sourceAncestry|prototypeAncestry)/iu;
const OWNERSHIP_LEAK = /(?:unit digit|last two digits|last three digits|terminal digit|greatest divisor leaving same remainder|quotient and remainder reconstruction)/iu;
const semantics = new Set<string>();
const representations = new Set<string>();
const stems = new Set<string>();
let packages = 0;
let internalLeaks = 0;
let ownershipLeaks = 0;
let lifecycleViolations = 0;
let presentationViolations = 0;
let duplicateStems = 0;

for (const prototypeId of NUM_CP008_WAVE02_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 60; seed += 1) {
    const q = generateNumCp008Wave02(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;
    const learner = [q.stem, ...q.options.map((option) => option.value), q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps, q.explanation.finalAnswer].join("\n");

    if (stems.has(q.stem)) duplicateStems += 1;
    else stems.add(q.stem);
    if (INTERNAL.test(learner)) internalLeaks += 1;
    if (OWNERSHIP_LEAK.test(q.stem)) ownershipLeaks += 1;
    if (q.lifecycle.permanentQlId !== null || q.lifecycle.active || q.lifecycle.questionStudioDiscoverable || q.lifecycle.questionBankWritable || q.lifecycle.testEligible || q.lifecycle.publiclyPublishable) lifecycleViolations += 1;
    if (q.stem.length < 20 || q.stem.length > 320 || q.explanation.coreConcept.length < 20 || q.explanation.strategy.length < 20 || q.explanation.steps.join(" ").length < 25 || q.explanation.steps.join(" ").length > 900) presentationViolations += 1;

    assert(q.options.length === 4, `${label}: option count`);
    assert(new Set(q.options.map((option) => option.value)).size === 4, `${label}: duplicate options`);
    assert(q.options[q.correctIndex]?.value === q.canonicalAnswer, `${label}: answer binding`);
    assert(q.canonicalAnswer === q.verifierAnswer, `${label}: verifier mismatch`);
    semantics.add(q.answerSemantic);
    representations.add(q.representation);
    packages += 1;
  }
}

assert(packages === 480, `Expected 480 packages, got ${packages}`);
assert(internalLeaks === 0, `Internal token leaks ${internalLeaks}`);
assert(ownershipLeaks === 0, `Ownership leaks ${ownershipLeaks}`);
assert(lifecycleViolations === 0, `Lifecycle violations ${lifecycleViolations}`);
assert(presentationViolations === 0, `Presentation violations ${presentationViolations}`);
assert(semantics.has("COUNT"), "Count semantic missing");
assert(semantics.has("COMPLETE_SET"), "Complete-set semantic missing");
assert(semantics.has("MISSING_COEFFICIENT"), "Missing-coefficient semantic missing");
assert(semantics.has("MISSING_MODULUS"), "Missing-modulus semantic missing");
assert(semantics.has("REMAINDER"), "Remainder semantic missing");
assert(semantics.has("LEAST_POSITIVE_SOLUTION"), "Least-positive semantic missing");
assert(semantics.has("SOLUTION_CLASS"), "Solution-class semantic missing");
assert(representations.has("BOUNDED_CONGRUENCE"), "Bounded representation missing");
assert(representations.has("CANDIDATE_CONGRUENCE"), "Candidate representation missing");
assert(representations.has("STRUCTURED_EXPRESSION"), "Structured-expression representation missing");
assert(representations.has("THREE_CONGRUENCE_SYSTEM"), "Three-congruence representation missing");

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE02_STRUCTURAL_AUDIT",
  packages,
  exactStems: stems.size,
  duplicateStems,
  answerSemantics: [...semantics].sort(),
  representations: [...representations].sort(),
  internalLeaks,
  ownershipLeaks,
  lifecycleViolations,
  presentationViolations,
  permanentQlCount: 0,
}, null, 2));
