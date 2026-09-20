import { describe, expect, it } from "vitest";
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

describe("Environment chapter-wide statement opener consistency", () => {
  it("keeps the approved opener in every locale across CP001-CP020", () => {
    expect(generators).toHaveLength(20);

    for (const locale of ["en", "hi", "pa"] as const) {
      for (const generate of generators) {
        for (const question of generate(locale)) {
          const stem = question.stem;
          const isStatementStem =
            locale === "en"
              ? stem.includes("statements:")
              : locale === "hi"
                ? stem.includes("कथनों") && stem.includes("विचार")
                : (stem.includes("ਕਥਨਾਂ") || stem.includes("ਬਿਆਨਾਂ")) && stem.includes("ਵਿਚਾਰ");

          if (isStatementStem) {
            expect(
              stem.startsWith(standard[locale]),
              `${question.questionId}: non-standard ${locale} statement opener`,
            ).toBe(true);
          }
        }
      }
    }
  });
});
