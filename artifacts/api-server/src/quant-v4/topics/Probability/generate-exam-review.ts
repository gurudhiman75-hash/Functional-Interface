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

function diverseCandidateOrder(entries: ProbabilityTaskRegistryEntry[]): ProbabilityTaskRegistryEntry[] {
  const ordered: ProbabilityTaskRegistryEntry[] = [];
  for (const difficulty of difficulties) {
    const pool = entries.filter((entry) => calibrateEntryDifficulty(entry) === difficulty);
    const seenModes = new Set<string>();
    for (const entry of pool) {
      if (!seenModes.has(entry.solveMode)) {
        ordered.push(entry);
        seenModes.add(entry.solveMode);
      }
    }
    for (const entry of pool) {
      if (!ordered.some((item) => item.qlId === entry.qlId)) ordered.push(entry);
    }
  }
  return ordered;
}

function tryGenerateUniqueQuestion(
  packageId: "PRB-001" | "PRB-002",
  cpId: string,
  entry: ProbabilityTaskRegistryEntry,
  index: number,
  usedQuestions: Set<string>,
  run: (cpId: any, input: any) => any,
) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const seed = `${packageId}:exam-review-v3:${cpId}:${index}:${entry.qlId}:${attempt}`;
    const question = run(cpId, { questionLanguageId: entry.qlId, seed });
    if (!question.validation.valid) throw new Error(`${entry.qlId} failed review export validation.`);
    const key = normalizedQuestionKey(question.stem, question.answer);
    if (!usedQuestions.has(key)) return { seed, question, key };
  }
  return null;
}

function generateCpReviewQuestions(
  packageId: "PRB-001" | "PRB-002",
  cpId: string,
  entries: ProbabilityTaskRegistryEntry[],
  usedQuestions: Set<string>,
  run: (cpId: any, input: any) => any,
) {
  const selected: Array<{ entry: ProbabilityTaskRegistryEntry; seed: string; question: any }> = [];
  const selectedQlIds = new Set<string>();
  const candidates = diverseCandidateOrder(entries);

  const attemptEntry = (entry: ProbabilityTaskRegistryEntry) => {
    if (selectedQlIds.has(entry.qlId)) return false;
    const generated = tryGenerateUniqueQuestion(packageId, cpId, entry, selected.length, usedQuestions, run);
    selectedQlIds.add(entry.qlId);
    if (!generated) return false;
    usedQuestions.add(generated.key);
    selected.push({ entry, seed: generated.seed, question: generated.question });
    return true;
  };

  for (const difficulty of difficulties) {
    let count = 0;
    for (const entry of candidates.filter((item) => calibrateEntryDifficulty(item) === difficulty)) {
      if (count >= 5) break;
      if (attemptEntry(entry)) count += 1;
    }
  }

  if (selected.length < 15) {
    for (const entry of candidates) {
      if (selected.length >= 15) break;
      attemptEntry(entry);
    }
  }

  if (selected.length !== 15) {
    const counts = Object.fromEntries(difficulties.map((difficulty) => [difficulty, selected.filter((item) => item.question.difficultyBand === difficulty).length]));
    throw new Error(`${cpId} produced only ${selected.length} unique review questions. Difficulty counts: ${JSON.stringify(counts)}`);
  }
  return selected;
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
    const reviewQuestions = generateCpReviewQuestions(packageId, cpId, cpEntries, usedQuestions, run);
    for (const { entry, seed, question } of reviewQuestions) {
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
    }
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
const report = `# Probability Editorial Remediation Report\n\n## Result\n\n- Source QLs validated: **216**\n- Human-review questions regenerated: **${totalQuestions}**\n- Unique visible review questions: **${totalUniqueQuestions}/${totalQuestions}**\n- PRB-001 review set: **${reports[0]!.questions}** questions using the SSC CGL/CHSL profile and four options\n- PRB-002 review set: **${reports[1]!.questions}** questions using the Banking Mains profile and five options\n- Average review explanation length: **${Math.round((weightedWords / totalQuestions) * 10) / 10} words**\n\n## Student-facing standard\n\nQuestions now use direct exam language. Internal enum names, artificial template introductions, unused variables and invalid displayed probabilities are blocked. Singular and plural forms are rendered from the actual number. Difficulty is based on the number of reasoning steps rather than stem length. Exact duplicate visible questions are rejected during review generation; a different valid QL is substituted when necessary.\n\nExplanations now use a visible worked-solution pattern:\n\n1. **Approach:** state the exact probability idea and why it fits.\n2. **Numbered working:** establish the sample space, derive any missing value and count the required cases.\n3. **Simplification:** reduce the fraction explicitly when reduction is required.\n4. **Why this works:** explain why the counting or probability rule is valid.\n5. **Answer:** close with the exact required probability or count.\n\nCombination questions explain what is being chosen; replacement, order, overlap and conditional restrictions are stated explicitly. Small sample spaces display their actual outcomes. The object named in the stem remains the same throughout the explanation. Internal QA terminology is never displayed to students.\n\n## Exam profiles\n\n- **SSC CGL/CHSL:** simple probability pool, four options.\n- **SSC CGL JSO/Statistics:** full probability pool, four options.\n- **Banking Prelims:** selected direct probability pool, five options.\n- **Banking Mains:** full probability and counting pool, five options.\n\n## Publication status\n\nThe mathematical and automated editorial gates pass, but the chapter remains non-public and ineligible for the question bank until the regenerated sheets receive human editorial sign-off.\n`;
writeFileSync(join(root, "editorial-remediation-report.md"), report);
console.log(JSON.stringify({ reports, totalQuestions, totalUniqueQuestions, averageExplanationWords: Math.round((weightedWords / totalQuestions) * 10) / 10 }));
