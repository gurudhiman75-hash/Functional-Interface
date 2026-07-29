import { stableHash } from "../foundation/prng";
import {
  generateBlrCp003TeacherReviewRecords,
  type BlrCp003TeacherReviewRecord,
} from "./cp003-teacher-editorial";

function removeEngineVoice(text: string): string {
  return text
    .replace(/^Trace every member's relation to (.+)\.$/, "Check each family member's relation to $1.")
    .replace(/^Trace /, "Follow the family links for ")
    .replace(/supported family path/gi, "family route shown in the diagram")
    .replace(/shortest supported path/gi, "clearest route in the diagram")
    .replace(/reconstructed family graph/gi, "family tree")
    .replace(/subject-to-reference/gi, "first-name-to-second-name")
    .replace(/modelled parent/gi, "displayed parent")
    .replace(/semantic option/gi, "answer option");
}

export function finalizeBlrCp003TeacherRecord(
  record: BlrCp003TeacherReviewRecord,
): BlrCp003TeacherReviewRecord {
  const coreConcept = record.editorial.coreConcept.map(removeEngineVoice);
  const stepByStepSolution = record.editorial.stepByStepSolution.map(removeEngineVoice);
  const optionAnalysis = record.editorial.optionAnalysis.map((entry) => ({
    ...entry,
    explanation: removeEngineVoice(entry.explanation),
  }));
  const conclusion = removeEngineVoice(record.editorial.conclusion);
  const examShortcut = removeEngineVoice(record.editorial.examShortcut);
  const commonTraps = record.editorial.commonTraps.map(removeEngineVoice);

  return {
    ...record,
    editorial: {
      ...record.editorial,
      coreConcept,
      stepByStepSolution,
      optionAnalysis,
      conclusion,
      examShortcut,
      commonTraps,
    },
    metadata: {
      ...record.metadata,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        ...coreConcept,
        ...stepByStepSolution,
        ...optionAnalysis.flatMap((entry) => [entry.optionLabel, entry.optionText, entry.explanation]),
        conclusion,
        examShortcut,
        ...commonTraps,
      ]),
    },
  };
}

export function generateBlrCp003TeacherReviewV3Records(
  seeds: readonly number[] = [0, 1, 2, 3],
): BlrCp003TeacherReviewRecord[] {
  return generateBlrCp003TeacherReviewRecords(seeds).map(finalizeBlrCp003TeacherRecord);
}
