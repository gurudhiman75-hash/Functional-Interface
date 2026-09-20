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

for (const generate of generators) {
  const en = generate("en");
  const hi = generate("hi");
  const pa = generate("pa");

  assert.equal(en.length, hi.length, "Hindi question count must match English");
  assert.equal(en.length, pa.length, "Punjabi question count must match English");

  questionCounts.en += en.length;
  questionCounts.hi += hi.length;
  questionCounts.pa += pa.length;

  for (let i = 0; i < en.length; i += 1) {
    const rows = { en: en[i], hi: hi[i], pa: pa[i] } as const;

    for (const locale of ["en", "hi", "pa"] as const) {
      const question = rows[locale];
      const stem = question.stem;
      const looksLikeStatementPrompt =
        locale === "en"
          ? stem.includes("statements:")
          : locale === "hi"
            ? stem.includes("कथनों") && stem.includes("विचार")
            : (stem.includes("ਕਥਨਾਂ") || stem.includes("ਬਿਆਨਾਂ")) && stem.includes("ਵਿਚਾਰ");

      if (looksLikeStatementPrompt) {
        statementCounts[locale] += 1;
        assert.ok(
          stem.startsWith(standard[locale]),
          `${question.questionId}: non-standard ${locale} statement opener: ${stem.split("\n")[0]}`,
        );
      }
    }

    if (en[i].stem.startsWith(standard.en)) {
      assert.ok(
        hi[i].stem.startsWith(standard.hi),
        `${hi[i].questionId}: English statement prompt did not preserve standardized Hindi opener`,
      );
      assert.ok(
        pa[i].stem.startsWith(standard.pa),
        `${pa[i].questionId}: English statement prompt did not preserve standardized Punjabi opener`,
      );
    }
  }
}

for (const locale of ["en", "hi", "pa"] as const) {
  assert.equal(questionCounts[locale], 1020, `${locale}: expected 1,020 ENV questions`);
}

assert.ok(statementCounts.en > 0, "Expected English statement questions");
assert.ok(statementCounts.hi >= statementCounts.en, "Hindi must cover all English statement questions");
assert.ok(statementCounts.pa >= statementCounts.en, "Punjabi must cover all English statement questions");

console.log(JSON.stringify({
  chapterId: "ENV-001",
  cps: "ENV-CP-001..ENV-CP-020",
  questionCounts,
  statementCounts,
  standard,
  status: "PASS",
}, null, 2));
