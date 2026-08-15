import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V12,
  generateIntCp005QuestionV12,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005QuestionV12,
} from "./cp005-variable-growth-decay-runtime-v12";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
const OUT_DIR = resolve(process.cwd(), "dist/quant-v4/int-cp005-review-v12");
mkdirSync(OUT_DIR, { recursive: true });

function seedForPosition(qlId: IntCp005QlId, target: number): string {
  for (let attempt = 0; attempt < 10000; attempt += 1) {
    const seed = `int-cp005-v12-review-${qlId}-pos-${target}-${attempt}`;
    if (generateIntCp005QuestionV12(qlId, seed, "en-IN").correctIndex === target) return seed;
  }
  throw new Error(`${qlId}: no review seed for answer position ${target}`);
}

function render(question: IntCp005QuestionV12, ordinal: number): string {
  const letters = ["A", "B", "C", "D"];
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
    ...question.options.map((option, index) => `${letters[index]}. ${option.text}`),
    "",
    `**Correct answer:** ${letters[question.correctIndex]}. ${question.correctAnswer}`,
    "",
    `**Key idea:** ${question.explanation.keyIdea}`,
    "",
    "**Explanation**",
    ...question.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    `**Common mistake:** ${question.explanation.commonMistake}`,
    "",
    "---",
    "",
  ].join("\n");
}

const summary: Record<string, unknown> = { runtimeVersion: INT_CP005_RUNTIME_VERSION_V12, qlRange: "INT-QL-086..INT-QL-095", qlCount: 10, perLocaleQuestions: 40, totalQuestions: 120 };

for (const locale of LOCALES) {
  const questions: IntCp005QuestionV12[] = [];
  const positions = [0, 0, 0, 0];
  const stems = new Set<string>();
  const contexts = new Map<string, number>();
  const representations = new Map<string, number>();

  for (const qlId of INT_CP005_QL_IDS) {
    for (let target = 0; target < 4; target += 1) {
      const seed = seedForPosition(qlId, target);
      const question = generateIntCp005QuestionV12(qlId, seed, locale);
      if (question.correctIndex !== target) throw new Error(`${qlId}/${locale}: answer position drift`);
      if (stems.has(question.presentation.markdown)) throw new Error(`${qlId}/${locale}: duplicate review stem`);
      stems.add(question.presentation.markdown);
      positions[target] += 1;
      contexts.set(question.mathematicalState.context, (contexts.get(question.mathematicalState.context) ?? 0) + 1);
      representations.set(question.representation, (representations.get(question.representation) ?? 0) + 1);
      questions.push(question);
    }
  }

  if (questions.length !== 40) throw new Error(`${locale}: expected 40 questions`);
  if (positions.some((count) => count !== 10)) throw new Error(`${locale}: unbalanced answer positions ${positions.join("/")}`);

  const markdown = [
    `# INT-CP-005 Variable Rates, Growth & Decay — ${locale} Review Pack V12`,
    "",
    `Runtime: ${INT_CP005_RUNTIME_VERSION_V12}`,
    `Questions: ${questions.length}`,
    `Answer positions: ${positions.join(" / ")}`,
    `Contexts: ${JSON.stringify(Object.fromEntries(contexts))}`,
    `Representations: ${JSON.stringify(Object.fromEntries(representations))}`,
    "",
    "---",
    "",
    ...questions.map((question, index) => render(question, index + 1)),
  ].join("\n");

  writeFileSync(resolve(OUT_DIR, `INT-CP-005-V12-REVIEW-${locale}.md`), markdown, "utf8");
  summary[locale] = { questions: 40, answerPositions: positions, contexts: Object.fromEntries(contexts), representations: Object.fromEntries(representations), duplicateStems: 0 };
}

writeFileSync(resolve(OUT_DIR, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V12_REVIEW_EXPORT");
