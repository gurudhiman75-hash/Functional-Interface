import assert from "node:assert/strict";
import {
  generateEnvCp001LocalizedReviewV1,
  generateEnvCp002LocalizedReviewV1,
  generateEnvCp003LocalizedReviewV1,
  generateEnvCp004LocalizedReviewV1,
  generateEnvCp005LocalizedReviewV1,
  generateEnvCp006LocalizedReviewV1,
  generateEnvCp007LocalizedReviewV1,
  generateEnvCp008LocalizedReviewV1,
  generateEnvCp009LocalizedReviewV1,
  generateEnvCp010LocalizedReviewV1,
  generateEnvCp011LocalizedReviewV1,
  generateEnvCp012LocalizedReviewV1,
  generateEnvCp013LocalizedReviewV1,
  generateEnvCp014LocalizedReviewV1,
  generateEnvCp015LocalizedReviewV1,
  generateEnvCp016LocalizedReviewV1,
  generateEnvCp017LocalizedReviewV1,
  generateEnvCp018LocalizedReviewV1,
  generateEnvCp019LocalizedReviewV1,
  generateEnvCp020LocalizedReviewV1,
  type EnvLocaleV1,
} from "./env-localization-generator-v1";

const generators = [
  generateEnvCp001LocalizedReviewV1,
  generateEnvCp002LocalizedReviewV1,
  generateEnvCp003LocalizedReviewV1,
  generateEnvCp004LocalizedReviewV1,
  generateEnvCp005LocalizedReviewV1,
  generateEnvCp006LocalizedReviewV1,
  generateEnvCp007LocalizedReviewV1,
  generateEnvCp008LocalizedReviewV1,
  generateEnvCp009LocalizedReviewV1,
  generateEnvCp010LocalizedReviewV1,
  generateEnvCp011LocalizedReviewV1,
  generateEnvCp012LocalizedReviewV1,
  generateEnvCp013LocalizedReviewV1,
  generateEnvCp014LocalizedReviewV1,
  generateEnvCp015LocalizedReviewV1,
  generateEnvCp016LocalizedReviewV1,
  generateEnvCp017LocalizedReviewV1,
  generateEnvCp018LocalizedReviewV1,
  generateEnvCp019LocalizedReviewV1,
  generateEnvCp020LocalizedReviewV1,
] as const;

const standard: Record<EnvLocaleV1, string> = {
  en: "Consider the following statements:",
  hi: "निम्नलिखित कथनों पर विचार कीजिए:",
  pa: "ਹੇਠ ਲਿਖੇ ਕਥਨਾਂ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ:",
};

assert.equal(generators.length, 20, "ENV statement-opener proof must cover CP001-CP020");

const questionCounts: Record<EnvLocaleV1, number> = { en: 0, hi: 0, pa: 0 };
const statementCounts: Record<EnvLocaleV1, number> = { en: 0, hi: 0, pa: 0 };

for (const locale of ["en", "hi", "pa"] as const) {
  for (const generate of generators) {
    const questions = generate(locale);
    questionCounts[locale] += questions.length;

    for (const question of questions) {
      const stem = question.stem;
      const isStatementStem =
        locale === "en"
          ? stem.includes("statements:")
          : locale === "hi"
            ? stem.includes("कथनों") && stem.includes("विचार")
            : (stem.includes("ਕਥਨਾਂ") || stem.includes("ਬਿਆਨਾਂ")) && stem.includes("ਵਿਚਾਰ");

      if (!isStatementStem) continue;
      statementCounts[locale] += 1;
      assert.ok(
        stem.startsWith(standard[locale]),
        `${question.questionId}: non-standard ${locale} statement opener: ${stem.split("\n")[0]}`,
      );
    }
  }

  assert.equal(questionCounts[locale], 1020, `${locale}: expected 1,020 ENV questions`);
}

assert.equal(statementCounts.hi, statementCounts.en, "Hindi statement-question count must match English");
assert.equal(statementCounts.pa, statementCounts.en, "Punjabi statement-question count must match English");

console.log(JSON.stringify({
  chapterId: "ENV-001",
  cps: "ENV-CP-001..ENV-CP-020",
  questionCounts,
  statementCounts,
  standard,
  status: "PASS",
}, null, 2));
