export function buildQl138Editorial(frozen: any) {
  const m = (value: string) => `\\(${value}\\)`;
  const state = frozen.hiddenState as Record<string, unknown>;
  const n = Number(state.n);
  const mode = Number(state.mode);
  const rationalForms = [
    `\\sqrt{${n}}\\times\\sqrt{${n}}`,
    `(\\sqrt{${n}})^{2}+\\frac{1}{2}`,
    `(3\\sqrt{${n}})\\times\\sqrt{${n}}`,
    `\\frac{\\sqrt{${n}}\\times\\sqrt{${n}}}{2}`,
  ];
  const irrationalForms = [
    `\\sqrt{${n}}+1`,
    `2\\sqrt{${n}}`,
    `\\frac{\\sqrt{${n}}}{2}`,
    `\\sqrt{${n}}-3`,
    `5+\\sqrt{${n}}`,
    `3\\sqrt{${n}}+2`,
  ];
  const answer = m(rationalForms[mode]!);
  const originalWrong = (frozen.options ?? [])
    .filter((option: any) => !option.isCorrect)
    .map((option: any) => String(option.value))
    .map((value: string) => {
      const normalized = value
        .replace(/√(\d+)/gu, "\\sqrt{$1}")
        .replace(/×/gu, "\\times")
        .replace(/²/gu, "^{2}")
        .replace(/1\/2/gu, "\\frac{1}{2}")
        .replace(/√(\d+) \/ 2/gu, "\\frac{\\sqrt{$1}}{2}");
      return m(normalized);
    });
  const distractors = originalWrong.length === 3 ? originalWrong : irrationalForms.slice(0, 3).map(m);
  const options = [...distractors];
  const correctIndex = Number(frozen.correctIndex);
  options.splice(correctIndex, 0, answer);
  return {
    stem: `For the positive non-square integer ${m(String(n))}, which expression is rational?`,
    options: Object.freeze(options),
    correctIndex,
    answer,
    concept: `${m(`\\sqrt{${n}}`)} is irrational, but multiplying matching radicals removes the square root.`,
    steps: [`Use ${m(`\\sqrt{${n}}\\times\\sqrt{${n}}=${n}`)}.`, `The correct expression simplifies to ${m(String(state.rationalValue))}, which is rational.`],
  };
}
