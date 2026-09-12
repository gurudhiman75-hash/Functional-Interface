import { strict as assert } from "node:assert";
import { buildCom003WordTabsHumanReviewFile } from "./com003-word-tabs-human-review-file-v1";
import { COM003_WORD_TABS_AUTHORITY_V1 } from "./com003-word-tabs-completion-v1";

const review = buildCom003WordTabsHumanReviewFile();
assert.ok(review.startsWith("# COM-003 — Microsoft Word Ribbon Tabs & Interface Human Review V1\n"));
assert.ok(review.includes("Status: REVIEW_ONLY"));
assert.ok(review.includes("COM-003-QL-020 — Word Interface, Ribbon & File Tab"));
assert.ok(review.includes("COM-003-QL-029 — Word File Tab & Backstage"));
assert.equal((review.match(/\*\*Question:\*\*/g) ?? []).length, COM003_WORD_TABS_AUTHORITY_V1.totalQuestionLanguageArtifacts);
assert.equal((review.match(/\*\*Answer:\*\*/g) ?? []).length, COM003_WORD_TABS_AUTHORITY_V1.totalQuestionLanguageArtifacts);
assert.ok(!review.includes("\\n"));
assert.ok(review.includes("Quick Access Toolbar"));
assert.ok(review.includes("Set Proofing Language"));
assert.ok(review.includes("Table of Contents"));
assert.ok(review.includes("https://support.microsoft.com/en-us/word/customize-the-ribbon-in-word"));

console.log("[COM003-WORD-TABS-HUMAN-REVIEW-FILE-V1] PASS artifacts=240 real-newlines=true");
