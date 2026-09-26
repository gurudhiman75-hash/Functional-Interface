import { strict as assert } from "node:assert";

import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";
import {
  PGK_001_QUESTION_STUDIO_CORPUS_V1,
  PGK_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
  PGK_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isPgk001QuestionStudioRequestV1,
  knowledgeV1Pgk001QuestionStudioAdapterV1,
} from "./knowledge-v1-pgk001-adapter-v1";
import {
  PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
  PGK_001_MATCH_FOLLOWING_REGISTRATION_AUTHORITY_V1,
  PGK_001_MATCH_FOLLOWING_REVIEW_ONLY_PACKAGE_V1,
  isPgk001MatchFollowingQuestionStudioRequestV1,
  knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1,
} from "./knowledge-v1-pgk001-match-following-adapter-v1";

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
const rejectedFactualOverstatements = /most famous ruler of the Kushan|one of Punjab's oldest secondary-steel|invented the Gurmukhi/i;

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
  }
  if (bannedLearnerWording.test(`${q.stem}\n${q.explanation}`)) {
    exhaustiveAuditErrors.push(`${q.questionId}: banned learner wording :: ${q.stem}`);
  }
  if (rejectedFactualOverstatements.test(`${q.stem}\n${q.explanation}`)) {
    exhaustiveAuditErrors.push(`${q.questionId}: rejected factual overstatement :: ${q.stem}`);
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

const mtfPkg = PGK_001_MATCH_FOLLOWING_REVIEW_ONLY_PACKAGE_V1;
assert.equal(mtfPkg.packageId, "PGK-001-MTF-V1");
assert.equal(mtfPkg.engineId, "knowledge-v1");
assert.equal(mtfPkg.subject, "Static GK");
assert.equal(mtfPkg.topic, "Punjab GK");
assert.equal(mtfPkg.subtopic, "Match the Following");
assert.equal(mtfPkg.enabled, true);
assert.equal(mtfPkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(mtfPkg.questionBankWritable, false);
assert.equal(mtfPkg.testEligible, false);
assert.equal(mtfPkg.mockTestEligible, false);
assert.equal(mtfPkg.publiclyPublishable, false);
assert.equal(mtfPkg.automaticStudentPublication, false);
assert.equal(mtfPkg.productionReleaseAuthorized, false);
assert.deepEqual(mtfPkg.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(mtfPkg.supportedDifficulties, ["Medium", "Hard"]);
assert.equal(mtfPkg.cpIds.length, 12);
assert.equal(new Set(mtfPkg.cpIds).size, 12);
assert.equal(mtfPkg.metadata?.matchingConceptCount, 24);
assert.equal(mtfPkg.metadata?.reviewSurfaceCount, 72);
assert.equal(mtfPkg.metadata?.frozenCoreQuestionCount, 1092);
assert.equal(mtfPkg.metadata?.frozenCoreModified, false);
assert.equal(
  mtfPkg.metadata?.registrationAuthorityId,
  PGK_001_MATCH_FOLLOWING_REGISTRATION_AUTHORITY_V1,
);

assert.equal(
  isPgk001MatchFollowingQuestionStudioRequestV1({
    packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
  }),
  true,
);
assert.equal(
  isPgk001MatchFollowingQuestionStudioRequestV1({
    canonicalProblemId: "PGK-001-MTF-017",
  }),
  true,
);
assert.equal(
  isPgk001MatchFollowingQuestionStudioRequestV1({ packageId: "PGK-001" }),
  false,
);

const packagesWithMatching = knowledgeV1QuestionStudioAdapter.listPackages();
assert.equal(
  packagesWithMatching.some((p) => p.packageId === PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1),
  true,
);
assert.equal(
  new Set(packagesWithMatching.map((p) => p.packageId)).size,
  packagesWithMatching.length,
);

const mtfRequest = {
  packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
  language: "en" as const,
  difficulty: "Mixed" as const,
  count: 24,
  seed: "pgk001-mtf-integration-contract",
};
const mtfFirst = await knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate(mtfRequest);
const mtfReplay = await knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate(mtfRequest);
assert.equal(mtfFirst.questions.length, 24);
assert.deepEqual(mtfFirst, mtfReplay);
assert.equal(new Set(mtfFirst.questions.map((q) => q.questionId)).size, 24);
assert.equal(PGK_001_QUESTION_STUDIO_CORPUS_V1.length, 1092);

for (const q of mtfFirst.questions as any[]) {
  assert.equal(q.packageId, PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1);
  assert.equal(q.questionType, "Match the Following");
  assert.equal(q.language, "en");
  assert.equal(q.listI.length, 4);
  assert.equal(q.listII.length, 4);
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options).size, 4);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer);
  assert.equal(q.renderer.kind, "MATCH_LISTS");
  assert.equal(q.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(
    q.registrationAuthorityId,
    PGK_001_MATCH_FOLLOWING_REGISTRATION_AUTHORITY_V1,
  );
  assert.equal(q.authoringReviewApproved, true);
  assert.equal(q.formatReviewApproved, true);
  assert.equal(q.runtimeRegistered, true);
  assert.equal(q.readOnly, true);
  assert.equal(q.additiveExtension, true);
  assert.equal(q.frozenCoreQuestionCount, 1092);
  assert.equal(q.frozenCoreModified, false);
  assert.equal(q.productionReleased, false);
  assert.equal(q.questionBankWritable, false);
  assert.equal(q.testEligible, false);
  assert.equal(q.mockTestEligible, false);
  assert.equal(q.publiclyPublishable, false);
}

const mtfComposite = await knowledgeV1QuestionStudioAdapter.generate({
  ...mtfRequest,
  language: "pa",
  count: 6,
  seed: "pgk001-mtf-composite-pa",
});
assert.equal(mtfComposite.questions.length, 6);
assert.equal(
  mtfComposite.questions.every(
    (q) =>
      q.packageId === PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1 &&
      q.language === "pa" &&
      q.questionType === "Match the Following",
  ),
  true,
);

const mtfHindi = await knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate({
  packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
  language: "hi",
  canonicalProblemId: "PGK-001-MTF-017",
  count: 1,
  seed: "pgk001-mtf-hindi-specific",
});
assert.equal(mtfHindi.questions.length, 1);
assert.equal(mtfHindi.questions[0]?.canonicalProblemId, "PGK-001-MTF-017");
assert.equal(mtfHindi.questions[0]?.language, "hi");
assert.equal(mtfHindi.questions[0]?.cpId, "PGK-001-CP-022");

const mtfCp020 = await knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate({
  packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
  canonicalProblemId: "PGK-001-CP-020",
  count: 2,
  seed: "pgk001-mtf-cp020",
});
assert.equal(mtfCp020.questions.length, 2);
assert.equal(mtfCp020.questions.every((q) => q.cpId === "PGK-001-CP-020"), true);

const mtfHard = await knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate({
  packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
  difficulty: "Hard",
  count: 12,
  seed: "pgk001-mtf-hard",
});
assert.equal(mtfHard.questions.every((q) => q.difficulty === "Hard"), true);

await assert.rejects(
  knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate({
    packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
    difficulty: "Easy",
  }),
  /supports Medium, Hard, or Mixed/i,
);
await assert.rejects(
  knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate({
    packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
    canonicalProblemId: "PGK-001-CP-020",
    count: 3,
  }),
  /without repeats/i,
);
await assert.rejects(
  knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate({
    packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
    canonicalProblemId: "PGK-001-CP-004",
    patternId: "PGK-001-MTF-017",
  }),
  /Conflicting PGK-001 matching CP\/concept selectors/i,
);
await assert.rejects(
  knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate({
    packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
    canonicalProblemId: "PGK-001-MTF-999",
  }),
  /Unknown PGK-001 matching selector/i,
);
await assert.rejects(
  knowledgeV1Pgk001MatchFollowingQuestionStudioAdapterV1.generate({
    packageId: PGK_001_MATCH_FOLLOWING_PACKAGE_ID_V1,
    runtimeMode: "bank-only",
  }),
  /only supports review-only runtime/i,
);

