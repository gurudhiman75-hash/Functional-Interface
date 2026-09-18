import {
  GEO_CLI_001_CP013_REVIEW_BATCH_V3,
  type GeoCli001Cp013Question,
  type GeoCli001Cp013Difficulty,
} from "./geo-cli-001-cp013-review-batch-v3";

type Patch = Partial<Pick<GeoCli001Cp013Question, "stem" | "canonicalAnswer" | "explanation">> & {
  optionReplacements?: Readonly<Record<string, string>>;
};

const PATCHES: Readonly<Record<string, Patch>> = Object.freeze({
  "GEO-CLI-001-CP013-Q001": {
    stem: "What type of climate does India mainly have?",
  },
  "GEO-CLI-001-CP013-Q017": {
    explanation: "Southwesterlies in summer and northeasterlies in winter. The Indian monsoon shows a seasonal reversal of prevailing winds. The land–sea pressure gradient changes between summer and winter, reversing the flow.",
  },
  "GEO-CLI-001-CP013-Q045": {
    canonicalAnswer: "Kerala onset → rapid advance by two main branches → coverage of most of India by mid-July",
    explanation: "The normal pattern begins near Kerala around 1 June, advances through the Arabian Sea and Bay of Bengal branches, and covers most of India by mid-July.",
    optionReplacements: {
      "Kerala onset → rapid advance by two main branches → general coverage by mid-July": "Kerala onset → rapid advance by two main branches → coverage of most of India by mid-July",
    },
  },
  "GEO-CLI-001-CP013-Q053": {
    stem: "During the retreating monsoon, which regional contrast is most typical?",
  },
  "GEO-CLI-001-CP013-Q057": {
    stem: "Which annual rainfall range is classified as low rainfall in India's national rainfall pattern?",
    explanation: "Areas receiving about 50 to 100 cm annually fall in the low-rainfall category in this classification.",
  },
  "GEO-CLI-001-CP013-Q059": {
    explanation: "In this rainfall pattern, areas with variability below 25 per cent generally receive more than 100 cm of annual rainfall.",
  },
  "GEO-CLI-001-CP013-Q063": {
    explanation: "All three statements match the rainfall classification: about 125 cm national average, above 200 cm high rainfall, and below 50 cm inadequate rainfall.",
  },
});

export const GEO_CLI_001_CP013_REVIEW_BATCH_V4: readonly GeoCli001Cp013Question[] = Object.freeze(
  GEO_CLI_001_CP013_REVIEW_BATCH_V3.map((question) => {
    const patch = PATCHES[question.questionId];
    if (!patch) return question;
    const canonicalAnswer = patch.canonicalAnswer ?? question.canonicalAnswer;
    const options = question.options.map((option) => patch.optionReplacements?.[option] ?? option);
    return Object.freeze({
      ...question,
      stem: patch.stem ?? question.stem,
      options: Object.freeze(options),
      canonicalAnswer,
      explanation: patch.explanation ?? question.explanation,
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b|\bbroad(?:ly)?\b/i;

export function auditGeoCli001Cp013ReviewBatchV4() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const sourceQuestionIds = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp013Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const question of GEO_CLI_001_CP013_REVIEW_BATCH_V4) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    if (sourceQuestionIds.has(question.sourceQuestionId)) issues.push(`DUPLICATE_SOURCE:${question.sourceQuestionId}`);
    sourceQuestionIds.add(question.sourceQuestionId);
    const normalizedStem = question.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`DUPLICATE_STEM:${question.questionId}`);
    stems.add(normalizedStem);
    const semantic = `${normalizedStem}::${question.canonicalAnswer.toLowerCase()}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
    const normalizedExplanation = question.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (explanations.has(normalizedExplanation)) issues.push(`DUPLICATE_EXPLANATION:${question.questionId}`);
    explanations.add(normalizedExplanation);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (question.stem.length < 20 || question.stem.length > 240 || !question.stem.trim().endsWith("?")) issues.push(`STEM_SHAPE:${question.questionId}`);
    if (question.explanation.length < 45) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${question.questionId}`);
  }

  if (GEO_CLI_001_CP013_REVIEW_BATCH_V4.length !== 108) issues.push(`COUNT:${GEO_CLI_001_CP013_REVIEW_BATCH_V4.length}`);
  for (let n = 1; n <= 108; n += 1) {
    const qlId = `GEO-CLI-001-QL-${String(n).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 1) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 36 || difficultyCounts.Medium !== 60 || difficultyCounts.Hard !== 12) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions.join(",") !== "27,27,27,27") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (stems.size !== 108) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 108) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (explanations.size !== 108) issues.push(`EXPLANATION_COUNT:${explanations.size}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP013_REVIEW_BATCH_V4.length,
    qlCount: Object.keys(qlCounts).length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    stemCount: stems.size,
    semanticCount: semantics.size,
    explanationCount: explanations.size,
    editorialPatchCount: Object.keys(PATCHES).length,
  });
}
