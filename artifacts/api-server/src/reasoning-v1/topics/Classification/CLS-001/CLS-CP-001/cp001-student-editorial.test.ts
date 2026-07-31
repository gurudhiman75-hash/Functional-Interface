import assert from "node:assert/strict";
import { CLS_CP001_PERMANENT_CONTRACTS } from "./cp001-permanent-contracts";
import { generateClsCp001Question } from "./cp001-multilingual-runtime";
import type { ClsCp001Locale } from "./localization/cp001-language-pack";

const LOCALES: readonly ClsCp001Locale[] = ["en-IN", "hi-IN", "pa-IN"];
const explanationFingerprints = new Set<string>();
let checked = 0;
let factuallyFlyingStatesChecked = 0;

for (const contract of CLS_CP001_PERMANENT_CONTRACTS) {
  for (const locale of LOCALES) {
    for (let seed = 0; seed < 120; seed += 1) {
      const question = generateClsCp001Question(contract.qlId, locale, seed);
      checked += 1;

      assert.equal(question.explanation.coreRule.length, 1);
      assert.ok(question.explanation.optionChecks.length >= 3);
      assert.ok(question.explanation.optionChecks.length <= 4);
      assert.equal(question.explanation.examSpeedShortcut.length, 1);
      assert.equal(question.explanation.commonTraps.length, 1);
      assert.equal(question.evidenceByOption.length, question.options.length);

      const coreText = question.explanation.coreRule.join(" ");
      const solutionText = question.explanation.optionChecks.join(" ");
      const shortcutText = question.explanation.examSpeedShortcut.join(" ");
      const trapText = question.explanation.commonTraps.join(" ");
      const learnerText = [
        question.stem,
        coreText,
        solutionText,
        shortcutText,
        trapText,
      ].join("\n");

      assert.ok(coreText.includes(question.intendedClassLabel));
      assert.ok(solutionText.includes(question.answer));
      assert.ok(shortcutText.length >= 25);
      assert.ok(trapText.length >= 25);
      assert.ok(!/\b(?:ontology|ontological|semantic demand|cross-cutting|multi-membership|candidate rule|quality rank|hierarchy depth)\b/i.test(learnerText));
      assert.ok(!/belongs to the group of/i.test(learnerText));
      assert.ok(!/check the options/i.test(learnerText));
      assert.ok(!/undefined|null|NaN|Infinity/.test(learnerText));

      if (question.task === "FIND_OUTLIER") {
        for (const [index, option] of question.options.entries()) {
          if (index === question.correctIndex) continue;
          assert.ok(solutionText.includes(option), `${contract.qlId}/${locale}/${seed} omitted common item ${option}`);
        }
      } else if (question.task === "SELECT_CLASS_MEMBER") {
        for (const given of question.givens) {
          assert.ok(solutionText.includes(given), `${contract.qlId}/${locale}/${seed} omitted given ${given}`);
        }
      } else {
        for (const member of question.optionGroups[question.correctIndex]!) {
          assert.ok(solutionText.includes(member), `${contract.qlId}/${locale}/${seed} omitted group member ${member}`);
        }
      }

      if (locale === "en-IN") {
        assert.ok(
          /^(?:Do not|Don't)/.test(trapText) || /\bbut\b/i.test(trapText),
          `English trap is not a direct warning: ${trapText}`,
        );
      } else if (locale === "hi-IN") {
        assert.ok(!/पहचाने गए साझा वर्ग/u.test(learnerText));
        assert.ok(!/\b(?:पद|सादृश्यता)\b/u.test(learnerText));
      } else {
        assert.ok(!/(?:^|\s)(?:ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ)(?:\s|$)/u.test(learnerText));
        assert.ok(!/[A-Za-z]{3,}/u.test(learnerText));
      }

      const factuallyFlying = new Set([
        "Eagle", "Sparrow", "Parrot", "Pigeon", "Peacock", "Crow", "Owl",
        "Duck", "Hen", "Bat", "Butterfly", "Bee", "Dragonfly",
      ]);
      if (locale === "en-IN" && question.task === "FIND_OUTLIER") {
        const flyingIndices = question.options
          .map((label, index) => factuallyFlying.has(label) ? index : -1)
          .filter((index) => index >= 0);
        if (flyingIndices.length === question.options.length - 1) {
          const hiddenOutlier = question.options.findIndex((_, index) => !flyingIndices.includes(index));
          assert.equal(
            hiddenOutlier,
            question.correctIndex,
            `${contract.qlId}/${seed} contains a hidden factual flying-animal answer`,
          );
          factuallyFlyingStatesChecked += 1;
        }
      }

      explanationFingerprints.add(JSON.stringify({
        qlId: question.qlId,
        locale,
        coreRule: question.explanation.coreRule,
        optionChecks: question.explanation.optionChecks,
        shortcut: question.explanation.examSpeedShortcut,
        traps: question.explanation.commonTraps,
      }));
    }
  }
}

assert.equal(checked, 1080);
assert.ok(
  explanationFingerprints.size > 1000,
  `Student explanations are too repetitive: ${explanationFingerprints.size}/${checked}`,
);

console.log("CLS-CP-001 simplified student explanation audit passed.", {
  checked,
  uniqueExplanationTraces: explanationFingerprints.size,
  factuallyFlyingStatesChecked,
});
