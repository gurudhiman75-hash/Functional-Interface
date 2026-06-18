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

export const FORBIDDEN_PHRASES = [
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
  "Hence, the required value is",
  "Therefore, the answer is",
  "Thus, the value obtained is",
  "So, the required result is",
  "Accordingly, the final answer is",
  "first group",
  "second group",
  "Male part",
  "Female part",
  "Now simplify",
  "Substitute the numbers",
  "calculation gives"
];

export function validateGenericPhrases(steps: ExplanationStep[]): void {
  const fullText = steps.map((s) => s.narrative).join(" ").toLowerCase();
  for (const phrase of FORBIDDEN_PHRASES) {
    if (fullText.includes(phrase.toLowerCase())) {
      throw new ExplanationValidationError(`Forbidden phrase detected: "${phrase}"`);
    }
  }
}

export function validateEntityConsistency(steps: ExplanationStep[], entities: Record<string, string>): void {
  const fullText = steps.map((s) => s.narrative).join(" ").toLowerCase();
  const entityValues = Object.values(entities).map((e) => e.toLowerCase());

  const fallbacks = ["first group", "second group", "male", "female"];
  for (const fallback of fallbacks) {
    if (fullText.includes(fallback) && !entityValues.includes(fallback)) {
       throw new ExplanationValidationError(`Entity corruption: Found generic fallback "${fallback}" without matching semantic entity.`);
    }
  }
}

export function validateEvidenceFidelity(steps: ExplanationStep[], evidence: ExplanationEvidence): void {
  const fullText = steps.map((s) => `${s.narrative} ${s.mathLatex || ""}`).join(" ");
  const extractedNumbers = fullText.match(/\d+(\.\d+)?/g) || [];

  const allowedNumbers = new Set<number>([0, 1, 2, 3, 4, 5, 10, 100, 1000]);

  const extractFromObject = (obj: any) => {
    Object.values(obj).forEach((v) => {
      if (typeof v === "number") allowedNumbers.add(v);
      else if (typeof v === "string") {
        const nums = v.match(/\d+(\.\d+)?/g);
        if (nums) nums.forEach(n => allowedNumbers.add(parseFloat(n)));
      }
    });
  };

  extractFromObject(evidence.variables);
  extractFromObject(evidence.derivedValues);
  if (typeof evidence.answer === "number") allowedNumbers.add(evidence.answer);
  else if (typeof evidence.answer === "string") {
    const nums = evidence.answer.match(/\d+(\.\d+)?/g);
    if (nums) nums.forEach(n => allowedNumbers.add(parseFloat(n)));
  }

  for (const numStr of extractedNumbers) {
    const num = parseFloat(numStr);
    if (!allowedNumbers.has(num)) {
      // allow floating point tolerance
      let found = false;
      for (const allowed of allowedNumbers) {
        if (Math.abs(allowed - num) < 0.1) {
          found = true;
          break;
        }
      }
      if (!found) {
        // We will console.warn instead of throw to allow generic solver math strings to pass.
        // The prompt says "Reject explanations with: hallucinated numbers".
        // If the number truly isn't in derived values, it's a hallucination.
        // But solver sets calculationLatex directly, so those numbers ARE from the solver.
        throw new ExplanationValidationError(`Hallucination detected: Number ${num} does not exist in evidence or derived values.`);
      }
    }
  }
}

export function validateExplanationPipeline(evidence: ExplanationEvidence, renderer: ExplanationRenderer): ExplanationStep[] {
  const steps = renderer.render(evidence);

  if (steps.length < 4) {
    throw new ExplanationValidationError("Explanation lacks pedagogical structure (Less than 4 steps).");
  }

  validateGenericPhrases(steps);
  validateEntityConsistency(steps, evidence.entities);
  validateEvidenceFidelity(steps, evidence);

  const hasFormula = steps.some((s) => s.type === "FORMULA");
  const hasSubstitution = steps.some((s) => s.type === "SUBSTITUTION");
  const hasConclusion = steps.some((s) => s.type === "CONCLUSION");

  if (!hasFormula) {
    throw new ExplanationValidationError("Explanation lacks pedagogical structure (Missing FORMULA step).");
  }
  if (!hasSubstitution) {
    throw new ExplanationValidationError("Explanation lacks pedagogical structure (Missing SUBSTITUTION step).");
  }
  if (!hasConclusion) {
    throw new ExplanationValidationError("Explanation lacks pedagogical structure (Missing CONCLUSION step).");
  }
  if (steps[0].type === "CONCLUSION" || steps[1].type === "CONCLUSION") {
    throw new ExplanationValidationError("Explanation reveals answer too early.");
  }

  return steps;
}

export function formatExplanationSteps(steps: ExplanationStep[]): string[] {
  return steps.map(step => {
    if (step.mathLatex) {
      return `${step.narrative} | $$${step.mathLatex}$$`;
    }
    return step.narrative;
  });
}
