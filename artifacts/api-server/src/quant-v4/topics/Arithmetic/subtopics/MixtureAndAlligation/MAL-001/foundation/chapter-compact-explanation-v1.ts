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

function normaliseCompactMath(value: string): string {
  return value.replace(
    /\\frac\{([^{}]+)\{\\,\\text\{(?:kg|litres?)\}\}\{([^{}]+)\}/gu,
    "\\frac{$1}{$2}",
  );
}

function cleanStep(value: string): string {
  return normaliseCompactMath(value)
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

function joinGroups(
  steps: readonly string[],
  groups: readonly (readonly number[])[],
): string[] {
  if (groups.some((group) => group.some((index) => !steps[index]))) return [...steps];
  return groups.map((group) => group.map((index) => steps[index]!).join(" "));
}

function alligationShortcutLines(explanation: Record<string, unknown>): string[] {
  const raw = typeof explanation.examShortcut === "string"
    ? explanation.examShortcut
    : "";
  return raw
    .split(/\r?\n/u)
    .map((line) => normaliseCompactMath(line.trim()))
    .filter(Boolean)
    .filter((line) => !/^Method\s*2\b/iu.test(line))
    .filter((line) => !/^Place the opposite differences\b/iu.test(line))
    .slice(0, 3);
}

function compactCp001Steps(qlId: string, steps: string[]): string[] {
  switch (qlId) {
    case "MAL-QL-002":
      return joinGroups(steps, [[0, 1], [2], [3], [4]]);
    case "MAL-QL-003":
      return joinGroups(steps, [[0], [1, 2], [3, 4], [5]]);
    case "MAL-QL-004":
      return joinGroups(steps, [[0, 1, 2], [3], [4], [5]]);
    case "MAL-QL-008":
      return joinGroups(steps, [[0, 1], [2, 3], [4], [5]]);
    case "MAL-QL-011":
      return joinGroups(steps, [[0, 1], [2, 3], [4, 5], [6, 7]]);
    default:
      return steps;
  }
}

function compactCp002Steps(qlId: string, steps: string[]): string[] {
  switch (qlId) {
    case "MAL-QL-012":
    case "MAL-QL-013":
      return joinGroups(steps, [[0, 1], [2], [3], [4]]);
    case "MAL-QL-019":
      return joinGroups(steps, [[0, 1], [2, 3], [4, 5]]);
    case "MAL-QL-020":
    case "MAL-QL-021":
      return joinGroups(steps, [[0, 1], [2, 3], [4], [5]]);
    case "MAL-QL-023":
    case "MAL-QL-024":
      return joinGroups(steps, [[0, 1], [2], [3, 4], [5, 6]]);
    case "MAL-QL-025":
      return joinGroups(steps, [[0, 1], [2, 3], [4, 5]]);
    case "MAL-QL-026":
      return joinGroups(steps, [[0, 1], [2, 3]]);
    case "MAL-QL-027":
      return joinGroups(steps, [[0, 1], [2], [3], [4, 5]]);
    case "MAL-QL-028":
      return joinGroups(steps, [[0, 1], [2], [4]]);
    default:
      return steps;
  }
}

function compactCp003Steps(qlId: string, steps: string[]): string[] {
  switch (qlId) {
    case "MAL-QL-031":
      return joinGroups(steps, [[0, 1], [2, 3], [4]]);
    case "MAL-QL-034":
      return joinGroups(steps, [[0, 1], [2], [3], [4]]);
    case "MAL-QL-035":
      return joinGroups(steps, [[0, 1], [2, 3], [4]]);
    case "MAL-QL-036":
      return joinGroups(steps, [[0, 1], [2, 3], [4]]);
    case "MAL-QL-037":
      return joinGroups(steps, [[0, 1], [2], [3, 4]]);
    default:
      return steps;
  }
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

  const steps = compactCp001Steps(qlId, cleanSteps(explanation.steps));
  return {
    ...explanation,
    lines: steps,
  };
}

function compactStepBased(
  cpId: string,
  qlId: string,
  explanation: Record<string, unknown>,
): Record<string, unknown> {
  const rawSteps = cleanSteps(explanation.steps);
  if (rawSteps.length === 0) return explanation;
  const steps = cpId === "MAL-CP-002"
    ? compactCp002Steps(qlId, rawSteps)
    : compactCp003Steps(qlId, rawSteps);
  return {
    ...explanation,
    lines: steps,
  };
}

function compactSolutionFirst(explanation: Record<string, unknown>): Record<string, unknown> {
  const visibleLines = stringArray(explanation.visibleLines)
    .map((line) => normaliseCompactMath(line.trim()))
    .filter(Boolean)
    .filter((line) => !/^Answer\s*:/iu.test(line));
  if (visibleLines.length > 0) {
    return {
      ...explanation,
      visibleLines,
    };
  }

  const lines = stringArray(explanation.lines)
    .map((line) => normaliseCompactMath(line.trim()))
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
    compact = compactStepBased(cpId, qlId, explanation);
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
