import { mkdirSync, writeFileSync } from "node:fs";
import { buildTmwCp008ReviewRows } from "./foundation/cp008-review";
mkdirSync("dist/quant-v4",{recursive:true});const rows=buildTmwCp008ReviewRows(3);writeFileSync("dist/quant-v4/tmw-001-cp008-review.json",JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-008",generatedAt:new Date().toISOString(),rowCount:rows.length,rows},null,2));console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-008",rowCount:rows.length,status:"PASS"},null,2));
