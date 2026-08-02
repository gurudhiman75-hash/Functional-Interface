import {
  generateRnkCp002SourceQuestion,
  type RnkCp002SourceQuestion,
  type RnkCp002SourceWavePrototypeId,
} from './cp002-source-wave';

function normalizeLearnerText(text: string): string {
  return text
    .replace(/\b1 positions\b/g, 'one position')
    .replace(/\b1 people\b/g, 'one person')
    .replace(/\b1 candidates\b/g, 'one candidate')
    .replace(/\b0 people\b/g, 'no people')
    .replace(/\b0 candidates\b/g, 'no candidates')
    .replace(/\bThere are one\b/g, 'There is one')
    .replace(/\bthere are one\b/g, 'there is one')
    .replace(/\s+/g, ' ')
    .trim();
}

export function generateReviewedRnkCp002SourceQuestion(
  prototypeId: RnkCp002SourceWavePrototypeId,
  seed: number,
): RnkCp002SourceQuestion {
  const raw = generateRnkCp002SourceQuestion(prototypeId, seed);
  return {
    ...raw,
    stem: normalizeLearnerText(raw.stem),
    options: raw.options.map((item) => ({
      ...item,
      explanation: normalizeLearnerText(item.explanation),
    })),
    explanation: {
      keyRule: normalizeLearnerText(raw.explanation.keyRule),
      stepByStepSolution: raw.explanation.stepByStepSolution.map(normalizeLearnerText),
      examSpeedShortcut: normalizeLearnerText(raw.explanation.examSpeedShortcut),
      optionAnalysis: raw.explanation.optionAnalysis.map(normalizeLearnerText),
      conclusion: normalizeLearnerText(raw.explanation.conclusion),
    },
  };
}

export function reviewProjectionWithoutLearnerText(question: RnkCp002SourceQuestion): unknown {
  return {
    packageId: question.packageId,
    checkpointId: question.checkpointId,
    prototypeId: question.prototypeId,
    permanentQlId: question.permanentQlId,
    seed: question.seed,
    locale: question.locale,
    contextId: question.contextId,
    firstName: question.firstName,
    secondName: question.secondName,
    displayedEvidence: question.displayedEvidence,
    answerSemantic: question.answerSemantic,
    answer: question.answer,
    optionValues: question.options.map((item) => item.value),
    optionMisconceptionIds: question.options.map((item) => item.misconceptionId),
    correctIndex: question.correctIndex,
    difficulty: question.difficulty,
    normalizedState: question.normalizedState,
    mathematicalFingerprint: question.mathematicalFingerprint,
    lifecycle: question.lifecycle,
  };
}
