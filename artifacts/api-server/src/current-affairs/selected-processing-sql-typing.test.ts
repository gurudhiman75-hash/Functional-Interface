import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("./selected-affairs-processing-runtime.ts", import.meta.url), "utf8");

assert.match(
  source,
  /'selectedProcessingEvidenceCandidateId',\s*\$\{officialCandidateId\}::text/,
  "jsonb_build_object values sourced from SQL parameters must carry an explicit PostgreSQL type",
);
assert.match(
  source,
  /'processingVersion',\s*\$\{SELECTED_AFFAIRS_PROCESSING_VERSION\}::text/,
  "selected-processing version passed into jsonb_build_object must carry an explicit PostgreSQL type",
);

console.log("Current Affairs CP-056 selected-processing SQL typing contracts passed");
