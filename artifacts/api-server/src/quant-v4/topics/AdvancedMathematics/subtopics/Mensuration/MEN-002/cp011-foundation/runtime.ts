import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype as generateExamReadyMenCp011FoundationPrototype,
} from "./runtime-exam-readiness";
import type {
  MenCp011ExamReadyPackage,
} from "./runtime-exam-readiness";
import type {
  MenCp011PrototypeId,
} from "./types";

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011ExamReadyPackage {
  return generateExamReadyMenCp011FoundationPrototype(prototypeId, seed);
}

export { classifyMenCp011Difficulty };
export type {
  MenCp011DiagramRole,
  MenCp011ExamReadyPackage,
  MenCp011LearnerSolution,
  MenCp011RenderSurfaces,
} from "./runtime-exam-readiness";
