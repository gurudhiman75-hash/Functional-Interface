import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingCanNeverEditorialV4 } from "./banking-can-never-be-editorial-v4";
import { generateBankingCanNeverEditorialV5 } from "./banking-can-never-be-editorial-v5";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);

const banned = {
  "en-IN": ["“all can never be” is not proved"],
  "hi-IN": ["“सभी कभी नहीं”", "बाहर वाला आवश्यक सदस्य असंभव है", "बाहर वाला सदस्य असंभव है"],
  "pa-IN": ["“ਸਾਰੇ ਕਦੇ ਨਹੀਂ”", "ਬਾਹਰਲਾ ਲੋੜੀਂਦਾ ਮੈਂਬਰ ਅਸੰਭਵ ਹੈ", "ਬਾਹਰਲਾ ਮੈਂਬਰ ਅਸੰਭਵ ਹੈ"],
} as const;

const replacementHits: Record<SylLocale, number> = {
  "en-IN": 0,
  "hi-IN": 0,
  "pa-IN": 0,
};
let records = 0;
let changedLines = 0;
let v4Chars = 0;
let v5Chars = 0;

for (const seed of seeds) {
  for (const locale of locales) {
    const v4 = generateBankingCanNeverEditorialV4(seed, locale);
    const v5 = generateBankingCanNeverEditorialV5(seed, locale);
    records += 1;

    assert.equal(v5.editorialAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5");
    assert.equal(v5.authority, v4.authority);
    assert.equal(v5.prototypeId, v4.prototypeId);
    assert.equal(v5.seed, v4.seed);
    assert.equal(v5.locale, v4.locale);
    assert.equal(v5.scenarioId, v4.scenarioId);
    assert.equal(v5.scenarioGroup, v4.scenarioGroup);
    assert.equal(v5.sourcePatternId, v4.sourcePatternId);
    assert.deepEqual(v5.statements, v4.statements);
    assert.deepEqual(v5.conclusions, v4.conclusions);
    assert.deepEqual(v5.options, v4.options);
    assert.equal(v5.correctIndex, v4.correctIndex);
    assert.equal(v5.semanticAnswer, v4.semanticAnswer);
    assert.deepEqual(v5.metadata, v4.metadata);
    assert.deepEqual(v5.explanationEvidence, v4.explanationEvidence);
    assert.deepEqual(v5.diagram, v4.diagram);
    assert.deepEqual(v5.visualPolicy, v4.visualPolicy);

    assert.equal(v5.diagram.enabled, true);
    assert.equal(v5.diagram.diagramCount, 1);
    assert.equal(v5.diagram.premiseOnly, true);
    assert.equal(v5.diagram.mobileViewBoxWidth, 340);
    assert.equal(v5.visualPolicy.stemDiagram, "NONE");
    assert.equal(v5.visualPolicy.solutionDiagram, "ONE_COMBINED_PREMISE_DIAGRAM");
    assert.equal(v5.visualPolicy.disclosure, "AFTER_ATTEMPT");
    assert.equal(v5.visualPolicy.separateConclusionDiagrams, false);

    const before = v4.explanation.join("\n");
    const after = v5.explanation.join("\n");
    v4Chars += before.length;
    v5Chars += after.length;
    changedLines += v5.explanation.filter((line, index) => line !== v4.explanation[index]).length;
    if (before !== after) replacementHits[locale] += 1;

    for (const phrase of banned[locale]) {
      assert.equal(after.includes(phrase), false, `${seed}/${locale}: banned machine-like phrase survived: ${phrase}`);
    }

    if (locale !== "en-IN") {
      assert.equal(after.includes("all can never be"), false);
      assert.equal(after.includes("outside member is impossible"), false);
    }

    assert.equal(v5.metadata.questionStudioVisible, false);
    assert.equal(v5.metadata.questionBankWritable, false);
    assert.equal(v5.metadata.testEligible, false);
    assert.equal(v5.metadata.publiclyPublishable, false);
  }
}

assert.equal(records, 240);
assert.ok(changedLines > 0, "V5 must actually polish at least one learner explanation line.");
assert.ok(replacementHits["en-IN"] > 0, "Expected English polish coverage.");
assert.ok(replacementHits["hi-IN"] > 0, "Expected Hindi polish coverage.");
assert.ok(replacementHits["pa-IN"] > 0, "Expected Punjabi polish coverage.");
assert.ok(v5Chars <= Math.ceil(v4Chars * 1.08), "Editorial polish must not materially bloat learner explanations.");

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5",
  records,
  semanticAndAnswerParityWithV4: true,
  diagramByteParityWithV4: true,
  visualPolicyParityWithV4: true,
  changedLines,
  replacementHits,
  explanationChars: { v4: v4Chars, v5: v5Chars, ratio: Number((v5Chars / v4Chars).toFixed(4)) },
  bannedMachineLikePhrasesRemaining: 0,
  humanApprovalImplied: false,
  activationPermitted: false,
}, null, 2));
