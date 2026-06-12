import { readSimpl001LibraryJson } from "./package-registry";
import type {
  FlattenedQuestionLanguageEntry,
  QuestionLanguageLibrary,
  RenderParameters,
  SimplCpId,
  SimplQuestionLanguageId,
} from "./types";

const QUESTION_LANGUAGE_LIBRARY =
  readSimpl001LibraryJson<QuestionLanguageLibrary>(
    "question-language.library.json",
  );

function flattenQuestionLanguage(): FlattenedQuestionLanguageEntry[] {
  return QUESTION_LANGUAGE_LIBRARY.canonicalProblems.flatMap((cp) =>
    cp.entries.map((entry) => ({
      ...entry,
      cpId: cp.cpId,
      cpTitle: cp.name,
      ownership: QUESTION_LANGUAGE_LIBRARY.ownership,
      sourceAuthority: QUESTION_LANGUAGE_LIBRARY.sourceAuthority,
    })),
  );
}

export const QUESTION_LANGUAGE_ENTRIES = flattenQuestionLanguage();

export function selectStemByQlId(
  qlId: SimplQuestionLanguageId,
): FlattenedQuestionLanguageEntry {
  const item = QUESTION_LANGUAGE_ENTRIES.find((entry) => entry.id === qlId);
  if (!item) {
    throw new Error(`Unknown SIMPL-001 question language id: ${qlId}`);
  }
  return item;
}

export function selectStemsByCp(
  cpId: SimplCpId,
): FlattenedQuestionLanguageEntry[] {
  return QUESTION_LANGUAGE_ENTRIES.filter((entry) => entry.cpId === cpId);
}

export function selectStemTextByQlId(qlId: SimplQuestionLanguageId): string {
  return selectStemByQlId(qlId).text;
}

export function renderApprovedStem(
  qlId: SimplQuestionLanguageId,
  parameters: RenderParameters,
): string {
  const stem = selectStemTextByQlId(qlId);
  return substituteApprovedParameters(stem, parameters);
}

function substituteApprovedParameters(
  template: string,
  parameters: RenderParameters,
): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key: string) => {
    const value = parameters[key];
    if (value === undefined) {
      throw new Error(`Missing SIMPL-001 render parameter: ${key}`);
    }
    return String(value);
  });
}
