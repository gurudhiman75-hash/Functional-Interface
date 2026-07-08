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

export function renderRap002Explanation(parameters: Rap002Parameters, solver: Rap002SolverResult): Rap002Explanation {
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
          "Move through the election chain: total voters, polled votes, valid votes, then candidate ratio.",
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
          "Use two linked systems: income ratio and expenditure ratio. Savings are income minus expenditure.",
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
          "Use the speed-distance-time relation. Time is proportional to distance divided by speed.",
          "गति-दूरी-समय संबंध लगाएं. समय दूरी को गति से भाग देने के समानुपाती होता है.",
          "ਗਤੀ-ਦੂਰੀ-ਸਮਾਂ ਸੰਬੰਧ ਵਰਤੋ. ਸਮਾਂ ਦੂਰੀ ਨੂੰ ਗਤੀ ਨਾਲ ਭਾਗ ਦੇਣ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ.",
        ),
        parameters.taskKind === "sdtRaceLead"
          ? block(`\\text{Distances covered}=${n(parameters, "raceLength")}:${n(parameters, "raceLength") - n(parameters, "leadDistance")}`)
          : block(`\\text{Speed ratio}=${n(parameters, "speedRatioA")}:${n(parameters, "speedRatioB")},\\ \\text{Distance ratio}=${n(parameters, "distanceRatioA")}:${n(parameters, "distanceRatioB")}`),
        localizedIntro(parameters, "Now simplify the resulting ratio.", "अब प्राप्त अनुपात को सरल करें.", "ਹੁਣ ਮਿਲੇ ਅਨੁਪਾਤ ਨੂੰ ਸਰਲ ਕਰੋ."),
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
        "First normalize the given ratio information into comparable values.",
        block(`\\text{Comparable form}=${String(solver.workingValues.chain ?? solver.workingValues.ratios)}`),
        "Now compare or simplify the requested values.",
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
      return {
        explanationId: parameters.explanationId,
        lines: [
          "For combined proportional quantities, multiply the rate ratio by the time ratio side by side.",
          block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`),
          block(`\\text{Time ratio}=${n(parameters, "timeRatioA")}:${n(parameters, "timeRatioB")}`),
          block(`\\text{Calculation}=${solver.mathJax.calculationLatex}`),
          block(`\\text{Answer}=${solver.answer.replaceAll("$$", "")}`),
        ],
      };
    }

    return {
      explanationId: parameters.explanationId,
      lines: [
        "For a fixed work or fixed distance, the time ratio is inverse to the worker, efficiency, or speed ratio.",
        parameters.variables.ratioA1 !== undefined
          ? block(`${s(parameters, "personA")}:${s(parameters, "personB")}:${s(parameters, "personC")}=${String(solver.workingValues.alignedChain)}`)
          : block(`${s(parameters, "personA")}:${s(parameters, "personB")}=${n(parameters, "ratioA")}:${n(parameters, "ratioB")}`),
        "Use the inverse relation to scale the known time.",
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
