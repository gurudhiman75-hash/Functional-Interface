import type { Rap002Explanation, Rap002Parameters, Rap002SolverResult } from "./types";

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

function label(parameters: Rap002Parameters, key: string, fallback: string) {
  return String(parameters.variables[key] ?? fallback);
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
  const task = parameters.taskKind;
  if (task === "reverseMiddleFinding") return "Align both ratios around the common middle term, then use the known amount.";
  if (task === "reverseEndpointFinding") return "Build the complete ratio chain, then recover the requested endpoint.";
  if (task === "constrainedReverseChain") return "Align the linked ratios into one chain, then use the stated total or endpoint difference.";

  switch (family(parameters)) {
    case "alignment": return "Make the shared ratio terms equal, then join the chain.";
    case "reverse": return "Align the chain and use the known amount to find one ratio unit.";
    case "change": return "Convert the ratio to actual values before applying the change.";
    case "partition": return "Find the parent share first, then divide that share by the second ratio.";
    case "inverse": return "For fixed work or distance, time varies inversely with rate.";
    case "comparison": return "Put the quantities on one common ratio scale before comparing them.";
    case "election": return "Move through total, polled, valid, and candidate votes in the required direction.";
  }
}

function method(parameters: Rap002Parameters) {
  switch (family(parameters)) {
    case "alignment": return "Use the common terms to read the requested pair or full chain.";
    case "reverse": return "Use the known total or difference to recover the missing ratio value.";
    case "change": return "Apply the addition, removal, or transfer and reduce the new ratio.";
    case "partition": return "Only the selected parent share is split by the second ratio.";
    case "inverse": return "Keep the relevant rate-time or worker-day product constant.";
    case "comparison": return "The aligned numerical parts give the order or comparison directly.";
    case "election": return "Apply or reverse each percentage once, using the correct vote base.";
  }
}

function targetSubPartLabel(parameters: Rap002Parameters) {
  const target = label(parameters, "targetSubPart", "C");
  if (target === "D") return label(parameters, "personD", "Partner D");
  return label(parameters, "personC", "Partner C");
}

function final(parameters: Rap002Parameters, solver: Rap002SolverResult) {
  const answer = cleanAnswer(solver.answer);
  const task = parameters.taskKind;
  const personA = label(parameters, "personA", "A");
  const personB = label(parameters, "personB", "B");
  const personC = label(parameters, "personC", "C");
  const personD = label(parameters, "personD", "D");

  if (task === "chainAlignment") return `So, ${personA}:${personB}:${personC}:${personD} = ${answer}.`;
  if (task === "extendedChainAlignment") return `So, ${label(parameters, "targetPairLabel", `${personA}:${personD}`)} = ${answer}.`;
  if (task === "missingChainRatio") return `So, the aligned value of ${personB} is ${answer}.`;
  if (task === "reverseMiddleFinding" || task === "constrainedReverseChain") return `So, ${personB} = ${answer}.`;
  if (task === "reverseEndpointFinding") return `So, ${label(parameters, "targetEndpoint", personA)} = ${answer}.`;
  if (task === "successiveRatioChange") return `So, the new ${personA}:${personB} ratio is ${answer}.`;
  if (task === "transferTracking") return `So, the final ${personA}:${personB} ratio is ${answer}.`;
  if (task === "reconstructOriginalRatio") return `So, the original ${personA}:${personB} ratio was ${answer}.`;
  if (task === "nestedPartition" || task === "conditionalDistribution") return `So, ${targetSubPartLabel(parameters)}'s share is ${answer}.`;
  if (task === "weightedNestedPartition") return `So, the total weighted value of the split is ${answer}.`;
  if (task === "combinedInverseChain") return `So, the total work ratio is ${answer}.`;
  if (task === "sdtTimeRatioFromSpeedDistance") return `So, the time ratio is ${answer}.`;
  if (task === "chainOrdering") return `So, the correct descending order is ${answer}.`;
  if (task === "chainInequality") return `So, the greater quantity is ${answer}.`;
  if (task === "chainEquivalence") return `So, the stated ratios are ${answer}.`;
  if (task === "inverseChainWork") {
    return solver.answerType === "RATIO"
      ? `So, the work-time ratio is ${answer}.`
      : `So, ${personB} takes ${answer} days.`;
  }
  if (task === "inverseChainSpeed") {
    return solver.answerType === "RATIO"
      ? `So, the time ratio is ${answer}.`
      : `So, ${personB} takes ${answer} hours.`;
  }
  if (task === "sdtRaceLead") return `So, the race result is ${answer}.`;
  if (solver.answerType === "RATIO") return `So, the requested ratio is ${answer}.`;
  if (solver.answerType === "COUNT") return `So, the requested value is ${answer}.`;
  return `So, the answer is ${answer}.`;
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
  const middle = original.slice(1, -1);
  const lines = [opening(parameters), method(parameters), ...middle, final(parameters, solver)];
  return { ...explanation, lines };
}
