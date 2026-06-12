import { readNsSurd001LibraryJson } from "./package-registry";
import type {
  QuestionLanguageItem,
  QuestionLanguageLibrary,
  SurdCpId,
  SurdQuestionLanguageId,
} from "./types";

const QUESTION_LANGUAGE_LIBRARY =
  readNsSurd001LibraryJson<QuestionLanguageLibrary>(
    "question-language.library.json",
  );

export function selectStemByQlId(
  qlId: SurdQuestionLanguageId,
): QuestionLanguageItem {
  const item = QUESTION_LANGUAGE_LIBRARY.items.find((entry) => entry.id === qlId);
  if (!item) {
    throw new Error(`Unknown NS-SURD-001 question language id: ${qlId}`);
  }
  return item;
}

export function selectStemsByCp(cpId: SurdCpId): QuestionLanguageItem[] {
  return QUESTION_LANGUAGE_LIBRARY.items.filter((entry) => entry.cpId === cpId);
}

export function selectStemTextByQlId(qlId: SurdQuestionLanguageId): string {
  return selectStemByQlId(qlId).stem;
}
