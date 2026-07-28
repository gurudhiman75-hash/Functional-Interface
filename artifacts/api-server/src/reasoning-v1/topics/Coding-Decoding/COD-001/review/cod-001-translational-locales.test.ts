import assert from "node:assert/strict";

import {
  generateCod001EnglishQuestion,
  generateCod001Question,
  isCod001TranslationalQl,
  type Cod001Locale,
} from "../multilingual-runtime";

interface QuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  checkpointId: string;
  ruleId?: string;
  locale: string;
  difficulty: string;
  renderer: string;
  answerType: string;
  stem: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
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

function collectStrings(value: unknown, output = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    output.add(value);
    for (const token of value.match(/[A-Za-z]{2,}/gu) ?? []) output.add(token);
    return output;
  }
  if (Array.isArray(value)) for (const item of value) collectStrings(item, output);
  else if (value && typeof value === "object") for (const item of Object.values(value as Record<string, unknown>)) collectStrings(item, output);
  return output;
}

function studentText(question: QuestionLike): string {
  const prompt = question.structuredPrompt as Record<string, unknown>;
  const descriptions = Array.isArray(prompt?.conditions)
    ? prompt.conditions.map((item) => String((item as Record<string, unknown>).description ?? "")).join(" ")
    : "";
  return `${question.stem} ${stableStringify(question.explanation)} ${descriptions}`;
}

function stripProtected(text: string, english: QuestionLike): string {
  const protectedStrings = collectStrings({
    prompt: english.structuredPrompt,
    options: english.options,
  });
  return [...protectedStrings]
    .sort((left, right) => right.length - left.length)
    .reduce((current, value) => value ? current.replaceAll(value, " ") : current, text);
}

function optionValues(options: readonly unknown[]): string[] {
  return options.map((option) => {
    if (typeof option === "string") return option;
    const record = option as Record<string, unknown>;
    return stableStringify(record.value ?? record.answer ?? record.text ?? record.label ?? record.members ?? record.tokens ?? record.words ?? option);
  });
}

function parityPrompt(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(parityPrompt);
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  return Object.fromEntries(Object.entries(record)
    .filter(([key]) => key !== "description")
    .map(([key, item]) => [key, parityPrompt(item)]));
}

const ids = [
  ...Array.from({ length: 172 }, (_, index) => qlId(index + 1)),
  "COD-QL-199",
];
const locales: readonly Exclude<Cod001Locale, "en-IN">[] = ["hi-IN", "pa-IN"];
const seedsPerQl = 8;
const answerPositions: Record<string, number[]> = {
  "hi-IN": [0, 0, 0, 0],
  "pa-IN": [0, 0, 0, 0],
};
const checkpointCounts: Record<string, number> = {};
let generated = 0;

assert.equal(ids.length, 173);
assert.ok(ids.every(isCod001TranslationalQl));
assert.equal(isCod001TranslationalQl("COD-QL-173"), false);
assert.equal(isCod001TranslationalQl("COD-QL-198"), false);

for (const id of ids) {
  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const english = generateCod001EnglishQuestion(id, seed) as QuestionLike;

    for (const locale of locales) {
      const question = generateCod001Question(id, locale, seed) as QuestionLike;
      const repeated = generateCod001Question(id, locale, seed) as QuestionLike;
      assert.equal(stableStringify(question), stableStringify(repeated), `${id}/${locale}/${seed} is not deterministic`);

      assert.equal(question.qlId ?? question.permanentQlId, id);
      assert.equal(question.locale, locale);
      assert.equal(question.checkpointId, english.checkpointId);
      assert.equal(question.ruleId, english.ruleId);
      assert.equal(question.difficulty, english.difficulty);
      assert.equal(question.renderer, english.renderer);
      assert.equal(question.answerType, english.answerType);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.deepEqual(optionValues(question.options), optionValues(english.options));
      assert.deepEqual(parityPrompt(question.structuredPrompt), parityPrompt(english.structuredPrompt));
      assert.equal(question.metadata?.hiddenFingerprint, english.metadata?.hiddenFingerprint);
      assert.equal(question.metadata?.localizationVersion, "cod-001-translational-localization-v1");
      assert.equal(question.metadata?.sourceLocale, "en-IN");

      const text = studentText(question);
      assert.ok(text.length > 180, `${id}/${locale}/${seed} has insufficient localized teaching text`);
      if (locale === "hi-IN") assert.match(text, /[\u0900-\u097F]/u, `${id}/${locale}/${seed} lacks Devanagari`);
      else assert.match(text, /[\u0A00-\u0A7F]/u, `${id}/${locale}/${seed} lacks Gurmukhi`);

      const unprotected = stripProtected(text, english);
      assert.doesNotMatch(
        unprotected,
        /\b(?:what|which|how|find|code|coded|decode|using|same|rule|correct|answer|given|table|condition|first|last|word|letter|digit|string|option|therefore|apply|example|move|forward|backward|position|value|result|source|target)\b/iu,
        `${id}/${locale}/${seed} leaks English instructional text`,
      );
      assert.doesNotMatch(text, /\b(?:TODO|TBD|FIXME|undefined|null)\b|\[object Object\]/iu);
      if (locale === "pa-IN") {
        assert.doesNotMatch(text, /(?:^|[\s।,:;!?])(?:ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ)(?=$|[\s।,:;!?])/u, `${id}/${locale}/${seed} uses banned technical Punjabi`);
      }

      assert.equal(question.options.length, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
      answerPositions[locale]![question.correctIndex] += 1;
      checkpointCounts[`${question.checkpointId}:${locale}`] = (checkpointCounts[`${question.checkpointId}:${locale}`] ?? 0) + 1;
      generated += 1;
    }
  }
}

for (const locale of locales) {
  assert.ok(answerPositions[locale]!.every((count) => count > 0), `${locale} misses an answer position`);
}

assert.throws(() => generateCod001Question("COD-QL-173", "hi-IN", 1), /language-adapted/u);
assert.throws(() => generateCod001Question("COD-QL-175", "pa-IN", 1), /language-adapted/u);
assert.equal(generated, ids.length * seedsPerQl * locales.length);

console.log(JSON.stringify({
  status: "COD-001 TRANSLATIONAL HINDI/PUNJABI RUNTIME PASSED",
  qlRanges: ["COD-QL-001..172", "COD-QL-199"],
  permanentQlsPerLocale: ids.length,
  locales,
  seedsPerQl,
  generatedQuestions: generated,
  answerPositions,
  checkpointCounts,
  remainingLanguageAdaptedQls: "COD-QL-173..198",
  questionStudioVisible: false,
  publiclyPublishable: false,
}, null, 2));
