import fs from "node:fs";
import path from "node:path";
import { generatePolCp020LocalizedReviewV1 } from "./pol-cp020-localization-v1";
import { generatePolCp021LocalizedReviewV1 } from "./pol-cp021-localization-v1";
import { generatePolCp022LocalizedReviewV1 } from "./pol-cp022-localization-v1";

const names={en:"English",hi:"Hindi",pa:"Punjabi"} as const;
const dir=path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");
fs.mkdirSync(dir,{recursive:true});

for(const locale of ["en","hi","pa"] as const){
 const qs=[
  ...generatePolCp020LocalizedReviewV1(locale),
  ...generatePolCp021LocalizedReviewV1(locale),
  ...generatePolCp022LocalizedReviewV1(locale),
 ];
 const lines=[`# POL-001 CP020–CP022 — ${names[locale]} Localization Review V1`,"",`Questions: ${qs.length}`,""];
 for(const q of qs){
  lines.push(`## ${q.questionId} · ${q.cpId} · ${q.qlId} · ${q.difficulty}`,"",q.stem,"");
  q.options.forEach((o,i)=>lines.push(`${String.fromCharCode(65+i)}. ${o}${i===q.correctIndex?" ✓":""}`));
  lines.push("",`**Explanation:** ${q.explanation}`,"");
 }
 fs.writeFileSync(path.join(dir,`POL-CP020-CP022-${locale.toUpperCase()}-REVIEW-V1.md`),lines.join("\n"));
}
console.log("POL-001 CP020–CP022 multilingual review Markdown generated.");
