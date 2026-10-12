import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const adapter = readFileSync(
  new URL("../artifacts/api-server/src/question-studio/engines/quant-v4-adapter.ts", import.meta.url),
  "utf8",
);
const manifest = readFileSync(
  new URL("../artifacts/api-server/src/question-studio/build-question-studio-capabilities-manifest.ts", import.meta.url),
  "utf8",
);

function canonicalOverride(packageId, factory) {
  // A dedicated package card must win even if filesystem discovery registers
  // the same ID first. The registry's dispatch for that ID must also exist.
  const escapedId = packageId.replace(/[-]/g, "\\-");
  assert.match(
    adapter,
    new RegExp('replaceOrPush\\("' + escapedId + '",\\s*' + factory + '\\('),
    packageId + " must use the dedicated authoritative card",
  );
  assert.doesNotMatch(
    adapter,
    new RegExp('if\\s*\\(!packages\\.some\\(\\(pkg\\)\\s*=>\\s*pkg\\.packageId\\s*===\\s*"' + escapedId + '"\\)\\)'),
    packageId + " must not keep a generic discovered card",
  );
}

test("all 14 DI cards override generic discovery and retain executable dispatch", () => {
  for (let n = 1; n <= 14; n++) {
    const num = String(n).padStart(3, "0");
    canonicalOverride("DI-" + num, "di" + num + "QuestionStudioPackageCard");
    assert.match(adapter, new RegExp("isDi" + num + "QuestionStudioRequest\\("));
    assert.match(adapter, new RegExp("generateDi" + num + "QuestionStudioBatch\\("));
  }
  canonicalOverride("DI-MIX-001", "diDeliveryNoveltyMixPackageCard");
  assert.match(adapter, /isDiDeliveryNoveltyMixRequest/);
  assert.match(adapter, /generateDiDeliveryNoveltyMix/);
});

test("all 14 Statistics cards override generic discovery and retain executable dispatch", () => {
  for (let n = 1; n <= 14; n++) {
    const num = String(n).padStart(3, "0");
    const factory = "stat" + num + (n === 5 || n === 6 ? "QuestionStudioCard" : "QuestionStudioPackageCard");
    canonicalOverride("STAT-" + num, factory);
    assert.match(adapter, new RegExp("isStat" + num + "QuestionStudioRequest\\("));
    assert.match(adapter, new RegExp("generateStat" + num + "QuestionStudioBatch"));
  }
});

test("compiled Question Studio capabilities use current Quant adapters, not stale legacy Quant cards", () => {
  assert.match(manifest, /const currentQuantPackages = quantV4QuestionStudioAdapter\.listPackages\(\)\.map\(currentPackage\);/);
  assert.match(manifest, /for \(const pkg of currentQuantPackages\) packageMap\.set\(pkg\.packageId, pkg\);/);
});
