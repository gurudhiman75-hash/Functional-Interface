
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateMisCp017Question } from './generator';

const escapeHtml = (value: unknown) =>
  String(value).replace(/[&<>"']/g, (char) =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char] ?? char),
  );

const nl = (value: string) => escapeHtml(value).replace(/\n/g, '<br>');
const dir = resolve(process.cwd(), 'dist/reasoning-v1/mis-001');
const path = resolve(dir, 'MIS-CP-017-REVIEW.html');
mkdirSync(dir, { recursive: true });

const cards: string[] = [];
for (let sample = 1; sample <= 8; sample += 1) {
  const question = generateMisCp017Question(
    'MIS-CAND-091',
    'MIS-CP-017-REVIEW:' + String(sample),
  );
  const options = question.options
    .map((option, index) =>
      '<li class="' + (index === question.correctIndex ? 'correct' : '') + '">' +
      String.fromCharCode(65 + index) + '. ' + escapeHtml(option.value) +
      (index === question.correctIndex ? ' ✓' : '') + '</li>',
    )
    .join('');

  cards.push(
    '<section><h2>Sample ' + sample + '</h2>' +
    '<pre>' + escapeHtml(question.stem) + '</pre>' +
    '<ol>' + options + '</ol>' +
    '<details open><summary>Explanation</summary><p>' + nl(question.explanation) + '</p></details>' +
    '<small>Source-backed SSC CGL mixed whole-number/digit authority · ' +
    escapeHtml(question.structuralFingerprint) + '</small></section>',
  );
}

const html =
  '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">' +
  '<title>MIS-CP-017 SSC CGL Review</title><style>' +
  'body{font-family:Arial;background:#f5f6f8;color:#18181b;margin:0}main{max-width:900px;margin:auto;padding:24px}' +
  'section{background:#fff;border:1px solid #ddd;border-radius:12px;padding:20px;margin:18px 0}' +
  'pre{white-space:pre-wrap;font:16px/1.6 Arial;background:#fafafa;padding:12px;border-radius:8px}' +
  'ol{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(100px,1fr));gap:8px;max-width:500px}' +
  'li{border:1px solid #ddd;padding:8px;border-radius:7px}.correct{font-weight:700}' +
  'details p{line-height:1.6;background:#fafafa;padding:12px;border-radius:7px}small{color:#666}' +
  '</style></head><body><main><h1>MIS-CP-017 — SSC CGL Mixed Whole-Number / Digit Rule</h1>' +
  '<p>Review-only source-discovered authority. No permanent QL is allocated.</p>' +
  cards.join('') + '</main></body></html>';

writeFileSync(path, html);
console.log(path);
