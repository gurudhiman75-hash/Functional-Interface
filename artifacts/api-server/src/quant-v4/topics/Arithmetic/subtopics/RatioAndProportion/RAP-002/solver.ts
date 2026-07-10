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

function solveTwoEquationSystem(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number) {
  const determinant = a1 * b2 - a2 * b1;
  if (determinant === 0) throw new Error("Income-expenditure system is not uniquely solvable.");
  return {
    x: (c1 * b2 - c2 * b1) / determinant,
    y: (a1 * c2 - a2 * c1) / determinant,
  };
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
      const finalA = initialA
        + Number(parameters.variables.valueAddA ?? parameters.variables.commonAdd ?? 0)
        - Number(parameters.variables.valueRemoveA ?? parameters.variables.commonRemove ?? 0);
      const finalB = initialB
        + Number(parameters.variables.valueAddB ?? parameters.variables.commonAdd ?? 0)
        - Number(parameters.variables.valueRemoveB ?? parameters.variables.commonRemove ?? 0);
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
        {
          initialRatio: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`,
          initialA: formatNumber(initialA),
          initialB: formatNumber(initialB),
          transferDirection: direction,
          transferValue: formatNumber(transferValue),
          finalA: formatNumber(finalA),
          finalB: formatNumber(finalB),
        },
        `${formatNumber(finalA)}:${formatNumber(finalB)}=${ratioLatex(simplifyRatio([finalA, finalB]))}`,
      );
    }
    case "reconstructOriginalRatio": {
      if (parameters.variables.finalValueA !== undefined && parameters.variables.valueAddA !== undefined) {
        const finalA = n(parameters, "finalValueA");
        const finalB = finalA * n(parameters, "finalRatioB") / n(parameters, "finalRatioA");
        const originalA = finalA - n(parameters, "valueAddA");
        const originalB = finalB;
        const originalTotal = originalA + originalB;
        return countResult(
          originalTotal,
          {
            finalRatio: `${n(parameters, "finalRatioA")}:${n(parameters, "finalRatioB")}`,
            finalA: formatNumber(finalA),
            finalB: formatNumber(finalB),
            originalA: formatNumber(originalA),
            originalB: formatNumber(originalB),
            result: formatNumber(originalTotal),
          },
          `${formatNumber(originalA)}+${formatNumber(originalB)}=${formatNumber(originalTotal)}`,
        );
      }
      if (parameters.variables.ratioA !== undefined && parameters.variables.finalRatioA !== undefined && parameters.variables.transferDirection === undefined) {
        const [initialA, initialB] = splitByRatio(n(parameters, "totalValue"), n(parameters, "ratioA"), n(parameters, "ratioB"));
        const numerator = n(parameters, "finalRatioB") * initialA - n(parameters, "finalRatioA") * initialB;
        const denominator = n(parameters, "finalRatioA") - n(parameters, "finalRatioB");
        const commonAdd = numerator / denominator;
        return countResult(
          commonAdd,
          {
            initialRatio: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`,
            initialA: formatNumber(initialA),
            initialB: formatNumber(initialB),
            finalRatio: `${n(parameters, "finalRatioA")}:${n(parameters, "finalRatioB")}`,
            result: formatNumber(commonAdd),
          },
          `\\frac{${formatNumber(numerator)}}{${formatNumber(denominator)}}=${formatNumber(commonAdd)}`,
        );
      }
      if (parameters.variables.ratioA !== undefined && parameters.variables.transferDirection !== undefined && parameters.variables.transferValue === undefined) {
        const [initialA, initialB] = splitByRatio(n(parameters, "totalValue"), n(parameters, "ratioA"), n(parameters, "ratioB"));
        const direction = String(parameters.variables.transferDirection);
        const numerator = direction === "A_TO_B"
          ? n(parameters, "finalRatioB") * initialA - n(parameters, "finalRatioA") * initialB
          : n(parameters, "finalRatioA") * initialB - n(parameters, "finalRatioB") * initialA;
        const denominator = n(parameters, "finalRatioA") + n(parameters, "finalRatioB");
        const transferValue = numerator / denominator;
        return countResult(
          transferValue,
          {
            initialRatio: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`,
            initialA: formatNumber(initialA),
            initialB: formatNumber(initialB),
            finalRatio: `${n(parameters, "finalRatioA")}:${n(parameters, "finalRatioB")}`,
            transferDirection: direction,
            result: formatNumber(transferValue),
          },
          `\\frac{${formatNumber(numerator)}}{${formatNumber(denominator)}}=${formatNumber(transferValue)}`,
        );
      }
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
      if (parameters.variables.valueRemoveB !== undefined) {
        const finalTotal = n(parameters, "totalValue") - n(parameters, "valueRemoveB");
        const [finalA, finalB] = splitByRatio(finalTotal, n(parameters, "finalRatioA"), n(parameters, "finalRatioB"));
        const originalA = finalA;
        const originalB = finalB + n(parameters, "valueRemoveB");
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
    case "electionWinnerVotes":
    case "electionMargin":
    case "electionTotalVotersFromMargin": {
      const voteRatioA = n(parameters, "voteRatioA");
      const voteRatioB = n(parameters, "voteRatioB");
      if (parameters.taskKind === "electionTotalVotersFromMargin") {
        const validVotes = n(parameters, "marginVotes") * (voteRatioA + voteRatioB) / Math.abs(voteRatioA - voteRatioB);
        const polledVotes = validVotes * 100 / n(parameters, "validPercent");
        const totalVoters = polledVotes * 100 / n(parameters, "turnoutPercent");
        return countResult(
          totalVoters,
          {
            turnoutPercent: n(parameters, "turnoutPercent"),
            validPercent: n(parameters, "validPercent"),
            voteRatio: `${voteRatioA}:${voteRatioB}`,
            validVotes: formatNumber(validVotes),
            polledVotes: formatNumber(polledVotes),
            result: formatNumber(totalVoters),
          },
          `${n(parameters, "marginVotes")}\\times\\frac{${voteRatioA + voteRatioB}}{${Math.abs(voteRatioA - voteRatioB)}}=${formatNumber(validVotes)}`,
        );
      }
      const polledVotes = n(parameters, "totalVoters") * n(parameters, "turnoutPercent") / 100;
      const validVotes = polledVotes * n(parameters, "validPercent") / 100;
      const winnerVotes = validVotes * Math.max(voteRatioA, voteRatioB) / (voteRatioA + voteRatioB);
      const loserVotes = validVotes * Math.min(voteRatioA, voteRatioB) / (voteRatioA + voteRatioB);
      const result = parameters.taskKind === "electionMargin" ? winnerVotes - loserVotes : winnerVotes;
      return countResult(
        result,
        {
          turnoutPercent: n(parameters, "turnoutPercent"),
          validPercent: n(parameters, "validPercent"),
          polledVotes: formatNumber(polledVotes),
          validVotes: formatNumber(validVotes),
          voteRatio: `${voteRatioA}:${voteRatioB}`,
          winnerVotes: formatNumber(winnerVotes),
          loserVotes: formatNumber(loserVotes),
          result: formatNumber(result),
        },
        parameters.taskKind === "electionMargin"
          ? `${formatNumber(winnerVotes)}-${formatNumber(loserVotes)}=${formatNumber(result)}`
          : `${formatNumber(validVotes)}\\times\\frac{${Math.max(voteRatioA, voteRatioB)}}{${voteRatioA + voteRatioB}}=${formatNumber(result)}`,
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
    case "incomeExpenditureSavings": {
      const solved = solveTwoEquationSystem(
        n(parameters, "incomeRatioA"),
        -n(parameters, "expRatioA"),
        n(parameters, "savingsA"),
        n(parameters, "incomeRatioB"),
        -n(parameters, "expRatioB"),
        n(parameters, "savingsB"),
      );
      const incomeA = n(parameters, "incomeRatioA") * solved.x;
      const incomeB = n(parameters, "incomeRatioB") * solved.x;
      const totalIncome = incomeA + incomeB;
      return countResult(
        totalIncome,
        {
          incomeRatio: `${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}`,
          expenditureRatio: `${n(parameters, "expRatioA")}:${n(parameters, "expRatioB")}`,
          incomeUnit: formatNumber(solved.x),
          expenditureUnit: formatNumber(solved.y),
          incomeA: formatNumber(incomeA),
          incomeB: formatNumber(incomeB),
          result: formatNumber(totalIncome),
        },
        `${n(parameters, "incomeRatioA")}x-${n(parameters, "expRatioA")}y=${n(parameters, "savingsA")},\\ ${n(parameters, "incomeRatioB")}x-${n(parameters, "expRatioB")}y=${n(parameters, "savingsB")}`,
      );
    }
    case "inverseChainWork":
    case "inverseChainSpeed": {
      if (parameters.variables.menA !== undefined) {
        const targetDays = n(parameters, "menA") * n(parameters, "daysA") / n(parameters, "menB");
        return countResult(
          targetDays,
          { workersA: n(parameters, "menA"), daysA: n(parameters, "daysA"), workersB: n(parameters, "menB"), result: formatNumber(targetDays) },
          `${n(parameters, "menA")}\\times${n(parameters, "daysA")}\\div${n(parameters, "menB")}=${formatNumber(targetDays)}`,
        );
      }
      if (parameters.variables.baseWorkers !== undefined) {
        const requiredWorkers = n(parameters, "baseWorkers") * n(parameters, "baseDays") * n(parameters, "workNumerator") / (n(parameters, "workDenominator") * n(parameters, "targetDays"));
        return countResult(
          requiredWorkers,
          { baseWorkers: n(parameters, "baseWorkers"), baseDays: n(parameters, "baseDays"), workFraction: `${n(parameters, "workNumerator")}/${n(parameters, "workDenominator")}`, targetDays: n(parameters, "targetDays"), result: formatNumber(requiredWorkers) },
          `${n(parameters, "baseWorkers")}\\times${n(parameters, "baseDays")}\\times\\frac{${n(parameters, "workNumerator")}}{${n(parameters, "workDenominator")}}\\div${n(parameters, "targetDays")}=${formatNumber(requiredWorkers)}`,
        );
      }
      if (parameters.variables.initialWorkers !== undefined) {
        const totalWork = n(parameters, "initialWorkers") * n(parameters, "originalDays");
        const completedWork = n(parameters, "initialWorkers") * n(parameters, "daysWorked");
        const remainingWork = totalWork - completedWork;
        const activeWorkers = parameters.variables.workerChangeDirection === "LEAVE"
          ? n(parameters, "remainingWorkers")
          : n(parameters, "initialWorkers") + n(parameters, "addedWorkers");
        const remainingDays = remainingWork / activeWorkers;
        return countResult(
          remainingDays,
          { totalWork: formatNumber(totalWork), completedWork: formatNumber(completedWork), remainingWork: formatNumber(remainingWork), activeWorkers: formatNumber(activeWorkers), result: formatNumber(remainingDays) },
          `${formatNumber(remainingWork)}\\div${formatNumber(activeWorkers)}=${formatNumber(remainingDays)}`,
        );
      }
      if (parameters.variables.speedRatioA !== undefined && parameters.answerType === "LOGIC") {
        const entries = [
          { label: String(parameters.variables.personA), speed: n(parameters, "speedRatioA") },
          { label: String(parameters.variables.personB), speed: n(parameters, "speedRatioB") },
          { label: String(parameters.variables.personC), speed: n(parameters, "speedRatioC") },
        ];
        const order = [...entries].sort((a, b) => a.speed - b.speed).map((entry) => entry.label).join(" > ");
        return logicResult(
          order,
          { speedRatio: `${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}:${n(parameters, "speedRatioC")}`, result: order },
          `\\text{Lower speed means higher time}\\Rightarrow ${order}`,
        );
      }
      if (parameters.variables.speedRatioA !== undefined && parameters.answerType === "RATIO") {
        const ratio = parameters.variables.fixedTimeMode === "YES"
          ? [n(parameters, "speedRatioA"), n(parameters, "speedRatioB")]
          : [n(parameters, "speedRatioB"), n(parameters, "speedRatioA")];
        return ratioResult(
          ratio,
          { speedRatio: `${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}`, result: formatRatio(ratio) },
          ratioLatex(simplifyRatio(ratio)),
        );
      }
      if (parameters.variables.workerRatioA !== undefined && parameters.variables.efficiencyRatioA !== undefined) {
        const daysA = n(parameters, "workerRatioB") * n(parameters, "efficiencyRatioB");
        const daysB = n(parameters, "workerRatioA") * n(parameters, "efficiencyRatioA");
        return ratioResult(
          [daysA, daysB],
          { workerRatio: `${n(parameters, "workerRatioA")}:${n(parameters, "workerRatioB")}`, efficiencyRatio: `${n(parameters, "efficiencyRatioA")}:${n(parameters, "efficiencyRatioB")}`, result: formatRatio([daysA, daysB]) },
          `${n(parameters, "workerRatioB")}\\times${n(parameters, "efficiencyRatioB")}:${n(parameters, "workerRatioA")}\\times${n(parameters, "efficiencyRatioA")}=${ratioLatex(simplifyRatio([daysA, daysB]))}`,
        );
      }
      if (parameters.variables.daysRatioA !== undefined && parameters.answerType === "LOGIC") {
        const efficiencyA = n(parameters, "workerRatioB") * n(parameters, "daysRatioB");
        const efficiencyB = n(parameters, "workerRatioA") * n(parameters, "daysRatioA");
        const result = efficiencyA > efficiencyB ? String(parameters.variables.personA) : efficiencyB > efficiencyA ? String(parameters.variables.personB) : "Equal";
        return logicResult(
          result,
          { workerRatio: `${n(parameters, "workerRatioA")}:${n(parameters, "workerRatioB")}`, daysRatio: `${n(parameters, "daysRatioA")}:${n(parameters, "daysRatioB")}`, efficiencyA: formatNumber(efficiencyA), efficiencyB: formatNumber(efficiencyB), result },
          `${formatNumber(efficiencyA)}:${formatNumber(efficiencyB)}\\Rightarrow\\text{${result}}`,
        );
      }
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
      if (parameters.variables.valueB !== undefined) {
        const targetTime = n(parameters, "valueB") * n(parameters, "ratioB") / n(parameters, "ratioA");
        return countResult(
          targetTime,
          { rateRatio: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`, knownTime: formatNumber(n(parameters, "valueB")), result: formatNumber(targetTime) },
          `${n(parameters, "valueB")}\\times\\frac{${n(parameters, "ratioB")}}{${n(parameters, "ratioA")}}=${formatNumber(targetTime)}`,
        );
      }
      if (parameters.answerType === "RATIO") {
        return ratioResult(
          [n(parameters, "ratioB"), n(parameters, "ratioA")],
          { rateRatio: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`, result: formatRatio([n(parameters, "ratioB"), n(parameters, "ratioA")]) },
          `${n(parameters, "ratioB")}:${n(parameters, "ratioA")}=${ratioLatex(simplifyRatio([n(parameters, "ratioB"), n(parameters, "ratioA")]))}`,
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
      if (parameters.variables.efficiencyPartA !== undefined) {
        const missingEfficiency = n(parameters, "outputRatioB") * n(parameters, "workerRatioA") * n(parameters, "hoursRatioA") * n(parameters, "efficiencyPartA")
          / (n(parameters, "outputRatioA") * n(parameters, "workerRatioB") * n(parameters, "hoursRatioB"));
        return countResult(
          missingEfficiency,
          { outputRatio: `${n(parameters, "outputRatioA")}:${n(parameters, "outputRatioB")}`, workerRatio: `${n(parameters, "workerRatioA")}:${n(parameters, "workerRatioB")}`, hoursRatio: `${n(parameters, "hoursRatioA")}:${n(parameters, "hoursRatioB")}`, result: formatNumber(missingEfficiency) },
          `\\frac{${n(parameters, "outputRatioB")}\\times${n(parameters, "workerRatioA")}\\times${n(parameters, "hoursRatioA")}\\times${n(parameters, "efficiencyPartA")}}{${n(parameters, "outputRatioA")}\\times${n(parameters, "workerRatioB")}\\times${n(parameters, "hoursRatioB")}}=${formatNumber(missingEfficiency)}`,
        );
      }
      if (parameters.variables.quantityRatioA !== undefined) {
        const rateA = n(parameters, "quantityRatioA") * n(parameters, "timeRatioB");
        const rateB = n(parameters, "quantityRatioB") * n(parameters, "timeRatioA");
        return ratioResult(
          [rateA, rateB],
          { quantityRatio: `${n(parameters, "quantityRatioA")}:${n(parameters, "quantityRatioB")}`, timeRatio: `${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")}`, result: formatRatio([rateA, rateB]) },
          `${n(parameters, "quantityRatioA")}\\times${n(parameters, "timeRatioB")}:${n(parameters, "quantityRatioB")}\\times${n(parameters, "timeRatioA")}=${ratioLatex(simplifyRatio([rateA, rateB]))}`,
        );
      }
      if (parameters.variables.machineRatioA !== undefined) {
        const effA = n(parameters, "outputRatioA") * n(parameters, "machineRatioB") * n(parameters, "hoursRatioB");
        const effB = n(parameters, "outputRatioB") * n(parameters, "machineRatioA") * n(parameters, "hoursRatioA");
        return ratioResult(
          [effA, effB],
          { outputRatio: `${n(parameters, "outputRatioA")}:${n(parameters, "outputRatioB")}`, machineRatio: `${n(parameters, "machineRatioA")}:${n(parameters, "machineRatioB")}`, hoursRatio: `${n(parameters, "hoursRatioA")}:${n(parameters, "hoursRatioB")}`, result: formatRatio([effA, effB]) },
          `${n(parameters, "outputRatioA")}\\times${n(parameters, "machineRatioB")}\\times${n(parameters, "hoursRatioB")}:${n(parameters, "outputRatioB")}\\times${n(parameters, "machineRatioA")}\\times${n(parameters, "hoursRatioA")}=${ratioLatex(simplifyRatio([effA, effB]))}`,
        );
      }
      if (parameters.variables.daysRatioA !== undefined) {
        const effA = n(parameters, "workerRatioB") * n(parameters, "daysRatioB");
        const effB = n(parameters, "workerRatioA") * n(parameters, "daysRatioA");
        return ratioResult(
          [effA, effB],
          { workerRatio: `${n(parameters, "workerRatioA")}:${n(parameters, "workerRatioB")}`, daysRatio: `${n(parameters, "daysRatioA")}:${n(parameters, "daysRatioB")}`, result: formatRatio([effA, effB]) },
          `${n(parameters, "workerRatioB")}\\times${n(parameters, "daysRatioB")}:${n(parameters, "workerRatioA")}\\times${n(parameters, "daysRatioA")}=${ratioLatex(simplifyRatio([effA, effB]))}`,
        );
      }
      if (parameters.variables.workerRatioA !== undefined && parameters.variables.hoursRatioA !== undefined && parameters.variables.efficiencyRatioA !== undefined) {
        const productA = n(parameters, "workerRatioA") * n(parameters, "hoursRatioA") * n(parameters, "efficiencyRatioA");
        const productB = n(parameters, "workerRatioB") * n(parameters, "hoursRatioB") * n(parameters, "efficiencyRatioB");
        return ratioResult(
          [productA, productB],
          { workerRatio: `${n(parameters, "workerRatioA")}:${n(parameters, "workerRatioB")}`, hoursRatio: `${n(parameters, "hoursRatioA")}:${n(parameters, "hoursRatioB")}`, efficiencyRatio: `${n(parameters, "efficiencyRatioA")}:${n(parameters, "efficiencyRatioB")}`, productRatio: formatRatio([productA, productB]) },
          `${n(parameters, "workerRatioA")}\\times${n(parameters, "hoursRatioA")}\\times${n(parameters, "efficiencyRatioA")}:${n(parameters, "workerRatioB")}\\times${n(parameters, "hoursRatioB")}\\times${n(parameters, "efficiencyRatioB")}=${ratioLatex(simplifyRatio([productA, productB]))}`,
        );
      }
      if (parameters.variables.workerRatioA !== undefined && parameters.variables.efficiencyRatioA !== undefined) {
        const timeA = n(parameters, "workerRatioB") * n(parameters, "efficiencyRatioB");
        const timeB = n(parameters, "workerRatioA") * n(parameters, "efficiencyRatioA");
        return ratioResult(
          [timeA, timeB],
          { workerRatio: `${n(parameters, "workerRatioA")}:${n(parameters, "workerRatioB")}`, efficiencyRatio: `${n(parameters, "efficiencyRatioA")}:${n(parameters, "efficiencyRatioB")}`, result: formatRatio([timeA, timeB]) },
          `${n(parameters, "workerRatioB")}\\times${n(parameters, "efficiencyRatioB")}:${n(parameters, "workerRatioA")}\\times${n(parameters, "efficiencyRatioA")}=${ratioLatex(simplifyRatio([timeA, timeB]))}`,
        );
      }
      if (parameters.variables.efficiencyRatioA !== undefined) {
        const productA = n(parameters, "efficiencyRatioA") * n(parameters, "timeRatioA");
        const productB = n(parameters, "efficiencyRatioB") * n(parameters, "timeRatioB");
        return ratioResult(
          [productA, productB],
          { efficiencyRatio: `${n(parameters, "efficiencyRatioA")}:${n(parameters, "efficiencyRatioB")}`, timeRatio: `${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")}`, productRatio: formatRatio([productA, productB]) },
          `${n(parameters, "efficiencyRatioA")}\\times${n(parameters, "timeRatioA")}:${n(parameters, "efficiencyRatioB")}\\times${n(parameters, "timeRatioB")}=${ratioLatex(simplifyRatio([productA, productB]))}`,
        );
      }
      const productA = n(parameters, "ratioA") * n(parameters, "timeRatioA");
      const productB = n(parameters, "ratioB") * n(parameters, "timeRatioB");
      return ratioResult(
        [productA, productB],
        { rateRatio: `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`, timeRatio: `${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")}`, productRatio: formatRatio([productA, productB]) },
        `${n(parameters, "ratioA")}\\times${n(parameters, "timeRatioA")}:${n(parameters, "ratioB")}\\times${n(parameters, "timeRatioB")}=${ratioLatex(simplifyRatio([productA, productB]))}`,
      );
    }
    case "sdtTimeRatioFromSpeedDistance": {
      const timeA = n(parameters, "distanceRatioA") * n(parameters, "speedRatioB");
      const timeB = n(parameters, "distanceRatioB") * n(parameters, "speedRatioA");
      return ratioResult(
        [timeA, timeB],
        {
          speedRatio: `${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")}`,
          distanceRatio: `${n(parameters, "distanceRatioA")}:${n(parameters, "distanceRatioB")}`,
          timeRatio: formatRatio([timeA, timeB]),
        },
        `${n(parameters, "distanceRatioA")}\\times${n(parameters, "speedRatioB")}:${n(parameters, "distanceRatioB")}\\times${n(parameters, "speedRatioA")}=${ratioLatex(simplifyRatio([timeA, timeB]))}`,
      );
    }
    case "sdtRaceLead": {
      const loserDistance = n(parameters, "raceLength") - n(parameters, "leadDistance");
      return ratioResult(
        [n(parameters, "raceLength"), loserDistance],
        {
          raceLength: n(parameters, "raceLength"),
          leadDistance: n(parameters, "leadDistance"),
          loserDistance: formatNumber(loserDistance),
          speedRatio: formatRatio([n(parameters, "raceLength"), loserDistance]),
        },
        `${n(parameters, "raceLength")}:${formatNumber(loserDistance)}=${ratioLatex(simplifyRatio([n(parameters, "raceLength"), loserDistance]))}`,
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
