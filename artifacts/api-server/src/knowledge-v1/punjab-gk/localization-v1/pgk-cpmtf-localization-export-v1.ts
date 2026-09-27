import fs from "node:fs";
import path from "node:path";
import {
  PGK_001_MATCH_FOLLOWING_CONCEPTS_V1,
  generatePgkMatchFollowingReviewV1,
  type PgkMatchingLocaleV1,
} from "./pgk-match-following-extension-v1";

const locales: PgkMatchingLocaleV1[]=["en","hi","pa"];
const labels: Record<PgkMatchingLocaleV1,string>={en:"English",hi:"Hindi",pa:"Punjabi"};
const corpora=Object.fromEntries(locales.map(l=>[l,generatePgkMatchFollowingReviewV1(l)])) as Record<PgkMatchingLocaleV1,ReturnType<typeof generatePgkMatchFollowingReviewV1>>;
const lines:string[]=[
  "# PGK-001 — Genuine Match-the-Following Extension V1",
  "",
  "Status: REVIEW-READY / AWAITING HUMAN APPROVAL",
  "Scope: 24 concepts × English/Hindi/Punjabi = 72 review surfaces",
  "Frozen core impact: NONE — 1,092 approved English questions remain unchanged",
  "Lifecycle: review-only; Question Studio integration is not authorized by this artifact.",
  "",
];

for(let i=0;i<PGK_001_MATCH_FOLLOWING_CONCEPTS_V1.length;i++){
  const concept=PGK_001_MATCH_FOLLOWING_CONCEPTS_V1[i]!;
  lines.push(`## ${concept.id} · ${concept.cpId} · ${concept.difficulty}`,"",`Source QLs: ${concept.sourceQlIds.join(", ")}`,"");
  for(const locale of locales){
    const q=corpora[locale][i]!;
    lines.push(`### ${labels[locale]}`,"",q.stem.split("\n")[0]!,"");
    lines.push("| List I | List II |","| --- | --- |");
    for(let n=0;n<4;n++){
      lines.push(`| ${String.fromCharCode(65+n)}. ${q.listI[n]!.replace(/\|/g,"\\|")} | ${n+1}. ${q.listII[n]!.replace(/\|/g,"\\|")} |`);
    }
    lines.push("","**Codes:**");
    q.options.forEach((o,j)=>lines.push(`${j+1}. ${o}${j===q.correctIndex?" ✅":""}`));
    lines.push("",`**Explanation:** ${q.explanation}`,"");
  }
}

const dir=path.resolve(process.cwd(),"dist/pgk-review/PGK-MULTILINGUAL-V1");
fs.mkdirSync(dir,{recursive:true});
const out=path.join(dir,"PGK-MULTILINGUAL-V1-MATCH-FOLLOWING-EXTENSION-REVIEW.md");
fs.writeFileSync(out,lines.join("\n")+"\n","utf8");
console.log(out);
