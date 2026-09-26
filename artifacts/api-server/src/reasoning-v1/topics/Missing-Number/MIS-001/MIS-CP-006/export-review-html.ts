import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateMisCp006Question, MIS_CP006_CANDIDATE_IDS } from './generator';
import { misCp006RuleByCandidateId } from './rule-definitions';

function esc(value: unknown): string {
  return String(value).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch] ?? ch));
}
function nl(value: string): string { return esc(value).replace(/\n/g, '<br>'); }

const outputDirectory = process.env.MIS_CP_006_HTML_OUTPUT_DIR || resolve(process.cwd(), 'dist/reasoning-v1/mis-001');
const outputPath = resolve(outputDirectory, 'MIS-CP-006-REVIEW.html');
mkdirSync(outputDirectory, { recursive: true });

const cards: string[] = [];
for (const candidateId of MIS_CP006_CANDIDATE_IDS) {
  const rule = misCp006RuleByCandidateId(candidateId);
  const samples: string[] = [];
  for (let sample = 1; sample <= 4; sample += 1) {
    const q = generateMisCp006Question(candidateId, 'MIS-CP-006-HTML:' + candidateId + ':S' + sample);
    const figures = q.figures.map((figure, index) =>
      '<div class="figure"><div class="figure-label">Figure ' + (index + 1) + '</div>' + figure.svg + '</div>'
    ).join('');
    const options = q.options.map((option, index) =>
      '<li class="' + (index === q.correctIndex ? 'correct' : '') + '">' +
      String.fromCharCode(65 + index) + '. ' + esc(option.value) +
      (index === q.correctIndex ? ' ✓' : '') + '</li>'
    ).join('');
    samples.push(
      '<section class="sample">' +
      '<h3>Sample ' + sample + ' <span>' + esc(q.difficulty) + '</span></h3>' +
      '<p class="stem">' + esc('Find the missing value in the following figure.') + '</p>' +
      '<div class="figures">' + figures + '</div>' +
      '<ol class="options">' + options + '</ol>' +
      '<details open><summary>Explanation</summary><div class="explanation">' + nl(q.explanation) + '</div></details>' +
      '<div class="meta">Rule: <code>' + esc(q.ruleId) + '</code> · Renderer: <code>' + esc(q.renderer) + '</code> · Fingerprint: <code>' + esc(q.structuralFingerprint) + '</code></div>' +
      '</section>'
    );
  }
  cards.push('<article class="candidate"><h2>' + esc(candidateId) + ' — ' + esc(rule.label) + '</h2>' + samples.join('') + '</article>');
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MIS-CP-006 Circle / Wheel Review</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;margin:0;background:#f5f6f8;color:#18181b}
  main{max-width:1100px;margin:0 auto;padding:28px}
  h1{margin:0 0 8px}.intro{color:#52525b;margin-bottom:28px}
  .candidate{background:#fff;border:1px solid #e4e4e7;border-radius:14px;padding:20px;margin:20px 0}
  .candidate>h2{margin-top:0;font-size:20px}
  .sample{border-top:1px solid #e4e4e7;padding:22px 0}
  .sample h3{margin:0 0 12px}.sample h3 span{font-size:13px;font-weight:600;background:#f4f4f5;padding:4px 8px;border-radius:999px}
  .stem{font-weight:700}.figures{display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start;margin:18px 0}
  .figure{width:220px;border:1px solid #d4d4d8;border-radius:10px;padding:10px;background:white}
  .figure-label{text-align:center;font-size:12px;color:#71717a;margin-bottom:4px}
  svg{width:100%;height:auto;display:block;color:#111827}
  .options{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(140px,1fr));gap:8px;max-width:520px}
  .options li{border:1px solid #e4e4e7;border-radius:8px;padding:9px 12px}.options .correct{font-weight:700;border-color:#71717a}
  details{margin-top:16px}.explanation{margin-top:10px;line-height:1.65;background:#fafafa;border-radius:8px;padding:14px}
  .meta{margin-top:12px;color:#71717a;font-size:12px;overflow-wrap:anywhere}
  code{background:#f4f4f5;padding:2px 4px;border-radius:4px}
  @media(max-width:600px){main{padding:14px}.figure{width:100%;max-width:260px}.options{grid-template-columns:1fr}}
</style>
</head>
<body><main>
<h1>MIS-CP-006 Circle / Wheel Review</h1>
<p class="intro">Actual inline SVG wheel figures; three-value wheels contain no fake fourth placeholder.</p>
${cards.join('')}
</main></body></html>`;

writeFileSync(outputPath, html, 'utf8');
console.log(outputPath);
