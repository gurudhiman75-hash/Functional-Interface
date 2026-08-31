import { add, divide, multiply, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { generateTsdCp011ExecutableCases } from "./executable-generator";
import type { TsdCp011ExecutableInput, TsdCp011ExecutableSolution, TsdCp011MeasureUnit } from "./executable-types";
import { TSD_CP011_QL_ALLOCATION, type TsdCp011QlId } from "./ql-allocation";
import { TSD_CP011_LEARNER_AUTHORITIES, type TsdCp011AuthorityKey } from "./source-saturation";

function v(r: Rational) { return toMixedString(r); }
function measure(r: Rational, unit: TsdCp011MeasureUnit) { return `${v(r)} ${unit === "METRE" ? "m" : "steps"}`; }
function rate(r: Rational, unit: TsdCp011MeasureUnit) { return `${v(r)} ${unit === "METRE" ? "m/s" : "steps/s"}`; }
function seconds(r: Rational) { return `${v(r)} seconds`; }
function minutes(r: Rational) { return `${v(r)} minutes`; }
function metres(r: Rational) { return `${v(r)} m`; }
function revs(r: Rational) { return `${v(r)} revolutions`; }
function answerText(solution: TsdCp011ExecutableSolution) {
  switch (solution.unit) {
    case "SECOND": return seconds(solution.answer);
    case "MINUTE": return minutes(solution.answer);
    case "METRE": return metres(solution.answer);
    case "STEP": return `${v(solution.answer)} steps`;
    case "METRE_PER_SECOND": return `${v(solution.answer)} m/s`;
    case "STEP_PER_SECOND": return `${v(solution.answer)} steps/s`;
    case "REVOLUTION": return revs(solution.answer);
    case "METRE_PER_MINUTE": return `${v(solution.answer)} m/min`;
    case "REVOLUTION_PER_MINUTE": return `${v(solution.answer)} rpm`;
    case "RATIO": return `${solution.answer.numerator}:${solution.answer.denominator}`;
  }
}
function directionText(direction: "SAME" | "OPPOSITE") { return direction === "SAME" ? "in the same direction as the moving surface" : "against the direction of the moving surface"; }
function qlFor(authorityKey: TsdCp011AuthorityKey): TsdCp011QlId {
  return TSD_CP011_QL_ALLOCATION.find((x) => x.authorityKey === authorityKey)!.qlId;
}
function alternatingVariant(familyIndex: number) { return Math.floor(familyIndex / 2) % 2 === 0; }

function stem(input: TsdCp011ExecutableInput, familyIndex: number): string {
  switch (input.authorityKey) {
    case "movingSurfaceTravelState": {
      if (input.target === "TIME") return familyIndex % 2 === 0
        ? `A ${input.measureUnit === "METRE" ? "moving walkway" : "moving escalator"} is ${measure(input.length, input.measureUnit)} long. A person moves at ${rate(input.personRate, input.measureUnit)} relative to it, while the surface moves at ${rate(input.surfaceRate, input.measureUnit)}. The person moves ${directionText(input.direction)}. How long will the journey take?`
        : `A traveller has to cover ${measure(input.length, input.measureUnit)} on a moving surface. The traveller's own rate is ${rate(input.personRate, input.measureUnit)} and the surface rate is ${rate(input.surfaceRate, input.measureUnit)}. If the traveller moves ${directionText(input.direction)}, find the travel time.`;
      if (input.target === "LENGTH") return `A person moves ${directionText(input.direction)} at ${rate(input.personRate, input.measureUnit)} relative to a moving surface whose rate is ${rate(input.surfaceRate, input.measureUnit)}. The journey takes ${seconds(input.time)}. Find the length of the ${input.measureUnit === "METRE" ? "walkway" : "escalator"}.`;
      if (input.target === "PERSON_RATE") return `A ${measure(input.length, input.measureUnit)} moving surface is crossed in ${seconds(input.time)}. The surface moves at ${rate(input.surfaceRate, input.measureUnit)}, and the person moves ${directionText(input.direction)}. Find the person's rate relative to the surface.`;
      return `A person crosses a ${measure(input.length, input.measureUnit)} moving surface in ${seconds(input.time)} while moving at ${rate(input.personRate, input.measureUnit)} relative to it. The motion is ${input.direction === "SAME" ? "with" : "against"} the surface. Find the speed of the moving surface.`;
    }
    case "stationaryStepCountState": {
      if (input.target === "TOTAL_STEPS") return familyIndex % 2 === 0
        ? `While an escalator is moving, a person physically walks ${v(input.walkedSteps)} steps at ${v(input.personStepRate)} steps/s. The escalator moves at ${v(input.escalatorStepRate)} steps/s ${input.direction === "SAME" ? "in the person's direction" : "against the person"}. How many steps would be visible if the escalator were stopped?`
        : `A person walks ${v(input.walkedSteps)} steps on a moving escalator. The walking rate is ${v(input.personStepRate)} steps/s and the escalator rate is ${v(input.escalatorStepRate)} steps/s, moving ${input.direction === "SAME" ? "with" : "against"} the person. Find the escalator's stationary step count.`;
      if (input.target === "WALKED_STEPS") return `An escalator has ${v(input.totalSteps)} steps when stopped. A person walks at ${v(input.personStepRate)} steps/s while the escalator moves at ${v(input.escalatorStepRate)} steps/s ${input.direction === "SAME" ? "with" : "against"} the person. How many steps does the person actually walk before reaching the end?`;
      if (input.target === "PERSON_RATE") return `An escalator would have ${v(input.totalSteps)} steps when stopped. On the moving escalator a person walks ${v(input.walkedSteps)} steps, while the escalator itself moves at ${v(input.escalatorStepRate)} steps/s ${input.direction === "SAME" ? "with" : "against"} the person. Find the person's walking rate.`;
      return `An escalator has ${v(input.totalSteps)} stationary steps. A person walking at ${v(input.personStepRate)} steps/s actually takes ${v(input.walkedSteps)} steps to reach the end while moving ${input.direction === "SAME" ? "with" : "against"} the escalator. Find the escalator's speed in steps per second.`;
    }
    case "dualEscalatorObservationState": {
      if (input.target === "STOPPED_TIME") return alternatingVariant(familyIndex)
        ? `A person takes ${seconds(input.upTime)} to walk up a moving escalator and ${seconds(input.downTime)} to walk down the same escalator against its motion. The person's walking speed is unchanged. How long would the person take to walk the escalator if it were stopped?`
        : `On the same upward-moving escalator, a person needs ${seconds(input.upTime)} while walking upward and ${seconds(input.downTime)} while walking downward. If the walking pace remains the same, find the time needed when the escalator is stationary.`;
      return alternatingVariant(familyIndex)
        ? `A person takes ${seconds(input.upTime)} moving with an escalator and ${seconds(input.downTime)} moving against it over the same length. Find the ratio of the person's own speed to the escalator's speed.`
        : `For the same escalator length, the travel times with and against the escalator are ${seconds(input.upTime)} and ${seconds(input.downTime)}. The person's walking speed is constant. Find person speed : escalator speed.`;
    }
    case "movingSurfaceStateComparison": {
      if (input.target === "COMBINED_TIME") return familyIndex % 2 === 0
        ? `A person can walk up an escalator in ${seconds(input.stoppedWalkingTime)} when it is stopped, while standing still on the moving escalator takes ${seconds(input.carriedStandingTime)}. How long will the person take if they walk while the escalator is moving upward?`
        : `A moving walkway takes ${seconds(input.carriedStandingTime)} to carry a standing passenger from end to end. The same passenger can walk the stationary walkway in ${seconds(input.stoppedWalkingTime)}. Find the time when the passenger walks while the walkway is moving in the same direction.`;
      if (input.target === "STOPPED_WALKING_TIME") return `A person takes ${seconds(input.combinedTime)} while walking on a moving escalator. If standing still on that escalator would take ${seconds(input.carriedStandingTime)}, how long would the person take to walk the escalator when it is stopped?`;
      if (input.target === "CARRIED_STANDING_TIME") return `A person walks a stopped moving walkway in ${seconds(input.stoppedWalkingTime)} and takes ${seconds(input.combinedTime)} when walking while it moves in the same direction. How long would the walkway alone take to carry a standing person across?`;
      return `A person can walk a stationary walkway in ${seconds(input.stoppedWalkingTime)}. The walkway alone would carry a standing person across in ${seconds(input.carriedStandingTime)}. How much time is saved when the person walks while the walkway moves in the same direction?`;
    }
    case "wheelRollState": {
      if (input.target === "DISTANCE") return `A wheel has circumference ${metres(input.circumference)}. How far will it travel without slipping in ${revs(input.revolutions)}?`;
      if (input.target === "REVOLUTIONS") return `A wheel of circumference ${metres(input.circumference)} rolls ${metres(input.distance)} without slipping. How many complete-equivalent revolutions does it make?`;
      if (input.target === "CIRCUMFERENCE") return `A wheel covers ${metres(input.distance)} in ${revs(input.revolutions)} without slipping. Find its circumference.`;
      if (input.target === "DIAMETER") return `A wheel covers ${metres(input.distance)} in ${revs(input.revolutions)} without slipping. Taking π = ${v(input.pi)}, find the wheel's diameter.`;
      return `A wheel makes ${revs(input.revolutions)} while covering ${metres(input.distance)} without slipping. Using π = ${v(input.pi)}, find its radius.`;
    }
    case "wheelRateTranslationState": {
      if (input.target === "LINEAR_SPEED") return `A wheel of circumference ${metres(input.circumference)} rotates at ${v(input.rpm)} rpm without slipping. Find the linear speed in metres per minute.`;
      if (input.target === "RPM") return `A wheel has circumference ${metres(input.circumference)} and moves at ${v(input.linearSpeedPerMinute)} m/min without slipping. Find its rotational speed in rpm.`;
      if (input.target === "DISTANCE") return `A wheel of circumference ${metres(input.circumference)} rotates at ${v(input.rpm)} rpm for ${minutes(input.timeMinutes)}. How far does it travel without slipping?`;
      return `A wheel of circumference ${metres(input.circumference)} rotates at ${v(input.rpm)} rpm and covers ${metres(input.distance)}. Find the time taken in minutes.`;
    }
    case "twoWheelComparisonState": {
      if (input.target === "REVOLUTION_RATIO") return alternatingVariant(familyIndex)
        ? `Two wheels of circumferences ${metres(input.circumferenceA)} and ${metres(input.circumferenceB)} cover the same distance without slipping. Find the ratio of revolutions made by the first wheel to those made by the second.`
        : `Wheel A and wheel B have circumferences ${metres(input.circumferenceA)} and ${metres(input.circumferenceB)}. Over an equal distance, what is the ratio of A's revolution count to B's?`;
      return `Two wheels with circumferences ${metres(input.circumferenceA)} and ${metres(input.circumferenceB)} each travel ${metres(input.distance)} without slipping. By how many revolutions do their counts differ?`;
    }
  }
}

function explanation(input: TsdCp011ExecutableInput, solution: TsdCp011ExecutableSolution): readonly string[] {
  const answer = answerText(solution);
  switch (input.authorityKey) {
    case "movingSurfaceTravelState": {
      if (input.target === "TIME") {
        const net = input.direction === "SAME" ? add(input.personRate, input.surfaceRate) : subtract(input.personRate, input.surfaceRate);
        return Object.freeze([`The effective rate is ${rate(net, input.measureUnit)} because the two rates ${input.direction === "SAME" ? "add" : "subtract"}.`, `Time = distance ÷ effective rate, so the required time is ${answer}.`]);
      }
      if (input.target === "LENGTH") {
        const net = input.direction === "SAME" ? add(input.personRate, input.surfaceRate) : subtract(input.personRate, input.surfaceRate);
        return Object.freeze([`The effective rate is ${rate(net, input.measureUnit)}.`, `Length = effective rate × time, giving ${answer}.`]);
      }
      const ground = divide(input.length, input.time);
      if (input.target === "PERSON_RATE") return Object.freeze([`The actual rate over the ground is ${rate(ground, input.measureUnit)} from length ÷ time.`, `Remove or restore the surface contribution according to the direction; the person's own rate is ${answer}.`]);
      return Object.freeze([`The actual ground rate is ${rate(ground, input.measureUnit)}.`, `Compare this with the person's own rate in the stated direction; the moving surface rate is ${answer}.`]);
    }
    case "stationaryStepCountState": {
      if (input.target === "TOTAL_STEPS") {
        const time = divide(input.walkedSteps, input.personStepRate);
        return Object.freeze([`Walking ${v(input.walkedSteps)} steps at ${v(input.personStepRate)} steps/s takes ${seconds(time)}.`, `In that time the person's ground step-rate is the walking rate ${input.direction === "SAME" ? "plus" : "minus"} the escalator rate, so the stationary-equivalent count is ${answer}.`]);
      }
      if (input.target === "WALKED_STEPS") return Object.freeze([`Use the person's step rate ${input.direction === "SAME" ? "plus" : "minus"} the escalator rate to get the rate at which stationary-equivalent steps are covered.`, `The journey time follows from total steps ÷ that rate; multiplying by the person's own rate gives ${answer} actually walked.`]);
      if (input.target === "PERSON_RATE") return Object.freeze([`The difference between stationary steps and walked steps is the escalator's contribution during the same travel time.`, `Using the common time relation for the person and escalator gives the person's walking rate as ${answer}.`]);
      return Object.freeze([`The person walks ${v(input.walkedSteps)} steps at ${v(input.personStepRate)} steps/s, which fixes the travel time.`, `The remaining signed contribution needed to account for ${v(input.totalSteps)} stationary steps is the escalator rate, ${answer}.`]);
    }
    case "dualEscalatorObservationState": {
      if (input.target === "STOPPED_TIME") return Object.freeze([`With and against the escalator, the same length is covered at person speed plus and minus escalator speed.`, `Eliminating the escalator speed gives stopped time = 2 × up time × down time ÷ (up time + down time), which is ${answer}.`]);
      return Object.freeze([`For the same length, reciprocal travel times are proportional to person speed plus and minus escalator speed.`, `Solving the pair gives person speed : escalator speed = ${answer}.`]);
    }
    case "movingSurfaceStateComparison": {
      const relation = `For a fixed length, walking rate = 1/${input.target === "STOPPED_WALKING_TIME" ? v(solution.answer) : "stopped time"} and surface rate = 1/${input.target === "CARRIED_STANDING_TIME" ? v(solution.answer) : "carried time"} in length-units per second.`;
      if (input.target === "COMBINED_TIME") return Object.freeze([`For the same length, the person's walking rate and the surface's carrying rate add.`, `Thus 1/combined time = 1/stopped-walking time + 1/carried time, giving ${answer}.`]);
      if (input.target === "TIME_SAVED") return Object.freeze([`First combine the person's walking rate and the surface rate for the same fixed length.`, `The combined travel time is subtracted from the stopped-walking time, so the saving is ${answer}.`]);
      return Object.freeze([relation, `Using 1/combined time = 1/stopped-walking time + 1/carried time and solving for the missing time gives ${answer}.`]);
    }
    case "wheelRollState": {
      if (input.target === "DISTANCE") return Object.freeze([`Each revolution moves the wheel forward by one circumference, ${metres(input.circumference)}.`, `Distance = circumference × revolutions = ${answer}.`]);
      if (input.target === "REVOLUTIONS") return Object.freeze([`Each revolution covers ${metres(input.circumference)}.`, `Revolutions = distance ÷ circumference = ${answer}.`]);
      if (input.target === "CIRCUMFERENCE") return Object.freeze([`The total distance is the sum of one circumference for every revolution.`, `Circumference = distance ÷ revolutions = ${answer}.`]);
      return Object.freeze([`First find circumference = distance ÷ revolutions.`, `${input.target === "DIAMETER" ? "Diameter = circumference ÷ π" : "Radius = circumference ÷ (2π)"}, giving ${answer}.`]);
    }
    case "wheelRateTranslationState": {
      if (input.target === "LINEAR_SPEED") return Object.freeze([`Every revolution advances the wheel by ${metres(input.circumference)}.`, `Linear speed = circumference × rpm = ${answer}.`]);
      if (input.target === "RPM") return Object.freeze([`Linear distance covered per minute equals circumference × revolutions per minute.`, `RPM = linear speed ÷ circumference = ${answer}.`]);
      if (input.target === "DISTANCE") return Object.freeze([`At ${v(input.rpm)} rpm, each minute covers circumference × rpm metres.`, `Multiplying that rate by ${minutes(input.timeMinutes)} gives ${answer}.`]);
      return Object.freeze([`The wheel covers circumference × rpm metres each minute.`, `Time = distance ÷ that linear rate = ${answer}.`]);
    }
    case "twoWheelComparisonState": {
      if (input.target === "REVOLUTION_RATIO") return Object.freeze([`For the same distance, revolution count is inversely proportional to circumference.`, `Therefore first : second revolutions = second circumference : first circumference = ${answer}.`]);
      return Object.freeze([`For each wheel, revolutions = common distance ÷ its circumference.`, `Subtract the two revolution counts; the difference is ${answer}.`]);
    }
  }
}

export type TsdCp011EnglishReviewQuestion = Readonly<{
  familyId: string;
  qlId: TsdCp011QlId;
  authorityKey: TsdCp011AuthorityKey;
  difficulty: "EASY" | "MEDIUM";
  input: TsdCp011ExecutableInput;
  solution: TsdCp011ExecutableSolution;
  stem: string;
  explanation: Readonly<{ steps: readonly string[]; conclusion: string }>;
}>;

const allCases = generateTsdCp011ExecutableCases();
const questions: TsdCp011EnglishReviewQuestion[] = [];
for (const authorityKey of TSD_CP011_LEARNER_AUTHORITIES) {
  const qlId = qlFor(authorityKey);
  const selected = allCases.filter((x) => x.authorityKey === authorityKey).slice(0, 24);
  selected.forEach((testCase, index) => {
    const familyId = `TSD-CP011-${qlId.replace("TSD-QL-", "QL")}-${String.fromCharCode(65 + index)}`;
    const steps = explanation(testCase.input, testCase.expected);
    questions.push(Object.freeze({
      familyId,
      qlId,
      authorityKey,
      difficulty: index < 2 ? "EASY" : "MEDIUM",
      input: testCase.input,
      solution: testCase.expected,
      stem: stem(testCase.input, index),
      explanation: Object.freeze({ steps, conclusion: `Answer: ${answerText(testCase.expected)}.` }),
    }));
  });
}

export const TSD_CP011_ENGLISH_REVIEW = Object.freeze(questions);