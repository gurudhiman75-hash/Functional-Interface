import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityEditorialV3 } from "./banking-possibility-editorial-v3";
import { generateBankingPossibilityEditorialV4 } from "./banking-possibility-editorial-v4";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [
  ...Array.from({ length: 80 }, (_, index) => index),
  2541155709,
  4126217553,
];

let records = 0;
let changedLines = 0;
let duplicateTokensBefore = 0;
let duplicateTokensAfter = 0;

for (const seed of seeds) {
  for (const locale of locales) {
    const before = generateBankingPossibilityEditorialV3(seed, locale);
    const after = generateBankingPossibilityEditorialV4(seed, locale);
    const repeat = generateBankingPossibilityEditorialV4(seed, locale);
    records += 1;

    assert.deepEqual(after, repeat);
    assert.equal(after.editorialAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4");
    assert.equal(after.semanticAuthority, before.semanticAuthority);

    const {
      editorialAuthority: beforeEditorialAuthority,
      explanation: beforeExplanation,
      ...beforeStable
    } = before;
    const {
      editorialAuthority: afterEditorialAuthority,
      explanation: afterExplanation,
      ...afterStable
    } = after;
    void beforeEditorialAuthority;
    void afterEditorialAuthority;
    assert.deepEqual(afterStable, beforeStable);

    for (let index = 0; index < afterExplanation.length; index += 1) {
      if (afterExplanation[index] !== beforeExplanation[index]) changedLines += 1;
    }

    const beforeText = beforeExplanation.join("\n");
    const afterText = afterExplanation.join("\n");
    duplicateTokensBefore += (beforeText.match(/वर्ग वर्ग/gu) ?? []).length;
    duplicateTokensBefore += (beforeText.match(/ਵਰਗ ਵਰਗ/gu) ?? []).length;
    duplicateTokensAfter += (afterText.match(/वर्ग वर्ग/gu) ?? []).length;
    duplicateTokensAfter += (afterText.match(/ਵਰਗ ਵਰਗ/gu) ?? []).length;
  }
}

assert.ok(changedLines > 0);
assert.ok(duplicateTokensBefore > 0);
assert.equal(duplicateTokensAfter, 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4",
  records,
  baselineLogicalSeeds: 80,
  targetedCandidateRegressionSeeds: 2,
  semanticAndAnswerParityWithV3: true,
  diagramByteParityWithV3: true,
  visualPolicyParityWithV3: true,
  changedLines,
  duplicateTokensBefore,
  duplicateTokensAfter,
  humanApprovalImplied: false,
  activationPermitted: false,
}, null, 2));
