import {
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  generateRnkCp004SourceInverseQuestion,
  type RnkCp004RemodelV7PrototypeId,
  type RnkCp004SourceInverseQuestion,
  type RnkCp004SourceInverseVariant,
} from './cp004-source-inverse-v1';

const TARGETS: readonly {
  readonly queryKind: 'ENTITY_AT_EXACT_RANK' | 'RANK_OF_NAMED_ENTITY' | 'COMPLETE_ORDER';
  readonly variant: Exclude<RnkCp004SourceInverseVariant, 'CANONICAL'>;
}[] = [
  { queryKind: 'ENTITY_AT_EXACT_RANK', variant: 'ENTITY_AT_RANK_FROM_BOTTOM' },
  { queryKind: 'RANK_OF_NAMED_ENTITY', variant: 'RANK_FROM_BOTTOM' },
  { queryKind: 'COMPLETE_ORDER', variant: 'ORDER_LOWEST_TO_HIGHEST' },
];

const CONTEXTS = [
  'SELECTION_TEST',
  'MERIT_LIST',
  'COMPETITION_STANDINGS',
  'PERFORMANCE_REVIEW',
  'INTERVIEW_SHORTLIST',
  'NEUTRAL_RANKING',
] as const;

const ANSWER_SEQUENCE = [
  0, 1, 2, 3, 1, 2, 3, 0, 2, 3, 0, 1,
  3, 0, 1, 2, 0, 2, 1, 3, 1, 3, 2, 0,
  2, 0, 3, 1, 3, 1, 0, 2, 0, 3, 2, 1,
] as const;

function prototypeFor(
  queryKind: 'ENTITY_AT_EXACT_RANK' | 'RANK_OF_NAMED_ENTITY' | 'COMPLETE_ORDER',
): RnkCp004RemodelV7PrototypeId {
  const prototype = RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.find((candidate) =>
    generateRnkCp004SourceInverseQuestion(candidate, 0, 0, 'CANONICAL').displayedEvidence.query.kind === queryKind,
  );
  if (!prototype) throw new Error(`No prototype found for ${queryKind}`);
  return prototype;
}

function selectTargetRecords(
  prototypeId: RnkCp004RemodelV7PrototypeId,
  variant: Exclude<RnkCp004SourceInverseVariant, 'CANONICAL'>,
  answerOffset: number,
): readonly RnkCp004SourceInverseQuestion[] {
  const selected: RnkCp004SourceInverseQuestion[] = [];
  const contextCounts = new Map<string, number>();
  for (let seed = 0; seed < 240 && selected.length < 12; seed += 1) {
    const preview = generateRnkCp004SourceInverseQuestion(prototypeId, seed, 0, variant);
    const context = preview.reviewMetadata.languageProfile.contextFamily;
    if ((contextCounts.get(context) ?? 0) >= 2) continue;
    const correctIndex = ANSWER_SEQUENCE[answerOffset + selected.length];
    selected.push(generateRnkCp004SourceInverseQuestion(prototypeId, seed, correctIndex, variant));
    contextCounts.set(context, (contextCounts.get(context) ?? 0) + 1);
  }
  if (selected.length !== 12) throw new Error(`Expected 12 targeted records for ${variant}, found ${selected.length}`);
  for (const context of CONTEXTS) {
    if (contextCounts.get(context) !== 2) throw new Error(`Expected two ${context} records for ${variant}`);
  }
  return selected;
}

export function buildRnkCp004SourceInverseReviewPack(): readonly RnkCp004SourceInverseQuestion[] {
  return TARGETS.flatMap((target, targetIndex) => selectTargetRecords(
    prototypeFor(target.queryKind),
    target.variant,
    targetIndex * 12,
  ));
}

export function renderRnkCp004SourceInverseMarkdown(
  questions: readonly RnkCp004SourceInverseQuestion[],
): string {
  const lines: string[] = [
    '# RNK-CP-004 Source and Inverse Expansion V1 — Targeted Review Pack',
    '',
    '> V7 manual English approval is recorded. This pack validates inverse parameter coverage only; it does not allocate permanent QLs or enable publication.',
    '',
  ];
  questions.forEach((question, index) => {
    lines.push(`## ${index + 1}. ${question.reviewMetadata.sourceInverseProfile.variant}`);
    lines.push('');
    lines.push(question.stem);
    lines.push('');
    question.options.forEach((item, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${item.label}`);
    });
    lines.push('');
    lines.push('**Explanation**');
    lines.push('');
    question.visibleExplanation.lines.forEach((line) => lines.push(`- ${line}`));
    lines.push('');
    lines.push(`**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`);
    lines.push('');
    lines.push(`**Authority decision:** ${question.reviewMetadata.sourceInverseProfile.authorityDecision}; permanent QL impact ${question.reviewMetadata.sourceInverseProfile.permanentQlImpact}.`);
    lines.push('');
  });
  return `${lines.join('\n')}\n`;
}
