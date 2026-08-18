import assert from "node:assert/strict";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const q: any = generateTrg002V4CandidateQuestion("TRG-002-QL-013", "trg002-v4-q013-proof", locale);
  const text = [q.stem, q.explanation.keyRule, ...q.explanation.steps.map((s: any) => s.body), q.explanation.shortcut, ...q.explanation.traps].join(" ");
  assert(!text.includes("√1.54"), `${locale}: historical √1.54 corruption must be absent in V4.`);
  assert(text.includes("8√3/24"), `${locale}: QL013 must preserve the exact ratio 8√3/24.`);
  assert.equal(q.v4ExamReadiness.exactMathProtected, true);
  assert.equal(q.v4ExamReadiness.scenarioSurfaceApplied, false, "Scenario metadata must not masquerade as an applied scenario surface.");
  assert.equal(q.freezeStatus, "NOT_FROZEN");
  assert.equal(q.activationAuthorized, false);
}

console.log("TRG002_V4_Q013_EXACT_MATH_PASS locales=2 scenarioSurfaceApplied=false");
