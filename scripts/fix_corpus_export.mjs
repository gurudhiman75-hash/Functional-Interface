import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const exportDir = join(root, 'artifacts', 'api-server', 'exports', 'corpus-2026-05-25-202620');
const inputPath = join(exportDir, 'corpus.json');
const outputPath = join(exportDir, 'corpus.fixed.json');

const intros = {
  en: "Let's solve this step by step.",
  hi: 'आइए इसे चरण-दर-चरण हल करें।',
  pa: 'ਆਓ ਇਸਨੂੰ ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ ਕਰੀਏ।',
};

const hiReplacements = new Map([
  ['Only Mathematics', 'केवल गणित'],
  ['Only English', 'केवल अंग्रेजी'],
  ['region', 'क्षेत्र'],
  ['Paper I', 'पेपर I'],
  ['Paper II', 'पेपर II'],
]);
const paReplacements = new Map([
  ['Only Mathematics', 'ਸਿਰਫ਼ ਗਣਿਤ'],
  ['Only English', 'ਸਿਰਫ਼ ਅੰਗਰੇਜ਼ੀ'],
  ['region', 'ਖੇਤਰ'],
  ['Paper I', 'ਪੇਪਰ I'],
  ['Paper II', 'ਪੇਪਰ II'],
]);

const percentageQuestion = (question) => /percentage|percent|%/.test(question.toLowerCase());

const normalizeMultiplication = (line) => line.replace(/(\d)\s*x\s*(?=\d)/gi, '$1 × ');

const englishRewrite = (line) => {
  const trimmed = line.trim();
  if (!trimmed) return '';
  const normalized = normalizeMultiplication(trimmed);
  const lower = normalized.toLowerCase();

  const map = [
    [/^100% total setup:?$/i, 'First, set up the total as 100%.'],
    [/^male population:?$/i, 'First, calculate the male population:'],
    [/^female population:?$/i, 'Next, calculate the female population:'],
    [/^male population after growth:?$/i, 'Now calculate the male population after growth:'],
    [/^female population after (reduction|decrease):?$/i, 'Now calculate the female population after the decrease:'],
    [/^final population:?$/i, 'Finally, calculate the final population:'],
    [/^winning margin:?$/i, 'First, calculate the winning margin:'],
    [/^margin percentage:?$/i, 'Then calculate the margin percentage:'],
    [/^total votes are:?$/i, 'Then calculate the total votes:'],
    [/^total votes:?$/i, 'Then calculate the total votes:'],
    [/^marks in paper i:?$/i, 'Calculate marks in Paper I:'],
    [/^marks in paper ii:?$/i, 'Calculate marks in Paper II:'],
    [/^overall percentage:?$/i, 'Finally, calculate the overall percentage:'],
    [/^new price level:?$/i, 'First, calculate the new price level:'],
    [/^new price index:?$/i, 'Now calculate the new price index:'],
    [/^new expenditure level:?$/i, 'Now calculate the new expenditure index:'],
    [/^new consumption index:?$/i, 'Now calculate the new consumption index:'],
    [/^required reduction in consumption:?$/i, 'Now find the required reduction in consumption:'],
    [/^water quantity:?$/i, 'First, calculate the water quantity:'],
    [/^final mixture quantity:?$/i, 'Then calculate the final mixture quantity:'],
    [/^milk to be added:?$/i, 'Then calculate how much milk should be added:'],
    [/^total marks gap:?$/i, 'First, calculate the total marks gap:'],
    [/^percentage gap:?$/i, 'Next, calculate the percentage gap:'],
    [/^maximum marks are:?$/i, 'Then calculate the maximum marks:'],
    [/^income:?$/i, 'Calculate the income:'],
    [/^remaining income index:?$/i, 'First, calculate the remaining income index:'],
    [/^final mixture:?$/i, 'Then calculate the final mixture quantity:'],
    [/^final population:?$/i, 'Finally, calculate the final population:'],
  ];

  for (const [pattern, replacement] of map) {
    if (pattern.test(normalized)) return replacement;
  }

  if (/^=/.test(normalized)) {
    return 'That gives ' + normalized.slice(1).trim();
  }
  if (/^[0-9]/.test(normalized) || /^[()+\d]/.test(normalized)) {
    return 'Calculate ' + normalized;
  }
  if (/=/.test(normalized) && /^(total|total|final|maximum|overall|income|milk|marks|water|remaining|required|new|male|female)/i.test(normalized)) {
    return 'So ' + normalized;
  }
  if (trimmed.endsWith(':')) {
    return 'Then ' + normalized;
  }
  return normalized;
};

const localizeLine = (lang, line) => {
  let result = line.trim();
  if (!result) return '';
  result = normalizeMultiplication(result);
  if (lang === 'hi') {
    for (const [from, to] of hiReplacements) {
      result = result.replace(new RegExp(from, 'g'), to);
    }
  }
  if (lang === 'pa') {
    for (const [from, to] of paReplacements) {
      result = result.replace(new RegExp(from, 'g'), to);
    }
  }
  return result;
};

const rewriteExplanation = (lang, expl) => {
  const lines = expl.split(/\r?\n/).map((line) => line.replace(/\s+$/g, ''));
  const rewritten = [];
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (lang === 'en') {
      rewritten.push(englishRewrite(trimmed));
    } else {
      rewritten.push(localizeLine(lang, trimmed));
    }
  }
  const text = rewritten.join('\n');
  return text.startsWith(intros[lang]) ? text : `${intros[lang]}\n${text}`;
};

const fixCorpus = async () => {
  const raw = await readFile(inputPath, 'utf8');
  const corpus = JSON.parse(raw);
  const fixedIndices = [];

  for (const item of corpus) {
    const questionEn = item.multilingual?.en?.question ?? '';
    if (!percentageQuestion(questionEn)) continue;

    fixedIndices.push(item.index);
    for (const lang of ['en', 'hi', 'pa']) {
      const expl = item.multilingual?.[lang]?.explanation ?? '';
      item.multilingual[lang].explanation = rewriteExplanation(lang, expl);
    }
    if (item.index === 13 || item.index === 16 || item.index === 20 || item.index === 25 || item.index === 35 || item.index === 39 || item.index === 51 || item.index === 64 || item.index === 71 || item.index === 81) {
      const hi = item.multilingual.hi;
      const pa = item.multilingual.pa;
      for (const [from, to] of hiReplacements) {
        hi.question = hi.question.replace(new RegExp(from, 'g'), to);
        hi.explanation = hi.explanation.replace(new RegExp(from, 'g'), to);
      }
      for (const [from, to] of paReplacements) {
        pa.question = pa.question.replace(new RegExp(from, 'g'), to);
        pa.explanation = pa.explanation.replace(new RegExp(from, 'g'), to);
      }
    }
  }

  await writeFile(outputPath, JSON.stringify(corpus, null, 2), 'utf8');
  console.log('Wrote fixed corpus to', outputPath);
  console.log('Fixed percentage chapter indices count:', fixedIndices.length);
};

fixCorpus().catch((error) => {
  console.error(error);
  process.exit(1);
});
