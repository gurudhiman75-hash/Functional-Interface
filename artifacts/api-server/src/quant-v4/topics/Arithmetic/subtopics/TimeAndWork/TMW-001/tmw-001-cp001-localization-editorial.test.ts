import { strict as assert } from "node:assert";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { runTmwCp001Pipeline } from "./foundation/cp001-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages:readonly TmwLocalizedLanguage[]=["hi","pa"];
let checked=0;

for(const entry of TMW_CP001_REGISTRY){
  const seed=`tmw-cp001-localization-editorial:${entry.qlId}`;
  for(const language of languages){
    const question=runTmwCp001Pipeline({questionLanguageId:entry.qlId,seed,language});
    const text=[question.stem,...question.options,question.explanation.opening,...question.explanation.steps,...question.explanation.shortcut.steps,question.explanation.commonTrap.explanation,question.explanation.conclusion].join("\n");
    assert.equal(question.validation.valid,true,`${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(/द्वारा .* पूरे किए जाते हैं|द्वारा .* पूरा किया जाता है/.test(question.stem),false,`${entry.qlId}: mechanical Hindi passive`);
    assert.equal(/ਵੱਲੋਂ .* ਪੂਰੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ|ਵੱਲੋਂ .* ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ/.test(question.stem),false,`${entry.qlId}: mechanical Punjabi passive`);
    assert.equal(/और दूसरा .* की दर|जबकि दूसरा .* की दर/.test(question.stem),false,`${entry.qlId}: Hindi comparison agreement`);
    assert.equal(/ਅਤੇ ਦੂਜਾ .* ਦੀ ਦਰ|ਜਦਕਿ ਦੂਜਾ .* ਦੀ ਦਰ/.test(question.stem),false,`${entry.qlId}: Punjabi comparison agreement`);
    assert.equal(/एक इकाई समय में प्रति/.test(question.explanation.conclusion),false,`${entry.qlId}: duplicated Hindi unit phrase`);
    assert.equal(/ਇੱਕ ਇਕਾਈ ਸਮੇਂ ਵਿੱਚ ਪ੍ਰਤੀ/.test(question.explanation.conclusion),false,`${entry.qlId}: duplicated Punjabi unit phrase`);
    assert.equal(/पुस्तिकाएँ पूरे|ਪੁਸਤਿਕਾਵਾਂ ਪੂਰੇ|पुस्तिकाएँ का उत्पादन/.test(text),false,`${entry.qlId}: output agreement error`);
    assert.equal(/सामान्यतः .* में पूरा किया जाता है|ਆਮ ਤੌਰ ਤੇ .* ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ/.test(question.stem),false,`${entry.qlId}: translated completion phrasing`);
    assert.equal(/का कार्य का|का काम का|ਦਾ ਕੰਮ ਦਾ/.test(question.stem),false,`${entry.qlId}: duplicated possessive`);
    assert.equal(/खेप पूरा|ਖੇਪ ਪੂਰਾ/.test(question.stem),false,`${entry.qlId}: batch agreement error`);

    if(entry.solveMode==="findFractionCompletedInGivenTime"&&question.explanation.commonTrap.misconceptionId==="FIRST_QUANTITY_REPORTED"){
      assert.match(question.explanation.commonTrap.explanation,language==="hi"?/एक इकाई समय/:/ਇੱਕ ਇਕਾਈ ਸਮੇਂ/);
      assert.equal(/तुलना|ਤੁਲਨਾ/.test(question.explanation.commonTrap.explanation),false);
    }
    if(entry.solveMode==="recoverWholeTimeFromPartCompletion"&&question.explanation.commonTrap.misconceptionId==="PART_MULTIPLIED_INSTEAD_OF_DIVIDED"){
      assert.match(question.explanation.commonTrap.explanation,language==="hi"?/आंशिक समय/:/ਅਧੂਰੇ ਸਮੇਂ/);
    }
    checked+=1;
  }
}

assert.equal(checked,40);
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-001",localizedEditorialRows:checked,status:"PASS"},null,2));
