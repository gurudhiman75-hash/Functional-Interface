import assert from "node:assert/strict";

import { renamedLabel } from "../COD-CP-008/cp008-prototype-solver";
import type { Cp008StructuredPrompt } from "../COD-CP-008/cp008-prototype-types";
import { generateCod001EnglishQuestion, generateCod001Question } from "../multilingual-runtime";

interface QuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  checkpointId: string;
  ruleId: string;
  locale: string;
  difficulty: string;
  renderer: string;
  answerType: string;
  stem: string;
  structuredPrompt: Cp008StructuredPrompt;
  options: readonly { value: string; isCorrect: boolean; errorLabel?: string }[];
  correctIndex: number;
  explanation: unknown;
  metadata: Readonly<Record<string, unknown>>;
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

const qlIds = ["COD-QL-173", "COD-QL-174"] as const;
const locales = ["hi-IN", "pa-IN"] as const;
const seedsPerQl = 120;
const factIds = new Set<string>();
const categories = new Set<string>();
const topologies = new Set<string>();
const answerPositions: Record<string, number[]> = {
  "hi-IN": [0, 0, 0, 0],
  "pa-IN": [0, 0, 0, 0],
};
let generated = 0;

for (const qlId of qlIds) {
  for (let seed = 0; seed < seedsPerQl; seed += 1) {
    const english = generateCod001EnglishQuestion(qlId, seed) as QuestionLike;
    for (const locale of locales) {
      const question = generateCod001Question(qlId, locale, seed) as QuestionLike;
      const repeated = generateCod001Question(qlId, locale, seed) as QuestionLike;
      assert.equal(stableStringify(question), stableStringify(repeated), `${qlId}/${locale}/${seed} is not deterministic`);

      assert.equal(question.qlId ?? question.permanentQlId, qlId);
      assert.equal(question.checkpointId, "COD-CP-008");
      assert.equal(question.locale, locale);
      assert.equal(question.ruleId, english.ruleId);
      assert.equal(question.difficulty, english.difficulty);
      assert.equal(question.renderer, english.renderer);
      assert.equal(question.answerType, "WORD_OR_LABEL");
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map((option) => option.value)).size, 4);
      assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
      assert.equal(question.options[question.correctIndex]!.isCorrect, true);
      assert.equal(
        renamedLabel(question.structuredPrompt.mapping, question.structuredPrompt.ordinaryAnswer),
        question.options[question.correctIndex]!.value,
      );

      assert.equal(question.structuredPrompt.taskKind, english.structuredPrompt.taskKind);
      assert.equal(question.structuredPrompt.topology, english.structuredPrompt.topology);
      assert.equal(question.structuredPrompt.mapping.length, english.structuredPrompt.mapping.length);
      assert.equal(question.metadata.abstractHiddenFingerprint, english.metadata.hiddenFingerprint);
      assert.equal(question.metadata.localizedSolverAgreement, true);
      assert.equal(question.metadata.localizationVersion, "cod-cp008-language-adapted-v1");
      assert.equal(question.metadata.sourceLocale, "en-IN");

      const text = [question.stem, ...renderedStrings(question.explanation), ...question.options.map((option) => option.value)].join(" ");
      if (locale === "hi-IN") assert.match(text, /[\u0900-\u097F]/u);
      else assert.match(text, /[\u0A00-\u0A7F]/u);
      assert.doesNotMatch(text, /\b(?:what|which|who|how|called|language|answer|correct|ordinary|referent|mapping|renaming|patients|colour|used|item|word|option|therefore)\b/iu, `${qlId}/${locale}/${seed} leaks English`);
      assert.doesNotMatch(text, /\b(?:TODO|TBD|FIXME|undefined|null)\b|\[object Object\]/iu);
      if (locale === "pa-IN") assert.doesNotMatch(text, /(?:^|[\s।,:;!?])(?:ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ)(?=$|[\s।,:;!?])/u);

      if (question.structuredPrompt.semanticFactId) factIds.add(question.structuredPrompt.semanticFactId);
      if (question.metadata.factCategory) categories.add(String(question.metadata.factCategory));
      topologies.add(question.structuredPrompt.topology);
      answerPositions[locale]![question.correctIndex] += 1;
      generated += 1;
    }
  }
}

assert.equal(factIds.size, 15, `Expected all 15 CP-008 facts, found ${[...factIds].join(",")}`);
assert.deepEqual([...categories].sort(), ["ATTRIBUTE", "CATEGORY", "FUNCTION", "ROLE"]);
assert.deepEqual([...topologies].sort(), ["CYCLE", "OPEN_CHAIN"]);
for (const locale of locales) assert.ok(answerPositions[locale]!.every((count) => count > 0));
assert.equal(generated, qlIds.length * seedsPerQl * locales.length);
assert.doesNotThrow(() => generateCod001Question("COD-QL-175", "hi-IN", 1));
assert.doesNotThrow(() => generateCod001Question("COD-QL-198", "pa-IN", 1));

console.log(JSON.stringify({
  status: "COD-CP-008 HINDI/PUNJABI LANGUAGE-ADAPTED RUNTIME PASSED",
  qlRange: "COD-QL-173..174",
  locales,
  seedsPerQl,
  generatedQuestions: generated,
  semanticFactsReached: factIds.size,
  categories: [...categories].sort(),
  topologies: [...topologies].sort(),
  answerPositions,
  remainingMultilingualGap: 0,
  questionStudioVisible: false,
  publiclyPublishable: false,
}, null, 2));
