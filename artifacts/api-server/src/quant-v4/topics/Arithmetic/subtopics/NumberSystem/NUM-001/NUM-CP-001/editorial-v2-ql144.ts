function factorialValue(k: number): number {
  let value = 1;
  for (let n = 2; n <= k; n += 1) value *= n;
  return value;
}

export function buildQl144Editorial(frozen: any, seed: number) {
  const m = (value: string) => `\\(${value}\\)`;
  const band = String(frozen.difficulty).toUpperCase();
  const k = band === "EASY" ? 3 : band === "MEDIUM" ? 4 : 5 + (seed % 2);
  const value = factorialValue(k);
  const answer = m(String(value));
  const options = [Math.floor(value / 2), value + k, value * k].map((candidate) => m(String(candidate)));
  const correctIndex = Number(frozen.correctIndex);
  options.splice(correctIndex, 0, answer);
  if (new Set(options).size !== 4) throw new Error("QL144 Editorial V2 duplicate options");
  return {
    stem: `The product of any ${k} consecutive integers is always divisible by which largest number?`,
    options: Object.freeze(options),
    correctIndex,
    answer,
    concept: "For k consecutive integers, the common divisibility factor is k!.",
    steps: [`Here ${m(`k=${k}`)}, so use ${m(`${k}!`)}.`, `${m(`${k}!=${value}`)}.`],
  };
}
