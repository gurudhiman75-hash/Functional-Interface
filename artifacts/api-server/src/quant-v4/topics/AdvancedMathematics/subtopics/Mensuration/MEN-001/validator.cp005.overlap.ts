import type {
  Men001QuestionPackage,
  Men001ValidationCheck,
} from "./types";

type Question = Omit<Men001QuestionPackage, "validation">;

export function validateMen001Cp005Overlap(
  question: Question,
): Men001ValidationCheck[] {
  if (question.solveMode !== "findOverlappingRectanglesUnionArea") return [];
  const value = (key: string) => Number(question.solver.workingValues[key]);
  const rectangleArea = value("rectangleArea");
  const componentArea = value("componentArea");
  const overlapArea = value("overlapArea");
  const area = value("area");
  return [
    {
      name: "cp005-overlap-inclusion-exclusion",
      passed:
        rectangleArea > overlapArea &&
        componentArea > overlapArea &&
        rectangleArea + componentArea - overlapArea === area,
      message:
        "Overlapping composite area must add both component areas and subtract the common overlap exactly once.",
    },
  ];
}
