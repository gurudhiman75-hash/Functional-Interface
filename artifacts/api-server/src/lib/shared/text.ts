export function extractTemplatePlaceholders(
  template: string | undefined,
) {
  if (!template) {
    return [];
  }

  return [
    ...new Set(
      Array.from(
        template.matchAll(
          /\{\{([^}]+)\}\}|\{([^}]+)\}/g,
        ),
      )
        .map(
          (match) =>
            match[1] ?? match[2] ?? "",
        )
        .filter(
          (key) =>
            key &&
            key !== "answer" &&
            key !== "baseText" &&
            key !== "topic" &&
            key !== "subtopic",
        ),
    ),
  ];
}

export function renderNamedTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  let result = template;

  Object.entries(values).forEach(
    ([key, value]) => {
      result = result
        .replaceAll(
          `{{${key}}}`,
          String(value),
        )
        .replaceAll(
          `{${key}}`,
          String(value),
        );
    },
  );

  return result
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\{[^}]+\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function countMatches(
  value: string,
  pattern: RegExp,
) {
  return value.match(pattern)?.length ?? 0;
}

export function hasAnyToken(
  value: string,
  tokens: string[],
) {
  return tokens.some((token) =>
    value.includes(token),
  );
}

export function normalizeNumericValue(
  value: number,
) {
  return Number(value.toFixed(2));
}
