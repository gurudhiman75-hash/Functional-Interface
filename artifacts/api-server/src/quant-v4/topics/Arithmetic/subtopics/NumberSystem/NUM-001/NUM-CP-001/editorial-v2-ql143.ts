export function buildQl143Editorial(frozen: any) {
  const m = (value: string) => `\\(${value}\\)`;
  const state = frozen.hiddenState as Record<string, unknown>;
  const first = Array.isArray(state.firstCandidates) ? state.firstCandidates : [];
  const second = Array.isArray(state.secondCandidates) ? state.secondCandidates : [];
  const combined = Array.isArray(state.combinedCandidates) ? state.combinedCandidates : [];
  const describe = (values: readonly unknown[]) => values.length === 1 ? `one value, ${m(String(values[0]))}` : `${values.length} possible values`;
  const options = Object.freeze((frozen.options ?? []).map((option: any) => String(option.value ?? option)));
  const correctIndex = Number(frozen.correctIndex);
  const answer = options[correctIndex]!;
  return {
    stem: `An integer ${m("x")} lies between ${m("-10")} and ${m("10")} inclusive. Is the value of ${m("x")} uniquely determined?\n\nStatement I: ${String(state.firstDescription)}.\nStatement II: ${String(state.secondDescription)}.`,
    options,
    correctIndex,
    answer,
    concept: "A statement is sufficient only when it determines exactly one value of the integer.",
    steps: [
      `Statement I leaves ${describe(first)}; Statement II leaves ${describe(second)}.`,
      `Using both statements leaves ${describe(combined)}.`,
      `Therefore ${answer}.`,
    ],
  };
}
