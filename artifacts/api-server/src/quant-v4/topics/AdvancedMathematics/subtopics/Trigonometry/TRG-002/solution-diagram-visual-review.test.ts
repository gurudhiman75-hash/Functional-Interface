import {
  TRG_002_PROOF_REPRESENTED_DIAGRAM_STRATEGIES,
  TRG_002_SOLUTION_DIAGRAM_VISUAL_REVIEW_CASES,
} from "./solution-diagram-visual-review.manifest";
import { generateSolutionDiagramTrg002RuntimeProofQuestion } from "./runtime-proof-solution-diagram";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TRG_002_SOLUTION_DIAGRAM_VISUAL_REVIEW_CASES.length === 13, "Visual review set must contain one case for each strategy represented by the 20-QL proof.");
assert(new Set(TRG_002_SOLUTION_DIAGRAM_VISUAL_REVIEW_CASES.map((item) => item.strategy)).size === 13, "Visual review strategy entries must be unique.");
assert(new Set(TRG_002_PROOF_REPRESENTED_DIAGRAM_STRATEGIES).size === 13, "Represented strategy lock must contain 13 unique strategies.");

for (const strategy of TRG_002_PROOF_REPRESENTED_DIAGRAM_STRATEGIES) {
  assert(TRG_002_SOLUTION_DIAGRAM_VISUAL_REVIEW_CASES.some((item) => item.strategy === strategy), `Missing visual review case for ${strategy}.`);
}

for (const reviewCase of TRG_002_SOLUTION_DIAGRAM_VISUAL_REVIEW_CASES) {
  const question = generateSolutionDiagramTrg002RuntimeProofQuestion(reviewCase.qlId, reviewCase.reviewSeed);
  assert(question.validation.valid, `${reviewCase.qlId}: solution-diagram question failed validation.`);
  assert(question.solutionDiagram.strategy === reviewCase.strategy, `${reviewCase.qlId}: expected ${reviewCase.strategy}, got ${question.solutionDiagram.strategy}.`);
  assert(question.solutionAnnotations.length > 0, `${reviewCase.qlId}: visual review case must include at least one solved/given measurement annotation.`);
  assert(question.stemDiagram === undefined, `${reviewCase.qlId}: visual review fixture must not auto-emit a stem figure.`);
  assert(reviewCase.mustShow.length >= 3, `${reviewCase.qlId}: visual checklist is too weak.`);
  assert(reviewCase.mustAvoid.length >= 2, `${reviewCase.qlId}: negative visual checklist is too weak.`);
}

assert(
  !TRG_002_PROOF_REPRESENTED_DIAGRAM_STRATEGIES.some((strategy) => strategy === "BROKEN_TREE"),
  "Broken-tree strategy must not be falsely claimed by the 20-QL proof.",
);

console.log("TRG-002 representative visual-review manifest covers all 13 diagram strategies currently represented by the 20-QL proof.");
