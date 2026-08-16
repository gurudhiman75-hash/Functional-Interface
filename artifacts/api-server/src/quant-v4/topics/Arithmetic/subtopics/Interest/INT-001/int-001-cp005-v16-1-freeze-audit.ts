import {
  INT_CP005_V16_1_QL_IDS,
  generateIntCp005QuestionV16_1Final,
} from "./cp005-variable-growth-decay-runtime-v16-1-final-v2";
import {
  generateIntCp005QuestionV16_1Localized,
} from "./cp005-variable-growth-decay-runtime-v16-1-localized-v5";
import {
  INT_CP005_V16_1_FREEZE_ID,
  INT_CP005_V16_1_FREEZE_APPROVAL,
  generateIntCp005V16_1FrozenQuestion,
  type IntCp005V16_1FreezeLocale,
} from "./cp005-variable-growth-decay-v16-1-frozen";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function sourceFor(qlId: typeof INT_CP005_V16_1_QL_IDS[number], seed: string, locale: IntCp005V16_1FreezeLocale) {
  return locale === "en-IN"
    ? generateIntCp005QuestionV16_1Final(qlId, seed, "en-IN")
    : generateIntCp005QuestionV16_1Localized(qlId, seed, locale);
}
function learnerProjection(question: ReturnType<typeof generateIntCp005V16_1FrozenQuestion>) {
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

const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
let frozenQuestions = 0;
let identityChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let mutationGuards = 0;

for (const locale of locales) {
  for (const qlId of INT_CP005_V16_1_QL_IDS) {
    for (let index = 0; index < 200; index += 1) {
      const seed = `int-cp005-v16.1-freeze-${locale}-${qlId}-${index}`;
      const source = sourceFor(qlId, seed, locale);
      const frozen = generateIntCp005V16_1FrozenQuestion(qlId, seed, locale);
      frozenQuestions += 1;

      assert(stable(learnerProjection(frozen)) === stable(source), `${locale}/${qlId}/${seed}: frozen/source learner drift`);
      assert(stable(frozen) === stable(generateIntCp005V16_1FrozenQuestion(qlId, seed, locale)), `${locale}/${qlId}/${seed}: frozen replay drift`);
      identityChecks += 2;

      assert(frozen.freezeId === INT_CP005_V16_1_FREEZE_ID, `${locale}/${qlId}/${seed}: freeze id drift`);
      assert(frozen.freezeApproval === INT_CP005_V16_1_FREEZE_APPROVAL, `${locale}/${qlId}/${seed}: freeze approval identity drift`);
      assert(frozen.editorialStatus === "MULTILINGUAL_FROZEN", `${locale}/${qlId}/${seed}: editorial status drift`);
      assert(frozen.approvalStatus === "APPROVED_MULTILINGUAL_FROZEN", `${locale}/${qlId}/${seed}: approval status drift`);
      assert(frozen.allocationStatus === "INACTIVE_MULTILINGUAL_FROZEN", `${locale}/${qlId}/${seed}: allocation status drift`);
      assert(frozen.permanentIdentityFrozen && frozen.learnerContentFrozen, `${locale}/${qlId}/${seed}: frozen flags missing`);

      assert(!frozen.enabled, `${locale}/${qlId}/${seed}: enabled opened`);
      assert(frozen.stagingStatus === "NOT_STAGED", `${locale}/${qlId}/${seed}: staging opened`);
      assert(frozen.registrationStatus === "NOT_REGISTERED", `${locale}/${qlId}/${seed}: registration opened`);
      assert(!frozen.questionStudioDiscoverable, `${locale}/${qlId}/${seed}: Studio opened`);
      assert(frozen.questionBankStatus === "NOT_STORED", `${locale}/${qlId}/${seed}: bank opened`);
      assert(frozen.testEligibility === "INELIGIBLE", `${locale}/${qlId}/${seed}: test eligibility opened`);
      assert(!frozen.publiclyPublishable, `${locale}/${qlId}/${seed}: public delivery opened`);
      lifecycleChecks += 7;

      for (const object of [frozen, frozen.mathematicalState, frozen.presentation, frozen.options, frozen.explanation]) {
        assert(Object.isFrozen(object), `${locale}/${qlId}/${seed}: deep-freeze boundary missing`);
        deepFreezeChecks += 1;
      }
      for (const option of frozen.options) {
        assert(Object.isFrozen(option), `${locale}/${qlId}/${seed}: option not frozen`);
        deepFreezeChecks += 1;
      }
    }
  }
}

for (const locale of locales) {
  let rejected = false;
  try { generateIntCp005V16_1FrozenQuestion("INT-QL-094", `freeze-reject-${locale}`, locale); } catch { rejected = true; }
  assert(rejected, `${locale}: INT-QL-094 did not remain rejected`);
}

{
  const sample = generateIntCp005V16_1FrozenQuestion("INT-QL-086", "freeze-mutation-root", "en-IN");
  try { (sample as unknown as { correctIndex: number }).correctIndex = 99; } catch { mutationGuards += 1; }
  assert(sample.correctIndex !== 99, "root mutation changed frozen question");
}
{
  const sample = generateIntCp005V16_1FrozenQuestion("INT-QL-095", "freeze-mutation-option", "pa-IN");
  const before = sample.options[0]!.text;
  try { (sample.options[0] as unknown as { text: string }).text = "MUTATED"; } catch { mutationGuards += 1; }
  assert(sample.options[0]!.text === before, "option mutation changed frozen question");
}
assert(mutationGuards === 2, `mutation guards did not throw twice (${mutationGuards})`);

console.log(JSON.stringify({
  freezeId: INT_CP005_V16_1_FREEZE_ID,
  qls: INT_CP005_V16_1_QL_IDS.length,
  locales,
  frozenQuestions,
  identityChecks,
  lifecycleChecks,
  deepFreezeChecks,
  mutationGuards,
  ql094RejectedLocales: 3,
}, null, 2));
console.log("PASS_INT_CP005_V16_1_MULTILINGUAL_FREEZE");
