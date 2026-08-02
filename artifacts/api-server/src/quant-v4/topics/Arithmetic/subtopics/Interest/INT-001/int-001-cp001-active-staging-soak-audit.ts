import { createHash } from "node:crypto";
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

function stableJson(value: unknown): string {
  return JSON.stringify(value);
}

function digest(value: unknown): string {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}

function assertLifecycle(response: any, label: string): void {
  const capability = response.capability;
  const context = response.generationContext;
  assert(capability.enabled === true, `${label}: staging capability must remain enabled`);
  assert(capability.stagingStatus === "ACTIVE_STAGING", `${label}: staging status drift`);
  assert(capability.registrationStatus === "NOT_REGISTERED", `${label}: registration drift`);
  assert(capability.questionStudioDiscoverable === false, `${label}: discoverability drift`);
  assert(capability.preRegistrationOnly === true, `${label}: pre-registration lock drift`);
  assert(capability.questionBankStatus === "NOT_STORED", `${label}: storage drift`);
  assert(capability.testEligibility === "INELIGIBLE", `${label}: test eligibility drift`);
  assert(capability.publiclyPublishable === false, `${label}: publication drift`);
  assert(context.registrationStatus === "NOT_REGISTERED", `${label}: response registration drift`);
  assert(context.questionStudioDiscoverable === false, `${label}: response discoverability drift`);
  assert(context.preRegistrationOnly === true, `${label}: response pre-registration drift`);
  assert(context.questionBankStatus === "NOT_STORED", `${label}: response storage drift`);
  assert(context.testEligibility === "INELIGIBLE", `${label}: response test drift`);
  assert(context.publiclyPublishable === false, `${label}: response publication drift`);
}

function assertShape(response: any, expectedCount: number, label: string): void {
  assert(Array.isArray(response.questions), `${label}: questions missing`);
  assert(Array.isArray(response.questionPackages), `${label}: questionPackages missing`);
  assert(Array.isArray(response.envelopes), `${label}: envelopes missing`);
  assert(response.questions.length === expectedCount, `${label}: questions count mismatch`);
  assert(response.questionPackages.length === expectedCount, `${label}: packages count mismatch`);
  assert(response.envelopes.length === expectedCount, `${label}: envelopes count mismatch`);
  assert(!stableJson(response).includes("[object Object]"), `${label}: malformed serialized value`);
}

const centralBeforePackages = listQuantV4Packages();
const centralBefore = stableJson(centralBeforePackages);
assert(
  !centralBeforePackages.some((item) => String(item.packageId) === "INT-001"),
  "INT-001 is already present in the central Quant V4 registry before soak execution",
);

let largeBatchRuns = 0;
let largeBatchQuestions = 0;
let replayChecks = 0;
let lifecycleChecks = 0;
let jsonChecks = 0;
let explicitQlRuns = 0;
let explicitQlQuestions = 0;
let parityChecks = 0;
let maximumSelectorAttempts = 0;
let maximumProviderAttempts = 0;
const languageDigests: Record<string, string[]> = { en: [], hi: [], pa: [] };

for (const language of LANGUAGES) {
  for (const difficulty of DIFFICULTIES) {
    const request = {
      packageId: "INT-001",
      canonicalProblemId: "INT-CP-001",
      language,
      difficulty,
      seed: `active-staging-soak-v1:${language}:${difficulty}`,
      count: 1000,
    } as const;

    const first = runIntCp001QuestionStudioPreRegistration(request);
    const second = runIntCp001QuestionStudioPreRegistration(request);
    const label = `${language}/${difficulty}/1000`;

    assertShape(first, 1000, label);
    assertLifecycle(first, label);
    assert(digest(first) === digest(second), `${label}: deterministic replay mismatch`);
    assert(stableJson(first) === stableJson(second), `${label}: byte replay mismatch`);

    for (const question of (first as any).questions) {
      const trace = question.selectorTrace;
      assert(trace, `${label}: selector trace missing`);
      maximumSelectorAttempts = Math.max(maximumSelectorAttempts, Number(trace.selectorAttempts ?? 0));
      maximumProviderAttempts = Math.max(maximumProviderAttempts, Number(trace.providerGenerationAttempts ?? 0));
      assert(Number(trace.selectorAttempts) >= 1 && Number(trace.selectorAttempts) <= 96, `${label}: selector attempts out of range`);
      assert(Number(trace.providerGenerationAttempts) >= 1 && Number(trace.providerGenerationAttempts) <= 32, `${label}: provider attempts out of range`);
    }

    languageDigests[language].push(digest((first as any).questionPackages));
    largeBatchRuns += 1;
    largeBatchQuestions += 1000;
    replayChecks += 2;
    lifecycleChecks += 1;
    jsonChecks += 1;
  }
}

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  const packagesByLanguage: Record<string, any[]> = {};
  for (const language of LANGUAGES) {
    const response = runIntCp001QuestionStudioPreRegistration({
      packageId: "INT-001",
      patternId: qlId,
      language,
      seed: `active-staging-soak-v1:${qlId}`,
      count: 25,
    });
    const label = `${qlId}/${language}/25`;
    assertShape(response, 25, label);
    assertLifecycle(response, label);
    packagesByLanguage[language] = (response as any).questionPackages;
    explicitQlRuns += 1;
    explicitQlQuestions += 25;
    lifecycleChecks += 1;
    jsonChecks += 1;
  }

  for (let index = 0; index < 25; index += 1) {
    const en = packagesByLanguage.en[index];
    const hi = packagesByLanguage.hi[index];
    const pa = packagesByLanguage.pa[index];
    assert(en.correctIndex === hi.correctIndex && en.correctIndex === pa.correctIndex, `${qlId}/${index}: correct-index parity drift`);
    assert(stableJson(en.options.map((option: any) => option.value)) === stableJson(hi.options.map((option: any) => option.value)), `${qlId}/${index}: Hindi option-value parity drift`);
    assert(stableJson(en.options.map((option: any) => option.value)) === stableJson(pa.options.map((option: any) => option.value)), `${qlId}/${index}: Punjabi option-value parity drift`);
    assert(stableJson(en.mathematicalFingerprint) === stableJson(hi.mathematicalFingerprint), `${qlId}/${index}: Hindi fingerprint parity drift`);
    assert(stableJson(en.mathematicalFingerprint) === stableJson(pa.mathematicalFingerprint), `${qlId}/${index}: Punjabi fingerprint parity drift`);
    parityChecks += 2;
  }
}

assert(INT_CP001_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY.registrationStatus === "NOT_REGISTERED", "capability registration lock changed");
assert(INT_CP001_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY.questionStudioDiscoverable === false, "capability discoverability lock changed");
assert(maximumSelectorAttempts <= 96, "selector attempt ceiling exceeded");
assert(maximumProviderAttempts <= 32, "provider attempt ceiling exceeded");

const centralAfterPackages = listQuantV4Packages();
const centralAfter = stableJson(centralAfterPackages);
assert(
  !centralAfterPackages.some((item) => String(item.packageId) === "INT-001"),
  "INT-001 entered the central Quant V4 registry during soak execution",
);
assert(centralAfter === centralBefore, "Central Quant V4 registry changed during soak execution");

const summary = {
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-001",
  auditId: "INT-CP-001-ACTIVE-STAGING-SOAK-V1",
  largeBatchRuns,
  largeBatchQuestions,
  explicitQlRuns,
  explicitQlQuestions,
  totalQuestions: largeBatchQuestions + explicitQlQuestions,
  replayChecks,
  lifecycleChecks,
  jsonChecks,
  parityChecks,
  centralRegistryChecks: 3,
  centralRegistryDigestBefore: digest(centralBeforePackages),
  centralRegistryDigestAfter: digest(centralAfterPackages),
  maximumSelectorAttempts,
  maximumProviderAttempts,
  languageBatchDigests: languageDigests,
  enabled: true,
  stagingStatus: "ACTIVE_STAGING",
  registrationStatus: "NOT_REGISTERED",
  centralRegistryContainsInt001: false,
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
};

console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP001_ACTIVE_STAGING_SOAK_V1");
