import type {
  ExplanationEvidence,
  ExplanationRenderer,
  ExplanationStep,
} from "./explanation-engine";
import { TaskKindTeacherRenderer } from "./teacher-renderer";

/**
 * Compatibility adapter for legacy TaskKindTeacherRenderer output.
 *
 * The legacy renderer currently emits generic learner-facing labels such as
 * "Given", "Calculation", "=", and "Answer" around otherwise useful solver
 * working. Those labels add no mathematical information and make unrelated
 * questions read like the same template.
 *
 * This adapter preserves every mathematical line and the task-specific final
 * statement, but removes the generic wrapper blocks. It is intentionally
 * small so packages can migrate without changing solver/evidence lineage.
 */
export class CoherentTeacherRenderer implements ExplanationRenderer {
  private readonly legacy: TaskKindTeacherRenderer;

  constructor(taskKind: string, solverMathJax: Record<string, string>) {
    this.legacy = new TaskKindTeacherRenderer(taskKind, solverMathJax);
  }

  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const legacySteps = this.legacy.render(evidence);
    const working = legacySteps
      .filter((step) => Boolean(step.mathLatex?.trim()))
      .map((step, index) => ({
        stepId: `working-${index + 1}`,
        type: "SIMPLIFICATION" as const,
        narrative: "",
        mathLatex: step.mathLatex,
      }));

    // The old fourth block is only the answer repeated as a standalone line.
    // Drop it when an earlier mathematical line has already resolved to the
    // same answer; the conclusion below states the result once in words.
    if (working.length > 1) {
      const normalizedAnswer = String(evidence.answer)
        .replace(/\s+/g, "")
        .replace(/^=+/, "");
      const last = working[working.length - 1]!;
      const lastMath = String(last.mathLatex ?? "")
        .replace(/\s+/g, "")
        .replace(/^=+/, "");
      if (lastMath === normalizedAnswer) working.pop();
    }

    const conclusion = [...legacySteps]
      .reverse()
      .find((step) => step.type === "CONCLUSION" && step.narrative.trim());

    if (conclusion) {
      working.push({
        stepId: "conclusion",
        type: "CONCLUSION",
        narrative: conclusion.narrative,
      });
    }

    return working;
  }
}
