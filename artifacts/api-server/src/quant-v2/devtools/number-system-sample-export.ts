import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2NumberSystemQuestionCandidate } from "../../lib/quant-v2/number-system-admin-adapter";
import { NUMBER_SYSTEM_FAMILY_IDS } from "../canonical/number-system-motif-factories";
import { extractCorpusSchedulerMetadata } from "../corpus-scheduler/corpus-scheduler";
import {
  createCorpusSchedulerState,
  generateScheduledQuestion,
} from "../corpus-scheduler/corpus-scheduler";
import { scorePyqBenchmark } from "../pyq-benchmark/pyq-benchmark-scorer";
import { validateNumberSystemIndependentSolver } from "../validators/number-system-independent-solver";
import { numberSystemDegenerateReasons } from "../validators/number-system-independent-solver";

const pattern: Pattern = {
  id: "number-system-sample-export",
  type: "formula",
  section: "Quant",
  topic: "number_system",
  subtopic: "number_system",
  difficulty: "Medium",
  templateVariants: ["Number System V2 sample export pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-number-system",
};

const pyqPlusPattern: Pattern = {
  id: "pyq-plus-number-system-export",
  type: "formula",
  section: "Quant",
  topic: "number_system",
  subtopic: "number_system",
  difficulty: "Medium",
  templateVariants: ["Number System V2 PYQ+ export pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-number-system",
};

function normalizeText(value: unknown) {
  return String(value ?? "").normalize("NFKC").toLowerCase().replace(/[,\u20b9]/gu, "").replace(/[^\p{L}\p{N}.:%/]+/gu, " ").replace(/\s+/gu, " ").trim();
}

function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}

function problemOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.canonicalProblem ?? (question.semanticMetadata as any)?.problem;
}

function graphOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.reasoningGraph ?? question.reasoningGraph;
}

function localizedOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.localized ?? question.nativeRealization;
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

function topologyNumericAnswerFingerprint(question: FormulaQuestion) {
  const problem = problemOf(question);
  const signature = problem?.auditMeta?.numericSignature ?? "";
  return `${topologyOf(question)}::${signature}::${normalizeText(answerText(question))}`;
}

function trivialOneStep(question: FormulaQuestion) {
  const problem = problemOf(question);
  return Number(problem?.questionTrivialityScore ?? 1) > 0.2 || /\bFind (?:HCF|LCM) of \d+ and \d+|How many factors does \d+ have|Find remainder when \d+ is divided by \d+|Find last digit of \d+\^?\d?\b/iu.test(String(question.text ?? ""));
}

function invalidOptions(question: FormulaQuestion) {
  const options = question.options ?? [];
  return options.length !== 4 || new Set(options).size !== options.length || !options.includes(answerText(question));
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

function duplicateFingerprint(question: FormulaQuestion) {
  return [
    normalizeText(question.text),
    normalizeText(answerText(question)),
    [...(question.options ?? [])].map(normalizeText).sort().join("|"),
  ].join("::");
}

function localOptionIssue(question: FormulaQuestion) {
  const options = question.options ?? [];
  if (!options.includes(answerText(question))) return "answer missing from options";
  if (new Set(options).size !== options.length) return "duplicate options";
  return undefined;
}

function validateQuestion(question: FormulaQuestion) {
  const problem = problemOf(question);
  const solver = validateNumberSystemIndependentSolver({
    problem,
    explanation: question.explanation,
    options: question.options,
    correct: question.correct,
  });
  return [
    ...solver.issues,
    ...numberSystemDegenerateReasons(problem),
  ];
}

function generateStandardSet(count: number, seed: string) {
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
  return questions;
}

function generatePyqPlusSet(count: number, seed: string) {
  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId: "number_system_pyq_plus",
  });
  const questions: FormulaQuestion[] = [];
  const keptFingerprints = new Set<string>();
  const keptFamilyCounts = new Map<string, number>();
  const maxAttempts = Math.max(count * 80, count + 5000);

  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    try {
      const forcedMotifId = NUMBER_SYSTEM_FAMILY_IDS[(questions.length + attempt) % NUMBER_SYSTEM_FAMILY_IDS.length]!;
      const result = generateScheduledQuestion({
        state,
        index: questions.length,
        seedPrefix: `${seed}:pyq-plus:${attempt}`,
        examProfile: "ssc",
        forcedMotifId,
        generate: (options) =>
          createQuantV2NumberSystemQuestionCandidate(pyqPlusPattern, options),
      });
      const question = result.question;
      const family = familyOf(question);
      const fingerprint = duplicateFingerprint(question);
      if (keptFingerprints.has(fingerprint)) continue;
      const optionIssue = localOptionIssue(question);
      if (optionIssue) continue;
      const validationIssues = validateQuestion(question);
      if (validationIssues.length) continue;

      const benchmark = scorePyqBenchmark({
        topic: "number-system",
        question,
        family,
        topology: topologyOf(question),
        problem: problemOf(question),
        graph: graphOf(question),
        schedulerMetadata: extractCorpusSchedulerMetadata(question),
      });
      if (benchmark.realism < 70) continue;
      if (benchmark.pyqLevelScore < 80 || benchmark.pyqPlusScore < 70) continue;

      keptFingerprints.add(fingerprint);
      const currentCount = keptFamilyCounts.get(family) ?? 0;
      keptFamilyCounts.set(family, currentCount + 1);
      questions.push(question);
    } catch (error) {
      // ignore and continue
    }
  }
  return questions;
}

async function main() {
  const runId = randomUUID();
  const seed = `number-system-audit-export:${runId}`;
  
  console.log("Generating 100 Production questions...");
  const production = generateStandardSet(100, `${seed}:production`);
  
  console.log("Generating 100 Review questions...");
  const review = generateStandardSet(100, `${seed}:review`);
  
  console.log("Generating 100 PYQ+ questions...");
  const pyqPlus = generatePyqPlusSet(100, `${seed}:pyq-plus`);
  
  const payload = {
    production: production.map((q, idx) => ({
      index: idx + 1,
      id: q.id,
      text: q.text,
      textHi: q.textHi,
      textPa: q.textPa,
      options: q.options,
      correct: q.correct,
      correctLetter: String.fromCharCode(65 + (q.correct ?? 0)),
      correctValue: q.options?.[q.correct ?? 0] ?? "",
      explanation: q.explanation,
      explanationHi: q.explanationHi,
      explanationPa: q.explanationPa,
      family: familyOf(q),
      topology: topologyOf(q),
      problem: problemOf(q),
    })),
    review: review.map((q, idx) => ({
      index: idx + 1,
      id: q.id,
      text: q.text,
      textHi: q.textHi,
      textPa: q.textPa,
      options: q.options,
      correct: q.correct,
      correctLetter: String.fromCharCode(65 + (q.correct ?? 0)),
      correctValue: q.options?.[q.correct ?? 0] ?? "",
      explanation: q.explanation,
      explanationHi: q.explanationHi,
      explanationPa: q.explanationPa,
      family: familyOf(q),
      topology: topologyOf(q),
      problem: problemOf(q),
    })),
    pyqPlus: pyqPlus.map((q, idx) => ({
      index: idx + 1,
      id: q.id,
      text: q.text,
      textHi: q.textHi,
      textPa: q.textPa,
      options: q.options,
      correct: q.correct,
      correctLetter: String.fromCharCode(65 + (q.correct ?? 0)),
      correctValue: q.options?.[q.correct ?? 0] ?? "",
      explanation: q.explanation,
      explanationHi: q.explanationHi,
      explanationPa: q.explanationPa,
      family: familyOf(q),
      topology: topologyOf(q),
      problem: problemOf(q),
    })),
  };
  
  const outPath = path.join(process.cwd(), "exports", "sampled-audit-questions.json");
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Successfully exported 300 sampled questions to: ${outPath}`);
}

main().catch((error) => {
  console.error("Export script failed:", error);
  process.exitCode = 1;
});
