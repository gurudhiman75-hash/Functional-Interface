import { TRG_002_RUNTIME_PROOF_IDS } from "./runtime-proof";
import { TRG_002_MVP_48_IDS } from "./mvp-48-registry";
import { generateLabelledTrg002Mvp48Question } from "./mvp-runtime-48-labelled";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const proof = new Set<string>(TRG_002_RUNTIME_PROOF_IDS);
const added = TRG_002_MVP_48_IDS.filter((id) => !proof.has(id));
assert(added.length === 28, "Expected 28 added MVP QLs.");
for (const qlId of added) {
  const question: any = generateLabelledTrg002Mvp48Question(qlId, "mvp-label-smoke");
  assert(question.validation.valid && question.verification.solutionAnnotations.valid, `${qlId}: labelled diagram invalid.`);
  assert(question.solutionAnnotations.length >= 1, `${qlId}: diagram labels missing.`);
  if (question.target === "LENGTH") assert(question.solutionAnnotations.some((item: any) => item.role === "TARGET_SOLVED" && item.source.kind === "ANSWER"), `${qlId}: solved target label missing.`);
}
console.log("TRG-002 MVP label smoke gate targets all 28 added QLs.");
