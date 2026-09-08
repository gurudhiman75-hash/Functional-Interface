import {
  deterministicPick,
  deterministicShuffle,
} from "./deterministic";
import { selectSemanticDistractors } from "./distractors";
import { validateKnowledgeFactEligibility } from "./eligibility";
import { assertKnowledgeQuestionValid } from "./question-validation";
import { assertComputerAwarenessEditorialText } from "./computer-awareness/computer-awareness-editorial-policy";
import type {
  KnowledgeFact,
  KnowledgeGeneratedQuestion,
  KnowledgeGenerationRequest,
  KnowledgeGenerationResult,
  KnowledgePackageDefinition,
  KnowledgeQlDefinition,
} from "./types";

function qlPoolForRequest(
  pkg: KnowledgePackageDefinition,
  canonicalProblemId: string | undefined,
) {
  if (!canonicalProblemId) return pkg.qls;

  const exactQl = pkg.qls.filter((ql) => ql.qlId === canonicalProblemId);
  if (exactQl.length > 0) return exactQl;

  const cpQls = pkg.qls.filter((ql) => ql.cpId === canonicalProblemId);
  if (cpQls.length > 0) return cpQls;

  throw new Error(
    `Knowledge package ${pkg.packageId} does not own ${canonicalProblemId}`,
  );
}

function eligibleFactsForQl(
  facts: readonly KnowledgeFact[],
  ql: KnowledgeQlDefinition,
  request: KnowledgeGenerationRequest,
) {
  return facts
    .filter((fact) => fact.cpId === ql.cpId)
    .filter((fact) => fact.relation === ql.relation)
    .filter((fact) =>
      ql.difficulty?.length
        ? ql.difficulty.includes(fact.difficulty)
        : true,
    )
    .filter((fact) =>
      request.difficulty ? fact.difficulty === request.difficulty : true,
    )
    .filter((fact) => (ql.acceptsFact ? ql.acceptsFact(fact) : true))
    .filter(
      (fact) =>
        validateKnowledgeFactEligibility(fact, { asOf: request.asOf }).eligible,
    )
    .sort((left, right) => left.factId.localeCompare(right.factId));
}

function questionFromQl(
  facts: readonly KnowledgeFact[],
  pkg: KnowledgePackageDefinition,
  ql: KnowledgeQlDefinition,
  request: KnowledgeGenerationRequest,
  itemIndex: number,
): KnowledgeGeneratedQuestion {
  const itemSeed = `${request.seed}:${pkg.packageId}:${ql.qlId}:${itemIndex}`;
  const eligibleFacts = eligibleFactsForQl(facts, ql, request);

  if (eligibleFacts.length === 0) {
    throw new Error(
      `No generation-eligible facts for ${pkg.packageId}/${ql.qlId} at ${request.asOf}`,
    );
  }

  const target = deterministicPick(eligibleFacts, `${itemSeed}:target`);
  const distractorCount = ql.distractorCount ?? 3;
  const distractors = selectSemanticDistractors(eligibleFacts, target, {
    count: distractorCount,
    seed: `${itemSeed}:distractors`,
    minScore: ql.minDistractorScore,
    acceptsFact: ql.acceptsFact,
  });

  const canonicalAnswer = ql.answerText(target, request.language).trim();
  if (!canonicalAnswer) {
    throw new Error(`Knowledge QL ${ql.qlId} produced an empty canonical answer`);
  }

  const optionRecords = [
    { answer: canonicalAnswer, correct: true },
    ...distractors.map((fact) => ({
      answer: ql.answerText(fact, request.language).trim(),
      correct: false,
    })),
  ];
  const shuffled = deterministicShuffle(optionRecords, `${itemSeed}:options`);
  const options = shuffled.map((entry) => entry.answer);
  const correctIndex = shuffled.findIndex((entry) => entry.correct);
  const stem = ql.renderStem(target, request.language).trim();
  const explanation = ql.renderExplanation(target, request.language).trim();

  assertKnowledgeQuestionValid({
    stem,
    explanation,
    options,
    correctIndex,
    canonicalAnswer,
  });
  if (pkg.packageId.startsWith("COM-")) {
    assertComputerAwarenessEditorialText({ stem, explanation });
  }

  return {
    questionId: `KNV1-${pkg.packageId}-${ql.qlId}-${target.factId}-${itemIndex}`,
    engineId: "knowledge-v1",
    packageId: pkg.packageId,
    cpId: ql.cpId,
    qlId: ql.qlId,
    qlName: ql.name,
    factId: target.factId,
    text: stem,
    stem,
    options,
    correctIndex,
    correct: correctIndex,
    canonicalAnswer,
    explanation,
    difficulty: target.difficulty,
    difficultyLabel: target.difficulty,
    language: request.language,
    seed: itemSeed,
    validation: {
      valid: true,
      eligibilityChecked: true,
      uniqueOptions: true,
      canonicalAnswerVerified: true,
    },
    sourceMetadata: {
      sourceId: target.source.sourceId,
      sourceType: target.source.sourceType,
      title: target.source.title,
      locator: target.source.locator,
      freshnessClass: target.freshness.class,
      validFrom: target.freshness.validFrom,
      validUntil: target.freshness.validUntil,
      lastVerifiedAt: target.freshness.lastVerifiedAt,
    },
  };
}

