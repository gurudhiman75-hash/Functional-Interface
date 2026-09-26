import { generatePgkCp001LocalizedReviewV1 } from "./pgk-cp001-localization-v1";
import { generatePgkCp002LocalizedReviewV1 } from "./pgk-cp002-localization-v1";
import { generatePgkCp003LocalizedReviewV1 } from "./pgk-cp003-localization-v1";
import { generatePgkCp004LocalizedReviewV1 } from "./pgk-cp004-localization-v1";
import { generatePgkCp005LocalizedReviewV1 } from "./pgk-cp005-localization-v1";
import { generatePgkCp006LocalizedReviewV1 } from "./pgk-cp006-localization-v1";
import { generatePgkCp007LocalizedReviewV1 } from "./pgk-cp007-localization-v1";
import { generatePgkCp008LocalizedReviewV1 } from "./pgk-cp008-localization-v1";
import { generatePgkCp009LocalizedReviewV1 } from "./pgk-cp009-localization-v1";
import { generatePgkCp010LocalizedReviewV1 } from "./pgk-cp010-localization-v1";
import { generatePgkCp011LocalizedReviewV1 } from "./pgk-cp011-localization-v1";
import { generatePgkCp012LocalizedReviewV1 } from "./pgk-cp012-localization-v1";
import { generatePgkCp013LocalizedReviewV1 } from "./pgk-cp013-localization-v1";
import { generatePgkCp014LocalizedReviewV1 } from "./pgk-cp014-localization-v1";
import { generatePgkCp015LocalizedReviewV1 } from "./pgk-cp015-localization-v1";
import { generatePgkCp016LocalizedReviewV1 } from "./pgk-cp016-localization-v1";
import { generatePgkCp017LocalizedReviewV1 } from "./pgk-cp017-localization-v1";
import { generatePgkCp018LocalizedReviewV1 } from "./pgk-cp018-localization-v1";
import { generatePgkCp019LocalizedReviewV1 } from "./pgk-cp019-localization-v1";
import { generatePgkCp020LocalizedReviewV1 } from "./pgk-cp020-localization-v1";
import { generatePgkCp021LocalizedReviewV1 } from "./pgk-cp021-localization-v1";
import { generatePgkCp022LocalizedReviewV1 } from "./pgk-cp022-localization-v1";
import { generatePgkCp023LocalizedReviewV1 } from "./pgk-cp023-localization-v1";
import { generatePgkCp024LocalizedReviewV1 } from "./pgk-cp024-localization-v1";
import { generatePgkCp025LocalizedReviewV1 } from "./pgk-cp025-localization-v1";
import { generatePgkCp026LocalizedReviewV1 } from "./pgk-cp026-localization-v1";
import type { PgkLocaleV1 } from "./pgk-localization-types-v1";

export type PgkNativeLocaleV1 = Exclude<PgkLocaleV1, "en">;

export type PgkLocalizedOverlayCorpusRowV1 = Readonly<{
  cpId: string;
  questionId: string;
  englishQuestionId: string;
  qlId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  locale: PgkNativeLocaleV1;
  reviewOnly: true;
  runtimeRegistered: false;
  factIds: readonly string[];
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
}>;

type Generator = (locale: PgkLocaleV1) => readonly unknown[];

const modules: readonly [string, Generator][] = [
  ["PGK-001-CP-001", generatePgkCp001LocalizedReviewV1],
  ["PGK-001-CP-002", generatePgkCp002LocalizedReviewV1],
  ["PGK-001-CP-003", generatePgkCp003LocalizedReviewV1],
  ["PGK-001-CP-004", generatePgkCp004LocalizedReviewV1],
  ["PGK-001-CP-005", generatePgkCp005LocalizedReviewV1],
  ["PGK-001-CP-006", generatePgkCp006LocalizedReviewV1],
  ["PGK-001-CP-007", generatePgkCp007LocalizedReviewV1],
  ["PGK-001-CP-008", generatePgkCp008LocalizedReviewV1],
  ["PGK-001-CP-009", generatePgkCp009LocalizedReviewV1],
  ["PGK-001-CP-010", generatePgkCp010LocalizedReviewV1],
  ["PGK-001-CP-011", generatePgkCp011LocalizedReviewV1],
  ["PGK-001-CP-012", generatePgkCp012LocalizedReviewV1],
  ["PGK-001-CP-013", generatePgkCp013LocalizedReviewV1],
  ["PGK-001-CP-014", generatePgkCp014LocalizedReviewV1],
  ["PGK-001-CP-015", generatePgkCp015LocalizedReviewV1],
  ["PGK-001-CP-016", generatePgkCp016LocalizedReviewV1],
  ["PGK-001-CP-017", generatePgkCp017LocalizedReviewV1],
  ["PGK-001-CP-018", generatePgkCp018LocalizedReviewV1],
  ["PGK-001-CP-019", generatePgkCp019LocalizedReviewV1],
  ["PGK-001-CP-020", generatePgkCp020LocalizedReviewV1],
  ["PGK-001-CP-021", generatePgkCp021LocalizedReviewV1],
  ["PGK-001-CP-022", generatePgkCp022LocalizedReviewV1],
  ["PGK-001-CP-023", generatePgkCp023LocalizedReviewV1],
  ["PGK-001-CP-024", generatePgkCp024LocalizedReviewV1],
  ["PGK-001-CP-025", generatePgkCp025LocalizedReviewV1],
  ["PGK-001-CP-026", generatePgkCp026LocalizedReviewV1],
];

function toStrings(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

function normalizeRow(
  cpId: string,
  value: unknown,
  locale: PgkNativeLocaleV1,
  index: number,
): PgkLocalizedOverlayCorpusRowV1 {
  const row = value as Record<string, unknown>;
  const localization = (row.localizationV1 ?? {}) as Record<string, unknown>;
  const questionId = String(row.questionId ?? "").trim();
  const englishQuestionId = String(localization.englishQuestionId ?? "").trim();
  const qlId = String(row.qlId ?? "").trim().toUpperCase();
  const difficulty = String(row.difficulty ?? "") as PgkLocalizedOverlayCorpusRowV1["difficulty"];
  const stem = String(row.stem ?? "").trim();
  const explanation = String(row.explanation ?? "").trim();
  const options = toStrings(row.options);
  const correctIndex = Number(row.correctIndex);
  const canonicalAnswer = String(row.canonicalAnswer ?? "").trim();

  if (!questionId || !englishQuestionId) {
    throw new Error(`${cpId} localized row ${index + 1}: missing question identity`);
  }
  if (!/^PGK-001-QL-\d{3}$/.test(qlId)) {
    throw new Error(`${questionId}: invalid QL ID ${qlId}`);
  }
  if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
    throw new Error(`${questionId}: invalid difficulty ${difficulty}`);
  }
  if (!stem || !explanation) {
    throw new Error(`${questionId}: missing localized learner text`);
  }
  if (options.length !== 4 || new Set(options).size !== 4) {
    throw new Error(`${questionId}: localized options must be four unique values`);
  }
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= 4) {
    throw new Error(`${questionId}: invalid localized correct index`);
  }
  if (options[correctIndex] !== canonicalAnswer) {
    throw new Error(`${questionId}: localized answer/options mismatch`);
  }
  if (row.reviewOnly !== true || row.runtimeRegistered !== false || row.locale !== locale) {
    throw new Error(`${questionId}: localized lifecycle/locale guard broken`);
  }

  return Object.freeze({
    cpId,
    questionId,
    englishQuestionId,
    qlId,
    difficulty,
    stem,
    options: Object.freeze([...options]),
    correctIndex,
    canonicalAnswer,
    explanation,
    locale,
    reviewOnly: true,
    runtimeRegistered: false,
    factIds: Object.freeze(toStrings(row.factIds)),
    sourceIds: Object.freeze(toStrings(row.sourceIds)),
    sourceFactIds: Object.freeze(toStrings(row.sourceFactIds)),
  });
}

export function generatePgk001LocalizedOverlayCorpusV1(
  locale: PgkNativeLocaleV1,
): readonly PgkLocalizedOverlayCorpusRowV1[] {
  const rows = modules.flatMap(([cpId, generate]) =>
    generate(locale).map((value, index) => normalizeRow(cpId, value, locale, index)),
  );

  if (rows.length !== 1092) {
    throw new Error(
      `PGK-001 ${locale} localization corpus requires 1,092 rows; found ${rows.length}`,
    );
  }
  if (new Set(rows.map((row) => row.questionId)).size !== rows.length) {
    throw new Error(`PGK-001 ${locale} localization corpus contains duplicate question IDs`);
  }
  if (new Set(rows.map((row) => row.englishQuestionId)).size !== rows.length) {
    throw new Error(`PGK-001 ${locale} localization corpus contains duplicate English identities`);
  }

  return Object.freeze(rows);
}

export const PGK_001_LOCALIZED_OVERLAY_CP_IDS_V1 = Object.freeze(
  modules.map(([cpId]) => cpId),
);
