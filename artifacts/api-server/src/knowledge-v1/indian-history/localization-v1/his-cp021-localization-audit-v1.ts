import { HIS_CP021_REVIEW_BATCH_V1 } from "../medieval-cultural-synthesis/his-cp021-review-v1";
import { HIS_CP021_HI_V1 } from "./his-cp021-hi-v1";
import { HIS_CP021_PA_V1 } from "./his-cp021-pa-v1";
import { generateHisCp021LocalizedReviewV1 } from "./his-cp021-localization-v1";
import type { HisLocaleV1, HisLocalizedQuestionV1 } from "./his-localization-types-v1";

const locales:HisLocaleV1[]=["en","hi","pa"];
const fail=(condition:boolean,message:string)=>{if(!condition)throw new Error(message);};

function learnerText(question:{stem:string;options:readonly string[];explanation:string}):string{
  return [question.stem,...question.options,question.explanation].join("\n");
}
function sentenceCount(text:string):number{
  return (text.match(/[.!?।॥](?:\s|$)/g)??[]).length;
}
function assertNative(question:HisLocalizedQuestionV1,locale:"hi"|"pa"){
  const text=learnerText(question);
  const scriptText=text.replace(/[।॥]/g,"");
  const latin=text.match(/[A-Za-z]{2,}/u)?.[0];
  fail(!latin,`${question.questionId}: unauthorized Latin-script leakage: ${latin??"unknown"}`);
  fail(sentenceCount(question.explanation)>=2,`${question.questionId}: localized explanation needs at least two sentences`);
  fail(question.stem.length<=380,`${question.questionId}: localized stem too long: ${question.stem.length}`);
  fail(question.explanation.length>=90,`${question.questionId}: localized explanation too short: ${question.explanation.length}`);
  fail(question.explanation.length<=500,`${question.questionId}: localized explanation too long: ${question.explanation.length}`);
  if(locale==="hi"){
    fail(/[\u0900-\u097F]/u.test(scriptText),`${question.questionId}: missing Devanagari`);
    fail(!/[\u0A00-\u0A7F]/u.test(scriptText),`${question.questionId}: Gurmukhi leakage in Hindi`);
  }else{
    fail(/[\u0A00-\u0A7F]/u.test(scriptText),`${question.questionId}: missing Gurmukhi`);
    fail(!/[\u0900-\u097F]/u.test(scriptText),`${question.questionId}: Devanagari leakage in Punjabi`);
    const editorialBans=[
      "ਕਿਹੜੇ ਕਿਸਮ",
      "ਬਿਆਨ",
      "ਵਿਆਪਕ ਸਮਾਂ",
      "ਸਹੀ ਤਰ੍ਹਾਂ",
      "ਆਮ ਤੌਰ ਤੇ",
      "ਮੁੱਖ ਤੌਰ ਤੇ",
      "ਖਾਸ ਤੌਰ ਤੇ",
      "ਸੰਸਕ੍ਰਿਤੀ",
      "ਆਧਿਆਤਮਿਕ",
      "ਰਾਜਨੀਤਿਕ ਵੈਧਤਾ",
      "ਵਿਦਵਤ",
      "ਅੰਤਰ-ਖੇਤਰੀ",
      "ਹਿੰਦੂਸਤਾਨੀ",
      "ਸਹੀ ਤੌਰ 'ਤੇ",
      "ਉੱਤਰਾਧਿਕਾਰੀ",
      "ਅਭਿਵਿਅਕਤੀ",
      "ਦੱਖਣੀ ਅਤੇ ਭਗਤੀ",
      "ਦੱਖਣੀ ਦੱਕਣ",
    ];   for(const banned of editorialBans){
      fail(!text.includes(banned),`${question.questionId}: Punjabi editorial regression: ${banned}`);
    }
  }
}

function assertParity(source:readonly any[],localized:readonly HisLocalizedQuestionV1[],locale:HisLocaleV1){
  fail(localized.length===source.length,`${locale}: length mismatch`);
  localized.forEach((question,index)=>{
    const english=source[index]!;
    fail(question.localizationV1.englishQuestionId===english.questionId,`${question.questionId}: English id mismatch`);
    fail(question.localizationV1.englishFreeze==="HIS-001-ENGLISH-FREEZE-V4",`${question.questionId}: English freeze mismatch`);
    fail(question.cpId===english.cpId,`${question.questionId}: CP mismatch`);
    fail(question.qlId===english.qlId,`${question.questionId}: QL mismatch`);
    fail(question.difficulty===english.difficulty,`${question.questionId}: difficulty mismatch`);
    fail(question.correctIndex===english.correctIndex,`${question.questionId}: correct-index mismatch`);
    fail(JSON.stringify(question.sourceIds)===JSON.stringify(english.sourceIds),`${question.questionId}: sourceIds mismatch`);
    fail(JSON.stringify(question.sourceFactIds)===JSON.stringify(english.sourceFactIds),`${question.questionId}: sourceFactIds mismatch`);
    fail(question.options.length===4,`${question.questionId}: expected four options`);
    fail(new Set(question.options).size===4,`${question.questionId}: duplicate localized options`);
    fail(question.canonicalAnswer===question.options[question.correctIndex],`${question.questionId}: canonical-answer mismatch`);
    fail(question.reviewOnly===true&&question.runtimeRegistered===false,`${question.questionId}: lifecycle boundary changed`);
    fail(question.localizationV1.reviewOnly===true,`${question.questionId}: localization lifecycle boundary changed`);
    if(locale==="en"){
      fail(question.questionId===english.questionId,`${question.questionId}: English id drift`);
      fail(question.stem===english.stem,`${question.questionId}: English stem drift`);
      fail(JSON.stringify(question.options)===JSON.stringify(english.options),`${question.questionId}: English options drift`);
      fail(question.explanation===english.explanation,`${question.questionId}: English explanation drift`);
      fail(question.canonicalAnswer===english.canonicalAnswer,`${question.questionId}: English answer drift`);
    }else{
      fail(question.questionId===`${english.questionId}-${locale.toUpperCase()}`,`${question.questionId}: localized id mismatch`);
      assertNative(question,locale);
    }
  });
}

fail(HIS_CP021_REVIEW_BATCH_V1.length===60,`CP021 English expected 60, found ${HIS_CP021_REVIEW_BATCH_V1.length}`);
fail(Object.keys(HIS_CP021_HI_V1).length===60,`CP021 Hindi overlays expected 60, found ${Object.keys(HIS_CP021_HI_V1).length}`);
fail(Object.keys(HIS_CP021_PA_V1).length===60,`CP021 Punjabi overlays expected 60, found ${Object.keys(HIS_CP021_PA_V1).length}`);

for(const locale of locales)assertParity(HIS_CP021_REVIEW_BATCH_V1,generateHisCp021LocalizedReviewV1(locale),locale);
const all=locales.flatMap((locale)=>generateHisCp021LocalizedReviewV1(locale));
fail(all.length===180,`CP021 expected 180 EN-HI-PA surfaces, found ${all.length}`);

console.log("History CP021 multilingual audit passed: 60 questions per locale / 180 EN-HI-PA surfaces; English authority HIS-001-ENGLISH-FREEZE-V4.");
