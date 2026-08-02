interface TextOption {
  text: string;
}

interface LocalizedQuestionLike {
  stem: string;
  options: string[];
  optionAudit: TextOption[];
  correctIndex: number;
  solution: {
    answerText: string;
    [key: string]: unknown;
  };
  explanation: {
    opening: string;
    formula: string;
    givens?: string[];
    steps: string[];
    shortcut: {
      title: string;
      steps: string[];
    };
    commonTrap: {
      optionLabel: string;
      optionText: string;
      explanation: string;
      [key: string]: unknown;
    };
    conclusion: string;
    [key: string]: unknown;
  };
  validation: {
    valid: boolean;
    errors: string[];
  };
  [key: string]: unknown;
}

function sanitizeOutsideMath(value: string): string {
  const parts = value.split(/(\\\([\s\S]*?\\\))/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) return part;
    return part
      .replace(
        /\b(\d+)\s+(\d+)\/(\d+)\s*%/g,
        "\\($1\\frac{$2}{$3}\\%\\)",
      )
      .replace(
        /\b(\d+)\/(\d+)\s*%/g,
        "\\(\\frac{$1}{$2}\\%\\)",
      )
      .replace(
        /\b(\d+)\s+(\d+)\/(\d+)\b/g,
        "\\($1\\frac{$2}{$3}\\)",
      )
      .replace(
        /\b(\d+)\/(\d+)\b/g,
        "\\(\\frac{$1}{$2}\\)",
      );
  }).join("");
}

function sanitizeList(values: string[] | undefined): string[] | undefined {
  return values?.map(sanitizeOutsideMath);
}

export function sanitizeTmw001LocalizedPresentation<
  T extends LocalizedQuestionLike,
>(question: T): T {
  const options = question.options.map(sanitizeOutsideMath);
  const optionAudit = question.optionAudit.map((option, index) => ({
    ...option,
    text: options[index] ?? sanitizeOutsideMath(option.text),
  }));
  const answerText = options[question.correctIndex]
    ?? sanitizeOutsideMath(question.solution.answerText);
  const originalTrapIndex = question.options.findIndex(
    (option) => option === question.explanation.commonTrap.optionText,
  );
  const trapOptionText = originalTrapIndex >= 0
    ? options[originalTrapIndex]!
    : sanitizeOutsideMath(question.explanation.commonTrap.optionText);

  const updated = {
    ...question,
    stem: sanitizeOutsideMath(question.stem),
    options,
    optionAudit,
    solution: {
      ...question.solution,
      answerText,
    },
    explanation: {
      ...question.explanation,
      opening: sanitizeOutsideMath(question.explanation.opening),
      formula: sanitizeOutsideMath(question.explanation.formula),
      givens: sanitizeList(question.explanation.givens),
      steps: question.explanation.steps.map(sanitizeOutsideMath),
      shortcut: {
        ...question.explanation.shortcut,
        title: sanitizeOutsideMath(question.explanation.shortcut.title),
        steps: question.explanation.shortcut.steps.map(sanitizeOutsideMath),
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        optionLabel: sanitizeOutsideMath(
          question.explanation.commonTrap.optionLabel,
        ),
        optionText: trapOptionText,
        explanation: sanitizeOutsideMath(
          question.explanation.commonTrap.explanation,
        ),
      },
      conclusion: sanitizeOutsideMath(question.explanation.conclusion),
    },
  } as T;

  const errors = [...updated.validation.errors];
  if (updated.options[updated.correctIndex] !== updated.solution.answerText) {
    errors.push("Sanitized correct option differs from sanitized answer text");
  }
  if (!updated.options.includes(updated.explanation.commonTrap.optionText)) {
    errors.push("Sanitized common-trap option is not present in options");
  }

  return {
    ...updated,
    validation: {
      valid: errors.length === 0,
      errors,
    },
  };
}
