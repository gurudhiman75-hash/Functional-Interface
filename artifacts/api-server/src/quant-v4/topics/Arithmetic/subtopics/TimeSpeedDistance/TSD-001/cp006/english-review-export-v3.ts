import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateCp006EnglishReviewSetV3 } from "./english-review-runtime-v3";

const output = resolve(process.argv[2] ?? "dist/quant-v4/tsd-001/cp006-english-review-v3-78q.json");
mkdirSync(dirname(output), { recursive: true });
const rows = generateCp006EnglishReviewSetV3();
const json = JSON.stringify(rows, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2);
writeFileSync(output, `${json}\n`, "utf8");
console.log(JSON.stringify({ status: "PASS", phase: "TSD_CP006_ENGLISH_REVIEW_V3_EXPORT", rows: rows.length, output }, null, 2));
