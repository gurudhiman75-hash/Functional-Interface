import { listQuantV4Packages } from "../../../../../generation-engine";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import {
  generateIntCp001InactiveProviderEnvelope,
  generateIntCp001InactiveReleaseBatch,
  INT_CP001_INACTIVE_RELEASE_PROVIDER,
  toIntCp001InactiveQuestionStudioPreview,
  type IntCp001ReleaseLanguage,
} from "./cp001-inactive-release-provider";
import { stableBigIntJson } from "./cp001-localization-foundation";

function fail(message: string): never {
  throw new Error(message);
}

function expectThrow(label: string, callback: () => unknown): void {
  try {
    callback();
  } catch {
    return;
  }
  fail(`${label} did not reject.`);
}

const languages: readonly IntCp001ReleaseLanguage[] = ["en", "hi", "pa"];
const expectedReleaseIds = {
  en: "INT-CP-001-EN-v3",
  hi: "INT-CP-001-HI-v2",
  pa: "INT-CP-001-PA-v2",
} as const;

if (INT_CP001_INACTIVE_RELEASE_PROVIDER.enabled) fail("Inactive provider is enabled.");
if (INT_CP001_INACTIVE_RELEASE_PROVIDER.registrationStatus !== "NOT_REGISTERED") fail("Inactive provider registration status is unsafe.");
if (INT_CP001_INACTIVE_RELEASE_PROVIDER.questionStudioDiscoverable) fail("Inactive provider is Question Studio discoverable.");
if (INT_CP001_INACTIVE_RELEASE_PROVIDER.questionBankStatus !== "NOT_STORED") fail("Inactive provider is Question Bank writable.");
if (INT_CP001_INACTIVE_RELEASE_PROVIDER.testEligibility !== "INELIGIBLE") fail("Inactive provider is test eligible.");
if (INT_CP001_INACTIVE_RELEASE_PROVIDER.publiclyPublishable) fail("Inactive provider is publicly publishable.");
if (INT_CP001_INACTIVE_RELEASE_PROVIDER.qlIds.length !== 21) fail("Inactive provider does not expose 21 QLs internally.");
if (new Set(INT_CP001_INACTIVE_RELEASE_PROVIDER.qlIds).size !== 21) fail("Inactive provider has duplicate QLs.");

const registered = listQuantV4Packages().find((pkg) => String(pkg.packageId) === "INT-001");
if (registered) fail("INT-001 is present in the central Question Studio package list before activation approval.");

let directPackages = 0;
let deterministicEnvelopeChecks = 0;
let deterministicPreviewChecks = 0;
let releaseChecks = 0;
let productionShapeChecks = 0;
let lifecycleLockChecks = 0;
let distractorChecks = 0;
const qlCoverage = Object.fromEntries(languages.map((language) => [language, new Set<string>()])) as Record<IntCp001ReleaseLanguage, Set<string>>;
const answerPositions = Object.fromEntries(languages.map((language) => [language, [0, 0, 0, 0]])) as Record<IntCp001ReleaseLanguage, number[]>;
const distinctStems = Object.fromEntries(languages.map((language) => [language, new Set<string>()])) as Record<IntCp001ReleaseLanguage, Set<string>>;

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (let index = 0; index < 60; index += 1) {
    const seed = `inactive-release-${index}`;
    for (const language of languages) {
      const envelope = generateIntCp001InactiveProviderEnvelope({ qlId, language, seed });
      const repeat = generateIntCp001InactiveProviderEnvelope({ qlId, language, seed });
      if (stableBigIntJson(envelope) !== stableBigIntJson(repeat)) {
        fail(`${qlId}/${seed}/${language} envelope is not deterministic.`);
      }
      deterministicEnvelopeChecks += 1;

      const preview = toIntCp001InactiveQuestionStudioPreview(envelope, {
        questionIndex: index + 1,
        questionCount: 60,
      });
      const repeatPreview = toIntCp001InactiveQuestionStudioPreview(repeat, {
        questionIndex: index + 1,
        questionCount: 60,
      });
      if (stableBigIntJson(preview) !== stableBigIntJson(repeatPreview)) {
        fail(`${qlId}/${seed}/${language} preview is not deterministic.`);
      }
      deterministicPreviewChecks += 1;

      const question = envelope.question;
      if (!question.validation.ok) fail(`${qlId}/${seed}/${language}: ${question.validation.errors.join(" | ")}`);
      if (question.releaseId !== expectedReleaseIds[language]) fail(`${qlId}/${seed}/${language} emitted wrong release ${question.releaseId}.`);
      if (question.releaseId.endsWith("-v1")) fail(`${qlId}/${seed}/${language} emitted superseded multilingual V1 content.`);
      if (envelope.trace.releaseId !== question.releaseId) fail(`${qlId}/${seed}/${language} release trace is out of sync.`);
      if (envelope.trace.registrationStatus !== "NOT_REGISTERED") fail(`${qlId}/${seed}/${language} was registered during inactive proof.`);
      releaseChecks += 1;

      if (question.questionBankStatus !== "NOT_STORED") fail(`${qlId}/${seed}/${language} is Question Bank writable.`);
      if (question.testEligibility !== "INELIGIBLE") fail(`${qlId}/${seed}/${language} is test eligible.`);
      if (question.publiclyPublishable) fail(`${qlId}/${seed}/${language} is publicly publishable.`);
      if (question.questionStudioDiscoverable) fail(`${qlId}/${seed}/${language} is Question Studio discoverable.`);
      lifecycleLockChecks += 1;

      if (question.options.length !== 4 || new Set(question.options).size !== 4) fail(`${qlId}/${seed}/${language} lacks four unique options.`);
      if (question.correctIndex < 0 || question.correctIndex > 3) fail(`${qlId}/${seed}/${language} has invalid correct index.`);
      if (question.optionAudit[question.correctIndex]?.misconceptionId !== "CORRECT") fail(`${qlId}/${seed}/${language} lost correct-option ownership.`);
      if (question.explanation.trapAnalysis.items.length !== 3) fail(`${qlId}/${seed}/${language} lacks three distractor explanations.`);
      for (const trap of question.explanation.trapAnalysis.items) {
        distractorChecks += 1;
        if (trap.optionNumber - 1 === question.correctIndex) fail(`${qlId}/${seed}/${language} analyses the correct option as a trap.`);
        if (trap.optionText !== question.options[trap.optionNumber - 1]) fail(`${qlId}/${seed}/${language} trap text is out of sync.`);
      }

      if (preview.text !== question.stem || preview.stem !== question.stem) fail(`${qlId}/${seed}/${language} preview stem drifted.`);
      if (stableBigIntJson(preview.options) !== stableBigIntJson(question.options)) fail(`${qlId}/${seed}/${language} preview options drifted.`);
      if (preview.correctIndex !== question.correctIndex || preview.correct !== question.correctIndex) fail(`${qlId}/${seed}/${language} preview answer index drifted.`);
      if (preview.packageId !== "INT-001" || preview.patternId !== qlId || preview.canonicalProblemId !== "INT-CP-001") fail(`${qlId}/${seed}/${language} preview identity is invalid.`);
      if (preview.language !== language || preview.releaseId !== question.releaseId) fail(`${qlId}/${seed}/${language} preview language/release is invalid.`);
      if (preview.runtimeMode !== "APPROVED_INACTIVE_RELEASE_PROOF" || preview.registrationStatus !== "NOT_REGISTERED") fail(`${qlId}/${seed}/${language} preview runtime status is unsafe.`);
      if (preview.questionBankStatus !== "NOT_STORED" || preview.testEligibility !== "INELIGIBLE") fail(`${qlId}/${seed}/${language} preview storage/test status is unsafe.`);
      if (preview.publiclyPublishable || preview.questionStudioDiscoverable) fail(`${qlId}/${seed}/${language} preview breached delivery locks.`);
      if (!preview.explanation.includes(question.explanation.coreConcept.heading)) fail(`${qlId}/${seed}/${language} preview lacks core concept.`);
      if (!preview.explanation.includes(question.explanation.stepByStep.heading)) fail(`${qlId}/${seed}/${language} preview lacks steps.`);
      if (!preview.explanation.includes(question.explanation.examShortcut.heading)) fail(`${qlId}/${seed}/${language} preview lacks shortcut.`);
      if (!preview.explanation.includes(question.explanation.trapAnalysis.heading)) fail(`${qlId}/${seed}/${language} preview lacks trap analysis.`);
      productionShapeChecks += 1;

      qlCoverage[language].add(qlId);
      answerPositions[language][question.correctIndex] += 1;
      distinctStems[language].add(question.stem);
      directPackages += 1;
    }
  }
}

if (directPackages !== 3780) fail(`Expected 3780 direct packages, received ${directPackages}.`);
for (const language of languages) {
  if (qlCoverage[language].size !== 21) fail(`${language} did not cover all 21 QLs.`);
  if (answerPositions[language].some((count) => count === 0)) fail(`${language} did not cover every answer position.`);
  if (distinctStems[language].size < 500) fail(`${language} produced insufficient stem diversity: ${distinctStems[language].size}.`);
}

let batchRuns = 0;
let batchPackages = 0;
let batchDeterministicChecks = 0;
for (const language of languages) {
  for (let index = 0; index < 12; index += 1) {
    const request = { language, seed: `batch-proof-${index}`, count: 42 } as const;
    const batch = generateIntCp001InactiveReleaseBatch(request);
    const repeat = generateIntCp001InactiveReleaseBatch(request);
    if (stableBigIntJson(batch) !== stableBigIntJson(repeat)) fail(`${language}/batch-proof-${index} is not deterministic.`);
    batchDeterministicChecks += 1;
    if (batch.questionPackages.length !== 42 || batch.questions.length !== 42 || batch.envelopes.length !== 42) {
      fail(`${language}/batch-proof-${index} has incorrect batch cardinality.`);
    }
    if (new Set(batch.envelopes.map((item) => item.trace.qlId)).size !== 21) {
      fail(`${language}/batch-proof-${index} did not cover all 21 QLs in a 42-item batch.`);
    }
    if (batch.generationContext.registrationStatus !== "NOT_REGISTERED" || batch.generationContext.questionStudioDiscoverable) {
      fail(`${language}/batch-proof-${index} breached inactive registration status.`);
    }
    batchRuns += 1;
    batchPackages += batch.questionPackages.length;
  }

  const explicit = generateIntCp001InactiveReleaseBatch({
    language,
    seed: `explicit-${language}`,
    count: 5,
    qlId: "INT-QL-021",
  });
  if (explicit.envelopes.some((item) => item.trace.qlId !== "INT-QL-021")) fail(`${language} explicit QL selection drifted.`);
}

const minimumBatch = generateIntCp001InactiveReleaseBatch({ language: "en", seed: "minimum-count", count: 0 });
if (minimumBatch.questionPackages.length !== 1) fail("Inactive provider did not clamp a non-positive count to one.");

expectThrow("missing seed", () => generateIntCp001InactiveProviderEnvelope({ qlId: "INT-QL-001", language: "en", seed: "" }));
expectThrow("unsupported language", () => generateIntCp001InactiveProviderEnvelope({ qlId: "INT-QL-001", language: "fr" as IntCp001ReleaseLanguage, seed: "invalid-language" }));
expectThrow("unknown QL", () => generateIntCp001InactiveProviderEnvelope({ qlId: "INT-QL-999" as typeof INT_CP001_FINAL_QL_IDS[number], language: "en", seed: "invalid-ql" }));
expectThrow("batch missing seed", () => generateIntCp001InactiveReleaseBatch({ language: "en", seed: "", count: 1 }));

console.log(JSON.stringify({
  status: "PASS_INT_CP001_INACTIVE_RELEASE_READINESS",
  providerId: INT_CP001_INACTIVE_RELEASE_PROVIDER.providerId,
  packageId: "INT-001",
  cpId: "INT-CP-001",
  qlCount: 21,
  languages,
  directPackages,
  deterministicEnvelopeChecks,
  deterministicPreviewChecks,
  releaseChecks,
  productionShapeChecks,
  lifecycleLockChecks,
  distractorChecks,
  batchRuns,
  batchPackages,
  batchDeterministicChecks,
  releaseIds: expectedReleaseIds,
  qlCoverage: Object.fromEntries(languages.map((language) => [language, qlCoverage[language].size])),
  distinctStems: Object.fromEntries(languages.map((language) => [language, distinctStems[language].size])),
  answerPositions,
  centralQuestionStudioRegistration: false,
  enabled: false,
  registrationStatus: "NOT_REGISTERED",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
}, null, 2));
