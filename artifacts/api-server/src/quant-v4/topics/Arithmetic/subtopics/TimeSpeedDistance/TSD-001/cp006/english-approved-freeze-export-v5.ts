import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q } from "./english-approved-freeze-v5";

const output = resolve(process.argv[2] ?? "cp006-english-frozen-v5-78q.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify(TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q, (_key, child) => typeof child === "bigint" ? `${child}n` : child, 2) + "\n", "utf8");
console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_APPROVED_ENGLISH_V5_FREEZE_EXPORT",
  rows: TSD_CP006_APPROVED_ENGLISH_FROZEN_78Q.length,
  output,
}, null, 2));
