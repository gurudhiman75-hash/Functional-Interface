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
  return String(Math.round(value * 10000) / 10000);
}

function line(text: string, math?: string) {
  return math ? `${text}\n\n$$\\Rightarrow ${math}$$` : text;
}

function result(parameters: Rap003Parameters, lines: string[]): Rap003Explanation {
  return { explanationId: parameters.explanationId, lines };
}

function fixedRounds(parameters: Rap003Parameters, solver: Rap003SolverResult, mode: "ratio" | "original" | "added" | "percent") {
  const volume = n(parameters, "initialVolume");
  const removed = n(parameters, "removedVolume");
  const rounds = n(parameters, "replacementCount");
  const liquidA = s(parameters, "liquidA", "original liquid");
  const liquidB = s(parameters, "liquidB", "replacement liquid");
  const retention = (volume - removed) / volume;
  const remainingFraction = retention ** rounds;
  const remaining = volume * remainingFraction;
  const added = volume - remaining;
  const final = answer(solver);
  const finalSentence = mode === "ratio"
    ? `So, the final ${liquidA}:${liquidB} ratio is ${final}.`
    : mode === "added"
      ? `So, the final quantity of ${liquidB} is ${final} litres.`
      : mode === "percent"
        ? `So, ${final} of the original ${liquidA} remains.`
        : `So, ${final} litres of ${liquidA} remain.`;
  return result(parameters, [
    line("Find the fraction retained after one replacement.", `r=\\frac{${volume}-${removed}}{${volume}}=${shown(retention)}`),
    line(`After ${rounds} rounds, the retained fraction is`, `r^{${rounds}}=${shown(retention)}^{${rounds}}=${shown(remainingFraction)}`),
    line(`The remaining ${liquidA} quantity is`, `${volume}\\times${shown(remainingFraction)}=${shown(remaining)}`),
    line(`The ${liquidB} quantity is the rest of the vessel.`, `${volume}-${shown(remaining)}=${shown(added)}`),
    mode === "ratio" ? line("Form and reduce the final ratio.", `${shown(remaining)}:${shown(added)}=${final}`) : mode === "percent" ? line("Convert the retained fraction to a percentage.", `${shown(remainingFraction)}\\times100=${final}`) : line("Read the requested quantity.", `${mode === "added" ? shown(added) : shown(remaining)}=${final}`),
    "The vessel volume stays constant after each refill.",
    finalSentence,
  ]);
}

function iterations(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const volume = n(parameters, "initialVolume");
  const removed = n(parameters, "removedVolume");
  const ratioA = n(parameters, "finalRatioA");
  const ratioB = n(parameters, "finalRatioB");
  const retention = (volume - removed) / volume;
  const finalFraction = ratioA / (ratioA + ratioB);
  const rounds = Math.log(finalFraction) / Math.log(retention);
  const final = answer(solver);
  return result(parameters, [
    line("Find the one-round retention fraction.", `r=\\frac{${volume}-${removed}}{${volume}}=${shown(retention)}`),
    line("Convert the final ratio into the fraction of original liquid remaining.", `f=\\frac{${ratioA}}{${ratioA}+${ratioB}}=${shown(finalFraction)}`),
    line("After k rounds, the retained fraction is", `r^k=f`),
    line("Substitute the two fractions.", `${shown(retention)}^k=${shown(finalFraction)}`),
    line("Solve for k.", `k=\\frac{\\log(${shown(finalFraction)})}{\\log(${shown(retention)})}=${shown(rounds)}`),
    "The number of operations must be a whole number.",
    `So, ${final} replacement operations are required.`,
  ]);
}

function removedFromRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const volume = n(parameters, "initialVolume");
  const rounds = n(parameters, "replacementCount");
  const ratioA = n(parameters, "finalRatioA");
  const ratioB = n(parameters, "finalRatioB");
  const finalFraction = ratioA / (ratioA + ratioB);
  const retention = finalFraction ** (1 / rounds);
  const removed = volume * (1 - retention);
  const final = answer(solver);
  return result(parameters, [
    line("Convert the final ratio into the original-liquid fraction.", `f=\\frac{${ratioA}}{${ratioA}+${ratioB}}=${shown(finalFraction)}`),
    line(`If r is the one-round retention fraction,`, `r^{${rounds}}=${shown(finalFraction)}`),
    line("Take the required root.", `r=${shown(finalFraction)}^{1/${rounds}}=${shown(retention)}`),
    line("The removed fraction per round is", `1-r=${shown(1 - retention)}`),
    line("Multiply by the vessel volume.", `${volume}(${shown(1 - retention)})=${shown(removed)}=${final}`),
    "Using this removal amount for every round reproduces the stated final ratio.",
    `So, ${final} litres are removed in each round.`,
  ]);
}

function differentRounds(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const volume = n(parameters, "initialVolume");
  const removedA = n(parameters, "removedVolumeA");
  const removedB = n(parameters, "removedVolumeB");
  const retentionA = (volume - removedA) / volume;
  const retentionB = (volume - removedB) / volume;
  const finalQuantity = volume * retentionA * retentionB;
  const liquid = s(parameters, "liquidA", "original liquid");
  const final = answer(solver);
  return result(parameters, [
    line("First-round retention fraction", `r_1=\\frac{${volume}-${removedA}}{${volume}}=${shown(retentionA)}`),
    line("Second-round retention fraction", `r_2=\\frac{${volume}-${removedB}}{${volume}}=${shown(retentionB)}`),
    "The second removal acts on the already diluted mixture.",
    line(`Final ${liquid} quantity is`, `${volume}\\times${shown(retentionA)}\\times${shown(retentionB)}`),
    line("Evaluating gives", `${shown(finalQuantity)}=${final}`),
    "The two different removal fractions must be multiplied, not added.",
    `So, ${final} litres of ${liquid} remain.`,
  ]);
}

function strengthAfterRounds(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const volume = n(parameters, "initialVolume");
  const removed = n(parameters, "removedVolume");
  const rounds = n(parameters, "replacementCount");
  const initialPercent = n(parameters, "initialPercent");
  const refillPercent = n(parameters, "addLiquidPercent");
  const retention = (volume - removed) / volume;
  const finalPercent = refillPercent + (initialPercent - refillPercent) * retention ** rounds;
  const final = answer(solver);
  return result(parameters, [
    line("Find the one-round retention fraction.", `r=\\frac{${volume}-${removed}}{${volume}}=${shown(retention)}`),
    "Because the refill liquid also contains the component, track the excess above the refill concentration.",
    line("Initial excess concentration", `${initialPercent}-${refillPercent}=${initialPercent - refillPercent}`),
    line(`After ${rounds} rounds, the excess becomes`, `(${initialPercent}-${refillPercent})${shown(retention)}^{${rounds}}=${shown((initialPercent - refillPercent) * retention ** rounds)}`),
    line("Add back the refill concentration.", `${refillPercent}+${shown((initialPercent - refillPercent) * retention ** rounds)}=${shown(finalPercent)}=${final}`),
    "This formula accounts for the component introduced during every refill.",
    `So, the final strength is ${final}.`,
  ]);
}

function inventory(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const stock = n(parameters, "initialStock");
  const sold = n(parameters, "soldEachRound");
  const rounds = n(parameters, "replacementCount");
  const retention = (stock - sold) / stock;
  const remaining = stock * retention ** rounds;
  const final = answer(solver);
  return result(parameters, [
    line("Find the fraction of original stock retained in one round.", `r=\\frac{${stock}-${sold}}{${stock}}=${shown(retention)}`),
    line(`After ${rounds} rounds,`, `r^{${rounds}}=${shown(retention ** rounds)}`),
    line("Multiply by the initial stock.", `${stock}\\times${shown(retention ** rounds)}=${shown(remaining)}`),
    "New stock added after each sale is not part of the original stock.",
    line("Therefore, original stock remaining is", `${shown(remaining)}=${final}`),
    "The same retention principle applies as in liquid replacement.",
    `So, ${final} original units remain.`,
  ]);
}

function initialFromFinal(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const numerator = n(parameters, "removedFractionNumerator");
  const denominator = n(parameters, "removedFractionDenominator");
  const rounds = n(parameters, "replacementCount");
  const finalQuantity = n(parameters, "finalQuantity");
  const retention = 1 - numerator / denominator;
  const initial = finalQuantity / retention ** rounds;
  const final = answer(solver);
  return result(parameters, [
    line("Find the retained fraction in one round.", `r=1-\\frac{${numerator}}{${denominator}}=\\frac{${denominator - numerator}}{${denominator}}`),
    line(`After ${rounds} rounds, the retained fraction is`, `r^{${rounds}}=${shown(retention ** rounds)}`),
    "Let the initial quantity be V.",
    line("Use the given final quantity.", `V(${shown(retention ** rounds)})=${finalQuantity}`),
    line("Solve for V.", `V=\\frac{${finalQuantity}}{${shown(retention ** rounds)}}=${shown(initial)}=${final}`),
    "Forward substitution returns the stated final quantity.",
    `So, the initial quantity was ${final} litres.`,
  ]);
}

function fractionRemovalRatio(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const numerator = n(parameters, "removedFractionNumerator");
  const denominator = n(parameters, "removedFractionDenominator");
  const rounds = n(parameters, "replacementCount");
  const retention = (denominator - numerator) / denominator;
  const originalFraction = retention ** rounds;
  const addedFraction = 1 - originalFraction;
  const final = answer(solver);
  return result(parameters, [
    line("One-round retained fraction", `r=1-\\frac{${numerator}}{${denominator}}=\\frac{${denominator - numerator}}{${denominator}}`),
    line(`Original-liquid fraction after ${rounds} rounds`, `r^{${rounds}}=${shown(originalFraction)}`),
    line("Replacement-liquid fraction is the remainder.", `1-${shown(originalFraction)}=${shown(addedFraction)}`),
    line("Form the fraction ratio.", `${shown(originalFraction)}:${shown(addedFraction)}`),
    line("Reduce to integer terms.", `${shown(originalFraction)}:${shown(addedFraction)}=${final}`),
    "The two fractions add to the full vessel.",
    `So, the final original-liquid:replacement-liquid ratio is ${final}.`,
  ]);
}

export function renderRap003ReplacementExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "replacementFinalRatio": return fixedRounds(parameters, solver, "ratio");
    case "replacementFinalQuantity": return fixedRounds(parameters, solver, "original");
    case "replacementAddedLiquidQuantity": return fixedRounds(parameters, solver, "added");
    case "replacementOriginalPercentRemaining": return fixedRounds(parameters, solver, "percent");
    case "replacementIterationsFromFinalRatio": return iterations(parameters, solver);
    case "replacementRemovedVolumeFromFinalRatio": return removedFromRatio(parameters, solver);
    case "replacementDifferentRounds": return differentRounds(parameters, solver);
    case "replacementTankSolution":
    case "replacementStrengthAfterRounds": return strengthAfterRounds(parameters, solver);
    case "replacementInventoryAnalogy": return inventory(parameters, solver);
    case "replacementInitialFromFinalQuantity": return initialFromFinal(parameters, solver);
    case "replacementFinalAfterFractionRemoval": return fractionRemovalRatio(parameters, solver);
    default: return explanation;
  }
}
