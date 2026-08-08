import {
  addClockSecondsExact,
  addRationals,
  compareRationals,
  divideRationals,
  exactRational,
  hourMinuteAngleSnapshotExact,
  moduloRational,
  multiplyRationals,
  rationalToFractionString,
  rationalToMixedParts,
  rationalsEqual,
  subtractRationals,
  clockTimeToTotalSecondsExact,
  type ClockTime12Input,
  type ExactRational,
  type ExactRationalInput,
} from "../../../../../foundation/temporal";

export type ClockCp001Difficulty = "EASY" | "MEDIUM" | "HARD";

export type ClockAngleMode =
  | "SMALLER_ANGLE"
  | "REFLEX_ANGLE"
  | "CLOCKWISE_MINUTE_FROM_HOUR"
  | "CLOCKWISE_HOUR_FROM_MINUTE";

export type ClockTimeFrame = "DIRECT" | "AFTER_SHIFT" | "BEFORE_SHIFT";

export type ClockAngleDistractorLabel =
  | "SHIFT_IGNORED"
  | "HOUR_HAND_SNAPPED_TO_HOUR_MARK"
  | "REFLEX_INSTEAD_OF_SMALLER"
  | "SMALLER_INSTEAD_OF_REFLEX"
  | "DIRECTION_REVERSED"
  | "PLUS_SIGN_IN_ANGLE_FORMULA"
  | "HOUR_HAND_RATE_AS_ONE_DEGREE_PER_MINUTE"
  | "MINUTE_HAND_RATE_AS_FIVE_DEGREES_PER_MINUTE"
  | "USED_MINUTE_HAND_POSITION_AS_SEPARATION"
  | "USED_HOUR_HAND_POSITION_AS_SEPARATION";

export interface SerializedRational {
  numerator: string;
  denominator: string;
}

export interface ClockCp001Option {
  display: string;
  semanticKey: string;
  value: SerializedRational;
  isCorrect: boolean;
  label: "CORRECT" | ClockAngleDistractorLabel;
  likelyMistake?: string;
}

export interface ClockCp001Question {
  schemaVersion: "1.0";
  chapterCode: "CLK-001";
  checkpointCode: "CLK-CP-001";
  provisionalAuthority: "ANGLE_AT_STATED_TIME";
  prototypeId: string;
  permanentQlId: null;
  seed: string;
  difficulty: ClockCp001Difficulty;
  stem: string;
  scenario: {
    angleMode: ClockAngleMode;
    frame: ClockTimeFrame;
    baseTime: { hour: number; minute: number };
    shiftMinutes: number;
    targetTime: { hour: number; minute: number };
  };
  answer: {
    display: string;
    semanticKey: string;
    value: SerializedRational;
  };
  options: ClockCp001Option[];
  correctOptionIndex: number;
  explanation: {
    strategy: string;
    steps: string[];
    closestTrap: string;
    conclusion: string;
  };
  solverEvidence: {
    targetTimeTotalSeconds: string;
    hourAngleDeg: string;
    minuteAngleDeg: string;
    clockwiseMinuteFromHourDeg: string;
    clockwiseHourFromMinuteDeg: string;
    smallerAngleDeg: string;
    reflexAngleDeg: string;
    canonicalAnswer: string;
    independentAnswer: string;
    agreement: true;
  };
  fingerprint: string;
  lifecycle: {
    contentStatus: "OPEN_DISCOVERY";
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    localizationStatus: "NOT_STARTED";
  };
}

export interface GenerateClockCp001QuestionInput {
  seed: string;
  difficulty?: ClockCp001Difficulty;
  angleMode?: ClockAngleMode;
  frame?: ClockTimeFrame;
  correctOptionIndex?: 0 | 1 | 2 | 3;
}

class ClockSeededRandom {
  private state: number;

  constructor(seed: string) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < seed.length; index += 1) {
      hash ^= seed.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    this.state = hash >>> 0 || 0x6d2b79f5;
  }

  nextUint32(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  int(minInclusive: number, maxInclusive: number): number {
    const width = maxInclusive - minInclusive + 1;
    return minInclusive + Math.floor((this.nextUint32() / 0x1_0000_0000) * width);
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)] as T;
  }

  shuffle<T>(items: readonly T[]): T[] {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = this.int(0, index);
      [shuffled[index], shuffled[swapIndex]] = [
        shuffled[swapIndex] as T,
        shuffled[index] as T,
      ];
    }
    return shuffled;
  }
}

function serializeRational(value: ExactRational): SerializedRational {
  return {
    numerator: value.numerator.toString(),
    denominator: value.denominator.toString(),
  };
}

function formatExactScalar(value: ExactRational): string {
  const parts = rationalToMixedParts(value);
  const sign = parts.sign < 0 ? "−" : "";

  if (parts.remainder === 0n) {
    return `${sign}${parts.whole}`;
  }

  if (parts.denominator === 2n && parts.remainder === 1n) {
    return `${sign}${parts.whole}.5`;
  }

  if (parts.whole === 0n) {
    return `${sign}${parts.remainder}/${parts.denominator}`;
  }

  return `${sign}${parts.whole} ${parts.remainder}/${parts.denominator}`;
}

export function formatClockAngle(value: ExactRational): string {
  return `${formatExactScalar(value)}°`;
}

function formatTime(time: { hour: number; minute: number }): string {
  return `${time.hour}:${time.minute.toString().padStart(2, "0")}`;
}

function chooseDifficulty(rng: ClockSeededRandom): ClockCp001Difficulty {
  return rng.pick(["EASY", "MEDIUM", "MEDIUM", "HARD"] as const);
}

function chooseMode(
  rng: ClockSeededRandom,
  difficulty: ClockCp001Difficulty,
): ClockAngleMode {
  if (difficulty === "EASY") {
    return "SMALLER_ANGLE";
  }
  if (difficulty === "MEDIUM") {
    return rng.pick(["SMALLER_ANGLE", "REFLEX_ANGLE"] as const);
  }
  return rng.pick([
    "SMALLER_ANGLE",
    "REFLEX_ANGLE",
    "CLOCKWISE_MINUTE_FROM_HOUR",
    "CLOCKWISE_HOUR_FROM_MINUTE",
  ] as const);
}

function chooseFrame(
  rng: ClockSeededRandom,
  difficulty: ClockCp001Difficulty,
): ClockTimeFrame {
  if (difficulty === "EASY") {
    return "DIRECT";
  }
  if (difficulty === "MEDIUM") {
    return rng.pick(["DIRECT", "DIRECT", "AFTER_SHIFT"] as const);
  }
  return rng.pick(["DIRECT", "AFTER_SHIFT", "BEFORE_SHIFT"] as const);
}

function chooseMinute(
  rng: ClockSeededRandom,
  difficulty: ClockCp001Difficulty,
): number {
  if (difficulty === "EASY") {
    return rng.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as const);
  }
  return rng.int(1, 59);
}

function selectAngleByMode(
  mode: ClockAngleMode,
  values: {
    clockwiseMinuteFromHourDeg: ExactRational;
    clockwiseHourFromMinuteDeg: ExactRational;
    smallerAngleDeg: ExactRational;
    reflexAngleDeg: ExactRational;
  },
): ExactRational {
  switch (mode) {
    case "SMALLER_ANGLE":
      return values.smallerAngleDeg;
    case "REFLEX_ANGLE":
      return values.reflexAngleDeg;
    case "CLOCKWISE_MINUTE_FROM_HOUR":
      return values.clockwiseMinuteFromHourDeg;
    case "CLOCKWISE_HOUR_FROM_MINUTE":
      return values.clockwiseHourFromMinuteDeg;
  }
}

function angleSetFromClockwiseMinuteFromHour(
  clockwiseMinuteFromHourDeg: ExactRational,
): {
  clockwiseMinuteFromHourDeg: ExactRational;
  clockwiseHourFromMinuteDeg: ExactRational;
  smallerAngleDeg: ExactRational;
  reflexAngleDeg: ExactRational;
} {
  const clockwiseHourFromMinuteDeg = moduloRational(
    subtractRationals(360, clockwiseMinuteFromHourDeg),
    360,
  );
  const smallerAngleDeg =
    compareRationals(
      clockwiseMinuteFromHourDeg,
      clockwiseHourFromMinuteDeg,
    ) <= 0
      ? clockwiseMinuteFromHourDeg
      : clockwiseHourFromMinuteDeg;
  const reflexAngleDeg = rationalsEqual(smallerAngleDeg, 0)
    ? exactRational(0)
    : compareRationals(
          clockwiseMinuteFromHourDeg,
          clockwiseHourFromMinuteDeg,
        ) >= 0
      ? clockwiseMinuteFromHourDeg
      : clockwiseHourFromMinuteDeg;

  return {
    clockwiseMinuteFromHourDeg,
    clockwiseHourFromMinuteDeg,
    smallerAngleDeg,
    reflexAngleDeg,
  };
}

function answerFromRawClockwise(
  mode: ClockAngleMode,
  rawClockwiseMinuteFromHour: ExactRationalInput,
): ExactRational {
  const normalized = moduloRational(rawClockwiseMinuteFromHour, 360);
  return selectAngleByMode(mode, angleSetFromClockwiseMinuteFromHour(normalized));
}

function independentlySolveAngle(
  time: ClockTime12Input,
  mode: ClockAngleMode,
): ExactRational {
  const elapsedSeconds = clockTimeToTotalSecondsExact(time);
  const relativePhase = moduloRational(
    divideRationals(multiplyRationals(elapsedSeconds, 11), 120),
    360,
  );
  return answerFromRawClockwise(mode, relativePhase);
}

function resolveTargetTime(
  baseTime: { hour: number; minute: number },
  frame: ClockTimeFrame,
  shiftMinutes: number,
): { hour: number; minute: number } {
  const signedShiftSeconds =
    frame === "BEFORE_SHIFT" ? -shiftMinutes * 60 : shiftMinutes * 60;
  const target =
    frame === "DIRECT"
      ? { ...baseTime }
      : addClockSecondsExact(baseTime, signedShiftSeconds);

  return { hour: target.hour, minute: target.minute };
}

function canonicalAnswerFor(
  time: { hour: number; minute: number },
  mode: ClockAngleMode,
): ExactRational {
  return selectAngleByMode(mode, hourMinuteAngleSnapshotExact(time));
}

function rawClockwiseFromAngles(
  hourAngle: ExactRationalInput,
  minuteAngle: ExactRationalInput,
): ExactRational {
  return moduloRational(subtractRationals(minuteAngle, hourAngle), 360);
}

export function recomputeClockCp001Distractor(
  label: ClockAngleDistractorLabel,
  scenario: ClockCp001Question["scenario"],
): ExactRational {
  const time =
    label === "SHIFT_IGNORED" ? scenario.baseTime : scenario.targetTime;
  const hour = time.hour % 12;
  const minute = time.minute;

  if (label === "SHIFT_IGNORED") {
    return canonicalAnswerFor(time, scenario.angleMode);
  }

  if (label === "REFLEX_INSTEAD_OF_SMALLER") {
    return hourMinuteAngleSnapshotExact(time).reflexAngleDeg;
  }

  if (label === "SMALLER_INSTEAD_OF_REFLEX") {
    return hourMinuteAngleSnapshotExact(time).smallerAngleDeg;
  }

  if (label === "DIRECTION_REVERSED") {
    const snapshot = hourMinuteAngleSnapshotExact(time);
    return scenario.angleMode === "CLOCKWISE_MINUTE_FROM_HOUR"
      ? snapshot.clockwiseHourFromMinuteDeg
      : snapshot.clockwiseMinuteFromHourDeg;
  }

  if (label === "HOUR_HAND_SNAPPED_TO_HOUR_MARK") {
    return answerFromRawClockwise(
      scenario.angleMode,
      rawClockwiseFromAngles(hour * 30, minute * 6),
    );
  }

  if (label === "PLUS_SIGN_IN_ANGLE_FORMULA") {
    return answerFromRawClockwise(
      scenario.angleMode,
      addRationals(hour * 30, exactRational(11 * minute, 2)),
    );
  }

  if (label === "HOUR_HAND_RATE_AS_ONE_DEGREE_PER_MINUTE") {
    return answerFromRawClockwise(
      scenario.angleMode,
      rawClockwiseFromAngles(hour * 30 + minute, minute * 6),
    );
  }

  if (label === "MINUTE_HAND_RATE_AS_FIVE_DEGREES_PER_MINUTE") {
    return answerFromRawClockwise(
      scenario.angleMode,
      rawClockwiseFromAngles(
        addRationals(hour * 30, exactRational(minute, 2)),
        minute * 5,
      ),
    );
  }

  if (label === "USED_MINUTE_HAND_POSITION_AS_SEPARATION") {
    return answerFromRawClockwise(scenario.angleMode, minute * 6);
  }

  return answerFromRawClockwise(
    scenario.angleMode,
    addRationals(hour * 30, exactRational(minute, 2)),
  );
}

function distractorReason(
  label: ClockAngleDistractorLabel,
  scenario: ClockCp001Question["scenario"],
): string {
  const target = formatTime(scenario.targetTime);
  switch (label) {
    case "SHIFT_IGNORED":
      return `The angle was calculated at ${formatTime(scenario.baseTime)} instead of first moving to ${target}.`;
    case "HOUR_HAND_SNAPPED_TO_HOUR_MARK":
      return `The hour hand was left on the hour numeral, ignoring its continuous movement during the ${scenario.targetTime.minute} minutes.`;
    case "REFLEX_INSTEAD_OF_SMALLER":
      return "The larger reflex angle was reported even though the question asks for the smaller angle.";
    case "SMALLER_INSTEAD_OF_REFLEX":
      return "The smaller angle was reported even though the question asks for the reflex angle.";
    case "DIRECTION_REVERSED":
      return "The clockwise direction was reversed, so the complementary directed angle was obtained.";
    case "PLUS_SIGN_IN_ANGLE_FORMULA":
      return "The hour and minute terms were added instead of finding their angular separation.";
    case "HOUR_HAND_RATE_AS_ONE_DEGREE_PER_MINUTE":
      return "The hour hand was moved by 1° per minute instead of its correct rate of 0.5° per minute.";
    case "MINUTE_HAND_RATE_AS_FIVE_DEGREES_PER_MINUTE":
      return "The minute hand was moved by 5° per minute instead of 6° per minute.";
    case "USED_MINUTE_HAND_POSITION_AS_SEPARATION":
      return "The minute hand's position from 12 was used instead of the separation between the two hands.";
    case "USED_HOUR_HAND_POSITION_AS_SEPARATION":
      return "The hour hand's position from 12 was used instead of the separation between the two hands.";
  }
}

function buildStem(
  mode: ClockAngleMode,
  frame: ClockTimeFrame,
  baseTime: { hour: number; minute: number },
  shiftMinutes: number,
): string {
  const base = formatTime(baseTime);
  const timeClause =
    frame === "DIRECT"
      ? `at ${base}`
      : frame === "AFTER_SHIFT"
        ? `${shiftMinutes} minutes after ${base}`
        : `${shiftMinutes} minutes before ${base}`;

  switch (mode) {
    case "SMALLER_ANGLE":
      return `What is the smaller angle between the hour and minute hands of a clock ${timeClause}?`;
    case "REFLEX_ANGLE":
      return `What is the reflex angle between the hour and minute hands of a clock ${timeClause}?`;
    case "CLOCKWISE_MINUTE_FROM_HOUR":
      return `At ${timeClause.replace(/^at /, "")}, through what angle must one move clockwise from the hour hand to reach the minute hand?`;
    case "CLOCKWISE_HOUR_FROM_MINUTE":
      return `At ${timeClause.replace(/^at /, "")}, through what angle must one move clockwise from the minute hand to reach the hour hand?`;
  }
}

function buildExplanation(
  scenario: ClockCp001Question["scenario"],
  answer: ExactRational,
  selectedDistractors: ClockCp001Option[],
): ClockCp001Question["explanation"] {
  const target = scenario.targetTime;
  const snapshot = hourMinuteAngleSnapshotExact(target);
  const targetText = formatTime(target);
  const steps: string[] = [];

  if (scenario.frame !== "DIRECT") {
    const movement = scenario.frame === "AFTER_SHIFT" ? "later" : "earlier";
    steps.push(
      `${scenario.shiftMinutes} minutes ${movement} than ${formatTime(scenario.baseTime)} is ${targetText}.`,
    );
  }

  steps.push(
    `At ${targetText}, the hour hand is at 30 × ${target.hour} + ${target.minute}/2 = ${formatClockAngle(snapshot.handAngles.hourAngleDeg)}.`,
  );
  steps.push(
    `The minute hand is at 6 × ${target.minute} = ${formatClockAngle(snapshot.handAngles.minuteAngleDeg)}.`,
  );

  if (scenario.angleMode === "SMALLER_ANGLE") {
    steps.push(
      `The two separations are ${formatClockAngle(snapshot.clockwiseMinuteFromHourDeg)} and ${formatClockAngle(snapshot.clockwiseHourFromMinuteDeg)}; choose the smaller one.`,
    );
  } else if (scenario.angleMode === "REFLEX_ANGLE") {
    steps.push(
      `The two separations are ${formatClockAngle(snapshot.clockwiseMinuteFromHourDeg)} and ${formatClockAngle(snapshot.clockwiseHourFromMinuteDeg)}; choose the larger reflex angle.`,
    );
  } else if (scenario.angleMode === "CLOCKWISE_MINUTE_FROM_HOUR") {
    steps.push(
      `Moving clockwise from the hour hand to the minute hand gives ${formatClockAngle(snapshot.clockwiseMinuteFromHourDeg)}.`,
    );
  } else {
    steps.push(
      `Moving clockwise from the minute hand to the hour hand gives ${formatClockAngle(snapshot.clockwiseHourFromMinuteDeg)}.`,
    );
  }

  const trap = selectedDistractors.find((option) => !option.isCorrect)?.likelyMistake;
  return {
    strategy: "Place both hands from 12 using their exact rates; the hour hand must move continuously with the minutes.",
    steps,
    closestTrap:
      trap ??
      "Do not keep the hour hand fixed on the hour numeral after minutes have elapsed.",
    conclusion: `Therefore, the required angle is ${formatClockAngle(answer)}.`,
  };
}

function isScenarioUsable(
  scenario: ClockCp001Question["scenario"],
  correct: ExactRational,
): boolean {
  if (rationalsEqual(correct, 0)) {
    return false;
  }
  if (
    (scenario.angleMode === "SMALLER_ANGLE" ||
      scenario.angleMode === "REFLEX_ANGLE") &&
    rationalsEqual(correct, 180)
  ) {
    return false;
  }
  return true;
}

function candidateLabelsFor(
  scenario: ClockCp001Question["scenario"],
): ClockAngleDistractorLabel[] {
  const labels: ClockAngleDistractorLabel[] = [];
  if (scenario.frame !== "DIRECT") {
    labels.push("SHIFT_IGNORED");
  }
  if (scenario.angleMode === "SMALLER_ANGLE") {
    labels.push("REFLEX_INSTEAD_OF_SMALLER");
  } else if (scenario.angleMode === "REFLEX_ANGLE") {
    labels.push("SMALLER_INSTEAD_OF_REFLEX");
  } else {
    labels.push("DIRECTION_REVERSED");
  }
  labels.push(
    "HOUR_HAND_SNAPPED_TO_HOUR_MARK",
    "PLUS_SIGN_IN_ANGLE_FORMULA",
    "HOUR_HAND_RATE_AS_ONE_DEGREE_PER_MINUTE",
    "MINUTE_HAND_RATE_AS_FIVE_DEGREES_PER_MINUTE",
    "USED_MINUTE_HAND_POSITION_AS_SEPARATION",
    "USED_HOUR_HAND_POSITION_AS_SEPARATION",
  );
  return labels;
}

function buildOptions(
  rng: ClockSeededRandom,
  scenario: ClockCp001Question["scenario"],
  correct: ExactRational,
  requestedCorrectIndex: 0 | 1 | 2 | 3 | undefined,
): { options: ClockCp001Option[]; correctOptionIndex: number } | null {
  const seen = new Set([rationalToFractionString(correct)]);
  const candidateOptions: ClockCp001Option[] = [];

  for (const label of rng.shuffle(candidateLabelsFor(scenario))) {
    const value = recomputeClockCp001Distractor(label, scenario);
    const semanticKey = rationalToFractionString(value);
    if (seen.has(semanticKey)) {
      continue;
    }
    seen.add(semanticKey);
    candidateOptions.push({
      display: formatClockAngle(value),
      semanticKey,
      value: serializeRational(value),
      isCorrect: false,
      label,
      likelyMistake: distractorReason(label, scenario),
    });
    if (candidateOptions.length === 3) {
      break;
    }
  }

  if (candidateOptions.length !== 3) {
    return null;
  }

  const correctOption: ClockCp001Option = {
    display: formatClockAngle(correct),
    semanticKey: rationalToFractionString(correct),
    value: serializeRational(correct),
    isCorrect: true,
    label: "CORRECT",
  };
  const correctOptionIndex = requestedCorrectIndex ?? rng.int(0, 3);
  const options = rng.shuffle(candidateOptions);
  options.splice(correctOptionIndex, 0, correctOption);

  return { options, correctOptionIndex };
}

export function generateClockCp001Question(
  input: GenerateClockCp001QuestionInput,
): ClockCp001Question {
  const rng = new ClockSeededRandom(input.seed);
  const difficulty = input.difficulty ?? chooseDifficulty(rng);
  const angleMode = input.angleMode ?? chooseMode(rng, difficulty);
  const frame = input.frame ?? chooseFrame(rng, difficulty);

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const baseTime = {
      hour: rng.int(1, 12),
      minute: chooseMinute(rng, difficulty),
    };
    const shiftMinutes =
      frame === "DIRECT"
        ? 0
        : rng.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as const);
    const targetTime = resolveTargetTime(baseTime, frame, shiftMinutes);
    const scenario: ClockCp001Question["scenario"] = {
      angleMode,
      frame,
      baseTime,
      shiftMinutes,
      targetTime,
    };
    const canonicalSnapshot = hourMinuteAngleSnapshotExact(targetTime);
    const canonicalAnswer = selectAngleByMode(angleMode, canonicalSnapshot);
    const independentAnswer = independentlySolveAngle(targetTime, angleMode);

    if (!rationalsEqual(canonicalAnswer, independentAnswer)) {
      throw new Error(`Clock CP-001 solver disagreement for seed ${input.seed}.`);
    }
    if (!isScenarioUsable(scenario, canonicalAnswer)) {
      continue;
    }

    const optionResult = buildOptions(
      rng,
      scenario,
      canonicalAnswer,
      input.correctOptionIndex,
    );
    if (!optionResult) {
      continue;
    }

    const answerSemanticKey = rationalToFractionString(canonicalAnswer);
    const prototypeId = `CLK-CP001-DISC-${angleMode}-${frame}`;
    const fingerprint = [
      prototypeId,
      formatTime(baseTime),
      shiftMinutes,
      formatTime(targetTime),
      answerSemanticKey,
    ].join("|");

    return {
      schemaVersion: "1.0",
      chapterCode: "CLK-001",
      checkpointCode: "CLK-CP-001",
      provisionalAuthority: "ANGLE_AT_STATED_TIME",
      prototypeId,
      permanentQlId: null,
      seed: input.seed,
      difficulty,
      stem: buildStem(angleMode, frame, baseTime, shiftMinutes),
      scenario,
      answer: {
        display: formatClockAngle(canonicalAnswer),
        semanticKey: answerSemanticKey,
        value: serializeRational(canonicalAnswer),
      },
      options: optionResult.options,
      correctOptionIndex: optionResult.correctOptionIndex,
      explanation: buildExplanation(
        scenario,
        canonicalAnswer,
        optionResult.options,
      ),
      solverEvidence: {
        targetTimeTotalSeconds: rationalToFractionString(
          clockTimeToTotalSecondsExact(targetTime),
        ),
        hourAngleDeg: rationalToFractionString(
          canonicalSnapshot.handAngles.hourAngleDeg,
        ),
        minuteAngleDeg: rationalToFractionString(
          canonicalSnapshot.handAngles.minuteAngleDeg,
        ),
        clockwiseMinuteFromHourDeg: rationalToFractionString(
          canonicalSnapshot.clockwiseMinuteFromHourDeg,
        ),
        clockwiseHourFromMinuteDeg: rationalToFractionString(
          canonicalSnapshot.clockwiseHourFromMinuteDeg,
        ),
        smallerAngleDeg: rationalToFractionString(
          canonicalSnapshot.smallerAngleDeg,
        ),
        reflexAngleDeg: rationalToFractionString(
          canonicalSnapshot.reflexAngleDeg,
        ),
        canonicalAnswer: answerSemanticKey,
        independentAnswer: rationalToFractionString(independentAnswer),
        agreement: true,
      },
      fingerprint,
      lifecycle: {
        contentStatus: "OPEN_DISCOVERY",
        questionStudioDiscoverable: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        localizationStatus: "NOT_STARTED",
      },
    };
  }

  throw new Error(`Unable to construct a valid Clock CP-001 question for ${input.seed}.`);
}

export const CLOCK_CP001_ANGLE_MODES: readonly ClockAngleMode[] = [
  "SMALLER_ANGLE",
  "REFLEX_ANGLE",
  "CLOCKWISE_MINUTE_FROM_HOUR",
  "CLOCKWISE_HOUR_FROM_MINUTE",
] as const;

export const CLOCK_CP001_TIME_FRAMES: readonly ClockTimeFrame[] = [
  "DIRECT",
  "AFTER_SHIFT",
  "BEFORE_SHIFT",
] as const;
