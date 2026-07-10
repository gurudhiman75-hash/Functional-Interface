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

function localizedIntro(parameters: Rap002Parameters, en: string, hi: string, pa: string) {
  if (parameters.language === "hi") return hi;
  if (parameters.language === "pa") return pa;
  return en;
}

function renderRap002ExplanationDraft(parameters: Rap002Parameters, solver: Rap002SolverResult): Rap002Explanation {
  if (
    parameters.taskKind === "electionWinnerVotes"
    || parameters.taskKind === "electionMargin"
    || parameters.taskKind === "electionTotalVotersFromMargin"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "Problem: move through voters, polled votes, valid votes, then the candidate ratio.",
          "चुनाव श्रृंखला में चलें: कुल मतदाता, डाले गए मत, वैध मत, फिर उम्मीदवारों का अनुपात.",
          "ਚੋਣ ਲੜੀ ਅਨੁਸਾਰ ਚਲੋ: ਕੁੱਲ ਵੋਟਰ, ਪਈਆਂ ਵੋਟਾਂ, ਵੈਧ ਵੋਟਾਂ, ਫਿਰ ਉਮੀਦਵਾਰਾਂ ਦਾ ਅਨੁਪਾਤ.",
        ),
        block(`\\text{Turnout}=${n(parameters, "turnoutPercent")}\\%,\\ \\text{Valid}=${n(parameters, "validPercent")}\\%`),
        block(`\\text{Vote ratio}=${n(parameters, "voteRatioA")}:${n(parameters, "voteRatioB")}`),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (parameters.taskKind === "incomeExpenditureSavings") {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "Problem: use the income ratio and expenditure ratio together; savings are income minus expenditure.",
          "दो जुड़ी प्रणालियां लें: आय अनुपात और व्यय अनुपात. बचत = आय - व्यय.",
          "ਦੋ ਜੁੜੀਆਂ ਪ੍ਰਣਾਲੀਆਂ ਵਰਤੋ: ਆਮਦਨ ਅਨੁਪਾਤ ਅਤੇ ਖਰਚ ਅਨੁਪਾਤ. ਬਚਤ = ਆਮਦਨ - ਖਰਚ.",
        ),
        block(`\\text{Income ratio}=${n(parameters, "incomeRatioA")}:${n(parameters, "incomeRatioB")}`),
        block(`\\text{Expenditure ratio}=${n(parameters, "expRatioA")}:${n(parameters, "expRatioB")}`),
        block(`\\text{Savings}=${n(parameters, "savingsA")},\\ ${n(parameters, "savingsB")}`),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (parameters.taskKind === "sdtTimeRatioFromSpeedDistance" || parameters.taskKind === "sdtRaceLead") {
    return {
      explanationId: parameters.explanationId,
      lines: [
        localizedIntro(
          parameters,
          "Problem: use the speed-distance-time relation; time is proportional to distance divided by speed.",
          "गति-दूरी-समय संबंध लगाएं. समय दूरी को गति से भाग देने के समानुपाती होता है.",
          "ਗਤੀ-ਦੂਰੀ-ਸਮਾਂ ਸੰਬੰਧ ਵਰਤੋ. ਸਮਾਂ ਦੂਰੀ ਨੂੰ ਗਤੀ ਨਾਲ ਭਾਗ ਦੇਣ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ.",
        ),
        parameters.taskKind === "sdtRaceLead"
          ? block(`\\text{Distances covered}=${n(parameters, "raceLength")}:${n(parameters, "raceLength") - n(parameters, "leadDistance")}`)
          : block(`\\text{Speed ratio}=${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")},\\ \\text{Distance ratio}=${n(parameters, "distanceRatioA")}:${n(parameters, "distanceRatioB")}`),
        localizedIntro(parameters, "Method 1: form time as distance divided by speed, then reduce.", "अब प्राप्त अनुपात को सरल करें.", "ਹੁਣ ਮਿਲੇ ਅਨੁਪਾਤ ਨੂੰ ਸਰਲ ਕਰੋ."),
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "chainOrdering"
    || parameters.taskKind === "chainInequality"
    || parameters.taskKind === "chainEquivalence"
  ) {
    return {
      explanationId: parameters.explanationId,
      lines: [
        "Problem: normalize the linked ratios into comparable values.",
        block(`\\text{Comparable form}=${String(solver.workingValues.chain ?? solver.workingValues.ratios)}`),
        "Method 1: compare the aligned parts directly.",
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "inverseChainWork"
    || parameters.taskKind === "inverseChainSpeed"
    || parameters.taskKind === "combinedInverseChain"
  ) {
    if (parameters.taskKind === "combinedInverseChain") {
      const ratioLine =
        solver.workingValues.workerRatio
          ? `\\text{Worker ratio}=${String(solver.workingValues.workerRatio)}`
          : solver.workingValues.machineRatio
            ? `\\text{Machine ratio}=${String(solver.workingValues.machineRatio)}`
            : solver.workingValues.quantityRatio
              ? `\\text{Quantity ratio}=${String(solver.workingValues.quantityRatio)}`
              : solver.workingValues.outputRatio
                ? `\\text{Output ratio}=${String(solver.workingValues.outputRatio)}`
                : solver.workingValues.efficiencyRatio
                  ? `\\text{Efficiency ratio}=${String(solver.workingValues.efficiencyRatio)}`
                : `${s(parameters, "personA")}:${s(parameters, "personB")}=${String(solver.workingValues.rateRatio ?? `${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`)}`;
      const secondLine =
        solver.workingValues.hoursRatio
          ? `\\text{Hours ratio}=${String(solver.workingValues.hoursRatio)}`
          : solver.workingValues.daysRatio
            ? `\\text{Days ratio}=${String(solver.workingValues.daysRatio)}`
            : solver.workingValues.timeRatio
              ? `\\text{Time ratio}=${String(solver.workingValues.timeRatio)}`
            : solver.workingValues.efficiencyRatio
              ? `\\text{Efficiency ratio}=${String(solver.workingValues.efficiencyRatio)}`
              : `\\text{Time ratio}=${String(solver.workingValues.timeRatio ?? `${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")}`)}`;
      return {
        explanationId: parameters.explanationId,
        lines: [
          "Problem: multiply direct factors and invert the factor that works in the opposite direction.",
          block(ratioLine),
          block(secondLine),
          solver.workingValues.efficiencyRatio && solver.workingValues.hoursRatio
            ? block(`\\text{Efficiency ratio}=${String(solver.workingValues.efficiencyRatio)}`)
            : "Step 1: write each side using the factors given in the question.",
          block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
          block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
        ],
      };
    }

    const firstLine = parameters.variables.ratioA1 !== undefined
      ? block(`${s(parameters, "personA")}:${s(parameters, "personB")}:${s(parameters, "personC")}=${String(solver.workingValues.alignedChain)}`)
      : solver.workingValues.speedRatio
        ? block(`\\text{Speed ratio}=${String(solver.workingValues.speedRatio)}`)
        : solver.workingValues.workerRatio
          ? block(`\\text{Worker ratio}=${String(solver.workingValues.workerRatio)}`)
          : solver.workingValues.rateRatio
            ? block(`\\text{Rate ratio}=${String(solver.workingValues.rateRatio)}`)
            : parameters.variables.initialWorkers !== undefined
              ? block(`\\text{Total work units}=${String(solver.workingValues.totalWork)}`)
              : parameters.variables.baseWorkers !== undefined
                ? block(`\\text{Full work units}=${n(parameters, "baseWorkers")}\\times${n(parameters, "baseDays")}`)
              : parameters.variables.menA !== undefined
                ? block(`\\text{Work units}=${n(parameters, "menA")}\\times${n(parameters, "daysA")}`)
                : block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`);
    const methodLine = parameters.answerType === "LOGIC"
      ? "Method 1: for the same work or distance, the lower rate takes more time."
      : parameters.answerType === "RATIO"
        ? "Method 1: invert the rate/product ratio when time is being compared."
        : "Method 1: use inverse scaling from the known work, workers, or time.";

    return {
      explanationId: parameters.explanationId,
      lines: [
        "Problem: for fixed work or fixed distance, time varies inversely with rate.",
        firstLine,
        methodLine,
        block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
        block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
      ],
    };
  }

  if (
    parameters.taskKind === "nestedPartition"
    || parameters.taskKind === "conditionalDistribution"
    || parameters.taskKind === "weightedNestedPartition"
  ) {
    const branchName = String(parameters.variables.branchPart ?? "A") === "B"
      ? s(parameters, "personB")
      : s(parameters, "personA");
    const intro = parameters.taskKind === "weightedNestedPartition"
      ? "Problem: divide the total by the main ratio, split the selected branch, then apply weights."
      : parameters.taskKind === "conditionalDistribution"
        ? "Problem: check the selected branch after the main split, then divide that branch by the second ratio."
        : "Problem: divide the total by the main ratio, then subdivide the selected branch by the second ratio.";

    return {
      explanationId: parameters.explanationId,
      lines: [
        intro,
        block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`),
        `Step 1: the selected branch is ${branchName}, whose share is ${String(solver.workingValues.branchShare)}.`,
        block(`${s(parameters, "personC")}:${s(parameters, "personD")}=${n(parameters, "subRatioC")}:${n(parameters, "subRatioD")}`),
        `Step 2: after the second split, the values are ${String(solver.workingValues.subShares)}.`,
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
    const labels = `${s(parameters, "personA")} and ${s(parameters, "personB")}`;
    const isCountReverse = parameters.taskKind === "reconstructOriginalRatio" && parameters.answerType === "COUNT";
    const operationText =
      parameters.variables.commonAdd !== undefined
        ? `add ${n(parameters, "commonAdd")} to both values`
        : parameters.variables.commonRemove !== undefined
          ? `remove ${n(parameters, "commonRemove")} from both values`
          : parameters.variables.valueAddA !== undefined && parameters.variables.finalValueA === undefined
            ? `add ${n(parameters, "valueAddA")} to ${s(parameters, "personA")}`
            : parameters.variables.valueAddB !== undefined
              ? `add ${n(parameters, "valueAddB")} to ${s(parameters, "personB")}`
              : parameters.variables.valueRemoveA !== undefined
                ? `remove ${n(parameters, "valueRemoveA")} from ${s(parameters, "personA")}`
                : parameters.variables.valueRemoveB !== undefined
                  ? `remove ${n(parameters, "valueRemoveB")} from ${s(parameters, "personB")}`
                  : parameters.variables.transferValue !== undefined
                    ? `transfer ${n(parameters, "transferValue")} according to the direction`
                    : "use the changed final ratio";

    if (isCountReverse) {
      return {
        explanationId: parameters.explanationId,
        lines: [
          `Problem: find the missing amount by comparing the starting information with the final ratio for ${labels}.`,
          solver.workingValues.initialRatio
            ? block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${String(solver.workingValues.initialRatio)}`)
            : block(`\\text{Final ratio}=${String(solver.workingValues.finalRatio)}`),
          solver.workingValues.initialA
            ? `Step 1: convert the starting ratio into actual values: ${s(parameters, "personA")} = ${String(solver.workingValues.initialA)} and ${s(parameters, "personB")} = ${String(solver.workingValues.initialB)}.`
            : `Step 1: use the final value and final ratio to recover the final values: ${s(parameters, "personA")} = ${String(solver.workingValues.finalA)} and ${s(parameters, "personB")} = ${String(solver.workingValues.finalB)}.`,
          `Step 2: set up the reverse calculation from the final ratio. This gives ${String(solver.workingValues.result)}.`,
          block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
          block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
        ],
      };
    }

    return {
      explanationId: parameters.explanationId,
      lines: [
        parameters.taskKind === "reconstructOriginalRatio"
          ? "Problem: work backward from the final ratio and undo the stated operation."
          : `Problem: convert the starting ratio into actual values, then ${operationText}.`,
        solver.workingValues.initialRatio
          ? block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${String(solver.workingValues.initialRatio)}`)
          : block(`\\text{Final ratio}=${String(solver.workingValues.finalRatio)}`),
        solver.workingValues.initialA
          ? `Step 1: the starting values are ${s(parameters, "personA")} = ${String(solver.workingValues.initialA)} and ${s(parameters, "personB")} = ${String(solver.workingValues.initialB)}.`
          : `Step 1: after undoing the change, the original values are ${s(parameters, "personA")} = ${String(solver.workingValues.originalA)} and ${s(parameters, "personB")} = ${String(solver.workingValues.originalB)}.`,
        solver.workingValues.finalA
          ? `Step 2: after the change, the values become ${String(solver.workingValues.finalA)} and ${String(solver.workingValues.finalB)}.`
          : "Step 2: reduce the recovered original values to the simplest ratio.",
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
      ? `Method 1: use the known endpoint value to find the common multiplier, then apply it to ${s(parameters, "personB")}.`
      : parameters.taskKind === "reverseEndpointFinding"
        ? `Method 1: use the known value of ${s(parameters, "personB")} to find the common multiplier, then apply it to the required endpoint.`
        : String(parameters.variables.constraintKind ?? "difference") === "total"
          ? "Method 1: use the given total to find the common multiplier for the full chain."
          : `Method 1: use the endpoint difference between ${s(parameters, "personA")} and ${s(parameters, "personC")} to find the common multiplier.`;

    return {
      explanationId: parameters.explanationId,
      lines: [
        `Problem: align the two linked ratios through the common term ${s(parameters, "personB")}.`,
        block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA1")}:${n(parameters, "ratioB1")},\\ ${s(parameters, "personB")}:${s(parameters, "personC")}=${n(parameters, "ratioB2")}:${n(parameters, "ratioC2")}`),
        `Step 1: the aligned chain is ${aligned.join(":")}.`,
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
        `Problem: make the shared term ${s(parameters, "personB")} equal in both ratios.`,
        block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA1")}:${n(parameters, "ratioB1")},\\ ${s(parameters, "personB")}:${s(parameters, "personC")}=${n(parameters, "ratioB2")}:${n(parameters, "ratioC2")}`),
        `Step 1: after alignment, the chain becomes ${aligned.join(":")}.`,
        block(`${s(parameters, "personA")}:${s(parameters, "personB")}:${s(parameters, "personC")}=${ratioLatex(aligned)}`),
        `Answer: the aligned value of ${s(parameters, "personB")} is ${solver.answer.replaceAll("$$", "")}.`,
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
      ? `Method 2: read the required pair from the common chain: ${String(parameters.variables.targetPairLabel ?? "selected pair")}.`
      : "Method 2: read the full four-part chain.";

  return {
    explanationId: parameters.explanationId,
    lines: [
      "Problem: align the common terms in the linked ratios.",
      block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA1")}:${n(parameters, "ratioB1")},\\ ${s(parameters, "personB")}:${s(parameters, "personC")}=${n(parameters, "ratioB2")}:${n(parameters, "ratioC2")},\\ ${s(parameters, "personC")}:${s(parameters, "personD")}=${n(parameters, "ratioC3")}:${n(parameters, "ratioD3")}`),
      `Step 1: the common chain is ${fullChain.join(":")}.`,
      block(`${s(parameters, "personA")}:${s(parameters, "personB")}:${s(parameters, "personC")}:${s(parameters, "personD")}=${ratioLatex(fullChain)}`),
      targetLine,
      block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
    ],
  };
}

function answerContext(parameters: Rap002Parameters) {
  if (parameters.answerType === "RATIO") return "required ratio";
  if (parameters.answerType === "COUNT") return "required value";
  return "correct conclusion";
}

function polishExplanation(
  parameters: Rap002Parameters,
  solver: Rap002SolverResult,
  draft: Rap002Explanation,
  reason: string,
  check: string,
): Rap002Explanation {
  if (parameters.language !== "en") return draft;
  const answer = solver.answer.replaceAll("$$", "");
  const lines = draft.lines.map((line) => line
    .replace(/^Problem:/, "Concept:")
    .replace(/^Method 1:/, "Method:")
    .replace(/^Method 2:/, "Extraction:")
    .replace(/\\text\{Calculation\}=/g, "\\text{Decisive equation}=")
    .replace(/^\$\$\\text\{Answer\}=.*\$\$$/, `Final answer: the ${answerContext(parameters)} is ${answer}.`)
    .replace(/^Answer:/, "Final answer:"));
  lines.splice(1, 0, `Why this method works: ${reason}`);
  lines.push(`Quick check: ${check}`);
  return { ...draft, lines };
}

function renderChainAlignmentExplanation(parameters: Rap002Parameters, solver: Rap002SolverResult) {
  return polishExplanation(parameters, solver, renderRap002ExplanationDraft(parameters, solver),
    "a shared entity represents one quantity, so its ratio part must be equal before the chains can be joined.",
    "the extracted pair or full chain reproduces every ratio given in the stem.");
}

function renderReverseChainExplanation(parameters: Rap002Parameters, solver: Rap002SolverResult) {
  return polishExplanation(parameters, solver, renderRap002ExplanationDraft(parameters, solver),
    "the aligned ratio converts the known total, difference, or actual value into one common ratio unit.",
    "substituting the recovered value into the aligned chain restores the stated constraint.");
}

function renderTransformationExplanation(parameters: Rap002Parameters, solver: Rap002SolverResult) {
  return polishExplanation(parameters, solver, renderRap002ExplanationDraft(parameters, solver),
    "ratio parts must first be converted into actual values so additions, removals, and transfers act on quantities rather than symbols.",
    "the final values have the stated total and simplify to the required final ratio.");
}

function renderNestedPartitionExplanation(parameters: Rap002Parameters, solver: Rap002SolverResult) {
  return polishExplanation(parameters, solver, renderRap002ExplanationDraft(parameters, solver),
    "the second ratio divides only its parent branch, not the original total.",
    "the subshares add back to their parent branch and the main branches add back to the total.");
}

function renderInverseChainExplanation(parameters: Rap002Parameters, solver: Rap002SolverResult) {
  return polishExplanation(parameters, solver, renderRap002ExplanationDraft(parameters, solver),
    "for fixed work or distance, increasing the rate factor reduces the required time in the same proportion.",
    "the relevant rate-time or worker-day product remains constant.");
}

function renderComparisonExplanation(parameters: Rap002Parameters, solver: Rap002SolverResult) {
  return polishExplanation(parameters, solver, renderRap002ExplanationDraft(parameters, solver),
    "ordering, inequality, and equivalence are valid only after all quantities are placed on one comparable scale.",
    "the aligned values directly support the stated order, comparison, or equivalence result.");
}

export function renderRap002Explanation(parameters: Rap002Parameters, solver: Rap002SolverResult): Rap002Explanation {
  if (["chainAlignment", "extendedChainAlignment", "missingChainRatio"].includes(parameters.taskKind)) {
    return renderChainAlignmentExplanation(parameters, solver);
  }
  if (["reverseMiddleFinding", "reverseEndpointFinding", "constrainedReverseChain"].includes(parameters.taskKind)) {
    return renderReverseChainExplanation(parameters, solver);
  }
  if (["successiveRatioChange", "transferTracking", "reconstructOriginalRatio"].includes(parameters.taskKind)) {
    return renderTransformationExplanation(parameters, solver);
  }
  if (["nestedPartition", "conditionalDistribution", "weightedNestedPartition", "incomeExpenditureSavings"].includes(parameters.taskKind)) {
    return renderNestedPartitionExplanation(parameters, solver);
  }
  if (["inverseChainWork", "inverseChainSpeed", "combinedInverseChain", "sdtTimeRatioFromSpeedDistance", "sdtRaceLead"].includes(parameters.taskKind)) {
    return renderInverseChainExplanation(parameters, solver);
  }
  if (["chainOrdering", "chainInequality", "chainEquivalence"].includes(parameters.taskKind)) {
    return renderComparisonExplanation(parameters, solver);
  }
  return polishExplanation(parameters, solver, renderRap002ExplanationDraft(parameters, solver),
    "the quantities must be converted to a common comparable basis before the requested value is extracted.",
    "the result satisfies the numerical relation stated in the question.");
}
