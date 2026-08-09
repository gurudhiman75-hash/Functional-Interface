import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_AI_PRE_REVIEW_DECISIONS,
  MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH_V2,
  MEN_CP011_SOURCE_READINESS_ENTRIES_V5,
  auditMenCp011SourceReadinessV5,
} from "./source-normalisation-readiness-v5";

const audit = auditMenCp011SourceReadinessV5();
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp011-source-ai-pre-review-v5",
);
mkdirSync(dirname(outputBase), { recursive: true });

writeFileSync(
  `${outputBase}.json`,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      audit,
      aiPreReviewDecisions: MEN_CP011_AI_PRE_REVIEW_DECISIONS,
      revisedHumanReviewQueue:
        MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH_V2,
      sourceReadinessEntries: MEN_CP011_SOURCE_READINESS_ENTRIES_V5,
    },
    null,
    2,
  ),
  "utf8",
);

const lines = [
  "# MEN-CP-011 Source AI Pre-Review V5",
  "",
  "## Verdict",
  "",
  "This export records an AI editorial pre-review of the eight V4 direct-source candidates. It corrects source classifications but does not record or simulate human approval.",
  "",
  "```text",
  `Authority:                          ${audit.authority}`,
  `Inherited authority:                ${audit.inheritedAuthority}`,
  `AI pre-review authority:            ${audit.aiPreReviewAuthority}`,
  `Revised human-review authority:     ${audit.humanReviewBatchAuthority}`,
  `Live runtime families:              ${audit.livePrototypeCount}`,
  `Attached source references:         ${audit.attachedReferenceCount}`,
  `Direct matches pending human review:${audit.directTaskMatchPendingReviewCount.toString().padStart(3, " ")}`,
  `Representation-only support:        ${audit.representationOnlySupportCount}`,
  `Missing direct references:          ${audit.missingDirectReferenceCount}`,
  `AI retained as direct:              ${audit.aiRetainDirectCount}`,
  `AI downgraded:                      ${audit.aiDowngradeCount}`,
  `Approved human reviews:             ${audit.approvedHumanReviewCount}`,
  `Directly normalised:                ${audit.directlyNormalisedCount}`,
  `Permanent QL allocation allowed:    ${audit.permanentQlAllocationAllowed}`,
  `Publication eligible:               ${audit.publicationEligible}`,
  "```",
  "",
  "## AI pre-review decisions",
  "",
];

for (const decision of MEN_CP011_AI_PRE_REVIEW_DECISIONS) {
  lines.push(
    `### ${decision.prototypeId}`,
    "",
    `- Recommendation: \`${decision.recommendation}\``,
    `- Failed direct-review checks: ${
      decision.failedCheckIds.length > 0
        ? decision.failedCheckIds.map((checkId) => `\`${checkId}\``).join(", ")
        : "none identified by AI pre-review"
    }`,
    `- Human approval recorded: \`${decision.humanApprovalRecorded}\``,
    `- Rationale: ${decision.rationale}`,
    "",
  );
}

lines.push(
  "## Revised human-review queue",
  "",
  "Only the following records remain eligible for genuine human direct-source review:",
  "",
);

for (const record of MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH_V2) {
  lines.push(
    `### ${record.prototypeId}`,
    "",
    `- Family group: \`${record.familyGroup}\``,
    `- Document: ${record.sourceEvidence.documentTitle}`,
    `- Edition/year: ${record.sourceEvidence.editionOrYear}`,
    `- Page locator: ${record.sourceEvidence.pageLocator}`,
    `- Exemplar locator: ${record.sourceEvidence.exemplarLocator}`,
    `- Review decision: \`${record.reviewDecision}\``,
    `- Reviewer: ${record.reviewer ?? "PENDING"}`,
    `- Reviewed at: ${record.reviewedAt ?? "PENDING"}`,
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
  "Human review, source-ledger promotion, English freeze, permanent QL modelling and multilingual parity remain separate later gates.",
);

writeFileSync(`${outputBase}.md`, lines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      attachedReferenceCount: audit.attachedReferenceCount,
      directTaskMatchPendingReviewCount:
        audit.directTaskMatchPendingReviewCount,
      representationOnlySupportCount:
        audit.representationOnlySupportCount,
      missingDirectReferenceCount: audit.missingDirectReferenceCount,
      revisedHumanReviewQueueCount: audit.revisedHumanReviewQueueCount,
      approvedHumanReviewCount: audit.approvedHumanReviewCount,
      outputJson: `${outputBase}.json`,
      outputMarkdown: `${outputBase}.md`,
    },
    null,
    2,
  ),
);
