import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildTmwCp007ReviewRows } from "./foundation/cp007-review";
const rows=buildTmwCp007ReviewRows(3),output=resolve(process.cwd(),"dist/quant-v4/tmw-001-cp007-review.json");mkdirSync(resolve(process.cwd(),"dist/quant-v4"),{recursive:true});writeFileSync(output,JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-007",rowCount:rows.length,rows},null,2));console.log(JSON.stringify({output,rowCount:rows.length,status:rows.every(row=>row.validationStatus==="PASS")?"PASS":"FAIL"},null,2));
