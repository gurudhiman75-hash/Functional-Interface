import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp001Question,
  RNK_CP001_PROTOTYPE_IDS,
  type RnkCp001PrototypeId,
} from './cp001-runtime';
import {
  generateRnkCp001SourceWaveReviewedQuestion,
  RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS,
  type RnkCp001SourceWavePrototypeId,
} from './cp001-source-wave-reviewed';
import {
  generateRnkCp001FinalInverseQuestion,
  RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID,
} from './cp001-final-inverse-gap';
import {
  authorityForRnkCp001Prototype,
  listRnkCp001PrototypeAuthorityRows,
  RNK_CP001_DISCOVERY_PROTOTYPE_IDS,
  RNK_CP001_PROVISIONAL_AUTHORITIES,
  RNK_CP001_PROVISIONAL_AUTHORITY_IDS,
  type RnkCp001DiscoveryPrototypeId,
  type RnkCp001ProvisionalAuthorityId,
} from './cp001-provisional-consolidation';

const SEEDS_PER_PROTOTYPE = 240;
const FOUNDATION_IDS = new Set<string>(RNK_CP001_PROTOTYPE_IDS);
const SOURCE_WAVE_IDS = new Set<string>(RNK_CP001_SOURCE_WAVE_PROTOTYPE_IDS);

interface AuditableQuestion {
  readonly prototypeId: RnkCp001DiscoveryPrototypeId;
  readonly permanentQlId: null;
  readonly contextId: string;
  readonly difficulty: string;
  readonly answerSemantic: 'RANK' | 'COUNT' | 'TOTAL';
  readonly answer: number;
  readonly options: readonly {
    readonly value: number;
    readonly misconceptionId: string;
  }[];
  readonly correctIndex: number;
  readonly normalizedState: {
    readonly total: number;
    readonly rankFromStart: number;
    readonly rankFromEnd: number;
    readonly beforeCount: number;
    readonly afterCount: number;
  };
  readonly lifecycle: {
    readonly questionStudioDiscoverable: false;
    readonly questionBankStatus: 'NOT_STORED';
    readonly testEligibility: 'INELIGIBLE';
    readonly publiclyPublishable: false;
  };
}

function generateQuestion(
  prototypeId: RnkCp001DiscoveryPrototypeId,
  seed: number,
): AuditableQuestion {
  if (FOUNDATION_IDS.has(prototypeId)) {
    return generateRnkCp001Question(prototypeId as RnkCp001PrototypeId, seed);
  }
  if (SOURCE_WAVE_IDS.has(prototypeId)) {
    return generateRnkCp001SourceWaveReviewedQuestion(
      prototypeId as RnkCp001SourceWavePrototypeId,
      seed,
    );
  }
  if (prototypeId === RNK_CP001_FINAL_INVERSE_PROTOTYPE_ID) {
    return generateRnkCp001FinalInverseQuestion(seed);
  }
  throw new Error(`Unknown discovery prototype ${prototypeId}`);
}

function expectedByAuthority(
  authorityId: RnkCp001ProvisionalAuthorityId,
  question: AuditableQuestion,
): number {
  const state = question.normalizedState;
  switch (authorityId) {
    case 'RNK-CP001-AUTH-01-CONVERT-RANK-BETWEEN-ENDS': {
      const evidence = (question as unknown as {
        readonly displayedEvidence: {
          readonly knownSide: 'START' | 'END';
        };
      }).displayedEvidence;
      return evidence.knownSide === 'START' ? state.rankFromEnd : state.rankFromStart;
    }
    case 'RNK-CP001-AUTH-02-TOTAL-FROM-BOTH-END-RANKS':
      return state.rankFromStart + state.rankFromEnd - 1;
    case 'RNK-CP001-AUTH-03-SIDE-COUNT-FROM-SAME-SIDE-RANK':
      return question.prototypeId === 'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK'
        ? state.rankFromStart - 1
        : state.rankFromEnd - 1;
    case 'RNK-CP001-AUTH-04-OPPOSITE-SIDE-COUNT-FROM-TOTAL-AND-RANK':
      return question.prototypeId === 'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK'
        ? state.total - state.rankFromStart
        : state.total - state.rankFromEnd;
    case 'RNK-CP001-AUTH-05-SAME-SIDE-RANK-FROM-SIDE-COUNT':
      return question.prototypeId === 'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE'
        ? state.beforeCount + 1
        : state.afterCount + 1;
    case 'RNK-CP001-AUTH-06-OPPOSITE-END-RANK-FROM-TOTAL-AND-SIDE-COUNT':
      return question.prototypeId === 'RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL'
        ? state.total - state.afterCount
        : state.total - state.beforeCount;
    case 'RNK-CP001-AUTH-07-EXACT-MIDDLE-RANK-FROM-ODD-TOTAL':
      assert.equal(state.total % 2, 1);
      assert.equal(state.rankFromStart, state.rankFromEnd);
      return (state.total + 1) / 2;
    case 'RNK-CP001-AUTH-08-ODD-TOTAL-FROM-EXACT-MIDDLE-RANK':
      assert.equal(state.rankFromStart, state.rankFromEnd);
      return 2 * state.rankFromStart - 1;
    case 'RNK-CP001-AUTH-09-TOTAL-FROM-BEFORE-AND-AFTER-COUNTS':
      return state.beforeCount + state.afterCount + 1;
  }
}

assert.equal(RNK_CP001_DISCOVERY_PROTOTYPE_IDS.length, 13);
assert.equal(new Set(RNK_CP001_DISCOVERY_PROTOTYPE_IDS).size, 13);
assert.equal(RNK_CP001_PROVISIONAL_AUTHORITIES.length, 9);
assert.equal(new Set(RNK_CP001_PROVISIONAL_AUTHORITY_IDS).size, 9);

const flattenedOwnership = RNK_CP001_PROVISIONAL_AUTHORITIES.flatMap(
  (authority) => authority.sourcePrototypeIds,
);
assert.equal(flattenedOwnership.length, 13);
assert.equal(new Set(flattenedOwnership).size, 13);
assert.deepEqual(
  [...flattenedOwnership].sort(),
  [...RNK_CP001_DISCOVERY_PROTOTYPE_IDS].sort(),
  'Every discovery prototype must be owned exactly once',
);

const pairedAuthorities = RNK_CP001_PROVISIONAL_AUTHORITIES.filter(
  (authority) => authority.sourcePrototypeIds.length === 2,
);
const retainedAuthorities = RNK_CP001_PROVISIONAL_AUTHORITIES.filter(
  (authority) => authority.sourcePrototypeIds.length === 1,
);
assert.equal(pairedAuthorities.length, 4);
assert.equal(retainedAuthorities.length, 5);

const authorityReports = RNK_CP001_PROVISIONAL_AUTHORITIES.map((authority) => {
  const contexts = new Set<string>();
  const difficulties = new Set<string>();
  const answerSemantics = new Set<string>();
  const answerPositions = [0, 0, 0, 0];
  let generatedQuestions = 0;

  assert.equal(authority.permanentQlId, null);
  assert.equal(authority.reviewStatus, 'PROVISIONAL_CONSOLIDATION_REVIEW');
  assert.equal(authority.questionStudioDiscoverable, false);
  assert.equal(authority.questionBankStatus, 'NOT_STORED');
  assert.equal(authority.testEligibility, 'INELIGIBLE');
  assert.equal(authority.publiclyPublishable, false);

  for (const prototypeId of authority.sourcePrototypeIds) {
    assert.equal(authorityForRnkCp001Prototype(prototypeId).authorityId, authority.authorityId);

    for (let seed = 0; seed < SEEDS_PER_PROTOTYPE; seed += 1) {
      const question = generateQuestion(prototypeId, seed);
      assert.equal(question.prototypeId, prototypeId);
      assert.equal(question.permanentQlId, null);
      assert.equal(question.answerSemantic, authority.answerSemantic);
      assert.equal(question.answer, expectedByAuthority(authority.authorityId, question));

      const state = question.normalizedState;
      assert.equal(state.rankFromStart + state.rankFromEnd, state.total + 1);
      assert.equal(state.beforeCount, state.rankFromStart - 1);
      assert.equal(state.afterCount, state.rankFromEnd - 1);
      assert.equal(state.beforeCount + state.afterCount + 1, state.total);

      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
      assert.equal(question.options[question.correctIndex]?.value, question.answer);
      assert.equal(question.options.filter((option) => option.value === question.answer).length, 1);
      assert.equal(
        question.options.filter((option) => option.misconceptionId === 'CORRECT').length,
        1,
      );

      assert.equal(question.lifecycle.questionStudioDiscoverable, false);
      assert.equal(question.lifecycle.questionBankStatus, 'NOT_STORED');
      assert.equal(question.lifecycle.testEligibility, 'INELIGIBLE');
      assert.equal(question.lifecycle.publiclyPublishable, false);

      contexts.add(question.contextId);
      difficulties.add(question.difficulty);
      answerSemantics.add(question.answerSemantic);
      answerPositions[question.correctIndex] += 1;
      generatedQuestions += 1;
    }
  }

  assert.deepEqual([...contexts].sort(), ['HORIZONTAL_ROW', 'MERIT_LIST', 'QUEUE']);
  assert.deepEqual([...answerSemantics], [authority.answerSemantic]);
  assert.ok(difficulties.has('EASY'));
  assert.ok(difficulties.has('MEDIUM'));
  assert.ok(answerPositions.every((count) => count > 0));

  return {
    authorityId: authority.authorityId,
    title: authority.title,
    sourcePrototypeIds: authority.sourcePrototypeIds,
    prototypeCount: authority.sourcePrototypeIds.length,
    generatedQuestions,
    answerSemantic: authority.answerSemantic,
    evidenceFamily: authority.evidenceFamily,
    governingEquation: authority.governingEquation,
    sideParameter: authority.sideParameter,
    exactMiddleRequired: authority.exactMiddleRequired,
    contexts: [...contexts].sort(),
    difficulties: [...difficulties].sort(),
    answerPositions,
  };
});

const totalQuestions = authorityReports.reduce(
  (sum, authority) => sum + authority.generatedQuestions,
  0,
);
assert.equal(totalQuestions, 3_120);

const rows = listRnkCp001PrototypeAuthorityRows();
assert.equal(rows.length, 13);
assert.equal(new Set(rows.map((row) => row.prototypeId)).size, 13);
assert.equal(new Set(rows.map((row) => row.authorityId)).size, 9);

const report = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-001',
  discoveryPrototypeCount: RNK_CP001_DISCOVERY_PROTOTYPE_IDS.length,
  provisionalAuthorityCount: RNK_CP001_PROVISIONAL_AUTHORITIES.length,
  symmetricMergePairCount: pairedAuthorities.length,
  retainedSinglePrototypeAuthorityCount: retainedAuthorities.length,
  permanentQlCount: 0,
  generatedQuestionChecks: totalQuestions,
  exactOwnershipChecks: RNK_CP001_DISCOVERY_PROTOTYPE_IDS.length,
  lifecycleChecks: totalQuestions,
  equationAgreementChecks: totalQuestions,
  authorityReports,
  prototypeAuthorityRows: rows,
  conclusion: 'PASS_PROVISIONAL_NINE_AUTHORITY_CONSOLIDATION',
};

function markdownReport(): string {
  const lines = [
    '# RNK-CP-001 — Provisional Consolidation Evidence',
    '',
    'Permanent QLs: **0**',
    '',
    '| Authority | Prototypes | Questions | Answer | Equation |',
    '|---|---:|---:|---|---|',
    ...authorityReports.map(
      (authority) =>
        `| ${authority.authorityId} | ${authority.prototypeCount} | ${authority.generatedQuestions} | ${authority.answerSemantic} | \`${authority.governingEquation}\` |`,
    ),
    '',
    '## Prototype ownership',
    '',
    ...rows.map((row) => `- \`${row.prototypeId}\` → \`${row.authorityId}\``),
    '',
    '## Disposition',
    '',
    '- 13 discovery prototypes consolidate into 9 provisional authorities.',
    '- Four mirrored start/end pairs merge through explicit side parameters.',
    '- Five contracts remain separate because their evidence or answer semantics differ materially.',
    '- No permanent QL, Question Studio, Question Bank, test or publication activation is authorised.',
    '',
  ];
  return lines.join('\n');
}

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-provisional-consolidation.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  writeFileSync(
    join(outputDirectory, 'rnk-cp001-provisional-consolidation.md'),
    `${markdownReport()}\n`,
  );
}

console.log(JSON.stringify(report, null, 2));
