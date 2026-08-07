import {
  addRational,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import type { Rational } from "./types";

export interface MalCp004ComponentState {
  total: Rational;
  componentRate: Rational;
  componentAmount: Rational;
  otherComponentAmount: Rational;
}

export function malCp004ComponentState(
  total: Rational,
  componentRate: Rational,
): MalCp004ComponentState {
  const componentAmount = multiplyRational(total, componentRate);
  return {
    total,
    componentRate,
    componentAmount,
    otherComponentAmount: subtractRational(total, componentAmount),
  };
}

export function malCp004TotalFromComponentAndRate(
  componentAmount: Rational,
  componentRate: Rational,
): Rational {
  return divideRational(componentAmount, componentRate);
}

export function malCp004TotalFromOtherComponentAndRate(
  otherComponentAmount: Rational,
  componentRate: Rational,
): Rational {
  return divideRational(
    otherComponentAmount,
    subtractRational(rational(1), componentRate),
  );
}

export interface MalCp004MoistureState {
  initialMass: Rational;
  initialMoistureFraction: Rational;
  finalMoistureFraction: Rational;
  dryMatter: Rational;
  finalMass: Rational;
  moistureLost: Rational;
}

export function malCp004MoistureState(input: {
  initialMass: Rational;
  initialMoistureFraction: Rational;
  finalMoistureFraction: Rational;
}): MalCp004MoistureState {
  const initialDryFraction = subtractRational(
    rational(1),
    input.initialMoistureFraction,
  );
  const finalDryFraction = subtractRational(
    rational(1),
    input.finalMoistureFraction,
  );
  const dryMatter = multiplyRational(input.initialMass, initialDryFraction);
  const finalMass = divideRational(dryMatter, finalDryFraction);
  return {
    ...input,
    dryMatter,
    finalMass,
    moistureLost: subtractRational(input.initialMass, finalMass),
  };
}

export function malCp004InitialMassFromMoistureState(input: {
  finalMass: Rational;
  initialMoistureFraction: Rational;
  finalMoistureFraction: Rational;
}): Rational {
  const finalDryMatter = multiplyRational(
    input.finalMass,
    subtractRational(rational(1), input.finalMoistureFraction),
  );
  return divideRational(
    finalDryMatter,
    subtractRational(rational(1), input.initialMoistureFraction),
  );
}

export interface MalCp004EvaporationState {
  initialTotal: Rational;
  initialConcentration: Rational;
  targetConcentration: Rational;
  conservedSolute: Rational;
  finalTotal: Rational;
  evaporatedAmount: Rational;
}

export function malCp004EvaporationState(input: {
  initialTotal: Rational;
  initialConcentration: Rational;
  targetConcentration: Rational;
}): MalCp004EvaporationState {
  const conservedSolute = multiplyRational(
    input.initialTotal,
    input.initialConcentration,
  );
  const finalTotal = divideRational(
    conservedSolute,
    input.targetConcentration,
  );
  return {
    ...input,
    conservedSolute,
    finalTotal,
    evaporatedAmount: subtractRational(input.initialTotal, finalTotal),
  };
}

export function malCp004InitialTotalFromEvaporation(input: {
  evaporatedAmount: Rational;
  initialConcentration: Rational;
  targetConcentration: Rational;
}): Rational {
  return divideRational(
    multiplyRational(input.evaporatedAmount, input.targetConcentration),
    subtractRational(
      input.targetConcentration,
      input.initialConcentration,
    ),
  );
}

export function malCp004FinalConcentrationAfterSolventChange(input: {
  initialTotal: Rational;
  initialConcentration: Rational;
  solventChange: Rational;
  direction: "ADD" | "EVAPORATE";
}): Rational {
  const conservedSolute = multiplyRational(
    input.initialTotal,
    input.initialConcentration,
  );
  const finalTotal =
    input.direction === "ADD"
      ? addRational(input.initialTotal, input.solventChange)
      : subtractRational(input.initialTotal, input.solventChange);
  return divideRational(conservedSolute, finalTotal);
}

export interface MalCp004PureAdditionState {
  initialTotal: Rational;
  initialConcentration: Rational;
  targetConcentration: Rational;
  initialSolute: Rational;
  conservedSolvent: Rational;
  pureSoluteAdded: Rational;
  finalTotal: Rational;
  finalSolute: Rational;
}

export function malCp004PureAdditionState(input: {
  initialTotal: Rational;
  initialConcentration: Rational;
  targetConcentration: Rational;
}): MalCp004PureAdditionState {
  const initialSolute = multiplyRational(
    input.initialTotal,
    input.initialConcentration,
  );
  const conservedSolvent = subtractRational(
    input.initialTotal,
    initialSolute,
  );
  const pureSoluteAdded = divideRational(
    multiplyRational(
      input.initialTotal,
      subtractRational(
        input.targetConcentration,
        input.initialConcentration,
      ),
    ),
    subtractRational(rational(1), input.targetConcentration),
  );
  const finalTotal = addRational(input.initialTotal, pureSoluteAdded);
  const finalSolute = addRational(initialSolute, pureSoluteAdded);
  return {
    ...input,
    initialSolute,
    conservedSolvent,
    pureSoluteAdded,
    finalTotal,
    finalSolute,
  };
}
