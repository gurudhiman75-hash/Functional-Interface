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

function shown(value: number) {
  return String(Math.round(value * 100) / 100);
}

function line(text: string, math?: string) {
  return math ? `${text}\n\n$$\\Rightarrow ${math}$$` : text;
}

function packageResult(parameters: Rap003Parameters, lines: string[]): Rap003Explanation {
  return { explanationId: parameters.explanationId, lines };
}

function products(parameters: Rap003Parameters) {
  const personA = s(parameters, "personA", "Partner A");
  const personB = s(parameters, "personB", "Partner B");
  const productA = n(parameters, "investmentA") * n(parameters, "timeA");
  const productB = n(parameters, "investmentB") * n(parameters, "timeB");
  return { personA, personB, productA, productB, total: productA + productB };
}

function standardShare(parameters: Rap003Parameters, solver: Rap003SolverResult, amountKey: "totalProfit" | "totalLoss") {
  const { personA, personB, productA, productB, total } = products(parameters);
  const target = s(parameters, "targetPartner", personA);
  const targetProduct = target === personB ? productB : productA;
  const amount = n(parameters, amountKey);
  const result = answer(solver);
  const label = amountKey === "totalLoss" ? "loss" : "profit";
  return packageResult(parameters, [
    line("Calculate each investment-time product.", `${personA}: ${n(parameters, "investmentA")}\\times${n(parameters, "timeA")}=${productA},\\quad ${personB}: ${n(parameters, "investmentB")}\\times${n(parameters, "timeB")}=${productB}`),
    line(`The ${label}-sharing ratio is`, `${productA}:${productB}`),
    line("The total number of effective contribution units is", `${productA}+${productB}=${total}`),
    line(`${target}'s ${label} share is`, `${amount}\\times\\frac{${targetProduct}}{${total}}=${result}`),
    `So, ${target}'s ${label} share is ${result}.`,
  ]);
}

function midPeriodOne(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const personA = s(parameters, "personA", "Partner A");
  const personB = s(parameters, "personB", "Partner B");
  const productA = n(parameters, "initialInvestmentA") * n(parameters, "firstPeriod") + n(parameters, "changedInvestmentA") * n(parameters, "secondPeriod");
  const productB = n(parameters, "investmentB") * n(parameters, "timeB");
  const target = s(parameters, "targetPartner", personA);
  const targetProduct = target === personB ? productB : productA;
  const total = productA + productB;
  const result = answer(solver);
  return packageResult(parameters, [
    line(`${personA}'s capital changes during the year, so add the two investment-time products.`, `${n(parameters, "initialInvestmentA")}\\times${n(parameters, "firstPeriod")}+${n(parameters, "changedInvestmentA")}\\times${n(parameters, "secondPeriod")}=${productA}`),
    line(`${personB}'s investment-time product is`, `${n(parameters, "investmentB")}\\times${n(parameters, "timeB")}=${productB}`),
    line("Their effective contribution ratio is", `${productA}:${productB}`),
    line(`${target}'s profit share is`, `${n(parameters, "totalProfit")}\\times\\frac{${targetProduct}}{${total}}=${result}`),
    `So, ${target}'s share is ${result}.`,
  ]);
}

function midPeriodBoth(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const personA = s(parameters, "personA", "Partner A");
  const personB = s(parameters, "personB", "Partner B");
  const productA = n(parameters, "initialInvestmentA") * n(parameters, "firstPeriod") + n(parameters, "changedInvestmentA") * n(parameters, "secondPeriod");
  const productB = n(parameters, "initialInvestmentB") * n(parameters, "firstPeriod") + n(parameters, "changedInvestmentB") * n(parameters, "secondPeriod");
  const target = s(parameters, "targetPartner", personA);
  const targetProduct = target === personB ? productB : productA;
  const total = productA + productB;
  const result = answer(solver);
  return packageResult(parameters, [
    line(`${personA}'s combined investment-time product is`, `${n(parameters, "initialInvestmentA")}\\times${n(parameters, "firstPeriod")}+${n(parameters, "changedInvestmentA")}\\times${n(parameters, "secondPeriod")}=${productA}`),
    line(`${personB}'s combined investment-time product is`, `${n(parameters, "initialInvestmentB")}\\times${n(parameters, "firstPeriod")}+${n(parameters, "changedInvestmentB")}\\times${n(parameters, "secondPeriod")}=${productB}`),
    line("Their effective contribution ratio is", `${productA}:${productB}`),
    line(`${target}'s share is`, `${n(parameters, "totalProfit")}\\times\\frac{${targetProduct}}{${total}}=${result}`),
    `So, ${target}'s profit share is ${result}.`,
  ]);
}

function knownShare(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB, productA, productB, total } = products(parameters);
  const known = s(parameters, "knownPartner", personA);
  const knownProduct = known === personB ? productB : productA;
  const knownShare = n(parameters, "knownShare");
  const result = answer(solver);
  return packageResult(parameters, [
    line("Calculate the two investment-time products.", `${personA}: ${productA},\\quad ${personB}: ${productB}`),
    line("The total effective contribution is", `${productA}+${productB}=${total}`),
    line(`${known}'s fraction of the total profit is`, `\\frac{${knownProduct}}{${total}}`),
    line("Reverse that fraction to find the full profit.", `${knownShare}\\times\\frac{${total}}{${knownProduct}}=${result}`),
    `So, the total profit is ${result}.`,
  ]);
}

function capitalTimeRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const productA = n(parameters, "capitalRatioA") * n(parameters, "timeRatioA");
  const productB = n(parameters, "capitalRatioB") * n(parameters, "timeRatioB");
  const result = answer(solver);
  return packageResult(parameters, [
    "Multiply each capital part by its corresponding time part.",
    line("First effective contribution", `${n(parameters, "capitalRatioA")}\\times${n(parameters, "timeRatioA")}=${productA}`),
    line("Second effective contribution", `${n(parameters, "capitalRatioB")}\\times${n(parameters, "timeRatioB")}=${productB}`),
    line("Reduce the resulting ratio.", `${productA}:${productB}=${result}`),
    `So, the profit-sharing ratio is ${result}.`,
  ]);
}

function contributionRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const personA = s(parameters, "personA", "Worker A");
  const personB = s(parameters, "personB", "Worker B");
  const workA = n(parameters, "efficiencyRatioA") * n(parameters, "daysA");
  const workB = n(parameters, "efficiencyRatioB") * n(parameters, "daysB");
  const result = answer(solver);
  return packageResult(parameters, [
    "Work contribution equals efficiency multiplied by days worked.",
    line(`${personA}'s contribution`, `${n(parameters, "efficiencyRatioA")}\\times${n(parameters, "daysA")}=${workA}`),
    line(`${personB}'s contribution`, `${n(parameters, "efficiencyRatioB")}\\times${n(parameters, "daysB")}=${workB}`),
    line("Reduce the contribution ratio.", `${workA}:${workB}=${result}`),
    `So, their work contribution ratio is ${result}.`,
  ]);
}

function newPartnerCapital(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const personA = s(parameters, "personA", "Partner A");
  const personB = s(parameters, "personB", "Partner B");
  const productA = n(parameters, "investmentA") * n(parameters, "timeA");
  const result = answer(solver);
  return packageResult(parameters, [
    line(`${personA}'s investment-time product is`, `${n(parameters, "investmentA")}\\times${n(parameters, "timeA")}=${productA}`),
    line("Use the required profit ratio.", `\\frac{${productA}}{${personB}\\text{ capital}\\times${n(parameters, "timeB")}}=\\frac{${n(parameters, "profitRatioA")}}{${n(parameters, "profitRatioB")}}`),
    line("Cross-multiplying gives", `${personB}\\text{ capital}=\\frac{${productA}\\times${n(parameters, "profitRatioB")}}{${n(parameters, "profitRatioA")}\\times${n(parameters, "timeB")}}`),
    line("Evaluating the expression gives", `${personB}\\text{ capital}=${result}`),
    `So, ${personB} should invest ${result}.`,
  ]);
}

function timeFromRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const personA = s(parameters, "personA", "Partner A");
  const personB = s(parameters, "personB", "Partner B");
  const productA = n(parameters, "investmentA") * n(parameters, "timeA");
  const result = answer(solver);
  return packageResult(parameters, [
    line(`${personA}'s investment-time product is`, `${n(parameters, "investmentA")}\\times${n(parameters, "timeA")}=${productA}`),
    line("Let the second investment time be t months.", `\\frac{${productA}}{${n(parameters, "investmentB")}t}=\\frac{${n(parameters, "profitRatioA")}}{${n(parameters, "profitRatioB")}}`),
    line("Cross-multiply and solve for t.", `t=\\frac{${productA}\\times${n(parameters, "profitRatioB")}}{${n(parameters, "profitRatioA")}\\times${n(parameters, "investmentB")}}`),
    line("This gives", `t=${result}`),
    `So, ${personB} invested for ${result} months.`,
  ]);
}

function ratioShare(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const personA = s(parameters, "personA", "Partner A");
  const personB = s(parameters, "personB", "Partner B");
  const target = s(parameters, "targetPartner", personB);
  const ratioA = n(parameters, "effectiveRatioA");
  const ratioB = n(parameters, "effectiveRatioB");
  const targetPart = target === personA ? ratioA : ratioB;
  const result = answer(solver);
  return packageResult(parameters, [
    line("Add the effective ratio parts.", `${ratioA}+${ratioB}=${ratioA + ratioB}`),
    line(`${target}'s fraction of the profit is`, `\\frac{${targetPart}}{${ratioA + ratioB}}`),
    line("Multiply this fraction by the total profit.", `${n(parameters, "totalProfit")}\\times\\frac{${targetPart}}{${ratioA + ratioB}}=${result}`),
    `The remaining profit goes to the other partner.`,
    `So, ${target}'s share is ${result}.`,
  ]);
}

function afterCommission(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { personA, personB, productA, productB, total } = products(parameters);
  const target = s(parameters, "targetPartner", personA);
  const targetProduct = target === personB ? productB : productA;
  const remaining = n(parameters, "totalProfit") - n(parameters, "commission");
  const result = answer(solver);
  return packageResult(parameters, [
    line("Deduct the commission from the profit first.", `${n(parameters, "totalProfit")}-${n(parameters, "commission")}=${remaining}`),
    line("Calculate the investment-time products.", `${personA}: ${productA},\\quad ${personB}: ${productB}`),
    line("Their effective contribution ratio is", `${productA}:${productB}`),
    line(`${target}'s share of the remaining profit is`, `${remaining}\\times\\frac{${targetProduct}}{${total}}=${result}`),
    `So, ${target}'s share is ${result}.`,
  ]);
}

export function renderRap003PartnershipExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "partnershipProfitShare":
    case "partnershipJoiningPartnerProfit":
    case "partnershipLeavingPartnerProfit": return standardShare(parameters, solver, "totalProfit");
    case "partnershipLossShare": return standardShare(parameters, solver, "totalLoss");
    case "partnershipMidPeriodChange": return midPeriodOne(parameters, solver);
    case "partnershipMidPeriodChangeBoth": return midPeriodBoth(parameters, solver);
    case "partnershipProfitFromKnownShare": return knownShare(parameters, solver);
    case "partnershipCapitalRatioTimeRatio": return capitalTimeRatio(parameters, solver);
    case "workContributionShare": return contributionRatio(parameters, solver);
    case "partnershipNewPartnerCapital": return newPartnerCapital(parameters, solver);
    case "partnershipTimeFromProfitRatio": return timeFromRatio(parameters, solver);
    case "partnershipTargetPartnerShareFromRatio": return ratioShare(parameters, solver);
    case "partnershipRemainingProfitAfterCommission": return afterCommission(parameters, solver);
    default: return explanation;
  }
}
