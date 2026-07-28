import {
  MAL_CP001_APPROVED_PROTOTYPE_IDS,
  MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS,
  MAL_CP001_DEFERRED_PROTOTYPE_IDS,
  MAL_CP001_HELD_PROTOTYPE_IDS,
  MAL_CP001_PRODUCT_APPROVAL_METADATA,
} from "./foundation/cp001-product-approval";
import {
  MAL_CP001_PROVISIONAL_QL_TEMPLATE_IDS,
  MAL_CP001_PROVISIONAL_QL_TEMPLATES,
  MAL_CP001_PROVISIONAL_SOLVE_MODE_IDS,
  MAL_CP001_PROVISIONAL_SOLVE_MODES,
} from "./foundation/cp001-ql-expansion-ledger";
import {
  buildMalCp001QlExpansionReviewModel,
} from "./foundation/cp001-ql-expansion-review-model";

function fail(message: string): never {
  throw new Error(message);
}

function assertExactlyOnce(values: readonly string[], expected: readonly string[], label: string): void {
  if (values.length !== expected.length) {
    fail(`${label}: expected ${expected.length} entries, received ${values.length}.`);
  }
  if (new Set(values).size !== values.length) {
    fail(`${label}: duplicate entries detected.`);
  }
  for (const item of expected) {
    if (!values.includes(item)) fail(`${label}: missing ${item}.`);
  }
}

if (!MAL_CP001_PRODUCT_APPROVAL_METADATA.allocationScopeFrozen) {
  fail("QL expansion cannot start before the approved mathematical scope is frozen.");
}
if (
  MAL_CP001_PRODUCT_APPROVAL_METADATA.qlTemplateCountFrozen ||
  MAL_CP001_PRODUCT_APPROVAL_METADATA.permanentQlCount !== 0
) {
  fail("The QL expansion frontier was incorrectly treated as a permanent freeze.");
}

if (MAL_CP001_PROVISIONAL_SOLVE_MODES.length !== 7) {
  fail(`Expected 7 provisional solve modes, received ${MAL_CP001_PROVISIONAL_SOLVE_MODES.length}.`);
}
if (MAL_CP001_PROVISIONAL_QL_TEMPLATES.length !== 11) {
  fail(`Expected 11 provisional QL templates, received ${MAL_CP001_PROVISIONAL_QL_TEMPLATES.length}.`);
}
assertExactlyOnce(
  MAL_CP001_PROVISIONAL_SOLVE_MODES.map((entry) => entry.solveModeId),
  MAL_CP001_PROVISIONAL_SOLVE_MODE_IDS,
  "solve-mode IDs",
);
assertExactlyOnce(
  MAL_CP001_PROVISIONAL_QL_TEMPLATES.map((entry) => entry.qlTemplateId),
  MAL_CP001_PROVISIONAL_QL_TEMPLATE_IDS,
  "QL-template IDs",
);

const representedApprovedPrototypes = MAL_CP001_PROVISIONAL_QL_TEMPLATES.flatMap(
  (entry) => entry.prototypeIds,
);
assertExactlyOnce(
  representedApprovedPrototypes,
  MAL_CP001_APPROVED_PROTOTYPE_IDS,
  "approved prototype coverage",
);

const excludedPrototypeSet = new Set<string>([
  ...MAL_CP001_DEFERRED_PROTOTYPE_IDS,
  ...MAL_CP001_HELD_PROTOTYPE_IDS,
  ...MAL_CP001_CP002_REFERRED_PROTOTYPE_IDS,
]);
for (const prototypeId of representedApprovedPrototypes) {
  if (excludedPrototypeSet.has(prototypeId)) {
    fail(`Excluded prototype leaked into QL expansion: ${prototypeId}.`);
  }
}

const solveModeUsage = new Map<string, number>();
const candidateCoverage = new Set<string>();
for (const template of MAL_CP001_PROVISIONAL_QL_TEMPLATES) {
  if (template.prototypeIds.length === 0) {
    fail(`${template.qlTemplateId} has no executable prototype evidence.`);
  }
  if (template.splitDimensions.length === 0) {
    fail(`${template.qlTemplateId} has no material merge/split dimension.`);
  }
  if (
    template.provisionalStatus !== "EXECUTABLE_EXPANSION_FRONTIER" ||
    template.permanentQlId !== null ||
    template.publiclyPublishable ||
    template.questionStudioDiscoverable
  ) {
    fail(`${template.qlTemplateId} escaped the provisional safety boundary.`);
  }
  solveModeUsage.set(
    template.solveModeId,
    (solveModeUsage.get(template.solveModeId) ?? 0) + 1,
  );
  candidateCoverage.add(template.freezeCandidateId);
}
for (const solveModeId of MAL_CP001_PROVISIONAL_SOLVE_MODE_IDS) {
  if (!solveModeUsage.has(solveModeId)) {
    fail(`Unused provisional solve mode: ${solveModeId}.`);
  }
}
if (candidateCoverage.size !== 6) {
  fail(`Expected the six approved candidate contracts, received ${candidateCoverage.size}.`);
}

const templateById = new Map(
  MAL_CP001_PROVISIONAL_QL_TEMPLATES.map((entry) => [entry.qlTemplateId, entry]),
);
const oneKnownQuantity = templateById.get("MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN");
if (
  !oneKnownQuantity ||
  oneKnownQuantity.prototypeIds.length !== 2 ||
  !oneKnownQuantity.prototypeIds.includes("MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY") ||
  !oneKnownQuantity.prototypeIds.includes("MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET")
) {
  fail("Addition framing was not merged into the one-known unknown-quantity template.");
}

const finalMeanTemplates = MAL_CP001_PROVISIONAL_QL_TEMPLATES.filter(
  (entry) => entry.solveModeId === "MAL-CP001-SM-FINAL-MEAN",
);
if (finalMeanTemplates.length !== 3) {
  fail(`Final mean must have three evidence-specific templates, received ${finalMeanTemplates.length}.`);
}

const sourceValueTemplates = MAL_CP001_PROVISIONAL_QL_TEMPLATES.filter(
  (entry) => entry.freezeCandidateId === "MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE",
);
if (
  sourceValueTemplates.length !== 2 ||
  new Set(sourceValueTemplates.map((entry) => entry.solveModeId)).size !== 2
) {
  fail("Explicit-quantity and ratio-evidence unknown-source tasks must remain separate solve modes.");
}

const ratioScaleTemplates = MAL_CP001_PROVISIONAL_QL_TEMPLATES.filter(
  (entry) => entry.solveModeId === "MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL",
);
if (
  ratioScaleTemplates.length !== 2 ||
  new Set(ratioScaleTemplates.map((entry) => entry.answerSemantic)).size !== 2
) {
  fail("Ratio-scale pair and requested-share outputs must be separate templates under one solve mode.");
}

const reviewModel = buildMalCp001QlExpansionReviewModel();
if (
  reviewModel.provisionalSolveModeCount !== 7 ||
  reviewModel.provisionalQlTemplateCount !== 11 ||
  reviewModel.approvedPrototypeCount !== 12 ||
  reviewModel.questionCount !== 48
) {
  fail(
    `Unexpected review frontier ${reviewModel.provisionalSolveModeCount}/${reviewModel.provisionalQlTemplateCount}/${reviewModel.approvedPrototypeCount}/${reviewModel.questionCount}.`,
  );
}
if (
  reviewModel.humanReviewStatus !== "PENDING" ||
  reviewModel.qlTemplateCountFrozen ||
  reviewModel.solveModeCountFrozen ||
  reviewModel.permanentQlCount !== 0 ||
  reviewModel.publiclyPublishable ||
  reviewModel.questionStudioDiscoverable
) {
  fail("QL expansion review model escaped its provisional boundary.");
}

let pendingRowCount = 0;
for (const templateGroup of reviewModel.templateGroups) {
  if (templateGroup.humanReviewStatus !== "PENDING") {
    fail(`${templateGroup.template.qlTemplateId} has fabricated template approval.`);
  }
  for (const prototypeGroup of templateGroup.prototypeGroups) {
    for (const row of prototypeGroup.questions) {
      pendingRowCount += 1;
      if (row.humanReviewStatus !== "PENDING") {
        fail(`${row.reviewKey} has fabricated row approval.`);
      }
      if (!row.question.validation.ok) {
        fail(`${row.reviewKey} failed runtime validation: ${row.question.validation.errors.join(" | ")}`);
      }
      if (
        row.question.permanentQlId !== null ||
        row.question.publiclyPublishable ||
        row.question.questionStudioDiscoverable
      ) {
        fail(`${row.reviewKey} escaped the discovery safety boundary.`);
      }
      if (row.question.options.length !== 4 || new Set(row.question.options).size !== 4) {
        fail(`${row.reviewKey} does not have four unique options.`);
      }
      if (row.question.optionAudit[row.question.correctIndex]?.misconceptionId !== "CORRECT") {
        fail(`${row.reviewKey} does not point to the canonical correct option.`);
      }
    }
  }
}
if (pendingRowCount !== 48) {
  fail(`Expected 48 pending QL-expansion rows, received ${pendingRowCount}.`);
}

console.log(JSON.stringify({
  status: "PASS_PROVISIONAL_QL_EXPANSION_FRONTIER",
  approvedCandidateContractCount: candidateCoverage.size,
  approvedPrototypeCount: representedApprovedPrototypes.length,
  provisionalSolveModeCount: MAL_CP001_PROVISIONAL_SOLVE_MODES.length,
  provisionalQlTemplateCount: MAL_CP001_PROVISIONAL_QL_TEMPLATES.length,
  reviewQuestionCount: reviewModel.questionCount,
  pendingTemplateReviewCount: reviewModel.templateGroups.length,
  pendingQuestionReviewCount: pendingRowCount,
  excludedPrototypeCount: excludedPrototypeSet.size,
  qlTemplateCountFrozen: reviewModel.qlTemplateCountFrozen,
  solveModeCountFrozen: reviewModel.solveModeCountFrozen,
  permanentQlCount: reviewModel.permanentQlCount,
  publiclyPublishable: reviewModel.publiclyPublishable,
  questionStudioDiscoverable: reviewModel.questionStudioDiscoverable,
  solveModeUsage: Object.fromEntries([...solveModeUsage.entries()].sort()),
}, null, 2));
