import assert from "node:assert/strict";
import {
  CLS_CP005_ENGLISH_CONTRACTS,
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_EQUIVALENT_TUPLE_SOLVE_CONTRACT_ID,
  CLS_CP005_EQUIVALENT_TUPLE_SOURCES,
  CLS_CP005_ODD_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_SOLVE_CONTRACT_ID,
  CLS_CP005_ODD_TUPLE_SOURCES,
} from "./cp005-english-contracts";
import { generateClsCp005EnglishQuestion } from "./cp005-english-runtime";
import {
  auditClsCp005QuestionAgainstExpandedRegistry,
  CLS_CP005_EXPANDED_RULE_COUNT,
} from "./source-gap-expanded-audit";
import { CLS_CP005_RULE_IDS } from "./relation-registry";
import { CLS_CP005_SOURCE_GAP_RULE_IDS } from "./source-gap-registry";
import { CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID } from "./wave2-digit-product-rule";

assert.equal(CLS_CP005_ENGLISH_CONTRACTS.length, 2);
assert.equal(CLS_CP005_ODD_TUPLE_QL_ID, "CLS-QL-008");
assert.equal(CLS_CP005_EQUIVALENT_TUPLE_QL_ID, "CLS-QL-009");
assert.equal(CLS_CP005_ODD_TUPLE_SOLVE_CONTRACT_ID, "CP005-FIND-ODD-NUMBER-TUPLE");
assert.equal(
  CLS_CP005_EQUIVALENT_TUPLE_SOLVE_CONTRACT_ID,
  "CP005-SELECT-EQUIVALENT-NUMBER-TUPLE",
);
assert.equal(CLS_CP005_ODD_TUPLE_SOURCES.length, 35);
assert.equal(CLS_CP005_EQUIVALENT_TUPLE_SOURCES.length, 6);
assert.equal(CLS_CP005_EXPANDED_RULE_COUNT, 35);

const EXPECTED_RULE_IDS = new Set<string>([
  ...CLS_CP005_RULE_IDS,
  ...CLS_CP005_SOURCE_GAP_RULE_IDS,
  CLS_CP005_WAVE2_DIGIT_PRODUCT_RULE_ID,
]);
assert.equal(EXPECTED_RULE_IDS.size, 35);

type AuditSummary = {
  fingerprints: Set<string>;
  sourcePrototypeIds: Set<string>;
  sourceFamilies: Set<string>;
  ruleIds: Set<string>;
  arities: Set<number>;
  optionCounts: Set<number>;
  difficulties: Set<string>;
  answerPositions: number[];
};

function emptySummary(): AuditSummary {
  return {
    fingerprints: new Set<string>(),
    sourcePrototypeIds: new Set<string>(),
    sourceFamilies: new Set<string>(),
    ruleIds: new Set<string>(),
    arities: new Set<number>(),
    optionCounts: new Set<number>(),
    difficulties: new Set<string>(),
    answerPositions: [0, 0, 0, 0, 0],
  };
}

function auditQl(
  qlId: typeof CLS_CP005_ODD_TUPLE_QL_ID | typeof CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  generatedCount: number,
): AuditSummary {
  const summary = emptySummary();

  for (let seed = 0; seed < generatedCount; seed += 1) {
    const question = generateClsCp005EnglishQuestion(qlId, seed);
    if (seed % 29 === 0) {
      assert.deepEqual(question, generateClsCp005EnglishQuestion(qlId, seed));
    }

    assert.equal(question.qlId, qlId);
    assert.equal(question.permanentQlId, qlId);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.ok(question.options.length === 4 || question.options.length === 5);
    assert.ok(question.arity === 2 || question.arity === 3 || question.arity === 4);
    assert.equal(question.expandedAmbiguityAudit.result, "EXPANDED_UNIQUE");
    assert.equal(question.expandedAmbiguityAudit.answerIndex, question.correctIndex);
    assert.equal(question.expandedAmbiguityAudit.intendedRuleSupported, true);
    assert.equal(question.metadata.completeRuleCount, 35);
    assert.equal(question.metadata.runtimeVersion, "cls-cp005-english-runtime-v1");
    assert.equal(
      question.metadata.sourceSaturationStatus,
      "ENGLISH_SOURCE_SATURATED__NO_MEANINGFUL_GAP",
    );
    assert.equal(question.metadata.permanentBoundaryStatus, "TWO_CONTRACTS_FROZEN");
    assert.equal(
      question.metadata.digitProductEquivalentAdmission,
      "ADMITTED_TO_REFERENCE_SET_CONTRACT",
    );
    assert.equal(question.lifecycle.reviewStatus, "FROZEN_ENGLISH_RUNTIME_PROOF");
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.reviewOnly, true);

    if (qlId === CLS_CP005_ODD_TUPLE_QL_ID) {
      assert.equal(question.task, "FIND_ODD_NUMBER_TUPLE");
      assert.equal(question.referenceTuple, null);
      assert.equal(question.metadata.solveContractId, CLS_CP005_ODD_TUPLE_SOLVE_CONTRACT_ID);
    } else {
      assert.equal(question.task, "SELECT_EQUIVALENT_NUMBER_SET");
      assert.notEqual(question.referenceTuple, null);
      assert.equal(
        question.metadata.solveContractId,
        CLS_CP005_EQUIVALENT_TUPLE_SOLVE_CONTRACT_ID,
      );
    }

    const independent = auditClsCp005QuestionAgainstExpandedRegistry({
      task: question.task,
      referenceTuple: question.referenceTuple,
      tuples: question.tuples,
      intendedRuleId: question.intendedRuleId,
      intendedRuleValue: question.intendedRuleValue,
    });
    assert.equal(independent.result, "EXPANDED_UNIQUE");
    assert.equal(independent.answerIndex, question.correctIndex);

    for (const evidence of question.evidenceByOption) {
      const mathStart = evidence.indexOf("\\(");
      assert.ok(mathStart > evidence.indexOf(": "));
      const prose = evidence.slice(evidence.indexOf(": ") + 2, mathStart).trim();
      assert.ok(prose.split(/\s+/).length >= 4, `Thin option explanation: ${evidence}`);
    }

    const learnerText = [
      question.stem,
      ...question.options,
      question.answer,
      ...question.evidenceByOption,
      ...question.explanation.coreConcept,
      ...question.explanation.stepByStep,
      ...question.explanation.examSpeedShortcut,
      ...question.explanation.commonTrapWarning,
    ].join("\n");
    assert.ok(!/(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/.test(learnerText));
    assert.ok(!/CLS-CP005|source-gap|prototype|registry version/i.test(learnerText));

    summary.fingerprints.add(JSON.stringify({
      stem: question.stem,
      reference: question.referenceTuple,
      tuples: question.tuples,
      answer: question.answer,
    }));
    summary.sourcePrototypeIds.add(question.metadata.sourcePrototypeId);
    summary.sourceFamilies.add(question.metadata.sourceFamily);
    summary.ruleIds.add(question.intendedRuleId);
    summary.arities.add(question.arity);
    summary.optionCounts.add(question.options.length);
    summary.difficulties.add(question.difficulty);
    summary.answerPositions[question.correctIndex] += 1;
  }

  return summary;
}

const oddSummary = auditQl(CLS_CP005_ODD_TUPLE_QL_ID, 420);
const equivalentSummary = auditQl(CLS_CP005_EQUIVALENT_TUPLE_QL_ID, 960);

assert.equal(oddSummary.sourcePrototypeIds.size, CLS_CP005_ODD_TUPLE_SOURCES.length);
assert.equal(
  equivalentSummary.sourcePrototypeIds.size,
  CLS_CP005_EQUIVALENT_TUPLE_SOURCES.length,
);
assert.deepEqual(oddSummary.ruleIds, EXPECTED_RULE_IDS);
assert.deepEqual(equivalentSummary.ruleIds, EXPECTED_RULE_IDS);
assert.deepEqual(oddSummary.arities, new Set([2, 3, 4]));
assert.deepEqual(equivalentSummary.arities, new Set([2, 3, 4]));
assert.deepEqual(oddSummary.optionCounts, new Set([4, 5]));
assert.deepEqual(equivalentSummary.optionCounts, new Set([4, 5]));
assert.deepEqual(oddSummary.difficulties, new Set(["EASY", "MEDIUM", "HARD"]));
assert.deepEqual(equivalentSummary.difficulties, new Set(["EASY", "MEDIUM", "HARD"]));
assert.ok(oddSummary.answerPositions.every((count) => count > 0));
assert.ok(equivalentSummary.answerPositions.every((count) => count > 0));
assert.ok(oddSummary.fingerprints.size >= 390);
assert.ok(equivalentSummary.fingerprints.size >= 850);
assert.deepEqual(
  new Set([...oddSummary.sourceFamilies, ...equivalentSummary.sourceFamilies]),
  new Set([
    "WAVE_1",
    "SOURCE_GAP_WAVE_2",
    "DIGIT_PRODUCT_ODD",
    "DIGIT_PRODUCT_EQUIVALENT",
  ]),
);

assert.throws(() => generateClsCp005EnglishQuestion("CLS-QL-999" as never, 0));
assert.throws(() => generateClsCp005EnglishQuestion(CLS_CP005_ODD_TUPLE_QL_ID, -1));

console.log("CLS-CP-005 permanent English runtime and no-meaningful-gap audit passed.", {
  permanentQls: [CLS_CP005_ODD_TUPLE_QL_ID, CLS_CP005_EQUIVALENT_TUPLE_QL_ID],
  oddGenerated: 420,
  oddUnique: oddSummary.fingerprints.size,
  equivalentGenerated: 960,
  equivalentUnique: equivalentSummary.fingerprints.size,
  rulesPerQl: EXPECTED_RULE_IDS.size,
  oddSources: oddSummary.sourcePrototypeIds.size,
  equivalentSources: equivalentSummary.sourcePrototypeIds.size,
  arities: [...oddSummary.arities].sort(),
  optionCounts: [...oddSummary.optionCounts].sort(),
});
