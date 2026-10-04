import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateCp006EnglishReviewSetV2 } from "./english-review-runtime-v2";

const output = resolve(process.argv[2] ?? "dist/quant-v4/tsd-001/cp006-english-review-v2-78q.json");
mkdirSync(dirname(output), { recursive: true });
const rows = generateCp006EnglishReviewSetV2();
const json = JSON.stringify(rows, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2);
writeFileSync(output, `${json}\n`, "utf8");
console.log(JSON.stringify({ status: "PASS", phase: "TSD_CP006_ENGLISH_REVIEW_V2_EXPORT", rows: rows.length, output }, null, 2));
