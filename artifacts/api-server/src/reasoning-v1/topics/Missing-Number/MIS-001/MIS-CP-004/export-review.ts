import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateMisCp004Question, MIS_CP004_CANDIDATE_IDS } from './generator';
import { misCp004RuleByCandidateId } from './rule-definitions';

const outputDirectory = process.env.MIS_CP004_REVIEW_OUTPUT_DIR
  || resolve(process.cwd(), 'dist/reasoning-v1/mis-001');
const outputPath = resolve(outputDirectory, 'MIS-CP-004-REVIEW.md');
mkdirSync(outputDirectory, { recursive: true });

const lines: string[] = [
  '# MIS-CP-004 Review Pack',
  '',
  '**Lifecycle:** executable prototype / review-only',
  '',
  'Permanent QL allocation remains deferred until source saturation and merge/split audit.',
  '',
  'The small-factorial family is explicitly source-thin and provisional pending source saturation.',
  '',
];

for (const candidateId of MIS_CP004_CANDIDATE_IDS) {
  const rule = misCp004RuleByCandidateId(candidateId);
  lines.push('## ' + candidateId + ' — ' + rule.label, '');
  if (rule.sourceThin) lines.push('> Source-thin provisional family: do not promote before source audit.', '');

  for (let sample = 0; sample < 5; sample += 1) {
    const seed = 'MIS-CP004-REVIEW:' + candidateId + ':S' + String(sample + 1);
    const q = generateMisCp004Question(candidateId, seed);
    lines.push(
      '### Sample ' + String(sample + 1) + ' · ' + q.difficulty,
      '',
      '~~~text',
      q.stem,
      '~~~',
      '',
      ...q.options.map((option, index) =>
        String.fromCharCode(65 + index) + '. ' + String(option.value) + (index === q.correctIndex ? '  ✅' : ''),
      ),
      '',
      '**Explanation**',
      '',
      '~~~text',
      q.explanation,
      '~~~',
      '',
      '- Rule: ' + q.ruleId,
      '- Operand count: ' + String(q.operandCount),
      '- Evidence groups: ' + String(q.evidenceGroups.length),
      '- Ambiguity survivors: ' + String(new Set(q.ambiguityAudit.matches.map((match) => match.semanticKey)).size),
      '- Source-thin: ' + String(q.sourceThin),
      '- Structural fingerprint: ' + q.structuralFingerprint,
      '- Wrong-option labels: ' + q.options.filter((option) => option.errorLabel).map((option) => String(option.errorLabel)).join(', '),
      '',
    );
  }
}

writeFileSync(outputPath, lines.join('\n') + '\n', 'utf8');
console.log(outputPath);
