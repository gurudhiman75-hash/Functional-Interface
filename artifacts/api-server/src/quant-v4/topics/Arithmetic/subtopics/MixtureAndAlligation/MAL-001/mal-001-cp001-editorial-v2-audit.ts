import {
  MAL_CP001_DISCOVERY_PROTOTYPE_IDS,
} from "./foundation/cp001-gap-registry";
import {
  generateMalCp001DiscoveryPrototype,
} from "./foundation/cp001-discovery-pipeline";
import {
  buildMalCp001FreezeReviewModel,
} from "./foundation/cp001-freeze-review-model";
import {
  MAL_CP001_SOURCE_RECOVERY_FINDINGS,
} from "./foundation/cp001-source-recovery-ledger";

function fail(message: string): never {
  throw new Error(message);
}

const forbiddenStemPatterns = [
  ["plural material blend", /\b(?:tea leaves|coffee beans) blend\b/iu],
  ["how-much plural material", /\bHow much [^?]*(?:tea leaves|beans)\b/iu],
  ["how-much priced quantity", /\bHow much [^?]+ priced at\b/iu],
  ["vague latter reference", /\bthe latter\b/iu],
  ["awkward component share", /\bWhat is the share of\b/iu],
  ["awkward mean tail", /\bWhat value per unit does the final\b/iu],
  ["awkward resulting material", /\baverage value of the resulting (?!blend\b)/iu],
  ["awkward change framing", /\bwants to change\b/iu],
  ["clause capitalisation", /,\s+What are the quantities\b/u],
  ["unrepaired stage portion", /\bFrom this blend, \d+(?:\s+\d+\/\d+)?\s+(?:kg|litres) is mixed\b/iu],
  ["unrepaired stage portion", /\bThen \d+(?:\s+\d+\/\d+)?\s+(?:kg|litres) of this blend is mixed\b/iu],
  ["unrepaired stage portion", /\bIf \d+(?:\s+\d+\/\d+)?\s+(?:kg|litres) of it is combined\b/iu],
  ["unrepaired stage portion", /\bNext, \d+(?:\s+\d+\/\d+)?\s+(?:kg|litres) of that uniform blend is combined\b/iu],
  ["unrepaired stage portion", /, \d+(?:\s+\d+\/\d+)?\s+(?:kg|litres) is taken\./iu],
  ["three-way multiplier grammar", /\bmiddle component is used in [^ ]+ times the quantity\b/iu],
  ["three-way multiplier grammar", /\bmiddle-priced component has [^ ]+ times the quantity\b/iu],
  ["vague three-way component", /\b(?:highest-priced|higher) component\?/iu],
] as const;

function assertEditorialStem(stem: string, key: string): void {
  for (const [label, pattern] of forbiddenStemPatterns) {
    if (pattern.test(stem)) {
      fail(`${key}: ${label}: ${stem}`);
    }
  }
}

function assertOrderedPairPresentation(question: ReturnType<typeof generateMalCp001DiscoveryPrototype>, key: string): boolean {
  const request = question.parameters.request;
  const isCorePair = request.mode === "TWO_QUANTITIES_FROM_TOTAL_AND_TARGET";
  const isGapPair = request.mode === "DIFFERENCE_BASED_QUANTITIES";
  if (!isCorePair && !isGapPair) return false;

  const lowerLabel = request.lowerComponentLabel;
  const higherLabel = request.higherComponentLabel;
  if (!question.stem.includes("respectively")) {
    fail(`${key}: ordered-pair stem lacks respectively: ${question.stem}`);
  }
  for (const option of question.options) {
    if (!option.includes(lowerLabel) || !option.includes(higherLabel)) {
      fail(`${key}: ordered-pair option is ambiguous: ${option}`);
    }
  }
  if (
    !question.explanation.conclusion.includes(lowerLabel) ||
    !question.explanation.conclusion.includes(higherLabel)
  ) {
    fail(`${key}: ordered-pair conclusion does not name both components.`);
  }
  return true;
}

function assertModeSpecificClarity(question: ReturnType<typeof generateMalCp001DiscoveryPrototype>, key: string): void {
  const request = question.parameters.request;
  if (request.mode === "TWO_STAGE_UNKNOWN_QUANTITY") {
    if (!question.explanation.conclusion.includes(request.finalComponentLabel)) {
      fail(`${key}: two-stage inverse conclusion omits the final component label.`);
    }
    if (question.stem.includes(`How much ${request.finalComponentLabel}`)) {
      fail(`${key}: two-stage inverse stem uses an unpolished how-much quantity prompt.`);
    }
  }
  if (request.mode === "THREE_WAY_TARGET_WITH_RELATION") {
    if (!question.stem.includes(request.higherComponentLabel)) {
      fail(`${key}: three-way stem does not name the requested higher component.`);
    }
    if (!question.explanation.conclusion.includes(request.higherComponentLabel)) {
      fail(`${key}: three-way conclusion does not name the requested higher component.`);
    }
    if (question.stem.includes(`How much ${request.higherComponentLabel}`)) {
      fail(`${key}: three-way stem uses an unpolished how-much quantity prompt.`);
    }
  }
  if (request.mode === "COMPONENT_SHARE_FROM_TARGET") {
    const requestedLabel = request.requestedSide === "LOWER"
      ? request.lowerComponentLabel
      : request.higherComponentLabel;
    if (!question.stem.includes(requestedLabel)) {
      fail(`${key}: component-share stem omits the requested component label.`);
    }
    if (!question.explanation.conclusion.includes(requestedLabel)) {
      fail(`${key}: component-share conclusion omits the requested component label.`);
    }
  }
}

let generatedQuestionCount = 0;
let orderedPairQuestionCount = 0;
for (const prototypeId of MAL_CP001_DISCOVERY_PROTOTYPE_IDS) {
  for (let index = 0; index < 80; index += 1) {
    const key = `${prototypeId}/editorial-v2-${index}`;
    const question = generateMalCp001DiscoveryPrototype(
      prototypeId,
      `editorial-v2-${index}`,
    );
    generatedQuestionCount += 1;
    assertEditorialStem(question.stem, key);
    if (assertOrderedPairPresentation(question, key)) {
      orderedPairQuestionCount += 1;
    }
    assertModeSpecificClarity(question, key);
  }
}

const reviewModel = buildMalCp001FreezeReviewModel();
let reviewRowCount = 0;
let pendingQuestionReviewCount = 0;
for (const candidateGroup of reviewModel.candidateGroups) {
  if (candidateGroup.humanReviewStatus !== "PENDING") {
    fail(`${candidateGroup.freezeCandidateId}: candidate review status must remain PENDING.`);
  }
  for (const prototypeGroup of candidateGroup.prototypeGroups) {
    for (const row of prototypeGroup.questions) {
      reviewRowCount += 1;
      if (row.humanReviewStatus !== "PENDING") {
        fail(`${row.reviewKey}: question review status must remain PENDING.`);
      }
      pendingQuestionReviewCount += 1;
      assertEditorialStem(row.question.stem, row.reviewKey);
      assertOrderedPairPresentation(row.question, row.reviewKey);
      assertModeSpecificClarity(row.question, row.reviewKey);
    }
  }
}

if (reviewRowCount !== 60 || pendingQuestionReviewCount !== 60) {
  fail(`Expected 60 pending review rows, received ${reviewRowCount}/${pendingQuestionReviewCount}.`);
}

if (MAL_CP001_SOURCE_RECOVERY_FINDINGS.length !== 2) {
  fail(`Expected two focused source-recovery findings, received ${MAL_CP001_SOURCE_RECOVERY_FINDINGS.length}.`);
}
const threeWayRecovery = MAL_CP001_SOURCE_RECOVERY_FINDINGS.find(
  (entry) =>
    entry.findingId === "SRC-RECOVERY-CP001-THREE-VARIETY-RATIO-ADJUSTMENT",
);
if (
  !threeWayRecovery ||
  threeWayRecovery.freezeCandidateId !== "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY" ||
  threeWayRecovery.ownershipVerdict !== "MAL-CP-002" ||
  threeWayRecovery.clearsCp001SourceBlocker !== false
) {
  fail("Recovered three-way reference was misclassified as direct CP-001 allocation evidence.");
}
const xatDilutionRecovery = MAL_CP001_SOURCE_RECOVERY_FINDINGS.find(
  (entry) =>
    entry.findingId === "SRC-RECOVERY-CP004-XAT2015-NESTED-COMPONENT-DILUTION",
);
if (
  !xatDilutionRecovery ||
  xatDilutionRecovery.ownershipVerdict !== "MAL-CP-004" ||
  xatDilutionRecovery.clearsCp001SourceBlocker !== false
) {
  fail("Recovered XAT nested-component dilution was misclassified as CP-001 final-total evidence.");
}

console.log(JSON.stringify({
  status: "PASS_EDITORIAL_V2_WITH_CP002_AND_CP004_BOUNDARIES",
  generatedQuestionCount,
  reviewRowCount,
  orderedPairQuestionCount,
  forbiddenPatternMatches: 0,
  pendingCandidateReviewCount: reviewModel.candidateCount,
  pendingQuestionReviewCount,
  sourceRecoveryFindingCount: MAL_CP001_SOURCE_RECOVERY_FINDINGS.length,
  recoveredBoundaryOwners: [
    threeWayRecovery.ownershipVerdict,
    xatDilutionRecovery.ownershipVerdict,
  ].sort(),
  cp001SourceBlockersCleared: 0,
  permanentQlCount: reviewModel.permanentQlCount,
  publiclyPublishable: reviewModel.publiclyPublishable,
  questionStudioDiscoverable: reviewModel.questionStudioDiscoverable,
}, null, 2));
