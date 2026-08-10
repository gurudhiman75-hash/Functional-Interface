import { remodelTsdContext } from "../context-plausibility";
import { remodelCp002DistractorExplanations } from "./distractor-explanation-integrity";
import { makeCp002FinalStudentFeedback } from "./final-student-feedback";
import {
  cp002SolutionsMatch,
  formatCp002Solution,
  generateCp002Candidate as generateCoreCp002Candidate,
  generateCp002ReviewRows as generateCoreCp002ReviewRows,
  hashSeed,
  stableStringify,
} from "./runtime";
import type { TsdCp002GeneratedQuestion } from "./types";

/** Single learner-output pipeline for CP-002. */
export function remodelCp002LearnerQuestion(
  question: TsdCp002GeneratedQuestion,
): TsdCp002GeneratedQuestion {
  return makeCp002FinalStudentFeedback(
    remodelCp002DistractorExplanations(remodelTsdContext(question)),
  );
}

export function generateCp002Candidate(
  ...args: Parameters<typeof generateCoreCp002Candidate>
): TsdCp002GeneratedQuestion {
  return remodelCp002LearnerQuestion(generateCoreCp002Candidate(...args));
}

export function generateCp002ReviewRows(): readonly TsdCp002GeneratedQuestion[] {
  return Object.freeze(generateCoreCp002ReviewRows().map(remodelCp002LearnerQuestion));
}

export {
  cp002SolutionsMatch,
  formatCp002Solution,
  hashSeed,
  stableStringify,
};
