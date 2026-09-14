import {
  SCI_PHYSICS_DEPTH_V3_TARGETS,
  generatePhysicsDepthCpV3,
  type PhysicsDepthQuestionV3,
} from "./sci-physics-depth-generator-v3";

function repairPlaceholderOption(question: PhysicsDepthQuestionV3): PhysicsDepthQuestionV3 {
  if (!question.options.some((option) => option.startsWith("None of "))) return question;

  const answerValue = Number.parseFloat(question.canonicalAnswer);
  if (!Number.isFinite(answerValue)) throw new Error(`${question.questionId}: cannot repair non-numeric answer`);
  const suffix = question.canonicalAnswer.replace(/^[-+]?\d*\.?\d+/, "");
  const existing = new Set(question.options.filter((option) => !option.startsWith("None of ")));
  const candidates = [answerValue * 1.25, answerValue * 0.75, answerValue * 3, answerValue * 0.25, answerValue + 1, answerValue + 5];

  let replacement: string | undefined;
  for (const value of candidates) {
    if (!(value > 0)) continue;
    const number = Number.isInteger(value) ? String(value) : value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
    const candidate = `${number}${suffix}`;
    if (!existing.has(candidate) && candidate !== question.canonicalAnswer) {
      replacement = candidate;
      break;
    }
  }
  if (!replacement) throw new Error(`${question.questionId}: could not create a distinct numerical distractor`);

  return {
    ...question,
    options: question.options.map((option) => option.startsWith("None of ") ? replacement! : option),
  };
}

export function generatePhysicsDepthReviewedCpV3(cpId: keyof typeof SCI_PHYSICS_DEPTH_V3_TARGETS): PhysicsDepthQuestionV3[] {
  return generatePhysicsDepthCpV3(cpId).map(repairPlaceholderOption);
}

export function generatePhysicsDepthReviewedAllV3(): PhysicsDepthQuestionV3[] {
  return (Object.keys(SCI_PHYSICS_DEPTH_V3_TARGETS) as Array<keyof typeof SCI_PHYSICS_DEPTH_V3_TARGETS>)
    .flatMap((cpId) => generatePhysicsDepthReviewedCpV3(cpId));
}

export type PhysicsDepthReviewedAuditV3 = {
  valid: boolean;
  errors: string[];
  totalQuestions: number;
  cpCounts: Record<string, number>;
  cpFamilyCounts: Record<string, number>;
  cpAnswerPositions: Record<string, [number, number, number, number]>;
  difficulty: Record<string, Record<string, number>>;
};

export function auditPhysicsDepthReviewedV3(): PhysicsDepthReviewedAuditV3 {
  const errors: string[] = [];
  const questions = generatePhysicsDepthReviewedAllV3();
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const cpCounts: Record<string, number> = {};
  const familySets: Record<string, Set<string>> = {};
  const cpAnswerPositions: Record<string, [number, number, number, number]> = {};
  const difficulty: Record<string, Record<string, number>> = {};

  for (const q of questions) {
    if (ids.has(q.questionId)) errors.push(`duplicate id: ${q.questionId}`);
    ids.add(q.questionId);
    if (semantics.has(q.semanticKey)) errors.push(`duplicate semantic payload: ${q.semanticKey}`);
    semantics.add(q.semanticKey);
    if (q.options.length !== 4 || new Set(q.options).size !== 4) errors.push(`${q.questionId}: options must be four distinct values`);
    if (q.options.some((option) => option.startsWith("None of "))) errors.push(`${q.questionId}: placeholder distractor leaked`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) errors.push(`${q.questionId}: keyed answer mismatch`);
    if (!q.explanation.trim()) errors.push(`${q.questionId}: explanation missing`);
    if (!q.sourceIds.length) errors.push(`${q.questionId}: provenance missing`);
    if (!q.reviewOnly || q.runtimeRegistered) errors.push(`${q.questionId}: lifecycle gate broken`);

    cpCounts[q.cpId] = (cpCounts[q.cpId] ?? 0) + 1;
    familySets[q.cpId] ??= new Set<string>();
    familySets[q.cpId].add(q.familyId);
    cpAnswerPositions[q.cpId] ??= [0, 0, 0, 0];
    cpAnswerPositions[q.cpId][q.correctIndex] += 1;
    difficulty[q.cpId] ??= {};
    difficulty[q.cpId][q.difficulty] = (difficulty[q.cpId][q.difficulty] ?? 0) + 1;
  }

  const cpFamilyCounts: Record<string, number> = {};
  for (const [cpId, expected] of Object.entries(SCI_PHYSICS_DEPTH_V3_TARGETS)) {
    if ((cpCounts[cpId] ?? 0) !== expected) errors.push(`${cpId}: expected ${expected}, found ${cpCounts[cpId] ?? 0}`);
    cpFamilyCounts[cpId] = familySets[cpId]?.size ?? 0;
    if (cpFamilyCounts[cpId] < 8) errors.push(`${cpId}: insufficient family diversity (${cpFamilyCounts[cpId]})`);
    const expectedPosition = expected / 4;
    const positions = cpAnswerPositions[cpId] ?? [0, 0, 0, 0];
    if (positions.some((value) => value !== expectedPosition)) errors.push(`${cpId}: answer balance drift ${positions.join("/")}`);
    if (!(difficulty[cpId]?.Easy > 0) || !(difficulty[cpId]?.Medium > 0) || !(difficulty[cpId]?.Hard > 0)) errors.push(`${cpId}: all three difficulty bands must be represented`);
  }

  const expectedTotal = Object.values(SCI_PHYSICS_DEPTH_V3_TARGETS).reduce((sum, value) => sum + value, 0);
  if (questions.length !== expectedTotal) errors.push(`expected ${expectedTotal} total V3 questions, found ${questions.length}`);
  return { valid: errors.length === 0, errors, totalQuestions: questions.length, cpCounts, cpFamilyCounts, cpAnswerPositions, difficulty };
}
