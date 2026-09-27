import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateMisCp002Question, MIS_CP002_CANDIDATE_IDS } from './generator';
import { misCp002ContextKey, misCp002RuleByCandidateId } from './rule-definitions';

const outputDirectory = process.env.MIS_CP002_REVIEW_OUTPUT_DIR
  || resolve(process.cwd(), 'dist/reasoning-v1/mis-001');
const outputPath = resolve(outputDirectory, 'MIS-CP-002-REVIEW.md');
mkdirSync(outputDirectory, { recursive: true });

const lines: string[] = [
  '# MIS-CP-002 Review Pack',
  '',
  '**Lifecycle:** executable prototype / review-only',
  '',
  'Permanent QL allocation remains deferred until source saturation and merge/split audit.',
  '',
  'This pack contains exact deterministic runtime samples for all seven three-input semantic candidate families.',
  '',
];

for (const candidateId of MIS_CP002_CANDIDATE_IDS) {
  const rule = misCp002RuleByCandidateId(candidateId);
  lines.push('## ' + candidateId + ' — ' + rule.label, '');
  for (let sample = 0; sample < 5; sample += 1) {
    const seed = 'MIS-CP002-REVIEW:' + candidateId + ':S' + String(sample + 1);
    const question = generateMisCp002Question(candidateId, seed);
    lines.push(
      '### Sample ' + String(sample + 1) + ' · ' + question.difficulty,
      '',
      '~~~text',
      question.stem,
      '~~~',
      '',
      ...question.options.map((option, index) =>
        String.fromCharCode(65 + index) + '. ' + String(option.value) + (index === question.correctIndex ? '  ✅' : ''),
      ),
      '',
      '**Explanation**',
      '',
      '~~~text',
      question.explanation,
      '~~~',
      '',
      '- Rule: ' + question.ruleId,
      '- Role context: ' + misCp002ContextKey(question.context),
      '- Evidence groups: ' + String(question.evidenceGroups.length),
      '- Ambiguity survivors: ' + String(new Set(question.ambiguityAudit.matches.map((match) => match.semanticKey)).size),
      '- Structural fingerprint: ' + question.structuralFingerprint,
      '- Wrong-option labels: ' + question.options.filter((option) => option.errorLabel).map((option) => String(option.errorLabel)).join(', '),
      '',
    );
  }
}

writeFileSync(outputPath, lines.join('\n') + '\n', 'utf8');
console.log(outputPath);
