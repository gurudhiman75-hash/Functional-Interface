import assert from "node:assert/strict";
import { SCI_CP013_REVIEW_V2, validateSciCp013ExplanationV2 } from "./sci-cp013-review-v2";

const result = validateSciCp013ExplanationV2();
assert.equal(result.valid, true, result.errors.join("; "));
assert.equal(SCI_CP013_REVIEW_V2.length, 60);
assert.ok(SCI_CP013_REVIEW_V2.every((question) => question.explanation.length > 80));
