import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexHtml = fs.readFileSync(path.join(appRoot, "index.html"), "utf8");
const appLayout = fs.readFileSync(path.join(appRoot, "src/components/AppLayout.tsx"), "utf8");
const appCss = fs.readFileSync(path.join(appRoot, "src/index.css"), "utf8");

assert.match(
  indexHtml,
  /<meta name="viewport" content="width=device-width, initial-scale=1\.0"\s*\/?>/,
  "student viewport must support normal browser zoom",
);
assert.doesNotMatch(
  indexHtml,
  /maximum-scale|minimum-scale|user-scalable\s*=\s*no/i,
  "student viewport must not restrict browser zoom",
);
assert.match(
  appLayout,
  /href="#main-content"/,
  "shared app shell must expose a skip-to-main link",
);
assert.match(
  appLayout,
  />\s*Skip to main content\s*</,
  "skip navigation needs an understandable accessible name",
);
assert.match(
  appLayout,
  /id="main-content"/,
  "shared app shell must provide the skip-link destination",
);
assert.match(
  appLayout,
  /tabIndex=\{-1\}/,
  "main landmark must accept programmatic focus after skip navigation",
);
assert.match(
  appLayout,
  /focus:not-sr-only/,
  "skip navigation must become visible when keyboard-focused",
);
assert.match(
  appCss,
  /:focus-visible\s*\{[\s\S]*?outline:/,
  "global keyboard focus must retain a visible focus indicator",
);

console.log("Accessibility foundation audit passed (8 assertions)." );
