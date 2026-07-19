import type { Rap002Explanation, Rap002Parameters, Rap002SolverResult } from "./types";

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

function family(parameters: Rap002Parameters) {
  const task = parameters.taskKind;
  if (["chainAlignment", "extendedChainAlignment", "missingChainRatio"].includes(task)) return "alignment";
  if (["reverseMiddleFinding", "reverseEndpointFinding", "constrainedReverseChain"].includes(task)) return "reverse";
  if (["successiveRatioChange", "transferTracking", "reconstructOriginalRatio"].includes(task)) return "change";
  if (["nestedPartition", "conditionalDistribution", "weightedNestedPartition", "incomeExpenditureSavings"].includes(task)) return "partition";
  if (["inverseChainWork", "inverseChainSpeed", "combinedInverseChain", "sdtTimeRatioFromSpeedDistance", "sdtRaceLead"].includes(task)) return "inverse";
  if (["chainOrdering", "chainInequality", "chainEquivalence"].includes(task)) return "comparison";
  return "election";
}

function opening(parameters: Rap002Parameters) {
  switch (family(parameters)) {
    case "alignment": return "Make each shared term equal before joining the linked ratios.";
    case "reverse": return "First align the linked ratios into one common chain.";
    case "change": return "Convert the original ratio into actual values before applying the change.";
    case "partition": return "Divide the main total first; the second ratio applies only to the selected branch.";
    case "inverse": return "For fixed work or distance, time varies inversely with rate.";
    case "comparison": return "Put all quantities on one common ratio scale before comparing them.";
    case "election": return "Move from total voters to polled votes, valid votes, and candidate shares in order.";
  }
}

function method(parameters: Rap002Parameters) {
  switch (family(parameters)) {
    case "alignment": return "Use the LCM of adjacent common parts and then read the requested pair or full chain.";
    case "reverse": return "Use the known value, total, or difference to find one unit of the aligned ratio.";
    case "change": return "After adding, removing, or transferring the stated amount, reduce the new values to a ratio.";
    case "partition": return "Find the parent share, then divide that share by the sub-ratio.";
    case "inverse": return "Keep the relevant rate-time or worker-day product constant.";
    case "comparison": return "The aligned numerical parts directly determine the order, inequality, or equivalence.";
    case "election": return "Apply or reverse each percentage only once and keep the vote subsets in the correct order.";
  }
}

function final(parameters: Rap002Parameters, solver: Rap002SolverResult) {
  const answer = cleanAnswer(solver.answer);
  const task = parameters.taskKind;
  if (task === "chainOrdering") return `So, the correct descending order is ${answer}.`;
  if (task === "chainInequality") return `So, the greater quantity is ${answer}.`;
  if (task === "chainEquivalence") return `So, the stated ratios are ${answer}.`;
  if (task === "inverseChainWork") return `So, the required number of days is ${answer}.`;
  if (task === "inverseChainSpeed") return `So, the required time is ${answer} hours.`;
  if (task === "sdtRaceLead") return `So, the required race result is ${answer}.`;
  if (solver.answerType === "RATIO") return `So, the required ratio is ${answer}.`;
  if (solver.answerType === "COUNT") return `So, the required value is ${answer}.`;
  return `So, the correct conclusion is ${answer}.`;
}

function replacementForGeneric(line: string) {
  return line
    .replace(/^Use inverse scaling from the known work, workers, or time\.?$/i, "Use the known rate and time to find the missing value.")
    .replace(/^The relevant rate-time or worker-day product remains constant\.?$/i, "The rate-time product remains unchanged.")
    .replace(/^The extracted pair or full chain reproduces every ratio given in the stem\.?$/i, "The aligned chain satisfies each ratio in the question.")
    .replace(/^The aligned values directly support the stated order, comparison, or equivalence result\.?$/i, "The aligned values now make the comparison direct.")
    .replace(/^Read the full four-part chain\.?$/i, "Read the four-part ratio from the aligned chain.")
    .replace(/^Compare the aligned parts directly\.?$/i, "Compare the aligned numerical parts.");
}

export function renderRap002EditorialExplanation(
  parameters: Rap002Parameters,
  solver: Rap002SolverResult,
  explanation: Rap002Explanation,
): Rap002Explanation {
  if (parameters.language !== "en") return explanation;
  const original = explanation.lines.map(replacementForGeneric);
  const middle = original.slice(2, 6);
  const lines = [opening(parameters), method(parameters), ...middle, final(parameters, solver)];
  return { ...explanation, lines: lines.slice(0, 7) };
}
