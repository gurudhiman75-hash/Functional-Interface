import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { WGE_CORPUS, WGE_CP_TITLES, WGE_SOURCES, WGE_LANGUAGES } from '../../artifacts/api-server/src/knowledge-v1/world-geography/corpus';
import { knowledgeV1Wge001QuestionStudioAdapterV1 as adapter } from '../../artifacts/api-server/src/question-studio/engines/knowledge-v1-wge001-adapter-v1';
const destination = resolve(process.argv[2] || '/tmp/WORLD-GEOGRAPHY-SECTION-A-REVIEW.md');
const lines = [readFileSync('artifacts/api-server/src/knowledge-v1/world-geography/README.md', 'utf8'), '\n## Complete question review\n'];
let exported = 0;
for (const [cp, title] of Object.entries(WGE_CP_TITLES)) {
  lines.push(`\n## ${cp} — ${title}\n`);
  for (const row of WGE_CORPUS.filter(q => q.cpId === cp)) {
    lines.push(`\n### ${row.id} · ${row.difficulty}\n`, `Objective: ${row.objective}\n`);
    for (const language of WGE_LANGUAGES) {
      const result = await adapter.generate({ packageId: 'WGE-001', canonicalProblemId: row.id, language, count: 1, seed: 'section-a-review-v1' });
      const q = result.questions[0] as {stem:string; options:string[]; correctIndex:number; explanation:string};
      lines.push(`\n#### ${language}\n`, q.stem, '', ...q.options.map((o, i) => `${String.fromCharCode(65+i)}. ${o}`), '', `**Answer: ${String.fromCharCode(65+q.correctIndex)}. ${q.options[q.correctIndex]}**`, '', q.explanation, '');
      exported++;
    }
    lines.push(`Sources: ${row.sourceIds.join(', ')}\n`);
  }
}
lines.push('\n## Source register\n');
for (const s of WGE_SOURCES) lines.push(`- **${s.id}**: [${s.title}](${s.url}) — ${s.section}. Consulted ${s.consultedOn}; ${s.retrievalStatus}.`);
if (exported !== 603) throw new Error(`Incomplete export: ${exported}`);
mkdirSync(dirname(destination), {recursive:true}); writeFileSync(destination, lines.join('\n'));
console.log(`Exported ${exported} localized questions to ${destination}`);
