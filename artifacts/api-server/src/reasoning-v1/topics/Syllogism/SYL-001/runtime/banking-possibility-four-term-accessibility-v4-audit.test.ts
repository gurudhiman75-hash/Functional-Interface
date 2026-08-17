import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import { generateBankingPossibilityReviewQuestionV4 } from "./banking-possibility-review-question-v4";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let checked = 0;

for (let seed = 0; seed < 80; seed += 1) {
  for (const locale of locales) {
    const question = generateBankingPossibilityReviewQuestionV4(seed, locale);
    if (question.scenarioId !== "SYL-SC-CORE-009") continue;
    checked += 1;

    const scenario = scenariosForGroup("CORE").find((entry) => entry.scenarioId === question.scenarioId);
    assert.ok(scenario);
    const analysis = analyzeScenario(scenario);
    const assignment = assignTerms("SYL-QL-005", seed, analysis.termOrder);
    const no = analysis.premises.find((premise) => premise.form === "NO");
    const some = analysis.premises.find((premise) => premise.form === "SOME");
    const all = analysis.premises.find((premise) => premise.form === "ALL");
    assert.ok(no && some && all);

    const c = some.subject;
    const a = some.predicate;
    const d = all.predicate;
    const b = no.subject === a ? no.predicate : no.subject;
    const labels = [a, b, c, d].map((term) => assignment[term].labels[locale]);

    for (const label of labels) {
      assert.ok(
        question.diagram.accessibleDescription.includes(label),
        `${seed}/${locale}: accessibility description must name ${label}`,
      );
    }
    assert.ok(question.diagram.svg.includes("<desc"));
    assert.doesNotMatch(
      question.diagram.accessibleDescription,
      /\bA and B\b|\bC lies inside D\b|A और B|C वाला वर्ग D|A ਅਤੇ B|C ਵਾਲਾ ਵਰਗ D/u,
      `${seed}/${locale}: abstract A/B/C/D accessibility copy must not return`,
    );
  }
}

assert.equal(checked, 12);
console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_FOUR_TERM_ACCESSIBILITY_V4",
  checked,
  locales,
  localizedClassNamesRequired: true,
}, null, 2));
