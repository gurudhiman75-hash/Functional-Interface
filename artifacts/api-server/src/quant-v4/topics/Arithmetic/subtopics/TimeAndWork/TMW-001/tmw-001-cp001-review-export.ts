import { buildTmwCp001ReviewRows } from "./foundation/cp001-review";

const rows = buildTmwCp001ReviewRows(3);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-001",
  generatedAt: new Date().toISOString(),
  rowCount: rows.length,
  rows,
}, null, 2));
