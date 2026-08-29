export type QuizLanguageCode = "en" | "hi" | "pa";

export type CurrentAffairsQuizSnapshotPayload = {
  stem: string;
  explanation: string;
  options: string[];
  correctIndex: number;
};

export type CurrentAffairsQuizLearnerQuestion = {
  id: string;
  itemNumber: number;
  questionFamily: string;
  stem: string;
  options: string[];
};

export type CurrentAffairsQuizGradeInput = {
  id: string;
  selectedIndex: number | null;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function text(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

export function normalizeQuizLanguage(value: unknown): QuizLanguageCode | null {
  const code = text(value).toLowerCase();
  return code === "en" || code === "hi" || code === "pa" ? code : null;
}

export function quizSnapshotPayload(value: unknown): CurrentAffairsQuizSnapshotPayload | null {
  const payload = record(value);
  const stem = text(payload.stem) || text(payload.text);
  const explanation = text(payload.explanation);
  const options = Array.isArray(payload.options)
    ? payload.options.map((option) => text(option)).filter(Boolean)
    : [];
  const correctIndex = Number(payload.correctIndex ?? payload.correct);
  if (!stem || !explanation || options.length < 2 || options.length > 8) return null;
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) return null;
  return { stem, explanation, options, correctIndex };
}

export function learnerQuizQuestion(args: {
  id: string;
  itemNumber: number;
  questionFamily: string;
  payload: CurrentAffairsQuizSnapshotPayload;
}): CurrentAffairsQuizLearnerQuestion {
  return {
    id: args.id,
    itemNumber: args.itemNumber,
    questionFamily: args.questionFamily,
    stem: args.payload.stem,
    options: [...args.payload.options],
  };
}

export function gradeCurrentAffairsQuiz(args: {
  items: Array<{
    id: string;
    itemNumber: number;
    questionFamily: string;
    payload: CurrentAffairsQuizSnapshotPayload;
  }>;
  answers: CurrentAffairsQuizGradeInput[];
}) {
  const answerById = new Map<string, number | null>();
  for (const answer of args.answers) {
    if (!answer.id || answerById.has(answer.id)) continue;
    answerById.set(answer.id, answer.selectedIndex);
  }

  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  const results = args.items.map((item) => {
    const selected = answerById.has(item.id) ? answerById.get(item.id)! : null;
    const validSelection = Number.isInteger(selected)
      && Number(selected) >= 0
      && Number(selected) < item.payload.options.length;
    const selectedIndex = validSelection ? Number(selected) : null;
    const isCorrect = selectedIndex === item.payload.correctIndex;
    if (selectedIndex == null) unanswered += 1;
    else if (isCorrect) correct += 1;
    else wrong += 1;
    return {
      id: item.id,
      itemNumber: item.itemNumber,
      questionFamily: item.questionFamily,
      selectedIndex,
      correctIndex: item.payload.correctIndex,
      isCorrect,
      correctAnswer: item.payload.options[item.payload.correctIndex],
      explanation: item.payload.explanation,
    };
  });
  const total = args.items.length;
  return {
    total,
    correct,
    wrong,
    unanswered,
    scorePercent: total > 0 ? Number(((correct / total) * 100).toFixed(2)) : 0,
    results,
  };
}
