import postgres from 'postgres';
import fs from 'node:fs';
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split('\n').filter(l => l && !l.startsWith('#')).map(l => { const i=l.indexOf('='); return [l.slice(0,i), l.slice(i+1).replace(/^["']|["']$/g,'')]; }));
process.env.DATABASE_URL = env.DATABASE_URL;

const { generateRichQuestions, normalizeRichTemplate, isRichPayload } = await import('./src/lib/rich-template.service.ts');

const sql = postgres(env.DATABASE_URL);
const all = await sql`SELECT id, name, sections::text AS sec FROM mock_test_templates ORDER BY created_at DESC`;
console.log('All templates:');
for (const r of all) console.log(`  ${r.id} | ${r.name} | rich? ${r.sec.includes('"kind":"rich"') || r.sec.includes('question_logic') || r.sec.includes('questionLogic')}`);

const richOnes = all.filter(r => r.sec.includes('"kind":"rich"') || r.sec.includes('questionLogic'));
console.log(`\nFound ${richOnes.length} rich templates`);

if (richOnes.length === 0) {
  console.log('\nNo rich template stored. Testing with sample PLD payload...');
  const samplePayload = {
    kind: "rich",
    section: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Profit Loss & Discount",
    difficulty: "Moderate",
    questionCount: 3,
    fields: {
      questionLogic: "Two successive discounts of [D1]% and [D2]%. Effective discount?",
      variables: { D1: "Integer (range 10-30)", D2: "Integer (range 5-25)" },
      mathFormula: "Effective = 100 - ((100 - [D1]) * (100 - [D2]) / 100)",
    }
  };
  const norm = normalizeRichTemplate(samplePayload);
  console.log('Normalized:', JSON.stringify(norm, null, 2).slice(0, 600));
  try {
    const res = await generateRichQuestions(norm, { persist: true });
    console.log('\nGenerated', res.length, 'questions:');
    for (const q of res) console.log('  •', q.questionText, '→', q.correctAnswer, q.options);
  } catch (e) {
    console.error('\n!! ERROR:', e.message);
    console.error(e.stack);
  }
} else {
  for (const t of richOnes) {
    console.log('\n--- Testing', t.name, '---');
    const sec = JSON.parse(t.sec);
    console.log('sections[0] =', JSON.stringify(sec[0]).slice(0, 400));
    try {
      const norm = normalizeRichTemplate(sec[0]);
      console.log('normalized variables:', norm.fields.variables);
      console.log('formula:', norm.fields.mathFormula);
      const res = await generateRichQuestions(norm, { persist: false });
      console.log('Generated', res.length, 'questions');
      for (const q of res) console.log('  •', q.questionText.slice(0,100), '→', q.correctAnswer);
    } catch (e) {
      console.error('!! ERROR:', e.message);
      console.error(e.stack);
    }
  }
}

await sql.end();
