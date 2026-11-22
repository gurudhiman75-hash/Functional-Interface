import assert from "node:assert/strict";
import test from "node:test";
import { nativeLanguagesToPrepare } from "./persisted-native-review";

test("defaults to every Hindi/Punjabi language the package supports", () => {
  assert.deepEqual(nativeLanguagesToPrepare("MAL-001", undefined, {}), ["hi", "pa"]);
  assert.deepEqual(nativeLanguagesToPrepare("PUN-001", undefined, {}), ["pa"]);
});
test("an explicit request narrows it", () => {
  assert.deepEqual(nativeLanguagesToPrepare("MAL-001", ["pa"], {}), ["pa"]);
});
test("kill switch and unknown packages produce nothing", () => {
  assert.deepEqual(nativeLanguagesToPrepare("MAL-001", undefined, { EXAMTREE_NATIVE_SNAPSHOT_DISABLED: "true" }), []);
  assert.deepEqual(nativeLanguagesToPrepare("NOPE-999", undefined, {}), []);
});
