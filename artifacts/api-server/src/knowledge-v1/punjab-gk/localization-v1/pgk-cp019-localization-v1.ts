import { PGK_001_CP019_REVIEW_BATCH_V1 } from "../pgk-001-cp019-review-batch-v1";
import { PGK_CP019_HI_V1 } from "./pgk-cp019-hi-v1";
import { PGK_CP019_PA_V1 } from "./pgk-cp019-pa-v1";
import { PGK_ENGLISH_CERTIFICATION_V1, PGK_LOCALIZATION_V1, type PgkLocaleV1, type PgkNativeOverlayV1 } from "./pgk-localization-types-v1";

type E=(typeof PGK_001_CP019_REVIEW_BATCH_V1)[number];
type N=Exclude<PgkLocaleV1,"en">;
export type PgkCp019LocalizedQuestionV1={questionId:string;qlId:string;difficulty:E["difficulty"];stem:string;options:string[];correctIndex:number;canonicalAnswer:string;explanation:string;factIds:string[];sourceIds:string[];reviewOnly:true;runtimeRegistered:false;locale:PgkLocaleV1;localizationV1:{version:typeof PGK_LOCALIZATION_V1;englishQuestionId:string;englishCertification:typeof PGK_ENGLISH_CERTIFICATION_V1;semanticInvariant:true;qlInvariant:true;difficultyInvariant:true;factInvariant:true;sourceInvariant:true;optionOrderInvariant:true;correctIndexInvariant:true;reviewOnly:true;}};
function ci(q:E){const n=q.options.indexOf(q.answer as never);if(n<0)throw new Error(`${q.id}: answer missing from options`);return n;}
function ov(i:number,l:N):PgkNativeOverlayV1{const n=i+1,o=l==="hi"?PGK_CP019_HI_V1[n]:PGK_CP019_PA_V1[n];if(!o)throw new Error(`CP019 #${n}: missing ${l}`);return o;}
function b(q:E,l:PgkLocaleV1,s:string,o:string[],x:string):PgkCp019LocalizedQuestionV1{const k=ci(q);return{questionId:l==="en"?q.id:`${q.id}-${l.toUpperCase()}`,qlId:q.qlId,difficulty:q.difficulty,stem:s,options:o,correctIndex:k,canonicalAnswer:o[k]!,explanation:x,factIds:[...q.factIds],sourceIds:[...q.sourceIds],reviewOnly:true,runtimeRegistered:false,locale:l,localizationV1:{version:PGK_LOCALIZATION_V1,englishQuestionId:q.id,englishCertification:PGK_ENGLISH_CERTIFICATION_V1,semanticInvariant:true,qlInvariant:true,difficultyInvariant:true,factInvariant:true,sourceInvariant:true,optionOrderInvariant:true,correctIndexInvariant:true,reviewOnly:true}};}
export function generatePgkCp019LocalizedReviewV1(l:PgkLocaleV1):PgkCp019LocalizedQuestionV1[]{return PGK_001_CP019_REVIEW_BATCH_V1.map((q,i)=>{if(l==="en")return b(q,"en",q.stem,[...q.options],q.explanation);const z=ov(i,l);return b(q,l,z.stem,[...z.options],z.explanation);});}
