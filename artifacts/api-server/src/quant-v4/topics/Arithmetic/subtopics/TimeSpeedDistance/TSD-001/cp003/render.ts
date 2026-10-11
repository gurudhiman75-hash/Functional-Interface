import { editorialDifficulty, type TsdEditorialDifficulty } from "../editorial-contract";
import {
  absRational,
  add,
  divide,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import {
  formatClockMinute,
  formatDurationHours,
  formatExamNumber,
  formatSolvedValue,
} from "./generation-support";
import type { TsdCp003GeneratedState } from "./runtime-types";
import type { TsdCp003SolveCertificate, TsdCp003SolveInput } from "./types";

function n(value: Rational): string {
  return formatExamNumber(value);
}

function h(value: Rational): string {
  return formatDurationHours(value);
}

function km(value: Rational): string {
  return `${n(value)} km`;
}

function speed(value: Rational): string {
  return `${n(value)} km/h`;
}

function choose(variant: number, options: readonly string[]): string {
  return options[variant % options.length];
}

function departureShiftText(value: Rational): string {
  const absolute = absRational(value);
  return value.numerator < 0n ? `${h(absolute)} earlier` : `${h(absolute)} later`;
}

function targetText(target: Extract<TsdCp003SolveInput, { solveMode: "walkingRidingAllocation" }>["target"]): string {
  return {
    WALKING_TIME: "time spent walking",
    RIDING_TIME: "time spent riding",
    WALKING_DISTANCE: "distance covered on foot",
    RIDING_DISTANCE: "distance covered while riding",
  }[target];
}

export function renderCp003Stem(state: TsdCp003GeneratedState): string {
  const { input, context, stemVariant } = state;

  switch (input.solveMode) {
    case "timeGainLossFromSpeedChange":
      return choose(stemVariant, [
        `${context} covers ${km(input.distance)}. If its speed increases from ${speed(input.originalSpeed)} to ${speed(input.changedSpeed)}, how much travelling time is saved?`,
        `For the same ${km(input.distance)} journey, ${context} changes speed from ${speed(input.originalSpeed)} to ${speed(input.changedSpeed)}. Find the reduction in journey time.`,
        `${context} normally travels ${km(input.distance)} at ${speed(input.originalSpeed)} but now travels at ${speed(input.changedSpeed)}. By how much does the journey time decrease?`,
      ]);

    case "distanceFromSpeedTimeDifference":
      return choose(stemVariant, [
        `${context} takes ${h(input.timeDifference)} longer at ${speed(input.slowerSpeed)} than at ${speed(input.fasterSpeed)} for the same route. What is the route distance?`,
        `The same journey takes ${h(input.timeDifference)} more at ${speed(input.slowerSpeed)} than at ${speed(input.fasterSpeed)}. Find the distance travelled.`,
        `On a fixed route, the travel-time difference between ${speed(input.slowerSpeed)} and ${speed(input.fasterSpeed)} is ${h(input.timeDifference)}. How long is the route?`,
      ]);

    case "speedFromFixedRouteTimeDifference": {
      if (input.representation === "KNOWN_OTHER_SPEED") {
        const relation = input.unknownRole === "FASTER" ? "faster" : "slower";
        return choose(stemVariant, [
          `${context} covers ${km(input.distance)}. One speed is ${speed(input.knownSpeed)}, and using the ${relation} speed changes the journey time by ${h(input.timeDifference)}. Find the ${relation} speed.`,
          `For a ${km(input.distance)} route, the travel time changes by ${h(input.timeDifference)} when the speed changes from the known ${speed(input.knownSpeed)} to another ${relation} speed. Find that speed.`,
          `${context} has a fixed journey of ${km(input.distance)}. At ${speed(input.knownSpeed)} one travel time is known; the other ${relation} trip differs by ${h(input.timeDifference)}. What is the other speed?`,
        ]);
      }
      const requested = input.target === "SLOWER" ? "slower" : "faster";
      return choose(stemVariant, [
        `${context} covers ${km(input.distance)} at two speeds in the ratio ${n(input.slowerRatio)}:${n(input.fasterRatio)}. The two travel times differ by ${h(input.timeDifference)}. Find the ${requested} speed.`,
        `For the same ${km(input.distance)} route, two speeds are in the ratio ${n(input.slowerRatio)}:${n(input.fasterRatio)}, and their journey times differ by ${h(input.timeDifference)}. What is the ${requested} speed?`,
        `The ${requested} speed is part of a ${n(input.slowerRatio)}:${n(input.fasterRatio)} speed pair on a ${km(input.distance)} route. If the time difference is ${h(input.timeDifference)}, find that speed.`,
      ]);
    }

    case "usualSpeedFromEarlyLatePair":
      return choose(stemVariant, [
        `${context} would arrive ${h(input.lateBy)} late at ${speed(input.slowerTrialSpeed)} and ${h(input.earlyBy)} early at ${speed(input.fasterTrialSpeed)}. What usual speed would make it arrive exactly on time?`,
        `On its usual route, ${context} is ${h(input.lateBy)} late at ${speed(input.slowerTrialSpeed)} but ${h(input.earlyBy)} early at ${speed(input.fasterTrialSpeed)}. Find the speed for an on-time arrival.`,
        `${context} has one fixed scheduled arrival. At ${speed(input.slowerTrialSpeed)} it is ${h(input.lateBy)} late; at ${speed(input.fasterTrialSpeed)} it is ${h(input.earlyBy)} early. Find its usual speed.`,
      ]);

    case "distanceFromEarlyLatePair":
      return choose(stemVariant, [
        `${context} is ${h(input.lateBy)} late at ${speed(input.slowerTrialSpeed)} and ${h(input.earlyBy)} early at ${speed(input.fasterTrialSpeed)}. What is the distance of the fixed route?`,
        `For the same route, travelling at ${speed(input.slowerTrialSpeed)} gives a delay of ${h(input.lateBy)}, while ${speed(input.fasterTrialSpeed)} gives an early arrival of ${h(input.earlyBy)}. Find the route distance.`,
        `${context} follows one schedule: ${h(input.lateBy)} late at ${speed(input.slowerTrialSpeed)} and ${h(input.earlyBy)} early at ${speed(input.fasterTrialSpeed)}. How many kilometres is the journey?`,
      ]);

    case "scheduledArrivalTimeFromActualSpeed":
      return choose(stemVariant, [
        `${context} leaves at ${formatClockMinute(input.departureMinuteFromDayZero)} and covers ${km(input.distance)} at ${speed(input.actualSpeed)}. At what time does it arrive?`,
        `Starting at ${formatClockMinute(input.departureMinuteFromDayZero)}, ${context} travels ${km(input.distance)} at a constant ${speed(input.actualSpeed)}. Find the arrival time.`,
        `${context} departs at ${formatClockMinute(input.departureMinuteFromDayZero)}. If the route is ${km(input.distance)} and the speed is ${speed(input.actualSpeed)}, what is the clock time on arrival?`,
      ]);

    case "requiredRecoverySpeedAfterLostTime":
      return choose(stemVariant, [
        `After losing time, ${context} still has ${km(input.remainingDistance)} to cover in ${h(input.remainingAvailableTime)}. What speed is required to arrive on schedule?`,
        `${context} must cover the remaining ${km(input.remainingDistance)} within ${h(input.remainingAvailableTime)} to avoid further delay. Find the required speed.`,
        `Only ${h(input.remainingAvailableTime)} remain for ${km(input.remainingDistance)} of the route. What recovery speed must ${context} maintain?`,
      ]);

    case "requiredRemainingSpeedAfterPartialRoute":
      return choose(stemVariant, [
        `${context} must cover ${km(input.totalDistance)} in ${h(input.scheduledTotalTime)}. It covers the first ${km(input.completedDistance)} at ${speed(input.completedSpeed)}. What speed is needed for the remaining distance to finish on time?`,
        `A ${km(input.totalDistance)} trip is scheduled for ${h(input.scheduledTotalTime)}. After ${km(input.completedDistance)} at ${speed(input.completedSpeed)}, find the required speed for the rest of the route.`,
        `${context} has a ${h(input.scheduledTotalTime)} schedule for ${km(input.totalDistance)}. The first ${km(input.completedDistance)} are covered at ${speed(input.completedSpeed)}. What must the remaining speed be?`,
      ]);

    case "stoppageDurationFromRunningAndOverallSpeed":
      return choose(stemVariant, [
        `${context} covers ${km(input.distance)}. Its running speed is ${speed(input.runningSpeed)}, but its overall speed including stops is ${speed(input.overallSpeed)}. Find the total stoppage time.`,
        `Over ${km(input.distance)}, ${context} runs at ${speed(input.runningSpeed)} but averages only ${speed(input.overallSpeed)} after including stops. How long is it stopped in total?`,
        `${context} has a running speed of ${speed(input.runningSpeed)} and an overall speed of ${speed(input.overallSpeed)} on a ${km(input.distance)} route. Find the stoppage duration.`,
      ]);

    case "overallSpeedIncludingStops":
      return choose(stemVariant, [
        `${context} covers ${km(input.distance)} at a running speed of ${speed(input.runningSpeed)} and stops for ${h(input.totalStopTime)} in total. What is its overall speed?`,
        `On a ${km(input.distance)} route, ${context} runs at ${speed(input.runningSpeed)} but has ${h(input.totalStopTime)} of stoppage. Find the average speed including stops.`,
        `${context} travels ${km(input.distance)} at ${speed(input.runningSpeed)} while moving and remains stopped for ${h(input.totalStopTime)}. What overall speed does this give?`,
      ]);

    case "runningSpeedFromOverallSpeedAndStops":
      return choose(stemVariant, [
        `${context} covers ${km(input.distance)} at an overall speed of ${speed(input.overallSpeed)}, including ${h(input.totalStopTime)} of stops. What is its running speed?`,
        `The overall speed of ${context} over ${km(input.distance)} is ${speed(input.overallSpeed)}, and it is stopped for ${h(input.totalStopTime)}. Find the speed while it is moving.`,
        `${context} averages ${speed(input.overallSpeed)} over ${km(input.distance)} after ${h(input.totalStopTime)} of stoppage. What running speed is required?`,
      ]);

    case "numberOfStopsFromOverallDelay":
      return choose(stemVariant, [
        `${context} loses ${h(input.totalDelay)} only because of equal stops of ${h(input.stopDuration)} each. How many stops are made?`,
        `Equal stoppages of ${h(input.stopDuration)} create a total delay of ${h(input.totalDelay)}. Find the number of stops.`,
        `${context} is delayed by ${h(input.totalDelay)} in total. If every stop lasts ${h(input.stopDuration)}, how many such stops occurred?`,
      ]);

    case "delayFromRegularStops":
      return choose(stemVariant, [
        `${context} makes ${n(input.stopCount)} stops of ${h(input.stopDuration)} each. What total delay is caused by these stops?`,
        `There are ${n(input.stopCount)} equal stoppages, each lasting ${h(input.stopDuration)}. Find the total stoppage delay.`,
        `${context} stops ${n(input.stopCount)} times for ${h(input.stopDuration)} per stop. By how much is the journey extended?`,
      ]);

    case "restTimeInRepeatedTravelRestCycle":
      return choose(stemVariant, [
        `A traveller completes ${n(input.cycleCount)} equal travel sections, each taking ${h(input.travelTimePerCycle)}, with ${n(input.restEvents)} equal rests between them. The total elapsed time is ${h(input.totalElapsedTime)}. Find the duration of each rest.`,
        `The moving time is ${h(input.travelTimePerCycle)} per section for ${n(input.cycleCount)} sections. With ${n(input.restEvents)} equal rests, the whole activity lasts ${h(input.totalElapsedTime)}. How long is each rest?`,
        `A repeated travel-rest pattern has ${n(input.cycleCount)} travel parts of ${h(input.travelTimePerCycle)} and ${n(input.restEvents)} equal rest periods. If total time is ${h(input.totalElapsedTime)}, find one rest period.`,
      ]);

    case "totalTimeWithRegularStops":
      return choose(stemVariant, [
        `${context} needs ${h(input.runningTime)} of actual running time and makes ${n(input.stopCount)} stops of ${h(input.stopDuration)} each. Find the total elapsed journey time.`,
        `Ignoring stops, the route takes ${h(input.runningTime)}. If ${context} also makes ${n(input.stopCount)} stops of ${h(input.stopDuration)}, what is the complete time?`,
        `${context} has ${h(input.runningTime)} of moving time plus ${n(input.stopCount)} regular stoppages of ${h(input.stopDuration)}. Find the total journey duration.`,
      ]);

    case "speedChangePointDistance":
      return choose(stemVariant, [
        `${context} covers ${km(input.totalDistance)} in ${h(input.totalTravelTime)}. It starts at ${speed(input.firstSpeed)} and later changes to ${speed(input.secondSpeed)}. After how many kilometres does the speed change?`,
        `A ${km(input.totalDistance)} trip takes ${h(input.totalTravelTime)}. The first part is at ${speed(input.firstSpeed)} and the rest at ${speed(input.secondSpeed)}. Find the distance of the first part.`,
        `${context} travels at ${speed(input.firstSpeed)} before a speed change and at ${speed(input.secondSpeed)} afterwards. The total is ${km(input.totalDistance)} in ${h(input.totalTravelTime)}. Locate the change point.`,
      ]);

    case "fractionOfRouteAtChangedSpeed":
      return choose(stemVariant, [
        `${context} covers ${km(input.totalDistance)} in ${h(input.totalTravelTime)}, travelling part of the route at ${speed(input.originalSpeed)} and the rest at ${speed(input.changedSpeed)}. What percentage of the route is covered at the changed speed?`,
        `On a ${km(input.totalDistance)} route completed in ${h(input.totalTravelTime)}, the speed changes from ${speed(input.originalSpeed)} to ${speed(input.changedSpeed)}. Find the percentage of distance travelled at the changed speed.`,
        `${context} uses ${speed(input.originalSpeed)} for one part and ${speed(input.changedSpeed)} for the remaining part of a ${km(input.totalDistance)} journey lasting ${h(input.totalTravelTime)}. What percent of the route uses the changed speed?`,
      ]);

    case "lostTimeDurationFromScheduleRecovery":
      return choose(stemVariant, [
        `After a disruption, ${context} has ${km(input.remainingDistance)} left. It would normally cover this at ${speed(input.usualSpeed)}, but recovers at ${speed(input.recoverySpeed)} and still arrives ${h(input.finalArrivalDelay)} late. How much time was originally lost?`,
        `${context} has ${km(input.remainingDistance)} remaining after losing time. By increasing speed from ${speed(input.usualSpeed)} to ${speed(input.recoverySpeed)}, it recovers part of the delay but is still ${h(input.finalArrivalDelay)} late. Find the lost time.`,
        `For the final ${km(input.remainingDistance)}, ${context} uses ${speed(input.recoverySpeed)} instead of the usual ${speed(input.usualSpeed)} and yet finishes ${h(input.finalArrivalDelay)} late. What was the disruption duration?`,
      ]);

    case "startTimeShiftForSameArrival":
      return choose(stemVariant, [
        `${context} covers ${km(input.distance)}. If its speed changes from ${speed(input.originalSpeed)} to ${speed(input.newSpeed)} but the arrival time must remain the same, by how much should the starting time shift?`,
        `For a fixed ${km(input.distance)} trip, the speed changes from ${speed(input.originalSpeed)} to ${speed(input.newSpeed)}. How much earlier or later must ${context} start to reach at the same time?`,
        `${context} must keep the same arrival on a ${km(input.distance)} route after changing speed from ${speed(input.originalSpeed)} to ${speed(input.newSpeed)}. Find the required change in departure time.`,
      ]);

    case "arrivalShiftFromDepartureAndSpeedChanges":
      return choose(stemVariant, [
        `${context} normally covers ${km(input.distance)} at ${speed(input.originalSpeed)}. On another day it starts ${departureShiftText(input.departureShift)} and travels at ${speed(input.newSpeed)}. By how much does the arrival time shift?`,
        `A ${km(input.distance)} journey normally uses ${speed(input.originalSpeed)}. If departure changes by ${departureShiftText(input.departureShift)} and speed becomes ${speed(input.newSpeed)}, find the magnitude of the arrival-time change.`,
        `${context} changes both departure and speed: ${departureShiftText(input.departureShift)} and ${speed(input.newSpeed)} instead of ${speed(input.originalSpeed)} over ${km(input.distance)}. How much does arrival move?`,
      ]);

    case "walkingRidingAllocation":
      return choose(stemVariant, [
        `A traveller covers ${km(input.totalDistance)} in ${h(input.totalTime)}, walking at ${speed(input.walkingSpeed)} and riding at ${speed(input.ridingSpeed)}. Find the ${targetText(input.target)}.`,
        `Part of a ${km(input.totalDistance)} journey is walked at ${speed(input.walkingSpeed)} and the rest is ridden at ${speed(input.ridingSpeed)}. Total time is ${h(input.totalTime)}. What is the ${targetText(input.target)}?`,
        `A mixed walking-riding trip totals ${km(input.totalDistance)} in ${h(input.totalTime)}. Walking speed is ${speed(input.walkingSpeed)} and riding speed is ${speed(input.ridingSpeed)}. Determine the ${targetText(input.target)}.`,
      ]);

    case "scheduleBuffer":
      return choose(stemVariant, [
        `A journey is allowed ${h(input.scheduledDuration)} in the timetable but normally needs ${h(input.plannedTravelDuration)}. What schedule buffer is available?`,
        `The scheduled duration is ${h(input.scheduledDuration)}, while planned travelling time is ${h(input.plannedTravelDuration)}. Find the extra time built into the schedule.`,
        `A timetable gives ${h(input.scheduledDuration)} for a trip expected to take ${h(input.plannedTravelDuration)}. How much buffer does the schedule contain?`,
      ]);
  }
}

export function cp003Difficulty(input: TsdCp003SolveInput): TsdEditorialDifficulty {
  const hard = new Set(["speedChangePointDistance", "fractionOfRouteAtChangedSpeed", "walkingRidingAllocation"]);
  const easy = new Set([
    "timeGainLossFromSpeedChange",
    "scheduledArrivalTimeFromActualSpeed",
    "requiredRecoverySpeedAfterLostTime",
    "stoppageDurationFromRunningAndOverallSpeed",
    "overallSpeedIncludingStops",
    "runningSpeedFromOverallSpeedAndStops",
    "numberOfStopsFromOverallDelay",
    "delayFromRegularStops",
    "totalTimeWithRegularStops",
    "scheduleBuffer",
  ]);
  if (hard.has(input.solveMode)) return editorialDifficulty("Hard", 4);
  if (easy.has(input.solveMode)) return editorialDifficulty("Easy", 1);
  return editorialDifficulty("Medium", 2);
}

export interface TsdCp003Teaching {
  readonly keyRule: string;
  readonly steps: readonly string[];
  readonly shortcut: string;
  readonly conclusion: string;
}

function answer(solution: TsdCp003SolveCertificate): string {
  return formatSolvedValue(solution.answer, solution.unit);
}

export function cp003Teaching(input: TsdCp003SolveInput, solution: TsdCp003SolveCertificate): TsdCp003Teaching {
  const final = answer(solution);
  const done = (keyRule: string, steps: readonly string[], shortcut: string): TsdCp003Teaching => {
    if (steps.length !== 6) throw new Error(`${input.solveMode}: teaching must contain exactly six learner steps`);
    return Object.freeze({ keyRule, steps: Object.freeze(steps), shortcut, conclusion: `Therefore, the required answer is ${final}.` });
  };

  switch (input.solveMode) {
    case "timeGainLossFromSpeedChange": {
      const oldTime = divide(input.distance, input.originalSpeed);
      const newTime = divide(input.distance, input.changedSpeed);
      return done("📌 Main Rule: For the same distance, compare the two times using Time = Distance ÷ Speed.", [
        `1. Distance stays fixed at ${km(input.distance)}.`,
        `2. Original time = ${n(input.distance)} ÷ ${n(input.originalSpeed)} = ${h(oldTime)}.`,
        `3. Changed time = ${n(input.distance)} ÷ ${n(input.changedSpeed)} = ${h(newTime)}.`,
        `4. Time saved = original time − changed time.`,
        `5. = ${h(oldTime)} − ${h(newTime)} = ${final}.`,
        `6. The higher speed gives the smaller time, so the direction is consistent.`,
      ], "⚡ Exam Speed Trick: On a fixed route, calculate only the two travel times and subtract; never subtract the speeds to get time directly.");
    }

    case "distanceFromSpeedTimeDifference": {
      const slowPerKm = divide(rational(1), input.slowerSpeed);
      const fastPerKm = divide(rational(1), input.fasterSpeed);
      const perKmGap = subtract(slowPerKm, fastPerKm);
      return done("📌 Main Rule: Time gap = Distance × (1/slower speed − 1/faster speed).", [
        `1. The route is the same at both speeds.`,
        `2. Time per km at ${speed(input.slowerSpeed)} is 1/${n(input.slowerSpeed)} hour.`,
        `3. Time per km at ${speed(input.fasterSpeed)} is 1/${n(input.fasterSpeed)} hour.`,
        `4. Difference per km = ${n(perKmGap)} hour.`,
        `5. Distance = ${h(input.timeDifference)} ÷ ${n(perKmGap)} = ${final}.`,
        `6. Substituting this distance into both travel times reproduces the stated gap.`,
      ], "⚡ Exam Speed Trick: For a fixed route, divide the given time difference by the difference of reciprocal speeds.");
    }

    case "speedFromFixedRouteTimeDifference": {
      if (input.representation === "KNOWN_OTHER_SPEED") {
        const knownTime = divide(input.distance, input.knownSpeed);
        const unknownTime = input.unknownRole === "FASTER" ? subtract(knownTime, input.timeDifference) : add(knownTime, input.timeDifference);
        return done("📌 Main Rule: Reconstruct the missing journey time first, then use Speed = Distance ÷ Time.", [
          `1. Fixed distance = ${km(input.distance)}.`,
          `2. Time at the known ${speed(input.knownSpeed)} = ${h(knownTime)}.`,
          `3. Apply the stated time difference in the correct direction.`,
          `4. Missing journey time = ${h(unknownTime)}.`,
          `5. Missing speed = ${n(input.distance)} ÷ ${n(unknownTime)} = ${final}.`,
          `6. The two reconstructed travel times differ by exactly ${h(input.timeDifference)}.`,
        ], "⚡ Exam Speed Trick: Convert the time difference into the other full travel time before dividing distance by time.");
      }
      const scale = solution.intermediate.scale;
      if (!scale) throw new Error("Ratio-speed teaching requires the common scale");
      return done("📌 Main Rule: Write the two speeds as one common scale times the given ratio and fit that pair to the time difference.", [
        `1. Let the speeds be ${n(input.slowerRatio)}k and ${n(input.fasterRatio)}k.`,
        `2. The route is ${km(input.distance)} and the time gap is ${h(input.timeDifference)}.`,
        `3. Use D/(slower speed) − D/(faster speed) = time gap.`,
        `4. Solving gives k = ${n(scale)}.`,
        `5. Multiply k by the requested ratio part to get ${final}.`,
        `6. Rechecking both journey times gives the stated ${h(input.timeDifference)} difference.`,
      ], "⚡ Exam Speed Trick: Keep the speed ratio as ak:bk; the fixed-route time difference determines k directly.");
    }

    case "usualSpeedFromEarlyLatePair": {
      const distance = solution.intermediate.distance!;
      const scheduled = solution.intermediate.scheduledTravelTime!;
      return done("📌 Main Rule: Late + early equals the difference between the two trial travel times on the same route.", [
        `1. Total schedule gap = ${h(input.lateBy)} + ${h(input.earlyBy)} = ${h(add(input.lateBy, input.earlyBy))}.`,
        `2. Use D/${n(input.slowerTrialSpeed)} − D/${n(input.fasterTrialSpeed)} = this gap.`,
        `3. This gives route distance = ${km(distance)}.`,
        `4. Scheduled travel time = slow travel time − late time = ${h(scheduled)}.`,
        `5. Usual speed = ${n(distance)} ÷ ${n(scheduled)} = ${final}.`,
        `6. At this speed the arrival is exactly between the stated late and early cases.`,
      ], "⚡ Exam Speed Trick: First reconstruct the route from the early+late gap; then recover the on-time journey duration.");
    }

    case "distanceFromEarlyLatePair":
      return done("📌 Main Rule: Late + early = D(1/slower speed − 1/faster speed).", [
        `1. Both cases use the same route and the same scheduled arrival.`,
        `2. Total difference between the two travel times = ${h(add(input.lateBy, input.earlyBy))}.`,
        `3. Reciprocal-speed gap = 1/${n(input.slowerTrialSpeed)} − 1/${n(input.fasterTrialSpeed)}.`,
        `4. Distance = total time gap ÷ reciprocal-speed gap.`,
        `5. Exact calculation gives ${final}.`,
        `6. The slow case is late and the fast case early by exactly the stated amounts.`,
      ], "⚡ Exam Speed Trick: Add early and late times first; that sum is the full difference between the two journey times.");

    case "scheduledArrivalTimeFromActualSpeed": {
      const travelHours = divide(input.distance, input.actualSpeed);
      const travelMinutes = multiply(travelHours, rational(60));
      return done("📌 Main Rule: Arrival time = departure time + travel time, using one clock unit throughout.", [
        `1. Journey time = ${n(input.distance)} ÷ ${n(input.actualSpeed)} = ${h(travelHours)}.`,
        `2. Convert journey time to clock minutes = ${n(travelMinutes)} minutes.`,
        `3. Departure = ${formatClockMinute(input.departureMinuteFromDayZero)}.`,
        `4. Add the ${n(travelMinutes)} travel minutes to the departure clock.`,
        `5. Arrival = ${final}.`,
        `6. If midnight is crossed, the day rollover is kept in the clock answer.`,
      ], "⚡ Exam Speed Trick: Convert the journey duration to minutes before adding it to a clock time.");
    }

    case "requiredRecoverySpeedAfterLostTime":
      return done("📌 Main Rule: Recovery speed = remaining distance ÷ remaining available time.", [
        `1. Remaining distance = ${km(input.remainingDistance)}.`,
        `2. Remaining available time = ${h(input.remainingAvailableTime)}.`,
        `3. Use Speed = Distance ÷ Time.`,
        `4. = ${n(input.remainingDistance)} ÷ ${n(input.remainingAvailableTime)}.`,
        `5. Required recovery speed = ${final}.`,
        `6. At this speed, the remaining journey exactly uses the available time.`,
      ], "⚡ Exam Speed Trick: Once lost time is already reflected in the remaining available time, ignore the past and solve only the remaining distance/time pair.");

    case "requiredRemainingSpeedAfterPartialRoute": {
      const completedTime = solution.intermediate.completedTime!;
      const remainingTime = solution.intermediate.remainingTime!;
      const remainingDistance = solution.intermediate.remainingDistance!;
      return done("📌 Main Rule: Subtract time already spent from the schedule, then divide remaining distance by remaining time.", [
        `1. Time already spent = ${n(input.completedDistance)} ÷ ${n(input.completedSpeed)} = ${h(completedTime)}.`,
        `2. Scheduled total time = ${h(input.scheduledTotalTime)}.`,
        `3. Remaining time = ${h(input.scheduledTotalTime)} − ${h(completedTime)} = ${h(remainingTime)}.`,
        `4. Remaining distance = ${n(input.totalDistance)} − ${n(input.completedDistance)} = ${km(remainingDistance)}.`,
        `5. Required speed = ${n(remainingDistance)} ÷ ${n(remainingTime)} = ${final}.`,
        `6. Completed time + remaining time now equals the exact schedule.`,
      ], "⚡ Exam Speed Trick: In partial-route questions, recompute both what remains: distance and time.");
    }

    case "stoppageDurationFromRunningAndOverallSpeed": {
      const runningTime = solution.intermediate.runningTime!;
      const overallTime = solution.intermediate.overallTime!;
      return done("📌 Main Rule: Stoppage time = total elapsed time − actual running time.", [
        `1. Running time = ${n(input.distance)} ÷ ${n(input.runningSpeed)} = ${h(runningTime)}.`,
        `2. Overall elapsed time = ${n(input.distance)} ÷ ${n(input.overallSpeed)} = ${h(overallTime)}.`,
        `3. Overall time already includes all stops.`,
        `4. Stoppage = ${h(overallTime)} − ${h(runningTime)}.`,
        `5. Total stoppage time = ${final}.`,
        `6. Running time + stoppage time reconstructs the overall travel time.`,
      ], "⚡ Exam Speed Trick: Convert both running speed and overall speed into times for the same distance, then subtract.");
    }

    case "overallSpeedIncludingStops": {
      const runningTime = solution.intermediate.runningTime!;
      const totalElapsed = solution.intermediate.totalElapsedTime!;
      return done("📌 Main Rule: Overall speed uses total elapsed time, including every stop.", [
        `1. Running time = ${n(input.distance)} ÷ ${n(input.runningSpeed)} = ${h(runningTime)}.`,
        `2. Add stoppage time ${h(input.totalStopTime)}.`,
        `3. Total elapsed time = ${h(totalElapsed)}.`,
        `4. Overall speed = total distance ÷ total elapsed time.`,
        `5. = ${n(input.distance)} ÷ ${n(totalElapsed)} = ${final}.`,
        `6. The result is lower than the running speed because stops add time but no distance.`,
      ], "⚡ Exam Speed Trick: Overall speed = distance ÷ (running time + stop time), not the running speed itself.");
    }

    case "runningSpeedFromOverallSpeedAndStops": {
      const totalElapsed = solution.intermediate.totalElapsedTime!;
      const runningTime = solution.intermediate.runningTime!;
      return done("📌 Main Rule: Remove stoppage time from total elapsed time before finding running speed.", [
        `1. Total elapsed time = ${n(input.distance)} ÷ ${n(input.overallSpeed)} = ${h(totalElapsed)}.`,
        `2. Stoppage time = ${h(input.totalStopTime)}.`,
        `3. Running time = ${h(totalElapsed)} − ${h(input.totalStopTime)} = ${h(runningTime)}.`,
        `4. Running speed = distance ÷ running time.`,
        `5. = ${n(input.distance)} ÷ ${n(runningTime)} = ${final}.`,
        `6. This running speed must exceed the overall speed whenever stoppage is positive.`,
      ], "⚡ Exam Speed Trick: Overall time includes stops; subtract them first, then use distance/time.");
    }

    case "numberOfStopsFromOverallDelay":
      return done("📌 Main Rule: Number of equal stops = total stoppage delay ÷ duration of one stop.", [
        `1. Total delay due to stops = ${h(input.totalDelay)}.`,
        `2. Duration of one stop = ${h(input.stopDuration)}.`,
        `3. Keep both times in the same unit.`,
        `4. Stop count = ${n(input.totalDelay)} ÷ ${n(input.stopDuration)}.`,
        `5. Number of stops = ${final}.`,
        `6. Multiplying this count by one-stop duration returns the total delay.`,
      ], "⚡ Exam Speed Trick: Equal-stop questions are direct division after the time units match.");

    case "delayFromRegularStops":
      return done("📌 Main Rule: Total stop delay = number of stops × duration of one stop.", [
        `1. Number of stops = ${n(input.stopCount)}.`,
        `2. Each stop lasts ${h(input.stopDuration)}.`,
        `3. All stops have equal duration.`,
        `4. Total delay = ${n(input.stopCount)} × ${h(input.stopDuration)}.`,
        `5. Total delay = ${final}.`,
        `6. No running time is added because the question asks only for delay caused by stops.`,
      ], "⚡ Exam Speed Trick: Count × one-stop time; do not mix the moving time into a pure stoppage-delay question.");

    case "restTimeInRepeatedTravelRestCycle": {
      const totalTravel = solution.intermediate.totalTravelTime!;
      const totalRest = solution.intermediate.totalRestTime!;
      return done("📌 Main Rule: Remove all moving time from total elapsed time, then divide the remaining rest time by the number of rests.", [
        `1. Total moving time = ${n(input.cycleCount)} × ${h(input.travelTimePerCycle)} = ${h(totalTravel)}.`,
        `2. Total elapsed time = ${h(input.totalElapsedTime)}.`,
        `3. Total rest time = ${h(input.totalElapsedTime)} − ${h(totalTravel)} = ${h(totalRest)}.`,
        `4. Number of rest events = ${n(input.restEvents)}.`,
        `5. One rest = ${h(totalRest)} ÷ ${n(input.restEvents)} = ${final}.`,
        `6. Moving time plus all equal rests now reconstructs the full elapsed time.`,
      ], "⚡ Exam Speed Trick: Count travel sections and rest events separately; there is often one fewer rest than travel sections.");
    }

    case "totalTimeWithRegularStops": {
      const totalStop = solution.intermediate.totalStopTime!;
      return done("📌 Main Rule: Total elapsed time = running time + total stoppage time.", [
        `1. Running time = ${h(input.runningTime)}.`,
        `2. Stop count = ${n(input.stopCount)} and one stop = ${h(input.stopDuration)}.`,
        `3. Total stoppage = ${n(input.stopCount)} × ${h(input.stopDuration)} = ${h(totalStop)}.`,
        `4. Add stoppage to running time.`,
        `5. Total journey time = ${h(input.runningTime)} + ${h(totalStop)} = ${final}.`,
        `6. Every stated stop is counted exactly once.`,
      ], "⚡ Exam Speed Trick: First combine all equal stops into one total stoppage block, then add it to moving time.");
    }

    case "speedChangePointDistance": {
      const remaining = subtract(input.totalDistance, solution.answer);
      return done("📌 Main Rule: If speed changes after x km, solve x/v₁ + (D−x)/v₂ = total time.", [
        `1. Let the first segment be x km at ${speed(input.firstSpeed)}.`,
        `2. The remaining segment is ${n(input.totalDistance)} − x km at ${speed(input.secondSpeed)}.`,
        `3. Total-time equation: x/${n(input.firstSpeed)} + (${n(input.totalDistance)}−x)/${n(input.secondSpeed)} = ${n(input.totalTravelTime)}.`,
        `4. Solving the linear equation gives x = ${km(solution.answer)}.`,
        `5. The remaining distance is ${km(remaining)}.`,
        `6. The two segment times add to exactly ${h(input.totalTravelTime)}.`,
      ], "⚡ Exam Speed Trick: Use one unknown distance x; the second distance is automatically D−x, so only one equation is needed.");
    }

    case "fractionOfRouteAtChangedSpeed": {
      const originalDistance = solution.intermediate.originalDistance!;
      const changedDistance = solution.intermediate.changedDistance!;
      return done("📌 Main Rule: First solve the two-distance time equation, then convert the changed-speed distance into a percentage of the route.", [
        `1. Total route = ${km(input.totalDistance)}.`,
        `2. Let the original-speed distance be x; changed-speed distance is ${n(input.totalDistance)} − x.`,
        `3. Use x/${n(input.originalSpeed)} + (${n(input.totalDistance)}−x)/${n(input.changedSpeed)} = ${n(input.totalTravelTime)}.`,
        `4. This gives original-speed distance ${km(originalDistance)} and changed-speed distance ${km(changedDistance)}.`,
        `5. Changed-route percentage = ${n(changedDistance)} ÷ ${n(input.totalDistance)} × 100 = ${final}.`,
        `6. The two route shares add to 100%.`,
      ], "⚡ Exam Speed Trick: Solve distance share first; percentage comes only after the distance split is known.");
    }

    case "lostTimeDurationFromScheduleRecovery": {
      const usual = solution.intermediate.usualRemainingTime!;
      const recovery = solution.intermediate.recoveryRemainingTime!;
      const recovered = solution.intermediate.timeRecovered!;
      return done("📌 Main Rule: Original lost time = time recovered by higher speed + delay still remaining at arrival.", [
        `1. Usual time for the remaining ${km(input.remainingDistance)} = ${h(usual)}.`,
        `2. Recovery time at ${speed(input.recoverySpeed)} = ${h(recovery)}.`,
        `3. Time recovered = ${h(usual)} − ${h(recovery)} = ${h(recovered)}.`,
        `4. Final arrival is still ${h(input.finalArrivalDelay)} late.`,
        `5. Original lost time = ${h(recovered)} + ${h(input.finalArrivalDelay)} = ${final}.`,
        `6. Recovered time plus residual delay accounts for the complete disruption.`,
      ], "⚡ Exam Speed Trick: Higher speed can erase only part of a delay; add the erased part to whatever lateness remains.");
    }

    case "startTimeShiftForSameArrival": {
      const oldTime = solution.intermediate.originalTravelTime!;
      const newTime = solution.intermediate.newTravelTime!;
      return done("📌 Main Rule: To keep the same arrival, the departure shift must exactly offset the change in travel time.", [
        `1. Original travel time = ${n(input.distance)} ÷ ${n(input.originalSpeed)} = ${h(oldTime)}.`,
        `2. New travel time = ${n(input.distance)} ÷ ${n(input.newSpeed)} = ${h(newTime)}.`,
        `3. Arrival must stay unchanged.`,
        `4. Required start shift = |old time − new time|.`,
        `5. = |${h(oldTime)} − ${h(newTime)}| = ${final}.`,
        `6. Faster travel permits a later start; slower travel requires an earlier start.`,
      ], "⚡ Exam Speed Trick: Same arrival means departure change is exactly the opposite of the travel-time change.");
    }

    case "arrivalShiftFromDepartureAndSpeedChanges": {
      const oldTime = solution.intermediate.originalTravelTime!;
      const newTime = solution.intermediate.newTravelTime!;
      const signed = solution.intermediate.signedArrivalShift!;
      return done("📌 Main Rule: Arrival shift = departure shift + change in travel time, keeping signs until the final step.", [
        `1. Original travel time = ${h(oldTime)}.`,
        `2. New travel time = ${h(newTime)}.`,
        `3. Travel-time change = ${h(subtract(newTime, oldTime))}.`,
        `4. Combine with departure shift ${h(input.departureShift)} using signs.`,
        `5. Signed arrival change = ${h(signed)}; magnitude = ${final}.`,
        `6. Using signed changes prevents an earlier departure from being incorrectly added as a delay.`,
      ], "⚡ Exam Speed Trick: Treat earlier as negative and later as positive until the final arrival shift is found.");
    }

    case "walkingRidingAllocation": {
      const walkingDistance = solution.intermediate.walkingDistance!;
      const ridingDistance = solution.intermediate.ridingDistance!;
      const walkingTime = solution.intermediate.walkingTime!;
      const ridingTime = solution.intermediate.ridingTime!;
      return done("📌 Main Rule: Let one distance be x; the other is total distance − x, and their travel times must add to the given total time.", [
        `1. Let walking distance be x km; riding distance is ${n(input.totalDistance)} − x.`,
        `2. Walking time = x/${n(input.walkingSpeed)} and riding time = (${n(input.totalDistance)}−x)/${n(input.ridingSpeed)}.`,
        `3. Set their sum equal to ${h(input.totalTime)} and solve x.`,
        `4. Walking distance = ${km(walkingDistance)}; riding distance = ${km(ridingDistance)}.`,
        `5. Walking time = ${h(walkingTime)}; riding time = ${h(ridingTime)}.`,
        `6. The requested component is therefore ${final}.`,
      ], "⚡ Exam Speed Trick: Solve one distance split; from that single split you can obtain all four walking/riding time-distance components.");
    }

    case "scheduleBuffer":
      return done("📌 Main Rule: Schedule buffer = allowed scheduled duration − planned travel duration.", [
        `1. Scheduled allowance = ${h(input.scheduledDuration)}.`,
        `2. Planned travel duration = ${h(input.plannedTravelDuration)}.`,
        `3. Buffer is only the extra margin, not either full duration.`,
        `4. Buffer = ${h(input.scheduledDuration)} − ${h(input.plannedTravelDuration)}.`,
        `5. Exact buffer = ${final}.`,
        `6. Planned travel time + buffer reconstructs the scheduled duration.`,
      ], "⚡ Exam Speed Trick: Buffer is a difference: timetable allowance minus expected travel time.");
  }
}
