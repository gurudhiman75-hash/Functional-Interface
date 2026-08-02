import { strict as assert } from "node:assert";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const remediatedQlIds = new Set([
  "TMW-QL-037",
  "TMW-QL-038",
  "TMW-QL-039",
  "TMW-QL-040",
  "TMW-QL-044",
  "TMW-QL-045",
  "TMW-QL-046",
  "TMW-QL-047",
  "TMW-QL-048",
  "TMW-QL-049",
  "TMW-QL-052",
  "TMW-QL-053",
  "TMW-QL-055",
  "TMW-QL-056",
  "TMW-QL-057",
]);

let reviewedPackages = 0;
let hindiPackages = 0;
let punjabiPackages = 0;
let remediatedPackages = 0;

for (const entry of TMW_CP003_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `tmw-cp003-localization:${entry.qlId}:${index}`;
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

      if (entry.qlId === "TMW-QL-037") {
        assert.match(
          question.explanation.shortcut.steps.join(" "),
          language === "hi"
            ? /पहले सदस्य की कार्यक्षमता दूसरे से .* अधिक है/
            : /ਪਹਿਲੇ ਮੈਂਬਰ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦੂਜੇ ਨਾਲੋਂ .* ਵੱਧ ਹੈ/,
        );
      }
      if (entry.qlId === "TMW-QL-038") {
        assert.match(
          question.explanation.shortcut.steps.join(" "),
          language === "hi"
            ? /पहले सदस्य की कार्यक्षमता दूसरे से .* कम है/
            : /ਪਹਿਲੇ ਮੈਂਬਰ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦੂਜੇ ਨਾਲੋਂ .* ਘੱਟ ਹੈ/,
        );
      }
      if (entry.qlId === "TMW-QL-039") {
        assert.match(
          question.explanation.shortcut.steps.join(" "),
          language === "hi"
            ? /अधिक कार्यक्षम सदस्य.*कम कार्यक्षम सदस्य/
            : /ਵੱਧ ਕਾਰਗੁਜ਼ਾਰ ਮੈਂਬਰ.*ਘੱਟ ਕਾਰਗੁਜ਼ਾਰ ਮੈਂਬਰ/,
        );
      }
      if (entry.qlId === "TMW-QL-040") {
        assert.match(
          question.explanation.commonTrap.explanation,
          language === "hi"
            ? /गुणा करने के बजाय भाग दिया गया/
            : /ਗੁਣਾ ਕਰਨ ਦੀ ਥਾਂ ਭਾਗ ਦਿੱਤਾ ਗਿਆ/,
        );
        assert.equal(
          /सीधे गुणा करने|ਸਿੱਧਾ ਗੁਣਾ ਕਰਨ/.test(
            question.explanation.commonTrap.explanation,
          ),
          false,
        );
      }
      if (entry.qlId === "TMW-QL-044") {
        if (question.parameters.context.agentNoun === "machine") {
          assert.match(
            question.stem,
            language === "hi" ? /काम करती हैं/ : /ਕੰਮ ਕਰਦੀਆਂ ਹਨ/,
          );
        }
        if (language === "pa" && question.parameters.context.agentNoun === "crew") {
          assert.match(question.stem, /ਕੰਮ ਕਰਦੀਆਂ ਹਨ/);
        }
      }
      if (entry.qlId === "TMW-QL-045") {
        assert.match(
          question.explanation.commonTrap.explanation,
          language === "hi"
            ? /काम के अनुपात को ही समय का अनुपात/
            : /ਕੰਮ ਦੇ ਅਨੁਪਾਤ ਨੂੰ ਹੀ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ/,
        );
      }
      if (entry.qlId === "TMW-QL-046") {
        assert.match(
          question.stem,
          language === "hi"
            ? /इकाइयों का काम किया/
            : /ਇਕਾਈਆਂ ਦਾ ਕੰਮ ਕੀਤਾ/,
        );
        assert.match(
          question.explanation.commonTrap.explanation,
          language === "hi"
            ? /अलग-अलग समय से प्रति-दिन कार्यक्षमता/
            : /ਵੱਖਰੇ ਸਮਿਆਂ ਤੋਂ ਪ੍ਰਤੀ ਦਿਨ ਕਾਰਗੁਜ਼ਾਰੀ/,
        );
      }
      if (["TMW-QL-047", "TMW-QL-048", "TMW-QL-052", "TMW-QL-053"].includes(entry.qlId)) {
        assert.equal(
          /के बराबर|ਦੇ ਬਰਾਬਰ/.test(question.stem),
          false,
          `${entry.qlId}:${language}: literal output comparison remains: ${question.stem}`,
        );
      }
      if (["TMW-QL-052", "TMW-QL-053"].includes(entry.qlId)) {
        assert.match(
          question.stem,
          language === "hi" ? /उत्पादन .* रहा/ : /ਉਤਪਾਦਨ .* ਰਿਹਾ/,
        );
      }
      if (entry.qlId === "TMW-QL-049") {
        assert.equal(/पाएँ|ਪਾਓ/.test(question.explanation.shortcut.steps.join(" ")), false);
        assert.match(
          question.explanation.shortcut.steps.join(" "),
          language === "hi" ? /समय .* मिलता है/ : /ਸਮਾਂ .* ਮਿਲਦਾ ਹੈ/,
        );
      }
      if (entry.qlId === "TMW-QL-055") {
        assert.equal(/पद|ਪਦ/.test(learnerText), false);
        assert.match(
          question.explanation.opening,
          language === "hi"
            ? /बीच वाले सदस्य की संख्या/
            : /ਵਿਚਕਾਰਲੇ ਮੈਂਬਰ ਵਾਲੀ ਸੰਖਿਆ/,
        );
      }
      if (entry.qlId === "TMW-QL-056") {
        assert.match(
          question.explanation.shortcut.steps.join(" "),
          language === "hi" ? /प्रतिशत में बदलें/ : /ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ/,
        );
      }
      if (entry.qlId === "TMW-QL-057") {
        assert.match(
          question.explanation.commonTrap.explanation,
          language === "hi"
            ? /समय की प्रतिशत कमी.*कार्यक्षमता की प्रतिशत वृद्धि/
            : /ਸਮੇਂ ਦੀ ਪ੍ਰਤੀਸ਼ਤ ਘਾਟ.*ਕਾਰਗੁਜ਼ਾਰੀ ਦੀ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ/,
        );
        assert.equal(
          /गलत समय को आधार|ਗਲਤ ਸਮੇਂ ਨੂੰ ਆਧਾਰ/.test(
            question.explanation.commonTrap.explanation,
          ),
          false,
        );
      }

      if (remediatedQlIds.has(entry.qlId)) remediatedPackages += 1;
      reviewedPackages += 1;
      if (language === "hi") hindiPackages += 1;
      else punjabiPackages += 1;
    }
  }
}

assert.equal(TMW_CP003_REGISTRY.length, 23);
assert.equal(reviewedPackages, 552);
assert.equal(hindiPackages, 276);
assert.equal(punjabiPackages, 276);
assert.equal(remediatedQlIds.size, 15);
assert.equal(remediatedPackages, 360);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-003",
  qlRange: "TMW-QL-035..TMW-QL-057",
  qls: TMW_CP003_REGISTRY.length,
  seedsPerQl: 12,
  reviewedPackages,
  hindiPackages,
  punjabiPackages,
  remediatedQls: remediatedQlIds.size,
  remediatedPackages,
  openAutomatedFindings: 0,
  reviewVerdict: "ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
  status: "PASS",
}, null, 2));
