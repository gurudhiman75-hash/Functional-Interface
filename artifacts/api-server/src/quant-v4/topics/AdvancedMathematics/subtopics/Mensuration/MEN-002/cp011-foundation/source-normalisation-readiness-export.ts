import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES,
  MEN_CP011_SOURCE_READINESS_AUTHORITY,
  MEN_CP011_SOURCE_READINESS_ENTRIES,
  auditMenCp011SourceReadiness,
  hasAttachedSourceReference,
} from "./source-normalisation-readiness";

const audit = auditMenCp011SourceReadiness();
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp011-source-normalisation-readiness",
);
mkdirSync(dirname(outputBase), { recursive: true });

writeFileSync(
  `${outputBase}.json`,
  JSON.stringify(
    {
      authority: MEN_CP011_SOURCE_READINESS_AUTHORITY,
      generatedAt: new Date().toISOString(),
      audit,
      entries: MEN_CP011_SOURCE_READINESS_ENTRIES,
      neighbourOwnershipBoundaries:
        MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES,
    },
    null,
    2,
  ),
  "utf8",
);

const lines = [
  "# MEN-CP-011 Direct-Source Normalisation Readiness Audit",
  "",
  "## Verdict",
  "",
  "Formula correctness and canonical ownership remain proven for all live families. Thirteen source candidates are now attached, but none is directly normalised because human source review has not been recorded and eight attachments are representation-only support rather than direct task matches.",
  "",
  "```text",
  `Authority:                         ${audit.authority}`,
  `Live runtime families:             ${audit.livePrototypeCount}`,
  `Ledger families:                   ${audit.ledgerPrototypeCount}`,
  `Live/ledger sets match:            ${audit.liveAndLedgerSetsMatch}`,
  `Canonical ownership confirmed:     ${audit.canonicalOwnerConfirmedCount}`,
  `Executable formula authority:      ${audit.executableFormulaAuthorityCount}`,
  `Attached source references:        ${audit.attachedReferenceCount}`,
  `Direct task matches pending review:${audit.directTaskMatchPendingReviewCount}`,
  `Representation-only support:       ${audit.representationOnlySupportCount}`,
  `Directly normalised:               ${audit.directlyNormalisedCount}`,
  `Missing direct references:         ${audit.missingDirectReferenceCount}`,
  `Incomplete attached references:    ${audit.incompleteAttachedReferenceCount}`,
  `False normalisation claims:        ${audit.falselyNormalisedCount}`,
  `Neighbour boundaries recorded:     ${audit.neighbourBoundaryCount}`,
  `Source normalisation complete:     ${audit.sourceNormalisationComplete}`,
  `Permanent QL allocation allowed:   ${audit.permanentQlAllocationAllowed}`,
  `Publication eligible:              ${audit.publicationEligible}`,
  "```",
  "",
  "## Classification rule",
  "",
  "- `DIRECT_TASK_MATCH` means the located exemplar asks for the same decisive task contract as the runtime family.",
  "- `REPRESENTATION_ONLY_SUPPORT` means the source supports the shape, variables or formula relation but asks for a materially different target.",
  "- Representation-only evidence cannot pass the direct-normalisation gate even after reviewer metadata is added.",
  "- No entry can become `DIRECTLY_NORMALISED` without a direct task match, reviewer identity and review timestamp.",
  "",
  "## Family ledger",
  "",
];

for (const entry of MEN_CP011_SOURCE_READINESS_ENTRIES) {
  const evidence = entry.evidence;
  lines.push(
    `### ${entry.prototypeId}`,
    "",
    `- Family group: \`${entry.familyGroup}\``,
    `- Canonical owner: \`${entry.canonicalOwner}\``,
    `- Formula authority: \`${entry.formulaAuthorityStatus}\``,
    `- Ownership status: \`${entry.ownershipStatus}\``,
    `- Source status: \`${entry.sourceNormalisationStatus}\``,
    `- Source reference attached: \`${hasAttachedSourceReference(evidence)}\``,
    `- Match classification: \`${evidence.sourceMatchClassification ?? "NONE"}\``,
    `- Permanent QL blocked: \`${entry.permanentQlAllocationBlocked}\``,
    `- Publication blocked: \`${entry.publicationBlocked}\``,
    "",
  );

  if (hasAttachedSourceReference(evidence)) {
    lines.push(
      "Attached evidence:",
      "",
      `- Source type: \`${evidence.sourceType}\``,
      `- Document ID: \`${evidence.documentId}\``,
      `- Document title: ${evidence.documentTitle}`,
      `- Edition/year: ${evidence.editionOrYear}`,
      `- Chapter/section: ${evidence.chapterOrSection}`,
      `- Page locator: ${evidence.pageLocator}`,
      `- Exemplar locator: ${evidence.exemplarLocator}`,
      `- Immutable extract ID: \`${evidence.sourceContentHash}\``,
      `- Match rationale: ${evidence.sourceMatchRationale}`,
      `- Reviewer: ${evidence.reviewer ?? "PENDING"}`,
      `- Reviewed at: ${evidence.reviewedAt ?? "PENDING"}`,
      "",
    );
  } else {
    lines.push(
      "Required evidence:",
      "",
      ...entry.requiredEvidence.map((requirement) => `- ${requirement}`),
      "",
    );
  }
}

lines.push("## Neighbour ownership closure", "");
for (const boundary of MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES) {
  lines.push(
    `### ${boundary.neighbouringCanonicalProblemId}`,
    "",
    `Retained scope: ${boundary.retainedScope}`,
    "",
    "Excluded from MEN-CP-011:",
    "",
    ...boundary.excludedFromMenCp011.map((item) => `- ${item}`),
    "",
  );
}

lines.push(
  "## Active blockers",
  "",
  ...audit.blockers.map((blocker) => `- \`${blocker}\``),
  "",
  "Candidate attachment is not source approval. No runtime `sourceMaturity`, permanent QL or publication status may be promoted until the complete direct-match and human-review gates pass.",
);

writeFileSync(`${outputBase}.md`, lines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      livePrototypeCount: audit.livePrototypeCount,
      ledgerPrototypeCount: audit.ledgerPrototypeCount,
      attachedReferenceCount: audit.attachedReferenceCount,
      directTaskMatchPendingReviewCount:
        audit.directTaskMatchPendingReviewCount,
      representationOnlySupportCount: audit.representationOnlySupportCount,
      directlyNormalisedCount: audit.directlyNormalisedCount,
      missingDirectReferenceCount: audit.missingDirectReferenceCount,
      incompleteAttachedReferenceCount: audit.incompleteAttachedReferenceCount,
      falselyNormalisedCount: audit.falselyNormalisedCount,
      neighbourBoundaryCount: audit.neighbourBoundaryCount,
      sourceNormalisationComplete: audit.sourceNormalisationComplete,
      outputJson: `${outputBase}.json`,
      outputMarkdown: `${outputBase}.md`,
    },
    null,
    2,
  ),
);
