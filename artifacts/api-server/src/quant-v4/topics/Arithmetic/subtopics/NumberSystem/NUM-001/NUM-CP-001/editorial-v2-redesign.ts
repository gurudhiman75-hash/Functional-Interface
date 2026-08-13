export const NUM_CP001_EDITORIAL_V2_REDESIGN = true as const;

const math = (value: string) => `\\(${value}\\)`;

function placeCorrect(correct: string, distractors: readonly string[], index: number) {
  const options = [...distractors];
  const correctIndex = Math.max(0, Math.min(3, Number(index)));
  options.splice(correctIndex, 0, correct);
  if (new Set(options).size !== 4) throw new Error("Duplicate redesigned option");
  return { options: Object.freeze(options), correctIndex };
}

function oddExpression(frozen: any) {
  const difficulty = String(frozen.difficulty).toUpperCase();
  let stem: string;
  let correct: string;
  let distractors: string[];
  let steps: readonly string[];
  if (difficulty === "EASY") {
    stem = `If ${math("a")} is odd and ${math("b")} is even, which expression is always odd?`;
    correct = math("a+b");
    distractors = [math("a+b+1"), math("ab"), math("b^{2}")];
    steps = [`${math("a+b")} is odd + even, so it is odd.`, "The other three expressions are even."];
  } else if (difficulty === "MEDIUM") {
    stem = `If ${math("p")} and ${math("q")} are odd and ${math("r")} is even, which expression is odd?`;
    correct = math("pq+r");
    distractors = [math("p+q+r"), math("pr+q+1"), math("r^{2}+p+q")];
    steps = [`${math("pq")} is odd and ${math("r")} is even.`, `Therefore ${math("pq+r")} is odd; the other options are even.`];
  } else {
    stem = `If ${math("m")} is odd and ${math("n")} is even, which expression is odd?`;
    correct = math("m^{2}+mn+n^{3}");
    distractors = [math("m^{2}+n^{2}+1"), math("m^{3}+mn+1"), math("m(n+1)+1")];
    steps = [`${math("m^{2}")} is odd, while ${math("mn")} and ${math("n^{3}")} are even.`, `Therefore ${math("m^{2}+mn+n^{3}")} is odd; the other options are even.`];
  }
  const placed = placeCorrect(correct, distractors, frozen.correctIndex);
  return { stem, options: placed.options, correctIndex: placed.correctIndex, answer: correct, concept: "Use parity rules; exact numerical calculation is unnecessary.", steps };
}

function filteredIntervalCount(frozen: any, seed: number) {
  const band = String(frozen.difficulty).toUpperCase();
  const shift = Math.abs(seed) % 3;
  let low: number;
  let high: number;
  let kind: "positive" | "negative" | "even" | "odd";
  let values: number[];
  let stem: string;
  let concept: string;

  if (band === "EASY") {
    low = -6 - shift;
    high = 7 + shift;
    kind = seed % 2 === 0 ? "positive" : "negative";
    values = Array.from({ length: high - low + 1 }, (_, index) => low + index).filter((value) => kind === "positive" ? value > 0 : value < 0);
    stem = `How many ${kind} integers are there in the interval [${low},${high}]?`;
    concept = `Count only the ${kind} integers inside the closed interval.`;
  } else if (band === "MEDIUM") {
    low = -9 - shift;
    high = 8 + shift;
    kind = seed % 2 === 0 ? "even" : "odd";
    values = Array.from({ length: high - low + 1 }, (_, index) => low + index).filter((value) => kind === "even" ? value % 2 === 0 : Math.abs(value % 2) === 1);
    stem = `How many ${kind} integers are there in the interval [${low},${high}]?`;
    concept = `Apply the ${kind} filter to all integers in the closed interval.`;
  } else {
    low = -8 - shift;
    high = 10 + shift;
    kind = seed % 2 === 0 ? "even" : "odd";
    values = Array.from({ length: high - low }, (_, index) => low + 1 + index).filter((value) => value <= high && (kind === "even" ? value % 2 === 0 : Math.abs(value % 2) === 1));
    stem = `How many ${kind} integers ${math("x")} satisfy ${math(`${low}<x\\le${high}`)}?`;
    concept = `Apply the open/closed bounds first, then count only the ${kind} integers.`;
  }

  const count = values.length;
  const correct = math(String(count));
  const distractors = [Math.max(0, count - 1), count + 1, count + 2].map((value) => math(String(value)));
  const placed = placeCorrect(correct, distractors, frozen.correctIndex);
  const listed = values.length <= 12 ? values.map((value) => math(String(value))).join(", ") : `${values.length} qualifying integers`;
  return {
    stem,
    options: placed.options,
    correctIndex: placed.correctIndex,
    answer: correct,
    concept,
    steps: [values.length <= 12 ? `The qualifying integers are ${listed}.` : listed, `Hence the count is ${correct}.`],
  };
}

export function redesignEnglishQl(frozen: any, seed: number) {
  const qlId = String(frozen.questionLanguageId ?? frozen.permanentQlId);
  if (qlId === "NUM-QL-129") return oddExpression(frozen);
  if (qlId === "NUM-QL-135") return filteredIntervalCount(frozen, seed);
  return null;
}
