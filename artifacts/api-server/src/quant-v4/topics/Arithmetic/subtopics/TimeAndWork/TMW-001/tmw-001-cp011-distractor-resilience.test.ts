import { runTmwCp011Pipeline } from "./foundation/cp011-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const qls = Array.from({ length: 19 }, (_, index) => `TMW-QL-${String(193 + index).padStart(3, "0")}`);
const seeds = Array.from({ length: 32 }, (_, index) => `cp011-distractor-resilience:${index}`);
let checked = 0;
let fallbackOptions = 0;

for (const qlId of qls) {
  for (const seed of seeds) {
    const question = runTmwCp011Pipeline(qlId, seed);
    checked += 1;
    assert(question.validation.valid, `${qlId}:${seed}: ${question.validation.errors.join(" | ")}`);
    assert(question.options.length === 4, `${qlId}:${seed}: expected four options`);
    assert(new Set(question.options).size === 4, `${qlId}:${seed}: duplicate displayed options`);
    assert(question.options[question.correctIndex] === question.solution.answerText, `${qlId}:${seed}: answer-option mismatch`);
    assert(question.optionAudit[question.correctIndex]?.misconceptionId === "CORRECT", `${qlId}:${seed}: correct audit mismatch`);
    for (const option of question.optionAudit) {
      if (option.misconceptionId === "PLAUSIBLE_SCALE_ERROR") fallbackOptions += 1;
    }
  }
}

assert(checked === 608, `Expected 608 CP011 resilience samples, got ${checked}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-011",
  audit: "DISTRACTOR-RESILIENCE",
  qls: qls.length,
  seedsPerQl: seeds.length,
  checked,
  fallbackOptions,
  verdict: "PASS",
}, null, 2));
