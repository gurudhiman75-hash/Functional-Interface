import assert from "node:assert/strict";

import { buildCp006EnglishReviewCorpus, cp006EnglishReviewFingerprint } from "./cp006-review-corpus.ts";
import {
  SEA002_CP006_ENGLISH_FREEZE,
  SEA002_CP006_FROZEN_QUERY_CONTRACTS,
  SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE,
} from "./permanent/freeze.ts";
import {
  SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL,
  SEA002_CP006_PERMANENT_QL_REGISTRY,
} from "./permanent/registry.ts";
import { buildApprovedCp006ReviewLedger } from "./review/approved-review.ts";
import {
  SEA002_CP006_LOCALIZATION_HUMAN_REVIEW_BLOCKER,
  SEA002_CP006_LOCALIZATION_PROTECTED_FIELDS,
  SEA002_CP006_LOCALIZATION_READINESS,
  SEA002_CP006_SPATIAL_GLOSSARY,
  SEA002_CP006_TRANSLATION_TARGET_LOCALES,
  assertCp006LocalizationBindsToApprovedEnglish,
  assertCp006LocalizationFoundationStillBlocked,
  cp006CanonicalParityFingerprint,
} from "./localization/readiness.ts";
import { SEA002_CP006_BLUEPRINT_IDS } from "./types.ts";

function sameStrings(actual: readonly string[], expected: readonly string[], message: string): void {
  assert.deepEqual([...new Set(actual)].sort(), [...new Set(expected)].sort(), message);
}

const expectedGlossaryConcepts = [
  "POSITION",
  "UPPER_ROW",
  "LOWER_ROW",
  "NORTH",
  "SOUTH",
  "LEFT",
  "RIGHT",
  "SAME_ROW",
  "DIFFERENT_ROW",
  "OPPOSITE",
  "DIAGONAL",
  "ADJACENT",
  "NOT_ADJACENT",
  "BETWEEN",
  "END_POSITION",
  "FROM_EITHER_END",
  "PERSON_FACING",
  "CASE_ACCEPT",
  "CASE_REJECT",
] as const;

assert.equal(SEA002_CP006_LOCALIZATION_READINESS.status, "READY_FOR_TRANSLATION");
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.canonicalLocale, "en-IN");
sameStrings(SEA002_CP006_TRANSLATION_TARGET_LOCALES, ["hi-IN", "pa-IN"], "translation target locales");
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.explanationParityPolicy, "FOLLOW_EXACT_APPROVED_ENGLISH_TEACHING_PATH");
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.learnerTerminologyPolicy, "POSITION_NOT_COLUMN");
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.humanLanguageReviewRequired, true);
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.humanReviewStatus, "PENDING");
assert.ok(SEA002_CP006_LOCALIZATION_READINESS.activeEditorialBlockers.includes(SEA002_CP006_LOCALIZATION_HUMAN_REVIEW_BLOCKER));
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.productDeliveryUnlocked, false);
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.productionStagingApproved, false);
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.englishFreezeFingerprint, SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint);
assert.equal(SEA002_CP006_LOCALIZATION_READINESS.permanentQlCount, 4);
assert.equal(SEA002_CP006_PERMANENT_QL_REGISTRY.length, 4);

sameStrings(SEA002_CP006_SPATIAL_GLOSSARY.map((entry) => entry.concept), expectedGlossaryConcepts, "CP006 glossary concepts");
assert.equal(new Set(SEA002_CP006_SPATIAL_GLOSSARY.map((entry) => entry.concept)).size, SEA002_CP006_SPATIAL_GLOSSARY.length);
for (const entry of SEA002_CP006_SPATIAL_GLOSSARY) {
  assert.ok(entry.en.trim().length > 0, `${entry.concept}: missing English authority term`);
  assert.match(entry.hi, /[\u0900-\u097F]/u, `${entry.concept}: Hindi term must contain Devanagari`);
  assert.match(entry.pa, /[\u0A00-\u0A7F]/u, `${entry.concept}: Punjabi term must contain Gurmukhi`);
}

const requiredProtectedFields = [
  "checkpointId",
  "blueprintAuthorityId",
  "state",
  "clues",
  "structuralFingerprint",
  "queryContractId",
  "answerType",
  "answerDeterminingFactFingerprint",
  "answerIndex",
  "answer",
  "option.value",
  "option.isCorrect",
  "option.misconceptionId",
  "permanentQlId",
];
for (const field of requiredProtectedFields) {
  assert.ok((SEA002_CP006_LOCALIZATION_PROTECTED_FIELDS as readonly string[]).includes(field), `missing protected field ${field}`);
}

assertCp006LocalizationBindsToApprovedEnglish();
const corpus = buildCp006EnglishReviewCorpus();
assert.equal(corpus.length, 100);
assert.equal(cp006EnglishReviewFingerprint(corpus), SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint);
assert.equal(buildApprovedCp006ReviewLedger(corpus).length, 100);

const blueprintCounts = new Map<string, number>();
const widthCounts = new Map<number, number>();
const queryContracts = new Set<string>();
const parityFingerprints = new Set<string>();
for (const caselet of corpus) {
  blueprintCounts.set(caselet.blueprintAuthorityId, (blueprintCounts.get(caselet.blueprintAuthorityId) ?? 0) + 1);
  widthCounts.set(caselet.state.seatCountPerRow, (widthCounts.get(caselet.state.seatCountPerRow) ?? 0) + 1);
  const permanentQlId = SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL[caselet.blueprintAuthorityId];
  assert.ok(permanentQlId, `${caselet.caseletId}: missing permanent QL mapping`);
  assert.equal(caselet.children.length, 4);
  assert.ok(!/\bcolumns?\b/i.test([caselet.setupText, ...caselet.clueTexts, caselet.sharedExplanation, ...caselet.children.flatMap((child) => [child.text, child.explanation, ...child.options.map((option) => option.explanation)])].join("\n")), `${caselet.caseletId}: frozen English source contains learner-facing column wording`);
  const parity = cp006CanonicalParityFingerprint(caselet);
  assert.ok(!parityFingerprints.has(parity), `${caselet.caseletId}: duplicate canonical localization projection`);
  parityFingerprints.add(parity);
  for (const child of caselet.children) {
    queryContracts.add(child.queryContractId);
    assert.ok((SEA002_CP006_FROZEN_QUERY_CONTRACTS as readonly string[]).includes(child.queryContractId), `${caselet.caseletId}: unfrozen query contract ${child.queryContractId}`);
    assert.equal(child.options.length, 4);
    assert.equal(child.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(child.options[child.answerIndex]?.value, child.answer);
  }
}

for (const blueprint of SEA002_CP006_BLUEPRINT_IDS) assert.equal(blueprintCounts.get(blueprint), 25, `${blueprint}: localization source balance`);
assert.deepEqual([...widthCounts.keys()].sort(), [3, 4, 5, 6]);
assert.equal(parityFingerprints.size, 100);
sameStrings([...queryContracts], SEA002_CP006_FROZEN_QUERY_CONTRACTS, "frozen query inventory coverage");

assertCp006LocalizationFoundationStillBlocked();
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.mockTestEligible, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.productionStaging, false);
assert.equal(SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable, false);

console.log("PASS_SEA002_CP006_LOCALIZATION_READINESS");
console.log("canonical locale", SEA002_CP006_LOCALIZATION_READINESS.canonicalLocale);
console.log("target locales", SEA002_CP006_TRANSLATION_TARGET_LOCALES.join(","));
console.log("canonical review caselets", corpus.length);
console.log("PBA counts", Object.fromEntries(blueprintCounts));
console.log("width counts", Object.fromEntries(widthCounts));
console.log("query contracts", [...queryContracts].sort().join(","));
console.log("canonical parity projections", parityFingerprints.size);
console.log("glossary concepts", SEA002_CP006_SPATIAL_GLOSSARY.length);
console.log("human review", SEA002_CP006_LOCALIZATION_READINESS.humanReviewStatus);
console.log("multilingual freeze", false);
console.log("Question Studio registered", SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered);
console.log("publicly publishable", SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable);
