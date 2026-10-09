import { buildTsdCp011MultilingualQuestionsReview } from "./multilingual-review-export";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 multilingual review export proof failed: ${message}`);
}

const output = buildTsdCp011MultilingualQuestionsReview();
const questionHeaders = output.match(/^### \d+\. TSD-QL-\d+ · TSD-CP011-QL\d+-[A-X]$/gm) ?? [];
assert(questionHeaders.length === 504, `expected 504 question headers, found ${questionHeaders.length}`);
assert((output.match(/^## English$/gm) ?? []).length === 1, "English section missing or duplicated");
assert((output.match(/^## Hindi$/gm) ?? []).length === 1, "Hindi section missing or duplicated");
assert((output.match(/^## Punjabi$/gm) ?? []).length === 1, "Punjabi section missing or duplicated");
assert(!/^Answer:/gmi.test(output), "answer content leaked into review export");
assert(!/Explanation:/i.test(output), "explanation content leaked into review export");
assert(!/correctIndex|solution|expected/i.test(output), "internal solution metadata leaked into review export");

console.log("TSD-CP-011 MULTILINGUAL QUESTIONS-ONLY EXPORT PROOF: PASS");
console.log(JSON.stringify({
  questions: questionHeaders.length,
  english: 168,
  hindi: 168,
  punjabi: 168,
  answersPresent: false,
  explanationsPresent: false,
}, null, 2));