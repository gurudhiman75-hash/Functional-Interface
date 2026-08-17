import { strict as assert } from "node:assert";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { runTmwCp003Pipeline } from "./foundation/cp003-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const outputModes = new Set([
  "findOutputFromEfficiencyRatioAndReferenceOutput",
  "findReferenceOutputFromEfficiencyRatioAndOtherOutput",
  "findComparativeOutputFromDifferentEfficienciesAndDurations",
]);
let checked = 0;

for (const entry of TMW_CP003_REGISTRY) {
  const seed = `tmw-cp003-localization-editorial:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp003Pipeline({ questionLanguageId: entry.qlId, seed, language });
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
    assert.equal(/\b(?:operator|technician|clerk|machine|crew|packer|inspector|typist|painter|worker|surveyor|assembler|efficiency|completion|reference output)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Do not|Don't/i.test(prose), false, `${entry.qlId}:${language}: internal or command language`);
    assert.equal(/द्वारा .* किया जाता है|ਵੱਲੋਂ .* ਕੀਤਾ ਜਾਂਦਾ ਹੈ/.test(prose), false, `${entry.qlId}:${language}: translated passive phrasing`);
    assert.equal(/(?:का काम|का ऑर्डर|की पेंटिंग) (?:को|के लिए|में)|(?:ਦਾ ਕੰਮ|ਦਾ ਆਰਡਰ) (?:ਨੂੰ|ਲਈ|ਵਿੱਚ)/.test(question.stem), false, `${entry.qlId}:${language}: duplicated case marker`);
    assert.equal(/आउटपुट/.test(prose), false, `${entry.qlId}: transliterated output wording`);
    assert.equal(/\b\d+\s+\d+\/\d+%/.test([prose, ...question.options].join("\n")), false, `${entry.qlId}: raw mixed percentage`);
    assert.equal(/\b(?!1\b)\d+ दिन में|\b(?!1\b)\d+ ਦਿਨ ਵਿੱਚ/.test(question.stem), false, `${entry.qlId}:${language}: day postposition`);
    assert.equal(/उत्पादन \d+ (?:वस्तुएँ|कमरे|पुस्तिकाएँ|इकाइयाँ) है|ਉਤਪਾਦਨ \d+ (?:ਵਸਤੂਆਂ|ਕਮਰੇ|ਪੁਸਤਿਕਾਵਾਂ|ਇਕਾਈਆਂ) ਹੈ/.test(question.stem), false, `${entry.qlId}:${language}: output quantity agreement`);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");

    if (question.solution.answerType === "RATIO") {
      assert.equal(question.options.every((option) => /^\d+:\d+$/.test(option)), true);
    }
    if (question.solution.answerType === "PERCENT") {
      assert.equal(question.options.every((option) => /^\d+%$|^\\\(.+\\%\\\)$/.test(option)), true);
    }
    if ([
      "findEfficiencyRatioFromEqualWorkTimes",
      "findTimeRatioFromEfficiencyRatio",
      "findIndividualTimeFromEfficiencyRatioAndTimeDifference",
      "findIndividualTimeFromEfficiencyRatioAndTimeSum",
    ].includes(entry.solveMode)) {
      assert.match(question.explanation.opening, language === "hi" ? /उलट/ : /ਉਲਟ/);
    }
    if ([
      "findEfficiencyPercentMoreFromCompletionTimes",
      "findEfficiencyPercentLessFromCompletionTimes",
      "findFasterTimeFromSlowerTimeAndPercentMoreEfficient",
      "findSlowerTimeFromFasterTimeAndPercentMoreEfficient",
      "findTimePercentLessFromEfficiencyPercentMore",
      "findTimePercentMoreFromEfficiencyPercentLess",
      "findEfficiencyChangePercentFromCompletionTimeChange",
    ].includes(entry.solveMode)) {
      assert.match(question.explanation.opening, language === "hi" ? /प्रतिशत|गुणक/ : /ਪ੍ਰਤੀਸ਼ਤ|ਗੁਣਕ/);
    }
    if (entry.solveMode === "findSuccessiveEfficiencyRatioAcrossThreeAgents") {
      assert.match(question.explanation.opening, language === "hi" ? /दोनों अनुपात मिलाएँ/ : /ਦੋਵੇਂ ਅਨੁਪਾਤ ਮਿਲਾਓ/);
      assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /दोनों अनुपात मिलाने/ : /ਦੋਵੇਂ ਅਨੁਪਾਤ ਮਿਲਾਉਣ/);
      assert.equal(/अनुपात जोड़ें|श्रृंखला जोड़|ਅਨੁਪਾਤ ਜੋੜੋ|ਲੜੀ ਜੋੜ/.test(prose), false);
    }
    if (entry.solveMode === "findSuccessiveEfficiencyPercentComparison") {
      assert.match(question.explanation.opening, language === "hi" ? /गुणा|सीधे जोड़ना सही नहीं/ : /ਗੁਣਾ|ਸਿੱਧਾ ਜੋੜਨਾ ਸਹੀ ਨਹੀਂ/);
    }
    if (outputModes.has(entry.solveMode)) {
      assert.match(question.stem, language === "hi" ? /के बराबर/ : /ਦੇ ਬਰਾਬਰ/);
      assert.match(question.explanation.conclusion, language === "hi" ? /के बराबर/ : /ਦੇ ਬਰਾਬਰ/);
      assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /के बराबर/ : /ਦੇ ਬਰਾਬਰ/);
    }
    if (["findTimePercentLessFromEfficiencyPercentMore", "findTimePercentMoreFromEfficiencyPercentLess"].includes(entry.solveMode)) {
      assert.match(question.explanation.conclusion, language === "hi" ? /समय लगेगा/ : /ਸਮਾਂ ਲੱਗੇਗਾ/);
    }
    checked += 1;
  }
}

assert.equal(checked, 46);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-003",
  localizedEditorialRows: checked,
  status: "PASS",
}, null, 2));
