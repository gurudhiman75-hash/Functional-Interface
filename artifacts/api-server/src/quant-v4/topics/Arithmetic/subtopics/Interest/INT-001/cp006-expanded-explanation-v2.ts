import type { Rational } from "./cp003-exam-model";
import type { IntCp006QlId, IntCp006State } from "./cp006-si-ci-relations-runtime-v4-final";
import {
  buildIntCp006ExpandedExplanation as buildV1,
  type IntCp006ExplanationLocale,
} from "./cp006-expanded-explanation-v1";

export const INT_CP006_EXPANDED_EXPLANATION_VERSION = "INT-CP-006-EXPL-v2-review" as const;
export type { IntCp006ExplanationLocale };

function directionStep(state: Extract<IntCp006State, { qlId: "INT-QL-102" }>, locale: IntCp006ExplanationLocale): string {
  if (state.knownYears === 2) {
    if (locale === "en-IN") return "Because the 2-year difference is known and the 3-year difference is required, we move forward from D₂ to D₃ by multiplying by this factor.";
    if (locale === "hi-IN") return "क्योंकि 2 वर्षों का अंतर दिया है और 3 वर्षों का अंतर चाहिए, इसलिए D₂ से D₃ की ओर जाने के लिए इस गुणक से गुणा करेंगे।";
    return "ਕਿਉਂਕਿ 2 ਸਾਲਾਂ ਦਾ ਅੰਤਰ ਦਿੱਤਾ ਹੈ ਅਤੇ 3 ਸਾਲਾਂ ਦਾ ਅੰਤਰ ਚਾਹੀਦਾ ਹੈ, ਇਸ ਲਈ D₂ ਤੋਂ D₃ ਵੱਲ ਜਾਣ ਲਈ ਇਸ ਗੁਣਕ ਨਾਲ ਗੁਣਾ ਕਰਾਂਗੇ।";
  }
  if (locale === "en-IN") return "Because the 3-year difference is known and the 2-year difference is required, we reverse the relation and divide D₃ by this factor.";
  if (locale === "hi-IN") return "क्योंकि 3 वर्षों का अंतर दिया है और 2 वर्षों का अंतर चाहिए, इसलिए संबंध को उलटकर D₃ को इस गुणक से भाग देंगे।";
  return "ਕਿਉਂਕਿ 3 ਸਾਲਾਂ ਦਾ ਅੰਤਰ ਦਿੱਤਾ ਹੈ ਅਤੇ 2 ਸਾਲਾਂ ਦਾ ਅੰਤਰ ਚਾਹੀਦਾ ਹੈ, ਇਸ ਲਈ ਸੰਬੰਧ ਨੂੰ ਉਲਟ ਕੇ D₃ ਨੂੰ ਇਸ ਗੁਣਕ ਨਾਲ ਭਾਗ ਦੇਵਾਂਗੇ।";
}

export function buildIntCp006ExpandedExplanation(
  qlId: IntCp006QlId,
  state: IntCp006State,
  answer: Rational,
  locale: IntCp006ExplanationLocale,
): Readonly<{ keyIdea: string; steps: readonly string[] }> {
  const base = buildV1(qlId, state, answer, locale);
  if (qlId !== "INT-QL-102" || state.qlId !== "INT-QL-102") return base;
  const steps = [
    base.steps[0]!,
    base.steps[1]!,
    directionStep(state, locale),
    ...base.steps.slice(2),
  ];
  return Object.freeze({ keyIdea: base.keyIdea, steps: Object.freeze(steps) });
}
