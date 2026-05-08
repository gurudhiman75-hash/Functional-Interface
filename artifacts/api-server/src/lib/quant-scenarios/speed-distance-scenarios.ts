import type {
  DifficultyLabel,
  OptionMetadata,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type {
  QuantScenarioContext,
} from "../quant/realization";
import {
  createReasoningStep,
  pickRandomItem,
} from "../shared";
import type { QuantProceduralScenario } from "./time-work-scenarios";

type TsdScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

type VectorState = {
  label: string;
  position: number;
  velocity: number;
  time: number;
};

type TsdDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: number;
  unit?: string;
  formula: string;
  steps: Array<[Parameters<typeof createReasoningStep>[0], string]>;
  distractors: number[];
  distractorLabels: string[];
  tokens?: string[];
  context?: QuantScenarioContext;
};

const TSD_CONTEXT: QuantScenarioContext = {
  entity: "moving body",
  metric: "motion value",
  context: "speed-time-distance",
};

function kmhToMs(speed: number) {
  return (speed * 5) / 18;
}

function round(value: number) {
  return (
    Math.round((value + Number.EPSILON) * 100) /
    100
  );
}

function formatNumber(value: number) {
  const rounded = round(value);
  return Number.isInteger(rounded)
    ? `${rounded}`
    : rounded.toFixed(2);
}

function formatAnswer(
  value: number,
  unit = "",
) {
  const numeric = formatNumber(value);
  return unit ? `${numeric} ${unit}` : numeric;
}

function structuralSignature(
  motifId: string,
  branch: string,
  keys: Array<string | number> = [],
) {
  return `${motifId}::${branch}::${keys.join("|")}`;
}

function makeVectorState(
  label: string,
  position: number,
  velocity: number,
  time: number,
): VectorState {
  return {
    label,
    position,
    velocity,
    time,
  };
}

function buildOptions(
  correctAnswer: number,
  unit: string | undefined,
  distractorValues: number[],
  distractorLabels: string[],
) {
  const candidates = [
    correctAnswer,
    ...distractorValues,
    correctAnswer +
      Math.max(
        1,
        Math.round(Math.abs(correctAnswer) * 0.12),
      ),
  ];
  const unique = Array.from(
    new Set(
      candidates
        .map(round)
        .filter(
          (value) =>
            Number.isFinite(value) &&
            value >= 0,
        ),
    ),
  );
  while (unique.length < 4) {
    unique.push(
      round(
        correctAnswer +
          unique.length *
            Math.max(
              1,
              Math.round(
                Math.abs(correctAnswer) * 0.1,
              ),
            ),
      ),
    );
  }
  const values = unique.slice(0, 4);
  const optionMetadata: OptionMetadata[] =
    values.map((value, index) =>
      index === 0
        ? {
            value: formatAnswer(value, unit),
            isCorrect: true,
          }
        : {
            value: formatAnswer(value, unit),
            isCorrect: false,
            distractorType:
              "wrongIntermediateValue",
            likelyMistake:
              distractorLabels[index - 1] ??
              "plausible motion-state slip",
            reasoningTrap:
              distractorLabels[index - 1] ??
              "wrong vector or unit transformation",
          },
    );
  return {
    options: values.map((value) =>
      formatAnswer(value, unit),
    ),
    correct: 0,
    optionMetadata,
  };
}

function finalizeTsdScenario(
  definition: TsdDefinition,
): QuantProceduralScenario {
  const vectorState = makeVectorState(
    definition.motifId,
    0,
    definition.values.speed ??
      definition.values.speed1 ??
      0,
    definition.answer,
  );
  return {
    scenarioType: "vector-state-motion",
    topicCluster: "speed-time-distance",
    values: {
      ...definition.values,
      vectorVelocity: vectorState.velocity,
      vectorTime: vectorState.time,
    },
    text: definition.text,
    correctAnswer: round(definition.answer),
    formula: definition.formula,
    reasoningSteps: definition.steps.map(
      ([operation, detail]) =>
        createReasoningStep(operation, detail),
    ),
    explanation: definition.steps
      .map(([, detail]) => detail)
      .join(" "),
    distractorHints:
      definition.distractorLabels,
    context:
      definition.context ?? TSD_CONTEXT,
    motifId: definition.motifId,
    scenarioLogicBranch:
      definition.branch,
    structuralSignature:
      structuralSignature(
        definition.motifId,
        definition.branch,
        Object.values(definition.values),
      ),
    customOptionBundle: buildOptions(
      definition.answer,
      definition.unit,
      definition.distractors,
      definition.distractorLabels,
    ),
    validationTokens:
      definition.tokens,
  };
}

function def(
  definition: TsdDefinition,
): TsdDefinition {
  return definition;
}

const scenarioDefinitionsByMotif: Record<
  string,
  TsdDefinition[]
> = {
  "tsd-basic-dst": [
    def({
      motifId: "tsd-basic-dst",
      branch: "kmh-time-direct",
      text:
        "A delivery van covers 180 km at a uniform speed of 60 km/h. How many hours does it take?",
      values: { distance: 180, speed: 60 },
      answer: 3,
      unit: "hours",
      formula: "time = distance / speed",
      steps: [
        [
          "transform",
          "Track the van as one vector state with distance 180 km and velocity 60 km/h.",
        ],
        [
          "infer",
          "Time is distance divided by speed, so 180 / 60 = 3 hours.",
        ],
      ],
      distractors: [240, 120, 2],
      distractorLabels: [
        "Unit_Inconsistency_KM_M",
        "Distance-speed multiplication",
        "Arithmetic slip",
      ],
      tokens: ["180", "60"],
    }),
    def({
      motifId: "tsd-basic-dst",
      branch: "kmh-to-ms-distance",
      text:
        "A train moves at 72 km/h for 30 seconds. What distance does it cover?",
      values: { speed: 72, seconds: 30 },
      answer: kmhToMs(72) * 30,
      unit: "m",
      formula: "distance = speed(m/s) x time",
      steps: [
        [
          "transform",
          "Convert 72 km/h to 20 m/s before combining it with seconds.",
        ],
        [
          "infer",
          "Distance = 20 x 30 = 600 m.",
        ],
      ],
      distractors: [2160, 102, 540],
      distractorLabels: [
        "Unit_Inconsistency_KM_M",
        "Speed and seconds added",
        "Premature conversion slip",
      ],
      tokens: ["72", "30"],
    }),
  ],
  "tsd-ratio-fixed-d": [
    def({
      motifId: "tsd-ratio-fixed-d",
      branch: "inverse-time-ratio",
      text:
        "Two buses cover the same route. Their speeds are in the ratio 2:3. If the slower bus takes 6 hours, how long does the faster bus take?",
      values: { speedRatioA: 2, speedRatioB: 3, slowerTime: 6 },
      answer: 4,
      unit: "hours",
      formula: "time ratio = inverse speed ratio",
      steps: [
        [
          "ratio",
          "For a fixed distance, time varies inversely with speed.",
        ],
        [
          "infer",
          "The faster time is 6 x 2 / 3 = 4 hours.",
        ],
      ],
      distractors: [9, 6, 3],
      distractorLabels: [
        "Fractional_Inversion",
        "No ratio conversion",
        "Dividing by both ratio parts",
      ],
      tokens: ["same route", "2:3", "6"],
    }),
  ],
  "tsd-ratio-fixed-t": [
    def({
      motifId: "tsd-ratio-fixed-t",
      branch: "direct-distance-ratio",
      text:
        "A cyclist and a scooter travel for the same 4 hours at 18 km/h and 45 km/h respectively. How many kilometres more does the scooter cover?",
      values: { time: 4, speed1: 18, speed2: 45 },
      answer: (45 - 18) * 4,
      unit: "km",
      formula: "distance difference = (speed2 - speed1) x time",
      steps: [
        [
          "compare",
          "With equal time, distance is directly proportional to speed.",
        ],
        [
          "infer",
          "The speed gap is 27 km/h, so in 4 hours the distance gap is 108 km.",
        ],
      ],
      distractors: [63, 27, 252],
      distractorLabels: [
        "Ignoring equal-time multiplication",
        "Only speed difference",
        "Adding speeds before multiplying",
      ],
      tokens: ["same 4 hours", "18", "45"],
    }),
  ],
  "tsd-fractional-speed": [
    def({
      motifId: "tsd-fractional-speed",
      branch: "usual-speed-fraction-late",
      text:
        "A student normally walks to a coaching centre at 60 km/h. One day he walks at 3/4 of his usual speed and reaches 20 minutes late. Find the distance.",
      values: { usualSpeed: 60, fractionNumerator: 3, fractionDenominator: 4, lateMinutes: 20 },
      answer: 60,
      unit: "km",
      formula: "D/(45) - D/(60) = 20/60",
      steps: [
        [
          "transform",
          "The reduced speed is 3/4 of 60 = 45 km/h.",
        ],
        [
          "infer",
          "The time gap equation is D/45 - D/60 = 1/3, giving D = 60 km.",
        ],
      ],
      distractors: [45, 80, 15],
      distractorLabels: [
        "Fractional_Inversion",
        "Late-time denominator slip",
        "Using speed loss as distance",
      ],
      tokens: ["3/4", "20 minutes late"],
    }),
  ],
  "tsd-late-early-shift": [
    def({
      motifId: "tsd-late-early-shift",
      branch: "late-early-distance-backsolve",
      text:
        "A commuter travelling at 40 km/h reaches 30 minutes late, but at 60 km/h reaches 30 minutes early. Find the distance of the journey.",
      values: { speed1: 40, speed2: 60, lateMinutes: 30, earlyMinutes: 30 },
      answer: 120,
      unit: "km",
      formula: "D/40 - D/60 = (30 + 30)/60",
      steps: [
        [
          "transform",
          "Late and early are on opposite sides of the scheduled time, so add them.",
        ],
        [
          "infer",
          "D/40 - D/60 = 1 hour, so D/120 = 1 and D = 120 km.",
        ],
      ],
      distractors: [60, 240, 100],
      distractorLabels: [
        "Time_Delta_Subtraction",
        "Relative speed instead of time equation",
        "Arithmetic slip",
      ],
      tokens: ["30 minutes late", "30 minutes early"],
    }),
  ],
  "tsd-avg-equal-dist": [
    def({
      motifId: "tsd-avg-equal-dist",
      branch: "two-equal-halves-harmonic",
      text:
        "A car covers half of a journey at 40 km/h and the remaining half at 60 km/h. Find the average speed.",
      values: { speed1: 40, speed2: 60 },
      answer: 48,
      unit: "km/h",
      formula: "2xy/(x+y)",
      steps: [
        [
          "average",
          "For equal distances, average speed is harmonic, not arithmetic.",
        ],
        [
          "infer",
          "Average speed = 2 x 40 x 60 / (40 + 60) = 48 km/h.",
        ],
      ],
      distractors: [50, 100, 20],
      distractorLabels: [
        "Arithmetic_Mean_Trap",
        "Adding speeds",
        "Half-difference slip",
      ],
      tokens: ["half", "remaining half"],
    }),
  ],
  "tsd-avg-equal-time": [
    def({
      motifId: "tsd-avg-equal-time",
      branch: "two-equal-times-arithmetic",
      text:
        "A biker travels for 2 hours at 40 km/h and another 2 hours at 60 km/h. Find the average speed.",
      values: { speed1: 40, speed2: 60, time1: 2, time2: 2 },
      answer: 50,
      unit: "km/h",
      formula: "(x+y)/2 for equal time",
      steps: [
        [
          "average",
          "Equal time intervals make the average speed the arithmetic mean of speeds.",
        ],
        [
          "infer",
          "Average speed = (40 + 60) / 2 = 50 km/h.",
        ],
      ],
      distractors: [48, 100, 20],
      distractorLabels: [
        "Using equal-distance harmonic mean",
        "Adding speeds",
        "Difference-only slip",
      ],
      tokens: ["2 hours", "another 2 hours"],
    }),
  ],
  "tsd-avg-harmonic-3": [
    def({
      motifId: "tsd-avg-harmonic-3",
      branch: "three-equal-parts",
      text:
        "A route is divided into three equal parts covered at 30 km/h, 45 km/h and 90 km/h. Find the average speed.",
      values: { speed1: 30, speed2: 45, speed3: 90 },
      answer: 45,
      unit: "km/h",
      formula: "3 / (1/x + 1/y + 1/z)",
      steps: [
        [
          "average",
          "For three equal distances, use the three-term harmonic average.",
        ],
        [
          "infer",
          "3 / (1/30 + 1/45 + 1/90) = 45 km/h.",
        ],
      ],
      distractors: [55, 165, 30],
      distractorLabels: [
        "Arithmetic_Mean_Trap",
        "Adding speeds",
        "Choosing lowest speed",
      ],
      tokens: ["three equal parts"],
    }),
  ],
  "tsd-avg-weighted": [
    def({
      motifId: "tsd-avg-weighted",
      branch: "unequal-segment-weights",
      text:
        "A truck covers 120 km at 40 km/h and then 180 km at 60 km/h. Find the average speed for the whole journey.",
      values: { distance1: 120, speed1: 40, distance2: 180, speed2: 60 },
      answer: 50,
      unit: "km/h",
      formula: "(d1+d2)/(d1/s1+d2/s2)",
      steps: [
        [
          "aggregate",
          "Total distance is 300 km and total time is 120/40 + 180/60 = 6 hours.",
        ],
        [
          "infer",
          "Average speed = 300 / 6 = 50 km/h.",
        ],
      ],
      distractors: [48, 100, 55],
      distractorLabels: [
        "Equal-distance harmonic trap",
        "Adding speeds",
        "Arithmetic mean trap",
      ],
      tokens: ["120", "180"],
    }),
  ],
  "tsd-rel-opp-dir": [
    def({
      motifId: "tsd-rel-opp-dir",
      branch: "opposite-direction-closure",
      text:
        "Two buses 200 km apart start towards each other at 60 km/h and 40 km/h. After how many hours will they meet?",
      values: { distance: 200, speed1: 60, speed2: 40 },
      answer: 2,
      unit: "hours",
      formula: "time = distance / (speed1 + speed2)",
      steps: [
        [
          "transform",
          "In opposite directions, relative speed is 60 + 40 = 100 km/h.",
        ],
        [
          "infer",
          "Time to meet = 200 / 100 = 2 hours.",
        ],
      ],
      distractors: [10, 5, 3],
      distractorLabels: [
        "Relative_Direction_Swap",
        "Subtracting speeds",
        "Arithmetic slip",
      ],
      tokens: ["towards each other"],
    }),
  ],
  "tsd-rel-same-dir": [
    def({
      motifId: "tsd-rel-same-dir",
      branch: "same-direction-catchup",
      text:
        "A police jeep moving at 60 km/h chases a thief's bike moving at 45 km/h. If the bike is 30 km ahead, when will the jeep catch it?",
      values: { gap: 30, speed1: 60, speed2: 45 },
      answer: 2,
      unit: "hours",
      formula: "time = gap / (faster - slower)",
      steps: [
        [
          "transform",
          "In the same direction, closure speed is 60 - 45 = 15 km/h.",
        ],
        [
          "infer",
          "Catch-up time = 30 / 15 = 2 hours.",
        ],
      ],
      distractors: [0.29, 1.5, 3],
      distractorLabels: [
        "Relative_Direction_Swap",
        "Using faster speed alone",
        "Arithmetic slip",
      ],
      tokens: ["chases", "ahead"],
    }),
  ],
  "tsd-delayed-start": [
    def({
      motifId: "tsd-delayed-start",
      branch: "lead-then-catch",
      text:
        "A cyclist starts at 40 km/h. One hour later, a scooter starts from the same point at 60 km/h. How far from the starting point will the scooter catch the cyclist?",
      values: { speed1: 40, speed2: 60, delay: 1 },
      answer: 120,
      unit: "km",
      formula: "catch distance = faster speed x lead/(faster-slower)",
      steps: [
        [
          "transform",
          "The cyclist has a 40 km lead after one hour.",
        ],
        [
          "infer",
          "The relative speed is 20 km/h, so catch-up takes 2 hours after the scooter starts.",
        ],
        [
          "infer",
          "The scooter covers 60 x 2 = 120 km by then.",
        ],
      ],
      distractors: [80, 40, 100],
      distractorLabels: [
        "Wait_Time_Neglect",
        "Lead distance only",
        "Adding speeds after delay",
      ],
      tokens: ["One hour later", "same point"],
    }),
  ],
  "tsd-post-crossing": [
    def({
      motifId: "tsd-post-crossing",
      branch: "post-meeting-square-root",
      text:
        "Two persons start from opposite ends of a road and meet. After meeting, the first takes 9 hours and the second takes 4 hours to reach the opposite ends. Find the ratio of the first person's speed to the second person's speed.",
      values: { afterFirst: 9, afterSecond: 4 },
      answer: 2 / 3,
      formula: "S1/S2 = sqrt(afterSecond/afterFirst)",
      steps: [
        [
          "ratio",
          "After meeting, speed ratio is the square root of the inverse remaining-time ratio.",
        ],
        [
          "infer",
          "S1/S2 = sqrt(4/9) = 2/3.",
        ],
      ],
      distractors: [4 / 9, 3 / 2, 9 / 4],
      distractorLabels: [
        "Square_Root_Neglect",
        "Ratio inversion",
        "Using time ratio directly",
      ],
      tokens: ["After meeting", "9 hours", "4 hours"],
    }),
  ],
  "tsd-stoppage-time": [
    def({
      motifId: "tsd-stoppage-time",
      branch: "effective-speed-loss-per-hour",
      text:
        "A bus runs at 60 km/h excluding stoppages and at 45 km/h including stoppages. For how many minutes does it stop per hour?",
      values: { excludingSpeed: 60, includingSpeed: 45 },
      answer: 15,
      unit: "minutes",
      formula: "stoppage = (Se - Si)/Se x 60",
      steps: [
        [
          "compare",
          "The lost movement fraction per hour is (60 - 45) / 60.",
        ],
        [
          "infer",
          "Stoppage time = 15/60 x 60 = 15 minutes per hour.",
        ],
      ],
      distractors: [20, 25, 10],
      distractorLabels: [
        "Stoppage_Denominator_Flip",
        "Speed difference treated as minutes",
        "Arithmetic slip",
      ],
      tokens: ["excluding stoppages", "including stoppages"],
    }),
  ],
  "tsd-train-pole": [
    def({
      motifId: "tsd-train-pole",
      branch: "point-object-crossing",
      text:
        "A 180 m long train crosses a pole at 54 km/h. Find the time taken.",
      values: { trainLength: 180, speed: 54 },
      answer: 12,
      unit: "seconds",
      formula: "time = train length / speed(m/s)",
      steps: [
        [
          "transform",
          "Convert 54 km/h to 15 m/s.",
        ],
        [
          "infer",
          "Crossing a pole means covering only the train length, so time = 180 / 15 = 12 seconds.",
        ],
      ],
      distractors: [3.33, 15, 18],
      distractorLabels: [
        "Unit_Inconsistency_KM_M",
        "Using speed number as seconds",
        "Arithmetic slip",
      ],
      tokens: ["180 m", "pole"],
    }),
  ],
  "tsd-train-platform": [
    def({
      motifId: "tsd-train-platform",
      branch: "train-plus-platform-length",
      text:
        "A 180 m long train running at 54 km/h crosses a 120 m platform. How many seconds does it take?",
      values: { trainLength: 180, platformLength: 120, speed: 54 },
      answer: 20,
      unit: "seconds",
      formula: "time = (train length + platform length) / speed(m/s)",
      steps: [
        [
          "aggregate",
          "The effective crossing distance is 180 + 120 = 300 m.",
        ],
        [
          "transform",
          "54 km/h is 15 m/s.",
        ],
        [
          "infer",
          "Time = 300 / 15 = 20 seconds.",
        ],
      ],
      distractors: [12, 5.56, 15],
      distractorLabels: [
        "Train_Length_Omission",
        "Unit_Inconsistency_KM_M",
        "Platform-only crossing",
      ],
      tokens: ["platform", "180", "120"],
    }),
  ],
  "tsd-train-moving-man": [
    def({
      motifId: "tsd-train-moving-man",
      branch: "train-crosses-moving-man",
      text:
        "A 180 m train running at 54 km/h crosses a man walking in the same direction at 9 km/h. Find the crossing time.",
      values: { trainLength: 180, trainSpeed: 54, manSpeed: 9 },
      answer: 14.4,
      unit: "seconds",
      formula: "time = length / relative speed",
      steps: [
        [
          "transform",
          "Same direction relative speed is 54 - 9 = 45 km/h = 12.5 m/s.",
        ],
        [
          "infer",
          "Time = 180 / 12.5 = 14.4 seconds.",
        ],
      ],
      distractors: [10.29, 12, 20],
      distractorLabels: [
        "Relative_Direction_Swap",
        "Ignoring man's motion",
        "Unit conversion slip",
      ],
      tokens: ["same direction", "man"],
    }),
  ],
  "tsd-train-crossing": [
    def({
      motifId: "tsd-train-crossing",
      branch: "two-trains-opposite-crossing",
      text:
        "Two trains of lengths 120 m and 180 m run in opposite directions at 54 km/h and 36 km/h. How long will they take to cross each other?",
      values: { length1: 120, length2: 180, speed1: 54, speed2: 36 },
      answer: 12,
      unit: "seconds",
      formula: "time = (L1+L2)/(S1+S2)",
      steps: [
        [
          "aggregate",
          "The effective distance is 120 + 180 = 300 m.",
        ],
        [
          "transform",
          "Opposite direction relative speed is 90 km/h = 25 m/s.",
        ],
        [
          "infer",
          "Time = 300 / 25 = 12 seconds.",
        ],
      ],
      distractors: [20, 3.33, 6],
      distractorLabels: [
        "Platform_Relative_Error",
        "Unit_Inconsistency_KM_M",
        "Length omission",
      ],
      tokens: ["opposite directions", "120", "180"],
    }),
  ],
  "tsd-train-window-man": [
    def({
      motifId: "tsd-train-window-man",
      branch: "passenger-as-point-observer",
      text:
        "A 150 m train running at 72 km/h crosses a passenger sitting in another train moving in the same direction at 54 km/h. Find the time taken.",
      values: { fasterLength: 150, fasterSpeed: 72, slowerSpeed: 54 },
      answer: 30,
      unit: "seconds",
      formula: "time = faster train length / relative speed",
      steps: [
        [
          "transform",
          "The passenger is a point observer, so only the faster train's length is used.",
        ],
        [
          "infer",
          "Relative speed = 18 km/h = 5 m/s; time = 150 / 5 = 30 seconds.",
        ],
      ],
      distractors: [60, 7.5, 20],
      distractorLabels: [
        "Relative_Window_Man",
        "Unit conversion slip",
        "Ignoring slower train motion",
      ],
      tokens: ["passenger sitting", "same direction"],
    }),
  ],
  "tsd-boat-basic": [
    def({
      motifId: "tsd-boat-basic",
      branch: "downstream-upstream-effective-speed",
      text:
        "A boat's speed in still water is 15 km/h and the stream speed is 3 km/h. Find its upstream speed.",
      values: { boatSpeed: 15, streamSpeed: 3 },
      answer: 12,
      unit: "km/h",
      formula: "upstream = boat - stream",
      steps: [
        [
          "transform",
          "Upstream motion subtracts stream speed from still-water speed.",
        ],
        [
          "infer",
          "Upstream speed = 15 - 3 = 12 km/h.",
        ],
      ],
      distractors: [18, 15, 9],
      distractorLabels: [
        "Up_Down_Sign_Confusion",
        "Boat_Still_Water_Confusion",
        "Subtracting stream twice",
      ],
      tokens: ["still water", "stream"],
    }),
  ],
  "tsd-boat-inverse": [
    def({
      motifId: "tsd-boat-inverse",
      branch: "directional-speed-decomposition",
      text:
        "A boat travels downstream at 20 km/h and upstream at 12 km/h. Find the speed of the stream.",
      values: { downstream: 20, upstream: 12 },
      answer: 4,
      unit: "km/h",
      formula: "stream = (downstream - upstream)/2",
      steps: [
        [
          "transform",
          "Downstream = boat + stream and upstream = boat - stream.",
        ],
        [
          "infer",
          "Stream speed = (20 - 12) / 2 = 4 km/h.",
        ],
      ],
      distractors: [16, 8, 20],
      distractorLabels: [
        "Boat_Still_Water_Confusion",
        "Forgetting to divide by 2",
        "Using downstream as stream speed",
      ],
      tokens: ["downstream", "upstream"],
    }),
  ],
  "tsd-boat-round-trip": [
    def({
      motifId: "tsd-boat-round-trip",
      branch: "equal-route-up-down-time",
      text:
        "A boat whose still-water speed is 10 km/h travels 24 km downstream and returns upstream. If the stream speed is 2 km/h, find the total time.",
      values: { boatSpeed: 10, streamSpeed: 2, distance: 24 },
      answer: 5,
      unit: "hours",
      formula: "time = d/(b+s) + d/(b-s)",
      steps: [
        [
          "transform",
          "Downstream speed is 12 km/h and upstream speed is 8 km/h.",
        ],
        [
          "infer",
          "Total time = 24/12 + 24/8 = 2 + 3 = 5 hours.",
        ],
      ],
      distractors: [4, 4.8, 6],
      distractorLabels: [
        "Wind_Resistance_Neglect",
        "Arithmetic mean speed trap",
        "Up_Down_Sign_Confusion",
      ],
      tokens: ["downstream", "returns upstream"],
    }),
  ],
  "tsd-boat-ratio": [
    def({
      motifId: "tsd-boat-ratio",
      branch: "upstream-takes-double",
      text:
        "For the same distance, a boat takes twice as long upstream as downstream. If its speed in still water is 9 km/h, find the stream speed.",
      values: { boatSpeed: 9, upstreamTimeRatio: 2 },
      answer: 3,
      unit: "km/h",
      formula: "(b+s)/(b-s)=2",
      steps: [
        [
          "ratio",
          "For the same distance, time ratio is inverse of speed ratio.",
        ],
        [
          "infer",
          "(9 + s)/(9 - s) = 2, so 9 + s = 18 - 2s and s = 3 km/h.",
        ],
      ],
      distractors: [6, 4.5, 12],
      distractorLabels: [
        "Up_Down_Sign_Confusion",
        "Ratio midpoint slip",
        "Using downstream speed as stream",
      ],
      tokens: ["twice as long", "upstream"],
    }),
  ],
  "tsd-medium-wind": [
    def({
      motifId: "tsd-medium-wind",
      branch: "aircraft-headwind-tailwind",
      text:
        "An aircraft flies 700 km with a tailwind and returns against the wind. Its still-air speed is 300 km/h and wind speed is 50 km/h. Find the total time.",
      values: { stillSpeed: 300, windSpeed: 50, distance: 700 },
      answer: 4.8,
      unit: "hours",
      formula: "d/(a+w) + d/(a-w)",
      steps: [
        [
          "transform",
          "Tailwind speed is 350 km/h and headwind speed is 250 km/h.",
        ],
        [
          "infer",
          "Total time = 700/350 + 700/250 = 2 + 2.8 = 4.8 hours.",
        ],
      ],
      distractors: [4.67, 4, 5.6],
      distractorLabels: [
        "Wind_Resistance_Neglect",
        "Ignoring return asymmetry",
        "Headwind-tailwind sign swap",
      ],
      tokens: ["tailwind", "against the wind"],
    }),
  ],
  "tsd-race-dist-beats": [
    def({
      motifId: "tsd-race-dist-beats",
      branch: "beat-distance-speed-ratio",
      text:
        "In a 1000 m race, A beats B by 100 m. Find the ratio of A's speed to B's speed.",
      values: { raceLength: 1000, beatDistance: 100 },
      answer: 10 / 9,
      formula: "speed ratio = 1000 : 900",
      steps: [
        [
          "ratio",
          "When A finishes 1000 m, B covers 900 m in the same time.",
        ],
        [
          "infer",
          "Speed ratio A:B = 1000:900 = 10:9.",
        ],
      ],
      distractors: [9 / 10, 100 / 1000, 11 / 10],
      distractorLabels: [
        "Race_Base_Value",
        "Beat distance as ratio",
        "Adding beat distance to race length",
      ],
      tokens: ["beats B by 100 m"],
    }),
  ],
  "tsd-race-time-beats": [
    def({
      motifId: "tsd-race-time-beats",
      branch: "finish-time-gap",
      text:
        "A runs a 100 m race in 10 seconds while B runs it in 12 seconds. By how many seconds does A beat B?",
      values: { raceLength: 100, timeA: 10, timeB: 12 },
      answer: 2,
      unit: "seconds",
      formula: "beat time = timeB - timeA",
      steps: [
        [
          "compare",
          "Both run the same distance, so compare their finish times directly.",
        ],
        [
          "infer",
          "A finishes 12 - 10 = 2 seconds before B.",
        ],
      ],
      distractors: [20, 1.2, 10],
      distractorLabels: [
        "Race_Base_Value",
        "Time ratio instead of time gap",
        "Using A's finish time",
      ],
      tokens: ["100 m race", "10 seconds", "12 seconds"],
    }),
  ],
  "tsd-race-start": [
    def({
      motifId: "tsd-race-start",
      branch: "head-start-winner-gap",
      text:
        "In a 1000 m race, A runs at 10 m/s and gives B a start of 100 m. If B runs at 8 m/s, by how many metres does A win?",
      values: { raceLength: 1000, start: 100, speedA: 10, speedB: 8 },
      answer: 100,
      unit: "m",
      formula: "remaining gap = track - start - speedB x timeA",
      steps: [
        [
          "transform",
          "A finishes in 1000/10 = 100 seconds.",
        ],
        [
          "infer",
          "B needs 900 m but covers 8 x 100 = 800 m by then, so A wins by 100 m.",
        ],
      ],
      distractors: [200, 0, 80],
      distractorLabels: [
        "Headstart_Direction_Error",
        "Dead-heat assumption",
        "Race_Base_Value",
      ],
      tokens: ["start of 100 m"],
    }),
  ],
  "tsd-race-dead-heat": [
    def({
      motifId: "tsd-race-dead-heat",
      branch: "start-for-tie",
      text:
        "A runs at 10 m/s and B runs at 9 m/s in a 1000 m race. How much start should A give B so that both finish together?",
      values: { raceLength: 1000, speedA: 10, speedB: 9 },
      answer: 100,
      unit: "m",
      formula: "start = track - speedB x (track/speedA)",
      steps: [
        [
          "transform",
          "A's finishing time is 1000 / 10 = 100 seconds.",
        ],
        [
          "infer",
          "In 100 seconds, B covers 900 m, so B needs a 100 m start.",
        ],
      ],
      distractors: [111.11, 90, 0],
      distractorLabels: [
        "Headstart_Direction_Error",
        "Race_Base_Value",
        "No-start assumption",
      ],
      tokens: ["finish together"],
    }),
  ],
  "tsd-circ-first-meet": [
    def({
      motifId: "tsd-circ-first-meet",
      branch: "opposite-circular-first-meet",
      text:
        "Two runners start from the same point on a 400 m circular track and run in opposite directions at 6 m/s and 4 m/s. When will they meet first?",
      values: { trackLength: 400, speed1: 6, speed2: 4 },
      answer: 40,
      unit: "seconds",
      formula: "time = track length / (speed1 + speed2)",
      steps: [
        [
          "transform",
          "Opposite circular motion closes one lap at relative speed 10 m/s.",
        ],
        [
          "infer",
          "First meeting time = 400 / 10 = 40 seconds.",
        ],
      ],
      distractors: [200, 100, 66.67],
      distractorLabels: [
        "Relative_Direction_Swap",
        "Circular_LCM_Error",
        "Using one runner's lap time",
      ],
      tokens: ["circular track", "opposite directions"],
    }),
  ],
  "tsd-circ-start-meet": [
    def({
      motifId: "tsd-circ-start-meet",
      branch: "starting-point-lcm",
      text:
        "Two runners complete a circular track in 80 seconds and 100 seconds respectively. After how many seconds will they again be together at the starting point?",
      values: { lapTime1: 80, lapTime2: 100 },
      answer: 400,
      unit: "seconds",
      formula: "LCM(lap times)",
      steps: [
        [
          "aggregate",
          "Meeting at the starting point requires both to complete whole laps.",
        ],
        [
          "infer",
          "LCM of 80 and 100 is 400 seconds.",
        ],
      ],
      distractors: [180, 20, 200],
      distractorLabels: [
        "Circular_LCM_Error",
        "Taking HCF instead of LCM",
        "One runner's multiple only",
      ],
      tokens: ["starting point", "80", "100"],
    }),
  ],
  "tsd-circ-distinct-points": [
    def({
      motifId: "tsd-circ-distinct-points",
      branch: "same-direction-distinct-meetings",
      text:
        "On a circular track, two runners move in the same direction with speeds 5 m/s and 3 m/s. If their speeds are in the ratio 5:3, at how many distinct points will the faster runner overtake the slower runner before the pattern repeats?",
      values: { speed1: 5, speed2: 3 },
      answer: 2,
      formula: "distinct points = speed difference / gcd(speed difference, slower-cycle step)",
      steps: [
        [
          "ratio",
          "Same-direction meeting positions repeat according to the relative gain in the speed ratio.",
        ],
        [
          "infer",
          "The relative gain is 5 - 3 = 2 units, giving 2 distinct overtake points before repetition.",
        ],
      ],
      distractors: [5, 3, 8],
      distractorLabels: [
        "Circular_LCM_Error",
        "Using slower speed",
        "Adding speed ratios",
      ],
      tokens: ["distinct points", "same direction"],
    }),
  ],
  "tsd-circ-relative-lap": [
    def({
      motifId: "tsd-circ-relative-lap",
      branch: "same-direction-lap",
      text:
        "Two cyclists start together on a 400 m circular track in the same direction at 6 m/s and 4 m/s. After how many seconds will the faster cyclist lap the slower one?",
      values: { trackLength: 400, speed1: 6, speed2: 4 },
      answer: 200,
      unit: "seconds",
      formula: "time = track length / (faster - slower)",
      steps: [
        [
          "transform",
          "To lap once, the faster cyclist must gain one full track length.",
        ],
        [
          "infer",
          "Relative speed = 2 m/s, so time = 400 / 2 = 200 seconds.",
        ],
      ],
      distractors: [40, 100, 66.67],
      distractorLabels: [
        "Relative_Direction_Swap",
        "Using faster speed alone",
        "Using slower speed alone",
      ],
      tokens: ["lap the slower"],
    }),
  ],
  "tsd-esc-with-flow": [
    def({
      motifId: "tsd-esc-with-flow",
      branch: "person-plus-escalator-rate",
      text:
        "A person walks up a moving escalator at 2 steps per second while the escalator moves at 1 step per second. If 60 visible steps must be cleared, how many seconds are required?",
      values: { personRate: 2, escalatorRate: 1, steps: 60 },
      answer: 20,
      unit: "seconds",
      formula: "time = steps / (person rate + escalator rate)",
      steps: [
        [
          "transform",
          "Walking with the escalator gives a net rate of 2 + 1 = 3 steps per second.",
        ],
        [
          "infer",
          "Time = 60 / 3 = 20 seconds.",
        ],
      ],
      distractors: [30, 60, 15],
      distractorLabels: [
        "Relative_Direction_Swap",
        "Escalator ignored",
        "Adding then subtracting rate",
      ],
      tokens: ["moving escalator", "2 steps", "1 step"],
    }),
  ],
  "tsd-esc-stationary": [
    def({
      motifId: "tsd-esc-stationary",
      branch: "hidden-escalator-steps",
      text:
        "A person takes 40 steps while walking up a moving escalator. He walks at 2 steps per second and the escalator contributes 1 step per second. How many steps are visible when the escalator is stationary?",
      values: { personSteps: 40, personRate: 2, escalatorRate: 1 },
      answer: 60,
      unit: "steps",
      formula: "visible steps = person steps + escalator steps during same time",
      steps: [
        [
          "transform",
          "Taking 40 steps at 2 steps per second means the person is on it for 20 seconds.",
        ],
        [
          "infer",
          "The escalator contributes 1 x 20 = 20 steps, so stationary visible steps = 40 + 20 = 60.",
        ],
      ],
      distractors: [40, 20, 80],
      distractorLabels: [
        "Wait_Time_Neglect",
        "Only escalator contribution",
        "Double-counting person steps",
      ],
      tokens: ["stationary", "moving escalator"],
    }),
  ],
  "tsd-faulty-speedometer": [
    def({
      motifId: "tsd-faulty-speedometer",
      branch: "displayed-speed-correction",
      text:
        "A speedometer shows 10% more than the actual speed. If it shows 66 km/h, what is the actual speed?",
      values: { shownSpeed: 66, errorPercent: 10 },
      answer: 60,
      unit: "km/h",
      formula: "actual = shown / 1.10",
      steps: [
        [
          "transform",
          "Shown speed is 110% of actual speed.",
        ],
        [
          "infer",
          "Actual speed = 66 / 1.10 = 60 km/h.",
        ],
      ],
      distractors: [72.6, 56, 66],
      distractorLabels: [
        "Fractional_Inversion",
        "Subtracting 10% from shown directly",
        "Ignoring faulty display",
      ],
      tokens: ["10% more", "shows 66"],
    }),
  ],
};

function createScenarioFromMotif(
  motifId: string,
): TsdScenarioFactory {
  return () => {
    const definitions =
      scenarioDefinitionsByMotif[motifId];
    return finalizeTsdScenario(
      pickRandomItem(definitions),
    );
  };
}

const scenarioFactoriesByMotif = new Map<
  string,
  TsdScenarioFactory
>(
  Object.keys(scenarioDefinitionsByMotif).map(
    (motifId) => [
      motifId,
      createScenarioFromMotif(motifId),
    ],
  ),
);

const legacyMotifAliases: Record<string, string> = {
  "relative-speed-meet":
    "tsd-rel-same-dir",
  "train-platform-offset":
    "tsd-train-platform",
  "boats-relative-speed":
    "tsd-boat-basic",
};

const patternSpecificMotifs: Record<
  string,
  string[]
> = {
  "registry-speed-distance-easy": [
    "tsd-basic-dst",
    "tsd-ratio-fixed-t",
    "tsd-avg-equal-time",
    "tsd-rel-opp-dir",
  ],
  "registry-speed-distance-medium": [
    "tsd-ratio-fixed-d",
    "tsd-avg-equal-dist",
    "tsd-avg-weighted",
    "tsd-rel-same-dir",
    "tsd-delayed-start",
    "tsd-stoppage-time",
    "tsd-train-pole",
    "tsd-boat-basic",
    "tsd-boat-inverse",
  ],
  "registry-speed-distance-hard": [
    "tsd-fractional-speed",
    "tsd-late-early-shift",
    "tsd-avg-harmonic-3",
    "tsd-post-crossing",
    "tsd-train-platform",
    "tsd-train-moving-man",
    "tsd-train-crossing",
    "tsd-train-window-man",
    "tsd-boat-round-trip",
    "tsd-boat-ratio",
    "tsd-medium-wind",
    "tsd-race-dist-beats",
    "tsd-race-time-beats",
    "tsd-race-start",
    "tsd-race-dead-heat",
    "tsd-circ-first-meet",
    "tsd-circ-start-meet",
    "tsd-circ-distinct-points",
    "tsd-circ-relative-lap",
    "tsd-esc-with-flow",
    "tsd-esc-stationary",
    "tsd-faulty-speedometer",
  ],
  "registry-boats-streams-medium": [
    "tsd-boat-basic",
    "tsd-boat-inverse",
    "tsd-boat-round-trip",
  ],
  "registry-boats-streams-hard": [
    "tsd-boat-round-trip",
    "tsd-boat-ratio",
    "tsd-medium-wind",
  ],
  "registry-speed-distance-trains-medium": [
    "tsd-train-pole",
    "tsd-train-platform",
    "tsd-train-moving-man",
  ],
  "registry-speed-distance-trains-hard": [
    "tsd-train-platform",
    "tsd-train-moving-man",
    "tsd-train-crossing",
    "tsd-train-window-man",
  ],
  "registry-speed-distance-races-medium": [
    "tsd-race-dist-beats",
    "tsd-race-time-beats",
    "tsd-race-start",
  ],
  "registry-speed-distance-races-hard": [
    "tsd-race-dist-beats",
    "tsd-race-start",
    "tsd-race-dead-heat",
  ],
  "registry-speed-distance-circular-hard": [
    "tsd-circ-first-meet",
    "tsd-circ-start-meet",
    "tsd-circ-distinct-points",
    "tsd-circ-relative-lap",
  ],
  "registry-speed-distance-boats-medium": [
    "tsd-boat-basic",
    "tsd-boat-inverse",
    "tsd-boat-round-trip",
  ],
  "registry-speed-distance-boats-hard": [
    "tsd-boat-round-trip",
    "tsd-boat-ratio",
    "tsd-medium-wind",
  ],
};

const fallbackMotifs = [
  "tsd-basic-dst",
  "tsd-avg-equal-dist",
  "tsd-rel-opp-dir",
  "tsd-rel-same-dir",
  "tsd-train-platform",
  "tsd-boat-basic",
  "tsd-race-dist-beats",
  "tsd-circ-relative-lap",
];

export function createSpeedDistanceScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const motifId =
    motif?.id &&
    (scenarioFactoriesByMotif.has(motif.id)
      ? motif.id
      : legacyMotifAliases[motif.id]);
  const patternMotifs =
    !motifId &&
    patternSpecificMotifs[pattern.id];
  const selectedMotif =
    motifId ??
    pickRandomItem(
      patternMotifs ?? fallbackMotifs,
    );
  const factory =
    scenarioFactoriesByMotif.get(
      selectedMotif,
    ) ??
    scenarioFactoriesByMotif.get(
      "tsd-basic-dst",
    );
  if (!factory) {
    throw new Error(
      `No strict speed-distance scenario mapping exists for motif ${selectedMotif}.`,
    );
  }
  return factory(difficulty, motif);
}
