import fs from 'node:fs';
import path from 'node:path';
import { runRap001Pipeline } from './pipeline';
import { getRap001ActiveCanonicalProblemIds } from './parameter-generator';

const packageDir = path.resolve('artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001');
const registry = JSON.parse(fs.readFileSync(path.join(packageDir, 'task-registry.library.json'), 'utf8')) as {
  entries: Record<string, { cpId: string; taskKind: string; answerType: string }>;
};

const padding = /Our objective|standard rule|Plugging in|Calculating the final|Let's determine|We need to calculate|Using the appropriate formula|Inserting the given|Simplify the expression|Thus, the answer|Therefore, the answer|required result|Method 2|Why it applies|Now simplify|Observe the given relation/i;
const stemPadding = /what will be|calculate .*\?|determine .*\?|write the ratio|find the number which is|two linked ratios are given|starting from|connect these three ratios/i;

function esc(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll('|', '\\|');
}

const lines = [
  '# RAP-001 — Ratio & Proportion English Editorial Review V1',
  '',
  'This is a review-only file for the 67 active question-language contracts. Mathematical answers and runtime generation are already validated. Review the learner-facing stem and explanation for exam realism, direct wording and simple question-specific reasoning.',
  '',
  '## Review rule',
  '',
  '- Stem: direct exam wording; no unnecessary opening or repeated template phrase.',
  '- Explanation: only the calculation needed for this question; no authoring language, generic padding or repeated closing sentence.',
  '- Keep the answer, variable contract and reasoning type unchanged unless a separate mathematical defect is found.',
  '',
  '## Questions',
];

let count = 0;
for (const cpId of getRap001ActiveCanonicalProblemIds()) {
  lines.push('', `### ${cpId}`, '');
  for (const [qlId, entry] of Object.entries(registry.entries).filter(([, value]) => value.cpId === cpId)) {
    const question = runRap001Pipeline(cpId as never, {
      language: 'en',
      questionLanguageId: qlId,
      seed: `rap-001-editorial-review-v1:${qlId}`,
    });
    const explanation = question.explanation.lines.join('\n\n');
    const flags = [
      padding.test(explanation) ? 'EXPLANATION_PADDING' : '',
      stemPadding.test(question.stem) ? 'STEM_TEMPLATE_RISK' : '',
      question.explanation.lines.length > 6 ? 'EXPLANATION_TOO_LONG' : '',
    ].filter(Boolean);
    lines.push(
      `#### ${++count}. ${qlId} · ${entry.taskKind} · ${question.difficultyBand}`,
      '',
      `**Question:** ${question.stem}`,
      '',
      `**Answer:** ${question.answer}`,
      '',
      '**Current explanation:**',
      '',
      explanation,
      '',
      `**Automated review flags:** ${flags.length ? flags.join(', ') : 'none'}`,
      '',
      '**Editorial decision:** PENDING',
      '',
      '**Reviewer note:**',
      '',
      '---',
    );
  }
}

lines.push('', `Total questions: ${count}`, '', 'Status: REVIEW_ONLY — not frozen or registered for production.', '');
fs.writeFileSync(path.join(packageDir, 'RAP-001-ENGLISH-EDITORIAL-REVIEW-V1.md'), lines.join('\n'), 'utf8');
console.log(`Exported ${count} RAP-001 editorial review questions.`);
