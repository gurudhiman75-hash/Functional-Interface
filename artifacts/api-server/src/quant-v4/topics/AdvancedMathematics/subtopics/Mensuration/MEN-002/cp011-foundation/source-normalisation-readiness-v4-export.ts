import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_SOURCE_READINESS_AUTHORITY_V4,
  MEN_CP011_SOURCE_READINESS_ENTRIES_V4,
  MEN_CP011_V4_BOX_LINING_SOURCE_EVIDENCE_BY_PROTOTYPE,
  auditMenCp011SourceReadinessV4,
} from "./source-normalisation-readiness-v4";

const audit = auditMenCp011SourceReadinessV4();
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp011-source-normalisation-readiness-v4",
);
mkdirSync(dirname(outputBase), { recursive: true });

writeFileSync(
  `${outputBase}.json`,
  JSON.stringify(
    {
      authority: MEN_CP011_SOURCE_READINESS_AUTHORITY_V4,
      generatedAt: new Date().toISOString(),
      audit,
      newEvidence: MEN_CP011_V4_BOX_LINING_SOURCE_EVIDENCE_BY_PROTOTYPE,
      entries: MEN_CP011_SOURCE_READINESS_ENTRIES_V4,
    },
    null,
    2,
  ),
  "utf8",
);

const lines = [
  "# MEN-CP-011 Direct-Source Normalisation Readiness V4",
  "",
  "## Verdict",
  "",
  "V4 adds one direct hollow-cuboid material-volume candidate and one representation-only inner cylindrical lining-cost reference. Human review and all product lifecycle locks remain pending.",
  "",
  "```text",
  `Authority:                          ${audit.authority}`,
  `Inherited authority:                ${audit.inheritedAuthority}`,
  `Live runtime families:              ${audit.livePrototypeCount}`,
  `Attached source references:         ${audit.attachedReferenceCount}`,
  `Direct task matches pending review: ${audit.directTaskMatchPendingReviewCount}`,
  `Representation-only support:        ${audit.representationOnlySupportCount}`,
  `Directly normalised:                ${audit.directlyNormalisedCount}`,
  `Missing direct references:          ${audit.missingDirectReferenceCount}`,
  `Incomplete attached references:     ${audit.incompleteAttachedReferenceCount}`,
  `False normalisation claims:          ${audit.falselyNormalisedCount}`,
  `Source normalisation complete:       ${audit.sourceNormalisationComplete}`,
  `Publication eligible:               ${audit.publicationEligible}`,
  "```",
  "",
  "## New V4 evidence",
  "",
];

for (const [prototypeId, evidence] of Object.entries(
  MEN_CP011_V4_BOX_LINING_SOURCE_EVIDENCE_BY_PROTOTYPE,
)) {
  lines.push(
    `### ${prototypeId}`,
    "",
    `- Classification: \`${evidence.sourceMatchClassification}\``,
    `- Source: ${evidence.documentTitle}`,
    `- Edition: ${evidence.editionOrYear}`,
    `- Locator: ${evidence.pageLocator}`,
    `- Exemplar: ${evidence.exemplarLocator}`,
    `- Immutable extract: \`${evidence.sourceContentHash}\``,
    `- Rationale: ${evidence.sourceMatchRationale}`,
    `- Reviewer: ${evidence.reviewer ?? "pending"}`,
    `- Reviewed at: ${evidence.reviewedAt ?? "pending"}`,
    "",
  );
}

lines.push(
  "## Fail-closed lifecycle",
  "",
  "The hollow-cuboid entry cannot become directly normalised until reviewer identity and timestamp are present. The inner-lining entry remains ineligible even after review because its source covers the curved wall only, while the live family includes the curved wall and bottom.",
  "",
  "```text",
  "Permanent QLs:      0",
  "Question Studio:    disabled",
  "Question Bank:      NOT_STORED",
  "Test eligibility:   INELIGIBLE",
  "Public publication: false",
  "```",
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
      missingDirectReferenceCount: audit.missingDirectReferenceCount,
      outputJson: `${outputBase}.json`,
      outputMarkdown: `${outputBase}.md`,
    },
    null,
    2,
  ),
);
