import assert from "node:assert/strict";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const q: any = generateTrg002V4CandidateQuestion("TRG-002-QL-013", "trg002-v4-q013-proof", locale);
  const learnerSurface = [
    q.stem,
    q.explanation.keyRule,
    ...q.explanation.steps.flatMap((s: any) => [s.title, s.body]),
    q.explanation.shortcut,
    ...q.explanation.traps,
    q.renderedSolutionDiagram?.altText ?? "",
  ].join(" ");

  assert(!learnerSurface.includes("√1.54"), `${locale}: historical √1.54 corruption must be absent from every learner-facing V4 surface.`);
  assert(!q.stem.includes("√"), `${locale}: QL013 Wave2 stem must use ordinary measured height and distance.`);
  assert.equal(q.answer, "45°", `${locale}: equal natural height/distance must produce 45°.`);
  assert.equal(q.v4ExamReadiness.exactMathProtected, true);
  assert.equal(q.v4ExamReadiness.naturalMeasurementOverride, true);
  assert.equal(q.v4ExamReadiness.scenarioSurfaceApplied, true, "QL013 V4 natural-measurement scenario is a fully applied candidate surface.");
  assert.equal(q.freezeStatus, "NOT_FROZEN");
  assert.equal(q.activationAuthorized, false);
}

console.log("TRG002_V4_Q013_EXACT_MATH_PASS locales=2 malformedSurd=absent naturalMeasurements=true answer=45deg scenarioSurfaceApplied=true");
