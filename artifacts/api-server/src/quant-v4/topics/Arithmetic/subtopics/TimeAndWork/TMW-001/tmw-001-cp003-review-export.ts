import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildTmwCp003ReviewRows } from "./foundation/cp003-review";

const rows = buildTmwCp003ReviewRows(3);
const output = resolve(process.cwd(), "dist/quant-v4/tmw-001-cp003-review.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-003", generatedAt: new Date().toISOString(), rowCount: rows.length, rows }, null, 2));
console.log(JSON.stringify({ output, rowCount: rows.length, status: "PASS" }, null, 2));
