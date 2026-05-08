import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

type TsdSubtype =
  | "fundamental"
  | "average_speed"
  | "relative_motion"
  | "train"
  | "medium_motion"
  | "race"
  | "circular"
  | "escalator";

type TsdMotifDraft = {
  id: string;
  subtype: TsdSubtype;
  primitives: string[];
  hiddenStructures: string[];
  distractorFamilies: string[];
  arithmeticProfile: string[];
  difficulty: 1 | 2 | 3 | 4;
  examples: string[];
};

type TsdMotifConfig = {
  id: string;
  categories: string[];
  operations: string[];
  distractors: string[];
  depth: [number, number];
  difficulties: QuantMotif["supportedDifficultyBands"];
  strategy: string;
  tuning: QuantMotif["difficultyTuning"];
  diversityTag: string;
};

export const speedDistanceScopeMap = {
  chapter: "Time, Speed & Distance",
  coreDomains: [
    "Distance Speed Time",
    "Average Speed",
    "Relative Speed",
    "Train Crossing",
    "Boats and Streams",
    "Races",
    "Circular Tracks",
    "Escalators",
    "Faulty Speedometer",
  ],
} as const;

export const speedDistanceConcepts = [
  "vector-state motion",
  "position velocity time tracking",
  "relative frame transformation",
  "medium velocity influence",
  "effective distance construction",
  "harmonic average speed",
  "cyclic recurrence",
  "race head-start equivalence",
];

export const speedDistanceCoreFrameworks = [
  {
    id: "CF1",
    title: "Vector-State Model",
    canonicalRelation:
      "position(t) = initialPosition + velocity x time",
  },
  {
    id: "CF2",
    title: "Distance-Speed-Time Framework",
    canonicalRelation: "distance = speed x time",
  },
  {
    id: "CF3",
    title: "Relative Motion Framework",
    canonicalRelation:
      "relativeVelocity = velocityA - velocityB",
  },
  {
    id: "CF4",
    title: "Medium Influence Framework",
    canonicalRelation:
      "effectiveSpeed = stillSpeed +/- mediumSpeed",
  },
  {
    id: "CF5",
    title: "Effective Distance Framework",
    canonicalRelation:
      "crossingDistance = movingObjectLength + obstacleLength",
  },
  {
    id: "CF6",
    title: "Periodic Motion Framework",
    canonicalRelation:
      "meeting interval = trackLength / relativeSpeed",
  },
];

export const speedDistanceDistractorRegistry = [
  "Arithmetic_Mean_Trap",
  "Unit_Inconsistency_KM_M",
  "Relative_Direction_Swap",
  "Train_Length_Omission",
  "Up_Down_Sign_Confusion",
  "Square_Root_Neglect",
  "Headstart_Direction_Error",
  "Time_Delta_Subtraction",
  "Platform_Relative_Error",
  "Stoppage_Denominator_Flip",
  "Circular_LCM_Error",
  "Boat_Still_Water_Confusion",
  "Wait_Time_Neglect",
  "Overshoot_Catchup",
  "Fractional_Inversion",
  "Relative_Window_Man",
  "Race_Base_Value",
  "Wind_Resistance_Neglect",
] as const;

export const speedDistanceProceduralMotifs: TsdMotifDraft[] = [
  {
    id: "tsd-basic-dst",
    subtype: "fundamental",
    primitives: ["distance", "speed", "time"],
    hiddenStructures: ["unit normalization"],
    distractorFamilies: ["Unit_Inconsistency_KM_M"],
    arithmeticProfile: ["single vector state"],
    difficulty: 1,
    examples: ["Basic D = S x T with km/h and m/s conversion."],
  },
  {
    id: "tsd-ratio-fixed-d",
    subtype: "fundamental",
    primitives: ["constant distance", "speed ratio"],
    hiddenStructures: ["inverse time ratio"],
    distractorFamilies: ["Fractional_Inversion"],
    arithmeticProfile: ["ratio inversion"],
    difficulty: 2,
    examples: ["Distance fixed, speed ratio gives inverse time ratio."],
  },
  {
    id: "tsd-ratio-fixed-t",
    subtype: "fundamental",
    primitives: ["constant time", "speed ratio"],
    hiddenStructures: ["direct distance ratio"],
    distractorFamilies: ["Fractional_Inversion"],
    arithmeticProfile: ["direct ratio mapping"],
    difficulty: 1,
    examples: ["Time fixed, distance ratio equals speed ratio."],
  },
  {
    id: "tsd-fractional-speed",
    subtype: "fundamental",
    primitives: ["usual speed", "fractional speed", "late time"],
    hiddenStructures: ["time difference equation"],
    distractorFamilies: ["Fractional_Inversion"],
    arithmeticProfile: ["fractional speed shift"],
    difficulty: 3,
    examples: ["Walking at k/n usual speed causes late arrival."],
  },
  {
    id: "tsd-late-early-shift",
    subtype: "fundamental",
    primitives: ["two speeds", "late time", "early time"],
    hiddenStructures: ["time delta addition"],
    distractorFamilies: ["Time_Delta_Subtraction"],
    arithmeticProfile: ["distance backsolve"],
    difficulty: 3,
    examples: ["One speed is late, another speed is early; find distance."],
  },
  {
    id: "tsd-avg-equal-dist",
    subtype: "average_speed",
    primitives: ["equal distances", "two speeds"],
    hiddenStructures: ["harmonic mean"],
    distractorFamilies: ["Arithmetic_Mean_Trap"],
    arithmeticProfile: ["two-leg harmonic average"],
    difficulty: 2,
    examples: ["Average speed for equal distance halves."],
  },
  {
    id: "tsd-avg-equal-time",
    subtype: "average_speed",
    primitives: ["equal times", "two speeds"],
    hiddenStructures: ["arithmetic mean by time weights"],
    distractorFamilies: ["Arithmetic_Mean_Trap"],
    arithmeticProfile: ["equal-time weighted average"],
    difficulty: 1,
    examples: ["Average speed for equal time intervals."],
  },
  {
    id: "tsd-avg-harmonic-3",
    subtype: "average_speed",
    primitives: ["three equal distances", "three speeds"],
    hiddenStructures: ["three-term harmonic mean"],
    distractorFamilies: ["Arithmetic_Mean_Trap"],
    arithmeticProfile: ["three-leg harmonic average"],
    difficulty: 3,
    examples: ["Average speed over three equal parts."],
  },
  {
    id: "tsd-avg-weighted",
    subtype: "average_speed",
    primitives: ["unequal distances", "segment speeds"],
    hiddenStructures: ["total distance over total time"],
    distractorFamilies: ["Arithmetic_Mean_Trap"],
    arithmeticProfile: ["weighted travel aggregation"],
    difficulty: 3,
    examples: ["Average speed over unequal route segments."],
  },
  {
    id: "tsd-rel-opp-dir",
    subtype: "relative_motion",
    primitives: ["opposite directions", "closure distance"],
    hiddenStructures: ["additive relative speed"],
    distractorFamilies: ["Relative_Direction_Swap"],
    arithmeticProfile: ["relative vector sum"],
    difficulty: 2,
    examples: ["Two bodies moving toward each other."],
  },
  {
    id: "tsd-rel-same-dir",
    subtype: "relative_motion",
    primitives: ["same direction", "initial gap"],
    hiddenStructures: ["subtractive relative speed"],
    distractorFamilies: ["Relative_Direction_Swap"],
    arithmeticProfile: ["catch-up motion"],
    difficulty: 2,
    examples: ["A faster object catches a slower object."],
  },
  {
    id: "tsd-delayed-start",
    subtype: "relative_motion",
    primitives: ["delayed start", "lead distance"],
    hiddenStructures: ["wait-time lead"],
    distractorFamilies: ["Wait_Time_Neglect"],
    arithmeticProfile: ["catch-up after delay"],
    difficulty: 3,
    examples: ["Second body starts later and catches the first."],
  },
  {
    id: "tsd-post-crossing",
    subtype: "relative_motion",
    primitives: ["post-meeting times"],
    hiddenStructures: ["square-root speed ratio"],
    distractorFamilies: ["Square_Root_Neglect"],
    arithmeticProfile: ["meeting-aftereffect ratio"],
    difficulty: 4,
    examples: ["After meeting, bodies take different times to reach ends."],
  },
  {
    id: "tsd-stoppage-time",
    subtype: "relative_motion",
    primitives: ["speed excluding stoppage", "speed including stoppage"],
    hiddenStructures: ["lost movement per hour"],
    distractorFamilies: ["Stoppage_Denominator_Flip"],
    arithmeticProfile: ["effective speed loss"],
    difficulty: 3,
    examples: ["Find stoppage time per hour from effective speed drop."],
  },
  {
    id: "tsd-train-pole",
    subtype: "train",
    primitives: ["train length", "train speed"],
    hiddenStructures: ["point-object crossing"],
    distractorFamilies: ["Train_Length_Omission"],
    arithmeticProfile: ["length over speed"],
    difficulty: 2,
    examples: ["A train crosses a pole."],
  },
  {
    id: "tsd-train-platform",
    subtype: "train",
    primitives: ["train length", "platform length", "train speed"],
    hiddenStructures: ["sum of lengths"],
    distractorFamilies: ["Train_Length_Omission"],
    arithmeticProfile: ["effective crossing distance"],
    difficulty: 3,
    examples: ["A train crosses a platform or bridge."],
  },
  {
    id: "tsd-train-moving-man",
    subtype: "train",
    primitives: ["train speed", "man speed", "direction"],
    hiddenStructures: ["relative speed to point observer"],
    distractorFamilies: ["Relative_Direction_Swap"],
    arithmeticProfile: ["moving-observer crossing"],
    difficulty: 3,
    examples: ["A train crosses a man moving in same or opposite direction."],
  },
  {
    id: "tsd-train-crossing",
    subtype: "train",
    primitives: ["two train lengths", "two train speeds"],
    hiddenStructures: ["relative speed and sum lengths"],
    distractorFamilies: ["Platform_Relative_Error"],
    arithmeticProfile: ["two-object crossing"],
    difficulty: 3,
    examples: ["Two trains cross each other."],
  },
  {
    id: "tsd-train-window-man",
    subtype: "train",
    primitives: ["faster train length", "relative train speeds"],
    hiddenStructures: ["passenger as point observer"],
    distractorFamilies: ["Relative_Window_Man"],
    arithmeticProfile: ["window passenger crossing"],
    difficulty: 3,
    examples: ["A train crosses a passenger sitting in another train."],
  },
  {
    id: "tsd-boat-basic",
    subtype: "medium_motion",
    primitives: ["still-water speed", "stream speed"],
    hiddenStructures: ["directional effective speed"],
    distractorFamilies: ["Up_Down_Sign_Confusion"],
    arithmeticProfile: ["medium velocity addition"],
    difficulty: 2,
    examples: ["Find upstream or downstream speed."],
  },
  {
    id: "tsd-boat-inverse",
    subtype: "medium_motion",
    primitives: ["upstream speed", "downstream speed"],
    hiddenStructures: ["intrinsic-medium decomposition"],
    distractorFamilies: ["Boat_Still_Water_Confusion"],
    arithmeticProfile: ["speed decomposition"],
    difficulty: 2,
    examples: ["Recover boat and stream speed from directional speeds."],
  },
  {
    id: "tsd-boat-round-trip",
    subtype: "medium_motion",
    primitives: ["equal route", "upstream speed", "downstream speed"],
    hiddenStructures: ["directional asymmetry"],
    distractorFamilies: ["Wind_Resistance_Neglect"],
    arithmeticProfile: ["bidirectional time aggregation"],
    difficulty: 3,
    examples: ["Total time for downstream and upstream journey."],
  },
  {
    id: "tsd-boat-ratio",
    subtype: "medium_motion",
    primitives: ["upstream-time ratio", "downstream-time ratio"],
    hiddenStructures: ["directional time-speed inversion"],
    distractorFamilies: ["Up_Down_Sign_Confusion"],
    arithmeticProfile: ["medium ratio reconstruction"],
    difficulty: 3,
    examples: ["Upstream takes n times downstream for the same distance."],
  },
  {
    id: "tsd-medium-wind",
    subtype: "medium_motion",
    primitives: ["aircraft speed", "wind speed"],
    hiddenStructures: ["headwind tailwind transformation"],
    distractorFamilies: ["Wind_Resistance_Neglect"],
    arithmeticProfile: ["moving-medium round trip"],
    difficulty: 3,
    examples: ["Aircraft speed affected by wind."],
  },
  {
    id: "tsd-race-dist-beats",
    subtype: "race",
    primitives: ["race length", "beat distance"],
    hiddenStructures: ["same time distance ratio"],
    distractorFamilies: ["Race_Base_Value"],
    arithmeticProfile: ["race-distance equivalence"],
    difficulty: 3,
    examples: ["A beats B by a given distance."],
  },
  {
    id: "tsd-race-time-beats",
    subtype: "race",
    primitives: ["race time", "beat time"],
    hiddenStructures: ["finish-time gap"],
    distractorFamilies: ["Race_Base_Value"],
    arithmeticProfile: ["race-time equivalence"],
    difficulty: 3,
    examples: ["A beats B by a given time."],
  },
  {
    id: "tsd-race-start",
    subtype: "race",
    primitives: ["head start", "runner speeds"],
    hiddenStructures: ["effective race length"],
    distractorFamilies: ["Headstart_Direction_Error"],
    arithmeticProfile: ["head-start adjustment"],
    difficulty: 3,
    examples: ["A gives B a start of some metres."],
  },
  {
    id: "tsd-race-dead-heat",
    subtype: "race",
    primitives: ["equal finish time", "speed ratio"],
    hiddenStructures: ["head-start reconstruction"],
    distractorFamilies: ["Headstart_Direction_Error"],
    arithmeticProfile: ["dead-heat calibration"],
    difficulty: 3,
    examples: ["Find start needed to make the race end in a tie."],
  },
  {
    id: "tsd-circ-first-meet",
    subtype: "circular",
    primitives: ["track length", "relative speed"],
    hiddenStructures: ["periodic closure"],
    distractorFamilies: ["Circular_LCM_Error"],
    arithmeticProfile: ["first cyclic meeting"],
    difficulty: 4,
    examples: ["First meeting on a circular track."],
  },
  {
    id: "tsd-circ-start-meet",
    subtype: "circular",
    primitives: ["lap times", "LCM"],
    hiddenStructures: ["same starting point recurrence"],
    distractorFamilies: ["Circular_LCM_Error"],
    arithmeticProfile: ["lap-time LCM"],
    difficulty: 4,
    examples: ["Meet again at the starting point."],
  },
  {
    id: "tsd-circ-distinct-points",
    subtype: "circular",
    primitives: ["track length", "speed pair"],
    hiddenStructures: ["modular meeting positions"],
    distractorFamilies: ["Circular_LCM_Error"],
    arithmeticProfile: ["distinct cyclic positions"],
    difficulty: 4,
    examples: ["Number of distinct meeting points on a circular track."],
  },
  {
    id: "tsd-circ-relative-lap",
    subtype: "circular",
    primitives: ["track length", "same-direction speeds"],
    hiddenStructures: ["relative lap gain"],
    distractorFamilies: ["Relative_Direction_Swap"],
    arithmeticProfile: ["lapping interval"],
    difficulty: 4,
    examples: ["Faster runner laps the slower runner."],
  },
  {
    id: "tsd-esc-with-flow",
    subtype: "escalator",
    primitives: ["person rate", "escalator rate", "steps"],
    hiddenStructures: ["moving walkway net speed"],
    distractorFamilies: ["Relative_Direction_Swap"],
    arithmeticProfile: ["moving stair flow"],
    difficulty: 4,
    examples: ["Person walks on a moving escalator."],
  },
  {
    id: "tsd-esc-stationary",
    subtype: "escalator",
    primitives: ["moving steps", "person rate", "escalator rate"],
    hiddenStructures: ["hidden escalator contribution"],
    distractorFamilies: ["Wait_Time_Neglect"],
    arithmeticProfile: ["stationary-step reconstruction"],
    difficulty: 4,
    examples: ["Compare steps on moving and stationary escalator."],
  },
  {
    id: "tsd-faulty-speedometer",
    subtype: "escalator",
    primitives: ["shown speed", "percentage error"],
    hiddenStructures: ["measurement correction"],
    distractorFamilies: ["Fractional_Inversion"],
    arithmeticProfile: ["displayed-to-actual speed"],
    difficulty: 3,
    examples: ["Speedometer shows more than actual speed."],
  },
];

function buildConfig(
  draft: TsdMotifDraft,
): TsdMotifConfig {
  const difficultyMap = {
    1: ["Easy", "Medium"],
    2: ["Easy", "Medium", "Hard"],
    3: ["Medium", "Hard"],
    4: ["Hard"],
  } as const;
  return {
    id: draft.id,
    categories: [
      draft.subtype,
      ...draft.hiddenStructures,
    ],
    operations: [
      ...draft.primitives,
      ...draft.arithmeticProfile,
    ],
    distractors: draft.distractorFamilies,
    depth:
      draft.difficulty === 1
        ? [1, 2]
        : draft.difficulty === 2
          ? [2, 4]
          : draft.difficulty === 3
            ? [3, 5]
            : [5, 7],
    difficulties:
      difficultyMap[draft.difficulty],
    strategy:
      "vector-state procedural generation with position, velocity, and time normalization",
    tuning: {
      easy: [
        "Use one moving body or a direct proportionality state.",
        "Keep unit conversion simple and numbers integral.",
      ],
      medium: [
        "Introduce one relative-motion, average-speed, or medium-motion transformation.",
        "Keep final yields mental and exam-realistic.",
      ],
      hard: [
        "Use effective distance, cyclic recurrence, head-start, or delayed-reference-frame reasoning.",
        "Avoid difficulty through large numbers alone.",
      ],
    },
    diversityTag: draft.subtype,
  };
}

const speedDistanceMotifConfigs =
  speedDistanceProceduralMotifs.map(
    buildConfig,
  );

export const speedDistanceMotifs =
  speedDistanceMotifConfigs.map((config) =>
    defineQuantMotif({
      id: config.id,
      topicCluster:
        "speed-time-distance",
      reasoningCategories:
        config.categories,
      preferredOperations:
        config.operations,
      compatibleTopics: [
        "speed-time-distance",
        "boats-streams",
        "trains",
        "races",
      ],
      compatiblePatternTypes: [
        "formula",
        "logic",
      ],
      requiredVariables:
        config.operations,
      supportedReasoningTypes: [
        "direct",
        "comparative",
        "conditional",
        "multi-step",
        "inferential",
      ],
      requiredReasoningCapabilities: [
        "arithmetic",
        "comparative",
        "conditional",
        "multi-step",
      ],
      supportedDifficultyBands:
        config.difficulties,
      commonDistractors:
        config.distractors,
      inferenceStyle:
        config.depth[1] >= 5
          ? "hidden"
          : "conditional",
      reasoningDepthRange:
        config.depth,
      generationStrategy: [
        config.strategy,
      ],
      parameterRanges: {
        speedKmh:
          "Prefer 36, 40, 45, 54, 60, 72, 90 for clean m/s conversion.",
        distance:
          "Prefer distances that divide cleanly by selected speeds.",
        trainLength:
          "Prefer 120m, 150m, 180m, 240m.",
        trackLength:
          "Prefer 300m, 400m, 600m for circular-track recurrence.",
      },
      distractorStrategies:
        config.distractors,
      difficultyTuning:
        config.tuning,
      validationRules: [
        "Convert all speeds to a common unit before solving.",
        "Validate positive effective speed for streams and wind.",
        "For train crossing, include the full effective distance.",
        "For races, ensure track length exceeds head-start or beat distance.",
      ],
      diversityTags: [
        config.diversityTag,
        config.id,
      ],
      wordingBias: {
        balanced: 0.6,
        inferenceHeavy: 0.4,
      },
      examWeights: {
        ssc: 0.55,
        ibps: 0.25,
        cat: 0.15,
        rrb: 0.05,
      },
    }),
  );
