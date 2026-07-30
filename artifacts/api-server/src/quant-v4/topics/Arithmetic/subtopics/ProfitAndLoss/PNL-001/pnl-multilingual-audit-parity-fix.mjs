import fs from "node:fs";
import path from "node:path";

const file = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001/pnl-001-multilingual-editorial-audit.ts",
);
const source = fs.readFileSync(file, "utf8");
const oldValue = `      if (entry.explanation.steps.length !== englishEntry.explanation.steps.length) {\n        fatalFindings.push({\n          code: "STEP-COUNT-PARITY",\n          severity: "BLOCKER",\n          scope: \`${"${qlId}"}/${"${language}"}\`,\n          message: \`Native explanation has ${"${entry.explanation.steps.length}"} steps; English has ${"${englishEntry.explanation.steps.length}"}.\`,\n        });\n      }`;
const newValue = `      if (entry.explanation.steps.length < englishEntry.explanation.steps.length) {\n        fatalFindings.push({\n          code: "STEP-COUNT-PARITY",\n          severity: "BLOCKER",\n          scope: \`${"${qlId}"}/${"${language}"}\`,\n          message: \`Native explanation has ${"${entry.explanation.steps.length}"} steps; English requires at least ${"${englishEntry.explanation.steps.length}"}.\`,\n        });\n      }`;
const first = source.indexOf(oldValue);
if (first < 0) throw new Error("Step-count parity anchor was not found.");
if (source.indexOf(oldValue, first + oldValue.length) >= 0) {
  throw new Error("Step-count parity anchor is not unique.");
}
fs.writeFileSync(file, source.replace(oldValue, newValue));
console.log(
  JSON.stringify(
    {
      status: "PATCHED",
      parityRule: "NATIVE_STEP_COUNT_MUST_NOT_BE_LOWER_THAN_ENGLISH",
      nativeEnrichmentAllowed: true,
    },
    null,
    2,
  ),
);
