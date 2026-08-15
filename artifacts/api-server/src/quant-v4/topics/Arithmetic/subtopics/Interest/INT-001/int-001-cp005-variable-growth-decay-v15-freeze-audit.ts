import { INT_CP005_QL_IDS, generateIntCp005QuestionV15, type IntCp005Locale } from "./cp005-variable-growth-decay-runtime-v15";
import { generateIntCp005V15FrozenQuestion, INT_CP005_V15_FREEZE_ID } from "./cp005-variable-growth-decay-v15-frozen";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
function stable(value: unknown): string { return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item); }
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

let frozenQuestions = 0;
let identityChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
let mutationGuards = 0;

for (const qlId of INT_CP005_QL_IDS) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp005-v15-freeze-${qlId}-${index}`;
    for (const locale of LOCALES) {
      const source = generateIntCp005QuestionV15(qlId, seed, locale);
      const frozen = generateIntCp005V15FrozenQuestion(qlId, seed, locale);
      const {
        freezeId: _freezeId,
        freezeApproval: _freezeApproval,
        editorialStatus: _editorialStatus,
        approvalStatus: _approvalStatus,
        allocationStatus: _allocationStatus,
        permanentIdentityFrozen: _permanentIdentityFrozen,
        learnerContentFrozen: _learnerContentFrozen,
        ...frozenSource
      } = frozen;
      assert(stable(frozenSource) === stable(source), `${qlId}/${seed}/${locale}: freeze changed source learner authority`);
      assert(frozen.freezeId === INT_CP005_V15_FREEZE_ID, `${qlId}/${seed}/${locale}: wrong freeze id`);
      identityChecks += 2;
      assert(!frozen.enabled && frozen.stagingStatus === "NOT_STAGED" && frozen.registrationStatus === "NOT_REGISTERED", `${qlId}/${seed}/${locale}: frozen lifecycle opened`);
      assert(!frozen.questionStudioDiscoverable && frozen.questionBankStatus === "NOT_STORED" && frozen.testEligibility === "INELIGIBLE" && !frozen.publiclyPublishable, `${qlId}/${seed}/${locale}: frozen delivery opened`);
      lifecycleChecks += 7;
      for (const object of [frozen, frozen.presentation, frozen.options, frozen.explanation, frozen.mathematicalState]) {
        assert(Object.isFrozen(object), `${qlId}/${seed}/${locale}: frozen object is mutable`);
        deepFreezeChecks += 1;
      }
      frozenQuestions += 1;
    }
  }
}

const probe = generateIntCp005V15FrozenQuestion("INT-QL-093", "int-cp005-v15-freeze-mutation-probe", "en-IN");
try { (probe as any).correctIndex = 99; } catch { mutationGuards += 1; }
assert(probe.correctIndex !== 99, "top-level freeze mutation succeeded");
try { (probe.options as any)[0].text = "MUTATED"; } catch { mutationGuards += 1; }
assert(probe.options[0]!.text !== "MUTATED", "nested freeze mutation succeeded");

console.log(JSON.stringify({ frozenQuestions, identityChecks, lifecycleChecks, deepFreezeChecks, mutationGuards }, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V15_FREEZE");
