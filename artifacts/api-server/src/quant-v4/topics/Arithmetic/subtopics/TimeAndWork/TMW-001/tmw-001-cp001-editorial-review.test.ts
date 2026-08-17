import { strict as assert } from "node:assert";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const blocked: Record<TmwLocalizedLanguage, RegExp[]> = {
  hi: [
    /कार्य-दर प्रति दिन \d+ [^।]+ है/,
    /प्रति इकाई समय के उत्पादन/,
    /\d+ घंटे में कुल उत्पादन .+ है/,
    /माँगी गई तुलना के बजाय दूसरी पूरी मात्रा/,
  ],
  pa: [
    /ਕੰਮ ਦੀ ਦਰ ਪ੍ਰਤੀ ਦਿਨ \d+ [^।]+ ਹੈ/,
    /ਕੰਮ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ/,
    /ਪ੍ਰਤੀ ਇਕਾਈ ਸਮੇਂ ਦੇ ਉਤਪਾਦਨ/,
    /ਪਤਾ ਹਿੱਸੇ ਨੂੰ/,
    /ਅਧੂਰੇ ਕੰਮ ਦੇ ਸਮੇਂ ਨੂੰ/,
    /\d+ ਘੰਟੇ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ .+ ਹੈ/,
    /ਇੱਕੋ ਦਰ ਤੇ/,
    /ਆਮ ਤੌਰ ਤੇ/,
    /ਮੰਗੀ ਤੁਲਨਾ ਦੀ ਥਾਂ ਦੂਜੀ ਪੂਰੀ ਮਾਤਰਾ/,
  ],
};

const reviewedQlIds = new Set(TMW_CP001_REGISTRY.map((entry) => entry.qlId));
assert.equal(reviewedQlIds.size, 20);
assert.equal(TMW_CP001_REGISTRY[0]?.qlId, "TMW-QL-001");
assert.equal(TMW_CP001_REGISTRY.at(-1)?.qlId, "TMW-QL-020");

let reviewedPackages = 0;
let hindiPackages = 0;
let punjabiPackages = 0;
let parameterAwareTrapPackages = 0;

for (const entry of TMW_CP001_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `tmw-cp001-localization:${entry.qlId}:${index}`;
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

      const trap = question.explanation.commonTrap;
      if (trap.misconceptionId === "SECOND_QUANTITY_REPORTED") {
        const days = question.parameters.time.numerator / question.parameters.time.denominator;
        switch (entry.solveMode) {
          case "findWorkFromRateAndTime":
          case "findOutputFromUnitRateAndTime":
            assert.ok(trap.explanation.includes(String(days - 1)));
            assert.ok(trap.explanation.includes(String(days)));
            break;
          case "findFractionCompletedInGivenTime":
          case "findRemainingFractionAfterTime":
            assert.ok(trap.explanation.includes(String(days)));
            break;
          case "compareWorkCompletedAtEqualTime":
            assert.match(
              trap.explanation,
              language === "hi"
                ? /दूसरे व्यक्ति.*उत्पादन.*अंतर/
                : /ਦੂਜੇ ਵਿਅਕਤੀ.*ਉਤਪਾਦਨ.*ਫਰਕ/,
            );
            break;
          case "compareTimeForDifferentWorkAtSameRate":
            assert.match(
              trap.explanation,
              language === "hi"
                ? /कम काम.*समय.*अंतर/
                : /ਘੱਟ ਕੰਮ.*ਸਮਾਂ.*ਫਰਕ/,
            );
            break;
          default:
            assert.equal(
              /दूसरी पूरी मात्रा|ਦੂਜੀ ਪੂਰੀ ਮਾਤਰਾ/.test(trap.explanation),
              false,
            );
        }
        parameterAwareTrapPackages += 1;
      }

      if (entry.qlId === "TMW-QL-012") {
        assert.match(
          question.explanation.opening,
          language === "hi"
            ? /प्रतिदिन उत्पादन.*दिनों की संख्या/
            : /ਰੋਜ਼ਾਨਾ ਉਤਪਾਦਨ.*ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ/,
        );
      }
      if (entry.qlId === "TMW-QL-015") {
        assert.match(
          question.stem,
          language === "hi"
            ? /उत्पादन = .+। उसी दर से .+ उत्पादन कितना होगा\?/
            : /ਉਤਪਾਦਨ = .+। ਉਸੇ ਦਰ ਨਾਲ .+ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ\?/,
        );
      }

      reviewedPackages += 1;
      if (language === "hi") hindiPackages += 1;
      else punjabiPackages += 1;
    }
  }
}

assert.equal(reviewedPackages, 480);
assert.equal(hindiPackages, 240);
assert.equal(punjabiPackages, 240);
assert.ok(parameterAwareTrapPackages > 0);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-001",
  qlRange: "TMW-QL-001..TMW-QL-020",
  qls: TMW_CP001_REGISTRY.length,
  seedsPerQl: 12,
  reviewedPackages,
  hindiPackages,
  punjabiPackages,
  parameterAwareTrapPackages,
  openAutomatedFindings: 0,
  reviewVerdict: "ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
  status: "PASS",
}, null, 2));
