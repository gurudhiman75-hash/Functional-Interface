import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingCanNeverShellV1 } from "./banking-can-never-be-shell-v1";
import { generateBankingCanNeverEditorialV2 } from "./banking-can-never-be-editorial-v2";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
let records = 0;
let changedNegativeConclusions = 0;
let changedNegativeExplanations = 0;

for (const seed of seeds) {
  for (const locale of locales) {
    const base = generateBankingCanNeverShellV1(seed, locale);
    const editorial = generateBankingCanNeverEditorialV2(seed, locale);
    records += 1;

    assert.equal(editorial.editorialAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V2");
    assert.equal(editorial.authority, base.authority);
    assert.equal(editorial.prototypeId, base.prototypeId);
    assert.equal(editorial.seed, base.seed);
    assert.equal(editorial.locale, base.locale);
    assert.equal(editorial.scenarioId, base.scenarioId);
    assert.equal(editorial.scenarioGroup, base.scenarioGroup);
    assert.equal(editorial.sourcePatternId, base.sourcePatternId);
    assert.deepEqual(editorial.statements, base.statements);
    assert.deepEqual(editorial.options, base.options);
    assert.equal(editorial.correctIndex, base.correctIndex);
    assert.equal(editorial.semanticAnswer, base.semanticAnswer);
    assert.deepEqual(editorial.metadata, base.metadata);

    assert.deepEqual(
      editorial.conclusions.map((entry) => ({
        mode: entry.mode,
        surfaceKind: entry.surfaceKind,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        disposition: entry.disposition,
      })),
      base.conclusions.map((entry) => ({
        mode: entry.mode,
        surfaceKind: entry.surfaceKind,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        disposition: entry.disposition,
      })),
    );

    const negativeIndex = editorial.conclusions.findIndex((entry) => entry.mode === "CAN_NEVER_BE");
    assert.ok(negativeIndex >= 0);
    const negative = editorial.conclusions[negativeIndex];
    const baseNegative = base.conclusions[negativeIndex];
    assert.ok(negative);
    assert.ok(baseNegative);

    if (negative.text !== baseNegative.text) changedNegativeConclusions += 1;
    if (editorial.explanation[negativeIndex] !== base.explanation[negativeIndex]) {
      changedNegativeExplanations += 1;
    }

    if (locale === "en-IN") {
      assert.match(negative.text, /can never be/u);
      assert.match(editorial.explanation[negativeIndex] ?? "", /valid arrangement|forced|must stay/u);
    } else {
      const joined = `${negative.text} ${editorial.explanation[negativeIndex] ?? ""}`;
      assert.doesNotMatch(joined, /can never be|some \.\.\.|subject|predicate/u);
      if (locale === "hi-IN") {
        assert.match(negative.text, /वर्ग/u);
        assert.match(editorial.explanation[negativeIndex] ?? "", /वर्ग/u);
        assert.doesNotMatch(joined, /समूह/u);
      } else {
        assert.match(negative.text, /ਵਰਗ/u);
        assert.match(editorial.explanation[negativeIndex] ?? "", /ਵਰਗ/u);
        assert.doesNotMatch(joined, /ਸਮੂਹ/u);
      }
    }
  }
}

assert.equal(records, 240);
assert.equal(changedNegativeConclusions, 160, "Hindi and Punjabi negative conclusions must be naturalized");
assert.equal(changedNegativeExplanations, 240, "Every negative-modal explanation must become term-specific");

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V2",
  records,
  changedNegativeConclusions,
  changedNegativeExplanations,
  semanticParityWithV1: true,
  hindiPunjabiEnglishModalLeaks: 0,
  rejectedLegacyGroupWording: true,
  localizationPolicy: "AGREEMENT_SAFE_GROUP_WORDING_V1",
  activationPermitted: false,
}, null, 2));
