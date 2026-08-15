import { MEN_CP_012_PROTOTYPES } from "./registry";
import { generateMenCp012QuestionV2 } from "./presentation-v2";

export function buildMenCp012ReviewBatch() {
  const review = [];
  const globallyUsedStems = new Set<string>();

  for (const definition of MEN_CP_012_PROTOTYPES) {
    for (let targetPosition = 0; targetPosition < 4; targetPosition += 1) {
      let selected: ReturnType<typeof generateMenCp012QuestionV2> | null = null;
      for (let attempt = targetPosition; attempt < 4096; attempt += 4) {
        const seed = `review:${definition.prototypeId}:${attempt}`;
        const question = generateMenCp012QuestionV2(definition.prototypeId, seed);
        if (question.correctIndex !== targetPosition) continue;
        if (globallyUsedStems.has(question.stem)) continue;
        selected = question;
        break;
      }
      if (!selected) throw new Error(`Could not find distinct review state for ${definition.prototypeId}/position-${targetPosition}.`);
      globallyUsedStems.add(selected.stem);
      review.push(selected);
    }
  }

  return review;
}
