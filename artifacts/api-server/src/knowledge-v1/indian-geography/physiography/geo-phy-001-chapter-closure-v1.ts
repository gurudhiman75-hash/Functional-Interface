export type GeoPhy001CheckpointOwnership = {
  checkpoint: string;
  firstQl: number | null;
  lastQl: number | null;
  newPermanentQls: boolean;
};

export const GEO_PHY_001_CHECKPOINT_OWNERSHIP_V1: readonly GeoPhy001CheckpointOwnership[] = Object.freeze([
  { checkpoint: "CP001", firstQl: 1, lastQl: 9, newPermanentQls: true },
  { checkpoint: "CP002", firstQl: 10, lastQl: 18, newPermanentQls: true },
  { checkpoint: "CP003", firstQl: 19, lastQl: 27, newPermanentQls: true },
  { checkpoint: "CP004", firstQl: 28, lastQl: 36, newPermanentQls: true },
  { checkpoint: "CP005", firstQl: 37, lastQl: 45, newPermanentQls: true },
  { checkpoint: "CP006", firstQl: 46, lastQl: 54, newPermanentQls: true },
  { checkpoint: "CP007", firstQl: 55, lastQl: 63, newPermanentQls: true },
  { checkpoint: "CP008", firstQl: 64, lastQl: 72, newPermanentQls: true },
  { checkpoint: "CP009", firstQl: 73, lastQl: 81, newPermanentQls: true },
  { checkpoint: "CP010", firstQl: 82, lastQl: 90, newPermanentQls: true },
  { checkpoint: "CP011", firstQl: 91, lastQl: 99, newPermanentQls: true },
  { checkpoint: "CP012", firstQl: 100, lastQl: 108, newPermanentQls: true },
  { checkpoint: "CP013", firstQl: null, lastQl: null, newPermanentQls: false },
]);

export function auditGeoPhy001ChapterClosureV1() {
  const issues: string[] = [];
  const owners = new Map<number, string[]>();
  for (const row of GEO_PHY_001_CHECKPOINT_OWNERSHIP_V1) {
    if (!row.newPermanentQls) {
      if (row.firstQl !== null || row.lastQl !== null) issues.push(`NON_OWNING_RANGE:${row.checkpoint}`);
      continue;
    }
    if (row.firstQl === null || row.lastQl === null || row.firstQl > row.lastQl) {
      issues.push(`INVALID_RANGE:${row.checkpoint}`);
      continue;
    }
    for (let ql = row.firstQl; ql <= row.lastQl; ql += 1) {
      const current = owners.get(ql) ?? [];
      current.push(row.checkpoint);
      owners.set(ql, current);
    }
  }

  for (let ql = 1; ql <= 108; ql += 1) {
    const cpOwners = owners.get(ql) ?? [];
    if (cpOwners.length === 0) issues.push(`QL_GAP:${String(ql).padStart(3, "0")}`);
    if (cpOwners.length > 1) issues.push(`QL_OVERLAP:${String(ql).padStart(3, "0")}:${cpOwners.join(",")}`);
  }
  for (const ql of owners.keys()) if (ql < 1 || ql > 108) issues.push(`QL_OUT_OF_RANGE:${ql}`);

  const permanentQls = [...owners.keys()].filter((ql) => ql >= 1 && ql <= 108).sort((a, b) => a - b);
  return {
    valid: issues.length === 0,
    issues,
    checkpointCount: GEO_PHY_001_CHECKPOINT_OWNERSHIP_V1.length,
    permanentQlCount: permanentQls.length,
    firstQl: permanentQls[0] ?? null,
    lastQl: permanentQls.at(-1) ?? null,
    cp013AddsPermanentQls: GEO_PHY_001_CHECKPOINT_OWNERSHIP_V1.find((row) => row.checkpoint === "CP013")?.newPermanentQls ?? true,
    readiness: issues.length === 0
      ? "Permanent QL map is complete through QL108. CP013 adds no permanent QLs and remains review-only pending approval."
      : "Closure map has defects and is not ready.",
  };
}
