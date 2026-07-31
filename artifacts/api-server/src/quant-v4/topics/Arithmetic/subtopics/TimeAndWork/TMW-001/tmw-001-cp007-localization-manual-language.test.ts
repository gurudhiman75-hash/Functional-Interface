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

      assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
      assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent heterogeneous|Don't fall for|Do not/i.test(prose), false, `${entry.qlId}:${language}: internal wording`);
      assert.equal(/\b(?:workers?|clerks?|painters?|helpers?|trainees?|machines?|printers?|automatic lines?|manual stations?|work units|components|files|copies|bottles|per day|per hour|whole job)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);
      assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${entry.qlId}:${language}: raw mixed fraction`);
      assert.equal(/\d+ दिन में|\d+ घंटे में|\d+ ਦਿਨ ਵਿੱਚ|\d+ ਘੰਟੇ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected time postposition`);
      assert.equal(/एक (?:भारी मशीनें|मानक मशीनें|छोटी मशीनें|तेज़ मशीनें|स्वचालित बोतल लाइनें|अर्ध-स्वचालित बोतल लाइनें)|ਇੱਕ (?:ਭਾਰੀ ਮਸ਼ੀਨਾਂ|ਮਿਆਰੀ ਮਸ਼ੀਨਾਂ|ਛੋਟੀਆਂ ਮਸ਼ੀਨਾਂ|ਤੇਜ਼ ਮਸ਼ੀਨਾਂ|ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ|ਅਰਧ-ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ)/.test(prose), false, `${entry.qlId}:${language}: singular category agreement`);
      assert.equal(/कार्य-इकाइयाँ (?:का|को)|प्रतियाँ (?:का|को)|बोतलें (?:का|को)|फाइलें (?:का|को)|पुर्ज़े (?:का|को)/.test(prose), false, `${entry.qlId}:${language}: Hindi output case`);
      assert.equal(/कितने अतिरिक्त (?:स्वचालित|अर्ध-स्वचालित) बोतल लाइनें|ਕਿੰਨੇ ਵਾਧੂ (?:ਆਟੋਮੈਟਿਕ|ਅਰਧ-ਆਟੋਮੈਟਿਕ) ਬੋਤਲ ਲਾਈਨਾਂ|ਕਿੰਨੀਆਂ ਵਾਧੂ [^?।]+ ਲਾਈਨਾਂ ਚਾਹੀਦੇ ਹਨ/.test(question.stem), false, `${entry.qlId}:${language}: line-question agreement`);
      assert.equal(/(?:भारी मशीनें|मानक मशीनें|छोटी मशीनें|तेज़ मशीनें|स्वचालित बोतल लाइनें|अर्ध-स्वचालित बोतल लाइनें)[^।]{0,160} एक साथ काम करते हैं|(?:ਭਾਰੀ ਮਸ਼ੀਨਾਂ|ਮਿਆਰੀ ਮਸ਼ੀਨਾਂ|ਛੋਟੀਆਂ ਮਸ਼ੀਨਾਂ|ਤੇਜ਼ ਮਸ਼ੀਨਾਂ|ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ|ਅਰਧ-ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ)[^।]{0,160} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ/.test(question.stem), false, `${entry.qlId}:${language}: machine-group agreement`);
      assert.equal(/लक्ष्य श्रेणी का संख्या/.test(prose), false, `${entry.qlId}:${language}: Hindi category possessive`);
      assert.equal(/का सड़क-मरम्मत का काम|ਦਾ ਸੜਕ ਮੁਰੰਮਤ ਦਾ ਕੰਮ/.test(question.stem), false, `${entry.qlId}:${language}: duplicated task construction`);
      assert.equal(/समतुल्य [^।\n]+ के बराबर|ਬਰਾਬਰ [^।\n]+ ਦੇ ਬਰਾਬਰ/.test(question.explanation.conclusion), false, `${entry.qlId}:${language}: redundant equivalent conclusion`);

      if (entry.answerType === "COUNT") {
        const answer = escapeRegExp(question.solution.answerText);
        assert.equal(new RegExp(`${answer} (?:है(?!ं)|ਹੈ)`).test(prose), false, `${entry.qlId}:${language}: count-answer copula`);
      }
      if (entry.solveMode === "findMixedCrewCompletionTime") {
        assert.match(question.stem, language === "hi" ? /कुल लक्ष्य:.*समूह को पूरा काम/ : /ਕੁੱਲ ਟੀਚਾ:.*ਸਮੂਹ ਨੂੰ ਪੂਰਾ ਕੰਮ/);
      }
      if (entry.solveMode === "findCrewCompositionFromTwoOutputFacts") {
        const givens = question.explanation.givens.join(" ");
        assert.match(givens, language === "hi" ? /पहली टीम.*कार्य-इकाइ|दूसरा तथ्य.*कार्य-इकाइ/ : /ਪਹਿਲੀ ਟੀਮ.*ਕੰਮ-ਇਕਾਈ|ਦੂਜਾ ਤੱਥ.*ਕੰਮ-ਇਕਾਈ/);
        assert.match(givens, language === "hi" ? /दिनों में/ : /ਦਿਨਾਂ ਵਿੱਚ/);
      }
      if (entry.solveMode === "findEquivalentStandardResourceTime") {
        assert.match(question.explanation.conclusion, language === "hi" ? /^अतः संयुक्त योगदान:/ : /^ਇਸ ਲਈ ਸਾਂਝਾ ਯੋਗਦਾਨ:/);
      }
      if (entry.answerType === "COUNT_PAIR") {
        assert.match(question.solution.answerText, language === "hi" ? / और / : / ਅਤੇ /);
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
