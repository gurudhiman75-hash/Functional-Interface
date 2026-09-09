export interface ExplanationEvidence {
  variables: Record<string, number | string>;
  derivedValues: Record<string, number | string>;
  entities: Record<string, string>;
  answer: string | number;
}

export interface ExplanationStep {
  stepId: string;
  type: "GOAL" | "FORMULA" | "SUBSTITUTION" | "SIMPLIFICATION" | "CONCLUSION";
  narrative: string;
  mathLatex?: string;
}

export interface ExplanationRenderer {
  render(evidence: ExplanationEvidence): ExplanationStep[];
}

export class ExplanationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExplanationValidationError";
  }
}

/**
 * Quant V4 learner explanations are judged by coherence and evidence, not by
 * a fixed number of steps or compulsory FORMULA/SUBSTITUTION/CONCLUSION slots.
 * See quality/QUANT-V4-EXPLANATION-QUALITY-POLICY-V2.md.
 */
export const EXPLANATION_COHERENCE_POLICY_VERSION =
  "QUANT_V4_EXPLANATION_COHERENCE_V2";

export const FORBIDDEN_PHRASES = [
  "Our objective is",
  "We apply the standard rule",
  "Plugging in the values",
  "Plugging in the parameters",
  "Substituting the parameters",
  "Calculating the final value",
  "We need to calculate the target value",
  "Let's determine the final amount",
  "Using the appropriate formula",
  "The mathematical relationship is",
  "Inserting the given numbers",
  "Solving it yields the final answer",
  "The computed result is",
  "A useful starting point is",
  "The working relation is",
  "This determines",
  "Combining aligned ratios",
  "On simplification",
  "Completing the arithmetic",
  "The numerical result is",
  "Notice the key relation",
  "Observe that",
  "Notice that",
  "Using the above",
  "The required expression becomes",
  "Observe the given relation carefully.",
  "Observe carefully.",
  "Now write the working with the given values.",
  "Now write the working.",
  "Keep the base quantity clear while simplifying.",
  "Keep the base quantity clear.",
  "Substitute the given numbers in the relation.",
  "Substitute the given values.",
  "The calculation gives",
  "The calculation gives.",
  "The final slab result is",
  "The final slab result is.",
  "Now simplify the working carefully.",
  "first group",
  "second group",
  "Male part",
  "Female part",
  "Now simplify",
  "Substitute the numbers",
  "calculation gives",
];

const GENERIC_SCAFFOLD_LABELS = new Set([
  "given",
  "calculation",
  "answer",
  "=",
]);

function normalizeGenericScaffolding(
  steps: ExplanationStep[],
  evidence: ExplanationEvidence,
): ExplanationStep[] {
  const normalized = steps.map((step) => {
    const narrative = step.narrative.trim();
    if (!GENERIC_SCAFFOLD_LABELS.has(narrative.toLowerCase())) return step;
    return {
      ...step,
      narrative: "",
      type: step.type === "CONCLUSION" ? "CONCLUSION" : "SIMPLIFICATION",
    } as ExplanationStep;
  });

  // Legacy teacher renderers often add a standalone answer-only math block and
  // then repeat the same result in the conclusion. Keep the reasoning lines and
  // say the answer once.
  const answer = String(evidence.answer)
    .replace(/\s+/g, "")
    .replace(/^=+/, "");
  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    const step = normalized[index]!;
    if (!step.mathLatex?.trim()) continue;
    const math = step.mathLatex.replace(/\s+/g, "").replace(/^=+/, "");
    const hasLaterConclusion = normalized
      .slice(index + 1)
      .some((candidate) => candidate.type === "CONCLUSION" && candidate.narrative.trim());
    if (hasLaterConclusion && math === answer) normalized.splice(index, 1);
    break;
  }

  return normalized.filter(
    (step) => Boolean(step.narrative.trim()) || Boolean(step.mathLatex?.trim()),
  );
}

function containsIdentifier(text: string, identifier: string) {
  if (!identifier || identifier.length < 3) return false;
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Za-z0-9_])${escaped}([^A-Za-z0-9_]|$)`, "i").test(text);
}

export function validateNoInternalIdentifiers(
  steps: ExplanationStep[],
  evidence: ExplanationEvidence,
): void {
  const fullText = steps
    .map((step) => `${step.narrative} ${step.mathLatex ?? ""}`)
    .join(" ");
  const taskKind = String(evidence.derivedValues.taskKind ?? "");
  if (taskKind && containsIdentifier(fullText, taskKind)) {
    throw new ExplanationValidationError(
      `Internal taskKind leaked into explanation: "${taskKind}"`,
    );
  }

  for (const variableName of Object.keys(evidence.variables)) {
    if (variableName.length < 6) continue;
    if (containsIdentifier(fullText, variableName)) {
      throw new ExplanationValidationError(
        `Internal variable name leaked into explanation: "${variableName}"`,
      );
    }
  }
}

export function validateGenericPhrases(steps: ExplanationStep[]): void {
  const fullText = steps
    .map((step) => step.narrative)
    .join(" ")
    .toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (fullText.includes(phrase.toLowerCase())) {
      throw new ExplanationValidationError(
        `Forbidden phrase detected: "${phrase}"`,
      );
    }
  }
}

export function validateEntityConsistency(
  steps: ExplanationStep[],
  entities: Record<string, string>,
): void {
  const fullText = steps
    .map((step) => step.narrative)
    .join(" ")
    .toLowerCase();
  const entityValues = Object.values(entities).map((entity) =>
    entity.toLowerCase(),
  );

  const fallbacks = ["first group", "second group", "male", "female"];
  for (const fallback of fallbacks) {
    if (fullText.includes(fallback) && !entityValues.includes(fallback)) {
      throw new ExplanationValidationError(
        `Entity corruption: Found generic fallback "${fallback}" without matching semantic entity.`,
      );
    }
  }
}

export function validateEvidenceFidelity(
  steps: ExplanationStep[],
  evidence: ExplanationEvidence,
): void {
  const fullText = steps
    .map((step) => `${step.narrative} ${step.mathLatex || ""}`)
    .join(" ");
  const extractedNumbers = fullText.match(/\d+(\.\d+)?/g) || [];

  const allowedNumbers = new Set<number>([0, 1, 2, 3, 4, 5, 10, 100, 1000]);

  const extractFromObject = (obj: Record<string, unknown>) => {
    Object.values(obj).forEach((value) => {
      if (typeof value === "number") {
        allowedNumbers.add(value);
      } else if (typeof value === "string") {
        const nums = value.match(/\d+(\.\d+)?/g);
        if (nums) {
          nums.forEach((numberText) => allowedNumbers.add(parseFloat(numberText)));
        }
      }
    });
  };

  extractFromObject(evidence.variables);
  extractFromObject(evidence.derivedValues);
  if (typeof evidence.answer === "number") {
    allowedNumbers.add(evidence.answer);
  } else if (typeof evidence.answer === "string") {
    const nums = evidence.answer.match(/\d+(\.\d+)?/g);
    if (nums) nums.forEach((numberText) => allowedNumbers.add(parseFloat(numberText)));
  }

  const rounded = (value: number) => Number(value.toFixed(6));
  for (let round = 0; round < 2 && allowedNumbers.size < 12000; round += 1) {
    const source = [...allowedNumbers].filter(
      (value) => Number.isFinite(value) && Math.abs(value) <= 1_000_000,
    );
    const additions: number[] = [];
    for (
      let leftIndex = 0;
      leftIndex < source.length && additions.length < 12000;
      leftIndex += 1
    ) {
      for (
        let rightIndex = 0;
        rightIndex < source.length && additions.length < 12000;
        rightIndex += 1
      ) {
        const left = source[leftIndex]!;
        const right = source[rightIndex]!;
        additions.push(
          rounded(left + right),
          rounded(left - right),
          rounded(left * right),
        );
        if (right !== 0) additions.push(rounded(left / right));
      }
    }
    for (const value of additions) {
      if (Number.isFinite(value) && Math.abs(value) <= 1_000_000_000) {
        allowedNumbers.add(value);
      }
      if (allowedNumbers.size >= 12000) break;
    }
  }

  for (const numStr of extractedNumbers) {
    const num = parseFloat(numStr);
    if (!allowedNumbers.has(num)) {
      let found = false;
      for (const allowed of allowedNumbers) {
        if (Math.abs(allowed - num) < 0.1) {
          found = true;
          break;
        }
      }
      if (!found) {
        throw new ExplanationValidationError(
          `Hallucination detected: Number ${num} does not exist in evidence or derived values.`,
        );
      }
    }
  }
}

/**
 * Reject empty/padded explanations without forcing every mathematical family
 * into the same pedagogical shape. A concise direct solution may have two
 * visible steps; a compound problem may naturally have more.
 */
export function validateCoherentWorking(steps: ExplanationStep[]): void {
  if (!steps.length) {
    throw new ExplanationValidationError("Explanation is empty.");
  }

  for (const [index, step] of steps.entries()) {
    if (!step.narrative.trim() && !step.mathLatex?.trim()) {
      throw new ExplanationValidationError(
        `Explanation step ${index + 1} contains no learner-facing content.`,
      );
    }
  }

  const arithmeticSteps = steps.filter((step) => step.mathLatex?.trim()).length;
  if (arithmeticSteps < 1) {
    throw new ExplanationValidationError(
      "Explanation hides the working (no mathematical line is shown).",
    );
  }

  const proseWords = steps
    .map((step) => step.narrative)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const commentaryAllowance = Math.max(45, arithmeticSteps * 18);
  if (proseWords > commentaryAllowance) {
    throw new ExplanationValidationError(
      "Explanation contains too much commentary for the shown working.",
    );
  }
}

export function validateExplanationPipeline(
  evidence: ExplanationEvidence,
  renderer: ExplanationRenderer,
): ExplanationStep[] {
  const steps = normalizeGenericScaffolding(renderer.render(evidence), evidence);

  validateGenericPhrases(steps);
  validateNoInternalIdentifiers(steps, evidence);
  validateEntityConsistency(steps, evidence.entities);
  validateEvidenceFidelity(steps, evidence);
  validateCoherentWorking(steps);

  return steps;
}

export function formatExplanationSteps(steps: ExplanationStep[]): string[] {
  return steps.map((step) => {
    let narrative = step.narrative || "";
    let mathLatex = step.mathLatex || "";
    if (narrative) {
      narrative = narrative.replace(/\b(\w+s)'s\b/gi, "$1'");
    }
    if (mathLatex) {
      mathLatex = mathLatex.replace(/\b(\w+s)'s\b/gi, "$1'");
      mathLatex = mathLatex.replace(/^\$\$([\s\S]*)\$\$$/, "$1");
      mathLatex = mathLatex.replace(/^\\\(([\s\S]*)\\\)$/, "$1");
      return narrative
        ? `${narrative}\n\n$$\\Rightarrow ${mathLatex}$$`
        : `$$\\Rightarrow ${mathLatex}$$`;
    }
    return narrative;
  });
}
