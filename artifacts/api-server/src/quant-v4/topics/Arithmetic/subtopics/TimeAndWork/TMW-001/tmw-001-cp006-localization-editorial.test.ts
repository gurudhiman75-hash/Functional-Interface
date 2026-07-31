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

    assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent invariant|Do not|Don't/i.test(prose), false, `${entry.qlId}:${language}: internal wording`);
    assert.equal(/\b(?:workers?|clerks?|packers?|painters?|inspectors?|machines?|printers?|bottling lines?|assembly units?|worker-days?|machine-hours?|person-days?|resource-hours?|overtime|deadline|shift count)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);
    assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected time`);
    assert.equal(/\b\d+\s+\d+\/\d+\b/.test([prose, ...question.options].join("\n")), false, `${entry.qlId}:${language}: raw mixed fraction`);
    assert.equal(/ठेका को|निर्माण को|कार्य को|ऑर्डर का का|ਠੇਕਾ ਨੂੰ|ਨਿਰਮਾਣ ਨੂੰ|ਕੰਮ ਨੂੰ/.test(question.stem), false, `${entry.qlId}:${language}: task case duplication`);
    assert.equal(/\d+ (?:श्रमिक|क्लर्क|पैकिंग कर्मी|पेंटर|निरीक्षक) (?:को|ने)|\d+ (?:ਮਜ਼ਦੂਰ|ਕਲਰਕ|ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ|ਪੇਂਟਰ|ਜਾਂਚ ਕਰਮਚਾਰੀ) (?:ਨੂੰ|ਨੇ)/.test(question.stem), false, `${entry.qlId}:${language}: plural resource inflection`);
    assert.equal(/मीटर/.test(language === "pa" ? prose : ""), false, `${entry.qlId}:${language}: Hindi metre leakage`);
    assert.equal(/कितने (?:बोतलें|प्रतियाँ|इकाइयाँ)|ਕਿੰਨੇ (?:ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਇਕਾਈਆਂ|ਅਰਜ਼ੀਆਂ)/.test(question.stem), false, `${entry.qlId}:${language}: feminine interrogative agreement`);
    assert.equal(/ਉਤਨਾ ਹੀ ਕੰਮ/.test(prose), false, `${entry.qlId}:${language}: unnatural Punjabi same-work phrase`);
    const agreementPattern = /(?:पालियाँ|बोतलें|प्रतियाँ|इकाइयाँ) है|(?:ਸ਼ਿਫ਼ਟਾਂ|ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਇਕਾਈਆਂ) ਹੈ/;
    const agreementDefect = fields.find(([, text]) => agreementPattern.test(text));
    assert.equal(
      agreementDefect,
      undefined,
      `${entry.qlId}:${language}: plural agreement in ${agreementDefect?.[0] ?? "unknown"}: ${agreementDefect?.[1] ?? ""}`,
    );
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true);
    assert.ok((question.explanation.givens ?? []).length >= 2);
    assert.ok(question.explanation.shortcut.title.startsWith(language === "hi" ? "10-सेकंड" : "10-ਸਕਿੰਟ"));
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");

    if (entry.solveMode === "findOriginalWorkforceFromChangedSchedule") {
      assert.match(question.explanation.opening, language === "hi" ? /बदली कर्मचारी संख्या.*मूल कर्मचारी संख्या/ : /ਬਦਲੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ.*ਮੂਲ ਕਰਮਚਾਰੀ ਗਿਣਤੀ/);
    } else if (entry.solveMode === "findPercentWorkCompletedFromResourceHours") {
      assert.match(question.explanation.opening, language === "hi" ? /संसाधन-घंटे.*100/ : /ਸਰੋਤ-ਘੰਟੇ.*100/);
    } else {
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
    if (entry.solveMode === "findDimensionalWorkRatio") {
      assert.equal(/N_1=1|D_1=1|H_1=1|E_1=1/.test((question.explanation.givens ?? []).join(" ")), false);
      assert.match((question.explanation.givens ?? []).join(" "), language === "hi" ? /मूल आयाम.*बदले आयाम/ : /ਮੂਲ ਮਾਪ.*ਬਦਲੇ ਮਾਪ/);
    }
    if (entry.solveMode === "findOvertimeHoursForDeadline") {
      assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /कुल आवश्यक दैनिक घंटे.*अतिरिक्त घंटे/ : /ਕੁੱਲ ਲੋੜੀਂਦੇ ਰੋਜ਼ਾਨਾ ਘੰਟੇ.*ਵਾਧੂ ਘੰਟੇ/);
    }
    if (entry.solveMode === "findEquivalentResourceTime") {
      assert.match(question.solution.answerText, language === "hi" ? /दिन|घंटे/ : /ਦਿਨ|ਘੰਟੇ/);
      assert.equal(/N_2=1|D_2=1|H_2=1|E_2=1/.test((question.explanation.givens ?? []).join(" ")), false);
      assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /एक गुणक छोड़/ : /ਇੱਕ ਗੁਣਕ ਛੱਡ/);
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
