export type Trg001LearnerLanguage = "en" | "hi" | "pa";

const LABELS = Object.freeze({
  en: Object.freeze({ rule: "Core rule", step: "Step" }),
  hi: Object.freeze({ rule: "मुख्य नियम", step: "चरण" }),
  pa: Object.freeze({ rule: "ਮੁੱਖ ਨਿਯਮ", step: "ਕਦਮ" }),
});

/**
 * Learner-facing TRG explanation policy.
 *
 * Keep the explanation simple and coherent: show the governing rule and the
 * actual solution steps. Generator-only shortcut/trap metadata remains on the
 * structured packageExplanation object and is intentionally not rendered in
 * the default learner/reviewer explanation.
 */
export function formatTrg001LearnerExplanation(
  question: any,
  language: Trg001LearnerLanguage,
) {
  const explanation = question?.explanation ?? {};
  const labels = LABELS[language];
  const parts = [
    explanation.keyRule ? `${labels.rule}: ${String(explanation.keyRule)}` : "",
    ...(explanation.steps ?? []).map((step: any) =>
      `${String(step?.title ?? labels.step)}: ${String(step?.body ?? "")}`,
    ),
  ].filter(Boolean);

  return parts.join("\n\n");
}

export const TRG_001_LEARNER_EXPLANATION_P2 = Object.freeze({
  version: "TRG001_LEARNER_EXPLANATION_P2" as const,
  renderedFields: ["keyRule", "steps"] as const,
  retainedStructuredQaFields: ["shortcut", "traps"] as const,
  shortcutRenderedByDefault: false as const,
  trapsRenderedByDefault: false as const,
});
