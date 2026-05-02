import {
  useEffect,
  useState,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_BASE_URL =
  import.meta.env.DEV
    ? "http://localhost:3001"
    : "";

type DIDataRow = Record<
  string,
  string | number
>;

type DifficultyLabel =
  | "Easy"
  | "Medium"
  | "Hard";

type DISetProfile =
  | "progressive"
  | "balanced"
  | "spike"
  | "uniform";

type DISeriesType =
  | "line"
  | "bar";

type DISeriesConfig = {
  column: string;
  type: DISeriesType;
  label?: string;
};

type ExamProfileId =
  | "custom"
  | "ssc"
  | "ibps"
  | "cat"
  | "sbi"
  | "rrb";

type DifficultyMetadata = {
  difficultyScore: number;
  difficultyLabel: DifficultyLabel;
  estimatedSolveTime: number;
  operationCount: number;
  reasoningDepth: number;
  reasoningSteps?: string[];
  dependencyComplexity?: number;
  operationChain?: string[];
  usesPercentage: boolean;
  usesRatio: boolean;
  usesComparison: boolean;
  visualComplexity: number;
  inferenceComplexity: number;
};

type OptionMetadata = {
  value: string;
  isCorrect: boolean;
  distractorType?: string;
  likelyMistake?: string;
  reasoningTrap?: string;
};

type ExamRealismMetadata = {
  examProfile: ExamProfileId;
  wordingStyle:
    | "concise"
    | "balanced"
    | "inference-heavy";
  archetypeId?: string;
  archetypeCategory?: string;
  reasoningTraps: string[];
  weightingSummary: string[];
};

type DIQuestion = {
  text: string;
  options?: string[];
  optionMetadata?: OptionMetadata[];
  difficulty?: DifficultyLabel;
  difficultyScore?: number;
  difficultyLabel?: DifficultyLabel;
  difficultyMetadata?: DifficultyMetadata;
  examRealismMetadata?: ExamRealismMetadata;
  explanation?: string;
};

type DISet = {
  questionType: "di";
  visualType?: "table" | "bar" | "pie" | "line";
  diData: DIDataRow[];
  series?: DISeriesConfig[];
  title?: string;
  questions: DIQuestion[];
  averageDifficulty?: number;
  peakDifficulty?: number;
  difficultySpread?: DISetProfile;
  setProfile?: DISetProfile;
};

type FormulaQuestion = {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  section?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: DifficultyLabel;
  difficultyScore?: number;
  difficultyLabel?: DifficultyLabel;
  difficultyMetadata?: DifficultyMetadata;
  optionMetadata?: OptionMetadata[];
  examRealismMetadata?: ExamRealismMetadata;
};

type GeneratedQuestion =
  | FormulaQuestion
  | DISet;

type DifficultyDistribution = {
  easy: number;
  medium: number;
  hard: number;
};

type DifficultySettings = {
  examProfile: ExamProfileId;
  setProfile: DISetProfile;
  enableTargetDifficulty: boolean;
  targetDifficulty: number;
  difficultyTolerance: number;
  enableDistribution: boolean;
  difficultyDistribution: DifficultyDistribution;
  enableTargetAverageDifficulty: boolean;
  targetAverageDifficulty: number;
};

const PIE_COLORS = [
  "#1f2937",
  "#4b5563",
  "#6b7280",
  "#9ca3af",
  "#374151",
  "#111827",
];

const AXIS_TICK = {
  fill: "#111827",
  fontSize: 11,
};

const COMPACT_CHART_MARGIN = {
  top: 8,
  right: 12,
  left: 0,
  bottom: 8,
};

const DIFFICULTY_BADGE_STYLES: Record<
  DifficultyLabel,
  string
> = {
  Easy:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium:
    "bg-amber-50 text-amber-700 border-amber-200",
  Hard:
    "bg-rose-50 text-rose-700 border-rose-200",
};

const LINE_SERIES_STROKES = [
  "#1d4ed8",
  "#b91c1c",
  "#047857",
  "#7c3aed",
  "#c2410c",
  "#0f766e",
];

const EXAM_PROFILE_OPTIONS: Array<{
  id: ExamProfileId;
  label: string;
  description: string;
}> = [
  {
    id: "custom",
    label: "Custom",
    description:
      "Manual admin tuning for calibration work.",
  },
  {
    id: "ssc",
    label: "SSC",
    description:
      "Placeholder for SSC-style distribution presets.",
  },
  {
    id: "ibps",
    label: "IBPS",
    description:
      "Placeholder for IBPS-style DI calibration.",
  },
  {
    id: "cat",
    label: "CAT",
    description:
      "Placeholder for CAT-style tougher reasoning curves.",
  },
  {
    id: "sbi",
    label: "SBI",
    description:
      "Placeholder for SBI PO style slot presets.",
  },
  {
    id: "rrb",
    label: "RRB",
    description:
      "Placeholder for RRB exam difficulty balancing.",
  },
];

const MARKER_TYPES = [
  "circle",
  "square",
  "diamond",
  "triangle",
] as const;

type MarkerType =
  (typeof MARKER_TYPES)[number];

type CustomDotProps = {
  cx?: number;
  cy?: number;
  fill?: string;
  markerType: MarkerType;
  r?: number;
  stroke?: string;
  strokeWidth?: number;
};

function getNumericColumns(
  rows: DIDataRow[],
) {
  const firstRow = rows[0];

  if (!firstRow) {
    return [];
  }

  return Object.keys(firstRow).filter(
    (key) =>
      typeof firstRow[key] === "number",
  );
}

function getHashSeed(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash =
      (hash * 31 +
        value.charCodeAt(i)) >>>
      0;
  }

  return hash;
}

function getRandomMarkerType(
  availableMarkerTypes: MarkerType[],
  seed: number,
) {
  const index =
    seed % availableMarkerTypes.length;

  return availableMarkerTypes[index];
}

function getLineMarkerTypes(
  diSet: DISet,
  numericColumns: string[],
) {
  const seed = getHashSeed(
    JSON.stringify({
      title: diSet.title,
      visualType: diSet.visualType,
      diData: diSet.diData,
      numericColumns,
    }),
  );

  const availableMarkerTypes = [
    ...MARKER_TYPES,
  ];
  const markerTypes: Record<
    string,
    MarkerType
  > = {};

  numericColumns.forEach(
    (numericColumn, index) => {
      if (
        availableMarkerTypes.length === 0
      ) {
        availableMarkerTypes.push(
          ...MARKER_TYPES,
        );
      }

      const markerType =
        getRandomMarkerType(
          availableMarkerTypes,
          seed + index * 17,
        );

      markerTypes[numericColumn] =
        markerType;

      const markerIndex =
        availableMarkerTypes.indexOf(
          markerType,
        );

      availableMarkerTypes.splice(
        markerIndex,
        1,
      );
    },
  );

  return markerTypes;
}

function CustomDot({
  cx,
  cy,
  fill = "#ffffff",
  markerType,
  r = 5.5,
  stroke = "#111827",
  strokeWidth = 1.5,
}: CustomDotProps) {
  if (
    typeof cx !== "number" ||
    typeof cy !== "number"
  ) {
    return null;
  }

  const markerSize = r * 2;
  const triangleHalfWidth =
    r * 1.05;
  const triangleHeight =
    r * 1.2;

  switch (markerType) {
    case "square":
      return (
        <rect
          x={cx - markerSize / 2}
          y={cy - markerSize / 2}
          width={markerSize}
          height={markerSize}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    case "diamond":
      return (
        <polygon
          points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    case "triangle":
      return (
        <polygon
          points={`${cx},${cy - triangleHeight} ${cx + triangleHalfWidth},${cy + triangleHeight * 0.85} ${cx - triangleHalfWidth},${cy + triangleHeight * 0.85}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
    case "circle":
    default:
      return (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      );
  }
}

function renderExamTooltip() {
  return (
    <Tooltip
      cursor={false}
      isAnimationActive={false}
      contentStyle={{
        backgroundColor: "#ffffff",
        border: "1px solid #9ca3af",
        borderRadius: 0,
        color: "#111827",
        fontSize: 12,
        padding: "6px 8px",
      }}
      itemStyle={{
        color: "#111827",
      }}
      labelStyle={{
        color: "#111827",
        fontWeight: 600,
      }}
    />
  );
}

function getNumericColumn(
  rows: DIDataRow[],
) {
  const firstRow = rows[0];

  if (!firstRow) {
    return undefined;
  }

  return Object.keys(firstRow).find(
    (key) =>
      typeof firstRow[key] === "number",
  );
}

function getSeriesColumns(
  diSet: DISet,
  visualType: DISeriesType,
) {
  if (diSet.series?.length) {
    return diSet.series
      .filter(
        (series) =>
          series.type === visualType,
      )
      .map((series) => series.column);
  }

  return getNumericColumns(diSet.diData);
}

function getCategoryColumn(
  rows: DIDataRow[],
) {
  const firstRow = rows[0];

  if (!firstRow) {
    return undefined;
  }

  return Object.keys(firstRow).find(
    (key) =>
      typeof firstRow[key] === "string",
  );
}

function isDISet(
  question: GeneratedQuestion,
): question is DISet {
  return (
    "questionType" in question &&
    question.questionType === "di"
  );
}

function clampNumber(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function getDifficultyLabel(
  question: {
    difficulty?: DifficultyLabel;
    difficultyLabel?: DifficultyLabel;
    difficultyMetadata?: DifficultyMetadata;
  },
) {
  return (
    question.difficultyLabel ??
    question.difficultyMetadata
      ?.difficultyLabel ??
    question.difficulty
  );
}

function getDifficultyScore(
  question: {
    difficultyScore?: number;
    difficultyMetadata?: DifficultyMetadata;
  },
) {
  return (
    question.difficultyScore ??
    question.difficultyMetadata
      ?.difficultyScore
  );
}

function formatDifficultyScore(
  score?: number,
) {
  return typeof score === "number"
    ? score.toFixed(1)
    : "NA";
}

function normalizeDifficultyDistribution(
  distribution: DifficultyDistribution,
) {
  const total =
    distribution.easy +
    distribution.medium +
    distribution.hard;

  if (total <= 0) {
    return distribution;
  }

  return {
    easy: Math.round(
      (distribution.easy / total) * 100,
    ),
    medium: Math.round(
      (distribution.medium / total) * 100,
    ),
    hard: Math.round(
      (distribution.hard / total) * 100,
    ),
  };
}

function getDistributionTotal(
  distribution: DifficultyDistribution,
) {
  return (
    distribution.easy +
    distribution.medium +
    distribution.hard
  );
}

function getDifficultyCounts(
  questions: Array<{
    difficulty?: DifficultyLabel;
    difficultyLabel?: DifficultyLabel;
    difficultyScore?: number;
    difficultyMetadata?: DifficultyMetadata;
  }>,
) {
  const counts: Record<
    DifficultyLabel,
    number
  > = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  questions.forEach((question) => {
    const label =
      getDifficultyLabel(question);

    if (label) {
      counts[label] += 1;
    }
  });

  return counts;
}

function getProfileDescription(
  profile: ExamProfileId,
) {
  return (
    EXAM_PROFILE_OPTIONS.find(
      (option) =>
        option.id === profile,
    )?.description ??
    "Manual admin calibration."
  );
}

function getDifficultyRequestPayload(
  settings: DifficultySettings,
) {
  const payload: Record<
    string,
    | number
    | ExamProfileId
    | DifficultyDistribution
    | DISetProfile
  > = {};

  payload.examProfile =
    settings.examProfile;
  payload.setProfile =
    settings.setProfile;

  if (settings.enableTargetDifficulty) {
    payload.targetDifficulty =
      settings.targetDifficulty;
    payload.difficultyTolerance =
      settings.difficultyTolerance;
  }

  if (settings.enableDistribution) {
    payload.difficultyDistribution =
      normalizeDifficultyDistribution(
        settings.difficultyDistribution,
      );
  }

  if (
    settings.enableTargetAverageDifficulty
  ) {
    payload.targetAverageDifficulty =
      settings.targetAverageDifficulty;
  }

  return payload;
}

function renderDifficultyBarSummary(
  counts: Record<
    DifficultyLabel,
    number
  >,
) {
  const total =
    counts.Easy +
    counts.Medium +
    counts.Hard;

  if (!total) {
    return null;
  }

  return (
    <div className="space-y-2">
      {(
        [
          "Easy",
          "Medium",
          "Hard",
        ] as const
      ).map((label) => {
        const count =
          counts[label];
        const width =
          (count / total) * 100;

        return (
          <div
            key={label}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{label}</span>
              <span>{count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${label === "Easy"
                  ? "bg-emerald-500"
                  : label === "Medium"
                    ? "bg-amber-500"
                    : "bg-rose-500"
                  }`}
                style={{
                  width: `${width}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderDifficultyAnalytics(
  question: {
    difficulty?: DifficultyLabel;
    difficultyLabel?: DifficultyLabel;
    difficultyScore?: number;
    difficultyMetadata?: DifficultyMetadata;
    optionMetadata?: OptionMetadata[];
    examRealismMetadata?: ExamRealismMetadata;
  },
) {
  const metadata =
    question.difficultyMetadata;
  const realismMetadata =
    question.examRealismMetadata;
  const distractorMetadata = (
    question.optionMetadata ?? []
  ).filter(
    (option) =>
      !option.isCorrect &&
      (option.distractorType ||
        option.likelyMistake ||
        option.reasoningTrap),
  );
  const label =
    getDifficultyLabel(question);
  const score =
    getDifficultyScore(question);

  if (!metadata && !label && score === undefined) {
    return null;
  }

  return (
    <details className="rounded border bg-slate-50 p-3">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-900">
            Difficulty Analytics
          </span>
          {label && (
            <span
              className={`inline-flex items-center rounded-full border px-2 py-1 font-semibold ${DIFFICULTY_BADGE_STYLES[label]}`}
            >
              {formatDifficultyScore(score)}{" "}
              {label}
            </span>
          )}
          {metadata && (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1">
              {metadata.estimatedSolveTime} sec
            </span>
          )}
        </div>
      </summary>

      <div className="mt-3 space-y-3">
        <div className="grid gap-2 text-xs text-slate-700 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Difficulty Score
            </div>
            <div className="font-semibold">
              {formatDifficultyScore(score)}
            </div>
          </div>
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Estimated Solve Time
            </div>
            <div className="font-semibold">
              {metadata?.estimatedSolveTime ??
                "NA"}{" "}
              sec
            </div>
          </div>
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Operations
            </div>
            <div className="font-semibold">
              {metadata?.operationCount ??
                "NA"}
            </div>
          </div>
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Reasoning Depth
            </div>
            <div className="font-semibold">
              {metadata?.reasoningDepth ??
                "NA"}
            </div>
          </div>
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Visual Complexity
            </div>
            <div className="font-semibold">
              {metadata?.visualComplexity ??
                "NA"}
            </div>
          </div>
          <div className="rounded border bg-white p-2">
            <div className="text-slate-500">
              Inference Complexity
            </div>
            <div className="font-semibold">
              {metadata?.inferenceComplexity ??
                "NA"}
            </div>
          </div>
        </div>

        {metadata && (
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
            <span className="rounded border border-slate-200 bg-white px-2 py-1">
              Uses Percentage:{" "}
              {metadata.usesPercentage
                ? "Yes"
                : "No"}
            </span>
            <span className="rounded border border-slate-200 bg-white px-2 py-1">
              Uses Ratio:{" "}
              {metadata.usesRatio
                ? "Yes"
                : "No"}
            </span>
            <span className="rounded border border-slate-200 bg-white px-2 py-1">
              Uses Comparison:{" "}
              {metadata.usesComparison
                ? "Yes"
                : "No"}
            </span>
            {typeof metadata.dependencyComplexity ===
              "number" && (
              <span className="rounded border border-slate-200 bg-white px-2 py-1">
                Dependency Complexity:{" "}
                {metadata.dependencyComplexity}
              </span>
            )}
            {metadata.operationChain
              ?.length ? (
              <span className="rounded border border-slate-200 bg-white px-2 py-1">
                Operations:{" "}
                {metadata.operationChain.join(
                  " -> ",
                )}
              </span>
            ) : null}
          </div>
        )}

        {metadata?.reasoningSteps
          ?.length ? (
          <div className="rounded border border-slate-200 bg-white p-3 text-[11px] text-slate-600">
            <div className="mb-2 font-medium text-slate-800">
              Reasoning Chain
            </div>
            <div className="space-y-1">
              {metadata.reasoningSteps.map(
                (step, index) => (
                  <div key={index}>
                    {index + 1}.{" "}
                    {step}
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}

        {realismMetadata ? (
          <div className="rounded border border-slate-200 bg-white p-3 text-[11px] text-slate-600">
            <div className="mb-2 font-medium text-slate-800">
              Exam Realism
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                Profile:{" "}
                {realismMetadata.examProfile.toUpperCase()}
              </span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                Wording:{" "}
                {realismMetadata.wordingStyle}
              </span>
              {realismMetadata.archetypeCategory ? (
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                  Archetype:{" "}
                  {realismMetadata.archetypeCategory}
                </span>
              ) : null}
            </div>
            {realismMetadata.weightingSummary
              ?.length ? (
              <div className="mt-2 space-y-1">
                {realismMetadata.weightingSummary.map(
                  (item, index) => (
                    <div key={index}>
                      {index + 1}. {item}
                    </div>
                  ),
                )}
              </div>
            ) : null}
            {realismMetadata.reasoningTraps
              ?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {realismMetadata.reasoningTraps.map(
                  (trap, index) => (
                    <span
                      key={index}
                      className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700"
                    >
                      {trap}
                    </span>
                  ),
                )}
              </div>
            ) : null}
          </div>
        ) : null}

        {distractorMetadata.length ? (
          <div className="rounded border border-slate-200 bg-white p-3 text-[11px] text-slate-600">
            <div className="mb-2 font-medium text-slate-800">
              Distractor Intelligence
            </div>
            <div className="space-y-2">
              {distractorMetadata.map(
                (option, index) => (
                  <div
                    key={`${option.value}-${index}`}
                    className="rounded border border-slate-100 bg-slate-50 p-2"
                  >
                    <div className="font-medium text-slate-800">
                      Option {option.value}
                    </div>
                    <div>
                      Type:{" "}
                      {option.distractorType ??
                        "NA"}
                    </div>
                    <div>
                      Likely Mistake:{" "}
                      {option.likelyMistake ??
                        "NA"}
                    </div>
                    <div>
                      Trap:{" "}
                      {option.reasoningTrap ??
                        "NA"}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}
      </div>
    </details>
  );
}

function renderGeneratedDifficultySummary(
  generated: GeneratedQuestion[],
) {
  const allQuestions = generated.flatMap(
    (question) =>
      isDISet(question)
        ? question.questions
        : [question],
  );
  const scoredQuestions =
    allQuestions.filter(
      (question) =>
        typeof getDifficultyScore(
          question,
        ) === "number",
    );

  if (!scoredQuestions.length) {
    return null;
  }

  const totalScore =
    scoredQuestions.reduce(
      (sum, question) =>
        sum +
        (getDifficultyScore(
          question,
        ) ?? 0),
      0,
    );
  const averageScore =
    totalScore / scoredQuestions.length;
  const labelCounts =
    getDifficultyCounts(
      scoredQuestions,
    );

  return (
    <div className="rounded-lg border bg-slate-50 p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-semibold text-slate-900">
          Admin Difficulty Panel
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
          Average Difficulty:{" "}
          {averageScore.toFixed(1)}
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
          Scored Questions:{" "}
          {scoredQuestions.length}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded border bg-white p-4 space-y-3">
          <div className="text-sm font-medium text-slate-900">
            Difficulty Distribution
          </div>
          {renderDifficultyBarSummary(
            labelCounts,
          )}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
              Easy: {labelCounts.Easy}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
              Medium: {labelCounts.Medium}
            </span>
            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700">
              Hard: {labelCounts.Hard}
            </span>
          </div>
        </div>

        <div className="rounded border bg-white p-4 space-y-3">
          <div className="text-sm font-medium text-slate-900">
            Future Calibration Hooks
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              Solve Time Telemetry
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              Accuracy Rate
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              Skip Rate
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
              Abandonment Rate
            </span>
          </div>
          <p className="text-xs text-slate-500">
            This admin panel is structured for future real-user calibration data, but currently displays only generator-side analytics.
          </p>
        </div>
      </div>
    </div>
  );
}

function renderDISetAnalytics(
  diSet: DISet,
) {
  const labelCounts =
    getDifficultyCounts(
      diSet.questions,
    );
  const questionScores =
    diSet.questions
      .map((question) =>
        getDifficultyScore(question),
      )
      .filter(
        (
          score,
        ): score is number =>
          typeof score === "number",
      );
  const progression =
    questionScores.length
      ? questionScores
          .map((score, index) =>
            `Q${index + 1}: ${score.toFixed(1)}`,
          )
          .join(" -> ")
      : "NA";

  return (
    <div className="rounded-lg border bg-slate-50 p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-900">
          DI Set Calibration
        </span>
        {diSet.setProfile && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs capitalize">
            Profile: {diSet.setProfile}
          </span>
        )}
        {diSet.difficultySpread && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs capitalize">
            Spread:{" "}
            {diSet.difficultySpread}
          </span>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
        <div className="rounded border bg-white p-3">
          <div className="text-slate-500">
            Average Difficulty
          </div>
          <div className="font-semibold">
            {typeof diSet.averageDifficulty ===
            "number"
              ? diSet.averageDifficulty.toFixed(
                  1,
                )
              : "NA"}
          </div>
        </div>
        <div className="rounded border bg-white p-3">
          <div className="text-slate-500">
            Peak Difficulty
          </div>
          <div className="font-semibold">
            {typeof diSet.peakDifficulty ===
            "number"
              ? diSet.peakDifficulty.toFixed(
                  1,
                )
              : "NA"}
          </div>
        </div>
        <div className="rounded border bg-white p-3">
          <div className="text-slate-500">
            Question Count
          </div>
          <div className="font-semibold">
            {diSet.questions.length}
          </div>
        </div>
        <div className="rounded border bg-white p-3">
          <div className="text-slate-500">
            Progression
          </div>
          <div className="font-semibold capitalize">
            {diSet.setProfile ??
              diSet.difficultySpread ??
              "NA"}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded border bg-white p-4 space-y-3">
          <div className="text-sm font-medium text-slate-900">
            Difficulty Mix
          </div>
          {renderDifficultyBarSummary(
            labelCounts,
          )}
        </div>

        <div className="rounded border bg-white p-4 space-y-3">
          <div className="text-sm font-medium text-slate-900">
            Progression Trace
          </div>
          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            {progression}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
              Easy: {labelCounts.Easy}
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
              Medium: {labelCounts.Medium}
            </span>
            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-700">
              Hard: {labelCounts.Hard}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderTableDI(diSet: DISet) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          {Object.keys(
            diSet.diData[0] || {},
          ).map((col) => (
            <th
              key={col}
              className="border p-2"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {diSet.diData.map(
          (row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map(
                (value, valueIndex) => (
                  <td
                    key={valueIndex}
                    className="border p-2"
                  >
                    {String(value)}
                  </td>
                ),
              )}
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}

function renderBarDI(diSet: DISet) {
  const categoryColumn =
    getCategoryColumn(diSet.diData);

  const numericColumns =
    getSeriesColumns(
      diSet,
      "bar",
    );

  if (
    !categoryColumn ||
    !numericColumns.length
  ) {
    return renderTableDI(diSet);
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={diSet.diData}
          margin={
            COMPACT_CHART_MARGIN
          }
        >
          <CartesianGrid
            stroke="#d1d5db"
            strokeDasharray="0"
          />
          <XAxis
            dataKey={categoryColumn}
            axisLine={{
              stroke: "#111827",
            }}
            tick={AXIS_TICK}
            tickLine={{
              stroke: "#111827",
            }}
          />
          <YAxis
            axisLine={{
              stroke: "#111827",
            }}
            tick={AXIS_TICK}
            tickLine={{
              stroke: "#111827",
            }}
          />
          {renderExamTooltip()}
          {numericColumns.length > 1 && (
            <Legend
              iconType="square"
              wrapperStyle={{
                fontSize: 11,
                color: "#111827",
              }}
            />
          )}
          {numericColumns.map(
            (
              numericColumn,
              index,
            ) => (
              <Bar
                key={numericColumn}
                dataKey={numericColumn}
                name={numericColumn}
                fill={
                  LINE_SERIES_STROKES[
                    index %
                      LINE_SERIES_STROKES.length
                  ]
                }
                activeBar={false}
                isAnimationActive={false}
                radius={[0, 0, 0, 0]}
              />
            ),
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderPieDI(diSet: DISet) {
  const categoryColumn =
    getCategoryColumn(diSet.diData);

  const numericColumn =
    getNumericColumn(diSet.diData);

  if (
    !categoryColumn ||
    !numericColumn
  ) {
    return renderTableDI(diSet);
  }

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={diSet.diData}
            dataKey={numericColumn}
            nameKey={categoryColumn}
            cx="50%"
            cy="50%"
            outerRadius={76}
            label
            activeShape={false}
            isAnimationActive={false}
            stroke="#ffffff"
            strokeWidth={1}
          >
            {diSet.diData.map(
              (_row, index) => (
                <Cell
                  key={index}
                  fill={
                    PIE_COLORS[
                      index %
                        PIE_COLORS.length
                    ]
                  }
                />
              ),
            )}
          </Pie>
          {renderExamTooltip()}
          <Legend
            iconType="plainline"
            wrapperStyle={{
              fontSize: 11,
              color: "#111827",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderLineDI(diSet: DISet) {
  const categoryColumn =
    getCategoryColumn(diSet.diData);

  const numericColumns =
    getSeriesColumns(
      diSet,
      "line",
    );

  if (
    !categoryColumn ||
    !numericColumns.length
  ) {
    return renderTableDI(diSet);
  }

  const markerTypes =
    getLineMarkerTypes(
      diSet,
      numericColumns,
    );

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={diSet.diData}
          margin={
            COMPACT_CHART_MARGIN
          }
        >
          <CartesianGrid
            stroke="#d1d5db"
            strokeDasharray="0"
          />
          <XAxis
            dataKey={categoryColumn}
            axisLine={{
              stroke: "#111827",
            }}
            tick={AXIS_TICK}
            tickLine={{
              stroke: "#111827",
            }}
          />
          <YAxis
            axisLine={{
              stroke: "#111827",
            }}
            tick={AXIS_TICK}
            tickLine={{
              stroke: "#111827",
            }}
          />
          <Legend
            iconType="plainline"
            wrapperStyle={{
              fontSize: 11,
              color: "#111827",
            }}
          />
          {numericColumns.map(
            (
              numericColumn,
              index,
            ) => (
              <Line
                key={numericColumn}
                type="linear"
                dataKey={numericColumn}
                name={numericColumn}
                stroke={
                  LINE_SERIES_STROKES[
                    index %
                      LINE_SERIES_STROKES.length
                  ]
                }
                strokeWidth={2.25}
                dot={(props) => {
                  const {
                    key,
                    ...rest
                  } = props;

                  return (
                    <CustomDot
                      key={key}
                      {...rest}
                      fill={
                        LINE_SERIES_STROKES[
                          index %
                            LINE_SERIES_STROKES.length
                        ]
                      }
                      markerType={
                        markerTypes[
                          numericColumn
                        ]
                      }
                      r={6.5}
                      stroke="#ffffff"
                      strokeWidth={1.75}
                    />
                  );
                }}
                activeDot={false}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey={numericColumn}
                  position="top"
                  fill="#111827"
                  fontSize={11}
                />
              </Line>
            ),
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderDIVisual(diSet: DISet) {
  switch (diSet.visualType) {
    case "bar":
      return renderBarDI(diSet);
    case "pie":
      return renderPieDI(diSet);
    case "line":
      return renderLineDI(diSet);
    case "table":
    default:
      return renderTableDI(diSet);
  }
}

function renderDIQuestions(
  questions: DIQuestion[],
) {
  return (
    <div className="space-y-4">
      {questions.map(
        (question, questionIndex) => (
          <div
            key={questionIndex}
            className="border rounded p-3"
          >
            <div className="font-medium">
              {question.text}
            </div>

            {renderDifficultyAnalytics(
              question,
            )}

            <div className="mt-2 space-y-1">
              {question.options?.map(
                (opt, optionIndex) => (
                  <div key={optionIndex}>
                    {opt}
                  </div>
                ),
              )}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function renderDISet(
  diSet: DISet,
  idx: number,
) {
  return (
    <div
      key={idx}
      className="border rounded-lg p-4 space-y-4"
    >
      <h2 className="text-xl font-semibold">
        {diSet.title || "DI Set"}
      </h2>

      {renderDISetAnalytics(diSet)}

      {renderDIVisual(diSet)}

      {renderDIQuestions(
        diSet.questions,
      )}
    </div>
  );
}

export default function AdminGeneratorPage() {
  const [patternId, setPatternId] =
    useState("");

  const [count, setCount] =
    useState(5);

  const [generated, setGenerated] =
    useState<GeneratedQuestion[]>([]);

  const [patterns, setPatterns] =
    useState<any[]>([]);
  const [
    editingPatternId,
    setEditingPatternId,
  ] = useState<string | null>(
    null,
  );

  const [loading, setLoading] =
    useState(false);
  const [
    difficultySettings,
    setDifficultySettings,
  ] = useState<DifficultySettings>({
    examProfile: "custom",
    setProfile: "progressive",
    enableTargetDifficulty: false,
    targetDifficulty: 6.5,
    difficultyTolerance: 1,
    enableDistribution: false,
    difficultyDistribution: {
      easy: 20,
      medium: 60,
      hard: 20,
    },
    enableTargetAverageDifficulty:
      false,
    targetAverageDifficulty: 6.2,
  });
  const [newPattern, setNewPattern] =
    useState({
      id: "",

      name: "",

      section: "quant",

      topic: "",

      subtopic: "",

      difficulty: "Easy",


      formula: "",
      type: "formula",
      visualType: "table",


      explanationTemplate: "",

      template: "",

      diPattern: `{
  "title": "DI Table",
  "columns": ["Category", "Value"],
  "rowCount": 5,
  "categories": ["A", "B", "C", "D", "E"],
  "valueRanges": {
    "Value": {
      "min": 100,
      "max": 500
    }
  }
}`,

      variables: `{
  "a": { "min": 1, "max": 10 },
  "b": { "min": 1, "max": 10 }
}`,

      offsets: "-1,1,2",
    });

  useEffect(() => {
    async function loadPatterns() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/generator/patterns`,
        );

        const data =
          await res.json();

        setPatterns(
          data.patterns || [],
        );
      } catch (error) {
        console.error(error);
      }
    }

    loadPatterns();
  }, []);
  async function savePattern() {
    try {
      const res = await fetch(
        editingPatternId
          ? `${API_BASE_URL}/api/generator/patterns/${editingPatternId}`
          : `${API_BASE_URL}/api/generator/patterns`,
        {
          method:
            editingPatternId
              ? "PUT"
              : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: newPattern.id,

            name: newPattern.name,

            section: newPattern.section,

            topic: newPattern.topic,

            subtopic: newPattern.subtopic,
            type: newPattern.type,



            difficulty:
              newPattern.difficulty,

            formula:
              newPattern.formula,

            explanationTemplate:
              newPattern.explanationTemplate,

            diPattern:
              newPattern.type === "di"
                ? {
                  ...JSON.parse(
                    newPattern.diPattern,
                  ),
                  visualType:
                    newPattern.visualType,
                }
                : undefined,

            templateVariants: [
              newPattern.template,
            ],

            variables: JSON.parse(
              newPattern.variables,
            ),

            distractorStrategy: {
              type:
                "numeric_offsets",

              offsets:
                newPattern.offsets
                  .split(",")
                  .map((x) =>
                    Number(x.trim()),
                  ),
            },
          }),
        },
      );

      const data = await res.json();

      console.log(data);

      alert(
        "Pattern created",
      );

      const patternsRes =
        await fetch(
          `${API_BASE_URL}/api/generator/patterns`,
        );

      const patternsData =
        await patternsRes.json();

      setPatterns(
        patternsData.patterns ||
        [],
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create pattern",
      );
    }
  }
  function isDuplicateQuestion(
    currentIndex: number,
  ) {
    const current =
      generated[
        currentIndex
      ]?.text
        ?.toLowerCase()
        ?.replace(/\s+/g, " ")
        ?.trim();

    return generated.some(
      (q, idx) => {
        if (
          idx === currentIndex
        ) {
          return false;
        }

        const compare =
          q?.text
            ?.toLowerCase()
            ?.replace(
              /\s+/g,
              " ",
            )
            ?.trim();

        return (
          current === compare
        );
      },
    );
  }
  async function deletePattern(
    id: string,
  ) {
    try {
      await fetch(
        `${API_BASE_URL}/api/generator/patterns/${id}`,
        {
          method: "DELETE",
        },
      );

      setPatterns(
        patterns.filter(
          (p) => p.id !== id,
        ),
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to delete pattern",
      );
    }
  }
  async function generate() {
    try {
      setLoading(true);

      const difficultyPayload =
        getDifficultyRequestPayload(
          difficultySettings,
        );

      const res = await fetch(
        `${API_BASE_URL}/api/generator/pattern`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            patternId,
            count,
            ...difficultyPayload,
          }),
        },
      );

      const data = await res.json();

      console.log(data);

      setGenerated((prev) => [
        ...prev,
        ...(data.questions || []),
      ]);
    } catch (error) {
      console.error(error);

      alert(
        "Generation failed",
      );
    } finally {
      setLoading(false);
    }
  }

  async function regenerateQuestion(
    index: number,
  ) {
    try {
      const difficultyPayload =
        getDifficultyRequestPayload(
          difficultySettings,
        );

      const res = await fetch(
        `${API_BASE_URL}/api/generator/pattern`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            patternId,
            count: 1,
            ...difficultyPayload,
          }),
        },
      );

      const data = await res.json();

      if (
        data.questions?.length
      ) {
        const updated = [
          ...generated,
        ];

        updated[index] =
          data.questions[0];

        setGenerated(updated);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Failed to regenerate question",
      );
    }
  }
  async function saveQuestions() {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/generator/save`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            questions: generated,
          }),
        },
      );

      const data = await res.json();

      alert(
        `Saved ${data.count} questions`,
      );
    } catch (error) {
      console.error(error);

      alert("Save failed");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Question Generator
      </h1>
      <div className="border rounded-lg p-4 space-y-4">
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-xl font-semibold">
            Existing Patterns
          </h2>

          <div className="space-y-2">
            {patterns.map((p) => (
              <div
                key={p.id}
                className="border rounded p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {p.name}
                  </div>

                  <div className="text-sm text-gray-600">
                    {p.topic}
                  </div>

                  <div className="text-xs text-gray-500">
                    {p.formula}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPatternId(p.id)
                    }
                    className="bg-black text-white px-3 py-1 rounded text-sm"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => {
                      setEditingPatternId(
                        p.id,
                      );

                      setNewPattern({
                        id: p.id,
                        name: p.name,
                        section:
                          p.section,
                        topic: p.topic,
                        subtopic:
                          p.subtopic,
                        difficulty:
                          p.difficulty,
                        formula:
                          p.formula || "",
                        explanationTemplate:
                          p.explanationTemplate || "",

                        template:
                          p.templateVariants?.[0] ||
                          "",
                        type:
                          p.type || "formula",
                        visualType:
                          p.diPattern?.visualType ||
                          "table",

                        diPattern:
                          JSON.stringify(
                            p.diPattern || {},
                            null,
                            2,
                          ),
                        variables:
                          JSON.stringify(
                            p.variables,
                            null,
                            2,
                          ),

                        offsets:
                          p
                            .distractorStrategy
                            ?.offsets?.join(
                              ",",
                            ) || "",
                      });
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      deletePattern(p.id)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <h2 className="text-xl font-semibold">
          Create Pattern
        </h2>

        <input
          placeholder="Pattern ID"
          value={newPattern.id}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              id: e.target.value,
            })
          }
          className="border rounded p-2 w-full"
        />

        <input
          placeholder="Pattern Name"
          value={newPattern.name}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              name: e.target.value,
            })
          }
          className="border rounded p-2 w-full"
        />

        <input
          placeholder="Topic"
          value={newPattern.topic}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              topic:
                e.target.value,
            })
          }
          className="border rounded p-2 w-full"
        />
        <select
          value={newPattern.type}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              type: e.target.value,
            })
          }
          className="border rounded p-2 w-full"
        >
          <option value="formula">
            Formula
          </option>

          <option value="di">
            DI
          </option>
        </select>

        {newPattern.type === "di" && (
          <select
            value={newPattern.visualType}
            onChange={(e) =>
              setNewPattern({
                ...newPattern,
                visualType:
                  e.target.value,
              })
            }
            className="border rounded p-2 w-full"
          >
            <option value="table">
              Table
            </option>

            <option value="bar">
              Bar Chart
            </option>

            <option value="pie">
              Pie Chart
            </option>

            <option value="line">
              Line Graph
            </option>
          </select>
        )}

        <input
          placeholder="Formula (example: a + b)"
          value={newPattern.formula}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              formula:
                e.target.value,
            })
          }
          className="border rounded p-2 w-full"
        />
        <textarea
          placeholder="Explanation Template"
          value={
            newPattern.explanationTemplate
          }
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              explanationTemplate:
                e.target.value,
            })
          }
          className="border rounded p-2 w-full h-32"
        />
        {newPattern.type === "di" && (
          <textarea
            placeholder="DI Pattern JSON"
            value={newPattern.diPattern}
            onChange={(e) =>
              setNewPattern({
                ...newPattern,
                diPattern:
                  e.target.value,
              })
            }
            className="border rounded p-2 w-full h-40"
          />
        )}
        <textarea
          placeholder="Template"
          value={newPattern.template}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              template:
                e.target.value,
            })
          }
          className="border rounded p-2 w-full h-24"
        />

        <textarea
          placeholder="Variables JSON"
          value={newPattern.variables}
          onChange={(e) =>
            setNewPattern({
              ...newPattern,
              variables:
                e.target.value,
            })
          }
          className="border rounded p-2 w-full h-32"
        />

        <button
          onClick={savePattern}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingPatternId
            ? "Update Pattern"
            : "Create Pattern"}
        </button>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div>
          <label className="block mb-2 font-medium">
            Pattern
          </label>

          <select
            value={patternId}
            onChange={(e) =>
              setPatternId(
                e.target.value,
              )
            }
            className="border rounded p-2 w-full"
          >
            <option value="">
              Select Pattern
            </option>

            {patterns.map((p) => (
              <option
                key={p.id}
                value={p.id}
              >
                {p.name} (
                {p.topic})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Number of Questions
          </label>

          <input
            type="number"
            value={count}
            onChange={(e) =>
              setCount(
                Number(
                  e.target.value,
                ),
              )
            }
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="border rounded-lg p-4 space-y-4 bg-slate-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                Difficulty Settings
              </h2>
              <p className="text-sm text-slate-600">
                Tune generation difficulty only when you need targeted or mixed-difficulty output.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Exam Profile
                </label>
                <select
                  value={
                    difficultySettings.examProfile
                  }
                  onChange={(e) =>
                    setDifficultySettings(
                      (prev) => ({
                        ...prev,
                        examProfile:
                          e.target
                            .value as ExamProfileId,
                      }),
                    )
                  }
                  className="border rounded p-2 w-full"
                >
                  {EXAM_PROFILE_OPTIONS.map(
                    (profile) => (
                      <option
                        key={profile.id}
                        value={profile.id}
                      >
                        {profile.label}
                      </option>
                    ),
                  )}
                </select>
                <p className="text-xs text-slate-500">
                  {getProfileDescription(
                    difficultySettings.examProfile,
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  DI Set Profile
                </label>
                <select
                  value={
                    difficultySettings.setProfile
                  }
                  onChange={(e) =>
                    setDifficultySettings(
                      (prev) => ({
                        ...prev,
                        setProfile:
                          e.target
                            .value as DISetProfile,
                      }),
                    )
                  }
                  className="border rounded p-2 w-full"
                >
                  <option value="progressive">
                    Progressive
                  </option>
                  <option value="balanced">
                    Balanced
                  </option>
                  <option value="spike">
                    Spike
                  </option>
                  <option value="uniform">
                    Uniform
                  </option>
                </select>
                <p className="text-xs text-slate-500">
                  Controls how DI sets ramp from easier starter questions to harder inference-heavy questions.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  difficultySettings.enableTargetDifficulty
                }
                onChange={(e) =>
                  setDifficultySettings(
                    (prev) => ({
                      ...prev,
                      enableTargetDifficulty:
                        e.target.checked,
                    }),
                  )
                }
              />
              <span className="font-medium">
                Target Difficulty
              </span>
            </label>

            {difficultySettings.enableTargetDifficulty && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="font-medium">
                      Target Difficulty
                    </label>
                    <span className="rounded border bg-white px-2 py-1">
                      {difficultySettings.targetDifficulty.toFixed(
                        1,
                      )}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={
                      difficultySettings.targetDifficulty
                    }
                    onChange={(e) =>
                      setDifficultySettings(
                        (prev) => ({
                          ...prev,
                          targetDifficulty:
                            Number(
                              e.target.value,
                            ),
                        }),
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Difficulty Tolerance
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={
                        difficultySettings.difficultyTolerance
                      }
                      onChange={(e) =>
                        setDifficultySettings(
                          (prev) => ({
                            ...prev,
                            difficultyTolerance:
                              Number(
                                e.target.value,
                              ),
                          }),
                        )
                      }
                      className="w-full"
                    />
                    <span className="min-w-14 rounded border bg-white px-2 py-1 text-center text-sm">
                      +/-
                      {difficultySettings.difficultyTolerance.toFixed(
                        1,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  difficultySettings.enableDistribution
                }
                onChange={(e) =>
                  setDifficultySettings(
                    (prev) => ({
                      ...prev,
                      enableDistribution:
                        e.target.checked,
                    }),
                  )
                }
              />
              <span className="font-medium">
                Difficulty Distribution
              </span>
            </label>

            {difficultySettings.enableDistribution && (
              <div className="space-y-4 rounded border bg-white p-4">
                {(
                  [
                    "easy",
                    "medium",
                    "hard",
                  ] as const
                ).map((key) => (
                  <div
                    key={key}
                    className="grid items-center gap-3 md:grid-cols-[120px_1fr_80px]"
                  >
                    <label className="text-sm font-medium capitalize">
                      {key}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={
                        difficultySettings
                          .difficultyDistribution[
                          key
                        ]
                      }
                      onChange={(e) =>
                        setDifficultySettings(
                          (prev) => ({
                            ...prev,
                            difficultyDistribution:
                              {
                                ...prev.difficultyDistribution,
                                [key]:
                                  clampNumber(
                                    Number(
                                      e.target.value,
                                    ),
                                    0,
                                    100,
                                  ),
                              },
                          }),
                        )
                      }
                      className="w-full"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={
                        difficultySettings
                          .difficultyDistribution[
                          key
                        ]
                      }
                      onChange={(e) =>
                        setDifficultySettings(
                          (prev) => ({
                            ...prev,
                            difficultyDistribution:
                              {
                                ...prev.difficultyDistribution,
                                [key]:
                                  clampNumber(
                                    Number(
                                      e.target.value,
                                    ) || 0,
                                    0,
                                    100,
                                  ),
                              },
                          }),
                        )
                      }
                      className="border rounded p-2 w-full"
                    />
                  </div>
                ))}

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-medium">
                    Total:
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 ${getDistributionTotal(
                      difficultySettings.difficultyDistribution,
                    ) === 100
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                  >
                    {getDistributionTotal(
                      difficultySettings.difficultyDistribution,
                    )}
                    %
                  </span>
                  <span className="text-slate-600">
                    If this is not 100, the request is normalized automatically before generation.
                  </span>
                </div>
              </div>
            )}

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  difficultySettings.enableTargetAverageDifficulty
                }
                onChange={(e) =>
                  setDifficultySettings(
                    (prev) => ({
                      ...prev,
                      enableTargetAverageDifficulty:
                        e.target.checked,
                    }),
                  )
                }
              />
              <span className="font-medium">
                Target Average Difficulty
              </span>
            </label>

            {difficultySettings.enableTargetAverageDifficulty && (
              <div className="max-w-xs space-y-2">
                <label className="block text-sm font-medium">
                  Target Average
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.1"
                  value={
                    difficultySettings.targetAverageDifficulty
                  }
                  onChange={(e) =>
                    setDifficultySettings(
                      (prev) => ({
                        ...prev,
                        targetAverageDifficulty:
                          clampNumber(
                            Number(
                              e.target.value,
                            ) || 1,
                            1,
                            10,
                          ),
                      }),
                    )
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading
            ? "Generating..."
            : "Generate Batch"}
        </button>
        <button
          onClick={() =>
            setGenerated([])
          }
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear All
        </button>
      </div>

      {generated.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">
              Generated Questions
            </h2>

            <button
              onClick={
                saveQuestions
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save to Question Bank
            </button>
          </div>

          {renderGeneratedDifficultySummary(
            generated,
          )}

          {generated.map(
            (q, idx) => {
              if (isDISet(q)) {
                return renderDISet(q, idx);
              }
              return (
                <div
                  key={idx}
                  className={`border rounded-lg p-4 space-y-3 ${isDuplicateQuestion(idx)
                    ? "border-red-500 bg-red-50"
                    : ""
                    }`}
                >
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() =>
                        regenerateQuestion(idx)
                      }
                      className="text-blue-600 text-sm"
                    >
                      Regenerate
                    </button>

                    <button
                      onClick={() => {
                        setGenerated(
                          generated.filter(
                            (
                              _: GeneratedQuestion,
                              questionIndex: number,
                            ) =>
                              questionIndex !==
                              idx,
                          ),
                        );
                      }}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  {isDuplicateQuestion(
                    idx,
                  ) && (
                      <div className="text-red-600 text-sm font-medium">
                        Duplicate Question
                      </div>
                    )}
                  <div className="font-medium">
                    {idx + 1}.{" "}
                    <textarea
                      value={q.text}
                      onChange={(e) => {
                        const updated = [
                          ...generated,
                        ];

                        updated[idx].text =
                          e.target.value;

                        setGenerated(updated);
                      }}
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  {renderDifficultyAnalytics(
                    q,
                  )}

                  <div className="space-y-2">
                    {q.options?.map(
                      (
                        opt: string,
                        i: number,
                      ) => (
                        <div
                          key={i}
                          className={`border rounded p-2 ${q.correct === i
                            ? "bg-green-100"
                            : ""
                            }`}
                        >
                          <input
                            value={opt}
                            onChange={(e) => {
                              const updated = [
                                ...generated,
                              ];

                              updated[idx].options[i] =
                                e.target.value;

                              setGenerated(updated);
                            }}
                            className="w-full bg-transparent outline-none"
                          />
                        </div>
                      ),
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Correct Answer:
                    </span>

                    <select
                      value={q.correct}
                      onChange={(e) => {
                        const updated = [
                          ...generated,
                        ];

                        updated[idx].correct =
                          Number(
                            e.target.value,
                          );

                        setGenerated(updated);
                      }}
                      className="border rounded p-2"
                    >
                      {q.options.map(
                        (
                          _: string,
                          optionIndex: number,
                        ) => (
                          <option
                            key={optionIndex}
                            value={optionIndex}
                          >
                            Option{" "}
                            {optionIndex + 1}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div>
                      <label className="text-sm font-medium">
                        Topic
                      </label>

                      <input
                        value={q.topic || ""}
                        onChange={(e) => {
                          const updated = [
                            ...generated,
                          ];

                          updated[idx].topic =
                            e.target.value;

                          setGenerated(updated);
                        }}
                        className="border rounded p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Section
                      </label>

                      <input
                        value={
                          q.section || ""
                        }
                        onChange={(e) => {
                          const updated = [
                            ...generated,
                          ];

                          updated[idx].section =
                            e.target.value;

                          setGenerated(updated);
                        }}
                        className="border rounded p-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Difficulty
                      </label>

                      <select
                        value={
                          q.difficulty ||
                          "Easy"
                        }
                        onChange={(e) => {
                          const updated = [
                            ...generated,
                          ];

                          updated[idx].difficulty =
                            e.target.value;

                          setGenerated(updated);
                        }}
                        className="border rounded p-2 w-full"
                      >
                        <option value="Easy">
                          Easy
                        </option>

                        <option value="Medium">
                          Medium
                        </option>

                        <option value="Hard">
                          Hard
                        </option>
                      </select>
                    </div>
                    <textarea
                      value={q.explanation}
                      onChange={(e) => {
                        const updated = [
                          ...generated,
                        ];

                        updated[idx].explanation =
                          e.target.value;

                        setGenerated(updated);
                      }}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                </div>
             );
},
          )}
        </div>
      )}
    </div>
  );
}
