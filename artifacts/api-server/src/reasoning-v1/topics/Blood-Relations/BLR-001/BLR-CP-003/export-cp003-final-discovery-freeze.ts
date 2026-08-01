import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  BLR_CP003_FINAL_DISCOVERY_FREEZE,
  BLR_CP003_FROZEN_PROTOTYPE_IDS,
  BLR_CP003_FROZEN_QUESTION_FORMS,
  BLR_CP003_FROZEN_TOPOLOGY_IDS,
  BLR_CP003_RELEASE_LOCK,
} from "./cp003-final-discovery-freeze";
import {
  buildBlrCp003FinalBankTelemetry,
  generateBlrCp003FinalApprovedBank,
} from "./cp003-final-approved-bank";
import { BLR_CP003_PERMANENT_CONTRACTS } from "./cp003-permanent-contracts";

const out = path.resolve(
  process.argv[2] ?? "blr-cp003-final-discovery-freeze-output",
);
const records = generateBlrCp003FinalApprovedBank();
const telemetry = buildBlrCp003FinalBankTelemetry(records);

const summary = {
  freezeVersion: BLR_CP003_FINAL_DISCOVERY_FREEZE.version,
  approvedBankVersion: BLR_CP003_FINAL_DISCOVERY_FREEZE.approvedBankVersion,
  authorityAuditVersion: BLR_CP003_FINAL_DISCOVERY_FREEZE.authorityAuditVersion,
  approvalDate: BLR_CP003_FINAL_DISCOVERY_FREEZE.approvalDate,
  approvedBy: BLR_CP003_FINAL_DISCOVERY_FREEZE.approvedBy,
  approvalDirective: BLR_CP003_FINAL_DISCOVERY_FREEZE.approvalDirective,
  permanentQlRange: BLR_CP003_RELEASE_LOCK.permanentQlRange,
  permanentQlCount: BLR_CP003_RELEASE_LOCK.permanentQlCount,
  nextAvailableChapterQlId:
    BLR_CP003_RELEASE_LOCK.nextAvailableChapterQlId,
  ...telemetry,
  frozenPrototypeIds: BLR_CP003_FROZEN_PROTOTYPE_IDS,
  frozenTopologyIds: BLR_CP003_FROZEN_TOPOLOGY_IDS,
  frozenQuestionForms: BLR_CP003_FROZEN_QUESTION_FORMS,
  releaseLock: BLR_CP003_RELEASE_LOCK,
};

const markdown = `# BLR-CP-003 Final English Discovery Freeze

Status: **complete and frozen for English review runtime**.

## Permanent QLs

${BLR_CP003_PERMANENT_CONTRACTS.map(
  (contract) =>
    `- \`${contract.qlId}\` — \`${contract.solveAuthority}\` — ${contract.answerType} — ${contract.sourcePrototypeIds.length} source prototypes`,
).join("\n")}

## Frozen evidence

\`\`\`text
approved records:       ${telemetry.recordCount}
shared-passage groups:  ${telemetry.groupCount}
graph topologies:       ${telemetry.topologyCount}
source prototypes:      ${telemetry.prototypeCount}
solve authorities:      ${telemetry.authorityCount}
answer positions:       ${JSON.stringify(telemetry.answerPositions)}
permanent QL range:     ${BLR_CP003_RELEASE_LOCK.permanentQlRange}
next chapter QL:        ${BLR_CP003_RELEASE_LOCK.nextAvailableChapterQlId}
\`\`\`

The unresolved-marital-status prototype is frozen as an instance of \`BLR-QL-011\`, not as a separate QL.

## Release boundary

Question Studio, Question Bank, mock tests, localisation, public publication, production staging and merge remain locked. The frozen runtime is English review-only.
`;

await mkdir(out, { recursive: true });
await writeFile(
  path.join(out, "blr-cp003-final-freeze-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(out, "blr-cp003-final-freeze-records.jsonl"),
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(out, "blr-cp003-permanent-contracts.json"),
  `${JSON.stringify(BLR_CP003_PERMANENT_CONTRACTS, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(out, "BLR-CP-003-FINAL-DISCOVERY-FREEZE.md"),
  markdown,
  "utf8",
);

console.log(JSON.stringify({ out, ...summary }, null, 2));
