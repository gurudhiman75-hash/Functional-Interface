import { mkdirSync, writeFileSync } from "node:fs";
import { buildTmwCp006ReviewRows } from "./foundation/cp006-review";

mkdirSync("dist/quant-v4",{recursive:true});
const rows=buildTmwCp006ReviewRows(3);
writeFileSync("dist/quant-v4/tmw-001-cp006-review.json",JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-006",generatedAt:new Date().toISOString(),rowCount:rows.length,rows},null,2));
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-006",rowCount:rows.length,status:"PASS"},null,2));
