import { strict as assert } from "node:assert";
import { writeFileSync } from "node:fs";
import {
  PGK_001_QUESTION_STUDIO_CORPUS_V1,
} from "./knowledge-v1-pgk001-adapter-v1";

type Severity = "BLOCKER" | "MAJOR" | "REVIEW";
type Finding = Readonly<{
  severity: Severity;
  code: string;
  questionId?: string;
  cpId?: string;
  qlId?: string;
  detail: string;
  stem?: string;
  answer?: string;
  explanation?: string;
}>;

const questions = PGK_001_QUESTION_STUDIO_CORPUS_V1;
const findings: Finding[] = [];

function add(
  severity: Severity,
  code: string,
  detail: string,
  q?: (typeof questions)[number],
) {
  findings.push({
    severity,
    code,
    questionId: q?.questionId,
    cpId: q?.cpId,
    qlId: q?.qlId,
    detail,
    stem: q?.stem,
    answer: q?.canonicalAnswer,
    explanation: q?.explanation,
  });
}

function normalized(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[“”‘’"'.,:;!?()[\]{}—–/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function sentenceCount(text: string) {
  return text.split(/[!?]+|(?<!\\d)\\.(?!\\d)/).map((x) => x.trim()).filter(Boolean).length;
}

const exactStem = new Map<string, string[]>();
const canonicalStem = new Map<string, string[]>();
const answerPositions = [0, 0, 0, 0];
const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
const cpStats = new Map<string, { total: number; easy: number; medium: number; hard: number }>();
const qlCounts = new Map<string, number>();

const bannedLearner = [
  "the correct answer is",
  "the correct option",
  "the other options",
  "this question tests",
  "review batch",
  "runtimeRegistered",
  "sourceFactIds",
  "generator",
  "according to the source",
  "according to the report",
  "according to the website",
];

const genericRelations = [
  "associated with",
  "closely associated",
  "most closely associated",
  "linked with",
  "closely linked",
  "known for",
  "best described",
];

const sourceLeakage = [
  "pseb",
  "puda",
  "britannica",
  "official website",
  "district portal",
  "source:",
];

const genericStemPrefixes = [
  /^which pair is correctly matched\??$/i,
  /^which set is correctly matched\??$/i,
  /^which is the correct chronological order\??$/i,
  /^which of the following is correctly matched\??$/i,
];

const highRiskTerms = /\b(first|only|largest|smallest|oldest|youngest|highest|lowest|longest|shortest|most famous|major|current|currently|presently|today|recent)\b/i;
const mutableNumerical = /\b(population|literacy|density|sex ratio|districts?|divisions?|constituencies?|reserved|production|capacity|mw|percent|percentage|rank|ranking)\b/i;
const yearPattern = /\b(?:18|19|20)\d{2}\b/;
const hardRelational = /\b(consider|statements?|pairs?|set|sequence|chronological|order|correctly matched|incorrectly matched|combination|both|which of the following statements)\b/i;

for (const q of questions) {
  difficultyCounts[q.difficulty] += 1;
  answerPositions[q.correctIndex] += 1;
  qlCounts.set(q.qlId, (qlCounts.get(q.qlId) ?? 0) + 1);
  const cp = cpStats.get(q.cpId) ?? { total: 0, easy: 0, medium: 0, hard: 0 };
  cp.total += 1;
  if (q.difficulty === "Easy") cp.easy += 1;
  if (q.difficulty === "Medium") cp.medium += 1;
  if (q.difficulty === "Hard") cp.hard += 1;
  cpStats.set(q.cpId, cp);

  const stemNorm = normalized(q.stem);
  const exact = exactStem.get(stemNorm) ?? [];
  exact.push(q.questionId);
  exactStem.set(stemNorm, exact);

  const canonical = stemNorm
    .replace(/^(which|what|who|where|when) (of the following )?/, "")
    .replace(/^(consider the following|consider these) /, "")
    .replace(/\b(correct|incorrect|correctly|incorrectly|matched|statement|statements|pair|pairs|set|sets)\b/g, "")
    .replace(/\b(i|ii|iii|iv|v)\b/g, "")
    .replace(/\d+/g, "#")
    .replace(/\s+/g, " ")
    .trim();
  const sem = canonicalStem.get(canonical) ?? [];
  sem.push(q.questionId);
  canonicalStem.set(canonical, sem);

  if (q.options.length !== 4 || new Set(q.options).size !== 4) {
    add("BLOCKER", "OPTION_INTEGRITY", "Question must expose four unique options.", q);
  }
  if (q.correctIndex < 0 || q.correctIndex > 3 || q.options[q.correctIndex] !== q.canonicalAnswer) {
    add("BLOCKER", "ANSWER_INTEGRITY", "Correct index and canonical answer disagree.", q);
  }
  if (!q.stem.trim() || !q.explanation.trim()) {
    add("BLOCKER", "MISSING_LEARNER_TEXT", "Stem or explanation is empty.", q);
  }
  if (q.sourceFactIds.length === 0) {
    add("MAJOR", "MISSING_FACT_PROVENANCE", "No canonical source fact ID is attached.", q);
  }
  if (q.sourceIds.length === 0) {
    add("MAJOR", "MISSING_SOURCE_PROVENANCE", "No source authority ID is attached.", q);
  }

  const learner = `${q.stem}\n${q.explanation}`.toLowerCase();
  for (const term of bannedLearner) {
    if (learner.includes(term.toLowerCase())) add("BLOCKER", "INTERNAL_LANGUAGE_LEAK", `Contains banned learner wording: ${term}`, q);
  }
  for (const term of genericRelations) {
    if (learner.includes(term.toLowerCase())) add("MAJOR", "GENERIC_RELATION_WORDING", `Contains weak relation wording: ${term}`, q);
  }
  for (const term of sourceLeakage) {
    if (learner.includes(term.toLowerCase())) add("MAJOR", "SOURCE_LABEL_LEAKAGE", `Contains source/editorial label: ${term}`, q);
  }

  const sw = wordCount(q.stem);
  const ew = wordCount(q.explanation);
  const es = sentenceCount(q.explanation);
  if (sw > 46) add("REVIEW", "LONG_STEM", `Stem has ${sw} words.`, q);
  if (ew < 6) add("REVIEW", "THIN_EXPLANATION", `Explanation has only ${ew} words.`, q);
  if (ew > 65) add("REVIEW", "LONG_EXPLANATION", `Explanation has ${ew} words.`, q);
  if (es > 4) add("REVIEW", "EXPLANATION_TOO_MANY_SENTENCES", `Explanation has ${es} sentences.`, q);

  if (q.canonicalAnswer.length >= 4 && normalized(q.stem).includes(normalized(q.canonicalAnswer))) {
    const reverseInstruction = /\b(not|incorrect|except)\b/i.test(q.stem);
    if (!reverseInstruction) add("REVIEW", "ANSWER_VISIBLE_IN_STEM", "Canonical answer text is already visible in the stem.", q);
  }

  const lengths = q.options.map((x) => Math.max(1, wordCount(x)));
  const correctLen = lengths[q.correctIndex]!;
  const other = lengths.filter((_, i) => i !== q.correctIndex);
  const medianOther = [...other].sort((a, b) => a - b)[1]!;
  if (correctLen >= 4 && correctLen >= medianOther * 2.5) {
    add("REVIEW", "ANSWER_LENGTH_CUE", `Correct option is ${correctLen} words versus median distractor length ${medianOther}.`, q);
  }

  if (q.difficulty === "Easy" && /\b(consider|i\.|ii\.|iii\.|correctly matched|chronological|sequence)\b/i.test(q.stem)) {
    add("REVIEW", "EASY_COMPLEX_FORM", "Easy item uses a compound reasoning format.", q);
  }
  if (q.difficulty === "Hard" && !hardRelational.test(q.stem) && sw < 15) {
    add("REVIEW", "HARD_DIRECT_RECALL", "Hard item appears to be short direct recall rather than relational depth.", q);
  }

  if (highRiskTerms.test(q.stem + " " + q.explanation)) {
    add("REVIEW", "HIGH_RISK_FACT_WORDING", "Contains a superlative/current/high-risk factual qualifier requiring manual source verification.", q);
  }

  if (mutableNumerical.test(q.stem) && /\d/.test(q.stem + " " + q.canonicalAnswer) && !yearPattern.test(q.stem + " " + q.explanation)) {
    if (q.cpId === "PGK-001-CP-002" || q.cpId === "PGK-001-CP-020") {
      add("MAJOR", "UNVERSIONED_MUTABLE_NUMERIC", "Administrative/demographic numeric fact lacks an explicit reference year.", q);
    }
  }

  if (genericStemPrefixes.some((re) => re.test(q.stem.trim()))) {
    add("REVIEW", "GENERIC_STEM", "Uses a generic stem that may reduce question variety.", q);
  }
}

for (const [stem, ids] of exactStem) {
  if (ids.length > 1) {
    for (const id of ids) {
      const q = questions.find((x) => x.questionId === id)!;
      add("MAJOR", "EXACT_DUPLICATE_STEM", `Exact normalized stem repeated ${ids.length} times: ${ids.join(", ")}`, q);
    }
  }
}

for (const [key, ids] of canonicalStem) {
  if (key.length >= 16 && ids.length >= 3) {
    for (const id of ids) {
      const q = questions.find((x) => x.questionId === id)!;
      add("REVIEW", "POSSIBLE_SEMANTIC_DUPLICATE", `Canonicalized stem cluster has ${ids.length} items: ${ids.join(", ")}`, q);
    }
  }
}

for (const [qlId, count] of qlCounts) {
  if (count !== 6) add("BLOCKER", "QL_COUNT", `${qlId} has ${count} questions; expected 6.`);
}

const optionSpread = Math.max(...answerPositions) - Math.min(...answerPositions);
if (optionSpread > 1) {
  add("MAJOR", "ANSWER_POSITION_IMBALANCE", `Correct-option position counts are ${answerPositions.join("/")}; expected near-even distribution.`);
}

const blockerCount = findings.filter((f) => f.severity === "BLOCKER").length;
const majorCount = findings.filter((f) => f.severity === "MAJOR").length;
const reviewCount = findings.filter((f) => f.severity === "REVIEW").length;

const report = {
  auditId: "PGK-001-EXHAUSTIVE-CONTENT-AUDIT-V1",
  corpus: {
    questions: questions.length,
    cps: cpStats.size,
    qls: qlCounts.size,
    difficultyCounts,
    answerPositions,
  },
  findingCounts: {
    blocker: blockerCount,
    major: majorCount,
    review: reviewCount,
    total: findings.length,
  },
  cpStats: Object.fromEntries([...cpStats.entries()].sort()),
  findings,
};

writeFileSync(
  "artifacts/api-server/dist/pgk-001-exhaustive-audit-v1.json",
  JSON.stringify(report, null, 2),
  "utf8",
);

console.log(JSON.stringify(report.findingCounts));
console.log(JSON.stringify(report.corpus));
assert.equal(questions.length, 1092);
assert.equal(cpStats.size, 26);
assert.equal(qlCounts.size, 182);
assert.equal(blockerCount, 0, `PGK exhaustive audit has ${blockerCount} blocker(s)`);
