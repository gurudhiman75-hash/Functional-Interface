import {
  addRationals,
  compareRationals,
  divideRationals,
  exactRational,
  floorRational,
  moduloRational,
  multiplyRationals,
  rationalsEqual,
  subtractRationals,
  type ExactRational,
  type ExactRationalInput,
} from "./rational";
import { ceilRational } from "./rational-extra";

export type ClockRateDirection = "GAIN" | "LOSS";

export interface AffineFaultyClockModel {
  actualAnchorSeconds: ExactRational;
  displayedAnchorSeconds: ExactRational;
  rateDisplayedPerActual: ExactRational;
}

export interface FaultyClockMappingProof {
  actualSeconds: ExactRational;
  displayedSeconds: ExactRational;
  reconstructedActualSeconds: ExactRational;
  agreement: boolean;
}

export function affineFaultyClockModel(input: {
  actualAnchorSeconds?: ExactRationalInput;
  displayedAnchorSeconds?: ExactRationalInput;
  rateDisplayedPerActual: ExactRationalInput;
}): AffineFaultyClockModel {
  const actualAnchorSeconds = typeof input.actualAnchorSeconds === "object"
    ? exactRational(
        input.actualAnchorSeconds.numerator,
        input.actualAnchorSeconds.denominator,
      )
    : exactRational(input.actualAnchorSeconds ?? 0);
  const displayedAnchorSeconds = typeof input.displayedAnchorSeconds === "object"
    ? exactRational(
        input.displayedAnchorSeconds.numerator,
        input.displayedAnchorSeconds.denominator,
      )
    : exactRational(input.displayedAnchorSeconds ?? actualAnchorSeconds.numerator, input.displayedAnchorSeconds === undefined ? actualAnchorSeconds.denominator : 1);
  const rateDisplayedPerActual = typeof input.rateDisplayedPerActual === "object"
    ? exactRational(
        input.rateDisplayedPerActual.numerator,
        input.rateDisplayedPerActual.denominator,
      )
    : exactRational(input.rateDisplayedPerActual);

  if (compareRationals(rateDisplayedPerActual, 0) <= 0) {
    throw new Error("Faulty-clock rate must be positive.");
  }

  return {
    actualAnchorSeconds,
    displayedAnchorSeconds,
    rateDisplayedPerActual,
  };
}

export function clockRateFromGainLoss(input: {
  direction: ClockRateDirection;
  errorUnits: ExactRationalInput;
  actualPeriodUnits: ExactRationalInput;
}): ExactRational {
  if (compareRationals(input.actualPeriodUnits, 0) <= 0) {
    throw new Error("Faulty-clock rate period must be positive.");
  }
  if (compareRationals(input.errorUnits, 0) < 0) {
    throw new Error("Faulty-clock gain/loss magnitude must not be negative.");
  }
  const displayedUnits = input.direction === "GAIN"
    ? addRationals(input.actualPeriodUnits, input.errorUnits)
    : subtractRationals(input.actualPeriodUnits, input.errorUnits);
  if (compareRationals(displayedUnits, 0) <= 0) {
    throw new Error("Faulty-clock loss would produce a non-positive rate.");
  }
  return divideRationals(displayedUnits, input.actualPeriodUnits);
}

export function displayedTimeFromActualExact(
  model: AffineFaultyClockModel,
  actualSeconds: ExactRationalInput,
): ExactRational {
  return addRationals(
    model.displayedAnchorSeconds,
    multiplyRationals(
      model.rateDisplayedPerActual,
      subtractRationals(actualSeconds, model.actualAnchorSeconds),
    ),
  );
}

export function actualTimeFromDisplayedExact(
  model: AffineFaultyClockModel,
  displayedSeconds: ExactRationalInput,
): ExactRational {
  return addRationals(
    model.actualAnchorSeconds,
    divideRationals(
      subtractRationals(displayedSeconds, model.displayedAnchorSeconds),
      model.rateDisplayedPerActual,
    ),
  );
}

export function verifyFaultyClockMappingExact(
  model: AffineFaultyClockModel,
  actualSeconds: ExactRationalInput,
): FaultyClockMappingProof {
  const displayedSeconds = displayedTimeFromActualExact(model, actualSeconds);
  const reconstructedActualSeconds = actualTimeFromDisplayedExact(
    model,
    displayedSeconds,
  );
  return {
    actualSeconds: typeof actualSeconds === "object"
      ? exactRational(actualSeconds.numerator, actualSeconds.denominator)
      : exactRational(actualSeconds),
    displayedSeconds,
    reconstructedActualSeconds,
    agreement: rationalsEqual(actualSeconds, reconstructedActualSeconds),
  };
}

export function faultyClockErrorAtActualExact(
  model: AffineFaultyClockModel,
  actualSeconds: ExactRationalInput,
): ExactRational {
  return subtractRationals(
    displayedTimeFromActualExact(model, actualSeconds),
    actualSeconds,
  );
}

export function deriveFaultyClockRateFromObservationsExact(input: {
  actualFirstSeconds: ExactRationalInput;
  displayedFirstSeconds: ExactRationalInput;
  actualSecondSeconds: ExactRationalInput;
  displayedSecondSeconds: ExactRationalInput;
}): ExactRational {
  const actualElapsed = subtractRationals(
    input.actualSecondSeconds,
    input.actualFirstSeconds,
  );
  const displayedElapsed = subtractRationals(
    input.displayedSecondSeconds,
    input.displayedFirstSeconds,
  );
  if (compareRationals(actualElapsed, 0) <= 0) {
    throw new Error("Faulty-clock observations require increasing actual time.");
  }
  if (compareRationals(displayedElapsed, 0) <= 0) {
    throw new Error("Faulty-clock observations require increasing displayed time.");
  }
  return divideRationals(displayedElapsed, actualElapsed);
}

export function classifyFaultyClockRate(
  rateDisplayedPerActual: ExactRationalInput,
): "FAST" | "SLOW" | "CORRECT" {
  const comparison = compareRationals(rateDisplayedPerActual, 1);
  return comparison > 0 ? "FAST" : comparison < 0 ? "SLOW" : "CORRECT";
}

export function nextCorrectAnalogDialActualTimeExact(input: {
  model: AffineFaultyClockModel;
  strictlyAfterActualSeconds: ExactRationalInput;
  dialCycleSeconds?: ExactRationalInput;
}): ExactRational {
  const cycle = input.dialCycleSeconds ?? 43_200;
  const slope = subtractRationals(input.model.rateDisplayedPerActual, 1);
  if (rationalsEqual(slope, 0)) {
    throw new Error("A correctly running clock has no distinct next correction event.");
  }
  const after = typeof input.strictlyAfterActualSeconds === "object"
    ? exactRational(
        input.strictlyAfterActualSeconds.numerator,
        input.strictlyAfterActualSeconds.denominator,
      )
    : exactRational(input.strictlyAfterActualSeconds);
  const errorAfter = faultyClockErrorAtActualExact(input.model, after);
  let cycleMultiple: bigint;

  if (compareRationals(slope, 0) > 0) {
    cycleMultiple = floorRational(divideRationals(errorAfter, cycle)) + 1n;
  } else {
    cycleMultiple = ceilRational(divideRationals(errorAfter, cycle)) - 1n;
  }

  const initialError = subtractRationals(
    input.model.displayedAnchorSeconds,
    input.model.actualAnchorSeconds,
  );
  const actualOffset = divideRationals(
    subtractRationals(multiplyRationals(cycle, cycleMultiple), initialError),
    slope,
  );
  const candidate = addRationals(input.model.actualAnchorSeconds, actualOffset);
  if (compareRationals(candidate, after) <= 0) {
    throw new Error("Faulty-clock next-correct solver failed strict ordering.");
  }
  if (!rationalsEqual(moduloRational(faultyClockErrorAtActualExact(input.model, candidate), cycle), 0)) {
    throw new Error("Faulty-clock next-correct candidate is not dial-equivalent.");
  }
  return candidate;
}

export function actualTimeWhenErrorReachesExact(input: {
  model: AffineFaultyClockModel;
  targetErrorSeconds: ExactRationalInput;
}): ExactRational {
  const slope = subtractRationals(input.model.rateDisplayedPerActual, 1);
  if (rationalsEqual(slope, 0)) {
    throw new Error("A correct-rate clock cannot accumulate a new target error.");
  }
  const initialError = subtractRationals(
    input.model.displayedAnchorSeconds,
    input.model.actualAnchorSeconds,
  );
  return addRationals(
    input.model.actualAnchorSeconds,
    divideRationals(subtractRationals(input.targetErrorSeconds, initialError), slope),
  );
}

export function actualTimeWhenTwoFaultyClocksAgreeExact(input: {
  left: AffineFaultyClockModel;
  right: AffineFaultyClockModel;
}): ExactRational {
  const leftIntercept = subtractRationals(
    input.left.displayedAnchorSeconds,
    multiplyRationals(
      input.left.rateDisplayedPerActual,
      input.left.actualAnchorSeconds,
    ),
  );
  const rightIntercept = subtractRationals(
    input.right.displayedAnchorSeconds,
    multiplyRationals(
      input.right.rateDisplayedPerActual,
      input.right.actualAnchorSeconds,
    ),
  );
  const slopeDifference = subtractRationals(
    input.left.rateDisplayedPerActual,
    input.right.rateDisplayedPerActual,
  );
  if (rationalsEqual(slopeDifference, 0)) {
    throw new Error("Parallel faulty-clock readings never meet uniquely.");
  }
  return divideRationals(
    subtractRationals(rightIntercept, leftIntercept),
    slopeDifference,
  );
}

export function inferRateFromDisplayedEventIntervalExact(input: {
  displayedEventIntervalSeconds: ExactRationalInput;
  observedActualIntervalSeconds: ExactRationalInput;
}): ExactRational {
  if (compareRationals(input.observedActualIntervalSeconds, 0) <= 0) {
    throw new Error("Observed event interval must be positive.");
  }
  return divideRationals(
    input.displayedEventIntervalSeconds,
    input.observedActualIntervalSeconds,
  );
}

export function gainOrLossPerActualPeriodExact(input: {
  rateDisplayedPerActual: ExactRationalInput;
  actualPeriodSeconds: ExactRationalInput;
}): ExactRational {
  return multiplyRationals(
    subtractRationals(input.rateDisplayedPerActual, 1),
    input.actualPeriodSeconds,
  );
}

export function applyPiecewiseFaultyClockRatesExact(input: {
  displayedAnchorSeconds: ExactRationalInput;
  segments: readonly {
    actualDurationSeconds: ExactRationalInput;
    rateDisplayedPerActual: ExactRationalInput;
  }[];
}): ExactRational {
  let displayed = typeof input.displayedAnchorSeconds === "object"
    ? exactRational(
        input.displayedAnchorSeconds.numerator,
        input.displayedAnchorSeconds.denominator,
      )
    : exactRational(input.displayedAnchorSeconds);
  for (const segment of input.segments) {
    if (compareRationals(segment.actualDurationSeconds, 0) < 0) {
      throw new Error("Piecewise faulty-clock duration cannot be negative.");
    }
    if (compareRationals(segment.rateDisplayedPerActual, 0) <= 0) {
      throw new Error("Piecewise faulty-clock rate must be positive.");
    }
    displayed = addRationals(
      displayed,
      multiplyRationals(
        segment.actualDurationSeconds,
        segment.rateDisplayedPerActual,
      ),
    );
  }
  return displayed;
}
