import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2NumberSystemQuestionCandidate } from "../../lib/quant-v2/number-system-admin-adapter";
import { NUMBER_SYSTEM_FAMILY_IDS } from "../canonical/number-system-motif-factories";
import { extractCorpusSchedulerMetadata } from "../corpus-scheduler/corpus-scheduler";
import { validateNumberSystemIndependentSolver } from "../validators/number-system-independent-solver";

const pattern: Pattern = {
  id: "number-system-production-freeze",
  type: "formula",
  section: "Quant",
  topic: "number_system",
  subtopic: "number_system",
  difficulty: "Medium",
  templateVariants: ["Number System V2 production freeze pattern"],
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
function normalizeText(value: unknown) {
  return String(value ?? "").normalize("NFKC").toLowerCase().replace(/[,\u20b9]/gu, "").replace(/[^\p{L}\p{N}.:%/]+/gu, " ").replace(/\s+/gu, " ").trim();
}
function problemOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.canonicalProblem ?? (question.semanticMetadata as any)?.problem;
}
function familyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).familyKey;
}
function topologyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).topologyKey;
}
function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}
function fingerprint(question: FormulaQuestion) {
  const problem = problemOf(question);
  return [
    normalizeText(question.text),
    `${topologyOf(question)}:${problem?.auditMeta?.numericSignature ?? ""}:${normalizeText(answerText(question))}`,
  ];
}
function explanationText(question: FormulaQuestion) {
  return `${question.explanation ?? ""}\n${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`;
}
function badMath(question: FormulaQuestion) {
  const text = explanationText(question);
  return (text.match(/\\\[/gu) ?? []).length !== (text.match(/\\\]/gu) ?? []).length ||
    (text.match(/\\\(/gu) ?? []).length !== (text.match(/\\\)/gu) ?? []).length ||
    /\\\[[^\n][\s\S]*?[^\n]\\\]/u.test(text);
}
function invalidStem(question: FormulaQuestion) {
  const en = String(question.text ?? "").trim();
  const hi = String(question.textHi ?? "").trim();
  const pa = String(question.textPa ?? "").trim();
  return !en.endsWith("?") || !hi.endsWith("?") || !pa.endsWith("?") || /\b(?:from|with|for|by|and|then)\?*$/iu.test(en);
}
function genericExplanation(question: FormulaQuestion) {
  return /Use the formula|Substitute the values|Solve for the answer|Required value is|Apply the formula|Let's solve|We know that|Observe that/iu.test(explanationText(question));
}
function trivial(question: FormulaQuestion) {
  const problem = problemOf(question);
  return Number(problem?.questionTrivialityScore ?? 1) > 0.2;
}
function optionIssue(question: FormulaQuestion) {
  const options = question.options ?? [];
  return options.length !== 4 || new Set(options).size !== 4 || !options.includes(answerText(question));
}
function solverMismatch(question: FormulaQuestion) {
  return !validateNumberSystemIndependentSolver({
    problem: problemOf(question),
    explanation: question.explanation,
    options: question.options,
    correct: question.correct,
  }).valid;
}
function renderQuestion(question: FormulaQuestion, index: number) {
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
  ].join("\n");
}
function countsFor(questions: FormulaQuestion[], minimumFamilies: number) {
  const exact = new Map<string, number>();
  const normalized = new Map<string, number>();
  const familyDistribution: Record<string, number> = {};
  const difficultyDistribution: Record<string, number> = {};
  const topologyDepths: number[] = [];
  const sscScores: number[] = [];
  const bankingScores: number[] = [];
  const punjabScores: number[] = [];
  const inc = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1);
  for (const question of questions) {
    const problem = problemOf(question);
    const meta = problem?.auditMeta ?? {};
    inc(exact, normalizeText(question.text));
    inc(normalized, normalizeText(question.text));
    familyDistribution[familyOf(question)] = (familyDistribution[familyOf(question)] ?? 0) + 1;
    difficultyDistribution[String(problem?.difficulty ?? "medium")] = (difficultyDistribution[String(problem?.difficulty ?? "medium")] ?? 0) + 1;
    if (Number.isFinite(Number(meta.topologyDepth))) topologyDepths.push(Number(meta.topologyDepth));
    if (Number.isFinite(Number(meta.sscAuthenticityScore))) sscScores.push(Number(meta.sscAuthenticityScore));
    if (Number.isFinite(Number(meta.bankingAuthenticityScore))) bankingScores.push(Number(meta.bankingAuthenticityScore));
    if (Number.isFinite(Number(meta.punjabAuthenticityScore))) punjabScores.push(Number(meta.punjabAuthenticityScore));
  }
  const repeated = (map: Map<string, number>) => [...map.values()].filter((count) => count > 1).reduce((sum, count) => sum + count - 1, 0);
  const avg = (values: number[]) => values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 0;
  const max = (values: number[]) => values.length ? Math.max(...values) : 0;
  const qualityGateCount = [
    repeated(exact) > 0,
    questions.some(invalidStem),
    questions.some(badMath),
    questions.some(genericExplanation),
    questions.some(trivial),
    questions.some(optionIssue),
    questions.some(solverMismatch),
    Object.keys(familyDistribution).length < minimumFamilies,
    avg(sscScores) < 88,
    avg(bankingScores) < 84,
    avg(punjabScores) < 84,
  ].filter(Boolean).length;
  return {
    duplicateEnStemCount: repeated(exact),
    normalizedDuplicateCount: repeated(normalized),
    missingQuestionMarkCount: questions.filter(invalidStem).length,
    malformedMathJaxCount: questions.filter(badMath).length,
    genericExplanationCount: questions.filter(genericExplanation).length,
    trivialOneStepCount: questions.filter(trivial).length,
    optionIssueCount: questions.filter(optionIssue).length,
    solverMismatchCount: questions.filter(solverMismatch).length,
    routingLeakageCount: questions.filter((question) => !/^ns_/u.test(familyOf(question))).length,
    exposedFamilyCount: Object.keys(familyDistribution).length,
    topologyDepth: { avg: avg(topologyDepths), max: max(topologyDepths) },
    authenticity: {
      ssc: avg(sscScores),
      banking: avg(bankingScores),
      punjab: avg(punjabScores),
    },
    familyDistribution,
    difficultyDistribution,
    qualityGateCount,
  };
}
function generateSet(count: number, seed: string, difficulty: "easy" | "medium" | "hard", forceAllFamilies = false) {
  const questions: FormulaQuestion[] = [];
  const seen = new Set<string>();
  const accept = (question: FormulaQuestion) => {
    const signatures = fingerprint(question);
    if (signatures.some((signature) => seen.has(signature))) return false;
    if (invalidStem(question) || badMath(question) || genericExplanation(question) || trivial(question) || optionIssue(question) || solverMismatch(question)) return false;
    signatures.forEach((signature) => seen.add(signature));
    questions.push(question);
    return true;
  };
  if (forceAllFamilies) {
    for (const family of NUMBER_SYSTEM_FAMILY_IDS) {
      for (let attempt = 0; attempt < 60; attempt += 1) {
        const question = createQuantV2NumberSystemQuestionCandidate(pattern, {
          seed: `${seed}:required:${attempt}:${family}`,
          forcedMotifId: family,
          difficulty,
          generationContext: { seed: `${seed}:required:${attempt}`, generationId: seed, timestamp: Date.now() },
        });
        if (accept(question)) break;
      }
    }
  }
  const maxAttempts = count * 80;
  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    const family = NUMBER_SYSTEM_FAMILY_IDS[(questions.length + attempt * 3) % NUMBER_SYSTEM_FAMILY_IDS.length]!;
    const question = createQuantV2NumberSystemQuestionCandidate(pattern, {
      seed: `${seed}:${attempt}:${family}`,
      forcedMotifId: family,
      difficulty,
      generationContext: { seed: `${seed}:${attempt}`, generationId: seed, timestamp: Date.now() },
    });
    accept(question);
  }
  if (questions.length < count) throw new Error(`Generated only ${questions.length}/${count} Number System freeze questions`);
  return questions;
}

async function main() {
  const runId = randomUUID();
  const seed = argValue("seed") ?? `number-system-freeze:${runId}`;
  const outDir = path.join(process.cwd(), "exports", `number-system-production-freeze-${new Date().toISOString().replace(/[:.]/gu, "-")}`);
  await mkdir(outDir, { recursive: true });
  const production = generateSet(1000, `${seed}:production`, "medium", true);
  const review = generateSet(1000, `${seed}:review`, "medium", true);
  const audit = generateSet(2000, `${seed}:audit`, "hard", true);
  const pyqPlus = generateSet(1000, `${seed}:pyq-plus`, "hard", true);
  const elite = generateSet(500, `${seed}:elite`, "hard", true);
  const summary = {
    status: "PASS",
    runId,
    seed,
    exportFolder: outDir,
    production: countsFor(production, 85),
    review: countsFor(review, 86),
    audit: countsFor(audit, 86),
    pyqPlus: countsFor(pyqPlus, 85),
    elite: countsFor(elite, 80),
  };
  const fail = [summary.production, summary.review, summary.audit, summary.pyqPlus, summary.elite].some((item) => item.qualityGateCount > 0);
  if (fail) summary.status = "FAIL";
  await writeFile(path.join(outDir, "number-system-production-1000.txt"), production.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "number-system-review-1000.txt"), review.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "number-system-audit-2000.txt"), audit.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "number-system-pyq-plus-1000.txt"), pyqPlus.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "number-system-elite-500.txt"), elite.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "production-freeze-summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
  if (summary.status !== "PASS") process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
