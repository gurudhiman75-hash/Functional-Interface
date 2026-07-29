import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CLS_CP002_QL_ID } from "./cp002-permanent-contract";
import { generateClsCp002Question } from "./cp002-multilingual-runtime";
import { generateClsCp002EnglishQuestion } from "./cp002-permanent-runtime";
import { CLS_CP002_PROTOTYPES } from "./relation-registry";
import type { ClsCp002Locale } from "./localization/cp002-language-pack";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp002-permanent-review");
const locales: readonly ClsCp002Locale[] = ["en-IN", "hi-IN", "pa-IN"];

function selectReviewSeeds(): number[] {
  const selected: number[] = [];
  const prototypes = new Set<string>();
  const optionCounts = new Set<number>();
  const difficulties = new Set<string>();
  const families = new Set<string>();
  const relations = new Set<string>();

  for (let seed = 0; seed < 10_000 && selected.length < 30; seed += 1) {
    const question = generateClsCp002EnglishQuestion(CLS_CP002_QL_ID, seed);
    const improvesRequiredCoverage =
      !prototypes.has(question.metadata.sourcePrototypeId)
      || !optionCounts.has(question.options.length)
      || !difficulties.has(question.difficulty)
      || !families.has(question.family);
    const improvesRelationCoverage = !relations.has(question.intendedRelationId);
    if (!improvesRequiredCoverage && !improvesRelationCoverage && selected.length >= 20) continue;

    selected.push(seed);
    prototypes.add(question.metadata.sourcePrototypeId);
    optionCounts.add(question.options.length);
    difficulties.add(question.difficulty);
    families.add(question.family);
    relations.add(question.intendedRelationId);
  }

  if (selected.length !== 30) throw new Error(`Unable to select 30 CLS-CP-002 review seeds: ${selected.length}`);
  if (prototypes.size !== CLS_CP002_PROTOTYPES.length) throw new Error(`Review missed a source prototype: ${[...prototypes]}`);
  if (optionCounts.size !== 2) throw new Error(`Review missed an option count: ${[...optionCounts]}`);
  if (difficulties.size !== 3) throw new Error(`Review missed a difficulty: ${[...difficulties]}`);
  if (families.size !== 3) throw new Error(`Review missed a relation family: ${[...families]}`);
  return selected;
}

const reviewSeeds = selectReviewSeeds();
const rows = reviewSeeds.flatMap((seed) =>
  locales.map((locale) => generateClsCp002Question(CLS_CP002_QL_ID, locale, seed)),
);

type Labels = {
  readonly question: string;
  readonly options: string;
  readonly answer: string;
  readonly core: string;
  readonly solution: string;
  readonly shortcut: string;
  readonly trap: string;
};

function labels(locale: ClsCp002Locale): Labels {
  if (locale === "hi-IN") {
    return {
      question: "प्रश्न",
      options: "विकल्प",
      answer: "उत्तर",
      core: "📌 मुख्य बात",
      solution: "📝 हल",
      shortcut: "⚡ जल्दी तरीका",
      trap: "⚠️ ध्यान रखें",
    };
  }
  if (locale === "pa-IN") {
    return {
      question: "ਪ੍ਰਸ਼ਨ",
      options: "ਵਿਕਲਪ",
      answer: "ਜਵਾਬ",
      core: "📌 ਮੁੱਖ ਗੱਲ",
      solution: "📝 ਹੱਲ",
      shortcut: "⚡ ਤੇਜ਼ ਤਰੀਕਾ",
      trap: "⚠️ ਧਿਆਨ ਰੱਖੋ",
    };
  }
  return {
    question: "Question",
    options: "Options",
    answer: "Answer",
    core: "📌 Core Concept",
    solution: "📝 Step-by-Step Solution",
    shortcut: "⚡ Exam Speed Shortcut",
    trap: "⚠️ Common Trap",
  };
}

const markdown = [
  "# CLS-CP-002 Frozen Multilingual Review",
  "",
  `Questions: ${rows.length}`,
  `Canonical review states: ${reviewSeeds.length}`,
  `Permanent QL: ${CLS_CP002_QL_ID}`,
  `Locales: ${locales.join(", ")}`,
  "Runtime status: FROZEN_MULTILINGUAL_RUNTIME_PROOF",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  ...rows.flatMap((question, index) => {
    const text = labels(question.metadata.locale);
    return [
      `## ${index + 1}. ${question.qlId} · ${question.metadata.locale} · ${question.difficulty}`,
      "",
      `**${text.question}:** ${question.stem}`,
      "",
      `**${text.options}:**`,
      "",
      ...question.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
      "",
      `**${text.answer}:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
      "",
      `### ${text.core}`,
      "",
      question.explanation.coreConcept.join(" "),
      "",
      `### ${text.solution}`,
      "",
      ...question.explanation.stepByStep.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
      "",
      `### ${text.shortcut}`,
      "",
      question.explanation.examSpeedShortcut.join(" "),
      "",
      `### ${text.trap}`,
      "",
      question.explanation.commonTrapWarning.join(" "),
      "",
      "<details>",
      "<summary>Reviewer metadata</summary>",
      "",
      `- Canonical seed: ${question.seed}`,
      `- Source control: ${question.metadata.sourcePrototypeId} / ${question.metadata.sourcePrototypeSeed}`,
      `- Solve contract: ${question.metadata.solveContractId}`,
      `- Generation profile: ${question.generationProfile}`,
      `- Intended relation: ${question.intendedRelationId} / ${question.intendedRelationLabel}`,
      `- Option count: ${question.options.length}`,
      `- Ambiguity result: ${question.ambiguityAudit.result}`,
      `- Difficulty score: ${question.difficultyFeatures.score}`,
      `- Difficulty features: \`${JSON.stringify(question.difficultyFeatures)}\``,
      "",
      "</details>",
      "",
      "---",
      "",
    ];
  }),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp002-frozen-multilingual-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp002-frozen-multilingual-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-002 frozen multilingual review written.", {
  outputDir,
  questions: rows.length,
  canonicalStates: reviewSeeds.length,
  locales,
  sourcePrototypes: [...new Set(rows.map((question) => question.metadata.sourcePrototypeId))].sort(),
  optionCounts: [...new Set(rows.map((question) => question.options.length))].sort(),
  difficulties: [...new Set(rows.map((question) => question.difficulty))].sort(),
  relationFamilies: [...new Set(rows.map((question) => question.family))].sort(),
  canonicalRelations: new Set(rows.filter((question) => question.metadata.locale === "en-IN").map((question) => question.intendedRelationId)).size,
});