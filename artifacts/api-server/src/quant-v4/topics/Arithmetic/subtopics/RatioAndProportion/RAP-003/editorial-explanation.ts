import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

function n(parameters: Rap003Parameters, key: string) {
  return Number(parameters.variables[key]);
}

function s(parameters: Rap003Parameters, key: string, fallback: string) {
  return String(parameters.variables[key] ?? fallback);
}

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

function shown(value: number) {
  const rounded = Math.round(value * 10000) / 10000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function line(narrative: string, math?: string) {
  return math ? `${narrative}\n\n$$\\Rightarrow ${math}$$` : narrative;
}

function domain(parameters: Rap003Parameters) {
  const task = parameters.taskKind;
  if (task.startsWith("partnership") || task === "workContributionShare") return "partnership";
  if (task.startsWith("age")) return "age";
  if (/income|expenditure|expense|savings|salarySpending|shopRevenue|pocketMoney|familyIncome|givenOneSaves|givenOneSpends|equalIncome|equalExpense/.test(task)) return "income";
  if (/alloy|weightedAverage|averagePrice|mixingRatio|marksAverage|reverseWeighted|weightedProfit|weightedDiscount|sugarSolution/.test(task)) return "mixture";
  if (task.startsWith("replacement")) return "replacement";
  if (/denomination|ticketValue|marksPerQuestion/.test(task)) return "denomination";
  if (/^sdt|fixedDistance|fixedTime|trainPlatform|workEfficiency|machinesOutput|pipesTime|workersEfficiency|findMissingRate|timeSaved|distanceSlower|sameWork|rateProduct|relativeSpeed/.test(task)) return "rate";
  if (task.startsWith("population")) return "population";
  if (/^election|marketShare|surveyResponse/.test(task)) return "election";
  if (/^geometric|^mapScale|similarSolid/.test(task)) return "geometry";
  return "ratio";
}

function opening(parameters: Rap003Parameters) {
  switch (domain(parameters)) {
    case "partnership": return "Profit or loss is shared in the ratio of each partner's capital multiplied by time.";
    case "age": return "The same time shift must be applied to every person's age.";
    case "income": return "Write income, expenditure, and savings with separate ratio multipliers.";
    case "mixture": return "Use component amounts or weighted totals rather than comparing the percentages alone.";
    case "replacement": return "After each replacement, only a fixed fraction of the original quantity remains.";
    case "denomination": return "Let the counts follow the given ratio and convert each count into value.";
    case "rate": return "Use distance = speed × time, with all quantities in compatible units.";
    case "population": return "Split the population into the required groups before selecting the requested cell.";
    case "election": return "Work through electorate, polled votes, valid votes, and candidate shares in order.";
    case "geometry": return "Use the correct power of the linear ratio: square for area and cube for volume.";
    default: return "Translate the stated ratios into one common mathematical relation.";
  }
}

function method(parameters: Rap003Parameters) {
  switch (domain(parameters)) {
    case "partnership": return "First calculate the effective contribution of each partner, then divide the distributable amount.";
    case "age": return "Form one equation from the required age ratio and solve for the common number of years.";
    case "income": return "Use savings = income − expenditure for each person or group.";
    case "mixture": return "Multiply each quantity by its component fraction, then equate the combined component amount to the target.";
    case "replacement": return "Raise the retention fraction to the number of replacement rounds.";
    case "denomination": return "The value of one ratio unit is found from the weighted sum of denominations.";
    case "rate": return "Choose direct or inverse variation according to which product is fixed.";
    case "population": return "Calculate row totals first and then apply the within-row ratio.";
    case "election": return "Reverse each percentage carefully when the total electorate is unknown.";
    case "geometry": return "Convert the given area or volume ratio back to the requested dimension when necessary.";
    default: return "Substitute the stated values and simplify the resulting equation.";
  }
}

function humanKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .toLowerCase();
}

function workingLine(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const entries = Object.entries(solver.workingValues)
    .filter(([key, value]) => key !== "setup" && key !== "result" && key !== "targetPartner" && key !== "targetPerson" && value !== "")
    .slice(0, 2);
  if (!entries.length) return line("Substituting the given values gives", solver.mathJax.calculationLatex || cleanAnswer(solver.answer));
  const prose = entries.map(([key, value]) => `${humanKey(key)} = ${String(value)}`).join(" and ");
  return `From the given values, ${prose}.`;
}

function calculationLine(solver: Rap003SolverResult) {
  const math = String(solver.mathJax.calculationLatex ?? "").trim();
  return line("Now substitute and simplify.", math || cleanAnswer(solver.answer));
}

function finalLine(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const answer = cleanAnswer(solver.answer);
  const task = parameters.taskKind;
  if (task.startsWith("partnership")) {
    const partner = s(parameters, "targetPartner", s(parameters, "personA", "the required partner"));
    if (solver.answerType === "RATIO") return `So, the required partnership ratio is ${answer}.`;
    if (solver.answerType === "TIME") return `So, the required partnership time is ${answer} months.`;
    return `So, ${partner}'s required share is ${answer}.`;
  }
  if (task.startsWith("age")) {
    if (solver.answerType === "TIME") return `So, the required time is ${answer} years.`;
    const person = s(parameters, "targetPerson", "the required person");
    return `So, ${person}'s age is ${answer} years.`;
  }
  if (domain(parameters) === "election") {
    if (solver.answerType === "PERCENT") return `So, the required percentage is ${answer}.`;
    if (solver.answerType === "RATIO") return `So, the required vote ratio is ${answer}.`;
    return `So, the required number of votes or voters is ${answer}.`;
  }
  if (domain(parameters) === "population") {
    if (solver.answerType === "PERCENT") return `So, the required population percentage is ${answer}.`;
    if (solver.answerType === "RATIO") return `So, the required population ratio is ${answer}.`;
    return `So, the required population count is ${answer}.`;
  }
  if (domain(parameters) === "rate") {
    if (solver.answerType === "TIME") return `So, the required time is ${answer}.`;
    if (solver.answerType === "RATIO") return `So, the required ratio is ${answer}.`;
    return `So, the required distance, speed, work, or output is ${answer}.`;
  }
  if (domain(parameters) === "denomination") {
    if (solver.answerType === "COUNT") return `So, the required number of coins or items is ${answer}.`;
    if (solver.answerType === "RATIO") return `So, the required value ratio is ${answer}.`;
    return `So, the required total value is ${answer}.`;
  }
  if (domain(parameters) === "geometry") return `So, the required geometric ratio is ${answer}.`;
  if (solver.answerType === "PERCENT") return `So, the required percentage is ${answer}.`;
  if (solver.answerType === "RATIO") return `So, the required ratio is ${answer}.`;
  return `So, the required value is ${answer}.`;
}

function salaryPartnership(parameters: Rap003Parameters, solver: Rap003SolverResult): Rap003Explanation {
  const personA = s(parameters, "personA", "Partner A");
  const personB = s(parameters, "personB", "Partner B");
  const target = s(parameters, "targetPartner", personA);
  const salaryPartner = s(parameters, "salaryPartner", personA);
  const productA = n(parameters, "investmentA") * n(parameters, "timeA");
  const productB = n(parameters, "investmentB") * n(parameters, "timeB");
  const totalProduct = productA + productB;
  const salary = n(parameters, "salaryAmount");
  const remaining = n(parameters, "totalProfit") - salary;
  const targetProduct = target === personB ? productB : productA;
  const baseShare = remaining * targetProduct / totalProduct;
  const salaryExtra = target === salaryPartner ? salary : 0;
  const answer = cleanAnswer(solver.answer);
  return {
    explanationId: solver.answer ? parameters.explanationId : parameters.explanationId,
    lines: [
      line("Calculate each partner's investment-time product.", `${personA}: ${n(parameters, "investmentA")}\\times${n(parameters, "timeA")}=${shown(productA)},\\quad ${personB}: ${n(parameters, "investmentB")}\\times${n(parameters, "timeB")}=${shown(productB)}`),
      line("Their profit-sharing ratio is therefore", `${shown(productA)}:${shown(productB)}`),
      line(`Pay the management salary of ${salary} first.`, `${n(parameters, "totalProfit")}-${salary}=${shown(remaining)}`),
      line(`${target}'s share of the remaining profit is`, `${shown(remaining)}\\times\\frac{${shown(targetProduct)}}{${shown(totalProduct)}}=${shown(baseShare)}`),
      salaryExtra ? line(`${target} also receives the management salary.`, `${shown(baseShare)}+${salaryExtra}=${answer}`) : line(`${target} does not receive the management salary.`, `${shown(baseShare)}=${answer}`),
      `The salary is added only after the remaining profit has been divided.`,
      `So, ${target}'s final share is ${answer}.`,
    ],
  };
}

function pastAgeRatio(parameters: Rap003Parameters, solver: Rap003SolverResult): Rap003Explanation {
  const personA = s(parameters, "personA", "the first person");
  const personB = s(parameters, "personB", "the second person");
  const ageA = n(parameters, "presentAgeA");
  const ageB = n(parameters, "presentAgeB");
  const ratioA = n(parameters, "pastRatioA");
  const ratioB = n(parameters, "pastRatioB");
  const years = Number(solver.answerValue);
  const answer = cleanAnswer(solver.answer);
  return {
    explanationId: parameters.explanationId,
    lines: [
      `Let the required number of years ago be y.`,
      line(`Their ages y years ago were`, `${personA}: ${ageA}-y,\\quad ${personB}: ${ageB}-y`),
      line("Use the required past-age ratio.", `\\frac{${ageA}-y}{${ageB}-y}=\\frac{${ratioA}}{${ratioB}}`),
      line("Cross-multiply.", `${ratioB}(${ageA}-y)=${ratioA}(${ageB}-y)`),
      line("Solving the linear equation gives", `y=${answer}`),
      line("Check the past ages.", `${ageA}-${shown(years)}:${ageB}-${shown(years)}=${shown(ageA - years)}:${shown(ageB - years)}=${ratioA}:${ratioB}`),
      `So, their ages were in the required ratio ${answer} years ago.`,
    ],
  };
}

function overtakeTime(parameters: Rap003Parameters, solver: Rap003SolverResult): Rap003Explanation {
  const objectA = s(parameters, "objectA", "the faster object");
  const objectB = s(parameters, "objectB", "the slower object");
  const speedA = n(parameters, "speedA");
  const speedB = n(parameters, "speedB");
  const lead = n(parameters, "leadDistance");
  const relativeKmh = speedA - speedB;
  const relativeMps = relativeKmh * 5 / 18;
  const seconds = lead / relativeMps;
  const answer = cleanAnswer(solver.answer);
  return {
    explanationId: parameters.explanationId,
    lines: [
      `${objectA} gains on ${objectB} at their relative speed.`,
      line("Relative speed in km/h is", `${speedA}-${speedB}=${relativeKmh}`),
      line("Convert the relative speed to metres per second.", `${relativeKmh}\\times\\frac{5}{18}=${shown(relativeMps)}\\text{ m/s}`),
      line("Time equals lead distance divided by relative speed.", `t=\\frac{${lead}}{${shown(relativeMps)}}`),
      line("Substituting the values gives", `t=${shown(seconds)}\\text{ seconds}`),
      `At this time, the faster object has covered exactly the ${lead}-metre lead.`,
      `So, ${objectA} overtakes ${objectB} in ${answer} seconds.`,
    ],
  };
}

function electorateFromCandidateVotes(parameters: Rap003Parameters, solver: Rap003SolverResult): Rap003Explanation {
  const candidate = s(parameters, "candidateA", "the candidate");
  const votes = n(parameters, "candidateVotes");
  const ratioA = n(parameters, "candidateRatioA");
  const ratioB = n(parameters, "candidateRatioB");
  const validPercent = n(parameters, "validPercent");
  const turnout = n(parameters, "turnoutPercent");
  const ratioSum = ratioA + ratioB;
  const validVotes = votes * ratioSum / ratioA;
  const polledVotes = validVotes * 100 / validPercent;
  const electorate = polledVotes * 100 / turnout;
  const answer = cleanAnswer(solver.answer);
  return {
    explanationId: parameters.explanationId,
    lines: [
      line(`${candidate}'s ${votes} votes represent ${ratioA} of the ${ratioSum} valid-vote parts.`, `\\text{valid votes}=${votes}\\times\\frac{${ratioSum}}{${ratioA}}=${shown(validVotes)}`),
      `These are ${validPercent}% of the polled votes.`,
      line("Reverse the valid-vote percentage.", `\\text{polled votes}=${shown(validVotes)}\\times\\frac{100}{${validPercent}}=${shown(polledVotes)}`),
      `The polled votes are ${turnout}% of the total electorate.`,
      line("Reverse the turnout percentage.", `\\text{total voters}=${shown(polledVotes)}\\times\\frac{100}{${turnout}}=${shown(electorate)}`),
      line("The full chain is", `${votes}\\rightarrow${shown(validVotes)}\\rightarrow${shown(polledVotes)}\\rightarrow${shown(electorate)}`),
      `So, the total number of voters is ${answer}.`,
    ],
  };
}

function genericEditorial(parameters: Rap003Parameters, solver: Rap003SolverResult, explanation: Rap003Explanation): Rap003Explanation {
  const original = explanation.lines.filter(Boolean);
  const middle = original.slice(2, -1).slice(0, 3);
  const lines = [
    opening(parameters),
    method(parameters),
    ...middle,
    workingLine(parameters, solver),
    calculationLine(solver),
    finalLine(parameters, solver),
  ];
  const deduped: string[] = [];
  for (const item of lines) {
    const key = item.replace(/\s+/g, " ").trim().toLowerCase();
    if (!key || deduped.some((existing) => existing.replace(/\s+/g, " ").trim().toLowerCase() === key)) continue;
    deduped.push(item);
  }
  while (deduped.length < 7) {
    deduped.splice(deduped.length - 1, 0, line("The substituted values satisfy the relation in the question.", solver.mathJax.calculationLatex || cleanAnswer(solver.answer)));
  }
  return { ...explanation, lines: deduped.slice(0, 7) };
}

export function renderRap003EditorialExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "partnershipSalaryThenProfitShare": return salaryPartnership(parameters, solver);
    case "ageYearsToReachPastRatio": return pastAgeRatio(parameters, solver);
    case "sdtOvertakeTime": return overtakeTime(parameters, solver);
    case "electionTotalElectorateFromCandidateVotes": return electorateFromCandidateVotes(parameters, solver);
    default: return genericEditorial(parameters, solver, explanation);
  }
}
