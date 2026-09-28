import { readFileSync, writeFileSync } from 'node:fs';

const root = 'artifacts/api-server/src/knowledge-v1/world-geography';
const titles = {
  33: 'Settlements and Urban Geography',
  34: 'World Agriculture and Livestock',
  35: 'Minerals and Energy Resources',
  36: 'Industries and Economic Regions',
};
const names = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };
const lines = [
  '# World Geography — CP033–CP036 review',
  '',
  'All questions are review-only and await editorial approval. Correct options are marked; English, Hindi and Punjabi are shown together for comparison.',
  '',
  'Coverage: settlements and urban geography; world agriculture and livestock; minerals and energy resources; industries and economic regions.',
  '',
];
let total = 0;
for (let cp = 33; cp <= 36; cp++) {
  const rows = JSON.parse(readFileSync(`${root}/cp${String(cp).padStart(3, '0')}.json`, 'utf8'));
  lines.push(`## CP${String(cp).padStart(3, '0')} — ${titles[cp]}`, '');
  for (const q of rows) {
    total++;
    lines.push(`### ${q.id} · ${q.difficulty}`, '', `Objective: ${q.objective}`, '');
    for (const language of ['en', 'hi', 'pa']) {
      const item = q.locales[language];
      lines.push(`**${names[language]}**`, '', item.stem, '');
      item.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${index === q.correctIndex ? '**' + option + ' — correct**' : option}`));
      lines.push('', item.explanation, '');
    }
    lines.push(`Sources: ${q.sourceIds.join(', ')}`, '');
  }
}
lines.splice(5, 0, `${total} canonical questions · ${total * 3} localized variants`, '');
writeFileSync('WORLD-GEOGRAPHY-CP033-036-REVIEW.md', `${lines.join('\\n')}\\n`);
console.log(`Wrote ${total} questions / ${total * 3} localized variants`);
