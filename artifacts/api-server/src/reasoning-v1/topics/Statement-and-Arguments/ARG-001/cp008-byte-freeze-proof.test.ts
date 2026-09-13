import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { ARG_CP008_FROZEN_BLOBS } from "./cp008-freeze-manifest.ts";

const repoRoot = process.cwd();

for (const [path, expectedSha] of ARG_CP008_FROZEN_BLOBS) {
  const absolute = resolve(repoRoot, path);
  assert.equal(existsSync(absolute), true, `${path}: CP008 frozen authority file is missing`);
  const actualSha = execFileSync("git", ["hash-object", path], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  assert.equal(
    actualSha,
    expectedSha,
    `${path}: CP008 real-paper closure drifted. Any intentional CP007 profile/runtime change requires an explicit superseding freeze authority.`,
  );
}

console.log(`ARG-001 CP008 post-CP006 byte freeze: PASS (${ARG_CP008_FROZEN_BLOBS.length} authorities)`);
