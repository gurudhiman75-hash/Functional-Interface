export function buildQl142Editorial(frozen: any) {
  const state = frozen.hiddenState as Record<string, unknown>;
  const truths = Array.isArray(state.truths) ? state.truths.map(Boolean) : [true, false, true];
  const trueStatements = [
    "Every integer is a rational number.",
    "If a < b, then -a > -b.",
    "The square of an odd integer is odd.",
  ];
  const falseStatements = [
    "Every rational number is an integer.",
    "The sum of two odd integers is odd.",
    "Every negative integer is a whole number.",
  ];
  const statements = truths.map((truth, index) => truth ? trueStatements[index]! : falseStatements[index]!);
  const options = Object.freeze((frozen.options ?? []).map((option: any) => String(option.value ?? option)));
  const correctIndex = Number(frozen.correctIndex);
  const answer = options[correctIndex]!;
  return {
    stem: `Consider the statements:\nI. ${statements[0]}\nII. ${statements[1]}\nIII. ${statements[2]}\nWhich option identifies exactly the true statements?`,
    options,
    correctIndex,
    answer,
    concept: "Judge each statement independently, then match the true statements with the options.",
    steps: [
      `I is ${truths[0] ? "true" : "false"}; II is ${truths[1] ? "true" : "false"}; III is ${truths[2] ? "true" : "false"}.`,
      `Therefore the correct choice is ${answer}.`,
    ],
  };
}
