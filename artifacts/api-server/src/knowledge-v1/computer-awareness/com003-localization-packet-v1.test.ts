import { strict as assert } from "node:assert";

import {
  COM003_HINDI_LOCALIZATION_PACKET_V1,
  COM003_LOCALIZATION_PACKET_AUTHORITY_V1,
  COM003_LOCALIZATION_TERM_POLICY_V1,
  COM003_PUNJABI_LOCALIZATION_PACKET_V1,
} from "./com003-localization-packet-v1";

assert.equal(COM003_HINDI_LOCALIZATION_PACKET_V1.length, 228);
assert.equal(COM003_PUNJABI_LOCALIZATION_PACKET_V1.length, 228);
assert.equal(COM003_LOCALIZATION_PACKET_AUTHORITY_V1.totalWorkItemCount, 456);
assert.equal(COM003_LOCALIZATION_PACKET_AUTHORITY_V1.localizationFrozen, false);
assert.equal(COM003_LOCALIZATION_PACKET_AUTHORITY_V1.questionStudioRegistrationAuthorized, false);
assert.equal(COM003_LOCALIZATION_TERM_POLICY_V1.preserveLatinTokens.includes("Microsoft"), true);
assert.equal(COM003_LOCALIZATION_TERM_POLICY_V1.preserveLatinTokens.includes("Ctrl"), true);

for (const [language, packet] of [
  ["hi", COM003_HINDI_LOCALIZATION_PACKET_V1],
  ["pa", COM003_PUNJABI_LOCALIZATION_PACKET_V1],
] as const) {
  const expectedLocale = language === "hi" ? "hi-IN" : "pa-IN";
  assert.equal(new Set(packet.map((item) => item.localizationWorkItemId)).size, 228);
  assert.equal(new Set(packet.map((item) => item.sourceQuestionId)).size, 228);
  for (const item of packet) {
    assert.equal(item.targetLanguage, language);
    assert.equal(item.targetLocale, expectedLocale);
    assert.equal(item.source.options.length, 4);
    assert.equal(item.correctIndex >= 0 && item.correctIndex < 4, true);
    assert.equal(item.source.options[item.correctIndex], item.source.canonicalAnswer);
    assert.equal(item.sourceFactIds.length > 0, true);
    assert.equal(item.sourceIds.length > 0, true);
    assert.equal(item.translationStatus, "AWAITING_AUTHORED_TRANSLATION");
    assert.equal(item.reviewStatus, "NOT_REVIEWED");
    assert.equal(item.invariantContract.correctIndexInvariant, true);
    assert.equal(item.invariantContract.testedFactInvariant, true);
    assert.equal(item.runtimeRegistered, false);
    assert.equal(item.productionReleased, false);
  }
}

console.log("[COM003-LOCALIZATION-PACKET-V1]", {
  hindi: COM003_HINDI_LOCALIZATION_PACKET_V1.length,
  punjabi: COM003_PUNJABI_LOCALIZATION_PACKET_V1.length,
  total: COM003_LOCALIZATION_PACKET_AUTHORITY_V1.totalWorkItemCount,
  status: COM003_LOCALIZATION_PACKET_AUTHORITY_V1.status,
});
