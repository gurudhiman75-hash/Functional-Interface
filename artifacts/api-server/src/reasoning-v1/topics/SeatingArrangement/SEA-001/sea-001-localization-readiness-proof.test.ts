import { SEA001_ENGLISH_FREEZE, SEA001_FROZEN_QUERY_CONTRACTS_BY_CHECKPOINT, SEA001_PERMANENT_INACTIVE_LIFECYCLE } from "./permanent/freeze.ts";
import { SEA001_PERMANENT_QL_REGISTRY } from "./permanent/registry.ts";
import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "./saturation/corpus.ts";
import {
  SEA001_LOCALIZATION_HUMAN_REVIEW_BLOCKER,
  SEA001_LOCALIZATION_PROTECTED_FIELDS,
  SEA001_LOCALIZATION_READINESS,
  SEA001_SPATIAL_GLOSSARY,
  SEA001_TRANSLATION_TARGET_LOCALES,
  assertSea001LocalizationFoundationStillBlocked,
  sea001CanonicalParityFingerprint,
} from "./localization/readiness.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sameStrings(actual: readonly string[], expected: readonly string[], message: string): void {
  const left = [...new Set(actual)].sort();
  const right = [...new Set(expected)].sort();
  if (JSON.stringify(left) !== JSON.stringify(right)) {
    throw new Error(`${message}: expected ${JSON.stringify(right)}, got ${JSON.stringify(left)}`);
  }
}

const expectedGlossaryConcepts = [
  "LEFT",
  "RIGHT",
  "IMMEDIATELY",
  "CLOCKWISE",
  "ANTICLOCKWISE",
  "ADJACENT",
  "NOT_ADJACENT",
  "BETWEEN",
  "FACING",
  "CENTRE",
  "OUTWARD",
  "OPPOSITE",
  "EXTREME_END",
  "MIDDLE",
  "SAME_FACING",
  "OPPOSITE_FACING",
  "CONDITIONAL_IF",
  "CONDITIONAL_OTHERWISE",
] as const;

assert(SEA001_LOCALIZATION_READINESS.status === "READY_FOR_TRANSLATION", "localization foundation status");
assert(SEA001_LOCALIZATION_READINESS.canonicalLocale === "en-IN", "canonical locale changed");
sameStrings(SEA001_TRANSLATION_TARGET_LOCALES, ["hi-IN", "pa-IN"], "translation target locales");
assert(SEA001_LOCALIZATION_READINESS.humanLanguageReviewRequired, "human language review must be mandatory");
assert(SEA001_LOCALIZATION_READINESS.humanReviewStatus === "PENDING", "language review must not be pre-approved");
assert(SEA001_LOCALIZATION_READINESS.activeEditorialBlockers.includes(SEA001_LOCALIZATION_HUMAN_REVIEW_BLOCKER), "human review blocker missing");
assert(!SEA001_LOCALIZATION_READINESS.productDeliveryUnlocked, "localization foundation cannot unlock delivery");
assert(!SEA001_LOCALIZATION_READINESS.productionStagingApproved, "localization foundation cannot approve production staging");
assert(SEA001_LOCALIZATION_READINESS.englishFreezeFingerprint === SEA001_ENGLISH_FREEZE.approvedReviewFingerprint, "localization must bind to the frozen English fingerprint");
assert(SEA001_LOCALIZATION_READINESS.permanentQlCount === 20, "localization must bind to all permanent QLs");
assert(SEA001_PERMANENT_QL_REGISTRY.length === 20, "permanent QL registry changed");

sameStrings(SEA001_SPATIAL_GLOSSARY.map((entry) => entry.concept), expectedGlossaryConcepts, "spatial glossary concepts");
assert(new Set(SEA001_SPATIAL_GLOSSARY.map((entry) => entry.concept)).size === SEA001_SPATIAL_GLOSSARY.length, "glossary concepts must be unique");
for (const entry of SEA001_SPATIAL_GLOSSARY) {
  assert(entry.en.trim().length > 0, `${entry.concept}: missing English authority term`);
  assert(/[\u0900-\u097F]/u.test(entry.hi), `${entry.concept}: Hindi term must contain Devanagari script`);
  assert(/[\u0A00-\u0A7F]/u.test(entry.pa), `${entry.concept}: Punjabi term must contain Gurmukhi script`);
}

const requiredProtectedFields = [
  "checkpointId",
  "blueprintAuthorityId",
  "queryContractId",
  "answerType",
  "answerDeterminingFactFingerprint",
  "answerIndex",
  "answer",
  "option.semanticFingerprint",
  "option.isCorrect",
  "permanentQlId",
];
for (const field of requiredProtectedFields) {
  assert((SEA001_LOCALIZATION_PROTECTED_FIELDS as readonly string[]).includes(field), `missing protected semantic field ${field}`);
}

const saturation = buildSea001SaturationCorpus(40);
const reviewCorpus = selectManualReviewCorpus(saturation.caselets, 5);
assert(reviewCorpus.length === 100, `localization review foundation expects 100 canonical caselets, got ${reviewCorpus.length}`);
assert(new Set(reviewCorpus.map((caselet) => caselet.blueprintAuthorityId)).size === 20, "localization review foundation must cover all 20 PBAs");

for (const checkpointId of ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"] as const) {
  const checkpointCases = reviewCorpus.filter((caselet) => caselet.checkpointId === checkpointId);
  assert(checkpointCases.length === 20, `${checkpointId}: localization review foundation needs 20 canonical caselets`);
  const observedContracts = checkpointCases.flatMap((caselet) => caselet.children.map((child) => child.queryContractId));
  const frozenContracts = SEA001_FROZEN_QUERY_CONTRACTS_BY_CHECKPOINT[checkpointId];
  for (const contract of observedContracts) {
    assert((frozenContracts as readonly string[]).includes(contract), `${checkpointId}: review corpus exposes unfrozen query contract ${contract}`);
  }
}

const parityFingerprints = new Set<string>();
for (const caselet of reviewCorpus) {
  assert(caselet.locale === "en-IN", `${caselet.caseletId}: canonical review locale changed from en-IN`);
  assert(caselet.children.length === 4, `${caselet.caseletId}: expected four canonical child questions`);
  const parityFingerprint = sea001CanonicalParityFingerprint(caselet);
  assert(!parityFingerprints.has(parityFingerprint), `${caselet.caseletId}: duplicate canonical parity projection`);
  parityFingerprints.add(parityFingerprint);
  for (const child of caselet.children) {
    assert(child.options.length === 4, `${caselet.caseletId}/${child.queryContractId}: option count changed`);
    assert(child.options.filter((option) => option.isCorrect).length === 1, `${caselet.caseletId}/${child.queryContractId}: semantic correctness must remain one-of-four before translation`);
    assert(child.options[child.answerIndex]?.isCorrect, `${caselet.caseletId}/${child.queryContractId}: answer-index alignment changed before translation`);
  }
}

assertSea001LocalizationFoundationStillBlocked();
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered, "Question Studio must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable, "Question Bank writes must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.testEligible, "mock-test eligibility must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable, "public delivery must remain disabled");

console.log("PASS_SEA_001_LOCALIZATION_READINESS");
console.log("canonical locale", SEA001_LOCALIZATION_READINESS.canonicalLocale);
console.log("target locales", SEA001_TRANSLATION_TARGET_LOCALES.join(","));
console.log("canonical review caselets", reviewCorpus.length);
console.log("PBA coverage", new Set(reviewCorpus.map((caselet) => caselet.blueprintAuthorityId)).size);
console.log("parity projections", parityFingerprints.size);
console.log("glossary concepts", SEA001_SPATIAL_GLOSSARY.length);
console.log("human review", SEA001_LOCALIZATION_READINESS.humanReviewStatus);
console.log("active blocker", SEA001_LOCALIZATION_HUMAN_REVIEW_BLOCKER);
console.log("Question Studio registered", SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered);
console.log("publicly publishable", SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable);
