import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import {
  generateBankingPossibilityShellV1,
  SYL_BANKING_POSSIBILITY_SHELL_V1,
} from "./banking-possibility-shell-v1";
import type { PairSemanticStatus } from "./types";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const validStatuses: readonly PairSemanticStatus[] = [
  "ONLY_FIRST_FOLLOWS",
  "ONLY_SECOND_FOLLOWS",
  "BOTH_FOLLOW",
  "NEITHER_FOLLOWS",
  "EITHER_OR_FOLLOWS",
];

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

function statusFromFollows(first: boolean, second: boolean): PairSemanticStatus {
  if (first && second) return "BOTH_FOLLOW";
  if (first) return "ONLY_FIRST_FOLLOWS";
  if (second) return "ONLY_SECOND_FOLLOWS";
  return "NEITHER_FOLLOWS";
}

let records = 0;
const statuses: Record<string, number> = {};
const scenarioGroups: Record<string, number> = {};
const sourcePatterns: Record<string, number> = {};
const possibilityForms: Record<string, number> = {};
const possibilityClassifications: Record<string, number> = {};
const possibilityPositions: Record<string, number> = {};
const correctOptionPositions: Record<string, number> = {};
const scenarioIds = new Set<string>();

for (let seed = 0; seed < 80; seed += 1) {
  const byLocale = locales.map((locale) => generateBankingPossibilityShellV1(seed, locale));
  const semanticReference = byLocale[0];

  for (const question of byLocale) {
    records += 1;
    assert.equal(question.authority, "SYL_001_BANKING_POSSIBILITY_SHELL_V1");
    assert.equal(question.prototypeId, "SYL-PROTOTYPE-BANK-POSSIBILITY-001");
    assert.equal(question.statements.length >= 2, true);
    assert.equal(question.conclusions.length, 2);
    assert.equal(question.options.length, 5);
    assert.equal(new Set(question.options.map((entry) => entry.text)).size, 5);
    assert.equal(question.options.filter((entry) => entry.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.deepEqual(
      [...question.options.map((entry) => entry.semanticValue)].sort(),
      [...validStatuses].sort(),
    );
    assert.equal(question.semanticAnswer, statusFromFollows(
      question.conclusions[0].follows,
      question.conclusions[1].follows,
    ));
    assert.equal(question.options[question.correctIndex]?.semanticValue, question.semanticAnswer);
    assert.notEqual(question.semanticAnswer, "EITHER_OR_FOLLOWS");

    const possibility = question.conclusions.find((entry) => entry.mode === "POSSIBILITY");
    const definite = question.conclusions.find((entry) => entry.mode === "DEFINITE");
    assert.ok(possibility);
    assert.ok(definite);
    assert.equal(question.conclusions.filter((entry) => entry.mode === "POSSIBILITY").length, 1);
    assert.equal(question.conclusions.filter((entry) => entry.mode === "DEFINITE").length, 1);
    assert.ok(possibility.canonicalConclusion.form === "SOME" || possibility.canonicalConclusion.form === "SOME_NOT");
    assert.notEqual(possibility.classification, "ENTAILED");
    assert.equal(possibility.follows, possibility.canBeTrue);
    assert.equal(possibility.witnessModelAvailable, possibility.canBeTrue);
    assert.equal(possibility.counterModelAvailable, possibility.canBeFalse);
    assert.equal(definite.follows, definite.classification === "ENTAILED");
    if (possibility.follows) assert.equal(possibility.classification, "UNDETERMINED");
    else assert.equal(possibility.classification, "CONTRADICTED");

    if (question.locale === "en-IN") {
      assert.match(possibility.text, /^Some .+ is a possibility\.$/u);
    } else if (question.locale === "hi-IN") {
      assert.match(possibility.text, /^यह संभव है कि कुछ /u);
      assert.doesNotMatch(possibility.text, / के .* होने की संभावना/u);
    } else {
      assert.match(possibility.text, /^ਇਹ ਸੰਭਵ ਹੈ ਕਿ ਕੁਝ /u);
      assert.doesNotMatch(possibility.text, / ਦੇ .* ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ/u);
    }

    assert.ok(question.explanation.length === 2);
    assert.ok(question.explanation.every((line) => line.trim().length > 30));
    assert.ok(question.statements.every((line) => line.trim().length > 4));
    assert.ok(question.conclusions.every((entry) => entry.text.trim().length > 10));

    assert.ok(["CORE", "ONLY", "FEW"].includes(question.scenarioGroup));
    assert.match(question.sourcePatternId, /^SYL-SRC-BANK-/u);

    assert.equal(question.metadata.answerTemplateId, "BANK_FIVE_OPTION_V1");
    assert.equal(question.metadata.renderer, "CONCLUSION_COMBINATION");
    assert.equal(question.metadata.possibilityConclusionCount, 1);
    assert.equal(question.metadata.definiteConclusionCount, 1);
    assert.equal(question.metadata.legacyQlChanged, false);
    assert.equal(question.metadata.registeredQlCreated, false);
    assert.equal(question.metadata.connectedToProfilePlanner, false);
    assert.equal(question.metadata.questionStudioVisible, false);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.testEligible, false);
    assert.equal(question.metadata.publiclyPublishable, false);

    increment(statuses, question.semanticAnswer);
    increment(scenarioGroups, question.scenarioGroup);
    increment(sourcePatterns, question.sourcePatternId);
    increment(possibilityForms, possibility.canonicalConclusion.form);
    increment(possibilityClassifications, possibility.classification);
    increment(possibilityPositions, question.conclusions[0].mode === "POSSIBILITY" ? "FIRST" : "SECOND");
    increment(correctOptionPositions, String(question.correctIndex));
    scenarioIds.add(question.scenarioId);
  }

  for (const localized of byLocale.slice(1)) {
    assert.equal(localized.scenarioId, semanticReference.scenarioId);
    assert.equal(localized.scenarioGroup, semanticReference.scenarioGroup);
    assert.equal(localized.sourcePatternId, semanticReference.sourcePatternId);
    assert.equal(localized.semanticAnswer, semanticReference.semanticAnswer);
    assert.equal(localized.correctIndex, semanticReference.correctIndex);
    assert.deepEqual(
      localized.conclusions.map((entry) => ({
        mode: entry.mode,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
      })),
      semanticReference.conclusions.map((entry) => ({
        mode: entry.mode,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
      })),
    );
    assert.deepEqual(
      localized.options.map((entry) => ({
        semanticValue: entry.semanticValue,
        isCorrect: entry.isCorrect,
        errorLabel: entry.errorLabel,
      })),
      semanticReference.options.map((entry) => ({
        semanticValue: entry.semanticValue,
        isCorrect: entry.isCorrect,
        errorLabel: entry.errorLabel,
      })),
    );
  }
}

assert.equal(records, 80 * 3);
assert.deepEqual(statuses, {
  ONLY_FIRST_FOLLOWS: 60,
  ONLY_SECOND_FOLLOWS: 60,
  BOTH_FOLLOW: 60,
  NEITHER_FOLLOWS: 60,
});
assert.deepEqual(possibilityPositions, { FIRST: 120, SECOND: 120 });
assert.ok((possibilityForms.SOME ?? 0) > 0);
assert.ok((possibilityForms.SOME_NOT ?? 0) > 0);
assert.ok((possibilityClassifications.UNDETERMINED ?? 0) > 0);
assert.ok((possibilityClassifications.CONTRADICTED ?? 0) > 0);
assert.ok(Object.keys(scenarioGroups).length >= 2);
assert.ok(Object.keys(sourcePatterns).length >= 2);
assert.ok(scenarioIds.size >= 8);
assert.ok(Object.keys(correctOptionPositions).length >= 4);
assert.equal(SYL_BANKING_POSSIBILITY_SHELL_V1.status, "PROTOTYPE_NOT_REGISTERED");
assert.equal(SYL_BANKING_POSSIBILITY_SHELL_V1.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_SHELL_PROTOTYPE_AUDIT",
  authority: SYL_BANKING_POSSIBILITY_SHELL_V1.authorityId,
  records,
  seeds: 80,
  locales,
  statuses,
  scenarioGroups,
  sourcePatterns,
  distinctScenarios: scenarioIds.size,
  possibilityForms,
  possibilityClassifications,
  possibilityPositions,
  correctOptionPositions,
  localizationContract: {
    English: "exam-style possibility wording",
    Hindi: "यह संभव है कि कुछ ...",
    Punjabi: "ਇਹ ਸੰਭਵ ਹੈ ਕਿ ਕੁਝ ...",
    rejectedGenitiveConstruction: true,
  },
  semantics: {
    possibilityFollowsWhen: "canBeTrue === true",
    definiteFollowsWhen: "classification === ENTAILED",
    fiveOptionShell: true,
    eitherOrCorrectInThisMixedFamily: false,
  },
  locks: {
    legacyQlChanged: false,
    registeredQlCreated: false,
    connectedToProfilePlanner: false,
    questionStudioVisible: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    activationPermitted: SYL_BANKING_POSSIBILITY_SHELL_V1.activationPermitted,
  },
}, null, 2));
