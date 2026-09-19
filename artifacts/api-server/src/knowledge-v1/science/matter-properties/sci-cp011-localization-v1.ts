import { SCI_CP011_REVIEW_V1 } from "./sci-cp011-review-v1";
import { SCI_CP011_LOCALIZATION_V1_PART1 } from "./sci-cp011-localization-v1-part1";
import { SCI_CP011_LOCALIZATION_V1_PART2 } from "./sci-cp011-localization-v1-part2";
import { SCI_CP011_LOCALIZATION_V1_PART3 } from "./sci-cp011-localization-v1-part3";
import { SCI_CP011_LOCALIZATION_V1_PART4 } from "./sci-cp011-localization-v1-part4";
import type { SciCp011LocalizedQuestionV1 } from "./sci-cp011-localization-core-v1";

export const SCI_CP011_LOCALIZATION_V1 = Object.freeze({
  hi: Object.freeze([
    ...SCI_CP011_LOCALIZATION_V1_PART1.hi,
    ...SCI_CP011_LOCALIZATION_V1_PART2.hi,
    ...SCI_CP011_LOCALIZATION_V1_PART3.hi,
    ...SCI_CP011_LOCALIZATION_V1_PART4.hi,
  ]),
  pa: Object.freeze([
    ...SCI_CP011_LOCALIZATION_V1_PART1.pa,
    ...SCI_CP011_LOCALIZATION_V1_PART2.pa,
    ...SCI_CP011_LOCALIZATION_V1_PART3.pa,
    ...SCI_CP011_LOCALIZATION_V1_PART4.pa,
  ]),
});

type ValidationSummary = {
  valid: boolean;
  errors: string[];
  counts: { hi: number; pa: number };
  qlCounts: { hi: Record<string, number>; pa: Record<string, number> };
  difficultyCounts: { hi: Record<string, number>; pa: Record<string, number> };
  answerPositionCounts: { hi: Record<string, number>; pa: Record<string, number> };
};

const sourceById = new Map(SCI_CP011_REVIEW_V1.map((question) => [question.questionId, question]));
const devanagari = /[\u0900-\u097F]/;
const gurmukhi = /[\u0A00-\u0A7F]/;

function countQuestions(questions: readonly SciCp011LocalizedQuestionV1[]) {
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<string, number> = {};
  const answerPositionCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of questions) {
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] = (difficultyCounts[q.difficulty] ?? 0) + 1;
    answerPositionCounts[["A", "B", "C", "D"][q.correctIndex]] += 1;
  }
  return { qlCounts, difficultyCounts, answerPositionCounts };
}

export function validateSciCp011LocalizationV1(): ValidationSummary {
  const errors: string[] = [];
  const sourceIds = new Set(SCI_CP011_REVIEW_V1.map((q) => q.questionId));
  const seenLocalizationIds = new Set<string>();

  for (const [language, questions] of Object.entries(SCI_CP011_LOCALIZATION_V1) as ["hi" | "pa", readonly SciCp011LocalizedQuestionV1[]][]) {
    if (questions.length !== 60) errors.push(`${language}: expected 60 localized questions, found ${questions.length}`);
    const seenSources = new Set<string>();
    const seenStems = new Set<string>();

    for (const q of questions) {
      const source = sourceById.get(q.sourceQuestionId);
      if (!source) { errors.push(`${q.localizationId}: missing English source`); continue; }
      if (seenLocalizationIds.has(q.localizationId)) errors.push(`duplicate localizationId: ${q.localizationId}`);
      seenLocalizationIds.add(q.localizationId);
      if (seenSources.has(q.sourceQuestionId)) errors.push(`${language}: duplicate source ${q.sourceQuestionId}`);
      seenSources.add(q.sourceQuestionId);
      const normalizedStem = q.stem.trim().replace(/\s+/g, " ").toLowerCase();
      if (seenStems.has(normalizedStem)) errors.push(`${language}: duplicate localized stem ${q.stem}`);
      seenStems.add(normalizedStem);

      if (q.correctIndex !== source.correctIndex) errors.push(`${q.localizationId}: answer position differs from English`);
      if (q.options[q.correctIndex] !== q.canonicalAnswer) errors.push(`${q.localizationId}: localized key mismatch`);
      if (q.options.length !== 4 || new Set(q.options).size !== 4) errors.push(`${q.localizationId}: four distinct options required`);
      if (q.qlId !== source.qlId || q.difficulty !== source.difficulty) errors.push(`${q.localizationId}: QL/difficulty parity failed`);
      if (q.sourceEnglishCanonicalAnswer !== source.canonicalAnswer) errors.push(`${q.localizationId}: source English answer parity failed`);
      if (JSON.stringify(q.sourceIds) !== JSON.stringify(source.sourceIds)) errors.push(`${q.localizationId}: sourceIds parity failed`);
      if (JSON.stringify(q.sourceFactIds) !== JSON.stringify(source.sourceFactIds)) errors.push(`${q.localizationId}: sourceFactIds parity failed`);
      if (!q.localizationReviewOnly || q.localizationFrozen || q.runtimeRegistered) errors.push(`${q.localizationId}: localization lifecycle violation`);
      if (!q.stem.trim() || q.explanation.trim().length < 20) errors.push(`${q.localizationId}: learner copy too thin`);
      if (q.stem.trim() === source.stem.trim() || q.explanation.trim() === source.explanation.trim()) errors.push(`${q.localizationId}: English learner copy leaked unchanged`);
      const requiredScript = language === "hi" ? devanagari : gurmukhi;
      if (!requiredScript.test(q.stem) || !requiredScript.test(q.explanation)) errors.push(`${q.localizationId}: expected native script missing`);
      if (/\b(option|choice)\s*[ABCD]\b/i.test(q.explanation)) errors.push(`${q.localizationId}: option-analysis leakage`);
    }

    if (seenSources.size !== sourceIds.size || [...sourceIds].some((id) => !seenSources.has(id))) {
      errors.push(`${language}: localized source coverage does not exactly match the 60 English questions`);
    }
  }

  const hi = countQuestions(SCI_CP011_LOCALIZATION_V1.hi);
  const pa = countQuestions(SCI_CP011_LOCALIZATION_V1.pa);
  for (const [language, stats] of [["hi", hi], ["pa", pa]] as const) {
    for (let ql = 1; ql <= 10; ql += 1) {
      const id = `SCI-011-QL-${String(ql).padStart(3, "0")}`;
      if (stats.qlCounts[id] !== 6) errors.push(`${language}/${id}: expected 6, found ${stats.qlCounts[id] ?? 0}`);
    }
    for (const [difficulty, count] of Object.entries({ Easy: 18, Medium: 30, Hard: 12 })) {
      if (stats.difficultyCounts[difficulty] !== count) errors.push(`${language}/${difficulty}: expected ${count}, found ${stats.difficultyCounts[difficulty] ?? 0}`);
    }
    for (const position of ["A", "B", "C", "D"]) {
      if (stats.answerPositionCounts[position] !== 15) errors.push(`${language}/${position}: expected 15, found ${stats.answerPositionCounts[position]}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    counts: { hi: SCI_CP011_LOCALIZATION_V1.hi.length, pa: SCI_CP011_LOCALIZATION_V1.pa.length },
    qlCounts: { hi: hi.qlCounts, pa: pa.qlCounts },
    difficultyCounts: { hi: hi.difficultyCounts, pa: pa.difficultyCounts },
    answerPositionCounts: { hi: hi.answerPositionCounts, pa: pa.answerPositionCounts },
  };
}
