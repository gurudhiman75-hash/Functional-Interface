import { listQuantV4Packages } from "../../../../../generation-engine";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import {
  INT_CP001_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY,
  runIntCp001QuestionStudioPreRegistration,
} from "./int-001-cp001-question-studio-pre-registration-adapter";

const LANGUAGES = ["en", "hi", "pa"] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

function assertJsonSafe(value: unknown, label: string): void {
  const serialized = JSON.stringify(value);
  assert(typeof serialized === "string" && serialized.length > 0, `${label}: JSON serialization failed.`);
  const parsed = JSON.parse(serialized);
  assert(parsed !== undefined, `${label}: JSON parse failed.`);

  const visit = (item: unknown, path: string): void => {
    assert(typeof item !== "bigint", `${label}: bigint leaked at ${path}.`);
    if (Array.isArray(item)) {
      item.forEach((entry, index) => visit(entry, `${path}[${index}]`));
      return;
    }
    if (item && typeof item === "object") {
      for (const [key, entry] of Object.entries(item)) visit(entry, `${path}.${key}`);
    }
  };
  visit(value, "$root");
}

function assertThrows(action: () => unknown, label: string): void {
  let rejected = false;
  try {
    action();
  } catch {
    rejected = true;
  }
  assert(rejected, `${label}: invalid request did not fail closed.`);
}

function assertLockedResponse(response: any, label: string): void {
  assert(response.generationContext.packageId === "INT-001", `${label}: package mismatch.`);
  assert(response.generationContext.canonicalProblemId === "INT-CP-001", `${label}: CP mismatch.`);
  assert(response.generationContext.stagingStatus === "ACTIVE_STAGING", `${label}: staging status mismatch.`);
  assert(response.generationContext.registrationStatus === "NOT_REGISTERED", `${label}: registration status changed.`);
  assert(response.generationContext.preRegistrationOnly === true, `${label}: pre-registration marker missing.`);
  assert(response.generationContext.questionStudioDiscoverable === false, `${label}: discoverability opened.`);
  assert(response.generationContext.questionBankStatus === "NOT_STORED", `${label}: storage gate opened.`);
  assert(response.generationContext.testEligibility === "INELIGIBLE", `${label}: test gate opened.`);
  assert(response.generationContext.publiclyPublishable === false, `${label}: publication gate opened.`);
  assert(response.questions.length === response.generationContext.count, `${label}: question count mismatch.`);
  assert(response.questionPackages.length === response.questions.length, `${label}: package count mismatch.`);
  assert(response.envelopes.length === response.questions.length, `${label}: envelope count mismatch.`);

  for (const [index, question] of response.questions.entries()) {
    assert(question.packageId === "INT-001", `${label}/${index}: preview package mismatch.`);
    assert(question.canonicalProblemId === "INT-CP-001", `${label}/${index}: preview CP mismatch.`);
    assert(question.registrationStatus === "NOT_REGISTERED", `${label}/${index}: preview registration changed.`);
    assert(question.preRegistrationOnly === true, `${label}/${index}: preview pre-registration marker missing.`);
    assert(question.questionStudioDiscoverable === false, `${label}/${index}: preview became discoverable.`);
    assert(question.questionBankStatus === "NOT_STORED", `${label}/${index}: preview storage gate opened.`);
    assert(question.testEligibility === "INELIGIBLE", `${label}/${index}: preview test gate opened.`);
    assert(question.publiclyPublishable === false, `${label}/${index}: preview publication gate opened.`);
    assert(Array.isArray(question.options) && question.options.length === 4, `${label}/${index}: option shape invalid.`);
    assert(new Set(question.options).size === 4, `${label}/${index}: duplicate options.`);
    assert(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4, `${label}/${index}: correct index invalid.`);
    assert(question.answer === question.options[question.correctIndex], `${label}/${index}: answer mismatch.`);
    assert(typeof question.explanation === "string" && question.explanation.length > 0, `${label}/${index}: explanation missing.`);
    assert(question.selectorTrace.selectorAttempts >= 1 && question.selectorTrace.selectorAttempts <= 96, `${label}/${index}: selector attempts invalid.`);
    assert(question.selectorTrace.providerGenerationAttempts >= 1 && question.selectorTrace.providerGenerationAttempts <= 32, `${label}/${index}: provider attempts invalid.`);
    assert(question.selectorTrace.selectedQlId === question.patternId, `${label}/${index}: selected QL trace mismatch.`);
  }
}

const centralBefore = listQuantV4Packages();
assert(
  !centralBefore.some((item) => String(item.packageId) === "INT-001"),
  "INT-001 is already present in the central Question Studio registry.",
);

const capability = INT_CP001_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY;
assert(capability.packageId === "INT-001", "Capability package mismatch.");
assert(capability.enabled === true, "Capability is not active staging.");
assert(capability.stagingStatus === "ACTIVE_STAGING", "Capability staging status mismatch.");
assert(capability.registrationStatus === "NOT_REGISTERED", "Capability is registered.");
assert(capability.questionStudioDiscoverable === false, "Capability is discoverable.");
assert(capability.preRegistrationOnly === true, "Capability pre-registration marker missing.");
assert(capability.qlIds.length === 21, "Capability QL inventory mismatch.");
assert(stable(capability.supportedLanguages) === stable(["en", "hi", "pa"]), "Capability languages mismatch.");
assert(stable(capability.supportedDifficulties) === stable(["easy", "medium", "hard"]), "Capability difficulties mismatch.");
assert(capability.difficultySelection.scope === "PACKAGE_LEVEL_STATE_DERIVED", "Difficulty scope is overstated.");
assert(capability.difficultySelection.explicitPatternPolicy === "BEST_EFFORT_FAIL_CLOSED", "Explicit-pattern difficulty policy mismatch.");

const counters = {
  directRequests: 0,
  deterministicRequests: 0,
  jsonSerializationChecks: 0,
  lifecycleChecks: 0,
  crossLanguageParityChecks: 0,
  explicitDifficultySupportedChecks: 0,
  explicitDifficultyUnsupportedChecks: 0,
  packageDifficultyChecks: 0,
  selectorAliasChecks: 0,
  batchBoundaryChecks: 0,
  invalidRequestChecks: 0,
  maximumDifficultySelectorAttempts: 1,
  maximumProviderGenerationAttempts: 1,
};
const difficultySupport = Object.fromEntries(
  INT_CP001_FINAL_QL_IDS.map((qlId) => [qlId, [] as string[]]),
) as Record<string, string[]>;

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  const byLanguage = new Map<string, any>();
  for (const language of LANGUAGES) {
    const request = {
      packageId: "INT-001",
      canonicalProblemId: "INT-CP-001",
      patternId: qlId,
      language,
      seed: `int-cp001-pre-registration-direct:${qlId}`,
      count: 1,
    } as const;
    const response = runIntCp001QuestionStudioPreRegistration(request);
    const replay = runIntCp001QuestionStudioPreRegistration(request);
    assert(stable(response) === stable(replay), `${qlId}/${language}: request is not deterministic.`);
    assertLockedResponse(response, `${qlId}/${language}`);
    assertJsonSafe(response, `${qlId}/${language}`);
    assert(response.questionPackages[0].qlId === qlId, `${qlId}/${language}: explicit pattern selection failed.`);
    assert(response.generationContext.language === language, `${qlId}/${language}: language selector failed.`);
    assert(response.generationContext.difficultySelectionScope === "EXPLICIT_PATTERN_BEST_EFFORT_FAIL_CLOSED", `${qlId}/${language}: explicit-pattern scope missing.`);
    counters.directRequests += 1;
    counters.deterministicRequests += 1;
    counters.jsonSerializationChecks += 1;
    counters.lifecycleChecks += 1;
    counters.maximumDifficultySelectorAttempts = Math.max(
      counters.maximumDifficultySelectorAttempts,
      response.questions[0].selectorTrace.selectorAttempts,
    );
    counters.maximumProviderGenerationAttempts = Math.max(
      counters.maximumProviderGenerationAttempts,
      response.questions[0].selectorTrace.providerGenerationAttempts,
    );
    byLanguage.set(language, response.questionPackages[0]);
  }

  const english = byLanguage.get("en");
  for (const language of ["hi", "pa"] as const) {
    const localized = byLanguage.get(language);
    assert(
      stable(localized.optionAudit.map((item: any) => item.result))
        === stable(english.optionAudit.map((item: any) => item.result)),
      `${qlId}/${language}: option-value parity failed.`,
    );
    assert(localized.correctIndex === english.correctIndex, `${qlId}/${language}: answer-index parity failed.`);
    assert(localized.mathematicalFingerprint === english.mathematicalFingerprint, `${qlId}/${language}: fingerprint parity failed.`);
    counters.crossLanguageParityChecks += 1;
  }
}

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (const difficulty of DIFFICULTIES) {
    try {
      const response = runIntCp001QuestionStudioPreRegistration({
        archetypeId: "INT-001",
        cpId: "INT-CP-001",
        patternId: qlId,
        questionLanguageId: "en-IN",
        difficulty,
        seed: `int-cp001-pre-registration-difficulty:${qlId}:${difficulty}`,
        count: 1,
      });
      assertLockedResponse(response, `${qlId}/${difficulty}`);
      assert(response.questions[0].difficulty === difficulty, `${qlId}/${difficulty}: difficulty selection failed.`);
      assert(response.questions[0].selectorTrace.requestedDifficulty === difficulty, `${qlId}/${difficulty}: difficulty trace missing.`);
      assert(response.generationContext.difficultySelectionScope === "EXPLICIT_PATTERN_BEST_EFFORT_FAIL_CLOSED", `${qlId}/${difficulty}: explicit scope mismatch.`);
      assertJsonSafe(response, `${qlId}/${difficulty}`);
      difficultySupport[qlId].push(difficulty);
      counters.explicitDifficultySupportedChecks += 1;
      counters.jsonSerializationChecks += 1;
      counters.maximumDifficultySelectorAttempts = Math.max(
        counters.maximumDifficultySelectorAttempts,
        response.questions[0].selectorTrace.selectorAttempts,
      );
      counters.maximumProviderGenerationAttempts = Math.max(
        counters.maximumProviderGenerationAttempts,
        response.questions[0].selectorTrace.providerGenerationAttempts,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      assert(message.includes("unable to satisfy difficulty"), `${qlId}/${difficulty}: unexpected explicit-difficulty failure: ${message}`);
      counters.explicitDifficultyUnsupportedChecks += 1;
    }
  }
  assert(difficultySupport[qlId].length >= 1, `${qlId}: no supported difficulty band discovered.`);
}

for (const difficulty of DIFFICULTIES) {
  assert(
    Object.values(difficultySupport).some((supported) => supported.includes(difficulty)),
    `${difficulty}: no compatible QL exists at package level.`,
  );
}

const selectorAliases = [
  runIntCp001QuestionStudioPreRegistration({
    packageId: "INT-001",
    topic: "Arithmetic",
    subtopic: "Simple Interest",
    patternId: "INT-CP-001",
    language: "English",
    seed: "int-cp001-pre-registration-alias:package",
    count: 7,
  }),
  runIntCp001QuestionStudioPreRegistration({
    archetypeId: "INT-001",
    canonicalProblemId: "INT-CP-001",
    questionLanguageId: "hi-IN",
    seed: "int-cp001-pre-registration-alias:archetype",
    count: 7,
  }),
  runIntCp001QuestionStudioPreRegistration({
    topic: "Interest",
    subtopic: "Interest",
    cpId: "INT-CP-001",
    questionLanguageId: "pa-IN",
    seed: "int-cp001-pre-registration-alias:topic",
    count: 7,
  }),
];
for (const [index, response] of selectorAliases.entries()) {
  assertLockedResponse(response, `selector-alias-${index + 1}`);
  assertJsonSafe(response, `selector-alias-${index + 1}`);
  counters.selectorAliasChecks += 1;
  counters.jsonSerializationChecks += 1;
}

for (const difficulty of DIFFICULTIES) {
  const response = runIntCp001QuestionStudioPreRegistration({
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-001",
    language: "en",
    difficulty,
    seed: `int-cp001-pre-registration-batch-difficulty:${difficulty}`,
    count: 21,
  });
  assertLockedResponse(response, `batch-${difficulty}`);
  assert(response.generationContext.difficultySelectionScope === "PACKAGE_LEVEL_STATE_DERIVED", `batch-${difficulty}: package difficulty scope mismatch.`);
  assert(response.questions.every((question: any) => question.difficulty === difficulty), `batch-${difficulty}: mixed difficulty output.`);
  assert(new Set(response.questionPackages.map((question: any) => question.qlId)).size >= 1, `batch-${difficulty}: no QL selected.`);
  assertJsonSafe(response, `batch-${difficulty}`);
  counters.packageDifficultyChecks += response.questions.length;
  counters.batchBoundaryChecks += 1;
  counters.jsonSerializationChecks += 1;
}

const maximumBatch = runIntCp001QuestionStudioPreRegistration({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-001",
  language: "en",
  seed: "int-cp001-pre-registration-maximum-batch",
  count: 1000,
});
assertLockedResponse(maximumBatch, "maximum-batch");
assert(maximumBatch.questions.length === 1000, "Maximum batch size was not honoured.");
assertJsonSafe(maximumBatch, "maximum-batch");
counters.batchBoundaryChecks += 1;
counters.jsonSerializationChecks += 1;

const invalidRequests: Array<() => unknown> = [
  () => runIntCp001QuestionStudioPreRegistration({ packageId: "PCT-001", seed: "x" }),
  () => runIntCp001QuestionStudioPreRegistration({ archetypeId: "INT-999", seed: "x" }),
  () => runIntCp001QuestionStudioPreRegistration({ canonicalProblemId: "INT-CP-999", seed: "x" }),
  () => runIntCp001QuestionStudioPreRegistration({ patternId: "INT-QL-999", seed: "x" }),
  () => runIntCp001QuestionStudioPreRegistration({ topic: "Geometry", seed: "x" }),
  () => runIntCp001QuestionStudioPreRegistration({ subtopic: "Compound Interest", seed: "x" }),
  () => runIntCp001QuestionStudioPreRegistration({ language: "fr", seed: "x" }),
  () => runIntCp001QuestionStudioPreRegistration({ language: "hi", questionLanguageId: "pa-IN", seed: "x" }),
  () => runIntCp001QuestionStudioPreRegistration({ difficulty: "Expert", seed: "x" }),
  () => runIntCp001QuestionStudioPreRegistration({ seed: "" }),
  () => runIntCp001QuestionStudioPreRegistration({ seed: "x", count: 0 }),
  () => runIntCp001QuestionStudioPreRegistration({ seed: "x", count: 1001 }),
  () => runIntCp001QuestionStudioPreRegistration({ seed: "x", count: 1.5 }),
];
for (const [index, invalid] of invalidRequests.entries()) {
  assertThrows(invalid, `invalid-${index + 1}`);
  counters.invalidRequestChecks += 1;
}

const centralAfter = listQuantV4Packages();
assert(stable(centralAfter) === stable(centralBefore), "Central Quant V4 registry changed during pre-registration audit.");
assert(
  !centralAfter.some((item) => String(item.packageId) === "INT-001"),
  "INT-001 was centrally registered by the pre-registration adapter.",
);

console.log(JSON.stringify({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-001",
  providerId: "INT-001:INT-CP-001:APPROVED-ACTIVE-STAGING-V3",
  adapterStatus: "PRE_REGISTRATION_CONTRACT_READY",
  difficultyPolicy: capability.difficultySelection,
  difficultySupport,
  ...counters,
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  languages: LANGUAGES,
  packageLevelDifficulties: DIFFICULTIES,
  maximumBatchSizeProved: 1000,
  centralRegistryContainsInt001: false,
  enabled: true,
  stagingStatus: "ACTIVE_STAGING",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP001_QUESTION_STUDIO_PRE_REGISTRATION_CONTRACT");
