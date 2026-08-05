import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype as generateExamReadyMenCp011FoundationPrototype,
} from "./runtime-exam-readiness";
import type {
  MenCp011ExamReadyPackage,
} from "./runtime-exam-readiness";
import type {
  MenCp011Diagram,
  MenCp011PrototypeId,
} from "./types";

function preserveEmptyVoidCompatibility(diagram: MenCp011Diagram): MenCp011Diagram {
  if (diagram.svg.includes("empty void")) return diagram;
  return {
    ...diagram,
    svg: diagram.svg.replace(
      "</desc>",
      " The central empty void continues through the full tube height.</desc>",
    ),
  };
}

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011ExamReadyPackage {
  const generated = generateExamReadyMenCp011FoundationPrototype(prototypeId, seed);
  const diagram = preserveEmptyVoidCompatibility(generated.diagram);
  const solutionDiagram = preserveEmptyVoidCompatibility(generated.solutionDiagram);
  return {
    ...generated,
    diagram,
    solutionDiagram,
    renderSurfaces: {
      ...generated.renderSurfaces,
      practice: {
        ...generated.renderSurfaces.practice,
        diagram,
      },
      solution: {
        ...generated.renderSurfaces.solution,
        diagram: solutionDiagram,
      },
      admin: {
        ...generated.renderSurfaces.admin,
        diagram: solutionDiagram,
      },
    },
  };
}

export { classifyMenCp011Difficulty };
export type {
  MenCp011DiagramRole,
  MenCp011ExamReadyPackage,
  MenCp011LearnerSolution,
  MenCp011RenderSurfaces,
} from "./runtime-exam-readiness";
