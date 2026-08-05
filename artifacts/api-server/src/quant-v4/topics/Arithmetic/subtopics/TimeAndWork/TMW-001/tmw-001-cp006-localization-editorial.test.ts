import { strict as assert } from "node:assert";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { runTmwCp006Pipeline } from "./foundation/cp006-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP006_REGISTRY) {
  const seed = `tmw-cp006-localization-editorial:${entry.qlId}`;
  for (const language of languages) {
    const row = `${entry.qlId}:${language}`;
    const question = runTmwCp006Pipeline({ questionLanguageId: entry.qlId, seed, language });
    const fields: readonly [string, string][] = [
      ["stem", question.stem],
      ["opening", question.explanation.opening],
      ...(question.explanation.givens ?? []).map((text, index) => [`given-${index + 1}`, text] as [string, string]),
      ["shortcut-title", question.explanation.shortcut.title],
      ...question.explanation.shortcut.steps.map((text, index) => [`shortcut-step-${index + 1}`, text] as [string, string]),
      ["trap-label", question.explanation.commonTrap.optionLabel],
      ["trap-explanation", question.explanation.commonTrap.explanation],
      ["conclusion", question.explanation.conclusion],
    ];
    const prose = fields.map(([, text]) => text).join("\n");

    assert.equal(question.validation.valid, true, `${row}:${question.validation.errors.join(" | ")}`);
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent invariant|Do not|Don't/i.test(prose), false, `${row}: internal wording`);
    assert.equal(/\b(?:workers?|clerks?|packers?|painters?|inspectors?|machines?|printers?|bottling lines?|assembly units?|worker-days?|machine-hours?|person-days?|resource-hours?|overtime|deadline|shift count)\b/i.test(prose), false, `${row}: English leakage`);
    assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(prose), false, `${row}: uninflected time`);
    assert.equal(/\b\d+\s+\d+\/\d+\b/.test([prose, ...question.options].join("\n")), false, `${row}: raw mixed fraction`);
    assert.equal(/ठेका को|निर्माण को|कार्य को|ऑर्डर का का|ਠੇਕਾ ਨੂੰ|ਨਿਰਮਾਣ ਨੂੰ|ਕੰਮ ਨੂੰ/.test(question.stem), false, `${row}: task case duplication`);
    assert.equal(/\d+ (?:श्रमिक|क्लर्क|पैकिंग कर्मी|पेंटर|निरीक्षक) (?:को|ने)|\d+ (?:ਮਜ਼ਦੂਰ|ਕਲਰਕ|ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ|ਪੇਂਟਰ|ਜਾਂਚ ਕਰਮਚਾਰੀ) (?:ਨੂੰ|ਨੇ)/.test(question.stem), false, `${row}: plural resource inflection`);
    assert.equal(/मीटर/.test(language === "pa" ? prose : ""), false, `${row}: Hindi metre leakage`);
    assert.equal(/कितने (?:बोतलें|प्रतियाँ|इकाइयाँ)|ਕਿੰਨੇ (?:ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਇਕਾਈਆਂ|ਅਰਜ਼ੀਆਂ)/.test(question.stem), false, `${row}: feminine interrogative agreement`);
    assert.equal(/ਉਤਨਾ ਹੀ ਕੰਮ/.test(prose), false, `${row}: unnatural Punjabi same-work phrase`);
    assert.equal(/कुल उत्पादक क्षमता|ਬਦਲੀ ਵਿਵਸਥਾ|ਮੂਲ ਵਿਵਸਥਾ|बदली व्यवस्था|मूल व्यवस्था/.test(prose), false, `${row}: formal system wording`);
    const agreementPattern = /(?:पालियाँ|बोतलें|प्रतियाँ|इकाइयाँ) है(?!ं)|(?:ਸ਼ਿਫ਼ਟਾਂ|ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਇਕਾਈਆਂ) ਹੈ/;
    const agreementDefect = fields.find(([, text]) => agreementPattern.test(text));
    assert.equal(agreementDefect, undefined, `${row}: plural agreement in ${agreementDefect?.[0] ?? "unknown"}`);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true, `${row}: trap option`);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true, `${row}: trap label`);
    assert.ok((question.explanation.givens ?? []).length >= 2, `${row}: givens`);
    assert.ok(question.explanation.shortcut.title.startsWith(language === "hi" ? "10-सेकंड" : "10-ਸਕਿੰਟ"), `${row}: shortcut title`);
    assert.equal(question.explanation.conclusion.includes(question.solution.answerText), true, `${row}: answer conclusion`);
    assert.equal(question.publiclyPublishable, false, `${row}: publication lock`);
    assert.equal(question.editorialStatus, "PENDING", `${row}: editorial status`);

    if (entry.solveMode === "findAdditionalWorkersForDeadline" || entry.solveMode === "findExtraWorkersFromPlannedVsActualProgress") {
      assert.match(question.explanation.opening, language === "hi" ? /कुल संख्या.*मौजूदा संख्या घटाएँ/ : /ਕੁੱਲ ਗਿਣਤੀ.*ਮੌਜੂਦਾ ਗਿਣਤੀ ਘਟਾਓ/, row);
      assert.match(question.explanation.conclusion, language === "hi" ? /अतिरिक्त चाहिए/ : /ਵਾਧੂ ਚਾਹੀਦੇ/, row);
    }
    if (entry.solveMode === "findWorkersRemovedForDelay") {
      assert.match(question.explanation.conclusion, language === "hi" ? /हटाए जा सकते/ : /ਹਟਾਏ ਜਾ ਸਕਦੇ/, row);
    }
    if (entry.solveMode === "findRemainingDaysFromActualProgress") {
      assert.match(
        question.explanation.opening,
        language === "hi"
          ? /(?:1 − पूरा हुआ भाग|1 में से पूरा हुआ भाग घटाएँ)/
          : /(?:1 − ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ|1 ਵਿੱਚੋਂ ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ ਘਟਾਓ)/,
        row,
      );
    }
    if (entry.solveMode === "findCompletionWithBatchWorkerAdditions") {
      assert.match(question.explanation.opening, language === "hi" ? /दिनवार संख्याओं का योग/ : /ਦਿਨਵਾਰ ਗਿਣਤੀਆਂ ਦਾ ਜੋੜ/, row);
      assert.equal(/\bb\b|resource-days/.test(prose), false, `${row}: internal series notation`);
    }
    if (entry.solveMode === "findDimensionalWorkRatio") {
      assert.equal(/N_1=1|D_1=1|H_1=1|E_1=1/.test((question.explanation.givens ?? []).join(" ")), false, `${row}: synthetic givens`);
      assert.match(question.explanation.conclusion, language === "hi" ? /काम का अनुपात/ : /ਕੰਮ ਦਾ ਅਨੁਪਾਤ/, row);
    }
    if (entry.solveMode === "findOvertimeHoursForDeadline") {
      assert.match(
        question.explanation.opening,
        language === "hi"
          ? /कुल आवश्यक घंटे.*सामान्य घंटों का अंतर/
          : /(?:ਕੁੱਲ ਲੋੜੀਂਦੇ ਘੰਟੇ|ਲੋੜੀਂਦੇ ਕੁੱਲ ਘੰਟਿਆਂ).*ਆਮ ਘੰਟਿਆਂ ਦਾ ਅੰਤਰ/,
        row,
      );
    }
    if (entry.solveMode === "findEquivalentResourceTime") {
      assert.match(question.solution.answerText, language === "hi" ? /दिन|घंटे/ : /ਦਿਨ|ਘੰਟੇ/, row);
      assert.equal(/N_2=1|D_2=1|H_2=1|E_2=1/.test((question.explanation.givens ?? []).join(" ")), false, `${row}: synthetic target givens`);
      assert.match(question.explanation.opening, language === "hi" ? /सभी वास्तविक गुणकों/ : /ਸਾਰੇ ਅਸਲ ਗੁਣਕਾਂ/, row);
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
