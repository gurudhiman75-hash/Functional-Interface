import assert from "node:assert/strict";

// For conjunction F = A ∩ B, F is a subset of both A and B.
// If |F| >= 2, then |A| >= 2 and |B| >= 2. Therefore the coarse solution
// class is MULTIPLE_SOLUTIONS both with all constraints and after either
// single-component ablation. Neither component changes the requested class.
// Such a question fails CP014's answer-impact admission rule.

function solutionClass(length: number) {
  return length === 0 ? "NO_SOLUTION" : length === 1 ? "ONE_SOLUTION" : "MULTIPLE_SOLUTIONS";
}

let checked = 0;
for (let domainSize = 2; domainSize <= 12; domainSize += 1) {
  const universe = Array.from({ length: domainSize }, (_, i) => i);
  const masks = 1 << domainSize;
  for (let maskA = 0; maskA < masks; maskA += 1) {
    const a = universe.filter((value) => (maskA & (1 << value)) !== 0);
    for (let maskB = 0; maskB < Math.min(masks, 256); maskB += 1) {
      const b = universe.filter((value) => (maskB & (1 << value)) !== 0);
      const full = a.filter((value) => b.includes(value));
      if (full.length < 2) continue;
      assert.equal(solutionClass(full.length), "MULTIPLE_SOLUTIONS");
      assert.equal(solutionClass(a.length), "MULTIPLE_SOLUTIONS");
      assert.equal(solutionClass(b.length), "MULTIPLE_SOLUTIONS");
      checked += 1;
    }
  }
}

assert.ok(checked > 1000, "negative-control search too narrow");

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_SOLUTION_CLASS_ADMISSION",
  checkedMultipleIntersections: checked,
  rejectedClassUnderSimpleConjunction: "MULTIPLE_SOLUTIONS",
  admissibleWave02Classes: ["NO_SOLUTION", "ONE_SOLUTION"],
  reason: "SINGLE_COMPONENT_ABLATION_DOES_NOT_CHANGE_REPORTED_CLASS",
  ql248Allocated: false,
}, null, 2));
