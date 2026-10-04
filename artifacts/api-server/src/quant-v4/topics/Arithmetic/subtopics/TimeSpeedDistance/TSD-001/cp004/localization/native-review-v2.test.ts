import assert from "node:assert/strict";
import { TSD_CP004_APPROVED_ENGLISH_FROZEN_60Q } from "../english-approved-freeze";
import { TSD_CP004_NATIVE_REVIEW_V2 } from "./native-review-v2";
import { cp004LocalizeOption, assertCp004NativeText } from "./native-primitives-v1";
assert.equal(TSD_CP004_NATIVE_REVIEW_V2.length, 120);
for (const row of TSD_CP004_NATIVE_REVIEW_V2) {
  const source = TSD_CP004_APPROVED_ENGLISH_FROZEN_60Q[row.parity.englishIndex]!;
  assert.strictEqual(row.input, source.input);
  assert.strictEqual(row.solution, source.solution);
  assert.equal(row.mathematicalFingerprint, source.mathematicalFingerprint);
  assert.equal(row.answerText, cp004LocalizeOption(source.answerText, row.language));
  assert.deepEqual(row.options, source.options.map(o => cp004LocalizeOption(o, row.language)));
  assert.equal(row.options[row.correctIndex], row.answerText);
  assert.ok(row.explanation.steps.every(s => s.includes(" = ")));
  assertCp004NativeText(row.stem, row.language, row.permanentQlId);
  assertCp004NativeText(row.explanation.steps.join(" "), row.language, row.permanentQlId);
  assert.doesNotMatch(row.stem + row.explanation.steps.join(" "), /\?|undefined|NaN|Infinity/);
  assert.equal(row.contentApproved, false);
  assert.equal(row.lifecycle.multilingualFreezeStatus, "UNFROZEN");
  assert.equal(row.lifecycle.questionStudioEnabled, false);
  assert.equal(row.lifecycle.questionBankStatus, "NOT_STORED");
  assert.equal(row.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(row.lifecycle.publiclyPublishable, false);
}
console.log("CP004 native V2 candidate: PASS (120 rows, source math/options parity; unapproved and locked)");
