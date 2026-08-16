import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP003_PERMANENT_QL_IDS } from "../permanent/allocation";
import { runNumCp003EditorialV2FinalForQl } from "../permanent/editorial-v2-final";
import { runNumCp003LocalizedForQl } from "./runtime";
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
const INTERNAL_LEAK = /NUM-(?:CP|QL)|PROT-|solveMode|authorityId|qlTemplateId|temporaryTemplateLabel/iu;

function learnerText(q: ReturnType<typeof runNumCp003LocalizedForQl>): string {
  return [q.stem, ...q.options, q.explanation.concept, ...q.explanation.solution, q.explanation.finalAnswer].join("\n");
}

function numbers(value: string): readonly string[] {
  return [...value.matchAll(/\d[\d,]*/gu)].map((match) => match[0]!.replaceAll(",", ""));
}

function inlineMathBalanced(text: string): boolean {
  return (text.match(/\\\(/gu)?.length ?? 0) === (text.match(/\\\)/gu)?.length ?? 0);
}

function isRuleFirst(q: ReturnType<typeof runNumCp003LocalizedForQl>): boolean {
  const kind = q.hiddenState.kind;
  if (!["DIRECT_DIVISIBILITY", "SINGLE_DIGIT_CANDIDATE_SET", "ORDERED_PAIR_CANDIDATE_SET", "IMPLICIT_REPEATED_NUMERAL", "LINKED_ARITHMETIC_DIVISIBILITY", "CLAIM_VALIDATION"].includes(kind)) return true;
  const marker = q.language === "hi" ? "पूर्णतः विभाज्य होने के लिए" : "ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਹੋਣ ਲਈ";
  return q.explanation.solution.some((line) => line.includes(marker));
}

let generated = 0;
let replayChecks = 0;
let mathematicalParityChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let scriptChecks = 0;
let englishLeakChecks = 0;
let teachingChecks = 0;
const reviewRows: Array<ReturnType<typeof runNumCp003LocalizedForQl>> = [];

for (const qlId of NUM_CP003_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const seedText = `cp003-hi-pa:${seed}`;
    const canonical = runNumCp003EditorialV2FinalForQl(qlId, seedText);

    for (const language of LANGUAGES) {
      const localized = runNumCp003LocalizedForQl(qlId, seedText, language);
      const replay = runNumCp003LocalizedForQl(qlId, seedText, language);
      const label = `${qlId}/${seed}/${language}`;
      generated += 1;

      assert(json(localized) === json(replay), `${label}: nondeterministic localized replay`);
      replayChecks += 1;

      assert(localized.permanentQlId === canonical.permanentQlId, `${label}: QL identity changed`);
      assert(localized.questionLanguageId === canonical.questionLanguageId, `${label}: question-language identity changed`);
      assert(localized.questionId === canonical.questionId, `${label}: canonical question ID changed`);
      assert(localized.seed === canonical.seed, `${label}: seed changed`);
      assert(localized.difficulty === canonical.difficulty, `${label}: difficulty changed`);
      assert(localized.answerSemantic === canonical.answerSemantic, `${label}: answer semantic changed`);
      assert(localized.fingerprint === canonical.fingerprint, `${label}: mathematical fingerprint changed`);
      assert(json(localized.hiddenState) === json(canonical.hiddenState), `${label}: hidden mathematical state changed`);
      assert(localized.localization.canonicalAnswer === canonical.answer, `${label}: canonical answer trace lost`);
      mathematicalParityChecks += 1;

      assert(localized.options.length === canonical.options.length, `${label}: option count changed`);
      assert(localized.correctIndex === canonical.correctIndex, `${label}: correct index changed`);
      assert(localized.options[localized.correctIndex] === localized.answer, `${label}: localized answer not at correct index`);
      assert(localized.explanation.finalAnswer === localized.answer, `${label}: localized final answer mismatch`);
      assert(new Set(localized.options).size === localized.options.length, `${label}: localized duplicate options`);
      for (let index = 0; index < canonical.options.length; index += 1) {
        assert(json(numbers(localized.options[index]!)) === json(numbers(canonical.options[index]!)), `${label}: numeric option semantics changed at ${index}`);
      }
      optionChecks += 1;

      assert(!localized.active, `${label}: active gate opened`);
      assert(!localized.questionStudioDiscoverable, `${label}: Question Studio gate opened`);
      assert(!localized.questionBankWritable, `${label}: Question Bank gate opened`);
      assert(!localized.testEligible, `${label}: scored-test gate opened`);
      assert(!localized.publiclyPublishable, `${label}: public gate opened`);
      assert(localized.questionBankStatus === "NOT_STORED", `${label}: Question Bank status changed`);
      assert(localized.testEligibility === "INELIGIBLE", `${label}: test eligibility changed`);
      lifecycleChecks += 1;

      const learner = learnerText(localized);
      const script = language === "hi" ? DEVANAGARI : GURMUKHI;
      assert(script.test(localized.stem), `${label}: stem lacks target script`);
      assert(script.test(localized.explanation.concept), `${label}: concept lacks target script`);
      assert(localized.explanation.solution.every((line) => script.test(line)), `${label}: a solution line lacks target script`);
      assert(inlineMathBalanced(learner), `${label}: unbalanced MathJax`);
      assert(!/\$/.test(learner), `${label}: dollar-delimited math leaked`);
      assert(!INTERNAL_LEAK.test(learner), `${label}: internal identity leaked`);
      scriptChecks += 1;

      assert(!ENGLISH_PROSE.test(learner), `${label}: English prose leaked`);
      englishLeakChecks += 1;

      assert(localized.explanation.solution.length >= 2 && localized.explanation.solution.length <= 4, `${label}: solution must contain 2-4 teaching lines`);
      assert(isRuleFirst(localized), `${label}: divisibility solution does not teach the rule before applying it`);
      teachingChecks += 1;

      if (seed <= 4) reviewRows.push(localized);
    }
  }
}

assert(generated === NUM_CP003_PERMANENT_QL_IDS.length * 120 * 2, `Unexpected generated count ${generated}`);
assert(reviewRows.length === NUM_CP003_PERMANENT_QL_IDS.length * 4 * 2, `Unexpected review count ${reviewRows.length}`);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/num-cp003-hi-pa-localization");
mkdirSync(outputDirectory, { recursive: true });
const reviewJson = resolve(outputDirectory, "num-cp003-hi-pa-review.json");
const reviewMarkdown = resolve(outputDirectory, "num-cp003-hi-pa-review.md");
const auditJson = resolve(outputDirectory, "num-cp003-hi-pa-audit.json");

writeFileSync(reviewJson, `${json(reviewRows, 2)}\n`, "utf8");
writeFileSync(reviewMarkdown, [
  "# NUM-CP-003 Hindi/Punjabi Rule-First Localization Review",
  "",
  "English mathematical authority: frozen NUM-CP-003 Editorial V2. Four deterministic review questions per QL and locale.",
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
  status: "PASS_NUM_CP003_HI_PA_RULE_FIRST_LOCALIZATION_REVIEW",
  qlCount: NUM_CP003_PERMANENT_QL_IDS.length,
  generated,
  replayChecks,
  mathematicalParityChecks,
  optionChecks,
  lifecycleChecks,
  scriptChecks,
  englishLeakChecks,
  teachingChecks,
  reviewPairs: reviewRows.length,
  languages: LANGUAGES,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
};
writeFileSync(auditJson, `${json(audit, 2)}\n`, "utf8");
console.log(json({ ...audit, reviewJson, reviewMarkdown, auditJson }, 2));
