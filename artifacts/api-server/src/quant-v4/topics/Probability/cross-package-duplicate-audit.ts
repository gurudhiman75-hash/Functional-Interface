import { listPrb001QuestionEntries, runPrb001Pipeline } from "./PRB-001";
import { listPrb002QuestionEntries, runPrb002Pipeline } from "./PRB-002";
function normalize(value:string):string{return value.toLowerCase().replace(/\d+/g,"#").replace(/[^a-z#]+/g," ").replace(/\s+/g," ").trim();}
const questions=[
  ...listPrb001QuestionEntries().map((entry)=>runPrb001Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed:`cross-package:${entry.qlId}`})),
  ...listPrb002QuestionEntries().map((entry)=>runPrb002Pipeline(entry.cpId as any,{questionLanguageId:entry.qlId,seed:`cross-package:${entry.qlId}`})),
];
const groups=new Map<string,Set<string>>();for(const question of questions){const key=normalize(question.stem),packages=groups.get(key)??new Set<string>();packages.add(question.packageId);groups.set(key,packages);}
const crossPackageDuplicateCount=[...groups.values()].filter((packages)=>packages.size>1).length;
if(crossPackageDuplicateCount)throw new Error(`Cross-package normalized duplicate groups=${crossPackageDuplicateCount}`);
console.log(JSON.stringify({questionCount:questions.length,crossPackageDuplicateCount}));
