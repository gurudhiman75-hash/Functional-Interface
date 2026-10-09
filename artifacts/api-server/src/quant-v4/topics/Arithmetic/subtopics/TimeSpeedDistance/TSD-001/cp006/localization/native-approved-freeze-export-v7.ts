import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q } from "./native-approved-freeze-v7";

const output = process.argv[2] ?? "cp006-hi-pa-v7-approved-freeze-156q.json";
writeFileSync(
  resolve(output),
  JSON.stringify(
    TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q,
    (_key, value) => typeof value === "bigint" ? value.toString() : value,
    2,
  ),
);
console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_HI_PA_V7_APPROVED_FREEZE_EXPORT",
  rows: TSD_CP006_APPROVED_NATIVE_FROZEN_V7_156Q.length,
  output: resolve(output),
}, null, 2));
