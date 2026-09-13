import { GEO_RIV_001_CP006_REVIEW_BATCH_V1 } from "./geo-riv-001-cp006-review-batch-v1";
import { GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED } from "./geo-riv-001-cp007-review-polish-v3";
import { GEO_RIV_001_CP009_REVIEW_BATCH_V3 } from "./geo-riv-001-cp009-review-batch-v3";
import { GEO_RIV_001_CP010_REVIEW_BATCH_V1 } from "./geo-riv-001-cp010-review-batch-v1";
import { GEO_RIV_001_CP011_REVIEW_BATCH_V1 } from "./geo-riv-001-cp011-review-batch-v1";
import { GEO_RIV_001_CP012_REVIEW_BATCH_V1 } from "./geo-riv-001-cp012-review-batch-v1";
import { GEO_RIV_001_CP013_REVIEW_BATCH_V1 } from "./geo-riv-001-cp013-review-batch-v1";
import { GEO_RIV_001_CP014_REVIEW_BATCH_V1 } from "./geo-riv-001-cp014-review-batch-v1";
import { GEO_RIV_001_CP015_REVIEW_BATCH_V2 } from "./geo-riv-001-cp015-review-batch-v2";

type Difficulty = "Easy" | "Medium" | "Hard";

type FreezableQuestion = {
  questionId: string;
  cpId: string;
  qlId: string;
  difficulty: Difficulty;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  upstreamFactIds?: readonly string[];
  reviewOnly: boolean;
  runtimeRegistered: boolean;
  [key: string]: unknown;
};

function freezeApprovedCp<T extends FreezableQuestion>(args: {
  cpId: string;
  title: string;
  sourceAuthority: string;
  questions: readonly T[];
}) {
  const ids = new Set<string>();
  const qls = new Set<string>();
  const semantics = new Set<string>();
  const difficultyCounts: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };

  for (const question of args.questions) {
    if (question.cpId !== args.cpId) throw new Error(`${args.cpId} freeze received ${question.cpId}`);
    if (ids.has(question.questionId)) throw new Error(`${args.cpId} freeze duplicate id ${question.questionId}`);
    ids.add(question.questionId);
    qls.add(question.qlId);
    semantics.add(`${String(question.stem ?? "")}::${question.canonicalAnswer}`);
    difficultyCounts[question.difficulty] += 1;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) {
      throw new Error(`${args.cpId} freeze invalid options ${question.questionId}`);
    }
    if (question.options[question.correctIndex] !== question.canonicalAnswer) {
      throw new Error(`${args.cpId} freeze answer mismatch ${question.questionId}`);
    }
    if (!question.sourceIds.length || !question.sourceFactIds.length) {
      throw new Error(`${args.cpId} freeze missing provenance ${question.questionId}`);
    }
    if (!question.reviewOnly || question.runtimeRegistered) {
      throw new Error(`${args.cpId} freeze requires review-only source ${question.questionId}`);
    }
  }

  const authorityId = `${args.cpId}-ENGLISH-FREEZE-V1` as const;
  const authority = Object.freeze({
    authorityId,
    chapterId: "GEO-RIV-001" as const,
    cpId: args.cpId,
    title: args.title,
    sourceAuthority: args.sourceAuthority,
    frozenAt: "2026-09-12" as const,
    approval: Object.freeze({
      status: "APPROVED" as const,
      mode: "EXPLICIT_HUMAN_EDITORIAL_APPROVAL" as const,
      language: "en" as const,
      wordingStandard: "SIMPLE_EXAM_LIKE" as const,
      visualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT" as const,
    }),
    corpus: Object.freeze({
      questionCount: args.questions.length,
      qlCount: qls.size,
      difficultyCounts: Object.freeze({ ...difficultyCounts }),
      semanticUniqueCount: semantics.size,
      deterministic: true as const,
      sourceProvenanceRequired: true as const,
      upstreamFactLineagePreserved: true as const,
    }),
    lifecycle: Object.freeze({
      questionStudioDiscoverable: true as const,
      questionStudioGenerationEnabled: true as const,
      runtimeStage: "REVIEW_ONLY" as const,
      frozenCorpusOnly: true as const,
      readOnly: true as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      productionReleaseAuthorized: false as const,
    }),
    replacementRule:
      "Any change to approved stems, options, answers, explanations, difficulty labels, source/fact provenance or QL allocation requires a new governed freeze version." as const,
  });

  const frozenQuestions = Object.freeze(
    args.questions.map((question) => Object.freeze({
      ...question,
      options: Object.freeze([...question.options]),
      sourceIds: Object.freeze([...question.sourceIds]),
      sourceFactIds: Object.freeze([...question.sourceFactIds]),
      upstreamFactIds: Object.freeze([...(question.upstreamFactIds ?? [])]),
      freezeAuthorityId: authorityId,
      authoringReviewApproved: true as const,
      immutableCorpus: true as const,
    })),
  );

  return Object.freeze({ authority, frozenQuestions });
}

const cp006 = freezeApprovedCp({ cpId: "GEO-RIV-001-CP006", title: "West-flowing Peninsular Rivers", sourceAuthority: "REVIEW-BATCH-V1", questions: GEO_RIV_001_CP006_REVIEW_BATCH_V1 });
export const GEO_RIV_001_CP006_FREEZE_AUTHORITY_V1 = cp006.authority;
export const GEO_RIV_001_CP006_FROZEN_QUESTIONS_V1 = cp006.frozenQuestions;

const cp007 = freezeApprovedCp({ cpId: "GEO-RIV-001-CP007", title: "Tributaries & Confluences", sourceAuthority: "ALL-UPSTREAM-REVIEW-BATCH-V3-POLISHED", questions: GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED });
export const GEO_RIV_001_CP007_FREEZE_AUTHORITY_V1 = cp007.authority;
export const GEO_RIV_001_CP007_FROZEN_QUESTIONS_V1 = cp007.frozenQuestions;

const cp009 = freezeApprovedCp({ cpId: "GEO-RIV-001-CP009", title: "Rivers & States/UTs", sourceAuthority: "REVIEW-BATCH-V3", questions: GEO_RIV_001_CP009_REVIEW_BATCH_V3 });
export const GEO_RIV_001_CP009_FREEZE_AUTHORITY_V1 = cp009.authority;
export const GEO_RIV_001_CP009_FROZEN_QUESTIONS_V1 = cp009.frozenQuestions;

const cp010 = freezeApprovedCp({ cpId: "GEO-RIV-001-CP010", title: "Dams, Projects & Reservoirs", sourceAuthority: "REVIEW-BATCH-V1", questions: GEO_RIV_001_CP010_REVIEW_BATCH_V1 });
export const GEO_RIV_001_CP010_FREEZE_AUTHORITY_V1 = cp010.authority;
export const GEO_RIV_001_CP010_FROZEN_QUESTIONS_V1 = cp010.frozenQuestions;

const cp011 = freezeApprovedCp({ cpId: "GEO-RIV-001-CP011", title: "River Basins & Drainage Patterns", sourceAuthority: "REVIEW-BATCH-V1", questions: GEO_RIV_001_CP011_REVIEW_BATCH_V1 });
export const GEO_RIV_001_CP011_FREEZE_AUTHORITY_V1 = cp011.authority;
export const GEO_RIV_001_CP011_FROZEN_QUESTIONS_V1 = cp011.frozenQuestions;

const cp012 = freezeApprovedCp({ cpId: "GEO-RIV-001-CP012", title: "Important Cities/Places on Rivers", sourceAuthority: "REVIEW-BATCH-V1", questions: GEO_RIV_001_CP012_REVIEW_BATCH_V1 });
export const GEO_RIV_001_CP012_FREEZE_AUTHORITY_V1 = cp012.authority;
export const GEO_RIV_001_CP012_FROZEN_QUESTIONS_V1 = cp012.frozenQuestions;

const cp013 = freezeApprovedCp({ cpId: "GEO-RIV-001-CP013", title: "River Comparisons & Classification", sourceAuthority: "REVIEW-BATCH-V1", questions: GEO_RIV_001_CP013_REVIEW_BATCH_V1 });
export const GEO_RIV_001_CP013_FREEZE_AUTHORITY_V1 = cp013.authority;
export const GEO_RIV_001_CP013_FROZEN_QUESTIONS_V1 = cp013.frozenQuestions;

const cp014 = freezeApprovedCp({ cpId: "GEO-RIV-001-CP014", title: "Multi-fact / Statement / Match Tasks", sourceAuthority: "REVIEW-BATCH-V1", questions: GEO_RIV_001_CP014_REVIEW_BATCH_V1 });
export const GEO_RIV_001_CP014_FREEZE_AUTHORITY_V1 = cp014.authority;
export const GEO_RIV_001_CP014_FROZEN_QUESTIONS_V1 = cp014.frozenQuestions;

const cp015 = freezeApprovedCp({ cpId: "GEO-RIV-001-CP015", title: "Mixed Rivers Mastery", sourceAuthority: "REVIEW-BATCH-V2", questions: GEO_RIV_001_CP015_REVIEW_BATCH_V2 });
export const GEO_RIV_001_CP015_MASTERY_FREEZE_AUTHORITY_V1 = Object.freeze({
  ...cp015.authority,
  lifecycle: Object.freeze({ ...cp015.authority.lifecycle, questionStudioDiscoverable: false as const, questionStudioGenerationEnabled: false as const }),
  role: "CHAPTER_MASTERY_PROOF" as const,
  permanentQlOwner: false as const,
});
export const GEO_RIV_001_CP015_MASTERY_FROZEN_QUESTIONS_V1 = cp015.frozenQuestions;

export const GEO_RIV_001_LATE_SEMANTIC_FREEZE_AUTHORITIES_V1 = Object.freeze([
  GEO_RIV_001_CP006_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP007_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP009_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP010_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP011_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP012_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP013_FREEZE_AUTHORITY_V1,
  GEO_RIV_001_CP014_FREEZE_AUTHORITY_V1,
]);

export const GEO_RIV_001_CHAPTER_CLOSE_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CHAPTER-CLOSE-V1" as const,
  chapterId: "GEO-RIV-001" as const,
  title: "Indian Rivers & Drainage System" as const,
  closedAt: "2026-09-12" as const,
  semanticCpCount: 14 as const,
  permanentQlCount: 127 as const,
  masteryQuestionCount: GEO_RIV_001_CP015_MASTERY_FROZEN_QUESTIONS_V1.length,
  masteryAuthorityId: GEO_RIV_001_CP015_MASTERY_FREEZE_AUTHORITY_V1.authorityId,
  questionStudioPolicy: "CP001-CP014_SEMANTIC_FREEZES_ONLY" as const,
  cp015Policy: "CHAPTER_MASTERY_PROOF_NOT_PERMANENT_QL_OWNER" as const,
  lifecycle: Object.freeze({ runtimeStage: "REVIEW_ONLY" as const, questionBankWritable: false as const, testEligible: false as const, mockTestEligible: false as const, publiclyPublishable: false as const, productionReleaseAuthorized: false as const }),
});
