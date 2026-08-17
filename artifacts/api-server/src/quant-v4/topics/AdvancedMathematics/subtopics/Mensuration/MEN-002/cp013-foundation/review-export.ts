import fs from 'node:fs';import path from 'node:path';import { buildMenCp013DiscoveryReview, auditMenCp013DiscoveryReview } from './review';
const rows=buildMenCp013DiscoveryReview(),audit=auditMenCp013DiscoveryReview();
const out=path.resolve(process.cwd(),'dist/quant-v4');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'men-cp013-discovery-review-v1.json'),JSON.stringify({audit,rows},null,2));
const md=['# MEN-CP-013 Discovery Closure Review V1','',`- Questions: **${audit.records}**`,`- Unique stems: **${audit.uniqueStems}**`,`- Answer balance A/B/C/D: **${audit.answerPositions.join('/')}**`,'- Permanent QLs: **0**','- Product gates: **closed**',''];
rows.forEach(({definition,question},i)=>{md.push(`## ${i+1}. ${definition.id} — ${definition.title}`,'',`Wave: ${definition.wave} | Cluster: ${definition.cluster} | Source-backed: ${definition.sourceBacked?'yes':'no'}`,'',question.stem,'',...question.options.map(o=>`${o.label}. ${o.display}${o.isCorrect?' ✓':''}`),'',`Answer: **${question.answer}**`,'',`Key rule: ${question.explanation.keyRule}`,'',...question.explanation.steps.map((s,j)=>`${j+1}. **${s.title}:** ${s.body}`),'',`Shortcut: ${question.explanation.shortcut}`,'',`Traps: ${question.explanation.traps.join(' | ')}`,'');});
fs.writeFileSync(path.join(out,'men-cp013-discovery-review-v1.md'),md.join('\n'));
console.log(JSON.stringify({out,audit},null,2));
