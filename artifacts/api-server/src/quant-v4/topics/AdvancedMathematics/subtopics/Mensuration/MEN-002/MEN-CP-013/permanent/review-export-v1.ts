import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { auditMenCp013PermanentEnglishReviewV1, buildMenCp013PermanentEnglishReviewV1 } from './review-v1';

const rows=buildMenCp013PermanentEnglishReviewV1();
const audit=auditMenCp013PermanentEnglishReviewV1();
const out=resolve(process.cwd(),'dist/quant-v4');
mkdirSync(out,{recursive:true});
const jsonPath=resolve(out,'men-cp013-permanent-english-review-v1.json');
const mdPath=resolve(out,'men-cp013-permanent-english-review-v1.md');
writeFileSync(jsonPath,JSON.stringify({audit,rows},null,2));
const md=['# MEN-CP-013 Permanent English Review V1','',`Records: ${audit.records}`,`Unique stems: ${audit.uniqueStems}`,`Sources: ${audit.uniqueSources}`,`Answer balance: ${audit.answerPositions.join('/')}`,'','English is **not frozen** by this artifact. Product gates remain closed.',''];
for(const [index,row] of rows.entries()){
  const q=row.question;
  md.push(`## ${index+1}. ${q.permanentQlId} — ${q.title}`,'',`Source: \`${q.sourceId}\``,'',q.stem,'');
  for(const option of q.options)md.push(`- ${option.label}. ${option.display}${option.isCorrect?' **✓**':''}`);
  md.push('',`Answer: **${q.answer}**`,'',`Key rule: ${q.explanation.keyRule}`,'');
  for(const step of q.explanation.steps)md.push(`- **${step.title}:** ${step.body}`);
  md.push('',`Shortcut: ${q.explanation.shortcut}`,'',`Traps: ${q.explanation.traps.join(' | ')}`,'',`Verification: ${q.verification.method}`,'','---','');
}
writeFileSync(mdPath,md.join('\n'));
console.log(JSON.stringify({jsonPath,mdPath,audit},null,2));
