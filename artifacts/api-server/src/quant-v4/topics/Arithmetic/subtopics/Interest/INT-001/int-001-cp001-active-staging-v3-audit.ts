import { listQuantV4Packages } from "../../../../../generation-engine";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import {
  INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3,
  generateIntCp001ActiveStagingBatch,
  generateIntCp001ActiveStagingEnvelope,
  toIntCp001ActiveStagingPreview,
} from "./cp001-approved-active-staging-provider-v3-runtime";
import {
  INT_CP001_CALCULATION_RICH_APPROVED_MATURITY,
  INT_CP001_CALCULATION_RICH_APPROVED_REVIEW_STATUS,
} from "./cp001-calculation-rich-explanation-runtime-approved";

const LANGUAGES = ["en", "hi", "pa"] as const;
const SEEDS_PER_QL = 60;

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(
  !listQuantV4Packages().some((item) => String(item.packageId) === "INT-001"),
  "INT-001 is present in the central Question Studio registry.",
);
assert(INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.enabled, "Active staging provider is disabled.");
assert(INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.stagingStatus === "ACTIVE_STAGING", "Wrong staging status.");
assert(INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.registrationStatus === "NOT_REGISTERED", "Provider was registered.");
assert(!INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.questionStudioDiscoverable, "Provider is Question Studio discoverable.");
assert(INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.questionBankStatus === "NOT_STORED", "Question Bank lock changed.");
assert(INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.testEligibility === "INELIGIBLE", "Test eligibility changed.");
assert(!INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.publiclyPublishable, "Publication lock changed.");

const counters = {
  directPackages: 0,
  deterministicEnvelopeChecks: 0,
  deterministicPreviewChecks: 0,
  approvedReleaseChecks: 0,
  approvedLifecycleChecks: 0,
  productionShapeChecks: 0,
  calculationRichChecks: 0,
  crossLanguageParityChecks: 0,
  recoveredSeeds: 0,
  maximumGenerationAttempts: 1,
  batchRuns: 0,
  batchPackages: 0,
  batchDeterminismChecks: 0,
};
const qlCoverage = Object.fromEntries(LANGUAGES.map((language) => [language, new Set<string>()])) as Record<string, Set<string>>;
const answerPositions = Object.fromEntries(LANGUAGES.map((language) => [language, [0, 0, 0, 0]])) as Record<string, number[]>;

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (let seedIndex = 1; seedIndex <= SEEDS_PER_QL; seedIndex += 1) {
    const seed = `int-cp001-active-staging-v3:${qlId}:${seedIndex}`;
    const byLanguage = new Map<string, ReturnType<typeof generateIntCp001ActiveStagingEnvelope>>();

    for (const language of LANGUAGES) {
      const envelope = generateIntCp001ActiveStagingEnvelope({ qlId, language, seed });
      const replay = generateIntCp001ActiveStagingEnvelope({ qlId, language, seed });
      const preview = toIntCp001ActiveStagingPreview(envelope);
      const replayPreview = toIntCp001ActiveStagingPreview(replay);
      counters.directPackages += 1;
      qlCoverage[language].add(qlId);
      answerPositions[language][envelope.question.correctIndex] += 1;

      assert(stable(envelope) === stable(replay), `${qlId}/${seed}/${language}: envelope is not deterministic.`);
      counters.deterministicEnvelopeChecks += 1;
      assert(stable(preview) === stable(replayPreview), `${qlId}/${seed}/${language}: preview is not deterministic.`);
      counters.deterministicPreviewChecks += 1;
      assert(envelope.trace.requestedSeed === seed, `${qlId}: requested seed trace mismatch.`);
      assert(envelope.trace.effectiveSeed === envelope.question.seed, `${qlId}: effective seed trace mismatch.`);
      assert(envelope.trace.generationAttempts >= 1 && envelope.trace.generationAttempts <= 32, `${qlId}: invalid generation attempt count.`);
      assert(envelope.trace.deterministicSeedRecovery === (envelope.trace.generationAttempts > 1), `${qlId}: recovery flag mismatch.`);
      if (envelope.trace.deterministicSeedRecovery) counters.recoveredSeeds += 1;
      counters.maximumGenerationAttempts = Math.max(counters.maximumGenerationAttempts, envelope.trace.generationAttempts);

      assert(envelope.question.releaseId === INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.releaseIds[language], `${qlId}: wrong release.`);
      counters.approvedReleaseChecks += 1;
      assert(envelope.question.maturity === INT_CP001_CALCULATION_RICH_APPROVED_MATURITY, `${qlId}: wrong maturity.`);
      assert(envelope.question.reviewStatus === INT_CP001_CALCULATION_RICH_APPROVED_REVIEW_STATUS, `${qlId}: wrong review status.`);
      assert(envelope.question.localeReviewStatus === "APPROVED_HUMAN_REVIEW", `${qlId}: locale is not approved.`);
      assert(envelope.question.calculationRichApprovalTrace.approvedForActiveStaging, `${qlId}: staging approval trace missing.`);
      assert(envelope.question.questionBankStatus === "NOT_STORED", `${qlId}: storage lock changed.`);
      assert(envelope.question.testEligibility === "INELIGIBLE", `${qlId}: test lock changed.`);
      assert(!envelope.question.publiclyPublishable, `${qlId}: publication lock changed.`);
      assert(!envelope.question.questionStudioDiscoverable, `${qlId}: discovery lock changed.`);
      counters.approvedLifecycleChecks += 1;

      assert(preview.stagingStatus === "ACTIVE_STAGING", `${qlId}: preview staging status mismatch.`);
      assert(preview.registrationStatus === "NOT_REGISTERED", `${qlId}: preview registration mismatch.`);
      assert(preview.requestedSeed === seed, `${qlId}: preview requested-seed mismatch.`);
      assert(preview.effectiveSeed === envelope.question.seed, `${qlId}: preview effective-seed mismatch.`);
      assert(preview.text === envelope.question.stem && preview.stem === envelope.question.stem, `${qlId}: stem shape mismatch.`);
      assert(preview.stemHtml === envelope.question.stemPresentation.richTextHtml, `${qlId}: rich stem mismatch.`);
      assert(preview.correctIndex === envelope.question.correctIndex, `${qlId}: answer index mismatch.`);
      assert(preview.options.length === 4 && new Set(preview.options).size === 4, `${qlId}: option shape invalid.`);
      assert(preview.explanation.includes(envelope.question.explanation.stepByStep.heading), `${qlId}: explanation missing.`);
      counters.productionShapeChecks += 1;

      const steps = envelope.question.explanation.stepByStep.steps;
      assert(steps.length >= 4, `${qlId}: insufficient worked steps.`);
      assert(steps.every((step) => /\d/u.test(step)), `${qlId}: a worked step lacks a concrete value.`);
      assert(envelope.question.calculationRichTrace.explicitFormula, `${qlId}: formula trace missing.`);
      assert(envelope.question.calculationRichTrace.explicitNumericSubstitution, `${qlId}: substitution trace missing.`);
      assert(envelope.question.calculationRichTrace.explicitArithmetic, `${qlId}: arithmetic trace missing.`);
      counters.calculationRichChecks += 1;
      byLanguage.set(language, envelope);
    }

    const english = byLanguage.get("en")!.question;
    for (const language of ["hi", "pa"] as const) {
      const localized = byLanguage.get(language)!.question;
      assert(
        stable(localized.optionAudit.map((item) => item.result))
          === stable(english.optionAudit.map((item) => item.result)),
        `${qlId}/${seed}/${language}: option-value parity failed.`,
      );
      assert(localized.correctIndex === english.correctIndex, `${qlId}/${seed}/${language}: answer-index parity failed.`);
      assert(localized.mathematicalFingerprint === english.mathematicalFingerprint, `${qlId}/${seed}/${language}: fingerprint parity failed.`);
      counters.crossLanguageParityChecks += 1;
    }
  }
}

for (const language of LANGUAGES) {
  assert(qlCoverage[language].size === 21, `${language}: incomplete QL coverage.`);
  assert(answerPositions[language].every((count) => count > 0), `${language}: incomplete answer-position coverage.`);
}

for (const language of LANGUAGES) {
  for (let run = 1; run <= 12; run += 1) {
    const request = {
      language,
      seed: `int-cp001-active-staging-batch:${language}:${run}`,
      count: 42,
    } as const;
    const batch = generateIntCp001ActiveStagingBatch(request);
    const replay = generateIntCp001ActiveStagingBatch(request);
    assert(stable(batch) === stable(replay), `${language}/batch-${run}: batch is not deterministic.`);
    assert(batch.questions.length === 42 && batch.questionPackages.length === 42, `${language}/batch-${run}: batch size mismatch.`);
    assert(batch.generationContext.stagingStatus === "ACTIVE_STAGING", `${language}/batch-${run}: staging context mismatch.`);
    assert(batch.generationContext.registrationStatus === "NOT_REGISTERED", `${language}/batch-${run}: registration context mismatch.`);
    counters.batchRuns += 1;
    counters.batchPackages += batch.questions.length;
    counters.batchDeterminismChecks += 1;
  }
}

for (const language of LANGUAGES) {
  const explicit = generateIntCp001ActiveStagingBatch({
    language,
    seed: `int-cp001-active-staging-explicit:${language}`,
    count: 7,
    qlId: "INT-QL-017",
  });
  assert(explicit.questionPackages.every((question) => question.qlId === "INT-QL-017"), `${language}: explicit QL selection failed.`);
}

for (const invalid of [
  () => generateIntCp001ActiveStagingEnvelope({ qlId: "INT-QL-001", language: "en", seed: "" }),
  () => generateIntCp001ActiveStagingEnvelope({ qlId: "INT-QL-999" as never, language: "en", seed: "x" }),
  () => generateIntCp001ActiveStagingEnvelope({ qlId: "INT-QL-001", language: "fr" as never, seed: "x" }),
]) {
  let rejected = false;
  try { invalid(); } catch { rejected = true; }
  assert(rejected, "Invalid active staging request did not fail closed.");
}

console.log(JSON.stringify({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-001",
  providerId: INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.providerId,
  releases: INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.releaseIds,
  ...counters,
  qlCoverage: Object.fromEntries(LANGUAGES.map((language) => [language, qlCoverage[language].size])),
  answerPositions,
  enabled: true,
  stagingStatus: "ACTIVE_STAGING",
  registrationStatus: "NOT_REGISTERED",
  centralQuestionStudioRegistered: false,
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3");
