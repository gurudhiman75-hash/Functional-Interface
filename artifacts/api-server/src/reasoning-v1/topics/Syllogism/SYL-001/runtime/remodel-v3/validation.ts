import type { GeneratedSylQuestionV3, SylRemodelV3ParitySignature, SylRemodelV3ValidationResult } from "./types";

const BANNED_GENERIC = /(?:the statements allow this relation, but they do not force it|this conclusion cannot be true|use statements? \d+(?: and \d+)? together\.?$)/i;
const BANNED_NATURALNESS = /(?:\bEvery\s+\S+s\s+is\s+a\s+\S+s\b|\bAt least one member is both a\b|\bStatements?\s+\d+(?:\s+and\s+\d+)*\s+block\b|और\s+[^।.]+\s+का कोई सदस्य साझा नहीं है|ਅਤੇ\s+[^।.]+\s+ਦਾ ਕੋਈ ਮੈਂਬਰ ਸਾਂਝਾ ਨਹੀਂ ਹੈ|[।]{2,}|\.{2,})/iu;

function countMatches(text: string, pattern: RegExp): number {
  return [...text.matchAll(pattern)].length;
}

export function validateSylQuestionV3(
  question: GeneratedSylQuestionV3,
): SylRemodelV3ValidationResult {
  const errors: string[] = [];
  const analyses = question.explanation.optionAnalysis;
  const optionSyncPassed = question.options.length === analyses.length
    && question.options.every((option, index) => {
      const analysis = analyses[index];
      return analysis
        && analysis.displayIndex === index + 1
        && analysis.optionId === option.optionId
        && analysis.optionText === option.text
        && analysis.semanticValue === option.semanticValue;
    })
    && question.options[question.correctIndex]?.isCorrect === true
    && question.explanation.correctOptionProof.displayIndex === question.correctIndex + 1
    && question.explanation.correctOptionProof.optionText === question.options[question.correctIndex]?.text
    && question.explanation.combinedDiagram.correctOptionDisplayIndex === question.correctIndex + 1
    && question.explanation.combinedDiagram.correctOptionText === question.options[question.correctIndex]?.text;
  if (!optionSyncPassed) errors.push("Visible option order, explanation order, answer index and diagram reference are not synchronized.");

  const proofEvidencePassed = analyses.every((analysis) => (
    analysis.studentReason.trim().length >= 45
    && analysis.premiseIdsUsed.length > 0
    && analysis.proofEvidence.decisivePremiseIds.length > 0
    && analysis.reasonCode === analysis.proofEvidence.reasonCode
    && !BANNED_GENERIC.test(analysis.studentReason.trim())
  )) && question.explanation.correctOptionProof.reasoningSteps.length > 0;
  if (!proofEvidencePassed) errors.push("At least one option lacks question-dependent structured proof evidence.");

  const learnerText = [
    ...question.explanation.statementMeanings.flatMap((meaning) => [meaning.normalizedMeaning, meaning.statement]),
    question.explanation.combinedRelation,
    ...analyses.flatMap((analysis) => [analysis.studentVerdict, analysis.studentReason]),
    ...question.explanation.correctOptionProof.reasoningSteps,
    question.explanation.correctOptionProof.studentProof,
    question.explanation.fastRule.naturalLanguage,
    question.explanation.finalAnswer,
  ].join(" ");
  const naturalnessMatch = learnerText.match(BANNED_NATURALNESS)?.[0] ?? null;
  if (naturalnessMatch !== null) {
    errors.push(`Learner-facing text contains a known agreement, premise-list or punctuation regression: ${JSON.stringify(naturalnessMatch)}.`);
  }

  const svg = question.explanation.combinedDiagram.svg;
  const diagramCountPassed = question.explanation.combinedDiagram.diagramCount === 1
    && countMatches(svg, /<svg\b/g) === 1
    && countMatches(svg, /<\/svg>/g) === 1
    && svg.includes('data-diagram-count="1"')
    && svg.includes('data-correct-option-only="true"');
  if (!diagramCountPassed) errors.push("The question does not contain exactly one correct-option-only SVG diagram.");

  const premiseIds = new Set(question.structuredPrompt.premises.map((premise) => premise.premiseId));
  const diagramPremiseIds = new Set(question.explanation.combinedDiagram.relevantPremiseIds);
  const diagramSemanticCoveragePassed = premiseIds.size === diagramPremiseIds.size
    && [...premiseIds].every((premiseId) => diagramPremiseIds.has(premiseId))
    && question.explanation.combinedDiagram.allRelevantPremisesIncluded
    && svg.includes('data-all-relevant-premises="true"')
    && svg.includes("data-integrated-premise-map=\"true\"")
    && question.explanation.combinedDiagram.titleId.includes(question.locale.toLowerCase())
    && question.explanation.combinedDiagram.titleId.includes(question.qlId.toLowerCase())
    && question.explanation.combinedDiagram.titleId.includes(`seed-${question.seed}`);
  if (!diagramSemanticCoveragePassed) errors.push("The combined diagram omits a relevant premise or lacks stable accessible identity.");

  const lifecyclePassed = question.humanReviewStatus === "REVISE"
    && question.lifecycle.questionStudioVisible === false
    && question.lifecycle.questionBankWritable === false
    && question.lifecycle.testEligible === false
    && question.lifecycle.publiclyPublishable === false
    && question.metadata.questionStudioVisible === false
    && question.metadata.questionBankWritable === false
    && question.metadata.testEligible === false
    && question.metadata.publiclyPublishable === false;
  if (!lifecyclePassed) errors.push("A V3 remediation lifecycle flag is incorrectly enabled.");

  const existencePolicyPassed = question.explanation.existencePolicy.id === "EXAM_NON_EMPTY_PREMISE_TERMS_V1"
    && question.explanation.existencePolicy.version === 1
    && question.explanation.existencePolicy.visibleToStudent
    && question.stem.includes(question.explanation.existencePolicy.studentDirection)
    && question.metadata.existencePolicyVisibleToStudent === true;
  if (!existencePolicyPassed) errors.push("The declared existence policy is not visible and synchronized.");

  if (new Set(question.options.map((option) => option.text)).size !== question.options.length) {
    errors.push("Visible option texts are not unique.");
  }
  if (question.options.filter((option) => option.isCorrect).length !== 1) {
    errors.push("The question does not have exactly one keyed option.");
  }
  if (question.explanation.statementMeanings.length !== question.statements.length) {
    errors.push("The statement-meaning section does not cover every visible statement.");
  }
  if (question.explanation.combinedDiagram.titleId === question.explanation.combinedDiagram.descriptionId) {
    errors.push("SVG title and description IDs must be distinct.");
  }
  if (!svg.includes(`aria-labelledby="${question.explanation.combinedDiagram.titleId} ${question.explanation.combinedDiagram.descriptionId}"`)) {
    errors.push("SVG accessibility references do not match the generated title and description IDs.");
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    optionSyncPassed,
    proofEvidencePassed,
    diagramCountPassed,
    diagramSemanticCoveragePassed,
    lifecyclePassed,
    existencePolicyPassed,
  });
}

export function paritySignature(question: GeneratedSylQuestionV3): SylRemodelV3ParitySignature {
  return Object.freeze({
    qlId: question.qlId,
    seed: question.seed,
    taskKind: question.metadata.taskKind,
    scenarioId: question.scenarioId,
    optionSemanticOrder: Object.freeze(question.options.map((option) => option.semanticValue)),
    correctIndex: question.correctIndex,
    optionLogicalStatuses: Object.freeze(question.explanation.optionAnalysis.map((analysis) => analysis.logicalStatus)),
    decisivePremiseIds: Object.freeze([...question.explanation.correctOptionProof.decisivePremiseIds].sort()),
    diagramMode: question.explanation.combinedDiagram.mode,
  });
}

export function hasPerfectPeriod(sequence: readonly number[], maxPeriod = 8): boolean {
  for (let period = 1; period <= Math.min(maxPeriod, Math.floor(sequence.length / 3)); period += 1) {
    let matches = true;
    for (let index = period; index < sequence.length; index += 1) {
      if (sequence[index] !== sequence[index % period]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
}

export function repeatedNgramRatio(
  sequence: readonly number[],
  size: number,
): number {
  if (sequence.length < size) return 0;
  const counts = new Map<string, number>();
  for (let index = 0; index <= sequence.length - size; index += 1) {
    const key = sequence.slice(index, index + size).join("-");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const repeated = [...counts.values()].filter((count) => count > 1).reduce((sum, count) => sum + count - 1, 0);
  return repeated / Math.max(1, sequence.length - size + 1);
}
