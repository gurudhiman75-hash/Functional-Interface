import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

function n(parameters: Rap003Parameters, key: string) {
  return Number(parameters.variables[key]);
}

function s(parameters: Rap003Parameters, key: string, fallback: string) {
  return String(parameters.variables[key] ?? fallback);
}

function answer(solver: Rap003SolverResult) {
  return String(solver.answer).replaceAll("$$", "").trim();
}

function line(text: string, math?: string) {
  return math ? `${text}\n\n$$\\Rightarrow ${math}$$` : text;
}

function result(parameters: Rap003Parameters, lines: string[]): Rap003Explanation {
  return { explanationId: parameters.explanationId, lines };
}

function ratioRelation(parameters: Rap003Parameters, solver: Rap003SolverResult, mode: "time" | "distance" | "speed") {
  const objectA = s(parameters, "objectA", s(parameters, "personA", "Object A"));
  const objectB = s(parameters, "objectB", s(parameters, "personB", "Object B"));
  const final = answer(solver);
  if (mode === "time") {
    const dA = n(parameters, "distanceRatioA");
    const dB = n(parameters, "distanceRatioB");
    const sA = n(parameters, "speedRatioA");
    const sB = n(parameters, "speedRatioB");
    return result(parameters, [
      "Time equals distance divided by speed.",
      line(`${objectA}'s time part`, `\\frac{${dA}}{${sA}}`),
      line(`${objectB}'s time part`, `\\frac{${dB}}{${sB}}`),
      line("Clear the denominators by cross-multiplying.", `${dA}\\times${sB}:${dB}\\times${sA}`),
      line("Evaluate the two products.", `${dA * sB}:${dB * sA}`),
      line("Reduce the ratio.", `${dA * sB}:${dB * sA}=${final}`),
      `So, their time ratio is ${final}.`,
    ]);
  }
  if (mode === "distance") {
    const sA = n(parameters, "speedRatioA");
    const sB = n(parameters, "speedRatioB");
    const tA = n(parameters, "timeRatioA");
    const tB = n(parameters, "timeRatioB");
    return result(parameters, [
      "Distance equals speed multiplied by time.",
      line(`${objectA}'s distance part`, `${sA}\\times${tA}=${sA * tA}`),
      line(`${objectB}'s distance part`, `${sB}\\times${tB}=${sB * tB}`),
      line("Form the distance ratio.", `${sA * tA}:${sB * tB}`),
      line("Reduce the ratio.", `${sA * tA}:${sB * tB}=${final}`),
      "Both speed and time must be included because both differ.",
      `So, their distance ratio is ${final}.`,
    ]);
  }
  const dA = n(parameters, "distanceRatioA");
  const dB = n(parameters, "distanceRatioB");
  const tA = n(parameters, "timeRatioA");
  const tB = n(parameters, "timeRatioB");
  return result(parameters, [
    "Speed equals distance divided by time.",
    line(`${objectA}'s speed part`, `\\frac{${dA}}{${tA}}`),
    line(`${objectB}'s speed part`, `\\frac{${dB}}{${tB}}`),
    line("Clear the denominators by cross-multiplying.", `${dA}\\times${tB}:${dB}\\times${tA}`),
    line("Evaluate the products.", `${dA * tB}:${dB * tA}`),
    line("Reduce the ratio.", `${dA * tB}:${dB * tA}=${final}`),
    `So, their speed ratio is ${final}.`,
  ]);
}

function raceLead(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const faster = s(parameters, "objectA", s(parameters, "personA", "the faster runner"));
  const slower = s(parameters, "objectB", s(parameters, "personB", "the slower runner"));
  const distance = n(parameters, "trackDistance");
  const speedA = n(parameters, "speedRatioA");
  const speedB = n(parameters, "speedRatioB");
  const slowerDistance = distance * speedB / speedA;
  const final = answer(solver);
  return result(parameters, [
    `When ${faster} finishes, both have run for the same time.`,
    line("Their covered distances therefore follow their speed ratio.", `${faster}:${slower}=${speedA}:${speedB}`),
    line(`${slower}'s covered distance is`, `${distance}\\times\\frac{${speedB}}{${speedA}}=${slowerDistance}`),
    line("The winning lead is the remaining distance.", `${distance}-${slowerDistance}=${final}`),
    `${faster} has completed the full ${distance}-metre race.`,
    `${slower} has covered ${slowerDistance} metres at that moment.`,
    `So, ${faster} wins by ${final} metres.`,
  ]);
}

function simpleInverse(parameters: Rap003Parameters, solver: Rap003SolverResult, rateAKey: string, rateBKey: string, label: string) {
  const personA = s(parameters, "personA", "A");
  const personB = s(parameters, "personB", "B");
  const rateA = n(parameters, rateAKey);
  const rateB = n(parameters, rateBKey);
  const final = answer(solver);
  return result(parameters, [
    `For the same ${label}, time varies inversely with rate.`,
    line("Rate ratio", `${personA}:${personB}=${rateA}:${rateB}`),
    line("Invert the rate ratio to obtain time ratio.", `${personA}:${personB}=${rateB}:${rateA}`),
    line("Reduce if necessary.", `${rateB}:${rateA}=${final}`),
    "The faster rate requires less time for the same quantity.",
    "The rate-time product remains constant.",
    `So, the time ratio is ${final}.`,
  ]);
}

function fixedTime(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const personA = s(parameters, "personA", "A");
  const personB = s(parameters, "personB", "B");
  const speedA = n(parameters, "speedRatioA");
  const speedB = n(parameters, "speedRatioB");
  const final = answer(solver);
  return result(parameters, [
    "For equal travel time, distance is directly proportional to speed.",
    line("Speed ratio", `${personA}:${personB}=${speedA}:${speedB}`),
    line("Multiply both speeds by the same time t.", `${speedA}t:${speedB}t`),
    line("The common time cancels.", `${speedA}:${speedB}`),
    line("Thus the distance ratio is", `${speedA}:${speedB}=${final}`),
    "No inversion is required because time is fixed.",
    `So, the distance ratio is ${final}.`,
  ]);
}

function leadToSpeedRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const length = n(parameters, "raceLength");
  const lead = n(parameters, "leadDistance");
  const slowerDistance = length - lead;
  const final = answer(solver);
  return result(parameters, [
    "Both runners move for the same time until the winner finishes.",
    line("The faster runner covers the full race length.", `${length}`),
    line("The slower runner covers", `${length}-${lead}=${slowerDistance}`),
    line("Therefore, speed ratio equals distance ratio.", `${length}:${slowerDistance}`),
    line("Reduce the ratio.", `${length}:${slowerDistance}=${final}`),
    "The common running time cancels from both distances.",
    `So, the speed ratio is ${final}.`,
  ]);
}

function timeToSpeedRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const timeA = n(parameters, "timeA");
  const timeB = n(parameters, "timeB");
  const final = answer(solver);
  return result(parameters, [
    "For the same race distance, speed varies inversely with time.",
    line("Time ratio", `${timeA}:${timeB}`),
    line("Invert it to obtain the speed ratio.", `${timeB}:${timeA}`),
    line("Reduce the ratio.", `${timeB}:${timeA}=${final}`),
    "The runner taking less time has greater speed.",
    "Distance is identical for both runners.",
    `So, their speed ratio is ${final}.`,
  ]);
}

function meeting(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const speedA = n(parameters, "speedA");
  const speedB = n(parameters, "speedB");
  const distance = n(parameters, "distance");
  const relative = speedA + speedB;
  const final = answer(solver);
  return result(parameters, [
    "When two objects move towards each other, their speeds add.",
    line("Relative speed", `${speedA}+${speedB}=${relative}\\text{ km/h}`),
    line("Meeting time equals separation divided by relative speed.", `t=\\frac{${distance}}{${relative}}`),
    line("Evaluate the quotient.", `t=${final}`),
    "The two distances covered together equal the original separation.",
    "All values are already in kilometres and hours.",
    `So, they meet after ${final} hours.`,
  ]);
}

function crossingPoint(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const lengthA = n(parameters, "lengthRatioA");
  const lengthB = n(parameters, "lengthRatioB");
  const speedA = n(parameters, "speedRatioA");
  const speedB = n(parameters, "speedRatioB");
  const rawA = lengthA * speedB;
  const rawB = lengthB * speedA;
  const final = answer(solver);
  return result(parameters, [
    "Time to cross a fixed point equals train length divided by speed.",
    line("First train time part", `\\frac{${lengthA}}{${speedA}}`),
    line("Second train time part", `\\frac{${lengthB}}{${speedB}}`),
    line("Clear the denominators.", `${lengthA}\\times${speedB}:${lengthB}\\times${speedA}`),
    line("Evaluate and reduce.", `${rawA}:${rawB}=${final}`),
    "Both trains cross the same type of reference point.",
    `So, their crossing-time ratio is ${final}.`,
  ]);
}

function workTime(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const workersA = n(parameters, "workerRatioA");
  const workersB = n(parameters, "workerRatioB");
  const efficiencyA = n(parameters, "efficiencyRatioA");
  const efficiencyB = n(parameters, "efficiencyRatioB");
  const workA = n(parameters, "workRatioA");
  const workB = n(parameters, "workRatioB");
  const rateA = workersA * efficiencyA;
  const rateB = workersB * efficiencyB;
  const rawA = workA * rateB;
  const rawB = workB * rateA;
  const final = answer(solver);
  return result(parameters, [
    "Team rate equals number of workers multiplied by efficiency.",
    line("Team A rate", `${workersA}\\times${efficiencyA}=${rateA}`),
    line("Team B rate", `${workersB}\\times${efficiencyB}=${rateB}`),
    line("Time equals work divided by rate.", `\\frac{${workA}}{${rateA}}:\\frac{${workB}}{${rateB}}`),
    line("Clear denominators and reduce.", `${rawA}:${rawB}=${final}`),
    "A larger work amount increases time, while a larger rate decreases it.",
    `So, the required time ratio is ${final}.`,
  ]);
}

function outputRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const machinesA = n(parameters, "machineRatioA");
  const machinesB = n(parameters, "machineRatioB");
  const timeA = n(parameters, "timeRatioA");
  const timeB = n(parameters, "timeRatioB");
  const efficiencyA = n(parameters, "efficiencyRatioA");
  const efficiencyB = n(parameters, "efficiencyRatioB");
  const outputA = machinesA * timeA * efficiencyA;
  const outputB = machinesB * timeB * efficiencyB;
  const final = answer(solver);
  return result(parameters, [
    "Output equals units multiplied by efficiency and time.",
    line("First output factor", `${machinesA}\\times${efficiencyA}\\times${timeA}=${outputA}`),
    line("Second output factor", `${machinesB}\\times${efficiencyB}\\times${timeB}=${outputB}`),
    line("Form the output ratio.", `${outputA}:${outputB}`),
    line("Reduce the ratio.", `${outputA}:${outputB}=${final}`),
    "All three factors must be included before comparison.",
    `So, the output ratio is ${final}.`,
  ]);
}

function missingRate(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const outputA = n(parameters, "outputRatioA");
  const outputB = n(parameters, "outputRatioB");
  const timeA = n(parameters, "timeRatioA");
  const timeB = n(parameters, "timeRatioB");
  const rawA = outputA * timeB;
  const rawB = outputB * timeA;
  const final = answer(solver);
  return result(parameters, [
    "Rate equals output divided by working time.",
    line("First rate part", `\\frac{${outputA}}{${timeA}}`),
    line("Second rate part", `\\frac{${outputB}}{${timeB}}`),
    line("Clear the denominators.", `${outputA}\\times${timeB}:${outputB}\\times${timeA}`),
    line("Evaluate and reduce.", `${rawA}:${rawB}=${final}`),
    "A unit producing more output in less time has the greater rate.",
    `So, the rate ratio is ${final}.`,
  ]);
}

function timeSaved(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const oldSpeed = n(parameters, "speedRatioA");
  const newSpeed = n(parameters, "speedRatioB");
  const oldTime = n(parameters, "oldTime");
  const newTime = oldTime * oldSpeed / newSpeed;
  const final = answer(solver);
  return result(parameters, [
    "For the same distance, speed and time are inversely proportional.",
    line("Use old speed × old time = new speed × new time.", `${oldSpeed}\\times${oldTime}=${newSpeed}t`),
    line("Solve for the new time.", `t=${oldTime}\\times\\frac{${oldSpeed}}{${newSpeed}}=${newTime}`),
    line("Time saved equals old time minus new time.", `${oldTime}-${newTime}=${final}`),
    "The higher speed reduces travel time for the same distance.",
    "Both times are measured in hours.",
    `So, the time saved is ${final} hours.`,
  ]);
}

function slowerDistance(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const track = n(parameters, "trackDistance");
  const speedA = n(parameters, "speedRatioA");
  const speedB = n(parameters, "speedRatioB");
  const distance = track * speedB / speedA;
  const final = answer(solver);
  return result(parameters, [
    "Both runners move for the same time until the faster runner finishes.",
    line("Distance ratio equals speed ratio.", `${speedA}:${speedB}`),
    line("The faster runner covers the full race length.", `${track}`),
    line("The slower runner's distance is", `${track}\\times\\frac{${speedB}}{${speedA}}=${distance}`),
    line("This equals the required distance.", `${distance}=${final}`),
    "The common elapsed time cancels from both distances.",
    `So, the slower runner covers ${final} metres.`,
  ]);
}

function absoluteOutput(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const factorA = n(parameters, "rateRatioA") * n(parameters, "timeRatioA") * n(parameters, "unitRatioA");
  const factorB = n(parameters, "rateRatioB") * n(parameters, "timeRatioB") * n(parameters, "unitRatioB");
  const outputA = n(parameters, "outputA");
  const final = answer(solver);
  return result(parameters, [
    "Output is proportional to rate × time × number of units.",
    line("Unit A's output factor", `${n(parameters, "rateRatioA")}\\times${n(parameters, "timeRatioA")}\\times${n(parameters, "unitRatioA")}=${factorA}`),
    line("Unit B's output factor", `${n(parameters, "rateRatioB")}\\times${n(parameters, "timeRatioB")}\\times${n(parameters, "unitRatioB")}=${factorB}`),
    line("Scale B's output from A's known output.", `${outputA}\\times\\frac{${factorB}}{${factorA}}`),
    line("Evaluating gives", `${outputA}\\times\\frac{${factorB}}{${factorA}}=${final}`),
    "The same output unit is used for both units.",
    `So, Unit B produces ${final} items.`,
  ]);
}

function relativeSpeed(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const lead = n(parameters, "leadDistance");
  const seconds = n(parameters, "overtakeTime");
  const mps = lead / seconds;
  const final = answer(solver);
  return result(parameters, [
    "Relative speed equals the closed distance divided by overtaking time.",
    line("Relative speed in metres per second", `\\frac{${lead}}{${seconds}}=${mps}\\text{ m/s}`),
    line("Convert metres per second to kilometres per hour.", `${mps}\\times\\frac{18}{5}`),
    line("Evaluate the conversion.", `${mps}\\times\\frac{18}{5}=${final}`),
    "The lead distance is the relative distance closed.",
    "The overtaking time is already in seconds.",
    `So, the relative speed is ${final} km/h.`,
  ]);
}

export function renderRap003RateExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "sdtTimeRatioFromSpeedDistance": return ratioRelation(parameters, solver, "time");
    case "sdtDistanceRatioFromSpeedTime": return ratioRelation(parameters, solver, "distance");
    case "sdtSpeedRatioFromDistanceTime": return ratioRelation(parameters, solver, "speed");
    case "sdtRaceLead": return raceLead(parameters, solver);
    case "sdtOvertakeTime": return explanation;
    case "fixedDistanceSpeedTimeInverse": return simpleInverse(parameters, solver, "speedRatioA", "speedRatioB", "distance");
    case "fixedTimeSpeedDistanceDirect": return fixedTime(parameters, solver);
    case "sdtRaceLeadSpeedRatio": return leadToSpeedRatio(parameters, solver);
    case "sdtRaceLeadTime": return timeToSpeedRatio(parameters, solver);
    case "sdtOppositeDirectionMeeting": return meeting(parameters, solver);
    case "trainPlatformRatio": return crossingPoint(parameters, solver);
    case "workEfficiencyTimeRatio":
    case "sameWorkTwoTeams": return workTime(parameters, solver);
    case "machinesOutputTime":
    case "workersEfficiencyDays": return outputRatio(parameters, solver);
    case "pipesTimeRatio": return simpleInverse(parameters, solver, "speedRatioA", "speedRatioB", "tank");
    case "findMissingRateFromOutput": return missingRate(parameters, solver);
    case "timeSavedByHigherSpeed": return timeSaved(parameters, solver);
    case "distanceSlowerCoversWhenFasterFinishes": return slowerDistance(parameters, solver);
    case "rateProductAbsoluteOutput": return absoluteOutput(parameters, solver);
    case "relativeSpeedRatioFromOvertake": return relativeSpeed(parameters, solver);
    default: return explanation;
  }
}
