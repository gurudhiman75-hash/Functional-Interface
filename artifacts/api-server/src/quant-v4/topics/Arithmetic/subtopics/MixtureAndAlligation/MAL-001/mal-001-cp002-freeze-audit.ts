import {
  MAL_CP002_COMPLETION_LEDGER,
  MAL_CP002_FREEZE_READINESS,
} from "./foundation/cp002-completion-ledger";
import {
  MAL_CP002_PERMANENT_ALLOCATION,
  MAL_CP002_PERMANENT_QL_IDS,
} from "./foundation/cp002-permanent-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const coveredRows = MAL_CP002_COMPLETION_LEDGER.filter(
  (row) => row.disposition === "COVERED_BY_PERMANENT_QL",
);
const coveredQlIds = new Set(coveredRows.flatMap((row) => row.qlIds));
const contractIds = new Set(MAL_CP002_COMPLETION_LEDGER.map((row) => row.contractId));

assert(
  contractIds.size === MAL_CP002_COMPLETION_LEDGER.length,
  "Completion ledger contains duplicate contract IDs.",
);
assert(
  coveredQlIds.size === MAL_CP002_PERMANENT_QL_IDS.length,
  "Not every permanent QL is represented in the completion ledger.",
);
for (const qlId of MAL_CP002_PERMANENT_QL_IDS) {
  assert(coveredQlIds.has(qlId), `${qlId} is absent from the completion ledger.`);
}
for (const row of coveredRows) {
  assert(row.qlIds.length > 0, `${row.contractId} has no permanent QL.`);
  for (const qlId of row.qlIds) {
    assert(
      MAL_CP002_PERMANENT_QL_IDS.includes(qlId),
      `${row.contractId} points to unknown QL ${qlId}.`,
    );
  }
}

assert(
  MAL_CP002_FREEZE_READINESS.status === "READY_TO_FREEZE_ENGLISH",
  "CP-002 is not marked ready to freeze.",
);
assert(
  MAL_CP002_FREEZE_READINESS.meaningfulOwnedUncoveredContractCount === 0,
  "Meaningful owned CP-002 contracts remain uncovered.",
);
assert(
  MAL_CP002_FREEZE_READINESS.permanentQlCount ===
    MAL_CP002_PERMANENT_ALLOCATION.length,
  "Freeze-readiness QL count does not match allocation.",
);
assert(
  MAL_CP002_COMPLETION_LEDGER.some(
    (row) => row.disposition === "EXCLUDED_TO_CP001",
  ),
  "CP-001 boundary is absent.",
);
assert(
  MAL_CP002_COMPLETION_LEDGER.some(
    (row) => row.disposition === "EXCLUDED_TO_CP003",
  ),
  "CP-003 boundary is absent.",
);
assert(
  MAL_CP002_COMPLETION_LEDGER.some(
    (row) => row.disposition === "EXCLUDED_TO_CP004",
  ),
  "CP-004 boundary is absent.",
);
assert(
  MAL_CP002_COMPLETION_LEDGER.some(
    (row) => row.disposition === "EXCLUDED_TO_RAP",
  ),
  "Ratio-and-Proportion boundary is absent.",
);
assert(
  MAL_CP002_COMPLETION_LEDGER.filter(
    (row) => row.disposition === "EXCLUDED_SOURCE_THIN",
  ).length === 2,
  "Source-thin exclusions changed unexpectedly.",
);
assert(
  MAL_CP002_COMPLETION_LEDGER.filter(
    (row) => row.disposition === "NON_UNIQUE_WITHOUT_MORE_EVIDENCE",
  ).length === 1,
  "Non-unique reverse-replacement boundary changed unexpectedly.",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP002_FREEZE_CLOSURE",
      ledgerContractCount: MAL_CP002_COMPLETION_LEDGER.length,
      coveredContractCount: coveredRows.length,
      permanentQlCount: MAL_CP002_PERMANENT_ALLOCATION.length,
      permanentQlRange: `${MAL_CP002_PERMANENT_QL_IDS[0]}..${MAL_CP002_PERMANENT_QL_IDS.at(-1)}`,
      meaningfulOwnedUncoveredContractCount: 0,
      excludedSourceThinContractCount:
        MAL_CP002_FREEZE_READINESS.excludedSourceThinContractCount,
      ownershipBoundaryCount: MAL_CP002_FREEZE_READINESS.ownershipBoundaryCount,
      nonUniqueContractCount: MAL_CP002_FREEZE_READINESS.nonUniqueContractCount,
      freezeReadiness: true,
    },
    null,
    2,
  ),
);
