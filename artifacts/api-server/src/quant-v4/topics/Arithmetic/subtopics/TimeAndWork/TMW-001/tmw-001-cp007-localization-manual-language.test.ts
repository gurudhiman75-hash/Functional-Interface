import { strict as assert } from "node:assert";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { runTmwCp007LocalizedPipeline } from "./foundation/cp007-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const entry of TMW_CP007_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp007-localization:${entry.qlId}:${index}`;
    for (const language of languages) {
      const row = `${entry.qlId}:${language}:${index}`;
      const question = runTmwCp007LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
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

      assert.equal(question.validation.valid, true, `${row}:${question.validation.errors.join(" | ")}`);
      assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent heterogeneous|Don't fall for|Do not/i.test(prose), false, `${row}: internal wording`);
      assert.equal(/\b(?:workers?|clerks?|painters?|helpers?|trainees?|machines?|printers?|automatic lines?|manual stations?|work units|components|files|copies|bottles|per day|per hour|whole job)\b/i.test(prose), false, `${row}: English leakage`);
      assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${row}: raw mixed fraction`);
      assert.equal(/\d+ दिन में|\d+ घंटे में|\d+ ਦਿਨ ਵਿੱਚ|\d+ ਘੰਟੇ ਵਿੱਚ/.test(prose), false, `${row}: uninflected time postposition`);
      assert.equal(/एक (?:भारी मशीनें|मानक मशीनें|छोटी मशीनें|तेज़ मशीनें|स्वचालित बोतल लाइनें|अर्ध-स्वचालित बोतल लाइनें)|ਇੱਕ (?:ਭਾਰੀ ਮਸ਼ੀਨਾਂ|ਮਿਆਰੀ ਮਸ਼ੀਨਾਂ|ਛੋਟੀਆਂ ਮਸ਼ੀਨਾਂ|ਤੇਜ਼ ਮਸ਼ੀਨਾਂ|ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ|ਅਰਧ-ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ)/.test(prose), false, `${row}: singular category agreement`);
      assert.equal(/कार्य-इकाइयाँ (?:का|को)|प्रतियाँ (?:का|को)|बोतलें (?:का|को)|फाइलें (?:का|को)|पुर्ज़े (?:का|को)/.test(prose), false, `${row}: Hindi output case`);
      assert.equal(/कितने अतिरिक्त (?:स्वचालित|अर्ध-स्वचालित) बोतल लाइनें|ਕਿੰਨੇ ਵਾਧੂ (?:ਆਟੋਮੈਟਿਕ|ਅਰਧ-ਆਟੋਮੈਟਿਕ) ਬੋਤਲ ਲਾਈਨਾਂ|ਕਿੰਨੀਆਂ ਵਾਧੂ [^?।]+ ਲਾਈਨਾਂ ਚਾਹੀਦੇ ਹਨ/.test(question.stem), false, `${row}: line-question agreement`);
      assert.equal(/(?:भारी मशीनें|मानक मशीनें|छोटी मशीनें|तेज़ मशीनें|स्वचालित बोतल लाइनें|अर्ध-स्वचालित बोतल लाइनें)[^।]{0,160} एक साथ काम करते हैं|(?:ਭਾਰੀ ਮਸ਼ੀਨਾਂ|ਮਿਆਰੀ ਮਸ਼ੀਨਾਂ|ਛੋਟੀਆਂ ਮਸ਼ੀਨਾਂ|ਤੇਜ਼ ਮਸ਼ੀਨਾਂ|ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ|ਅਰਧ-ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ)[^।]{0,160} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ/.test(question.stem), false, `${row}: machine-group agreement`);
      assert.equal(/लक्ष्य श्रेणी का संख्या/.test(prose), false, `${row}: Hindi category possessive`);
      assert.equal(/का सड़क-मरम्मत का काम|ਦਾ ਸੜਕ ਮੁਰੰਮਤ ਦਾ ਕੰਮ/.test(question.stem), false, `${row}: duplicated task construction`);
      assert.equal(/समतुल्य [^।\n]+ के बराबर|ਬਰਾਬਰ [^।\n]+ ਦੇ ਬਰਾਬਰ/.test(question.explanation.conclusion), false, `${row}: redundant equivalent conclusion`);
      assert.equal(/के मिश्रित समूह|ਦੇ ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ|का मूल समूह|ਦਾ ਮੂਲ ਸਮੂਹ/.test(question.stem), false, `${row}: possessive group construction`);
      assert.equal(/केवल [^।?]+ (?:प्रिंटर|मशीन|लाइन|स्टेशन) से बदलना|ਸਿਰਫ਼ [^।?]+ (?:ਪ੍ਰਿੰਟਰ|ਮਸ਼ੀਨ|ਲਾਈਨ|ਸਟੇਸ਼ਨ) ਨਾਲ ਬਦਲਣਾ/.test(question.stem), false, `${row}: singular replacement wording`);
      assert.equal(/प्रति-संसाधन|सक्रिय श्रेणी|केवल सिरों की संख्या|अभिलेख|भारित दर|ਪ੍ਰਤੀ-ਸਰੋਤ|ਸਰਗਰਮ ਸ਼੍ਰੇਣੀ|ਅਭਿਲੇਖ|ਭਾਰਿਤ ਦਰ/.test(prose), false, `${row}: technical editorial wording`);
      assert.equal(/दो अनुपात जोड़ें|ਦੋ ਅਨੁਪਾਤ ਜੋੜੋ/.test(prose), false, `${row}: ratios described as addition`);

      if (entry.answerType === "COUNT") {
        const answer = escapeRegExp(question.solution.answerText);
        assert.equal(new RegExp(`${answer} (?:है(?!ं)|ਹੈ)`).test(prose), false, `${row}: count-answer copula`);
      }
      if (entry.solveMode === "findMixedCrewCompletionTime") {
        assert.match(question.stem, language === "hi" ? /^मिश्रित समूह में.*कुल लक्ष्य:.*समूह को पूरा काम/ : /^ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਵਿੱਚ.*ਕੁੱਲ ਟੀਚਾ:.*ਸਮੂਹ ਨੂੰ ਪੂਰਾ ਕੰਮ/, row);
        assert.match(question.explanation.opening, language === "hi" ? /सभी योगदान.*कुल काम/ : /ਸਾਰੇ ਯੋਗਦਾਨ.*ਕੁੱਲ ਕੰਮ/, row);
      }
      if (entry.solveMode === "findEquivalentCategoryCount") {
        assert.match(question.stem, language === "hi" ? /के बराबर क्षमता केवल.*से प्राप्त करनी है/ : /ਦੇ ਬਰਾਬਰ ਸਮਰੱਥਾ ਸਿਰਫ਼.*ਨਾਲ ਪ੍ਰਾਪਤ ਕਰਨੀ ਹੈ/, row);
      }
      if (entry.solveMode === "findCrewCompositionFromTwoOutputFacts") {
        const givens = question.explanation.givens.join(" ");
        assert.match(givens, language === "hi" ? /पहला तथ्य: पहली टीम.*को.*(?:दिनों|घंटों) में पूरा करती है/ : /ਪਹਿਲਾ ਤੱਥ: ਪਹਿਲੀ ਟੀਮ.*ਨੂੰ.*(?:ਦਿਨਾਂ|ਘੰਟਿਆਂ) ਵਿੱਚ ਪੂਰਾ ਕਰਦੀ ਹੈ/, row);
        assert.match(givens, language === "hi" ? /दूसरा तथ्य: पहली श्रेणी की संख्या दोगुनी.*को.*(?:दिनों|घंटों) में पूरा करती है/ : /ਦੂਜਾ ਤੱਥ: ਪਹਿਲੀ ਸ਼੍ਰੇਣੀ ਦੀ ਗਿਣਤੀ ਦੁੱਗਣੀ.*ਨੂੰ.*(?:ਦਿਨਾਂ|ਘੰਟਿਆਂ) ਵਿੱਚ ਪੂਰਾ ਕਰਦੀ ਹੈ/, row);
      }
      if (entry.solveMode === "findCompletionAfterCategoryReplacement") {
        assert.match(question.stem, language === "hi" ? /^मूल समूह में.*अब समूह बदलकर/ : /^ਮੂਲ ਸਮੂਹ ਵਿੱਚ.*ਹੁਣ ਸਮੂਹ ਬਦਲ ਕੇ/, row);
        assert.match(question.explanation.opening, language === "hi" ? /पुरानी दर ÷ नई दर/ : /ਪੁਰਾਣੀ ਦਰ ÷ ਨਵੀਂ ਦਰ/, row);
      }
      if (entry.solveMode === "findUnknownCategoryCountForTargetTime") {
        assert.match(question.explanation.conclusion, language === "hi" ? /अतिरिक्त चाहिए/ : /ਵਾਧੂ ਚਾਹੀਦੇ/, row);
      }
      if (entry.solveMode === "findEquivalentStandardResourceTime") {
        assert.match(question.explanation.conclusion, language === "hi" ? /^अतः मिश्रित समूह का कुल समतुल्य योगदान/ : /^ਇਸ ਲਈ ਮਿਲੇ-ਜੁਲੇ ਸਮੂਹ ਦਾ ਕੁੱਲ ਬਰਾਬਰ ਯੋਗਦਾਨ/, row);
      }
      if (entry.solveMode === "findUnknownCategorySoloTime") {
        const givens = question.explanation.givens.join(" ");
        assert.equal(/e_B\s*=/.test(givens), false, `${row}: unknown rate leaked as a given`);
        assert.equal(givens.includes(question.solution.answerText), false, `${row}: answer leaked in givens`);
        assert.match(question.explanation.conclusion, language === "hi" ? /अकेले काम/ : /ਇਕੱਲਾ ਕੰਮ/, row);
      }
      if (entry.solveMode === "compareTwoHeterogeneousCrews" && question.explanation.commonTrap.misconceptionId === "PAIR_ORDER_REVERSED") {
        assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /समूह A.*समूह B.*क्रम/ : /ਸਮੂਹ A.*ਸਮੂਹ B.*ਕ੍ਰਮ/, row);
      }
      if (entry.answerType === "COUNT_PAIR") {
        assert.match(question.solution.answerText, language === "hi" ? / और / : / ਅਤੇ /, row);
      }

      checked += 1;
    }
  }
}

assert.equal(checked, 640);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-007",
  localizedManualLanguagePackages: checked,
  status: "PASS",
}, null, 2));
