export function buildQl137Editorial(frozen: any, seed: number) {
  const math = (value: string) => `\\(${value}\\)`;
  const difficulty = String(frozen.difficulty).toUpperCase();
  let condition: string;
  let answer: string;
  let steps: readonly string[];
  if (difficulty === "EASY") {
    if (seed % 2 === 0) {
      condition = `${math("n+7")} is odd`;
      answer = "n must be even";
      steps = [`Adding odd ${math("7")} reverses parity.`, `For ${math("n+7")} to be odd, ${math("n")} must be even.`];
    } else {
      condition = `${math("n+7")} is even`;
      answer = "n must be odd";
      steps = [`Adding odd ${math("7")} reverses parity.`, `For ${math("n+7")} to be even, ${math("n")} must be odd.`];
    }
  } else if (difficulty === "MEDIUM") {
    if (seed % 2 === 0) {
      condition = `${math("5n+2")} is even`;
      answer = "n must be even";
      steps = [`Since ${math("5")} is odd, ${math("5n")} has the same parity as ${math("n")}.`, `Adding ${math("2")} does not change parity, so ${math("n")} must be even.`];
    } else {
      condition = `${math("3n+5")} is even`;
      answer = "n must be odd";
      steps = [`${math("3n")} has the same parity as ${math("n")}.`, `Adding odd ${math("5")} reverses parity, so ${math("n")} must be odd.`];
    }
  } else if (seed % 2 === 0) {
    condition = `${math("3n^{2}+4n+1")} is odd`;
    answer = "n must be even";
    steps = [`Modulo 2, ${math("3n^{2}+4n+1\\equiv n^{2}+1")}.`, `For this to be odd, ${math("n^{2}")} must be even, so ${math("n")} is even.`];
  } else {
    condition = `${math("5n^{2}+2n+1")} is even`;
    answer = "n must be odd";
    steps = [`Modulo 2, ${math("5n^{2}+2n+1\\equiv n^{2}+1")}.`, `For this to be even, ${math("n^{2}")} must be odd, so ${math("n")} is odd.`];
  }
  const labels = ["n must be even", "n must be odd", "every integer n", "no integer n"];
  const options = labels.filter((value) => value !== answer);
  const correctIndex = Number(frozen.correctIndex);
  options.splice(correctIndex, 0, answer);
  return { stem: `What must be true about the integer ${math("n")} if ${condition}?`, options: Object.freeze(options), correctIndex, answer, concept: "Reduce the condition modulo 2 and solve for the parity of the integer.", steps };
}
