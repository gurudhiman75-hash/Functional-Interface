import type { ExplanationEvidence, ExplanationRenderer, ExplanationStep } from "../../../../../common/explanation-engine";

function n(evidence: ExplanationEvidence, key: string) {
  return Number(evidence.variables[key]);
}

function s(evidence: ExplanationEvidence, key: string, fallback: string) {
  return String(evidence.variables[key] ?? fallback);
}

function d(evidence: ExplanationEvidence, key: string) {
  return Number(evidence.derivedValues[key]);
}

function shown(value: number) {
  return String(Math.round(value * 10000) / 10000);
}

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

function step(stepId: string, type: ExplanationStep["type"], narrative: string, mathLatex?: string): ExplanationStep {
  return { stepId, type, narrative, mathLatex };
}

export class RepeatedReplacementRenderer implements ExplanationRenderer {
  render(evidence: ExplanationEvidence): ExplanationStep[] {
    const volume = n(evidence, "initialVolume");
    const removedFirst = n(evidence, "removedVolume1");
    const removedSecond = n(evidence, "removedVolume2");
    const liquidA = s(evidence, "liquidA", "original liquid");
    const liquidB = s(evidence, "liquidB", "replacement liquid");
    const finalA = d(evidence, "finalLiquidA");
    const finalB = d(evidence, "finalLiquidB");
    const answer = cleanAnswer(evidence.answer);

    return [
      step("step-1", "GOAL", `After the first replacement, ${liquidA} remains.`, `${volume}-${removedFirst}=${volume - removedFirst}`),
      step("step-2", "FORMULA", "Use the second-round retention fraction.", `1-\\frac{${removedSecond}}{${volume}}=\\frac{${volume - removedSecond}}{${volume}}`),
      step("step-3", "SUBSTITUTION", `Find the final ${liquidA} quantity.`, `(${volume}-${removedFirst})\\times\\frac{${volume - removedSecond}}{${volume}}=${shown(finalA)}`),
      step("step-4", "SIMPLIFICATION", `Find the final ${liquidB} quantity.`, `${volume}-${shown(finalA)}=${shown(finalB)}`),
      step("step-5", "SIMPLIFICATION", "Simplify the final ratio.", `${shown(finalA)}:${shown(finalB)}=${answer}`),
      step("step-6", "CONCLUSION", `So, the final ${liquidA}:${liquidB} ratio is ${answer}.`),
    ];
  }
}
