import { remodelCp002DistractorExplanations } from "./distractor-explanation-integrity";
import {
  cp002SolutionsMatch,
  formatCp002Solution,
  generateCp002Candidate as generateCoreCp002Candidate,
  generateCp002ReviewRows as generateCoreCp002ReviewRows,
  hashSeed,
  stableStringify,
} from "./runtime";
import type { TsdCp002GeneratedQuestion } from "./types";

function remodel(question: TsdCp002GeneratedQuestion): TsdCp002GeneratedQuestion {
  return remodelCp002DistractorExplanations(question);
}

export function generateCp002Candidate(
  ...args: Parameters<typeof generateCoreCp002Candidate>
): TsdCp002GeneratedQuestion {
  return remodel(generateCoreCp002Candidate(...args));
}

export function generateCp002ReviewRows(): readonly TsdCp002GeneratedQuestion[] {
  return Object.freeze(generateCoreCp002ReviewRows().map(remodel));
}

export {
  cp002SolutionsMatch,
  formatCp002Solution,
  hashSeed,
  stableStringify,
};
