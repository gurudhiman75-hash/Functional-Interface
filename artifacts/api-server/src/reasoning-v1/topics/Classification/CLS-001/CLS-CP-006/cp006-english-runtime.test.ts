import assert from "node:assert/strict";
import { independentlyVerifyClsCp006Question } from "./audit";
import {
  CLS_CP006_ENGLISH_CONTRACTS,
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_PAIR_SOLVE_CONTRACT_ID,
  CLS_CP006_ODD_LETTER_PAIR_SOURCES,
  CLS_CP006_ODD_LETTER_QL_ID,
  CLS_CP006_ODD_LETTER_SOLVE_CONTRACT_ID,
  CLS_CP006_ODD_LETTER_SOURCES,
  type ClsCp006EnglishQlId,
} from "./cp006-english-contracts";
import { generateClsCp006EnglishQuestion } from "./cp006-english-runtime";
import { auditClsCp006PresentationQuality } from "./quality-runtime";

assert.equal(CLS_CP006_ENGLISH_CONTRACTS.length, 2);
assert.equal(CLS_CP006_ODD_LETTER_QL_ID, "CLS-QL-010");
assert.equal(CLS_CP006_ODD_LETTER_PAIR_QL_ID, "CLS-QL-011");
assert.equal(
  CLS_CP006_ODD_LETTER_SOLVE_CONTRACT_ID,
  "CP006-FIND-ODD-SINGLE-LETTER",
);
assert.equal(
  CLS_CP006_ODD_LETTER_PAIR_SOLVE_CONTRACT_ID,
  "CP006-FIND-ODD-ORDERED-LETTER-PAIR",
);
assert.equal(CLS_CP006_ODD_LETTER_SOURCES.length, 3);
assert.equal(CLS_CP006_ODD_LETTER_PAIR_SOURCES.length, 5);

const EXPECTED_LETTER_RULES = new Set([
  "LETTER_VOWEL_CONSONANT_CLASS",
  "LETTER_POSITION_PARITY",
  "LETTER_ALPHABET_HALF",
]);
const EXPECTED_PAIR_RULES = new Set([
  "PAIR_ABSOLUTE_POSITION_GAP",
  "PAIR_SIGNED_POSITION_GAP",
  "PAIR_POSITION_SUM",
  "PAIR_OPPOSITE_STATUS",
  "PAIR_VOWEL_CONSONANT_COMPOSITION",
]);

type AuditSummary = {
  fingerprints: Set<string>;
  explanationFingerprints: Set<string>;
  sourcePrototypeIds: Set<string>;
  ruleIds: Set<string>;
  optionCounts: Set<number>;
  difficulties: Set<string>;
  answerPositions: number[];
  multiRuleStates: number;
};

function emptySummary(): AuditSummary {
  return {
    fingerprints: new Set<string>(),
    explanationFingerprints: new Set<string>(),
    sourcePrototypeIds: new Set<string>(),
    ruleIds: new Set<string>(),
    optionCounts: new Set<number>(),
    difficulties: new Set<string>(),
    answerPositions: [0, 0, 0, 0, 0],
    multiRuleStates: 0,
  };
}

function auditQl(qlId: ClsCp006EnglishQlId, generatedCount: number): AuditSummary {
  const summary = emptySummary();

  for (let seed = 0; seed < generatedCount; seed += 1) {
    const question = generateClsCp006EnglishQuestion(qlId, seed);
    if (seed % 31 === 0) {
      assert.deepEqual(question, generateClsCp006EnglishQuestion(qlId, seed));
    }

    assert.equal(question.qlId, qlId);
    assert.equal(question.permanentQlId, qlId);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.ok(question.options.length === 4 || question.options.length === 5);
    assert.equal(question.ambiguityAudit.result, "UNIQUE");
    assert.equal(question.ambiguityAudit.answerIndex, question.correctIndex);
    assert.equal(question.ambiguityAudit.intendedRuleSupported, true);

    const independent = independentlyVerifyClsCp006Question(question);
    assert.equal(independent.result, "UNIQUE");
    assert.equal(independent.answerIndex, question.correctIndex);
    assert.equal(independent.intendedRuleSupported, true);
    assert.ok(
      independent.candidateSupports.every(
        (support) => support.answerIndex === question.correctIndex,
      ),
    );

    const presentation = auditClsCp006PresentationQuality(question);
    assert.equal(
      presentation.result,
      "PASS",
      `${qlId}/${seed}: ${presentation.reasons.join("; ")}`,
    );

    assert.equal(question.metadata.runtimeVersion, "cls-cp006-english-runtime-v1");
    assert.equal(question.metadata.completeRuleCount, 8);
    assert.equal(
      question.metadata.sourceSaturationStatus,
      "ENGLISH_SOURCE_SATURATED__NO_MEANINGFUL_GAP",
    );
    assert.equal(question.metadata.permanentBoundaryStatus, "TWO_CONTRACTS_FROZEN");
    assert.equal(question.metadata.rejectedAmbiguousSourceStates, 1);
    assert.equal(question.metadata.controlledSourceRemediations, 1);
    assert.equal(question.lifecycle.permanentQlId, qlId);
    assert.equal(question.lifecycle.reviewStatus, "FROZEN_ENGLISH_RUNTIME_PROOF");
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.questionStudioVisible, false);
    assert.equal(question.reviewOnly, true);

    if (qlId === CLS_CP006_ODD_LETTER_QL_ID) {
      assert.equal(question.task, "FIND_ODD_LETTER");
      assert.equal(question.optionKind, "LETTER");
      assert.equal(
        question.metadata.solveContractId,
        CLS_CP006_ODD_LETTER_SOLVE_CONTRACT_ID,
      );
      assert.ok(EXPECTED_LETTER_RULES.has(question.intendedRuleId));
      assert.ok(question.items.every((item) => item.kind === "LETTER"));
    } else {
      assert.equal(question.task, "FIND_ODD_LETTER_PAIR");
      assert.equal(question.optionKind, "LETTER_PAIR");
      assert.equal(
        question.metadata.solveContractId,
        CLS_CP006_ODD_LETTER_PAIR_SOLVE_CONTRACT_ID,
      );
      assert.ok(EXPECTED_PAIR_RULES.has(question.intendedRuleId));
      assert.ok(question.items.every((item) => item.kind === "LETTER_PAIR"));
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
    assert.doesNotMatch(
      learnerText,
      /(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/,
    );
    assert.doesNotMatch(learnerText, /CLS-|PROT-|LETTER_[A-Z_]+|PAIR_[A-Z_]+/i);
    assert.doesNotMatch(learnerText, /\b1 (?:positions|places)\b/);
    assert.doesNotMatch(
      question.stem,
      /what is the position|find the position|how many letters|move .* places|rearrange/i,
    );

    summary.fingerprints.add(JSON.stringify({
      stem: question.stem,
      options: question.options,
      answer: question.answer,
    }));
    summary.explanationFingerprints.add(JSON.stringify(question.explanation));
    summary.sourcePrototypeIds.add(question.metadata.sourcePrototypeId);
    summary.ruleIds.add(question.intendedRuleId);
    summary.optionCounts.add(question.options.length);
    summary.difficulties.add(question.difficulty);
    summary.answerPositions[question.correctIndex] += 1;
    if (question.ambiguityAudit.candidateSupports.length > 1) {
      summary.multiRuleStates += 1;
    }
  }

  return summary;
}

const letterSummary = auditQl(CLS_CP006_ODD_LETTER_QL_ID, 720);
const pairSummary = auditQl(CLS_CP006_ODD_LETTER_PAIR_QL_ID, 720);

assert.equal(letterSummary.sourcePrototypeIds.size, CLS_CP006_ODD_LETTER_SOURCES.length);
assert.equal(
  pairSummary.sourcePrototypeIds.size,
  CLS_CP006_ODD_LETTER_PAIR_SOURCES.length,
);
assert.deepEqual(letterSummary.ruleIds, EXPECTED_LETTER_RULES);
assert.deepEqual(pairSummary.ruleIds, EXPECTED_PAIR_RULES);
assert.deepEqual(letterSummary.optionCounts, new Set([4, 5]));
assert.deepEqual(pairSummary.optionCounts, new Set([4, 5]));
assert.ok(letterSummary.answerPositions.every((count) => count > 0));
assert.ok(pairSummary.answerPositions.every((count) => count > 0));
assert.ok(letterSummary.fingerprints.size >= 500);
assert.ok(pairSummary.fingerprints.size >= 650);
assert.ok(letterSummary.explanationFingerprints.size >= 500);
assert.ok(pairSummary.explanationFingerprints.size >= 650);
assert.deepEqual(
  new Set([...letterSummary.difficulties, ...pairSummary.difficulties]),
  new Set(["EASY", "MEDIUM", "HARD"]),
);
assert.ok(letterSummary.multiRuleStates > 0);
assert.ok(pairSummary.multiRuleStates > 0);

assert.throws(() => generateClsCp006EnglishQuestion("CLS-QL-999" as never, 0));
assert.throws(() => generateClsCp006EnglishQuestion(CLS_CP006_ODD_LETTER_QL_ID, -1));

console.log("CLS-CP-006 permanent English runtime and no-meaningful-gap audit passed.", {
  permanentQls: [CLS_CP006_ODD_LETTER_QL_ID, CLS_CP006_ODD_LETTER_PAIR_QL_ID],
  letterGenerated: 720,
  letterUnique: letterSummary.fingerprints.size,
  pairGenerated: 720,
  pairUnique: pairSummary.fingerprints.size,
  letterSources: letterSummary.sourcePrototypeIds.size,
  pairSources: pairSummary.sourcePrototypeIds.size,
  rules: letterSummary.ruleIds.size + pairSummary.ruleIds.size,
  optionCounts: [...new Set([...letterSummary.optionCounts, ...pairSummary.optionCounts])].sort(),
  difficulties: [...new Set([...letterSummary.difficulties, ...pairSummary.difficulties])].sort(),
  letterAnswerPositions: letterSummary.answerPositions,
  pairAnswerPositions: pairSummary.answerPositions,
  multiRuleStates: letterSummary.multiRuleStates + pairSummary.multiRuleStates,
});
