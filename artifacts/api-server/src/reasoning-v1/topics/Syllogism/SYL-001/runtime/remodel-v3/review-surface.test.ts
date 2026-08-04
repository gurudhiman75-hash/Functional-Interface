import assert from "node:assert/strict";
import { SYL_QL_REGISTRY } from "../ql-registry";
import {
  buildSylV3ReviewSelection,
  SYL_V3_REVIEW_LOCALES,
  SYL_V3_REVIEW_TARGET_PER_QL,
} from "./review-selection";
import { validateSylQuestionV3 } from "./validation";

const selection = buildSylV3ReviewSelection();
const questions = selection.questions;
const expectedLogicalPayloads = SYL_QL_REGISTRY.length * SYL_V3_REVIEW_TARGET_PER_QL;
const expectedLocalizedRecords = expectedLogicalPayloads * SYL_V3_REVIEW_LOCALES.length;
const internalCode = /\b(?:MASK_\d+|ONLY_(?:FIRST|SECOND)_FOLLOWS|BOTH_FOLLOW|NEITHER_FOLLOWS|EITHER_OR_FOLLOWS|NO_COMPLEMENTARY_RELATION|DEFINITELY_TRUE|POSSIBLY_TRUE_NOT_DEFINITE|PREMISES_INCONSISTENT|CORRECT_FOR_TASK|WRONG_FOR_TASK|ENTAILED|CONTRADICTED|UNDETERMINED)\b/u;
const genericFallback = /(?:the statements allow this relation, but they do not force it|this conclusion cannot be true|use statements? \d+(?: and \d+)? together)/iu;

assert.equal(selection.uniqueLogicalPayloadCount, expectedLogicalPayloads);
assert.equal(questions.length, expectedLocalizedRecords);
assert.equal(new Set(questions.map((question) => question.contentIdentity)).size, expectedLogicalPayloads);
assert.equal(new Set(questions.map((question) => question.questionLanguageId)).size, expectedLocalizedRecords);

const logicalCountByQl = new Map<string, Set<string>>();
const localeCount = new Map<string, number>();
for (const question of questions) {
  const validation = validateSylQuestionV3(question);
  assert.equal(validation.ok, true, `${question.questionLanguageId}: ${validation.errors.join("; ")}`);
  const identities = logicalCountByQl.get(question.qlId) ?? new Set<string>();
  identities.add(question.contentIdentity);
  logicalCountByQl.set(question.qlId, identities);
  localeCount.set(question.locale, (localeCount.get(question.locale) ?? 0) + 1);

  const learnerText = [
    question.stem,
    ...question.statements,
    ...question.conclusions,
    ...question.options.map((option) => option.text),
    question.explanation.existencePolicy.studentDirection,
    ...question.explanation.statementMeanings.flatMap((meaning) => [meaning.statement, meaning.normalizedMeaning]),
    question.explanation.combinedRelation,
    ...question.explanation.optionAnalysis.flatMap((analysis) => [analysis.studentVerdict, analysis.studentReason]),
    ...question.explanation.correctOptionProof.reasoningSteps,
    question.explanation.correctOptionProof.studentProof,
    question.explanation.fastRule.naturalLanguage,
    question.explanation.finalAnswer,
  ].join(" ");
  assert.doesNotMatch(learnerText, internalCode);
  assert.doesNotMatch(learnerText, genericFallback);
  assert.doesNotMatch(learnerText, /\.{2,}|।{2,}/u);

  const normalizedProofSteps = question.explanation.correctOptionProof.reasoningSteps.map((step) =>
    step.toLowerCase().replace(/[।.!?;:]+$/u, "").replace(/\s+/g, " ").trim(),
  );
  assert.equal(
    new Set(normalizedProofSteps).size,
    normalizedProofSteps.length,
    `${question.questionLanguageId} repeats a visible correct-proof step.`,
  );
  assert.equal(question.explanation.optionAnalysis.length, question.options.length);
  assert.equal(question.explanation.combinedDiagram.diagramCount, 1);
  assert.equal(question.humanReviewStatus, "REVISE");
}

for (const definition of SYL_QL_REGISTRY) {
  assert.equal(logicalCountByQl.get(definition.qlId)?.size, SYL_V3_REVIEW_TARGET_PER_QL);
  assert.equal(selection.selectedSeedsByQl[definition.qlId].length, SYL_V3_REVIEW_TARGET_PER_QL);
}
for (const locale of SYL_V3_REVIEW_LOCALES) {
  assert.equal(localeCount.get(locale), expectedLogicalPayloads);
}

console.log(JSON.stringify({
  status: "PASS_SYL_001_REMODEL_V3_REVIEW_SURFACE",
  localizedRecords: questions.length,
  uniqueLogicalPayloads: selection.uniqueLogicalPayloadCount,
  logicalPayloadsPerQl: SYL_V3_REVIEW_TARGET_PER_QL,
  qlCount: SYL_QL_REGISTRY.length,
  locales: SYL_V3_REVIEW_LOCALES,
  validationFailures: 0,
  internalCodeLeaks: 0,
  duplicateLogicalPayloads: 0,
  repeatedCorrectProofSteps: 0,
  humanReviewStatus: "REVISE",
}, null, 2));
