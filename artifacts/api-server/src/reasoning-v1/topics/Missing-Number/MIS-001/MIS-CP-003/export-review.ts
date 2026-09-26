import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateMisCp003Question, MIS_CP003_CANDIDATE_IDS } from './generator';
import { misCp003ContextKey, misCp003RuleByCandidateId } from './rule-definitions';

const outputDirectory = process.env.MIS_CP003_REVIEW_OUTPUT_DIR || resolve(process.cwd(), 'dist/reasoning-v1/mis-001');
const outputPath = resolve(outputDirectory, 'MIS-CP-003-REVIEW.md');
mkdirSync(outputDirectory, { recursive: true });

const lines: string[] = [
  '# MIS-CP-003 Review Pack',
  '',
  '**Lifecycle:** executable prototype / review-only',
  '',
  'Permanent QL allocation remains deferred until source saturation and merge/split audit.',
  '',
];

for (const candidateId of MIS_CP003_CANDIDATE_IDS) {
  const rule = misCp003RuleByCandidateId(candidateId);
  lines.push('## ' + candidateId + ' — ' + rule.label, '');
  for (let sample = 0; sample < 5; sample += 1) {
    const seed = 'MIS-CP003-REVIEW:' + candidateId + ':S' + String(sample + 1);
    const q = generateMisCp003Question(candidateId, seed);
    lines.push(
      '### Sample ' + String(sample + 1) + ' · ' + q.difficulty,
      '',
      '~~~text', q.stem, '~~~', '',
      ...q.options.map((o, i) => String.fromCharCode(65 + i) + '. ' + String(o.value) + (i === q.correctIndex ? '  ✅' : '')),
      '',
      '**Explanation**', '', '~~~text', q.explanation, '~~~', '',
      '- Rule: ' + q.ruleId,
      '- Context: ' + misCp003ContextKey(q.context),
      '- Operand count: ' + String(q.operandCount),
      '- Evidence groups: ' + String(q.evidenceGroups.length),
      '- Ambiguity survivors: ' + String(new Set(q.ambiguityAudit.matches.map((m) => m.semanticKey)).size),
      '- Structural fingerprint: ' + q.structuralFingerprint,
      '- Wrong-option labels: ' + q.options.filter((o) => o.errorLabel).map((o) => String(o.errorLabel)).join(', '),
      '',
    );
  }
}

writeFileSync(outputPath, lines.join('\n') + '\n', 'utf8');
console.log(outputPath);
