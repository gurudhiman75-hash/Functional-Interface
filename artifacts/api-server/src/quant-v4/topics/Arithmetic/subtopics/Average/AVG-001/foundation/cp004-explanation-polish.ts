import { applyAvg001Cp004ExplanationVariants as applyBaseVariants } from "./cp004-explanation-variants";
import type { Avg001QuestionPackage } from "./types";

export function applyAvg001Cp004ExplanationVariants(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const varied = applyBaseVariants(pkg);
  if (varied.canonicalProblemId !== "AVG-CP-004") return varied;

  return {
    ...varied,
    explanation: {
      ...varied.explanation,
      lines: varied.explanation.lines.map((line) =>
        line.replace(
          /^The group totals are /,
          "The weighted contributions are ",
        ),
      ),
    },
  };
}
