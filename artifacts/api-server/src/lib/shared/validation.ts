import {
  extractTemplatePlaceholders,
} from "./text";

export type CompatibilityIssue = {
  reason: string;
};

export type CompatibilityResult = {
  valid: boolean;
  issues: CompatibilityIssue[];
};

export function validateQuestionRealization(
  templates: string[],
  values: Record<string, string | number>,
) {
  const issues: CompatibilityIssue[] = [];
  const missingKeys = new Set<string>();

  templates.forEach((template) => {
    extractTemplatePlaceholders(
      template,
    ).forEach((key) => {
      if (values[key] === undefined) {
        missingKeys.add(key);
      }
    });
  });

  if (missingKeys.size) {
    issues.push({
      reason: `Missing template variables: ${[
        ...missingKeys,
      ].join(", ")}`,
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  } satisfies CompatibilityResult;
}

export function validateFormulaReferences(
  formula: string | undefined,
  values: Record<string, number>,
) {
  if (!formula) {
    return {
      valid: false,
      issues: [
        {
          reason:
            "Pattern formula is missing.",
        },
      ],
    } satisfies CompatibilityResult;
  }

  const referencedVariables = [
    ...new Set(
      Array.from(
        formula.matchAll(
          /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g,
        ),
      )
        .map((match) => match[0]!)
        .filter(
          (token) =>
            ![
              "Math",
              "return",
              "true",
              "false",
            ].includes(token) &&
            !/^\d/.test(token),
        ),
    ),
  ];
  const missingVariables =
    referencedVariables.filter(
      (key) => values[key] === undefined,
    );

  return {
    valid:
      missingVariables.length === 0,
    issues: missingVariables.length
      ? [
          {
            reason: `Formula references missing variables: ${missingVariables.join(
              ", ",
            )}`,
          },
        ]
      : [],
  } satisfies CompatibilityResult;
}

export function fillTemplate(
  template: string,
  values: Record<string, number>,
) {
  const compatibility =
    validateQuestionRealization(
      [template],
      values,
    );
  let result = template;

  for (const key in values) {
    result = result.replaceAll(
      `{{${key}}}`,
      String(values[key]),
    );
  }

  if (!compatibility.valid) {
    result = result.replace(
      /\{\{[^}]+\}\}/g,
      "the required value",
    );
  }

  return result.replace(
    /\{\{[^}]+\}\}/g,
    "the required value",
  );
}

export function renderExplanation(
  template: string,
  values: Record<string, number>,
  answer: number,
) {
  const compatibility =
    validateQuestionRealization(
      [template],
      {
        ...values,
        answer,
      },
    );
  let result = template;

  for (const key in values) {
    result = result.replaceAll(
      `{{${key}}}`,
      String(values[key]),
    );
  }

  result = result.replaceAll(
    "{{answer}}",
    String(answer),
  );

  if (!compatibility.valid) {
    result = result.replace(
      /\{\{[^}]+\}\}/g,
      "the derived quantity",
    );
  }

  return result.replace(
    /\{\{[^}]+\}\}/g,
    "the derived quantity",
  );
}
