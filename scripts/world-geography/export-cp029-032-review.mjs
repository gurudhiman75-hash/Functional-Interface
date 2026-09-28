import { readFileSync, writeFileSync } from 'node:fs';

const root = 'artifacts/api-server/src/knowledge-v1/world-geography';
const titles = {
  29: 'South America',
  30: 'Australia, New Zealand and Pacific Islands',
  31: 'Antarctica and the Arctic',
  32: 'Population and Migration',
};
const names = { en: 'English', hi: 'Hindi', pa: 'Punjabi' };
const lines = [
  '# World Geography — CP029–CP032 review',
  '',
  'All questions are review-only and await editorial approval. Correct options are marked; English, Hindi and Punjabi are shown together for comparison.',
  '',
  'Coverage: South America; Australia, New Zealand and Pacific islands; Antarctica and the Arctic; population and migration.',
  '',
];
let total = 0;
for (let cp = 29; cp <= 32; cp++) {
  const rows = JSON.parse(readFileSync(`${root}/cp${String(cp).padStart(3,'0')}.json`, 'utf8'));
  lines.push(`## CP${String(cp).padStart(3,'0')} — ${titles[cp]}`, '');
  for (const q of rows) {
    total++;
    lines.push(`### ${q.id} · ${q.difficulty}`, '', `Objective: ${q.objective}`, '');
    for (const language of ['en','hi','pa']) {
      const item = q.locales[language];
      lines.push(`**${names[language]}**`, '', item.stem, '');
      item.options.forEach((option, index) => lines.push(`${String.fromCharCode(65+index)}. ${index === q.correctIndex ? '**'+option+' — correct**' : option}`));
      lines.push('', item.explanation, '');
    }
    lines.push(`Sources: ${q.sourceIds.join(', ')}`, '');
  }
}
lines.splice(5, 0, `${total} canonical questions · ${total*3} localized variants`, '');
writeFileSync('WORLD-GEOGRAPHY-CP029-032-REVIEW.md', `${lines.join('\n')}\n`);
console.log(`Wrote ${total} questions / ${total*3} localized variants`);
