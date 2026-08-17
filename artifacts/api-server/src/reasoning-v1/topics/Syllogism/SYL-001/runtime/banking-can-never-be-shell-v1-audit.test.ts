import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import {
  generateBankingCanNeverShellV1,
  type BankingCanNeverConclusionV1,
} from "./banking-can-never-be-shell-v1";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);

let records = 0;
const statuses: Record<string, number> = {};
const surfaceKinds: Record<string, number> = {};
const dispositions: Record<string, number> = {};
const sources: Record<string, number> = {};
const optionPositions: Record<string, number> = {};

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

function negativeConclusion(
  conclusions: readonly BankingCanNeverConclusionV1[],
): BankingCanNeverConclusionV1 {
  const values = conclusions.filter((entry) => entry.mode === "CAN_NEVER_BE");
  assert.equal(values.length, 1);
  return values[0];
}

for (const seed of seeds) {
  const localeRecords = locales.map((locale) => generateBankingCanNeverShellV1(seed, locale));
  const canonical = localeRecords[0];

  for (const question of localeRecords) {
    records += 1;
    assert.equal(question.authority, "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V1");
    assert.equal(question.prototypeId, "SYL-PROTOTYPE-BANK-CAN-NEVER-001");
    assert.equal(question.metadata.modalSemanticProfile, "BANKING_EXAM_CAN_NEVER_BE_V1");
    assert.equal(question.metadata.answerPositionPolicy, "EXACT_SEED_MOD_5_BALANCE_V1");
    assert.ok(question.sourcePatternId.startsWith("SYL-SRC-BANK-"));
    assert.equal(question.conclusions.length, 2);
    assert.equal(question.conclusions.filter((entry) => entry.mode === "CAN_NEVER_BE").length, 1);
    assert.equal(question.conclusions.filter((entry) => entry.mode === "DEFINITE").length, 1);
    assert.equal(question.options.length, 5);
    assert.equal(question.options.filter((entry) => entry.isCorrect).length, 1);
    assert.equal(question.correctIndex, Math.abs(seed) % 5);
    assert.equal(question.options[question.correctIndex]?.semanticValue, question.semanticAnswer);
    assert.equal(question.metadata.legacyQlChanged, false);
    assert.equal(question.metadata.registeredQlCreated, false);
    assert.equal(question.metadata.connectedToProfilePlanner, false);
    assert.equal(question.metadata.questionStudioVisible, false);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.testEligible, false);
    assert.equal(question.metadata.publiclyPublishable, false);

    const negative = negativeConclusion(question.conclusions);
    assert.ok(negative.surfaceKind === "ALL_CAN_NEVER" || negative.surfaceKind === "SOME_CAN_NEVER");

    if (negative.surfaceKind === "ALL_CAN_NEVER") {
      assert.equal(negative.canonicalConclusion.form, "ALL");
      assert.equal(negative.follows, negative.canBeTrue === false);
      assert.equal(
        negative.disposition,
        negative.follows ? "FOLLOWS_IMPOSSIBLE_ALL" : "DOES_NOT_FOLLOW",
      );
      if (question.locale === "en-IN") assert.match(negative.text, /^All .* can never be .*\.$/u);
      if (question.locale === "hi-IN") assert.match(negative.text, /^सभी /u);
      if (question.locale === "pa-IN") assert.match(negative.text, /^ਸਾਰੇ /u);
    } else {
      assert.equal(negative.canonicalConclusion.form, "SOME_NOT");
      assert.equal(negative.follows, negative.classification === "ENTAILED");
      assert.equal(
        negative.disposition,
        negative.follows ? "FOLLOWS_DEFINITE_SOME_NOT" : "DOES_NOT_FOLLOW",
      );
      if (question.locale === "en-IN") assert.match(negative.text, /^Some .* can never be .*\.$/u);
      if (question.locale === "hi-IN") assert.match(negative.text, /^कुछ /u);
      if (question.locale === "pa-IN") assert.match(negative.text, /^ਕੁਝ /u);
    }

    increment(statuses, question.semanticAnswer);
    increment(surfaceKinds, negative.surfaceKind);
    increment(dispositions, negative.disposition ?? "NONE");
    increment(sources, question.sourcePatternId);
    increment(optionPositions, String(question.correctIndex));
  }

  for (const question of localeRecords.slice(1)) {
    assert.equal(question.scenarioId, canonical.scenarioId);
    assert.equal(question.scenarioGroup, canonical.scenarioGroup);
    assert.equal(question.sourcePatternId, canonical.sourcePatternId);
    assert.equal(question.semanticAnswer, canonical.semanticAnswer);
    assert.equal(question.correctIndex, canonical.correctIndex);
    assert.deepEqual(
      question.conclusions.map((entry) => ({
        mode: entry.mode,
        surfaceKind: entry.surfaceKind,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        disposition: entry.disposition,
      })),
      canonical.conclusions.map((entry) => ({
        mode: entry.mode,
        surfaceKind: entry.surfaceKind,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        disposition: entry.disposition,
      })),
    );
  }
}

assert.equal(records, 240);
for (const status of ["ONLY_FIRST_FOLLOWS", "ONLY_SECOND_FOLLOWS", "BOTH_FOLLOW", "NEITHER_FOLLOWS"]) {
  assert.ok((statuses[status] ?? 0) > 0, `${status} must be represented`);
}
for (const kind of ["ALL_CAN_NEVER", "SOME_CAN_NEVER"]) {
  assert.ok((surfaceKinds[kind] ?? 0) > 0, `${kind} must be represented`);
}
assert.ok((dispositions.FOLLOWS_IMPOSSIBLE_ALL ?? 0) > 0);
assert.ok((dispositions.FOLLOWS_DEFINITE_SOME_NOT ?? 0) > 0);
assert.ok((dispositions.DOES_NOT_FOLLOW ?? 0) > 0);
for (let index = 0; index < 5; index += 1) {
  assert.equal(optionPositions[String(index)], 48, `option index ${index} must occur exactly 48 times`);
}

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CAN_NEVER_BE_SHELL_V1",
  records,
  statuses,
  surfaceKinds,
  dispositions,
  sources,
  correctOptionPositions: optionPositions,
  semanticContract: {
    allCanNever: "underlying ALL has canBeTrue === false",
    someCanNever: "underlying SOME_NOT is ENTAILED",
    sourceBoundary: "secondary banking question-level evidence; not a final official-paper frequency census",
  },
  locks: {
    legacyQlChanged: false,
    registeredQlCreated: false,
    connectedToProfilePlanner: false,
    questionStudioVisible: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    activationPermitted: false,
  },
}, null, 2));
