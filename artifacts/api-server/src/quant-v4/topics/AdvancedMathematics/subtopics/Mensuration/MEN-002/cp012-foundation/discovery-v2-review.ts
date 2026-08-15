import {
  MEN_CP_012_DISCOVERY_V2_DEFINITIONS,
  generateMenCp012DiscoveryV2,
  type MenCp012DiscoveryQuestion,
} from "./discovery-v2";

export function buildMenCp012DiscoveryV2Review() {
  const review: MenCp012DiscoveryQuestion[] = [];
  const usedStems = new Set<string>();

  for (const definition of MEN_CP_012_DISCOVERY_V2_DEFINITIONS) {
    for (let targetPosition = 0; targetPosition < 4; targetPosition += 1) {
      let selected: MenCp012DiscoveryQuestion | null = null;
      for (let attempt = targetPosition; attempt < 4096; attempt += 4) {
        const seed = `review-v2:${definition.id}:${attempt}`;
        const question = generateMenCp012DiscoveryV2(definition.id, seed);
        if (question.correctIndex !== targetPosition) continue;
        if (usedStems.has(question.stem)) continue;
        selected = question;
        break;
      }
      if (!selected) throw new Error(`Could not select distinct Wave 02 review record for ${definition.id}/position-${targetPosition}.`);
      usedStems.add(selected.stem);
      review.push(selected);
    }
  }

  return review;
}

export function auditMenCp012DiscoveryV2Review() {
  const review = buildMenCp012DiscoveryV2Review();
  const correctPositions = [0, 1, 2, 3].map((position) => review.filter((question) => question.correctIndex === position).length);
  return {
    reviewRecordCount: review.length,
    uniqueStemCount: new Set(review.map((question) => question.stem)).size,
    correctPositions: { A: correctPositions[0], B: correctPositions[1], C: correctPositions[2], D: correctPositions[3] },
    allVerified: review.every((question) => question.verification.valid),
    allFourOptions: review.every((question) => question.options.length === 4),
    allUniqueOptions: review.every((question) => new Set(question.options.map((option) => option.display)).size === 4),
    productLocked: review.every((question) => !question.questionStudioDiscoverable && !question.publiclyPublishable && question.permanentQlId === null),
  } as const;
}
