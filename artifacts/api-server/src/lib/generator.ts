export type Pattern = {
  id: string;

  type: "formula" | "logic";

  section: string;
  topic: string;
  subtopic: string;

  difficulty?: "Easy" | "Medium" | "Hard";

  templateVariants: string[];

  variables: Record<
    string,
    {
      min: number;
      max: number;
    }
  >;

  formula?: string;

  distractorStrategy?: {
    type: "numeric_offsets";
    offsets: number[];
  };
};

function randomInt(min: number, max: number) {
  return Math.floor(
    Math.random() * (max - min + 1),
  ) + min;
}

function generateValues(
  variables: Pattern["variables"],
): Record<string, number> {
  const values: Record<string, number> = {};

  for (const key in variables) {
    const { min, max } = variables[key];

    values[key] = randomInt(min, max);
  }

  return values;
}

function pickRandomTemplate(
  templateVariants: string[],
): string {
  if (!templateVariants?.length) {
    throw new Error(
      "No template variants provided",
    );
  }

  const idx = Math.floor(
    Math.random() * templateVariants.length,
  );

  return templateVariants[idx];
}

function fillTemplate(
  template: string,
  values: Record<string, number>,
) {
  let result = template;

  for (const key in values) {
    result = result.replaceAll(
      `{{${key}}}`,
      String(values[key]),
    );
  }

  return result;
}

function evaluateFormula(
  formula: string,
  values: Record<string, number>,
): number {
  try {
    const varNames = Object.keys(values);

    const varValues = varNames.map(
      (k) => values[k],
    );

    const fn = new Function(
      ...varNames,
      `return ${formula};`,
    );

    return Number(fn(...varValues));
  } catch {
    throw new Error("Invalid formula");
  }
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(
    () => Math.random() - 0.5,
  );
}

function generateOptions(
  correct: number,
  strategy?: Pattern["distractorStrategy"],
) {
  const options = new Set<number>();

  options.add(correct);

  if (
    strategy?.type === "numeric_offsets"
  ) {
    for (const offset of strategy.offsets) {
      options.add(correct + offset);
    }
  } else {
    while (options.size < 4) {
      const variance = Math.max(
        2,
        Math.round(
          Math.abs(correct) * 0.1,
        ),
      );

      options.add(
        correct +
          randomInt(
            -variance,
            variance,
          ),
      );
    }
  }

  const shuffled = shuffle(
    [...options].slice(0, 4),
  ).map(String);

  return {
    options: shuffled,
    correct: shuffled.indexOf(
      String(correct),
    ),
  };
}

export function generateFromPattern(
  pattern: Pattern,
  count: number,
) {
  if (pattern.type === "logic") {
    throw new Error(
      "Logic generator not implemented",
    );
  }

  const questions = [];

  for (let i = 0; i < count; i++) {
    const values = generateValues(
      pattern.variables,
    );

    const template =
      pickRandomTemplate(
        pattern.templateVariants,
      );

    const text = fillTemplate(
      template,
      values,
    );

    const correctAnswer =
      evaluateFormula(
        pattern.formula!,
        values,
      );

    const generated =
      generateOptions(
        correctAnswer,
        pattern.distractorStrategy,
      );

    questions.push({
      text,

      options: generated.options,

      correct: generated.correct,

      explanation: `Calculated using formula ${pattern.formula}`,

      section: pattern.section,

      topic: pattern.topic,

      subtopic: pattern.subtopic,

      difficulty:
        pattern.difficulty ?? "Easy",
    });
  }

  return questions;
}