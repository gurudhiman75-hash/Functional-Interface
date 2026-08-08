import { generateNumCp006Wave01Package } from "./runtime.ts";
import { NUM_CP006_WAVE01_PROTOTYPE_REGISTRY } from "./registry.ts";
import { NUM_CP006_WAVE01_PROTOTYPE_IDS } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerPrototype = 60;
const stems = new Set<string>();
const sourceFamilies = new Set<string>();
let generatedAuditPackages = 0;
let optionContractViolations = 0;
let internalIdLeaks = 0;
let lifecycleViolations = 0;
let timeZeroViolations = 0;
let productRelationOverextensionViolations = 0;

for (const prototypeId of NUM_CP006_WAVE01_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
    const question = generateNumCp006Wave01Package(prototypeId, seed);
    generatedAuditPackages += 1;
    stems.add(question.stem);
    question.sourceAncestry.forEach((source) => sourceFamilies.add(source));

    const wrong = question.options.filter((option) => !option.isCorrect);
    if (
      question.options.length !== 4
      || wrong.length !== 3
      || wrong.some((option) => !option.misconceptionId || !option.analysis.trim())
      || question.options[question.correctIndex]?.value !== question.canonicalAnswer
    ) optionContractViolations += 1;

    const learnerFacing = [
      question.stem,
      ...question.options.map((option) => option.value),
      question.explanation.coreConcept,
      question.explanation.givenDataAndStrategy,
      ...question.explanation.stepByStep,
      question.explanation.examSpeedMethod,
      ...question.explanation.commonTraps,
      question.explanation.finalAnswer,
    ].join("\n");

    if (/NUM-(?:CP|QL)|PROT-\d+/u.test(learnerFacing)) internalIdLeaks += 1;
    if (
      question.lifecycle.active
      || question.lifecycle.questionStudioDiscoverable
      || question.lifecycle.questionBankWritable
      || question.lifecycle.testEligible
      || question.lifecycle.publiclyPublishable
    ) lifecycleViolations += 1;

    if (prototypeId === "NUM-CP006-PROT-008") {
      if (!/next operate together|again together|next coincide|first positive/iu.test(learnerFacing)) {
        timeZeroViolations += 1;
      }
    }
    if (prototypeId === "NUM-CP006-PROT-005" && !/two positive integers|two numbers/iu.test(learnerFacing)) {
      productRelationOverextensionViolations += 1;
    }
  }
}

assert(NUM_CP006_WAVE01_PROTOTYPE_REGISTRY.length === 8, "Wave 01 registry count");
assert(new Set(NUM_CP006_WAVE01_PROTOTYPE_REGISTRY.map((entry) => entry.prototypeId)).size === 8, "Wave 01 duplicate prototype registry ID");
assert(new Set(NUM_CP006_WAVE01_PROTOTYPE_REGISTRY.map((entry) => entry.independentVerifierRoute)).size >= 5, "Wave 01 verifier-route breadth");
assert(generatedAuditPackages === 480, "Wave 01 audit corpus size");
assert(optionContractViolations === 0, "Wave 01 option-contract violations");
assert(internalIdLeaks === 0, "Wave 01 learner-facing internal ID leaks");
assert(lifecycleViolations === 0, "Wave 01 lifecycle violations");
assert(timeZeroViolations === 0, "Wave 01 time-zero ambiguity");
assert(productRelationOverextensionViolations === 0, "Wave 01 product relation overextension");
assert(stems.size >= 300, "Wave 01 insufficient stem variation");

console.log(JSON.stringify({
  status: "PASS_NUM_CP006_WAVE01_STRUCTURAL_AUDIT",
  temporaryPrototypeCount: NUM_CP006_WAVE01_PROTOTYPE_IDS.length,
  registryEntryCount: NUM_CP006_WAVE01_PROTOTYPE_REGISTRY.length,
  seedsPerPrototype,
  generatedAuditPackages,
  exactStemCount: stems.size,
  sourceFamilyCount: sourceFamilies.size,
  optionContractViolations,
  internalIdLeaks,
  lifecycleViolations,
  timeZeroViolations,
  productRelationOverextensionViolations,
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-070",
}, null, 2));
