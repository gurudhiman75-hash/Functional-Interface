import assert from "node:assert/strict";
import { SCI_CP012_REVIEW_V2, validateSciCp012ExplanationV2 } from "./sci-cp012-review-v2";

const result = validateSciCp012ExplanationV2();
assert.equal(result.valid, true, result.errors.join("; "));
assert.equal(SCI_CP012_REVIEW_V2.length, 60);
assert.ok(SCI_CP012_REVIEW_V2.every((question) => question.explanation.length > 80));
