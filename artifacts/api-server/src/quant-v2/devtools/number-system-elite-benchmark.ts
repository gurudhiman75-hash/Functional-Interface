import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2NumberSystemQuestionCandidate } from "../../lib/quant-v2/number-system-admin-adapter";
import { NUMBER_SYSTEM_FAMILY_IDS } from "../canonical/number-system-motif-factories";
import { extractCorpusSchedulerMetadata } from "../corpus-scheduler/corpus-scheduler";
import { validateNumberSystemIndependentSolver } from "../validators/number-system-independent-solver";

const pattern: Pattern = {
  id: "number-system-elite-benchmark",
  type: "formula",
  section: "Quant",
  topic: "number_system",
  subtopic: "number_system",
  difficulty: "Hard",
  templateVariants: ["Number System V2 elite benchmark pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-number-system",
};

function argValue(name: string) {
  const eqPrefix = `--${name}=`;
  const eqMatch = process.argv.find((arg) => arg.startsWith(eqPrefix));
  if (eqMatch) return eqMatch.slice(eqPrefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseCount() {
  const raw = Number(argValue("count") ?? "500");
  return Number.isFinite(raw) ? Math.max(50, Math.min(2000, Math.floor(raw))) : 500;
}

function normalizeText(value: unknown) {
  return String(value ?? "").normalize("NFKC").toLowerCase().replace(/[,\u20b9]/gu, "").replace(/[^\p{L}\p{N}.:%/]+/gu, " ").replace(/\s+/gu, " ").trim();
}

function problemOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.canonicalProblem ?? (question.semanticMetadata as any)?.problem;
}

function familyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).familyKey;
}

function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}

function fingerprint(question: FormulaQuestion) {
  const problem = problemOf(question);
  return `${normalizeText(question.text)}::${problem?.auditMeta?.numericSignature ?? ""}::${normalizeText(answerText(question))}`;
}

function isElite(question: FormulaQuestion) {
  const problem = problemOf(question);
  return problem?.complexity === "elite" || problem?.auditMeta?.eliteTier === true || Number(problem?.auditMeta?.topologyDepth ?? 0) >= 5;
}

function explanationText(question: FormulaQuestion) {
  return `${question.explanation ?? ""}\n${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`;
}

function invalidQuestion(question: FormulaQuestion) {
  const problem = problemOf(question);
  const validation = validateNumberSystemIndependentSolver({
    problem,
    explanation: question.explanation,
    options: question.options,
    correct: question.correct,
  });
  return !validation.valid ||
    !/[?]\s*$/u.test(String(question.text ?? "").trim()) ||
    /Use the formula|Substitute the values|Solve for the answer|Required value is|Apply the formula/iu.test(explanationText(question)) ||
    /\\\[[^\n][\s\S]*?[^\n]\\\]/u.test(explanationText(question)) ||
    (question.options ?? []).length !== 4 ||
    new Set(question.options ?? []).size !== 4;
}

function renderQuestion(question: FormulaQuestion, index: number) {
  const problem = problemOf(question);
  return [
    `Q${index + 1}. ${question.text}`,
    `A. ${question.options?.[0]}`,
    `B. ${question.options?.[1]}`,
    `C. ${question.options?.[2]}`,
    `D. ${question.options?.[3]}`,
    `Answer: ${String.fromCharCode(65 + (question.correct ?? 0))}`,
    "",
    "Explanation:",
    question.explanation,
    "",
    `Family: ${familyOf(question)}`,
    `Situation: ${problem?.auditMeta?.situationId ?? ""}`,
    `Topology depth: ${problem?.auditMeta?.topologyDepth ?? ""}`,
    `Exam mode: ${problem?.qualityMetadata?.examMode ?? ""}`,
    "",
  ].join("\n");
}

function generateEliteSet(count: number, seed: string) {
  const questions: FormulaQuestion[] = [];
  const seen = new Set<string>();
  const familyDistribution: Record<string, number> = {};
  const maxAttempts = count * 180;
  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    const family = NUMBER_SYSTEM_FAMILY_IDS[(attempt + questions.length * 7) % NUMBER_SYSTEM_FAMILY_IDS.length]!;
    const question = createQuantV2NumberSystemQuestionCandidate(pattern, {
      seed: `${seed}:${attempt}:${family}:elite`,
      forcedMotifId: family,
      generationContext: { seed: `${seed}:${attempt}`, generationId: seed, timestamp: Date.now() },
    });
    const key = fingerprint(question);
    if (seen.has(key) || !isElite(question) || invalidQuestion(question)) continue;
    seen.add(key);
    familyDistribution[familyOf(question)] = (familyDistribution[familyOf(question)] ?? 0) + 1;
    questions.push(question);
  }
  if (questions.length < count) {
    throw new Error(`Number System V2 elite benchmark generated only ${questions.length}/${count} questions`);
  }
  return { questions, familyDistribution };
}

async function main() {
  const count = parseCount();
  const runId = randomUUID();
  const seed = argValue("seed") ?? `number-system-v2-elite:${runId}`;
  const outDir = path.join(process.cwd(), "exports", `number-system-elite-${new Date().toISOString().replace(/[:.]/gu, "-")}`);
  await mkdir(outDir, { recursive: true });
  const { questions, familyDistribution } = generateEliteSet(count, seed);
  const depths = questions.map((question) => Number(problemOf(question)?.auditMeta?.topologyDepth ?? 0));
  const realism = questions.map((question) => Number(problemOf(question)?.realismScore ?? 0));
  const avg = (values: number[]) => Number((values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length)).toFixed(2));
  const summary = {
    status: "PASS",
    runId,
    seed,
    count: questions.length,
    duplicateCount: 0,
    solverMismatchCount: 0,
    genericExplanationCount: 0,
    malformedMathJaxCount: 0,
    topologyDepth: { min: Math.min(...depths), avg: avg(depths), max: Math.max(...depths) },
    realism: { min: Math.min(...realism), avg: avg(realism), max: Math.max(...realism) },
    familyDistribution,
    exportFolder: outDir,
  };
  await writeFile(path.join(outDir, "number-system-elite-benchmark.txt"), questions.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "elite-summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
