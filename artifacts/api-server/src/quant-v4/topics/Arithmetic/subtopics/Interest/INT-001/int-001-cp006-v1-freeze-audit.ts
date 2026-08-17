import {
  INT_CP006_QL_IDS,
  generateIntCp006Question,
} from "./cp006-si-ci-relations-runtime-v4-final";
import {
  INT_CP006_ENGLISH_FREEZE_APPROVAL,
  INT_CP006_ENGLISH_FREEZE_ID,
  generateIntCp006EnglishFrozenQuestion,
} from "./cp006-si-ci-relations-v1-frozen";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function learnerProjection(question: ReturnType<typeof generateIntCp006EnglishFrozenQuestion>) {
  const {
    freezeId: _freezeId,
    freezeApproval: _freezeApproval,
    editorialStatus: _editorialStatus,
    approvalStatus: _approvalStatus,
    allocationStatus: _allocationStatus,
    permanentIdentityFrozen: _permanentIdentityFrozen,
    learnerContentFrozen: _learnerContentFrozen,
    ...source
  } = question;
  return source;
}

let frozenQuestions = 0;
let identityChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let mutationGuards = 0;

for (const qlId of INT_CP006_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp006-v1-freeze-en-${qlId}-${index}`;
    const source = generateIntCp006Question(qlId, seed, "en-IN");
    const frozen = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
    frozenQuestions += 1;

    assert(stable(learnerProjection(frozen)) === stable(source), `${qlId}/${seed}: frozen/source learner drift`);
    assert(stable(frozen) === stable(generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN")), `${qlId}/${seed}: frozen replay drift`);
    identityChecks += 2;

    assert(frozen.freezeId === INT_CP006_ENGLISH_FREEZE_ID, `${qlId}/${seed}: freeze id drift`);
    assert(frozen.freezeApproval === INT_CP006_ENGLISH_FREEZE_APPROVAL, `${qlId}/${seed}: freeze approval identity drift`);
    assert(frozen.editorialStatus === "ENGLISH_FROZEN", `${qlId}/${seed}: editorial status drift`);
    assert(frozen.approvalStatus === "APPROVED_ENGLISH_FROZEN", `${qlId}/${seed}: approval status drift`);
    assert(frozen.allocationStatus === "INACTIVE_ENGLISH_FROZEN", `${qlId}/${seed}: allocation status drift`);
    assert(frozen.permanentIdentityFrozen && frozen.learnerContentFrozen, `${qlId}/${seed}: frozen flags missing`);

    assert(!frozen.enabled, `${qlId}/${seed}: enabled opened`);
    assert(frozen.stagingStatus === "NOT_STAGED", `${qlId}/${seed}: staging opened`);
    assert(frozen.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}: registration opened`);
    assert(!frozen.questionStudioDiscoverable, `${qlId}/${seed}: Studio opened`);
    assert(frozen.questionBankStatus === "NOT_STORED", `${qlId}/${seed}: bank opened`);
    assert(frozen.testEligibility === "INELIGIBLE", `${qlId}/${seed}: test eligibility opened`);
    assert(!frozen.publiclyPublishable, `${qlId}/${seed}: public delivery opened`);
    lifecycleChecks += 7;

    for (const object of [frozen, frozen.mathematicalState, frozen.presentation, frozen.options, frozen.explanation]) {
      assert(Object.isFrozen(object), `${qlId}/${seed}: deep-freeze boundary missing`);
      deepFreezeChecks += 1;
    }
    for (const option of frozen.options) {
      assert(Object.isFrozen(option), `${qlId}/${seed}: option not frozen`);
      deepFreezeChecks += 1;
    }
  }
}

{
  const sample = generateIntCp006EnglishFrozenQuestion("INT-QL-096", "freeze-mutation-root", "en-IN");
  try { (sample as unknown as { correctIndex: number }).correctIndex = 99; } catch { mutationGuards += 1; }
  assert(sample.correctIndex !== 99, "root mutation changed frozen question");
}
{
  const sample = generateIntCp006EnglishFrozenQuestion("INT-QL-108", "freeze-mutation-option", "en-IN");
  const before = sample.options[0]!.text;
  try { (sample.options[0] as unknown as { text: string }).text = "MUTATED"; } catch { mutationGuards += 1; }
  assert(sample.options[0]!.text === before, "option mutation changed frozen question");
}
assert(mutationGuards === 2, `mutation guards did not throw twice (${mutationGuards})`);

console.log(JSON.stringify({
  freezeId: INT_CP006_ENGLISH_FREEZE_ID,
  qls: INT_CP006_QL_IDS.length,
  locales: ["en-IN"],
  frozenQuestions,
  identityChecks,
  lifecycleChecks,
  deepFreezeChecks,
  mutationGuards,
  approvedSourceHead: INT_CP006_ENGLISH_FREEZE_APPROVAL.approvedSourceHead,
  reviewWorkflowRun: INT_CP006_ENGLISH_FREEZE_APPROVAL.reviewWorkflowRun,
  reviewArtifactId: INT_CP006_ENGLISH_FREEZE_APPROVAL.reviewArtifactId,
}, null, 2));
console.log("PASS_INT_CP006_V1_ENGLISH_FREEZE");
