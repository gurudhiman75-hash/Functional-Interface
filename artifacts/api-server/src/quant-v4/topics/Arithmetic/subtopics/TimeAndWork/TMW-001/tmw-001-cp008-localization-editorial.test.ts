import { strict as assert } from "node:assert";
import { TMW_CP008_REGISTRY } from "./foundation/cp008-registry";
import { runTmwCp008LocalizedPipeline } from "./foundation/cp008-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let rows = 0;

for (const entry of TMW_CP008_REGISTRY) {
  const seed = `tmw-cp008-localization-review:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp008LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
    const prose = [
      question.stem,
      ...question.options,
      question.explanation.opening,
      ...question.explanation.givens,
      question.explanation.shortcut.title,
      ...question.explanation.shortcut.steps,
      question.explanation.commonTrap.explanation,
      question.explanation.conclusion,
    ].join("\n");

    assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent contribution|Don't fall for|Do not choose/i.test(prose), false, `${entry.qlId}:${language}: internal wording`);
    assert.equal(/\b(?:Asha|Bharat|Charan|Meera|Rohan|Simran|Kavita|Mohan|Neeraj|Priya|Raj|Sonia|warehouse|factory|painting site|payment ratio|piece rate|bonus pool|per hour|days)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);
    assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${entry.qlId}:${language}: raw mixed fraction`);
    assert.equal(/\d+ दिन में|\d+ घंटे में|\d+ ਦਿਨ ਵਿੱਚ|\d+ ਘੰਟੇ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected time postposition`);
    assert.equal(/फाइलें (?:को|का)|पुर्ज़े (?:को|का)|ਪੁਰਜ਼ੇ (?:ਨੂੰ|ਦਾ)|ਫਾਈਲਾਂ (?:ਨੂੰ|ਦਾ)/.test(prose), false, `${entry.qlId}:${language}: output case`);
    assert.equal(/[£$€]/.test(prose), false, `${entry.qlId}:${language}: inconsistent currency`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.solution.answerText);
    assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
    assert.ok(question.explanation.conclusion.includes(question.solution.answerText), `${entry.qlId}:${language}: conclusion answer`);

    if (["MONEY", "MONEY_TRIPLE"].includes(entry.answerType)) {
      assert.ok(question.options.every((option) => option.split(", ").every((part) => part.startsWith("₹"))), `${entry.qlId}:${language}: rupee delivery`);
    }
    if (entry.answerType === "MONEY_TRIPLE") {
      assert.equal(question.solution.answerText.split(", ").length, 3);
      assert.match(question.explanation.conclusion, language === "hi" ? /बताए गए क्रम/ : /ਦਿੱਤੇ ਕ੍ਰਮ/);
    }
    if (entry.answerType === "TIME") {
      assert.match(question.solution.answerText, language === "hi" ? /दिन$/ : /ਦਿਨ$/);
    }
    if (entry.answerType === "EFFICIENCY") {
      assert.match(question.solution.answerText, language === "hi" ? /प्रति घंटा$/ : /ਪ੍ਰਤੀ ਘੰਟਾ$/);
    }

    switch (entry.solveMode) {
      case "findPaymentRatioFromContributionFactors":
        assert.match(question.explanation.opening, language === "hi" ? /दक्षता.*काम के दिन.*हर दिन काम के घंटे/ : /ਦੱਖਤਾ.*ਕੰਮ ਦੇ ਦਿਨ.*ਹਰ ਦਿਨ ਕੰਮ ਦੇ ਘੰਟੇ/);
        break;
      case "findResidualPayment":
        assert.match(question.explanation.shortcut.title, language === "hi" ? /कुल में से दिए भुगतान घटाएँ/ : /ਕੁੱਲ ਵਿੱਚੋਂ ਦਿੱਤੇ ਭੁਗਤਾਨ ਘਟਾਓ/);
        break;
      case "findPaymentAfterStagedParticipation":
        assert.match(question.explanation.opening, language === "hi" ? /वास्तव में जितनी अवधि काम/ : /ਅਸਲ ਵਿੱਚ ਜਿੰਨੀ ਮਿਆਦ ਕੰਮ/);
        break;
      case "findPieceRatePaymentFromOutput":
        assert.match(question.stem, /पीस-रेट|ਪੀਸ-ਰੇਟ/);
        break;
      case "findBonusShareFromExtraContribution":
        assert.match(question.explanation.opening, language === "hi" ? /निर्धारित लक्ष्य/ : /ਨਿਰਧਾਰਤ ਟੀਚਾ/);
        break;
      case "findPaymentAfterSignedContribution":
        assert.match(question.explanation.opening, language === "hi" ? /मान्य शुद्ध योगदान/ : /ਮਨਜ਼ੂਰ ਸ਼ੁੱਧ ਯੋਗਦਾਨ/);
        break;
    }

    rows += 1;
  }
}

assert.equal(rows, 26);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-008",
  localizedEditorialRows: rows,
  status: "PASS",
}, null, 2));
