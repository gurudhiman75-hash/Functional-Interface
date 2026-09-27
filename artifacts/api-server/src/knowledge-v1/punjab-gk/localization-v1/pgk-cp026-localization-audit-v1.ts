import { PGK_001_CP026_REVIEW_BATCH_V1 } from "../pgk-001-cp026-review-batch-v1";
import { PGK_CP026_HI_V1 } from "./pgk-cp026-hi-v1";
import { PGK_CP026_PA_V1 } from "./pgk-cp026-pa-v1";
import { generatePgkCp026LocalizedReviewV1 } from "./pgk-cp026-localization-v1";
import type { PgkLocaleV1 } from "./pgk-localization-types-v1";
const ls:PgkLocaleV1[]=["en","hi","pa"];function f(c:boolean,m:string):asserts c{if(!c)throw new Error(m);}function t(q:{stem:string;options:readonly string[];explanation:string}){return[q.stem,...q.options,q.explanation].join("\n");}
function nat(q:ReturnType<typeof generatePgkCp026LocalizedReviewV1>[number],l:"hi"|"pa"){const s=t(q),z=s.replace(/[।॥]/g,"");f(!/[A-Za-z]{2,}/u.test(s),`${q.questionId}: Latin leakage`);if(l==="hi"){f(/[\u0900-\u097F]/u.test(z),"missing Devanagari");f(!/[\u0A00-\u0A7F]/u.test(z),"Gurmukhi leakage");}else{f(/[\u0A00-\u0A7F]/u.test(z),"missing Gurmukhi");f(!/[\u0900-\u097F]/u.test(z),"Devanagari leakage");}}
for(const l of ls){const a=generatePgkCp026LocalizedReviewV1(l);f(a.length===48,"count");a.forEach((q,i)=>{const e=PGK_001_CP026_REVIEW_BATCH_V1[i]!;const k=e.options.indexOf(e.answer as never);f(q.qlId===e.qlId&&q.difficulty===e.difficulty&&q.correctIndex===k,"invariant");f(JSON.stringify(q.factIds)===JSON.stringify(e.factIds)&&JSON.stringify(q.sourceIds)===JSON.stringify(e.sourceIds),"provenance");f(new Set(q.options).size===4&&q.canonicalAnswer===q.options[q.correctIndex],"answers");if(l!=="en")nat(q,l);});}
f(Object.keys(PGK_CP026_HI_V1).length===48&&Object.keys(PGK_CP026_PA_V1).length===48,"overlay count");console.log("PGK-001 CP026 multilingual audit passed: 48 questions per locale / 144 EN-HI-PA surfaces.");
