import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { BTD_CP007_LANGUAGES_V4 } from "../BTD-CP-007/btd-cp007-hi-pa-localization-v4";
import { buildBtdLocalizedQuestionV5 } from "../BTD-CP-007/btd-cp007-hi-pa-localization-v5";

function jsonNative<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value: unknown): string {
  return createHash("sha256").update(canonicalJson(jsonNative(value))).digest("hex");
}

function learnerPayload(question: any) {
  return jsonNative({
    qlId: question.qlId,
    language: question.language,
    semanticSignature: question.semanticSignature,
    answerSemantic: question.answerSemantic,
    sourceStateFingerprint: question.sourceStateFingerprint,
    englishContentFingerprint: question.englishContentFingerprint,
    presentation: question.presentation,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  });
}

function familyKey(stemFamilyId: string) {
  const match = stemFamilyId.match(/(?:T|STEM-)([123])-(HI|PA)$/u);
  assert.ok(match, `unexpected localized stem family ${stemFamilyId}`);
  return match![1]!;
}

const chapterPayload: unknown[] = [];
const perQlLanguage: Record<string, string> = {};
const reviewSamples = new Map<string, unknown>();
let deterministicChecks = 0;
let lifecycleLockChecks = 0;

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP007_LANGUAGES_V4) {
    const scopePayload: unknown[] = [];
    for (let index = 0; index < 100; index += 1) {
      const seed = `btd-cp007-${language}:${entry.qlId}:${String(index + 1).padStart(3, "0")}`;
      const question = buildBtdLocalizedQuestionV5(entry.qlId, seed, language) as any;
      const replay = buildBtdLocalizedQuestionV5(entry.qlId, seed, language) as any;
      assert.deepEqual(replay, question, `${entry.qlId}/${language}/${seed}: deterministic replay drift`);
      deterministicChecks += 1;

      assert.equal(question.lifecycle.multilingualFrozen, false);
      assert.equal(question.lifecycle.questionStudioDiscoverable, false);
      assert.equal(question.lifecycle.questionStudioGenerationEnabled, false);
      assert.equal(question.lifecycle.questionBankWritable, false);
      assert.equal(question.lifecycle.testEligible, false);
      assert.equal(question.lifecycle.mockTestEligible, false);
      assert.equal(question.lifecycle.publiclyPublishable, false);
      lifecycleLockChecks += 7;

      const payload = learnerPayload(question);
      scopePayload.push(payload);
      chapterPayload.push(payload);

      const family = familyKey(question.presentation.stemFamilyId);
      const reviewKey = `${entry.qlId}:${language}:T${family}`;
      if (!reviewSamples.has(reviewKey)) reviewSamples.set(reviewKey, payload);
    }
    perQlLanguage[`${entry.qlId}:${language}`] = sha256(scopePayload);
  }
}

assert.equal(chapterPayload.length, 4000);
assert.equal(reviewSamples.size, 120);

const orderedReviewPayload: unknown[] = [];
for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (const language of BTD_CP007_LANGUAGES_V4) {
    for (const family of ["1", "2", "3"]) {
      const payload = reviewSamples.get(`${entry.qlId}:${language}:T${family}`);
      assert.ok(payload, `${entry.qlId}/${language}/T${family}: missing review sample`);
      orderedReviewPayload.push(payload);
    }
  }
}

const chapterFingerprint = sha256(chapterPayload);
const reviewFingerprint = sha256(orderedReviewPayload);

console.log(JSON.stringify({
  probeVersion: "BTD-001-CP008-HI-PA-FREEZE-READINESS-PROBE-v1",
  authority: "BTD-001-CP007-HI-PA-LOCALIZATION-v5",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: BTD_CP007_LANGUAGES_V4,
  seedsPerQlPerLanguage: 100,
  canonicalQuestionCount: chapterPayload.length,
  reviewQuestionCount: orderedReviewPayload.length,
  deterministicChecks,
  lifecycleLockChecks,
  chapterFingerprint,
  reviewFingerprint,
  perQlLanguage,
  multilingualFrozen: false,
  hiPaQuestionStudioEnabled: false,
  downstreamDeliveryOpened: false,
}, null, 2));
console.log("PASS_BTD_001_CP008_HI_PA_FREEZE_READINESS_PROBE_V1");
