import { HIS_CP023_REVIEW_BATCH_V1 } from "../colonial-education-press-reform/his-cp023-review-v1";
import { HIS_CP023_HI_V1 } from "./his-cp023-hi-v1";
import { HIS_CP023_PA_V1 } from "./his-cp023-pa-v1";
import { generateHisCp023LocalizedReviewV1 } from "./his-cp023-localization-v1";
import type { HisLocaleV1, HisLocalizedQuestionV1 } from "./his-localization-types-v1";

const locales:HisLocaleV1[]=["en","hi","pa"];
const fail=(condition:boolean,message:string)=>{if(!condition)throw new Error(message);};

function learnerText(question:{stem:string;options:readonly string[];explanation:string}):string{
  return [question.stem,...question.options,question.explanation].join("\n");
}
function questionSurface(question:{stem:string;options:readonly string[]}):string{
  return [question.stem,...question.options].join("\n");
}
function sentenceCount(text:string):number{
  return (text.match(/[.!?।॥](?:\s|$)/g)??[]).length;
}
function numericTokens(text:string):string[]{
  return text.match(/\d+(?:\.\d+)?/g)??[];
}
function assertNative(question:HisLocalizedQuestionV1,locale:"hi"|"pa",english:any){
  const text=learnerText(question);
  const scriptText=text.replace(/[।॥]/g,"");
  const latin=text.match(/[A-Za-z]{2,}/u)?.[0];
  fail(!latin,`${question.questionId}: unauthorized Latin-script leakage: ${latin??"unknown"}`);
  fail(sentenceCount(question.explanation)>=2,`${question.questionId}: localized explanation needs at least two sentences`);
  fail(question.stem.length<=380,`${question.questionId}: localized stem too long: ${question.stem.length}`);
  fail(question.explanation.length>=90,`${question.questionId}: localized explanation too short: ${question.explanation.length}`);
  fail(question.explanation.length<=600,`${question.questionId}: localized explanation too long: ${question.explanation.length}`);

  const expectedNumbers=new Set(numericTokens(questionSurface(english)));
  const localizedNumbers=new Set(numericTokens(questionSurface(question)));
  for(const token of expectedNumbers){
    fail(localizedNumbers.has(token),`${question.questionId}: numeric token lost: ${token}`);
  }

  if(locale==="hi"){
    fail(/[\u0900-\u097F]/u.test(scriptText),`${question.questionId}: missing Devanagari`);
    fail(!/[\u0A00-\u0A7F]/u.test(scriptText),`${question.questionId}: Gurmukhi leakage in Hindi`);
  }else{
    fail(/[\u0A00-\u0A7F]/u.test(scriptText),`${question.questionId}: missing Gurmukhi`);
    fail(!/[\u0900-\u097F]/u.test(scriptText),`${question.questionId}: Devanagari leakage in Punjabi`);
    const editorialBans=[
      "ਸੰਬੰਧਿਤ",
      "ਵਿਵਸਥਾ",
      "ਘੋਸ਼ਣਾ",
      "ਸਮੀਖਿਆ",
      "ਉਤਸ਼ਾਹਿਤ",
      "ਵਿਦਰੋਹ",
      "ਅਨੁਯਾਈ",
      "ਰਾਜਸਵ",
      "ਪ੍ਰਸ਼ਾਸਕੀ",
      "ਸੰਗਠਿਤ",
      "ਆਰਥਿਕ",
      "ਰਾਜਨੀਤਿਕ",
      "ਨਿਰਯਾਤ",
      "ਦਸਤਾਵੇਜ਼",
      "ਸ਼ੋਸ਼ਣ",
      "ਸਮਰਥਨ",
      "ਅੰਦੋਲਨ",
      "ਕਿਹੜੇ ਕਿਸਮ",
      "ਸਹੀ ਤਰ੍ਹਾਂ",
      "ਹੇਠ ਹੇਠ",
      "ਕੜਾ",
      "ਕੜੀ",
      "ਕੜੀਆਂ",
      "ਟਾਈਟ"
    ];
    for(const banned of editorialBans){
      fail(!text.includes(banned),`${question.questionId}: Punjabi editorial regression: ${banned}`);
    }
  }
}

function assertParity(source:readonly any[],localized:readonly HisLocalizedQuestionV1[],locale:HisLocaleV1){
  fail(localized.length===source.length,`${locale}: length mismatch`);
  localized.forEach((question,index)=>{
    const english=source[index]!;
    fail(question.localizationV1.englishQuestionId===english.questionId,`${question.questionId}: English id mismatch`);
    fail(question.localizationV1.englishFreeze==="HIS-001-ENGLISH-FREEZE-V5",`${question.questionId}: English freeze mismatch`);
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
      assertNative(question,locale,english);
    }
  });
}

fail(HIS_CP023_REVIEW_BATCH_V1.length===60,`CP023 English expected 60, found ${HIS_CP023_REVIEW_BATCH_V1.length}`);
fail(Object.keys(HIS_CP023_HI_V1).length===60,`CP023 Hindi overlays expected 60, found ${Object.keys(HIS_CP023_HI_V1).length}`);
fail(Object.keys(HIS_CP023_PA_V1).length===60,`CP023 Punjabi overlays expected 60, found ${Object.keys(HIS_CP023_PA_V1).length}`);

const correctedEnglish=HIS_CP023_REVIEW_BATCH_V1[3]!;
fail(correctedEnglish.stem.includes("1800"),"CP023 Q4 must retain corrected Fort William College year 1800");
fail(!correctedEnglish.stem.includes("1801"),"CP023 Q4 still contains incorrect Fort William College year 1801");

for(const locale of locales)assertParity(HIS_CP023_REVIEW_BATCH_V1,generateHisCp023LocalizedReviewV1(locale),locale);

for(const locale of ["hi","pa"] as const){
  const q4=generateHisCp023LocalizedReviewV1(locale)[3]!;
  fail(questionSurface(q4).includes("1800"),`CP023 Q4/${locale}: corrected year 1800 lost in localization`);
}

const all=locales.flatMap((locale)=>generateHisCp023LocalizedReviewV1(locale));
fail(all.length===180,`CP023 expected 180 EN-HI-PA surfaces, found ${all.length}`);

console.log("History CP023 multilingual audit passed: 60 questions per locale / 180 EN-HI-PA surfaces; English authority HIS-001-ENGLISH-FREEZE-V5.");
