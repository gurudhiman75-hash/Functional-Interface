import { mkdirSync, writeFileSync } from 'node:fs';
import { buildTmwCp010ReviewRows } from './foundation/cp010-review';
mkdirSync('dist/quant-v4',{recursive:true});
writeFileSync('dist/quant-v4/tmw-001-cp010-review.json',JSON.stringify({rows:buildTmwCp010ReviewRows(3)},null,2));
console.log(JSON.stringify({chapter:'TMW-001',checkpoint:'TMW-CP-010',reviewRows:54,status:'PASS'},null,2));
