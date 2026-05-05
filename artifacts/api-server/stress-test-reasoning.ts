import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
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

type StressTestProfile = {
  id:
    | "linear"
    | "circular"
    | "alternate-facing";
  count: number;
  difficulty: DifficultyLabel;
  motifIds: string[];
  pattern: Pattern;
};

type StressTestFailureSample = {
  reason:
    | "duplicate-structure"
    | "repeated-topology"
    | "non-unique"
    | "unsolved"
    | "excessive-direct-clues"
    | "generation-error";
  motifId?: string;
  message: string;
  arrangementType?: string;
  orientationType?: string;
  clues?: string[];
  finalArrangement?: string;
};

type StressTestProfileReport = {
  profile: StressTestProfile["id"];
  requested: number;
  generated: number;
  generationAttempts: number;
  generationErrors: number;
  totalDurationMs: number;
  averageDurationMs: number;
  duplicateStructures: number;
  repeatedTopologies: number;
  nonUniqueSolutions: number;
  unsolvedScenarios: number;
  excessiveDirectClues: number;
  maxStructureRepeat: number;
  maxTopologyRepeat: number;
  uniqueStructureCount: number;
  uniqueTopologyCount: number;
  averageClueDensity: number;
  averageInferenceDepth: number;
  averageRedundancyScore: number;
  averageBranchingFactor: number;
  averageValidationRetries: number;
  averageUniquenessFailures: number;
  directClueThreshold: number;
  topRepeatedStructures: Array<{
    signature: string;
    count: number;
  }>;
  topRepeatedTopologies: Array<{
    signature: string;
    count: number;
  }>;
  failureSamples: StressTestFailureSample[];
  samplePuzzles: Array<{
    motifId: string;
    arrangementType: string;
    orientationType: string;
    prompt: string;
    clues: string[];
    finalArrangement: string;
  }>;
};

export type StressTestReport = {
  generatedAt: string;
  batchSize: number;
  totalProfiles: number;
  totalRequested: number;
  totalGenerated: number;
  totalAttempts: number;
  totalErrors: number;
  totalFailures: {
    duplicateStructures: number;
    repeatedTopologies: number;
    nonUniqueSolutions: number;
    unsolvedScenarios: number;
    excessiveDirectClues: number;
  };
  profiles: StressTestProfileReport[];
};

const PROFILE_FILTER =
  process.env[
    "REASONING_STRESS_PROFILE"
  ];
const BATCH_SIZE = Number(
  process.env[
    "REASONING_STRESS_COUNT"
  ] ?? "",
);
const ATTEMPT_MULTIPLIER =
  Number(
    process.env[
      "REASONING_STRESS_ATTEMPT_MULTIPLIER"
    ] ?? "",
  );
const REPORT_PATH =
  process.env[
    "REASONING_STRESS_REPORT_PATH"
  ];
const DIRECT_CLUE_THRESHOLD =
  Number(
    process.env[
      "REASONING_STRESS_DIRECT_CLUE_THRESHOLD"
    ] ?? "",
  );

const DEFAULT_DIRECT_CLUE_THRESHOLD =
  Number.isFinite(
    DIRECT_CLUE_THRESHOLD,
  ) &&
  DIRECT_CLUE_THRESHOLD > 0 &&
  DIRECT_CLUE_THRESHOLD < 1
    ? DIRECT_CLUE_THRESHOLD
    : 0.5;

const PROFILES: StressTestProfile[] =
  [
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
        id: "stress-linear",
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
        id: "stress-circular",
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
        id: "stress-alternate",
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

function topCounts(
  counts: Map<string, number>,
  limit = 5,
) {
  return [
    ...counts.entries(),
  ]
    .sort(
      (left, right) =>
        right[1] - left[1],
    )
    .slice(0, limit)
    .map(
      ([signature, count]) => ({
        signature,
        count,
      }),
    );
}

function buildStructureSignature(
  scenario: ReturnType<
    typeof createSeatingScenario
  >,
) {
  const clueTypes =
    scenario.clues.map((clue) => {
      const operator =
        clue.operator ??
        "EQUALS";

      return `${clue.type}:${operator}`;
    });

  return [
    scenario.arrangementType,
    scenario.orientationType,
    scenario.participants.length,
    scenario.prompt.type,
    clueTypes.join(","),
  ].join("|");
}

async function maybeWriteReport(
  report: StressTestReport,
) {
  if (!REPORT_PATH) {
    return;
  }

  const absolutePath = path.resolve(
    REPORT_PATH,
  );
  await mkdir(
    path.dirname(absolutePath),
    { recursive: true },
  );
  await writeFile(
    absolutePath,
    JSON.stringify(
      report,
      null,
      2,
    ),
    "utf8",
  );
}

function buildProfileReport(
  profile: StressTestProfile,
): StressTestProfileReport {
  const targetCount =
    Number.isFinite(BATCH_SIZE) &&
    BATCH_SIZE > 0
      ? Math.floor(BATCH_SIZE)
      : profile.count;
  const structureCounts =
    new Map<string, number>();
  const topologyCounts =
    new Map<string, number>();
  const clueDensities: number[] =
    [];
  const inferenceDepths: number[] =
    [];
  const redundancyScores: number[] =
    [];
  const branchingFactors: number[] =
    [];
  const validationRetries: number[] =
    [];
  const uniquenessFailuresSeries:
    number[] = [];
  const samplePuzzles: StressTestProfileReport["samplePuzzles"] =
    [];
  const failureSamples: StressTestProfileReport["failureSamples"] =
    [];
  let generationAttempts = 0;
  let generationErrors = 0;
  let duplicateStructures = 0;
  let repeatedTopologies = 0;
  let nonUniqueSolutions = 0;
  let unsolvedScenarios = 0;
  let excessiveDirectClues = 0;
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
  const startedAt = Date.now();
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
    clueDensities.length <
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
    } catch (error) {
      generationErrors += 1;

      if (
        failureSamples.length < 6
      ) {
        failureSamples.push({
          reason:
            "generation-error",
          motifId: motif.id,
          message:
            error instanceof Error
              ? error.message
              : "Unknown generation error.",
        });
      }

      continue;
    }

    const graphAnalysis =
      buildClueGraphAnalysis(
        scenario.clues,
        scenario.arrangementType,
        scenario.orientationType,
      );
    const structureSignature =
      buildStructureSignature(
        scenario,
      );
    const priorStructureCount =
      structureCounts.get(
        structureSignature,
      ) ?? 0;
    const priorTopologyCount =
      topologyCounts.get(
        graphAnalysis.topologySignature,
      ) ?? 0;

    structureCounts.set(
      structureSignature,
      priorStructureCount + 1,
    );
    topologyCounts.set(
      graphAnalysis.topologySignature,
      priorTopologyCount + 1,
    );

    if (priorStructureCount > 0) {
      duplicateStructures += 1;

      if (
        failureSamples.length < 6
      ) {
        failureSamples.push({
          reason:
            "duplicate-structure",
          motifId: motif.id,
          message:
            "Repeated abstract arrangement/clue structure detected.",
          arrangementType:
            scenario.arrangementType,
          orientationType:
            scenario.orientationType,
          clues:
            scenario.generatedClues,
          finalArrangement:
            scenario.finalArrangement,
        });
      }
    }

    if (priorTopologyCount > 0) {
      repeatedTopologies += 1;

      if (
        failureSamples.length < 6
      ) {
        failureSamples.push({
          reason:
            "repeated-topology",
          motifId: motif.id,
          message:
            "Repeated clue-topology signature detected.",
          arrangementType:
            scenario.arrangementType,
          orientationType:
            scenario.orientationType,
          clues:
            scenario.generatedClues,
          finalArrangement:
            scenario.finalArrangement,
        });
      }
    }

    if (!scenario.uniquenessVerified) {
      nonUniqueSolutions += 1;

      if (
        failureSamples.length < 6
      ) {
        failureSamples.push({
          reason: "non-unique",
          motifId: motif.id,
          message:
            "Scenario did not verify as uniquely solvable.",
          arrangementType:
            scenario.arrangementType,
          orientationType:
            scenario.orientationType,
          clues:
            scenario.generatedClues,
          finalArrangement:
            scenario.finalArrangement,
        });
      }
    }

    if (
      scenario.validationWarnings.some(
        (warning) =>
          warning.includes(
            "No valid seating arrangement",
          ),
      )
    ) {
      unsolvedScenarios += 1;

      if (
        failureSamples.length < 6
      ) {
        failureSamples.push({
          reason: "unsolved",
          motifId: motif.id,
          message:
            "Scenario leaked an unsolved validation state.",
          arrangementType:
            scenario.arrangementType,
          orientationType:
            scenario.orientationType,
          clues:
            scenario.generatedClues,
          finalArrangement:
            scenario.finalArrangement,
        });
      }
    }

    const directClueRatio =
      scenario.clueCount > 0
        ? scenario.directClueCount /
          scenario.clueCount
        : 0;

    if (
      directClueRatio >
      DEFAULT_DIRECT_CLUE_THRESHOLD
    ) {
      excessiveDirectClues += 1;

      if (
        failureSamples.length < 6
      ) {
        failureSamples.push({
          reason:
            "excessive-direct-clues",
          motifId: motif.id,
          message: `Direct clue ratio ${round(directClueRatio)} exceeded threshold ${DEFAULT_DIRECT_CLUE_THRESHOLD}.`,
          arrangementType:
            scenario.arrangementType,
          orientationType:
            scenario.orientationType,
          clues:
            scenario.generatedClues,
          finalArrangement:
            scenario.finalArrangement,
        });
      }
    }

    clueDensities.push(
      scenario.clueDensity,
    );
    inferenceDepths.push(
      scenario.inferenceDepth,
    );
    redundancyScores.push(
      scenario.redundancyScore,
    );
    branchingFactors.push(
      scenario.branchingFactor,
    );
    validationRetries.push(
      scenario.validationRetries,
    );
    uniquenessFailuresSeries.push(
      scenario.uniquenessFailures,
    );

    if (samplePuzzles.length < 3) {
      samplePuzzles.push({
        motifId: motif.id,
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
    requested: targetCount,
    generated:
      clueDensities.length,
    generationAttempts,
    generationErrors,
    totalDurationMs:
      Date.now() - startedAt,
    averageDurationMs: round(
      (Date.now() - startedAt) /
        Math.max(
          clueDensities.length,
          1,
        ),
    ),
    duplicateStructures,
    repeatedTopologies,
    nonUniqueSolutions,
    unsolvedScenarios,
    excessiveDirectClues,
    maxStructureRepeat:
      Math.max(
        0,
        ...structureCounts.values(),
      ),
    maxTopologyRepeat:
      Math.max(
        0,
        ...topologyCounts.values(),
      ),
    uniqueStructureCount:
      structureCounts.size,
    uniqueTopologyCount:
      topologyCounts.size,
    averageClueDensity: round(
      average(clueDensities),
    ),
    averageInferenceDepth:
      round(
        average(inferenceDepths),
      ),
    averageRedundancyScore:
      round(
        average(redundancyScores),
      ),
    averageBranchingFactor:
      round(
        average(branchingFactors),
      ),
    averageValidationRetries:
      round(
        average(validationRetries),
      ),
    averageUniquenessFailures:
      round(
        average(
          uniquenessFailuresSeries,
        ),
      ),
    directClueThreshold:
      DEFAULT_DIRECT_CLUE_THRESHOLD,
    topRepeatedStructures:
      topCounts(structureCounts),
    topRepeatedTopologies:
      topCounts(topologyCounts),
    failureSamples,
    samplePuzzles,
  };
}

async function main() {
  const filteredProfiles =
    PROFILE_FILTER
      ? PROFILES.filter(
          (profile) =>
            profile.id ===
            PROFILE_FILTER,
        )
      : PROFILES;
  const profileReports =
    filteredProfiles.map(
      buildProfileReport,
    );
  const report: StressTestReport =
    {
      generatedAt:
        new Date().toISOString(),
      batchSize:
        Number.isFinite(BATCH_SIZE) &&
        BATCH_SIZE > 0
          ? Math.floor(BATCH_SIZE)
          : 1000,
      totalProfiles:
        profileReports.length,
      totalRequested:
        profileReports.reduce(
          (sum, profile) =>
            sum + profile.requested,
          0,
        ),
      totalGenerated:
        profileReports.reduce(
          (sum, profile) =>
            sum + profile.generated,
          0,
        ),
      totalAttempts:
        profileReports.reduce(
          (sum, profile) =>
            sum +
            profile.generationAttempts,
          0,
        ),
      totalErrors:
        profileReports.reduce(
          (sum, profile) =>
            sum + profile.generationErrors,
          0,
        ),
      totalFailures: {
        duplicateStructures:
          profileReports.reduce(
            (sum, profile) =>
              sum +
              profile.duplicateStructures,
            0,
          ),
        repeatedTopologies:
          profileReports.reduce(
            (sum, profile) =>
              sum +
              profile.repeatedTopologies,
            0,
          ),
        nonUniqueSolutions:
          profileReports.reduce(
            (sum, profile) =>
              sum +
              profile.nonUniqueSolutions,
            0,
          ),
        unsolvedScenarios:
          profileReports.reduce(
            (sum, profile) =>
              sum +
              profile.unsolvedScenarios,
            0,
          ),
        excessiveDirectClues:
          profileReports.reduce(
            (sum, profile) =>
              sum +
              profile.excessiveDirectClues,
            0,
          ),
      },
      profiles: profileReports,
    };

  await maybeWriteReport(report);

  console.log(
    JSON.stringify(
      report,
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
