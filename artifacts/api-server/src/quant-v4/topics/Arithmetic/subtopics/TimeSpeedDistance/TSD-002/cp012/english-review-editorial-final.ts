import { absRational, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP012_ENGLISH_REVIEW, type TsdCp012EnglishReviewQuestion } from "./english-review-final";
import { calibrateTsdCp012ReviewedDifficulty } from "./reviewed-difficulty";

function v(value: Rational): string { return toMixedString(value); }
function seconds(value: Rational): string { return `${v(value)} seconds`; }
function metres(value: Rational): string { return `${v(value)} m`; }
function speed(value: Rational): string { return `${v(value)} m/s`; }
function familyIndex(question: TsdCp012EnglishReviewQuestion): number {
  const suffix = question.familyId.at(-1) ?? "A";
  return Math.max(0, suffix.charCodeAt(0) - 65);
}

function feasibilityStem(question: TsdCp012EnglishReviewQuestion, index: number): string | undefined {
  const input = question.input;
  if (input.authorityKey !== "feasibleParameterSetState") return undefined;
  const request = input.target === "VALID_SET" ? "Which option gives the complete set of allowed speeds that satisfy the condition?" : "How many allowed speeds work?";
  const variants = [
    `An emergency van must cover ${metres(input.distance)}. Its speed must be an integer from ${input.minimumCandidate} to ${input.maximumCandidate} m/s. A fixed delay of ${seconds(input.fixedDelay)} is included, and total elapsed time cannot exceed ${seconds(input.deadline)}. ${request}`,
    `For a timed inspection run of ${metres(input.distance)}, the driver may select only an integer speed between ${input.minimumCandidate} and ${input.maximumCandidate} m/s. After adding a compulsory ${seconds(input.fixedDelay)} non-travel delay, the run must finish within ${seconds(input.deadline)}. ${request}`,
    `A service vehicle has ${metres(input.distance)} to travel and a total deadline of ${seconds(input.deadline)}, including a fixed ${seconds(input.fixedDelay)} halt. Only integer speeds from ${input.minimumCandidate} through ${input.maximumCandidate} m/s are permitted. ${request}`,
  ];
  return variants[index % variants.length]!;
}

function routeProfileSplitStem(question: TsdCp012EnglishReviewQuestion, index: number): string | undefined {
  const input = question.input;
  if (input.authorityKey !== "routeProfileProgramState" || input.target !== "DISTANCE_SPLIT_A") return undefined;
  const variants = [
    `A fixed ${metres(input.totalDistance)} route has two successive terrain sections. The first section is travelled at ${speed(input.speedA)} and the remaining section at ${speed(input.speedB)}. The complete route takes ${seconds(input.totalTime)}. Find the length of the first terrain section.`,
    `On a ${metres(input.totalDistance)} service route, the speed limit is ${speed(input.speedA)} up to one unknown route boundary and ${speed(input.speedB)} after that boundary. Total travel time is ${seconds(input.totalTime)}. How far from the start is the speed-change boundary?`,
  ];
  return variants[index % variants.length]!;
}

function raceGapStem(question: TsdCp012EnglishReviewQuestion, index: number): string | undefined {
  const input = question.input;
  if (input.authorityKey !== "closedTrackRaceSynthesisState" || input.target !== "TRACK_GAP_AT_FASTER_FINISH") return undefined;
  const raceDistance = `${input.raceLaps} lap${input.raceLaps === 1 ? "" : "s"}`;
  const variants = [
    `On a circular track of length ${metres(input.trackLength)}, two runners race for ${raceDistance}. The faster runner moves at ${speed(input.fasterSpeed)}; the slower runner moves at ${speed(input.slowerSpeed)} and starts ${metres(input.slowerHeadStart)} ahead. When the faster runner finishes, how much track distance does the slower runner still have to cover to reach the finish point?`,
    `A ${raceDistance} race is held on a ${metres(input.trackLength)} circular track. One runner runs at ${speed(input.fasterSpeed)} and the other at ${speed(input.slowerSpeed)}, with the slower runner given a ${metres(input.slowerHeadStart)} head start. At the instant the faster runner finishes, find the slower runner's remaining distance to that same finish point along the track.`,
    `Two athletes use a ${metres(input.trackLength)} closed track for a ${raceDistance} race. Their speeds are ${speed(input.fasterSpeed)} and ${speed(input.slowerSpeed)}, and the slower athlete begins ${metres(input.slowerHeadStart)} ahead. Determine the forward distance the slower athlete must still run to arrive at the finish when the faster athlete has just finished.`,
  ];
  return variants[index % variants.length]!;
}

function trainMeetingStem(question: TsdCp012EnglishReviewQuestion, index: number): string | undefined {
  const input = question.input;
  if (input.authorityKey !== "trainScheduleSynthesisState" || input.target !== "MEETING_TIME_FROM_FIRST_DEPARTURE") return undefined;
  const variants = [
    `Two trains start from stations ${metres(input.stationDistance)} apart and move toward each other. Train A starts first at ${speed(input.speedA)}; Train B starts ${seconds(input.delayB)} later at ${speed(input.speedB)}. Find the meeting time measured from Train A's departure.`,
    `Train A leaves station P at ${speed(input.speedA)} toward station Q, ${metres(input.stationDistance)} away. Train B leaves Q toward P ${seconds(input.delayB)} later at ${speed(input.speedB)}. How long after Train A's departure do they meet?`,
    `At time zero a train begins a ${metres(input.stationDistance)} station-to-station run at ${speed(input.speedA)}. From the opposite station, a second train starts ${seconds(input.delayB)} later at ${speed(input.speedB)} toward the first. Find the meeting time counted from time zero.`,
  ];
  return variants[index % variants.length]!;
}

function movingSurfaceStem(question: TsdCp012EnglishReviewQuestion, index: number): string | undefined {
  const input = question.input;
  if (input.authorityKey !== "movingSurfaceScheduleSynthesisState") return undefined;
  if (index % 2 === 0) return undefined;
  if (input.target === "TIME_WITH_STOP_AFTER") return `A ${metres(input.length)} airport walkway initially moves with a passenger. The passenger walks at ${speed(input.personRate)} relative to it and the belt contributes another ${speed(input.surfaceRate)} for ${seconds(input.surfaceActiveTime)} before stopping. Find the passenger's complete end-to-end time.`;
  if (input.target === "TIME_WITH_DELAYED_ACTIVATION") return `A traveller starts walking along a ${metres(input.length)} conveyor walkway at ${speed(input.personRate)} while the belt is stationary. After ${seconds(input.activationDelay)} the belt starts in the same direction at ${speed(input.surfaceRate)}. How long after the traveller starts is the far end reached?`;
  if (input.target === "TIME_WITH_DIRECTION_REVERSAL") return `A person crosses a ${metres(input.length)} moving surface while walking at ${speed(input.personRate)} relative to it. For the first ${seconds(input.reversalTime)} the surface assists at ${speed(input.surfaceRate)}; it then runs at the same speed in the opposite direction. Find the total crossing time.`;
  return undefined;
}

const RUNNER_NAMES = Object.freeze([
  Object.freeze(["Aman", "Bharat"] as const),
  Object.freeze(["Ravi", "Karan"] as const),
  Object.freeze(["Neeraj", "Vikas"] as const),
  Object.freeze(["Arun", "Mohan"] as const),
  Object.freeze(["Kabir", "Sahil"] as const),
  Object.freeze(["Deepak", "Rohit"] as const),
]);
function motionObservation(nameA: string, nameB: string, a: Rational, b: Rational, c: Rational): string {
  if (b.numerator < 0n) {
    return `${nameA}'s distance in ${seconds(a)} is ${metres(c)} more than ${nameB}'s distance in ${seconds(absRational(b))}`;
  }
  return `${nameA} runs for ${seconds(a)} and ${nameB} for ${seconds(b)}; together they cover ${metres(c)}`;
}
function twoEngineStem(question: TsdCp012EnglishReviewQuestion, index: number): string | undefined {
  const input = question.input;
  if (input.authorityKey !== "twoEngineInverseState") return undefined;
  const [nameA, nameB] = RUNNER_NAMES[index % RUNNER_NAMES.length]!;
  const first = motionObservation(nameA, nameB, input.a1, input.b1, input.c1);
  const second = motionObservation(nameA, nameB, input.a2, input.b2, input.c2);
  const asked = input.target === "X" ? nameA : nameB;
  return `${nameA} and ${nameB} run at constant but unknown speeds. In one observation, ${first}. In another independent observation, ${second}. Find ${asked}'s speed.`;
}
function twoEngineExplanation(question: TsdCp012EnglishReviewQuestion): Readonly<{ steps: readonly string[]; conclusion: string }> | undefined {
  const input = question.input;
  if (input.authorityKey !== "twoEngineInverseState" || question.solution.kind !== "SCALAR") return undefined;
  const [nameA, nameB] = RUNNER_NAMES[familyIndex(question) % RUNNER_NAMES.length]!;
  const firstSign = input.b1.numerator < 0n ? "−" : "+";
  const secondSign = input.b2.numerator < 0n ? "−" : "+";
  const firstB = absRational(input.b1);
  const secondB = absRational(input.b2);
  const asked = input.target === "X" ? nameA : nameB;
  const answer = speed(question.solution.answer);
  return Object.freeze({
    steps: Object.freeze([
      `Let ${nameA}'s speed be x and ${nameB}'s speed be y. From distance = speed × time, the two observations give ${v(input.a1)}x ${firstSign} ${v(firstB)}y = ${v(input.c1)} and ${v(input.a2)}x ${secondSign} ${v(secondB)}y = ${v(input.c2)}.`,
      `Solving these two independent distance relations gives ${asked}'s speed as ${answer}.`,
    ]),
    conclusion: `Answer: ${answer}.`,
  });
}

function editorialStem(question: TsdCp012EnglishReviewQuestion): string {
  const index = familyIndex(question);
  return feasibilityStem(question, index)
    ?? routeProfileSplitStem(question, index)
    ?? raceGapStem(question, index)
    ?? trainMeetingStem(question, index)
    ?? movingSurfaceStem(question, index)
    ?? twoEngineStem(question, index)
    ?? question.stem;
}

export const TSD_CP012_ENGLISH_REVIEW_FINAL = Object.freeze(TSD_CP012_ENGLISH_REVIEW.map((question) => Object.freeze({
  ...question,
  difficulty: calibrateTsdCp012ReviewedDifficulty(question.difficulty),
  stem: editorialStem(question),
  explanation: twoEngineExplanation(question) ?? question.explanation,
})));
