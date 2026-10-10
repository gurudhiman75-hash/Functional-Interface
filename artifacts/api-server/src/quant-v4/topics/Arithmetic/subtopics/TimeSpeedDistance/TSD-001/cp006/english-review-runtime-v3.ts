import {
  divide,
  rational,
  subtract,
  toMixedString,
  type Rational,
} from "../foundation/rational";
import { generateCp006EnglishReviewSetV2, type TsdCp006EnglishReviewQuestionV2 } from "./english-review-runtime-v2";

export type TsdCp006EnglishReviewQuestionV3 = Omit<TsdCp006EnglishReviewQuestionV2, "stem" | "options" | "correctIndex" | "answerText" | "explanation" | "presentationVersion" | "lifecycle"> & Readonly<{
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answerText: string;
  explanation: Readonly<{ readonly steps: readonly [string, string] }>;
  presentationVersion: "V3_EXAM_READINESS";
  stemStructureId: string;
  objectFamily: string;
  routeFamily: string;
  lifecycle: Readonly<{
    englishReviewStatus: "REVIEW_CANDIDATE_V3";
    englishFreezeStatus: "UNFROZEN";
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;

const OBJECT_FAMILIES = Object.freeze([
  "Runner", "Athlete", "Cadet", "Trainee", "Jogger", "Walker",
  "Competitor", "Participant", "Recruit", "Player", "Student", "Racer",
  "Club runner", "Track athlete", "Academy trainee", "Fitness walker", "Sports cadet", "Practice runner",
] as const);
const ROUTE_FAMILIES = Object.freeze([
  "circular track",
  "closed running track",
  "stadium loop",
  "circular practice track",
  "closed training loop",
  "athletics loop",
] as const);

function variantOf(row: TsdCp006EnglishReviewQuestionV2): number {
  const match = row.seed.match(/:(\d+)$/);
  if (!match) throw new Error(`${row.seed}: cannot resolve CP006 review variant`);
  return Number(match[1]) - 1;
}

function qlNumber(row: TsdCp006EnglishReviewQuestionV2): number {
  return Number(row.permanentQlId.slice(-3));
}

function contextFor(row: TsdCp006EnglishReviewQuestionV2) {
  const variant = variantOf(row);
  const objectIndex = ((qlNumber(row) - 71) * 6 + variant) % OBJECT_FAMILIES.length;
  const objectFamily = OBJECT_FAMILIES[objectIndex]!;
  const routeFamily = ROUTE_FAMILIES[variant]!;
  return Object.freeze({
    variant,
    objectFamily,
    routeFamily,
    a: `${objectFamily} A`,
    b: `${objectFamily} B`,
    c: `${objectFamily} C`,
  });
}

function value(r: Rational | undefined, label: string): string {
  if (!r) throw new Error(`${label}: missing CP006 V3 value`);
  return toMixedString(r);
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  if (n % 10 === 1) return `${n}st`;
  if (n % 10 === 2) return `${n}nd`;
  if (n % 10 === 3) return `${n}rd`;
  return `${n}th`;
}

function singularize(text: string): string {
  return text
    .replace(/\b1 minutes\b/g, "1 minute")
    .replace(/\b1 laps\b/g, "1 lap")
    .replace(/\b1 events\b/g, "1 event")
    .replace(/\b1 meetings\b/g, "1 meeting")
    .replace(/\b1 overtakes\b/g, "1 overtake");
}

function objectFamilyPlural(family: string): string {
  if (family.endsWith("runner")) return `${family}s`;
  if (family.endsWith("athlete")) return `${family}s`;
  if (family.endsWith("trainee")) return `${family}s`;
  if (family.endsWith("walker")) return `${family}s`;
  return `${family}s`;
}

function stemV3(row: TsdCp006EnglishReviewQuestionV2): string {
  const context = contextFor(row);
  const { variant, objectFamily, routeFamily, a, b, c } = context;
  const L = row.input.trackLength ? value(row.input.trackLength, "trackLength") : "";
  const u = value(row.input.speedA, "speedA");
  const v = row.input.speedB ? value(row.input.speedB, "speedB") : "";
  const w = row.input.speedC ? value(row.input.speedC, "speedC") : "";
  const t = row.input.timeWindow ? value(row.input.timeWindow, "timeWindow") : "";
  const opposite = row.input.directionB === -1;
  const directionText = opposite ? "opposite directions" : "the same direction";

  switch (row.authorityKey) {
    case "circularFirstMeetingOrOvertakeTime": {
      const n = row.input.nthEvent;
      const templates = [
        `${a} and ${b} leave the same point together on a ${L} m ${routeFamily}. They move in ${directionText} at ${u} m/min and ${v} m/min. Find the first time after the start when they are together again.`,
        `On a ${L} m ${routeFamily}, ${a} and ${b} start together from P at ${u} m/min and ${v} m/min in ${directionText}. How long after departure do they first meet again?`,
        `${a} moves at ${u} m/min and ${b} at ${v} m/min around a ${L} m ${routeFamily}. Starting together from the same mark and moving in ${directionText}, when is their next meeting?`,
        `${a} and ${b} begin together at P on a ${L} m ${routeFamily}. Their speeds are ${u} m/min and ${v} m/min and they move in ${directionText}. At what time from the start does their ${ordinal(n ?? 1)} meeting after departure occur?`,
        `Two ${objectFamilyPlural(objectFamily)} start together on a ${L} m ${routeFamily} and move in ${directionText} at ${u} m/min and ${v} m/min. Determine the time of the ${ordinal(n ?? 1)} meeting after the start.`,
        `From the same point of a ${L} m ${routeFamily}, ${a} and ${b} set off simultaneously in ${directionText} with speeds ${u} m/min and ${v} m/min. Find the earliest positive time at which they coincide.`,
      ];
      return templates[variant]!;
    }
    case "relativeLapDifferenceAfterTime": {
      const templates = [
        `${a} and ${b} start together and move in the same direction on a ${L} m ${routeFamily} at ${u} m/min and ${v} m/min. After ${t} minutes, how many laps has the faster one gained?`,
        `On a ${L} m ${routeFamily}, ${a} travels at ${u} m/min while ${b} travels at ${v} m/min in the same direction. Express their distance lead after ${t} minutes as a number of laps.`,
        `${a} is moving at ${u} m/min and ${b} at ${v} m/min around the same ${L} m ${routeFamily}. By the end of ${t} minutes, what is the faster one's lead in laps?`,
        `Two participants move in the same direction on a ${L} m ${routeFamily}, one at ${u} m/min and the other at ${v} m/min. Find the difference between the distances they cover in ${t} minutes, measured in laps.`,
        `During a ${t}-minute session on a ${L} m ${routeFamily}, ${a} maintains ${u} m/min and ${b} ${v} m/min in the same direction. How many track lengths separate their distance totals?`,
        `${a} and ${b} circle a ${L} m ${routeFamily} in the same direction at ${u} m/min and ${v} m/min. What fraction or number of a lap does the faster one gain in ${t} minutes?`,
      ];
      return templates[variant]!;
    }
    case "circularEventCountInWindow": {
      const event = opposite ? "meetings" : "overtakes";
      const templates = [
        `${a} and ${b} start together on a ${L} m ${routeFamily} at ${u} m/min and ${v} m/min, moving in ${directionText}. How many ${event} occur after the start during the next ${t} minutes?`,
        `For ${t} minutes, ${a} and ${b} keep speeds ${u} m/min and ${v} m/min on a ${L} m ${routeFamily}. They started together and move in ${directionText}. Count the ${event} after time zero.`,
        `Two participants begin at the same mark of a ${L} m ${routeFamily}. Their speeds are ${u} m/min and ${v} m/min in ${directionText}. How many times do they ${opposite ? "meet" : "overtake one another"} within ${t} minutes, excluding the start?`,
        `${a} and ${b} are together at time zero on a ${L} m ${routeFamily} and then move in ${directionText} at ${u} m/min and ${v} m/min. Find the number of ${event} before ${t} minutes have elapsed.`,
        `A ${L} m ${routeFamily} is used by ${a} and ${b}, who start together at ${u} m/min and ${v} m/min in ${directionText}. During a ${t}-minute interval, how many post-start ${event} are completed?`,
        `${a} and ${b} set off simultaneously on the same ${L} m ${routeFamily}. With speeds ${u} m/min and ${v} m/min in ${directionText}, determine the count of ${event} in the first ${t} minutes after departure.`,
      ];
      return templates[variant]!;
    }
    case "distinctCircularMeetingPointCount": {
      const templates = [
        `${a} and ${b} start together on a ${L} m ${routeFamily} and move in opposite directions at ${u} m/min and ${v} m/min. How many distinct points can serve as meeting points before the location pattern repeats?`,
        `From the same mark of a ${L} m ${routeFamily}, ${a} and ${b} move oppositely at ${u} m/min and ${v} m/min. Find the number of different meeting locations in one complete cycle of the pattern.`,
        `${a} runs one way and ${b} the other on a ${L} m ${routeFamily}, with speeds ${u} m/min and ${v} m/min. Starting together, at how many separate points do their meetings occur before the sequence repeats?`,
        `Two participants leave P in opposite directions around a ${L} m ${routeFamily} at ${u} m/min and ${v} m/min. Determine the count of distinct meeting positions generated by their repeating motion.`,
        `Meetings of ${a} and ${b} on a ${L} m ${routeFamily} recur as they move oppositely at ${u} m/min and ${v} m/min. If they start together, how many unique meeting points appear before returning to the first meeting location?`,
        `${a} and ${b} begin together and continue in opposite directions around a ${L} m ${routeFamily} at ${u} m/min and ${v} m/min. What is the number of distinct points in their full meeting-location cycle?`,
      ];
      return templates[variant]!;
    }
    case "circularMeetingPointLocation": {
      const templates = [
        `${a} and ${b} start together from P on a ${L} m ${routeFamily} and move in opposite directions at ${u} m/min and ${v} m/min. How far clockwise from P is their first meeting point, measured in ${a}'s direction?`,
        `On a ${L} m ${routeFamily}, ${a} leaves P clockwise at ${u} m/min while ${b} leaves P anticlockwise at ${v} m/min. Locate their first meeting point as a clockwise distance from P.`,
        `${a} and ${b} set off simultaneously from P in opposite directions around a ${L} m ${routeFamily}. Their speeds are ${u} m/min and ${v} m/min. Find the clockwise coordinate of the first meeting from P.`,
        `Point P is the common start on a ${L} m ${routeFamily}. ${a} moves clockwise at ${u} m/min and ${b} anticlockwise at ${v} m/min. At what clockwise distance from P do they first meet?`,
        `Two participants depart from P on a ${L} m ${routeFamily}, one clockwise at ${u} m/min and the other anticlockwise at ${v} m/min. Determine the first meeting location measured clockwise from P.`,
        `${a} circles clockwise from P at ${u} m/min while ${b} circles the other way at ${v} m/min on a ${L} m ${routeFamily}. Where is their first meeting, expressed as a clockwise distance from P?`,
      ];
      return templates[variant]!;
    }
    case "trackLengthFromCircularMeetingPeriod": {
      const mt = value(row.input.observedMeetingTime, "observedMeetingTime");
      const unit = mt === "1" ? "minute" : "minutes";
      const templates = [
        `${a} and ${b} start together and move in opposite directions around a closed track at ${u} m/min and ${v} m/min. Their first meeting after the start is ${mt} ${unit} later. Find the track length.`,
        `Two participants leave the same point in opposite directions at ${u} m/min and ${v} m/min. If they meet again for the first time after ${mt} ${unit}, what is the length of the closed track?`,
        `On an unknown-length circular track, ${a} and ${b} start together in opposite directions with speeds ${u} m/min and ${v} m/min. The first post-start meeting occurs after ${mt} ${unit}. Determine the circumference.`,
        `${a} moves clockwise at ${u} m/min and ${b} anticlockwise at ${v} m/min from the same starting mark. They first come together again ${mt} ${unit} later. Find the length of their closed route.`,
        `A circular route has unknown length. ${a} and ${b} begin together and move oppositely at ${u} m/min and ${v} m/min; their next meeting is after ${mt} ${unit}. Find the route length.`,
        `Starting from one point of a closed track, ${a} and ${b} move in opposite directions at ${u} m/min and ${v} m/min. The first return to a common position occurs after ${mt} ${unit}. What is the track length?`,
      ];
      return templates[variant]!;
    }
    case "runnerSpeedFromCircularEventCount": {
      const count = row.input.observedMeetingCount!;
      const templates = [
        `${a} and ${b} move in the same direction on a ${L} m ${routeFamily}. ${b} runs at ${v} m/min, and ${a} overtakes ${b} ${count} times in ${t} minutes. Find ${a}'s speed.`,
        `On a ${L} m ${routeFamily}, ${b} maintains ${v} m/min. A faster ${a} moving in the same direction completes ${count} overtakes in ${t} minutes. What is ${a}'s speed?`,
        `${a} is faster than ${b} on a ${L} m ${routeFamily}. They move in the same direction, ${b} at ${v} m/min, and ${a} passes ${b} ${count} times in ${t} minutes. Determine ${a}'s speed.`,
        `During ${t} minutes on a ${L} m ${routeFamily}, ${a} overtakes ${b} exactly ${count} times. Both move in the same direction and ${b}'s speed is ${v} m/min. Find the speed of ${a}.`,
        `${b} travels at ${v} m/min around a ${L} m ${routeFamily}. In the same direction, ${a} is fast enough to overtake ${b} ${count} times in ${t} minutes. Calculate ${a}'s speed.`,
        `Two participants circle a ${L} m ${routeFamily} in the same direction. ${b} moves at ${v} m/min, while ${a} records ${count} overtakes of ${b} in ${t} minutes. Find the faster speed.`,
      ];
      return templates[variant]!;
    }
    case "simultaneousReturnToStart": {
      if (row.input.speedC) {
        const templates = [
          `Runners A, B and C start together from P on a ${L} m ${routeFamily} at ${u} m/min, ${v} m/min and ${w} m/min. When will all three next be at P together?`,
          `Three participants begin together at the starting mark of a ${L} m ${routeFamily}. Their speeds are ${u}, ${v} and ${w} m/min. Find the first time all three return to the starting mark simultaneously.`,
          `On a ${L} m ${routeFamily}, A, B and C start together from P at ${u} m/min, ${v} m/min and ${w} m/min. After how many minutes are all three together at P again?`,
          `Three runners leave P simultaneously on a ${L} m ${routeFamily} with speeds ${u}, ${v} and ${w} m/min. Determine their first common return time to P.`,
          `A, B and C repeatedly lap a ${L} m ${routeFamily} at ${u}, ${v} and ${w} m/min, starting together from P. Find the earliest positive time when all are back at P.`,
          `From the same starting line on a ${L} m ${routeFamily}, three participants set off at ${u}, ${v} and ${w} m/min. When do their completed-lap cycles first finish together?`,
        ];
        return templates[variant]!;
      }
      const templates = [
        `${a} and ${b} start together from P on a ${L} m ${routeFamily} at ${u} m/min and ${v} m/min. Find the first time both are back at P together.`,
        `Two participants begin at P on a ${L} m ${routeFamily}. Their speeds are ${u} m/min and ${v} m/min. After how long will they next reach P simultaneously?`,
        `${a} and ${b} repeatedly circle a ${L} m ${routeFamily} at ${u} m/min and ${v} m/min, starting together at P. Determine their first common return to P.`,
        `At time zero ${a} and ${b} leave the starting mark of a ${L} m ${routeFamily} at ${u} m/min and ${v} m/min. When are they both at the starting mark again for the first time?`,
        `On a ${L} m ${routeFamily}, ${a} and ${b} start together from P with speeds ${u} m/min and ${v} m/min. Find the least positive time for which both have completed whole numbers of laps.`,
        `${a} and ${b} set out simultaneously from P around a ${L} m ${routeFamily}. With speeds ${u} m/min and ${v} m/min, determine the earliest joint return to P.`,
      ];
      return templates[variant]!;
    }
    case "multiRunnerFirstCommonMeeting": {
      const templates = [
        `Runners A, B and C start together on a ${L} m ${routeFamily}. A and B move clockwise at ${u} m/min and ${v} m/min, while C moves anticlockwise at ${w} m/min. Find the first time all three are at one point.`,
        `On a ${L} m ${routeFamily}, A and B run clockwise at ${u} m/min and ${v} m/min and C runs anticlockwise at ${w} m/min. They start together. When do all three first coincide again?`,
        `Three participants leave the same mark of a ${L} m ${routeFamily}. A and B move one way at ${u} and ${v} m/min, C the other at ${w} m/min. Determine the earliest post-start common meeting time.`,
        `A, B and C begin together on a ${L} m ${routeFamily}. With A and B clockwise at ${u} and ${v} m/min and C anticlockwise at ${w} m/min, after how long are all three together again?`,
        `Find the first common meeting after the start for three runners on a ${L} m ${routeFamily}: A at ${u} m/min clockwise, B at ${v} m/min clockwise and C at ${w} m/min anticlockwise.`,
        `Three runners start from P on a ${L} m ${routeFamily}. A and B travel clockwise at ${u} and ${v} m/min; C travels anticlockwise at ${w} m/min. What is the least positive time when their positions are identical?`,
      ];
      return templates[variant]!;
    }
    case "multiRunnerPairwiseMeetingSchedule": {
      const templates = [
        `A, B and C start together on a ${L} m ${routeFamily}. A and B move clockwise at ${u} and ${v} m/min, while C moves anticlockwise at ${w} m/min. Find the basic meeting periods for AB, AC and BC, in that order.`,
        `Three runners share a ${L} m ${routeFamily}. A and B go clockwise at ${u} and ${v} m/min and C goes anticlockwise at ${w} m/min. Starting together, determine the AB, AC and BC meeting intervals.`,
        `On a ${L} m ${routeFamily}, A and B move one way at ${u} and ${v} m/min and C the opposite way at ${w} m/min. What are the fundamental pairwise meeting times AB, AC and BC?`,
        `Runners A, B and C start from the same mark on a ${L} m ${routeFamily}. Their signed motion is A: ${u} clockwise, B: ${v} clockwise, C: ${w} anticlockwise, all in m/min. Find the three pairwise meeting periods in AB–AC–BC order.`,
        `For three participants on a ${L} m ${routeFamily}, A and B travel clockwise at ${u} and ${v} m/min, while C travels anticlockwise at ${w} m/min. Calculate the recurring meeting interval for each pair AB, AC and BC.`,
        `A, B and C begin together on a ${L} m ${routeFamily}; A and B move clockwise at ${u} and ${v} m/min and C anticlockwise at ${w} m/min. List the pairwise meeting periods as AB, AC, BC.`,
      ];
      return templates[variant]!;
    }
    case "circularMeetingFromInitialArcGap": {
      const gap = value(row.input.startPositionB, "startPositionB");
      const templates = [
        `${a} starts at P on a ${L} m ${routeFamily} at ${u} m/min. ${b} is already ${gap} m clockwise from P and moves in the same direction at ${v} m/min. When will ${a} first catch ${b}?`,
        `On a ${L} m ${routeFamily}, ${b} is ${gap} m clockwise from P when ${a} is at P. Both move clockwise, at ${v} m/min and ${u} m/min respectively. Find the first catch time.`,
        `${a} and ${b} move in the same direction on a ${L} m ${routeFamily}. Initially ${a} is at P and ${b} is ${gap} m clockwise from P; their speeds are ${u} m/min and ${v} m/min. How long until they first meet?`,
        `At time zero on a ${L} m ${routeFamily}, ${a} is at P and ${b} is at the point ${gap} m clockwise from P. They move clockwise at ${u} and ${v} m/min. Determine the first meeting time.`,
        `${b} has a ${gap} m clockwise position measured from P on a ${L} m ${routeFamily}, while ${a} starts at P. If both move clockwise at ${v} and ${u} m/min, when does the faster participant catch the other?`,
        `A ${L} m ${routeFamily} has P as reference. ${a} starts at P at ${u} m/min; ${b} starts ${gap} m clockwise from P at ${v} m/min, both in the same direction. Find their earliest meeting time.`,
      ];
      return templates[variant]!;
    }
    case "circularStaggeredStartMeeting": {
      const delay = value(row.input.startDelayB, "startDelayB");
      const templates = [
        `${a} starts from P on a ${L} m ${routeFamily} at ${u} m/min. ${delay} minutes later, ${b} starts from P in the same direction at ${v} m/min. When, measured from ${a}'s start, do they first meet?`,
        `On a ${L} m ${routeFamily}, ${a} leaves P at ${u} m/min. After a delay of ${delay} minutes, ${b} leaves P in the same direction at ${v} m/min. Find the first meeting time from ${a}'s departure.`,
        `${a} begins circling a ${L} m ${routeFamily} from P at ${u} m/min. ${b} begins from P ${delay} minutes later at ${v} m/min in the same direction. How many minutes after ${a} started do they first coincide?`,
        `Two participants use a ${L} m ${routeFamily}. ${a} starts at P with speed ${u} m/min; ${b} starts from the same point ${delay} minutes later at ${v} m/min, following the same direction. Determine their first meeting time from the original start.`,
        `${a} sets off from P on a ${L} m ${routeFamily} at ${u} m/min. ${b}, travelling in the same direction at ${v} m/min, departs from P after ${delay} minutes. At what time from ${a}'s start do they meet first?`,
        `From P on a ${L} m ${routeFamily}, ${a} starts at ${u} m/min and ${b} starts ${delay} minutes later at ${v} m/min in the same direction. Find the earliest common-position time measured from time zero.`,
      ];
      return templates[variant]!;
    }
    case "circularLapStateAfterTime": {
      if (row.solveMode === "findNumberOfCompletedLaps") {
        const templates = [
          `${a} moves at ${u} m/min on a ${L} m ${routeFamily} for ${t} minutes. How many complete laps are finished?`,
          `During ${t} minutes, ${a} keeps a speed of ${u} m/min on a ${L} m ${routeFamily}. Find the number of full laps completed.`,
          `${a} travels around a ${L} m ${routeFamily} at ${u} m/min for ${t} minutes. How many whole circuits does this cover?`,
          `A ${L} m ${routeFamily} is covered continuously by ${a} at ${u} m/min. After ${t} minutes, how many complete laps have been made?`,
          `${a} maintains ${u} m/min for ${t} minutes on a ${L} m ${routeFamily}. Determine the count of completed laps, ignoring any unfinished part of the next lap.`,
          `At ${u} m/min, ${a} moves for ${t} minutes around a ${L} m ${routeFamily}. Find the number of full laps completed in that time.`,
        ];
        return templates[variant]!;
      }
      const start = value(row.input.startPositionA, "startPositionA");
      const movement = row.input.directionA === -1 ? "anticlockwise" : "clockwise";
      const templates = [
        `${a} is ${start} m clockwise from P on a ${L} m ${routeFamily}. ${a} then moves ${movement} at ${u} m/min for ${t} minutes. Where is ${a} now, measured clockwise from P?`,
        `On a ${L} m ${routeFamily}, ${a}'s initial coordinate is ${start} m clockwise from P. After moving ${movement} at ${u} m/min for ${t} minutes, find the new clockwise coordinate.`,
        `${a} starts at the point ${start} m clockwise from P on a ${L} m ${routeFamily}. The motion is ${movement} at ${u} m/min for ${t} minutes. Determine the final position as a clockwise distance from P.`,
        `Take P as zero on a ${L} m ${routeFamily}. ${a} begins at ${start} m clockwise from P and moves ${movement} at ${u} m/min for ${t} minutes. What is the final clockwise position?`,
        `A position on a ${L} m ${routeFamily} is measured clockwise from P. ${a} starts at ${start} m and travels ${movement} at ${u} m/min for ${t} minutes. Find the resulting coordinate.`,
        `${a} is initially located ${start} m clockwise from P on a ${L} m ${routeFamily}. After ${t} minutes at ${u} m/min in the ${movement} direction, where is ${a}, measured clockwise from P?`,
      ];
      return templates[variant]!;
    }
    default:
      return row.stem;
  }
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function boundedLocationOptions(row: TsdCp006EnglishReviewQuestionV2): readonly string[] {
  const L = row.input.trackLength!;
  const correct = row.solution.value!;
  const candidates = [correct, subtract(L, correct), divide(L, rational(2)), rational(0)];
  const rendered: string[] = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    const text = `${toMixedString(candidate)} m`;
    if (!seen.has(text)) {
      seen.add(text);
      rendered.push(text);
    }
  }
  for (let delta = 1; rendered.length < 4; delta += 1) {
    const candidate = rational(delta);
    if (candidate.numerator * L.denominator >= L.numerator * candidate.denominator) break;
    const text = `${toMixedString(candidate)} m`;
    if (!seen.has(text)) {
      seen.add(text);
      rendered.push(text);
    }
  }
  if (rendered.length !== 4) throw new Error(`${row.seed}: unable to construct bounded location options`);
  const order = [0, 1, 2, 3];
  let state = hash(`${row.seed}:v3-location-options`) || 1;
  for (let i = 3; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return Object.freeze(order.map((index) => rendered[index]!));
}

function cleanExplanation(row: TsdCp006EnglishReviewQuestionV2): readonly [string, string] {
  return row.explanation.steps.map((step) => singularize(step)
    .replaceAll("faster vehicle", "faster runner")
    .replaceAll("slower vehicle", "slower runner")
    .replaceAll("The vehicle covers", "The runner covers")) as unknown as readonly [string, string];
}

export function generateCp006EnglishReviewSetV3(): readonly TsdCp006EnglishReviewQuestionV3[] {
  return Object.freeze(generateCp006EnglishReviewSetV2().map((row) => {
    const context = contextFor(row);
    const answerText = singularize(row.answerText);
    const rawOptions = row.permanentQlId === "TSD-QL-075" ? boundedLocationOptions(row) : row.options.map(singularize);
    const options = Object.freeze([...rawOptions]);
    const correctIndex = options.indexOf(answerText);
    if (correctIndex < 0) throw new Error(`${row.seed}: CP006 V3 answer missing from options`);
    return Object.freeze({
      ...row,
      stem: singularize(stemV3(row)).replace(/\s{2,}/g, " ").trim(),
      options,
      correctIndex,
      answerText,
      explanation: Object.freeze({ steps: Object.freeze(cleanExplanation(row)) as readonly [string, string] }),
      presentationVersion: "V3_EXAM_READINESS" as const,
      stemStructureId: `${row.permanentQlId}-S${context.variant + 1}`,
      objectFamily: context.objectFamily,
      routeFamily: context.routeFamily,
      lifecycle: Object.freeze({
        englishReviewStatus: "REVIEW_CANDIDATE_V3" as const,
        englishFreezeStatus: "UNFROZEN" as const,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    });
  }));
}
