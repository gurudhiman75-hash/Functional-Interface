import assert from "node:assert/strict";

import { generateCod001Question, type Cod001Locale } from "../multilingual-runtime";
import { formatCodExplanationMarkdown } from "./explanation-markdown";

interface QuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  checkpointId: string;
  locale: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  [key: string]: unknown;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function optionValue(option: unknown): string {
  if (typeof option === "string" || typeof option === "number") return String(option);
  const record = asRecord(option);
  const direct = record.value ?? record.answer ?? record.text ?? record.label;
  if (typeof direct === "string" || typeof direct === "number") return String(direct);
  const members = record.members ?? record.tokens ?? record.words;
  return Array.isArray(members) ? members.map(String).join(", ") : String(direct ?? "");
}

function optionMembers(option: unknown): string[] {
  if (typeof option === "string" || typeof option === "number") return [String(option)];
  const record = asRecord(option);
  const members = record.members ?? record.tokens ?? record.words;
  if (Array.isArray(members)) return members.map(String);
  const value = optionValue(option);
  return value ? [value] : [];
}

function displayTokens(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (/\s/u.test(trimmed)) return trimmed.split(/\s+/u).filter(Boolean);
  if (trimmed.includes("-")) return trimmed.split("-").filter(Boolean);
  return [...trimmed];
}

function qlId(number: number): string {
  return `COD-QL-${String(number).padStart(3, "0")}`;
}

function headings(locale: Cod001Locale): readonly string[] {
  if (locale === "hi-IN") return ["📌 मुख्य नियम", "📝 चरण-दर-चरण समाधान", "⚡ परीक्षा में तेज़ तरीका", "⚠️ सामान्य गलती का विश्लेषण"];
  if (locale === "pa-IN") return ["📌 ਮੁੱਖ ਨਿਯਮ", "📝 ਕਦਮ-ਦਰ-ਕਦਮ ਹੱਲ", "⚡ ਪੇਪਰ ਵਿੱਚ ਤੇਜ਼ ਤਰੀਕਾ", "⚠️ ਆਮ ਗਲਤੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ"];
  return ["📌 Core Rule", "📝 Step-by-Step Solution", "⚡ Exam Speed Shortcut", "⚠️ Common Trap Analysis"];
}

const qlIds = Array.from({ length: 199 }, (_, index) => qlId(index + 1));
const locales: readonly Cod001Locale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [17, 31] as const;
const shortcutSets: Record<Cod001Locale, Set<string>> = {
  "en-IN": new Set(),
  "hi-IN": new Set(),
  "pa-IN": new Set(),
};
const visualSets: Record<Cod001Locale, Set<string>> = {
  "en-IN": new Set(),
  "hi-IN": new Set(),
  "pa-IN": new Set(),
};
const checkpointCounts: Record<string, number> = {};
let generated = 0;

for (const id of qlIds) {
  for (const seed of seeds) {
    for (const locale of locales) {
      const question = generateCod001Question(id, locale, seed) as QuestionLike;
      const explanation = asRecord(question.explanation);
      const presentation = asRecord(explanation.pedagogicalPresentation);
      const steps = presentation.stepByStep as readonly unknown[];
      const visuals = presentation.visualAlignment as readonly unknown[];
      const correctOption = question.options[question.correctIndex];
      const answer = optionValue(correctOption);
      const answerMembers = optionMembers(correctOption);

      assert.equal(question.qlId ?? question.permanentQlId, id);
      assert.equal(question.locale, locale);
      assert.equal(presentation.schemaVersion, "cod-001-pedagogy-v1", `${id}/${locale}/${seed} lacks pedagogy schema`);
      assert.ok(String(presentation.coreRule ?? "").length >= 20, `${id}/${locale}/${seed} has a weak core rule`);
      assert.ok(Array.isArray(steps) && steps.length >= 1, `${id}/${locale}/${seed} lacks solution steps`);
      assert.ok(steps.every((step) => typeof step === "string" && step.length >= 8), `${id}/${locale}/${seed} has an empty solution step`);
      assert.ok(Array.isArray(visuals) && visuals.length >= 1, `${id}/${locale}/${seed} lacks visual working`);
      assert.ok(visuals.every((block) => typeof block === "string" && block.length >= 5), `${id}/${locale}/${seed} has an empty visual block`);
      assert.ok(String(presentation.examShortcut ?? "").length >= 20, `${id}/${locale}/${seed} lacks a specific shortcut`);
      assert.ok(String(presentation.commonTrap ?? "").length >= 12, `${id}/${locale}/${seed} lacks trap analysis`);
      assert.equal(explanation.quickMethod, presentation.examShortcut, `${id}/${locale}/${seed} still exposes the generic quick method`);
      assert.deepEqual(explanation.visualAlignment, presentation.visualAlignment);
      const presentationText = JSON.stringify(presentation);
      for (const member of answerMembers) {
        assert.ok(presentationText.includes(member), `${id}/${locale}/${seed} pedagogy omits answer member '${member}'`);
      }

      const markdown = formatCodExplanationMarkdown(question).join("\n");
      for (const heading of headings(locale)) assert.ok(markdown.includes(heading), `${id}/${locale}/${seed} misses '${heading}'`);
      assert.doesNotMatch(markdown, /\*\*Explanation:\*\*\s*\{|"(?:ruleStatement|quickMethod|sourceDemonstration|targetApplication)"\s*:/u);
      assert.ok(markdown.includes("```text") || markdown.includes("|---|---|"), `${id}/${locale}/${seed} lacks rendered visual alignment`);

      const shortcut = String(presentation.examShortcut);
      if (locale === "hi-IN") {
        assert.notEqual(shortcut, "पहले नियम पहचानें: हर मूल अक्षर को दी गई स्थिर मैपिंग के उसके कोड अक्षर से बदलें। फिर उसे लक्ष्य पर एक बार सही क्रम में लगाएँ।");
        assert.doesNotMatch(shortcut, /\b(?:ODD|EVEN|VOWEL|CONSONANT)\b/u);
      }
      if (locale === "pa-IN") {
        assert.notEqual(shortcut, "ਪਹਿਲਾਂ ਨਿਯਮ ਪਛਾਣੋ: ਹਰ ਮੂਲ ਅੱਖਰ ਨੂੰ ਦਿੱਤੀ ਪੱਕੀ ਮੈਪਿੰਗ ਵਾਲੇ ਕੋਡ ਅੱਖਰ ਨਾਲ ਬਦਲੋ। ਫਿਰ ਉਸ ਨੂੰ ਨਿਸ਼ਾਨੇ ਉੱਤੇ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਵਾਰ ਲਗਾਓ।");
        assert.doesNotMatch(shortcut, /\b(?:ODD|EVEN|VOWEL|CONSONANT)\b/u);
        assert.doesNotMatch(markdown, /(?:^|[\s।,:;!?])(?:ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ)(?=$|[\s।,:;!?])/u);
      }

      const prompt = asRecord(question.structuredPrompt);
      const evidence = Array.isArray(prompt.evidence) ? prompt.evidence.map(asRecord) : [];
      if (evidence.length > 0) {
        const source = String(evidence[0]!.source ?? evidence[0]!.word ?? "");
        const code = String(evidence[0]!.code ?? "");
        const visualText = JSON.stringify(visuals);
        for (const token of displayTokens(source)) assert.ok(visualText.includes(token), `${id}/${locale}/${seed} visual omits evidence source token '${token}'`);
        for (const token of displayTokens(code)) assert.ok(visualText.includes(token), `${id}/${locale}/${seed} visual omits evidence code token '${token}'`);
      }
      if (question.checkpointId === "COD-CP-009") assert.ok(JSON.stringify(visuals).includes("|---|---|"));
      if (question.checkpointId === "COD-CP-010") assert.ok(JSON.stringify(visuals).includes(answer));

      shortcutSets[locale].add(shortcut);
      visualSets[locale].add(JSON.stringify(visuals));
      checkpointCounts[`${question.checkpointId}:${locale}`] = (checkpointCounts[`${question.checkpointId}:${locale}`] ?? 0) + 1;
      generated += 1;
    }
  }
}

for (const locale of locales) {
  assert.ok(shortcutSets[locale].size >= 120, `${locale} shortcuts remain too repetitive: ${shortcutSets[locale].size}`);
  assert.ok(visualSets[locale].size >= 150, `${locale} visual solutions remain too repetitive: ${visualSets[locale].size}`);
}

assert.equal(generated, qlIds.length * seeds.length * locales.length);
assert.equal(Object.keys(checkpointCounts).length, 30);

console.log(JSON.stringify({
  status: "COD-001 PEDAGOGICAL REMEDIATION PASSED",
  qlRange: "COD-QL-001..199",
  locales,
  seeds,
  generatedQuestions: generated,
  explanationSchema: "cod-001-pedagogy-v1",
  rawJsonExplanationDump: false,
  shortcutVariants: Object.fromEntries(locales.map((locale) => [locale, shortcutSets[locale].size])),
  visualVariants: Object.fromEntries(locales.map((locale) => [locale, visualSets[locale].size])),
  checkpointCounts,
  questionStudioVisible: false,
  publiclyPublishable: false,
}, null, 2));
