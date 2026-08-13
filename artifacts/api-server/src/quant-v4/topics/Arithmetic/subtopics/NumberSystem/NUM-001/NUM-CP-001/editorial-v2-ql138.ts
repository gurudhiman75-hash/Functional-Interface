export function buildQl138Editorial(frozen: any) {
  const m = (value: string) => `\\(${value}\\)`;
  const state = frozen.hiddenState as Record<string, unknown>;
  const n = Number(state.n);
  const mode = Number(state.mode);
  const forms = [
    `\\sqrt{${n}}\\times\\sqrt{${n}}`,
    `(\\sqrt{${n}})^{2}+\\frac{1}{2}`,
    `(3\\sqrt{${n}})\\times\\sqrt{${n}}`,
    `\\frac{\\sqrt{${n}}\\times\\sqrt{${n}}}{2}`,
  ];
  const answer = m(forms[mode]!);
  const normalizeWrong = (value: string) => {
    const unwrapped = value.replace(/^\\\((.*)\\\)$/u, "$1");
    return unwrapped
      .replace(/^√(\d+) \/ 2$/u, (_match, radicand) => `\\frac{\\sqrt{${radicand}}}{2}`)
      .replace(/√(\d+)/gu, "\\sqrt{$1}")
      .replace(/×/gu, "\\times")
      .replace(/²/gu, "^{2}")
      .replace(/1\/2/gu, "\\frac{1}{2}");
  };
  const correctIndex = Number(frozen.correctIndex);
  const distractors = (frozen.options ?? [])
    .map((option: any, index: number) => ({ index, value: String(option?.value ?? option) }))
    .filter((entry: { index: number }) => entry.index !== correctIndex)
    .map((entry: { value: string }) => m(normalizeWrong(entry.value)));
  if (distractors.length !== 3) throw new Error(`QL138 Editorial V2 expected three distractors, got ${distractors.length}`);
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  const value = String(state.rationalValue);
  const parts = value.split("/");
  const valueLatex = parts.length === 2 ? `\\frac{${parts[0]}}{${parts[1]}}` : value;
  const working = mode === 0
    ? `${forms[0]}=${n}`
    : mode === 1
      ? `${forms[1]}=${n}+\\frac{1}{2}=${valueLatex}`
      : mode === 2
        ? `${forms[2]}=3\\times${n}=${valueLatex}`
        : `${forms[3]}=\\frac{${n}}{2}=${valueLatex}`;
  return {
    stem: `For the positive non-square integer ${m(String(n))}, which expression is rational?`,
    options: Object.freeze(options),
    correctIndex,
    answer,
    concept: `${m(`\\sqrt{${n}}`)} is irrational, but matching radicals simplify when multiplied.`,
    steps: [`For the correct option, ${m(working)}.`, `Its value ${m(valueLatex)} is rational.`],
  };
}
