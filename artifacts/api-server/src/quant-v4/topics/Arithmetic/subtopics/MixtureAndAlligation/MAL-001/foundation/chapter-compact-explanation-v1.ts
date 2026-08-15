export const MAL_001_DUAL_METHOD_EXPLANATION_V2 =
  "MAL-001-EN-DUAL-METHOD-EXPLANATION-V2" as const;

const CP001_ALLIGATION_CROSS_QLS = new Set([
  "MAL-QL-001",
  "MAL-QL-005",
  "MAL-QL-006",
  "MAL-QL-007",
  "MAL-QL-009",
  "MAL-QL-010",
]);

const CP004_ALLIGATION_CROSS_QLS = new Set([
  "MAL-QL-041",
  "MAL-QL-042",
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

function compressSteps(steps: readonly string[], maxLines: number): string[] {
  if (steps.length <= maxLines) return [...steps];
  const groups: string[][] = Array.from({ length: maxLines }, () => []);
  for (let index = 0; index < steps.length; index += 1) {
    const groupIndex = Math.min(
      maxLines - 1,
      Math.floor((index * maxLines) / steps.length),
    );
    groups[groupIndex]!.push(steps[index]!);
  }
  return groups
    .filter((group) => group.length > 0)
    .map((group) => group.join(" "));
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
    .slice(0, 4);
}

function cp001DualMethod(
  explanation: Record<string, unknown>,
): Record<string, unknown> {
  const currentLines = stringArray(explanation.lines);
  const visual = currentLines.find((line) =>
    line.startsWith("[[EXAMTREE_ALLIGATION_SVG_V1:"),
  );
  const normal = compressSteps(cleanSteps(explanation.steps), 4);
  const shortcut = alligationShortcutLines(explanation);
  const alligation = shortcut.length > 0
    ? shortcut
    : compressSteps(cleanSteps(explanation.steps).slice(-3), 3);

  return {
    ...explanation,
    lines: [
      "Method 1 — Simple Method",
      ...normal,
      "Method 2 — Alligation Cross",
      ...(visual ? [visual] : []),
      ...alligation,
    ],
  };
}

function simpleStepBased(explanation: Record<string, unknown>): Record<string, unknown> {
  const steps = compressSteps(cleanSteps(explanation.steps), 5);
  if (steps.length === 0) return explanation;
  return {
    ...explanation,
    lines: ["Simple Method", ...steps],
  };
}

function cp004SimpleIdea(qlId: string): string | null {
  if (qlId === "MAL-QL-041") {
    return "Only water is added, so the amount of solute remains unchanged.";
  }
  if (qlId === "MAL-QL-042") {
    return "Pure solute is added, so the amount of solvent remains unchanged.";
  }
  return null;
}

function cp004DualMethod(
  qlId: string,
  explanation: Record<string, unknown>,
): Record<string, unknown> {
  const normal = stringArray(explanation.visibleLines)
    .map((line) => normaliseCompactMath(line.trim()))
    .filter(Boolean)
    .filter((line) => !/^Answer\s*:/iu.test(line));
  const idea = cp004SimpleIdea(qlId);
  const optionalHelp = asRecord(explanation.optionalHelp);
  const alternative = asRecord(optionalHelp?.alternativeMethod);
  if (!alternative) {
    return {
      ...explanation,
      visibleLines: ["Simple Method", ...(idea ? [idea] : []), ...normal],
    };
  }

  const crossLines = stringArray(alternative.crossLines);
  const ratioLabel = typeof alternative.ratioLabel === "string"
    ? alternative.ratioLabel
    : "Required ratio";
  const ratio = typeof alternative.ratio === "string"
    ? alternative.ratio
    : "";
  const calculation = typeof alternative.calculation === "string"
    ? normaliseCompactMath(alternative.calculation)
    : "";

  return {
    ...explanation,
    visibleLines: [
      "Method 1 — Simple Method",
      ...(idea ? [idea] : []),
      ...normal,
      "Method 2 — Alligation Cross",
      ...(crossLines.length > 0 ? [crossLines.join("\n")] : []),
      ...(ratio ? [`${ratioLabel} = ${ratio}.`] : []),
      ...(calculation ? [calculation] : []),
    ],
  };
}

function solutionFirstSimple(explanation: Record<string, unknown>): Record<string, unknown> {
  const visibleLines = stringArray(explanation.visibleLines)
    .map((line) => normaliseCompactMath(line.trim()))
    .filter(Boolean)
    .filter((line) => !/^Answer\s*:/iu.test(line));
  if (visibleLines.length > 0) {
    return {
      ...explanation,
      visibleLines: ["Simple Method", ...visibleLines],
    };
  }

  const lines = stringArray(explanation.lines)
    .map((line) => normaliseCompactMath(line.trim()))
    .filter(Boolean)
    .filter((line) => !/^Answer\s*:/iu.test(line));
  if (lines.length > 0) {
    return {
      ...explanation,
      lines: ["Simple Method", ...lines],
    };
  }
  return explanation;
}

export function applyMal001DualMethodExplanationV2<T>(question: T): T {
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

  let learnerExplanation = explanation;
  if (cpId === "MAL-CP-001" && CP001_ALLIGATION_CROSS_QLS.has(qlId)) {
    learnerExplanation = cp001DualMethod(explanation);
  } else if (cpId === "MAL-CP-001" || cpId === "MAL-CP-002" || cpId === "MAL-CP-003") {
    learnerExplanation = simpleStepBased(explanation);
  } else if (cpId === "MAL-CP-004" && CP004_ALLIGATION_CROSS_QLS.has(qlId)) {
    learnerExplanation = cp004DualMethod(qlId, explanation);
  } else if (cpId === "MAL-CP-004" || cpId === "MAL-CP-005" || cpId === "MAL-CP-006") {
    learnerExplanation = solutionFirstSimple(explanation);
  }

  return {
    ...(record as T & Record<string, unknown>),
    explanation: learnerExplanation,
  } as T;
}

// Temporary compatibility alias for callers outside MAL-001 while the review branch is open.
export const applyMal001CompactExplanationV1 = applyMal001DualMethodExplanationV2;
