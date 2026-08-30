import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { buildTsdCp012ScalarDistractors, buildTsdCp012SetDistractors } from "./question-studio-distractors";

function fail(question: (typeof TSD_CP012_ENGLISH_REVIEW_FINAL)[number], error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  throw new Error(`TSD-CP-012 distractor coverage failed: ${question.qlId}/${question.familyId}/${question.authorityKey}/${question.input.target}: ${message}`);
}

let scalarFamilies = 0;
let setFamilies = 0;
let routeFamilies = 0;
for (const question of TSD_CP012_ENGLISH_REVIEW_FINAL) {
  try {
    if (question.solution.kind === "SET") {
      const wrongs = buildTsdCp012SetDistractors(question.input, question.solution);
      if (wrongs.length !== 3) throw new Error(`expected three set-valued wrong paths, got ${wrongs.length}`);
      setFamilies += 1;
      continue;
    }
    if (question.solution.unit === "INDEX") {
      routeFamilies += 1;
      continue;
    }
    const wrongs = buildTsdCp012ScalarDistractors(question.input, question.solution);
    if (wrongs.length !== 3) throw new Error(`expected three scalar wrong paths, got ${wrongs.length}`);
    scalarFamilies += 1;
  } catch (error) {
    fail(question, error);
  }
}

if (scalarFamilies + setFamilies + routeFamilies !== 270) throw new Error("CP012 distractor coverage proof did not visit all 270 reviewed families");
console.log("TSD-CP-012 PER-FAMILY DISTRACTOR COVERAGE PROOF: PASS");
console.log(JSON.stringify({ scalarFamilies, setFamilies, routeFamilies, reviewedFamilies: 270 }, null, 2));
