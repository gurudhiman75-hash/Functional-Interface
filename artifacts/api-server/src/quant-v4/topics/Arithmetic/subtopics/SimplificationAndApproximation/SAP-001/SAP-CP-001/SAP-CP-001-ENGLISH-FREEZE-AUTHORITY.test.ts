import assert from "node:assert/strict";
import {
  SAP_CP001_ALL_PROTOTYPE_IDS,
  SAP_CP001_ENGLISH_COUNT_PROPOSAL,
  SAP_CP001_ENGLISH_TEMPLATE_IDS,
  SAP_CP001_ENGLISH_TEMPLATE_MAP,
  SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL,
} from "./SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";
import { generateSapCp001EnglishReviewExport } from "./english-freeze/review-export";
import { generateSapCp001EnglishSweep } from "./english-freeze/runtime";
import type {
  SapCp001EnglishCandidate,
  SapCp001EnglishDifficulty,
} from "./english-freeze/types";

const SEEDS_PER_PROTOTYPE = 100;
const candidates = generateSapCp001EnglishSweep(SEEDS_PER_PROTOTYPE);
const reviewExport = generateSapCp001EnglishReviewExport();

const BANNED_LEARNER_TERMS = /\b(?:AST|RPN|canonical|verifier|prototype|seed|fingerprint)\b|hidden state/i;
const PLACEHOLDER_TERMS = /(?:TODO|TBD|undefined|null answer|\[object Object\]|lorem ipsum)/i;

assert.equal(SAP_CP001_ALL_PROTOTYPE_IDS.length, 17);
assert.equal(SAP_CP001_ENGLISH_TEMPLATE_IDS.length, 16);
assert.equal(SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL.length, 16);
assert.equal(candidates.length, 1700);
assert.equal(reviewExport.length, 51);
assert.equal(SAP_CP001_ENGLISH_COUNT_PROPOSAL.proposedTemplateCount, 16);
assert.equal(SAP_CP001_ENGLISH_COUNT_PROPOSAL.permanentQlCount, 0);
assert.equal(SAP_CP001_ENGLISH_COUNT_PROPOSAL.allocationStatus, "BLOCKED_PENDING_PRODUCT_APPROVAL");

const mappedTemplates = new Set(Object.values(SAP_CP001_ENGLISH_TEMPLATE_MAP));
assert.equal(mappedTemplates.size, 16, "The proposal should merge exactly one prototype pair.");
assert.equal(
  SAP_CP001_ENGLISH_TEMPLATE_MAP["SAP-CP001-PROT-NESTED-GROUPING"],
  SAP_CP001_ENGLISH_TEMPLATE_MAP["SAP-CP001-PROT-REPEATED-GROUPING"],
  "Nested and repeated grouping should share one learner-facing template.",
);
assert.notEqual(
  SAP_CP001_ENGLISH_TEMPLATE_MAP["SAP-CP001-PROT-SIGNED-ARITHMETIC"],
  SAP_CP001_ENGLISH_TEMPLATE_MAP["SAP-CP001-PROT-NEGATIVE-INTERMEDIATE"],
  "Unary negative parsing and negative-intermediate propagation must remain separate.",
);
assert.notEqual(
  SAP_CP001_ENGLISH_TEMPLATE_MAP["SAP-CP001-PROT-MULTIPLY-DIVIDE-LEFT-TO-RIGHT"],
  SAP_CP001_ENGLISH_TEMPLATE_MAP["SAP-CP001-PROT-ADD-SUBTRACT-LEFT-TO-RIGHT"],
  "The two equal-precedence tiers retain different sign and misconception contracts.",
);
assert.notEqual(
  SAP_CP001_ENGLISH_TEMPLATE_MAP["SAP-CP001-PROT-IDENTIFY-FIRST-VALID-STEP"],
  SAP_CP001_ENGLISH_TEMPLATE_MAP["SAP-CP001-PROT-IDENTIFY-INCORRECT-PRECEDENCE-STEP"],
  "Valid-step selection and first-error diagnosis retain different learner actions.",
);

const proposalAncestry = SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL.flatMap((entry) => (
  entry.prototypeAncestry.map((prototypeId) => `${prototypeId}|${entry.temporaryTemplateId}`)
));
assert.equal(proposalAncestry.length, 17);
assert.equal(new Set(proposalAncestry.map((entry) => entry.split("|")[0])).size, 17);
for (const entry of SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL) {
  assert.equal(entry.permanentQlId, null);
  assert.equal(entry.allocationStatus, "ID_FREE_COUNT_PROPOSAL");
  for (const prototypeId of entry.prototypeAncestry) {
    assert.equal(SAP_CP001_ENGLISH_TEMPLATE_MAP[prototypeId], entry.temporaryTemplateId);
  }
}

interface PrototypeStats {
  readonly stems: Set<string>;
  readonly stemTemplates: Set<string>;
  readonly fingerprints: Set<string>;
  readonly answerPositions: Set<number>;
  readonly difficulties: Set<SapCp001EnglishDifficulty>;
  readonly scores: Map<SapCp001EnglishDifficulty, Set<number>>;
}

const stats = new Map<string, PrototypeStats>();

function learnerText(candidate: SapCp001EnglishCandidate): string {
  return [
    candidate.stem,
    ...candidate.options.flatMap((option) => [option.value, option.analysis]),
    candidate.explanation.coreConcept,
    candidate.explanation.givenDataAndStrategy,
    ...candidate.explanation.stepByStep,
    candidate.explanation.examSpeedMethod,
    ...candidate.explanation.commonTraps,
    candidate.explanation.finalAnswer,
  ].join("\n");
}

for (const candidate of candidates) {
  assert.equal(candidate.packageId, "SAP-001");
  assert.equal(candidate.checkpointId, "SAP-CP-001");
  assert.equal(candidate.permanentQlId, null);
  assert.equal(candidate.editorialStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(candidate.reviewDecision, "APPROVE_FOR_ID_FREE_TEMPLATE_PROPOSAL");
  assert.equal(candidate.proposedTemplateId, SAP_CP001_ENGLISH_TEMPLATE_MAP[candidate.temporaryPrototypeId]);
  assert.equal(candidate.canonicalAnswer, candidate.verifierAnswer);
  assert.equal(candidate.technicalDetails.discoveryValidation.ok, true);
  assert.equal(candidate.technicalDetails.lifecycle.permanentQlId, null);
  assert.equal(candidate.technicalDetails.lifecycle.active, false);
  assert.equal(candidate.technicalDetails.lifecycle.questionStudioDiscoverable, false);
  assert.equal(candidate.technicalDetails.lifecycle.questionBankWritable, false);
  assert.equal(candidate.technicalDetails.lifecycle.testEligible, false);
  assert.equal(candidate.technicalDetails.lifecycle.publiclyPublishable, false);

  assert.ok(candidate.stem.length >= 10 && candidate.stem.length <= 1200);
  assert.ok(candidate.stemTemplateId.length > 5);
  assert.equal(candidate.options.length, 4);
  assert.equal(new Set(candidate.options.map((option) => option.value)).size, 4);
  assert.equal(candidate.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(candidate.options[candidate.correctIndex]?.isCorrect, true);
  assert.equal(candidate.options[candidate.correctIndex]?.value, candidate.canonicalAnswer);
  assert.ok(candidate.options.filter((option) => !option.isCorrect).every((option) => (
    option.misconceptionId !== null && option.analysis.length >= 20
  )));

  assert.ok(candidate.explanation.coreConcept.length >= 20);
  assert.ok(candidate.explanation.givenDataAndStrategy.length >= 20);
  assert.ok(candidate.explanation.stepByStep.length >= 2);
  assert.ok(candidate.explanation.stepByStep.every((step) => step.length >= 15));
  assert.ok(candidate.explanation.examSpeedMethod.length >= 20);
  assert.equal(candidate.explanation.commonTraps.length, 3);
  assert.ok(candidate.explanation.finalAnswer.includes(candidate.canonicalAnswer));
  assert.ok(candidate.reviewComments.length >= 2);

  const visibleText = learnerText(candidate);
  assert.doesNotMatch(visibleText, BANNED_LEARNER_TERMS,
    `${candidate.temporaryPrototypeId} seed ${candidate.seed} leaked internal terminology`);
  assert.doesNotMatch(visibleText, PLACEHOLDER_TERMS,
    `${candidate.temporaryPrototypeId} seed ${candidate.seed} contains a placeholder`);
  assert.ok(!visibleText.includes(" | "),
    `${candidate.temporaryPrototypeId} seed ${candidate.seed} exposes a raw evaluator delimiter`);

  assert.ok(candidate.technicalDetails.sourceAncestry.length >= 4);
  assert.ok(candidate.technicalDetails.prototypeAncestry.includes(candidate.temporaryPrototypeId));
  assert.ok(candidate.technicalDetails.independentEvidence.length >= 1);
  assert.ok(candidate.technicalDetails.independentEvidence.some((entry) => entry.rpnTrace.length >= 1));
  assert.ok(candidate.technicalDetails.mathematicalFingerprint.length >= 20);

  const current = stats.get(candidate.temporaryPrototypeId) ?? {
    stems: new Set<string>(),
    stemTemplates: new Set<string>(),
    fingerprints: new Set<string>(),
    answerPositions: new Set<number>(),
    difficulties: new Set<SapCp001EnglishDifficulty>(),
    scores: new Map<SapCp001EnglishDifficulty, Set<number>>(),
  };
  current.stems.add(candidate.stem);
  current.stemTemplates.add(candidate.stemTemplateId);
  current.fingerprints.add(candidate.technicalDetails.mathematicalFingerprint);
  current.answerPositions.add(candidate.correctIndex);
  current.difficulties.add(candidate.difficulty);
  const scores = current.scores.get(candidate.difficulty) ?? new Set<number>();
  scores.add(candidate.difficultyProfile.calibratedScore);
  current.scores.set(candidate.difficulty, scores);
  stats.set(candidate.temporaryPrototypeId, current);
}

for (const prototypeId of SAP_CP001_ALL_PROTOTYPE_IDS) {
  const current = stats.get(prototypeId)!;
  assert.ok(current.stems.size >= 40, `${prototypeId} has excessive exact-stem repetition`);
  assert.equal(current.stemTemplates.size, 4, `${prototypeId} should use four approved stem frames`);
  assert.ok(current.fingerprints.size >= 20, `${prototypeId} lacks mathematical diversity`);
  assert.deepEqual([...current.answerPositions].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...current.difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);

  const easyScore = [...current.scores.get("EASY")!][0]!;
  const mediumScore = [...current.scores.get("MEDIUM")!][0]!;
  const hardScore = [...current.scores.get("HARD")!][0]!;
  assert.ok(easyScore < mediumScore && mediumScore < hardScore,
    `${prototypeId} difficulty calibration is not ordered`);
}

const reviewByPrototype = new Map<string, typeof reviewExport[number][]>();
for (const item of reviewExport) {
  const items = reviewByPrototype.get(item.temporaryPrototypeId) ?? [];
  items.push(item);
  reviewByPrototype.set(item.temporaryPrototypeId, items);
  assert.equal(item.reviewer, "EXAMTREE_EDITORIAL_AUTHORITY");
  assert.equal(item.permanentQlId, null);
  assert.equal(item.editorialStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.ok(item.technicalDetails.expression !== null || item.technicalDetails.questionState !== null);
}
for (const prototypeId of SAP_CP001_ALL_PROTOTYPE_IDS) {
  const items = reviewByPrototype.get(prototypeId)!;
  assert.equal(items.length, 3);
  assert.deepEqual(items.map((item) => item.difficulty).sort(), ["EASY", "HARD", "MEDIUM"]);
  assert.deepEqual(items.map((item) => item.samplePurpose).sort(), ["EASY_SAMPLE", "HARD_SAMPLE", "MEDIUM_SAMPLE"]);
  assert.equal(new Set(items.map((item) => item.technicalDetails.mathematicalFingerprint)).size, 3,
    `${prototypeId} review export samples are not mathematically distinct`);
}

console.log(JSON.stringify({
  status: "PASS_SAP_CP001_ENGLISH_FREEZE_AUTHORITY",
  discoveryPrototypeCount: SAP_CP001_ALL_PROTOTYPE_IDS.length,
  idFreeTemplateCount: SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL.length,
  generatedEnglishCandidates: candidates.length,
  reviewExportItems: reviewExport.length,
  stemFramesPerPrototype: 4,
  permanentQlCount: 0,
  questionStudioStatus: "DISABLED",
  questionBankStatus: "NOT_STORED",
  publicStatus: "INACTIVE",
}, null, 2));
