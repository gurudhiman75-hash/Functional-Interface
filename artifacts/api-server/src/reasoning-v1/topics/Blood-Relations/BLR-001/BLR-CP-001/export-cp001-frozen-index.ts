import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = process.argv[2] ?? "blr-cp001-review-output";
const index = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-001",
  freezeVersion: "BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1",
  finalCheckpointState: {
    exploratoryPrototypeCount: 11,
    frozenSolveAuthorityCount: 7,
    permanentQlRange: "BLR-QL-001..007",
    permanentQlCount: 7,
    nextAvailableChapterQlId: "BLR-QL-008",
    englishReviewOnly: true,
    questionStudioVisible: false,
    questionBankWriteAllowed: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  },
  includedPacks: [
    {
      prefix: "blr-cp001-review",
      recordCount: 88,
      purpose:
        "Exploratory prototype and authority review. Its scoped permanentQlCount is zero because these records intentionally retain prototype identity.",
    },
    {
      prefix: "blr-cp001-second-gap-review",
      recordCount: 16,
      purpose:
        "Focused pre-allocation source-gap appendix for four great-generation outputs. Its scoped permanentQlCount is zero because the gap decision was tested before identity promotion.",
    },
    {
      prefix: "blr-cp001-permanent-review",
      recordCount: 56,
      purpose:
        "Authoritative permanent-identity review across BLR-QL-001 through BLR-QL-007.",
    },
  ],
} as const;

const readme = `# BLR-CP-001 Frozen English Review Artifact

Freeze version: \`BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1\`

Final checkpoint state:

- permanent QL range: \`BLR-QL-001..007\`;
- permanent QL count: **7**;
- next available BLR-001 ID: \`BLR-QL-008\`;
- English review-only: **true**;
- Question Studio, Question Bank, mock tests and public publication: **disabled**.

## Included review layers

1. **\`blr-cp001-review.*\` — 88 records**  
   Exploratory prototype/authority review. These files intentionally retain prototype identity, so their own scoped summary reports zero permanent QLs.

2. **\`blr-cp001-second-gap-review.*\` — 16 records**  
   Focused great-generation appendix produced while validating the second source gap. Its scoped summary records the pre-allocation state.

3. **\`blr-cp001-permanent-review.*\` — 56 records**  
   Authoritative permanent review across all seven QLs, eight seeds per QL and answer positions \`[14, 14, 14, 14]\`.

Use \`blr-cp001-frozen-index.json\` or \`blr-cp001-permanent-review-summary.json\` for the final identity state.
`;

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    path.join(outputDirectory, "blr-cp001-frozen-index.json"),
    `${JSON.stringify(index, null, 2)}\n`,
    "utf8",
  ),
  writeFile(path.join(outputDirectory, "README.md"), readme, "utf8"),
]);

console.log("BLR-CP-001 frozen artifact index exported.", index);
