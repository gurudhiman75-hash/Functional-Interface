import "./runtime-parity.test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP003_PERMANENT_QL_IDS } from "../permanent/allocation";
import { runNumCp003EditorialV2FinalForQl } from "../permanent/editorial-v2-final";
import { runNumCp003LocalizedFinalV2ForQl } from "./runtime-final-v2";
import type { NumCp003TranslatedLanguage } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function json(value: unknown, space?: number): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, space);
}

const LANGUAGES = ["hi", "pa"] as const satisfies readonly NumCp003TranslatedLanguage[];
const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const ENGLISH_PROSE = /\b(?:This question|For a number|Here|Therefore|Checking|Statement|divisible|divisibility|solution|correct option|without a remainder|must be)\b/iu;
const HINDI_REJECTED = /(?:उसका \\?\([^)]*\\?\) और \\?\([^)]*\\?\), दोनों से विभाज्य होना जरूरी है|वैकल्पिक स्थानों के अंकों|डेटा-पर्याप्तता|बंद अंतराल)/u;
const PUNJABI_REJECTED = /(?:ਉਸਦਾ \\?\([^)]*\\?\) ਅਤੇ \\?\([^)]*\\?\), ਦੋਵਾਂ ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ ਜ਼ਰੂਰੀ ਹੈ|ਇੱਕ ਛੱਡ ਕੇ ਅੰਕਾਂ ਦੇ|ਡਾਟਾ-ਪਰਯਾਪਤਾ)/u;

function learnerText(q: ReturnType<typeof runNumCp003LocalizedFinalV2ForQl>): string {
  return [q.stem, ...q.options, q.explanation.concept, ...q.explanation.solution, q.explanation.finalAnswer].join("\n");
}

function balancedMath(text: string): boolean {
  return (text.match(/\\\(/gu)?.length ?? 0) === (text.match(/\\\)/gu)?.length ?? 0);
}

function ruleFirstRequired(kind: string): boolean {
  return [
    "DIRECT_DIVISIBILITY",
    "SINGLE_DIGIT_CANDIDATE_SET",
    "ORDERED_PAIR_CANDIDATE_SET",
    "IMPLICIT_REPEATED_NUMERAL",
    "LINKED_ARITHMETIC_DIVISIBILITY",
    "CLAIM_VALIDATION",
  ].includes(kind);
}

let audited = 0;
let replayChecks = 0;
let parityChecks = 0;
let linguisticChecks = 0;
let teachingChecks = 0;
const reviewRows: Array<ReturnType<typeof runNumCp003LocalizedFinalV2ForQl>> = [];

for (const qlId of NUM_CP003_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const seedText = `cp003-hi-pa:${seed}`;
    const canonical = runNumCp003EditorialV2FinalForQl(qlId, seedText);

    for (const language of LANGUAGES) {
      const q = runNumCp003LocalizedFinalV2ForQl(qlId, seedText, language);
      const replay = runNumCp003LocalizedFinalV2ForQl(qlId, seedText, language);
      const label = `${qlId}/${seed}/${language}`;
      audited += 1;

      assert(json(q) === json(replay), `${label}: nondeterministic final replay`);
      replayChecks += 1;

      assert(q.permanentQlId === canonical.permanentQlId, `${label}: QL changed`);
      assert(q.questionId === canonical.questionId, `${label}: question ID changed`);
      assert(q.seed === canonical.seed, `${label}: seed changed`);
      assert(q.difficulty === canonical.difficulty, `${label}: difficulty changed`);
      assert(q.answerSemantic === canonical.answerSemantic, `${label}: answer semantic changed`);
      assert(q.fingerprint === canonical.fingerprint, `${label}: fingerprint changed`);
      assert(json(q.hiddenState) === json(canonical.hiddenState), `${label}: hidden math changed`);
      assert(q.correctIndex === canonical.correctIndex, `${label}: correct index changed`);
      assert(q.options.length === canonical.options.length, `${label}: option count changed`);
      assert(q.options[q.correctIndex] === q.answer, `${label}: answer/index mismatch`);
      assert(q.localization.canonicalAnswer === canonical.answer, `${label}: canonical answer trace changed`);
      assert(!q.active && !q.questionStudioDiscoverable && !q.questionBankWritable && !q.testEligible && !q.publiclyPublishable, `${label}: lifecycle gate opened`);
      parityChecks += 1;

      const learner = learnerText(q);
      const script = language === "hi" ? DEVANAGARI : GURMUKHI;
      assert(script.test(q.stem), `${label}: stem lacks target script`);
      assert(script.test(q.explanation.concept), `${label}: concept lacks target script`);
      assert(q.explanation.solution.every((line) => script.test(line)), `${label}: solution line lacks target script`);
      assert(!ENGLISH_PROSE.test(learner), `${label}: English prose leaked`);
      assert(balancedMath(learner), `${label}: unbalanced MathJax`);
      assert(!/\$/.test(learner), `${label}: dollar math leaked`);
      assert(!(language === "hi" ? HINDI_REJECTED : PUNJABI_REJECTED).test(learner), `${label}: rejected literal wording leaked`);
      for (const line of q.explanation.solution) {
        const divisions = line.match(/\\div/gu)?.length ?? 0;
        if (divisions === 1) {
          assert(language === "hi" ? !/पूर्ण हैं/u.test(line) : !/ਪੂਰੇ ਹਨ/u.test(line), `${label}: singular division uses plural grammar`);
        }
        if (divisions > 1) {
          assert(language === "hi" ? !/पूर्ण हैं/u.test(line) : !/ਪੂਰੇ ਹਨ/u.test(line), `${label}: ambiguous multi-division grammar remains`);
        }
      }
      linguisticChecks += 1;

      assert(q.explanation.solution.length >= 2 && q.explanation.solution.length <= 4, `${label}: solution must have 2-4 lines`);
      if (ruleFirstRequired(q.hiddenState.kind)) {
        const marker = language === "hi" ? "पूर्णतः विभाज्य होने के लिए" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਹੋਣ ਲਈ";
        assert(q.explanation.solution.some((line) => line.includes(marker)), `${label}: rule-first teaching missing`);
      }
      teachingChecks += 1;

      if (seed <= 4) reviewRows.push(q);
    }
  }
}

assert(audited === 4080, `Unexpected audit count ${audited}`);
assert(reviewRows.length === 136, `Unexpected review count ${reviewRows.length}`);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/num-cp003-hi-pa-localization");
mkdirSync(outputDirectory, { recursive: true });
const reviewJson = resolve(outputDirectory, "num-cp003-hi-pa-review.json");
const reviewMarkdown = resolve(outputDirectory, "num-cp003-hi-pa-review.md");
const auditJson = resolve(outputDirectory, "num-cp003-hi-pa-audit.json");

writeFileSync(reviewJson, `${json(reviewRows, 2)}\n`, "utf8");
writeFileSync(reviewMarkdown, [
  "# NUM-CP-003 Hindi/Punjabi Final Rule-First Review",
  "",
  "Final learner-facing bilingual surface. English mathematics and all lifecycle gates remain frozen.",
  "",
  ...reviewRows.flatMap((q, index) => [
    `## ${index + 1}. ${q.permanentQlId} · ${q.language} · ${q.difficulty}`,
    "",
    q.stem.replace(/\n/gu, "  \n"),
    "",
    ...q.options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option}${i === q.correctIndex ? " **[Correct]**" : ""}`),
    "",
    `**Concept:** ${q.explanation.concept}`,
    "",
    "**Solution:**",
    ...q.explanation.solution.map((line) => `- ${line}`),
    "",
    `**Answer:** ${q.explanation.finalAnswer}`,
    "",
    "---",
    "",
  ]),
].join("\n"), "utf8");

const audit = {
  status: "PASS_NUM_CP003_HI_PA_FINAL_RULE_FIRST_V2_AUDIT",
  qlCount: 17,
  audited,
  replayChecks,
  mathematicalParityChecks: parityChecks,
  linguisticChecks,
  teachingChecks,
  reviewQuestions: reviewRows.length,
  languages: LANGUAGES,
  ruleFirstTeachingViolations: 0,
  rejectedLiteralWordingLeaks: 0,
  englishProseLeaks: 0,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
};
writeFileSync(auditJson, `${json(audit, 2)}\n`, "utf8");
console.log(json({ ...audit, reviewJson, reviewMarkdown, auditJson }, 2));
