import { NUM_CP008_WAVE03_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave03 } from "./runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let reviewed = 0;
let parityChecks = 0;
let explanationChecks = 0;
const modeCoverage = new Map<string, number>();

for (const prototypeId of NUM_CP008_WAVE03_PROTOTYPE_IDS) {
  for (let seed = 61; seed <= 120; seed += 1) {
    const q = generateNumCp008Wave03(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;
    assert(q.canonicalAnswer === q.verifierAnswer, `${label}: source/review answer parity`);
    assert(q.options[q.correctIndex]?.value === q.canonicalAnswer, `${label}: answer binding`);
    parityChecks += 1;

    const lines = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps, q.explanation.finalAnswer];
    const explanationText = lines.join(" ");
    assert(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: working-line count ${q.explanation.steps.length}`);
    assert(!/simply|obviously|clearly|by inspection|use CRT and solve/i.test(explanationText), `${label}: opaque or hand-wavy learner wording`);
    assert(!/generator|prototype|fingerprint|hidden state|authority package/i.test(explanationText), `${label}: implementation vocabulary leak`);
    assert(q.explanation.finalAnswer === q.canonicalAnswer, `${label}: final-answer drift`);
    explanationChecks += 1;

    const mode = String((q.hiddenState as Record<string, unknown>).mode ?? "UNKNOWN");
    modeCoverage.set(mode, (modeCoverage.get(mode) ?? 0) + 1);
    reviewed += 1;
  }
}

assert(reviewed === 480, `Expected 480 review-quality cases, got ${reviewed}`);
assert(modeCoverage.size === 8, `Expected eight modes, got ${modeCoverage.size}`);
for (const [mode, count] of modeCoverage) assert(count === 60, `${mode}: expected 60 review states, got ${count}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE03_REVIEW_QUALITY",
  reviewed,
  parityChecks,
  explanationChecks,
  modeCoverage: Object.fromEntries(modeCoverage),
  learnerBlockers: 0,
}, null, 2));
