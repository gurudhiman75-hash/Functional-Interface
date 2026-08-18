import { NUM_CP008_WAVE01_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave01 } from "./runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const INTERNAL_TOKEN = /(?:NUM-CP008|PROT-00|temporaryPrototypeId|mathematicalFingerprint|sourceAncestry|prototypeAncestry)/i;
const OWNERSHIP_LEAK = /(?:unit digit|last two digits|last three digits|terminal digit|find the quotient|find the divisor from dividend|greatest divisor leaving same remainder)/i;

const semantics = new Set<string>();
const representations = new Set<string>();
const exactStems = new Set<string>();
let packages = 0;
let duplicateStems = 0;
let internalLeaks = 0;
let ownershipLeaks = 0;
let lifecycleViolations = 0;
let explanationViolations = 0;

for (const prototypeId of NUM_CP008_WAVE01_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 60; seed += 1) {
    const question = generateNumCp008Wave01(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;
    const learner = [
      question.stem,
      ...question.options.map((option) => option.value),
      question.explanation.coreConcept,
      question.explanation.strategy,
      ...question.explanation.steps,
      question.explanation.finalAnswer,
    ].join("\n");

    if (exactStems.has(question.stem)) duplicateStems += 1;
    else exactStems.add(question.stem);

    if (INTERNAL_TOKEN.test(learner)) internalLeaks += 1;
    if (OWNERSHIP_LEAK.test(question.stem)) ownershipLeaks += 1;
    if (
      question.lifecycle.permanentQlId !== null ||
      question.lifecycle.active ||
      question.lifecycle.questionStudioDiscoverable ||
      question.lifecycle.questionBankWritable ||
      question.lifecycle.testEligible ||
      question.lifecycle.publiclyPublishable ||
      question.lifecycle.questionBankStatus !== "NOT_STORED" ||
      question.lifecycle.testEligibility !== "INELIGIBLE"
    ) lifecycleViolations += 1;

    const explanationLength = question.explanation.steps.join(" ").length;
    if (
      question.stem.length < 20 || question.stem.length > 260 ||
      question.explanation.coreConcept.length < 20 || question.explanation.coreConcept.length > 260 ||
      question.explanation.strategy.length < 20 || question.explanation.strategy.length > 260 ||
      explanationLength < 25 || explanationLength > 700
    ) explanationViolations += 1;

    assert(question.options.length === 4, `${label}: option count drift`);
    assert(new Set(question.options.map((option) => option.value)).size === 4, `${label}: duplicate options`);
    assert(question.options[question.correctIndex]?.value === question.canonicalAnswer, `${label}: answer binding drift`);
    assert(question.canonicalAnswer === question.verifierAnswer, `${label}: verifier mismatch`);

    semantics.add(question.answerSemantic);
    representations.add(question.representation);
    packages += 1;
  }
}

assert(packages === 480, `Expected 480 structural packages, got ${packages}`);
assert(internalLeaks === 0, `Internal learner-token leaks: ${internalLeaks}`);
assert(ownershipLeaks === 0, `CP007/CP009 ownership leaks: ${ownershipLeaks}`);
assert(lifecycleViolations === 0, `Lifecycle violations: ${lifecycleViolations}`);
assert(explanationViolations === 0, `Explanation/stem bounds violations: ${explanationViolations}`);
assert(semantics.has("REMAINDER"), "Remainder semantic missing");
assert(semantics.has("RESIDUE_CLASS"), "Residue-class semantic missing");
assert(semantics.has("COUNT"), "Count semantic missing");
assert(semantics.has("SOLUTION_CLASS"), "Solution-class semantic missing");
assert(semantics.has("LEAST_POSITIVE_SOLUTION"), "Least-positive-solution semantic missing");
assert(representations.has("CONGRUENCE_NOTATION"), "Congruence notation missing");
assert(representations.has("CONGRUENCE_SYSTEM"), "Congruence-system representation missing");
assert(representations.has("RESIDUE_CLASS_TABLE"), "Residue-class representation missing");
assert(representations.has("EXPRESSION"), "Expression representation missing");

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE01_STRUCTURAL_AUDIT",
  packages,
  exactStems: exactStems.size,
  duplicateStems,
  answerSemantics: [...semantics].sort(),
  representations: [...representations].sort(),
  internalLeaks,
  ownershipLeaks,
  lifecycleViolations,
  explanationViolations,
  permanentQlCount: 0,
}, null, 2));
