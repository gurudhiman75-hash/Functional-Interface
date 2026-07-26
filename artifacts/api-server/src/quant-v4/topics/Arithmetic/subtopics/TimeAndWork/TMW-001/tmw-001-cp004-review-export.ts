import { buildTmwCp004ReviewRows } from "./foundation/cp004-review";
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-004",generatedAt:new Date().toISOString(),rowCount:72,rows:buildTmwCp004ReviewRows(3)},null,2));
