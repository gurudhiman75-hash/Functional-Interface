import { strict as assert } from "node:assert";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let reviewedPackages = 0;
let hindiPackages = 0;
let punjabiPackages = 0;

for (const entry of TMW_CP004_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `tmw-cp004-localization:${entry.qlId}:${index}`;
    for (const language of languages) {
      const row = `${entry.qlId}:${language}:${index}`;
      const question = runTmw001ChapterPipeline({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      const learnerText = [
        question.stem,
        question.explanation.opening,
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n");

      assert.equal(question.validation.valid, true, `${row}:${question.validation.errors.join(" | ")}`);
      assert.equal(question.editorialStatus, "PENDING", `${row}: editorial lifecycle changed`);
      assert.equal(question.publiclyPublishable, false, `${row}: publication lock changed`);
      assert.equal(question.options.length, 4, `${row}: option count`);
      assert.equal(new Set(question.options).size, 4, `${row}: duplicate options`);
      assert.equal(question.options[question.correctIndex], question.solution.answerText, `${row}: answer/index mismatch`);
      assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true, `${row}: trap is not linked to an option`);
      assert.equal(
        /भागीदारी (?:शुरू|समाप्त)|ਭਾਗੀਦਾਰੀ (?:ਸ਼ੁਰੂ|ਖਤਮ)/.test(learnerText),
        false,
        `${row}: bureaucratic participation wording\n${learnerText}`,
      );
      assert.equal(
        /सक्रिय सदस्य|ठीक शेष काम|ਸਰਗਰਮ ਮੈਂਬਰ|ਸਹੀ ਬਾਕੀ ਕੰਮ/.test(learnerText),
        false,
        `${row}: technical stage wording\n${learnerText}`,
      );
      assert.equal(
        /बदली हुई चरणबद्ध स्थिति|संदर्भ स्थिति|ਬਦਲੀ ਹੋਈ ਪੜਾਅਵਾਰ ਸਥਿਤੀ|ਹਵਾਲਾ ਸਥਿਤੀ/.test(learnerText),
        false,
        `${row}: technical comparison wording\n${learnerText}`,
      );

      if (entry.qlId === "TMW-QL-059") {
        assert.equal(/कार्य-दल बदल|ਟੀਮ ਬਦਲ/.test(question.stem), false, `${row}: awkward team-change stem`);
        assert.match(question.explanation.opening, language === "hi" ? /दिए समय में दोनों की संयुक्त दर/ : /ਦਿੱਤੇ ਸਮੇਂ ਵਿੱਚ ਦੋਵਾਂ ਦੀ ਸਾਂਝੀ ਦਰ/, row);
      }
      if (["TMW-QL-061", "TMW-QL-064", "TMW-QL-067", "TMW-QL-069", "TMW-QL-080"].includes(entry.qlId)) {
        assert.match(question.stem, language === "hi" ? /काम से हटा/ : /ਕੰਮ ਤੋਂ ਹਟਾ/, row);
      }
      if (["TMW-QL-062", "TMW-QL-063", "TMW-QL-065", "TMW-QL-066", "TMW-QL-081"].includes(entry.qlId)) {
        assert.match(question.stem, language === "hi" ? /काम में लगा|काम में लगाया/ : /ਕੰਮ ਵਿੱਚ ਲਾ|ਕੰਮ ਵਿੱਚ ਲਾਇਆ/, row);
      }
      if (entry.qlId === "TMW-QL-066") {
        assert.match(question.explanation.opening, language === "hi" ? /जुड़ने का समय x/ : /ਜੁੜਨ ਦਾ ਸਮਾਂ x/, row);
        assert.match(question.explanation.conclusion, language === "hi" ? /काम में लगाया गया/ : /ਕੰਮ ਵਿੱਚ ਲਾਇਆ ਗਿਆ/, row);
      }
      if (entry.qlId === "TMW-QL-067") {
        assert.match(question.explanation.opening, language === "hi" ? /हटाने का समय x/ : /ਹਟਾਉਣ ਦਾ ਸਮਾਂ x/, row);
        assert.match(question.explanation.conclusion, language === "hi" ? /काम से हटाया गया/ : /ਕੰਮ ਤੋਂ ਹਟਾਇਆ ਗਿਆ/, row);
      }
      if (entry.qlId === "TMW-QL-068") {
        assert.match(question.explanation.opening, language === "hi" ? /पहले चरण की अवधि x/ : /ਪਹਿਲੇ ਪੜਾਅ ਦੀ ਮਿਆਦ x/, row);
      }
      if (entry.qlId === "TMW-QL-069") {
        assert.match(question.explanation.opening, language === "hi" ? /अंतिम चरण का समय/ : /ਆਖ਼ਰੀ ਪੜਾਅ ਦਾ ਸਮਾਂ/, row);
      }
      if (entry.qlId === "TMW-QL-075") {
        assert.match(question.explanation.opening, language === "hi" ? /बिगाड़ की दर.*शुद्ध दर/ : /ਖਰਾਬੀ ਦੀ ਦਰ.*ਸ਼ੁੱਧ ਦਰ/, row);
        assert.match(question.explanation.shortcut.title, language === "hi" ? /काम की दर − बिगाड़ की दर/ : /ਕੰਮ ਦੀ ਦਰ − ਖਰਾਬੀ ਦੀ ਦਰ/, row);
      }
      if (entry.qlId === "TMW-QL-076") {
        assert.match(question.explanation.opening, language === "hi" ? /लक्षित काम के भाग/ : /ਟੀਚੇ ਵਾਲੇ ਕੰਮ ਦੇ ਹਿੱਸੇ/, row);
      }
      if (entry.qlId === "TMW-QL-077") {
        assert.match(question.explanation.opening, language === "hi" ? /बचे हुए काम.*बाकी समय/ : /ਬਚੇ ਕੰਮ.*ਬਾਕੀ ਸਮੇਂ/, row);
      }
      if (["TMW-QL-078", "TMW-QL-079"].includes(entry.qlId)) {
        assert.match(question.explanation.opening, language === "hi" ? /आवश्यक कुल कर्मचारी/ : /ਲੋੜੀਂਦੇ ਕੁੱਲ ਕਰਮਚਾਰੀ/, row);
      }
      if (["TMW-QL-080", "TMW-QL-081"].includes(entry.qlId)) {
        assert.match(question.explanation.opening, language === "hi" ? /वास्तविक स्थिति|अंतर/ : /ਅਸਲ ਸਥਿਤੀ|ਅੰਤਰ/, row);
      }

      reviewedPackages += 1;
      if (language === "hi") hindiPackages += 1;
      else punjabiPackages += 1;
    }
  }
}

assert.equal(TMW_CP004_REGISTRY.length, 24);
assert.equal(reviewedPackages, 576);
assert.equal(hindiPackages, 288);
assert.equal(punjabiPackages, 288);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-004",
  qlRange: "TMW-QL-058..TMW-QL-081",
  qls: TMW_CP004_REGISTRY.length,
  seedsPerQl: 12,
  reviewedPackages,
  hindiPackages,
  punjabiPackages,
  remediatedQls: TMW_CP004_REGISTRY.length,
  remediatedPackages: reviewedPackages,
  openAutomatedFindings: 0,
  reviewVerdict: "ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
  status: "PASS",
}, null, 2));
