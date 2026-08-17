import {
  INT_CP006_QL_IDS,
  type IntCp006QlId,
} from "./cp006-si-ci-relations-runtime-v4-final";
import {
  INT_CP006_ENGLISH_FREEZE_ID,
  generateIntCp006EnglishFrozenQuestion,
} from "./cp006-si-ci-relations-v1-frozen";
import {
  INT_CP006_LOCALIZED_LOCALES,
  INT_CP006_LOCALIZED_VERSION,
  generateIntCp006LocalizedQuestion,
  type IntCp006LocalizedLocale,
} from "./cp006-si-ci-relations-localized-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function semanticOptions(question: ReturnType<typeof generateIntCp006LocalizedQuestion>) {
  return question.options.map((option) => ({ value: option.value, misconceptionId: option.misconceptionId }));
}
function sourceSemanticOptions(question: ReturnType<typeof generateIntCp006EnglishFrozenQuestion>) {
  return question.options.map((option) => ({ value: option.value, misconceptionId: option.misconceptionId }));
}
function hasNativeScript(text: string, locale: IntCp006LocalizedLocale): boolean {
  return locale === "hi-IN" ? /[\u0900-\u097F]/u.test(text) : /[\u0A00-\u0A7F]/u.test(text);
}

let localizedQuestions = 0;
let deterministicChecks = 0;
let semanticParityChecks = 0;
let lifecycleChecks = 0;
let nativeScriptChecks = 0;
let deepFreezeChecks = 0;
let familyCoverageChecks = 0;
let positionCoverageChecks = 0;

for (const locale of INT_CP006_LOCALIZED_LOCALES) {
  for (const qlId of INT_CP006_QL_IDS) {
    const families = new Set<string>();
    const positions = new Set<number>();
    for (let index = 0; index < 200; index += 1) {
      const seed = `int-cp006-localized-v1-${locale}-${qlId}-${index}`;
      const source = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
      const localized = generateIntCp006LocalizedQuestion(qlId, seed, locale);
      const replay = generateIntCp006LocalizedQuestion(qlId, seed, locale);
      localizedQuestions += 1;

      assert(stable(localized) === stable(replay), `${locale}/${qlId}/${seed}: deterministic replay drift`);
      deterministicChecks += 1;

      assert(localized.qlId === source.qlId, `${locale}/${qlId}/${seed}: QL identity drift`);
      assert(localized.seed === source.seed, `${locale}/${qlId}/${seed}: seed drift`);
      assert(localized.answerSemantic === source.answerSemantic, `${locale}/${qlId}/${seed}: answer semantic drift`);
      assert(localized.correctIndex === source.correctIndex, `${locale}/${qlId}/${seed}: correct index drift`);
      assert(stable(localized.mathematicalState) === stable(source.mathematicalState), `${locale}/${qlId}/${seed}: mathematical state drift`);
      assert(stable(semanticOptions(localized)) === stable(sourceSemanticOptions(source)), `${locale}/${qlId}/${seed}: option semantics drift`);
      assert(localized.presentation.stemFamilyId === source.presentation.stemFamilyId, `${locale}/${qlId}/${seed}: stem family drift`);
      assert(localized.presentation.representation === source.presentation.representation, `${locale}/${qlId}/${seed}: representation drift`);
      assert(localized.localizedVersion === INT_CP006_LOCALIZED_VERSION, `${locale}/${qlId}/${seed}: localized version drift`);
      assert(localized.localizedFromFreezeId === INT_CP006_ENGLISH_FREEZE_ID, `${locale}/${qlId}/${seed}: freeze provenance drift`);
      assert(localized.permanentIdentityFrozen, `${locale}/${qlId}/${seed}: permanent QL identity opened`);
      assert(!localized.learnerContentFrozen, `${locale}/${qlId}/${seed}: localized review content incorrectly frozen`);
      semanticParityChecks += 12;

      assert(localized.locale === locale, `${locale}/${qlId}/${seed}: locale drift`);
      assert(localized.presentation.markdown !== source.presentation.markdown, `${locale}/${qlId}/${seed}: untranslated stem`);
      assert(hasNativeScript(localized.presentation.markdown, locale), `${locale}/${qlId}/${seed}: stem missing native script`);
      assert(hasNativeScript(localized.explanation.keyIdea, locale), `${locale}/${qlId}/${seed}: key idea missing native script`);
      assert(hasNativeScript(localized.explanation.commonMistake, locale), `${locale}/${qlId}/${seed}: common mistake missing native script`);
      assert(localized.explanation.steps.some((step) => hasNativeScript(step, locale)), `${locale}/${qlId}/${seed}: solution missing native script`);
      nativeScriptChecks += 5;

      assert(!localized.enabled, `${locale}/${qlId}/${seed}: enabled opened`);
      assert(localized.stagingStatus === "NOT_STAGED", `${locale}/${qlId}/${seed}: staging opened`);
      assert(localized.registrationStatus === "NOT_REGISTERED", `${locale}/${qlId}/${seed}: registration opened`);
      assert(!localized.questionStudioDiscoverable, `${locale}/${qlId}/${seed}: Studio opened`);
      assert(localized.questionBankStatus === "NOT_STORED", `${locale}/${qlId}/${seed}: Question Bank opened`);
      assert(localized.testEligibility === "INELIGIBLE", `${locale}/${qlId}/${seed}: test eligibility opened`);
      assert(!localized.publiclyPublishable, `${locale}/${qlId}/${seed}: public delivery opened`);
      lifecycleChecks += 7;

      for (const object of [localized, localized.mathematicalState, localized.presentation, localized.options, localized.explanation, localized.explanation.steps]) {
        assert(Object.isFrozen(object), `${locale}/${qlId}/${seed}: deep-freeze boundary missing`);
        deepFreezeChecks += 1;
      }
      for (const option of localized.options) {
        assert(Object.isFrozen(option), `${locale}/${qlId}/${seed}: option not frozen`);
        deepFreezeChecks += 1;
      }

      families.add(localized.presentation.stemFamilyId);
      positions.add(localized.correctIndex);
    }
    assert(families.size === 3, `${locale}/${qlId}: expected all 3 stem families, saw ${[...families].join(", ")}`);
    assert(positions.size === 4, `${locale}/${qlId}: expected A/B/C/D answer positions, saw ${[...positions].join(", ")}`);
    familyCoverageChecks += 1;
    positionCoverageChecks += 1;
  }
}

for (const locale of INT_CP006_LOCALIZED_LOCALES) {
  const sample = generateIntCp006LocalizedQuestion("INT-QL-096", `cp006-localized-mutation-${locale}`, locale);
  const before = sample.presentation.markdown;
  try { (sample.presentation as unknown as { markdown: string }).markdown = "MUTATED"; } catch { /* expected */ }
  assert(sample.presentation.markdown === before, `${locale}: localized presentation mutation succeeded`);
}

console.log(JSON.stringify({
  localizedVersion: INT_CP006_LOCALIZED_VERSION,
  sourceFreezeId: INT_CP006_ENGLISH_FREEZE_ID,
  qls: INT_CP006_QL_IDS.length,
  locales: INT_CP006_LOCALIZED_LOCALES,
  localizedQuestions,
  deterministicChecks,
  semanticParityChecks,
  lifecycleChecks,
  nativeScriptChecks,
  deepFreezeChecks,
  familyCoverageChecks,
  positionCoverageChecks,
}, null, 2));
console.log("PASS_INT_CP006_V1_HI_PA_LOCALIZATION_AUDIT");
