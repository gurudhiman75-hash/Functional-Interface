export function applyNumCp005FinalQl057WordingSafety(input, explanation) {
  if (input.qlId !== "NUM-QL-057") return explanation;
  const unrestricted = String(input.hiddenState.parity ?? "ANY") === "ANY";
  return {
    ...explanation,
    givenDataAndStrategy: unrestricted
      ? explanation.givenDataAndStrategy
        .replace(", impose the any condition, and", " and")
        .replace("impose the any condition, and", "")
      : explanation.givenDataAndStrategy,
    stepByStep: explanation.stepByStep.map((step) => {
      let value = step.replace(
        "No generated value lies between",
        "No value generated from the allowed forms lies between",
      );
      if (unrestricted) {
        value = value.replace(
          "The smallest value satisfying both conditions is",
          "The smallest value with the required divisor count is",
        );
      }
      return value;
    }),
  };
}
