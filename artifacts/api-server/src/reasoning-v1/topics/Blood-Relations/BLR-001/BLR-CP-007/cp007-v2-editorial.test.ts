import assert from "node:assert/strict";
import type { BlrCp007V2Question } from "./cp007-v2-model";
import { generateBlrCp007V2Bank } from "./cp007-v2-runtime";

function wordCount(value: string): number {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function visibleExplanation(question: BlrCp007V2Question): string {
  return [
    ...question.explanation.steps,
    question.explanation.conclusion,
    question.explanation.shortcut ?? "",
    ...question.explanation.optionAnalysis.map((entry) => entry.explanation),
  ].join(" ");
}

const bank = generateBlrCp007V2Bank();
assert.equal(bank.length, 168);

for (const question of bank) {
  const visible = visibleExplanation(question);
  assert.ok(wordCount(visible) <= 300, `${question.itemId}: explanation exceeds 300 words`);
  assert.doesNotMatch(
    question.explanation.conclusion,
    /only option that completes the required coded relation/iu,
    `${question.itemId}: generic conclusion survived manual review`,
  );
  assert.ok(
    question.explanation.optionAnalysis.every(
      (analysis) => !analysis.explanation.startsWith("Wrong generation:"),
    ),
    `${question.itemId}: broad wrong-generation label survived`,
  );

  if (question.explanation.mode === "DIRECT_LOOKUP_MINIMAL") {
    assert.equal(
      question.explanation.steps.length,
      1,
      `${question.itemId}: direct lookup repeats its conclusion`,
    );
  }

  if (question.query.kind === "MISSING_PERSON") {
    assert.ok(
      question.explanation.steps.length <= 4,
      `${question.itemId}: missing-person solution includes irrelevant branches`,
    );
    assert.match(question.explanation.conclusion, /must replace \?/iu);
    for (const analysis of question.explanation.optionAnalysis) {
      assert.match(
        analysis.explanation,
        /makes .* the .* of .*|completes the decisive family chain/iu,
        `${question.itemId}: missing-person option lacks a concrete relation`,
      );
    }
  }

  if (question.query.kind === "MISSING_TOKEN") {
    assert.match(question.explanation.steps[0]!, /missing statement must be/iu);
    assert.match(question.explanation.conclusion, /missing code is/iu);
  }

  if (question.query.kind === "MISSING_TOKEN_PAIR") {
    assert.match(question.explanation.conclusion, /in that order/iu);
    for (const analysis of question.explanation.optionAnalysis) {
      if (analysis.isCorrect) {
        assert.match(analysis.explanation, /together, these links make/iu);
      } else {
        assert.match(analysis.explanation, /completed chain gives/iu);
      }
    }
  }

  if (question.query.kind === "SELECT_EXPRESSION") {
    assert.match(
      question.explanation.conclusion,
      /correctly represents the required relation/iu,
    );
    for (const analysis of question.explanation.optionAnalysis) {
      assert.ok(
        analysis.explanation.includes("Correct:") ||
          analysis.explanation.includes("Not correct:"),
        `${question.itemId}: expression analysis lacks clear verdict`,
      );
    }
  }
}

const genderUnsupported = bank.flatMap((question) =>
  question.explanation.optionAnalysis.filter((analysis) =>
    /gender is not given/iu.test(analysis.explanation),
  ),
);
assert.equal(
  genderUnsupported.length,
  8,
  "Expected eight reverse-sibling claims where gender is not established.",
);

const missingPersonQuestions = bank.filter(
  (question) => question.query.kind === "MISSING_PERSON",
);
assert.equal(missingPersonQuestions.length, 32);
assert.ok(
  missingPersonQuestions.every((question) => question.explanation.steps.length <= 4),
);

console.log(
  JSON.stringify(
    {
      status: "CP007_V2_FULL_MANUAL_EDITORIAL_GATES_PASSED",
      questionsReviewed: bank.length,
      genericConclusions: 0,
      directLookupRepetitionDefects: 0,
      broadWrongGenerationLabels: 0,
      genderUnsupportedClaimsExplained: genderUnsupported.length,
      missingPersonQuestionsFocused: missingPersonQuestions.length,
      explanationWordLimit: 300,
    },
    null,
    2,
  ),
);
