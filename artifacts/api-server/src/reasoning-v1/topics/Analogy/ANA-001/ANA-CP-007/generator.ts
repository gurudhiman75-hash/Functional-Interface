import {
  generateWordAnalogy as generateBaseWordAnalogy,
  type GeneratedWordAnalogy,
} from "./generator-base";

export type {
  GeneratedWordAnalogy,
  WordDifficulty,
  WordLayout,
} from "./generator-base";

function completeWorking(
  explanation: string,
  input: string,
  output: string | number,
  stage: "source" | "target",
): string {
  const closing = stage === "source"
    ? `The complete source transformation is ${input} → ${output}; checking the full word confirms that no relevant letter or value has been skipped.`
    : `Applying exactly the same rule to the complete target word gives ${input} → ${output}; this verifies the result before the option is selected.`;
  return `${explanation} ${closing}`;
}

export function generateWordAnalogy(qlId: string, seed = 0): GeneratedWordAnalogy {
  const generated = generateBaseWordAnalogy(qlId, seed);
  return {
    ...generated,
    explanation: {
      ...generated.explanation,
      sourceDemonstration: completeWorking(
        generated.explanation.sourceDemonstration,
        generated.source.input,
        generated.source.output,
        "source",
      ),
      targetApplication: completeWorking(
        generated.explanation.targetApplication,
        generated.target.input,
        generated.target.output,
        "target",
      ),
    },
  };
}
