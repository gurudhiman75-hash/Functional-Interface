import { strict as assert } from "node:assert";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1,
} from "./com003-localization-v2-wave1";
import {
  COM003_HINDI_LOCALIZATION_V2_WAVE1_V2,
  COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2,
  COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2,
} from "./com003-localization-v2-wave1-v2";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";

const QLS = ["COM-003-QL-001", "COM-003-QL-002", "COM-003-QL-003", "COM-003-QL-004"];
const EN = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => QLS.includes(q.qlId));
const EN_BY_ID = new Map(EN.map((q) => [q.questionId, q]));
const COMMAND_NAME: Record<string, string> = {
  "com003-command-copy": "Copy",
  "com003-command-save": "Save",
  "com003-command-cut": "Cut",
};
const SHORTCUT_NAME: Record<string, string> = {
  "com003-shortcut-ctrl-p": "Ctrl+P",
  "com003-shortcut-ctrl-s": "Ctrl+S",
};

assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2.authorityId, "COM-003-LOCALIZATION-V2-WAVE1-CANDIDATE-2");
assert.equal(COM003_HINDI_LOCALIZATION_V2_WAVE1_V2.length, 48);
assert.equal(COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2.length, 48);
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2.localizedQuestionCount, 96);

for (const [language, before, after] of [
  ["hi", COM003_HINDI_LOCALIZATION_V2_WAVE1, COM003_HINDI_LOCALIZATION_V2_WAVE1_V2],
  ["pa", COM003_PUNJABI_LOCALIZATION_V2_WAVE1, COM003_PUNJABI_LOCALIZATION_V2_WAVE1_V2],
] as const) {
  assert.equal(new Set(after.map((q) => q.localizationId)).size, 48, `${language}:duplicate-id`);
  assert.equal(new Set(after.map((q) => q.sourceQuestionId)).size, 48, `${language}:duplicate-source`);

  for (let index = 0; index < after.length; index += 1) {
    const oldItem = before[index]!;
    const item = after[index]!;
    const source = EN_BY_ID.get(item.sourceQuestionId);
    assert.ok(source, `${language}:${item.localizationId}:missing-source`);
    assert.equal(item.sourceQuestionId, oldItem.sourceQuestionId);
    assert.equal(item.qlId, oldItem.qlId);
    assert.equal(item.cpId, oldItem.cpId);
    assert.equal(item.surfaceMode, oldItem.surfaceMode);
    assert.equal(item.targetFactId, oldItem.targetFactId);
    assert.deepEqual(item.options, oldItem.options);
    assert.equal(item.correctIndex, oldItem.correctIndex);
    assert.equal(item.canonicalAnswer, oldItem.canonicalAnswer);
    assert.equal(item.explanation, oldItem.explanation);
    assert.deepEqual(item.sourceIds, oldItem.sourceIds);
    assert.deepEqual(item.sourceFactIds, oldItem.sourceFactIds);
    assert.equal(item.versionScoped, oldItem.versionScoped);
    assert.equal(item.options[item.correctIndex], item.canonicalAnswer);
    assert.equal(item.correctIndex, source!.correctIndex);
    assert.equal(item.qlId, source!.qlId);
    assert.equal(item.targetFactId, source!.targetFactId);

    if (item.surfaceMode === "COMMAND_TO_EFFECT") {
      const command = COMMAND_NAME[item.targetFactId];
      assert.ok(command, `${item.localizationId}:missing-command-contract`);
      assert.match(item.stem, new RegExp(`^${command} `), `${item.localizationId}:command-name-not-in-stem`);
      assert.notEqual(item.stem, oldItem.stem, `${item.localizationId}:command-direction-not-remediated`);
    } else if (item.surfaceMode === "SHORTCUT_TO_ACTION") {
      const shortcut = SHORTCUT_NAME[item.targetFactId];
      assert.ok(shortcut, `${item.localizationId}:missing-shortcut-contract`);
      assert.match(item.stem, new RegExp(shortcut!.replace("+", "\\+")), `${item.localizationId}:shortcut-not-in-stem`);
      assert.match(item.stem, /Windows desktop/, `${item.localizationId}:version-context-lost`);
      assert.notEqual(item.stem, oldItem.stem, `${item.localizationId}:shortcut-direction-not-remediated`);
    } else {
      assert.equal(item.stem, oldItem.stem, `${item.localizationId}:unexpected-stem-drift`);
    }
  }

  for (const qlId of QLS) {
    const items = after.filter((q) => q.qlId === qlId);
    assert.equal(items.length, 12, `${language}:${qlId}:count`);
    assert.equal(new Set(items.map((q) => q.stem.trim().toLowerCase())).size, 12, `${language}:${qlId}:duplicate-stem`);
  }
}

assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2.governance.localizationFrozen, false);
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2.governance.questionStudioRuntimeAuthorized, false);
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2.governance.questionBankWritesAuthorized, false);
assert.equal(COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2.governance.testEligibilityAuthorized, false);

console.log("[COM003-LOCALIZATION-V2-WAVE1-V2]", {
  authority: COM003_LOCALIZATION_V2_WAVE1_AUTHORITY_V2.authorityId,
  questionsPerLanguage: 48,
  localized: 96,
  commandDirectionRepairs: COM003_HINDI_LOCALIZATION_V2_WAVE1_V2.filter((q) => q.surfaceMode === "COMMAND_TO_EFFECT").length,
  shortcutDirectionRepairs: COM003_HINDI_LOCALIZATION_V2_WAVE1_V2.filter((q) => q.surfaceMode === "SHORTCUT_TO_ACTION").length,
  runtimeAuthorized: false,
});
