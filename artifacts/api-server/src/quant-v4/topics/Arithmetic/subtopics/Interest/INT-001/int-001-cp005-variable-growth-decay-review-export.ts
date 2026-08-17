import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  INT_CP005_QL_IDS,
  generateIntCp005Question,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005Question,
} from "./cp005-variable-growth-decay-runtime";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
const OUT_DIR = resolve(process.cwd(), "dist/quant-v4/int-cp005-review-v1");
mkdirSync(OUT_DIR, { recursive: true });

function seedForAnswerPosition(qlId: IntCp005QlId, targetIndex: number): string {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const seed = `int-cp005-review-${qlId}-pos-${targetIndex}-${attempt}`;
    if (generateIntCp005Question(qlId, seed, "en-IN").correctIndex === targetIndex) return seed;
  }
  throw new Error(`${qlId}: could not find review seed for answer position ${targetIndex}`);
}

function renderQuestion(question: IntCp005Question, ordinal: number): string {
  const optionLetters = ["A", "B", "C", "D"];
  const options = question.options.map((option, index) => `${optionLetters[index]}. ${option.text}`).join("\n");
  const explanation = question.explanation.steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  return [
    `## ${ordinal}. ${question.qlId} — ${question.difficulty}`,
    "",
    `**Seed:** \`${question.seed}\`  `,
    `**Representation:** ${question.representation}  `,
    `**Context:** ${question.mathematicalState.context}  `,
    `**Answer semantic:** ${question.answerSemantic}`,
    "",
    question.presentation.markdown,
    "",
    options,
    "",
    `**Correct answer:** ${optionLetters[question.correctIndex]}. ${question.correctAnswer}`,
    "",
    `**Key idea:** ${question.explanation.keyIdea}`,
    "",
    "**Explanation**",
    explanation,
    "",
    `**Common mistake:** ${question.explanation.commonMistake}`,
    "",
    "---",
    "",
  ].join("\n");
}

const summary: Record<string, unknown> = {
  runtimeVersion: "INT-CP-005-VARIABLE-GROWTH-DECAY-v1",
  qlRange: "INT-QL-086..INT-QL-095",
  qlCount: INT_CP005_QL_IDS.length,
  perLocaleQuestions: 40,
  totalQuestions: 120,
  locales: LOCALES,
  answerPositionPolicy: "one A/B/C/D question per QL per locale",
};

for (const locale of LOCALES) {
  const questions: IntCp005Question[] = [];
  const stems = new Set<string>();
  const answerPositions = [0, 0, 0, 0];
  const representations = new Map<string, number>();
  const contexts = new Map<string, number>();

  for (const qlId of INT_CP005_QL_IDS) {
    for (let target = 0; target < 4; target += 1) {
      const seed = seedForAnswerPosition(qlId, target);
      const question = generateIntCp005Question(qlId, seed, locale);
      if (question.correctIndex !== target) throw new Error(`${qlId}/${locale}: locale changed answer position`);
      if (stems.has(question.presentation.markdown)) throw new Error(`${qlId}/${locale}: duplicate learner-facing review stem`);
      stems.add(question.presentation.markdown);
      answerPositions[question.correctIndex] += 1;
      representations.set(question.representation, (representations.get(question.representation) ?? 0) + 1);
      contexts.set(question.mathematicalState.context, (contexts.get(question.mathematicalState.context) ?? 0) + 1);
      questions.push(question);
    }
  }

  if (questions.length !== 40) throw new Error(`${locale}: expected 40 review questions, got ${questions.length}`);
  if (answerPositions.some((count) => count !== 10)) throw new Error(`${locale}: unbalanced answer positions ${answerPositions.join("/")}`);

  const markdown = [
    `# INT-CP-005 Variable Rates, Growth & Decay — ${locale} Review Pack V1`,
    "",
    `Questions: ${questions.length}`,
    `QLs: ${INT_CP005_QL_IDS.join(", ")}`,
    `Answer positions: ${answerPositions.join(" / ")}`,
    `Representations: ${JSON.stringify(Object.fromEntries(representations))}`,
    `Contexts: ${JSON.stringify(Object.fromEntries(contexts))}`,
    "",
    "---",
    "",
    ...questions.map((question, index) => renderQuestion(question, index + 1)),
  ].join("\n");

  const fileName = `INT-CP-005-V1-REVIEW-${locale}.md`;
  const path = resolve(OUT_DIR, fileName);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, markdown, "utf8");
  summary[locale] = {
    questions: questions.length,
    answerPositions,
    representations: Object.fromEntries(representations),
    contexts: Object.fromEntries(contexts),
    duplicateStems: 0,
  };
}

writeFileSync(resolve(OUT_DIR, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V1_REVIEW_EXPORT");
