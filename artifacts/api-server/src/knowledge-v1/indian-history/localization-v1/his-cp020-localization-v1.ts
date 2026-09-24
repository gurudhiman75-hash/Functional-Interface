import { HIS_CP020_REVIEW_BATCH_V1 } from "../medieval-economy-society/his-cp020-review-v1";
import { HIS_CP020_HI_V1 } from "./his-cp020-hi-v1";
import { HIS_CP020_PA_V1 } from "./his-cp020-pa-v1";
import {
  HIS_ENGLISH_FREEZE_V3,
  HIS_LOCALIZATION_V1,
  type HisLocaleV1,
  type HisLocalizedQuestionV1,
  type HisNativeOverlayV1,
} from "./his-localization-types-v1";

type EnglishQuestion = (typeof HIS_CP020_REVIEW_BATCH_V1)[number];
type NativeLocale = Exclude<HisLocaleV1, "en">;

function overlayFor(index:number,locale:NativeLocale):HisNativeOverlayV1{
  const n=index+1;
  const overlay=locale==="hi"?HIS_CP020_HI_V1[n]:HIS_CP020_PA_V1[n];
  if(!overlay)throw new Error(`HIS-CP-020 #${n}: missing ${locale} localization overlay`);
  return overlay;
}

function localizedBase(
  q:EnglishQuestion,
  locale:HisLocaleV1,
  stem:string,
  options:string[],
  canonicalAnswer:string,
  explanation:string,
):HisLocalizedQuestionV1{
  return {
    ...q,
    questionId:locale==="en"?q.questionId:`${q.questionId}-${locale.toUpperCase()}`,
    stem,
    options,
    canonicalAnswer,
    explanation,
    locale,
    localizationV1:{
      version:HIS_LOCALIZATION_V1,
      englishQuestionId:q.questionId,
      englishFreeze:HIS_ENGLISH_FREEZE_V3,
      semanticInvariant:true,
      cpInvariant:true,
      qlInvariant:true,
      difficultyInvariant:true,
      sourceInvariant:true,
      optionOrderInvariant:true,
      correctIndexInvariant:true,
      reviewOnly:true,
    },
  };
}

function localizeNative(q:EnglishQuestion,index:number,locale:NativeLocale):HisLocalizedQuestionV1{
  const overlay=overlayFor(index,locale);
  const options=q.options.map((englishOption)=>{
    const localized=overlay.optionsByEnglish[englishOption];
    if(!localized)throw new Error(`${q.questionId}: missing ${locale} option mapping for "${englishOption}"`);
    return localized;
  });
  return localizedBase(q,locale,overlay.stem,options,options[q.correctIndex]!,overlay.explanation);
}

export function generateHisCp020LocalizedReviewV1(locale:HisLocaleV1):HisLocalizedQuestionV1[]{
  return HIS_CP020_REVIEW_BATCH_V1.map((q,index)=>{
    if(locale==="en")return localizedBase(q,locale,q.stem,[...q.options],q.canonicalAnswer,q.explanation);
    return localizeNative(q,index,locale);
  });
}

export const HIS_CP020_LOCALIZATION_V1_SUPPORTED_LOCALES=["en","hi","pa"] as const;
export const HIS_CP020_LOCALIZATION_V1_SUPPORTED_CPS=["HIS-CP-020"] as const;
