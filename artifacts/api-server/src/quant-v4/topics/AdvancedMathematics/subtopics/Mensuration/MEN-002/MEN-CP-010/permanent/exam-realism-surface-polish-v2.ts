type SurfaceQuestion = {
  readonly sourceId: string;
  readonly stem: string;
  readonly answer: string;
  readonly options: readonly {
    readonly label: "A" | "B" | "C" | "D";
    readonly display: string;
    readonly isCorrect: boolean;
    readonly misconceptionId: string | null;
  }[];
  readonly explanation: {
    readonly keyRule: string;
    readonly steps: readonly { readonly title: string; readonly body: string }[];
    readonly shortcut: string;
    readonly traps: readonly string[];
  };
};

function improperAreaFractionToMixed(display: string) {
  const match = /^(\d+)\/(\d+)\s+(cm²|m²)$/.exec(display.trim());
  if (!match) return display;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (!denominator || numerator < denominator) return display;
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  return remainder === 0
    ? `${whole} ${match[3]}`
    : `${whole} ${remainder}/${denominator} ${match[3]}`;
}

export function polishMenCp010FrustumTsaDisplayV2<T extends SurfaceQuestion>(question: T): T {
  if (
    question.sourceId !== "MEN-CP010-PROT-CONICAL-FRUSTUM-TSA" ||
    !/Take π = 22\/7/.test(question.stem)
  ) return question;

  const replacements = question.options.map((option) => [
    option.display,
    improperAreaFractionToMixed(option.display),
  ] as const);
  const newAnswer = improperAreaFractionToMixed(question.answer);
  const allReplacements = [...replacements, [question.answer, newAnswer] as const];
  const options = question.options.map((option, index) => ({
    ...option,
    display: replacements[index]![1],
  }));
  const steps = question.explanation.steps.map((step) => ({
    ...step,
    body: allReplacements.reduce(
      (body, [from, to]) => from === to ? body : body.split(from).join(to),
      step.body,
    ),
  }));

  return {
    ...question,
    answer: newAnswer,
    options,
    explanation: { ...question.explanation, steps },
  } as T;
}
