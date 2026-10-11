import {
  absRational,
  add,
  ceilRational,
  divide,
  floorRational,
  multiply,
  rational,
  subtract,
  toMixedString,
  type Rational,
} from "../../TSD-001/foundation/rational";
import { generateTsdCp012ExecutableCases } from "./executable-cases";
import type {
  TsdCp012ExecutableInput,
  TsdCp012ExecutableSolution,
  TsdCp012Route,
  TsdCp012Stage,
  TsdCp012TimedStage,
} from "./executable-types";
import {
  generateTsdCp012SourceExtensionCases,
  type TsdCp012SourceExtensionInput,
} from "./source-executable-extensions";
import { TSD_CP012_QL_ALLOCATION, type TsdCp012QlId } from "./ql-allocation";
import { TSD_CP012_LEARNER_AUTHORITIES, type TsdCp012AuthorityKey } from "./source-saturation";
import { TSD_CP012_TWO_ENGINE_PROVENANCE } from "./two-engine-provenance";

export type TsdCp012ReviewInput = TsdCp012ExecutableInput | TsdCp012SourceExtensionInput;

type TsdCp012ReviewCase = Readonly<{
  caseId: string;
  authorityKey: TsdCp012AuthorityKey;
  input: TsdCp012ReviewInput;
  expected: TsdCp012ExecutableSolution;
}>;

function v(value: Rational): string { return toMixedString(value); }
function seconds(value: Rational): string { return `${v(value)} seconds`; }
function metres(value: Rational): string { return `${v(value)} m`; }
function speed(value: Rational): string { return `${v(value)} m/s`; }
function timedPlan(stages: readonly TsdCp012TimedStage[]): string {
  return stages.map((stage, index) => `stage ${index + 1}: ${speed(stage.speed)} for ${seconds(stage.duration)}`).join("; ");
}
function distancePlan(stages: readonly TsdCp012Stage[]): string {
  return stages.map((stage, index) => `stretch ${index + 1}: ${metres(stage.distance)} at ${speed(stage.speed)}`).join("; ");
}
function routeText(route: TsdCp012Route): string { return distancePlan(route.segments); }
function timedDistance(stage: TsdCp012TimedStage): Rational { return multiply(stage.speed, stage.duration); }
function stageTime(stage: TsdCp012Stage): Rational { return divide(stage.distance, stage.speed); }
function sum(values: readonly Rational[]): Rational { return values.reduce((total, value) => add(total, value), rational(0)); }
function routeTime(route: TsdCp012Route): Rational { return sum(route.segments.map(stageTime)); }
function answerText(solution: TsdCp012ExecutableSolution, authorityKey: TsdCp012AuthorityKey): string {
  if (solution.kind === "SET") return `{${solution.values.map(v).join(", ")}} m/s`;
  switch (solution.unit) {
    case "SECOND": return seconds(solution.answer);
    case "METRE": return metres(solution.answer);
    case "METRE_PER_SECOND": return speed(solution.answer);
    case "COUNT": return `${v(solution.answer)}`;
    case "INDEX": return `Route ${v(solution.answer)}`;
    case "RATIO": return v(solution.answer);
    case "PARAMETER": return authorityKey === "twoEngineInverseState" ? speed(solution.answer) : v(solution.answer);
  }
}
function qlFor(authorityKey: TsdCp012AuthorityKey): TsdCp012QlId {
  const row = TSD_CP012_QL_ALLOCATION.find((candidate) => candidate.authorityKey === authorityKey);
  if (!row) throw new Error(`TSD-CP-012 missing provisional QL for ${authorityKey}`);
  return row.qlId;
}
function engineLabel(authorityKey: TsdCp012AuthorityKey): string {
  switch (authorityKey) {
    case "trainScheduleSynthesisState": return "a train-schedule observation";
    case "mediumPursuitSynthesisState": return "a stream-pursuit observation";
    case "closedTrackRaceSynthesisState": return "a closed-track race observation";
    case "movingSurfaceScheduleSynthesisState": return "a moving-surface schedule observation";
    case "routeProfileProgramState": return "a segmented-route observation";
    case "terminalConstraintProgramState": return "a deadline-constrained journey observation";
    case "discreteSpeedProgramState": return "a variable-speed program observation";
    case "periodicTravelRestProgramState": return "a travel-rest cycle observation";
    case "motionReconstructionProgramState": return "a reconstructed itinerary observation";
    case "twoEngineInverseState": return "a coupled two-engine observation";
    case "feasibleParameterSetState": return "a finite feasibility observation";
  }
}
function equation(a: Rational, b: Rational, c: Rational): string {
  const sign = b.numerator < 0n ? "−" : "+";
  return `${v(a)}x ${sign} ${v(absRational(b))}y = ${v(c)}`;
}

function stem(input: TsdCp012ReviewInput, caseId: string, familyIndex: number): string {
  switch (input.authorityKey) {
    case "discreteSpeedProgramState": {
      if (input.target === "TOTAL_DISTANCE") return familyIndex % 2 === 0
        ? `A patrol vehicle follows this timed speed plan: ${timedPlan(input.stages)}. It moves continuously through the listed stages. What total distance does it cover?`
        : `During a test run, a vehicle uses the successive speed-duration stages ${timedPlan(input.stages)}. Find the distance covered by the end of the final stage.`;
      if (input.target === "TOTAL_TIME") return `A courier completes successive route stretches as follows: ${distancePlan(input.stages)}. There is no stoppage between stretches. Find the total travel time.`;
      if (input.target === "UNKNOWN_FINAL_SPEED") return `A delivery van first follows ${timedPlan(input.priorStages)}. It then travels for another ${seconds(input.finalDuration)} at one constant unknown speed. The complete journey is ${metres(input.totalDistance)}. Find the speed in the final stage.`;
      if (input.target === "PERIODIC_DISTANCE") return `An inspection trolley repeatedly follows the cycle ${timedPlan(input.cycle)}. It completes ${input.fullCycles} full cycles and then follows the partial sequence ${timedPlan(input.partialStages)}. How far has it travelled in all?`;
      return `A runner repeats the speed cycle ${timedPlan(input.cycle)} without any rest. At what exact time from the start will the runner first complete ${metres(input.distance)}?`;
    }

    case "periodicTravelRestProgramState": {
      if (input.target === "COMPLETION_TIME") return `A field worker moves at ${speed(input.travelSpeed)} for ${seconds(input.travelDurationPerBlock)}, then rests for ${seconds(input.restDuration)}, and repeats this pattern. The destination is ${metres(input.distance)} away. No rest is taken after reaching the destination. Find the total elapsed time.`;
      if (input.target === "REST_COUNT") return `A traveller must cover ${metres(input.distance)}. Each moving spell lasts ${seconds(input.travelDurationPerBlock)} at ${speed(input.travelSpeed)}, with a rest after every completed spell except after final arrival. How many rests occur before the destination is reached?`;
      return `A person covers ${metres(input.distance)} by moving at ${speed(input.travelSpeed)} for ${seconds(input.travelDurationPerBlock)} in each spell and resting equally between spells. The entire trip takes ${seconds(input.totalElapsedTime)}, with no rest after arrival. Find the duration of each rest.`;
    }

    case "terminalConstraintProgramState": {
      if (input.target === "REQUIRED_FINAL_SPEED") return `A vehicle has already covered ${metres(input.completedDistance)} in ${seconds(input.elapsedTime)}. The full trip is ${metres(input.totalDistance)} and must be completed within ${seconds(input.deadline)}. What constant speed is required for the remaining distance?`;
      if (input.target === "REQUIRED_FINAL_TIME") return `A traveller has covered ${metres(input.completedDistance)} in ${seconds(input.elapsedTime)} on a ${metres(input.totalDistance)} route. The remaining portion will be covered at ${speed(input.finalSpeed)}. How much time will the final portion take?`;
      if (input.target === "STAGE_BOUNDARY_DISTANCE") return `A ${metres(input.totalDistance)} journey takes ${seconds(input.totalTime)}. The first part is travelled at ${speed(input.firstSpeed)} and the rest at ${speed(input.secondSpeed)}. At what distance from the start does the speed change?`;
      if (input.target === "MAXIMUM_DELAY") return `A vehicle has ${metres(input.distance)} to cover at ${speed(input.speed)} and must arrive within ${seconds(input.arrivalDeadline)} from now. What is the greatest delay before departure that still permits on-time arrival?`;
      if (input.target === "MINIMUM_SPEED") return `A journey of ${metres(input.distance)} must be completed in at most ${seconds(input.availableTime)}. If one constant speed is used throughout, what is the minimum speed that satisfies the deadline?`;
      return `A vehicle is scheduled to cover ${metres(input.totalDistance)}. It has already followed these timed stages: ${timedPlan(input.completedStages)}. How much distance remains after the listed stages?`;
    }

    case "routeProfileProgramState": {
      if (input.target === "TOTAL_TIME") return familyIndex % 2 === 0
        ? `A route has different allowed speeds on successive stretches: ${distancePlan(input.segments)}. Find the total time needed to complete the route.`
        : `A service vehicle follows this fixed route profile: ${distancePlan(input.segments)}. The speed changes exactly at the stated boundaries. Find the total travel time.`;
      if (input.target === "DISTANCE_SPLIT_A") return `A ${metres(input.totalDistance)} trip is completed in ${seconds(input.totalTime)}. Part of the distance is travelled at ${speed(input.speedA)} and the remainder at ${speed(input.speedB)}. How much distance is travelled at ${speed(input.speedA)}?`;
      if (input.target === "FASTEST_ROUTE_INDEX") return `Three complete routes are available. Route 1: ${routeText(input.routes[0]!)}. Route 2: ${routeText(input.routes[1]!)}. Route 3: ${routeText(input.routes[2]!)}. Which route has the least exact travel time?`;
      if (input.target === "TIME_DIFFERENCE_BETWEEN_ROUTES") return `Two routes connect the same endpoints. Route A: ${routeText(input.routeA)}. Route B: ${routeText(input.routeB)}. Find the absolute difference between their travel times.`;
      return `Two runners start together from the same corner of a closed rectangular route and move in opposite directions. Clockwise side plan: ${distancePlan(input.clockwiseSegments)}. Counterclockwise side plan: ${distancePlan(input.counterclockwiseSegments)}. Speeds change only at corners. Find their first meeting time after the start.`;
    }

    case "motionReconstructionProgramState": {
      if (input.target === "MISSING_DISTANCE") return `A journey is ${metres(input.totalDistance)} long. Recorded stage distances are ${input.knownDistances.map(metres).join(", ")}; one stage distance is missing from the log. Find that missing distance.`;
      if (input.target === "MISSING_TIME") return `A trip lasts ${seconds(input.totalTime)}. The recorded stage times are ${input.knownTimes.map(seconds).join(", ")}; one stage time is missing. Find the missing time.`;
      if (input.target === "MISSING_SPEED") return `One row of a motion table shows a distance of ${metres(input.missingDistance)} covered in ${seconds(input.missingTime)}, but its speed entry is blank. Find the missing speed.`;
      return `A two-stage itinerary covers ${metres(input.totalDistance)} in ${seconds(input.totalTime)}. The known stage is ${metres(input.knownStage.distance)} at ${speed(input.knownStage.speed)}. The other stage is travelled at ${speed(input.missingSpeed)}. Find the distance of the missing stage.`;
    }

    case "trainScheduleSynthesisState": {
      if (input.target === "MEETING_TIME_FROM_FIRST_DEPARTURE") return `Two trains start from stations ${metres(input.stationDistance)} apart and move toward each other. Train A starts first at ${speed(input.speedA)}; Train B starts ${seconds(input.delayB)} later at ${speed(input.speedB)}. Find the meeting time measured from Train A's departure.`;
      if (input.target === "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE") return `Two trains approach each other with an initial nose-to-nose gap of ${metres(input.initialGap)}. Their lengths are ${metres(input.lengthA)} and ${metres(input.lengthB)}. Train A moves at ${speed(input.speedA)} from time zero; Train B moves at ${speed(input.speedB)} but starts ${seconds(input.delayB)} later. Find the time from Train A's start until the trains have completely crossed.`;
      return `Two trains begin ${metres(input.stationDistance)} apart and move toward each other at ${speed(input.speedA)} and ${speed(input.speedB)}. Train A starts at time zero, while Train B starts later. They meet ${seconds(input.meetingTimeFromFirstDeparture)} after Train A starts. Find Train B's departure delay.`;
    }

    case "mediumPursuitSynthesisState": {
      if (input.target === "RAFT_CATCH_TIME_FROM_RAFT_START") return `A raft drifts downstream with a current of ${speed(input.currentSpeed)}. A motorboat whose still-water speed is ${speed(input.boatStillWaterSpeed)} starts from the same point ${seconds(input.boatStartDelay)} later and goes downstream to catch it. Find the catch time measured from the raft's start.`;
      if (input.target === "RAFT_CATCH_DISTANCE_FROM_START") return `A raft leaves a point with the current flowing at ${speed(input.currentSpeed)}. After ${seconds(input.boatStartDelay)}, a boat of still-water speed ${speed(input.boatStillWaterSpeed)} starts downstream from the same point. How far from the starting point is the raft caught?`;
      if (input.target === "CURRENT_SPEED") return `A raft starts drifting, and a boat of still-water speed ${speed(input.boatStillWaterSpeed)} starts downstream ${seconds(input.boatStartDelay)} later from the same point. The raft is caught ${seconds(input.catchTimeFromRaftStart)} after it began drifting. Find the speed of the current.`;
      return `A boat travelling in a stream drops a floating object unnoticed. The current speed is ${speed(input.currentSpeed)}. After ${seconds(input.detectionDelay)} the loss is noticed and the boat, whose still-water speed is ${speed(input.boatStillWaterSpeed)}, turns back immediately. Find the object's downstream displacement from the drop point when it is recovered.`;
    }

    case "closedTrackRaceSynthesisState": {
      if (input.target === "TRACK_GAP_AT_FASTER_FINISH") return `On a circular track of length ${metres(input.trackLength)}, a race lasts ${input.raceLaps} lap${input.raceLaps === 1 ? "" : "s"}. The faster runner moves at ${speed(input.fasterSpeed)}. The slower runner moves at ${speed(input.slowerSpeed)} and starts ${metres(input.slowerHeadStart)} ahead. When the faster runner finishes, what forward track-gap remains to the slower runner's position?`;
      if (input.target === "HEAD_START_FOR_DEAD_HEAT") return `Two runners race for ${input.raceLaps} lap${input.raceLaps === 1 ? "" : "s"} on a ${metres(input.trackLength)} circular track. Their speeds are ${speed(input.fasterSpeed)} and ${speed(input.slowerSpeed)}. What head start must the slower runner receive for a dead heat?`;
      return `On a ${metres(input.trackLength)} circular track, a faster runner moves at ${speed(input.fasterSpeed)} and a slower runner at ${speed(input.slowerSpeed)}. The slower runner begins ${metres(input.slowerHeadStart)} ahead. Find the first time after the start when the faster runner overtakes the slower runner.`;
    }

    case "movingSurfaceScheduleSynthesisState": {
      if (input.target === "TIME_WITH_STOP_AFTER") return `A person walks along a ${metres(input.length)} moving walkway at ${speed(input.personRate)} relative to the walkway. The walkway adds ${speed(input.surfaceRate)} in the same direction for the first ${seconds(input.surfaceActiveTime)} and then stops. Find the person's total crossing time.`;
      if (input.target === "TIME_WITH_DELAYED_ACTIVATION") return `A person begins walking along a ${metres(input.length)} walkway at ${speed(input.personRate)}. The walkway is initially stopped and begins moving in the same direction at ${speed(input.surfaceRate)} after ${seconds(input.activationDelay)}. Find the total crossing time.`;
      if (input.target === "TIME_WITH_DIRECTION_REVERSAL") return `A person walks on a ${metres(input.length)} moving surface at ${speed(input.personRate)} relative to it. The surface initially moves with the person at ${speed(input.surfaceRate)}, then reverses direction after ${seconds(input.reversalTime)}. Find the total crossing time.`;
      return `A person walks at ${speed(input.personRate)} relative to a ${metres(input.length)} moving walkway. The walkway moves with the person at ${speed(input.surfaceRate)} for an unknown initial interval and then stops. The complete crossing takes ${seconds(input.totalTime)}. For how long was the walkway moving?`;
    }

    case "twoEngineInverseState": {
      const provenance = TSD_CP012_TWO_ENGINE_PROVENANCE.find((row) => row.caseId === caseId);
      if (!provenance) throw new Error(`TSD-CP-012 missing two-engine provenance for ${caseId}`);
      return `Two unknown speeds x and y are measured in m/s. ${engineLabel(provenance.engineA)} gives the relation ${equation(input.a1, input.b1, input.c1)}. Independently, ${engineLabel(provenance.engineB)} gives ${equation(input.a2, input.b2, input.c2)}. Neither observation alone determines both speeds. Find ${input.target === "X" ? "x" : "y"}.`;
    }

    case "feasibleParameterSetState": {
      const common = `A vehicle must cover ${metres(input.distance)}. It may choose only an integer speed from ${input.minimumCandidate} m/s through ${input.maximumCandidate} m/s, and a fixed non-travel delay of ${seconds(input.fixedDelay)} is added. The entire elapsed time must not exceed ${seconds(input.deadline)}.`;
      return input.target === "VALID_SET"
        ? `${common} List the complete set of speeds that satisfy the condition.`
        : `${common} How many allowed speeds satisfy the condition?`;
    }
  }
}

function explanation(input: TsdCp012ReviewInput, solution: TsdCp012ExecutableSolution): readonly string[] {
  const answer = answerText(solution, input.authorityKey);
  switch (input.authorityKey) {
    case "discreteSpeedProgramState": {
      if (input.target === "TOTAL_DISTANCE") {
        const distances = input.stages.map(timedDistance);
        return Object.freeze([`The stage distances are ${distances.map(metres).join(", ")} from speed × time in each stage.`, `Adding those stage distances gives the total, ${answer}.`]);
      }
      if (input.target === "TOTAL_TIME") {
        const times = input.stages.map(stageTime);
        return Object.freeze([`The times for the listed stretches are ${times.map(seconds).join(", ")} from distance ÷ speed.`, `Adding the stage times gives ${answer}.`]);
      }
      if (input.target === "UNKNOWN_FINAL_SPEED") {
        const prior = sum(input.priorStages.map(timedDistance));
        const remaining = subtract(input.totalDistance, prior);
        return Object.freeze([`The completed stages cover ${metres(prior)}, so ${metres(remaining)} remains for the final stage.`, `Final speed = remaining distance ÷ ${seconds(input.finalDuration)}, giving ${answer}.`]);
      }
      if (input.target === "PERIODIC_DISTANCE") {
        const cycleDistance = sum(input.cycle.map(timedDistance));
        const partialDistance = sum(input.partialStages.map(timedDistance));
        return Object.freeze([`One full speed cycle covers ${metres(cycleDistance)}, while the listed terminal partial stages cover ${metres(partialDistance)}.`, `${input.fullCycles} full cycles plus the partial distance give ${answer}.`]);
      }
      const cycleDistance = sum(input.cycle.map(timedDistance));
      const cycleTime = sum(input.cycle.map((stage) => stage.duration));
      const fullCycles = floorRational(divide(input.distance, cycleDistance));
      const remaining = subtract(input.distance, multiply(rational(fullCycles), cycleDistance));
      return Object.freeze([`${fullCycles.toString()} complete cycles cover ${metres(multiply(rational(fullCycles), cycleDistance))} in ${seconds(multiply(rational(fullCycles), cycleTime))}, leaving ${metres(remaining)}.`, `Continue through the next cycle only until that remaining distance is covered; the first time the target is reached is ${answer}.`]);
    }

    case "periodicTravelRestProgramState": {
      const blockDistance = multiply(input.travelSpeed, input.travelDurationPerBlock);
      const movingBlocks = ceilRational(divide(input.distance, blockDistance));
      const rests = movingBlocks > 0n ? movingBlocks - 1n : 0n;
      if (input.target === "COMPLETION_TIME") return Object.freeze([`Each full moving spell covers ${metres(blockDistance)}; ${movingBlocks.toString()} moving spells are needed, so only ${rests.toString()} rests occur before arrival.`, `Add actual moving time and those rests, with no rest after the destination; the elapsed time is ${answer}.`]);
      if (input.target === "REST_COUNT") return Object.freeze([`${movingBlocks.toString()} moving spells are needed because each full spell covers ${metres(blockDistance)}.`, `There is a rest only between moving spells, so the number of rests is ${answer}.`]);
      const pureTravel = divide(input.distance, input.travelSpeed);
      const restTimeTotal = subtract(input.totalElapsedTime, pureTravel);
      return Object.freeze([`Pure travel takes ${seconds(pureTravel)}; therefore ${seconds(restTimeTotal)} of the elapsed time is rest time spread over ${rests.toString()} rests.`, `Dividing the total rest time by the number of rests gives ${answer} per rest.`]);
    }

    case "terminalConstraintProgramState": {
      if (input.target === "REQUIRED_FINAL_SPEED") {
        const remainingDistance = subtract(input.totalDistance, input.completedDistance);
        const remainingTime = subtract(input.deadline, input.elapsedTime);
        return Object.freeze([`${metres(remainingDistance)} remains and only ${seconds(remainingTime)} is left before the deadline.`, `Required final speed = remaining distance ÷ remaining time = ${answer}.`]);
      }
      if (input.target === "REQUIRED_FINAL_TIME") {
        const remainingDistance = subtract(input.totalDistance, input.completedDistance);
        return Object.freeze([`The final stage contains ${metres(remainingDistance)} after subtracting the completed distance.`, `At ${speed(input.finalSpeed)}, final-stage time = distance ÷ speed = ${answer}.`]);
      }
      if (input.target === "STAGE_BOUNDARY_DISTANCE") return Object.freeze([`Let x metres be covered at ${speed(input.firstSpeed)}; then ${v(input.totalDistance)} − x metres are covered at ${speed(input.secondSpeed)}.`, `Their two travel times must total ${seconds(input.totalTime)}. Solving that one boundary equation gives x = ${answer}.`]);
      if (input.target === "MAXIMUM_DELAY") {
        const travelTime = divide(input.distance, input.speed);
        return Object.freeze([`The actual travel needs ${seconds(travelTime)} at the stated speed.`, `The remaining part of the deadline can be used as departure delay, so the maximum delay is ${answer}.`]);
      }
      if (input.target === "MINIMUM_SPEED") return Object.freeze([`To meet the boundary exactly, use the full available ${seconds(input.availableTime)} for ${metres(input.distance)}.`, `Minimum speed = distance ÷ available time = ${answer}; any lower speed misses the deadline.`]);
      const completed = sum(input.completedStages.map(timedDistance));
      return Object.freeze([`The listed variable-speed stages have already covered ${metres(completed)}.`, `Subtracting that from the planned ${metres(input.totalDistance)} leaves ${answer}.`]);
    }

    case "routeProfileProgramState": {
      if (input.target === "TOTAL_TIME") {
        const times = input.segments.map(stageTime);
        return Object.freeze([`The segment travel times are ${times.map(seconds).join(", ")}.`, `Adding the segment times gives the route total, ${answer}.`]);
      }
      if (input.target === "DISTANCE_SPLIT_A") return Object.freeze([`Let x metres be travelled at ${speed(input.speedA)} and the remaining ${v(input.totalDistance)} − x at ${speed(input.speedB)}.`, `Set the two segment times to total ${seconds(input.totalTime)}; solving gives x = ${answer}.`]);
      if (input.target === "FASTEST_ROUTE_INDEX") {
        const times = input.routes.map(routeTime);
        return Object.freeze([`The exact route times are ${times.map((time, index) => `Route ${index + 1}: ${seconds(time)}`).join("; ")}.`, `The smallest of these times belongs to ${answer}.`]);
      }
      if (input.target === "TIME_DIFFERENCE_BETWEEN_ROUTES") {
        const a = routeTime(input.routeA);
        const b = routeTime(input.routeB);
        return Object.freeze([`Route A takes ${seconds(a)} and Route B takes ${seconds(b)} after adding their segment times.`, `The absolute difference between the two totals is ${answer}.`]);
      }
      const perimeter = sum(input.clockwiseSegments.map((stage) => stage.distance));
      return Object.freeze([`Because the runners move in opposite directions, a meeting occurs when their accumulated path distances together first equal the ${metres(perimeter)} perimeter, while respecting each corner speed change.`, `Stepping exactly through those side boundaries gives the first closure at ${answer}.`]);
    }

    case "motionReconstructionProgramState": {
      if (input.target === "MISSING_DISTANCE") return Object.freeze([`The known stages total ${metres(sum(input.knownDistances))} of the ${metres(input.totalDistance)} journey.`, `The missing stage is the difference, ${answer}.`]);
      if (input.target === "MISSING_TIME") return Object.freeze([`The recorded stages account for ${seconds(sum(input.knownTimes))} of the ${seconds(input.totalTime)} journey.`, `The unrecorded time is the difference, ${answer}.`]);
      if (input.target === "MISSING_SPEED") return Object.freeze([`The missing row itself covers ${metres(input.missingDistance)} in ${seconds(input.missingTime)}.`, `Speed = distance ÷ time, so the missing entry is ${answer}.`]);
      const knownTime = stageTime(input.knownStage);
      const remainingTime = subtract(input.totalTime, knownTime);
      return Object.freeze([`The known stage takes ${seconds(knownTime)}, leaving ${seconds(remainingTime)} for the second stage.`, `At ${speed(input.missingSpeed)}, the second-stage distance is speed × time = ${answer}.`]);
    }

    case "trainScheduleSynthesisState": {
      if (input.target === "MEETING_TIME_FROM_FIRST_DEPARTURE") return Object.freeze([`At meeting time t from Train A's start, Train A travels at ${speed(input.speedA)} for t seconds, while Train B travels for t − ${v(input.delayB)} seconds.`, `Their distances add to ${metres(input.stationDistance)}; solving the schedule equation gives t = ${answer}.`]);
      if (input.target === "COMPLETE_CROSSING_TIME_FROM_FIRST_DEPARTURE") {
        const closure = add(add(input.initialGap, input.lengthA), input.lengthB);
        const before = multiply(input.speedA, input.delayB);
        return Object.freeze([`Complete crossing requires ${metres(closure)} of total closure. Before Train B starts, Train A alone closes ${metres(before)}.`, `After the delay, the remaining closure is covered at the sum of the two train speeds; including the delay gives ${answer}.`]);
      }
      return Object.freeze([`At the known meeting time, Train A and Train B together must account for the full ${metres(input.stationDistance)}, but Train B has travelled for fewer seconds because of its delay.`, `Solving that distance equation for Train B's missing start delay gives ${answer}.`]);
    }

    case "mediumPursuitSynthesisState": {
      if (input.target === "RAFT_CATCH_TIME_FROM_RAFT_START") return Object.freeze([`During the boat's delayed start, the raft gains distance with the current; once the boat starts, the boat closes that lead at its still-water speed relative to the raft.`, `Using the stated current, boat speed and delay gives a catch time of ${answer} from the raft's start.`]);
      if (input.target === "RAFT_CATCH_DISTANCE_FROM_START") return Object.freeze([`First use the delayed-start pursuit relation to obtain the catch time from the raft's start.`, `The raft drifts at ${speed(input.currentSpeed)} for that entire time, so its catch position is ${answer}.`]);
      if (input.target === "CURRENT_SPEED") return Object.freeze([`The boat starts ${seconds(input.boatStartDelay)} late but catches the raft at ${seconds(input.catchTimeFromRaftStart)} from the raft's start.`, `Equating the raft's drift distance with the boat's downstream travel over its shorter running time gives the current as ${answer}.`]);
      return Object.freeze([`While the loss is unnoticed, the floating object and boat separate because the object follows the current and the boat continues downstream; after the turn the boat must recover that accumulated stream displacement.`, `The exact recovery geometry reduces to twice current × detection delay, giving ${answer}.`]);
    }

    case "closedTrackRaceSynthesisState": {
      if (input.target === "TRACK_GAP_AT_FASTER_FINISH") return Object.freeze([`The faster runner's finish time comes from race distance ÷ ${speed(input.fasterSpeed)}. In that same time the slower runner advances from the stated head start at ${speed(input.slowerSpeed)}.`, `Reduce the slower runner's position modulo the ${metres(input.trackLength)} track; the forward finish-gap is ${answer}.`]);
      if (input.target === "HEAD_START_FOR_DEAD_HEAT") return Object.freeze([`Find the faster runner's finish time for the declared lap distance.`, `In that time the slower runner covers less distance; the missing distance needed to reach the same finish is the required head start, ${answer}.`]);
      return Object.freeze([`The faster runner gains at ${speed(subtract(input.fasterSpeed, input.slowerSpeed))}. The relevant initial modular gap is the stated head start, or one full lap when both start together.`, `Overtake time = modular gap ÷ relative speed = ${answer}.`]);
    }

    case "movingSurfaceScheduleSynthesisState": {
      if (input.target === "TIME_WITH_STOP_AFTER") return Object.freeze([`While the walkway is active, the person's ground speed is ${speed(add(input.personRate, input.surfaceRate))}; after it stops, only ${speed(input.personRate)} remains.`, `Apply those rates in sequence, stopping the first stage early if the destination is already reached; the total is ${answer}.`]);
      if (input.target === "TIME_WITH_DELAYED_ACTIVATION") return Object.freeze([`Before activation the person advances only at ${speed(input.personRate)}; after activation the ground speed becomes ${speed(add(input.personRate, input.surfaceRate))}.`, `Use the delayed switch at ${seconds(input.activationDelay)} and the remaining distance to obtain ${answer}.`]);
      if (input.target === "TIME_WITH_DIRECTION_REVERSAL") return Object.freeze([`Before reversal the rates add, while after reversal the surface opposes the person and the net speed becomes ${speed(subtract(input.personRate, input.surfaceRate))}.`, `Apply the two signed-rate stages at the stated reversal time; the crossing finishes in ${answer}.`]);
      return Object.freeze([`If the walkway is active for t seconds, the person gets the surface's extra ${speed(input.surfaceRate)} contribution only during those t seconds; walking contributes for the full ${seconds(input.totalTime)}.`, `Set those two distance contributions equal to ${metres(input.length)} and solve for t = ${answer}.`]);
    }

    case "twoEngineInverseState": {
      return Object.freeze([`The two observations supply independent equations, ${equation(input.a1, input.b1, input.c1)} and ${equation(input.a2, input.b2, input.c2)}, for the two unknown speeds.`, `Solving the pair and taking the requested ${input.target === "X" ? "x" : "y"} speed gives ${answer}.`]);
    }

    case "feasibleParameterSetState": {
      const threshold = divide(input.distance, subtract(input.deadline, input.fixedDelay));
      if (input.target === "VALID_SET") return Object.freeze([`After reserving the fixed ${seconds(input.fixedDelay)} delay, the travel part must fit inside the remaining deadline; this requires speed at least ${speed(threshold)}.`, `Check only the declared integer domain ${input.minimumCandidate} through ${input.maximumCandidate}; the complete valid set is ${answer}.`]);
      return Object.freeze([`The distance/deadline condition gives a minimum feasible speed of ${speed(threshold)} after the fixed delay is included.`, `Count the integers in the allowed domain that meet or exceed that boundary; the count is ${answer}.`]);
    }
  }
}

export type TsdCp012EnglishReviewQuestion = Readonly<{
  familyId: string;
  qlId: TsdCp012QlId;
  authorityKey: TsdCp012AuthorityKey;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  caseId: string;
  input: TsdCp012ReviewInput;
  solution: TsdCp012ExecutableSolution;
  stem: string;
  explanation: Readonly<{ steps: readonly string[]; conclusion: string }>;
}>;

const baseCases: readonly TsdCp012ReviewCase[] = generateTsdCp012ExecutableCases();
const extensionCases: readonly TsdCp012ReviewCase[] = generateTsdCp012SourceExtensionCases();

function selectedCases(authorityKey: TsdCp012AuthorityKey): readonly TsdCp012ReviewCase[] {
  const base = baseCases.filter((candidate) => candidate.authorityKey === authorityKey);
  const extensions = extensionCases.filter((candidate) => candidate.authorityKey === authorityKey);
  return Object.freeze([...base, ...extensions]);
}

const questions: TsdCp012EnglishReviewQuestion[] = [];
for (const authorityKey of TSD_CP012_LEARNER_AUTHORITIES) {
  const qlId = qlFor(authorityKey);
  const selected = selectedCases(authorityKey);
  selected.forEach((testCase, index) => {
    const familyId = `TSD-CP012-${qlId.replace("TSD-QL-", "QL")}-${String.fromCharCode(65 + index)}`;
    const steps = explanation(testCase.input, testCase.expected);
    questions.push(Object.freeze({
      familyId,
      qlId,
      authorityKey,
      difficulty: index < 2 ? "EASY" : index < 5 ? "MEDIUM" : "HARD",
      caseId: testCase.caseId,
      input: testCase.input,
      solution: testCase.expected,
      stem: stem(testCase.input, testCase.caseId, index),
      explanation: Object.freeze({ steps, conclusion: `Answer: ${answerText(testCase.expected, authorityKey)}.` }),
    }));
  });
}

export const TSD_CP012_ENGLISH_REVIEW = Object.freeze(questions);
