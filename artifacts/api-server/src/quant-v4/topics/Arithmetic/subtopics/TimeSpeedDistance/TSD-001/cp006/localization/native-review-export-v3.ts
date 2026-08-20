import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateCp006NativeReviewV3 } from "./native-review-editorial-v3";

const output = process.argv[2] ?? "cp006-hi-pa-review-v3-156q.json";
const rows = generateCp006NativeReviewV3();
writeFileSync(resolve(output), JSON.stringify(rows, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2));
console.log(JSON.stringify({ status: "PASS", phase: "TSD_CP006_HI_PA_REVIEW_V3_EXPORT", rows: rows.length, output: resolve(output) }, null, 2));
