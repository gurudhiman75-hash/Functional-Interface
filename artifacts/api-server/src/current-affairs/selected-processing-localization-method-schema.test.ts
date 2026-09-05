import assert from "node:assert/strict";
import fs from "node:fs";

const closureRuntime = fs.readFileSync(new URL("./selected-blocker-closure-runtime.ts", import.meta.url), "utf8");
const migration = fs.readFileSync(
  new URL("../../migrations/20260905_current_affairs_selected_processing_localization_method.sql", import.meta.url),
  "utf8",
);
const bootstrap = fs.readFileSync(new URL("../../ensure-current-affairs.mjs", import.meta.url), "utf8");

assert.match(
  closureRuntime,
  /'deterministic_template_compat_v1'/,
  "CP-063 compatibility repair must keep an explicit deterministic provenance method.",
);

assert.match(
  migration,
  /current_affairs_localizations_localization_method_check/,
  "The migration must replace the production localization-method constraint.",
);
assert.match(migration, /'deterministic_template_v1'/);
assert.match(migration, /'deterministic_template_compat_v1'/);
assert.match(migration, /'manual'/);

assert.match(
  bootstrap,
  /20260905_current_affairs_selected_processing_localization_method\.sql/,
  "Render schema bootstrap must apply the CP-063 localization-method migration.",
);

console.log("Current Affairs selected-processing localization-method schema contract passed.");
