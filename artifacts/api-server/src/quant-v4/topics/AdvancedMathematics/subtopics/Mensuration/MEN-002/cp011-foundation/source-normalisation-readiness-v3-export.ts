import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_SOURCE_READINESS_AUTHORITY_V3,
  MEN_CP011_SOURCE_READINESS_ENTRIES_V3,
  MEN_CP011_V3_SHELL_SOURCE_EVIDENCE_BY_PROTOTYPE,
  auditMenCp011SourceReadinessV3,
} from "./source-normalisation-readiness-v3";
import { MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES } from "./source-normalisation-readiness";

const audit = auditMenCp011SourceReadinessV3();
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp011-source-normalisation-readiness-v3",
);
mkdirSync(dirname(outputBase), { recursive: true });

writeFileSync(
  `${outputBase}.json`,
  JSON.stringify(
    {
      authority: MEN_CP011_SOURCE_READINESS_AUTHORITY_V3,
      generatedAt: new Date().toISOString(),
      audit,
      shellEvidence: MEN_CP011_V3_SHELL_SOURCE_EVIDENCE_BY_PROTOTYPE,
      entries: MEN_CP011_SOURCE_READINESS_ENTRIES_V3,
      neighbourOwnershipBoundaries:
        MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES,
    },
    null,
    2,
  ),
  "utf8",
);

const lines = [
  "# MEN-CP-011 Direct-Source Normalisation Readiness V3",
  "",
  "## Verdict",
  "",
  "Two direct R.S. Aggarwal shell exemplars are now attached with stable printed-page and question locators. They are direct-task candidates, not reviewed or directly normalised entries.",
  "",
  "```text",
  `Authority:                          ${audit.authority}`,
  `Inherited authority:                ${audit.inheritedAuthority}`,
  `Live runtime families:              ${audit.livePrototypeCount}`,
  `Ledger families:                    ${audit.ledgerPrototypeCount}`,
  `Live/ledger sets match:             ${audit.liveAndLedgerSetsMatch}`,
  `Attached source references:         ${audit.attachedReferenceCount}`,
  `Direct task matches pending review: ${audit.directTaskMatchPendingReviewCount}`,
  `Representation-only support:        ${audit.representationOnlySupportCount}`,
  `Directly normalised:                ${audit.directlyNormalisedCount}`,
  `Missing direct references:          ${audit.missingDirectReferenceCount}`,
  `Incomplete attached references:     ${audit.incompleteAttachedReferenceCount}`,
  `False normalisation claims:         ${audit.falselyNormalisedCount}`,
  `Source normalisation complete:      ${audit.sourceNormalisationComplete}`,
  `Permanent QL allocation allowed:    ${audit.permanentQlAllocationAllowed}`,
  `Publication eligible:               ${audit.publicationEligible}`,
  "```",
  "",
  "## New direct-task candidates",
  "",
];

for (const [prototypeId, evidence] of Object.entries(
  MEN_CP011_V3_SHELL_SOURCE_EVIDENCE_BY_PROTOTYPE,
)) {
  lines.push(
    `### ${prototypeId}`,
    "",
    `- Source: ${evidence.documentTitle}`,
    `- Edition: ${evidence.editionOrYear}`,
    `- Section: ${evidence.chapterOrSection}`,
    `- Page: ${evidence.pageLocator}`,
    `- Exemplar: ${evidence.exemplarLocator}`,
    `- Classification: \`${evidence.sourceMatchClassification}\``,
    `- Rationale: ${evidence.sourceMatchRationale}`,
    `- Immutable extract: \`${evidence.sourceContentHash}\``,
    `- Reviewer: \`${evidence.reviewer ?? "PENDING"}\``,
    `- Reviewed at: \`${evidence.reviewedAt ?? "PENDING"}\``,
    "",
  );
}

lines.push(
  "## Lifecycle",
  "",
  "```text",
  "Permanent QLs:      0",
  "Question Studio:    disabled",
  "Question Bank:      NOT_STORED",
  "Test eligibility:   INELIGIBLE",
  "Public publication: false",
  "```",
  "",
  "These additions do not promote runtime source maturity. Direct normalisation still requires human source verification and reviewer attestation.",
);

writeFileSync(`${outputBase}.md`, lines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      attachedReferenceCount: audit.attachedReferenceCount,
      directTaskMatchPendingReviewCount:
        audit.directTaskMatchPendingReviewCount,
      representationOnlySupportCount: audit.representationOnlySupportCount,
      directlyNormalisedCount: audit.directlyNormalisedCount,
      missingDirectReferenceCount: audit.missingDirectReferenceCount,
      outputJson: `${outputBase}.json`,
      outputMarkdown: `${outputBase}.md`,
    },
    null,
    2,
  ),
);
