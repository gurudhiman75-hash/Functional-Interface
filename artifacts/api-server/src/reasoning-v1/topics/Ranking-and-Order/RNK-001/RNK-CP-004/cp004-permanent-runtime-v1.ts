import { createHash } from 'node:crypto';
import {
  RNK_CP004_CONSOLIDATED_AUTHORITY_IDS,
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  generateRnkCp004ConsolidatedQuestion,
  type RnkCp004ConsolidatedAuthorityId,
  type RnkCp004ConsolidatedQuestion,
  type RnkCp004RemodelV7PrototypeId,
} from './cp004-authority-consolidation-v1';

export const RNK_CP004_PERMANENT_RUNTIME_VERSION = 'RNK_CP004_PERMANENT_RUNTIME_V1' as const;
export const RNK_CP004_ENGLISH_DISCOVERY_FREEZE_VERSION = 'RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1' as const;
export const RNK_CP004_EXPECTED_PROJECTION_SHA256 = '39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f' as const;

export const RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS = [
  { qlId: 'RNK-QL-027', authorityId: 'ENDPOINT_ENTITY' },
  { qlId: 'RNK-QL-028', authorityId: 'ENTITY_AT_POSITION' },
  { qlId: 'RNK-QL-029', authorityId: 'RANK_OF_NAMED_ENTITY' },
  { qlId: 'RNK-QL-030', authorityId: 'COMPLETE_ORDER' },
  { qlId: 'RNK-QL-031', authorityId: 'RELATIVE_ORDER_OF_PAIR' },
  { qlId: 'RNK-QL-032', authorityId: 'EXACT_RANK_DIFFERENCE_OF_PAIR' },
  { qlId: 'RNK-QL-033', authorityId: 'IMMEDIATE_NEIGHBOUR' },
  { qlId: 'RNK-QL-034', authorityId: 'DEFINITELY_TRUE_RELATION' },
  { qlId: 'RNK-QL-035', authorityId: 'MISSING_COMPARISON' },
] as const satisfies readonly {
  readonly qlId: string;
  readonly authorityId: RnkCp004ConsolidatedAuthorityId;
}[];

export type RnkCp004PermanentQlId =
  (typeof RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS)[number]['qlId'];

export interface RnkCp004PermanentProfile {
  readonly runtimeVersion: typeof RNK_CP004_PERMANENT_RUNTIME_VERSION;
  readonly freezeVersion: typeof RNK_CP004_ENGLISH_DISCOVERY_FREEZE_VERSION;
  readonly permanentQlId: RnkCp004PermanentQlId;
  readonly authorityId: RnkCp004ConsolidatedAuthorityId;
  readonly permanentOrdinalWithinAuthority: number;
  readonly questionsPerAuthority: 192;
  readonly projectionDigestPinned: boolean;
}

export type RnkCp004PermanentQuestion = Omit<RnkCp004ConsolidatedQuestion, 'reviewMetadata'> & {
  readonly reviewMetadata: RnkCp004ConsolidatedQuestion['reviewMetadata'] & {
    readonly permanentRuntimeStatus: 'FROZEN';
    readonly permanentProfile: RnkCp004PermanentProfile;
  };
};

function sourcePrototypesFor(
  authorityId: RnkCp004ConsolidatedAuthorityId,
): readonly RnkCp004RemodelV7PrototypeId[] {
  return RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.filter((prototypeId) =>
    generateRnkCp004ConsolidatedQuestion(prototypeId, 0, 0)
      .reviewMetadata.authorityConsolidationProfile.consolidatedAuthorityId === authorityId,
  );
}

function permanentQuestionsFor(
  qlId: RnkCp004PermanentQlId,
  authorityId: RnkCp004ConsolidatedAuthorityId,
): readonly RnkCp004PermanentQuestion[] {
  const prototypes = sourcePrototypesFor(authorityId);
  if (prototypes.length !== 1 && prototypes.length !== 2) {
    throw new Error(`Authority ${authorityId} has unsupported source count ${prototypes.length}`);
  }
  const perPrototype = 192 / prototypes.length;
  const output: RnkCp004PermanentQuestion[] = [];
  prototypes.forEach((prototypeId) => {
    for (let seed = 0; seed < perPrototype; seed += 1) {
      const permanentOrdinalWithinAuthority = output.length + 1;
      const base = generateRnkCp004ConsolidatedQuestion(
        prototypeId,
        seed,
        (permanentOrdinalWithinAuthority - 1) % 4,
      );
      output.push({
        ...base,
        mathematicalFingerprint: `${base.mathematicalFingerprint}:${RNK_CP004_PERMANENT_RUNTIME_VERSION}:${qlId}:${permanentOrdinalWithinAuthority}`,
        reviewMetadata: {
          ...base.reviewMetadata,
          permanentRuntimeStatus: 'FROZEN',
          permanentProfile: {
            runtimeVersion: RNK_CP004_PERMANENT_RUNTIME_VERSION,
            freezeVersion: RNK_CP004_ENGLISH_DISCOVERY_FREEZE_VERSION,
            permanentQlId: qlId,
            authorityId,
            permanentOrdinalWithinAuthority,
            questionsPerAuthority: 192,
            projectionDigestPinned: true,
          },
          normalizedSemanticFingerprint: `${base.reviewMetadata.normalizedSemanticFingerprint}|${RNK_CP004_PERMANENT_RUNTIME_VERSION}:${qlId}:${permanentOrdinalWithinAuthority}`,
        },
      });
    }
  });
  if (output.length !== 192) throw new Error(`Authority ${authorityId} produced ${output.length} questions`);
  return output;
}

export function buildRnkCp004PermanentRuntime(): readonly RnkCp004PermanentQuestion[] {
  if (RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.length !== RNK_CP004_CONSOLIDATED_AUTHORITY_IDS.length) {
    throw new Error('Permanent assignment count does not match consolidated authority count');
  }
  return RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.flatMap(({ qlId, authorityId }) =>
    permanentQuestionsFor(qlId, authorityId),
  );
}

function projectionRecord(question: RnkCp004PermanentQuestion): unknown {
  return {
    qlId: question.reviewMetadata.permanentProfile.permanentQlId,
    authorityId: question.reviewMetadata.permanentProfile.authorityId,
    ordinal: question.reviewMetadata.permanentProfile.permanentOrdinalWithinAuthority,
    prototypeId: question.prototypeId,
    seed: question.seed,
    inverseVariant: question.reviewMetadata.sourceInverseProfile.variant,
    context: question.reviewMetadata.languageProfile.contextFamily,
    difficulty: question.difficulty,
    stem: question.stem,
    answerKey: question.answerKey,
    answer: question.answer,
    options: question.options.map((item) => ({
      answerKey: item.answerKey,
      label: item.label,
      misconceptionId: item.misconceptionId,
      explanation: item.explanation,
    })),
    visibleExplanation: question.visibleExplanation,
    clueRoles: question.reviewMetadata.clueRoleProfile,
    proofContract: question.reviewMetadata.authorityConsolidationProfile.proofContract,
  };
}

export function rnkCp004PermanentProjectionSha256(
  questions: readonly RnkCp004PermanentQuestion[],
): string {
  const canonical = JSON.stringify(questions.map(projectionRecord));
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}
