import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { auditMenCp013PermanentEnglishReviewV2, buildMenCp013PermanentEnglishReviewV2 } from './review-v2';
const rows=buildMenCp013PermanentEnglishReviewV2(),audit=auditMenCp013PermanentEnglishReviewV2();
const out=resolve(process.cwd(),'dist/quant-v4');mkdirSync(out,{recursive:true});
const jsonPath=resolve(out,'men-cp013-permanent-english-review-v2.json');
const mdPath=resolve(out,'men-cp013-permanent-english-review-v2.md');
writeFileSync(jsonPath,JSON.stringify({audit,rows},null,2));
const md=['# MEN-CP-013 Permanent English Review V2 — Setter Hardened','',`Records: ${audit.records}`,`Unique stems: ${audit.uniqueStems}`,`Sources: ${audit.uniqueSources}`,`Answer balance: ${audit.answerPositions.join('/')}`,'','English remains **unfrozen**. Product gates remain closed.',''];
for(const [i,row] of rows.entries()){
 const q=row.question;md.push(`## ${i+1}. ${q.permanentQlId} — ${q.title}`,'',`Source: \`${q.sourceId}\``,'',q.stem,'');
 for(const o of q.options)md.push(`- ${o.label}. ${o.display}${o.isCorrect?' **✓**':''}`);
 md.push('',`Answer: **${q.answer}**`,'',`Key rule: ${q.explanation.keyRule}`,'');
 for(const s of q.explanation.steps)md.push(`- **${s.title}:** ${s.body}`);
 md.push('',`Shortcut: ${q.explanation.shortcut}`,'',`Traps: ${q.explanation.traps.join(' | ')}`,'',`Verification: ${q.verification.method}`,'','---','');
}
writeFileSync(mdPath,md.join('\n'));console.log(JSON.stringify({jsonPath,mdPath,audit},null,2));
