import fs from "node:fs";
import path from "node:path";
import {
  INT_CP005_QL_IDS,
  INT_CP005_RUNTIME_VERSION_V15,
  generateIntCp005QuestionV15,
  type IntCp005Locale,
  type IntCp005QlId,
} from "./cp005-variable-growth-decay-runtime-v15";

const LOCALES = Object.freeze(["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly IntCp005Locale[]);
const OUT_DIR = path.resolve(process.cwd(), "dist/quant-v4/int-cp005-review-v15");
fs.mkdirSync(OUT_DIR, { recursive: true });

function findSeed(qlId: IntCp005QlId, locale: IntCp005Locale, targetIndex: number): string {
  for (let attempt = 0; attempt < 4000; attempt += 1) {
    const seed = `int-cp005-v15-review-${qlId}-pos-${targetIndex}-${attempt}`;
    if (generateIntCp005QuestionV15(qlId, seed, locale).correctIndex === targetIndex) return seed;
  }
  throw new Error(`${qlId}/${locale}: could not find answer-position ${targetIndex}`);
}

function render(locale: IntCp005Locale): { markdown: string; answerPositions: number[]; contexts: Record<string, number> } {
  const out: string[] = [
    `# INT-CP-005 V15 Review — ${locale}`,
    "",
    `Runtime: \`${INT_CP005_RUNTIME_VERSION_V15}\``,
    "",
  ];
  const answerPositions = [0, 0, 0, 0];
  const contexts: Record<string, number> = {};
  let ordinal = 1;
  for (const qlId of INT_CP005_QL_IDS) {
    for (let target = 0; target < 4; target += 1) {
      const seed = findSeed(qlId, locale, target);
      const q = generateIntCp005QuestionV15(qlId, seed, locale);
      answerPositions[q.correctIndex] += 1;
      contexts[q.mathematicalState.context] = (contexts[q.mathematicalState.context] ?? 0) + 1;
      out.push(`## ${ordinal}. ${qlId} — ${q.difficulty}`, "");
      out.push(`**Seed:** \`${seed}\`  `);
      out.push(`**Representation:** ${q.representation}  `);
      out.push(`**Context:** ${q.mathematicalState.context}  `);
      out.push(`**Answer semantic:** ${q.answerSemantic}`, "");
      out.push(q.presentation.markdown, "");
      q.options.forEach((option, index) => out.push(`${String.fromCharCode(65 + index)}. ${option.text}`));
      out.push("", `**Correct answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.correctAnswer}`, "");
      out.push(`**Key idea:** ${q.explanation.keyIdea}`, "", "**Explanation**");
      q.explanation.steps.forEach((step, index) => out.push(`${index + 1}. ${step}`));
      if (q.explanation.commonMistake) out.push("", `**Common mistake:** ${q.explanation.commonMistake}`);
      out.push("", "---", "");
      ordinal += 1;
    }
  }
  return { markdown: out.join("\n"), answerPositions, contexts };
}

const summary: Record<string, unknown> = {
  runtimeVersion: INT_CP005_RUNTIME_VERSION_V15,
  qlRange: "INT-QL-086..INT-QL-095",
  qlCount: INT_CP005_QL_IDS.length,
  perLocaleQuestions: INT_CP005_QL_IDS.length * 4,
  totalQuestions: INT_CP005_QL_IDS.length * 4 * LOCALES.length,
};

for (const locale of LOCALES) {
  const result = render(locale);
  fs.writeFileSync(path.join(OUT_DIR, `INT-CP-005-V15-REVIEW-${locale}.md`), result.markdown);
  summary[locale] = {
    questions: INT_CP005_QL_IDS.length * 4,
    answerPositions: result.answerPositions,
    contexts: result.contexts,
  };
  if (result.answerPositions.some((count) => count !== INT_CP005_QL_IDS.length)) {
    throw new Error(`${locale}: answer positions are not balanced 10/10/10/10`);
  }
}

fs.writeFileSync(path.join(OUT_DIR, "summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP005_VARIABLE_GROWTH_DECAY_V15_REVIEW_EXPORT");
