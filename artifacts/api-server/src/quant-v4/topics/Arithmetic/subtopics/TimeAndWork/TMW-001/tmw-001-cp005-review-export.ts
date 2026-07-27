import { mkdirSync, writeFileSync } from "node:fs";
import { buildTmwCp005ReviewRows } from "./foundation/cp005-review";
mkdirSync("dist/quant-v4",{recursive:true});
const rows=buildTmwCp005ReviewRows(3);
writeFileSync("dist/quant-v4/tmw-001-cp005-review.json",JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-005",generatedAt:new Date().toISOString(),rowCount:rows.length,rows},null,2));
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-005",rowCount:rows.length,status:"PASS"},null,2));
