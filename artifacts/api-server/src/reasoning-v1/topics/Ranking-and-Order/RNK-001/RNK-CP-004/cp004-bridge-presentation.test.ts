import { reconstructUniqueOrder } from './cp004-foundation';
import { generateRnkCp004ExamReadyQuestion } from './cp004-exam-ready-v4';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (let seed = 0; seed < 240; seed += 1) {
  const question = generateRnkCp004ExamReadyQuestion(
    'RNK-CP004-PROT-MISSING-COMPARISON',
    seed,
  );
  const query = question.displayedEvidence.query;
  assert(query.kind === 'MISSING_COMPARISON', `Expected missing comparison at seed ${seed}`);
  const bridge = query.candidates.find(
    (candidate) => `${candidate.higher}>${candidate.lower}` === question.answerKey,
  );
  assert(bridge, `Bridge is absent at seed ${seed}`);
  const firstLine = question.visibleExplanation.lines[0];
  assert(firstLine.startsWith('Fixed blocks: upper '), `Upper block label missing at seed ${seed}`);
  assert(firstLine.includes('  |  lower '), `Lower block label missing at seed ${seed}`);
  assert(firstLine.indexOf(bridge.higher) < firstLine.indexOf('  |  lower '), `Bridge higher entity is not in upper block at seed ${seed}`);
  assert(firstLine.indexOf(bridge.lower) > firstLine.indexOf('  |  lower '), `Bridge lower entity is not in lower block at seed ${seed}`);
  assert(
    question.visibleExplanation.lines[1] === `Join the bottom of the upper block to the top of the lower block: ${bridge.higher} ranks above ${bridge.lower}.`,
    `Bridge instruction is inaccurate at seed ${seed}`,
  );
  const order = reconstructUniqueOrder(
    question.displayedEvidence.entities,
    [...question.displayedEvidence.clues, bridge],
  );
  assert(
    question.visibleExplanation.lines[2] === `Unique order: ${order.join(' > ')}`,
    `Final order mismatch at seed ${seed}`,
  );
}

console.log(JSON.stringify({
  checkpointId: 'RNK-CP-004',
  bridgePresentationSeeds: 240,
  upperLowerBlockOrdering: 'PASS',
}, null, 2));
