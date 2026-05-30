import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2NumberSystemQuestionCandidate } from "../../lib/quant-v2/number-system-admin-adapter";
import { NUMBER_SYSTEM_FAMILY_IDS } from "../canonical/number-system-motif-factories";
import { extractCorpusSchedulerMetadata } from "../corpus-scheduler/corpus-scheduler";
import {
  numberSystemDegenerateReasons,
  validateNumberSystemIndependentSolver,
} from "../validators/number-system-independent-solver";

const pattern: Pattern = {
  id: "number-system-large-audit",
  type: "formula",
  section: "Quant",
  topic: "number_system",
  subtopic: "number_system",
  difficulty: "Medium",
  templateVariants: ["Number System V2 large audit pattern"],
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
  const raw = Number(argValue("count") ?? "1000");
  return Number.isFinite(raw) ? Math.max(1, Math.min(3000, Math.floor(raw))) : 1000;
}
function normalizeText(value: unknown) {
  return String(value ?? "").normalize("NFKC").toLowerCase().replace(/[,\u20b9]/gu, "").replace(/[^\p{L}\p{N}.:%/]+/gu, " ").replace(/\s+/gu, " ").trim();
}
function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
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
function exactStemFingerprint(question: FormulaQuestion) {
  return normalizeText(question.text);
}
function normalizedDuplicateFingerprint(question: FormulaQuestion) {
  return normalizeText(question.text);
}
function topologyNumericAnswerFingerprint(question: FormulaQuestion) {
  const problem = problemOf(question);
  const signature = problem?.auditMeta?.numericSignature ?? "";
  return `${topologyOf(question)}::${signature}::${normalizeText(answerText(question))}`;
}
function explanationText(question: FormulaQuestion) {
  return `${question.explanation ?? ""}\n${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`;
}
function malformedMathJax(question: FormulaQuestion) {
  const text = explanationText(question);
  return (text.match(/\\\[/gu) ?? []).length !== (text.match(/\\\]/gu) ?? []).length ||
    (text.match(/\\\(/gu) ?? []).length !== (text.match(/\\\)/gu) ?? []).length;
}
function rawLatexVisible(question: FormulaQuestion) {
  return /\\\[[^\n][\s\S]*?[^\n]\\\]/u.test(explanationText(question));
}
function genericExplanation(question: FormulaQuestion) {
  return /Use the formula|Substitute the values|Solve for the answer|Required value is|Apply the formula/iu.test(explanationText(question));
}
function missingQuestionMark(question: FormulaQuestion) {
  return !/[?]\s*$/u.test(String(question.text ?? "").trim()) ||
    !/[?]\s*$/u.test(String(question.textHi ?? "").trim()) ||
    !/[?]\s*$/u.test(String(question.textPa ?? "").trim());
}
function brokenStem(question: FormulaQuestion) {
  const text = String(question.text ?? "").trim().replace(/[?\s]+$/u, "").toLowerCase();
  return !text || /\b(?:from|with|for|by|and|then)\s*$/u.test(text);
}
function routingLeakage(question: FormulaQuestion) {
  return !/^ns_/u.test(familyOf(question));
}
function schoolDrill(question: FormulaQuestion) {
  return /\bFind (?:HCF|LCM) of \d+ and \d+|How many factors does \d+ have|Find remainder when \d+ is divided by \d+|Find last digit of \d+\^?\d?\b/iu.test(String(question.text ?? ""));
}
function trivialOneStep(question: FormulaQuestion) {
  const problem = problemOf(question);
  return Number(problem?.questionTrivialityScore ?? 1) > 0.2 || schoolDrill(question);
}
function invalidOptions(question: FormulaQuestion) {
  const options = question.options ?? [];
  return options.length !== 4 || new Set(options).size !== options.length || !options.includes(answerText(question));
}

function countsFor(questions: FormulaQuestion[]) {
  const exact = new Map<string, number>();
  const normalized = new Map<string, number>();
  const topoNumeric = new Map<string, number>();
  const familyDistribution: Record<string, number> = {};
  const difficultyDistribution: Record<string, number> = {};
  const inc = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1);
  for (const question of questions) {
    inc(exact, exactStemFingerprint(question));
    inc(normalized, normalizedDuplicateFingerprint(question));
    inc(topoNumeric, topologyNumericAnswerFingerprint(question));
    familyDistribution[familyOf(question)] = (familyDistribution[familyOf(question)] ?? 0) + 1;
    const diff = String(problemOf(question)?.difficulty ?? "medium");
    difficultyDistribution[diff] = (difficultyDistribution[diff] ?? 0) + 1;
  }
  const repeated = (map: Map<string, number>) => [...map.values()].filter((count) => count > 1).reduce((a, b) => a + b - 1, 0);
  const first8 = new Map<string, number>();
  for (const question of questions) {
    const key = normalizeText(question.text).split(/\s+/u).slice(0, 8).join(" ");
    inc(first8, key);
  }
  return {
    duplicateEnStemCount: repeated(exact),
    normalizedDuplicateCount: repeated(normalized),
    topologyNumericDuplicateCount: repeated(topoNumeric),
    missingQuestionMarkCount: questions.filter(missingQuestionMark).length,
    brokenStemCount: questions.filter(brokenStem).length,
    malformedMathJaxCount: questions.filter(malformedMathJax).length,
    rawLatexVisibleCount: questions.filter(rawLatexVisible).length,
    genericExplanationCount: questions.filter(genericExplanation).length,
    routingLeakageCount: questions.filter(routingLeakage).length,
    trivialOneStepCount: questions.filter(trivialOneStep).length,
    schoolDrillCount: questions.filter(schoolDrill).length,
    optionIssueCount: questions.filter(invalidOptions).length,
    solverMismatchCount: questions.filter((question) => {
      const validation = validateNumberSystemIndependentSolver({
        problem: problemOf(question),
        explanation: question.explanation,
        options: question.options,
        correct: question.correct,
      });
      return !validation.valid;
    }).length,
    degenerateCount: questions.reduce((sum, question) => sum + numberSystemDegenerateReasons(problemOf(question)).length, 0),
    repeatedFirst8WordsMax: Math.max(0, ...first8.values()),
    familyDistribution,
    difficultyDistribution,
  };
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
    "Hindi:",
    question.textHi,
    question.explanationHi,
    "",
    "Punjabi:",
    question.textPa,
    question.explanationPa,
    "",
    `Family: ${familyOf(question)}`,
    "",
  ].join("\n");
}

function generateSet(count: number, seed: string) {
  const questions: FormulaQuestion[] = [];
  const seen = new Set<string>();
  const maxAttempts = count * 60;
  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    const family = NUMBER_SYSTEM_FAMILY_IDS[(questions.length + attempt) % NUMBER_SYSTEM_FAMILY_IDS.length]!;
    const question = createQuantV2NumberSystemQuestionCandidate(pattern, {
      seed: `${seed}:${attempt}:${family}`,
      forcedMotifId: family,
      generationContext: { seed: `${seed}:${attempt}`, generationId: seed, timestamp: Date.now() },
    });
    const fingerprint = exactStemFingerprint(question);
    const topo = topologyNumericAnswerFingerprint(question);
    if (seen.has(fingerprint) || seen.has(topo)) continue;
    if (trivialOneStep(question) || invalidOptions(question) || missingQuestionMark(question) || brokenStem(question)) continue;
    seen.add(fingerprint);
    seen.add(topo);
    questions.push(question);
  }
  if (questions.length < count) {
    throw new Error(`Number System V2 audit generated only ${questions.length}/${count} questions`);
  }
  return questions;
}

async function main() {
  const count = parseCount();
  const runId = randomUUID();
  const seed = argValue("seed") ?? `number-system-v2:${runId}`;
  const outDir = path.join(process.cwd(), "exports", `number-system-v2-${new Date().toISOString().replace(/[:.]/gu, "-")}`);
  await mkdir(outDir, { recursive: true });
  const production = generateSet(Math.min(300, Math.max(60, Math.floor(count * 0.3))), `${seed}:production`);
  const review = generateSet(Math.min(200, Math.max(100, Math.floor(count * 0.2))), `${seed}:review`);
  const audit = generateSet(count, `${seed}:audit`);
  const summary = {
    status: "PASS",
    runId,
    seed,
    production: countsFor(production),
    review: countsFor(review),
    audit: countsFor(audit),
    exportFolder: outDir,
  };
  const hardGateTotal = Object.entries(summary.audit)
    .filter(([key]) => /Count$/u.test(key) && key !== "repeatedFirst8WordsMax")
    .reduce((sum, [, value]) => sum + (typeof value === "number" ? value : 0), 0);
  if (hardGateTotal > 0) summary.status = "FAIL";
  await writeFile(path.join(outDir, "number-system-production.txt"), production.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "number-system-review.txt"), review.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "number-system-large-audit.txt"), audit.map(renderQuestion).join("\n---\n"), "utf8");
  await writeFile(path.join(outDir, "audit-summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
  if (summary.status !== "PASS") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
