import type {
  NativeRealizerInput,
  NativeRealizerResult,
} from "./types";
import {
  detectCoverageCategory,
  getCoveragePercent,
  validateNativeBundle,
} from "./coverage";

export function realizeEnglish(
  input: NativeRealizerInput,
): NativeRealizerResult {
  const coverageCategory =
    detectCoverageCategory(input);
  const bundle = {
    question: input.question.text,
    options: input.question.options,
    explanation:
      input.question.explanation,
  };

  return {
    supported: true,
    language: "en",
    source: "canonical",
    coverageCategory,
    coveragePercent: getCoveragePercent(
      "en",
      coverageCategory,
    ),
    validation: validateNativeBundle(
      "en",
      bundle,
    ),
    bundle,
  };
}
