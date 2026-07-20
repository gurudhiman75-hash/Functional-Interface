import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

function n(parameters: Rap003Parameters, key: string) {
  return Number(parameters.variables[key]);
}

function s(parameters: Rap003Parameters, key: string, fallback: string) {
  return String(parameters.variables[key] ?? fallback);
}

function cleanAnswer(solver: Rap003SolverResult) {
  return String(solver.answer).replaceAll("$$", "").trim();
}

function shown(value: number) {
  const rounded = Math.round(value * 10000) / 10000;
  return String(rounded);
}

function line(text: string, math?: string) {
  return math ? `${text}\n\n$$\\Rightarrow ${math}$$` : text;
}

function result(parameters: Rap003Parameters, lines: string[]): Rap003Explanation {
  return { explanationId: parameters.explanationId, lines };
}

function targetDetails(parameters: Rap003Parameters) {
  const personA = s(parameters, "personA", "the first person");
  const personB = s(parameters, "personB", "the second person");
  const personC = s(parameters, "personC", "the third person");
  const target = s(parameters, "targetPerson", personA);
  const ratioA = n(parameters, "ratioA");
  const ratioB = n(parameters, "ratioB");
  const ratioC = n(parameters, "ratioC");
  const targetPart = target === personB ? ratioB : target === personC ? ratioC : ratioA;
  return { personA, personB, personC, target, targetPart, ratioA, ratioB, ratioC };
}

function presentFromShiftedRatio(parameters: Rap003Parameters, solver: Rap003SolverResult, direction: "future" | "past") {
  const { personA, personB, target, targetPart, ratioA, ratioB } = targetDetails(parameters);
  const shift = n(parameters, "shiftYears");
  const shiftedA = n(parameters, direction === "future" ? "futureRatioA" : "pastRatioA");
  const shiftedB = n(parameters, direction === "future" ? "futureRatioB" : "pastRatioB");
  const unit = Number(solver.workingValues.unit);
  const sign = direction === "future" ? "+" : "-";
  const word = direction === "future" ? "after" : "ago";
  const answer = cleanAnswer(solver);
  return result(parameters, [
    line("Let the present ages be the given ratio multiplied by x.", `${personA}:${personB}=${ratioA}x:${ratioB}x`),
    `Apply the same ${shift}-year shift to both ages.`,
    line(`Their ages ${word} ${shift} years satisfy`, `\\frac{${ratioA}x${sign}${shift}}{${ratioB}x${sign}${shift}}=\\frac{${shiftedA}}{${shiftedB}}`),
    line("Cross-multiply the two fractions.", `${shiftedB}(${ratioA}x${sign}${shift})=${shiftedA}(${ratioB}x${sign}${shift})`),
    line("Solving gives the value of one present-age ratio part.", `x=${shown(unit)}`),
    line(`${target}'s present age is`, `${targetPart}\\times${shown(unit)}=${answer}`),
    `So, ${target}'s present age is ${answer} years.`,
  ]);
}

function yearsToRatio(parameters: Rap003Parameters, solver: Rap003SolverResult, direction: "future" | "past") {
  const personA = s(parameters, "personA", "the first person");
  const personB = s(parameters, "personB", "the second person");
  const ageA = n(parameters, "presentAgeA");
  const ageB = n(parameters, "presentAgeB");
  const targetA = n(parameters, direction === "future" ? "futureRatioA" : "pastRatioA");
  const targetB = n(parameters, direction === "future" ? "futureRatioB" : "pastRatioB");
  const sign = direction === "future" ? "+" : "-";
  const answer = cleanAnswer(solver);
  const years = Number(solver.answerValue);
  const shiftedAgeA = direction === "future" ? ageA + years : ageA - years;
  const shiftedAgeB = direction === "future" ? ageB + years : ageB - years;
  const phrase = direction === "future" ? "from now" : "ago";
  return result(parameters, [
    `Let the required number of years be y.`,
    line(`Apply y to both present ages in the same direction.`, `${personA}: ${ageA}${sign}y,\\quad ${personB}: ${ageB}${sign}y`),
    line("Use the required age ratio.", `\\frac{${ageA}${sign}y}{${ageB}${sign}y}=\\frac{${targetA}}{${targetB}}`),
    line("Cross-multiply.", `${targetB}(${ageA}${sign}y)=${targetA}(${ageB}${sign}y)`),
    line("Solve the resulting linear equation.", `y=${answer}`),
    line("Check the shifted ages.", `${shown(shiftedAgeA)}:${shown(shiftedAgeB)}=${targetA}:${targetB}`),
    `So, the required ratio occurs ${answer} years ${phrase}.`,
  ]);
}

function fromDifference(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB, target, targetPart, ratioA, ratioB } = targetDetails(parameters);
  const difference = n(parameters, "ageDifference");
  const unit = Number(solver.workingValues.unit);
  const answer = cleanAnswer(solver);
  return result(parameters, [
    line("Let the present ages follow the given ratio.", `${personA}:${personB}=${ratioA}x:${ratioB}x`),
    line("Their age difference equals the difference of the ratio parts.", `(${ratioA}-${ratioB})x=${difference}`),
    line("The ratio-part difference is", `${ratioA}-${ratioB}=${ratioA - ratioB}`),
    line("Therefore, one ratio part is", `x=\\frac{${difference}}{${ratioA - ratioB}}=${shown(unit)}`),
    line(`${target}'s age corresponds to ${targetPart} parts.`, `${targetPart}\\times${shown(unit)}=${answer}`),
    `The two calculated ages differ by ${difference} years, as required.`,
    `So, ${target}'s present age is ${answer} years.`,
  ]);
}

function fromSum(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB, target, targetPart, ratioA, ratioB } = targetDetails(parameters);
  const sum = n(parameters, "ageSum");
  const unit = Number(solver.workingValues.unit);
  const answer = cleanAnswer(solver);
  return result(parameters, [
    line("Let the present ages follow the given ratio.", `${personA}:${personB}=${ratioA}x:${ratioB}x`),
    line("Add the two age expressions.", `(${ratioA}+${ratioB})x=${sum}`),
    line("The total number of ratio parts is", `${ratioA}+${ratioB}=${ratioA + ratioB}`),
    line("So, one ratio part is", `x=\\frac{${sum}}{${ratioA + ratioB}}=${shown(unit)}`),
    line(`${target}'s age is`, `${targetPart}\\times${shown(unit)}=${answer}`),
    `The calculated ages add to ${sum} years.`,
    `So, ${target}'s present age is ${answer} years.`,
  ]);
}

function shiftedRatioFromPresent(parameters: Rap003Parameters, solver: Rap003SolverResult, direction: "future" | "past") {
  const personA = s(parameters, "personA", "the first person");
  const personB = s(parameters, "personB", "the second person");
  const ageA = n(parameters, "presentAgeA");
  const ageB = n(parameters, "presentAgeB");
  const shift = n(parameters, "shiftYears");
  const shiftedA = direction === "future" ? ageA + shift : ageA - shift;
  const shiftedB = direction === "future" ? ageB + shift : ageB - shift;
  const sign = direction === "future" ? "+" : "-";
  const phrase = direction === "future" ? `after ${shift} years` : `${shift} years ago`;
  const answer = cleanAnswer(solver);
  return result(parameters, [
    line("Write the present ages.", `${personA}:${personB}=${ageA}:${ageB}`),
    `Apply the same ${shift}-year ${direction === "future" ? "increase" : "decrease"} to both ages.`,
    line(`${personA}'s shifted age is`, `${ageA}${sign}${shift}=${shiftedA}`),
    line(`${personB}'s shifted age is`, `${ageB}${sign}${shift}=${shiftedB}`),
    line("Form the ratio of the shifted ages.", `${shiftedA}:${shiftedB}`),
    line("Reduce the ratio to lowest terms.", `${shiftedA}:${shiftedB}=${answer}`),
    `So, their age ratio ${phrase} is ${answer}.`,
  ]);
}

function threePersonSum(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB, personC, target, targetPart, ratioA, ratioB, ratioC } = targetDetails(parameters);
  const sum = n(parameters, "ageSum");
  const ratioSum = ratioA + ratioB + ratioC;
  const unit = Number(solver.workingValues.unit);
  const answer = cleanAnswer(solver);
  return result(parameters, [
    line("Let the three ages be the ratio parts multiplied by x.", `${personA}:${personB}:${personC}=${ratioA}x:${ratioB}x:${ratioC}x`),
    line("Add the three age expressions.", `(${ratioA}+${ratioB}+${ratioC})x=${sum}`),
    line("The total ratio contains", `${ratioSum}\\text{ parts}`),
    line("One ratio part is", `x=\\frac{${sum}}{${ratioSum}}=${shown(unit)}`),
    line(`${target}'s age is`, `${targetPart}\\times${shown(unit)}=${answer}`),
    `The three calculated ages add to ${sum} years.`,
    `So, ${target}'s present age is ${answer} years.`,
  ]);
}

function threePersonKnown(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB, personC, target, targetPart, ratioA, ratioB, ratioC } = targetDetails(parameters);
  const known = s(parameters, "knownPerson", personC);
  const knownAge = n(parameters, "knownAge");
  const knownPart = known === personA ? ratioA : known === personB ? ratioB : ratioC;
  const unit = Number(solver.workingValues.unit);
  const answer = cleanAnswer(solver);
  return result(parameters, [
    line("Write the three-age ratio.", `${personA}:${personB}:${personC}=${ratioA}:${ratioB}:${ratioC}`),
    `${known}'s age fixes the value of one ratio part.`,
    line(`${known} represents ${knownPart} parts.`, `${knownPart}x=${knownAge}`),
    line("Therefore, one ratio part is", `x=\\frac{${knownAge}}{${knownPart}}=${shown(unit)}`),
    line(`${target} represents ${targetPart} parts.`, `${targetPart}\\times${shown(unit)}=${answer}`),
    `The calculated age of ${known} remains ${knownAge} years.`,
    `So, ${target}'s present age is ${answer} years.`,
  ]);
}

function fromAverage(parameters: Rap003Parameters, solver: Rap003SolverResult, count: 2 | 3) {
  const { personA, personB, personC, target, targetPart, ratioA, ratioB, ratioC } = targetDetails(parameters);
  const average = n(parameters, "averageAge");
  const sum = average * count;
  const ratioSum = count === 2 ? ratioA + ratioB : ratioA + ratioB + ratioC;
  const unit = Number(solver.workingValues.unit);
  const answer = cleanAnswer(solver);
  const ratioText = count === 2 ? `${personA}:${personB}=${ratioA}:${ratioB}` : `${personA}:${personB}:${personC}=${ratioA}:${ratioB}:${ratioC}`;
  return result(parameters, [
    line("Convert the average age into the total age.", `${average}\\times${count}=${sum}`),
    line("Write the given age ratio.", ratioText),
    line("Add the ratio parts.", `${ratioSum}\\text{ parts}`),
    line("Find one ratio part.", `x=\\frac{${sum}}{${ratioSum}}=${shown(unit)}`),
    line(`${target}'s age is`, `${targetPart}\\times${shown(unit)}=${answer}`),
    `The resulting ages have average ${average} years.`,
    `So, ${target}'s present age is ${answer} years.`,
  ]);
}

function shiftedSum(parameters: Rap003Parameters, solver: Rap003SolverResult, direction: "future" | "past") {
  const { personA, personB, target, targetPart, ratioA, ratioB } = targetDetails(parameters);
  const shift = n(parameters, "shiftYears");
  const sum = n(parameters, direction === "future" ? "futureSum" : "pastSum");
  const sign = direction === "future" ? "+" : "-";
  const unit = Number(solver.workingValues.unit);
  const answer = cleanAnswer(solver);
  return result(parameters, [
    line("Let the present ages follow the stated ratio.", `${personA}:${personB}=${ratioA}x:${ratioB}x`),
    `Both ages change by ${shift} years.`,
    line(`Their ${direction} total is`, `(${ratioA}+${ratioB})x${sign}2\\times${shift}=${sum}`),
    line("Solve for one present-age ratio part.", `x=${shown(unit)}`),
    line(`${target}'s present age is`, `${targetPart}\\times${shown(unit)}=${answer}`),
    `Substitution reproduces the stated ${direction} total of ${sum} years.`,
    `So, ${target}'s present age is ${answer} years.`,
  ]);
}

function doubleWording(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB, target, targetPart, ratioA, ratioB } = targetDetails(parameters);
  const shift = n(parameters, "shiftYears");
  const factor = n(parameters, "relationFactor");
  const unit = Number(solver.workingValues.unit);
  const answer = cleanAnswer(solver);
  return result(parameters, [
    line("Let the present ages follow the given ratio.", `${personA}:${personB}=${ratioA}x:${ratioB}x`),
    `After ${shift} years, ${personA} is ${factor} times ${personB}'s age.`,
    line("Translate that statement into an equation.", `${ratioA}x+${shift}=${factor}(${ratioB}x+${shift})`),
    line("Solve for one present-age ratio part.", `x=${shown(unit)}`),
    line(`${target}'s present age is`, `${targetPart}\\times${shown(unit)}=${answer}`),
    `The future ages satisfy the stated ${factor}:1 relation.`,
    `So, ${target}'s present age is ${answer} years.`,
  ]);
}

export function renderRap003AgeExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "agePresentFromFutureRatio": return presentFromShiftedRatio(parameters, solver, "future");
    case "agePresentFromPastRatio": return presentFromShiftedRatio(parameters, solver, "past");
    case "ageYearsToReachRatio": return yearsToRatio(parameters, solver, "future");
    case "ageYearsToReachPastRatio": return yearsToRatio(parameters, solver, "past");
    case "ageFromDifferenceAndRatio": return fromDifference(parameters, solver);
    case "ageFromSumAndRatio": return fromSum(parameters, solver);
    case "ageFutureRatioFromPresent": return shiftedRatioFromPresent(parameters, solver, "future");
    case "agePastRatioFromPresent": return shiftedRatioFromPresent(parameters, solver, "past");
    case "ageThreePersonSumRatio": return threePersonSum(parameters, solver);
    case "ageThreePersonKnownAge": return threePersonKnown(parameters, solver);
    case "ageAverageAndRatio": return fromAverage(parameters, solver, 2);
    case "ageAverageThreePersonRatio": return fromAverage(parameters, solver, 3);
    case "ageFutureSumAndPresentRatio": return shiftedSum(parameters, solver, "future");
    case "agePastSumAndPresentRatio": return shiftedSum(parameters, solver, "past");
    case "ageDoubleHalfWording": return doubleWording(parameters, solver);
    default: return explanation;
  }
}
