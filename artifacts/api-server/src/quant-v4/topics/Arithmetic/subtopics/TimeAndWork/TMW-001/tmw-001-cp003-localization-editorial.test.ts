import { strict as assert } from "node:assert";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { runTmwCp003Pipeline } from "./foundation/cp003-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
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
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");

    if (question.solution.answerType === "RATIO") {
      assert.equal(question.options.every((option) => /^\d+:\d+$/.test(option)), true);
    }
    if (question.solution.answerType === "PERCENT") {
      assert.equal(question.options.every((option) => option.endsWith("%")), true);
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
    if (["findSuccessiveEfficiencyRatioAcrossThreeAgents", "findSuccessiveEfficiencyPercentComparison"].includes(entry.solveMode)) {
      assert.match(question.explanation.opening, language === "hi" ? /गुणा|सीधे नहीं जुड़ते/ : /ਗੁਣਾ|ਸਿੱਧੇ ਨਹੀਂ ਜੋੜੇ/);
    }
    if (["findOutputFromEfficiencyRatioAndReferenceOutput", "findReferenceOutputFromEfficiencyRatioAndOtherOutput", "findComparativeOutputFromDifferentEfficienciesAndDurations"].includes(entry.solveMode)) {
      assert.equal(question.solution.answerText.includes(question.parameters && typeof question.parameters === "object" ? "undefined" : "__never__"), false);
      assert.match(question.explanation.conclusion, language === "hi" ? /उत्पादन/ : /ਉਤਪਾਦਨ/);
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
