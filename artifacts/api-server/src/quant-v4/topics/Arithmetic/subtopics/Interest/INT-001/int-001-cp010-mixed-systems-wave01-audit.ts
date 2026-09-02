import { createHash } from "node:crypto";
import { eq } from "./cp003-exam-model";
import {
  INT_CP010_DISCOVERY_VERSION,
  INT_CP010_PROTOTYPE_IDS,
  INT_CP010_SOURCE_LINEAGE,
  buildIntCp010DiscoveryPackage,
  solveIntCp010Discovery,
  verifyIntCp010DiscoveryAnswer,
} from "./cp010-mixed-systems-discovery-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

assert(INT_CP010_DISCOVERY_VERSION === "INT-CP-010-MIXED-SYSTEMS-DISCOVERY-WAVE01-v1", "CP010 discovery version drifted");
assert(INT_CP010_PROTOTYPE_IDS.length === 4, "CP010 Wave01 must have four temporary prototypes");
assert(new Set(INT_CP010_PROTOTYPE_IDS).size === 4, "CP010 temporary prototype IDs must be unique");
assert(INT_CP010_SOURCE_LINEAGE.permanentQlCount === 0, "CP010 discovery must remain ID-free");
assert(INT_CP010_SOURCE_LINEAGE.nextPotentialQlIdentity === "INT-QL-130", "CP010 next potential QL drifted");
assert(INT_CP010_SOURCE_LINEAGE.nextPotentialQlIdentityReserved === false, "INT-QL-130 must not be reserved during discovery");
assert(INT_CP010_SOURCE_LINEAGE.legacyMixedFamilies.includes("int_hybrid_si_ci_crossover"), "legacy hybrid family lineage missing");
assert(INT_CP010_SOURCE_LINEAGE.legacyMixedFamilies.includes("int_si_ci_mixed_condition_inverse"), "legacy mixed inverse lineage missing");
assert(INT_CP010_SOURCE_LINEAGE.inheritedReassignment.includes("CP009-S17"), "CP009 S17 reassignment lineage missing");

let packages = 0;
let deterministicChecks = 0;
let solverVerifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let editorialChecks = 0;
let deepFreezeChecks = 0;
let componentBoundaryChecks = 0;
const answerPositions = [0, 0, 0, 0];
const stemCoverage = new Set<string>();
const sourceCoverage = new Set<string>();
const componentCoverage = new Set<string>();
const fingerprintByPrototype = new Map<string, Set<string>>();

for (const prototypeId of INT_CP010_PROTOTYPE_IDS) {
  const fingerprints = new Set<string>();
  fingerprintByPrototype.set(prototypeId, fingerprints);
  for (let index = 0; index < 160; index += 1) {
    const seed = `cp010:wave01:${prototypeId}:${index}`;
    const q = buildIntCp010DiscoveryPackage(prototypeId, seed) as any;
    packages += 1;

    assert(stable(q) === stable(buildIntCp010DiscoveryPackage(prototypeId, seed)), `${prototypeId}/${seed}: nondeterministic replay`);
    deterministicChecks += 1;

    const canonical = solveIntCp010Discovery(q.mathematicalState);
    assert(eq(canonical, q.answer), `${prototypeId}/${seed}: canonical solver drift`);
    assert(verifyIntCp010DiscoveryAnswer(q.mathematicalState, q.answer), `${prototypeId}/${seed}: independent verifier failed`);
    solverVerifierChecks += 2;

    assert(q.options.length === 4, `${prototypeId}/${seed}: option count drift`);
    assert(q.options[q.correctIndex]?.text === q.correctAnswer, `${prototypeId}/${seed}: correct answer ownership drift`);
    assert(q.options.filter((option: any) => option.isCorrect).length === 1, `${prototypeId}/${seed}: correct option multiplicity drift`);
    assert(new Set(q.options.map((option: any) => option.text)).size === 4, `${prototypeId}/${seed}: duplicate visible options`);
    optionChecks += 4;
    answerPositions[q.correctIndex] += 1;

    assert(q.permanentQlId === null && q.lifecycle.permanentIdentityAllocated === false, `${prototypeId}/${seed}: permanent identity leaked into discovery`);
    assert(q.lifecycle.enabled === false && q.lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: discovery activated`);
    assert(q.lifecycle.questionBankWritable === false && q.lifecycle.testEligible === false && q.lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: downstream delivery gate leaked`);
    lifecycleChecks += 3;

    const learnerText = `${q.presentation.prompt}\n${q.explanation.keyIdea}\n${q.explanation.steps.join("\n")}\n${q.explanation.finalAnswer}`;
    assert(!/(?:undefined|null|NaN|after after|per annum per annum)/u.test(learnerText), `${prototypeId}/${seed}: learner editorial token leaked`);
    assert(q.explanation.steps.length === 4, `${prototypeId}/${seed}: explanation must have four concise worked steps`);
    assert(q.presentation.prompt.length >= 80 && q.presentation.prompt.length <= 650, `${prototypeId}/${seed}: prompt length out of exam-realistic range`);
    const rupeeValues = [...learnerText.matchAll(/₹([\d,]+(?:\.\d+)?)/gu)].map((match) => Number(match[1]!.replaceAll(",", "")));
    assert(rupeeValues.every((value) => value >= 0 && value <= 2_000_000), `${prototypeId}/${seed}: money realism outlier`);
    editorialChecks += 4;

    assert(Object.isFrozen(q) && Object.isFrozen(q.mathematicalState) && Object.isFrozen(q.options) && Object.isFrozen(q.explanation), `${prototypeId}/${seed}: deep-freeze contract missing`);
    deepFreezeChecks += 4;

    assert(Array.isArray(q.componentAuthorities) && q.componentAuthorities.length === 2, `${prototypeId}/${seed}: mixed authority lineage missing`);
    assert(q.componentAuthorities[0].startsWith("INT-CP-") && q.componentAuthorities[1].startsWith("INT-CP-"), `${prototypeId}/${seed}: invalid component authority IDs`);
    componentBoundaryChecks += 2;
    q.componentAuthorities.forEach((value: string) => componentCoverage.add(value));

    stemCoverage.add(`${prototypeId}:${q.presentation.stemFamilyId}`);
    sourceCoverage.add(q.sourceLineage);
    fingerprints.add(q.mathematicalFingerprint);
    assert(q.mathematicalFingerprint === createHash("sha256").update(stable({ prototypeId, mathematicalState: q.mathematicalState, answer: q.answer })).digest("hex"), `${prototypeId}/${seed}: mathematical fingerprint drift`);
  }
}

assert(packages === 640, `Expected 640 CP010 Wave01 packages, got ${packages}`);
assert(answerPositions.every((count) => count === 160), `Expected exact 160/160/160/160 answer balance, got ${answerPositions.join("/")}`);
assert(stemCoverage.size === 12, `Expected all 12 prototype/stem families, got ${stemCoverage.size}`);
assert(sourceCoverage.size === 3, `Expected three source-lineage clusters, got ${sourceCoverage.size}`);
assert(componentCoverage.has("INT-CP-005:VARIABLE_RATE"), "CP005 variable-rate component missing");
assert(componentCoverage.has("INT-CP-008:EQUAL_INSTALMENT"), "CP008 equal-instalment component missing");
assert(componentCoverage.has("INT-CP-009:HETEROGENEOUS_DATED_CASH_FLOW"), "CP009 dated-flow component missing");
for (const [prototypeId, fingerprints] of fingerprintByPrototype) {
  assert(fingerprints.size >= 80, `${prototypeId}: mathematical state pool too thin (${fingerprints.size})`);
}

console.log(JSON.stringify({
  discoveryVersion: INT_CP010_DISCOVERY_VERSION,
  temporaryPrototypeCount: INT_CP010_PROTOTYPE_IDS.length,
  packages,
  deterministicChecks,
  solverVerifierChecks,
  optionChecks,
  lifecycleChecks,
  editorialChecks,
  deepFreezeChecks,
  componentBoundaryChecks,
  answerPositions,
  stemFamilies: stemCoverage.size,
  sourceLineages: sourceCoverage.size,
  componentAuthorities: [...componentCoverage].sort(),
  uniqueMathematicalStates: Object.fromEntries([...fingerprintByPrototype].map(([prototypeId, fingerprints]) => [prototypeId, fingerprints.size])),
  permanentQlCount: INT_CP010_SOURCE_LINEAGE.permanentQlCount,
  nextPotentialQlIdentity: INT_CP010_SOURCE_LINEAGE.nextPotentialQlIdentity,
  nextPotentialQlIdentityReserved: INT_CP010_SOURCE_LINEAGE.nextPotentialQlIdentityReserved,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP010_MIXED_SYSTEMS_WAVE01_AUDIT");
