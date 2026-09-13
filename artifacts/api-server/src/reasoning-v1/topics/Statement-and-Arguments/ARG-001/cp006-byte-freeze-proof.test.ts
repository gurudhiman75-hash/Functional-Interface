import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { ARG_CP006_FROZEN_BLOBS } from "./cp006-freeze-manifest.ts";

const repoRoot = process.cwd();

for (const [path, expectedSha] of ARG_CP006_FROZEN_BLOBS) {
  const absolute = resolve(repoRoot, path);
  assert.equal(existsSync(absolute), true, `${path}: frozen authority file is missing`);
  const actualSha = execFileSync("git", ["hash-object", path], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  assert.equal(
    actualSha,
    expectedSha,
    `${path}: CP006 byte freeze drifted. Any intentional content/runtime change requires an explicit new freeze authority/version.`,
  );
}

console.log(`ARG-001 CP006 byte freeze: PASS (${ARG_CP006_FROZEN_BLOBS.length} authorities)`);
