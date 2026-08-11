import { listQuantV4Packages } from "../../../../../generation-engine";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import {
  generateIntCp001ApprovedInactiveBatch,
  generateIntCp001ApprovedInactiveEnvelope,
  INT_CP001_APPROVED_INACTIVE_PROVIDER_V2,
  toIntCp001ApprovedInactivePreview,
  type IntCp001ApprovedInactiveLanguage,
} from "./cp001-approved-inactive-release-provider-v2";
import { stableBigIntJson } from "./cp001-localization-foundation";
import { compareRational } from "./foundation/rational";
import { isRational } from "./cp001-localization-foundation";

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

const languages: readonly IntCp001ApprovedInactiveLanguage[] = ["en", "hi", "pa"];
const expectedReleaseIds = {
  en: "INT-CP-001-EN-v5",
  hi: "INT-CP-001-HI-v4",
  pa: "INT-CP-001-PA-v4",
} as const;

if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.enabled) fail("Approved inactive provider V2 is enabled.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.registrationStatus !== "NOT_REGISTERED") fail("Provider registration status is unsafe.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.questionStudioDiscoverable) fail("Provider is Question Studio discoverable.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.questionBankStatus !== "NOT_STORED") fail("Provider is Question Bank writable.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.testEligibility !== "INELIGIBLE") fail("Provider is test eligible.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.publiclyPublishable) fail("Provider is publicly publishable.");
if (INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.qlIds.length !== 21) fail("Provider does not expose all 21 QLs internally.");
if (new Set(INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.qlIds).size !== 21) fail("Provider has duplicate QLs.");

const registered = listQuantV4Packages().find((pkg) => String(pkg.packageId) === "INT-001");
if (registered) fail("INT-001 is present in the central Question Studio package list before activation approval.");

let directPackages = 0;
let deterministicEnvelopeChecks = 0;
let deterministicPreviewChecks = 0;
let approvedReleaseChecks = 0;
let approvedLifecycleChecks = 0;
let productionShapeChecks = 0;
let richStemChecks = 0;
let distractorChecks = 0;
let proximityTraceChecks = 0;
let retainedConceptDistractors = 0;
let generatedNearMisses = 0;
let multilingualParityChecks = 0;
const qlCoverage = Object.fromEntries(languages.map((language) => [language, new Set<string>()])) as Record<IntCp001ApprovedInactiveLanguage, Set<string>>;
const answerPositions = Object.fromEntries(languages.map((language) => [language, [0, 0, 0, 0]])) as Record<IntCp001ApprovedInactiveLanguage, number[]>;
const distinctStems = Object.fromEntries(languages.map((language) => [language, new Set<string>()])) as Record<IntCp001ApprovedInactiveLanguage, Set<string>>;

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (let index = 0; index < 60; index += 1) {
    const seed = `approved-inactive-v2-${index}`;
    const byLanguage = new Map<IntCp001ApprovedInactiveLanguage, ReturnType<typeof generateIntCp001ApprovedInactiveEnvelope>>();

    for (const language of languages) {
      const envelope = generateIntCp001ApprovedInactiveEnvelope({ qlId, language, seed });
      const repeat = generateIntCp001ApprovedInactiveEnvelope({ qlId, language, seed });
      byLanguage.set(language, envelope);
      if (stableBigIntJson(envelope) !== stableBigIntJson(repeat)) {
        fail(`${qlId}/${seed}/${language} envelope is not deterministic.`);
      }
      deterministicEnvelopeChecks += 1;

      const preview = toIntCp001ApprovedInactivePreview(envelope, {
        questionIndex: index + 1,
        questionCount: 60,
      });
      const repeatPreview = toIntCp001ApprovedInactivePreview(repeat, {
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
      if (envelope.trace.releaseId !== question.releaseId) fail(`${qlId}/${seed}/${language} release trace is out of sync.`);
      if (envelope.trace.registrationStatus !== "NOT_REGISTERED") fail(`${qlId}/${seed}/${language} was registered during inactive proof.`);
      approvedReleaseChecks += 1;

      if (
        question.maturity !== "APPROVED_CLOSE_DISTRACTOR_CONTRACT"
        || question.reviewStatus !== "APPROVED_CLOSE_DISTRACTOR_CONTRACT"
        || question.localeReviewStatus !== "APPROVED_HUMAN_REVIEW"
        || question.questionBankStatus !== "NOT_STORED"
        || question.testEligibility !== "INELIGIBLE"
        || question.publiclyPublishable
        || question.questionStudioDiscoverable
      ) {
        fail(`${qlId}/${seed}/${language} approved lifecycle or delivery lock is invalid.`);
      }
      approvedLifecycleChecks += 1;

      if (question.stem.includes("**")) fail(`${qlId}/${seed}/${language} contains raw Markdown emphasis.`);
      if (question.stemPresentation.plainText !== question.stem) fail(`${qlId}/${seed}/${language} plain stem presentation drifted.`);
      if (!question.stemPresentation.richTextHtml.startsWith("<p>")) fail(`${qlId}/${seed}/${language} rich stem is not a paragraph.`);
      if (question.stemPresentation.emphasisSpans.length < 2) fail(`${qlId}/${seed}/${language} lacks scan anchors.`);
      for (const span of question.stemPresentation.emphasisSpans) {
        if (question.stem.slice(span.start, span.end) !== span.text) fail(`${qlId}/${seed}/${language} emphasis span '${span.text}' is out of sync.`);
      }
      richStemChecks += 1;

      if (question.options.length !== 4 || new Set(question.options).size !== 4) fail(`${qlId}/${seed}/${language} lacks four unique options.`);
      if (question.correctIndex < 0 || question.correctIndex > 3) fail(`${qlId}/${seed}/${language} has invalid correct index.`);
      if (question.optionAudit[question.correctIndex]?.misconceptionId !== "CORRECT") fail(`${qlId}/${seed}/${language} lost correct-option ownership.`);
      if (question.explanation.trapAnalysis.items.length !== 3) fail(`${qlId}/${seed}/${language} lacks three distractor explanations.`);

      const correctValue = question.optionAudit[question.correctIndex]?.result.value;
      if (!isRational(correctValue)) fail(`${qlId}/${seed}/${language} correct option is not rational.`);
      const wrongAudits = question.optionAudit.filter((_audit, optionIndex) => optionIndex !== question.correctIndex);
      const hasLower = wrongAudits.some((audit) => isRational(audit.result.value) && compareRational(audit.result.value, correctValue) < 0);
      const hasUpper = wrongAudits.some((audit) => isRational(audit.result.value) && compareRational(audit.result.value, correctValue) > 0);
      if (!hasLower || !hasUpper) fail(`${qlId}/${seed}/${language} distractors do not bracket the answer.`);
      if (!question.distractorEditorialTrace.hasLowerDistractor || !question.distractorEditorialTrace.hasUpperDistractor) {
        fail(`${qlId}/${seed}/${language} proximity trace lost bracketing.`);
      }

      for (const audit of wrongAudits) {
        distractorChecks += 1;
        if (!isRational(audit.result.value)) fail(`${qlId}/${seed}/${language} wrong option is not rational.`);
        if (audit.proximityOrigin === "RETAINED_CONCEPT_TRAP") {
          retainedConceptDistractors += 1;
          if (audit.relativeDistanceBps > 1500) fail(`${qlId}/${seed}/${language} retained concept trap exceeds 15%.`);
        } else if (audit.proximityOrigin === "GENERATED_NEAR_MISS") {
          generatedNearMisses += 1;
        } else {
          fail(`${qlId}/${seed}/${language} wrong option has invalid proximity origin ${audit.proximityOrigin}.`);
        }
      }
      proximityTraceChecks += 1;

      for (const trap of question.explanation.trapAnalysis.items) {
        if (trap.optionNumber - 1 === question.correctIndex) fail(`${qlId}/${seed}/${language} analyses the correct option as a trap.`);
        if (trap.optionText !== question.options[trap.optionNumber - 1]) fail(`${qlId}/${seed}/${language} trap text is out of sync.`);
      }

      if (preview.text !== question.stem || preview.stem !== question.stem) fail(`${qlId}/${seed}/${language} preview stem drifted.`);
      if (preview.stemHtml !== question.stemPresentation.richTextHtml) fail(`${qlId}/${seed}/${language} preview rich stem drifted.`);
      if (stableBigIntJson(preview.emphasisSpans) !== stableBigIntJson(question.stemPresentation.emphasisSpans)) fail(`${qlId}/${seed}/${language} preview spans drifted.`);
      if (stableBigIntJson(preview.options) !== stableBigIntJson(question.options)) fail(`${qlId}/${seed}/${language} preview options drifted.`);
      if (preview.correctIndex !== question.correctIndex || preview.correct !== question.correctIndex) fail(`${qlId}/${seed}/${language} preview answer index drifted.`);
      if (preview.packageId !== "INT-001" || preview.patternId !== qlId || preview.canonicalProblemId !== "INT-CP-001") fail(`${qlId}/${seed}/${language} preview identity is invalid.`);
      if (preview.language !== language || preview.releaseId !== question.releaseId) fail(`${qlId}/${seed}/${language} preview language/release is invalid.`);
      if (preview.runtimeMode !== "APPROVED_CLOSE_DISTRACTOR_INACTIVE_RELEASE_PROOF" || preview.registrationStatus !== "NOT_REGISTERED") fail(`${qlId}/${seed}/${language} preview runtime status is unsafe.`);
      if (preview.maturity !== "APPROVED_CLOSE_DISTRACTOR_CONTRACT" || preview.reviewStatus !== "APPROVED_CLOSE_DISTRACTOR_CONTRACT") fail(`${qlId}/${seed}/${language} preview approval status drifted.`);
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

    const english = byLanguage.get("en")!.question;
    for (const language of ["hi", "pa"] as const) {
      const localized = byLanguage.get(language)!.question;
      if (localized.correctIndex !== english.correctIndex) fail(`${qlId}/${seed}/${language} correct index drifted from English.`);
      const englishValues = english.optionAudit.map((audit) => stableBigIntJson(audit.result));
      const localizedValues = localized.optionAudit.map((audit) => stableBigIntJson(audit.result));
      if (stableBigIntJson(localizedValues) !== stableBigIntJson(englishValues)) {
        fail(`${qlId}/${seed}/${language} option values or positions drifted from English.`);
      }
      multilingualParityChecks += 1;
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
    const request = { language, seed: `approved-batch-v2-${index}`, count: 42 } as const;
    const batch = generateIntCp001ApprovedInactiveBatch(request);
    const repeat = generateIntCp001ApprovedInactiveBatch(request);
    if (stableBigIntJson(batch) !== stableBigIntJson(repeat)) fail(`${language}/approved-batch-v2-${index} is not deterministic.`);
    batchDeterministicChecks += 1;
    if (batch.questionPackages.length !== 42 || batch.questions.length !== 42 || batch.envelopes.length !== 42) {
      fail(`${language}/approved-batch-v2-${index} has incorrect batch cardinality.`);
    }
    if (new Set(batch.envelopes.map((item) => item.trace.qlId)).size !== 21) {
      fail(`${language}/approved-batch-v2-${index} did not cover all 21 QLs in a 42-item batch.`);
    }
    if (batch.generationContext.registrationStatus !== "NOT_REGISTERED" || batch.generationContext.questionStudioDiscoverable) {
      fail(`${language}/approved-batch-v2-${index} breached inactive registration status.`);
    }
    batchRuns += 1;
    batchPackages += batch.questionPackages.length;
  }

  const explicit = generateIntCp001ApprovedInactiveBatch({
    language,
    seed: `approved-explicit-${language}`,
    count: 5,
    qlId: "INT-QL-021",
  });
  if (explicit.envelopes.some((item) => item.trace.qlId !== "INT-QL-021")) fail(`${language} explicit QL selection drifted.`);
}

const minimumBatch = generateIntCp001ApprovedInactiveBatch({ language: "en", seed: "approved-minimum-count", count: 0 });
if (minimumBatch.questionPackages.length !== 1) fail("Provider did not clamp a non-positive count to one.");

expectThrow("missing seed", () => generateIntCp001ApprovedInactiveEnvelope({ qlId: "INT-QL-001", language: "en", seed: "" }));
expectThrow("unsupported language", () => generateIntCp001ApprovedInactiveEnvelope({ qlId: "INT-QL-001", language: "fr" as IntCp001ApprovedInactiveLanguage, seed: "invalid-language" }));
expectThrow("unknown QL", () => generateIntCp001ApprovedInactiveEnvelope({ qlId: "INT-QL-999" as typeof INT_CP001_FINAL_QL_IDS[number], language: "en", seed: "invalid-ql" }));
expectThrow("batch missing seed", () => generateIntCp001ApprovedInactiveBatch({ language: "en", seed: "", count: 1 }));

console.log(JSON.stringify({
  status: "PASS_INT_CP001_APPROVED_INACTIVE_RELEASE_V2",
  providerId: INT_CP001_APPROVED_INACTIVE_PROVIDER_V2.providerId,
  packageId: "INT-001",
  cpId: "INT-CP-001",
  qlCount: 21,
  languages,
  directPackages,
  deterministicEnvelopeChecks,
  deterministicPreviewChecks,
  approvedReleaseChecks,
  approvedLifecycleChecks,
  productionShapeChecks,
  richStemChecks,
  distractorChecks,
  proximityTraceChecks,
  retainedConceptDistractors,
  generatedNearMisses,
  multilingualParityChecks,
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
