import { alignChainRatios, alignThreeChainRatios, ratioLatex } from "./math";
import type { Rap002Explanation, Rap002Parameters, Rap002SolverResult } from "./types";

function n(parameters: Rap002Parameters, key: string) {
  return Number(parameters.variables[key]);
}

function s(parameters: Rap002Parameters, key: string) {
  return String(parameters.variables[key]);
}

function block(text: string) {
  return `$$${text}$$`;
}

export function renderRap002Explanation(parameters: Rap002Parameters, solver: Rap002SolverResult): Rap002Explanation {
  if (
    parameters.taskKind === "nestedPartition"
    || parameters.taskKind === "conditionalDistribution"
    || parameters.taskKind === "weightedNestedPartition"
  ) {
    const branchName = String(parameters.variables.branchPart ?? "A") === "B"
      ? s(parameters, "personB")
      : s(parameters, "personA");
    const intro = parameters.taskKind === "weightedNestedPartition"
      ? "First divide the total by the main ratio, then split the selected branch and apply the given weights."
      : parameters.taskKind === "conditionalDistribution"
        ? "First check the selected branch after the main split, then divide that branch by the second ratio."
        : "First divide the total by the main ratio, then subdivide the selected branch by the second ratio.";

    return {
      explanationId: parameters.explanationId,
      lines: [
        intro,
        block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`),
        `The selected branch is ${branchName}, whose share is ${String(solver.workingValues.branchShare)}.`,
        block(`${s(parameters, "personC")}:${s(parameters, "personD")}=${n(parameters, "subRatioC")}:${n(parameters, "subRatioD")}`),
        `After the second split, the values are ${String(solver.workingValues.subShares)}.`,
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "successiveRatioChange"
    || parameters.taskKind === "transferTracking"
    || parameters.taskKind === "reconstructOriginalRatio"
  ) {
    const actionLine = parameters.taskKind === "successiveRatioChange"
      ? "First use the given total to convert the starting ratio into actual values, then apply the stated additions or removals."
      : parameters.taskKind === "transferTracking"
        ? "First use the total to convert the ratio into actual values, then move the transferred amount from one side to the other."
        : "Work backward from the final ratio and undo the stated operation to recover the original values.";

    return {
      explanationId: parameters.explanationId,
      lines: [
        actionLine,
        solver.workingValues.initialRatio
          ? block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${String(solver.workingValues.initialRatio)}`)
          : block(`\\text{Final ratio}=${String(solver.workingValues.finalRatio)}`),
        `The tracked values become ${String(solver.workingValues.finalA ?? solver.workingValues.originalA)} and ${String(solver.workingValues.finalB ?? solver.workingValues.originalB)} for the two sides.`,
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "reverseMiddleFinding"
    || parameters.taskKind === "reverseEndpointFinding"
    || parameters.taskKind === "constrainedReverseChain"
  ) {
    const aligned = alignChainRatios(
      [n(parameters, "ratioA1"), n(parameters, "ratioB1")],
      [n(parameters, "ratioB2"), n(parameters, "ratioC2")],
    );
    const knownLine = parameters.taskKind === "reverseMiddleFinding"
      ? `Use the known endpoint value to find the common multiplier, then apply it to ${s(parameters, "personB")}.`
      : parameters.taskKind === "reverseEndpointFinding"
        ? `Use the known value of ${s(parameters, "personB")} to find the common multiplier, then apply it to the required endpoint.`
        : String(parameters.variables.constraintKind ?? "difference") === "total"
          ? "Use the given total to find the common multiplier for the full chain."
          : `Use the endpoint difference between ${s(parameters, "personA")} and ${s(parameters, "personC")} to find the common multiplier.`;

    return {
      explanationId: parameters.explanationId,
      lines: [
        `First align the two linked ratios through the common term ${s(parameters, "personB")}.`,
        block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA1")}:${n(parameters, "ratioB1")},\\ ${s(parameters, "personB")}:${s(parameters, "personC")}=${n(parameters, "ratioB2")}:${n(parameters, "ratioC2")}`),
        `The aligned chain is ${aligned.join(":")}.`,
        block(`${s(parameters, "personA")}:${s(parameters, "personB")}:${s(parameters, "personC")}=${ratioLatex(aligned)}`),
        knownLine,
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (parameters.taskKind === "missingChainRatio") {
    const aligned = alignChainRatios(
      [n(parameters, "ratioA1"), n(parameters, "ratioB1")],
      [n(parameters, "ratioB2"), n(parameters, "ratioC2")],
    );
    return {
      explanationId: parameters.explanationId,
      lines: [
        `Align the two ratios by making the shared term ${s(parameters, "personB")} equal in both ratios.`,
        block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA1")}:${n(parameters, "ratioB1")},\\ ${s(parameters, "personB")}:${s(parameters, "personC")}=${n(parameters, "ratioB2")}:${n(parameters, "ratioC2")}`),
        `After alignment, the chain becomes ${aligned.join(":")}.`,
        block(`${s(parameters, "personA")}:${s(parameters, "personB")}:${s(parameters, "personC")}=${ratioLatex(aligned)}`),
        `So the aligned value of ${s(parameters, "personB")} is ${solver.answer.replaceAll("$$", "")}.`,
      ],
    };
  }

  const fullChain = alignThreeChainRatios(
    [n(parameters, "ratioA1"), n(parameters, "ratioB1")],
    [n(parameters, "ratioB2"), n(parameters, "ratioC2")],
    [n(parameters, "ratioC3"), n(parameters, "ratioD3")],
  );
  const targetLine =
    parameters.taskKind === "extendedChainAlignment"
      ? `Now read the required pair from the common chain: ${String(parameters.variables.targetPairLabel ?? "selected pair")}.`
      : "Now read the full four-part chain.";

  return {
    explanationId: parameters.explanationId,
    lines: [
      "First align the common terms in the linked ratios.",
      block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA1")}:${n(parameters, "ratioB1")},\\ ${s(parameters, "personB")}:${s(parameters, "personC")}=${n(parameters, "ratioB2")}:${n(parameters, "ratioC2")},\\ ${s(parameters, "personC")}:${s(parameters, "personD")}=${n(parameters, "ratioC3")}:${n(parameters, "ratioD3")}`),
      `The common chain is ${fullChain.join(":")}.`,
      block(`${s(parameters, "personA")}:${s(parameters, "personB")}:${s(parameters, "personC")}:${s(parameters, "personD")}=${ratioLatex(fullChain)}`),
      targetLine,
      block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
    ],
  };
}
