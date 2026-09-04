import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { generateArgCp014QuestionStudioBatch } from "./cp014-manual-editorial-approval.ts";
import { ARG_QL_IDS } from "./types.ts";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const REAL_PAPER_CELLS = [
  ["SSC_RECENT_2X4", "Easy"],
  ["SSC_RECENT_2X4", "Medium"],
  ["BANKING_CLASSIC_2X5", "Medium"],
  ["BANKING_CLASSIC_2X5", "Hard"],
  ["BANKING_COMBO_3X5", "Medium"],
  ["BANKING_COMBO_3X5", "Hard"],
  ["BANKING_COMBO_4X5", "Hard"],
] as const;

const OUT_PATH = resolve(process.cwd(), "dist/arg-001-cp014-1000-diversity-audit.md");
const JSON_PATH = resolve(process.cwd(), "dist/arg-001-cp014-1000-diversity-audit.json");

type Question = Readonly<Record<string, any>>;

type Distribution = ReadonlyArray<Readonly<{ key: string; count: number; share: number }>>;

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[“”‘’]/g, "'")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: unknown): string[] {
  const stop = new Set([
    "a", "an", "the", "and", "or", "of", "to", "for", "in", "on", "at", "by", "with", "from", "is", "are", "be", "been", "being",
    "should", "would", "could", "may", "might", "must", "can", "that", "this", "these", "those", "it", "its", "as", "if", "than", "then",
    "yes", "no", "argument", "arguments", "strong", "weak", "statement", "read", "decide", "which", "following",
  ]);
  return normalizeText(value).split(" ").filter((token) => token.length > 1 && !stop.has(token));
}

function shingles(value: unknown, n = 3): Set<string> {
  const words = tokens(value);
  const result = new Set<string>();
  if (words.length < n) {
    if (words.length) result.add(words.join(" "));
    return result;
  }
  for (let index = 0; index <= words.length - n; index += 1) result.add(words.slice(index, index + n).join(" "));
  return result;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  const smaller = a.size <= b.size ? a : b;
  const larger = a.size <= b.size ? b : a;
  for (const value of smaller) if (larger.has(value)) intersection += 1;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function percentile(values: readonly number[], p: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1));
  return sorted[index]!;
}

function distribution(values: readonly string[]): Distribution {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count, share: count / values.length }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

function topN(values: readonly string[], n = 10): Distribution {
  return distribution(values).slice(0, n);
}

function firstWords(value: unknown, count: number): string {
  return normalizeText(value).split(" ").filter(Boolean).slice(0, count).join(" ");
}

function argumentOpener(value: unknown): string {
  const normalized = normalizeText(value).replace(/^(yes|no)\s+/, "");
  return normalized.split(" ").filter(Boolean).slice(0, 5).join(" ");
}

function explanationReasons(value: unknown): string[] {
  const text = String(value ?? "");
  const results: string[] = [];
  const regex = /Argument\s+[IV]+\s+is\s+(?:strong|weak):\s*([\s\S]*?)(?=\s+Argument\s+[IV]+\s+is\s+(?:strong|weak):|$)/g;
  for (const match of text.matchAll(regex)) {
    const reason = match[1]?.trim();
    if (reason) results.push(reason);
  }
  return results;
}

function fullSignature(question: Question): string {
  return hash([
    question.statement,
    question.arguments,
    question.options,
    question.correctIndex,
    question.explanation,
  ]);
}

function stemSignature(question: Question): string {
  return hash([question.statement, question.arguments]);
}

function pushBatch(target: Question[], input: Record<string, unknown>): void {
  const batch = generateArgCp014QuestionStudioBatch(input);
  for (const question of batch.questions as readonly Question[]) target.push(question);
}

const questions: Question[] = [];

// 600 canonical-English core questions: exactly 100 per QL, spread 34/33/33 over Easy/Medium/Hard.
for (const qlId of ARG_QL_IDS) {
  for (let difficultyIndex = 0; difficultyIndex < DIFFICULTIES.length; difficultyIndex += 1) {
    const difficulty = DIFFICULTIES[difficultyIndex]!;
    const count = difficultyIndex === 0 ? 34 : 33;
    pushBatch(questions, {
      cpId: "ARG-CP-014",
      profileMode: "core",
      qlId,
      language: "en",
      difficulty,
      seed: `ARG-DIVERSITY-CORE:${qlId}:${difficulty}`,
      count,
    });
  }
}

// 400 canonical-English real-paper questions. Each QL is exercised across every valid exam-profile/difficulty cell.
for (let qlIndex = 0; qlIndex < ARG_QL_IDS.length; qlIndex += 1) {
  const qlId = ARG_QL_IDS[qlIndex]!;
  const targetForQl = qlIndex < 4 ? 67 : 66;
  const base = Math.floor(targetForQl / REAL_PAPER_CELLS.length);
  const extra = targetForQl - base * REAL_PAPER_CELLS.length;
  for (let cellIndex = 0; cellIndex < REAL_PAPER_CELLS.length; cellIndex += 1) {
    const [examProfile, difficulty] = REAL_PAPER_CELLS[cellIndex]!;
    const count = base + (cellIndex < extra ? 1 : 0);
    pushBatch(questions, {
      cpId: "ARG-CP-014",
      profileMode: "real-paper",
      examProfile,
      qlId,
      language: "en",
      difficulty,
      seed: `ARG-DIVERSITY-RP:${qlId}:${examProfile}:${difficulty}`,
      count,
    });
  }
}

if (questions.length !== 1000) throw new Error(`ARG diversity audit expected 1000 questions; got ${questions.length}`);
if (questions.some((question) => question.language !== "en")) throw new Error("ARG diversity audit canonical corpus must remain English-only to avoid counting localization as semantic diversity.");

const core = questions.filter((question) => question.profileMode === "core");
const realPaper = questions.filter((question) => question.profileMode === "real-paper");
if (core.length !== 600 || realPaper.length !== 400) throw new Error(`ARG diversity split drift: core=${core.length}, realPaper=${realPaper.length}`);

const uniqueFull = new Set(questions.map(fullSignature));
const uniqueStems = new Set(questions.map(stemSignature));
const uniqueStatements = new Set(questions.map((question) => normalizeText(question.statement)));
const uniqueCoreStatements = new Set(core.map((question) => normalizeText(question.statement)));
const uniqueRealPaperStatements = new Set(realPaper.map((question) => normalizeText(question.statement)));
const coreTemplates = new Set(core.map((question) => String(question.templateId ?? question.patternId ?? "")));
const realPaperScenarios = new Set(realPaper.map((question) => String(question.scenarioId ?? "").replace(/-(SSC_RECENT_2X4|BANKING_CLASSIC_2X5|BANKING_COMBO_3X5|BANKING_COMBO_4X5)-\d+.*$/, "")));
const exactScenarioIds = new Set(realPaper.map((question) => String(question.scenarioId ?? "")));

const argumentTexts = questions.flatMap((question) => (question.arguments as readonly unknown[] | undefined)?.map(String) ?? []);
const argumentOpeners = argumentTexts.map(argumentOpener).filter(Boolean);
const reasonTexts = questions.flatMap((question) => explanationReasons(question.explanation));
const reasonOpeners = reasonTexts.map((value) => firstWords(value, 5)).filter(Boolean);
const statementOpeners = questions.map((question) => firstWords(question.statement, 7)).filter(Boolean);

const combinedText = questions.map((question) => `${question.statement ?? ""} ${(question.arguments ?? []).join(" ")}`);
const shingleSets = combinedText.map((value) => shingles(value, 3));
const nearestSimilarity = new Array<number>(questions.length).fill(0);
for (let i = 0; i < questions.length; i += 1) {
  for (let j = i + 1; j < questions.length; j += 1) {
    const score = jaccard(shingleSets[i]!, shingleSets[j]!);
    if (score > nearestSimilarity[i]!) nearestSimilarity[i] = score;
    if (score > nearestSimilarity[j]!) nearestSimilarity[j] = score;
  }
}

const qlDistribution = distribution(questions.map((question) => String(question.qlId ?? question.permanentQlId ?? "UNKNOWN")));
const difficultyDistribution = distribution(questions.map((question) => String(question.difficulty ?? question.difficultyLabel ?? "UNKNOWN")));
const profileDistribution = distribution(questions.map((question) => question.profileMode === "core" ? "CORE" : String(question.examProfile ?? "REAL_PAPER")));
const answerDistribution = distribution(questions.map((question) => `${question.profileMode}:${String(question.correctIndex ?? question.correct ?? "?")}`));
const templateDistribution = distribution(core.map((question) => String(question.templateId ?? question.patternId ?? "UNKNOWN")));
const scenarioDistribution = distribution(realPaper.map((question) => String(question.scenarioId ?? "UNKNOWN").replace(/-(SSC_RECENT_2X4|BANKING_CLASSIC_2X5|BANKING_COMBO_3X5|BANKING_COMBO_4X5)-\d+.*$/, "")));

const duplicateFull = questions.length - uniqueFull.size;
const duplicateStem = questions.length - uniqueStems.size;
const fullUniqueness = uniqueFull.size / questions.length;
const stemUniqueness = uniqueStems.size / questions.length;
const statementUniqueness = uniqueStatements.size / questions.length;
const topArgumentOpenerShare = topN(argumentOpeners, 1)[0]?.share ?? 0;
const topReasonOpenerShare = topN(reasonOpeners, 1)[0]?.share ?? 0;
const topTemplateShare = templateDistribution[0]?.share ?? 0;
const topScenarioShare = scenarioDistribution[0]?.share ?? 0;
const p50Nearest = percentile(nearestSimilarity, 0.50);
const p90Nearest = percentile(nearestSimilarity, 0.90);
const p95Nearest = percentile(nearestSimilarity, 0.95);
const p99Nearest = percentile(nearestSimilarity, 0.99);
const maxNearest = Math.max(...nearestSimilarity);

const blockers: string[] = [];
const warnings: string[] = [];
if (duplicateFull > 0) blockers.push(`${duplicateFull} exact full-question duplicates were found.`);
if (coreTemplates.size < 48) blockers.push(`Only ${coreTemplates.size}/48 core templates appeared in the 600-question core corpus.`);
if (realPaperScenarios.size < 24) blockers.push(`Only ${realPaperScenarios.size}/24 correlated real-paper scenario families appeared.`);
if (new Set(questions.map((question) => String(question.qlId))).size < 6) blockers.push("Not all six permanent QLs appeared.");
if (stemUniqueness < 0.90) warnings.push(`Stem+argument uniqueness is ${(stemUniqueness * 100).toFixed(1)}%; repeated real-paper scenarios may be perceptible.`);
if (statementUniqueness < 0.60) warnings.push(`Exact statement uniqueness is ${(statementUniqueness * 100).toFixed(1)}%; statement architecture repeats more than ideal.`);
if (topArgumentOpenerShare > 0.12) warnings.push(`Most common five-word argument opener accounts for ${(topArgumentOpenerShare * 100).toFixed(1)}% of all arguments.`);
if (topReasonOpenerShare > 0.12) warnings.push(`Most common five-word explanation opener accounts for ${(topReasonOpenerShare * 100).toFixed(1)}% of explanation reasons.`);
if (p95Nearest > 0.80) warnings.push(`95th percentile nearest-neighbour 3-shingle similarity is ${(p95Nearest * 100).toFixed(1)}%, indicating a repetitive tail.`);

const status = blockers.length ? "FAIL" : warnings.length ? "PASS_WITH_WARNINGS" : "PASS";
const grade = blockers.length ? "D" : warnings.length >= 3 ? "B" : warnings.length ? "A-" : "A";

const report = {
  status,
  grade,
  corpus: {
    total: questions.length,
    core: core.length,
    realPaper: realPaper.length,
    language: "en",
    localizationExcludedFromSemanticCount: true,
  },
  semanticCoverage: {
    qls: new Set(questions.map((question) => String(question.qlId))).size,
    coreTemplates: coreTemplates.size,
    expectedCoreTemplates: 48,
    realPaperScenarioFamilies: realPaperScenarios.size,
    expectedRealPaperScenarioFamilies: 24,
    exactRealPaperScenarioIds: exactScenarioIds.size,
  },
  uniqueness: {
    uniqueFullQuestions: uniqueFull.size,
    duplicateFullQuestions: duplicateFull,
    fullQuestionUniqueness: fullUniqueness,
    uniqueStemArgumentPairs: uniqueStems.size,
    duplicateStemArgumentPairs: duplicateStem,
    stemArgumentUniqueness: stemUniqueness,
    uniqueStatements: uniqueStatements.size,
    statementUniqueness,
    uniqueCoreStatements: uniqueCoreStatements.size,
    uniqueRealPaperStatements: uniqueRealPaperStatements.size,
    uniqueArgumentTexts: new Set(argumentTexts.map(normalizeText)).size,
    totalArgumentInstances: argumentTexts.length,
  },
  lexicalSimilarity: {
    nearestNeighbour3ShingleJaccard: {
      p50: p50Nearest,
      p90: p90Nearest,
      p95: p95Nearest,
      p99: p99Nearest,
      max: maxNearest,
    },
  },
  concentration: {
    topTemplateShare,
    topScenarioShare,
    topArgumentOpenerShare,
    topReasonOpenerShare,
  },
  distributions: {
    ql: qlDistribution,
    difficulty: difficultyDistribution,
    profile: profileDistribution,
    answerPositionByMode: answerDistribution,
    coreTemplateTop10: templateDistribution.slice(0, 10),
    realPaperScenarioTop10: scenarioDistribution.slice(0, 10),
    statementOpenersTop10: topN(statementOpeners),
    argumentOpenersTop10: topN(argumentOpeners),
    explanationOpenersTop10: topN(reasonOpeners),
  },
  blockers,
  warnings,
};

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function rows(items: Distribution): string {
  return items.map((item) => `| ${item.key} | ${item.count} | ${pct(item.share)} |`).join("\n");
}

const markdown = `# ARG-001 — CP014 1,000-Question Diversity Audit

Status: **${status}**  
Perceived-variety grade: **${grade}**

This audit intentionally uses **1,000 English questions** so Hindi/Punjabi localization does not artificially inflate semantic-variety counts. The certified trilingual parity remains a separate capability.

## Corpus

- 600 core questions
- 400 real-paper questions
- all 6 permanent QLs
- all 3 difficulties where supported
- all 4 real-paper profile shapes

## Coverage

- Core templates observed: **${coreTemplates.size}/48**
- Correlated real-paper scenario families observed: **${realPaperScenarios.size}/24**
- Exact real-paper scenario IDs observed: **${exactScenarioIds.size}**

## Uniqueness

- Full-question uniqueness: **${uniqueFull.size}/1000 (${pct(fullUniqueness)})**
- Stem + arguments uniqueness: **${uniqueStems.size}/1000 (${pct(stemUniqueness)})**
- Exact statement uniqueness: **${uniqueStatements.size}/1000 (${pct(statementUniqueness)})**
- Unique core statements: **${uniqueCoreStatements.size}/600 (${pct(uniqueCoreStatements.size / core.length)})**
- Unique real-paper statements: **${uniqueRealPaperStatements.size}/400 (${pct(uniqueRealPaperStatements.size / realPaper.length)})**
- Unique argument texts: **${new Set(argumentTexts.map(normalizeText)).size}/${argumentTexts.length}** argument instances

## Lexical near-duplicate pressure

Nearest-neighbour word 3-shingle Jaccard similarity:

- p50: **${pct(p50Nearest)}**
- p90: **${pct(p90Nearest)}**
- p95: **${pct(p95Nearest)}**
- p99: **${pct(p99Nearest)}**
- max: **${pct(maxNearest)}**

## Concentration

- Largest single core-template share: **${pct(topTemplateShare)}**
- Largest single real-paper scenario-family share: **${pct(topScenarioShare)}**
- Most common 5-word argument opener: **${pct(topArgumentOpenerShare)}**
- Most common 5-word explanation-reason opener: **${pct(topReasonOpenerShare)}**

## QL distribution

| QL | Count | Share |
| --- | ---: | ---: |
${rows(qlDistribution)}

## Profile distribution

| Profile | Count | Share |
| --- | ---: | ---: |
${rows(profileDistribution)}

## Top argument openers

| Opener | Count | Share |
| --- | ---: | ---: |
${rows(topN(argumentOpeners))}

## Top explanation openers

| Opener | Count | Share |
| --- | ---: | ---: |
${rows(topN(reasonOpeners))}

## Findings

### Release blockers

${blockers.length ? blockers.map((value) => `- ${value}`).join("\n") : "- None."}

### Variety warnings

${warnings.length ? warnings.map((value) => `- ${value}`).join("\n") : "- None."}

## Interpretation

A full-question duplicate is treated as a hard diversity defect. Statement repetition is reported separately because the real-paper engine deliberately reuses a curated scenario across different argument-cardinality/profile presentations. The lexical near-neighbour metric is intended to catch questions that are technically unique but still read like close rewrites.
`;

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, markdown, "utf8");
writeFileSync(JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log("ARG_DIVERSITY_AUDIT_JSON_START");
console.log(JSON.stringify(report, null, 2));
console.log("ARG_DIVERSITY_AUDIT_JSON_END");
console.log(`ARG diversity audit markdown: ${OUT_PATH}`);

if (blockers.length) process.exitCode = 1;
