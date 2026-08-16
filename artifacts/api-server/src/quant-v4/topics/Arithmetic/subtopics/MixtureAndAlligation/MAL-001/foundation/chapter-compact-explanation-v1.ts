export const MAL_001_DUAL_METHOD_EXPLANATION_V3 =
  "MAL-001-EN-DUAL-METHOD-EXPLANATION-V3" as const;

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

const CP005_ALLIGATION_CROSS_QLS = new Set([
  "MAL-QL-055",
  "MAL-QL-058",
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
    .replace(
      /Known total value = ([^.]+)\. Therefore, known total value = \1\.\s*/u,
      "Known total value = $1. ",
    )
    .replace(/\s*Therefore, known total value = [^.]+\./u, "")
    .replace(/\bq litre\b/gu, "q litres")
    .replace(/Take the exact 2th root\s*:/iu, "Take the square root of the retained fraction:")
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

function mixedFractionToDecimalLine(value: string): string {
  const plain = value.replaceAll("\\[", "").replaceAll("\\]", "");
  return plain.replace(
    /After (\d+) operations, the original quantity is ([0-9]+) ([0-9]+)\/([0-9]+), which is (not )?below ([0-9]+(?:\.[0-9]+)?)./u,
    (_match, stageText, wholeText, numeratorText, denominatorText, notText, thresholdText) => {
      const stage = Number(stageText);
      const whole = Number(wholeText);
      const numerator = Number(numeratorText);
      const denominator = Number(denominatorText);
      const threshold = Number(thresholdText);
      const amount = whole + numerator / denominator;
      const comparison = notText
        ? `still above ${threshold}`
        : `below ${threshold}`;
      return `After ${stage} operations, the original quantity is about ${amount.toFixed(2)} litres, so it is ${comparison}.`;
    },
  );
}

function refineCp003Steps(qlId: string, steps: readonly string[]): string[] {
  if (qlId === "MAL-QL-037") {
    return steps.map(mixedFractionToDecimalLine);
  }
  return [...steps];
}

function simpleStepBased(
  cpId: string,
  qlId: string,
  explanation: Record<string, unknown>,
): Record<string, unknown> {
  const raw = cleanSteps(explanation.steps);
  const refined = cpId === "MAL-CP-003"
    ? refineCp003Steps(qlId, raw)
    : raw;
  const steps = compressSteps(refined, 5);
  if (steps.length === 0) return explanation;
  return {
    ...explanation,
    lines: ["Simple Method", ...steps],
  };
}

function cp004SimpleIdea(qlId: string): string | null {
  switch (qlId) {
    case "MAL-QL-038":
      return "Water is the remaining percentage after subtracting the alcohol percentage from 100%.";
    case "MAL-QL-039":
      return "First find the total mixture; concentration is acid quantity divided by total quantity, multiplied by 100.";
    case "MAL-QL-040":
      return "The given acid amount is only the stated percentage of the whole solution, so divide it by that percentage to recover the total.";
    case "MAL-QL-041":
      return "Only water is added, so the amount of solute remains unchanged.";
    case "MAL-QL-042":
      return "Pure solute is added, so the amount of solvent remains unchanged.";
    case "MAL-QL-043":
    case "MAL-QL-044":
    case "MAL-QL-045":
      return "Only water evaporates, so the amount of dissolved solute remains unchanged.";
    case "MAL-QL-046":
    case "MAL-QL-047":
      return "Drying removes moisture, but the amount of dry matter remains unchanged.";
    default:
      return null;
  }
}

function cp005SimpleIdea(qlId: string): string | null {
  switch (qlId) {
    case "MAL-QL-048":
    case "MAL-QL-049":
    case "MAL-QL-050":
    case "MAL-QL-051":
    case "MAL-QL-052":
    case "MAL-QL-053":
      return "Because the mixture is sold at the pure ingredient's cost price, the profit comes from the free water added to the mixture.";
    case "MAL-QL-054":
    case "MAL-QL-057":
      return "Work with one complete batch: compare its total selling value with its actual ingredient cost.";
    case "MAL-QL-056":
    case "MAL-QL-059":
      return "First find the mixture's average cost, then increase that cost by the required profit percentage.";
    case "MAL-QL-060":
      return "The added water increases the quantity sold without increasing the purchase cost, so compare total batch revenue with the original cost.";
    default:
      return null;
  }
}

function visibleSolutionLines(explanation: Record<string, unknown>): string[] {
  const visible = stringArray(explanation.visibleLines)
    .map((line) => normaliseCompactMath(line.trim()))
    .filter(Boolean)
    .filter((line) => !/^Simple Method$/iu.test(line))
    .filter((line) => !/^Method\s*1\b/iu.test(line))
    .filter((line) => !/^Answer\s*:/iu.test(line));
  if (visible.length > 0) return visible;
  return stringArray(explanation.lines)
    .map((line) => normaliseCompactMath(line.trim()))
    .filter(Boolean)
    .filter((line) => !/^Simple Method$/iu.test(line))
    .filter((line) => !/^Method\s*1\b/iu.test(line))
    .filter((line) => !/^Answer\s*:/iu.test(line));
}

function alternativeAlligationLines(explanation: Record<string, unknown>): string[] {
  const optionalHelp = asRecord(explanation.optionalHelp);
  const alternative = asRecord(optionalHelp?.alternativeMethod);
  if (!alternative) return [];

  const directive = typeof alternative.directive === "string"
    ? alternative.directive
    : "";
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

  return [
    ...(directive ? [directive] : []),
    ...(crossLines.length > 0 ? [crossLines.join("\n")] : []),
    ...(ratio ? [`Cross differences give ${ratioLabel} = ${ratio}.`] : []),
    ...(calculation && !calculation.toLowerCase().includes(ratio.toLowerCase())
      ? [calculation]
      : []),
  ];
}

function cp004DualMethod(
  qlId: string,
  explanation: Record<string, unknown>,
): Record<string, unknown> {
  const normal = visibleSolutionLines(explanation);
  const idea = cp004SimpleIdea(qlId);
  const alligation = alternativeAlligationLines(explanation);

  return {
    ...explanation,
    visibleLines: [
      "Method 1 — Simple Method",
      ...(idea ? [idea] : []),
      ...normal,
      "Method 2 — Alligation Cross",
      ...alligation,
    ],
  };
}

function cp005DualMethod(
  record: Record<string, unknown>,
  explanation: Record<string, unknown>,
): Record<string, unknown> {
  const normal = visibleSolutionLines(explanation);
  const first = normal[0];
  const answer = typeof record.answer === "string" ? record.answer : "the required ratio";
  const parameters = asRecord(record.parameters);
  const pureCost = asRecord(parameters?.pureUnitCost);
  const adulterantCost = asRecord(parameters?.adulterantUnitCost);

  function rationalText(rational: Record<string, unknown> | null, fallback: string): string {
    if (!rational) return fallback;
    const numerator = Number(rational.numerator);
    const denominator = Number(rational.denominator);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return fallback;
    }
    if (numerator % denominator === 0) return String(numerator / denominator);
    const whole = Math.trunc(numerator / denominator);
    const remainder = Math.abs(numerator % denominator);
    return whole === 0
      ? `${remainder}/${Math.abs(denominator)}`
      : `${whole} ${remainder}/${Math.abs(denominator)}`;
  }

  const firstCost = rationalText(pureCost, "the first ingredient cost");
  const secondCost = rationalText(adulterantCost, "0");
  const meanMatch = first?.match(/= ₹([^=]+?) per (?:litre|kg)\.?$/u);
  const targetMean = meanMatch?.[1]?.trim() ?? "the required average cost";

  const simpleLines = [
    ...(first ? [first] : []),
    `Let x and y be the quantities of the two ingredients in the order asked. Their weighted-average cost must equal ₹${targetMean}.`,
    `So \(\\frac{${firstCost}x+${secondCost}y}{x+y}=${targetMean}\\). Solving this equation gives \(x:y=${answer}\\).`,
  ];
  const alligation = alternativeAlligationLines(explanation);

  return {
    ...explanation,
    visibleLines: [
      "Method 1 — Simple Method",
      ...simpleLines,
      "Method 2 — Alligation Cross",
      ...alligation,
    ],
  };
}

function solutionFirstSimple(
  cpId: string,
  qlId: string,
  explanation: Record<string, unknown>,
): Record<string, unknown> {
  const lines = visibleSolutionLines(explanation);
  if (lines.length === 0) return explanation;
  const idea = cpId === "MAL-CP-004"
    ? cp004SimpleIdea(qlId)
    : cpId === "MAL-CP-005"
      ? cp005SimpleIdea(qlId)
      : null;
  const learnerLines = ["Simple Method", ...(idea ? [idea] : []), ...lines];
  if (Array.isArray(explanation.visibleLines)) {
    return {
      ...explanation,
      visibleLines: learnerLines,
    };
  }
  return {
    ...explanation,
    lines: learnerLines,
  };
}

export function applyMal001DualMethodExplanationV3<T>(question: T): T {
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
    learnerExplanation = simpleStepBased(cpId, qlId, explanation);
  } else if (cpId === "MAL-CP-004" && CP004_ALLIGATION_CROSS_QLS.has(qlId)) {
    learnerExplanation = cp004DualMethod(qlId, explanation);
  } else if (cpId === "MAL-CP-005" && CP005_ALLIGATION_CROSS_QLS.has(qlId)) {
    learnerExplanation = cp005DualMethod(record, explanation);
  } else if (cpId === "MAL-CP-004" || cpId === "MAL-CP-005" || cpId === "MAL-CP-006") {
    learnerExplanation = solutionFirstSimple(cpId, qlId, explanation);
  }

  return {
    ...(record as T & Record<string, unknown>),
    explanation: learnerExplanation,
  } as T;
}

export const applyMal001DualMethodExplanationV2 = applyMal001DualMethodExplanationV3;
export const applyMal001CompactExplanationV1 = applyMal001DualMethodExplanationV3;
