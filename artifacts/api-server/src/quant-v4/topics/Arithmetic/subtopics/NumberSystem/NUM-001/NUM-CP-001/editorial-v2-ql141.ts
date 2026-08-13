export function buildQl141Editorial(frozen: any) {
  const m = (v: string) => `\\(${v}\\)`;
  const s = frozen.hiddenState as Record<string, unknown>;
  const k = Number(s.len);
  const total = Number(s.proposedSum);
  const top = 2 * total - k * (k - 1);
  const bottom = 2 * k;
  const possible = Boolean(s.possible);
  const options = Object.freeze((frozen.options ?? []).map((o: any) => String(o.value ?? o)));
  const correctIndex = Number(frozen.correctIndex);
  const answer = options[correctIndex]!;
  return {
    stem: `Can ${m(String(total))} be the sum of ${k} consecutive integers?`,
    options,
    correctIndex,
    answer,
    concept: "Find the first integer exactly; do not use decimal approximations.",
    steps: [`The first integer would be ${m(`\\frac{${top}}{${bottom}}`)}.`, possible ? "This is an integer, so such a block exists." : "This is not an integer, so such a block does not exist."],
  };
}
