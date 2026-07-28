import type { GeneratedCp009Question } from "../COD-CP-009/cp009-runtime";
import { getCp009LanguagePack } from "./cp009-language-pack";
import type { CodTranslatedLocale } from "./translational-language-pack";

interface RowLike {
  statementId: string;
  sentence: string;
  words: readonly string[];
  displayedCodeTokens: readonly string[];
  displayedCode: string;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function translateString(value: string, locale: CodTranslatedLocale): string {
  const pack = getCp009LanguagePack(locale);
  try {
    return pack.lexeme(value);
  } catch {
    let output = value;
    const words = [...new Set(value.match(/[A-Za-z]+/gu) ?? [])].sort((a, b) => b.length - a.length);
    for (const word of words) {
      try {
        output = output.replace(new RegExp(`\\b${escapeRegex(word)}\\b`, "gu"), pack.lexeme(word));
      } catch {
        // Artificial code tokens, placeholders and non-lexical labels remain unchanged.
      }
    }
    return output;
  }
}

function translateUnknown(value: unknown, locale: CodTranslatedLocale): unknown {
  if (typeof value === "string") return translateString(value, locale);
  if (Array.isArray(value)) return value.map((item) => translateUnknown(item, locale));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .map(([key, item]) => [key, translateUnknown(item, locale)]));
}

function localizeRows(
  rows: readonly RowLike[],
  locale: CodTranslatedLocale,
  missingWordEnglish?: string,
): RowLike[] {
  const pack = getCp009LanguagePack(locale);
  return rows.map((row) => {
    const containsBlank = row.words.includes("_____");
    if (containsBlank && !missingWordEnglish) {
      throw new Error(`${row.statementId} contains a missing-word placeholder without its hidden word`);
    }
    const completeEnglishWords = row.words.map((word) => word === "_____" ? missingWordEnglish! : word);
    const completeLocalizedWords = completeEnglishWords.map((word) => pack.lexeme(word));
    const localizedMissingWord = containsBlank ? pack.lexeme(missingWordEnglish!) : undefined;
    const words = row.words.map((word) => word === "_____" ? "_____" : pack.lexeme(word));
    const completeSentence = pack.renderSentence(completeLocalizedWords);
    return {
      ...row,
      words,
      sentence: localizedMissingWord ? completeSentence.replace(localizedMissingWord, "_____") : completeSentence,
    };
  });
}

function localizePrompt(promptValue: unknown, locale: CodTranslatedLocale): Record<string, unknown> {
  const original = asRecord(promptValue);
  const translated = translateUnknown(original, locale) as Record<string, unknown>;
  const originalRows = Array.isArray(original.rows) ? original.rows as unknown as RowLike[] : [];
  const missingWordEnglish = typeof original.correctWord === "string" ? original.correctWord : undefined;
  const rows = localizeRows(originalRows, locale, missingWordEnglish);
  translated.rows = rows;

  const incompleteStatementId = typeof original.incompleteStatementId === "string" ? original.incompleteStatementId : undefined;
  if (incompleteStatementId) {
    const row = rows.find((candidate) => candidate.statementId === incompleteStatementId);
    if (row && "incompleteSentence" in original) translated.incompleteSentence = row.sentence;
    if (row && "displayedSentenceWithBlank" in original) translated.displayedSentenceWithBlank = row.sentence;
  }
  return translated;
}

function optionDisplay(option: unknown): string {
  if (typeof option === "string") return option;
  const record = asRecord(option);
  const value = record.value ?? record.answer ?? record.text ?? record.label;
  if (typeof value === "string" || typeof value === "number") return String(value);
  const members = record.members ?? record.tokens ?? record.words;
  if (Array.isArray(members)) return members.map(String).join(", ");
  return JSON.stringify(option);
}

function rowsFromPrompt(prompt: Record<string, unknown>): RowLike[] {
  return Array.isArray(prompt.rows) ? prompt.rows as unknown as RowLike[] : [];
}

export type LocalizedCp009Question = Omit<GeneratedCp009Question, "locale" | "stem" | "structuredPrompt" | "options" | "explanation" | "metadata"> & {
  locale: CodTranslatedLocale;
  stem: string;
  structuredPrompt: Readonly<Record<string, unknown>>;
  options: readonly unknown[];
  explanation: {
    referenceAid: readonly string[];
    quickMethod: string;
    ruleStatement: string;
    evidenceComparison: readonly string[];
    targetResult: string;
    conclusion: string;
    commonTrapAlert: string;
  };
  metadata: GeneratedCp009Question["metadata"] & {
    localizationVersion: "cod-cp009-language-adapted-v1";
    sourceLocale: "en-IN";
    abstractHiddenMappingFingerprint: unknown;
    localizedLexemeBijection: true;
  };
};

export function localizeCp009Question(
  english: GeneratedCp009Question,
  locale: CodTranslatedLocale,
): LocalizedCp009Question {
  const pack = getCp009LanguagePack(locale);
  const prompt = localizePrompt(english.structuredPrompt, locale);
  const options = english.options.map((option) => translateUnknown(option, locale));
  const sourcePrototypeId = String(english.metadata.sourcePrototypeId);
  const style = Math.abs(english.seed) % 3;
  const correct = optionDisplay(options[english.correctIndex]);
  const trap = optionDisplay(options.find((_, index) => index !== english.correctIndex));
  const rows = rowsFromPrompt(prompt);

  const visibleWords = rows.flatMap((row) => row.words).filter((word) => word !== "_____");
  const englishVisibleWords = rowsFromPrompt(asRecord(english.structuredPrompt))
    .flatMap((row) => row.words)
    .filter((word) => word !== "_____");
  if (new Set(visibleWords).size !== new Set(englishVisibleWords).size) {
    throw new Error(`${english.qlId}/${locale}/${english.seed} localized lexeme collision`);
  }

  return {
    ...english,
    locale,
    stem: pack.stem(sourcePrototypeId, prompt, style),
    structuredPrompt: prompt,
    options,
    explanation: {
      referenceAid: pack.referenceAid,
      quickMethod: pack.quickMethod,
      ruleStatement: pack.ruleStatement,
      evidenceComparison: rows.map((row) => pack.rowEvidence(row.sentence, row.displayedCode)),
      targetResult: pack.targetResult(correct, style),
      conclusion: pack.conclusion(correct, style),
      commonTrapAlert: pack.trap(trap),
    },
    metadata: {
      ...english.metadata,
      localizationVersion: "cod-cp009-language-adapted-v1",
      sourceLocale: "en-IN",
      abstractHiddenMappingFingerprint: english.metadata.hiddenMappingFingerprint,
      localizedLexemeBijection: true,
    },
  };
}
