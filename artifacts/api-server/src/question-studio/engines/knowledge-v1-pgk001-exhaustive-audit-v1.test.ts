import { strict as assert } from "node:assert";

import { PGK_001_QUESTION_STUDIO_CORPUS_V1 } from "./knowledge-v1-pgk001-adapter-v1";

type Finding = {
  severity: "BLOCKER" | "REVIEW";
  code: string;
  questionId: string;
  cpId: string;
  qlId: string;
  detail: string;
};

const findings: Finding[] = [];
const questions = PGK_001_QUESTION_STUDIO_CORPUS_V1;

assert.equal(questions.length, 1092, "PGK-001 exhaustive audit must cover all 1,092 frozen questions");

const exactSurface = new Map<string, string>();
const normalizedStem = new Map<string, string[]>();

const bannedRelation = /\b(?:associated with|closely associated with|linked with|closely linked with|known for|best described)\b/i;
const metaWording = /\b(?:the correct answer is|the correct option|the other options|the other pairs|the other figures|this question tests|review batch|generator|runtimeRegistered|sourceFactIds)\b/i;
const mechanicalQualifier = /\b(?:traditionally|mainly|generally|commonly|widely|usually)\b/i;
const volatileMarker = /\b(?:current(?:ly)?|latest|2024|2025|2026)\b/i;
const sourceLeakage = /\b(?:government of punjab|pseb|bbmb|moefcc|census of india|britannica|source:|report:)\b/i;

for (const q of questions) {
  const learner = `${q.stem}\n${q.explanation}`;
  const key = JSON.stringify([q.stem.trim().toLowerCase(), q.options.map((x) => x.trim().toLowerCase())]);

  if (exactSurface.has(key)) {
    findings.push({
      severity: "BLOCKER",
      code: "DUPLICATE_FULL_SURFACE",
      questionId: q.questionId,
      cpId: q.cpId,
      qlId: q.qlId,
      detail: `duplicates ${exactSurface.get(key)}`,
    });
  } else {
    exactSurface.set(key, q.questionId);
  }

  const stemKey = q.stem.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const stemPeers = normalizedStem.get(stemKey) ?? [];
  stemPeers.push(q.questionId);
  normalizedStem.set(stemKey, stemPeers);

  if (q.options.length !== 4 || new Set(q.options).size !== 4) {
    findings.push({ severity: "BLOCKER", code: "OPTION_INTEGRITY", questionId: q.questionId, cpId: q.cpId, qlId: q.qlId, detail: "requires four unique options" });
  }
  if (q.options[q.correctIndex] !== q.canonicalAnswer) {
    findings.push({ severity: "BLOCKER", code: "ANSWER_MISMATCH", questionId: q.questionId, cpId: q.cpId, qlId: q.qlId, detail: "correctIndex does not resolve to canonicalAnswer" });
  }
  if (bannedRelation.test(learner)) {
    findings.push({ severity: "BLOCKER", code: "GENERIC_RELATION_WORDING", questionId: q.questionId, cpId: q.cpId, qlId: q.qlId, detail: learner.match(bannedRelation)?.[0] ?? "" });
  }
  if (metaWording.test(learner)) {
    findings.push({ severity: "BLOCKER", code: "META_OR_OPTION_ANALYSIS", questionId: q.questionId, cpId: q.cpId, qlId: q.qlId, detail: learner.match(metaWording)?.[0] ?? "" });
  }
  if (sourceLeakage.test(learner)) {
    findings.push({ severity: "BLOCKER", code: "SOURCE_LEAKAGE", questionId: q.questionId, cpId: q.cpId, qlId: q.qlId, detail: learner.match(sourceLeakage)?.[0] ?? "" });
  }

  const sentences = q.explanation.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean).length;
  if (sentences < 1 || sentences > 3) {
    findings.push({ severity: "REVIEW", code: "EXPLANATION_LENGTH", questionId: q.questionId, cpId: q.cpId, qlId: q.qlId, detail: `${sentences} sentence(s)` });
  }
  if (mechanicalQualifier.test(learner)) {
    findings.push({ severity: "REVIEW", code: "MECHANICAL_QUALIFIER", questionId: q.questionId, cpId: q.cpId, qlId: q.qlId, detail: learner.match(mechanicalQualifier)?.[0] ?? "" });
  }
  if (volatileMarker.test(learner)) {
    findings.push({ severity: "REVIEW", code: "VOLATILE_OR_RECENT_MARKER", questionId: q.questionId, cpId: q.cpId, qlId: q.qlId, detail: learner.match(volatileMarker)?.[0] ?? "" });
  }

  if (
    q.difficulty === "Hard" &&
    q.stem.length < 72 &&
    !/(consider|statement|pair|sequence|order|chronolog|set contains|combination|which set|correctly matched|both|while|shares|between|from .* to|two|three|four|five)/i.test(q.stem)
  ) {
    findings.push({ severity: "REVIEW", code: "POSSIBLY_TRIVIAL_HARD", questionId: q.questionId, cpId: q.cpId, qlId: q.qlId, detail: q.stem });
  }

  const answerWords = q.canonicalAnswer.trim().split(/\s+/).length;
  const distractorWords = q.options.filter((_, i) => i !== q.correctIndex).map((x) => x.trim().split(/\s+/).length);
  const maxDistractorWords = Math.max(...distractorWords);
  if (answerWords >= Math.max(8, maxDistractorWords * 2)) {
    findings.push({ severity: "REVIEW", code: "ANSWER_LENGTH_CUE", questionId: q.questionId, cpId: q.cpId, qlId: q.qlId, detail: `answer words=${answerWords}, max distractor words=${maxDistractorWords}` });
  }
}

for (const [stem, ids] of normalizedStem) {
  if (ids.length > 1 && !/^(which pair is correctly matched|which set is correctly matched|which statement is correct|consider the following)/.test(stem)) {
    for (const id of ids.slice(1)) {
      const q = questions.find((x) => x.questionId === id)!;
      findings.push({ severity: "REVIEW", code: "REPEATED_STEM", questionId: id, cpId: q.cpId, qlId: q.qlId, detail: ids.join(", ") });
    }
  }
}

const counts = findings.reduce<Record<string, number>>((acc, f) => {
  acc[f.code] = (acc[f.code] ?? 0) + 1;
  return acc;
}, {});

console.log("PGK-001_EXHAUSTIVE_AUDIT_COUNTS", JSON.stringify(counts));
for (const f of findings) console.log("PGK-001_AUDIT_FINDING", JSON.stringify(f));

const blockers = findings.filter((f) => f.severity === "BLOCKER");
assert.equal(blockers.length, 0, `PGK-001 exhaustive learner-surface blockers: ${JSON.stringify(blockers.slice(0, 100))}`);
