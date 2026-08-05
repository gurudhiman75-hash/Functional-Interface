import type { BlrCp006Graph } from "../BLR-CP-006/cp006-model";
import type { BlrCp007Scenario } from "./cp007-model";
import type {
  BlrCp007V2Option,
  BlrCp007V2Question,
} from "./cp007-v2-model";
import { buildAccessibleBlrCp007V2Explanation } from "./cp007-v2-accessibility";

function preserveEstablishedWording(value: string): string {
  const invalid = value.replace(
    "Correct choice: the statement is not valid.",
    "Correct choice: the statement is invalid.",
  );
  const validDistractor = invalid.match(
    /^Not the answer: (.*) This interpretation is valid, so it cannot be selected in an “incorrect statement” question\.$/u,
  );
  return validDistractor
    ? `Not the answer: this statement is valid. ${validDistractor[1]} It should not be selected in an “incorrect statement” question.`
    : invalid;
}

export function buildManualReviewedBlrCp007V2Explanation(
  scenario: BlrCp007Scenario,
  options: readonly BlrCp007V2Option[],
  selected: BlrCp007V2Option,
  graph: BlrCp006Graph,
): BlrCp007V2Question["explanation"] {
  const source = buildAccessibleBlrCp007V2Explanation(
    scenario,
    options,
    selected,
    graph,
  );
  const explanation = {
    ...source,
    optionAnalysis: source.optionAnalysis.map((analysis, index) => {
      const option = options[index]!;
      const directCorrect =
        scenario.query.kind === "SELECT_EXPRESSION" &&
        option.isCorrect &&
        option.decodedAssertions.length === 1;
      return {
        ...analysis,
        explanation: directCorrect
          ? `Correct: ${option.decodedAssertions[0]} This directly matches the relation asked.`
          : preserveEstablishedWording(analysis.explanation),
      };
    }),
  };
  if (explanation.mode !== "DIRECT_LOOKUP_MINIMAL") return explanation;
  return {
    ...explanation,
    steps: [
      ...explanation.steps,
      "This is a direct match with the relation asked in the question.",
    ],
  };
}
