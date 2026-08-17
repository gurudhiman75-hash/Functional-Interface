import { writeFileSync } from "node:fs";
import { buildTmwCp011ReviewRows } from "./foundation/cp011-review";

const rows = buildTmwCp011ReviewRows(3);
writeFileSync("dist/quant-v4/tmw-001-cp011-review.json", JSON.stringify({
  checkpoint: "TMW-CP-011",
  qlRange: "TMW-QL-193..TMW-QL-211",
  generatedAt: new Date().toISOString(),
  rows,
}, null, 2));
console.log(JSON.stringify({ rows: rows.length, qls: new Set(rows.map((row) => row.qlId)).size }, null, 2));
