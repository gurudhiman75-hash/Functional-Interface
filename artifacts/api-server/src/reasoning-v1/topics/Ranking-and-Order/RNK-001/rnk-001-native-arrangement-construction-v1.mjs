import { readFileSync, writeFileSync } from 'node:fs';

const paths = process.argv.slice(2);
if (!paths.length) {
  throw new Error('Usage: node rnk-001-native-arrangement-construction-v1.mjs <review-pack.md> [...]');
}

const TARGET_QLS = new Set([27, 28, 29, 30, 31, 32, 33, 34]);
const HINDI_ORDINALS = ['पहली', 'दूसरी', 'तीसरी', 'चौथी', 'पाँचवीं', 'छठी', 'सातवीं', 'आठवीं', 'नौवीं', 'दसवीं'];
const PUNJABI_ORDINALS = ['ਪਹਿਲੀ', 'ਦੂਜੀ', 'ਤੀਜੀ', 'ਚੌਥੀ', 'ਪੰਜਵੀਂ', 'ਛੇਵੀਂ', 'ਸੱਤਵੀਂ', 'ਅੱਠਵੀਂ', 'ਨੌਵੀਂ', 'ਦਸਵੀਂ'];

function localeFrom(content, path) {
  if (/HINDI|Hindi/u.test(content) || /HINDI|Hindi/u.test(path)) return 'hi';
  if (/PUNJABI|Punjabi/u.test(content) || /PUNJABI|Punjabi/u.test(path)) return 'pa';
  throw new Error(`${path}: could not determine Hindi/Punjabi locale`);
}

function normalize(value) {
  return value
    .toLocaleLowerCase('en')
    .replace(/[\s.,;:!?।'"`()\[\]{}*_\-–—]+/gu, '');
}

function finalOrder(section, locale) {
  const solutionStart = section.search(/^\*\*Solution(?::\*\*|\*\*)/m);
  if (solutionStart < 0) throw new Error('Missing Solution heading');
  const solution = section.slice(solutionStart);
  const pattern = locale === 'hi'
    ? /क्रम है:\s*([^\n]+)/u
    : /ਕ੍ਰਮ ਹੈ:\s*([^\n]+)/u;
  const match = solution.match(pattern);
  if (!match) throw new Error('Missing final-order line in native arrangement solution');
  const raw = match[1].trim().replace(/[।.]$/u, '');
  const names = raw.split('>').map((name) => name.trim()).filter(Boolean);
  if (names.length < 4) throw new Error(`Final order too short: ${raw}`);
  return names;
}

function questionClues(section) {
  const questionStart = section.indexOf('**Question**');
  const optionsStart = section.indexOf('**Options**', questionStart);
  if (questionStart < 0 || optionsStart < 0) throw new Error('Missing Question/Options markers');
  const question = section.slice(questionStart, optionsStart);
  return [...question.matchAll(/^-\s+(.+)$/gmu)].map((match) => match[1].trim());
}

function relationForClue(clue, order, locale) {
  const indices = new Map(order.map((name, index) => [name, index]));
  const mentioned = order
    .filter((name) => clue.includes(name))
    .sort((left, right) => clue.indexOf(left) - clue.indexOf(right));
  if (mentioned.length !== 2) {
    throw new Error(`Expected exactly two ordered names in clue '${clue}', found ${mentioned.length}`);
  }

  const [first, second] = mentioned;
  let relation;
  if (locale === 'hi') {
    if (/नीचे/u.test(clue)) relation = [second, first];
    else if (/(?:ऊपर|बेहतर|ऊँचा)/u.test(clue)) relation = [first, second];
    else throw new Error(`Hindi clue direction not recognized: '${clue}'`);
  } else {
    if (/ਹੇਠਾਂ/u.test(clue)) relation = [second, first];
    else if (/(?:ਉੱਪਰ|ਬਿਹਤਰ|ਉੱਚਾ)/u.test(clue)) relation = [first, second];
    else throw new Error(`Punjabi clue direction not recognized: '${clue}'`);
  }

  const [higher, lower] = relation;
  if (indices.get(higher) >= indices.get(lower)) {
    throw new Error(`Native clue contradicts frozen order: '${clue}' -> ${higher} > ${lower}`);
  }
  return relation;
}

function longestPath(order, edges) {
  const successors = new Map(order.map((name) => [name, []]));
  for (const [higher, lower] of edges) successors.get(higher).push(lower);
  const memo = new Map();

  function visit(name) {
    if (memo.has(name)) return memo.get(name);
    let best = [name];
    for (const next of successors.get(name) ?? []) {
      const candidate = [name, ...visit(next)];
      if (candidate.length > best.length) best = candidate;
    }
    memo.set(name, best);
    return best;
  }

  let best = [];
  for (const name of order) {
    const candidate = visit(name);
    if (candidate.length > best.length) best = candidate;
  }
  return best;
}

function originalAnswerStep(section, order) {
  const solutionStart = section.search(/^\*\*Solution(?::\*\*|\*\*)/m);
  const separator = section.indexOf('\n---', solutionStart);
  const solution = section.slice(solutionStart, separator >= 0 ? separator : section.length);
  const numbered = [...solution.matchAll(/^\s*\d+\.\s+(.+)$/gmu)].map((match) => match[1].trim());
  if (!numbered.length) return '';
  const candidate = numbered[numbered.length - 1];
  const orderKey = normalize(order.join('>'));
  if (normalize(candidate).includes(orderKey)) return '';
  if (/^(?:दी गई तुलनाओं को जोड़ने पर|ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਜੋੜਨ ਉੱਤੇ)/u.test(candidate)) return '';
  return candidate;
}

function nativeSteps(section, locale) {
  const order = finalOrder(section, locale);
  const clues = questionClues(section);
  if (clues.length < 4) throw new Error(`Expected at least four arrangement clues, found ${clues.length}`);

  const ordinals = locale === 'hi' ? HINDI_ORDINALS : PUNJABI_ORDINALS;
  const edges = [];
  const steps = [];
  let previousLongest = 0;

  clues.forEach((clue, index) => {
    const relation = relationForClue(clue, order, locale);
    if (!edges.some(([a, b]) => a === relation[0] && b === relation[1])) edges.push(relation);
    const chain = longestPath(order, edges);
    const ordinal = ordinals[index] ?? `${index + 1}`;

    if (locale === 'hi') {
      let line = `${ordinal} तुलना से: ${relation[0]} > ${relation[1]}।`;
      if (chain.length >= 3 && chain.length > previousLongest) {
        line += ` इससे श्रृंखला बनती है: ${chain.join(' > ')}।`;
      }
      steps.push(line);
    } else {
      let line = `${ordinal} ਤੁਲਨਾ ਤੋਂ: ${relation[0]} > ${relation[1]}।`;
      if (chain.length >= 3 && chain.length > previousLongest) {
        line += ` ਇਸ ਨਾਲ ਲੜੀ ਬਣਦੀ ਹੈ: ${chain.join(' > ')}।`;
      }
      steps.push(line);
    }
    previousLongest = Math.max(previousLongest, chain.length);
  });

  steps.push(locale === 'hi'
    ? `सभी संबंध जोड़ने पर पूरा क्रम है: ${order.join(' > ')}।`
    : `ਸਾਰੇ ਸੰਬੰਧ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਪੂਰਾ ਕ੍ਰਮ ਹੈ: ${order.join(' > ')}।`);

  const answerStep = originalAnswerStep(section, order);
  if (answerStep) steps.push(answerStep);

  return { order, clues, steps };
}

function replaceSolution(section, locale) {
  const solutionMatch = section.match(/^\*\*Solution(?::\*\*|\*\*)/m);
  if (!solutionMatch || solutionMatch.index == null) throw new Error('Missing Solution heading');
  const solutionStart = solutionMatch.index;
  const separator = section.indexOf('\n---', solutionStart);
  if (separator < 0) throw new Error('Missing section separator after Solution');

  const immutablePrefix = section.slice(0, solutionStart);
  const { order, clues, steps } = nativeSteps(section, locale);
  const rendered = `**Solution**\n\n${steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n`;
  const output = `${immutablePrefix}${rendered}${section.slice(separator)}`;

  if (output.slice(0, solutionStart) !== immutablePrefix) throw new Error('Question/options/answer surface changed');
  if (steps.length < clues.length + 1) throw new Error('Construction path is not exhaustive enough');
  const fullOrder = order.join(' > ');
  if (!output.includes(fullOrder)) throw new Error('Final order missing after construction');
  if (locale === 'hi' && !output.includes('पहली तुलना से:')) throw new Error('Hindi clue construction missing');
  if (locale === 'pa' && !output.includes('ਪਹਿਲੀ ਤੁਲਨਾ ਤੋਂ:')) throw new Error('Punjabi clue construction missing');
  return output;
}

function transform(content, path) {
  const locale = localeFrom(content, path);
  const qlPattern = /^### RNK-QL-(\d{3})$/gm;
  const matches = [...content.matchAll(qlPattern)];
  if (matches.length !== 42) throw new Error(`${path}: expected 42 QL sections, found ${matches.length}`);

  let output = content.slice(0, matches[0].index);
  matches.forEach((match, index) => {
    const start = match.index;
    const end = index + 1 < matches.length
      ? matches[index + 1].index
      : (content.indexOf('## QL042 exam-real percentage supplement', start) >= 0
        ? content.indexOf('## QL042 exam-real percentage supplement', start)
        : content.length);
    const section = content.slice(start, end);
    const ql = Number(match[1]);
    output += TARGET_QLS.has(ql) ? replaceSolution(section, locale) : section;
  });

  const supplementStart = content.indexOf('## QL042 exam-real percentage supplement');
  if (supplementStart >= 0) output += content.slice(supplementStart);

  const original35 = content.slice(content.indexOf('### RNK-QL-035'), content.indexOf('### RNK-QL-036'));
  const transformed35 = output.slice(output.indexOf('### RNK-QL-035'), output.indexOf('### RNK-QL-036'));
  if (original35 !== transformed35) throw new Error(`${path}: QL035 should remain unchanged`);
  return output;
}

for (const path of paths) {
  const before = readFileSync(path, 'utf8');
  const after = transform(before, path);
  writeFileSync(path, after, 'utf8');
  console.log(JSON.stringify({
    status: 'NATIVE_ARRANGEMENT_CONSTRUCTION_EXPANDED',
    path,
    targetQls: [...TARGET_QLS].map((ql) => `RNK-QL-${String(ql).padStart(3, '0')}`),
    bytesBefore: Buffer.byteLength(before),
    bytesAfter: Buffer.byteLength(after),
  }));
}
