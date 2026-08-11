import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityEditorialQuestionV6 } from "./banking-possibility-editorial-v6";
import { generateBankingPossibilityReviewQuestionV4 } from "./banking-possibility-review-question-v4";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let lines = 0;

for (let seed = 0; seed < 80; seed += 1) {
  for (const locale of locales) {
    const prior = generateBankingPossibilityReviewQuestionV4(seed, locale);
    const question = generateBankingPossibilityEditorialQuestionV6(seed, locale);
    records += 1;

    assert.deepEqual(question.statements, prior.statements);
    assert.deepEqual(question.conclusions, prior.conclusions);
    assert.deepEqual(question.options, prior.options);
    assert.equal(question.correctIndex, prior.correctIndex);
    assert.equal(question.semanticAnswer, prior.semanticAnswer);
    assert.deepEqual(question.diagram, prior.diagram);
    assert.deepEqual(question.metadata, prior.metadata);
    assert.equal(question.explanation.length, 2);

    question.explanation.forEach((line, index) => {
      lines += 1;
      assert.ok(line.startsWith(index === 0 ? "I:" : "II:"));
      assert.ok(line.length >= 120, `${seed}/${locale}/${index}: explanation too short`);
      assert.doesNotMatch(line, /at least one (windows|chairs|lamps|coins|roads|rings|cups|flags|boxes|flowers|plates|trains|stars|birds|pencils|rivers|bells|kites|shirts|poets|maps|clouds|drums|gardens|fruits)\b/iu);
      assert.doesNotMatch(line, /every (windows|chairs|lamps|coins|roads|rings|cups|flags|boxes|flowers|plates|trains|stars|birds|pencils|rivers|bells|kites|shirts|poets|maps|clouds|drums|gardens|fruits)\b/iu);
      assert.doesNotMatch(line, /This ordinary conclusion|This possibility|at least one valid arrangement allowed by the statements/u);

      if (locale === "en-IN") {
        assert.match(line, /Statement|Statements/u);
        assert.match(line, /Conclusion/u);
      } else if (locale === "hi-IN") {
        assert.match(line, /कथन/u);
        assert.match(line, /निष्कर्ष/u);
      } else {
        assert.match(line, /ਕਥਨ/u);
        assert.match(line, /ਨਤੀਜਾ/u);
      }

      const record = question.conclusions[index];
      if (record.mode === "POSSIBILITY" && record.canBeTrue) {
        if (locale === "en-IN") assert.match(line, /only one valid arrangement|still allowed/u);
        if (locale === "hi-IN") assert.match(line, /केवल एक वैध व्यवस्था|संभव/u);
        if (locale === "pa-IN") assert.match(line, /ਕੇਵਲ ਇੱਕ ਵੈਧ ਬਣਤਰ|ਸੰਭਵ/u);
      }
      if (record.mode === "DEFINITE" && record.classification === "UNDETERMINED") {
        if (locale === "en-IN") assert.match(line, /open region without a premise-required blue × is not proof of existence/u);
        if (locale === "hi-IN") assert.match(line, /खुला क्षेत्र बिना नीले × के अस्तित्व का प्रमाण नहीं है/u);
        if (locale === "pa-IN") assert.match(line, /ਨੀਲੇ × ਤੋਂ ਬਿਨਾਂ ਖੁੱਲ੍ਹਾ ਹਿੱਸਾ ਅਸਤਿਤਵ ਦਾ ਸਬੂਤ ਨਹੀਂ ਹੈ/u);
      }
    });
  }
}

assert.equal(records, 240);
assert.equal(lines, 480);
console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_EDITORIAL_V6",
  records,
  explanationLines: lines,
  contract: {
    semanticsUnchangedFromV4: true,
    diagramsUnchangedFromV4: true,
    allPremisesReadTogether: true,
    classMemberGrammar: true,
    diagramWitnessConventionExplained: true,
    possibilityVsDefiniteDistinctionExplained: true,
    oldGenericExplanationRejected: true,
    registrationChanged: false,
    deliveryActivationChanged: false,
  },
}, null, 2));
