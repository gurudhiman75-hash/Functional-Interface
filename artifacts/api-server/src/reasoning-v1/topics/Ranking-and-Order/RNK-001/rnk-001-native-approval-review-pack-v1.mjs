import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const inputRoot = process.argv[2];
const outputRoot = process.argv[3];
if (!inputRoot || !outputRoot) {
  throw new Error('Usage: node rnk-001-native-approval-review-pack-v1.mjs <input-root> <output-root>');
}
mkdirSync(outputRoot, { recursive: true });

const pinned = Object.freeze({
  1: { head: 'd62bb7ea6bf8312a360318cf4939bd15bce057f0', artifact: '9332085480' },
  2: { head: '0e29a4760f80c638c5e318cdc5dcff621fe3b9a4', artifact: '9331950882' },
  3: { head: '618a5a8ebdc33eaad395a10297719cae030d8cc9', artifact: '9332197359' },
  4: { head: '7ac8eeeb76cd2c259957baa67d30c1acb329f36e', artifact: '9334465846' },
  5: { head: '7d28290d061329153935853cba28d5c3ffe63a43', artifact: '9332478402' },
  6: { head: '361cf571f138572caebfd0ecb0fa145e9afdfda3', artifact: '9331032696' },
  7: { head: '60d1fcca93efd27340f969ff8589b95195c2771e', artifact: '9346352174' },
});

const files = Object.freeze({
  cp001: join(inputRoot, 'cp001', 'RNK-CP-001-HI-PA-LOCALIZATION-REVIEW-V4-108Q.md'),
  cp002: join(inputRoot, 'cp002', 'RNK-CP-002-HI-PA-LOCALIZATION-REVIEW-V2-128Q.md'),
  cp003: join(inputRoot, 'cp003', 'RNK-CP-003-HI-PA-LOCALIZATION-REVIEW-V4-144Q.md'),
  cp004v5: join(inputRoot, 'cp004', 'RNK-CP-004-HI-PA-LOCALIZATION-REVIEW-V5-FINAL-144Q.md'),
  cp004v6: join(inputRoot, 'cp004', 'RNK-CP-004-HI-PA-LOCALIZATION-REVIEW-V6-32Q.md'),
  cp005: join(inputRoot, 'cp005', 'RNK-CP-005-HI-PA-LOCALIZATION-REVIEW-V3-48Q.md'),
  cp006: join(inputRoot, 'cp006', 'RNK-CP-006-HI-PA-LOCALIZATION-REVIEW-V1-48Q.md'),
  cp007: join(inputRoot, 'cp007', 'RNK-CP-007-HI-PA-LOCALIZATION-REVIEW-V4-64Q.md'),
  cp007Percentage: join(inputRoot, 'cp007-percentage', 'RNK-CP-007-PERCENTAGE-PRESENTATION-ADAPTER-V2.md'),
});

function read(path) {
  return readFileSync(path, 'utf8');
}

function section(text, startMarker, endMarkers = []) {
  const start = text.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing section marker ${startMarker}`);
  let end = text.length;
  for (const marker of endMarkers.filter(Boolean)) {
    const candidate = text.indexOf(marker, start + startMarker.length);
    if (candidate >= 0) end = Math.min(end, candidate);
  }
  return text.slice(start, end);
}

function blocksByHeading(text, pattern) {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const regex = new RegExp(pattern.source, flags);
  const matches = [...text.matchAll(regex)];
  return matches.map((match, index) => ({
    groups: match.groups ?? {},
    body: `${text.slice(match.index, index + 1 < matches.length ? matches[index + 1].index : text.length).trim()}\n`,
  }));
}

function parseTwoPhase(path, locale, prefix) {
  const text = read(path);
  const localeMarker = locale === 'hi' ? '## Hindi' : '## Punjabi';
  const localeText = section(text, localeMarker, locale === 'hi' ? ['## Punjabi'] : []);
  const questions = section(localeText, '### Questions', ['### Answers and explanations']);
  const explanations = section(localeText, '### Answers and explanations');
  const questionBlocks = blocksByHeading(questions, new RegExp(`^#### (?<id>${prefix}-\\d+) — (?<rest>.*)$`, 'm'));
  const explanationBlocks = blocksByHeading(explanations, new RegExp(`^#### (?<id>${prefix}-\\d+)$`, 'm'));
  const explanationsById = new Map(explanationBlocks.map(({ groups, body }) => [groups.id, body]));
  const result = new Map();
  for (const { groups, body } of questionBlocks) {
    const qlMatch = groups.rest?.match(/RNK-QL-(\d{3})/);
    if (!qlMatch) continue;
    const ql = Number(qlMatch[1]);
    if (!result.has(ql)) {
      const explanation = explanationsById.get(groups.id);
      if (!explanation) throw new Error(`Missing explanation ${groups.id} in ${basename(path)}`);
      result.set(ql, { label: groups.id, body: `${body}\n${explanation}` });
    }
  }
  return result;
}

function parseStructured(path, locale) {
  const text = read(path);
  const startCandidates = locale === 'hi' ? ['# हिंदी समीक्षा', '## Hindi'] : ['# ਪੰਜਾਬੀ ਸਮੀਖਿਆ', '## Punjabi'];
  const start = startCandidates.find((marker) => text.includes(marker));
  if (!start) throw new Error(`Missing ${locale} marker in ${basename(path)}`);
  const localeText = section(text, start, locale === 'hi' ? ['# ਪੰਜਾਬੀ ਸਮੀਖਿਆ', '## Punjabi'] : []);
  const blocks = blocksByHeading(localeText, /^### (?<title>RNK-QL-(?<ql>\d{3}).*)$/m);
  const result = new Map();
  for (const { groups, body } of blocks) {
    const ql = Number(groups.ql);
    if (!result.has(ql)) result.set(ql, { label: groups.title, body });
  }
  return result;
}

function selectCp007(locale, prefix) {
  const text = read(files.cp007);
  const localeMarker = locale === 'hi' ? '## Hindi' : '## Punjabi';
  const localeText = section(text, localeMarker, locale === 'hi' ? ['## Punjabi'] : []);
  const questions = section(localeText, '### Questions', ['### Answers and explanations']);
  const explanations = section(localeText, '### Answers and explanations');
  const questionBlocks = blocksByHeading(questions, new RegExp(`^#### (?<id>${prefix}-\\d+) — (?<rest>.*)$`, 'm'));
  const explanationBlocks = blocksByHeading(explanations, new RegExp(`^#### (?<id>${prefix}-\\d+)$`, 'm'));
  const explanationsById = new Map(explanationBlocks.map(({ groups, body }) => [groups.id, body]));
  const desired = `${prefix}-06`;
  const selected = questionBlocks.find(({ groups }) => groups.id === desired);
  if (!selected) throw new Error(`Missing CP007 ${desired}`);
  return { label: `${desired} / boys-girls standard`, body: `${selected.body}\n${explanationsById.get(desired)}` };
}

function percentageSupplement(locale) {
  const text = read(files.cp007Percentage);
  const marker = locale === 'hi' ? '## hi-IN' : '## pa-IN';
  const localeText = section(text, marker, locale === 'hi' ? ['## pa-IN'] : []);
  const prefix = locale === 'hi' ? 'hi-IN' : 'pa-IN';
  const blocks = blocksByHeading(localeText, new RegExp(`^### (?<title>${prefix}-\\d+ · permanent \\d+)$`, 'm'));
  if (!blocks.length) throw new Error(`Missing CP007 percentage ${locale}`);
  return blocks[0].body;
}

function demoteHeadings(text) {
  return text
    .replace(/^#### /gm, '##### ')
    .replace(/^### /gm, '#### ')
    .replace(/^## /gm, '#### ');
}

function build(locale, prefix, languageName) {
  const selected = new Map();
  for (const [ql, sample] of parseTwoPhase(files.cp001, locale, prefix)) selected.set(ql, { cp: 1, ...sample });
  for (const [ql, sample] of parseTwoPhase(files.cp002, locale, prefix)) selected.set(ql, { cp: 2, ...sample });
  for (const [ql, sample] of parseStructured(files.cp003, locale)) selected.set(ql, { cp: 3, ...sample });

  const cp004v5 = parseStructured(files.cp004v5, locale);
  const cp004v6 = parseStructured(files.cp004v6, locale);
  for (const ql of [27, 28]) selected.set(ql, { cp: 4, label: `${cp004v6.get(ql).label} / V6`, body: cp004v6.get(ql).body });
  for (let ql = 29; ql <= 35; ql += 1) selected.set(ql, { cp: 4, label: `${cp004v5.get(ql).label} / V5-Final inherited by V6`, body: cp004v5.get(ql).body, inherited: true });

  for (const [ql, sample] of parseStructured(files.cp005, locale)) selected.set(ql, { cp: 5, ...sample });
  for (const [ql, sample] of parseStructured(files.cp006, locale)) selected.set(ql, { cp: 6, ...sample });
  selected.set(42, { cp: 7, ...selectCp007(locale, prefix) });

  const required = Array.from({ length: 42 }, (_, index) => index + 1);
  const missing = required.filter((ql) => !selected.has(ql));
  if (missing.length || selected.size !== 42) throw new Error(`Coverage failure ${languageName}: ${missing.join(',')}`);

  const lines = [
    `# RNK-001 ${languageName} Native Approval Review Pack V1`,
    '',
    '> One learner sample per permanent QL, copied from the pinned review evidence. This is an approval convenience artifact only; it does not alter localization authority, answers, QL ownership, or lifecycle state.',
    '',
    '- Coverage: `RNK-QL-001..042` exactly once',
    '- Formal native/product approval: **NOT YET RECORDED**',
    '- Multilingual freeze: **NOT GRANTED**',
    '',
    '## Review checklist',
    '',
    '- [ ] Stems read naturally for the intended exam context',
    '- [ ] Options are natural and unambiguous',
    '- [ ] Answers are stated naturally',
    '- [ ] Explanations are clear, specific, and student-friendly',
    '- [ ] No English/internal-code leakage in learner-facing text',
    '- [ ] No gender/number/case agreement issue',
    '- [ ] Approve this exact pinned lineage',
    '',
  ];

  let currentCp = 0;
  for (const ql of required) {
    const sample = selected.get(ql);
    if (sample.cp !== currentCp) {
      currentCp = sample.cp;
      lines.push(`## RNK-CP-00${currentCp}`, '');
    }
    const evidence = pinned[sample.cp];
    lines.push(
      `### RNK-QL-${String(ql).padStart(3, '0')}`,
      '',
      `> Provenance: CP00${sample.cp}; candidate head \`${evidence.head}\`; retained artifact \`${evidence.artifact}\`; source sample \`${sample.label}\`.`,
      '',
    );
    if (sample.inherited) {
      lines.push('> CP004 note: QL029..035 sample text comes from the full V5-Final export generated at the exact V6 head; V6 tests prove all non-target QLs are learner-text-identical to V5 Final.', '');
    }
    lines.push(demoteHeadings(sample.body).trim(), '', '---', '');
  }

  lines.push(
    '## QL042 exam-real percentage supplement',
    '',
    '> Provenance: CP007 current head `60d1fcca93efd27340f969ff8589b95195c2771e`; percentage artifact `9346352864`; 40/60 exact-integral presentation adapter V2.',
    '',
    demoteHeadings(percentageSupplement(locale)).trim(),
    '',
  );

  const content = `${lines.join('\n').trim()}\n`;
  const qlHeadings = [...content.matchAll(/^### RNK-QL-(\d{3})$/gm)].map((match) => match[1]);
  if (qlHeadings.length !== 42 || new Set(qlHeadings).size !== 42) throw new Error(`Final heading coverage failure ${languageName}`);
  if (!content.includes('40%') || !content.includes('60%')) throw new Error(`Missing percentage supplement ${languageName}`);
  if (!content.includes('NOT YET RECORDED') || !content.includes('NOT GRANTED')) throw new Error(`Lifecycle lock missing ${languageName}`);

  const output = join(outputRoot, `RNK-001-${languageName.toUpperCase()}-NATIVE-APPROVAL-REVIEW-PACK-V1.md`);
  writeFileSync(output, content, 'utf8');
  return {
    output,
    bytes: Buffer.byteLength(content),
    sha256: createHash('sha256').update(content).digest('hex'),
    qlCount: qlHeadings.length,
  };
}

const hindi = build('hi', 'HI', 'Hindi');
const punjabi = build('pa', 'PU', 'Punjabi');
console.log(JSON.stringify({ status: 'EXPORTED', hindi, punjabi, formalApprovalGranted: false, multilingualFreezeGranted: false }, null, 2));
