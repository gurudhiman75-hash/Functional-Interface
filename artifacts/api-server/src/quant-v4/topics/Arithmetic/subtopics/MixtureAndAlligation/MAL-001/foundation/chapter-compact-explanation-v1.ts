export const MAL_001_COMPACT_EXPLANATION_V1 =
  "MAL-001-EN-COMPACT-EXPLANATION-V1" as const;

const ALLIGATION_PRIMARY_QLS = new Set([
  "MAL-QL-001",
  "MAL-QL-005",
  "MAL-QL-006",
  "MAL-QL-007",
  "MAL-QL-009",
  "MAL-QL-010",
]);

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? [...value]
    : [];
}

function cleanStep(value: string): string {
  return value
    .replace(/^\s*Step\s+\d+\s*:\s*/iu, "")
    .replace(/^\s*Formula\s*:\s*/iu, "")
    .trim();
}

function cleanSteps(value: unknown): string[] {
  return stringArray(value)
    .map(cleanStep)
    .filter((line) => line.length > 0)
    .filter((line) => !/^Write each quantity and price clearly\b/iu.test(line));
}

function alligationShortcutLines(explanation: Record<string, unknown>): string[] {
  const raw = typeof explanation.examShortcut === "string"
    ? explanation.examShortcut
    : "";
  return raw
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^Method\s*2\b/iu.test(line))
    .filter((line) => !/^Place the opposite differences\b/iu.test(line))
    .filter((line) => !/^Use the quantity ratio with those differences\b/iu.test(line))
    .slice(0, 3);
}

function compactCp001(
  qlId: string,
  explanation: Record<string, unknown>,
): Record<string, unknown> {
  if (ALLIGATION_PRIMARY_QLS.has(qlId)) {
    const currentLines = stringArray(explanation.lines);
    const visual = currentLines.find((line) =>
      line.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:"),
    );
    const shortcut = alligationShortcutLines(explanation);
    const fallback = cleanSteps(explanation.steps).slice(-3);
    const lines = [
      ...(visual ? [visual] : []),
      ...(shortcut.length > 0 ? shortcut : fallback),
    ].slice(0, 4);
    return {
      ...explanation,
      lines,
    };
  }

  return {
    ...explanation,
    lines: cleanSteps(explanation.steps),
  };
}

function compactStepBased(explanation: Record<string, unknown>): Record<string, unknown> {
  const steps = cleanSteps(explanation.steps);
  if (steps.length === 0) return explanation;
  return {
    ...explanation,
    lines: steps,
  };
}

function compactSolutionFirst(explanation: Record<string, unknown>): Record<string, unknown> {
  const visibleLines = stringArray(explanation.visibleLines)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^Answer\s*:/iu.test(line));
  if (visibleLines.length > 0) {
    return {
      ...explanation,
      visibleLines,
    };
  }

  const lines = stringArray(explanation.lines)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^Answer\s*:/iu.test(line));
  if (lines.length > 0) {
    return {
      ...explanation,
      lines,
    };
  }
  return explanation;
}

export function applyMal001CompactExplanationV1<T>(question: T): T {
  const record = asRecord(question);
  if (!record) return question;
  const explanation = asRecord(record.explanation);
  if (!explanation) return question;

  const cpId = typeof record.canonicalProblemId === "string"
    ? record.canonicalProblemId
    : "";
  const qlId = typeof record.permanentQlId === "string"
    ? record.permanentQlId
    : "";

  let compact = explanation;
  if (cpId === "MAL-CP-001") {
    compact = compactCp001(qlId, explanation);
  } else if (cpId === "MAL-CP-002" || cpId === "MAL-CP-003") {
    compact = compactStepBased(explanation);
  } else if (
    cpId === "MAL-CP-004" ||
    cpId === "MAL-CP-005" ||
    cpId === "MAL-CP-006"
  ) {
    compact = compactSolutionFirst(explanation);
  }

  return {
    ...(record as T & Record<string, unknown>),
    explanation: compact,
  } as T;
}
