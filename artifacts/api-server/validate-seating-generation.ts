import type {
  DifficultyLabel,
  Pattern,
} from "./src/lib/core/generator-engine";
import {
  buildClueGraphAnalysis,
} from "./src/lib/reasoning/seating/clue-graph";
import {
  seatingArrangementMotifs,
} from "./src/lib/motifs/seating-arrangement";
import {
  createSeatingScenario,
} from "./src/lib/reasoning/seating-arrangement";

type ValidationProfile = {
  id:
    | "linear"
    | "circular"
    | "alternate-facing";
  count: number;
  difficulty: DifficultyLabel;
  motifIds: string[];
  pattern: Pattern;
};

type ValidationSummary = {
  profile: ValidationProfile["id"];
  generated: number;
  uniquenessFailures: number;
  contradictionLeaks: number;
  repeatedAdjacencySerializations: number;
  avgInferenceDepth: number;
  avgEliminationDepth: number;
  avgClueGraphDensity: number;
  avgInteractionRatio: number;
  avgStructuralDiversityScore: number;
  interactionHeavyRate: number;
  uniqueTopologyCount: number;
  maxTopologyRepeat: number;
  generationAttempts: number;
  generationErrors: number;
  generationTimeMs: number;
  samplePuzzles: Array<{
    arrangementType: string;
    orientationType: string;
    prompt: string;
    clues: string[];
    finalArrangement: string;
  }>;
};

const PROFILE_FILTER =
  process.env["SEATING_PROFILE"];
const COUNT_OVERRIDE = Number(
  process.env[
    "SEATING_VALIDATION_COUNT"
  ] ?? "",
);
const ATTEMPT_MULTIPLIER =
  Number(
    process.env[
      "SEATING_VALIDATION_ATTEMPT_MULTIPLIER"
    ] ?? "",
  );

const PROFILES: ValidationProfile[] = [
  {
    id: "linear",
    count: 1000,
    difficulty: "Medium",
    motifIds: [
      "direct_clue_linear",
      "neighbor_clue_linear",
      "relative_position_clue",
    ],
    pattern: {
      id: "validation-linear",
      type: "logic",
      generationDomain:
        "seating-arrangement",
      section: "Reasoning",
      topic: "Seating Arrangement",
      subtopic: "Linear Seating",
      difficulty: "Medium",
      supportedQuestionTypes: [
        "logic",
      ],
      templateVariants: [
        "Solve the seating arrangement carefully.",
      ],
      variables: {},
      arrangementType: "linear",
      orientationTypes: [
        "north",
        "south",
      ],
      participantCount: 6,
      clueTypes: [
        "left-right",
        "neighbor",
        "distance",
        "not-adjacent",
        "between",
      ],
      inferenceDepth: 4,
    },
  },
  {
    id: "circular",
    count: 1000,
    difficulty: "Medium",
    motifIds: [
      "circular_opposite_chain",
      "relative_position_clue",
      "row_facing_inference",
    ],
    pattern: {
      id: "validation-circular",
      type: "logic",
      generationDomain:
        "seating-arrangement",
      section: "Reasoning",
      topic: "Seating Arrangement",
      subtopic: "Circular Seating",
      difficulty: "Medium",
      supportedQuestionTypes: [
        "logic",
      ],
      templateVariants: [
        "Read the circular seating clues carefully.",
      ],
      variables: {},
      arrangementTypes: [
        "circular",
      ],
      orientationTypes: [
        "center",
        "outward",
      ],
      participantCount: 6,
      clueTypes: [
        "neighbor",
        "left-right",
        "distance",
        "opposite",
        "not-opposite",
        "between",
      ],
      inferenceDepth: 5,
    },
  },
  {
    id: "alternate-facing",
    count: 1000,
    difficulty: "Hard",
    motifIds: [
      "alternate_facing_deduction",
      "relative_position_clue",
      "neighbor_clue_linear",
    ],
    pattern: {
      id: "validation-alternate",
      type: "logic",
      generationDomain:
        "seating-arrangement",
      section: "Reasoning",
      topic: "Seating Arrangement",
      subtopic:
        "Alternate Facing Seating",
      difficulty: "Hard",
      supportedQuestionTypes: [
        "logic",
      ],
      templateVariants: [
        "Use the clues to infer the alternate-facing arrangement.",
      ],
      variables: {},
      arrangementType: "linear",
      orientationTypes: [
        "alternate",
      ],
      participantCount: 6,
      clueTypes: [
        "left-right",
        "neighbor",
        "distance",
        "between",
        "adjacent-both",
        "not-adjacent",
      ],
      inferenceDepth: 6,
    },
  },
];

function round(
  value: number,
  digits = 3,
) {
  return Number(
    value.toFixed(digits),
  );
}

function average(
  values: number[],
) {
  if (!values.length) {
    return 0;
  }

  return values.reduce(
    (sum, value) => sum + value,
    0,
  ) / values.length;
}

function buildSummary(
  profile: ValidationProfile,
) : ValidationSummary {
  const targetCount =
    Number.isFinite(COUNT_OVERRIDE) &&
    COUNT_OVERRIDE > 0
      ? Math.floor(
          COUNT_OVERRIDE,
        )
      : profile.count;
  const topologyCounts =
    new Map<string, number>();
  const inferenceDepths: number[] =
    [];
  const eliminationDepths: number[] =
    [];
  const densities: number[] = [];
  const interactionRatios: number[] =
    [];
  const diversityScores: number[] =
    [];
  const samplePuzzles: ValidationSummary["samplePuzzles"] =
    [];
  let uniquenessFailures = 0;
  let contradictionLeaks = 0;
  let repeatedAdjacencySerializations = 0;
  let interactionHeavyCount = 0;
  let generationAttempts = 0;
  let generationErrors = 0;
  const startedAt = Date.now();
  const motifs =
    profile.motifIds
      .map((id) =>
        seatingArrangementMotifs.find(
          (motif) => motif.id === id,
        ),
      )
      .filter(
        (
          motif,
        ): motif is (typeof seatingArrangementMotifs)[number] =>
          Boolean(motif),
      );
  const maxAttempts =
    targetCount *
    (Number.isFinite(
      ATTEMPT_MULTIPLIER,
    ) &&
    ATTEMPT_MULTIPLIER > 0
      ? Math.floor(
          ATTEMPT_MULTIPLIER,
        )
      : 5);

  for (
    let index = 0;
    index < maxAttempts &&
    inferenceDepths.length <
      targetCount;
    index++
  ) {
    generationAttempts += 1;
    const motif =
      motifs[index % motifs.length] ??
      seatingArrangementMotifs[
        index %
          seatingArrangementMotifs.length
      ]!;
    let scenario: ReturnType<
      typeof createSeatingScenario
    >;

    try {
      scenario =
        createSeatingScenario(
          motif,
          profile.difficulty,
          profile.pattern,
        );
    } catch {
      generationErrors += 1;
      continue;
    }
    const graphAnalysis =
      buildClueGraphAnalysis(
        scenario.clues,
        scenario.arrangementType,
        scenario.orientationType,
      );

    topologyCounts.set(
      graphAnalysis.topologySignature,
      (topologyCounts.get(
        graphAnalysis.topologySignature,
      ) ?? 0) + 1,
    );

    if (!scenario.uniquenessVerified) {
      uniquenessFailures += 1;
    }

    if (
      scenario.validationWarnings.some(
        (warning) =>
          warning.includes(
            "contradicted",
          ) ||
          warning.includes(
            "multiple valid",
          ) ||
          warning.includes(
            "No valid seating arrangement",
          ),
      )
    ) {
      contradictionLeaks += 1;
    }

    if (
      graphAnalysis.repeatedAdjacencySerialization
    ) {
      repeatedAdjacencySerializations += 1;
    }

    if (
      scenario.clueInteractionRatio >=
      0.4
    ) {
      interactionHeavyCount += 1;
    }

    inferenceDepths.push(
      scenario.inferenceDepth,
    );
    eliminationDepths.push(
      scenario.eliminationDepth,
    );
    densities.push(
      scenario.clueGraphDensity,
    );
    interactionRatios.push(
      scenario.clueInteractionRatio,
    );
    diversityScores.push(
      scenario.structuralDiversityScore,
    );

    if (samplePuzzles.length < 3) {
      samplePuzzles.push({
        arrangementType:
          scenario.arrangementType,
        orientationType:
          scenario.orientationType,
        prompt:
          scenario.prompt.prompt,
        clues:
          scenario.generatedClues,
        finalArrangement:
          scenario.finalArrangement,
      });
    }
  }

  return {
    profile: profile.id,
    generated:
      inferenceDepths.length,
    uniquenessFailures,
    contradictionLeaks,
    repeatedAdjacencySerializations,
    avgInferenceDepth: round(
      average(inferenceDepths),
    ),
    avgEliminationDepth: round(
      average(eliminationDepths),
    ),
    avgClueGraphDensity: round(
      average(densities),
    ),
    avgInteractionRatio: round(
      average(interactionRatios),
    ),
    avgStructuralDiversityScore:
      round(
        average(diversityScores),
      ),
    interactionHeavyRate: round(
      interactionHeavyCount /
        Math.max(
          inferenceDepths.length,
          1,
        ),
    ),
    uniqueTopologyCount:
      topologyCounts.size,
    maxTopologyRepeat: Math.max(
      0,
      ...topologyCounts.values(),
    ),
    generationAttempts,
    generationErrors,
    generationTimeMs:
      Date.now() - startedAt,
    samplePuzzles,
  };
}

function main() {
  const filteredProfiles =
    PROFILE_FILTER
      ? PROFILES.filter(
          (profile) =>
            profile.id ===
            PROFILE_FILTER,
        )
      : PROFILES;
  const summaries =
    filteredProfiles.map(
      buildSummary,
    );

  console.log(
    JSON.stringify(
      {
        generatedAt:
          new Date().toISOString(),
        totalProfiles:
          summaries.length,
        totalPuzzles:
          summaries.reduce(
            (sum, summary) =>
              sum + summary.generated,
            0,
          ),
        summaries,
      },
      null,
      2,
    ),
  );
}

main();
