import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingCanNeverEditorialV5 } from "./banking-can-never-be-editorial-v5";
import { generateBankingCanNeverEditorialV6 } from "./banking-can-never-be-editorial-v6";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
let records = 0;
let changedLines = 0;
let awkwardWholeClassBefore = 0;
let awkwardWholeClassAfter = 0;

function awkwardCount(text: string): number {
  return (text.match(/सभी “[^”]+” वर्ग (?:का|को)/gu) ?? []).length
    + (text.match(/ਸਾਰੇ “[^”]+” ਵਰਗ (?:ਦਾ|ਨੂੰ)/gu) ?? []).length;
}

for (const seed of seeds) {
  for (const locale of locales) {
    const before = generateBankingCanNeverEditorialV5(seed, locale);
    const after = generateBankingCanNeverEditorialV6(seed, locale);
    const repeat = generateBankingCanNeverEditorialV6(seed, locale);
    records += 1;

    assert.deepEqual(after, repeat);
    assert.equal(after.editorialAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6");

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
    awkwardWholeClassBefore += awkwardCount(beforeText);
    awkwardWholeClassAfter += awkwardCount(afterText);
    assert.equal(afterText.includes("“सभी कभी नहीं”"), false);
    assert.equal(afterText.includes("“ਸਾਰੇ ਕਦੇ ਨਹੀਂ”"), false);
    assert.equal(afterText.includes("“all can never be” is not proved"), false);
  }
}

assert.equal(records, 240);
assert.ok(changedLines > 0);
assert.ok(awkwardWholeClassBefore > 0);
assert.equal(awkwardWholeClassAfter, 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6",
  records,
  semanticAndAnswerParityWithV5: true,
  diagramByteParityWithV5: true,
  visualPolicyParityWithV5: true,
  changedLines,
  awkwardWholeClassBefore,
  awkwardWholeClassAfter,
  humanApprovalImplied: false,
  activationPermitted: false,
}, null, 2));
