import {
  addRational,
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import {
  generateMalCp004Wave04ComponentAmount,
  generateMalCp004Wave04Concentration,
  generateMalCp004Wave04TotalFromRate,
} from "./cp004-unified-runtime-wave04-component";
import {
  generateMalCp004Wave04EvaporationTarget,
  generateMalCp004Wave04PureAddition,
  generateMalCp004Wave04SolventAddition,
} from "./cp004-unified-runtime-wave04-targets";
import {
  generateMalCp004Wave04InitialTotalFromEvaporation,
  generateMalCp004Wave04KnownSolventChange,
} from "./cp004-unified-runtime-wave04-known-change";
import {
  generateMalCp004Wave04MoistureForward,
  generateMalCp004Wave04MoistureInverse,
} from "./cp004-unified-runtime-wave04-moisture";
import { malCp004Wave04Stable } from "./cp004-unified-runtime-wave04-core";
import type { MalCp004Wave03EffectiveContractId } from "./cp004-equivalence-authority-wave03";
import type { MalCp004Wave04Question } from "./cp004-unified-runtime-wave04-types";
import type { Rational } from "./types";

export function generateMalCp004Wave04Question(
  effectiveContractId: MalCp004Wave03EffectiveContractId,
  seed = `mal-cp004-wave04:${effectiveContractId}:default`,
): MalCp004Wave04Question {
  switch (effectiveContractId) {
    case "MAL-CP004-EFF-COMPONENT-AMOUNT":
      return generateMalCp004Wave04ComponentAmount(seed);
    case "MAL-CP004-EFF-CONCENTRATION":
      return generateMalCp004Wave04Concentration(seed);
    case "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE":
      return generateMalCp004Wave04TotalFromRate(seed);
    case "MAL-CP004-EFF-SOLVENT-ADDITION-TARGET":
      return generateMalCp004Wave04SolventAddition(seed);
    case "MAL-CP004-EFF-PURE-SOLUTE-ADDITION-TARGET":
      return generateMalCp004Wave04PureAddition(seed);
    case "MAL-CP004-EFF-EVAPORATION-TARGET":
      return generateMalCp004Wave04EvaporationTarget(seed);
    case "MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE":
      return generateMalCp004Wave04KnownSolventChange(seed);
    case "MAL-CP004-EFF-INITIAL-TOTAL-FROM-EVAPORATION":
      return generateMalCp004Wave04InitialTotalFromEvaporation(seed);
    case "MAL-CP004-EFF-MOISTURE-FORWARD":
      return generateMalCp004Wave04MoistureForward(seed);
    case "MAL-CP004-EFF-MOISTURE-INVERSE":
      return generateMalCp004Wave04MoistureInverse(seed);
  }
}

function exactRational(
  question: MalCp004Wave04Question,
  key: string,
): Rational {
  const value = question.exactState[key];
  if (!value || typeof value === "string") {
    throw new Error(`${question.seed}: missing rational exact-state field ${key}.`);
  }
  return value;
}

function exactString(
  question: MalCp004Wave04Question,
  key: string,
): string {
  const value = question.exactState[key];
  if (typeof value !== "string") {
    throw new Error(`${question.seed}: missing string exact-state field ${key}.`);
  }
  return value;
}

function independentlyRecomputeAnswer(
  question: MalCp004Wave04Question,
): Rational {
  switch (question.effectiveContractId) {
    case "MAL-CP004-EFF-COMPONENT-AMOUNT": {
      const total = exactRational(question, "total");
      const rate = exactRational(question, "trackedRate");
      const tracked = multiplyRational(total, rate);
      return question.representationVariant === "OTHER_COMPONENT_AMOUNT"
        ? subtractRational(total, tracked)
        : tracked;
    }
    case "MAL-CP004-EFF-CONCENTRATION":
      return divideRational(
        exactRational(question, "trackedAmount"),
        exactRational(question, "total"),
      );
    case "MAL-CP004-EFF-TOTAL-FROM-COMPONENT-RATE":
      return divideRational(
        exactRational(question, "givenAmount"),
        exactRational(question, "givenRate"),
      );
    case "MAL-CP004-EFF-SOLVENT-ADDITION-TARGET": {
      const initialTotal = exactRational(question, "initialTotal");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      const tracked = multiplyRational(initialTotal, initialRate);
      return subtractRational(divideRational(tracked, targetRate), initialTotal);
    }
    case "MAL-CP004-EFF-PURE-SOLUTE-ADDITION-TARGET": {
      const initialTotal = exactRational(question, "initialTotal");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      return divideRational(
        multiplyRational(
          initialTotal,
          subtractRational(targetRate, initialRate),
        ),
        subtractRational(rational(1), targetRate),
      );
    }
    case "MAL-CP004-EFF-EVAPORATION-TARGET": {
      const initialTotal = exactRational(question, "initialTotal");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      const tracked = multiplyRational(initialTotal, initialRate);
      const finalTotal = divideRational(tracked, targetRate);
      return question.representationVariant ===
        "FINAL_TOTAL_AFTER_EVAPORATION"
        ? finalTotal
        : subtractRational(initialTotal, finalTotal);
    }
    case "MAL-CP004-EFF-FINAL-CONCENTRATION-AFTER-SOLVENT-CHANGE": {
      const initialTotal = exactRational(question, "initialTotal");
      const initialRate = exactRational(question, "initialRate");
      const solventChange = exactRational(question, "solventChange");
      const direction = exactString(question, "direction");
      const finalTotal =
        direction === "ADD"
          ? addRational(initialTotal, solventChange)
          : subtractRational(initialTotal, solventChange);
      return divideRational(
        multiplyRational(initialTotal, initialRate),
        finalTotal,
      );
    }
    case "MAL-CP004-EFF-INITIAL-TOTAL-FROM-EVAPORATION": {
      const evaporated = exactRational(question, "evaporated");
      const initialRate = exactRational(question, "initialRate");
      const targetRate = exactRational(question, "targetRate");
      return divideRational(
        multiplyRational(evaporated, targetRate),
        subtractRational(targetRate, initialRate),
      );
    }
    case "MAL-CP004-EFF-MOISTURE-FORWARD": {
      const initialMass = exactRational(question, "initialMass");
      const initialMoisture = exactRational(question, "initialMoisture");
      const finalMoisture = exactRational(question, "finalMoisture");
      const dryMatter = multiplyRational(
        initialMass,
        subtractRational(rational(1), initialMoisture),
      );
      const finalMass = divideRational(
        dryMatter,
        subtractRational(rational(1), finalMoisture),
      );
      return question.representationVariant === "MOISTURE_LOST"
        ? subtractRational(initialMass, finalMass)
        : finalMass;
    }
    case "MAL-CP004-EFF-MOISTURE-INVERSE": {
      const finalMass = exactRational(question, "finalMass");
      const initialMoisture = exactRational(question, "initialMoisture");
      const finalMoisture = exactRational(question, "finalMoisture");
      return divideRational(
        multiplyRational(
          finalMass,
          subtractRational(rational(1), finalMoisture),
        ),
        subtractRational(rational(1), initialMoisture),
      );
    }
  }
}

export function verifyMalCp004Wave04Question(
  question: MalCp004Wave04Question,
): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const recomputed = independentlyRecomputeAnswer(question);
  if (!equalsRational(recomputed, question.answerValue)) {
    errors.push("Independent exact recomputation does not match the answer.");
  }
  if (
    !question.optionAudit.some(
      (option) => option.isCorrect && equalsRational(option.value, recomputed),
    )
  ) {
    errors.push("Correct option does not contain the independently recomputed value.");
  }
  return { ok: errors.length === 0, errors };
}

export { malCp004Wave04Stable };
