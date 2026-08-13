export function buildQl130Editorial(frozen: any, seed: number) {
  const math = (value: string) => `\\(${value}\\)`;
  const difficulty = String(frozen.difficulty).toUpperCase();
  let statement: string;
  let answer: string;
  let steps: readonly string[];
  if (difficulty === "EASY") {
    if (seed % 2 === 0) {
      statement = `${math("n^{2}+1")} is even`;
      answer = "True only when n is odd";
      steps = ["An integer and its square have the same parity.", `So ${math("n^{2}+1")} is even exactly when ${math("n")} is odd.`];
    } else {
      statement = `${math("n^{2}+1")} is odd`;
      answer = "True only when n is even";
      steps = ["An integer and its square have the same parity.", `So ${math("n^{2}+1")} is odd exactly when ${math("n")} is even.`];
    }
  } else if (difficulty === "MEDIUM") {
    if (seed % 2 === 0) {
      statement = `${math("n(n+1)")} is even`;
      answer = "Always true";
      steps = ["Two consecutive integers always contain one even integer.", `Therefore ${math("n(n+1)")} is always even.`];
    } else {
      statement = `${math("n(n+1)")} is odd`;
      answer = "Never true";
      steps = ["Two consecutive integers always contain one even integer.", `Therefore ${math("n(n+1)")} can never be odd.`];
    }
  } else if (seed % 2 === 0) {
    statement = `${math("3n^{2}+5n+1")} is odd`;
    answer = "Always true";
    steps = [`For odd/even behaviour, ${math("3n^{2}+5n+1")} has the same parity as ${math("n^{2}+n+1")}.`, `${math("n^{2}+n=n(n+1)")} is even, so the whole expression is always odd.`];
  } else {
    statement = `${math("3n^{2}+5n+1")} is even`;
    answer = "Never true";
    steps = [`For odd/even behaviour, ${math("3n^{2}+5n+1")} has the same parity as ${math("n^{2}+n+1")}.`, `${math("n^{2}+n")} is even, so the whole expression is always odd.`];
  }
  const labels = ["Always true", "True only when n is even", "True only when n is odd", "Never true"];
  const options = labels.filter((value) => value !== answer);
  const correctIndex = Number(frozen.correctIndex);
  options.splice(correctIndex, 0, answer);
  return { stem: `For every integer ${math("n")}, which description is correct for the statement “${statement}”?`, options: Object.freeze(options), correctIndex, answer, concept: "Track only whether each part is odd or even.", steps };
}
