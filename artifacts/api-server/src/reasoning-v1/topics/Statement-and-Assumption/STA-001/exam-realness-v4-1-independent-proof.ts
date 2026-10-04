import type {
  StaV4CandidateAuthority,
  StaV4Classification,
  StaV4QueryPolarity,
  StaV4ScenarioAuthority,
} from "./exam-realness-v4-1-types.ts";

export const STA_001_V41_INDEPENDENT_PROOF_AUTHORITY =
  "STA-001-V4-1-CANDIDATE-ORDINAL-MISCONCEPTION-PROOF-2026-10-04" as const;

type CandidateProofSurface = Readonly<{
  candidateId: string;
  classification: StaV4Classification;
  misconception: string;
}>;

function candidateOrdinal(candidateId: string): number {
  const match = /-C([1-7])$/u.exec(candidateId);
  if (!match) throw new Error(`${candidateId}: invalid STA V4.1 candidate identity`);
  return Number(match[1]);
}

function classificationFromOrdinal(candidateId: string): StaV4Classification {
  return candidateOrdinal(candidateId) <= 3 ? "IMPLICIT" : "NOT_IMPLICIT";
}

function classificationFromMisconception(misconception: string): StaV4Classification {
  return misconception.startsWith("REQUIRED_") ? "IMPLICIT" : "NOT_IMPLICIT";
}

export function independentlyClassifyStaV41Candidate(
  candidate: CandidateProofSurface,
): StaV4Classification {
  const byOrdinal = classificationFromOrdinal(candidate.candidateId);
  const byTaxonomy = classificationFromMisconception(candidate.misconception);
  if (byOrdinal !== byTaxonomy) {
    throw new Error(
      `${candidate.candidateId}: candidate ordinal and misconception taxonomy disagree (${byOrdinal} vs ${byTaxonomy})`,
    );
  }
  if (candidate.classification !== byOrdinal) {
    throw new Error(
      `${candidate.candidateId}: authored classification ${candidate.classification} disagrees with independent ${byOrdinal} proof`,
    );
  }
  return byOrdinal;
}

export function assertStaV41ScenarioIndependentProof(
  scenario: StaV4ScenarioAuthority,
): void {
  if (scenario.candidates.length !== 7) {
    throw new Error(`${scenario.scenarioId}: expected seven frozen candidate authorities`);
  }
  const ids = new Set<string>();
  for (let index = 0; index < scenario.candidates.length; index += 1) {
    const candidate = scenario.candidates[index]!;
    const expectedId = `${scenario.scenarioId}-C${index + 1}`;
    if (candidate.candidateId !== expectedId) {
      throw new Error(
        `${scenario.scenarioId}: candidate identity drift at position ${index + 1}; expected ${expectedId}, got ${candidate.candidateId}`,
      );
    }
    if (ids.has(candidate.candidateId)) {
      throw new Error(`${scenario.scenarioId}: duplicate candidate identity ${candidate.candidateId}`);
    }
    ids.add(candidate.candidateId);
    independentlyClassifyStaV41Candidate(candidate);
  }
}

export function independentlyDeriveStaV41AnswerSet(
  candidates: readonly CandidateProofSurface[],
  polarity: StaV4QueryPolarity,
): readonly number[] {
  const wanted: StaV4Classification =
    polarity === "NEGATIVE" ? "NOT_IMPLICIT" : "IMPLICIT";
  return Object.freeze(
    candidates.flatMap((candidate, index) =>
      independentlyClassifyStaV41Candidate(candidate) === wanted ? [index] : [],
    ),
  );
}

export function assertStaV41RenderedQuestionIndependentProof(question: Readonly<{
  questionId: string;
  queryPolarity: StaV4QueryPolarity;
  candidates: readonly CandidateProofSurface[];
  answerSet: readonly number[];
  options: readonly unknown[];
  correctIndex?: number;
  answerIndex?: number;
}>): void {
  const independentAnswerSet = independentlyDeriveStaV41AnswerSet(
    question.candidates,
    question.queryPolarity,
  );
  if (
    independentAnswerSet.length !== question.answerSet.length
    || independentAnswerSet.some((value, index) => value !== question.answerSet[index])
  ) {
    throw new Error(
      `${question.questionId}: runtime answer set [${question.answerSet.join(",")}] disagrees with independent proof [${independentAnswerSet.join(",")}]`,
    );
  }

  const correctIndex = question.correctIndex ?? question.answerIndex;
  if (correctIndex === undefined || correctIndex < 0 || correctIndex >= question.options.length) {
    throw new Error(`${question.questionId}: independent proof found invalid correct-option index`);
  }

  const structuredOptions = question.options.filter(
    (option): option is Readonly<{ semanticAnswerSet: readonly number[]; isCorrect: boolean }> =>
      typeof option === "object"
      && option !== null
      && "semanticAnswerSet" in option
      && "isCorrect" in option,
  );
  if (structuredOptions.length === question.options.length) {
    const independentlyCorrect = structuredOptions.filter((option) =>
      option.semanticAnswerSet.length === independentAnswerSet.length
      && option.semanticAnswerSet.every((value, index) => value === independentAnswerSet[index]),
    );
    if (independentlyCorrect.length !== 1) {
      throw new Error(`${question.questionId}: independent proof expected exactly one semantic correct option`);
    }
    if (structuredOptions[correctIndex] !== independentlyCorrect[0]) {
      throw new Error(`${question.questionId}: runtime correct index disagrees with independent option semantics`);
    }
    if (
      structuredOptions.filter((option) => option.isCorrect).length !== 1
      || structuredOptions[correctIndex]!.isCorrect !== true
    ) {
      throw new Error(`${question.questionId}: runtime isCorrect flags disagree with independent proof`);
    }
  }
}
