import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateCp006NativeReviewV5 } from "./native-review-editorial-v5";

const output = process.argv[2] ?? "cp006-hi-pa-review-v5-156q.json";
const rows = generateCp006NativeReviewV5();
writeFileSync(resolve(output), JSON.stringify(rows, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2));
console.log(JSON.stringify({ status: "PASS", phase: "TSD_CP006_HI_PA_REVIEW_V5_EXPORT", rows: rows.length, output: resolve(output) }, null, 2));
