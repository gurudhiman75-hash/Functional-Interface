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

export function redesignEnglishQl(frozen: any, _seed: number) {
  const qlId = String(frozen.questionLanguageId ?? frozen.permanentQlId);
  if (qlId === "NUM-QL-129") return oddExpression(frozen);
  return null;
}
