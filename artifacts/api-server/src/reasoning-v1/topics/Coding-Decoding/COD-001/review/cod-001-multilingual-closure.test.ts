import assert from "node:assert/strict";

import { generateCod001EnglishQuestion, generateCod001Question, type Cod001Locale } from "../multilingual-runtime";

interface QuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  checkpointId: string;
  locale: string;
  difficulty: string;
  renderer: string;
  answerType: string;
  stem: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  prototypeOnly?: boolean;
  reviewOnly?: boolean;
  questionStudioVisible?: boolean;
  publiclyPublishable?: boolean;
  metadata?: Readonly<Record<string, unknown>>;
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

function optionSemanticValue(option: unknown): string {
  if (option === null || typeof option !== "object") return stableStringify(option);
  const record = option as Record<string, unknown>;
  for (const key of ["canonicalValue", "value", "answer", "text", "label"] as const) {
    if (key in record) return stableStringify(record[key]);
  }
  for (const key of ["members", "tokens", "words"] as const) {
    const value = record[key];
    if (Array.isArray(value)) return stableStringify([...value].sort());
  }
  return stableStringify(record);
}

function optionIsCorrect(option: unknown): boolean {
  return Boolean(option && typeof option === "object" && (option as Record<string, unknown>).isCorrect);
}

function collectStrings(value: unknown, output = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    if (value.length >= 2) output.add(value);
    for (const token of value.match(/[A-Za-z]{2,}/gu) ?? []) output.add(token);
    return output;
  }
  if (Array.isArray(value)) for (const item of value) collectStrings(item, output);
  else if (value && typeof value === "object") for (const item of Object.values(value as Record<string, unknown>)) collectStrings(item, output);
  return output;
}

function renderedStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) for (const item of value) renderedStrings(item, output);
  else if (value && typeof value === "object") for (const item of Object.values(value as Record<string, unknown>)) renderedStrings(item, output);
  return output;
}

function studentText(question: QuestionLike): string {
  const prompt = question.structuredPrompt as Record<string, unknown>;
  const conditions = Array.isArray(prompt?.conditions)
    ? prompt.conditions.map((item) => String((item as Record<string, unknown>).description ?? ""))
    : [];
  const rows = Array.isArray(prompt?.rows)
    ? prompt.rows.map((item) => String((item as Record<string, unknown>).sentence ?? ""))
    : [];
  return [question.stem, ...renderedStrings(question.explanation), ...conditions, ...rows].join(" ");
}

function stripProtected(text: string, english: QuestionLike): string {
  const protectedStrings = collectStrings({
    structuredPrompt: english.structuredPrompt,
    options: english.options,
  });
  return [...protectedStrings]
    .sort((left, right) => right.length - left.length)
    .reduce((current, value) => value ? current.replaceAll(value, " ") : current, text);
}

function expectedLocalizationVersion(number: number): string {
  if (number <= 172 || number === 199) return "cod-001-translational-localization-v1";
  if (number <= 174) return "cod-cp008-language-adapted-v1";
  return "cod-cp009-language-adapted-v1";
}

const qlIds = Array.from({ length: 199 }, (_, index) => qlId(index + 1));
const locales: readonly Cod001Locale[] = ["en-IN", "hi-IN", "pa-IN"];
const seedsPerQl = 6;
const answerPositions: Record<Cod001Locale, number[]> = {
  "en-IN": [0, 0, 0, 0],
  "hi-IN": [0, 0, 0, 0],
  "pa-IN": [0, 0, 0, 0],
};
const checkpoints: Record<Cod001Locale, Set<string>> = {
  "en-IN": new Set(), "hi-IN": new Set(), "pa-IN": new Set(),
};
const difficulties: Record<Cod001Locale, Set<string>> = {
  "en-IN": new Set(), "hi-IN": new Set(), "pa-IN": new Set(),
};
const renderers: Record<Cod001Locale, Set<string>> = {
  "en-IN": new Set(), "hi-IN": new Set(), "pa-IN": new Set(),
};
const fingerprints: Record<Cod001Locale, Map<string, string>> = {
  "en-IN": new Map(), "hi-IN": new Map(), "pa-IN": new Map(),
};
let generatedQuestions = 0;

assert.equal(qlIds[0], "COD-QL-001");
assert.equal(qlIds.at(-1), "COD-QL-199");
assert.equal(new Set(qlIds).size, 199);

for (const id of qlIds) {
  const number = Number(id.slice(-3));
  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const english = generateCod001EnglishQuestion(id, seed) as QuestionLike;

    for (const locale of locales) {
      const question = generateCod001Question(id, locale, seed) as QuestionLike;
      const repeated = generateCod001Question(id, locale, seed) as QuestionLike;
      assert.equal(stableStringify(question), stableStringify(repeated), `${id}/${locale}/${seed} is not deterministic`);

      assert.equal(question.qlId ?? question.permanentQlId, id, `${id}/${locale}/${seed} has wrong identity`);
      assert.equal(question.locale, locale);
      assert.equal(question.checkpointId, english.checkpointId);
      assert.equal(question.difficulty, english.difficulty);
      assert.equal(question.renderer, english.renderer);
      assert.equal(question.answerType, english.answerType);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.options.length, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);

      const optionValues = question.options.map(optionSemanticValue);
      assert.equal(new Set(optionValues).size, 4, `${id}/${locale}/${seed} has duplicate option meanings`);
      const correctness = question.options.map(optionIsCorrect);
      assert.equal(correctness.filter(Boolean).length, 1, `${id}/${locale}/${seed} must mark one answer`);
      assert.equal(correctness[question.correctIndex], true, `${id}/${locale}/${seed} correctIndex disagrees with truth`);

      const text = studentText(question);
      assert.ok(question.stem.trim().length >= 18, `${id}/${locale}/${seed} has a short stem`);
      assert.ok(stableStringify(question.explanation).length >= 80, `${id}/${locale}/${seed} has a short explanation`);
      assert.doesNotMatch(text, /\b(?:TODO|TBD|FIXME|undefined|null)\b|\[object Object\]/iu);
      assert.doesNotMatch(text, /COD-QL-|COD-CP-|RUNTIME_PROOF|ENGLISH_RUNTIME_PROOF|prototypeOnly|questionStudioVisible/u);

      if (locale !== "en-IN") {
        assert.equal(question.metadata?.localizationVersion, expectedLocalizationVersion(number));
        assert.equal(question.metadata?.sourceLocale, "en-IN");
        const unprotected = stripProtected(text, english);
        assert.doesNotMatch(
          unprotected,
          /\b(?:what|which|who|how|find|code|coded|decode|language|answer|correct|possible|impossible|given|table|condition|word|sentence|statement|token|mapping|rule|option|therefore|apply|example|result|source|target|candidate|complete|common|compare)\b/iu,
          `${id}/${locale}/${seed} leaks English instructional text`,
        );
        if (locale === "hi-IN") assert.match(text, /[\u0900-\u097F]/u, `${id}/${locale}/${seed} lacks Devanagari`);
        else {
          assert.match(text, /[\u0A00-\u0A7F]/u, `${id}/${locale}/${seed} lacks Gurmukhi`);
          assert.doesNotMatch(text, /(?:^|[\s।,:;!?])(?:ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ)(?=$|[\s।,:;!?])/u);
        }
      }

      assert.notEqual(question.prototypeOnly, true);
      assert.notEqual(question.questionStudioVisible, true);
      assert.notEqual(question.publiclyPublishable, true);
      assert.notEqual(question.metadata?.publiclyPublishable, true);

      const fingerprint = stableStringify({
        stem: question.stem,
        prompt: question.structuredPrompt,
        options: optionValues,
        correct: optionValues[question.correctIndex],
      });
      const prior = fingerprints[locale].get(fingerprint);
      assert.equal(prior, undefined, `${id}/${locale}/${seed} exactly collides with ${prior}`);
      fingerprints[locale].set(fingerprint, `${id}/${locale}/${seed}`);

      answerPositions[locale][question.correctIndex] += 1;
      checkpoints[locale].add(question.checkpointId);
      difficulties[locale].add(question.difficulty);
      renderers[locale].add(question.renderer);
      generatedQuestions += 1;
    }
  }
}

const expectedCheckpoints = Array.from({ length: 10 }, (_, index) => `COD-CP-${String(index + 1).padStart(3, "0")}`);
for (const locale of locales) {
  assert.deepEqual([...checkpoints[locale]].sort(), expectedCheckpoints);
  assert.deepEqual([...difficulties[locale]].sort(), ["EASY", "HARD", "MEDIUM"]);
  assert.ok(renderers[locale].size >= 5, `${locale} reached only ${renderers[locale].size} renderers`);
  assert.ok(answerPositions[locale].every((count) => count > 0));
  const ratio = Math.max(...answerPositions[locale]) / Math.min(...answerPositions[locale]);
  assert.ok(ratio <= 1.3, `${locale} answer-position ratio is ${ratio}: ${answerPositions[locale].join("/")}`);
  assert.equal(fingerprints[locale].size, qlIds.length * seedsPerQl);
}

assert.equal(generatedQuestions, qlIds.length * seedsPerQl * locales.length);

console.log(JSON.stringify({
  status: "COD-001 MULTILINGUAL RUNTIME CLOSURE PASSED",
  qlRange: "COD-QL-001..199",
  permanentQls: qlIds.length,
  locales,
  seedsPerQl,
  generatedQuestions,
  questionsPerLocale: qlIds.length * seedsPerQl,
  answerPositions,
  checkpoints: Object.fromEntries(locales.map((locale) => [locale, [...checkpoints[locale]].sort()])),
  difficulties: Object.fromEntries(locales.map((locale) => [locale, [...difficulties[locale]].sort()])),
  renderers: Object.fromEntries(locales.map((locale) => [locale, [...renderers[locale]].sort()])),
  exactQuestionCollisions: { "en-IN": 0, "hi-IN": 0, "pa-IN": 0 },
  questionStudioVisible: false,
  publiclyPublishable: false,
}, null, 2));
