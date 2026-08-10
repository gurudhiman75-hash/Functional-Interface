import { divide, equals, f, formatFraction, formatRatio, ONE, type Fraction } from "./fraction";
import type {
  Segment,
  TsdCp002Input,
  TsdCp002LearnerSolveMode,
  TsdCp002Solution,
} from "./types";

export interface Cp002WrongSeed {
  readonly solution: TsdCp002Solution;
  readonly misconceptionId: string;
  readonly diagnosis: string;
}

export interface Cp002CaseDefinition {
  readonly caseId: string;
  readonly mode: TsdCp002LearnerSolveMode;
  readonly representation: string;
  readonly stem: string;
  readonly input: TsdCp002Input;
  readonly givens: readonly string[];
  readonly working: (solution: TsdCp002Solution) => readonly string[];
  readonly wrongOptions: readonly Cp002WrongSeed[];
}

const speed = (n: number, d = 1): TsdCp002Solution => Object.freeze({ answerKind: "SPEED", value: f(n, d) });
const pace = (n: number, d = 1): TsdCp002Solution => Object.freeze({ answerKind: "PACE", value: f(n, d) });
const time = (n: number, d = 1): TsdCp002Solution => Object.freeze({ answerKind: "TIME", value: f(n, d) });
const distance = (n: number, d = 1): TsdCp002Solution => Object.freeze({ answerKind: "DISTANCE", value: f(n, d) });
const percent = (n: number, d = 1): TsdCp002Solution => Object.freeze({ answerKind: "PERCENT", value: f(n, d) });
const ratio = (n: number, d = 1): TsdCp002Solution => Object.freeze({ answerKind: "RATIO", value: f(n, d) });
const choice = (value: "Plan A" | "Plan B" | "Both plans have the same average speed"): TsdCp002Solution => Object.freeze({ answerKind: "CHOICE", value });
const segment = (distanceKm: number, speedKmph: number, distanceDenominator = 1, speedDenominator = 1): Segment => Object.freeze({ distanceKm: f(distanceKm, distanceDenominator), speedKmph: f(speedKmph, speedDenominator) });
const q = (value: Fraction): string => formatFraction(value);
const quantity = (value: Fraction, singular: string, plural = `${singular}s`): string =>
  `${q(value)} ${equals(value, ONE) ? singular : plural}`;
const quotient = (numerator: Fraction, denominator: Fraction): Fraction => divide(numerator, denominator);
const solved = (solution: TsdCp002Solution): Fraction => {
  if (typeof solution.value !== "object") throw new Error("Expected numeric solution in working builder");
  return solution.value;
};
const wrong = (solution: TsdCp002Solution, misconceptionId: string, diagnosis: string): Cp002WrongSeed => Object.freeze({ solution, misconceptionId, diagnosis });

export const CP002_KEY_RULE: Record<TsdCp002LearnerSolveMode, string> = {
  averageSpeedFromSegments: "📌 Main Rule: Average speed for a segmented journey is total distance divided by total travelling time, never the simple mean of the listed speeds.",
  averagePaceFromSegments: "📌 Main Rule: Average pace is total minutes divided by total kilometres; weight each pace by the distance covered at that pace.",
  unknownSegmentSpeedFromAverage: "📌 Main Rule: Reconstruct the allowed total time from total distance ÷ overall average, then isolate the missing segment time and speed.",
  unknownSegmentTimeFromAverage: "📌 Main Rule: Overall average fixes the complete journey time; subtract the known segment time to obtain the missing time.",
  unknownSegmentDistanceFromAverage: "📌 Main Rule: Let the missing distance satisfy both the total-distance and total-time sides of the overall-average equation.",
  unknownSegmentShareFromAverage: "📌 Main Rule: A distance share weights reciprocal speeds, while a time share weights speeds directly.",
  unknownRoundTripLegSpeedFromAverage: "📌 Main Rule: Outward and return distances are equal, so the round-trip average is the harmonic mean of the two leg speeds.",
  oneWayDistanceFromRoundTripData: "📌 Main Rule: The same one-way distance appears in both leg times; factor it from d/u + d/v = total time.",
  roundTripTimeFromOneWayDistance: "📌 Main Rule: Find outward and return times separately and add them; equal distance does not mean equal time.",
  totalDistanceFromAverageAndTime: "📌 Main Rule: Once the complete journey average and total travelling time are known, total distance = average speed × total time.",
  segmentAllocationFromTotalsAndSpeeds: "📌 Main Rule: Use t₁ + t₂ = total time and v₁t₁ + v₂t₂ = total distance to split the journey.",
  segmentRatioFromAverageAndSpeeds: "📌 Main Rule: Reconstruct the weighted-average equation in the requested distance or time ratio; do not copy the speed ratio.",
  requiredRemainingSpeedForTargetAverage: "📌 Main Rule: Target average fixes the maximum total time; subtract time already used, then divide remaining distance by remaining time.",
  compareSegmentedJourneyPlans: "📌 Main Rule: Compute total distance ÷ total time for each complete plan before comparing them.",
};

export const CP002_SHORTCUT: Record<TsdCp002LearnerSolveMode, string> = {
  averageSpeedFromSegments: "⚡ Exam Speed Trick: Write a two-column distance/time tally and divide the final totals once.",
  averagePaceFromSegments: "⚡ Exam Speed Trick: Convert every leg to minutes first, add, then divide by total kilometres.",
  unknownSegmentSpeedFromAverage: "⚡ Exam Speed Trick: Missing speed = missing distance ÷ (allowed total time − known time).",
  unknownSegmentTimeFromAverage: "⚡ Exam Speed Trick: Missing time = total distance ÷ overall average − known time.",
  unknownSegmentDistanceFromAverage: "⚡ Exam Speed Trick: Keep the unknown distance as x and clear the denominators in one line.",
  unknownSegmentShareFromAverage: "⚡ Exam Speed Trick: Decide first whether the weights are distances or times; the two formulas are different.",
  unknownRoundTripLegSpeedFromAverage: "⚡ Exam Speed Trick: For equal distances, unknown speed = average × known speed ÷ (2 × known speed − average).",
  oneWayDistanceFromRoundTripData: "⚡ Exam Speed Trick: One-way distance = total time ÷ (1/outward speed + 1/return speed).",
  roundTripTimeFromOneWayDistance: "⚡ Exam Speed Trick: Add d/u and d/v directly.",
  totalDistanceFromAverageAndTime: "⚡ Exam Speed Trick: Multiply the overall average by the complete travelling time.",
  segmentAllocationFromTotalsAndSpeeds: "⚡ Exam Speed Trick: Assume all time at one speed, compare with actual distance, and correct using the speed difference.",
  segmentRatioFromAverageAndSpeeds: "⚡ Exam Speed Trick: For a time ratio, use (higher speed − average):(average − lower speed).",
  requiredRemainingSpeedForTargetAverage: "⚡ Exam Speed Trick: Compute the target finish time before looking at the remaining distance.",
  compareSegmentedJourneyPlans: "⚡ Exam Speed Trick: Compare cross-products of total distance and total time if the averages are fractional.",
};

export const CP002_TRAP: Record<TsdCp002LearnerSolveMode, string> = {
  averageSpeedFromSegments: "Common mistake: averaging the speed numbers without considering how long each speed was used.",
  averagePaceFromSegments: "Common mistake: averaging paces equally when the distances are unequal.",
  unknownSegmentSpeedFromAverage: "Common mistake: treating the overall average as the missing segment speed.",
  unknownSegmentTimeFromAverage: "Common mistake: using distance ÷ overall average for the missing leg alone instead of the whole journey.",
  unknownSegmentDistanceFromAverage: "Common mistake: assuming the two distances are equal because only two speeds are given.",
  unknownSegmentShareFromAverage: "Common mistake: using the speed ratio as the distance or time share.",
  unknownRoundTripLegSpeedFromAverage: "Common mistake: using the arithmetic mean for equal-distance outward and return legs.",
  oneWayDistanceFromRoundTripData: "Common mistake: multiplying total time by the arithmetic mean of the two speeds.",
  roundTripTimeFromOneWayDistance: "Common mistake: dividing the two-way distance by the arithmetic mean speed.",
  totalDistanceFromAverageAndTime: "Common mistake: using only one segment's time instead of the complete journey time.",
  segmentAllocationFromTotalsAndSpeeds: "Common mistake: dividing distance or time equally without satisfying both totals.",
  segmentRatioFromAverageAndSpeeds: "Common mistake: copying or reversing the speed ratio.",
  requiredRemainingSpeedForTargetAverage: "Common mistake: dividing remaining distance by the original total target time.",
  compareSegmentedJourneyPlans: "Common mistake: comparing listed speeds rather than complete-plan averages.",
};

export const CP002_TEACHING_LEADS: Record<TsdCp002LearnerSolveMode, readonly [string, string, string]> = {
  averageSpeedFromSegments: [
    "Treat the journey as one combined trip: add all distances and all actual travel times before dividing.",
    "The speed changes, but the final average still belongs to the complete distance and complete time.",
    "Build the journey totals leg by leg; the speed labels themselves must not be averaged directly.",
  ],
  averagePaceFromSegments: [
    "Pace measures time per kilometre, so convert each segment into minutes before combining the route.",
    "Weight each pace by the distance travelled at that pace, then divide by the full distance.",
    "Count the minutes consumed by every segment; only then express minutes per kilometre for the whole route.",
  ],
  unknownSegmentSpeedFromAverage: [
    "The overall average tells us how much total time the complete journey is allowed to take.",
    "Recover the journey's total time first, remove the known leg, and use the leftover time for the unknown speed.",
    "Do not guess the missing speed from the average; reconstruct the missing leg's time explicitly.",
  ],
  unknownSegmentTimeFromAverage: [
    "Use the overall average to find the complete journey time, then subtract the time already accounted for.",
    "The missing duration is the gap between allowed total time and the stated first-leg time.",
    "Reconstruct the full clock budget of the journey before isolating the unknown segment.",
  ],
  unknownSegmentDistanceFromAverage: [
    "Let the unknown distance contribute both distance and time, then enforce the stated overall average.",
    "The missing distance must make total distance ÷ total time equal the given average exactly.",
    "Balance the known slow/fast leg with the unknown leg through one average-speed equation.",
  ],
  unknownSegmentShareFromAverage: [
    "First identify whether the question asks for a distance share or a time share; their weighting rules differ.",
    "A distance fraction works through reciprocal speeds, whereas a time fraction works through direct speeds.",
    "Translate the requested share into the correct weighted-average equation before solving the percentage.",
  ],
  unknownRoundTripLegSpeedFromAverage: [
    "Outward and return distances are equal, so slower-leg time has extra weight in the round-trip average.",
    "Use the equal-distance harmonic relation rather than the arithmetic mean of the two speeds.",
    "Reconstruct the two equal-distance leg times and solve the speed that gives the stated overall average.",
  ],
  oneWayDistanceFromRoundTripData: [
    "The same one-way distance appears in both leg times, allowing it to be factored from the total-time equation.",
    "Write outward time and return time in terms of one unknown distance, then match their sum to the given time.",
    "Use d/u + d/v for the complete round trip; the repeated distance is the unknown to isolate.",
  ],
  roundTripTimeFromOneWayDistance: [
    "Find each leg's travel time separately because the two speeds produce different durations.",
    "Equal outward and return distances do not permit a single arithmetic-average shortcut; add the two leg times.",
    "Convert the one-way distance into an outward time and a return time, then combine them.",
  ],
  totalDistanceFromAverageAndTime: [
    "The overall average and complete travelling time already describe the whole route, so multiply them.",
    "Treat the segmented journey as a completed total: distance equals its overall average times total time.",
    "Once all leg effects are condensed into the stated average, the full distance follows from average × time.",
  ],
  segmentAllocationFromTotalsAndSpeeds: [
    "Two unknown segment durations are controlled by two totals: total time and total distance.",
    "Split the journey so that both the time sum and the distance sum remain true at once.",
    "Use the two-speed system rather than dividing the route equally by assumption.",
  ],
  segmentRatioFromAverageAndSpeeds: [
    "The required ratio must reproduce the stated average when the two speeds are weighted correctly.",
    "Form the requested distance or time ratio from the average equation, not from the raw speed ratio.",
    "Place the slower and faster portions into one weighted-average relation and simplify the ratio.",
  ],
  requiredRemainingSpeedForTargetAverage: [
    "The target average fixes the finishing time, so determine the remaining time before calculating speed.",
    "Compare the time already used with the total time allowed by the target average.",
    "A remaining-speed question is really a remaining-time budget problem followed by distance ÷ time.",
  ],
  compareSegmentedJourneyPlans: [
    "Reduce each plan to one overall average using its own total distance and total time.",
    "Compare complete journeys, not isolated leg speeds; each plan must be totalled independently.",
    "Compute both plan averages on the same basis before deciding which plan is faster overall.",
  ],
};

function numericWrong(
  values: readonly TsdCp002Solution[],
  labels: readonly [string, string, string],
  diagnoses: readonly [string, string, string],
): readonly Cp002WrongSeed[] {
  return Object.freeze(values.map((solution, index) => wrong(solution, labels[index], diagnoses[index])));
}

export function cp002Case(mode: TsdCp002LearnerSolveMode, caseIndex: number): Cp002CaseDefinition {
  const index = ((caseIndex % 3) + 3) % 3;

  switch (mode) {
    case "averageSpeedFromSegments": {
      const cases = [
        {
          id: "EQUAL_DISTANCE",
          stem: "A car covers 60 km at 30 km/h and the next 60 km at 60 km/h. What is its average speed for the whole journey?",
          segments: [segment(60, 30), segment(60, 60)],
          givens: ["First-leg time = 60 ÷ 30 = 2 hours.", "Second-leg time = 60 ÷ 60 = 1 hour."],
          wrongs: [speed(45), speed(30), speed(60)],
        },
        {
          id: "MULTI_SEGMENT",
          stem: "A bus travels 60 km at 30 km/h, 60 km at 60 km/h and 90 km at 90 km/h. What is its average speed?",
          segments: [segment(60, 30), segment(60, 60), segment(90, 90)],
          givens: ["The three leg times are 2 hours, 1 hour and 1 hour.", "Total distance = 60 + 60 + 90 = 210 km."],
          wrongs: [speed(60), speed(30), speed(90)],
        },
        {
          id: "MIXED_UNIT_LOG",
          stem: "A delivery log shows 36,000 m travelled at 72 km/h and then 54 km at 54 km/h. What is the average speed for the complete route?",
          segments: [segment(36, 72), segment(54, 54)],
          givens: ["36,000 m = 36 km, so the first-leg time is 36 ÷ 72 = 0.5 hour.", "The second-leg time is 54 ÷ 54 = 1 hour."],
          wrongs: [speed(63), speed(54), speed(72)],
        },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `AVG-SPEED-${selected.id}`,
        mode,
        representation: selected.id,
        stem: selected.stem,
        input: Object.freeze({ mode, segments: selected.segments }),
        givens: selected.givens,
        working: (solution: TsdCp002Solution) => [
          `Total travelling time = ${selected.segments.map((entry) => `${q(entry.distanceKm)} ÷ ${q(entry.speedKmph)}`).join(" + ")}.`,
          `Average speed = total distance ÷ total time = ${q(solved(solution))} km/h.`,
        ],
        wrongOptions: numericWrong(selected.wrongs, ["ARITHMETIC_MEAN", "SLOWEST_SPEED", "FASTEST_SPEED"], [
          "This averages the listed speed numbers and ignores the time spent at each speed.",
          "This copies the slowest segment speed instead of combining the journey.",
          "This copies the fastest segment speed instead of using total distance and total time.",
        ]),
      });
    }

    case "averagePaceFromSegments": {
      const cases = [
        { id: "SIX_AND_FOUR", stem: "A runner covers 6 km at 5 minutes per km and 4 km at 7 minutes per km. What is the average pace?", segments: [{ distanceKm: f(6), paceMinutesPerKm: f(5) }, { distanceKm: f(4), paceMinutesPerKm: f(7) }], wrongs: [pace(6), pace(5), pace(7)] },
        { id: "TWO_AND_EIGHT", stem: "A runner covers 2 km at 4 minutes per km and 8 km at 6 minutes per km. What is the average pace for all 10 km?", segments: [{ distanceKm: f(2), paceMinutesPerKm: f(4) }, { distanceKm: f(8), paceMinutesPerKm: f(6) }], wrongs: [pace(5), pace(4), pace(6)] },
        { id: "THREE_AND_SEVEN", stem: "A cyclist records a pace of 6 minutes per km for 3 km and 4 minutes per km for 7 km. What is the combined average pace?", segments: [{ distanceKm: f(3), paceMinutesPerKm: f(6) }, { distanceKm: f(7), paceMinutesPerKm: f(4) }], wrongs: [pace(5), pace(4), pace(6)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `AVG-PACE-${selected.id}`,
        mode,
        representation: "DISTANCE_WEIGHTED_PACE",
        stem: selected.stem,
        input: Object.freeze({ mode, segments: selected.segments }),
        givens: [
          `Segment minutes = ${selected.segments.map((entry) => `${q(entry.distanceKm)} × ${q(entry.paceMinutesPerKm)}`).join(" and ")}.`,
          `Total distance = ${selected.segments.map((entry) => q(entry.distanceKm)).join(" + ")} km.`,
        ],
        working: (solution: TsdCp002Solution) => [
          `Add the segment minutes and divide by the total distance.`,
          `Average pace = ${q(solved(solution))} minutes/km.`,
        ],
        wrongOptions: numericWrong(selected.wrongs, ["UNWEIGHTED_PACE_MEAN", "COPY_FAST_PACE", "COPY_SLOW_PACE"], [
          "This gives both paces equal weight even though their distances are different.",
          "This copies only the faster pace and ignores the other kilometres.",
          "This copies only the slower pace and ignores the other kilometres.",
        ]),
      });
    }

    case "unknownSegmentSpeedFromAverage": {
      const cases = [
        { id: "SIXTY_SIXTY", stem: "A car covers 60 km at 30 km/h and another 60 km at an unknown speed. If the overall average is 40 km/h, what is the unknown speed?", input: { mode, knownDistanceKm: f(60), knownSpeedKmph: f(30), unknownDistanceKm: f(60), overallAverageKmph: f(40) } as const, wrongs: [speed(40), speed(30), speed(20)] },
        { id: "SIXTY_EIGHTY", stem: "A van covers 60 km at 30 km/h and the next 80 km at an unknown speed. Its overall average is 35 km/h. What is the second speed?", input: { mode, knownDistanceKm: f(60), knownSpeedKmph: f(30), unknownDistanceKm: f(80), overallAverageKmph: f(35) } as const, wrongs: [speed(35), speed(30), speed(20)] },
        { id: "HUNDRED_ONE_FIFTY", stem: "A bus covers 100 km at 50 km/h and another 150 km at an unknown speed. The complete-journey average is 62.5 km/h. What is the unknown speed?", input: { mode, knownDistanceKm: f(100), knownSpeedKmph: f(50), unknownDistanceKm: f(150), overallAverageKmph: f(125, 2) } as const, wrongs: [speed(125, 2), speed(50), speed(75, 2)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `UNKNOWN-SPEED-${selected.id}`,
        mode,
        representation: "OVERALL_AVERAGE_INVERSE",
        stem: selected.stem,
        input: selected.input,
        givens: [
          `Total distance = ${q(selected.input.knownDistanceKm)} + ${q(selected.input.unknownDistanceKm)} km.`,
          `Known-leg time = ${q(selected.input.knownDistanceKm)} ÷ ${q(selected.input.knownSpeedKmph)} = ${quantity(quotient(selected.input.knownDistanceKm, selected.input.knownSpeedKmph), "hour")}.`,
        ],
        working: (solution: TsdCp002Solution) => [
          `Allowed total time = total distance ÷ ${q(selected.input.overallAverageKmph)}.`,
          `Unknown speed = unknown distance ÷ remaining time = ${q(solved(solution))} km/h.`,
        ],
        wrongOptions: numericWrong(selected.wrongs, ["COPY_OVERALL_AVERAGE", "COPY_KNOWN_SPEED", "USE_TOTAL_TIME_FOR_UNKNOWN_LEG"], [
          "This copies the overall average as though it were the second-leg speed.",
          "This assumes both segment speeds are equal without using the overall time.",
          "This divides the unknown distance by too much time and therefore understates its speed.",
        ]),
      });
    }

    case "unknownSegmentTimeFromAverage": {
      const cases = [
        { id: "ONE_HOUR", stem: "A traveller covers 60 km in 2 hours and then another 90 km. If the overall average is 50 km/h, how long does the second part take?", input: { mode, knownDistanceKm: f(60), knownTimeHours: f(2), unknownDistanceKm: f(90), overallAverageKmph: f(50) } as const, wrongs: [time(3), time(2), time(9, 5)] },
        { id: "THREE_HOURS", stem: "A truck covers 80 km in 2 hours and then 120 km more. Its complete average is 40 km/h. How long does the second segment take?", input: { mode, knownDistanceKm: f(80), knownTimeHours: f(2), unknownDistanceKm: f(120), overallAverageKmph: f(40) } as const, wrongs: [time(5), time(2), time(3, 2)] },
        { id: "SECOND_THREE_HOURS", stem: "A bus covers 100 km in 1 hour and then another 150 km. If its overall average is 62.5 km/h, how long does the second segment take?", input: { mode, knownDistanceKm: f(100), knownTimeHours: f(1), unknownDistanceKm: f(150), overallAverageKmph: f(125, 2) } as const, wrongs: [time(4), time(1), time(12, 5)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `UNKNOWN-TIME-${selected.id}`,
        mode,
        representation: "TOTAL_TIME_RECONSTRUCTION",
        stem: selected.stem,
        input: selected.input,
        givens: [`Total distance = ${q(selected.input.knownDistanceKm)} + ${q(selected.input.unknownDistanceKm)} km.`, `Known segment time = ${quantity(selected.input.knownTimeHours, "hour")}.`],
        working: (solution: TsdCp002Solution) => [`Complete journey time = total distance ÷ ${q(selected.input.overallAverageKmph)}.`, `Missing segment time = complete time − known time = ${quantity(solved(solution), "hour")}.`],
        wrongOptions: numericWrong(selected.wrongs, ["USE_COMPLETE_TIME", "COPY_KNOWN_TIME", "APPLY_AVERAGE_TO_UNKNOWN_DISTANCE"], [
          "This reports the whole journey time rather than the missing segment time.",
          "This copies the known segment time without subtracting from the total.",
          "This applies the overall average to the unknown segment alone.",
        ]),
      });
    }

    case "unknownSegmentDistanceFromAverage": {
      const cases = [
        { id: "SIXTY", stem: "A car travels 60 km at 30 km/h and then continues at 60 km/h. If the overall average is 40 km/h, how far is the second segment?", input: { mode, knownDistanceKm: f(60), knownSpeedKmph: f(30), unknownSpeedKmph: f(60), overallAverageKmph: f(40) } as const, wrongs: [distance(120), distance(30), distance(90)] },
        { id: "ONE_TWENTY", stem: "A bus travels 80 km at 40 km/h and then continues at 60 km/h. Its overall average is 50 km/h. What is the second distance?", input: { mode, knownDistanceKm: f(80), knownSpeedKmph: f(40), unknownSpeedKmph: f(60), overallAverageKmph: f(50) } as const, wrongs: [distance(80), distance(40), distance(100)] },
        { id: "NINETY", stem: "A rider covers 90 km at 45 km/h and then rides at 90 km/h. If the total average is 60 km/h, what distance is covered at 90 km/h?", input: { mode, knownDistanceKm: f(90), knownSpeedKmph: f(45), unknownSpeedKmph: f(90), overallAverageKmph: f(60) } as const, wrongs: [distance(45), distance(135), distance(180)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `UNKNOWN-DISTANCE-${selected.id}`,
        mode,
        representation: "DISTANCE_BALANCE",
        stem: selected.stem,
        input: selected.input,
        givens: [`Known-leg time = ${q(selected.input.knownDistanceKm)} ÷ ${q(selected.input.knownSpeedKmph)} = ${quantity(quotient(selected.input.knownDistanceKm, selected.input.knownSpeedKmph), "hour")}.`, `Let the distance at ${q(selected.input.unknownSpeedKmph)} km/h be x km.`],
        working: (solution: TsdCp002Solution) => [`Set (known distance + x) ÷ (known time + x/${q(selected.input.unknownSpeedKmph)}) = ${q(selected.input.overallAverageKmph)}.`, `Solving the equation gives x = ${q(solved(solution))} km.`],
        wrongOptions: numericWrong(selected.wrongs, ["ASSUME_SPEED_DISTANCE_PROPORTION", "USE_SPEED_DIFFERENCE", "ADD_GIVEN_VALUES"], [
          "This forces an unsupported direct proportion between speed and distance.",
          "This treats the difference between the speeds as a distance.",
          "This combines the given numbers without satisfying the average-speed equation.",
        ]),
      });
    }

    case "unknownSegmentShareFromAverage": {
      const cases = [
        { id: "DISTANCE_HALF", stem: "A vehicle travels part of a route at 30 km/h and the rest at 60 km/h. If its average speed is 40 km/h, what percentage of the distance is covered at 30 km/h?", input: { mode, firstSpeedKmph: f(30), secondSpeedKmph: f(60), overallAverageKmph: f(40), shareKind: "DISTANCE" } as const, wrongs: [percent(333, 10), percent(60), percent(40)] },
        { id: "DISTANCE_QUARTER", stem: "A cyclist covers part of a journey at 40 km/h and the rest at 80 km/h. If the overall average is 64 km/h, what percentage of the distance is at 40 km/h?", input: { mode, firstSpeedKmph: f(40), secondSpeedKmph: f(80), overallAverageKmph: f(64), shareKind: "DISTANCE" } as const, wrongs: [percent(50), percent(75), percent(20)] },
        { id: "TIME_QUARTER", stem: "A car travels for part of its total time at 30 km/h and the rest at 70 km/h. If the time-weighted average speed is 60 km/h, what percentage of the time is spent at 30 km/h?", input: { mode, firstSpeedKmph: f(30), secondSpeedKmph: f(70), overallAverageKmph: f(60), shareKind: "TIME" } as const, wrongs: [percent(75), percent(50), percent(60)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `UNKNOWN-SHARE-${selected.id}`,
        mode,
        representation: `${selected.input.shareKind}_SHARE`,
        stem: selected.stem,
        input: selected.input,
        givens: [`Speeds are ${q(selected.input.firstSpeedKmph)} km/h and ${q(selected.input.secondSpeedKmph)} km/h.`, `Overall average = ${q(selected.input.overallAverageKmph)} km/h.`],
        working: (solution: TsdCp002Solution) => [selected.input.shareKind === "DISTANCE" ? "Use 1/average = x/first speed + (1 − x)/second speed." : "Use average = x × first speed + (1 − x) × second speed.", `The requested share is ${q(solved(solution))}%.`],
        wrongOptions: numericWrong(selected.wrongs, ["COPY_SPEED_RATIO", "USE_COMPLEMENT", "COPY_AVERAGE_NUMBER"], [
          "This converts the speed ratio directly into a share, which does not reproduce the stated average.",
          "This selects the complementary portion rather than the requested slower-speed share.",
          "This copies the average-speed number as a percentage.",
        ]),
      });
    }

    case "unknownRoundTripLegSpeedFromAverage": {
      const cases = [
        { id: "THIRTY_TO_SIXTY", stem: "A car goes from A to B at 30 km/h and returns over the same distance at an unknown speed. If the round-trip average is 40 km/h, what is the return speed?", input: { mode, knownLegSpeedKmph: f(30), overallAverageKmph: f(40), unknownLeg: "RETURN" } as const, wrongs: [speed(40), speed(30), speed(50)] },
        { id: "FORTY_TO_SIXTY", stem: "A bus returns at 40 km/h after travelling outward at an unknown speed. If the equal-distance round-trip average is 48 km/h, what is the outward speed?", input: { mode, knownLegSpeedKmph: f(40), overallAverageKmph: f(48), unknownLeg: "OUTWARD" } as const, wrongs: [speed(48), speed(40), speed(56)] },
        { id: "SIXTY_TO_NINETY", stem: "A rider travels one way at 60 km/h and returns over the same route at an unknown speed. The complete average is 72 km/h. What is the return speed?", input: { mode, knownLegSpeedKmph: f(60), overallAverageKmph: f(72), unknownLeg: "RETURN" } as const, wrongs: [speed(72), speed(60), speed(84)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `ROUNDTRIP-SPEED-${selected.id}`,
        mode,
        representation: `${selected.input.unknownLeg}_SPEED`,
        stem: selected.stem,
        input: selected.input,
        givens: [`The outward and return distances are equal.`, `Known speed = ${q(selected.input.knownLegSpeedKmph)} km/h; average = ${q(selected.input.overallAverageKmph)} km/h.`],
        working: (solution: TsdCp002Solution) => [`Apply 2uv ÷ (u + v) = ${q(selected.input.overallAverageKmph)}.`, `The unknown leg speed is ${q(solved(solution))} km/h.`],
        wrongOptions: numericWrong(selected.wrongs, ["COPY_AVERAGE", "COPY_KNOWN_LEG", "ARITHMETIC_MEAN_ADJUSTMENT"], [
          "This copies the round-trip average as the unknown leg speed.",
          "This assumes both legs use the known speed.",
          "This uses an arithmetic-mean adjustment even though equal distances require a harmonic relation.",
        ]),
      });
    }

    case "oneWayDistanceFromRoundTripData": {
      const cases = [
        { id: "SIXTY", stem: "A car travels from A to B at 30 km/h and returns at 60 km/h. The complete trip takes 3 hours. What is the one-way distance?", input: { mode, outwardSpeedKmph: f(30), returnSpeedKmph: f(60), totalTimeHours: f(3) } as const, wrongs: [distance(135), distance(45), distance(30)] },
        { id: "ONE_TWENTY", stem: "A bus covers a route outward at 40 km/h and returns at 60 km/h. If the round trip takes 5 hours, what is the one-way distance?", input: { mode, outwardSpeedKmph: f(40), returnSpeedKmph: f(60), totalTimeHours: f(5) } as const, wrongs: [distance(250), distance(100), distance(200)] },
        { id: "SECOND_ONE_TWENTY", stem: "A rider goes to a town at 50 km/h and comes back at 75 km/h in a total of 4 hours. What is the one-way distance?", input: { mode, outwardSpeedKmph: f(50), returnSpeedKmph: f(75), totalTimeHours: f(4) } as const, wrongs: [distance(250), distance(100), distance(150)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `ONEWAY-DISTANCE-${selected.id}`,
        mode,
        representation: "EQUAL_DISTANCE_ROUND_TRIP",
        stem: selected.stem,
        input: selected.input,
        givens: [`Outward time = d ÷ ${q(selected.input.outwardSpeedKmph)}.`, `Return time = d ÷ ${q(selected.input.returnSpeedKmph)}.`],
        working: (solution: TsdCp002Solution) => [`Set d/${q(selected.input.outwardSpeedKmph)} + d/${q(selected.input.returnSpeedKmph)} = ${q(selected.input.totalTimeHours)}.`, `Solving gives one-way distance d = ${q(solved(solution))} km.`],
        wrongOptions: numericWrong(selected.wrongs, ["ARITHMETIC_MEAN_TIMES_TOTAL", "TREAT_TOTAL_TIME_AS_ONE_LEG", "USE_ONE_SPEED_ONLY"], [
          "This multiplies total time by the arithmetic mean speed, which overcounts the repeated distance.",
          "This assigns the full round-trip time to only one leg.",
          "This uses just one of the two speeds and ignores the other leg.",
        ]),
      });
    }

    case "roundTripTimeFromOneWayDistance": {
      const cases = [
        { id: "THREE", stem: "A car travels 60 km outward at 30 km/h and returns 60 km at 60 km/h. What is the total round-trip time?", input: { mode, oneWayDistanceKm: f(60), outwardSpeedKmph: f(30), returnSpeedKmph: f(60) } as const, wrongs: [time(2), time(1), time(4)] },
        { id: "FIVE", stem: "A bus travels 120 km outward at 40 km/h and returns at 60 km/h. How long does the full trip take?", input: { mode, oneWayDistanceKm: f(120), outwardSpeedKmph: f(40), returnSpeedKmph: f(60) } as const, wrongs: [time(4), time(2), time(6)] },
        { id: "SECOND_THREE", stem: "A rider covers 90 km to a destination at 45 km/h and returns at 90 km/h. What is the round-trip time?", input: { mode, oneWayDistanceKm: f(90), outwardSpeedKmph: f(45), returnSpeedKmph: f(90) } as const, wrongs: [time(2), time(1), time(4)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `ROUNDTRIP-TIME-${selected.id}`,
        mode,
        representation: "LEG_TIME_SUM",
        stem: selected.stem,
        input: selected.input,
        givens: [`Outward time = ${q(selected.input.oneWayDistanceKm)} ÷ ${q(selected.input.outwardSpeedKmph)} = ${quantity(quotient(selected.input.oneWayDistanceKm, selected.input.outwardSpeedKmph), "hour")}.`, `Return time = ${q(selected.input.oneWayDistanceKm)} ÷ ${q(selected.input.returnSpeedKmph)} = ${quantity(quotient(selected.input.oneWayDistanceKm, selected.input.returnSpeedKmph), "hour")}.`],
        working: (solution: TsdCp002Solution) => [`Add the two leg times.`, `Round-trip time = ${quantity(solved(solution), "hour")}.`],
        wrongOptions: numericWrong(selected.wrongs, ["ARITHMETIC_AVERAGE_SHORTCUT", "OMIT_ONE_LEG", "DOUBLE_SLOW_LEG"], [
          "This divides the two-way distance by an arithmetic mean speed.",
          "This includes only one leg of the journey.",
          "This doubles the slower-leg time and ignores the faster-leg calculation.",
        ]),
      });
    }

    case "totalDistanceFromAverageAndTime": {
      const cases = [
        { id: "TWO_HUNDRED", stem: "A multi-stage journey has an overall average speed of 50 km/h and total travelling time of 4 hours. What total distance is covered?", input: { mode, overallAverageKmph: f(50), totalTimeHours: f(4) } as const, wrongs: [distance(54), distance(25, 2), distance(250)] },
        { id: "TWO_FORTY", stem: "A vehicle completes several route segments in 5 hours at an overall average of 48 km/h. What total distance does it cover?", input: { mode, overallAverageKmph: f(48), totalTimeHours: f(5) } as const, wrongs: [distance(53), distance(48, 5), distance(200)] },
        { id: "TWO_FIFTY", stem: "A traveller's complete segmented journey lasts 4 hours and has an average speed of 62.5 km/h. What total distance is covered?", input: { mode, overallAverageKmph: f(125, 2), totalTimeHours: f(4) } as const, wrongs: [distance(133, 2), distance(125, 8), distance(200)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `TOTAL-DISTANCE-${selected.id}`,
        mode,
        representation: "OVERALL_TOTAL_RECONSTRUCTION",
        stem: selected.stem,
        input: selected.input,
        givens: [`Overall average = ${q(selected.input.overallAverageKmph)} km/h.`, `Complete travelling time = ${quantity(selected.input.totalTimeHours, "hour")}.`],
        working: (solution: TsdCp002Solution) => [`Total distance = average speed × total time.`, `= ${q(selected.input.overallAverageKmph)} × ${q(selected.input.totalTimeHours)} = ${q(solved(solution))} km.`],
        wrongOptions: numericWrong(selected.wrongs, ["ADD_INSTEAD_OF_MULTIPLY", "DIVIDE_INSTEAD_OF_MULTIPLY", "USE_UNSUPPORTED_ROUNDED_TOTAL"], [
          "This adds speed and time instead of multiplying them.",
          "This divides speed by time and therefore has the wrong physical meaning.",
          "This selects a convenient-looking distance without matching average × total time.",
        ]),
      });
    }

    case "segmentAllocationFromTotalsAndSpeeds": {
      const cases = [
        { id: "FIRST_DISTANCE", stem: "A car covers 120 km in 3 hours, travelling at 30 km/h for part of the time and 60 km/h for the rest. How many kilometres are covered at 30 km/h?", input: { mode, totalDistanceKm: f(120), totalTimeHours: f(3), firstSpeedKmph: f(30), secondSpeedKmph: f(60), requested: "FIRST_DISTANCE" } as const, wrongs: [distance(40), distance(90), distance(30)] },
        { id: "FIRST_TIME", stem: "A bus covers 200 km in 3 hours, using speeds of 40 km/h and 80 km/h. How many hours are spent at 40 km/h?", input: { mode, totalDistanceKm: f(200), totalTimeHours: f(3), firstSpeedKmph: f(40), secondSpeedKmph: f(80), requested: "FIRST_TIME" } as const, wrongs: [time(3, 2), time(2), time(5, 2)] },
        { id: "SECOND_DISTANCE", stem: "A rider covers 290 km in 5 hours, travelling at 50 km/h and 70 km/h. What distance is covered at 70 km/h?", input: { mode, totalDistanceKm: f(290), totalTimeHours: f(5), firstSpeedKmph: f(50), secondSpeedKmph: f(70), requested: "SECOND_DISTANCE" } as const, wrongs: [distance(145), distance(100), distance(190)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `ALLOCATION-${selected.id}`,
        mode,
        representation: selected.input.requested,
        stem: selected.stem,
        input: selected.input,
        givens: [`Let t₁ and t₂ be the times at ${q(selected.input.firstSpeedKmph)} and ${q(selected.input.secondSpeedKmph)} km/h.`, `Then t₁ + t₂ = ${q(selected.input.totalTimeHours)} and ${q(selected.input.firstSpeedKmph)}t₁ + ${q(selected.input.secondSpeedKmph)}t₂ = ${q(selected.input.totalDistanceKm)}.`],
        working: (solution: TsdCp002Solution) => [`Solve the two equations for the requested segment quantity.`, `The required allocation is ${solution.answerKind === "TIME" ? quantity(solved(solution), "hour") : `${q(solved(solution))} km`}.`],
        wrongOptions: numericWrong(selected.wrongs, ["EQUAL_SPLIT", "USE_ONE_SPEED_FOR_TOTAL", "SATISFY_ONLY_ONE_EQUATION"], [
          "This divides the route or time equally without checking the distance equation.",
          "This treats the entire journey as though it used only one listed speed.",
          "This may fit one total but fails the simultaneous time-and-distance system.",
        ]),
      });
    }

    case "segmentRatioFromAverageAndSpeeds": {
      const cases = [
        { id: "DISTANCE_ONE_ONE", stem: "A vehicle travels at 30 km/h and 60 km/h on two parts of a journey. If the overall average is 40 km/h, what is the ratio of the distances covered at 30 km/h and 60 km/h?", input: { mode, firstSpeedKmph: f(30), secondSpeedKmph: f(60), overallAverageKmph: f(40), ratioKind: "DISTANCE" } as const, wrongs: [ratio(1, 2), ratio(2, 1), ratio(3, 2)] },
        { id: "DISTANCE_ONE_THREE", stem: "A cyclist travels at 40 km/h and 80 km/h. If the overall average is 64 km/h, what is the distance ratio at 40 km/h to that at 80 km/h?", input: { mode, firstSpeedKmph: f(40), secondSpeedKmph: f(80), overallAverageKmph: f(64), ratioKind: "DISTANCE" } as const, wrongs: [ratio(1, 2), ratio(3, 1), ratio(2, 3)] },
        { id: "TIME_ONE_THREE", stem: "A car travels at 30 km/h and 70 km/h for different times. If the time-weighted average is 60 km/h, what is the time ratio at 30 km/h to that at 70 km/h?", input: { mode, firstSpeedKmph: f(30), secondSpeedKmph: f(70), overallAverageKmph: f(60), ratioKind: "TIME" } as const, wrongs: [ratio(3, 1), ratio(1, 2), ratio(2, 1)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `SEGMENT-RATIO-${selected.id}`,
        mode,
        representation: `${selected.input.ratioKind}_RATIO`,
        stem: selected.stem,
        input: selected.input,
        givens: [`Speeds = ${q(selected.input.firstSpeedKmph)} and ${q(selected.input.secondSpeedKmph)} km/h.`, `Overall average = ${q(selected.input.overallAverageKmph)} km/h.`],
        working: (solution: TsdCp002Solution) => [selected.input.ratioKind === "TIME" ? "Use average = (v₁t₁ + v₂t₂) ÷ (t₁ + t₂)." : "Use average = (d₁ + d₂) ÷ (d₁/v₁ + d₂/v₂).", `The requested ratio is ${formatRatio(solved(solution))}.`],
        wrongOptions: numericWrong(selected.wrongs, ["COPY_SPEED_RATIO", "REVERSE_RATIO", "WRONG_WEIGHTING"], [
          "This copies the two speed numbers into a ratio without reconstructing the average.",
          "This reverses the requested first-to-second order.",
          "This uses the wrong weighting relation for the requested ratio type.",
        ]),
      });
    }

    case "requiredRemainingSpeedForTargetAverage": {
      const cases = [
        { id: "ON_SCHEDULE", stem: "A car must cover 300 km at an average of 60 km/h. It covers the first 120 km in 2 hours. What speed is required for the remaining distance?", input: { mode, totalDistanceKm: f(300), completedDistanceKm: f(120), completedTimeHours: f(2), targetAverageKmph: f(60) } as const, wrongs: [speed(90), speed(40), speed(100)] },
        { id: "BEHIND_SCHEDULE", stem: "A bus must average 60 km/h over 300 km. It covers 100 km in 2.5 hours. What speed is needed for the remaining 200 km?", input: { mode, totalDistanceKm: f(300), completedDistanceKm: f(100), completedTimeHours: f(5, 2), targetAverageKmph: f(60) } as const, wrongs: [speed(60), speed(40), speed(100)] },
        { id: "RECOVERY", stem: "A rider wants an average of 60 km/h over 360 km. The first 180 km takes 4 hours. What speed is needed for the remaining distance?", input: { mode, totalDistanceKm: f(360), completedDistanceKm: f(180), completedTimeHours: f(4), targetAverageKmph: f(60) } as const, wrongs: [speed(60), speed(45), speed(120)] },
      ] as const;
      const selected = cases[index];
      return Object.freeze({
        caseId: `REMAINING-SPEED-${selected.id}`,
        mode,
        representation: "TARGET_AVERAGE_RECOVERY",
        stem: selected.stem,
        input: selected.input,
        givens: [`Target total time = ${q(selected.input.totalDistanceKm)} ÷ ${q(selected.input.targetAverageKmph)} = ${quantity(quotient(selected.input.totalDistanceKm, selected.input.targetAverageKmph), "hour")}.`, `Time already used = ${quantity(selected.input.completedTimeHours, "hour")}.`],
        working: (solution: TsdCp002Solution) => [`Remaining distance = ${q(selected.input.totalDistanceKm)} − ${q(selected.input.completedDistanceKm)} km.`, `Required remaining speed = remaining distance ÷ remaining time = ${q(solved(solution))} km/h.`],
        wrongOptions: numericWrong(selected.wrongs, ["COPY_TARGET_AVERAGE", "USE_COMPLETED_AVERAGE", "DIVIDE_BY_FULL_TARGET_TIME"], [
          "This copies the target average without checking whether the early segment used the correct time.",
          "This carries the completed segment's pace into the remaining route.",
          "This divides remaining distance by the full journey time instead of the remaining time.",
        ]),
      });
    }

    case "compareSegmentedJourneyPlans": {
      const cases = [
        { id: "PLAN_B", stem: "Plan A covers 60 km at 30 km/h and 60 km at 60 km/h. Plan B covers 120 km at 45 km/h. Which plan has the higher average speed?", input: { mode, planA: [segment(60, 30), segment(60, 60)], planB: [segment(120, 45)] } as const },
        { id: "SAME", stem: "Plan A covers 80 km at 40 km/h and 70 km at 70 km/h. Plan B covers 150 km at 50 km/h. How do their average speeds compare?", input: { mode, planA: [segment(80, 40), segment(70, 70)], planB: [segment(150, 50)] } as const },
        { id: "PLAN_A", stem: "Plan A covers 36 km at 72 km/h and 54 km at 54 km/h. Plan B covers 90 km at 50 km/h. Which plan has the higher average speed?", input: { mode, planA: [segment(36, 72), segment(54, 54)], planB: [segment(90, 50)] } as const },
      ] as const;
      const selected = cases[index];
      const insufficient = Object.freeze({ answerKind: "CLASSIFICATION" as const, value: "INDETERMINATE" as const });
      const fixedWrongSeeds: readonly Cp002WrongSeed[] = index === 0
        ? Object.freeze([
            wrong(choice("Plan A"), "CHOOSE_PLAN_A_WITHOUT_TOTALS", "This selects Plan A without completing both total-distance ÷ total-time calculations."),
            wrong(choice("Both plans have the same average speed"), "DECLARE_FALSE_TIE", "The two complete averages are different, so a tie does not survive the totals check."),
            wrong(insufficient, "CLAIM_INSUFFICIENT_DATA", "Both plans contain enough distance and speed data to determine their averages."),
          ])
        : index === 1
          ? Object.freeze([
              wrong(choice("Plan A"), "CHOOSE_PLAN_A_WITHOUT_TOTALS", "This selects Plan A even though both complete averages are equal."),
              wrong(choice("Plan B"), "CHOOSE_PLAN_B_WITHOUT_TOTALS", "This selects Plan B even though both complete averages are equal."),
              wrong(insufficient, "CLAIM_INSUFFICIENT_DATA", "Both plans contain enough distance and speed data to determine their averages."),
            ])
          : Object.freeze([
              wrong(choice("Plan B"), "CHOOSE_PLAN_B_WITHOUT_TOTALS", "This selects Plan B without completing both total-distance ÷ total-time calculations."),
              wrong(choice("Both plans have the same average speed"), "DECLARE_FALSE_TIE", "The two complete averages are different, so a tie does not survive the totals check."),
              wrong(insufficient, "CLAIM_INSUFFICIENT_DATA", "Both plans contain enough distance and speed data to determine their averages."),
            ]);
      return Object.freeze({
        caseId: `COMPARE-${selected.id}`,
        mode,
        representation: selected.id,
        stem: selected.stem,
        input: selected.input,
        givens: ["For each plan, add all segment distances and all segment times separately.", "Then calculate one complete average for Plan A and one for Plan B."],
        working: (solution: TsdCp002Solution) => [`Compare the two complete-plan averages.`, `The correct comparison is: ${solution.value}.`],
        wrongOptions: fixedWrongSeeds,
      });
    }
  }
}
