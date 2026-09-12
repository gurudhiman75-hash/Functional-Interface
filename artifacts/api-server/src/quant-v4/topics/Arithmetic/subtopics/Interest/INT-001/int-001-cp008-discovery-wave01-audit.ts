import {
  INT_CP008_DISCOVERY_BOUNDARY,
  INT_CP008_DISCOVERY_VERSION,
  INT_CP008_PROTOTYPE_IDS,
  buildIntCp008DiscoveryPackage,
  verifyIntCp008PrototypeAnswer,
} from "./cp008-instalment-discovery-v1";

const SEEDS_PER_PROTOTYPE = 120;
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function stable(value: unknown): string { return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current); }

const correctPositions = new Map<string, Set<number>>();
const stemFamilies = new Map<string, Set<string>>();
const periodUnits = new Map<string, Set<string>>();
const fingerprints = new Map<string, Set<string>>();
let packages = 0, deterministicChecks = 0, verifierChecks = 0, optionChecks = 0, lifecycleChecks = 0, coverageChecks = 0;

for (const prototypeId of INT_CP008_PROTOTYPE_IDS) {
  correctPositions.set(prototypeId, new Set()); stemFamilies.set(prototypeId, new Set()); periodUnits.set(prototypeId, new Set()); fingerprints.set(prototypeId, new Set());
  for (let index = 0; index < SEEDS_PER_PROTOTYPE; index += 1) {
    const seed = `int-cp008-wave01:${prototypeId}:${index}`;
    const first = buildIntCp008DiscoveryPackage(prototypeId, seed); const replay = buildIntCp008DiscoveryPackage(prototypeId, seed); packages += 1;
    assert(stable(first) === stable(replay), `${prototypeId}/${seed}: deterministic replay mismatch`); deterministicChecks += 1;
    assert(first.discoveryVersion === INT_CP008_DISCOVERY_VERSION, `${prototypeId}/${seed}: discovery version drift`);
    assert(first.checkpointId === "INT-CP-008", `${prototypeId}/${seed}: checkpoint drift`);
    assert(first.permanentQlId === null, `${prototypeId}/${seed}: permanent QL allocated during discovery`);
    assert(verifyIntCp008PrototypeAnswer(first.mathematicalState, first.answer), `${prototypeId}/${seed}: canonical answer rejected`); verifierChecks += 1;
    assert(first.options.length === 4, `${prototypeId}/${seed}: expected four options`);
    assert(first.correctIndex >= 0 && first.correctIndex <= 3, `${prototypeId}/${seed}: invalid correct position`);
    assert(stable(first.options[first.correctIndex]) === stable(first.answer), `${prototypeId}/${seed}: answer position drift`);
    for (let optionIndex = 0; optionIndex < first.options.length; optionIndex += 1) {
      const accepted = verifyIntCp008PrototypeAnswer(first.mathematicalState, first.options[optionIndex]!);
      assert(optionIndex === first.correctIndex ? accepted : !accepted, `${prototypeId}/${seed}: verifier ownership mismatch at option ${optionIndex}`); optionChecks += 1;
    }
    const lifecycle = first.lifecycle;
    assert(lifecycle.permanentQlCount === 0, `${prototypeId}/${seed}: permanent QL count opened`);
    assert(lifecycle.permanentQlAllocationAuthorized === false, `${prototypeId}/${seed}: QL allocation authorized`);
    assert(lifecycle.enabled === false, `${prototypeId}/${seed}: runtime enabled`);
    assert(lifecycle.stagingStatus === "NOT_STAGED", `${prototypeId}/${seed}: staging opened`);
    assert(lifecycle.registrationStatus === "NOT_REGISTERED", `${prototypeId}/${seed}: registration opened`);
    assert(lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: Question Studio opened`);
    assert(lifecycle.questionBankStatus === "NOT_STORED", `${prototypeId}/${seed}: Question Bank storage opened`);
    assert(lifecycle.questionBankWritable === false, `${prototypeId}/${seed}: Question Bank write opened`);
    assert(lifecycle.testEligibility === "INELIGIBLE", `${prototypeId}/${seed}: test delivery opened`);
    assert(lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: public delivery opened`); lifecycleChecks += 10;
    correctPositions.get(prototypeId)!.add(first.correctIndex); stemFamilies.get(prototypeId)!.add(first.stemFamilyId); periodUnits.get(prototypeId)!.add(first.mathematicalState.periodUnit); fingerprints.get(prototypeId)!.add(stable(first.mathematicalState));
  }
  assert(correctPositions.get(prototypeId)!.size === 4, `${prototypeId}: all four answer positions not exercised`);
  assert(stemFamilies.get(prototypeId)!.size === 3, `${prototypeId}: all three stem families not exercised`);
  assert(periodUnits.get(prototypeId)!.size === 2, `${prototypeId}: both period units not exercised`);
  assert(fingerprints.get(prototypeId)!.size >= 20, `${prototypeId}: mathematical state pool is too thin`); coverageChecks += 4;
}
assert(INT_CP008_DISCOVERY_BOUNDARY.permanentQlAllocationAuthorized === false, "CP008 boundary allocated permanent QLs");
assert(INT_CP008_DISCOVERY_BOUNDARY.learnerContentFrozen === false, "CP008 discovery falsely froze learner content");
assert(INT_CP008_DISCOVERY_BOUNDARY.learnerDeliveryAuthorized === false, "CP008 discovery opened learner delivery");
assert(INT_CP008_DISCOVERY_BOUNDARY.heterogeneousDatedCashFlowsOwner === "INT-CP-009", "CP008/CP009 ownership drift");
console.log(JSON.stringify({ discoveryVersion: INT_CP008_DISCOVERY_VERSION, prototypes: INT_CP008_PROTOTYPE_IDS.length, packages, deterministicChecks, verifierChecks, optionChecks, lifecycleChecks, coverageChecks, permanentQlCount: 0, nextPotentialQlIdentity: "INT-QL-116", permanentQlAllocationAuthorized: false, questionStudioDiscoverable: false, questionBankWritable: false, testEligible: false, publiclyPublishable: false }, null, 2));
console.log("PASS_INT_CP008_DISCOVERY_WAVE01_AUDIT");
