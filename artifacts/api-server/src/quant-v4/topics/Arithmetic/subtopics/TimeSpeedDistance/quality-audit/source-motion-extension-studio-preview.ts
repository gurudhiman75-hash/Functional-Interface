import {TSD_SOURCE_MOTION_EXTENSION_REVIEW as rows} from "./source-motion-extension-review";
import {EDITORIAL_REVIEW_LOCK} from "./worked-calculation";
export const TSD_SOURCE_MOTION_STUDIO_REVIEW_PACKAGE=Object.freeze({...EDITORIAL_REVIEW_LOCK,
 packageId:"TSD-SOURCE-MOTION-REVIEW",supportedLanguages:Object.freeze(["en","hi","pa"] as const),
 families:15,mathematicalModels:14,authoredRows:45,routeMounted:false,productionSelectorVisible:false,
 permanentQlAllocation:null,automaticStudentPublication:false});
/** Explicit preview only: never participates in the registered Quant dispatcher. */
export function previewTsdSourceMotionReview(request:{language?:"en"|"hi"|"pa";familyId?:string;count?:number}){
 const language=request.language??"en",count=request.count??15;
 if(!["en","hi","pa"].includes(language))throw new Error("Unsupported review language");
 if(!Number.isInteger(count)||count<1||count>15)throw new Error("Review count must be1..15");
 const selected=rows.filter(row=>row.locale===language&&(!request.familyId||row.familyId===request.familyId));
 if(!selected.length)throw new Error("Unknown review family");
 const questions=Object.freeze(selected.slice(0,count).map(row=>Object.freeze({...EDITORIAL_REVIEW_LOCK,
  id:`${row.familyId}-${row.locale}`,packageId:TSD_SOURCE_MOTION_STUDIO_REVIEW_PACKAGE.packageId,
  familyId:row.familyId,reviewModel:row.model,language,permanentQlId:null,
  text:row.stem,stem:row.stem,options:row.options,answerText:row.answerText,correctIndex:row.correctIndex,
  explanation:row.explanation,sourceObservation:row.sourceObservation,advancedSourceOnly:row.advancedSourceOnly})));
 return Object.freeze({package:TSD_SOURCE_MOTION_STUDIO_REVIEW_PACKAGE,questions});
}
