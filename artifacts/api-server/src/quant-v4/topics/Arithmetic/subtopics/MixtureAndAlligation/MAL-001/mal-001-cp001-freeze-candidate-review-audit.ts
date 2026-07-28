import {
  MAL_CP001_FREEZE_CANDIDATE_IDS,
  MAL_CP001_FREEZE_CLASSIFICATION,
} from "./foundation/cp001-freeze-candidate-ledger";
import {
  buildMalCp001FreezeReviewModel,
  MAL_CP001_FREEZE_REVIEW_SEEDS,
} from "./foundation/cp001-freeze-review-model";

function fail(message: string): never {
  throw new Error(message);
}

const model = buildMalCp001FreezeReviewModel();

if (model.status !== "FREEZE_CANDIDATE_REVIEW_PENDING") {
  fail(`Unexpected review model status: ${model.status}.`);
}
if (model.humanReviewStatus !== "PENDING") {
  fail("Human review must remain PENDING until an actual reviewer records a decision.");
}
if (model.candidateCount !== MAL_CP001_FREEZE_CANDIDATE_IDS.length) {
  fail(`Candidate count mismatch: ${model.candidateCount}.`);
}
if (model.candidateCount !== 8) {
  fail(`Expected 8 consolidated review candidates, received ${model.candidateCount}.`);
}
if (model.prototypeCount !== MAL_CP001_FREEZE_CLASSIFICATION.length) {
  fail(`Prototype review coverage mismatch: ${model.prototypeCount}.`);
}
if (model.prototypeCount !== 15) {
  fail(`Expected all 15 executable prototype identities, received ${model.prototypeCount}.`);
}
if (
  model.questionCount !==
  model.prototypeCount * MAL_CP001_FREEZE_REVIEW_SEEDS.length
) {
  fail(`Question count mismatch: ${model.questionCount}.`);
}
if (model.questionCount !== 60) {
  fail(`Expected the existing 60-question review frontier, received ${model.questionCount}.`);
}
if (model.permanentQlCount !== 0) {
  fail("Permanent QLs appeared in the freeze-candidate review model.");
}
if (model.publiclyPublishable || model.questionStudioDiscoverable) {
  fail("Freeze-candidate review material escaped its safety boundary.");
}

const expectedPrototypeCounts: Record<string, number> = {
  "MAL-CP001-FREEZE-TARGET-RATIO": 1,
  "MAL-CP001-FREEZE-FINAL-MEAN": 3,
  "MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE": 2,
  "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY": 3,
  "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE": 3,
  "MAL-CP001-FREEZE-TWO-STAGE-FINAL-MEAN": 1,
  "MAL-CP001-FREEZE-TWO-STAGE-UNKNOWN-QUANTITY": 1,
  "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY": 1,
};

const seenCandidateIds = new Set<string>();
const seenPrototypeIds = new Set<string>();
const seenReviewKeys = new Set<string>();
const readinessCounts = new Map<string, number>();
const candidateQuestionCounts: Record<string, number> = {};
const candidatePrototypeCounts: Record<string, number> = {};

for (const candidateGroup of model.candidateGroups) {
  if (seenCandidateIds.has(candidateGroup.freezeCandidateId)) {
    fail(`Duplicate candidate group ${candidateGroup.freezeCandidateId}.`);
  }
  seenCandidateIds.add(candidateGroup.freezeCandidateId);
  readinessCounts.set(
    candidateGroup.sourceReadiness,
    (readinessCounts.get(candidateGroup.sourceReadiness) ?? 0) + 1,
  );
  if (candidateGroup.humanReviewStatus !== "PENDING") {
    fail(`${candidateGroup.freezeCandidateId} has fabricated human review state.`);
  }
  if (candidateGroup.sourceFixtureCount < 1) {
    fail(`${candidateGroup.freezeCandidateId} has no source fixture context.`);
  }
  if (candidateGroup.evidenceStrengths.length < 1) {
    fail(`${candidateGroup.freezeCandidateId} has no evidence-strength summary.`);
  }
  if (candidateGroup.representationCoverage.length < 1) {
    fail(`${candidateGroup.freezeCandidateId} has no representation summary.`);
  }

  const expectedPrototypeCount = expectedPrototypeCounts[candidateGroup.freezeCandidateId];
  if (candidateGroup.prototypeGroups.length !== expectedPrototypeCount) {
    fail(
      `${candidateGroup.freezeCandidateId} expected ${expectedPrototypeCount} prototype variants, received ${candidateGroup.prototypeGroups.length}.`,
    );
  }
  candidatePrototypeCounts[candidateGroup.freezeCandidateId] =
    candidateGroup.prototypeGroups.length;

  let candidateQuestionCount = 0;
  let anchorCount = 0;
  for (const prototypeGroup of candidateGroup.prototypeGroups) {
    if (seenPrototypeIds.has(prototypeGroup.prototypeId)) {
      fail(`Prototype ${prototypeGroup.prototypeId} appears in multiple candidate groups.`);
    }
    seenPrototypeIds.add(prototypeGroup.prototypeId);
    if (prototypeGroup.disposition === "ANCHOR") anchorCount += 1;
    if (prototypeGroup.questions.length !== MAL_CP001_FREEZE_REVIEW_SEEDS.length) {
      fail(`${prototypeGroup.prototypeId} does not have four review examples.`);
    }

    const stems = new Set<string>();
    for (const row of prototypeGroup.questions) {
      candidateQuestionCount += 1;
      if (seenReviewKeys.has(row.reviewKey)) {
        fail(`Duplicate review key ${row.reviewKey}.`);
      }
      seenReviewKeys.add(row.reviewKey);
      if (row.freezeCandidateId !== candidateGroup.freezeCandidateId) {
        fail(`${row.reviewKey} has the wrong candidate identity.`);
      }
      if (row.prototypeId !== prototypeGroup.prototypeId) {
        fail(`${row.reviewKey} has the wrong prototype identity.`);
      }
      if (row.sourceReadiness !== candidateGroup.sourceReadiness) {
        fail(`${row.reviewKey} has inconsistent source readiness.`);
      }
      if (row.humanReviewStatus !== "PENDING") {
        fail(`${row.reviewKey} fabricates human approval.`);
      }
      if (!row.question.validation.ok) {
        fail(`${row.reviewKey} failed runtime validation.`);
      }
      if (row.question.permanentQlId !== null) {
        fail(`${row.reviewKey} contains a permanent QL ID.`);
      }
      if (
        row.question.publiclyPublishable ||
        row.question.questionStudioDiscoverable
      ) {
        fail(`${row.reviewKey} escaped the discovery safety boundary.`);
      }
      if (row.question.options.length !== 4 || new Set(row.question.options).size !== 4) {
        fail(`${row.reviewKey} does not have four unique options.`);
      }
      if (
        row.question.optionAudit.filter(
          (option) => option.misconceptionId === "CORRECT",
        ).length !== 1
      ) {
        fail(`${row.reviewKey} does not have exactly one correct-labelled option.`);
      }
      stems.add(row.question.stem);
    }
    if (stems.size !== MAL_CP001_FREEZE_REVIEW_SEEDS.length) {
      fail(`${prototypeGroup.prototypeId} repeats a stem inside its four-row review sample.`);
    }
  }

  if (anchorCount !== 1) {
    fail(`${candidateGroup.freezeCandidateId} must contain exactly one anchor prototype.`);
  }
  candidateQuestionCounts[candidateGroup.freezeCandidateId] = candidateQuestionCount;
}

if (seenCandidateIds.size !== 8 || seenPrototypeIds.size !== 15) {
  fail("Review matrix does not cover the complete 8-candidate/15-prototype frontier.");
}
if (seenReviewKeys.size !== 60) {
  fail(`Expected 60 unique review rows, received ${seenReviewKeys.size}.`);
}
if (
  (readinessCounts.get("SUPPORTED") ?? 0) !== 5 ||
  (readinessCounts.get("SUPPORTED_WITH_VARIANT_GAP") ?? 0) !== 2 ||
  (readinessCounts.get("BLOCKED_SOURCE_GAP") ?? 0) !== 1
) {
  fail(`Unexpected source-readiness distribution: ${JSON.stringify(Object.fromEntries(readinessCounts))}`);
}

console.log(JSON.stringify({
  status: "PASS_FREEZE_CANDIDATE_REVIEW_MATRIX_PENDING_HUMAN_REVIEW",
  candidateCount: model.candidateCount,
  prototypeCount: model.prototypeCount,
  questionCount: model.questionCount,
  candidatePrototypeCounts,
  candidateQuestionCounts,
  readinessCounts: Object.fromEntries([...readinessCounts.entries()].sort()),
  humanReviewStatus: model.humanReviewStatus,
  permanentQlCount: model.permanentQlCount,
  publiclyPublishable: model.publiclyPublishable,
  questionStudioDiscoverable: model.questionStudioDiscoverable,
}, null, 2));
