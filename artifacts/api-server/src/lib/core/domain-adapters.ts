import type {
  DISet,
  DifficultyLabel,
  FormulaQuestion,
  GeneratedQuestion,
  GenerationDomain,
  GeneratorOptions,
  Pattern,
} from "./generator-engine";

export type ValidationStageResult = {
  stage: string;
  passed: boolean;
  diagnostics: string[];
  metrics: Record<string, number>;
};

export type ValidationReport = {
  passed: boolean;
  stageResults: ValidationStageResult[];
  warnings: string[];
  metrics: Record<string, number>;
};

export type ValidationStageContext<
  TResult extends GeneratedQuestion = GeneratedQuestion,
> = {
  domain: string;
  pattern: Pattern;
  realizedQuestion: TResult;
  scenario: Scenario;
  difficultyMetrics: DifficultyMetrics;
  explanationResult: ExplanationResult;
};

export interface ValidationStage<
  TResult extends GeneratedQuestion = GeneratedQuestion,
> {
  name: string;
  execute(
    context: ValidationStageContext<TResult>,
  ): ValidationStageResult;
}

export type DifficultyMetrics = {
  difficultyLabel?: DifficultyLabel;
  difficultyScore?: number;
  cognitiveLoad: number;
  inferenceDepth: number;
  calculationComplexity: number;
  distractorComplexity: number;
  ambiguityScore: number;
  solvingTimeEstimate: number;
  domainContributions?: Record<
    string,
    number
  >;
  metrics: Record<string, number>;
};

export type ExplanationResult = {
  text: string;
  reasoningSteps: string[];
  metadata?: Record<string, unknown>;
};

export type ScenarioEntity = {
  id: string;
  type: string;
  label: string;
  value?: unknown;
  metadata?: Record<string, unknown>;
};

export type ScenarioConstraint = {
  id: string;
  type: string;
  operator?: string;
  sourceIds?: string[];
  expression?: string;
  metadata?: Record<string, unknown>;
};

export type ScenarioContent = {
  stem?: string;
  prompt?: string;
  options?: string[];
  explanation?: string;
  artifacts?: Record<string, unknown>;
};

export type ScenarioDifficulty = {
  label?: DifficultyLabel;
  score?: number;
  inferenceDepth?: number;
  metrics: Record<string, number>;
};

export type ScenarioValidation = {
  passed: boolean;
  warnings: string[];
  metrics: Record<string, number>;
};

export type Scenario = {
  id: string;
  domain: string;
  subtype: string;
  metadata?: Record<string, unknown>;
  entities: ScenarioEntity[];
  constraints: ScenarioConstraint[];
  content: ScenarioContent;
  difficulty: ScenarioDifficulty;
  validation: ScenarioValidation;
};

export type DomainScenario<
  TResult extends GeneratedQuestion = GeneratedQuestion,
> = {
  domain: string;
  pattern: Pattern;
  scenario: Scenario;
  realizedQuestion: TResult;
  validationReport: ValidationReport;
  difficultyMetrics: DifficultyMetrics;
  explanationResult: ExplanationResult;
  metadata?: Record<string, unknown>;
};

export type DomainGenerationContext = {
  pattern: Pattern;
  count: number;
  options?: GeneratorOptions;
};

export interface DomainAdapter<
  TScenario extends DomainScenario = DomainScenario,
  TResult extends GeneratedQuestion = GeneratedQuestion,
> {
  domain: string;
  generationMode?: "single" | "per-item";
  maxAttemptsMultiplier?: number;
  minAttempts?: number;
  generateScenario(
    context: DomainGenerationContext,
  ): TScenario;
  hydrateScenario(
    pattern: Pattern,
    realizedQuestion: TResult,
  ): TScenario;
  validateScenario(
    scenario: TScenario,
  ): ValidationReport;
  realizeScenario(
    scenario: TScenario,
  ): TResult;
  analyzeDifficulty(
    scenario: TScenario,
  ): DifficultyMetrics;
  generateExplanation(
    scenario: TScenario,
  ): ExplanationResult;
}

export type DomainAdapterRegistry =
  Record<string, DomainAdapter>;

type AdapterQuestion =
  | FormulaQuestion
  | DISet;

type AdapterDependencies = {
  createFormulaQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createReasoningQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createSeatingQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createEnglishQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createPunjabiQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createKnowledgeQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createQuantV2PercentageQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createQuantV2ProfitLossQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createQuantV2InterestQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createQuantV2RatioProportionQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createQuantV2TimeWorkQuestionCandidate: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion;
  createDIQuestionSet: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => DISet;
};

function getPrimaryQuestion(
  question: AdapterQuestion,
) {
  return "questionType" in question &&
    question.questionType === "di"
    ? question.questions[0]
    : question;
}

function tokenizeText(
  value: string,
) {
  return value
    .split(/[^A-Za-z0-9]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function extractArrangementParticipants(
  arrangement?: string,
) {
  if (!arrangement) {
    return [];
  }

  return arrangement
    .split(/[:;|]/)
    .map((part) => part.trim())
    .filter(
      (part) =>
        part.length > 0 &&
        !/^row\s+\d+$/i.test(part) &&
        !/^\d+$/.test(part),
    )
    .map((part) =>
      part.replace(/^\d+\s*/, "").trim(),
    )
    .filter(Boolean);
}

function buildValidationReport(
  question: AdapterQuestion,
  domain: string,
): ValidationReport {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const warnings = [
    ...(
      primaryQuestion?.debugMetadata
        ?.validationWarnings ?? []
    ),
    ...(
      primaryQuestion?.debugMetadata
        ?.compatibilityWarnings ?? []
    ),
  ];
  const uniquenessVerified =
    primaryQuestion?.debugMetadata
      ?.uniquenessVerified;

  return {
    passed:
      uniquenessVerified !== false &&
      warnings.length === 0,
    warnings,
    stageResults: [
      {
        stage: `${domain}-scenario`,
        passed:
          uniquenessVerified !== false &&
          warnings.length === 0,
        diagnostics: warnings,
        metrics: {
          clueCount:
            primaryQuestion?.debugMetadata
              ?.clueCount ?? 0,
          inferenceDepth:
            primaryQuestion?.debugMetadata
              ?.inferenceDepth ?? 0,
        },
      },
    ],
    metrics: {
      clueCount:
        primaryQuestion?.debugMetadata
          ?.clueCount ?? 0,
      inferenceDepth:
        primaryQuestion?.debugMetadata
          ?.inferenceDepth ?? 0,
      uniquenessVerified:
        uniquenessVerified === true
          ? 1
          : 0,
    },
  };
}

function buildStructuralValidityStage<
  TResult extends GeneratedQuestion = GeneratedQuestion,
>(): ValidationStage<TResult> {
  return {
    name: "structural validity",
    execute(context) {
      const diagnostics: string[] = [];
      const metrics = {
        entityCount:
          context.scenario.entities.length,
        constraintCount:
          context.scenario.constraints.length,
        hasPrompt:
          context.scenario.content.prompt
            ?.length
            ? 1
            : 0,
      };

      if (
        !context.scenario.entities.length
      ) {
        diagnostics.push(
          "Scenario has no normalized entities.",
        );
      }

      if (
        !context.scenario.content.prompt
      ) {
        diagnostics.push(
          "Scenario has no normalized prompt content.",
        );
      }

      return {
        stage: "structural validity",
        passed:
          diagnostics.length === 0,
        diagnostics,
        metrics,
      };
    },
  };
}

function buildSolvabilityStage<
  TResult extends GeneratedQuestion = GeneratedQuestion,
>(): ValidationStage<TResult> {
  return {
    name: "solvability",
    execute(context) {
      const primaryQuestion =
        getPrimaryQuestion(
          context.realizedQuestion as AdapterQuestion,
        );
      const warnings =
        primaryQuestion?.debugMetadata
          ?.validationWarnings ?? [];
      const failed = warnings.some(
        (warning) =>
          /no valid|unsolved|unsatisfiable|contradicted/i.test(
            warning,
          ),
      );

      return {
        stage: "solvability",
        passed: !failed,
        diagnostics: failed
          ? warnings.filter((warning) =>
            /no valid|unsolved|unsatisfiable|contradicted/i.test(
              warning,
            ),
          )
          : [],
        metrics: {
          warningCount:
            warnings.length,
        },
      };
    },
  };
}

function buildUniquenessStage<
  TResult extends GeneratedQuestion = GeneratedQuestion,
>(): ValidationStage<TResult> {
  return {
    name: "uniqueness",
    execute(context) {
      const primaryQuestion =
        getPrimaryQuestion(
          context.realizedQuestion as AdapterQuestion,
        );
      const uniquenessVerified =
        primaryQuestion?.debugMetadata
          ?.uniquenessVerified;
      const passed =
        uniquenessVerified !== false;

      return {
        stage: "uniqueness",
        passed,
        diagnostics: passed
          ? []
          : [
            "Scenario did not verify unique solution.",
          ],
        metrics: {
          uniquenessVerified:
            uniquenessVerified === true
              ? 1
              : 0,
        },
      };
    },
  };
}

function buildDifficultyCalibrationStage<
  TResult extends GeneratedQuestion = GeneratedQuestion,
>(): ValidationStage<TResult> {
  return {
    name: "difficulty calibration",
    execute(context) {
      const diagnostics: string[] = [];
      const reasoningDepth =
        context.difficultyMetrics
          .inferenceDepth ?? 0;
      const difficultyScore =
        context.difficultyMetrics
          .difficultyScore ?? 0;

      if (
        difficultyScore <= 0
      ) {
        diagnostics.push(
          "Difficulty score was not calibrated.",
        );
      }

      if (
        reasoningDepth <= 0
      ) {
        diagnostics.push(
          "Reasoning depth is missing from difficulty metrics.",
        );
      }

      return {
        stage: "difficulty calibration",
        passed:
          diagnostics.length === 0,
        diagnostics,
        metrics: {
          difficultyScore,
          reasoningDepth,
        },
      };
    },
  };
}

function buildRedundancyAnalysisStage<
  TResult extends GeneratedQuestion = GeneratedQuestion,
>(): ValidationStage<TResult> {
  return {
    name: "redundancy analysis",
    execute(context) {
      const primaryQuestion =
        getPrimaryQuestion(
          context.realizedQuestion as AdapterQuestion,
        );
      const redundancyScore =
        primaryQuestion?.debugMetadata
          ?.redundancyScore ?? 0;
      const redundancyRatio =
        primaryQuestion?.debugMetadata
          ?.redundancyRatio ?? 0;
      const diagnostics: string[] = [];

      if (
        redundancyRatio > 0.45
      ) {
        diagnostics.push(
          "Scenario appears overconstrained by redundancy ratio.",
        );
      }

      if (
        redundancyScore >= 8
      ) {
        diagnostics.push(
          "Redundancy score is unusually high.",
        );
      }

      return {
        stage: "redundancy analysis",
        passed:
          diagnostics.length === 0,
        diagnostics,
        metrics: {
          redundancyScore,
          redundancyRatio,
        },
      };
    },
  };
}

function buildCoreValidationStages<
  TResult extends GeneratedQuestion = GeneratedQuestion,
>(): ValidationStage<TResult>[] {
  return [
    buildStructuralValidityStage<TResult>(),
    buildSolvabilityStage<TResult>(),
    buildUniquenessStage<TResult>(),
    buildDifficultyCalibrationStage<TResult>(),
    buildRedundancyAnalysisStage<TResult>(),
  ];
}

function buildDifficultyMetrics(
  question: AdapterQuestion,
  domain: string,
  contributions?: Partial<DifficultyMetrics>,
): DifficultyMetrics {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const reasoningDepth =
    primaryQuestion
      ?.difficultyMetadata
      ?.reasoningDepth ??
    primaryQuestion?.debugMetadata
      ?.inferenceDepth ??
    0;
  const dependencyComplexity =
    primaryQuestion
      ?.difficultyMetadata
      ?.dependencyComplexity ??
    primaryQuestion?.debugMetadata
      ?.deductionDependencyScore ??
    0;
  const solvingTimeEstimate =
    primaryQuestion
      ?.difficultyMetadata
      ?.estimatedSolveTime ?? 0;
  const distractorComplexity =
    (
      primaryQuestion?.optionMetadata ??
      []
    ).filter(
      (option) =>
        !option.isCorrect &&
        option.distractorType,
    ).length;
  const ambiguityScoreBase =
    (
      primaryQuestion?.debugMetadata
        ?.validationWarnings ?? []
    ).length *
      0.8 +
    (
      primaryQuestion?.debugMetadata
        ?.compatibilityWarnings ?? []
    ).length *
      0.6;
  const calculationComplexityBase =
    domain === "quant" ||
    domain === "di"
      ? primaryQuestion
          ?.difficultyMetadata
          ?.operationCount ?? 0
      : 0;
  const baseMetrics = {
    reasoningDepth,
    dependencyComplexity,
    estimatedSolveTime:
      solvingTimeEstimate,
    distractorCount:
      distractorComplexity,
    calculationComplexity:
      calculationComplexityBase,
  };
  const cognitiveLoadBase =
    reasoningDepth * 0.35 +
    dependencyComplexity * 0.25 +
    calculationComplexityBase * 0.2 +
    distractorComplexity * 0.1 +
    ambiguityScoreBase * 0.1;

  return {
    difficultyLabel:
      "difficultyLabel" in question &&
      question.difficultyLabel
        ? question.difficultyLabel
        : primaryQuestion
            ?.difficultyLabel,
    difficultyScore:
      "difficultyScore" in question &&
      typeof question.difficultyScore ===
        "number"
        ? question.difficultyScore
        : primaryQuestion
            ?.difficultyScore,
    cognitiveLoad:
      contributions?.cognitiveLoad ??
      Number(
        cognitiveLoadBase.toFixed(2),
      ),
    inferenceDepth:
      contributions?.inferenceDepth ??
      reasoningDepth,
    calculationComplexity:
      contributions?.calculationComplexity ??
      calculationComplexityBase,
    distractorComplexity:
      contributions?.distractorComplexity ??
      distractorComplexity,
    ambiguityScore:
      contributions?.ambiguityScore ??
      Number(
        ambiguityScoreBase.toFixed(2),
      ),
    solvingTimeEstimate:
      contributions?.solvingTimeEstimate ??
      solvingTimeEstimate,
    domainContributions:
      contributions?.domainContributions,
    metrics: {
      ...baseMetrics,
      cognitiveLoadBase:
        Number(
          cognitiveLoadBase.toFixed(2),
        ),
      ambiguityScoreBase:
        Number(
          ambiguityScoreBase.toFixed(2),
        ),
    },
  };
}

function buildExplanationResult(
  question: AdapterQuestion,
): ExplanationResult {
  const primaryQuestion =
    getPrimaryQuestion(question);

  return {
    text:
      primaryQuestion?.explanation ?? "",
    reasoningSteps:
      primaryQuestion
        ?.difficultyMetadata
        ?.reasoningSteps ??
      [],
    metadata: {
      hasSeatingExplanation:
        Boolean(
          primaryQuestion
            ?.seatingExplanationFlow,
        ) ||
        Boolean(
          primaryQuestion
            ?.debugMetadata
            ?.seatingExplanationFlow,
        ),
    },
  };
}

function buildReasoningDifficultyContribution(
  question: FormulaQuestion,
) {
  const debugMetadata =
    question.debugMetadata;
  const inferenceDepth =
    debugMetadata?.inferenceDepth ??
    question.difficultyMetadata
      ?.reasoningDepth ??
    0;
  const eliminationDepth =
    debugMetadata?.eliminationDepth ??
    0;
  const branchingComplexity =
    debugMetadata?.branchingComplexity ??
    0;
  const deductionDependencyScore =
    debugMetadata?.deductionDependencyScore ??
    0;
  const ambiguityScore =
    Math.max(
      0,
      (debugMetadata
        ?.validationWarnings?.length ??
        0) *
        0.75,
    );

  return {
    cognitiveLoad: Number(
      (
        inferenceDepth * 0.45 +
        eliminationDepth * 0.18 +
        branchingComplexity * 2 +
        deductionDependencyScore *
          0.2
      ).toFixed(2),
    ),
    inferenceDepth,
    calculationComplexity: 0,
    distractorComplexity: (
      question.optionMetadata ?? []
    ).filter(
      (option) =>
        !option.isCorrect &&
        option.reasoningTrap,
    ).length,
    ambiguityScore: Number(
      ambiguityScore.toFixed(2),
    ),
    solvingTimeEstimate:
      question.difficultyMetadata
        ?.estimatedSolveTime ??
      0,
    domainContributions: {
      eliminationDepth,
      branchingComplexity,
      deductionDependencyScore,
    },
  } satisfies Partial<DifficultyMetrics>;
}

function buildQuantDifficultyContribution(
  question: FormulaQuestion,
) {
  const difficultyMetadata =
    question.difficultyMetadata;
  const optionMetadata =
    question.optionMetadata ?? [];
  const distractorComplexity =
    optionMetadata.filter(
      (option) =>
        !option.isCorrect &&
        option.distractorType,
    ).length;
  const calculationComplexity =
    difficultyMetadata
      ?.operationCount ?? 0;
  const ambiguityScore =
    optionMetadata.filter(
      (option) =>
        !option.isCorrect &&
        option.reasoningTrap,
    ).length * 0.35;

  return {
    cognitiveLoad: Number(
      (
        calculationComplexity * 0.42 +
        (difficultyMetadata
          ?.reasoningDepth ?? 0) *
          0.24 +
        distractorComplexity * 0.16 +
        ambiguityScore * 0.18
      ).toFixed(2),
    ),
    inferenceDepth:
      difficultyMetadata
        ?.reasoningDepth ?? 0,
    calculationComplexity,
    distractorComplexity,
    ambiguityScore: Number(
      ambiguityScore.toFixed(2),
    ),
    solvingTimeEstimate:
      difficultyMetadata
        ?.estimatedSolveTime ?? 0,
    domainContributions: {
      operationCount:
        calculationComplexity,
      visualComplexity:
        difficultyMetadata
          ?.visualComplexity ?? 0,
      inferenceComplexity:
        difficultyMetadata
          ?.inferenceComplexity ?? 0,
    },
  } satisfies Partial<DifficultyMetrics>;
}

function buildEnglishDifficultyContribution(
  question: FormulaQuestion,
) {
  const tokens = tokenizeText(
    question.text ?? "",
  );
  const optionMetadata =
    question.optionMetadata ?? [];
  const trapDensity =
    optionMetadata.filter(
      (option) =>
        !option.isCorrect &&
        option.reasoningTrap,
    ).length;
  const ambiguityScore =
    Number(
      (
        Math.max(tokens.length - 18, 0) *
          0.08 +
        trapDensity * 0.7
      ).toFixed(2),
    );

  return {
    cognitiveLoad: Number(
      (
        ambiguityScore * 0.42 +
        trapDensity * 0.28 +
        (question.difficultyMetadata
          ?.reasoningDepth ?? 0) *
          0.16 +
        tokens.length * 0.05
      ).toFixed(2),
    ),
    inferenceDepth:
      question.difficultyMetadata
        ?.reasoningDepth ?? 0,
    calculationComplexity: 0,
    distractorComplexity:
      trapDensity,
    ambiguityScore,
    solvingTimeEstimate:
      question.difficultyMetadata
        ?.estimatedSolveTime ??
      Math.max(
        20,
        tokens.length * 2,
      ),
    domainContributions: {
      tokenCount: tokens.length,
      trapDensity,
    },
  } satisfies Partial<DifficultyMetrics>;
}

function buildDIDifficultyContribution(
  diSet: DISet,
) {
  const rows =
    diSet.diData.length;
  const columns = Object.keys(
    diSet.diData[0] ?? {},
  ).length;
  const interpretationComplexity =
    rows * 0.4 + columns * 0.6;
  const averageQuestion =
    diSet.questions[0];
  const distractorComplexity =
    diSet.questions.reduce(
      (total, question) =>
        total +
        (question.optionMetadata ?? [])
          .filter(
            (option) =>
              !option.isCorrect &&
              option.distractorType,
          ).length,
      0,
    ) /
    Math.max(diSet.questions.length, 1);

  return {
    cognitiveLoad: Number(
      (
        interpretationComplexity *
          0.4 +
        (averageQuestion
          ?.difficultyMetadata
          ?.reasoningDepth ?? 0) *
          0.25 +
        distractorComplexity * 0.2 +
        (averageQuestion
          ?.difficultyMetadata
          ?.visualComplexity ?? 0) *
          0.15
      ).toFixed(2),
    ),
    inferenceDepth:
      averageQuestion
        ?.difficultyMetadata
        ?.reasoningDepth ?? 0,
    calculationComplexity: Number(
      interpretationComplexity.toFixed(
        2,
      ),
    ),
    distractorComplexity: Number(
      distractorComplexity.toFixed(2),
    ),
    ambiguityScore: Number(
      (
        (averageQuestion
          ?.difficultyMetadata
          ?.visualComplexity ?? 0) *
        0.4
      ).toFixed(2),
    ),
    solvingTimeEstimate:
      diSet.questions.reduce(
        (total, question) =>
          total +
          (question
            .difficultyMetadata
            ?.estimatedSolveTime ??
            0),
        0,
      ) /
      Math.max(
        diSet.questions.length,
        1,
      ),
    domainContributions: {
      rowCount: rows,
      columnCount: columns,
      interpretationComplexity:
        Number(
          interpretationComplexity.toFixed(
            2,
          ),
        ),
    },
  } satisfies Partial<DifficultyMetrics>;
}

function buildScenarioEntities(
  domain: string,
  pattern: Pattern,
  question: AdapterQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);

  if (domain === "di") {
    const diSet = question as DISet;
    const rows = diSet.diData ?? [];
    const firstRow = rows[0] ?? {};
    const columns = Object.keys(firstRow);

    return [
      ...columns.map((column, index) => ({
        id: `column-${index}`,
        type: "di-column",
        label: column,
      })),
      ...rows.map((row, index) => ({
        id: `row-${index}`,
        type: "di-row",
        label: `Row ${index + 1}`,
        value: row,
      })),
    ] satisfies ScenarioEntity[];
  }

  if (
    domain === "quant"
  ) {
    return Object.entries(
      pattern.variables ?? {},
    ).map(
      ([name, value], index) => ({
        id: `var-${index}`,
        type: "variable",
        label: name,
        value,
      }),
    );
  }

  if (
    domain === "seating-arrangement" ||
    primaryQuestion?.debugMetadata
      ?.arrangementType
  ) {
    return extractArrangementParticipants(
      primaryQuestion?.debugMetadata
        ?.finalArrangement,
    ).map(
      (label, index) => ({
        id: `participant-${index}`,
        type: "participant",
        label,
      }),
    );
  }

  if (domain === "english") {
    return tokenizeText(
      primaryQuestion?.text ?? "",
    )
      .slice(0, 20)
      .map((token, index) => ({
        id: `token-${index}`,
        type: "grammar-token",
        label: token,
      }));
  }

  if (domain === "punjabi") {
    return Array.from(
      (
        primaryQuestion?.text ?? ""
      ).matchAll(
        /[\u0A00-\u0A7F]+/g,
      ),
    )
      .slice(0, 20)
      .map((match, index) => ({
        id: `gurmukhi-token-${index}`,
        type: "gurmukhi-token",
        label: match[0],
      }));
  }

  return tokenizeText(
    primaryQuestion?.text ?? "",
  )
    .slice(0, 20)
    .map((token, index) => ({
      id: `entity-${index}`,
      type: "reasoning-token",
      label: token,
    }));
}

function buildScenarioConstraints(
  domain: string,
  pattern: Pattern,
  question: AdapterQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);

  if (domain === "di") {
    const diSet = question as DISet;
    return [
      {
        id: "di-visual",
        type: "visual-structure",
        expression:
          diSet.visualType,
        metadata: {
          title: diSet.title,
          series: diSet.series,
        },
      },
    ] satisfies ScenarioConstraint[];
  }

  if (domain === "quant") {
    return [
      {
        id: "quant-formula",
        type: "formula",
        operator: "EQUALS",
        expression:
          pattern.formula ?? "",
        metadata: {
          variables: Object.keys(
            pattern.variables ?? {},
          ),
        },
      },
    ];
  }

  if (
    domain === "seating-arrangement" ||
    primaryQuestion?.debugMetadata
      ?.arrangementType
  ) {
    return (
      primaryQuestion?.debugMetadata
        ?.generatedClues ?? []
    ).map((clue, index) => ({
      id: `constraint-${index}`,
      type: "seating-relation",
      expression: clue,
    }));
  }

  if (
    domain === "english" ||
    domain === "punjabi"
  ) {
    return [
      {
        id: "syntax-rules",
        type:
          domain === "punjabi"
            ? "gurmukhi-rule"
            : "syntax-rule",
        expression:
          pattern.explanationTemplate ??
          pattern.templateVariants?.[0] ??
          "grammar transformation",
      },
    ];
  }

  return (
    primaryQuestion?.difficultyMetadata
      ?.reasoningSteps ?? []
  ).map((step, index) => ({
    id: `constraint-${index}`,
    type: "reasoning-relation",
    expression: step,
  }));
}

function inferScenarioSubtype(
  domain: string,
  pattern: Pattern,
  question: AdapterQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);

  if (domain === "di") {
    return (
      (question as DISet).visualType ??
      "table"
    );
  }

  return (
    primaryQuestion?.debugMetadata
      ?.arrangementType ??
    pattern.subtopic ??
    pattern.topic ??
    domain
  );
}

function buildUniversalScenario(
  domain: string,
  pattern: Pattern,
  question: AdapterQuestion,
  validationReport: ValidationReport,
  difficultyMetrics: DifficultyMetrics,
  explanationResult: ExplanationResult,
): Scenario {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const generationId =
    primaryQuestion?.debugMetadata
      ?.generationId;

  return {
    id:
      generationId
        ? `${domain}:${generationId}:${pattern.id}`
        : `${domain}:${pattern.id}:${Math.abs(
          (primaryQuestion?.text ?? "")
            .split("")
            .reduce(
              (sum, char) =>
                sum +
                char.charCodeAt(0),
              0,
            ),
        )}`,
    domain,
    subtype: inferScenarioSubtype(
      domain,
      pattern,
      question,
    ),
    metadata: {
      patternId: pattern.id,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      generationDomain:
        primaryQuestion?.debugMetadata
          ?.generationDomain,
      arrangementType:
        primaryQuestion?.debugMetadata
          ?.arrangementType,
      orientationType:
        primaryQuestion?.debugMetadata
          ?.orientationType,
      seed:
        primaryQuestion?.debugMetadata
          ?.seed,
    },
    entities: buildScenarioEntities(
      domain,
      pattern,
      question,
    ),
    constraints:
      buildScenarioConstraints(
        domain,
        pattern,
        question,
      ),
    content: {
      stem: primaryQuestion?.text,
      prompt:
        primaryQuestion?.text,
      options:
        "options" in primaryQuestion
          ? primaryQuestion.options
          : undefined,
      explanation:
        explanationResult.text,
      artifacts: {
        seatingDiagram:
          primaryQuestion?.seatingDiagram ??
          primaryQuestion
            ?.debugMetadata
            ?.seatingDiagram,
        seatingExplanationFlow:
          primaryQuestion
            ?.seatingExplanationFlow ??
          primaryQuestion
            ?.debugMetadata
            ?.seatingExplanationFlow,
      },
    },
    difficulty: {
      label:
        difficultyMetrics.difficultyLabel,
      score:
        difficultyMetrics.difficultyScore,
      inferenceDepth:
        difficultyMetrics.inferenceDepth,
      metrics:
        difficultyMetrics.metrics,
    },
    validation: {
      passed:
        validationReport.passed,
      warnings:
        validationReport.warnings,
      metrics:
        validationReport.metrics,
    },
  };
}

function runValidationStages<
  TResult extends GeneratedQuestion = GeneratedQuestion,
>(
  context: ValidationStageContext<TResult>,
  stages: ValidationStage<TResult>[],
): ValidationReport {
  const stageResults = stages.map(
    (stage) =>
      stage.execute(context),
  );
  const legacyReport =
    buildValidationReport(
      context.realizedQuestion as AdapterQuestion,
      context.domain,
    );
  const warnings = [
    ...new Set([
      ...legacyReport.warnings,
      ...stageResults.flatMap(
        (result) =>
          result.passed
            ? []
            : result.diagnostics,
      ),
    ]),
  ];
  const metrics =
    stageResults.reduce(
      (accumulator, result) => ({
        ...accumulator,
        ...result.metrics,
      }),
      {
        ...legacyReport.metrics,
      } as Record<string, number>,
    );

  return {
    passed:
      legacyReport.passed &&
      stageResults.every(
        (result) => result.passed,
      ),
    stageResults,
    warnings,
    metrics,
  };
}

function createScenario<TResult extends AdapterQuestion>(
  domain: string,
  pattern: Pattern,
  realizedQuestion: TResult,
  customValidationStages: ValidationStage<TResult>[] = [],
  difficultyContribution?: Partial<DifficultyMetrics>,
): DomainScenario<TResult> {
  const difficultyMetrics =
    buildDifficultyMetrics(
      realizedQuestion,
      domain,
      difficultyContribution,
    );
  const explanationResult =
    buildExplanationResult(
      realizedQuestion,
    );
  const provisionalValidationReport =
    buildValidationReport(
      realizedQuestion,
      domain,
    );
  const scenario =
    buildUniversalScenario(
      domain,
      pattern,
      realizedQuestion,
      provisionalValidationReport,
      difficultyMetrics,
      explanationResult,
    );
  const validationReport =
    runValidationStages(
      {
        domain,
        pattern,
        realizedQuestion,
        scenario,
        difficultyMetrics,
        explanationResult,
      },
      [
        ...buildCoreValidationStages<TResult>(),
        ...customValidationStages,
      ],
    );

  return {
    domain,
    pattern,
    scenario: {
      ...scenario,
      validation: {
        passed:
          validationReport.passed,
        warnings:
          validationReport.warnings,
        metrics:
          validationReport.metrics,
      },
    },
    realizedQuestion,
    validationReport,
    difficultyMetrics,
    explanationResult,
  };
}

function buildQuestionAdapter(
  domain: GenerationDomain | "english",
  createQuestion: (
    pattern: Pattern,
    options?: GeneratorOptions,
  ) => FormulaQuestion,
  config?: {
    maxAttemptsMultiplier?: number;
    minAttempts?: number;
    customValidationStages?: ValidationStage<FormulaQuestion>[];
    difficultyContribution?: (
      question: FormulaQuestion,
    ) => Partial<DifficultyMetrics>;
  },
): DomainAdapter<
  DomainScenario<FormulaQuestion>,
  FormulaQuestion
> {
  return {
    domain,
    generationMode: "per-item",
    maxAttemptsMultiplier:
      config?.maxAttemptsMultiplier,
    minAttempts:
      config?.minAttempts,
    generateScenario(context) {
      const question =
        createQuestion(
          context.pattern,
          context.options,
        );
      return this.hydrateScenario(
        context.pattern,
        question,
      );
    },
    hydrateScenario(
      pattern,
      realizedQuestion,
    ) {
      return createScenario(
        domain,
        pattern,
        realizedQuestion,
        config?.customValidationStages,
        config?.difficultyContribution?.(
          realizedQuestion,
        ),
      );
    },
    validateScenario(scenario) {
      return scenario.validationReport;
    },
    realizeScenario(scenario) {
      return scenario.realizedQuestion;
    },
    analyzeDifficulty(scenario) {
      return scenario.difficultyMetrics;
    },
    generateExplanation(scenario) {
      return scenario.explanationResult;
    },
  };
}

function buildReasoningTopologyStage(): ValidationStage<FormulaQuestion> {
  return {
    name: "topology validation",
    execute(context) {
      const primaryQuestion =
        getPrimaryQuestion(
          context.realizedQuestion,
        );
      const arrangementType =
        primaryQuestion?.debugMetadata
          ?.arrangementType;
      const finalArrangement =
        primaryQuestion?.debugMetadata
          ?.finalArrangement;
      const passed =
        Boolean(arrangementType) &&
        Boolean(finalArrangement);

      return {
        stage: "topology validation",
        passed,
        diagnostics: passed
          ? []
          : [
            "Reasoning topology metadata is incomplete.",
          ],
        metrics: {
          hasArrangementType:
            arrangementType ? 1 : 0,
          hasFinalArrangement:
            finalArrangement ? 1 : 0,
        },
      };
    },
  };
}

function buildQuantEquationStage(): ValidationStage<FormulaQuestion> {
  return {
    name: "equation solvability",
    execute(context) {
      const hasFormula =
        typeof context.pattern.formula ===
          "string" &&
        context.pattern.formula.trim()
          .length > 0;

      return {
        stage: "equation solvability",
        passed: hasFormula,
        diagnostics: hasFormula
          ? []
          : [
            "Quant scenario is missing a normalized formula/equation constraint.",
          ],
        metrics: {
          hasFormula:
            hasFormula ? 1 : 0,
        },
      };
    },
  };
}

function buildEnglishGrammarStage(): ValidationStage<FormulaQuestion> {
  return {
    name: "grammar consistency validation",
    execute(context) {
      const tokenCount =
        context.scenario.entities.filter(
          (entity) =>
            entity.type ===
            "grammar-token",
        ).length;
      const hasRuleConstraint =
        context.scenario.constraints.some(
          (constraint) =>
            constraint.type ===
            "syntax-rule",
        );
      const passed =
        tokenCount > 0 &&
        hasRuleConstraint;

      return {
        stage: "grammar consistency validation",
        passed,
        diagnostics: passed
          ? []
          : [
            "English scenario is missing grammar tokens or syntax-rule constraints.",
          ],
        metrics: {
          tokenCount,
          hasRuleConstraint:
            hasRuleConstraint ? 1 : 0,
        },
      };
    },
  };
}

function buildPunjabiVyakaranStage(): ValidationStage<FormulaQuestion> {
  return {
    name: "punjabi gurmukhi validation",
    execute(context) {
      const tokenCount =
        context.scenario.entities.filter(
          (entity) =>
            entity.type ===
            "gurmukhi-token",
        ).length;
      const hasRuleConstraint =
        context.scenario.constraints.some(
          (constraint) =>
            constraint.type ===
            "gurmukhi-rule",
        );
      const hasPunjabiText =
        /[\u0A00-\u0A7F]/.test(
          context.realizedQuestion.text,
        );
      const passed =
        tokenCount > 0 &&
        hasRuleConstraint &&
        hasPunjabiText;

      return {
        stage: "punjabi gurmukhi validation",
        passed,
        diagnostics: passed
          ? []
          : [
            "Punjabi scenario is missing Gurmukhi tokens, Gurmukhi rule constraints, or Punjabi stem text.",
          ],
        metrics: {
          tokenCount,
          hasRuleConstraint:
            hasRuleConstraint ? 1 : 0,
          hasPunjabiText:
            hasPunjabiText ? 1 : 0,
        },
      };
    },
  };
}

export function createDomainAdapters(
  deps: AdapterDependencies,
): DomainAdapterRegistry {
  return {
    quant: buildQuestionAdapter(
      "quant",
      deps.createFormulaQuestionCandidate,
      {
        maxAttemptsMultiplier: 12,
        minAttempts: 20,
        customValidationStages: [
          buildQuantEquationStage(),
        ],
        difficultyContribution:
          buildQuantDifficultyContribution,
      },
    ),
    "quant-v2-percentage": buildQuestionAdapter(
      "quant-v2-percentage",
      deps.createQuantV2PercentageQuestionCandidate,
      {
        maxAttemptsMultiplier: 12,
        minAttempts: 20,
        difficultyContribution:
          buildQuantDifficultyContribution,
      },
    ),
    "quant-v2-profit-loss": buildQuestionAdapter(
      "quant-v2-profit-loss",
      deps.createQuantV2ProfitLossQuestionCandidate,
      {
        maxAttemptsMultiplier: 12,
        minAttempts: 20,
        difficultyContribution:
          buildQuantDifficultyContribution,
      },
    ),
    "quant-v2-interest": buildQuestionAdapter(
      "quant-v2-interest",
      deps.createQuantV2InterestQuestionCandidate,
      {
        maxAttemptsMultiplier: 12,
        minAttempts: 20,
        difficultyContribution:
          buildQuantDifficultyContribution,
      },
    ),
    "quant-v2-ratio-proportion": buildQuestionAdapter(
      "quant-v2-ratio-proportion",
      deps.createQuantV2RatioProportionQuestionCandidate,
      {
        maxAttemptsMultiplier: 12,
        minAttempts: 20,
        difficultyContribution:
          buildQuantDifficultyContribution,
      },
    ),
    "quant-v2-time-work": buildQuestionAdapter(
      "quant-v2-time-work",
      deps.createQuantV2TimeWorkQuestionCandidate,
      {
        maxAttemptsMultiplier: 12,
        minAttempts: 20,
        difficultyContribution:
          buildQuantDifficultyContribution,
      },
    ),
    reasoning:
      buildQuestionAdapter(
        "reasoning",
        deps.createReasoningQuestionCandidate,
        {
          maxAttemptsMultiplier: 10,
          minAttempts: 16,
          customValidationStages: [
            buildReasoningTopologyStage(),
          ],
          difficultyContribution:
            buildReasoningDifficultyContribution,
        },
      ),
    "seating-arrangement":
      buildQuestionAdapter(
        "seating-arrangement",
        deps.createSeatingQuestionCandidate,
        {
          maxAttemptsMultiplier: 10,
          minAttempts: 16,
          customValidationStages: [
            buildReasoningTopologyStage(),
          ],
          difficultyContribution:
            buildReasoningDifficultyContribution,
        },
      ),
    english: buildQuestionAdapter(
      "english",
      deps.createEnglishQuestionCandidate,
      {
        maxAttemptsMultiplier: 10,
        minAttempts: 16,
        customValidationStages: [
          buildEnglishGrammarStage(),
        ],
        difficultyContribution:
          buildEnglishDifficultyContribution,
      },
    ),
    punjabi: buildQuestionAdapter(
      "punjabi",
      deps.createPunjabiQuestionCandidate,
      {
        maxAttemptsMultiplier: 10,
        minAttempts: 16,
        customValidationStages: [
          buildPunjabiVyakaranStage(),
        ],
        difficultyContribution:
          buildEnglishDifficultyContribution,
      },
    ),
    knowledge: buildQuestionAdapter(
      "knowledge",
      deps.createKnowledgeQuestionCandidate,
      {
        maxAttemptsMultiplier: 6,
        minAttempts: 8,
        difficultyContribution:
          buildEnglishDifficultyContribution,
      },
    ),
    computer: buildQuestionAdapter(
      "computer",
      deps.createKnowledgeQuestionCandidate,
      {
        maxAttemptsMultiplier: 6,
        minAttempts: 8,
        difficultyContribution:
          buildEnglishDifficultyContribution,
      },
    ),
    di: {
      domain: "di",
      generationMode: "single",
      generateScenario(context) {
        const diSet =
          deps.createDIQuestionSet(
            context.pattern,
            context.options,
          );
        return this.hydrateScenario(
          context.pattern,
          diSet,
        );
      },
      hydrateScenario(
        pattern,
        realizedQuestion,
      ) {
        return createScenario(
          "di",
          pattern,
          realizedQuestion,
          [],
          buildDIDifficultyContribution(
            realizedQuestion,
          ),
        );
      },
      validateScenario(scenario) {
        return scenario.validationReport;
      },
      realizeScenario(scenario) {
        return scenario.realizedQuestion;
      },
      analyzeDifficulty(scenario) {
        return scenario.difficultyMetrics;
      },
      generateExplanation(scenario) {
        return scenario.explanationResult;
      },
    },
  };
}

export function resolveDomainAdapter(
  registry: DomainAdapterRegistry,
  domain: string,
) {
  return (
    registry[domain] ??
    registry.quant
  );
}
