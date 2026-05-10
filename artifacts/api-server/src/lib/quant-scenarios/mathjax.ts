import type { ReasoningStep } from "../shared";

function splitMathDelimitedSegments(
  text: string,
) {
  const segments: Array<{
    text: string;
    isMath: boolean;
  }> = [];
  const pattern =
    /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while (
    (match = pattern.exec(text)) !== null
  ) {
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(
          lastIndex,
          match.index,
        ),
        isMath: false,
      });
    }
    segments.push({
      text: match[0],
      isMath: true,
    });
    lastIndex =
      match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isMath: false,
    });
  }

  return segments;
}

function normalizePlainQuantMath(
  text: string,
) {
  return text
    .replace(
      /(?<![\w\\])([A-Za-z][A-Za-z0-9_]*|\d+)\s*\/\s*([A-Za-z][A-Za-z0-9_]*|\d+)(?![\w\\])/g,
      (
        _match,
        numerator: string,
        denominator: string,
      ) =>
        `$\\frac{${numerator}}{${denominator}}$`,
    )
    .replace(
      /(?<![\w\\$])([A-Za-z][A-Za-z0-9_]*|\d+)\s*\^\s*([A-Za-z][A-Za-z0-9_]*|\d+)(?![\w\\$])/g,
      (
        _match,
        base: string,
        exponent: string,
      ) => `$${base}^{${exponent}}$`,
    )
    .replace(
      /=\s*([^;\n]+?)(?=\.(?:\s+[A-Z]|$)|[;\n]|$)/g,
      (
        _match,
        rightHandSide: string,
      ) => {
        let trimmed =
          rightHandSide.trim();
        let suffix = "";

        if (trimmed.endsWith(".")) {
          trimmed = trimmed
            .slice(0, -1)
            .trim();
          suffix = ".";
        }

        if (
          trimmed.includes("$") ||
          (!/[0-9]/.test(trimmed) &&
            !/[+\-*/^]/.test(trimmed))
        ) {
          return `= ${trimmed}${suffix}`;
        }

        const formatted =
          trimmed
            .replace(
              /\s+x\s+/g,
              " \\times ",
            )
            .replace(
              /\s+\*\s+/g,
              " \\times ",
            );
        return `= $${formatted}$${suffix}`;
      },
    );
}

function normalizeMathSegment(
  text: string,
) {
  return text.replace(
    /\^(?!\{)([A-Za-z0-9]+)/g,
    "^{$1}",
  ).replace(/\^\{\s*([^}]+?)\s*\}/g, "^{$1}");
}

export function normalizeQuantMathText(
  value: string | undefined,
) {
  if (!value) {
    return value;
  }

  return splitMathDelimitedSegments(value)
    .map((segment) =>
      segment.isMath
        ? normalizeMathSegment(
            segment.text,
          )
        : normalizePlainQuantMath(
            segment.text,
          ),
    )
    .join("");
}

export function normalizeQuantOptionValue(
  value: unknown,
) {
  if (value === null || value === undefined) {
    return "";
  }

  const optionText = String(value);

  if (!optionText) {
    return optionText;
  }

  const labeledMatch =
    optionText.match(
      /^([A-Z]\.\s*)(.+)$/u,
    );
  if (labeledMatch) {
    const [, label, rawValue] =
      labeledMatch;
    const trimmed =
      rawValue.trim();
    if (
      trimmed.includes("$")
    ) {
      return `${label}${normalizeQuantMathText(trimmed)}`;
    }
    if (
      /^[-+]?[\d.]+(?:\s*%|\/\d+)?$/u.test(
        trimmed,
      )
    ) {
      return `${label}$${trimmed}$`;
    }
    return `${label}${normalizeQuantMathText(trimmed)}`;
  }

  const trimmed = optionText.trim();
  if (trimmed.includes("$")) {
    return normalizeQuantMathText(trimmed)!;
  }
  if (
    /^[-+]?[\d.]+(?:\s*%|\/\d+)?$/u.test(
      trimmed,
    )
  ) {
    return `$${trimmed}$`;
  }
  return normalizeQuantMathText(trimmed)!;
}

export function normalizeQuantReasoningSteps(
  steps: ReasoningStep[],
) {
  return steps.map((step) => ({
    ...step,
    text: normalizeQuantMathText(
      step.text,
    )!,
  }));
}
