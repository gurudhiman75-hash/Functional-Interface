import { strict as assert } from "node:assert";

import * as pgkCp001Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp001-facts";
import * as pgkCp002Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp002-facts";
import * as pgkCp003Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp003-facts";
import * as pgkCp004Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp004-facts";
import * as pgkCp005Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp005-facts";
import * as pgkCp006Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp006-facts";
import * as pgkCp007Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp007-facts";
import * as pgkCp008Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp008-facts";
import * as pgkCp009Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp009-facts";
import * as pgkCp010Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp010-facts";
import * as pgkCp011Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp011-facts";
import * as pgkCp012Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp012-facts";
import * as pgkCp013Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp013-facts";
import * as pgkCp014Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp014-facts";
import * as pgkCp015Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp015-facts";
import * as pgkCp016Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp016-facts";
import * as pgkCp017Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp017-facts";
import * as pgkCp018Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp018-facts";
import * as pgkCp019Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp019-facts";
import * as pgkCp020Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp020-facts";
import * as pgkCp021Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp021-facts";
import * as pgkCp022Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp022-facts";
import * as pgkCp023Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp023-facts";
import * as pgkCp024Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp024-facts";
import * as pgkCp025Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp025-facts";
import * as pgkCp026Facts from "../../knowledge-v1/punjab-gk/pgk-001-cp026-facts";

import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";
import {
  PGK_001_QUESTION_STUDIO_CORPUS_V1,
  PGK_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  PGK_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isPgk001QuestionStudioRequestV1,
  knowledgeV1Pgk001QuestionStudioAdapterV1,
} from "./knowledge-v1-pgk001-adapter-v1";

const pkg = PGK_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;

assert.equal(pkg.packageId, "PGK-001");
assert.equal(pkg.engineId, "knowledge-v1");
assert.equal(pkg.subject, "Static GK");
assert.equal(pkg.topic, "Punjab GK");
assert.equal(pkg.subtopic, "Complete Chapter");
assert.equal(pkg.enabled, true);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.deepEqual(pkg.supportedLanguages, ["en"]);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(pkg.cpIds?.length, 26);
assert.equal(new Set(pkg.cpIds).size, 26);
assert.equal(pkg.metadata?.cpCount, 26);
assert.equal(pkg.metadata?.qlCount, 182);
assert.equal(pkg.metadata?.englishQuestionCount, 1092);
assert.equal(pkg.metadata?.payloadsPerPermanentQl, 6);
assert.equal(pkg.metadata?.registrationAuthorityId, PGK_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1);

assert.equal(PGK_001_QUESTION_STUDIO_CORPUS_V1.length, 1092);
assert.equal(new Set(PGK_001_QUESTION_STUDIO_CORPUS_V1.map((q) => q.questionId)).size, 1092);

const cpCounts = new Map<string, number>();
const qlCounts = new Map<string, number>();
const bannedLearnerWording = /associated with|linked with|known for|best described|the correct answer is|the correct option|the other options|this question tests|with reference to punjab|identify it|review batch|runtimeRegistered|generator|sourceFactIds/i;
const semanticFingerprints = new Map<string, string>();
const exhaustiveAuditErrors: string[] = [];
const genericSourcePlaceholder = /(?:^|[-_])(?:reference|standard-history|generic)(?:$|[-_])/i;

const sourceAuthorityModules: readonly Record<string, unknown>[] = [
  pgkCp001Facts,
  pgkCp002Facts,
  pgkCp003Facts,
  pgkCp004Facts,
  pgkCp005Facts,
  pgkCp006Facts,
  pgkCp007Facts,
  pgkCp008Facts,
  pgkCp009Facts,
  pgkCp010Facts,
  pgkCp011Facts,
  pgkCp012Facts,
  pgkCp013Facts,
  pgkCp014Facts,
  pgkCp015Facts,
  pgkCp016Facts,
  pgkCp017Facts,
  pgkCp018Facts,
  pgkCp019Facts,
  pgkCp020Facts,
  pgkCp021Facts,
  pgkCp022Facts,
  pgkCp023Facts,
  pgkCp024Facts,
  pgkCp025Facts,
  pgkCp026Facts,
];
const resolvableSourceIds = new Set<string>();
for (const sourceModule of sourceAuthorityModules) {
  for (const [exportName, value] of Object.entries(sourceModule)) {
    if (!/(?:SOURCE_REGISTRY|SOURCE_URLS)$/.test(exportName)) continue;
    if (!value || typeof value !== "object") continue;
    for (const sourceId of Object.keys(value as Record<string, unknown>)) {
      resolvableSourceIds.add(sourceId);
    }
  }
}

function normalizeLearnerText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\\n/g, " ")
    .replace(/[^a-z0-9%]+/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
}

function countLearnerSentences(value: string) {
  const normalized = value
    .replace(/(\d)\.(\d)/g, "$1__DECIMAL__$2")
    .replace(/\b(?:[A-Z]\.){2,}[A-Z]?\.?/g, (match) => match.replace(/\./g, ""));
  return normalized
    .split(/[.!?]+/)
    .map((part) => part.replace(/__DECIMAL__/g, ".").trim())
    .filter(Boolean)
    .length;
}

for (const q of PGK_001_QUESTION_STUDIO_CORPUS_V1) {
  cpCounts.set(q.cpId, (cpCounts.get(q.cpId) ?? 0) + 1);
  qlCounts.set(q.qlId, (qlCounts.get(q.qlId) ?? 0) + 1);

  assert.equal(q.options.length, 4, `${q.questionId}: four options required`);
  assert.equal(new Set(q.options).size, 4, `${q.questionId}: unique options required`);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer, `${q.questionId}: answer mismatch`);
  assert.ok(q.stem.trim().length > 0, `${q.questionId}: missing stem`);
  assert.ok(q.explanation.trim().length > 0, `${q.questionId}: missing explanation`);

  if (q.sourceIds.length === 0) exhaustiveAuditErrors.push(`${q.questionId}: missing source provenance`);
  if (q.sourceFactIds.length === 0) exhaustiveAuditErrors.push(`${q.questionId}: missing fact provenance`);
  for (const sourceId of q.sourceIds) {
    if (genericSourcePlaceholder.test(sourceId)) {
      exhaustiveAuditErrors.push(`${q.questionId}: generic source placeholder :: ${sourceId}`);
    }
    if (!resolvableSourceIds.has(sourceId)) {
      exhaustiveAuditErrors.push(`${q.questionId}: unresolved source authority :: ${sourceId}`);
    }
  }
  if (bannedLearnerWording.test(`${q.stem}\n${q.explanation}`)) {
    exhaustiveAuditErrors.push(`${q.questionId}: banned learner wording :: ${q.stem}`);
  }
  if (q.stem.length > 420) exhaustiveAuditErrors.push(`${q.questionId}: stem is too long (${q.stem.length})`);
  if (q.explanation.length > 520) exhaustiveAuditErrors.push(`${q.questionId}: explanation is too long (${q.explanation.length})`);

  const explanationSentenceCount = countLearnerSentences(q.explanation);
  if (explanationSentenceCount < 1 || explanationSentenceCount > 3) {
    exhaustiveAuditErrors.push(`${q.questionId}: explanation has ${explanationSentenceCount} sentences`);
  }

  const semanticKey = `${normalizeLearnerText(q.stem)}|${normalizeLearnerText(q.canonicalAnswer)}`;
  const previous = semanticFingerprints.get(semanticKey);
  if (previous) exhaustiveAuditErrors.push(`${q.questionId}: semantic duplicate of ${previous}`);
  else semanticFingerprints.set(semanticKey, q.questionId);

  if (
    /population|literacy|sex ratio|population density|scheduled caste/i.test(q.stem) &&
    q.cpId === "PGK-001-CP-020" &&
    !/2011/i.test(`${q.stem} ${q.explanation}`)
  ) {
    exhaustiveAuditErrors.push(`${q.questionId}: demographic fact is not explicitly Census-2011 versioned`);
  }
}

assert.deepEqual(exhaustiveAuditErrors, [], `Exhaustive PGK audit failures:\n${exhaustiveAuditErrors.join("\n")}`);

assert.equal(cpCounts.size, 26);
assert.equal(qlCounts.size, 182);
for (let cp = 1; cp <= 26; cp += 1) {
  const cpId = `PGK-001-CP-${String(cp).padStart(3, "0")}`;
  const expected = cp === 1 ? 36 : cp === 26 ? 48 : 42;
  assert.equal(cpCounts.get(cpId), expected, `${cpId} question count mismatch`);
}
for (let ql = 1; ql <= 182; ql += 1) {
  const qlId = `PGK-001-QL-${String(ql).padStart(3, "0")}`;
  assert.equal(qlCounts.get(qlId), 6, `${qlId} should expose six frozen questions`);
}

assert.equal(isPgk001QuestionStudioRequestV1({ packageId: "PGK-001" }), true);
assert.equal(
  isPgk001QuestionStudioRequestV1({
    subject: "Static GK",
    topic: "Punjab GK",
    subtopic: "Complete Chapter",
  }),
  true,
);
assert.equal(isPgk001QuestionStudioRequestV1({ packageId: "ECO-001" }), false);

const compositePackages = knowledgeV1QuestionStudioAdapter.listPackages();
assert.equal(compositePackages.some((p) => p.packageId === "PGK-001"), true);
assert.equal(new Set(compositePackages.map((p) => p.packageId)).size, compositePackages.length);

const request = {
  packageId: "PGK-001",
  language: "en" as const,
  difficulty: "Mixed" as const,
  count: 30,
  seed: "pgk001-integration-contract",
};
const first = await knowledgeV1Pgk001QuestionStudioAdapterV1.generate(request);
const replay = await knowledgeV1Pgk001QuestionStudioAdapterV1.generate(request);
assert.equal(first.questions.length, 30);
assert.deepEqual(first, replay);
assert.equal(new Set(first.questions.map((q) => q.questionId)).size, 30);

for (const q of first.questions as any[]) {
  assert.equal(q.packageId, "PGK-001");
  assert.equal(q.language, "en");
  assert.equal(q.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(q.registrationAuthorityId, PGK_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1);
  assert.equal(q.authoringReviewApproved, true);
  assert.equal(q.runtimeRegistered, true);
  assert.equal(q.readOnly, true);
  assert.equal(q.productionReleased, false);
  assert.equal(q.questionBankWritable, false);
  assert.equal(q.testEligible, false);
  assert.equal(q.mockTestEligible, false);
  assert.equal(q.publiclyPublishable, false);
}

const composite = await knowledgeV1QuestionStudioAdapter.generate({
  ...request,
  count: 12,
  seed: "pgk001-composite-route",
});
assert.equal(composite.questions.length, 12);
assert.equal(composite.questions.every((q) => q.packageId === "PGK-001"), true);

const cp004 = await knowledgeV1Pgk001QuestionStudioAdapterV1.generate({
  packageId: "PGK-001",
  canonicalProblemId: "PGK-001-CP-004",
  count: 6,
  seed: "cp004-filter",
});
assert.equal(cp004.questions.length, 6);
assert.equal(cp004.questions.every((q) => q.cpId === "PGK-001-CP-004"), true);

const compactCp004 = await knowledgeV1Pgk001QuestionStudioAdapterV1.generate({
  packageId: "PGK-001",
  canonicalProblemId: "PGK-001-CP004",
  count: 6,
  seed: "cp004-compact-filter",
});
assert.equal(compactCp004.questions.every((q) => q.cpId === "PGK-001-CP-004"), true);

const ql175 = await knowledgeV1Pgk001QuestionStudioAdapterV1.generate({
  packageId: "PGK-001",
  patternId: "PGK-001-QL-175",
  count: 6,
  seed: "ql175-filter",
});
assert.equal(ql175.questions.length, 6);
assert.equal(ql175.questions.every((q) => q.qlId === "PGK-001-QL-175"), true);
assert.equal(ql175.questions.every((q) => q.cpId === "PGK-001-CP-026"), true);

const hard = await knowledgeV1Pgk001QuestionStudioAdapterV1.generate({
  packageId: "PGK-001",
  difficulty: "Hard",
  count: 25,
  seed: "hard-filter",
});
assert.equal(hard.questions.every((q) => q.difficulty === "Hard"), true);

await assert.rejects(
  knowledgeV1Pgk001QuestionStudioAdapterV1.generate({
    packageId: "PGK-001",
    canonicalProblemId: "PGK-001-CP-001",
    patternId: "PGK-001-QL-021",
  }),
  /Conflicting PGK-001 CP\/QL selectors/i,
);
await assert.rejects(
  knowledgeV1Pgk001QuestionStudioAdapterV1.generate({
    packageId: "PGK-001",
    canonicalProblemId: "PGK-001-CP-027",
  }),
  /Unknown PGK-001 selector/i,
);
await assert.rejects(
  knowledgeV1Pgk001QuestionStudioAdapterV1.generate({
    packageId: "PGK-001",
    patternId: "PGK-001-QL-183",
  }),
  /Unknown PGK-001 selector/i,
);
await assert.rejects(
  knowledgeV1Pgk001QuestionStudioAdapterV1.generate({
    packageId: "PGK-001",
    language: "pa",
  }),
  /currently supports English only/i,
);
await assert.rejects(
  knowledgeV1Pgk001QuestionStudioAdapterV1.generate({
    packageId: "PGK-001",
    runtimeMode: "bank-only",
  }),
  /only supports review-only runtime/i,
);
