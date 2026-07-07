import { alignChainRatios, alignThreeChainRatios, formatNumber, formatRatio, missingMiddleFromEndpointRatio, ratioLatex, simplifyRatio } from "./math";
import type { Rap002Parameters, Rap002SolverResult } from "./types";

function n(parameters: Rap002Parameters, key: string) {
  return Number(parameters.variables[key]);
}

function solveFullChain(parameters: Rap002Parameters) {
  return alignThreeChainRatios(
    [n(parameters, "ratioA1"), n(parameters, "ratioB1")],
    [n(parameters, "ratioB2"), n(parameters, "ratioC2")],
    [n(parameters, "ratioC3"), n(parameters, "ratioD3")],
  );
}

function selectedPair(parameters: Rap002Parameters, fullChain: readonly number[]) {
  const target = String(parameters.variables.targetPair ?? "AD");
  if (target === "BD") return simplifyRatio([fullChain[1]!, fullChain[3]!]);
  if (target === "AC") return simplifyRatio([fullChain[0]!, fullChain[2]!]);
  return simplifyRatio([fullChain[0]!, fullChain[3]!]);
}

function solveThreePartChain(parameters: Rap002Parameters) {
  return alignChainRatios(
    [n(parameters, "ratioA1"), n(parameters, "ratioB1")],
    [n(parameters, "ratioB2"), n(parameters, "ratioC2")],
  );
}

function countResult(value: number, workingValues: Record<string, string | number>, calculationLatex: string): Rap002SolverResult {
  const answerValue = formatNumber(value);
  return {
    answer: `$$${answerValue}$$`,
    answerValue,
    answerType: "COUNT",
    workingValues,
    evidence: workingValues,
    mathJax: {
      setupLatex: String(workingValues.alignedChain ?? ""),
      calculationLatex,
    },
  };
}

function ratioResult(values: readonly number[], workingValues: Record<string, string | number>, calculationLatex: string): Rap002SolverResult {
  const ratio = simplifyRatio(values);
  const answerValue = formatRatio(ratio);
  return {
    answer: `$$${ratioLatex(ratio)}$$`,
    answerValue,
    answerType: "RATIO",
    workingValues,
    evidence: workingValues,
    mathJax: {
      setupLatex: String(workingValues.initialRatio ?? workingValues.finalRatio ?? ""),
      calculationLatex,
    },
  };
}

function logicResult(value: string, workingValues: Record<string, string | number>, calculationLatex: string): Rap002SolverResult {
  return {
    answer: `$$\\text{${value}}$$`,
    answerValue: value,
    answerType: "LOGIC",
    workingValues,
    evidence: workingValues,
    mathJax: {
      setupLatex: String(workingValues.chain ?? workingValues.ratios ?? ""),
      calculationLatex,
    },
  };
}

function splitByRatio(total: number, ratioA: number, ratioB: number): [number, number] {
  const unit = total / (ratioA + ratioB);
  return [ratioA * unit, ratioB * unit];
}

function solveNestedPartitionValues(parameters: Rap002Parameters) {
  const [shareA, shareB] = splitByRatio(n(parameters, "totalValue"), n(parameters, "ratioA"), n(parameters, "ratioB"));
  const branchPart = String(parameters.variables.branchPart ?? "A");
  const branchShare = branchPart === "B" ? shareB : shareA;
  const [subShareC, subShareD] = splitByRatio(branchShare, n(parameters, "subRatioC"), n(parameters, "subRatioD"));
  return { shareA, shareB, branchPart, branchShare, subShareC, subShareD };
}

function orderedLabels(labels: readonly string[], values: readonly number[]) {
  return labels
    .map((label, index) => ({ label, value: values[index]! }))
    .sort((left, right) => right.value - left.value)
    .map((item) => item.label)
    .join(" > ");
}

export function solveRap002(parameters: Rap002Parameters): Rap002SolverResult {
  switch (parameters.taskKind) {
    case "chainAlignment": {
      const fullChain = solveFullChain(parameters);
      const answerValue = formatRatio(fullChain);
      return {
        answer: `$$${ratioLatex(fullChain)}$$`,
        answerValue,
        answerType: "RATIO",
        workingValues: { fullChain: answerValue },
        evidence: { fullChain: answerValue },
        mathJax: {
          setupLatex: `${n(parameters, "ratioA1")}:${n(parameters, "ratioB1")},\\ ${n(parameters, "ratioB2")}:${n(parameters, "ratioC2")},\\ ${n(parameters, "ratioC3")}:${n(parameters, "ratioD3")}`,
          calculationLatex: `${ratioLatex(fullChain)}`,
        },
      };
    }
    case "extendedChainAlignment": {
      const fullChain = solveFullChain(parameters);
      const pair = selectedPair(parameters, fullChain);
      const answerValue = formatRatio(pair);
      return {
        answer: `$$${ratioLatex(pair)}$$`,
        answerValue,
        answerType: "RATIO",
        workingValues: { fullChain: formatRatio(fullChain), selectedPair: answerValue },
        evidence: { fullChain: formatRatio(fullChain), selectedPair: answerValue, targetPair: String(parameters.variables.targetPair ?? "AD") },
        mathJax: {
          setupLatex: `${ratioLatex(fullChain)}`,
          calculationLatex: `${String(parameters.variables.targetPairLabel ?? "selected pair")}=${ratioLatex(pair)}`,
        },
      };
    }
    case "missingChainRatio": {
      const aligned = solveThreePartChain(parameters);
      const middle = missingMiddleFromEndpointRatio(
        [n(parameters, "ratioA1"), n(parameters, "ratioB1")],
        [n(parameters, "ratioB2"), n(parameters, "ratioC2")],
        [n(parameters, "endpointA"), n(parameters, "endpointC")],
      );
      return {
        answer: `$$${formatNumber(middle)}$$`,
        answerValue: middle,
        answerType: "COUNT",
        workingValues: { alignedChain: formatRatio(aligned), middle },
        evidence: { alignedChain: formatRatio(aligned), middle },
        mathJax: {
          setupLatex: `${n(parameters, "ratioA1")}:${n(parameters, "ratioB1")},\\ ${n(parameters, "ratioB2")}:${n(parameters, "ratioC2")}`,
          calculationLatex: `${ratioLatex(aligned)}`,
        },
      };
    }
    case "reverseMiddleFinding": {
      const aligned = solveThreePartChain(parameters);
      const hasA = parameters.variables.valueA !== undefined;
      const knownValue = hasA ? n(parameters, "valueA") : n(parameters, "valueC");
      const knownRatioPart = hasA ? aligned[0]! : aligned[2]!;
      const scale = knownValue / knownRatioPart;
      const middle = aligned[1]! * scale;
      return countResult(
        middle,
        { alignedChain: formatRatio(aligned), knownValue: formatNumber(knownValue), scale: formatNumber(scale), result: formatNumber(middle) },
        `${aligned[1]}\\times${formatNumber(scale)}=${formatNumber(middle)}`,
      );
    }
    case "reverseEndpointFinding": {
      const aligned = solveThreePartChain(parameters);
      const scale = n(parameters, "valueB") / aligned[1]!;
      const targetEndpoint = String(parameters.variables.targetEndpoint ?? "A");
      const endpointRatioPart = targetEndpoint === "C" ? aligned[2]! : aligned[0]!;
      const endpoint = endpointRatioPart * scale;
      return countResult(
        endpoint,
        { alignedChain: formatRatio(aligned), knownValue: formatNumber(n(parameters, "valueB")), targetEndpoint, scale: formatNumber(scale), result: formatNumber(endpoint) },
        `${endpointRatioPart}\\times${formatNumber(scale)}=${formatNumber(endpoint)}`,
      );
    }
    case "constrainedReverseChain": {
      const aligned = solveThreePartChain(parameters);
      const constraintKind = String(parameters.variables.constraintKind ?? "difference");
      const scale = constraintKind === "total"
        ? n(parameters, "totalValue") / (aligned[0]! + aligned[1]! + aligned[2]!)
        : n(parameters, "valueDifference") / Math.abs(aligned[2]! - aligned[0]!);
      const middle = aligned[1]! * scale;
      const knownValue = constraintKind === "total" ? n(parameters, "totalValue") : n(parameters, "valueDifference");
      return countResult(
        middle,
        { alignedChain: formatRatio(aligned), constraintKind, knownValue: formatNumber(knownValue), scale: formatNumber(scale), result: formatNumber(middle) },
        `${aligned[1]}\\times${formatNumber(scale)}=${formatNumber(middle)}`,
      );
    }
    case "successiveRatioChange": {
      const [initialA, initialB] = splitByRatio(n(parameters, "totalValue"), n(parameters, "ratioA"), n(parameters, "ratioB"));
      const finalA = initialA + Number(parameters.variables.valueAddA ?? 0) - Number(parameters.variables.valueRemoveA ?? 0);
      const finalB = initialB + Number(parameters.variables.valueAddB ?? 0) - Number(parameters.variables.valueRemoveB ?? 0);
      return ratioResult(
        [finalA, finalB],
        { initialRatio: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`, initialA: formatNumber(initialA), initialB: formatNumber(initialB), finalA: formatNumber(finalA), finalB: formatNumber(finalB) },
        `${formatNumber(finalA)}:${formatNumber(finalB)}=${ratioLatex(simplifyRatio([finalA, finalB]))}`,
      );
    }
    case "transferTracking": {
      const [initialA, initialB] = splitByRatio(n(parameters, "totalValue"), n(parameters, "ratioA"), n(parameters, "ratioB"));
      const transferValue = n(parameters, "transferValue");
      const direction = String(parameters.variables.transferDirection ?? "B_TO_A");
      const finalA = direction === "B_TO_A" ? initialA + transferValue : initialA - transferValue;
      const finalB = direction === "B_TO_A" ? initialB - transferValue : initialB + transferValue;
      return ratioResult(
        [finalA, finalB],
        { initialRatio: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`, transferDirection: direction, transferValue: formatNumber(transferValue), finalA: formatNumber(finalA), finalB: formatNumber(finalB) },
        `${formatNumber(finalA)}:${formatNumber(finalB)}=${ratioLatex(simplifyRatio([finalA, finalB]))}`,
      );
    }
    case "reconstructOriginalRatio": {
      if (parameters.variables.valueAddA !== undefined) {
        const finalTotal = n(parameters, "originalTotal") + n(parameters, "valueAddA");
        const [finalA, finalB] = splitByRatio(finalTotal, n(parameters, "finalRatioA"), n(parameters, "finalRatioB"));
        const originalA = finalA - n(parameters, "valueAddA");
        const originalB = finalB;
        return ratioResult(
          [originalA, originalB],
          { finalRatio: `${n(parameters, "finalRatioA")}:${n(parameters, "finalRatioB")}`, finalA: formatNumber(finalA), finalB: formatNumber(finalB), originalA: formatNumber(originalA), originalB: formatNumber(originalB) },
          `${formatNumber(originalA)}:${formatNumber(originalB)}=${ratioLatex(simplifyRatio([originalA, originalB]))}`,
        );
      }
      const [finalA, finalB] = splitByRatio(n(parameters, "totalValue"), n(parameters, "finalRatioA"), n(parameters, "finalRatioB"));
      const transferValue = n(parameters, "transferValue");
      const direction = String(parameters.variables.transferDirection ?? "A_TO_B");
      const originalA = direction === "A_TO_B" ? finalA + transferValue : finalA - transferValue;
      const originalB = direction === "A_TO_B" ? finalB - transferValue : finalB + transferValue;
      return ratioResult(
        [originalA, originalB],
        { finalRatio: `${n(parameters, "finalRatioA")}:${n(parameters, "finalRatioB")}`, transferDirection: direction, transferValue: formatNumber(transferValue), originalA: formatNumber(originalA), originalB: formatNumber(originalB) },
        `${formatNumber(originalA)}:${formatNumber(originalB)}=${ratioLatex(simplifyRatio([originalA, originalB]))}`,
      );
    }
    case "nestedPartition":
    case "conditionalDistribution": {
      const nested = solveNestedPartitionValues(parameters);
      const targetSubPart = String(parameters.variables.targetSubPart ?? "C");
      const result = targetSubPart === "D" ? nested.subShareD : nested.subShareC;
      return countResult(
        result,
        {
          mainShares: `${formatNumber(nested.shareA)}:${formatNumber(nested.shareB)}`,
          branchPart: nested.branchPart,
          branchShare: formatNumber(nested.branchShare),
          subShares: `${formatNumber(nested.subShareC)}:${formatNumber(nested.subShareD)}`,
          result: formatNumber(result),
        },
        `${formatNumber(nested.branchShare)}\\times\\frac{${targetSubPart === "D" ? n(parameters, "subRatioD") : n(parameters, "subRatioC")}}{${n(parameters, "subRatioC") + n(parameters, "subRatioD")}}=${formatNumber(result)}`,
      );
    }
    case "weightedNestedPartition": {
      const nested = solveNestedPartitionValues(parameters);
      const weightedTotal = nested.subShareC * n(parameters, "weightC") + nested.subShareD * n(parameters, "weightD");
      return countResult(
        weightedTotal,
        {
          mainShares: `${formatNumber(nested.shareA)}:${formatNumber(nested.shareB)}`,
          branchPart: nested.branchPart,
          branchShare: formatNumber(nested.branchShare),
          subShares: `${formatNumber(nested.subShareC)}:${formatNumber(nested.subShareD)}`,
          weightC: formatNumber(n(parameters, "weightC")),
          weightD: formatNumber(n(parameters, "weightD")),
          result: formatNumber(weightedTotal),
        },
        `${formatNumber(nested.subShareC)}\\times${n(parameters, "weightC")}+${formatNumber(nested.subShareD)}\\times${n(parameters, "weightD")}=${formatNumber(weightedTotal)}`,
      );
    }
    case "inverseChainWork":
    case "inverseChainSpeed": {
      if (parameters.variables.ratioA1 !== undefined) {
        const aligned = solveThreePartChain(parameters);
        const hasA = parameters.variables.valueA !== undefined;
        const knownTime = hasA ? n(parameters, "valueA") : n(parameters, "valueC");
        const knownRatePart = hasA ? aligned[0]! : aligned[2]!;
        const targetRatePart = hasA ? aligned[2]! : aligned[0]!;
        const targetTime = knownTime * knownRatePart / targetRatePart;
        return countResult(
          targetTime,
          { alignedChain: formatRatio(aligned), knownTime: formatNumber(knownTime), result: formatNumber(targetTime) },
          `${formatNumber(knownTime)}\\times\\frac{${knownRatePart}}{${targetRatePart}}=${formatNumber(targetTime)}`,
        );
      }
      const targetTime = n(parameters, "valueA") * n(parameters, "ratioA") / n(parameters, "ratioB");
      return countResult(
        targetTime,
        { rateRatio: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`, knownTime: formatNumber(n(parameters, "valueA")), result: formatNumber(targetTime) },
        `${n(parameters, "valueA")}\\times\\frac{${n(parameters, "ratioA")}}{${n(parameters, "ratioB")}}=${formatNumber(targetTime)}`,
      );
    }
    case "combinedInverseChain": {
      const productA = n(parameters, "ratioA") * n(parameters, "timeRatioA");
      const productB = n(parameters, "ratioB") * n(parameters, "timeRatioB");
      return ratioResult(
        [productA, productB],
        { rateRatio: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`, timeRatio: `${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")}`, productRatio: formatRatio([productA, productB]) },
        `${n(parameters, "ratioA")}\\times${n(parameters, "timeRatioA")}:${n(parameters, "ratioB")}\\times${n(parameters, "timeRatioB")}=${ratioLatex(simplifyRatio([productA, productB]))}`,
      );
    }
    case "chainOrdering": {
      const hasFour = parameters.variables.ratioC3 !== undefined;
      const values = hasFour ? solveFullChain(parameters) : solveThreePartChain(parameters);
      const labels = hasFour
        ? [String(parameters.variables.personA), String(parameters.variables.personB), String(parameters.variables.personC), String(parameters.variables.personD)]
        : [String(parameters.variables.personA), String(parameters.variables.personB), String(parameters.variables.personC)];
      const order = orderedLabels(labels, values);
      return logicResult(
        order,
        { chain: formatRatio(values), order },
        `${ratioLatex(values)}\\Rightarrow\\text{${order}}`,
      );
    }
    case "chainInequality": {
      const pair = String(parameters.variables.comparisonPair ?? "AC");
      const hasFour = parameters.variables.ratioC3 !== undefined;
      const values = hasFour ? solveFullChain(parameters) : solveThreePartChain(parameters);
      const labels = hasFour
        ? [String(parameters.variables.personA), String(parameters.variables.personB), String(parameters.variables.personC), String(parameters.variables.personD)]
        : [String(parameters.variables.personA), String(parameters.variables.personB), String(parameters.variables.personC)];
      const leftIndex = pair === "BD" ? 1 : 0;
      const rightIndex = pair === "BD" ? 3 : 2;
      const result = values[leftIndex]! >= values[rightIndex]! ? labels[leftIndex]! : labels[rightIndex]!;
      return logicResult(
        result,
        { chain: formatRatio(values), comparisonPair: pair, result },
        `${labels[leftIndex]}=${values[leftIndex]},\\ ${labels[rightIndex]}=${values[rightIndex]}\\Rightarrow\\text{${result}}`,
      );
    }
    case "chainEquivalence": {
      const equivalent = parameters.variables.endpointA !== undefined
        ? (() => {
            const aligned = solveThreePartChain(parameters);
            const endpoint = simplifyRatio([aligned[0]!, aligned[2]!]);
            return endpoint[0] === n(parameters, "endpointA") && endpoint[1] === n(parameters, "endpointC");
          })()
        : (() => {
            const first = simplifyRatio([n(parameters, "ratioA"), n(parameters, "ratioB")]);
            const second = simplifyRatio([n(parameters, "equivalentA"), n(parameters, "equivalentB")]);
            return first[0] === second[0] && first[1] === second[1];
          })();
      const result = equivalent ? "Equivalent" : "Not equivalent";
      return logicResult(
        result,
        { ratios: parameters.variables.endpointA !== undefined ? `${n(parameters, "endpointA")}:${n(parameters, "endpointC")}` : `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}, ${n(parameters, "equivalentA")}:${n(parameters, "equivalentB")}`, result },
        `\\text{${result}}`,
      );
    }
    default:
      throw new Error(`RAP-002 solver missing for taskKind: ${parameters.taskKind}`);
  }
}
