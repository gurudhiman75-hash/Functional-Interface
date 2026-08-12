import assert from "node:assert/strict";
import {
  generateNumCp001Wave01Sweep,
  NUM_CP001_WAVE01_PROTOTYPE_IDS,
} from "./runtime";

const PACKAGES_PER_PROTOTYPE = 60;
const packages = generateNumCp001Wave01Sweep(PACKAGES_PER_PROTOTYPE);

const exactStemOwners = new Map<string, Set<string>>();
const renderedCountsByPrototype = new Map<string, Set<string>>();
const explanationCountsByPrototype = new Map<string, Set<string>>();
let maxStemChars = 0;
let maxStemWords = 0;
let maxExplanationChars = 0;
let internalIdLeaks = 0;
let learnerFacingInternalLabelLeaks = 0;
let lifecycleViolations = 0;
let optionViolations = 0;
let verifierViolations = 0;
let crossPrototypeStemCollisions = 0;

for (const pkg of packages) {
  maxStemChars = Math.max(maxStemChars, pkg.stem.length);
  maxStemWords = Math.max(maxStemWords, pkg.stem.trim().split(/\s+/).length);
  maxExplanationChars = Math.max(maxExplanationChars, JSON.stringify(pkg.explanation).length);

  const normalizedStem = pkg.stem.trim().replace(/\s+/g, " ");
  const owners = exactStemOwners.get(normalizedStem) ?? new Set<string>();
  owners.add(pkg.temporaryPrototypeId);
  exactStemOwners.set(normalizedStem, owners);

  const renderedIdentity = `${normalizedStem}||${pkg.options.map((option) => option.value).join("||")}`;
  const rendered = renderedCountsByPrototype.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  rendered.add(renderedIdentity);
  renderedCountsByPrototype.set(pkg.temporaryPrototypeId, rendered);

  const explanations = explanationCountsByPrototype.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  explanations.add(JSON.stringify(pkg.explanation));
  explanationCountsByPrototype.set(pkg.temporaryPrototypeId, explanations);

  if (/NUM-CP001|PROT-00|permanentQlId|mathematicalFingerprint/i.test(pkg.stem)) internalIdLeaks += 1;

  const learnerFacingText = [
    pkg.stem,
    pkg.canonicalAnswer,
    ...pkg.options.map((option) => option.value),
    ...pkg.explanation.coreConcept,
    ...pkg.explanation.givenDataAndStrategy,
    ...pkg.explanation.stepByStep,
    ...pkg.explanation.examSpeedMethod,
    ...pkg.explanation.commonTraps,
    pkg.explanation.finalAnswer,
  ].join("\n");
  if (/[A-Z]{2,}_[A-Z0-9_]+/.test(learnerFacingText)) learnerFacingInternalLabelLeaks += 1;

  if (
    pkg.lifecycle.active
    || pkg.lifecycle.questionStudioDiscoverable
    || pkg.lifecycle.questionBankWritable
    || pkg.lifecycle.testEligible
    || pkg.lifecycle.publiclyPublishable
    || pkg.lifecycle.questionBankStatus !== "NOT_STORED"
    || pkg.lifecycle.testEligibility !== "INELIGIBLE"
    || pkg.permanentQlId !== null
  ) lifecycleViolations += 1;

  if (
    pkg.options.length !== 4
    || new Set(pkg.options.map((option) => option.value)).size !== 4
    || pkg.options.filter((option) => option.isCorrect).length !== 1
    || pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer
    || pkg.options.filter((option) => !option.isCorrect).some((option) => !option.misconceptionId)
  ) optionViolations += 1;

  if (pkg.canonicalAnswer !== pkg.verifierAnswer) verifierViolations += 1;
}

for (const owners of exactStemOwners.values()) {
  if (owners.size > 1) crossPrototypeStemCollisions += 1;
}

for (const prototypeId of NUM_CP001_WAVE01_PROTOTYPE_IDS) {
  assert.ok((renderedCountsByPrototype.get(prototypeId)?.size ?? 0) >= 3, `${prototypeId} has insufficient rendered-state variety`);
  assert.ok((explanationCountsByPrototype.get(prototypeId)?.size ?? 0) >= 3, `${prototypeId} has insufficient explanation variety`);
}

assert.equal(internalIdLeaks, 0);
assert.equal(learnerFacingInternalLabelLeaks, 0);
assert.equal(lifecycleViolations, 0);
assert.equal(optionViolations, 0);
assert.equal(verifierViolations, 0);
assert.equal(crossPrototypeStemCollisions, 0);
assert.ok(maxStemChars <= 260, `Wave 1 stem too long: ${maxStemChars}`);
assert.ok(maxStemWords <= 48, `Wave 1 stem too wordy: ${maxStemWords}`);
assert.ok(maxExplanationChars <= 2400, `Wave 1 explanation payload too large: ${maxExplanationChars}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE01_STRUCTURAL_AUDIT",
  generatedPackages: packages.length,
  packagesPerPrototype: PACKAGES_PER_PROTOTYPE,
  distinctRenderedQuestionsByPrototype: Object.fromEntries(
    [...renderedCountsByPrototype.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  distinctExplanationsByPrototype: Object.fromEntries(
    [...explanationCountsByPrototype.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  maxStemChars,
  maxStemWords,
  maxExplanationChars,
  internalIdLeaks,
  learnerFacingInternalLabelLeaks,
  lifecycleViolations,
  optionViolations,
  verifierViolations,
  crossPrototypeStemCollisions,
  permanentQlCount: 0,
}, null, 2));