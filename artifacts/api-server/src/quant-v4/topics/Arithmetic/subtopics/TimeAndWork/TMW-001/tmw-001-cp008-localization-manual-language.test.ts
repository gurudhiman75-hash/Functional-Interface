import { strict as assert } from "node:assert";
import { TMW_CP008_REGISTRY } from "./foundation/cp008-registry";
import { runTmwCp008LocalizedPipeline } from "./foundation/cp008-localized-runtime";
import type {
  TmwCp008MisconceptionId,
  TmwCp008SolveMode,
} from "./foundation/cp008-types";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

const openingMarkers: Record<TmwCp008SolveMode, readonly [RegExp, RegExp]> = {
  findPaymentRatioFromContributionFactors: [/दक्षता.*काम के दिन.*हर दिन काम के घंटे/, /ਦੱਖਤਾ.*ਕੰਮ ਦੇ ਦਿਨ.*ਹਰ ਦਿਨ ਕੰਮ ਦੇ ਘੰਟੇ/],
  findSelectedPartyPayment: [/चुने गए व्यक्ति या समूह.*कुल भुगतान राशि/, /ਚੁਣੇ ਵਿਅਕਤੀ ਜਾਂ ਸਮੂਹ.*ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ/],
  findTotalPaymentPoolFromKnownShare: [/कुल भुगतान राशि = ज्ञात भुगतान/, /ਕੁੱਲ ਭੁਗਤਾਨ ਰਕਮ = ਪਤਾ ਭੁਗਤਾਨ/],
  findResidualPayment: [/पहले दिए गए सभी भुगतान घटाने/, /ਪਹਿਲਾਂ ਦਿੱਤੇ ਸਾਰੇ ਭੁਗਤਾਨ ਘਟਾਉਣ/],
  findPaymentAfterStagedParticipation: [/वास्तव में जितनी अवधि काम/, /ਅਸਲ ਵਿੱਚ ਜਿੰਨੀ ਮਿਆਦ ਕੰਮ/],
  findPaymentFromCompletedFractions: [/काम का जितना भाग पूरा/, /ਕੰਮ ਦਾ ਜਿੰਨਾ ਹਿੱਸਾ ਪੂਰਾ/],
  findContributionFactorRatioFromPayments: [/बाकी ज्ञात गुणकों.*अलग करें/, /ਬਾਕੀ ਪਤਾ ਗੁਣਕਾਂ.*ਵੱਖ ਕਰੋ/],
  findMissingTimeFromPayment: [/अज्ञात काम की अवधि अकेली/, /ਅਣਜਾਣ ਕੰਮ ਦੀ ਮਿਆਦ ਇਕੱਲੀ/],
  findMissingEfficiencyFromPayment: [/अज्ञात व्यक्ति की काम-दर/, /ਅਣਜਾਣ ਵਿਅਕਤੀ ਦੀ ਕੰਮ-ਦਰ/],
  findMixedCategoryPaymentDistribution: [/सदस्यों की संख्या × एक सदस्य की काम-दर × काम की अवधि/, /ਮੈਂਬਰਾਂ ਦੀ ਗਿਣਤੀ × ਇੱਕ ਮੈਂਬਰ ਦੀ ਕੰਮ-ਦਰ × ਕੰਮ ਦੀ ਮਿਆਦ/],
  findPieceRatePaymentFromOutput: [/केवल मान्य काम की इकाइयों/, /ਕੇਵਲ ਮਨਜ਼ੂਰ ਕੰਮ ਦੀਆਂ ਇਕਾਈਆਂ/],
  findBonusShareFromExtraContribution: [/वास्तविक उत्पादन − उसका निर्धारित लक्ष्य/, /ਅਸਲ ਉਤਪਾਦਨ − ਉਸ ਦਾ ਨਿਰਧਾਰਤ ਟੀਚਾ/],
  findPaymentAfterSignedContribution: [/दर्ज उत्पादन.*अस्वीकृत या दोबारा/, /ਦਰਜ ਉਤਪਾਦਨ.*ਰੱਦ ਜਾਂ ਮੁੜ/],
};

const trapMarkers: Record<Exclude<TmwCp008MisconceptionId, "CORRECT">, readonly [RegExp, RegExp]> = {
  TIME_FACTOR_IGNORED: [/समय को शामिल नहीं/, /ਸਮਾਂ ਸ਼ਾਮਲ ਨਹੀਂ/],
  EFFICIENCY_FACTOR_IGNORED: [/दक्षता छोड़ दी/, /ਦੱਖਤਾ ਛੱਡ ਦਿੱਤੀ/],
  HOURS_FACTOR_IGNORED: [/घंटों को छोड़ दिया/, /ਘੰਟੇ ਛੱਡ ਦਿੱਤੇ/],
  EQUAL_SPLIT_ASSUMED: [/समान हिस्सा दे दिया/, /ਇੱਕੋ ਹਿੱਸਾ ਦੇ ਦਿੱਤਾ/],
  RATIO_USED_AS_MONEY: [/अनुपात के पद रुपये नहीं/, /ਅਨੁਪਾਤ ਦੇ ਪਦ ਰੁਪਏ ਨਹੀਂ/],
  TOTAL_REPORTED_AS_SHARE: [/केवल उसका हिस्सा है/, /ਕੇਵਲ ਉਸ ਦਾ ਹਿੱਸਾ ਹੈ/],
  KNOWN_PAYMENT_NOT_SUBTRACTED: [/सभी भुगतान कुल राशि में से घटाने/, /ਸਾਰੇ ਭੁਗਤਾਨ ਕੁੱਲ ਰਕਮ ਵਿੱਚੋਂ ਘਟਾਉਣ/],
  RATIO_ORDER_REVERSED: [/क्रम उलट दिया/, /ਕ੍ਰਮ ਉਲਟ ਦਿੱਤਾ/],
  CONTRIBUTION_FACTOR_NOT_ISOLATED: [/माँगा गया गुणक अकेला नहीं/, /ਮੰਗਿਆ ਗੁਣਕ ਇਕੱਲਾ ਨਹੀਂ/],
  PIECE_RATE_NOT_APPLIED: [/दर लागू नहीं की/, /ਦਰ ਲਾਗੂ ਨਹੀਂ ਕੀਤੀ/],
  BASELINE_OUTPUT_NOT_SUBTRACTED: [/निर्धारित लक्ष्य नहीं घटाया/, /ਨਿਰਧਾਰਤ ਟੀਚਾ ਨਹੀਂ ਘਟਾਇਆ/],
  DEFECTIVE_OUTPUT_NOT_DEDUCTED: [/दर्ज उत्पादन से नहीं घटाया/, /ਦਰਜ ਉਤਪਾਦਨ ਵਿੱਚੋਂ ਨਹੀਂ ਘਟਾਇਆ/],
  PLAUSIBLE_SCALE_ERROR: [/पैमाना गलत लगाया/, /ਪੈਮਾਨਾ ਗਲਤ ਲਾਇਆ/],
};

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
        ...question.explanation.steps,
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n");

      assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${index}:${question.validation.errors.join(" | ")}`);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.editorialStatus, "PENDING");
      assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent contribution|Don't fall for|Do not choose/i.test(prose), false, `${entry.qlId}:${language}:${index}: internal wording`);
      assert.equal(/\b(?:Asha|Bharat|Charan|Meera|Rohan|Simran|Kavita|Mohan|Neeraj|Priya|Raj|Sonia|warehouse|factory|payment ratio|total payment|piece rate|bonus pool|per hour|days)\b/i.test(prose), false, `${entry.qlId}:${language}:${index}: English leakage`);
      assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${entry.qlId}:${language}:${index}: raw mixed fraction`);
      assert.equal(/\d+ दिन में|\d+ घंटे में|\d+ ਦਿਨ ਵਿੱਚ|\d+ ਘੰਟੇ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}:${index}: uninflected time postposition`);
      assert.equal(/ऑटो-पुर्जा कारखाना में|वाणिज्यिक परिसर की रंगाई साइट में/.test(prose), false, `${entry.qlId}:${language}:${index}: Hindi setting locative`);
      assert.equal(/फाइलें (?:को|का)|पुर्ज़े (?:को|का)/.test(prose), false, `${entry.qlId}:${language}:${index}: Hindi output case`);
      assert.equal(/स्वीकृत (?:फाइलें|पुर्ज़े|पैकेट|वर्ग मीटर) पूरे किए|ਮਨਜ਼ੂਰ(?:ਸ਼ੁਦਾ)? (?:ਫਾਈਲਾਂ|ਪੁਰਜ਼ੇ|ਪੈਕੇਟ|ਵਰਗ ਮੀਟਰ) ਪੂਰੇ ਕੀਤੇ/.test(prose), false, `${entry.qlId}:${language}:${index}: output agreement`);
      assert.equal(/आवश्यक प्रति घंटा दर .* प्रति घंटा|ਲੋੜੀਂਦੀ ਪ੍ਰਤੀ ਘੰਟਾ ਦਰ .* ਪ੍ਰਤੀ ਘੰਟਾ/.test(question.explanation.conclusion), false, `${entry.qlId}:${language}:${index}: duplicated hourly conclusion`);
      assert.equal(/भुगतान अनुपात: ₹|ਭੁਗਤਾਨ ਅਨੁਪਾਤ: ₹/.test(question.explanation.givens.join(" ")), false, `${entry.qlId}:${language}:${index}: currency inside ratio`);
      assert.equal(/योगदान गुणनफल|योगदान-भार|सक्रिय समय|भुगतान पूल|चुना प्राप्तकर्ता|लक्ष्य हिस्सा|ਯੋਗਦਾਨ ਗੁਣਨਫਲ|ਯੋਗਦਾਨ-ਭਾਰ|ਸਰਗਰਮ ਸਮਾਂ|ਭੁਗਤਾਨ ਪੂਲ|ਚੁਣਿਆ ਪ੍ਰਾਪਤਕਰਤਾ|ਟੀਚਾ ਹਿੱਸਾ/.test(prose), false, `${entry.qlId}:${language}:${index}: mechanical wording`);
      assert.equal(/अस्वीकृत\/पुनःकार्य|ਰੱਦ\/ਮੁੜ-ਕੰਮ/.test(prose), false, `${entry.qlId}:${language}:${index}: slash wording`);
      assert.equal(/[£$€]/.test(prose), false, `${entry.qlId}:${language}:${index}: inconsistent currency`);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.solution.answerText);
      assert.equal(question.optionAudit[question.correctIndex]?.key, question.solution.answerKey);
      assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
      assert.ok(question.explanation.conclusion.includes(question.solution.answerText), `${entry.qlId}:${language}:${index}: conclusion answer`);

      const openingMarker = openingMarkers[entry.solveMode][language === "hi" ? 0 : 1];
      assert.match(question.explanation.opening, openingMarker, `${entry.qlId}:${language}:${index}: solve-mode opening`);
      const trapId = question.explanation.commonTrap.misconceptionId;
      const trapMarker = trapMarkers[trapId][language === "hi" ? 0 : 1];
      assert.match(question.explanation.commonTrap.explanation, trapMarker, `${entry.qlId}:${language}:${index}: misconception trap`);

      if (["MONEY", "MONEY_TRIPLE"].includes(entry.answerType)) {
        assert.ok(question.options.every((option) => option.split(", ").every((part) => part.startsWith("₹"))), `${entry.qlId}:${language}:${index}: rupee options`);
      }
      if (entry.answerType === "MONEY_TRIPLE") {
        assert.equal(question.solution.answerText.split(", ").length, 3);
        assert.ok(question.options.every((option) => option.split(", ").length === 3));
        assert.match(question.explanation.conclusion, language === "hi" ? /^अतः बताए गए क्रम में भुगतान:/ : /^ਇਸ ਲਈ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਭੁਗਤਾਨ:/);
      }
      if (entry.solveMode === "findPieceRatePaymentFromOutput") {
        assert.match(question.stem, /पीस-रेट|ਪੀਸ-ਰੇਟ/);
      }
      if (entry.solveMode === "findPaymentAfterSignedContribution") {
        assert.equal(/—\d+-\d+/.test(question.stem), false, `${entry.qlId}:${language}:${index}: mechanical signed record`);
      }

      checked += 1;
    }
  }
}

assert.equal(checked, 520);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-008",
  qlRange: "TMW-QL-144..TMW-QL-156",
  localizedManualLanguagePackages: checked,
  hindiPackages: checked / 2,
  punjabiPackages: checked / 2,
  status: "PASS",
}, null, 2));
