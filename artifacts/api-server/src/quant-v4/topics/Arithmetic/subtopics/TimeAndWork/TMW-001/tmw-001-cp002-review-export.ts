import { buildTmwCp002ReviewRows } from "./foundation/cp002-review";

const rows = buildTmwCp002ReviewRows(3);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-002",
  generatedAt: new Date().toISOString(),
  rowCount: rows.length,
  rows,
}, null, 2));
