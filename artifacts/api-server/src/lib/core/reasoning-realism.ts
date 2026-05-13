import type {
  SeatingScenario,
} from "../reasoning/seating-engine";

type RealismExamProfile =
  | "custom"
  | "ssc"
  | "ibps"
  | "cat"
  | "sbi"
  | "rrb"
  | "punjab_state";

type RealismHeuristicProfile = {
  anchorDensityRange: [number, number];
  directClueRatioRange: [number, number];
  clueDensityRange: [number, number];
  interactionRange: [number, number];
  branchingComplexityRange: [number, number];
  inferenceDepthRange: [number, number];
  deductionDependencyRange: [number, number];
};

export type ReasoningRealismAnalysis = {
  overallScore: number;
  band:
    | "low"
    | "moderate"
    | "strong"
    | "pyq-like";
  clueNaturalness: number;
  anchorDensity: number;
  deductionSmoothness: number;
  branchingQuality: number;
  topologyDiversity: number;
  overconstraintDetection: number;
  pyqHeuristicAlignment: number;
  penalties: string[];
  matchedHeuristics: string[];
  diagnosticSummary: string[];
};

const REALISM_HEURISTICS: Record<
  RealismExamProfile,
  RealismHeuristicProfile
> = {
  custom: {
    anchorDensityRange: [0.16, 0.34],
    directClueRatioRange: [0.18, 0.36],
    clueDensityRange: [0.45, 0.95],
    interactionRange: [0.48, 0.82],
    branchingComplexityRange: [0.12, 0.5],
    inferenceDepthRange: [3.5, 6.8],
    deductionDependencyRange: [1.2, 4.8],
  },
  ssc: {
    anchorDensityRange: [0.2, 0.36],
    directClueRatioRange: [0.22, 0.4],
    clueDensityRange: [0.52, 0.92],
    interactionRange: [0.45, 0.74],
    branchingComplexityRange: [0.08, 0.3],
    inferenceDepthRange: [3, 5.4],
    deductionDependencyRange: [1, 3.6],
  },
  ibps: {
    anchorDensityRange: [0.16, 0.3],
    directClueRatioRange: [0.15, 0.3],
    clueDensityRange: [0.45, 0.82],
    interactionRange: [0.54, 0.86],
    branchingComplexityRange: [0.18, 0.6],
    inferenceDepthRange: [4.2, 6.8],
    deductionDependencyRange: [2.2, 5.4],
  },
  cat: {
    anchorDensityRange: [0.08, 0.24],
    directClueRatioRange: [0.06, 0.22],
    clueDensityRange: [0.36, 0.72],
    interactionRange: [0.62, 0.94],
    branchingComplexityRange: [0.24, 0.72],
    inferenceDepthRange: [5.6, 8.5],
    deductionDependencyRange: [3.4, 7.2],
  },
  sbi: {
    anchorDensityRange: [0.14, 0.28],
    directClueRatioRange: [0.12, 0.28],
    clueDensityRange: [0.44, 0.8],
    interactionRange: [0.55, 0.88],
    branchingComplexityRange: [0.2, 0.62],
    inferenceDepthRange: [4.6, 7.2],
    deductionDependencyRange: [2.6, 5.8],
  },
  rrb: {
    anchorDensityRange: [0.22, 0.4],
    directClueRatioRange: [0.24, 0.42],
    clueDensityRange: [0.55, 1],
    interactionRange: [0.42, 0.7],
    branchingComplexityRange: [0.05, 0.24],
    inferenceDepthRange: [2.8, 4.8],
    deductionDependencyRange: [0.8, 3],
  },
  punjab_state: {
    anchorDensityRange: [0.2, 0.38],
    directClueRatioRange: [0.22, 0.4],
    clueDensityRange: [0.52, 0.96],
    interactionRange: [0.44, 0.74],
    branchingComplexityRange: [0.07, 0.3],
    inferenceDepthRange: [3, 5.2],
    deductionDependencyRange: [1, 3.4],
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

function roundScore(value: number) {
  return Number(
    clamp(value, 0, 10).toFixed(2),
  );
}

function scoreAgainstRange(
  value: number,
  range: [number, number],
) {
  const [min, max] = range;

  if (value >= min && value <= max) {
    return 10;
  }

  const distance =
    value < min
      ? min - value
      : value - max;
  const tolerance =
    Math.max((max - min) * 0.75, 0.08);

  return roundScore(
    10 - (distance / tolerance) * 10,
  );
}

function estimateTemplateRepetitionRatio(
  generatedClues: string[],
) {
  if (!generatedClues.length) {
    return 0;
  }

  const normalized = generatedClues.map(
    (clue) =>
      clue
        .toLowerCase()
        .replace(/\b[a-z][a-z]+\b/g, "x")
        .replace(/\d+/g, "#")
        .replace(/\s+/g, " ")
        .trim(),
  );
  const frequencies =
    normalized.reduce(
      (accumulator, template) => {
        accumulator[template] =
          (accumulator[template] ?? 0) + 1;
        return accumulator;
      },
      {} as Record<string, number>,
    );
  const repeatedCount = Object.values(
    frequencies,
  ).reduce(
    (total, count) =>
      total + Math.max(0, count - 1),
    0,
  );

  return (
    repeatedCount /
    Math.max(generatedClues.length, 1)
  );
}

function getDistinctClueFamilyRatio(
  clueTypeDistribution: Record<
    string,
    number
  >,
) {
  const familyCount = Object.keys(
    clueTypeDistribution,
  ).length;
  const total = Object.values(
    clueTypeDistribution,
  ).reduce(
    (sum, count) => sum + count,
    0,
  );

  return total > 0
    ? familyCount /
        Math.min(total, 6)
    : 0;
}

function getRealismBand(
  score: number,
): ReasoningRealismAnalysis["band"] {
  if (score >= 8.5) {
    return "pyq-like";
  }

  if (score >= 6.75) {
    return "strong";
  }

  if (score >= 4.5) {
    return "moderate";
  }

  return "low";
}

export function buildSeatingRealismAnalysis(
  scenario: SeatingScenario,
  examProfile: RealismExamProfile = "custom",
): ReasoningRealismAnalysis {
  const heuristics =
    REALISM_HEURISTICS[examProfile] ??
    REALISM_HEURISTICS.custom;
  const penalties: string[] = [];
  const matchedHeuristics: string[] = [];
  const diagnosticSummary: string[] = [];
  const templateRepetitionRatio =
    estimateTemplateRepetitionRatio(
      scenario.generatedClues,
    );
  const clueFamilyRatio =
    getDistinctClueFamilyRatio(
      scenario.clueTypeDistribution,
    );

  const clueNaturalnessBase =
    scoreAgainstRange(
      scenario.directClueRatio,
      heuristics.directClueRatioRange,
    ) *
      0.35 +
    scoreAgainstRange(
      scenario.clueInteractionRatio,
      heuristics.interactionRange,
    ) *
      0.25 +
    roundScore(clueFamilyRatio * 10) *
      0.2 +
    scoreAgainstRange(
      1 - templateRepetitionRatio,
      [0.7, 1],
    ) *
      0.2;

  let clueNaturalness =
    roundScore(clueNaturalnessBase);

  if (
    scenario.redundancyRatio > 0.32
  ) {
    clueNaturalness =
      roundScore(
        clueNaturalness - 1.2,
      );
    penalties.push(
      "Overexplained clue set reduces naturalness.",
    );
  }

  if (
    scenario.directClueRatio >
    heuristics.directClueRatioRange[1]
  ) {
    penalties.push(
      "Excessive direct placements make the puzzle feel machine-generated.",
    );
  } else {
    matchedHeuristics.push(
      "Direct clue ratio stays within PYQ-style bounds.",
    );
  }

  if (
    templateRepetitionRatio > 0.24
  ) {
    penalties.push(
      "Repeated clue templates reduce setter realism.",
    );
  } else {
    matchedHeuristics.push(
      "Clue phrasings remain structurally varied.",
    );
  }

  if (
    scenario.repeatedStructureWarnings
      .length > 0
  ) {
    penalties.push(
      "Structure warnings indicate repeated reasoning patterns.",
    );
  }

  if (
    scenario.directClueCount >=
      Math.max(
        3,
        Math.ceil(
          scenario.clueCount * 0.6,
        ),
      )
  ) {
    penalties.push(
      "Direct placements dominate instead of inference-led clues.",
    );
  }

  if (
    scenario.generatedClues.some((clue) =>
      clue.includes(
        "immediately left of",
      ),
    ) &&
    scenario.directClueRatio > 0.45
  ) {
    penalties.push(
      "Ordered adjacency is overused relative to richer clue families.",
    );
  }

  const anchorDensity =
    roundScore(
      scoreAgainstRange(
        scenario.anchorDensity,
        heuristics.anchorDensityRange,
      ),
    );
  if (
    anchorDensity >= 7.5
  ) {
    matchedHeuristics.push(
      "Anchor density is close to curated exam patterns.",
    );
  } else {
    diagnosticSummary.push(
      "Anchor usage is either too sparse for grounding or too dense for elegant deduction.",
    );
  }

  const deductionSmoothness =
    roundScore(
      scoreAgainstRange(
        scenario.clueInteractionRatio,
        heuristics.interactionRange,
      ) *
        0.4 +
        scoreAgainstRange(
          scenario.deductionDependencyScore,
          heuristics.deductionDependencyRange,
        ) *
          0.4 +
        scoreAgainstRange(
          scenario.inferenceDepth,
          heuristics.inferenceDepthRange,
        ) *
          0.2,
    );
  if (
    deductionSmoothness >= 7
  ) {
    matchedHeuristics.push(
      "Deduction flow resembles a layered coaching-style solve path.",
    );
  } else {
    diagnosticSummary.push(
      "Deduction flow is either too flat or too jumpy compared with curated PYQ heuristics.",
    );
  }

  const branchingQuality =
    roundScore(
      scoreAgainstRange(
        scenario.branchingComplexity,
        heuristics.branchingComplexityRange,
      ) *
        0.5 +
        scoreAgainstRange(
          scenario.branchingFactor,
          [0.04, 0.45],
        ) *
          0.2 +
        scoreAgainstRange(
          scenario.eliminationDepth,
          [1, 4],
        ) *
          0.3,
    );
  if (
    branchingQuality >= 7
  ) {
    matchedHeuristics.push(
      "Branching and elimination feel exam-like rather than arbitrary.",
    );
  } else if (
    scenario.branchingComplexity > 0.75
  ) {
    penalties.push(
      "Branching feels noisy rather than purposeful.",
    );
  }

  const topologyDiversity =
    roundScore(
      scenario.topologyDiversityScore *
        0.4 +
        scenario.clueDiversityScore *
          0.25 +
        scenario.inferenceDiversityScore *
          0.35,
    );
  if (
    topologyDiversity >= 7.25
  ) {
    matchedHeuristics.push(
      "Topology and clue mix differ meaningfully from prior generated structures.",
    );
  }

  let overconstraintDetection =
    roundScore(
      scoreAgainstRange(
        1 - scenario.redundancyRatio,
        [0.72, 1],
      ) *
        0.45 +
        scoreAgainstRange(
          1 - scenario.directClueRatio,
          [0.58, 0.92],
        ) *
          0.2 +
        scoreAgainstRange(
          scenario.originalClueCount -
            scenario.minimalClueCount,
          [0, 2],
        ) *
          0.15 +
        scoreAgainstRange(
          1 -
            Math.min(
              scenario.validationRetries /
                10,
              1,
            ),
          [0.25, 1],
        ) *
          0.2,
    );

  if (
    scenario.redundancyRatio > 0.4
  ) {
    overconstraintDetection =
      roundScore(
        overconstraintDetection - 1.5,
      );
    penalties.push(
      "High redundancy ratio suggests overconstraint.",
    );
  }

  if (
    scenario.originalClueCount -
      scenario.minimalClueCount >=
    3
  ) {
    penalties.push(
      "Too many removable clues indicate a non-minimal puzzle.",
    );
  } else {
    matchedHeuristics.push(
      "Clue set is close to minimal solvability.",
    );
  }

  const pyqHeuristicAlignment =
    roundScore(
      scoreAgainstRange(
        scenario.anchorDensity,
        heuristics.anchorDensityRange,
      ) *
        0.2 +
        scoreAgainstRange(
          scenario.directClueRatio,
          heuristics.directClueRatioRange,
        ) *
          0.2 +
        scoreAgainstRange(
          scenario.clueDensity,
          heuristics.clueDensityRange,
        ) *
          0.15 +
        scoreAgainstRange(
          scenario.clueInteractionRatio,
          heuristics.interactionRange,
        ) *
          0.15 +
        scoreAgainstRange(
          scenario.inferenceDepth,
          heuristics.inferenceDepthRange,
        ) *
          0.15 +
        scoreAgainstRange(
          scenario.branchingComplexity,
          heuristics.branchingComplexityRange,
        ) *
          0.15,
    );

  const overallScore =
    roundScore(
      clueNaturalness * 0.22 +
        anchorDensity * 0.14 +
        deductionSmoothness * 0.2 +
        branchingQuality * 0.15 +
        topologyDiversity * 0.14 +
        overconstraintDetection *
          0.15,
    );

  if (
    scenario.directClueRatio >
    0.5
  ) {
    penalties.push(
      "Excessive direct placements weaken exam realism.",
    );
  }

  if (
    scenario.redundancyScore >= 7.5
  ) {
    penalties.push(
      "Redundancy score is high enough to suggest the puzzle was overspecified.",
    );
  }

  if (
    scenario.generatedClues.filter(
      (clue) =>
        clue.includes(
          "immediately left of",
        ) ||
        clue.includes(
          "adjacent to",
        ),
    ).length >=
      Math.max(
        3,
        Math.ceil(
          scenario.clueCount * 0.55,
        ),
      )
  ) {
    penalties.push(
      "Adjacency chain behavior is too prominent.",
    );
  } else {
    matchedHeuristics.push(
      "Adjacency is present without degenerating into serialization.",
    );
  }

  diagnosticSummary.push(
    `PYQ alignment ${pyqHeuristicAlignment.toFixed(
      2,
    )}/10 against ${examProfile.toUpperCase()} heuristics.`,
  );
  diagnosticSummary.push(
    `Clue density ${scenario.clueDensity.toFixed(
      2,
    )}, direct clue ratio ${scenario.directClueRatio.toFixed(
      2,
    )}, redundancy ratio ${scenario.redundancyRatio.toFixed(
      2,
    )}.`,
  );

  return {
    overallScore,
    band: getRealismBand(
      overallScore,
    ),
    clueNaturalness,
    anchorDensity,
    deductionSmoothness,
    branchingQuality,
    topologyDiversity,
    overconstraintDetection,
    pyqHeuristicAlignment,
    penalties: [
      ...new Set(penalties),
    ],
    matchedHeuristics: [
      ...new Set(matchedHeuristics),
    ],
    diagnosticSummary,
  };
}
