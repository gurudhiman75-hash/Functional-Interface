import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH,
  MEN_CP011_DIRECT_SOURCE_REVIEW_CHECKS,
  auditMenCp011DirectSourceHumanReviewBatch,
} from "./direct-source-human-review-batch";

const audit = auditMenCp011DirectSourceHumanReviewBatch();
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp011-direct-source-human-review-batch-v1",
);
mkdirSync(dirname(outputBase), { recursive: true });

writeFileSync(
  `${outputBase}.json`,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      audit,
      reviewChecks: MEN_CP011_DIRECT_SOURCE_REVIEW_CHECKS,
      records: MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH,
    },
    null,
    2,
  ),
  "utf8",
);

const lines = [
  "# MEN-CP-011 Direct-Source Human Review Batch V1",
  "",
  "## Batch verdict",
  "",
  "This export prepares the eight direct-task source candidates for human verification. It does not record, imply or simulate human approval.",
  "",
  "```text",
  `Authority:                          ${audit.authority}`,
  `Inherited source authority:         ${audit.inheritedSourceAuthority}`,
  `Live runtime families:              ${audit.livePrototypeCount}`,
  `Attached source references:         ${audit.attachedReferenceCount}`,
  `Direct candidates in review batch:  ${audit.reviewBatchRecordCount}`,
  `Representation-only support:        ${audit.representationOnlySupportCount}`,
  `Missing direct references:          ${audit.missingDirectReferenceCount}`,
  `Pending human reviews:              ${audit.pendingReviewCount}`,
  `Approved human reviews:             ${audit.approvedReviewCount}`,
  `Promotion-ready candidates:         ${audit.promotionReadyCount}`,
  `Representation-only leaks:          ${audit.representationOnlyLeakCount}`,
  `Directly normalised:                ${audit.directlyNormalisedCount}`,
  `Human review complete:              ${audit.humanReviewComplete}`,
  `Permanent QL allocation allowed:    ${audit.permanentQlAllocationAllowed}`,
  `Publication eligible:               ${audit.publicationEligible}`,
  "```",
  "",
  "## Mandatory review checks",
  "",
];

for (const check of MEN_CP011_DIRECT_SOURCE_REVIEW_CHECKS) {
  lines.push(
    `### ${check.checkId}`,
    "",
    check.prompt,
    "",
    `**Fail rule:** ${check.rejectionRule}`,
    "",
  );
}

lines.push("## Candidate records", "");
for (const record of MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH) {
  lines.push(
    `### ${record.prototypeId}`,
    "",
    `- Family group: \`${record.familyGroup}\``,
    `- Review decision: \`${record.reviewDecision}\``,
    `- Source type: \`${record.sourceEvidence.sourceType}\``,
    `- Document: ${record.sourceEvidence.documentTitle}`,
    `- Edition/year: ${record.sourceEvidence.editionOrYear}`,
    `- Section: ${record.sourceEvidence.chapterOrSection}`,
    `- Page locator: ${record.sourceEvidence.pageLocator}`,
    `- Exemplar locator: ${record.sourceEvidence.exemplarLocator}`,
    `- Immutable extract: \`${record.sourceEvidence.sourceContentHash}\``,
    `- Match classification: \`${record.sourceEvidence.sourceMatchClassification}\``,
    `- Match rationale: ${record.sourceEvidence.sourceMatchRationale}`,
    `- Reviewer: ${record.reviewer ?? "PENDING"}`,
    `- Reviewed at: ${record.reviewedAt ?? "PENDING"}`,
    "",
    "Review checklist:",
    "",
    ...MEN_CP011_DIRECT_SOURCE_REVIEW_CHECKS.map(
      (check) => `- [ ] ${check.checkId}`,
    ),
    "",
    "Reviewer decision:",
    "",
    "- [ ] APPROVED",
    "- [ ] NEEDS_CORRECTION",
    "- [ ] REJECTED",
    "",
    "Reviewer name: ____________________",
    "",
    "Review timestamp: ____________________",
    "",
    "Review notes: ____________________",
    "",
  );
}

lines.push(
  "## Lifecycle lock",
  "",
  "```text",
  "Permanent QLs:      0",
  "Question Studio:    disabled",
  "Question Bank:      NOT_STORED",
  "Test eligibility:   INELIGIBLE",
  "Public publication: false",
  "```",
  "",
  "Human approval of a source candidate is necessary but not sufficient for publication. Source-ledger promotion, English review, permanent QL modelling and multilingual parity remain separate gates.",
);

writeFileSync(`${outputBase}.md`, lines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      reviewBatchRecordCount: audit.reviewBatchRecordCount,
      pendingReviewCount: audit.pendingReviewCount,
      promotionReadyCount: audit.promotionReadyCount,
      representationOnlyLeakCount: audit.representationOnlyLeakCount,
      humanReviewComplete: audit.humanReviewComplete,
      outputJson: `${outputBase}.json`,
      outputMarkdown: `${outputBase}.md`,
    },
    null,
    2,
  ),
);
