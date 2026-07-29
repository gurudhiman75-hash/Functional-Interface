import { stableHash } from "../foundation/prng";
import {
  auditAllBlrCp003CompetitiveRecords,
  type BlrCp003CompetitiveAudit,
  type BlrCp003CompetitiveRawContext,
} from "./cp003-competitive-exam-gate";
import { generateBlrCp003TeacherReviewV3Records } from "./cp003-teacher-editorial-finalizer";
import type {
  BlrCp003TeacherOptionAnalysis,
  BlrCp003TeacherReviewRecord,
} from "./cp003-teacher-editorial";

export type BlrCp003CompetitiveReviewV4Record = Omit<
  BlrCp003TeacherReviewRecord,
  "editorial" | "metadata"
> & {
  editorial: BlrCp003TeacherReviewRecord["editorial"];
  metadata: Omit<
    BlrCp003TeacherReviewRecord["metadata"],
    "runtimeVersion" | "semanticFingerprint"
  > & {
    runtimeVersion: "blr-cp003-competitive-review-v4";
    competitiveExamEligible: true;
    minimumGraphDistance: number;
    directTextMatchCount: 0;
    claimOptionMinimumGraphDistance: number | null;
    claimOptionDirectTextMatchCount: 0;
    hasAsciiFamilyTree: true;
    hasFourTierTeacherVoice: true;
    reverseTrapRequired: boolean;
    reverseTrapExplained: boolean;
    semanticFingerprint: string;
  };
};

export interface BlrCp003CompetitiveReviewV4RejectedRecord {
  scenarioId: string;
  topologyId: string;
  seed: number;
  itemId: string;
  prototypeId: string;
  stem: string;
  correctAnswer: string;
  audit: BlrCp003CompetitiveAudit;
}

export interface BlrCp003CompetitiveReviewV4Bundle {
  selected: readonly BlrCp003CompetitiveReviewV4Record[];
  rejected: readonly BlrCp003CompetitiveReviewV4RejectedRecord[];
  sourceRecordCount: number;
}

function relationDirectionNames(stem: string): readonly [string, string] | null {
  const match = /^How is (.+) related to (.+)\?$/.exec(stem);
  return match ? [match[1]!, match[2]!] : null;
}

function cleanExistingExplanation(text: string): string {
  return text
    .replace(/^✅\s*Option [A-D](?: is correct)?[.!]?\s*/i, "")
    .replace(/^⚠️\s*Don't fall for Option [A-D]!?\s*/i, "")
    .trim();
}

function optionAnalysisV4(
  record: BlrCp003TeacherReviewRecord,
  audit: BlrCp003CompetitiveAudit,
): readonly BlrCp003TeacherOptionAnalysis[] {
  const direction = relationDirectionNames(record.stem);
  return record.editorial.optionAnalysis.map((entry) => {
    const existing = cleanExistingExplanation(entry.explanation);
    if (entry.isCorrect) {
      return {
        ...entry,
        explanation: `✅ Option ${entry.optionLabel} is correct. ${existing}`,
      };
    }
    if (audit.reverseTrap?.optionLabel === entry.optionLabel && direction) {
      return {
        ...entry,
        explanation: `⚠️ Don't fall for Option ${entry.optionLabel}! This gives the reverse relation—how ${direction[1]} is related to ${direction[0]}. The question asks how ${direction[0]} is related to ${direction[1]}.`,
      };
    }
    return {
      ...entry,
      explanation: `⚠️ Don't fall for Option ${entry.optionLabel}! ${existing}`,
    };
  });
}

function stepByStepV4(
  record: BlrCp003TeacherReviewRecord,
): readonly string[] {
  const direction = relationDirectionNames(record.stem);
  if (!direction) return record.editorial.stepByStepSolution;
  const directionLine = `Keep the direction fixed: ${direction[0]} → ${direction[1]}. The final answer must describe ${direction[0]}.`;
  const conclusionIndex = record.editorial.stepByStepSolution.findIndex((line) =>
    line.startsWith("Therefore, "),
  );
  if (conclusionIndex < 0) {
    return [...record.editorial.stepByStepSolution, directionLine];
  }
  return [
    ...record.editorial.stepByStepSolution.slice(0, conclusionIndex),
    directionLine,
    ...record.editorial.stepByStepSolution.slice(conclusionIndex),
  ];
}

function commonTrapsV4(
  record: BlrCp003TeacherReviewRecord,
  audit: BlrCp003CompetitiveAudit,
): readonly string[] {
  const direction = relationDirectionNames(record.stem);
  const traps = record.editorial.commonTraps.map((line) =>
    line.startsWith("⚠️") ? line : `⚠️ ${line}`,
  );
  if (!audit.reverseTrap || !direction) return traps;
  const reverseWarning = `⚠️ Don't fall for Option ${audit.reverseTrap.optionLabel} (${audit.reverseTrap.optionText})! It answers the reverse question—how ${direction[1]} is related to ${direction[0]}—instead of how ${direction[0]} is related to ${direction[1]}.`;
  return [reverseWarning, ...traps.filter((line) => !line.includes("reverse question"))];
}

function upgradeSelectedRecord(
  record: BlrCp003TeacherReviewRecord,
  context: BlrCp003CompetitiveRawContext,
  audit: BlrCp003CompetitiveAudit,
): BlrCp003CompetitiveReviewV4Record {
  if (
    !audit.examEligible ||
    audit.minimumGraphDistance === null ||
    audit.directTextMatchCount !== 0 ||
    audit.claimOptionDirectTextMatchCount !== 0
  ) {
    throw new Error(`Ineligible CP-003 item reached V4 upgrade: ${record.itemId}.`);
  }

  const optionAnalysis = optionAnalysisV4(record, audit);
  const stepByStepSolution = stepByStepV4(record);
  const commonTraps = commonTrapsV4(record, audit);
  const reverseTrapExplained =
    audit.reverseTrap === null ||
    (optionAnalysis.some(
      (entry) =>
        entry.optionLabel === audit.reverseTrap?.optionLabel &&
        entry.explanation.includes("reverse relation"),
    ) &&
      commonTraps.some(
        (line) =>
          line.includes(`Option ${audit.reverseTrap?.optionLabel}`) &&
          line.includes("reverse question"),
      ));

  return {
    ...record,
    editorial: {
      ...record.editorial,
      stepByStepSolution,
      optionAnalysis,
      commonTraps,
    },
    metadata: {
      ...record.metadata,
      runtimeVersion: "blr-cp003-competitive-review-v4",
      competitiveExamEligible: true,
      minimumGraphDistance: audit.minimumGraphDistance,
      directTextMatchCount: 0,
      claimOptionMinimumGraphDistance: audit.claimOptionMinimumGraphDistance,
      claimOptionDirectTextMatchCount: 0,
      hasAsciiFamilyTree: true,
      hasFourTierTeacherVoice: true,
      reverseTrapRequired: audit.reverseTrap !== null,
      reverseTrapExplained,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        context.question.prototypeId,
        audit.minimumGraphDistance,
        audit.claimOptionMinimumGraphDistance ?? "NO_CLAIM_OPTIONS",
        ...stepByStepSolution,
        ...optionAnalysis.flatMap((entry) => [
          entry.optionLabel,
          entry.optionText,
          entry.explanation,
        ]),
        ...commonTraps,
      ]),
    },
  };
}

export function generateBlrCp003CompetitiveReviewV4Bundle(
  seeds: readonly number[] = [0, 1, 2, 3],
): BlrCp003CompetitiveReviewV4Bundle {
  const source = generateBlrCp003TeacherReviewV3Records(seeds);
  const audited = auditAllBlrCp003CompetitiveRecords(source, seeds);
  const selected: BlrCp003CompetitiveReviewV4Record[] = [];
  const rejected: BlrCp003CompetitiveReviewV4RejectedRecord[] = [];

  for (const entry of audited) {
    if (entry.audit.examEligible) {
      selected.push(upgradeSelectedRecord(entry.record, entry.context, entry.audit));
    } else {
      rejected.push({
        scenarioId: entry.record.scenarioId,
        topologyId: entry.record.topologyId,
        seed: entry.record.seed,
        itemId: entry.record.itemId,
        prototypeId: entry.record.prototypeId,
        stem: entry.record.stem,
        correctAnswer: entry.record.options[entry.record.correctIndex]!.text,
        audit: entry.audit,
      });
    }
  }

  return {
    selected,
    rejected,
    sourceRecordCount: source.length,
  };
}

export function generateBlrCp003CompetitiveReviewV4Records(
  seeds: readonly number[] = [0, 1, 2, 3],
): readonly BlrCp003CompetitiveReviewV4Record[] {
  return generateBlrCp003CompetitiveReviewV4Bundle(seeds).selected;
}
