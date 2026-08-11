import { APPROVED_TIME_YEAR_POOL } from "./cp001-parameter-generator";
import { deterministicIndex } from "./prng";
import {
  addRational,
  divideRational,
  multiplyRational,
  rationalKey,
} from "./rational";
import type { IntCp001PrototypeParameters, SimpleInterestState } from "./types";

function rebuildState(
  source: SimpleInterestState,
  timeYears: SimpleInterestState["timeYears"],
): SimpleInterestState {
  const simpleInterest = multiplyRational(
    multiplyRational(source.principal, source.annualRate),
    timeYears,
  );
  return {
    ...source,
    timeYears,
    simpleInterest,
    amount: addRational(source.principal, simpleInterest),
  };
}

/**
 * The initial money-state pool favours whole-year examples. The two duration
 * inverses below do not display the hidden money values, so they can safely use
 * the chapter's full approved exact duration domain, including half years.
 */
export function expandIntCp001TimeInverseState(
  parameters: IntCp001PrototypeParameters,
): IntCp001PrototypeParameters {
  if (
    parameters.prototypeId !== "INT-CP001-PROT-TIME-FROM-AMOUNT-MULTIPLE"
    && parameters.prototypeId !== "INT-CP001-PROT-TIME-FROM-INTEREST-MULTIPLE"
  ) {
    return parameters;
  }

  const timeYears = APPROVED_TIME_YEAR_POOL[
    deterministicIndex(`${parameters.prototypeId}:${parameters.seed}:expanded-time`, APPROVED_TIME_YEAR_POOL.length)
  ]!;
  const hiddenState = rebuildState(parameters.hiddenState, timeYears);

  if (parameters.prototypeId === "INT-CP001-PROT-TIME-FROM-AMOUNT-MULTIPLE") {
    const amountMultiple = divideRational(hiddenState.amount, hiddenState.principal);
    return {
      ...parameters,
      hiddenState,
      request: {
        mode: "TIME_FROM_AMOUNT_MULTIPLE",
        amountMultiple,
        annualRatePercent: hiddenState.annualRatePercent,
      },
      display: {
        ...parameters.display,
        amountMultiple,
      },
      generationFingerprint: [
        parameters.generationFingerprint,
        "expanded-time",
        rationalKey(timeYears),
        rationalKey(amountMultiple),
      ].join("::"),
    };
  }

  const interestToPrincipalRatio = divideRational(
    hiddenState.simpleInterest,
    hiddenState.principal,
  );
  return {
    ...parameters,
    hiddenState,
    request: {
      mode: "TIME_FROM_INTEREST_MULTIPLE",
      interestToPrincipalRatio,
      annualRatePercent: hiddenState.annualRatePercent,
    },
    display: {
      ...parameters.display,
      interestToPrincipalRatio,
    },
    generationFingerprint: [
      parameters.generationFingerprint,
      "expanded-time",
      rationalKey(timeYears),
      rationalKey(interestToPrincipalRatio),
    ].join("::"),
  };
}
