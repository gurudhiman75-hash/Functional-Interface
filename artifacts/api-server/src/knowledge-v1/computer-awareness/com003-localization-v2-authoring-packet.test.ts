import { strict as assert } from "node:assert";
import {
  COM003_LOCALIZATION_V2_AUTHORING_PACKET,
  auditCom003LocalizationV2AuthoringPacket,
} from "./com003-localization-v2-authoring-packet";

const audit = auditCom003LocalizationV2AuthoringPacket();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questions, 228);
assert.equal(audit.localizedOutputsToAuthor, 456);
assert.equal(COM003_LOCALIZATION_V2_AUTHORING_PACKET.length, 228);
for (const q of COM003_LOCALIZATION_V2_AUTHORING_PACKET) {
  assert.equal(q.english.options.length, 4, q.questionId);
  assert.equal(q.languages.hi.optionMemory.length, 4, `${q.questionId}:hi`);
  assert.equal(q.languages.pa.optionMemory.length, 4, `${q.questionId}:pa`);
}
console.log("[COM003-LOCALIZATION-V2-AUTHORING-PACKET]", {
  questions: audit.questions,
  localizedOutputsToAuthor: audit.localizedOutputsToAuthor,
  sourceAuthority: audit.sourceAuthority,
  translationMemoryAuthority: audit.translationMemoryAuthority,
  governance: audit.governance,
});
