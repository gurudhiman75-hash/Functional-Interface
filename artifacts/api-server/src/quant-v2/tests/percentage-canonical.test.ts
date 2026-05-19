import assert from "node:assert/strict";
import test from "node:test";
import {
  PERCENTAGE_MOTIF_FACTORIES,
} from "../canonical/percentage-motif-factories";
import { validatePercentageProblem } from "../validators/problem-validator";
import { createProblemSignature } from "../utils/problem-signature";

function stableJson(value: unknown) {
  return JSON.stringify(value);
}

test("canonical percentage factories are deterministic and valid", () => {
  for (const [name, factory] of Object.entries(PERCENTAGE_MOTIF_FACTORIES)) {
    const signatures = new Set<string>();

    for (let seed = 1; seed <= 100; seed += 1) {
      const problem = factory(seed);
      const repeated = factory(seed);

      assert.equal(
        stableJson(problem),
        stableJson(repeated),
        `${name} must be deterministic for seed ${seed}`,
      );

      const result = validatePercentageProblem(problem);
      assert.equal(
        result.valid,
        true,
        `${name} seed ${seed} failed validation: ${result.issues.join("; ")}`,
      );

      const signature = createProblemSignature(problem);
      assert.ok(signature.includes("|ans="), `${name} signature must include answer`);
      assert.equal(
        signature,
        createProblemSignature(repeated),
        `${name} signature must be deterministic`,
      );
      signatures.add(signature);

      const distractorKeys = new Set(
        problem.distractors.map((item) => item.toFixed(2)),
      );
      assert.equal(
        distractorKeys.size,
        problem.distractors.length,
        `${name} seed ${seed} must have unique distractors`,
      );
      assert.ok(
        !distractorKeys.has(problem.answer.toFixed(2)),
        `${name} seed ${seed} must not duplicate the answer as a distractor`,
      );

      for (const value of [
        problem.answer,
        ...problem.distractors,
        ...Object.values(problem.variables),
      ]) {
        assert.ok(Number.isFinite(value), `${name} seed ${seed} has non-finite value`);
        assert.equal(
          Math.round(value * 100) / 100,
          value,
          `${name} seed ${seed} has an unstable decimal: ${value}`,
        );
      }
    }

    assert.ok(signatures.size > 1, `${name} should produce more than one sample`);
  }
});

export {};
