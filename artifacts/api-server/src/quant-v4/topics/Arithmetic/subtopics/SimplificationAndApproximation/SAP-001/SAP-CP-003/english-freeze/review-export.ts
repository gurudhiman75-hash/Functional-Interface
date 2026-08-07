import { SAP_CP003_PROTOTYPE_IDS, type SapCp003Difficulty } from "../types";
import { generateSapCp003EnglishExplanationCandidate } from "./runtime";
import type {
  SapCp003EnglishExplanationCandidate,
  SapCp003ExplanationReviewRecord,
} from "./types";

const DIFFICULTY_ORDER: readonly SapCp003Difficulty[] = Object.freeze(["EASY", "MEDIUM", "HARD"]);

function selectThree(
  candidates: readonly SapCp003EnglishExplanationCandidate[],
): readonly SapCp003EnglishExplanationCandidate[] {
  const selected: SapCp003EnglishExplanationCandidate[] = [];
  const usedFingerprints = new Set<string>();

  for (const difficulty of DIFFICULTY_ORDER) {
    const candidate = candidates.find((item) =>
      item.difficulty === difficulty && !usedFingerprints.has(item.explanationFingerprint),
    );
    if (!candidate) continue;
    selected.push(candidate);
    usedFingerprints.add(candidate.explanationFingerprint);
  }

  for (const candidate of candidates) {
    if (selected.length === 3) break;
    if (usedFingerprints.has(candidate.explanationFingerprint)) continue;
    selected.push(candidate);
    usedFingerprints.add(candidate.explanationFingerprint);
  }

  if (selected.length !== 3) {
    throw new Error(`${candidates[0]?.prototypeId ?? "UNKNOWN"}: could not select three explanation-review records.`);
  }
  return Object.freeze(selected);
}

export function generateSapCp003ExplanationReviewExport(): readonly SapCp003ExplanationReviewRecord[] {
  const records: SapCp003ExplanationReviewRecord[] = [];
  let reviewNumber = 1;

  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    const candidates: SapCp003EnglishExplanationCandidate[] = [];
    for (let seed = 1; seed <= 100; seed += 1) {
      candidates.push(generateSapCp003EnglishExplanationCandidate(prototypeId, seed));
    }
    for (const candidate of selectThree(candidates)) {
      records.push(Object.freeze({
        reviewId: `SAP-CP003-EXPLANATION-REVIEW-${String(reviewNumber).padStart(3, "0")}`,
        permanentQlId: candidate.permanentQlId,
        prototypeId: candidate.prototypeId,
        taskDirection: candidate.taskDirection,
        difficulty: candidate.difficulty,
        stem: candidate.stem,
        correctAnswer: candidate.canonicalAnswer,
        explanation: candidate.explanation,
        explanationFingerprint: candidate.explanationFingerprint,
      }));
      reviewNumber += 1;
    }
  }

  return Object.freeze(records);
}
