import assert from 'node:assert/strict';
import { generateMis001QuestionStudioBatch } from './question-studio-integration';
import { MIS_PERMANENT_QL_IDS } from './MIS-PERMANENT-QL-REGISTRY';

const approvedStemOpenings = new Set([
  'Find the number that will replace the question mark (?).',
  'Find the missing value in the following figure.',
  'Find the missing value in the following figures.',
  'Find the missing number.',
  'Find the missing number in the following figures.',
]);

const bannedLearnerText = /(MIS-CAND-|MIS-CP-|semantic authority|candidate id|checkpoint id|source-backed|source provenance|Study the pattern|Study the figure|nearest whole|first do|do this first)/iu;
const lateOperandCounts: Record<string, number> = {
  'MIS-CP-022': 2,
  'MIS-CP-023': 3,
  'MIS-CP-024': 1,
  'MIS-CP-025': 3,
  'MIS-CP-026': 1,
  'MIS-CP-027': 2,
  'MIS-CP-028': 3,
};

const seeds = ['MIS-DEEP-AUDIT-A','MIS-DEEP-AUDIT-B','MIS-DEEP-AUDIT-C','MIS-DEEP-AUDIT-D'];
const english: any[] = [];
const numericByCandidate = new Map<string, Set<string>>();
const structuralByCandidate = new Map<string, Set<string>>();
const seenQls = new Set<string>();
const seenCheckpoints = new Set<string>();
const seenRenderers = new Set<string>();

for (const seed of seeds) {
  const batch = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language: 'en',
    count: 112,
    seed,
  });
  assert.equal(batch.questions.length, 112);

  for (const q of batch.questions as any[]) {
    english.push(q);
    seenCheckpoints.add(String(q.checkpointId));
    seenRenderers.add(String(q.renderer));
    if (q.qlId) seenQls.add(String(q.qlId));

    const firstLine = String(q.stem).split('\n')[0]?.trim();
    assert.ok(approvedStemOpenings.has(firstLine), q.candidateId + ': non-exam stem opening: ' + firstLine);
    assert.doesNotMatch(String(q.stem), bannedLearnerText, q.candidateId + ': learner stem leakage');
    assert.doesNotMatch(String(q.explanation), bannedLearnerText, q.candidateId + ': learner explanation leakage');

    assert.equal(q.options.length, 4, q.candidateId + ': option count');
    assert.equal(new Set(q.options).size, 4, q.candidateId + ': duplicate option');
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4, q.candidateId + ': correct index');
    assert.equal(String(q.options[q.correctIndex]), String(q.answer), q.candidateId + ': answer/index mismatch');

    assert.equal(q.validation.sameRuleFitsAllExamples, true, q.candidateId + ': evidence-rule failure');
    assert.equal(q.validation.exactlyOneIntendedRule, true, q.candidateId + ': ambiguity failure');
    assert.equal(q.validation.exactlyOneCorrect, true, q.candidateId + ': correct-option failure');
    assert.equal(q.validation.fourUniqueOptions, true, q.candidateId + ': option uniqueness failure');
    assert.equal(q.validation.solverAgreement, true, q.candidateId + ': solver disagreement');
    assert.equal(q.validation.noDecimal, true, q.candidateId + ': decimal answer');
    assert.ok(String(q.explanation).includes(String(q.answer)), q.candidateId + ': answer absent from explanation');

    assert.ok(Number.isInteger(q.operandCount) && q.operandCount >= 1 && q.operandCount <= 4, q.candidateId + ': invalid operandCount');
    if (lateOperandCounts[q.checkpointId] != null) {
      assert.equal(q.operandCount, lateOperandCounts[q.checkpointId], q.checkpointId + ': adapter operand metadata drift');
    }

    if (String(q.renderer).startsWith('SVG_')) {
      assert.ok(Array.isArray(q.figures) && q.figures.length > 0, q.candidateId + ': SVG renderer missing figure payload');
      assert.ok(q.figures.every((f: any) => typeof f.svg === 'string' && f.svg.includes('<svg')), q.candidateId + ': malformed SVG payload');
    }

    if (q.sourceThin === true) {
      assert.equal(q.qlId, null, q.candidateId + ': source-thin item must not consume permanent QL');
      assert.equal(q.provisionalQl, true, q.candidateId + ': source-thin item must remain provisional');
    }

    const nset = numericByCandidate.get(q.candidateId) ?? new Set<string>();
    nset.add(String(q.numericFingerprint));
    numericByCandidate.set(q.candidateId, nset);
    const sset = structuralByCandidate.get(q.candidateId) ?? new Set<string>();
    sset.add(String(q.structuralFingerprint));
    structuralByCandidate.set(q.candidateId, sset);
  }
}

assert.equal(seenCheckpoints.size, 28, 'all MIS checkpoints must be reachable');
assert.equal(seenQls.size, 73, 'all permanent MIS QLs must be reachable');
for (const ql of MIS_PERMANENT_QL_IDS) assert.ok(seenQls.has(ql), ql + ' absent');
assert.ok(seenRenderers.size >= 5, 'renderer breadth unexpectedly thin: ' + [...seenRenderers].join(', '));

for (const [candidateId, values] of numericByCandidate) {
  assert.ok(values.size >= 2, candidateId + ': numeric pool too thin across four seeds (' + values.size + ')');
}
assert.equal(structuralByCandidate.size, 112);

for (const language of ['hi','pa'] as const) {
  const batch = await generateMis001QuestionStudioBatch({
    packageId: 'MIS-001',
    language,
    count: 112,
    seed: 'MIS-DEEP-AUDIT-LOCALIZED',
  });
  assert.equal(batch.questions.length, 112);
  for (const q of batch.questions as any[]) {
    assert.doesNotMatch(String(q.stem), bannedLearnerText, q.candidateId + ': localized stem leakage');
    assert.doesNotMatch(String(q.explanation), bannedLearnerText, q.candidateId + ': localized explanation leakage');
    assert.equal(q.validation.solverAgreement, true);
    assert.equal(q.validation.exactlyOneIntendedRule, true);
    assert.equal(q.validation.fourUniqueOptions, true);
    assert.ok(String(q.explanation).includes(String(q.answer)));
    if (language === 'hi') {
      assert.ok(/[\u0900-\u097F]/.test(String(q.stem)), q.candidateId + ': Hindi stem missing Devanagari');
      assert.ok(/[\u0900-\u097F]/.test(String(q.explanation)), q.candidateId + ': Hindi explanation missing Devanagari');
    } else {
      assert.ok(/[\u0A00-\u0A7F]/.test(String(q.stem)), q.candidateId + ': Punjabi stem missing Gurmukhi');
      assert.ok(/[\u0A00-\u0A7F]/.test(String(q.explanation)), q.candidateId + ': Punjabi explanation missing Gurmukhi');
    }
  }
}

console.log(JSON.stringify({
  status: 'PASS_MIS_001_FINAL_DEEP_AUDIT_V1',
  englishQuestionsAudited: english.length,
  runtimePatterns: numericByCandidate.size,
  permanentQls: seenQls.size,
  checkpoints: seenCheckpoints.size,
  renderers: [...seenRenderers].sort(),
}, null, 2));
