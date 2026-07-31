import { strict as assert } from "node:assert";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { runTmwCp006Pipeline } from "./foundation/cp006-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP006_REGISTRY) {
  const seed = `tmw-cp006-localization-editorial:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp006Pipeline({ questionLanguageId: entry.qlId, seed, language });
    const prose = [
      question.stem,
      question.explanation.opening,
      ...(question.explanation.givens ?? []),
      question.explanation.shortcut.title,
      ...question.explanation.shortcut.steps,
      question.explanation.commonTrap.optionLabel,
      question.explanation.commonTrap.explanation,
      question.explanation.conclusion,
    ].join("\n");

    assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent invariant|Do not|Don't/i.test(prose), false, `${entry.qlId}:${language}: internal wording`);
    assert.equal(/\b(?:workers?|clerks?|packers?|painters?|inspectors?|machines?|printers?|bottling lines?|assembly units?|worker-days?|machine-hours?|person-days?|resource-hours?|overtime|deadline|shift count)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);
    assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected time`);
    assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${entry.qlId}:${language}: raw mixed fraction`);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true);
    assert.ok((question.explanation.givens ?? []).length >= 2);
    assert.ok(question.explanation.shortcut.title.startsWith(language === "hi" ? "10-सेकंड" : "10-ਸਕਿੰਟ"));
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");

    switch (entry.ruleId) {
      case "TMW_EQUIVALENT_STATES":
        assert.match(question.explanation.opening, language === "hi" ? /कुल उत्पादक क्षमता बराबर/ : /ਕੁੱਲ ਉਤਪਾਦਕ ਸਮਰੱਥਾ ਬਰਾਬਰ/);
        break;
      case "TMW_CHANGE_COUNT":
        assert.match(question.explanation.opening, language === "hi" ? /कुल आवश्यक संख्या/ : /ਕੁੱਲ ਲੋੜੀਂਦੀ ਗਿਣਤੀ/);
        break;
      case "TMW_PROGRESS_RECOVERY":
        assert.match(question.explanation.opening, language === "hi" ? /वास्तविक प्रगति.*वास्तविक गति/ : /ਅਸਲ ਤਰੱਕੀ.*ਅਸਲ ਗਤੀ/);
        break;
      case "TMW_SCHEDULE_VARIANCE":
        assert.match(question.explanation.opening, language === "hi" ? /दैनिक क्षमता/ : /ਰੋਜ਼ਾਨਾ ਸਮਰੱਥਾ/);
        break;
      case "TMW_PRODUCTION_SCALING":
        assert.match(question.explanation.opening, language === "hi" ? /प्रति संसाधन प्रति पाली/ : /ਪ੍ਰਤੀ ਸਰੋਤ ਪ੍ਰਤੀ ਸ਼ਿਫ਼ਟ/);
        break;
      case "TMW_DIMENSIONAL_WORK":
        assert.match(question.explanation.opening, language === "hi" ? /लंबाई.*गुणन/ : /ਲੰਬਾਈ.*ਗੁਣਾ/);
        break;
      case "TMW_RESOURCE_STOCK":
        assert.match(question.explanation.opening, language === "hi" ? /व्यक्ति-दिन/ : /ਵਿਅਕਤੀ-ਦਿਨ/);
        break;
      case "TMW_BATCH_SERIES":
        assert.match(question.explanation.opening, language === "hi" ? /अंकगणितीय श्रेणी/ : /ਅੰਕਗਣਿਤੀ ਲੜੀ/);
        break;
      case "TMW_RESOURCE_TIME":
        assert.match(question.explanation.opening, language === "hi" ? /संसाधनों की संख्या.*कार्य-अवधि/ : /ਸਰੋਤਾਂ ਦੀ ਗਿਣਤੀ.*ਕੰਮ ਮਿਆਦ/);
        break;
    }

    if (entry.solveMode === "findAdditionalWorkersForDeadline" || entry.solveMode === "findExtraWorkersFromPlannedVsActualProgress") {
      assert.match(question.explanation.conclusion, language === "hi" ? /अतिरिक्त जोड़ने/ : /ਵਾਧੂ ਜੋੜਣੇ/);
    }
    if (entry.solveMode === "findWorkersRemovedForDelay") {
      assert.match(question.explanation.conclusion, language === "hi" ? /हटाए जा सकते/ : /ਹਟਾਏ ਜਾ ਸਕਦੇ/);
    }
    if (entry.solveMode === "findCompletionWithBatchWorkerAdditions") {
      assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /अंकगणितीय श्रेणी/ : /ਅੰਕਗਣਿਤੀ ਲੜੀ/);
      assert.equal(/\bb\b|resource-days/.test(prose), false);
    }
    if (entry.solveMode === "findEquivalentResourceTime") {
      assert.match(question.solution.answerText, language === "hi" ? /दिन|घंटे/ : /ਦਿਨ|ਘੰਟੇ/);
    }
    checked += 1;
  }
}

assert.equal(checked, 44);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-006",
  localizedEditorialRows: checked,
  status: "PASS",
}, null, 2));
