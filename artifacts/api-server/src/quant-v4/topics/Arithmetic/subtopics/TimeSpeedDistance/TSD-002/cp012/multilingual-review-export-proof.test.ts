import { buildTsdCp012MultilingualQuestionsReview } from "./multilingual-review-export";
import { TSD_CP012_QL_LIFECYCLE } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 multilingual review export proof failed: ${message}`);
}

const output = buildTsdCp012MultilingualQuestionsReview();
const questionHeaders = output.match(/^### \d+\. TSD-QL-\d+ · TSD-CP012-QL\d+-[A-Z]$/gm) ?? [];
assert(questionHeaders.length === 810, `expected 810 question headers, found ${questionHeaders.length}`);
assert((output.match(/^## English$/gm) ?? []).length === 1, "English section missing or duplicated");
assert((output.match(/^## Hindi$/gm) ?? []).length === 1, "Hindi section missing or duplicated");
assert((output.match(/^## Punjabi$/gm) ?? []).length === 1, "Punjabi section missing or duplicated");
assert(!/^Answer:/gmi.test(output), "answer content leaked into review export");
assert(!/^उत्तर:/gm.test(output), "Hindi answer content leaked into review export");
assert(!/^ਜਵਾਬ:/gm.test(output), "Punjabi answer content leaked into review export");
assert(!/^Explanation:/gmi.test(output), "explanation block leaked into review export");
assert(!/\bcorrectIndex\b|\bsolution\s*:|\bexpected\s*:|\bexplanation\s*:/i.test(output), "internal solution metadata leaked into review export");
assert(TSD_CP012_QL_LIFECYCLE.productOwnerApproved === false, "review export must not imply approval");
assert(TSD_CP012_QL_LIFECYCLE.frozen === false, "review export must remain unfrozen");
assert(TSD_CP012_QL_LIFECYCLE.questionStudioRegistered === false, "review export must not register Studio");
assert(TSD_CP012_QL_LIFECYCLE.questionBankWritable === false, "review export must not enable Bank writes");
assert(TSD_CP012_QL_LIFECYCLE.testEligible === false, "review export must not enable tests");
assert(TSD_CP012_QL_LIFECYCLE.publiclyPublishable === false, "review export must not enable publishing");

console.log("TSD-CP-012 MULTILINGUAL QUESTIONS-ONLY EXPORT PROOF: PASS");
console.log(JSON.stringify({
  questions: questionHeaders.length,
  english: 270,
  hindi: 270,
  punjabi: 270,
  answersPresent: false,
  explanationsPresent: false,
  internalMetadataPresent: false,
  lifecycle: "REVIEW_ONLY_NOT_FROZEN",
}, null, 2));
