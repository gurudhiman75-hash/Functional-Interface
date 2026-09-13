import assert from "node:assert/strict";

import { generateCod001EnglishQuestion, generateCod001Question } from "../multilingual-runtime";

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
  reviewOnly?: boolean;
  questionStudioVisible?: boolean;
  publiclyPublishable?: boolean;
  metadata?: Readonly<Record<string, unknown>>;
  [key: string]: unknown;
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

function optionSemanticValue(option: unknown): string {
  if (!option || typeof option !== "object") return stableStringify(option);
  const record = option as Record<string, unknown>;
  return stableStringify(record.value ?? record.answer ?? record.text ?? record.label ?? option);
}

function optionIsCorrect(option: unknown): boolean {
  return Boolean(option && typeof option === "object" && (option as Record<string, unknown>).isCorrect);
}

function instructionalText(question: QuestionLike): string {
  return [question.stem, ...renderedStrings(question.explanation)].join(" ");
}

function withoutCodeTokens(text: string): string {
  return text.replace(/[A-Z0-9]{2,}/gu, " ");
}

const qlIds = ["COD-QL-200", "COD-QL-201", "COD-QL-202", "COD-QL-203"] as const;
const locales = ["hi-IN", "pa-IN"] as const;
const seedsPerQl = 64;
const answerPositions = Object.fromEntries(locales.map((locale) => [locale, Object.fromEntries(qlIds.map((id) => [id, [0, 0, 0, 0]]))])) as Record<typeof locales[number], Record<typeof qlIds[number], number[]>>;
const difficulties = Object.fromEntries(locales.map((locale) => [locale, Object.fromEntries(qlIds.map((id) => [id, new Set<string>()]))])) as Record<typeof locales[number], Record<typeof qlIds[number], Set<string>>>;
let generated = 0;

for (const id of qlIds) {
  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const english = generateCod001EnglishQuestion(id, seed) as QuestionLike;

    for (const locale of locales) {
      const localized = generateCod001Question(id, locale, seed) as QuestionLike;
      const repeated = generateCod001Question(id, locale, seed) as QuestionLike;

      assert.equal(stableStringify(localized), stableStringify(repeated), `${id}/${locale}/${seed} is not deterministic`);
      assert.equal(localized.qlId ?? localized.permanentQlId, id);
      assert.equal(localized.locale, locale);
      assert.equal(localized.checkpointId, english.checkpointId);
      assert.equal(localized.ruleId, english.ruleId);
      assert.equal(localized.difficulty, english.difficulty);
      assert.equal(localized.renderer, english.renderer);
      assert.equal(localized.answerType, english.answerType);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(stableStringify(localized.structuredPrompt), stableStringify(english.structuredPrompt), `${id}/${locale}/${seed} changed solver prompt data`);
      assert.deepEqual(localized.options.map(optionSemanticValue), english.options.map(optionSemanticValue), `${id}/${locale}/${seed} changed option meanings`);
      assert.equal(localized.metadata?.hiddenFingerprint, english.metadata?.hiddenFingerprint);
      assert.equal(localized.metadata?.localizationVersion, "cod-001-source-gap-localization-v1");
      assert.equal(localized.metadata?.sourceLocale, "en-IN");
      assert.equal(localized.metadata?.maturity, "MULTILINGUAL_RUNTIME_PROOF");

      assert.equal(localized.options.length, 4);
      assert.equal(localized.options.map(optionIsCorrect).filter(Boolean).length, 1);
      assert.equal(optionIsCorrect(localized.options[localized.correctIndex]), true);

      const text = instructionalText(localized);
      assert.ok(localized.stem.length >= 45, `${id}/${locale}/${seed} stem is too short`);
      assert.ok(stableStringify(localized.explanation).length >= 150, `${id}/${locale}/${seed} explanation is too thin`);
      assert.doesNotMatch(text, /\b(?:TODO|TBD|FIXME|undefined|null)\b|\[object Object\]/iu);
      const prose = withoutCodeTokens(text);
      assert.doesNotMatch(prose, /\b(?:what|which|how|find|code|coded|decode|using|same|rule|correct|answer|given|example|letter|word|therefore|apply|target|source|result|reverse|shift|sort)\b/iu, `${id}/${locale}/${seed} leaks English instructional prose`);

      if (locale === "hi-IN") {
        assert.match(text, /[\u0900-\u097F]/u, `${id}/${locale}/${seed} lacks Devanagari`);
        assert.doesNotMatch(text, /[\u0A00-\u0A7F]/u, `${id}/${locale}/${seed} leaks Gurmukhi`);
      } else {
        assert.match(text, /[\u0A00-\u0A7F]/u, `${id}/${locale}/${seed} lacks Gurmukhi`);
        assert.doesNotMatch(text, /[\u0900-\u097F]/u, `${id}/${locale}/${seed} leaks Devanagari`);
        assert.doesNotMatch(text, /(?:^|[\s।,:;!?])(?:ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ)(?=$|[\s।,:;!?])/u);
      }

      assert.equal(localized.reviewOnly, true);
      assert.equal(localized.questionStudioVisible, false);
      assert.equal(localized.publiclyPublishable, false);
      assert.equal(localized.metadata?.questionStudioDiscoverable, false);
      assert.equal(localized.metadata?.questionBankWritable, false);
      assert.equal(localized.metadata?.mockTestEligible, false);
      assert.equal(localized.metadata?.publiclyPublishable, false);

      answerPositions[locale][id][localized.correctIndex] += 1;
      difficulties[locale][id].add(localized.difficulty);
      generated += 1;
    }
  }
}

for (const locale of locales) {
  for (const id of qlIds) {
    assert.ok(answerPositions[locale][id].every((count) => count > 0), `${id}/${locale} misses an answer position`);
    assert.ok(difficulties[locale][id].size >= 2, `${id}/${locale} does not span multiple instance-derived difficulty bands`);
  }
}

assert.equal(generated, qlIds.length * seedsPerQl * locales.length);

console.log(JSON.stringify({
  status: "COD-001 SOURCE-GAP HINDI/PUNJABI LOCALIZATION PASSED",
  qlRange: "COD-QL-200..203",
  locales,
  seedsPerQl,
  generatedQuestions: generated,
  answerPositions,
  difficulties: Object.fromEntries(locales.map((locale) => [locale, Object.fromEntries(qlIds.map((id) => [id, [...difficulties[locale][id]].sort()]))])),
  solverPromptParity: true,
  optionParity: true,
  hiddenFingerprintParity: true,
  reviewOnly: true,
  questionStudioVisible: false,
  publiclyPublishable: false,
}, null, 2));
