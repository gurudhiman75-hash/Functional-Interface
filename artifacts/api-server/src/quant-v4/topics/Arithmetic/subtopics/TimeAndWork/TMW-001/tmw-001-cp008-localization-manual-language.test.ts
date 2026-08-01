import { strict as assert } from "node:assert";
import { TMW_CP008_REGISTRY } from "./foundation/cp008-registry";
import { runTmwCp008LocalizedPipeline } from "./foundation/cp008-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP008_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp008-localization:${entry.qlId}:${index}`;
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
      assert.equal(/\b(?:Asha|Bharat|Charan|Meera|Rohan|Simran|Kavita|Mohan|Neeraj|Priya|Raj|Sonia|warehouse|factory|payment ratio|total payment|piece rate|bonus pool|per hour|days)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);
      assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${entry.qlId}:${language}: raw mixed fraction`);
      assert.equal(/\d+ दिन में|\d+ घंटे में|\d+ ਦਿਨ ਵਿੱਚ|\d+ ਘੰਟੇ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected time postposition`);
      assert.equal(/ऑटो-पुर्जा कारखाना में|वाणिज्यिक परिसर की रंगाई साइट में/.test(prose), false, `${entry.qlId}:${language}: Hindi setting locative`);
      assert.equal(/फाइलें (?:को|का)|पुर्ज़े (?:को|का)/.test(prose), false, `${entry.qlId}:${language}: Hindi output case`);
      assert.equal(/स्वीकृत (?:फाइलें|पुर्ज़े|पैकेट|वर्ग मीटर) पूरे किए|ਮਨਜ਼ੂਰ(?:ਸ਼ੁਦਾ)? (?:ਫਾਈਲਾਂ|ਪੁਰਜ਼ੇ|ਪੈਕੇਟ|ਵਰਗ ਮੀਟਰ) ਪੂਰੇ ਕੀਤੇ/.test(prose), false, `${entry.qlId}:${language}: piece-rate output agreement`);
      assert.equal(/आवश्यक प्रति घंटा दर .* प्रति घंटा|ਲੋੜੀਂਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ .* ਪ੍ਰਤੀ ਘੰਟਾ/.test(question.explanation.conclusion), false, `${entry.qlId}:${language}: duplicated hourly conclusion`);
      assert.equal(/भुगतान अनुपात: ₹|ਭੁਗਤਾਨ ਅਨੁਪਾਤ: ₹/.test(question.explanation.givens.join(" ")), false, `${entry.qlId}:${language}: currency inside ratio`);
      assert.equal(/लक्ष्य हिस्सा \d|ਟੀਚਾ ਹਿੱਸਾ \d|अतिरिक्त योगदान-भार|ਵਾਧੂ ਯੋਗਦਾਨ-ਭਾਰ/.test(prose), false, `${entry.qlId}:${language}: mechanical bonus wording`);
      assert.equal(/भुगतान पाने वाला:|ਭੁਗਤਾਨ ਲੈਣ ਵਾਲਾ:/.test(prose), false, `${entry.qlId}:${language}: gendered recipient label`);
      assert.equal(/यह विकल्प पहले से दिए भुगतान कुल राशि से नहीं घटाता|ਇਹ ਚੋਣ ਪਹਿਲਾਂ ਦਿੱਤੇ ਭੁਗਤਾਨ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਨਹੀਂ ਘਟਾਉਂਦੀ/.test(prose), false, `${entry.qlId}:${language}: missing residual case marker`);
      assert.equal(/श्रेणी योगदान अनुपात|तीनों श्रेणी योगदान|ਸ਼੍ਰੇਣੀ ਯੋਗਦਾਨ ਅਨੁਪਾਤ|ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀ ਯੋਗਦਾਨ/.test(prose), false, `${entry.qlId}:${language}: category genitive wording`);
      assert.equal(/ਉਨ੍ਹਾਂ ਦੀ ਦਰ [^।]+ ਅਤੇ [^।]+ ਹੈ ਅਤੇ ਰੋਜ਼ਾਨਾ|ਉਨ੍ਹਾਂ ਦੀ ਵਿਅਕਤੀਗਤ ਦਰ ਕ੍ਰਮਵਾਰ[^।]+ ਹੈ; ਸਭ ਨੇ/.test(question.stem), false, `${entry.qlId}:${language}: Punjabi plural-rate agreement`);
      assert.equal(/ਅਸਵੀਕृत\/पुनःकार्य|ਅਸਵੀਕृत|अस्वीकृत\/पुनःकार्य|ਰੱਦ\/ਮੁੜ-ਕੰਮ/.test(prose), false, `${entry.qlId}:${language}: slash-based signed wording`);
      assert.equal(/[£$€]/.test(prose), false, `${entry.qlId}:${language}: inconsistent currency`);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.solution.answerText);
      assert.equal(question.optionAudit[question.correctIndex]?.key, question.solution.answerKey);

      if (["MONEY", "MONEY_TRIPLE"].includes(entry.answerType)) {
        assert.ok(question.options.every((option) => option.split(", ").every((part) => part.startsWith("₹"))), `${entry.qlId}:${language}: rupee options`);
      }
      if (entry.answerType === "MONEY_TRIPLE") {
        assert.equal(question.solution.answerText.split(", ").length, 3);
        assert.ok(question.options.every((option) => option.split(", ").length === 3));
        assert.match(question.explanation.conclusion, language === "hi" ? /^अतः बताए गए क्रम में भुगतान:/ : /^ਇਸ ਲਈ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਭੁਗਤਾਨ:/);
      }

      switch (entry.solveMode) {
        case "findSelectedPartyPayment":
        case "findPaymentFromCompletedFractions":
          assert.match(question.explanation.givens.join(" "), language === "hi" ? /भुगतान के लिए चुने गए नाम:/ : /ਭੁਗਤਾਨ ਲਈ ਚੁਣੇ ਨਾਮ:/);
          break;
        case "findTotalPaymentPoolFromKnownShare":
          assert.match(question.explanation.conclusion, language === "hi" ? /^अतः कुल भुगतान राशि:/ : /^ਇਸ ਲਈ ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ:/);
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /कुल भुगतान पूछा गया है.*ज्ञात व्यक्ति का हिस्सा/ : /ਕੁੱਲ ਭੁਗਤਾਨ ਪੁੱਛਿਆ ਗਿਆ ਹੈ.*ਪਤਾ ਵਿਅਕਤੀ ਦਾ ਹਿੱਸਾ/);
          break;
        case "findResidualPayment":
          assert.match(question.stem, language === "hi" ? /^कुल राशि ₹.+ निर्धारित है।/ : /^ਕੁੱਲ ਰਕਮ ₹.+ ਨਿਰਧਾਰਤ ਹੈ।/);
          assert.match(question.explanation.conclusion, language === "hi" ? /^अतः शेष भुगतान:/ : /^ਇਸ ਲਈ ਬਾਕੀ ਭੁਗਤਾਨ:/);
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /भुगतानों को कुल राशि से/ : /ਭੁਗਤਾਨਾਂ ਨੂੰ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ/);
          break;
        case "findContributionFactorRatioFromPayments":
          assert.match(question.explanation.givens[0] ?? "", language === "hi" ? /^भुगतान अनुपात: \d+:\d+/ : /^ਭੁਗਤਾਨ ਅਨੁਪਾਤ: \d+:\d+/);
          break;
        case "findMixedCategoryPaymentDistribution":
          assert.match(question.explanation.givens[0] ?? "", language === "hi" ? /^श्रेणियों का योगदान अनुपात:/ : /^ਸ਼੍ਰੇਣੀਆਂ ਦਾ ਯੋਗਦਾਨ ਅਨੁਪਾਤ:/);
          assert.match(question.explanation.shortcut.steps[0] ?? "", language === "hi" ? /तीनों श्रेणियों के योगदान/ : /ਤਿੰਨਾਂ ਸ਼੍ਰੇਣੀਆਂ ਦੇ ਯੋਗਦਾਨ/);
          if (language === "pa") assert.match(question.stem, /ਉਨ੍ਹਾਂ ਦੀਆਂ ਵਿਅਕਤੀਗਤ ਦਰਾਂ.*ਹਨ; ਸਭ ਨੇ/);
          break;
        case "findPieceRatePaymentFromOutput":
          assert.match(question.stem, language === "hi" ? /स्वीकृत काम की मात्रा:/ : /ਮਨਜ਼ੂਰ ਕੰਮ ਦੀ ਮਾਤਰਾ:/);
          assert.match(question.explanation.conclusion, language === "hi" ? /^अतः देय पीस-रेट भुगतान:/ : /^ਇਸ ਲਈ ਦੇਣਯੋਗ ਪੀਸ-ਰੇਟ ਭੁਗਤਾਨ:/);
          break;
        case "findBonusShareFromExtraContribution":
          assert.match(question.explanation.shortcut.steps[1] ?? "", language === "hi" ? /अतिरिक्त योगदान \d+ इकाई है.*उत्तर ₹/ : /ਵਾਧੂ ਯੋਗਦਾਨ \d+ ਇਕਾਈ ਹੈ.*ਉੱਤਰ ₹/);
          assert.match(question.explanation.givens[1] ?? "", language === "hi" ? /^बोनस राशि:/ : /^ਬੋਨਸ ਰਕਮ:/);
          assert.match(question.explanation.conclusion, language === "hi" ? /^अतः बोनस राशि:/ : /^ਇਸ ਲਈ ਬੋਨਸ ਰਕਮ:/);
          break;
        case "findPaymentAfterSignedContribution":
          assert.match(question.stem, language === "hi" ? /दर्ज .*अस्वीकृत या पुनःकार्य/ : /ਦਰਜ .*ਰੱਦ ਜਾਂ ਮੁੜ-ਕੰਮ/);
          assert.equal(/—\d+-\d+/.test(question.stem), false, `${entry.qlId}:${language}: mechanical signed record`);
          assert.match(question.explanation.conclusion, language === "hi" ? /^अतः शुद्ध योगदान के आधार पर भुगतान:/ : /^ਇਸ ਲਈ ਸ਼ੁੱਧ ਯੋਗਦਾਨ ਦੇ ਆਧਾਰ ਉੱਤੇ ਭੁਗਤਾਨ:/);
          break;
        case "findMissingTimeFromPayment":
          if (language === "pa") assert.match(question.stem, /ਉਨ੍ਹਾਂ ਦੀਆਂ ਦਰਾਂ.*ਹਨ ਅਤੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ/);
          break;
        case "findMissingEfficiencyFromPayment":
          assert.match(question.explanation.conclusion, language === "hi" ? /^अतः आवश्यक दर:/ : /^ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਦਰ:/);
          break;
      }

      checked += 1;
    }
  }
}

assert.equal(checked, 520);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-008",
  localizedManualLanguagePackages: checked,
  status: "PASS",
}, null, 2));
