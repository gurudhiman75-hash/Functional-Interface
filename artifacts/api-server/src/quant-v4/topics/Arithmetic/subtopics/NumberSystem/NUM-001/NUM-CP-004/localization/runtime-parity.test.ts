import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP004_PERMANENT_QL_IDS } from "../permanent/allocation";
import { runNumCp004EditorialV2ReviewFinal } from "../permanent/editorial-v2-review-final";
import { runNumCp004LocalizedReviewFinalForQl } from "./runtime-review-human-final";
import type { NumCp004TranslatedLanguage } from "./types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function json(value: unknown, space?: number): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, space);
}

const LANGUAGES = ["hi", "pa"] as const satisfies readonly NumCp004TranslatedLanguage[];
const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const ENGLISH_PROSE = /\b(?:Which|What|How|Given|Statement|Rule|prime|composite|factorisation|factor|correct|number|between|inclusive|divides|possible|sufficient|Therefore|Checking|There are|The required|The smallest|The greatest)\b/iu;
const HINDI_REJECTED = /(?:डेटा-पर्याप्तता|माता नोड)/u;
const PUNJABI_REJECTED = /(?:ਡਾਟਾ-ਪਰਯਾਪਤਾ|ਮਾਪੇ ਨੋਡ|ਪਰਯਾਪਤਾ)/u;

function learnerText(q: ReturnType<typeof runNumCp004LocalizedReviewFinalForQl>): string {
  return [
    q.stem,
    ...q.options.map((option) => option.value),
    q.explanation.concept,
    ...q.explanation.solution,
    q.explanation.finalAnswer,
  ].join("\n");
}

function balancedMath(text: string): boolean {
  return (text.match(/\\\(/gu)?.length ?? 0) === (text.match(/\\\)/gu)?.length ?? 0);
}

let audited = 0;
let replayChecks = 0;
let parityChecks = 0;
let linguisticChecks = 0;
let teachingChecks = 0;
const reviewRows: Array<ReturnType<typeof runNumCp004LocalizedReviewFinalForQl>> = [];

for (const qlId of NUM_CP004_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= 80; seed += 1) {
    const canonical = runNumCp004EditorialV2ReviewFinal({ questionLanguageId: qlId, seed, language: "en" });

    for (const language of LANGUAGES) {
      const q = runNumCp004LocalizedReviewFinalForQl(qlId, seed, language);
      const replay = runNumCp004LocalizedReviewFinalForQl(qlId, seed, language);
      const label = `${qlId}/${seed}/${language}`;
      audited += 1;

      assert(json(q) === json(replay), `${label}: nondeterministic localized replay`);
      replayChecks += 1;

      assert(q.permanentQlId === canonical.permanentQlId, `${label}: permanent QL changed`);
      assert(q.questionLanguageId === canonical.questionLanguageId, `${label}: QL routing changed`);
      assert(q.questionId === canonical.questionId, `${label}: question ID changed`);
      assert(q.seed === canonical.seed, `${label}: seed changed`);
      assert(q.difficulty === canonical.difficulty, `${label}: difficulty changed`);
      assert(q.answerSemantic === canonical.answerSemantic, `${label}: answer semantic changed`);
      assert(q.mathematicalFingerprint === canonical.mathematicalFingerprint, `${label}: mathematical fingerprint changed`);
      assert(json(q.hiddenState) === json(canonical.hiddenState), `${label}: hidden mathematical state changed`);
      assert(q.correctIndex === canonical.correctIndex, `${label}: correct index changed`);
      assert(q.options.length === canonical.options.length, `${label}: option count changed`);
      q.options.forEach((option, index) => {
        const sourceOption = canonical.options[index]!;
        assert(option.isCorrect === sourceOption.isCorrect, `${label}: correctness flag changed at option ${index}`);
        assert(option.misconceptionId === sourceOption.misconceptionId, `${label}: misconception mapping changed at option ${index}`);
      });
      assert(q.options[q.correctIndex]?.value === q.answer, `${label}: localized answer/index mismatch`);
      assert(q.canonicalAnswer === q.answer, `${label}: localized canonical answer mismatch`);
      assert(q.localization.canonicalAnswer === canonical.answer, `${label}: English canonical-answer trace changed`);
      assert(q.localization.canonicalQuestionId === canonical.questionId, `${label}: canonical question trace changed`);
      assert(!q.lifecycle.active, `${label}: active lifecycle opened`);
      assert(!q.lifecycle.questionStudioDiscoverable, `${label}: Question Studio gate opened`);
      assert(!q.lifecycle.questionBankWritable, `${label}: Question Bank gate opened`);
      assert(!q.lifecycle.testEligible, `${label}: test gate opened`);
      assert(!q.lifecycle.publiclyPublishable, `${label}: public gate opened`);
      parityChecks += 1;

      const learner = learnerText(q);
      const script = language === "hi" ? DEVANAGARI : GURMUKHI;
      assert(script.test(q.stem), `${label}: stem lacks target script`);
      assert(script.test(q.explanation.concept), `${label}: concept lacks target script`);
      assert(q.explanation.solution.every((line) => script.test(line)), `${label}: solution line lacks target script`);
      assert(!ENGLISH_PROSE.test(learner), `${label}: English learner prose leaked`);
      assert(balancedMath(learner), `${label}: unbalanced MathJax`);
      assert(!/\$/u.test(learner), `${label}: dollar math delimiter leaked`);
      assert(!(language === "hi" ? HINDI_REJECTED : PUNJABI_REJECTED).test(learner), `${label}: rejected literal wording leaked`);
      linguisticChecks += 1;

      assert(q.explanation.solution.length === 3, `${label}: expected exactly three teaching lines`);
      assert(q.explanation.solution[0]!.startsWith(language === "hi" ? "नियम:" : "ਨਿਯਮ:"), `${label}: rule-first teaching missing`);
      assert(q.explanation.solution[1]!.length > 20, `${label}: evidence line too weak`);
      assert(q.explanation.solution[2]!.includes(q.answer), `${label}: conclusion does not contain localized answer`);
      teachingChecks += 1;

      if (seed <= 4) reviewRows.push(q);
    }
  }
}

assert(audited === 4480, `Unexpected audit count ${audited}`);
assert(reviewRows.length === 224, `Unexpected review count ${reviewRows.length}`);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/num-cp004-hi-pa-localization");
mkdirSync(outputDirectory, { recursive: true });
const reviewJson = resolve(outputDirectory, "num-cp004-hi-pa-review.json");
const reviewMarkdown = resolve(outputDirectory, "num-cp004-hi-pa-review.md");
const auditJson = resolve(outputDirectory, "num-cp004-hi-pa-audit.json");

writeFileSync(reviewJson, `${json(reviewRows, 2)}\n`, "utf8");
writeFileSync(reviewMarkdown, [
  "# NUM-CP-004 Hindi/Punjabi Rule-First Review",
  "",
  "Localized learner surface derived from the merged CP004 English Editorial V2 authority. Mathematical state and all delivery gates remain frozen.",
  "",
  ...reviewRows.flatMap((q, index) => [
    `## ${index + 1}. ${q.permanentQlId} · ${q.language} · ${q.difficulty}`,
    "",
    q.stem.replace(/\n/gu, "  \n"),
    "",
    ...q.options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option.value}${i === q.correctIndex ? " **[Correct]**" : ""}`),
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
  status: "PASS_NUM_CP004_HI_PA_RULE_FIRST_V2_AUDIT",
  qlCount: NUM_CP004_PERMANENT_QL_IDS.length,
  audited,
  replayChecks,
  mathematicalParityChecks: parityChecks,
  linguisticChecks,
  teachingChecks,
  reviewQuestions: reviewRows.length,
  reviewQuestionsPerQlPerLanguage: 4,
  languages: LANGUAGES,
  ruleFirstTeachingViolations: 0,
  englishProseLeaks: 0,
  rejectedLiteralWordingLeaks: 0,
  mathDelimiterViolations: 0,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
};
writeFileSync(auditJson, `${json(audit, 2)}\n`, "utf8");
console.log(json({ ...audit, reviewJson, reviewMarkdown, auditJson }, 2));