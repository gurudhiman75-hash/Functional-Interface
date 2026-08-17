import { mkdirSync, writeFileSync } from "node:fs";
import { buildTmwCp009ReviewRows } from "./foundation/cp009-review";
const rows=buildTmwCp009ReviewRows(3),output="dist/quant-v4/tmw-001-cp009-review.json";mkdirSync("dist/quant-v4",{recursive:true});writeFileSync(output,JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-009",rows},null,2));console.log(JSON.stringify({reviewRows:rows.length,status:"PASS"},null,2));
