import { readFileSync, writeFileSync } from 'node:fs';

const paths = process.argv.slice(2);
if (!paths.length) {
  throw new Error('Usage: node rnk-001-native-review-pack-declutter-v1.mjs <review-pack.md> [...]');
}

const SIMPLE_MAX_QL = 35;

function clean(value) {
  return value.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function answerFrom(section) {
  const match = section.match(/^\*\*Answer:\*\*\s*(.+)$/m);
  return match?.[1]?.trim() ?? '';
}

function conclusionLead(text) {
  return /^(?:therefore|hence|thus|so\b|the required answer|the answer|इसलिए|अतः|इस प्रकार|ਇਸ ਲਈ|ਇਸ ਕਰਕੇ|ਅਤੇ ਇਸ ਲਈ|ਸਹੀ ਉੱਤਰ)/iu.test(text.trim());
}

function normalized(value) {
  return value.toLocaleLowerCase('en').replace(/[\s.,;:!?।'"`()\[\]{}*_\-–—]+/gu, '');
}

function stripStepPrefix(line) {
  return line
    .replace(/^(\d+\.\s*)(?:Given facts?|Given|Now apply the relevant rule|Apply the relevant rule|Using the rule)\s*[:：]\s*/iu, '$1')
    .replace(/^(\d+\.\s*)(?:दिए गए तथ्य|दिया गया|अब संबंधित नियम लगाएँ|संबंधित नियम लगाएँ)\s*[:：]\s*/u, '$1')
    .replace(/^(\d+\.\s*)(?:ਦਿੱਤੇ ਤੱਥ|ਦਿੱਤਾ ਗਿਆ|ਹੁਣ ਸੰਬੰਧਿਤ ਨਿਯਮ ਲਗਾਓ|ਸੰਬੰਧਿਤ ਨਿਯਮ ਲਗਾਓ)\s*[:：]\s*/u, '$1');
}

function renumberSteps(text, answer) {
  const lines = text.split('\n');
  const kept = [];
  let step = 0;
  for (const raw of lines) {
    const prefixed = stripStepPrefix(raw);
    const match = prefixed.match(/^\s*(\d+)\.\s+(.+)$/u);
    if (!match) {
      kept.push(prefixed);
      continue;
    }
    const body = match[2].trim();
    const answerText = answer.replace(/^[A-D1-5]\s*[—-]\s*/u, '');
    const repeatsAnswer = answerText && normalized(body).includes(normalized(answerText));
    if (conclusionLead(body) && repeatsAnswer && body.length < 190) continue;
    step += 1;
    kept.push(`${step}. ${body}`);
  }
  return kept.join('\n');
}

function removeBlock(text, headingPattern, nextPatterns) {
  const start = text.search(headingPattern);
  if (start < 0) return text;
  const tail = text.slice(start);
  let endOffset = tail.length;
  for (const pattern of nextPatterns) {
    const match = tail.slice(1).search(pattern);
    if (match >= 0) endOffset = Math.min(endOffset, match + 1);
  }
  return text.slice(0, start) + text.slice(start + endOffset);
}

function declutterSimple(section) {
  const answer = answerFrom(section);
  let text = section;

  text = removeBlock(
    text,
    /^\*\*Exam-speed shortcut(?::\*\*|\*\*)/m,
    [/^\*\*Option analysis(?::\*\*|\*\*)/m, /^\*\*Conclusion(?::\*\*|\*\*)/m, /^---$/m],
  );
  text = removeBlock(
    text,
    /^\*\*Option analysis(?::\*\*|\*\*)/m,
    [/^\*\*Conclusion(?::\*\*|\*\*)/m, /^\*\*Canonical outcome:/m, /^---$/m],
  );
  text = removeBlock(text, /^\*\*Conclusion\*\*\s*$/m, [/^\*\*Canonical outcome:/m, /^---$/m]);
  text = text
    .replace(/^\*\*Conclusion:\*\*.*(?:\n|$)/gm, '')
    .replace(/^\*\*Key rule:\*\*/gm, '**Solution:**')
    .replace(/^\*\*Key rule\*\*$/gm, '**Solution**')
    .replace(/^\*\*Step-by-step:\*\*\s*$/gm, '')
    .replace(/^\*\*Step-by-step solution\*\*\s*$/gm, '');

  text = renumberSteps(text, answer);
  return `${clean(text)}\n`;
}

function declutterAdvanced(section) {
  const answer = answerFrom(section);
  return `${clean(renumberSteps(section, answer))}\n`;
}

function transform(content) {
  const qlPattern = /^### RNK-QL-(\d{3})$/gm;
  const matches = [...content.matchAll(qlPattern)];
  if (matches.length !== 42) {
    throw new Error(`Expected 42 QL sections, found ${matches.length}`);
  }

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
    output += ql <= SIMPLE_MAX_QL ? declutterSimple(section) : declutterAdvanced(section);
  });

  const supplementStart = content.indexOf('## QL042 exam-real percentage supplement');
  if (supplementStart >= 0) output += content.slice(supplementStart);
  return `${clean(output)}\n`;
}

for (const path of paths) {
  const before = readFileSync(path, 'utf8');
  const after = transform(before);
  if (/\*\*Exam-speed shortcut/u.test(after)) throw new Error(`${path}: shortcut clutter remains`);
  const simplePart = after.split('### RNK-QL-036')[0];
  if (/\*\*Option analysis/u.test(simplePart)) throw new Error(`${path}: simple option-analysis clutter remains`);
  if (/\*\*Conclusion/u.test(simplePart)) throw new Error(`${path}: simple conclusion clutter remains`);
  writeFileSync(path, after, 'utf8');
  console.log(JSON.stringify({
    status: 'DECLUTTERED',
    path,
    beforeBytes: Buffer.byteLength(before),
    afterBytes: Buffer.byteLength(after),
    reductionBytes: Buffer.byteLength(before) - Buffer.byteLength(after),
  }));
}
