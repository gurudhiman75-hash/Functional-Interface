import {
  compareRational,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import type {
  MalCp004SolveRequest,
  MalCp004SolveResult,
} from "./cp004-types";
import type { Rational } from "./types";

function assertPositive(value: Rational, label: string): void {
  if (compareRational(value, rational(0)) <= 0) {
    throw new Error(`${label} must be positive.`);
  }
}

function assertFraction(value: Rational, label: string): void {
  if (
    compareRational(value, rational(0)) <= 0 ||
    compareRational(value, rational(1)) >= 0
  ) {
    throw new Error(`${label} must lie strictly between 0 and 1.`);
  }
}

export function solveMalCp004(
  request: MalCp004SolveRequest,
): MalCp004SolveResult {
  switch (request.mode) {
    case "COMPONENT_AMOUNT_FROM_CONCENTRATION": {
      assertPositive(request.totalQuantity, "Total quantity");
      assertFraction(request.concentration, "Concentration");
      return {
        kind: "COMPONENT_QUANTITY",
        value: multiplyRational(
          request.totalQuantity,
          request.concentration,
        ),
      };
    }

    case "CONCENTRATION_FROM_COMPONENT_AMOUNT": {
      assertPositive(request.totalQuantity, "Total quantity");
      assertPositive(request.componentQuantity, "Component quantity");
      if (
        compareRational(
          request.componentQuantity,
          request.totalQuantity,
        ) >= 0
      ) {
        throw new Error("Component quantity must be smaller than total quantity.");
      }
      return {
        kind: "CONCENTRATION",
        value: divideRational(
          request.componentQuantity,
          request.totalQuantity,
        ),
      };
    }

    case "ADD_SOLVENT_FOR_TARGET_CONCENTRATION": {
      assertPositive(request.initialTotal, "Initial total");
      assertFraction(request.initialConcentration, "Initial concentration");
      assertFraction(request.targetConcentration, "Target concentration");
      if (
        compareRational(
          request.targetConcentration,
          request.initialConcentration,
        ) >= 0
      ) {
        throw new Error(
          "Adding solvent requires a lower target concentration.",
        );
      }
      const finalTotal = divideRational(
        multiplyRational(
          request.initialTotal,
          request.initialConcentration,
        ),
        request.targetConcentration,
      );
      return {
        kind: "SOLVENT_ADDED",
        value: subtractRational(finalTotal, request.initialTotal),
      };
    }

    case "ADD_PURE_SOLUTE_FOR_TARGET_CONCENTRATION": {
      assertPositive(request.initialTotal, "Initial total");
      assertFraction(request.initialConcentration, "Initial concentration");
      assertFraction(request.targetConcentration, "Target concentration");
      if (
        compareRational(
          request.targetConcentration,
          request.initialConcentration,
        ) <= 0
      ) {
        throw new Error(
          "Adding pure solute requires a higher target concentration.",
        );
      }
      const numerator = multiplyRational(
        request.initialTotal,
        subtractRational(
          request.targetConcentration,
          request.initialConcentration,
        ),
      );
      const denominator = subtractRational(
        rational(1),
        request.targetConcentration,
      );
      return {
        kind: "PURE_SOLUTE_ADDED",
        value: divideRational(numerator, denominator),
      };
    }

    case "EVAPORATE_SOLVENT_FOR_TARGET_CONCENTRATION": {
      assertPositive(request.initialTotal, "Initial total");
      assertFraction(request.initialConcentration, "Initial concentration");
      assertFraction(request.targetConcentration, "Target concentration");
      if (
        compareRational(
          request.targetConcentration,
          request.initialConcentration,
        ) <= 0
      ) {
        throw new Error(
          "Evaporation requires a higher target concentration.",
        );
      }
      const finalTotal = divideRational(
        multiplyRational(
          request.initialTotal,
          request.initialConcentration,
        ),
        request.targetConcentration,
      );
      return {
        kind: "SOLVENT_EVAPORATED",
        value: subtractRational(request.initialTotal, finalTotal),
      };
    }

    case "FINAL_MASS_FROM_MOISTURE_SHIFT": {
      assertPositive(request.initialMass, "Initial mass");
      assertFraction(
        request.initialMoistureFraction,
        "Initial moisture fraction",
      );
      assertFraction(
        request.finalMoistureFraction,
        "Final moisture fraction",
      );
      const initialDryFraction = subtractRational(
        rational(1),
        request.initialMoistureFraction,
      );
      const finalDryFraction = subtractRational(
        rational(1),
        request.finalMoistureFraction,
      );
      return {
        kind: "FINAL_MASS",
        value: divideRational(
          multiplyRational(request.initialMass, initialDryFraction),
          finalDryFraction,
        ),
      };
    }

    case "INITIAL_MASS_FROM_MOISTURE_SHIFT": {
      assertPositive(request.finalMass, "Final mass");
      assertFraction(
        request.initialMoistureFraction,
        "Initial moisture fraction",
      );
      assertFraction(
        request.finalMoistureFraction,
        "Final moisture fraction",
      );
      const initialDryFraction = subtractRational(
        rational(1),
        request.initialMoistureFraction,
      );
      const finalDryFraction = subtractRational(
        rational(1),
        request.finalMoistureFraction,
      );
      return {
        kind: "INITIAL_MASS",
        value: divideRational(
          multiplyRational(request.finalMass, finalDryFraction),
          initialDryFraction,
        ),
      };
    }
  }
}
