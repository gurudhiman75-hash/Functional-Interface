import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateCp006NativeReviewV2 } from "./native-review-editorial-v2";
const rows=generateCp006NativeReviewV2();
const output=resolve(process.argv[2]??"cp006-hi-pa-review-v2-156q.json");
mkdirSync(dirname(output),{recursive:true});
writeFileSync(output,JSON.stringify(rows,(_key,child)=>typeof child==="bigint"?`${child}n`:child,2)+"\n","utf8");
console.log(JSON.stringify({status:"PASS",phase:"TSD_CP006_HI_PA_REVIEW_V2_EXPORT",rows:rows.length,output},null,2));
