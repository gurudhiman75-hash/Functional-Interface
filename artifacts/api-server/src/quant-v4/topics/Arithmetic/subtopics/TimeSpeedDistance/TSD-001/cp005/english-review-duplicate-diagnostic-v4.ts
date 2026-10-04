import { generateCp005ReviewSetV4 } from "./english-review-runtime-v4";

const rows = generateCp005ReviewSetV4(6);
const grouped = new Map<string, typeof rows[number][]>();
for (const row of rows) {
  const bucket = grouped.get(row.stem) ?? [];
  bucket.push(row);
  grouped.set(row.stem, bucket);
}

const duplicates = [...grouped.entries()]
  .filter(([, entries]) => entries.length > 1)
  .map(([stem, entries]) => ({
    stem,
    rows: entries.map((row) => ({
      permanentQlId: row.permanentQlId,
      authorityKey: row.authorityKey,
      solveMode: row.solveMode,
      seed: row.seed,
      representation: row.representation,
    })),
  }));

console.log(JSON.stringify({
  selectedQuestions: rows.length,
  uniqueStems: grouped.size,
  duplicateStemGroups: duplicates.length,
  duplicates,
}, null, 2));
