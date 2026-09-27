import { PGK_001_CP017_REVIEW_BATCH_V1 } from "../pgk-001-cp017-review-batch-v1";
import { PGK_CP017_HI_V1 } from "./pgk-cp017-hi-v1";
import { PGK_CP017_PA_V1 } from "./pgk-cp017-pa-v1";
import { generatePgkCp017LocalizedReviewV1 } from "./pgk-cp017-localization-v1";
import type { PgkLocaleV1 } from "./pgk-localization-types-v1";
const ls:PgkLocaleV1[]=["en","hi","pa"];
function f(c:boolean,m:string):asserts c{if(!c)throw new Error(m);}
function t(q:{stem:string;options:readonly string[];explanation:string}){return[q.stem,...q.options,q.explanation].join("\n");}
function nat(q:ReturnType<typeof generatePgkCp017LocalizedReviewV1>[number],l:"hi"|"pa"){const s=t(q),z=s.replace(/[।॥]/g,"");f(!/[A-Za-z]{2,}/u.test(s),`${q.questionId}: Latin leakage`);if(l==="hi"){f(/[\u0900-\u097F]/u.test(z),"missing Devanagari");f(!/[\u0A00-\u0A7F]/u.test(z),"Gurmukhi leakage");}else{f(/[\u0A00-\u0A7F]/u.test(z),"missing Gurmukhi");f(!/[\u0900-\u097F]/u.test(z),"Devanagari leakage");}}
for(const l of ls){const a=generatePgkCp017LocalizedReviewV1(l);f(a.length===42,"count");a.forEach((q,i)=>{const e=PGK_001_CP017_REVIEW_BATCH_V1[i]!;f(q.qlId===e.qlId&&q.difficulty===e.difficulty&&q.correctIndex===e.correctIndex,"invariant");f(JSON.stringify(q.factIds)===JSON.stringify(e.factIds)&&JSON.stringify(q.sourceIds)===JSON.stringify(e.sourceIds),"provenance");f(new Set(q.options).size===4&&q.canonicalAnswer===q.options[q.correctIndex],"answers");if(l!=="en")nat(q,l);});}
f(Object.keys(PGK_CP017_HI_V1).length===42&&Object.keys(PGK_CP017_PA_V1).length===42,"overlay count");
console.log("PGK-001 CP017 multilingual audit passed: 42 questions per locale / 126 EN-HI-PA surfaces.");
