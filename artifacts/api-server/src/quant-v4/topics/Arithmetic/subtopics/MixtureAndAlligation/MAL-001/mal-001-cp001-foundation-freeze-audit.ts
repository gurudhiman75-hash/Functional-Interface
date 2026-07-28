import {
  MAL_CP001_APPROVED_SCOPE_PROTOTYPE_IDS,
  MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS,
  MAL_CP001_DEFERRED_PROTOTYPE_IDS,
  MAL_CP001_HELD_PROTOTYPE_IDS,
} from "./foundation/cp001-product-approval";
import {
  MAL_CP001_FOUNDATION_FREEZE_METADATA,
  MAL_CP001_FOUNDATION_PRESERVED_EXCLUSIONS,
  MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS,
  MAL_CP001_FROZEN_QL_TEMPLATES,
  MAL_CP001_FROZEN_SOLVE_MODES,
} from "./foundation/cp001-foundation-freeze-ledger";
import {
  MAL_CP001_FOUNDATION_PROTOTYPE_CONTRACTS,
  generateMalCp001FoundationQuestion,
} from "./foundation/cp001-foundation-normalizer";
import { buildMalCp001FoundationReviewModel } from "./foundation/cp001-foundation-review-model";
import { MAL_CP001_OWNERSHIP_RESOLUTIONS } from "./foundation/cp001-ownership-resolution-ledger";
import { MAL_CP001_QL_GAP_LEDGER } from "./foundation/cp001-ql-gap-ledger";

function fail(message: string): never {
  throw new Error(message);
}

function assertExactlyOnce(values: readonly string[], expected: readonly string[], label: string): void {
  if (values.length !== expected.length) {
    fail(`${label}: expected ${expected.length}, received ${values.length}.`);
  }
  if (new Set(values).size !== values.length) {
    fail(`${label}: duplicate entries detected.`);
  }
  for (const item of expected) {
    if (!values.includes(item)) fail(`${label}: missing ${item}.`);
  }
}

const forbiddenStemPatterns: readonly [string, RegExp][] = [
  ["incorrect article", /\bA edible\b/u],
  ["plural agreement", /\btea leaves is\b/iu],
  ["plural unit modifier", /\b(?:a|A) \d+(?:\s+\d+\/\d+)? litres portion\b/u],
  ["ambiguous source pronoun", /\bWhat is its value per unit\?/u],
  ["generic unknown grade", /\bunknown grade's value per unit\b/u],
  ["awkward share prompt", /\bWhat is the share of\b/u],
];

const forbiddenExplanationPatterns: readonly [string, RegExp][] = [
  ["capitalised trap heading", /^Common Trap:/u],
  ["generic unknown source conclusion", /\bthe unknown source costs\b/u],
  ["generic component conclusion", /\bthe required component quantity is\b/u],
];

if (
  !MAL_CP001_FOUNDATION_FREEZE_METADATA.foundationFreezeReady ||
  !MAL_CP001_FOUNDATION_FREEZE_METADATA.solveModeCountFrozen ||
  !MAL_CP001_FOUNDATION_FREEZE_METADATA.qlTemplateCountFrozen
) {
  fail("Foundation freeze metadata is not closed.");
}
if (
  MAL_CP001_FOUNDATION_FREEZE_METADATA.permanentQlCount !== 0 ||
  MAL_CP001_FOUNDATION_FREEZE_METADATA.publiclyPublishable ||
  MAL_CP001_FOUNDATION_FREEZE_METADATA.questionStudioDiscoverable ||
  MAL_CP001_FOUNDATION_FREEZE_METADATA.questionBankWritable ||
  MAL_CP001_FOUNDATION_FREEZE_METADATA.testEligible
) {
  fail("Foundation freeze escaped its review-only lifecycle boundary.");
}

if (MAL_CP001_FROZEN_SOLVE_MODES.length !== 7) {
  fail(`Expected 7 frozen solve modes, received ${MAL_CP001_FROZEN_SOLVE_MODES.length}.`);
}
if (MAL_CP001_FROZEN_QL_TEMPLATES.length !== 11) {
  fail(`Expected 11 frozen QL templates, received ${MAL_CP001_FROZEN_QL_TEMPLATES.length}.`);
}

assertExactlyOnce(
  MAL_CP001_FROZEN_SOLVE_MODES.map((entry) => entry.solveModeId),
  MAL_CP001_FROZEN_SOLVE_MODES.map((entry) => entry.solveModeId),
  "frozen solve-mode IDs",
);
assertExactlyOnce(
  MAL_CP001_FROZEN_QL_TEMPLATES.map((entry) => entry.qlTemplateId),
  MAL_CP001_FROZEN_QL_TEMPLATES.map((entry) => entry.qlTemplateId),
  "frozen QL-template IDs",
);

const representedPrototypes = MAL_CP001_FROZEN_QL_TEMPLATES.flatMap(
  (entry) => entry.prototypeIds,
);
assertExactlyOnce(
  representedPrototypes,
  MAL_CP001_APPROVED_SCOPE_PROTOTYPE_IDS,
  "frozen approved-prototype coverage",
);

const excludedPrototypeSet = new Set<string>([
  ...MAL_CP001_DEFERRED_PROTOTYPE_IDS,
  ...MAL_CP001_HELD_PROTOTYPE_IDS,
  ...MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS,
]);
for (const prototypeId of representedPrototypes) {
  if (excludedPrototypeSet.has(prototypeId)) {
    fail(`Excluded prototype leaked into the frozen foundation: ${prototypeId}.`);
  }
}

const targetRatio = MAL_CP001_FROZEN_QL_TEMPLATES.find(
  (entry) => entry.qlTemplateId === "MAL-CP001-QLC-TARGET-RATIO",
);
if (!targetRatio || targetRatio.taskDirection !== "INVERSE") {
  fail("Target-ratio template must be frozen as an inverse task.");
}
for (const template of MAL_CP001_FROZEN_QL_TEMPLATES) {
  if (
    template.foundationStatus !== "FROZEN_FOUNDATION_ENGLISH" ||
    template.permanentQlId !== null ||
    template.publiclyPublishable ||
    template.questionStudioDiscoverable
  ) {
    fail(`${template.qlTemplateId} escaped the frozen review-only boundary.`);
  }
  for (const prototypeId of template.prototypeIds) {
    const contract = MAL_CP001_FOUNDATION_PROTOTYPE_CONTRACTS[prototypeId];
    if (
      contract.qlTemplateId !== template.qlTemplateId ||
      contract.solveModeId !== template.solveModeId
    ) {
      fail(`${prototypeId} disagrees with its frozen template contract.`);
    }
  }
}

if (MAL_CP001_OWNERSHIP_RESOLUTIONS.length !== 2) {
  fail("Expected two closed ownership resolutions.");
}
for (const resolution of MAL_CP001_OWNERSHIP_RESOLUTIONS) {
  if (resolution.openOwnershipGap || resolution.newQlTemplateAdmitted) {
    fail(`${resolution.resolutionId} did not close without QL inflation.`);
  }
}

if (MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS.length !== 3) {
  fail("Expected three frozen source-gap dispositions.");
}
const sourceDispositionIds = MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS.map((entry) => entry.gapId);
assertExactlyOnce(
  sourceDispositionIds,
  [
    "MAL-CP001-GAP-FINAL-TOTAL-QUANTITY",
    "MAL-CP001-GAP-QUANTITY-DIFFERENCE-OUTPUT",
    "MAL-CP001-GAP-IMPOSSIBLE-OR-INDETERMINATE",
  ],
  "source-gap dispositions",
);
for (const gapId of sourceDispositionIds) {
  const historical = MAL_CP001_QL_GAP_LEDGER.find((entry) => entry.gapId === gapId);
  if (
    !historical ||
    historical.sourceStatus !== "NO_DIRECT_FIXTURE_RECOVERED" ||
    !historical.requiresDirectSourceEvidence ||
    historical.newQlTemplateAdmitted
  ) {
    fail(`${gapId} was not a legitimate source-blocked direction.`);
  }
}

if (MAL_CP001_FOUNDATION_PRESERVED_EXCLUSIONS.length !== 3) {
  fail("Expected the three product-approved exclusions to remain explicit.");
}

let generatedQuestionCount = 0;
let deterministicRegenerationCount = 0;
const generatedStems = new Set<string>();
for (const prototypeId of MAL_CP001_APPROVED_SCOPE_PROTOTYPE_IDS) {
  const contract = MAL_CP001_FOUNDATION_PROTOTYPE_CONTRACTS[prototypeId];
  for (let index = 0; index < 80; index += 1) {
    const seed = `foundation-freeze-${index}`;
    const question: any = generateMalCp001FoundationQuestion(prototypeId, seed);
    const repeated: any = generateMalCp001FoundationQuestion(prototypeId, seed);
    generatedQuestionCount += 1;

    if (JSON.stringify(question) !== JSON.stringify(repeated)) {
      fail(`${prototypeId}/${seed} is not deterministic.`);
    }
    deterministicRegenerationCount += 1;

    if (
      question.foundationQlTemplateId !== contract.qlTemplateId ||
      question.foundationSolveModeId !== contract.solveModeId ||
      question.taskDirection !== contract.taskDirection ||
      question.answerSemantic !== contract.answerSemantic
    ) {
      fail(`${prototypeId}/${seed} has inconsistent frozen learner metadata.`);
    }
    if (!question.validation?.ok) {
      fail(`${prototypeId}/${seed} failed runtime validation.`);
    }
    if (question.options.length !== 4 || new Set(question.options).size !== 4) {
      fail(`${prototypeId}/${seed} does not have four unique options.`);
    }
    if (question.optionAudit[question.correctIndex]?.misconceptionId !== "CORRECT") {
      fail(`${prototypeId}/${seed} has an invalid correct-option contract.`);
    }
    if (
      question.permanentQlId !== null ||
      question.publiclyPublishable ||
      question.questionStudioDiscoverable
    ) {
      fail(`${prototypeId}/${seed} escaped the foundation lifecycle boundary.`);
    }

    for (const [label, pattern] of forbiddenStemPatterns) {
      if (pattern.test(question.stem)) {
        fail(`${prototypeId}/${seed}: ${label}: ${question.stem}`);
      }
    }
    if (
      !question.explanation?.opening ||
      !question.explanation?.formula ||
      !Array.isArray(question.explanation?.steps) ||
      question.explanation.steps.length < 3 ||
      !question.explanation?.verification ||
      !question.explanation?.conclusion ||
      !question.explanation?.commonTrap
    ) {
      fail(`${prototypeId}/${seed} lacks the complete explanation contract.`);
    }
    for (const [label, pattern] of forbiddenExplanationPatterns) {
      if (pattern.test(question.explanation.conclusion) || pattern.test(question.explanation.commonTrap)) {
        fail(`${prototypeId}/${seed}: ${label}.`);
      }
    }
    generatedStems.add(question.stem);
  }
}
if (generatedQuestionCount !== 960 || deterministicRegenerationCount !== 960) {
  fail(`Expected 960 foundation audit questions, received ${generatedQuestionCount}/${deterministicRegenerationCount}.`);
}
if (generatedStems.size < 850) {
  fail(`Foundation stem diversity is too low: ${generatedStems.size}/960.`);
}

const reviewModel = buildMalCp001FoundationReviewModel();
if (
  reviewModel.status !== "FROZEN_FOUNDATION_ENGLISH_REVIEW_PASS" ||
  reviewModel.solveModeCount !== 7 ||
  reviewModel.qlTemplateCount !== 11 ||
  reviewModel.approvedPrototypeCount !== 12 ||
  reviewModel.questionCount !== 48 ||
  reviewModel.editorialReviewStatus !== "PASS" ||
  !reviewModel.qlTemplateCountFrozen ||
  !reviewModel.solveModeCountFrozen ||
  reviewModel.permanentQlCount !== 0 ||
  reviewModel.publiclyPublishable ||
  reviewModel.questionStudioDiscoverable
) {
  fail("Foundation review model does not match the frozen authority.");
}

let passedTemplateCount = 0;
let passedQuestionCount = 0;
for (const templateGroup of reviewModel.templateGroups) {
  if (templateGroup.editorialReviewStatus !== "PASS") {
    fail(`${templateGroup.template.qlTemplateId} did not pass grouped review.`);
  }
  passedTemplateCount += 1;
  for (const prototypeGroup of templateGroup.prototypeGroups) {
    if (prototypeGroup.editorialReviewStatus !== "PASS") {
      fail(`${prototypeGroup.prototypeId} did not pass grouped review.`);
    }
    for (const row of prototypeGroup.questions) {
      if (
        row.editorialReviewStatus !== "PASS" ||
        row.reviewMethod !== "GROUPED_MANUAL_AND_EXECUTABLE_AUDIT"
      ) {
        fail(`${row.reviewKey} lacks a completed foundation review decision.`);
      }
      passedQuestionCount += 1;
    }
  }
}
if (passedTemplateCount !== 11 || passedQuestionCount !== 48) {
  fail(`Unexpected reviewed frontier ${passedTemplateCount}/${passedQuestionCount}.`);
}

console.log(JSON.stringify({
  status: "PASS_CP001_FOUNDATION_FROZEN_ENGLISH_AUTHORITY",
  frozenSolveModeCount: MAL_CP001_FROZEN_SOLVE_MODES.length,
  frozenQlTemplateCount: MAL_CP001_FROZEN_QL_TEMPLATES.length,
  frozenApprovedPrototypeCount: representedPrototypes.length,
  groupedReviewTemplateCount: passedTemplateCount,
  groupedReviewQuestionCount: passedQuestionCount,
  exhaustiveFoundationQuestionCount: generatedQuestionCount,
  deterministicRegenerationCount,
  distinctFoundationStemCount: generatedStems.size,
  closedOwnershipResolutionCount: MAL_CP001_OWNERSHIP_RESOLUTIONS.length,
  deferredSourceDirectionCount: MAL_CP001_FOUNDATION_SOURCE_DISPOSITIONS.length,
  preservedProductExclusionCount: MAL_CP001_FOUNDATION_PRESERVED_EXCLUSIONS.length,
  foundationFreezeReady: true,
  solveModeCountFrozen: true,
  qlTemplateCountFrozen: true,
  permanentQlCount: 0,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
}, null, 2));
