import { strict as assert } from "node:assert";
import { TMW_CP002_REGISTRY } from "./foundation/cp002-registry";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];

const blocked: Record<TmwLocalizedLanguage, RegExp[]> = {
  hi: [
    /दोनों के काम करने और यह प्रक्रिया जारी रहने पर/,
    /वापस भेजने वाली प्रक्रिया अकेले पूरे काम के बराबर काम को कितने समय में वापस भेजेगी/,
    /सभी दैनिक उत्पादन दरें/,
  ],
  pa: [
    /ਪਤਾ ਮੈਂਬਰਾਂ/,
    /ਪਤਾ ਦਰ/,
    /ਸਾਹਮਣੀ ਜੋੜੀ-ਦਰ/,
    /ਦੋਵਾਂ ਦੇ ਕੰਮ ਕਰਨ ਅਤੇ ਇਹ ਪ੍ਰਕਿਰਿਆ ਜਾਰੀ ਰਹਿਣ ਉੱਤੇ/,
    /ਵਾਪਸ ਭੇਜਣ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਇਕੱਲੀ ਪੂਰੇ ਕੰਮ ਦੇ ਬਰਾਬਰ ਕੰਮ ਨੂੰ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਵਾਪਸ ਭੇਜੇਗੀ/,
    /ਸਾਰੀਆਂ ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ ਦਰਾਂ/,
  ],
};

let reviewedPackages = 0;
let hindiPackages = 0;
let punjabiPackages = 0;
let remediatedPackages = 0;

for (const entry of TMW_CP002_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `tmw-cp002-localization:${entry.qlId}:${index}`;
    for (const language of languages) {
      const question = runTmw001ChapterPipeline({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      const learnerText = [
        question.stem,
        question.explanation.opening,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n");

      assert.equal(
        question.validation.valid,
        true,
        `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`,
      );
      assert.equal(question.editorialStatus, "PENDING");
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.solution.answerText);
      assert.equal(
        question.options.includes(question.explanation.commonTrap.optionText),
        true,
      );

      for (const pattern of blocked[language]) {
        assert.equal(
          pattern.test(learnerText),
          false,
          `${entry.qlId}:${language}: blocked review finding ${pattern}: ${learnerText}`,
        );
      }

      if (entry.qlId === "TMW-QL-028") {
        assert.match(
          question.stem,
          language === "hi"
            ? /यदि केवल यही प्रक्रिया चले/
            : /ਜੇ ਸਿਰਫ਼ ਇਹੀ ਪ੍ਰਕਿਰਿਆ ਚੱਲੇ/,
        );
        remediatedPackages += 1;
      }
      if (entry.qlId === "TMW-QL-029") {
        assert.match(
          question.explanation.opening,
          language === "hi"
            ? /अज्ञात सदस्य की दर = शुद्ध दर \+ वापस जाने वाली दर − ज्ञात सदस्य की दर/
            : /ਅਣਜਾਣ ਮੈਂਬਰ ਦੀ ਦਰ = ਸ਼ੁੱਧ ਦਰ \+ ਵਾਪਸ ਜਾਣ ਵਾਲੀ ਦਰ − ਜਾਣੇ ਮੈਂਬਰ ਦੀ ਦਰ/,
        );
        assert.match(
          question.stem,
          language === "hi"
            ? /A और .+ B के साथ काम करने/
            : /A ਅਤੇ .+ B ਦੇ ਇਕੱਠੇ ਕੰਮ ਕਰਨ/,
        );
        remediatedPackages += 1;
      }
      if (entry.qlId === "TMW-QL-030") {
        const answer = question.solution.answerText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        assert.equal(
          new RegExp(`${answer} ${language === "hi" ? "है" : "ਹੈ"}।`).test(learnerText),
          false,
        );
        assert.match(
          learnerText,
          new RegExp(`${answer} ${language === "hi" ? "हैं" : "ਹਨ"}।`),
        );
        remediatedPackages += 1;
      }
      if (entry.qlId === "TMW-QL-032") {
        assert.match(
          question.explanation.shortcut.steps.join(" "),
          language === "hi"
            ? /सभी उत्पादन दरें जोड़कर/
            : /ਸਾਰੀਆਂ ਉਤਪਾਦਨ ਦਰਾਂ ਜੋੜ ਕੇ/,
        );
        remediatedPackages += 1;
      }
      if (
        language === "pa"
        && ["TMW-QL-023", "TMW-QL-025", "TMW-QL-026", "TMW-QL-033"].includes(entry.qlId)
      ) {
        remediatedPackages += 1;
      }

      reviewedPackages += 1;
      if (language === "hi") hindiPackages += 1;
      else punjabiPackages += 1;
    }
  }
}

assert.equal(TMW_CP002_REGISTRY.length, 14);
assert.equal(reviewedPackages, 336);
assert.equal(hindiPackages, 168);
assert.equal(punjabiPackages, 168);
assert.equal(remediatedPackages, 144);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-002",
  qlRange: "TMW-QL-021..TMW-QL-034",
  qls: TMW_CP002_REGISTRY.length,
  seedsPerQl: 12,
  reviewedPackages,
  hindiPackages,
  punjabiPackages,
  remediatedPackages,
  openAutomatedFindings: 0,
  reviewVerdict: "ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
  status: "PASS",
}, null, 2));
