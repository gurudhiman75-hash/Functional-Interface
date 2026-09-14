import {
  SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3,
  generatePhysicsDepthWave2CpV3,
  type PhysicsDepthWave2QuestionV3,
} from "./sci-physics-depth-wave2-v3";

function place(options: string[], answer: string, correctIndex: number): string[] {
  const distractors = options.filter((option) => option !== answer).slice(0, 3);
  const out = distractors.slice();
  out.splice(correctIndex, 0, answer);
  return out;
}

function polish(question: PhysicsDepthWave2QuestionV3): PhysicsDepthWave2QuestionV3 {
  if (question.semanticKey.endsWith("K=273")) {
    const answer = "0 °C";
    return {
      ...question,
      canonicalAnswer: answer,
      options: place([answer, "10 °C", "100 °C", "273 °C"], answer, question.correctIndex),
    };
  }

  if (question.familyId === "ELECTRICITY-COST") {
    const fix = (value: string) => {
      const match = value.match(/^([0-9.]+) ₹$/);
      return match ? `₹${match[1]}` : value;
    };
    const options = question.options.map(fix);
    return {
      ...question,
      options,
      canonicalAnswer: fix(question.canonicalAnswer),
    };
  }

  if (question.cpId === "SCI-CP-009" && question.familyId === "TRANSFORMER-VOLTAGE") {
    return { ...question, difficulty: "Easy" };
  }

  return question;
}

export function generatePhysicsDepthWave2ReviewedCpV3(cpId: keyof typeof SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3): PhysicsDepthWave2QuestionV3[] {
  return generatePhysicsDepthWave2CpV3(cpId).map(polish);
}

export function generatePhysicsDepthWave2ReviewedAllV3(): PhysicsDepthWave2QuestionV3[] {
  return (Object.keys(SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3) as Array<keyof typeof SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3>)
    .flatMap((cpId) => generatePhysicsDepthWave2ReviewedCpV3(cpId));
}

export function auditPhysicsDepthWave2ReviewedV3() {
  const errors: string[] = [];
  const all = generatePhysicsDepthWave2ReviewedAllV3();
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const cpCounts: Record<string, number> = {};
  const familySets: Record<string, Set<string>> = {};
  const cpAnswerPositions: Record<string, [number,number,number,number]> = {};
  const difficulty: Record<string, Record<string, number>> = {};

  for (const q of all) {
    if (ids.has(q.questionId)) errors.push(`duplicate id ${q.questionId}`);
    ids.add(q.questionId);
    if (semantics.has(q.semanticKey)) errors.push(`duplicate semantic key ${q.semanticKey}`);
    semantics.add(q.semanticKey);
    if (q.options.length !== 4 || new Set(q.options).size !== 4) errors.push(`${q.questionId}: invalid options`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) errors.push(`${q.questionId}: answer mismatch`);
    if (q.options.some((option) => /None of \d/.test(option))) errors.push(`${q.questionId}: placeholder option leaked`);
    if (!q.explanation.trim()) errors.push(`${q.questionId}: missing explanation`);
    if (!q.sourceIds.length) errors.push(`${q.questionId}: missing provenance`);
    if (!q.reviewOnly || q.runtimeRegistered) errors.push(`${q.questionId}: lifecycle lock broken`);
    cpCounts[q.cpId] = (cpCounts[q.cpId] ?? 0) + 1;
    familySets[q.cpId] ??= new Set<string>();
    familySets[q.cpId].add(q.familyId);
    cpAnswerPositions[q.cpId] ??= [0,0,0,0];
    cpAnswerPositions[q.cpId][q.correctIndex] += 1;
    difficulty[q.cpId] ??= {};
    difficulty[q.cpId][q.difficulty] = (difficulty[q.cpId][q.difficulty] ?? 0) + 1;
  }

  const cpFamilyCounts: Record<string, number> = {};
  for (const [cpId, expected] of Object.entries(SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3)) {
    if ((cpCounts[cpId] ?? 0) !== expected) errors.push(`${cpId}: expected ${expected}, found ${cpCounts[cpId] ?? 0}`);
    cpFamilyCounts[cpId] = familySets[cpId]?.size ?? 0;
    if (cpFamilyCounts[cpId] < 7) errors.push(`${cpId}: insufficient family diversity ${cpFamilyCounts[cpId]}`);
    const positions = cpAnswerPositions[cpId] ?? [0,0,0,0];
    if (positions.some((n) => n !== expected/4)) errors.push(`${cpId}: answer position drift ${positions.join("/")}`);
    if (!(difficulty[cpId]?.Easy > 0) || !(difficulty[cpId]?.Medium > 0) || !(difficulty[cpId]?.Hard > 0)) errors.push(`${cpId}: missing difficulty band`);
  }
  const expectedTotal = Object.values(SCI_PHYSICS_DEPTH_WAVE2_TARGETS_V3).reduce((sum,n) => sum+n,0);
  if (all.length !== expectedTotal) errors.push(`Wave 2 total expected ${expectedTotal}, found ${all.length}`);
  return { valid: errors.length === 0, errors, totalQuestions: all.length, cpCounts, cpFamilyCounts, cpAnswerPositions, difficulty };
}
