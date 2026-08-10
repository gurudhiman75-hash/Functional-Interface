import { stableHash } from "../foundation/prng";
import {
  BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION,
  BLR_CP003_V8_FULL_BANK_SEEDS,
  blrCp003V8CandidateAuthorityCounts,
  blrCp003V8VisualPairs,
  generateBlrCp003LearnerEvidenceV8Candidates,
  type BlrCp003V8CandidateRecord,
} from "./cp003-learner-evidence-v8-candidate";

export const BLR_CP003_V8_REVIEWED_EDITORIAL_VERSION =
  "BLR_CP003_V8_REVIEWED_EDITORIAL_V1" as const;

function polishGrammar(text: string): string {
  return text
    .replace(
      /([A-Z][a-z]+ and [A-Z][a-z]+) is the only pair satisfying the brother relation/g,
      "$1 form the only pair satisfying the brother relation",
    )
    .replace(
      /([A-Z][a-z]+ and [A-Z][a-z]+) is the only cousin pair/g,
      "$1 form the only cousin pair",
    );
}

function polishRecord(
  record: BlrCp003V8CandidateRecord,
): BlrCp003V8CandidateRecord {
  const solutionPhases = record.editorial.solutionPhases.map((phase) => ({
    ...phase,
    points: phase.points.map(polishGrammar),
  }));
  const editorial = {
    ...record.editorial,
    coreConcept: record.editorial.coreConcept.map(polishGrammar),
    stepByStepSolution: record.editorial.stepByStepSolution.map(polishGrammar),
    optionAnalysis: record.editorial.optionAnalysis.map((entry) => ({
      ...entry,
      explanation: polishGrammar(entry.explanation),
    })),
    conclusion: polishGrammar(record.editorial.conclusion),
    examShortcut: polishGrammar(record.editorial.examShortcut),
    commonTraps: record.editorial.commonTraps.map(polishGrammar),
    solutionPhases,
  };
  return {
    ...record,
    editorial,
    metadata: {
      ...record.metadata,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        BLR_CP003_V8_REVIEWED_EDITORIAL_VERSION,
        ...solutionPhases.flatMap((phase) => [phase.title, ...phase.points]),
        ...editorial.optionAnalysis.map((entry) => entry.explanation),
      ]),
    },
  };
}

export function generateBlrCp003LearnerEvidenceV8ReviewedCandidates(
  seeds: readonly number[] = BLR_CP003_V8_FULL_BANK_SEEDS,
): readonly BlrCp003V8CandidateRecord[] {
  const records = generateBlrCp003LearnerEvidenceV8Candidates(seeds).map(
    polishRecord,
  );
  for (const record of records) {
    const text = [
      ...record.editorial.stepByStepSolution,
      ...record.editorial.solutionPhases.flatMap((phase) => phase.points),
    ].join(" ");
    if (/\b[A-Z][a-z]+ and [A-Z][a-z]+ is the only (?:pair|cousin pair)\b/.test(text)) {
      throw new Error(`Unpolished pair grammar remains in ${record.itemId}.`);
    }
  }
  return records;
}

export {
  BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION,
  BLR_CP003_V8_FULL_BANK_SEEDS,
  blrCp003V8CandidateAuthorityCounts,
  blrCp003V8VisualPairs,
};
export type { BlrCp003V8CandidateRecord };
