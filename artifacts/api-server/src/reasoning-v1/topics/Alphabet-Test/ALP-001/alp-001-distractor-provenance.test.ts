import { ALP_001_QLS } from "./ql-registry";
import { generateAlp001Question } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const blockedGenericLabels = new Set([
  "STOPPED_ONE_STEP_EARLY",
  "STOPPED_ONE_STEP_LATE",
  "TWO_STEP_POSITION_MISCOUNT",
  "USED_OPPOSITE_REFERENCE",
  "ADJACENT_DIGIT_MISREAD",
  "TWO_POSITION_DIGIT_MISREAD",
  "WRONG_POSITION_TOKEN",
  "WRONG_REFERENCE_SCAN",
  "PAIR_RELATION_MISMATCH",
  "INCOMPLETE_TRANSFORMATION",
  "FINAL_CONDITION_MISMATCH",
  "DOMAIN_VALID_FALLBACK",
  "SOURCE_ROW_EARLY",
  "OPPOSITE_REFERENCE",
  "WRONG_FINAL_CONDITION",
]);

const advanced = ALP_001_QLS.filter((candidate) => Number(candidate.checkpointId.slice(-3)) >= 6);
let inspected = 0;
for (const candidate of advanced) {
  for (let seed = 0; seed < 64; seed += 1) {
    const question = generateAlp001Question(candidate.qlId, seed, "en-IN");
    assert(question.options.length === 4, `${candidate.qlId} seed ${seed} did not render four options.`);
    assert(new Set(question.options.map((option) => option.value)).size === 4, `${candidate.qlId} seed ${seed} repeated an option.`);
    for (const option of question.options) {
      if (option.errorLabel === null) continue;
      inspected += 1;
      assert(!blockedGenericLabels.has(option.errorLabel), `${candidate.qlId} seed ${seed} retained generic answer-type distractor ${option.errorLabel}.`);
    }
  }
}

function labelsFor(qlId: string, seeds = 48): Set<string> {
  const labels = new Set<string>();
  for (let seed = 0; seed < seeds; seed += 1) {
    const question = generateAlp001Question(qlId, seed, "en-IN");
    for (const option of question.options) if (option.errorLabel) labels.add(option.errorLabel);
  }
  return labels;
}

const cp8Transform = labelsFor("ALP-QL-125");
assert(cp8Transform.has("READ_BEFORE_DIGIT_TRANSFORM"), "CP008 post-transform distractors do not exercise reading before the transform.");
assert(cp8Transform.has("READ_PREVIOUS_FINAL_DIGIT") || cp8Transform.has("READ_NEXT_FINAL_DIGIT"), "CP008 post-transform distractors do not exercise a neighbouring final slot.");

const cp9Position = labelsFor("ALP-QL-131");
assert(cp9Position.has("COUNTED_FROM_OPPOSITE_END"), "CP009 direct-position distractors do not exercise wrong-end counting.");
assert(cp9Position.has("READ_PREVIOUS_ROW_POSITION") || cp9Position.has("READ_NEXT_ROW_POSITION"), "CP009 direct-position distractors do not exercise a neighbouring row slot.");

const cp9Compound = labelsFor("ALP-QL-138");
assert(
  cp9Compound.has("CHECKED_ONLY_PREDECESSOR_Z") || cp9Compound.has("CHECKED_ONLY_SYMBOL_PREDECESSOR"),
  "CP009 compound-window distractors do not exercise predecessor-only checking.",
);
assert(
  cp9Compound.has("CHECKED_ONLY_SUCCESSOR_B") || cp9Compound.has("CHECKED_ONLY_DIGIT_SUCCESSOR"),
  "CP009 compound-window distractors do not exercise successor-only checking.",
);

const cp10Direct = labelsFor("ALP-QL-147");
assert(cp10Direct.has("READ_FROM_ORIGINAL_ROW"), "CP010 in-place-sort distractors do not exercise reading the original row.");
assert(cp10Direct.has("READ_PREVIOUS_FINAL_POSITION") || cp10Direct.has("READ_NEXT_FINAL_POSITION"), "CP010 in-place-sort distractors do not exercise a neighbouring final position.");

const cp10Adjacency = labelsFor("ALP-QL-156");
assert(cp10Adjacency.has("SCANNED_BEFORE_TRANSFORM"), "CP010 composite-scan distractors do not exercise scanning before transformation.");
assert(cp10Adjacency.has("REVERSED_FINAL_ADJACENCY_ORDER"), "CP010 composite-scan distractors do not exercise reversed final adjacency.");

console.log("ALP-001 completed-state distractor provenance gate passed.", {
  advancedQls: advanced.length,
  inspectedDistractors: inspected,
  cp8Transform: [...cp8Transform].sort(),
  cp9Position: [...cp9Position].sort(),
  cp9Compound: [...cp9Compound].sort(),
  cp10Direct: [...cp10Direct].sort(),
  cp10Adjacency: [...cp10Adjacency].sort(),
});
