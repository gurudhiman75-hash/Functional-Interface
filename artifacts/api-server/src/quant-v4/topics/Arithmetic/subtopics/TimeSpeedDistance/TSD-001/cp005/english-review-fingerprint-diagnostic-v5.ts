import { generateCp005EnglishAuditPoolV5 } from "./english-review-runtime-v5";

const rows = generateCp005EnglishAuditPoolV5(30);
const grouped = new Map<string, typeof rows[number][]>();
for (const row of rows) {
  const bucket = grouped.get(row.mathematicalFingerprint) ?? [];
  bucket.push(row);
  grouped.set(row.mathematicalFingerprint, bucket);
}

const duplicates = [...grouped.entries()]
  .filter(([, entries]) => entries.length > 1)
  .map(([mathematicalFingerprint, entries]) => ({
    mathematicalFingerprint,
    rows: entries.map((row) => ({
      permanentQlId: row.permanentQlId,
      authorityKey: row.authorityKey,
      solveMode: row.solveMode,
      seed: row.seed,
      representation: row.representation,
      stem: row.stem,
    })),
  }));

const duplicateRows = duplicates.reduce((total, group) => total + group.rows.length, 0);
const perAuthority = [...new Set(rows.map((row) => row.authorityKey))].map((authorityKey) => {
  const authorityRows = rows.filter((row) => row.authorityKey === authorityKey);
  return {
    authorityKey,
    rows: authorityRows.length,
    uniqueFingerprints: new Set(authorityRows.map((row) => row.mathematicalFingerprint)).size,
  };
});

console.log(JSON.stringify({
  auditQuestions: rows.length,
  uniqueFingerprints: grouped.size,
  duplicateFingerprintGroups: duplicates.length,
  duplicateRows,
  perAuthority,
  duplicates,
}, null, 2));
