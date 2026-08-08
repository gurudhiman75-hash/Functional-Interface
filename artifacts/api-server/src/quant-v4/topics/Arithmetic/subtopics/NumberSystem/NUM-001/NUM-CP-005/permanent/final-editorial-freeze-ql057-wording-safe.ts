export function applyNumCp005FinalQl057WordingSafety(input, explanation) {
  if (input.qlId !== "NUM-QL-057") return explanation;
  return {
    ...explanation,
    stepByStep: explanation.stepByStep.map((step) =>
      step.replace(
        "No generated value lies between",
        "No value generated from the allowed forms lies between",
      )),
  };
}
