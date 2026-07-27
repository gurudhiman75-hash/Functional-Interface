import assert from "node:assert/strict";
import {
  mixedTokenKey,
  sameMixedToken,
} from "./foundation/mixed-token";
import {
  matchingProvisionalMixedRules,
  mixedEvidenceKey,
  verifyProvisionalMixedTransfer,
} from "./provisional-independent-solver";
import {
  provisionalMixedContextKey,
  provisionalMixedRuleById,
} from "./provisional-rule-definitions";
import { ANA_CP008_ENGLISH_PROTOTYPES } from "./provisional-language-templates.en";
import { ANA_CP008_QLS } from "./question-language.en";
import {
  anaCp008ContextsForPrototype,
  generateMixedAnalogy,
} from "./runtime";
import { followsIntendedRule } from "./runtime-support";

const expectedIds = Array.from(
  { length: 28 },
  (_, index) => `ANA-QL-${String(223 + index).padStart(3, "0")}`,
);

assert.deepEqual(ANA_CP008_QLS.map((entry) => entry.qlId), expectedIds);
assert.equal(ANA_CP008_QLS.length, 28);
assert.equal(new Set(ANA_CP008_QLS.map((entry) => entry.qlId)).size, 28);
assert.equal(new Set(ANA_CP008_QLS.map((entry) => entry.prototypeId)).size, 14);
assert.equal(
  ANA_CP008_QLS.filter((entry) => entry.presentationMode === "DIRECT_COMPLETION").length,
  14,
);
assert.equal(
  ANA_CP008_QLS.filter((entry) => entry.presentationMode === "ODD_PAIR_SELECTION").length,
  14,
);

const contextCount = ANA_CP008_ENGLISH_PROTOTYPES.reduce(
  (total, prototype) => total + anaCp008ContextsForPrototype(prototype.prototypeId).length,
  0,
);
assert.equal(contextCount, 81, "The frozen 14 templates must expose all 81 admitted contexts.");

const answerPositions = [0, 0, 0, 0];
let generatedCount = 0;
let directCount = 0;
let oddCount = 0;

for (const ql of ANA_CP008_QLS) {
  const contexts = anaCp008ContextsForPrototype(ql.prototypeId);
  assert.ok(contexts.length > 0, `${ql.qlId} has no admitted context.`);

  for (const seed of [0, 1]) {
    const generated = generateMixedAnalogy(ql.qlId, seed);
    const repeated = generateMixedAnalogy(ql.qlId, seed);
    assert.deepEqual(repeated, generated, `${ql.qlId} seed ${seed} is not deterministic.`);
    generatedCount += 1;

    assert.equal(generated.checkpointId, "ANA-CP-008");
    assert.equal(generated.qlId, ql.qlId);
    assert.equal(generated.prototypeId, ql.prototypeId);
    assert.equal(generated.ruleId, ql.ruleId);
    assert.equal(generated.presentationMode, ql.presentationMode);
    assert.equal(generated.metadata.runtimeVersion, "ana-cp-008-v1");
    assert.equal(generated.metadata.maturity, "RUNTIME_PROOF");
    assert.equal(generated.metadata.publiclyPublishable, false);
    assert.equal(generated.metadata.ambiguityAccepted, true);
    assert.equal(generated.options.length, 4);
    assert.ok(generated.correctIndex >= 0 && generated.correctIndex < 4);
    answerPositions[generated.correctIndex] += 1;

    const rule = provisionalMixedRuleById(generated.ruleId);
    assert.ok(
      contexts.some((context) =>
        provisionalMixedContextKey(context) === generated.contextKey),
      `${ql.qlId} generated a context outside its template family.`,
    );

    if (generated.presentationMode === "DIRECT_COMPLETION") {
      directCount += 1;
      assert.equal(new Set(generated.options.map((option) => mixedTokenKey(option.value))).size, 4);
      assert.equal(generated.options[generated.correctIndex].errorLabel, "CORRECT");
      assert.ok(sameMixedToken(generated.options[generated.correctIndex].value, generated.target.output));
      assert.ok(
        verifyProvisionalMixedTransfer(generated.ruleId, generated.context, [
          generated.source,
          generated.target,
        ]),
      );
      const matches = matchingProvisionalMixedRules([
        generated.source,
        generated.target,
      ]).filter((match) => match.priority <= rule.priority);
      assert.equal(matches.length, 1);
      assert.equal(matches[0].ruleId, generated.ruleId);
      assert.equal(matches[0].contextKey, generated.contextKey);
      assert.ok(generated.explanation.sourceDemonstration.length >= 20);
      assert.ok(generated.explanation.targetApplication.length >= 20);
      assert.ok(generated.explanation.closestTrapRejection.length >= 20);
    } else {
      oddCount += 1;
      assert.equal(new Set(generated.options.map(mixedEvidenceKey)).size, 4);
      assert.equal(
        generated.options.filter((option) =>
          followsIntendedRule(rule, generated.context, option)).length,
        3,
      );
      assert.equal(
        mixedEvidenceKey(generated.options[generated.correctIndex]),
        mixedEvidenceKey(generated.oddPair),
      );
      assert.ok(!followsIntendedRule(rule, generated.context, generated.oddPair));
      assert.ok(sameMixedToken(
        rule.apply(generated.oddPair.input, generated.context),
        generated.expectedOddOutput,
      ));
      assert.equal(generated.explanation.validPairDemonstrations.length, 3);
      assert.ok(generated.explanation.oddPairRejection.length >= 20);
    }
  }
}

assert.equal(generatedCount, 56);
assert.equal(directCount, 28);
assert.equal(oddCount, 28);
assert.ok(answerPositions.every((count) => count > 0), `Unbalanced answer positions: ${answerPositions.join(",")}`);

console.log("ANA-CP-008 English runtime audit passed.", {
  qls: ANA_CP008_QLS.length,
  templateFamilies: ANA_CP008_ENGLISH_PROTOTYPES.length,
  admittedContexts: contextCount,
  generatedQuestions: generatedCount,
  directQuestions: directCount,
  oddPairQuestions: oddCount,
  answerPositions,
});
