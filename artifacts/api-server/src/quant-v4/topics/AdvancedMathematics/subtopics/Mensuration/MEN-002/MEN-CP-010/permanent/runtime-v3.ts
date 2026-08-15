import {
  generateMenCp010PermanentEnglishQuestion as generateV2Question,
  listMenCp010PermanentEnglishSources,
  type MenCp010PermanentEnglishQuestion,
} from "./runtime-v2";
import type { MenCp010PermanentQlId } from "./allocation";
import {
  buildMenCp010ExamRealismOverlayV2,
  listMenCp010ExamRealismSourcesV2,
  shouldUseMenCp010ExamRealismSourceV2,
} from "./exam-realism-sources-v2";
import {
  MEN_CP_010_RATIO_DIVERSITY_SOURCE_IDS,
  diversifyMenCp010ExamRealismOverlayV2,
} from "./exam-realism-diversity-v2";
import { diversifyMenCp010CapacityOverlayV2 } from "./exam-realism-capacity-diversity-v2";
import {
  MEN_CP_010_SCALING_DIVERSITY_SOURCE_IDS,
  diversifyMenCp010ScalingOverlayV2,
} from "./exam-realism-scaling-diversity-v2";
import { polishMenCp010EditorialPresentationV2 } from "./exam-realism-editorial-polish-v2";
import { polishMenCp010FrustumTsaDisplayV2 } from "./exam-realism-surface-polish-v2";

export const MEN_CP_010_PERMANENT_ENGLISH_RUNTIME_V3_AUTHORITY =
  "MEN-CP010-PERMANENT-ENGLISH-RUNTIME-V3-EXAM-REALISM" as const;

export type MenCp010ExamReadyEnglishQuestion = Omit<
  MenCp010PermanentEnglishQuestion,
  "authority"
> & {
  readonly authority: typeof MEN_CP_010_PERMANENT_ENGLISH_RUNTIME_V3_AUTHORITY;
  readonly sourceRuntimeAuthority: MenCp010PermanentEnglishQuestion["authority"];
  readonly examRealismVersion: "V2";
};

export function generateMenCp010ExamReadyEnglishQuestion(
  qlId: MenCp010PermanentQlId,
  seed: string,
): MenCp010ExamReadyEnglishQuestion {
  const base = generateV2Question(qlId, seed);
  const forceBaseAuditLane = seed.includes("base-v2-review");

  let overlay = null;
  if (!forceBaseAuditLane) {
    const rawOverlay = shouldUseMenCp010ExamRealismSourceV2(qlId, seed)
      ? buildMenCp010ExamRealismOverlayV2(qlId, seed, base.correctIndex)
      : null;
    const diversifiedOverlay = diversifyMenCp010ExamRealismOverlayV2(
      qlId,
      seed,
      base.correctIndex,
      rawOverlay,
    );
    const capacityOverlay = diversifyMenCp010CapacityOverlayV2(
      qlId,
      seed,
      base.correctIndex,
      diversifiedOverlay,
    );
    overlay = diversifyMenCp010ScalingOverlayV2(
      qlId,
      seed,
      base.correctIndex,
      capacityOverlay,
    );
  }

  const rawQuestion = overlay
    ? {
        ...base,
        sourceWave: "WAVE03" as const,
        sourceId: overlay.sourceId,
        stem: overlay.stem,
        answer: overlay.answer,
        options: overlay.options,
        explanation: overlay.explanation,
        verification: overlay.verification,
      }
    : base;
  const editorialQuestion = polishMenCp010EditorialPresentationV2(rawQuestion);
  const question = polishMenCp010FrustumTsaDisplayV2(editorialQuestion);

  if (
    !question.verification.valid ||
    question.options.length !== 4 ||
    new Set(question.options.map((option) => option.display)).size !== 4 ||
    question.options.filter((option) => option.isCorrect).length !== 1 ||
    question.options[question.correctIndex]?.isCorrect !== true ||
    question.options[question.correctIndex]?.display !== question.answer
  ) {
    throw new Error(`MEN-CP-010 exam-ready runtime validation failed for ${qlId}/${seed}`);
  }

  return {
    ...question,
    authority: MEN_CP_010_PERMANENT_ENGLISH_RUNTIME_V3_AUTHORITY,
    sourceRuntimeAuthority: base.authority,
    examRealismVersion: "V2",
  };
}

export function listMenCp010ExamReadyEnglishSources() {
  const base = listMenCp010PermanentEnglishSources().flatMap((row) =>
    row.sources.map((source) => ({
      qlId: row.qlId,
      clusterId: row.clusterId,
      sourceId: source.id,
      sourceKind: source.kind,
      layer: "BASE_V2" as const,
    })),
  );
  const primaryExam = listMenCp010ExamRealismSourcesV2().map((source) => ({
    qlId: source.qlId,
    clusterId: null,
    sourceId: source.sourceId,
    sourceKind: "EXAM_V2" as const,
    layer: "EXAM_REALISM_V2" as const,
  }));
  const additionalExam = [
    ...MEN_CP_010_RATIO_DIVERSITY_SOURCE_IDS,
    ...MEN_CP_010_SCALING_DIVERSITY_SOURCE_IDS,
  ].map((source) => ({
    qlId: source.qlId,
    clusterId: null,
    sourceId: source.sourceId,
    sourceKind: "EXAM_V2" as const,
    layer: "EXAM_REALISM_V2" as const,
  }));
  const seen = new Set<string>();
  return [...base, ...primaryExam, ...additionalExam].filter((row) => {
    const key = `${row.qlId}:${row.sourceId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
