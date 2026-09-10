import { generateLogicPuzzleQuestionStudioBatch } from "./question-studio.ts";

type StudioQuestion = Awaited<ReturnType<typeof generateLogicPuzzleQuestionStudioBatch>>["questions"][number];

const packageIds = ["LP-001", "LP-002", "LP-003", "LP-004", "LP-005", "LP-006", "LP-007", "LP-008"] as const;
const seeds = ["editorial-audit-a", "editorial-audit-b", "editorial-audit-c"] as const;
const banned = /associated|counselling centre|city centre|use all the clues|apply all the clues|possible complete schedules from|solver found|solution count/iu;

function countTableSeparators(text: string): number {
  return (text.match(/\|\s*-{3,}\s*\|/gu) ?? []).length;
}

function inspectQuestion(question: StudioQuestion) {
  const text = String(question.text ?? "");
  const explanation = String(question.explanation ?? "");
  const logic = question.logic as { clues?: readonly { text?: string }[] } | undefined;
  const clues = logic?.clues ?? [];
  const clueTexts = clues.map((clue) => String(clue.text ?? "")).filter(Boolean);
  const visibleClues = clueTexts.filter((clue) => text.includes(clue)).length;
  const explainedClues = clueTexts.filter((clue) => explanation.includes(clue)).length;
  const answer = String(question.answer ?? "");
  const lineCount = Array.isArray(question.packageExplanation?.lines) ? question.packageExplanation.lines.length : 0;

  return {
    allCluesVisible: clueTexts.length > 0 && visibleClues === clueTexts.length,
    allCluesQuotedInExplanation: clueTexts.length > 0 && explainedClues === clueTexts.length,
    answerVisible: answer.length > 0 && explanation.includes(answer),
    progressiveTables: countTableSeparators(explanation) >= 2,
    multiStep: lineCount >= Math.min(3, clueTexts.length + 1),
    bannedFree: !banned.test(`${text}\n${explanation}`),
    clueCount: clueTexts.length,
    lineCount,
  };
}

for (const packageId of packageIds) {
  const questions: StudioQuestion[] = [];
  for (const seed of seeds) {
    const result = await generateLogicPuzzleQuestionStudioBatch({ packageId, language: "en", seed: `${seed}:${packageId}`, count: 12 });
    questions.push(...result.questions);
  }

  const inspected = questions.map(inspectQuestion);
  const total = inspected.length;
  const count = (key: keyof Pick<ReturnType<typeof inspectQuestion>, "allCluesVisible" | "allCluesQuotedInExplanation" | "answerVisible" | "progressiveTables" | "multiStep" | "bannedFree">) => inspected.filter((row) => row[key]).length;
  const avgClues = inspected.reduce((sum, row) => sum + row.clueCount, 0) / total;
  const avgLines = inspected.reduce((sum, row) => sum + row.lineCount, 0) / total;

  console.log(JSON.stringify({
    packageId,
    questions: total,
    allCluesVisible: count("allCluesVisible"),
    allCluesQuotedInExplanation: count("allCluesQuotedInExplanation"),
    answerVisible: count("answerVisible"),
    progressiveTables: count("progressiveTables"),
    multiStep: count("multiStep"),
    bannedFree: count("bannedFree"),
    avgClues: Number(avgClues.toFixed(2)),
    avgExplanationLines: Number(avgLines.toFixed(2)),
  }));
}
