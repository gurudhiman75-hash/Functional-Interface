import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listPrb001QuestionEntries, runPrb001Pipeline } from "./PRB-001";
import { listPrb002QuestionEntries, runPrb002Pipeline } from "./PRB-002";
import { calibrateEntryDifficulty, type ProbabilityDifficulty, type ProbabilityTaskRegistryEntry } from "./shared";

const root = dirname(fileURLToPath(import.meta.url));
const difficulties: readonly ProbabilityDifficulty[] = ["Easy", "Medium", "Hard"];
const letters = ["A", "B", "C", "D", "E"] as const;

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function normalizedQuestionKey(stem: string, answer: string): string {
  return `${stem.toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9/ ]/g, "").trim()}|${answer}`;
}

function selectReviewEntries(entries: ProbabilityTaskRegistryEntry[]): ProbabilityTaskRegistryEntry[] {
  const selected: ProbabilityTaskRegistryEntry[] = [];
  for (const difficulty of difficulties) {
    selected.push(...entries.filter((entry) => calibrateEntryDifficulty(entry) === difficulty).slice(0, 5));
  }
  for (const entry of entries) {
    if (selected.length >= 15) break;
    if (!selected.some((item) => item.qlId === entry.qlId)) selected.push(entry);
  }
  return selected.slice(0, 15);
}

function generateUniqueQuestion(
  packageId: "PRB-001" | "PRB-002",
  cpId: string,
  entry: ProbabilityTaskRegistryEntry,
  index: number,
  usedQuestions: Set<string>,
  run: (cpId: any, input: any) => any,
) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const seed = `${packageId}:exam-review-v3:${cpId}:${index}:${attempt}`;
    const question = run(cpId, { questionLanguageId: entry.qlId, seed });
    if (!question.validation.valid) throw new Error(`${entry.qlId} failed review export validation.`);
    const key = normalizedQuestionKey(question.stem, question.answer);
    if (!usedQuestions.has(key)) {
      usedQuestions.add(key);
      return { seed, question };
    }
  }
  throw new Error(`${entry.qlId} could not produce a unique visible question after 50 attempts.`);
}

function generatePackage(
  packageId: "PRB-001" | "PRB-002",
  entries: ProbabilityTaskRegistryEntry[],
  run: (cpId: any, input: any) => any,
) {
  const byCp = new Map<string, ProbabilityTaskRegistryEntry[]>();
  for (const entry of entries) byCp.set(entry.cpId, [...(byCp.get(entry.cpId) ?? []), entry]);

  const header = [
    "packageId", "examProfile", "cpId", "qlId", "seed", "difficulty", "solveMode", "stem",
    "optionA", "optionB", "optionC", "optionD", "optionE", "correctOption", "answer", "explanation",
    "explanationWordCount", "validationValid", "mathematicalStatus", "editorialStatus", "reviewer", "notes",
  ];
  const rows: string[][] = [header];
  const usedQuestions = new Set<string>();
  let explanationWords = 0;

  for (const [cpId, cpEntries] of [...byCp.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const reviewEntries = selectReviewEntries(cpEntries);
    if (reviewEntries.length !== 15) throw new Error(`${cpId} has only ${reviewEntries.length} review entries.`);
    reviewEntries.forEach((entry, index) => {
      const { seed, question } = generateUniqueQuestion(packageId, cpId, entry, index, usedQuestions, run);
      explanationWords += question.explanation.wordCount;
      const options = [...question.options, "", "", "", "", ""].slice(0, 5);
      rows.push([
        packageId,
        question.examProfile,
        cpId,
        entry.qlId,
        seed,
        question.difficultyBand,
        question.solveMode,
        question.stem,
        ...options,
        letters[question.correctIndex] ?? String(question.correctIndex + 1),
        question.answer,
        question.explanation.lines.join(" "),
        String(question.explanation.wordCount),
        String(question.validation.valid),
        "AUTOMATED_PASS",
        "PENDING_HUMAN_REVIEW",
        "",
        "",
      ]);
    });
  }

  if (usedQuestions.size !== rows.length - 1) throw new Error(`${packageId} review export contains duplicate visible questions.`);
  const output = rows.map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
  const target = join(root, packageId, "human-review-en.csv");
  writeFileSync(target, output);
  return { packageId, questions: rows.length - 1, uniqueQuestions: usedQuestions.size, averageExplanationWords: Math.round((explanationWords / (rows.length - 1)) * 10) / 10, target };
}

mkdirSync(join(root, "PRB-001"), { recursive: true });
mkdirSync(join(root, "PRB-002"), { recursive: true });
const reports = [
  generatePackage("PRB-001", listPrb001QuestionEntries(), runPrb001Pipeline),
  generatePackage("PRB-002", listPrb002QuestionEntries(), runPrb002Pipeline),
];

const totalQuestions = reports.reduce((sum, item) => sum + item.questions, 0);
const totalUniqueQuestions = reports.reduce((sum, item) => sum + item.uniqueQuestions, 0);
const weightedWords = reports.reduce((sum, item) => sum + item.averageExplanationWords * item.questions, 0);
const report = `# Probability Editorial Remediation Report\n\n## Result\n\n- Source QLs validated: **216**\n- Human-review questions regenerated: **${totalQuestions}**\n- Unique visible review questions: **${totalUniqueQuestions}/${totalQuestions}**\n- PRB-001 review set: **${reports[0]!.questions}** questions using the SSC CGL/CHSL profile and four options\n- PRB-002 review set: **${reports[1]!.questions}** questions using the Banking Mains profile and five options\n- Average review explanation length: **${Math.round((weightedWords / totalQuestions) * 10) / 10} words**\n\n## Student-facing standard\n\nQuestions now use direct exam language. Internal enum names, artificial template introductions, unused variables and invalid displayed probabilities are blocked. Singular and plural forms are rendered from the actual number. Difficulty is based on the number of reasoning steps rather than stem length. Exact duplicate visible questions are rejected during review generation.\n\nExplanations follow a deliberately simple pattern:\n\n1. Identify the total cases.\n2. Count the required cases.\n3. Divide and simplify.\n\nFor complement, conditional, successive-draw and event-algebra questions, only the shortest necessary method is shown. Internal QA terminology is never displayed to students.\n\n## Exam profiles\n\n- **SSC CGL/CHSL:** simple probability pool, four options.\n- **SSC CGL JSO/Statistics:** full probability pool, four options.\n- **Banking Prelims:** selected direct probability pool, five options.\n- **Banking Mains:** full probability and counting pool, five options.\n\n## Publication status\n\nThe mathematical and automated editorial gates pass, but the chapter remains non-public and ineligible for the question bank until the regenerated sheets receive human editorial sign-off.\n`;
writeFileSync(join(root, "editorial-remediation-report.md"), report);
console.log(JSON.stringify({ reports, totalQuestions, totalUniqueQuestions, averageExplanationWords: Math.round((weightedWords / totalQuestions) * 10) / 10 }));
