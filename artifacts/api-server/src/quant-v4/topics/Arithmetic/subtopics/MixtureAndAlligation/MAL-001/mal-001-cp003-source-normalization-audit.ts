import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MAL_CP003_DISCOVERY_REGISTRY,
  MAL_CP003_EXECUTABLE_PROTOTYPE_IDS,
} from "./foundation/cp003-discovery-registry";
import { runMalCp003DiscoveryPipeline } from "./foundation/cp003-discovery-pipeline";
import {
  MAL_CP003_LEGACY_FAMILY_EVIDENCE,
  MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION,
} from "./foundation/cp003-source-normalization";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(
  MAL_CP003_LEGACY_FAMILY_EVIDENCE.length === 8,
  "Expected eight normalised legacy replacement/dilution family observations.",
);
assert(
  MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION.length ===
    MAL_CP003_DISCOVERY_REGISTRY.length,
  "Every discovery candidate must have one source-evidence disposition.",
);

const directLegacyRows = MAL_CP003_LEGACY_FAMILY_EVIDENCE.filter(
  (row) => row.sourceVerdict === "DIRECT_EXECUTABLE_EVIDENCE",
);
const labelMismatchRows = MAL_CP003_LEGACY_FAMILY_EVIDENCE.filter(
  (row) => row.sourceVerdict === "LABEL_ONLY_SURFACE_MISMATCH",
);
const crossCheckpointMismatchRows = MAL_CP003_LEGACY_FAMILY_EVIDENCE.filter(
  (row) => row.sourceVerdict === "CROSS_CHECKPOINT_SURFACE_MISMATCH",
);
assert(directLegacyRows.length === 1, "Only the repeated-operation core is direct executable evidence.");
assert(labelMismatchRows.length === 6, "Expected six label-only CP-003 source mismatches.");
assert(
  crossCheckpointMismatchRows.length === 1,
  "Expected one CP-004 solute-addition surface under a misleading operation-count label.",
);
assert(
  directLegacyRows[0]!.familyId === "replacement_repeated_operation",
  "The direct legacy authority must be replacement_repeated_operation.",
);
assert(
  crossCheckpointMismatchRows[0]!.familyId ===
    "dilution_find_number_of_operations",
  "Unexpected cross-checkpoint mismatch family.",
);

const dispositionsByPrototype = new Map(
  MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION.map((row) => [
    row.prototypeId,
    row,
  ]),
);
for (const registryEntry of MAL_CP003_DISCOVERY_REGISTRY) {
  const disposition = dispositionsByPrototype.get(registryEntry.prototypeId);
  assert(
    disposition,
    `${registryEntry.prototypeId}: source disposition is missing.`,
  );
  assert(
    JSON.stringify([...registryEntry.sourceClasses].sort()) ===
      JSON.stringify([...disposition.requiredSourceClasses].sort()),
    `${registryEntry.prototypeId}: registry source classes do not match the normalised evidence ledger.`,
  );
  if (disposition.directSourceReady) {
    assert(
      registryEntry.sourceClasses.includes(
        "LEGACY_V2_DIRECT_EXECUTABLE_RECOVERY",
      ),
      `${registryEntry.prototypeId}: direct source-ready status lacks direct executable recovery.`,
    );
    assert(
      !registryEntry.sourceClasses.includes("LEGACY_FAMILY_LABEL_ONLY"),
      `${registryEntry.prototypeId}: direct source-ready status still depends on a thin label.`,
    );
  } else {
    assert(
      !registryEntry.sourceClasses.includes(
        "LEGACY_V2_DIRECT_EXECUTABLE_RECOVERY",
      ),
      `${registryEntry.prototypeId}: thin or constructed evidence was overstated as direct recovery.`,
    );
    assert(
      Boolean(disposition.freezeBlocker),
      `${registryEntry.prototypeId}: non-direct candidate lacks a stated freeze blocker.`,
    );
  }
}

const directSourceReadyCount =
  MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION.filter(
    (row) => row.directSourceReady,
  ).length;
const representationMergeCandidateCount =
  MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION.filter(
    (row) => row.mergeSplitVerdict === "REPRESENTATION_MERGE_CANDIDATE",
  ).length;
const provisionalDistinctCount =
  MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION.filter(
    (row) => row.mergeSplitVerdict === "PROVISIONALLY_DISTINCT",
  ).length;
const boundaryPendingCount =
  MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION.filter(
    (row) => row.mergeSplitVerdict === "BOUNDARY_PENDING",
  ).length;
const freezeBlockerCount =
  MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION.filter(
    (row) => Boolean(row.freezeBlocker),
  ).length;

assert(directSourceReadyCount === 1, "Unexpected direct source-ready prototype count.");
assert(
  representationMergeCandidateCount === 2,
  "Expected two representation merge candidates.",
);
assert(provisionalDistinctCount === 5, "Expected five provisionally distinct candidates.");
assert(boundaryPendingCount === 1, "Expected one CP-003/CP-004 boundary candidate.");
assert(freezeBlockerCount === 8, "Expected eight source, merge/split or ownership blockers.");

let executableSampleCount = 0;
for (const prototypeId of MAL_CP003_EXECUTABLE_PROTOTYPE_IDS) {
  const question = runMalCp003DiscoveryPipeline(
    prototypeId,
    `source-normalization-${prototypeId}`,
  );
  assert(question.validation.ok, `${prototypeId}: executable regression failed.`);
  assert(question.permanentQlId === null, `${prototypeId}: permanent QL leaked in.`);
  assert(!question.active, `${prototypeId}: candidate became active.`);
  assert(
    !question.questionStudioDiscoverable &&
      !question.questionBankWritable &&
      !question.testEligible,
    `${prototypeId}: delivery gates changed during source normalization.`,
  );
  executableSampleCount += 1;
}
assert(executableSampleCount === 8, "Expected eight executable regression samples.");

const freezeReadiness =
  freezeBlockerCount === 0 &&
  boundaryPendingCount === 0 &&
  representationMergeCandidateCount === 0;
assert(!freezeReadiness, "CP-003 must remain open after source normalization.");

const report = {
  status: "PASS_MAL_CP003_SOURCE_NORMALIZATION",
  canonicalProblemId: "MAL-CP-003",
  legacyFamilyObservationCount: MAL_CP003_LEGACY_FAMILY_EVIDENCE.length,
  directLegacyEvidenceCount: directLegacyRows.length,
  labelOnlySurfaceMismatchCount: labelMismatchRows.length,
  crossCheckpointSurfaceMismatchCount: crossCheckpointMismatchRows.length,
  discoveryCandidateCount: MAL_CP003_DISCOVERY_REGISTRY.length,
  executablePrototypeCount: MAL_CP003_EXECUTABLE_PROTOTYPE_IDS.length,
  directSourceReadyPrototypeCount: directSourceReadyCount,
  representationMergeCandidateCount,
  provisionalDistinctCount,
  boundaryPendingCount,
  freezeBlockerCount,
  executableSampleCount,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  legacyEvidence: MAL_CP003_LEGACY_FAMILY_EVIDENCE,
  prototypeDispositions: MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION,
};

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(
  outputDirectory,
  "mal-cp003-source-normalization-audit.json",
);
const markdownPath = resolve(
  outputDirectory,
  "mal-cp003-source-normalization-audit.md",
);
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const markdown: string[] = [
  "# MAL-CP-003 Source Normalization Audit",
  "",
  `Status: **${report.status}**`,
  "",
  "## Result",
  "",
  `- Direct legacy evidence: **${directLegacyRows.length}**`,
  `- Label-only surface mismatches: **${labelMismatchRows.length}**`,
  `- Cross-checkpoint surface mismatches: **${crossCheckpointMismatchRows.length}**`,
  `- Executable discovery prototypes: **${report.executablePrototypeCount}**`,
  `- Direct-source-ready prototypes: **${directSourceReadyCount}**`,
  `- Freeze blockers: **${freezeBlockerCount}**`,
  `- Freeze readiness: **${freezeReadiness}**`,
  "",
  "> Different legacy family names are not counted as different contracts when their exported stems, unknowns, answers and formulas are the same.",
  "",
  "## Legacy family normalization",
  "",
  "| Legacy family | Observed exported task | Verdict | Normalized contract |",
  "|---|---|---|---|",
  ...MAL_CP003_LEGACY_FAMILY_EVIDENCE.map(
    (row) =>
      `| ${row.familyId} | ${row.observedExportSurface} | ${row.sourceVerdict} | ${row.normalizedContract} |`,
  ),
  "",
  "## Discovery candidate disposition",
  "",
  "| Candidate | Source classes | Merge/split status | Direct source ready | Freeze blocker |",
  "|---|---|---|---|---|",
  ...MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION.map(
    (row) =>
      `| ${row.prototypeId} | ${row.requiredSourceClasses.join(", ")} | ${row.mergeSplitVerdict} | ${row.directSourceReady ? "yes" : "no"} | ${row.freezeBlocker ?? "none"} |`,
  ),
  "",
  "## Freeze decision",
  "",
  "MAL-CP-003 remains in open discovery. No permanent QL or solve-mode allocation is authorised by this audit.",
  "",
];
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      ...report,
      legacyEvidence: undefined,
      prototypeDispositions: undefined,
      auditJson: jsonPath,
      auditMarkdown: markdownPath,
    },
    null,
    2,
  ),
);
