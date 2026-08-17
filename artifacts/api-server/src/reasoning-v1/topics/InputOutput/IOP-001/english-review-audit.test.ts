import assert from "node:assert/strict";
import { generateIopEnglishReviewCaselet } from "./english-review-generator.ts";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";
import type { IopPermanentSolveMode } from "./permanent-authorities.ts";
import type { IopEnglishProductionCaselet } from "./english-production-types.ts";

const counts = new Map<IopPermanentSolveMode, number>();
const caselets: IopEnglishProductionCaselet[] = [];

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function assertBoxDisplayCoherent(caselet: IopEnglishProductionCaselet): void {
  for (const trace of [caselet.demonstration, caselet.target]) {
    assert.equal(trace.steps.length, 4, "Box audit trace should contain four stages");
    assert.equal(trace.steps[2]?.length, 2, "Box Step 3 should contain two visible quotients");
    assert.equal(trace.steps[3]?.length, 1, "Box Step 4 should contain one visible final value");
    const first = Number(trace.steps[2]![0]);
    const second = Number(trace.steps[2]![1]);
    const finalValue = Number(trace.steps[3]![0]);
    assert.ok([first, second, finalValue].every(Number.isFinite), "Box visible arithmetic contains a non-number");
    assert.equal(round2(Math.abs(first - second)), round2(finalValue), "Visible Step-3 quotients do not reproduce the visible final answer");
  }
}

for (const mode of IOP_ENGLISH_SOURCE_MODES) {
  for (const example of [0, 1] as const) {
    const seed = `IOP-EN-REVIEW-${mode.sourceModeId}-${String(example).padStart(2, "0")}`;
    const caselet = generateIopEnglishReviewCaselet(seed, mode.qlId, mode.sourceModeId);
    caselets.push(caselet);
    assert.equal(caselet.children.length, 4, `${mode.sourceModeId}/${example} should contain four review questions`);
    for (const child of caselet.children) counts.set(child.kind, (counts.get(child.kind) ?? 0) + 1);
    if (caselet.qlId === "IOP-QL-008") assertBoxDisplayCoherent(caselet);
  }
}

assert.equal(caselets.length, 38, "English human-audit pack should contain 38 caselets");
assert.equal(caselets.reduce((sum, caselet) => sum + caselet.children.length, 0), 152, "English human-audit pack should contain 152 questions");

const expected: Readonly<Record<IopPermanentSolveMode, number>> = {
  STEP_OUTPUT: 20,
  FINAL_OUTPUT: 20,
  ELEMENT_AT_POSITION: 18,
  POSITION_OF_ELEMENT: 18,
  STEP_NUMBER: 19,
  PREVIOUS_STEP: 19,
  MISSING_STEP: 19,
  REMAINING_STEP_COUNT: 19,
};

for (const [kind, count] of Object.entries(expected) as [IopPermanentSolveMode, number][]) {
  assert.equal(counts.get(kind), count, `Unexpected human-audit coverage for ${kind}`);
}

console.log("PASS_IOP_001_ENGLISH_REVIEW_AUDIT");
console.log(`review caselets ${caselets.length}`);
console.log(`review questions ${caselets.reduce((sum, caselet) => sum + caselet.children.length, 0)}`);
console.log(`query distribution ${Object.entries(expected).map(([kind, count]) => `${kind}:${count}`).join(" | ")}`);
console.log("box display coherence PASS");
console.log("English freeze false");
console.log("Question Studio false");
