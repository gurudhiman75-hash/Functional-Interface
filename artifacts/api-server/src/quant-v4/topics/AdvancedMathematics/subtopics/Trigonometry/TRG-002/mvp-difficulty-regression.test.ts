import { generateTrg002Mvp48Question } from "./mvp-runtime-48";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const seed = "trg002-mvp-difficulty-regression";
for (const qlId of ["TRG-002-QL-052", "TRG-002-QL-055", "TRG-002-QL-058", "TRG-002-QL-061", "TRG-002-QL-064", "TRG-002-QL-095"] as const) {
  assert(generateTrg002Mvp48Question(qlId, seed).difficulty === "Medium", `${qlId} must remain Medium after exam-level recalibration.`);
}
assert(generateTrg002Mvp48Question("TRG-002-QL-096", seed).difficulty === "Hard", "QL-096 must remain Hard: inverse composite relation requires solving and rationalizing x(sqrt3-1)=given upper height.");

console.log("TRG-002 MVP difficulty regression locks QL-052/055/058/061/064/095 Medium and QL-096 Hard.");
