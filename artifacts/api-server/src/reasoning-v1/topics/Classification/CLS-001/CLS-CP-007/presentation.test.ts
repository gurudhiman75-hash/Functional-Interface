import assert from "node:assert/strict";
import { CLS_CP007_PROTOTYPES } from "./cluster-domain";
import { generateClsCp007PermanentClusterQuestion } from "./cp007-english-contracts";

let checked = 0;

for (const prototype of CLS_CP007_PROTOTYPES) {
  for (let seed = 0; seed < 12; seed += 1) {
    for (const optionCount of [4, 5] as const) {
      const question = generateClsCp007PermanentClusterQuestion(
        prototype.prototypeId,
        seed,
        optionCount,
      );
      const learnerText = [
        ...question.evidenceByOption,
        ...question.explanation.stepByStep,
      ].join("\n");

      assert.ok(
        !/= (\d+) = \1\b/.test(learnerText),
        `${prototype.prototypeId}/${seed} repeats the calculated result as an equality.`,
      );
      assert.ok(
        !/positions? [1-5]\+[1-5] total/i.test(learnerText),
        `${prototype.prototypeId}/${seed} uses a compact index label instead of natural prose.`,
      );
      assert.ok(
        !/first pair gap|second pair gap/i.test(learnerText),
        `${prototype.prototypeId}/${seed} uses compressed pair-gap prose.`,
      );

      if (question.intendedRuleId === "CLUSTER_FIRST_TWO_SUM_TO_THIRD_STATUS") {
        assert.ok(
          question.evidenceByOption.every((value) => /the third letter [A-Z] is at position \d+/.test(value)),
          "The sum-equation explanation must identify the third letter and its position.",
        );
      }
      if (question.intendedRuleId === "CLUSTER_OPPOSITE_PAIRING_13_24_STATUS") {
        assert.ok(
          question.evidenceByOption.every((value) =>
            /letters at positions 1 and 3 total \d+; letters at positions 2 and 4 total \d+/.test(value)
          ),
        );
      }
      if (question.intendedRuleId === "CLUSTER_OPPOSITE_PAIRING_12_34_STATUS") {
        assert.ok(
          question.evidenceByOption.every((value) =>
            /letters at positions 1 and 2 total \d+; letters at positions 3 and 4 total \d+/.test(value)
          ),
        );
      }
      if (question.intendedRuleId === "CLUSTER_ADJACENT_PAIR_GAP_SIGNATURE") {
        assert.ok(
          question.evidenceByOption.every((value) =>
            /movement from position 1 to 2 is [+-]?\d+; the movement from position 3 to 4 is [+-]?\d+/.test(value)
          ),
        );
      }

      checked += 1;
    }
  }
}

console.log("CLS-CP-007 presentation audit passed.", {
  checked,
  prototypes: CLS_CP007_PROTOTYPES.length,
  optionCounts: [4, 5],
});
