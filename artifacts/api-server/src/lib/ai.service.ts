export type AIRefineInput = {
  questionText: string;
  options: string[];
  correctAnswer: string;
  section: string;
  topic: string;
};

export type AIRefineResult = {
  questionText: string;
  options: string[];
  explanation: string;
  refined: boolean;
  source: "openai" | "mock" | "skipped";
};

export function isAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

function mockRefine(input: AIRefineInput, source: AIRefineResult["source"]): AIRefineResult {
  return {
    questionText: input.questionText,
    options: input.options,
    explanation: `[${source}] Correct answer: ${input.correctAnswer}.`,
    refined: false,
    source,
  };
}

export async function refineWithAI(input: AIRefineInput): Promise<AIRefineResult> {
  if (!isAIConfigured()) {
    return mockRefine(input, "mock");
  }

  // The current app intentionally keeps the AI layer optional so the
  // generator still works in local/dev environments without external deps.
  return mockRefine(input, "mock");
}
