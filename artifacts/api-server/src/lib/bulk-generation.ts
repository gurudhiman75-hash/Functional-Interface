import {
  generateFromPattern,
  inferGenerationDomain,
  type DifficultyLabel,
  type GeneratedQuestion,
  type GeneratorOptions,
  type Pattern,
} from "./core/generator-engine";
import type {
  DifficultyMetrics,
  ValidationReport,
} from "./core/domain-adapters";
import type {
  Scenario,
} from "./core/domain-adapters";
import type {
  ExtractedPatternIntelligence,
} from "./core/pattern-extractors";
import type {
  StructuralSignature,
} from "./core/structural-signatures";
import type {
  QualityAssessment,
  QualityThresholds,
} from "./core/quality-filter";
import {
  analyzeStructuralDuplicate,
} from "./core/structural-signatures";

export type BatchFilterOptions = {
  domain?: string | string[];
  topic?: string;
  difficulty?: DifficultyLabel;
  motif?: string;
  examProfile?: GeneratorOptions["examProfile"];
};

export type GeneratedBatchQuestion = {
  patternId: string;
  domain: string;
  topic: string;
  difficulty: string;
  motif?: string;
  examProfile?: GeneratorOptions["examProfile"];
  realismScore?: number;
  validationReport?: ValidationReport;
  difficultyAssessment?: DifficultyMetrics;
  qualityAssessment?: QualityAssessment;
  structuralSignature: string;
  structuralSignatureDetail?: StructuralSignature;
  proceduralScenario?: Scenario;
  extractedPatternIntelligence?: ExtractedPatternIntelligence;
  question: GeneratedQuestion;
};

export type RejectedGeneratedQuestion = {
  patternId: string;
  domain: string;
  topic: string;
  reason: string;
  detail?: string;
};

export type GeneratedQuestionBatchMetrics = {
  requested: number;
  accepted: number;
  rejected: number;
  attempted: number;
  averageRealismScore: number;
  byDomain: Record<string, number>;
  byDifficulty: Record<string, number>;
};

export type GeneratedQuestionBatch = {
  questions: GeneratedBatchQuestion[];
  metrics: GeneratedQuestionBatchMetrics;
  rejected: RejectedGeneratedQuestion[];
};

export type BulkGenerationRequest = {
  batchSize: number;
  filters?: BatchFilterOptions;
  options?: GeneratorOptions;
  maxAttempts?: number;
  qualityThresholds?: Partial<QualityThresholds>;
};

function getPrimaryQuestion(
  question: GeneratedQuestion,
) {
  return "questionType" in question &&
    question.questionType === "di"
    ? question.questions[0]
    : question;
}

function normalizeListFilter(
  value?: string | string[],
) {
  if (!value) {
    return [];
  }

  return Array.isArray(value)
    ? value
    : [value];
}

function matchesTopic(
  pattern: Pattern,
  topic?: string,
) {
  if (!topic) {
    return true;
  }

  const normalizedNeedle =
    topic.toLowerCase().trim();
  const haystack = `${pattern.topic} ${pattern.subtopic}`.toLowerCase();

  return haystack.includes(
    normalizedNeedle,
  );
}

function matchesPatternFilters(
  pattern: Pattern,
  filters?: BatchFilterOptions,
) {
  const domains =
    normalizeListFilter(
      filters?.domain,
    );
  const patternDomain =
    inferGenerationDomain(pattern);

  if (
    domains.length &&
    !domains.includes(patternDomain)
  ) {
    return false;
  }

  if (
    filters?.difficulty &&
    pattern.difficulty &&
    pattern.difficulty !==
      filters.difficulty
  ) {
    return false;
  }

  if (
    filters?.motif &&
    Array.isArray(pattern.supportedMotifs) &&
    pattern.supportedMotifs.length &&
    !pattern.supportedMotifs.includes(
      filters.motif,
    )
  ) {
    return false;
  }

  return matchesTopic(
    pattern,
    filters?.topic,
  );
}

function buildStructuralSignature(
  extracted?: ExtractedPatternIntelligence,
  proceduralScenario?: Scenario,
  structuralSignature?: StructuralSignature,
) {
  if (structuralSignature) {
    return [
      structuralSignature.domain,
      structuralSignature.topologyHash,
      structuralSignature.inferenceHash,
      structuralSignature.motifHash,
      structuralSignature.distractorHash,
    ].join("|");
  }

  if (extracted) {
    return [
      extracted.domain,
      extracted.structure.subtype,
      ...extracted.structure.structureTokens,
    ].join("|");
  }

  if (proceduralScenario) {
    return [
      proceduralScenario.domain,
      proceduralScenario.subtype,
      `entities:${proceduralScenario.entities.length}`,
      `constraints:${proceduralScenario.constraints.length}`,
    ].join("|");
  }

  return "unknown";
}

function getRealismScore(
  question: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);

  return (
    primaryQuestion
      ?.examRealismMetadata
      ?.realismScore ??
    primaryQuestion
      ?.generationMetrics
      ?.realismScore
  );
}

function matchesGeneratedFilters(
  question: GeneratedQuestion,
  filters?: BatchFilterOptions,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const selectedMotif =
    primaryQuestion?.debugMetadata
      ?.selectedMotif;
  const questionDifficulty =
    primaryQuestion?.difficultyLabel;
  const questionTopic = `${primaryQuestion?.topic ?? ""} ${primaryQuestion?.subtopic ?? ""} ${primaryQuestion?.text ?? ""}`.toLowerCase();
  const domains =
    normalizeListFilter(
      filters?.domain,
    );
  const questionDomain =
    primaryQuestion?.debugMetadata
      ?.generationDomain;

  if (
    domains.length &&
    questionDomain &&
    !domains.includes(questionDomain)
  ) {
    return {
      ok: false,
      reason: "domain-mismatch",
    };
  }

  if (
    filters?.difficulty &&
    questionDifficulty &&
    questionDifficulty !==
      filters.difficulty
  ) {
    return {
      ok: false,
      reason: "difficulty-mismatch",
    };
  }

  if (
    filters?.motif &&
    selectedMotif !==
      filters.motif
  ) {
    return {
      ok: false,
      reason: "motif-mismatch",
    };
  }

  if (
    filters?.topic &&
    !questionTopic.includes(
      filters.topic.toLowerCase().trim(),
    )
  ) {
    return {
      ok: false,
      reason: "topic-mismatch",
    };
  }

  return {
    ok: true,
  };
}

function buildBatchQuestion(
  pattern: Pattern,
  question: GeneratedQuestion,
  examProfile?: GeneratorOptions["examProfile"],
) : GeneratedBatchQuestion {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const proceduralScenario =
    primaryQuestion?.debugMetadata
      ?.proceduralScenario;
  const extractedPatternIntelligence =
    primaryQuestion?.debugMetadata
      ?.extractedPatternIntelligence;
  const structuralSignatureDetail =
    primaryQuestion?.debugMetadata
      ?.structuralSignature;

  return {
    patternId: pattern.id,
    domain:
      primaryQuestion?.debugMetadata
        ?.generationDomain ??
      inferGenerationDomain(pattern),
    topic: pattern.topic,
    difficulty:
      primaryQuestion?.difficultyLabel ??
      pattern.difficulty ??
      "Unknown",
    motif:
      primaryQuestion?.debugMetadata
        ?.selectedMotif,
    examProfile,
    realismScore:
      getRealismScore(question),
    validationReport:
      primaryQuestion?.debugMetadata
        ?.validationReportDetail,
    difficultyAssessment:
      primaryQuestion?.debugMetadata
        ?.difficultyAssessment,
    qualityAssessment:
      primaryQuestion?.debugMetadata
        ?.qualityAssessment,
    structuralSignature:
      buildStructuralSignature(
        extractedPatternIntelligence,
        proceduralScenario,
        structuralSignatureDetail,
      ),
    structuralSignatureDetail,
    proceduralScenario,
    extractedPatternIntelligence,
    question,
  };
}

function summarizeBatchMetrics(
  questions: GeneratedBatchQuestion[],
  rejected: RejectedGeneratedQuestion[],
  requested: number,
  attempted: number,
) : GeneratedQuestionBatchMetrics {
  const realismScores =
    questions
      .map((entry) => entry.realismScore)
      .filter(
        (value): value is number =>
          typeof value === "number",
      );

  return {
    requested,
    accepted: questions.length,
    rejected: rejected.length,
    attempted,
    averageRealismScore:
      realismScores.length
        ? Number(
          (
            realismScores.reduce(
              (sum, value) =>
                sum + value,
              0,
            ) / realismScores.length
          ).toFixed(2),
        )
        : 0,
    byDomain: questions.reduce(
      (accumulator, entry) => {
        accumulator[entry.domain] =
          (accumulator[entry.domain] ??
            0) + 1;
        return accumulator;
      },
      {} as Record<string, number>,
    ),
    byDifficulty: questions.reduce(
      (accumulator, entry) => {
        accumulator[entry.difficulty] =
          (accumulator[entry.difficulty] ??
            0) + 1;
        return accumulator;
      },
      {} as Record<string, number>,
    ),
  };
}

export async function generateQuestionBatch(
  availablePatterns: Pattern[],
  request: BulkGenerationRequest,
) : Promise<GeneratedQuestionBatch> {
  const filteredPatterns =
    availablePatterns.filter((pattern) =>
      matchesPatternFilters(
        pattern,
        request.filters,
      ),
    );

  if (!filteredPatterns.length) {
    return {
      questions: [],
      rejected: [
        {
          patternId: "none",
          domain: "none",
          topic: "none",
          reason:
            "no-patterns-matched-filters",
        },
      ],
      metrics: summarizeBatchMetrics(
        [],
        [
          {
            patternId: "none",
            domain: "none",
            topic: "none",
            reason:
              "no-patterns-matched-filters",
          },
        ],
        request.batchSize,
        0,
      ),
    };
  }

  const accepted: GeneratedBatchQuestion[] =
    [];
  const rejected: RejectedGeneratedQuestion[] =
    [];
  const maxAttempts =
    request.maxAttempts ??
    Math.max(
      request.batchSize * 8,
      filteredPatterns.length * 2,
    );
  let attemptCount = 0;

  while (
    accepted.length < request.batchSize &&
    attemptCount < maxAttempts
  ) {
    const pattern =
      filteredPatterns[
        attemptCount %
          filteredPatterns.length
      ]!;
    const seedBase =
      request.options?.seed;
    const seed =
      seedBase
        ? `${seedBase}:${attemptCount}`
        : undefined;

    try {
      const result =
        await generateFromPattern(
          pattern,
          1,
          {
            ...request.options,
            examProfile:
              request.filters
                ?.examProfile ??
              request.options
                ?.examProfile,
            qualityThresholds:
              request.qualityThresholds ??
              request.options
                ?.qualityThresholds,
            seed,
          },
        );
      const generatedQuestion =
        result.questions[0];

      if (!generatedQuestion) {
        rejected.push({
          patternId: pattern.id,
          domain:
            inferGenerationDomain(
              pattern,
            ),
          topic: pattern.topic,
          reason:
            "no-question-generated",
        });
        attemptCount += 1;
        continue;
      }

      const filterResult =
        matchesGeneratedFilters(
          generatedQuestion,
          request.filters,
        );

      if (!filterResult.ok) {
        rejected.push({
          patternId: pattern.id,
          domain:
            inferGenerationDomain(
              pattern,
            ),
          topic: pattern.topic,
          reason:
            filterResult.reason,
        });
      } else {
        const batchQuestion =
          buildBatchQuestion(
            pattern,
            generatedQuestion,
            request.filters
              ?.examProfile ??
              request.options
                ?.examProfile,
          );
        const duplicateMatch =
          accepted.find((existing) => {
            if (
              !existing.proceduralScenario ||
              !existing.extractedPatternIntelligence ||
              !batchQuestion.proceduralScenario ||
              !batchQuestion.extractedPatternIntelligence ||
              !existing.structuralSignatureDetail ||
              !batchQuestion.structuralSignatureDetail
            ) {
              return false;
            }

            const analysis =
              analyzeStructuralDuplicate(
                {
                  scenario:
                    existing.proceduralScenario,
                  extracted:
                    existing.extractedPatternIntelligence,
                  signature:
                    existing.structuralSignatureDetail,
                },
                {
                  scenario:
                    batchQuestion.proceduralScenario,
                  extracted:
                    batchQuestion.extractedPatternIntelligence,
                  signature:
                    batchQuestion.structuralSignatureDetail,
                },
              );

            return (
              analysis.exactDuplicate ||
              analysis.nearDuplicate ||
              analysis.repeatedInferencePattern ||
              analysis.repeatedDistractorStructure
            );
          });

        if (duplicateMatch) {
          rejected.push({
            patternId: pattern.id,
            domain:
              inferGenerationDomain(
                pattern,
              ),
            topic: pattern.topic,
            reason:
              "structural-duplicate",
            detail:
              duplicateMatch.structuralSignature,
          });
        } else {
          if (
            batchQuestion.qualityAssessment &&
            !batchQuestion
              .qualityAssessment.approved
          ) {
            rejected.push({
              patternId: pattern.id,
              domain:
                inferGenerationDomain(
                  pattern,
                ),
              topic: pattern.topic,
              reason: "quality-filter",
              detail:
                batchQuestion.qualityAssessment.rejectionReasons.join(
                  ", ",
                ),
            });
          } else {
            accepted.push(batchQuestion);
          }
        }
      }
    } catch (error) {
      rejected.push({
        patternId: pattern.id,
        domain:
          inferGenerationDomain(
            pattern,
          ),
        topic: pattern.topic,
        reason: "generation-failed",
        detail:
          error instanceof Error
            ? error.message
            : "Unknown generation error",
      });
    }

    attemptCount += 1;
  }

  return {
    questions: accepted,
    rejected,
    metrics: summarizeBatchMetrics(
      accepted,
      rejected,
      request.batchSize,
      attemptCount,
    ),
  };
}
