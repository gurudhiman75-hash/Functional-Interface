import { mkdirSync,writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { auditMenCp013PermanentEnglishReviewV4,buildMenCp013PermanentEnglishReviewV4 } from './review-v4';
const rows=buildMenCp013PermanentEnglishReviewV4(),audit=auditMenCp013PermanentEnglishReviewV4(),out=resolve(process.cwd(),'dist/quant-v4');mkdirSync(out,{recursive:true});
const jsonPath=resolve(out,'men-cp013-permanent-english-review-v4.json'),mdPath=resolve(out,'men-cp013-permanent-english-review-v4.md');writeFileSync(jsonPath,JSON.stringify({audit,rows},null,2));
const md=['# MEN-CP-013 Permanent English Review V4 — Editorial Final','',`Records: ${audit.records}`,`Unique stems: ${audit.uniqueStems}`,`Sources: ${audit.uniqueSources}`,`Answer balance: ${audit.answerPositions.join('/')}`,'','English remains **unfrozen**. All product gates remain closed.',''];
for(const [i,row] of rows.entries()){const q=row.question;md.push(`## ${i+1}. ${q.permanentQlId} — ${q.title}`,'',`Source: \`${q.sourceId}\``,'',q.stem,'');for(const o of q.options)md.push(`- ${o.label}. ${o.display}${o.isCorrect?' **✓**':''}`);md.push('',`Answer: **${q.answer}**`,'',`Key rule: ${q.explanation.keyRule}`,'');for(const s of q.explanation.steps)md.push(`- **${s.title}:** ${s.body}`);md.push('',`Shortcut: ${q.explanation.shortcut}`,'',`Traps: ${q.explanation.traps.join(' | ')}`,'',`Verification: ${q.verification.method}`,'','---','');}
writeFileSync(mdPath,md.join('\n'));console.log(JSON.stringify({jsonPath,mdPath,audit},null,2));
