import assert from "node:assert/strict";
import {
  canonicalizeProbabilityExplanationMathSegment,
  listProbabilityNativeMathEventLabels,
  localizeProbabilityExplanationMathSegment,
  PROBABILITY_NATIVE_MATH_EVENT_LABEL_RULES,
} from "./shared/native-math-event-labels";

assert.equal(PROBABILITY_NATIVE_MATH_EVENT_LABEL_RULES.length, 28);
assert.equal(new Set(listProbabilityNativeMathEventLabels()).size, 28);

for (const rule of PROBABILITY_NATIVE_MATH_EVENT_LABEL_RULES) {
  for (const language of ["hi", "pa"] as const) {
    const source = `\\(P\\!\\left(${rule.source}\\right) = \\frac{3}{7}\\)`;
    const localized = localizeProbabilityExplanationMathSegment(source, language);
    assert.notEqual(localized, source, `${rule.source}/${language}: event label was not localized`);
    assert.equal(
      canonicalizeProbabilityExplanationMathSegment(localized, language),
      source,
      `${rule.source}/${language}: canonical math parity failed`,
    );
    assert(localized.includes(language === "hi" ? rule.hi : rule.pa));
  }
}

for (const symbolic of [
  "\\(P\\!\\left(A\\right)\\)",
  "\\(P\\!\\left(B\\right)\\)",
  "\\(P\\!\\left(E\\right)\\)",
  "\\(P\\!\\left(A \\cap B\\right)\\)",
  "\\(P\\!\\left(A \\cup B\\right)\\)",
  "\\(P\\!\\left(TTT\\right)\\)",
  "\\(P\\!\\left(TTTT\\right)\\)",
  "\\(\\frac{11}{23}\\)",
]) {
  assert.equal(localizeProbabilityExplanationMathSegment(symbolic, "hi"), symbolic);
  assert.equal(localizeProbabilityExplanationMathSegment(symbolic, "pa"), symbolic);
}

console.log(JSON.stringify({ status: "PASS", localizedEventLabelCount: 28, languages: 2 }));
