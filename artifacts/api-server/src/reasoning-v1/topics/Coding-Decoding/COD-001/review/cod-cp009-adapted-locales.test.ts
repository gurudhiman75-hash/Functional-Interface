import assert from "node:assert/strict";

import { ENGLISH_SENTENCE_CODE_LEXEMES } from "../COD-CP-009/datasets/lexemes.en";
import { CP009_ENGLISH_LEXEMES, getCp009LanguagePack } from "../localization/cp009-language-pack";
import { generateCod001EnglishQuestion, generateCod001Question } from "../multilingual-runtime";

interface RowLike {
  statementId: string;
  sentence: string;
  words: readonly string[];
  displayedCodeTokens: readonly string[];
  displayedCode: string;
}

interface QuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  checkpointId: string;
  locale: string;
  topologyKind: string;
  difficulty: string;
  renderer: string;
  answerType: string;
  stem: string;
  structuredPrompt: Readonly<Record<string, unknown>>;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  metadata: Readonly<Record<string, unknown>>;
  [key: string]: unknown;
}

function qlId(number: number): string {
  return `COD-QL-${String(number).padStart(3, "0")}`;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

function renderedStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) for (const item of value) renderedStrings(item, output);
  else if (value && typeof value === "object") for (const item of Object.values(value as Record<string, unknown>)) renderedStrings(item, output);
  return output;
}

function rows(prompt: Readonly<Record<string, unknown>>): RowLike[] {
  return Array.isArray(prompt.rows) ? prompt.rows as unknown as RowLike[] : [];
}

function reverseString(value: string, locale: "hi-IN" | "pa-IN"): string {
  if (value === "_____") return value;
  const pack = getCp009LanguagePack(locale);
  try {
    return pack.englishFor(value);
  } catch {
    let output = value;
    const replacements = CP009_ENGLISH_LEXEMES
      .map((english) => [pack.lexeme(english), english] as const)
      .sort((left, right) => right[0].length - left[0].length);
    for (const [localized, english] of replacements) output = output.replaceAll(localized, english);
    return output;
  }
}

function reverseUnknown(value: unknown, locale: "hi-IN" | "pa-IN"): unknown {
  if (typeof value === "string") return reverseString(value, locale);
  if (Array.isArray(value)) return value.map((item) => reverseUnknown(item, locale));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, reverseUnknown(item, locale)]));
}

function normalizePrompt(value: Readonly<Record<string, unknown>>, locale?: "hi-IN" | "pa-IN"): unknown {
  const reversed = locale ? reverseUnknown(value, locale) as Record<string, unknown> : value;
  const clean = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(clean);
    if (!input || typeof input !== "object") return input;
    return Object.fromEntries(Object.entries(input as Record<string, unknown>)
      .filter(([key]) => !["sentence", "incompleteSentence", "displayedSentenceWithBlank"].includes(key))
      .map(([key, item]) => [key, clean(item)]));
  };
  return clean(reversed);
}

function protectedCodeTokens(question: QuestionLike): string[] {
  return rows(question.structuredPrompt).flatMap((row) => row.displayedCodeTokens);
}

const qlIds = Array.from({ length: 24 }, (_, index) => qlId(175 + index));
const locales = ["hi-IN", "pa-IN"] as const;
const seedsPerQl = 24;
const topologies = new Set<string>();
const prototypes = new Set<string>();
const answerTypes = new Set<string>();
const scenarios = new Set<string>();
const answerPositions: Record<string, number[]> = { "hi-IN": [0, 0, 0, 0], "pa-IN": [0, 0, 0, 0] };
let generated = 0;

assert.equal(new Set(CP009_ENGLISH_LEXEMES).size, ENGLISH_SENTENCE_CODE_LEXEMES.length);
assert.deepEqual([...CP009_ENGLISH_LEXEMES].sort(), ENGLISH_SENTENCE_CODE_LEXEMES.map((entry) => entry.display).sort());
for (const locale of locales) {
  const pack = getCp009LanguagePack(locale);
  assert.equal(new Set(CP009_ENGLISH_LEXEMES.map((word) => pack.lexeme(word))).size, CP009_ENGLISH_LEXEMES.length);
}

for (const id of qlIds) {
  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const english = generateCod001EnglishQuestion(id, seed) as QuestionLike;
    for (const locale of locales) {
      const localized = generateCod001Question(id, locale, seed) as QuestionLike;
      const repeated = generateCod001Question(id, locale, seed) as QuestionLike;
      assert.equal(stableStringify(localized), stableStringify(repeated), `${id}/${locale}/${seed} is not deterministic`);

      assert.equal(localized.qlId ?? localized.permanentQlId, id);
      assert.equal(localized.checkpointId, "COD-CP-009");
      assert.equal(localized.locale, locale);
      assert.equal(localized.topologyKind, english.topologyKind);
      assert.equal(localized.difficulty, english.difficulty);
      assert.equal(localized.renderer, english.renderer);
      assert.equal(localized.answerType, english.answerType);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.deepEqual(reverseUnknown(localized.options, locale), english.options, `${id}/${locale}/${seed} option isomorphism failed`);
      assert.deepEqual(normalizePrompt(localized.structuredPrompt, locale), normalizePrompt(english.structuredPrompt), `${id}/${locale}/${seed} prompt isomorphism failed`);
      assert.equal(localized.metadata.topologyFingerprint, english.metadata.topologyFingerprint);
      assert.equal(localized.metadata.abstractHiddenMappingFingerprint, english.metadata.hiddenMappingFingerprint);
      assert.equal(localized.metadata.localizationVersion, "cod-cp009-language-adapted-v1");
      assert.equal(localized.metadata.localizedLexemeBijection, true);

      const englishRows = rows(english.structuredPrompt);
      const localizedRows = rows(localized.structuredPrompt);
      assert.equal(localizedRows.length, englishRows.length);
      localizedRows.forEach((row, index) => {
        const source = englishRows[index]!;
        assert.deepEqual(row.words.map((word) => reverseString(word, locale)), source.words);
        assert.deepEqual(row.displayedCodeTokens, source.displayedCodeTokens);
        assert.equal(row.displayedCode, source.displayedCode);
        assert.equal(new Set(row.words).size, row.words.length);
        assert.match(row.sentence, getCp009LanguagePack(locale).scriptPattern);
      });

      const text = [localized.stem, ...renderedStrings(localized.explanation), ...localizedRows.map((row) => row.sentence), ...renderedStrings(localized.options)].join(" ");
      assert.match(text, getCp009LanguagePack(locale).scriptPattern);
      let unprotected = text;
      for (const token of protectedCodeTokens(localized)) unprotected = unprotected.replaceAll(token, " ");
      for (const word of CP009_ENGLISH_LEXEMES) {
        assert.doesNotMatch(unprotected, new RegExp(`\\b${word}\\b`, "iu"), `${id}/${locale}/${seed} leaks '${word}'`);
      }
      assert.doesNotMatch(unprotected, /\b(?:what|which|how|code|coded|language|answer|correct|possible|impossible|word|sentence|statement|token|mapping|common|compare|complete|candidate|therefore|option)\b/iu);
      assert.doesNotMatch(text, /\b(?:TODO|TBD|FIXME|undefined|null)\b|\[object Object\]/iu);
      if (locale === "pa-IN") assert.doesNotMatch(text, /(?:^|[\s।,:;!?])(?:ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ)(?=$|[\s।,:;!?])/u);

      topologies.add(localized.topologyKind);
      prototypes.add(String(localized.metadata.sourcePrototypeId));
      answerTypes.add(localized.answerType);
      scenarios.add(String(localized.metadata.scenarioId));
      answerPositions[locale]![localized.correctIndex] += 1;
      generated += 1;
    }
  }
}

assert.equal(topologies.size, 10, `Expected ten CP-009 topologies, found ${[...topologies].join(",")}`);
assert.equal(prototypes.size, 16, `Expected sixteen source prototypes, found ${[...prototypes].join(",")}`);
assert.ok(answerTypes.size >= 4);
assert.ok(scenarios.size >= 10);
for (const locale of locales) assert.ok(answerPositions[locale]!.every((count) => count > 0));
assert.equal(generated, qlIds.length * seedsPerQl * locales.length);

console.log(JSON.stringify({
  status: "COD-CP-009 HINDI/PUNJABI LANGUAGE-ADAPTED RUNTIME PASSED",
  qlRange: "COD-QL-175..198",
  permanentQls: qlIds.length,
  locales,
  seedsPerQl,
  generatedQuestions: generated,
  topologies: [...topologies].sort(),
  sourcePrototypes: prototypes.size,
  answerTypes: [...answerTypes].sort(),
  scenariosReached: scenarios.size,
  answerPositions,
  remainingMultilingualGap: 0,
  questionStudioVisible: false,
  publiclyPublishable: false,
}, null, 2));
