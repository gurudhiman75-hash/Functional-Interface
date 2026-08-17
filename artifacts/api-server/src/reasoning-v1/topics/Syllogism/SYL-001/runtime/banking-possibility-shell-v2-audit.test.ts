import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import {
  BANKING_POSSIBILITY_FIXED_OPTION_ORDER_V2,
  generateBankingPossibilityShellV2,
  type BankingPossibilityConclusionV2,
} from "./banking-possibility-shell-v2";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
const expectedOptionOrder = [
  "ONLY_FIRST_FOLLOWS",
  "ONLY_SECOND_FOLLOWS",
  "BOTH_FOLLOW",
  "NEITHER_FOLLOWS",
  "EITHER_OR_FOLLOWS",
] as const;

assert.deepEqual(BANKING_POSSIBILITY_FIXED_OPTION_ORDER_V2, expectedOptionOrder);

let records = 0;
const statuses: Record<string, number> = {};
const possibilityForms: Record<string, number> = {};
const possibilityClasses: Record<string, number> = {};
const dispositions: Record<string, number> = {};
const sources: Record<string, number> = {};
const optionPositions: Record<string, number> = {};
let allPossibilityRecords = 0;
let alreadyDefinitePossibilityRecords = 0;
let impossiblePossibilityRecords = 0;
let openPossibilityRecords = 0;
let nonEnglishConventionLeaks = 0;

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

function possibilityConclusion(
  conclusions: readonly BankingPossibilityConclusionV2[],
): BankingPossibilityConclusionV2 {
  const values = conclusions.filter((entry) => entry.mode === "POSSIBILITY");
  assert.equal(values.length, 1);
  return values[0];
}

for (const seed of seeds) {
  const localeRecords = locales.map((locale) => generateBankingPossibilityShellV2(seed, locale));
  const canonical = localeRecords[0];

  for (const question of localeRecords) {
    records += 1;
    assert.equal(question.authority, "SYL_001_BANKING_POSSIBILITY_SHELL_V2");
    assert.equal(question.prototypeId, "SYL-PROTOTYPE-BANK-POSSIBILITY-002");
    assert.equal(question.metadata.possibilitySemanticProfile, "BANKING_EXAM_POSSIBILITY_V2");
    assert.equal(question.metadata.answerPositionPolicy, "FIXED_BANK_FIVE_OPTION_TEMPLATE_V2");
    assert.equal(question.metadata.answerBalancePolicy, "BALANCE_SEMANTIC_QUESTION_TYPES_NOT_OPTION_LABELS_V2");
    assert.ok(question.sourcePatternId.startsWith("SYL-SRC-BANK-"));
    assert.equal(question.conclusions.length, 2);
    assert.equal(question.conclusions.filter((entry) => entry.mode === "POSSIBILITY").length, 1);
    assert.equal(question.conclusions.filter((entry) => entry.mode === "DEFINITE").length, 1);
    assert.equal(question.options.length, 5);
    assert.deepEqual(question.options.map((entry) => entry.semanticValue), expectedOptionOrder);
    assert.deepEqual(question.options.map((entry) => entry.optionId), [
      "OPTION-1",
      "OPTION-2",
      "OPTION-3",
      "OPTION-4",
      "OPTION-5",
    ]);
    assert.equal(question.options.filter((entry) => entry.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.semanticValue, question.semanticAnswer);
    assert.equal(question.metadata.legacyQlChanged, false);
    assert.equal(question.metadata.registeredQlCreated, false);
    assert.equal(question.metadata.connectedToProfilePlanner, false);
    assert.equal(question.metadata.questionStudioVisible, false);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.testEligible, false);
    assert.equal(question.metadata.publiclyPublishable, false);

    if (
      question.locale !== "en-IN"
      && question.explanation.some((line) => line.includes("Banking possibility convention"))
    ) {
      nonEnglishConventionLeaks += 1;
    }

    const possibility = possibilityConclusion(question.conclusions);
    assert.ok(["ALL", "SOME", "SOME_NOT"].includes(possibility.canonicalConclusion.form));
    const expectedDisposition = possibility.classification === "ENTAILED"
      ? "ALREADY_DEFINITE"
      : possibility.classification === "UNDETERMINED" && possibility.canBeTrue && possibility.canBeFalse
        ? "OPEN_POSSIBILITY"
        : "IMPOSSIBLE";
    assert.equal(possibility.possibilityDisposition, expectedDisposition);
    assert.equal(possibility.follows, expectedDisposition === "OPEN_POSSIBILITY");

    if (possibility.canonicalConclusion.form === "ALL") {
      allPossibilityRecords += 1;
      if (question.locale === "en-IN") assert.match(possibility.text, /^All .* being .* is a possibility\.$/u);
      if (question.locale === "hi-IN") assert.match(possibility.text, /^यह संभव है कि सभी /u);
      if (question.locale === "pa-IN") assert.match(possibility.text, /^ਇਹ ਸੰਭਵ ਹੈ ਕਿ ਸਾਰੇ /u);
    }
    if (expectedDisposition === "ALREADY_DEFINITE") {
      alreadyDefinitePossibilityRecords += 1;
      assert.equal(possibility.follows, false);
      if (question.locale === "en-IN") assert.match(question.explanation.join(" "), /already definite/u);
    } else if (expectedDisposition === "IMPOSSIBLE") {
      impossiblePossibilityRecords += 1;
      assert.equal(possibility.follows, false);
    } else {
      openPossibilityRecords += 1;
      assert.equal(possibility.follows, true);
    }

    increment(statuses, question.semanticAnswer);
    increment(possibilityForms, possibility.canonicalConclusion.form);
    increment(possibilityClasses, possibility.classification);
    increment(dispositions, possibility.possibilityDisposition ?? "NONE");
    increment(sources, question.sourcePatternId);
    increment(optionPositions, String(question.correctIndex));
  }

  // Locale parity: same logical record, only rendered text changes.
  for (const question of localeRecords.slice(1)) {
    assert.equal(question.scenarioId, canonical.scenarioId);
    assert.equal(question.scenarioGroup, canonical.scenarioGroup);
    assert.equal(question.sourcePatternId, canonical.sourcePatternId);
    assert.equal(question.semanticAnswer, canonical.semanticAnswer);
    assert.equal(question.correctIndex, canonical.correctIndex);
    assert.deepEqual(
      question.options.map((entry) => entry.semanticValue),
      canonical.options.map((entry) => entry.semanticValue),
    );
    assert.deepEqual(
      question.conclusions.map((entry) => ({
        mode: entry.mode,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        possibilityDisposition: entry.possibilityDisposition,
      })),
      canonical.conclusions.map((entry) => ({
        mode: entry.mode,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        possibilityDisposition: entry.possibilityDisposition,
      })),
    );
  }
}

assert.equal(records, 240);
assert.deepEqual(statuses, {
  ONLY_FIRST_FOLLOWS: 60,
  ONLY_SECOND_FOLLOWS: 60,
  BOTH_FOLLOW: 60,
  NEITHER_FOLLOWS: 60,
});
assert.deepEqual(optionPositions, {
  "0": 60,
  "1": 60,
  "2": 60,
  "3": 60,
});
assert.equal(optionPositions["4"] ?? 0, 0);
assert.equal(nonEnglishConventionLeaks, 0);
for (const form of ["ALL", "SOME", "SOME_NOT"]) {
  assert.ok((possibilityForms[form] ?? 0) > 0, `${form} possibility must be represented`);
}
for (const classification of ["UNDETERMINED", "ENTAILED", "CONTRADICTED"]) {
  assert.ok((possibilityClasses[classification] ?? 0) > 0, `${classification} possibility class must be represented`);
}
for (const disposition of ["OPEN_POSSIBILITY", "ALREADY_DEFINITE", "IMPOSSIBLE"]) {
  assert.ok((dispositions[disposition] ?? 0) > 0, `${disposition} must be represented`);
}
assert.ok(allPossibilityRecords > 0);
assert.ok(alreadyDefinitePossibilityRecords > 0);
assert.ok(impossiblePossibilityRecords > 0);
assert.ok(openPossibilityRecords > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_SHELL_V2",
  records,
  statuses,
  possibilityForms,
  possibilityClasses,
  dispositions,
  sources,
  correctOptionPositions: optionPositions,
  fixedOptionOrder: expectedOptionOrder,
  answerPositionPolicy: "FIXED_BANK_FIVE_OPTION_TEMPLATE_V2",
  answerBalancePolicy: "BALANCE_SEMANTIC_QUESTION_TYPES_NOT_OPTION_LABELS_V2",
  nonEnglishConventionLeaks,
  allPossibilityRecords,
  alreadyDefinitePossibilityRecords,
  impossiblePossibilityRecords,
  openPossibilityRecords,
  semanticCorrection: {
    v1RuleRejected: "canBeTrue === true",
    v2Rule: "classification === UNDETERMINED && canBeTrue && canBeFalse",
    alreadyDefinitePossibilityAccepted: false,
    allowedPossibilityForms: ["ALL", "SOME", "SOME_NOT"],
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
