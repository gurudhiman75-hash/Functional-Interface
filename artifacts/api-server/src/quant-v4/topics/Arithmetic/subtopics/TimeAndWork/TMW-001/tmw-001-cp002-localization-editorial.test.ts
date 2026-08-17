import { strict as assert } from "node:assert";
import { TMW_CP002_REGISTRY } from "./foundation/cp002-registry";
import { runTmwCp002Pipeline } from "./foundation/cp002-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP002_REGISTRY) {
  const seed = `tmw-cp002-localization-editorial:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp002Pipeline({ questionLanguageId: entry.qlId, seed, language });
    const prose = [
      question.stem,
      question.explanation.opening,
      question.explanation.shortcut.title,
      ...question.explanation.shortcut.steps,
      question.explanation.commonTrap.optionLabel,
      question.explanation.commonTrap.explanation,
      question.explanation.conclusion,
    ].join("\n");
    assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(/\b(?:operator|technician|machine|crew|clerk|assignment|rework process|combined rate|target agent)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Do not|Don't/i.test(prose), false, `${entry.qlId}:${language}: internal or command language`);
    assert.equal(/द्वारा .* किया जाता है|ਵੱਲੋਂ .* ਕੀਤਾ ਜਾਂਦਾ ਹੈ/.test(prose), false, `${entry.qlId}:${language}: translated passive phrasing`);
    assert.equal(/(?:का काम|का ऑर्डर) (?:को|के लिए|की|में)|(?:ਦਾ ਕੰਮ|ਦਾ ਆਰਡਰ) (?:ਨੂੰ|ਲਈ|ਦੀ|ਵਿੱਚ)/.test(question.stem), false, `${entry.qlId}:${language}: duplicated case marker`);
    assert.equal(/रिवर्क|रीवर्क|ਰੀਵਰਕ|परिमाण-अंतर|निष्फल|ਬੇਅਸਰ/.test(prose), false, `${entry.qlId}:${language}: technical learner wording`);
    assert.equal(/दोबारा काम प्रक्रिया|ਮੁੜ ਕੰਮ ਪ੍ਰਕਿਰਿਆ/.test(prose), false, `${entry.qlId}:${language}: mechanical process phrase`);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");

    if (entry.solveMode === "findCombinedWorkInGivenTime") {
      assert.equal(question.options.every((option) => language === "hi" ? /^काम का .+ भाग$/.test(option) : /^ਕੰਮ ਦਾ .+ ਹਿੱਸਾ$/.test(option)), true);
      assert.ok(question.explanation.shortcut.steps.some((line) => line.includes(question.solution.answerText)));
    }
    if (["findAllTogetherTimeFromPairwiseTimes", "findIndividualTimeFromPairwiseTimes"].includes(entry.solveMode)) {
      assert.match(question.explanation.opening, language === "hi" ? /जोड़ी-दर|दो बार/ : /ਜੋੜੀ-ਦਰ|ਦੋ ਵਾਰ/);
      assert.equal(/का काम में|का ऑर्डर में|ਦਾ ਕੰਮ ਵਿੱਚ|ਦਾ ਆਰਡਰ ਵਿੱਚ/.test(question.stem), false);
    }
    if (["findNetTimeWithDestructiveAgent", "findDestructiveTimeFromPositiveAndNetTimes", "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes", "findMissingRateFromSignedNetRate"].includes(entry.solveMode)) {
      assert.match(prose, language === "hi" ? /दोबारा काम|वापस भेज/ : /ਮੁੜ ਕੰਮ|ਵਾਪਸ ਭੇਜ/);
      assert.match(question.explanation.opening, language === "hi" ? /घट|−/ : /ਘਟ|−/);
    }
    if (["findIdenticalAgentCountFromSingleAndCombinedTime", "findCombinedTimeFromIdenticalAgentCount"].includes(entry.solveMode)) {
      assert.match(question.explanation.opening, language === "hi" ? /समान क्षमता/ : /ਇਕੋ ਸਮਰੱਥਾ/);
      assert.match(question.stem, language === "hi" ? /यदि एक .* अकेल(?:ा|ी|े) काम करे/ : /ਜੇ ਇੱਕ .* ਇਕੱਲ(?:ਾ|ੀ) ਕੰਮ ਕਰੇ/);
      assert.equal(/ਇੱਕ ਟੀਮ ਇਕੱਲਾ|ਇੱਕ ਮਸ਼ੀਨ ਇਕੱਲਾ|ਕਈ (?:ਟੀਮਾਂ|ਮਸ਼ੀਨਾਂ).+ਪੂਰਾ ਕਰਦੇ ਹਨ/.test(question.stem), false);
      assert.equal(/एक मशीन अकेले|कई मशीनें.+पूरा करते हैं/.test(question.stem), false);
    }
    if (entry.solveMode === "findMissingRateFromSignedNetRate" && language === "pa" && question.stem.includes("ਅਰਜ਼ੀਆਂ")) {
      assert.equal(/ਅਰਜ਼ੀਆਂ.+ਪੂਰੇ ਕਰਦੀ ਹੈ/.test(question.stem), false);
      assert.match(question.stem, /ਅਰਜ਼ੀਆਂ ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ/);
    }
    if (entry.solveMode === "findCompletionTimeDifferenceBetweenTeams") {
      assert.match(question.explanation.conclusion, language === "hi" ? /अंतर/ : /ਅੰਤਰ/);
      assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /अंतर|दरें/ : /ਅੰਤਰ|ਦਰਾਂ/);
    }
    checked += 1;
  }
}

assert.equal(checked, 28);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-002",
  localizedEditorialRows: checked,
  status: "PASS",
}, null, 2));
