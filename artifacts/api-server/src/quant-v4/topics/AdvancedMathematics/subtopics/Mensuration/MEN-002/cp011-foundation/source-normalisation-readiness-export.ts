import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES,
  MEN_CP011_SOURCE_READINESS_AUTHORITY,
  MEN_CP011_SOURCE_READINESS_ENTRIES,
  auditMenCp011SourceReadiness,
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
  "Formula correctness and canonical ownership are proven for all live families, but direct-source normalisation remains blocked until concrete document, page and exemplar locators are attached and reviewed.",
  "",
  "```text",
  `Authority:                         ${audit.authority}`,
  `Live runtime families:             ${audit.livePrototypeCount}`,
  `Ledger families:                   ${audit.ledgerPrototypeCount}`,
  `Live/ledger sets match:            ${audit.liveAndLedgerSetsMatch}`,
  `Canonical ownership confirmed:     ${audit.canonicalOwnerConfirmedCount}`,
  `Executable formula authority:      ${audit.executableFormulaAuthorityCount}`,
  `Directly normalised:               ${audit.directlyNormalisedCount}`,
  `Missing direct references:         ${audit.missingDirectReferenceCount}`,
  `False normalisation claims:        ${audit.falselyNormalisedCount}`,
  `Neighbour boundaries recorded:     ${audit.neighbourBoundaryCount}`,
  `Source normalisation complete:     ${audit.sourceNormalisationComplete}`,
  `Permanent QL allocation allowed:   ${audit.permanentQlAllocationAllowed}`,
  `Publication eligible:              ${audit.publicationEligible}`,
  "```",
  "",
  "## Family ledger",
  "",
];

for (const entry of MEN_CP011_SOURCE_READINESS_ENTRIES) {
  lines.push(
    `### ${entry.prototypeId}`,
    "",
    `- Family group: \`${entry.familyGroup}\``,
    `- Canonical owner: \`${entry.canonicalOwner}\``,
    `- Formula authority: \`${entry.formulaAuthorityStatus}\``,
    `- Ownership status: \`${entry.ownershipStatus}\``,
    `- Source status: \`${entry.sourceNormalisationStatus}\``,
    `- Permanent QL blocked: \`${entry.permanentQlAllocationBlocked}\``,
    `- Publication blocked: \`${entry.publicationBlocked}\``,
    "",
    "Required evidence:",
    "",
    ...entry.requiredEvidence.map((requirement) => `- ${requirement}`),
    "",
  );
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
  "No source status may be changed to `DIRECTLY_NORMALISED` unless every evidence field passes the executable completeness gate.",
);

writeFileSync(`${outputBase}.md`, lines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      livePrototypeCount: audit.livePrototypeCount,
      ledgerPrototypeCount: audit.ledgerPrototypeCount,
      directlyNormalisedCount: audit.directlyNormalisedCount,
      missingDirectReferenceCount: audit.missingDirectReferenceCount,
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
