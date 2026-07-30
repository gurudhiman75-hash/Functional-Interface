import { polishNumberSystemEnglishStem } from "./english-stem-style";

function divisibilityPhrase(value: unknown): string | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const divisors = value.map((item) => String(item));
  if (divisors.length === 1) return `divisible by ${divisors[0]}`;
  if (divisors.length === 2) return `divisible by both ${divisors[0]} and ${divisors[1]}`;
  return `divisible by each of ${divisors.join(", ")}`;
}

function orderedPairCondition(hiddenState: Readonly<Record<string, unknown>>): string | null {
  const condition = divisibilityPhrase(hiddenState.divisors);
  if (!condition) return null;
  const relation = hiddenState.relation;
  if (
    relation
    && typeof relation === "object"
    && String((relation as Record<string, unknown>).kind) === "DIGIT_SUM"
  ) {
    return `${condition} and X + Y = ${String((relation as Record<string, unknown>).value)}`;
  }
  return condition;
}

function claimLead(hiddenState: Readonly<Record<string, unknown>>): string {
  const polarity = String(hiddenState.requestedPolarity).toLowerCase();
  const claims = Array.isArray(hiddenState.claims) ? hiddenState.claims : [];
  const firstNumber = claims.length > 0 && typeof claims[0] === "object"
    ? Number((claims[0] as Record<string, unknown>).number)
    : 0;
  if (Number.isFinite(firstNumber) && firstNumber % 2 === 0) {
    return `Identify the ${polarity} statement about divisibility.`;
  }
  return `Which of the following divisibility statements is ${polarity}?`;
}

export function polishNumCp003RetainedStem(
  temporaryTemplateLabel: string,
  rawStem: string,
  hiddenState: Readonly<Record<string, unknown>>,
): string {
  const match = temporaryTemplateLabel.match(/^NUM-CP003-QLT2-(\d{2})$/);
  if (!match) return rawStem;
  const qlNumber = Number(match[1]);
  if (!Number.isInteger(qlNumber) || qlNumber < 1 || qlNumber > 17) return rawStem;
  const qlId = `NUM-QL-${String(qlNumber).padStart(3, "0")}` as const;

  let stem = rawStem;
  const template = hiddenState.template === undefined ? null : String(hiddenState.template);
  const condition = divisibilityPhrase(hiddenState.divisors);

  switch (qlNumber) {
    case 1: {
      const number = String(hiddenState.number);
      stem = String(hiddenState.requestedPolarity) === "DIVISIBLE"
        ? `Which of the following numbers divides ${number} without leaving a remainder?`
        : `Which of the following numbers does not divide ${number} exactly?`;
      break;
    }
    case 2:
      if (template && condition) {
        stem = `Which digit must replace X in ${template} so that the number is ${condition}?`;
      }
      break;
    case 3:
      if (template && condition) {
        const direction = String(hiddenState.extremumDirection).toLowerCase();
        stem = `What is the ${direction} digit X that makes ${template} ${condition}?`;
      }
      break;
    case 4:
      if (template && condition) {
        stem = `How many digits can replace X in ${template} so that the number is ${condition}?`;
      }
      break;
    case 5:
      if (template && condition) {
        stem = `What is the sum of all digits that can replace X in ${template} so that the number is ${condition}?`;
      }
      break;
    case 6:
      if (template && condition) {
        stem = `Which set contains all digits that can replace X in ${template} so that the number is ${condition}?`;
      }
      break;
    case 7:
      if (template && condition) {
        const direction = String(hiddenState.extremumDirection).startsWith("GREATEST")
          ? "greatest"
          : "smallest";
        stem = `What is the ${direction} number obtained by replacing X in ${template} so that the completed number is ${condition}?`;
      }
      break;
    case 8: {
      const pairCondition = orderedPairCondition(hiddenState);
      if (template && pairCondition) {
        stem = `Which ordered pair (X, Y) makes ${template} ${pairCondition}?`;
      }
      break;
    }
    case 9: {
      const pairCondition = orderedPairCondition(hiddenState);
      if (template && pairCondition) {
        stem = `How many ordered pairs (X, Y) make ${template} ${pairCondition}?`;
      }
      break;
    }
    case 10: {
      const pairCondition = orderedPairCondition(hiddenState);
      if (template && pairCondition) {
        stem = `Which set contains all ordered pairs (X, Y) that make ${template} ${pairCondition}?`;
      }
      break;
    }
    case 11: {
      const pairCondition = orderedPairCondition(hiddenState);
      if (template && pairCondition) {
        stem = `Which statement correctly describes the number of ordered pairs (X, Y) that make ${template} ${pairCondition}?`;
      }
      break;
    }
    case 12: {
      const direction = String(hiddenState.direction) === "GREATEST" ? "greatest" : "smallest";
      stem = `What is the ${direction} ${String(hiddenState.digits)}-digit number exactly divisible by ${String(hiddenState.divisor)}?`;
      break;
    }
    case 13:
      stem = `How many integers from ${String(hiddenState.lower)} to ${String(hiddenState.upper)}, both inclusive, are divisible by ${String(hiddenState.divisor)}?`;
      break;
    case 14:
      stem = `The block ${String(hiddenState.block)} is repeated ${String(hiddenState.repeats)} times to form a number. Which of the following numbers divides it exactly?`;
      break;
    case 15: {
      const direction = String(hiddenState.direction).toLowerCase();
      stem = `In ${String(hiddenState.sourcePattern)} + ${String(hiddenState.addend)} = ${String(hiddenState.resultPattern)}, A and B are digits. If ${String(hiddenState.resultPattern)} is divisible by ${String(hiddenState.divisor)}, what is the ${direction} possible value of A?`;
      break;
    }
    case 16:
      if (
        template
        && hiddenState.statementI !== undefined
        && hiddenState.statementII !== undefined
      ) {
        stem = [
          `Can the missing digit X in ${template} be determined uniquely?`,
          "",
          `Statement I: ${String(hiddenState.statementI)}`,
          `Statement II: ${String(hiddenState.statementII)}`,
          "",
          "Which data-sufficiency conclusion is correct?",
        ].join("\n");
      }
      break;
    case 17:
      stem = claimLead(hiddenState);
      break;
    default:
      break;
  }

  return polishNumberSystemEnglishStem(qlId, stem, hiddenState);
}
