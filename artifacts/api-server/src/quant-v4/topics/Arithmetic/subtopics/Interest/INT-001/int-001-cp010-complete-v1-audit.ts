import { eq } from "./cp003-exam-model";
import { generateIntCp010ProductionCandidateV2 } from "./cp010-production-authoring-candidate-v2-realism";
import { generateIntCp010LocalizedCandidate, INT_CP010_LOCALIZATION_LANGUAGES } from "./cp010-localization-authoring-candidate-v1";
import {
  INT_CP010_COMPLETION_STATUS,
  INT_CP010_FINAL_AUTHORITIES,
  INT_CP010_FINAL_GOVERNANCE,
  INT_CP010_FINAL_REGISTRY_VERSION,
  INT_CP010_NEXT_FREE_QL,
  INT_CP010_SOURCE_HOLDS_FINAL,
  generateIntCp010PermanentEnglish,
  generateIntCp010PermanentLocalized,
} from "./cp010-final-registry-v1";
import { solveIntCp010Discovery, verifyIntCp010DiscoveryAnswer } from "./cp010-mixed-systems-discovery-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

assert(INT_CP010_FINAL_REGISTRY_VERSION === "INT-CP-010-FINAL-REGISTRY-v1", "CP010 final registry version drifted");
assert(INT_CP010_COMPLETION_STATUS === "CP_COMPLETE_AUTHORITY_FROZEN_DELIVERY_CLOSED", "CP010 completion status drifted");
assert(INT_CP010_FINAL_AUTHORITIES.length === 2, "CP010 must finish with exactly two permanent authorities");
assert(INT_CP010_FINAL_AUTHORITIES[0]!.permanentQlId === "INT-QL-130", "CP010 first permanent QL must be INT-QL-130");
assert(INT_CP010_FINAL_AUTHORITIES[1]!.permanentQlId === "INT-QL-131", "CP010 second permanent QL must be INT-QL-131");
assert(INT_CP010_NEXT_FREE_QL === "INT-QL-132", "CP010 next-free QL drifted");
assert(new Set(INT_CP010_FINAL_AUTHORITIES.map((entry) => entry.permanentQlId)).size === 2, "CP010 permanent QL IDs are not unique");
assert(new Set(INT_CP010_FINAL_AUTHORITIES.map((entry) => entry.authorityId)).size === 2, "CP010 authority IDs are not unique");
assert(INT_CP010_SOURCE_HOLDS_FINAL.length === 2, "CP010 final source-hold count drifted");
assert(INT_CP010_FINAL_GOVERNANCE.productOwnerAuthorityCountApproved === true, "CP010 authority-count approval missing");
assert(INT_CP010_FINAL_GOVERNANCE.permanentQlCount === 2, "CP010 governance permanent count drifted");
assert(INT_CP010_FINAL_GOVERNANCE.questionStudioDiscoverable === false && INT_CP010_FINAL_GOVERNANCE.questionBankWritable === false && INT_CP010_FINAL_GOVERNANCE.testEligible === false && INT_CP010_FINAL_GOVERNANCE.publiclyPublishable === false, "CP010 downstream governance leaked open");

let permanentEnglishQuestions = 0;
let permanentLocalizedQuestions = 0;
let identityChecks = 0;
let mathematicalParityChecks = 0;
let solverVerifierChecks = 0;
let optionParityChecks = 0;
let lifecycleChecks = 0;
let deterministicChecks = 0;
let deepFreezeChecks = 0;
let scriptChecks = 0;
let sourceBoundaryChecks = 0;
const answerPositions = [0, 0, 0, 0];
const stemFamilies = new Map<string, Set<string>>();
const contexts = new Map<string, Set<string>>();
const uniqueStates = new Map<string, Set<string>>();
const observedPrototypes = new Set<string>();

for (const entry of INT_CP010_FINAL_AUTHORITIES) {
  stemFamilies.set(entry.permanentQlId, new Set());
  contexts.set(entry.permanentQlId, new Set());
  uniqueStates.set(entry.permanentQlId, new Set());
  for (let index = 0; index < 1000; index += 1) {
    const seed = `cp010:final:${entry.permanentQlId}:${index}`;
    const q = generateIntCp010PermanentEnglish(entry.permanentQlId, seed) as any;
    const source = generateIntCp010ProductionCandidateV2(entry.authorityId, seed) as any;
    permanentEnglishQuestions += 1;
    answerPositions[q.correctIndex] += 1;
    stemFamilies.get(entry.permanentQlId)!.add(q.stemFamilyId);
    contexts.get(entry.permanentQlId)!.add(q.context);
    uniqueStates.get(entry.permanentQlId)!.add(q.mathematicalFingerprint);
    observedPrototypes.add(q.sourcePrototypeId);

    assert(q.permanentQlId === entry.permanentQlId && q.authorityId === entry.authorityId && q.sourcePrototypeId === entry.sourcePrototypeId, `${entry.permanentQlId}/${seed}: permanent identity binding drift`);
    assert(q.permanentIdentityAllocated === true && q.finalRegistryVersion === INT_CP010_FINAL_REGISTRY_VERSION && q.completionStatus === INT_CP010_COMPLETION_STATUS, `${entry.permanentQlId}/${seed}: final authority metadata drift`);
    identityChecks += 2;

    assert(q.mathematicalFingerprint === source.mathematicalFingerprint, `${entry.permanentQlId}/${seed}: mathematical fingerprint changed during allocation`);
    assert(eq(q.answer, source.answer), `${entry.permanentQlId}/${seed}: answer changed during allocation`);
    assert(stable(q.mathematicalState) === stable(source.mathematicalState), `${entry.permanentQlId}/${seed}: mathematical state changed during allocation`);
    mathematicalParityChecks += 3;

    assert(eq(solveIntCp010Discovery(q.mathematicalState), q.answer), `${entry.permanentQlId}/${seed}: canonical solver rejected permanent answer`);
    assert(verifyIntCp010DiscoveryAnswer(q.mathematicalState, q.answer), `${entry.permanentQlId}/${seed}: independent verifier rejected permanent answer`);
    solverVerifierChecks += 2;

    assert(stable(q.options) === stable(source.options), `${entry.permanentQlId}/${seed}: options changed during allocation`);
    assert(q.correctIndex === source.correctIndex && q.correctAnswer === source.correctAnswer, `${entry.permanentQlId}/${seed}: answer ownership changed during allocation`);
    optionParityChecks += 2;

    assert(q.lifecycle.permanentIdentityAllocated === true && q.lifecycle.active === false, `${entry.permanentQlId}/${seed}: identity/lifecycle mismatch`);
    assert(q.lifecycle.questionStudioDiscoverable === false && q.lifecycle.questionBankWritable === false && q.lifecycle.testEligible === false && q.lifecycle.mockTestEligible === false && q.lifecycle.publiclyPublishable === false && q.lifecycle.automaticStudentPublication === false, `${entry.permanentQlId}/${seed}: delivery gate leaked open`);
    lifecycleChecks += 2;

    assert(!INT_CP010_SOURCE_HOLDS_FINAL.some((hold) => hold.prototypeId === q.sourcePrototypeId), `${entry.permanentQlId}/${seed}: held prototype received permanent identity`);
    sourceBoundaryChecks += 1;

    assert(Object.isFrozen(q) && Object.isFrozen(q.lifecycle) && Object.isFrozen(q.mathematicalState) && Object.isFrozen(q.options) && Object.isFrozen(q.explanation), `${entry.permanentQlId}/${seed}: permanent English payload is mutable`);
    deepFreezeChecks += 1;

    if (index % 20 === 0) {
      assert(stable(q) === stable(generateIntCp010PermanentEnglish(entry.permanentQlId, seed)), `${entry.permanentQlId}/${seed}: permanent English replay is nondeterministic`);
      deterministicChecks += 1;
    }
  }

  for (const language of INT_CP010_LOCALIZATION_LANGUAGES) {
    for (let index = 0; index < 500; index += 1) {
      const seed = `cp010:final-localized:${entry.permanentQlId}:${index}`;
      const q = generateIntCp010PermanentLocalized(entry.permanentQlId, seed, language) as any;
      const source = generateIntCp010LocalizedCandidate(entry.authorityId, seed, language) as any;
      const en = generateIntCp010PermanentEnglish(entry.permanentQlId, seed) as any;
      permanentLocalizedQuestions += 1;

      assert(q.permanentQlId === entry.permanentQlId && q.authorityId === entry.authorityId && q.sourcePrototypeId === entry.sourcePrototypeId, `${entry.permanentQlId}/${seed}/${language}: localized identity binding drift`);
      assert(q.permanentIdentityAllocated === true && q.finalRegistryVersion === INT_CP010_FINAL_REGISTRY_VERSION && q.completionStatus === INT_CP010_COMPLETION_STATUS, `${entry.permanentQlId}/${seed}/${language}: localized final metadata drift`);
      identityChecks += 2;

      assert(q.mathematicalFingerprint === en.mathematicalFingerprint && q.mathematicalFingerprint === source.mathematicalFingerprint, `${entry.permanentQlId}/${seed}/${language}: localized mathematical fingerprint drift`);
      assert(eq(q.answer, en.answer) && stable(q.mathematicalState) === stable(en.mathematicalState), `${entry.permanentQlId}/${seed}/${language}: localized math/answer parity drift`);
      mathematicalParityChecks += 2;

      assert(stable(q.options) === stable(en.options) && q.correctIndex === en.correctIndex && q.correctAnswer === en.correctAnswer, `${entry.permanentQlId}/${seed}/${language}: localized option/answer parity drift`);
      optionParityChecks += 1;

      assert(q.lifecycle.permanentIdentityAllocated === true && q.lifecycle.active === false, `${entry.permanentQlId}/${seed}/${language}: localized identity/lifecycle mismatch`);
      assert(q.lifecycle.questionStudioDiscoverable === false && q.lifecycle.questionBankWritable === false && q.lifecycle.testEligible === false && q.lifecycle.mockTestEligible === false && q.lifecycle.publiclyPublishable === false, `${entry.permanentQlId}/${seed}/${language}: localized delivery gate leaked open`);
      lifecycleChecks += 2;

      const learnerText = `${q.stem}\n${q.explanation.keyIdea}\n${q.explanation.steps.join("\n")}\n${q.explanation.finalAnswer}`;
      if (language === "hi") assert(/[\u0900-\u097F]/u.test(learnerText), `${entry.permanentQlId}/${seed}: Hindi script missing`);
      else assert(/[\u0A00-\u0A7F]/u.test(learnerText), `${entry.permanentQlId}/${seed}: Punjabi script missing`);
      assert(!/ਚੱਕਰਵੱਧੀ/u.test(learnerText), `${entry.permanentQlId}/${seed}/${language}: deprecated Punjabi terminology leaked`);
      scriptChecks += 2;

      assert(!INT_CP010_SOURCE_HOLDS_FINAL.some((hold) => hold.prototypeId === q.sourcePrototypeId), `${entry.permanentQlId}/${seed}/${language}: held prototype entered localized permanent pool`);
      sourceBoundaryChecks += 1;

      assert(Object.isFrozen(q) && Object.isFrozen(q.lifecycle) && Object.isFrozen(q.mathematicalState) && Object.isFrozen(q.options) && Object.isFrozen(q.explanation), `${entry.permanentQlId}/${seed}/${language}: permanent localized payload is mutable`);
      deepFreezeChecks += 1;

      if (index % 25 === 0) {
        assert(stable(q) === stable(generateIntCp010PermanentLocalized(entry.permanentQlId, seed, language)), `${entry.permanentQlId}/${seed}/${language}: localized permanent replay is nondeterministic`);
        deterministicChecks += 1;
      }
    }
  }
}

assert(permanentEnglishQuestions === 2000, `Expected 2000 permanent English questions, got ${permanentEnglishQuestions}`);
assert(permanentLocalizedQuestions === 2000, `Expected 2000 permanent localized questions, got ${permanentLocalizedQuestions}`);
assert(answerPositions.every((count) => count >= 400), `Permanent English answer positions are imbalanced: ${answerPositions.join("/")}`);
assert(observedPrototypes.size === 2 && observedPrototypes.has("INT-CP010-PROT-003") && observedPrototypes.has("INT-CP010-PROT-004"), `Permanent prototype coverage drifted: ${[...observedPrototypes].join(",")}`);
for (const entry of INT_CP010_FINAL_AUTHORITIES) {
  assert(stemFamilies.get(entry.permanentQlId)!.size === 8, `${entry.permanentQlId}: expected all 8 permanent English stem families`);
  assert(contexts.get(entry.permanentQlId)!.size === 8, `${entry.permanentQlId}: expected all 8 permanent English contexts`);
  assert(uniqueStates.get(entry.permanentQlId)!.size >= 700, `${entry.permanentQlId}: permanent state pool too thin (${uniqueStates.get(entry.permanentQlId)!.size})`);
}

console.log(JSON.stringify({
  finalRegistryVersion: INT_CP010_FINAL_REGISTRY_VERSION,
  completionStatus: INT_CP010_COMPLETION_STATUS,
  permanentQlIds: INT_CP010_FINAL_AUTHORITIES.map((entry) => entry.permanentQlId),
  nextFreeQl: INT_CP010_NEXT_FREE_QL,
  permanentEnglishQuestions,
  permanentLocalizedQuestions,
  identityChecks,
  mathematicalParityChecks,
  solverVerifierChecks,
  optionParityChecks,
  lifecycleChecks,
  deterministicChecks,
  deepFreezeChecks,
  scriptChecks,
  sourceBoundaryChecks,
  answerPositions,
  stemFamilies: Object.fromEntries([...stemFamilies].map(([key, value]) => [key, value.size])),
  contexts: Object.fromEntries([...contexts].map(([key, value]) => [key, value.size])),
  uniqueStates: Object.fromEntries([...uniqueStates].map(([key, value]) => [key, value.size])),
  sourceHoldsExcluded: INT_CP010_SOURCE_HOLDS_FINAL.map((hold) => hold.prototypeId),
  permanentIdentityAllocated: true,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP010_COMPLETE_V1_AUDIT");
