import { strict as assert } from "node:assert";
import {
  FORBIDDEN_EXPLANATION_LANGUAGE,
  FORBIDDEN_STEM_LANGUAGE,
  containsForbiddenLanguage,
  runNsDiv001Cp001Pipeline,
} from "../topics/NumberSystem/subtopics/Divisibility/archetypes/NS-DIV-001";

const questionPackage = runNsDiv001Cp001Pipeline({ seed: "phase-6-reference-slice" });

assert.equal(questionPackage.archetypeId, "NS-DIV-001");
assert.equal(questionPackage.canonicalProblemId, "CP-001");
assert.ok(questionPackage.reasoningPatternId.startsWith("RP-"));
assert.equal(questionPackage.validation.valid, true);
assert.equal(questionPackage.solver.validCandidates.length, 1);
assert.equal(questionPackage.answer, questionPackage.solver.answerDigit);
assert.equal(questionPackage.solver.resolvedNumber % questionPackage.parameters.divisor, 0);
assert.equal(questionPackage.reasoningGraph.nodes.length, 7);
assert.deepEqual(
  questionPackage.reasoningGraph.nodes.map((node) => node.type),
  [
    "Problem Recognition",
    "Divisor Recognition",
    "Rule Selection",
    "Condition Construction",
    "Candidate Evaluation",
    "Verification",
    "Answer Production",
  ],
);
assert.equal(questionPackage.explanation.graphId, questionPackage.reasoningGraph.graphId);
assert.ok(questionPackage.explanation.variantId.startsWith("Variant "));
assert.ok(questionPackage.stem.includes(questionPackage.parameters.numberExpression));
assert.ok(questionPackage.explanation.lines.length > 0);
assert.deepEqual(containsForbiddenLanguage(questionPackage.stem, FORBIDDEN_STEM_LANGUAGE), []);
assert.deepEqual(containsForbiddenLanguage(questionPackage.explanation.lines.join("\n"), FORBIDDEN_EXPLANATION_LANGUAGE), []);

console.log("NS-DIV-001 CP-001 vertical slice passed.");
