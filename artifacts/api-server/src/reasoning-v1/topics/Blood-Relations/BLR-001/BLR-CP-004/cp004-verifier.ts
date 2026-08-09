import { independentlyVerifyBlrCp004Question } from "./cp004-independent-verifier";
import type { GeneratedBlrCp004Question } from "./cp004-model";

export function verifyBlrCp004Question(
  question: GeneratedBlrCp004Question,
): ReturnType<typeof independentlyVerifyBlrCp004Question> {
  if (question.sourcePrototypeId !== "BLR-CP004-PROT-COUNT-GENDER-MEMBERS") {
    return independentlyVerifyBlrCp004Question(question);
  }
  const targetGender = question.stem.startsWith("How many male members")
    ? "male"
    : "female";
  const memberIds = question.explanation.familyTree.nodes
    .filter((node) => node.gender === targetGender)
    .map((node) => node.id)
    .sort();
  return { value: memberIds.length, memberIds, pairKeys: [] };
}
