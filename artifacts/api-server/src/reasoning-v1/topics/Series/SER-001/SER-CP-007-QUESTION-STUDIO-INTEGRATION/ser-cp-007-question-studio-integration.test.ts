import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  generateReasoningV1Questions,
  listReasoningV1Packages,
  REASONING_V1_LANGUAGES,
} from "../../../../generation-engine";
import {
  SER_CP007_FROZEN_TEMPLATE_AUTHORITIES,
} from "../SER-CP-007-ENGLISH-FREEZE/ser-cp-007-english-freeze-authority";
import {
  generateSerCp007QuestionStudioReviewSweep,
  SER_CP007_QUESTION_STUDIO_RUNTIME_STATE,
} from "./ser-cp-007-question-studio-runtime";
import {
  SER_CP007_PERMANENT_QL_IDS,
} from "../SER-PERMANENT-QL-REGISTRY";

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";
const {
  assertGeneratedQuestionBankEligible,
  getGeneratedQuestionBankEligibilityIssue,
} = await import("../../../../../lib/admin-question-conversion");

const packages = listReasoningV1Packages();
assert.equal(packages.length, 1);
const series = packages[0]!;
assert.equal(series.packageId, "SER-001");
assert.equal(series.enabled, true);
assert.equal(series.active, true);
assert.equal(series.questionStudioDiscoverable, true);
assert.equal(series.generationDomain, "reasoning-v1");
assert.deepEqual(series.cpIds, ["SER-CP-007"]);
assert.deepEqual(series.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(series.supportedRuntimeModes, ["FROZEN_REVIEW"]);
assert.deepEqual(series.permanentQlIds, [...SER_CP007_PERMANENT_QL_IDS]);
assert.equal(series.frozenTemplateCount, 140);
assert.equal(series.questionBankStatus, "NOT_STORED");
assert.equal(series.questionBankWritable, false);
assert.equal(series.testEligibility, "INELIGIBLE");
assert.equal(series.testEligible, false);
assert.equal(series.publiclyPublishable, false);

assert.deepEqual(SER_CP007_QUESTION_STUDIO_RUNTIME_STATE, {
  authority: "SER_CP007_QUESTION_STUDIO_REVIEW_RUNTIME_V1",
  packageId: "SER-001",
  canonicalProblemId: "SER-CP-007",
  runtimeMode: "FROZEN_REVIEW",
  reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
  active: true,
  questionStudioDiscoverable: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  publiclyPublishable: false,
});

const sweep = generateSerCp007QuestionStudioReviewSweep(97);
assert.equal(SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length, 140);
assert.equal(SER_CP007_PERMANENT_QL_IDS.length, 13);
assert.equal(sweep.length, 420);

const localeCounts = new Map<string, number>();
const localeQlCoverage = new Map<string, Set<string>>();
const identities = new Set<string>();
let optionProofs = 0;
let reviewActivationProofs = 0;
let downstreamLockProofs = 0;
let questionBankRejectionProofs = 0;
let localizedScriptProofs = 0;

for (const item of sweep) {
  const identity = `${item.temporaryTemplateId}:${item.seed}:${item.locale}`;
  assert.equal(identities.has(identity), false, `${identity}: duplicate`);
  identities.add(identity);

  localeCounts.set(item.locale, (localeCounts.get(item.locale) ?? 0) + 1);
  const qls = localeQlCoverage.get(item.locale) ?? new Set<string>();
  qls.add(item.permanentQlId);
  localeQlCoverage.set(item.locale, qls);

  assert.equal(item.packageId, "SER-001");
  assert.equal(item.canonicalProblemId, "SER-CP-007");
  assert.equal(item.topic, "Reasoning");
  assert.equal(item.subtopic, "Series");
  assert.equal(item.patternId, item.permanentQlId);
  assert.equal(item.options.length, 4);
  assert.equal(new Set(item.options).size, 4);
  assert.equal(item.options[item.correctIndex], item.canonicalAnswer);
  assert.equal(item.answer, item.canonicalAnswer);
  assert.equal(item.validation.valid, true);
  assert.equal(item.validation.ok, true);
  optionProofs += 1;

  assert.equal(item.runtimeMode, "FROZEN_REVIEW");
  assert.equal(item.reviewStatus, "APPROVED_MULTILINGUAL_FROZEN");
  assert.equal(item.integrationStatus, "QUESTION_STUDIO_ACTIVE_REVIEW_ONLY");
  assert.equal(item.active, true);
  assert.equal(item.questionStudioDiscoverable, true);
  assert.equal(item.generationContext.active, true);
  assert.equal(item.generationContext.questionStudioDiscoverable, true);
  assert.equal(item.generationContext.sourceLifecycle.active, false);
  assert.equal(
    item.generationContext.sourceLifecycle.questionStudioDiscoverable,
    false,
  );
  reviewActivationProofs += 1;

  assert.equal(item.questionBankStatus, "NOT_STORED");
  assert.equal(item.questionBankWritable, false);
  assert.equal(item.testEligibility, "INELIGIBLE");
  assert.equal(item.testEligible, false);
  assert.equal(item.publiclyPublishable, false);
  assert.equal(item.generationContext.questionBankStatus, "NOT_STORED");
  assert.equal(item.generationContext.questionBankWritable, false);
  assert.equal(item.generationContext.testEligibility, "INELIGIBLE");
  assert.equal(item.generationContext.testEligible, false);
  assert.equal(item.generationContext.publiclyPublishable, false);
  downstreamLockProofs += 1;

  assert.equal(
    getGeneratedQuestionBankEligibilityIssue(item),
    "questionBankStatus is NOT_STORED",
  );
  assert.throws(
    () => assertGeneratedQuestionBankEligible(item),
    /questionBankStatus is NOT_STORED/,
  );
  questionBankRejectionProofs += 1;

  if (item.language !== "en") {
    const script = item.language === "hi"
      ? /[\u0900-\u097F]/u
      : /[\u0A00-\u0A7F]/u;
    assert.ok(
      script.test(`${item.stem}\n${item.explanation}`),
      `${identity}: localized script missing`,
    );
    localizedScriptProofs += 1;
  }
}

for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
  assert.equal(localeCounts.get(locale), 140, `${locale}: template coverage`);
  assert.deepEqual(
    [...(localeQlCoverage.get(locale) ?? new Set<string>())].sort(),
    [...SER_CP007_PERMANENT_QL_IDS].sort(),
    `${locale}: permanent QL coverage`,
  );
}

const batchSizes: Record<string, number> = {};
let deterministicBatchProofs = 0;
let targetedQlProofs = 0;

for (const language of REASONING_V1_LANGUAGES) {
  const input = {
    packageId: "SER-001",
    count: 50,
    language,
    seed: `ser-question-studio:${language}`,
    runtimeMode: "FROZEN_REVIEW",
    canonicalProblemId: "SER-CP-007",
  } as const;
  const first = await generateReasoningV1Questions(input);
  const second = await generateReasoningV1Questions(input);
  assert.deepEqual(first.questionPackages, second.questionPackages);
  assert.equal(first.questions.length, 50);
  assert.equal(first.generationContext.generationDomain, "reasoning-v1");
  assert.equal(first.generationContext.active, true);
  assert.equal(first.generationContext.questionStudioDiscoverable, true);
  assert.equal(first.generationContext.questionBankStatus, "NOT_STORED");
  assert.equal(first.generationContext.testEligibility, "INELIGIBLE");
  assert.equal(first.generationContext.publiclyPublishable, false);
  batchSizes[language] = first.questions.length;
  deterministicBatchProofs += 1;

  for (const qlId of SER_CP007_PERMANENT_QL_IDS) {
    const targeted = await generateReasoningV1Questions({
      packageId: "SER-001",
      count: 1,
      language,
      seed: `ser-targeted:${language}:${qlId}`,
      runtimeMode: "FROZEN_REVIEW",
      canonicalProblemId: "SER-CP-007",
      questionLanguageId: qlId,
    });
    assert.equal(targeted.questions.length, 1);
    assert.equal(targeted.questions[0]!.permanentQlId, qlId);
    assert.equal(targeted.questions[0]!.language, language);
    targetedQlProofs += 1;
  }
}

await assert.rejects(
  () => generateReasoningV1Questions({
    packageId: "SER-001",
    runtimeMode: "DYNAMIC_CANDIDATE",
  }),
  /Unsupported SER-001 runtime mode/,
);
await assert.rejects(
  () => generateReasoningV1Questions({
    packageId: "SER-001",
    canonicalProblemId: "SER-CP-999",
  }),
  /Unknown canonical problem/,
);
await assert.rejects(
  () => generateReasoningV1Questions({
    packageId: "SER-001",
    questionLanguageId: "SER-QL-999",
  }),
  /Unknown SER-001 question-language ID/,
);

const seriesRoute = readFileSync(
  "src/routes/admin-question-studio-series.ts",
  "utf8",
);
const routeIndex = readFileSync("src/routes/index.ts", "utf8");
assert.match(seriesRoute, /listReasoningV1Packages/);
assert.match(seriesRoute, /listQuantV4Packages/);
assert.match(seriesRoute, /generationSystems: \["quant-v4", "reasoning-v1"\]/);
assert.match(seriesRoute, /asString\(req\.body\?\.packageId\) !== "SER-001"/);
assert.match(seriesRoute, /next\("route"\)/);
assert.match(seriesRoute, /'reasoning-v1'/);
assert.match(routeIndex, /adminQuestionStudioSeriesRouter/);
assert.ok(
  routeIndex.indexOf("adminQuestionStudioSeriesRouter")
    < routeIndex.indexOf("adminQuestionStudioRouter"),
  "Series router must be mounted before the legacy Quant-only router.",
);

console.log(JSON.stringify({
  status: "PASS_SER_CP007_QUESTION_STUDIO_INTEGRATION_COMPLETE",
  packageId: "SER-001",
  runtimeMode: "FROZEN_REVIEW",
  reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
  frozenTemplates: SER_CP007_FROZEN_TEMPLATE_AUTHORITIES.length,
  permanentQls: SER_CP007_PERMANENT_QL_IDS.length,
  locales: ["en-IN", "hi-IN", "pa-IN"],
  liveReviewPayloads: sweep.length,
  payloadsPerLocale: Object.fromEntries(localeCounts),
  permanentQlCoveragePerLocale: Object.fromEntries(
    [...localeQlCoverage.entries()].map(([locale, qls]) => [locale, qls.size]),
  ),
  optionProofs,
  reviewActivationProofs,
  downstreamLockProofs,
  questionBankRejectionProofs,
  localizedScriptProofs,
  batchSizes,
  deterministicBatchProofs,
  targetedQlProofs,
  adminCapabilityProofs: 1,
  adminDispatchProofs: 1,
  routeMountProofs: 1,
  active: true,
  questionStudioDiscoverable: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
