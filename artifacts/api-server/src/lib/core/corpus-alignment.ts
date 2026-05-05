import type {
  ExtractedPatternIntelligence,
} from "./pattern-extractors";
import type {
  GeneratedQuestion,
  ExamProfileId,
} from "./generator-engine";

type NumericRange = [number, number];

type DomainCorpusProfile = {
  clueDensityRange?: NumericRange;
  topologyWeights?: Record<
    string,
    number
  >;
  inferenceDepthRange?: NumericRange;
  distractorTypeWeights?: Record<
    string,
    number
  >;
  wordingComplexityRange?: NumericRange;
  formulaComplexityRange?: NumericRange;
  grammarTrapFrequencyRange?: NumericRange;
};

export type CorpusAlignmentDeviation =
  {
    metric: string;
    actual: number | string;
    expected: string;
    delta?: number;
    message: string;
  };

export type CorpusAlignmentScore = {
  score: number;
  deviations: CorpusAlignmentDeviation[];
  matchedPatterns: string[];
};

type CorpusExamProfile =
  | ExamProfileId
  | "default";

const DEFAULT_DOMAIN_PROFILES: Record<
  string,
  DomainCorpusProfile
> = {
  reasoning: {
    clueDensityRange: [0.45, 0.9],
    topologyWeights: {
      linear: 0.32,
      circular: 0.28,
      "double-row": 0.16,
      alternate: 0.14,
      rectangular: 0.1,
    },
    inferenceDepthRange: [3.5, 6.8],
    distractorTypeWeights: {
      "generic-distractor": 0.3,
      elimination: 0.22,
      orientation: 0.18,
      adjacency: 0.15,
    },
    wordingComplexityRange: [10, 20],
  },
  "seating-arrangement": {
    clueDensityRange: [0.48, 0.9],
    topologyWeights: {
      linear: 0.32,
      circular: 0.28,
      "double-row": 0.16,
      alternate: 0.14,
      rectangular: 0.1,
    },
    inferenceDepthRange: [3.8, 7],
    distractorTypeWeights: {
      "generic-distractor": 0.28,
      elimination: 0.26,
      orientation: 0.18,
      adjacency: 0.14,
    },
    wordingComplexityRange: [10, 20],
  },
  quant: {
    inferenceDepthRange: [1.8, 4.6],
    distractorTypeWeights: {
      arithmeticSlip: 0.24,
      percentageTrap: 0.22,
      wrongIntermediateValue: 0.18,
      wrongDenominator: 0.14,
      "generic-distractor": 0.12,
    },
    wordingComplexityRange: [8, 16],
    formulaComplexityRange: [1.8, 5.4],
  },
  english: {
    inferenceDepthRange: [1.6, 4.2],
    distractorTypeWeights: {
      "generic-distractor": 0.26,
      "grammar-ambiguity": 0.28,
      "modifier-attachment": 0.18,
    },
    wordingComplexityRange: [8, 18],
    grammarTrapFrequencyRange: [0.12, 0.38],
  },
  di: {
    inferenceDepthRange: [2.2, 5.6],
    distractorTypeWeights: {
      "generic-distractor": 0.18,
      comparisonTrap: 0.22,
      wrongIntermediateValue: 0.18,
      wrongDenominator: 0.14,
    },
    wordingComplexityRange: [7, 15],
    formulaComplexityRange: [1.4, 4.6],
  },
};

const PROFILE_OVERRIDES: Record<
  CorpusExamProfile,
  Partial<
    Record<string, DomainCorpusProfile>
  >
> = {
  default: {},
  custom: {},
  ssc: {
    reasoning: {
      clueDensityRange: [0.52, 0.92],
      inferenceDepthRange: [3, 5.4],
      wordingComplexityRange: [8, 15],
    },
    "seating-arrangement": {
      clueDensityRange: [0.52, 0.92],
      inferenceDepthRange: [3, 5.4],
      wordingComplexityRange: [8, 15],
    },
    quant: {
      formulaComplexityRange: [1.4, 3.4],
      wordingComplexityRange: [7, 13],
    },
  },
  ibps: {
    reasoning: {
      clueDensityRange: [0.45, 0.82],
      inferenceDepthRange: [4.2, 6.8],
      wordingComplexityRange: [10, 18],
    },
    "seating-arrangement": {
      clueDensityRange: [0.45, 0.82],
      inferenceDepthRange: [4.2, 6.8],
      wordingComplexityRange: [10, 18],
    },
    di: {
      formulaComplexityRange: [1.8, 4.8],
    },
  },
  cat: {
    reasoning: {
      clueDensityRange: [0.36, 0.72],
      inferenceDepthRange: [5.6, 8.5],
      wordingComplexityRange: [12, 22],
    },
    "seating-arrangement": {
      clueDensityRange: [0.36, 0.72],
      inferenceDepthRange: [5.6, 8.5],
      wordingComplexityRange: [12, 22],
    },
    quant: {
      formulaComplexityRange: [3.2, 6.8],
      wordingComplexityRange: [10, 18],
    },
  },
  sbi: {
    reasoning: {
      inferenceDepthRange: [4.6, 7.2],
    },
    "seating-arrangement": {
      inferenceDepthRange: [4.6, 7.2],
    },
  },
  rrb: {
    reasoning: {
      clueDensityRange: [0.55, 1],
      inferenceDepthRange: [2.8, 4.8],
      wordingComplexityRange: [7, 14],
    },
    "seating-arrangement": {
      clueDensityRange: [0.55, 1],
      inferenceDepthRange: [2.8, 4.8],
      wordingComplexityRange: [7, 14],
    },
  },
};

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function round(
  value: number,
  digits = 2,
) {
  return Number(value.toFixed(digits));
}

function scoreAgainstRange(
  value: number,
  range?: NumericRange,
) {
  if (!range) {
    return 10;
  }

  const [min, max] = range;

  if (value >= min && value <= max) {
    return 10;
  }

  const tolerance =
    Math.max((max - min) * 0.75, 0.08);
  const distance =
    value < min
      ? min - value
      : value - max;

  return round(
    clamp(
      10 - (distance / tolerance) * 10,
      0,
      10,
    ),
  );
}

function getPrimaryQuestion(
  question?: GeneratedQuestion,
) {
  if (!question) {
    return undefined;
  }

  return "questionType" in question &&
    question.questionType === "di"
    ? question.questions[0]
    : question;
}

function getActiveProfile(
  domain: string,
  examProfile?: ExamProfileId,
) {
  const base =
    DEFAULT_DOMAIN_PROFILES[domain] ??
    DEFAULT_DOMAIN_PROFILES.quant;
  const override =
    PROFILE_OVERRIDES[
      examProfile ?? "default"
    ]?.[domain] ?? {};

  return {
    ...base,
    ...override,
  };
}

function estimateWordingComplexity(
  question?: GeneratedQuestion,
) {
  const primaryQuestion =
    getPrimaryQuestion(question);
  const text =
    primaryQuestion?.text ?? "";

  if (!text.trim()) {
    return 0;
  }

  const tokens = text
    .split(/\s+/)
    .filter(Boolean);
  const avgTokenLength =
    tokens.reduce(
      (sum, token) =>
        sum + token.length,
      0,
    ) / Math.max(tokens.length, 1);
  const clauseCount =
    text.split(/[,:;()]/).length;

  return round(
    tokens.length * 0.55 +
      avgTokenLength * 0.8 +
      clauseCount * 0.7,
  );
}

function estimateFormulaComplexity(
  extracted: ExtractedPatternIntelligence,
) {
  return round(
    extracted.difficulty
      .calculationComplexity ??
      0,
  );
}

function estimateGrammarTrapFrequency(
  extracted: ExtractedPatternIntelligence,
) {
  if (extracted.domain !== "english") {
    return 0;
  }

  const grammarMotifs =
    extracted.motifs.filter(
      (motif) =>
        motif.archetype.includes(
          "grammar",
        ) ||
        motif.archetype.includes(
          "ambiguity",
        ),
    ).length;
  const distractorTotal =
    extracted.distractors.reduce(
      (sum, distractor) =>
        sum + distractor.frequency,
      0,
    );

  if (distractorTotal === 0) {
    return round(grammarMotifs * 0.1);
  }

  const grammarDistractors =
    extracted.distractors.reduce(
      (sum, distractor) =>
        sum +
        (distractor.type
          .toLowerCase()
          .includes("grammar")
          ? distractor.frequency
          : 0),
      0,
    );

  return round(
    (grammarDistractors /
      distractorTotal) *
      0.7 +
      grammarMotifs * 0.15,
  );
}

function getTopDistractorPattern(
  extracted: ExtractedPatternIntelligence,
) {
  return [
    ...extracted.distractors,
  ].sort(
    (left, right) =>
      right.frequency -
      left.frequency,
  )[0];
}

export function buildCorpusAlignmentScore(
  extracted: ExtractedPatternIntelligence,
  question?: GeneratedQuestion,
  examProfile?: ExamProfileId,
): CorpusAlignmentScore {
  const profile = getActiveProfile(
    extracted.domain,
    examProfile,
  );
  const deviations: CorpusAlignmentDeviation[] =
    [];
  const matchedPatterns: string[] = [];
  const componentScores: number[] = [];

  const clueDensity =
    extracted.structure.constraintCount /
    Math.max(
      extracted.structure.entityCount,
      1,
    );
  const clueDensityScore =
    scoreAgainstRange(
      clueDensity,
      profile.clueDensityRange,
    );
  componentScores.push(clueDensityScore);
  if (clueDensityScore >= 7.5) {
    matchedPatterns.push(
      "Clue density aligns with extracted PYQ corpus ranges.",
    );
  } else if (
    profile.clueDensityRange
  ) {
    deviations.push({
      metric: "clue-density",
      actual: round(clueDensity),
      expected: `${profile.clueDensityRange[0]}-${profile.clueDensityRange[1]}`,
      delta: round(
        Math.min(
          Math.abs(
            clueDensity -
              profile
                .clueDensityRange[0],
          ),
          Math.abs(
            clueDensity -
              profile
                .clueDensityRange[1],
          ),
        ),
      ),
      message:
        "Clue density deviates from corpus-calibrated expectations.",
    });
  }

  const topology =
    extracted.structure.topology ??
    extracted.structure.subtype;
  const topologyWeight =
    profile.topologyWeights?.[
      topology
    ] ??
    profile.topologyWeights?.[
      topology.toLowerCase()
    ];
  const topologyScore =
    typeof topologyWeight === "number"
      ? round(
        clamp(
          topologyWeight * 20,
          0,
          10,
        ),
      )
      : 7;
  componentScores.push(topologyScore);
  if (topologyScore >= 7.5) {
    matchedPatterns.push(
      `Topology ${topology} is well represented in the PYQ-derived distribution.`,
    );
  } else {
    deviations.push({
      metric: "topology-frequency",
      actual: topology,
      expected: "higher-frequency corpus topology",
      message:
        "Topology is less common than the target corpus profile.",
    });
  }

  const inferenceDepthScore =
    scoreAgainstRange(
      extracted.difficulty
        .inferenceDepth,
      profile.inferenceDepthRange,
    );
  componentScores.push(
    inferenceDepthScore,
  );
  if (inferenceDepthScore >= 7.5) {
    matchedPatterns.push(
      "Inference depth tracks the target corpus difficulty curve.",
    );
  } else if (
    profile.inferenceDepthRange
  ) {
    deviations.push({
      metric: "inference-depth",
      actual:
        extracted.difficulty
          .inferenceDepth,
      expected: `${profile.inferenceDepthRange[0]}-${profile.inferenceDepthRange[1]}`,
      delta: round(
        Math.min(
          Math.abs(
            extracted.difficulty
              .inferenceDepth -
              profile
                .inferenceDepthRange[0],
          ),
          Math.abs(
            extracted.difficulty
              .inferenceDepth -
              profile
                .inferenceDepthRange[1],
          ),
        ),
      ),
      message:
        "Inference depth sits outside the expected corpus band.",
    });
  }

  const topDistractor =
    getTopDistractorPattern(
      extracted,
    );
  const distractorScore =
    topDistractor
      ? round(
        clamp(
          (profile
            .distractorTypeWeights?.[
            topDistractor.type
          ] ?? 0.35) * 20,
          0,
          10,
        ),
      )
      : 6;
  componentScores.push(
    distractorScore,
  );
  if (distractorScore >= 7.5) {
    matchedPatterns.push(
      "Dominant distractor pattern matches extracted corpus tendencies.",
    );
  } else if (topDistractor) {
    deviations.push({
      metric: "distractor-pattern",
      actual: topDistractor.type,
      expected:
        "higher-frequency corpus distractor families",
      message:
        "Distractor distribution is weaker or less corpus-like than expected.",
    });
  }

  const wordingComplexity =
    estimateWordingComplexity(
      question,
    );
  const wordingScore =
    scoreAgainstRange(
      wordingComplexity,
      profile.wordingComplexityRange,
    );
  componentScores.push(wordingScore);
  if (wordingScore >= 7.5) {
    matchedPatterns.push(
      "Wording complexity resembles the PYQ corpus style.",
    );
  } else if (
    profile.wordingComplexityRange
  ) {
    deviations.push({
      metric: "wording-complexity",
      actual: wordingComplexity,
      expected: `${profile.wordingComplexityRange[0]}-${profile.wordingComplexityRange[1]}`,
      message:
        "Question wording is simpler or denser than the target corpus.",
    });
  }

  if (
    extracted.domain === "quant" ||
    extracted.domain === "di"
  ) {
    const formulaComplexity =
      estimateFormulaComplexity(
        extracted,
      );
    const formulaScore =
      scoreAgainstRange(
        formulaComplexity,
        profile.formulaComplexityRange,
      );
    componentScores.push(formulaScore);
    if (formulaScore >= 7.5) {
      matchedPatterns.push(
        "Formula/calculation complexity aligns with corpus behavior.",
      );
    } else if (
      profile.formulaComplexityRange
    ) {
      deviations.push({
        metric: "formula-complexity",
        actual: formulaComplexity,
        expected: `${profile.formulaComplexityRange[0]}-${profile.formulaComplexityRange[1]}`,
        message:
          "Computation load departs from the target corpus distribution.",
      });
    }
  }

  if (extracted.domain === "english") {
    const grammarTrapFrequency =
      estimateGrammarTrapFrequency(
        extracted,
      );
    const grammarTrapScore =
      scoreAgainstRange(
        grammarTrapFrequency,
        profile.grammarTrapFrequencyRange,
      );
    componentScores.push(
      grammarTrapScore,
    );
    if (grammarTrapScore >= 7.5) {
      matchedPatterns.push(
        "Grammar trap frequency resembles the curated corpus.",
      );
    } else if (
      profile.grammarTrapFrequencyRange
    ) {
      deviations.push({
        metric: "grammar-trap-frequency",
        actual: grammarTrapFrequency,
        expected: `${profile.grammarTrapFrequencyRange[0]}-${profile.grammarTrapFrequencyRange[1]}`,
        message:
          "Grammar trap usage is misaligned with the target corpus.",
      });
    }
  }

  return {
    score: round(
      componentScores.reduce(
        (sum, score) => sum + score,
        0,
      ) /
        Math.max(
          componentScores.length,
          1,
        ),
    ),
    deviations,
    matchedPatterns: [
      ...new Set(matchedPatterns),
    ],
  };
}
