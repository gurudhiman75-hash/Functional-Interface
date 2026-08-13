export function buildQl125Editorial(frozen: any, seed: number) {
  const m = (v: string) => `\\(${v}\\)`;
  const band = String(frozen.difficulty).toUpperCase();
  let answer: string, distractors: string[], steps: readonly string[];
  if (band === "EASY") {
    answer = `${m("0")} is an even integer.`;
    distractors = [`${m("0")} is an odd integer.`, `${m("-2")} is a whole number.`, `${m("-1")} is a natural number.`];
    steps = [`${m("0=2\\times0")}, so ${m("0")} is even.`, "Negative integers are not whole or natural numbers."];
  } else if (band === "MEDIUM") {
    const n = -(2 + (seed % 9));
    answer = `${m(String(n))} is both an integer and a rational number.`;
    distractors = [`${m(String(n))} is a whole number.`, `${m(String(n))} is a natural number.`, `${m("0")} is an odd integer.`];
    steps = [`${m(String(n))} is an integer.`, `Every integer can be written as ${m(`${n}/1`)}, so it is rational.`];
  } else {
    answer = "Every integer is a rational number.";
    distractors = ["Every rational number is an integer.", `${m("\\sqrt{2}")} is rational.`, `${m("-3")} is a whole number.`];
    steps = ["Every integer can be written as a fraction with denominator 1.", `For example, ${m("-3=-3/1")}.`];
  }
  const options = [...distractors];
  const correctIndex = Number(frozen.correctIndex);
  options.splice(correctIndex, 0, answer);
  return { stem: "Which one of the following statements is correct?", options: Object.freeze(options), correctIndex, answer, concept: "Use the definitions of integers, rational numbers, whole numbers and parity.", steps };
}
